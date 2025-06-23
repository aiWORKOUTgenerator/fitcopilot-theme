import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarEvent, CalendarFilters, TrainingCalendarSettings } from '../types';

/**
 * Debounce utility for performance optimization
 */
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Performance monitoring hook
 */
const usePerformanceMonitoring = () => {
  const performanceRef = useRef<{
    renderCount: number;
    lastRenderTime: number;
    averageRenderTime: number;
  }>({
    renderCount: 0,
    lastRenderTime: performance.now(),
    averageRenderTime: 0
  });

  const trackRender = useCallback(() => {
    const currentTime = performance.now();
    const renderTime = currentTime - performanceRef.current.lastRenderTime;
    
    performanceRef.current.renderCount++;
    performanceRef.current.averageRenderTime = 
      (performanceRef.current.averageRenderTime * (performanceRef.current.renderCount - 1) + renderTime) / 
      performanceRef.current.renderCount;
    performanceRef.current.lastRenderTime = currentTime;

    // Log performance warnings in development
    if (process.env.NODE_ENV === 'development' && renderTime > 100) {
      logger.warn(`🐌 Slow render detected: ${renderTime.toFixed(2)}ms (avg: ${performanceRef.current.averageRenderTime.toFixed(2)}ms)`);
    }
  }, []);

  return { trackRender, performanceStats: performanceRef.current };
};

/**
 * Virtual scrolling for large event datasets
 */
const useVirtualizedEvents = (
  events: CalendarEvent[],
  visibleDateRange: { start: Date; end: Date },
  viewType: string
) => {
  return useMemo(() => {
    // Only show events in visible date range plus buffer
    const bufferDays = viewType === 'dayGridMonth' ? 7 : 3;
    const bufferStart = new Date(visibleDateRange.start);
    bufferStart.setDate(bufferStart.getDate() - bufferDays);
    const bufferEnd = new Date(visibleDateRange.end);
    bufferEnd.setDate(bufferEnd.getDate() + bufferDays);

    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= bufferStart && eventDate <= bufferEnd;
    });
  }, [events, visibleDateRange, viewType]);
};

/**
 * Memoized event filtering with performance optimization
 */
const useOptimizedEventFiltering = (
  events: CalendarEvent[],
  filters: CalendarFilters,
  visibleDateRange: { start: Date; end: Date },
  viewType: string
) => {
  // Debounce filter changes to avoid excessive filtering
  const debouncedFilters = useDebounce(filters, 150);
  
  // Use virtualized events first
  const virtualizedEvents = useVirtualizedEvents(events, visibleDateRange, viewType);

  return useMemo(() => {
    let filtered = virtualizedEvents;

    // Apply trainer filter
    if (debouncedFilters.trainers.length > 0) {
      filtered = filtered.filter(event => 
        event.trainer && debouncedFilters.trainers.includes(event.trainer.id)
      );
    }

    // Apply event type filter
    if (debouncedFilters.eventTypes.length > 0) {
      filtered = filtered.filter(event => 
        debouncedFilters.eventTypes.includes(event.eventType)
      );
    }

    // Apply availability filter
    if (debouncedFilters.availableOnly) {
      filtered = filtered.filter(event => 
        event.status === 'available'
      );
    }

    return filtered;
  }, [virtualizedEvents, debouncedFilters]);
};

/**
 * Memoized calendar configuration
 */
const useOptimizedCalendarConfig = (
  settings: TrainingCalendarSettings,
  currentView: string,
  filteredEvents: CalendarEvent[]
) => {
  return useMemo(() => {
    const plugins = [];
    
    // Dynamic plugin loading based on view
    if (currentView.includes('dayGrid')) {
      plugins.push('dayGrid');
    }
    if (currentView.includes('timeGrid')) {
      plugins.push('timeGrid');
    }
    if (currentView.includes('list')) {
      plugins.push('list');
    }
    plugins.push('interaction'); // Always needed for interactions

    return {
      plugins,
      initialView: currentView,
      firstDay: settings.first_day_of_week,
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5, 6],
        startTime: '06:00',
        endTime: '21:00',
      },
      slotMinTime: '06:00:00',
      slotMaxTime: '22:00:00',
      slotDuration: '00:30:00',
      slotLabelInterval: '01:00:00',
      dayMaxEvents: currentView === 'dayGridMonth' ? 3 : true,
      moreLinkClick: 'popover',
      eventDisplay: 'block',
      displayEventTime: true,
      allDaySlot: false,
      nowIndicator: true,
      navLinks: true,
      selectable: true,
      selectMirror: true,
      weekends: true
    };
  }, [settings, currentView]);
};

/**
 * Optimized event handlers with proper memoization
 */
const useOptimizedEventHandlers = (
  onEventClick?: (event: CalendarEvent) => void,
  onDateClick?: (date: Date) => void,
  onViewChange?: (view: string) => void
) => {
  const handleEventClick = useCallback((info: any) => {
    if (onEventClick) {
      const event = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        ...info.event.extendedProps
      } as CalendarEvent;
      onEventClick(event);
    }
  }, [onEventClick]);

  const handleDateClick = useCallback((info: any) => {
    if (onDateClick) {
      onDateClick(new Date(info.dateStr));
    }
  }, [onDateClick]);

  const handleViewChange = useCallback((view: string) => {
    if (onViewChange) {
      onViewChange(view);
    }
  }, [onViewChange]);

  return {
    handleEventClick,
    handleDateClick,
    handleViewChange
  };
};

/**
 * Bundle size optimization utilities
 */
const useBundleOptimization = () => {
  const [bundleStats, setBundleStats] = useState<{
    loadTime: number;
    chunkCount: number;
    totalSize: number;
  }>({
    loadTime: 0,
    chunkCount: 0,
    totalSize: 0
  });

  useEffect(() => {
    // Monitor bundle loading performance
    const measureBundleLoad = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigationTiming = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
        
        setBundleStats(prev => ({
          ...prev,
          loadTime
        }));

        // Report to analytics if load time is concerning
        if (loadTime > 2000) { // 2 seconds
          logger.warn(`📦 Bundle load time exceeded target: ${loadTime}ms`);
        }
      }
    };

    measureBundleLoad();
  }, []);

  return bundleStats;
};

/**
 * Memory management for large datasets
 */
const useMemoryOptimization = (events: CalendarEvent[]) => {
  const [memoryUsage, setMemoryUsage] = useState<{
    eventsInMemory: number;
    estimatedMemoryMB: number;
  }>({
    eventsInMemory: 0,
    estimatedMemoryMB: 0
  });

  useEffect(() => {
    const eventsInMemory = events.length;
    // Rough estimation: each event ~1KB in memory
    const estimatedMemoryMB = (eventsInMemory * 1024) / (1024 * 1024);

    setMemoryUsage({
      eventsInMemory,
      estimatedMemoryMB
    });

    // Memory warning for large datasets
    if (eventsInMemory > 1000) {
      logger.warn(`🧠 Large dataset in memory: ${eventsInMemory} events (~${estimatedMemoryMB.toFixed(2)}MB)`);
    }
  }, [events.length]);

  const cleanupEvents = useCallback(() => {
    // Cleanup function for removing old events from memory
    // This would be called on component unmount or date range changes
    logger.info('🧹 Cleaning up event data from memory');
  }, []);

  return { memoryUsage, cleanupEvents };
};

/**
 * Main calendar optimization hook
 */
export const useCalendarOptimization = (
  events: CalendarEvent[],
  filters: CalendarFilters,
  settings: TrainingCalendarSettings,
  currentView: string,
  visibleDateRange: { start: Date; end: Date }
) => {
  const { trackRender, performanceStats } = usePerformanceMonitoring();
  const bundleStats = useBundleOptimization();
  const { memoryUsage, cleanupEvents } = useMemoryOptimization(events);

  // Optimized event filtering
  const filteredEvents = useOptimizedEventFiltering(
    events,
    filters,
    visibleDateRange,
    currentView
  );

  // Optimized calendar configuration
  const calendarConfig = useOptimizedCalendarConfig(
    settings,
    currentView,
    filteredEvents
  );

  // Optimized event handlers
  const eventHandlers = useOptimizedEventHandlers();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupEvents();
    };
  }, [cleanupEvents]);

  return {
    filteredEvents,
    calendarConfig,
    eventHandlers,
    performanceStats,
    bundleStats,
    memoryUsage,
    trackRender,
    optimizationMetrics: {
      renderCount: performanceStats.renderCount,
      averageRenderTime: performanceStats.averageRenderTime,
      eventsInMemory: memoryUsage.eventsInMemory,
      bundleLoadTime: bundleStats.loadTime
    }
  };
};

export default useCalendarOptimization; 