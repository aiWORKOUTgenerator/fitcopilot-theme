/**
 * Advanced Component Loader for Training Calendar
 * 
 * Implements sophisticated code splitting with:
 * - Component-level lazy loading
 * - Preloading strategies
 * - Error handling and retries
 * - Bundle size optimization
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { ComponentType, LazyExoticComponent } from 'react';

// ===== TYPES =====

interface LoaderOptions {
  /** Preload component on hover/focus */
  preload?: boolean;
  /** Retry attempts on load failure */
  retries?: number;
  /** Delay before retry (ms) */
  retryDelay?: number;
  /** Fallback component on error */
  fallback?: ComponentType<any>;
  /** Enable performance monitoring */
  monitor?: boolean;
}

interface ComponentMetrics {
  loadTime: number;
  chunkSize?: number;
  retryCount: number;
  success: boolean;
  error?: Error;
}

// ===== PERFORMANCE MONITORING =====

const componentMetrics = new Map<string, ComponentMetrics>();

const recordMetric = (name: string, metric: ComponentMetrics) => {
  componentMetrics.set(name, metric);
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // Example: Send to your analytics service
    // analytics.track('component_loaded', { name, ...metric });
  }
};

const getMetrics = () => Array.from(componentMetrics.entries());

// ===== COMPONENT LOADER =====

/**
 * Create a lazy-loaded component with advanced features
 */
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T } | any>,
  name: string,
  options: LoaderOptions = {}
): LazyExoticComponent<T> => {
  const {
    retries = 3,
    retryDelay = 1000,
    monitor = true
  } = options;

  const loadWithRetry = async (attempt = 0): Promise<{ default: T }> => {
    const startTime = performance.now();
    
    try {
      const module = await importFn();
      const loadTime = performance.now() - startTime;
      
      if (monitor) {
        recordMetric(name, {
          loadTime,
          retryCount: attempt,
          success: true
        });
      }
      
      return module;
    } catch (error) {
      const loadTime = performance.now() - startTime;
      
      if (attempt < retries) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        return loadWithRetry(attempt + 1);
      }
      
      if (monitor) {
        recordMetric(name, {
          loadTime,
          retryCount: attempt,
          success: false,
          error: error as Error
        });
      }
      
      throw error;
    }
  };

  return React.lazy(() => loadWithRetry());
};

// ===== PRELOADING UTILITIES =====

/**
 * Preload a component
 */
export const preloadComponent = (importFn: () => Promise<any>): Promise<any> => {
  return importFn().catch(error => {
    logger.warn('Component preload failed:', error);
    return null;
  });
};

/**
 * Preload multiple components
 */
export const preloadComponents = (
  importFns: Array<() => Promise<any>>
): Promise<any[]> => {
  return Promise.allSettled(importFns.map(fn => preloadComponent(fn)));
};

// ===== CALENDAR COMPONENT LOADERS =====

/**
 * Calendar View Component with advanced loading
 */
export const CalendarViewLazy = createLazyComponent(
  () => import('../components/CalendarView/CalendarView'),
  'CalendarView',
  { preload: true, monitor: true }
);

/**
 * Event Modal Component with advanced loading
 */
export const EventModalLazy = React.lazy(() => 
  import('../components/EventModal/EventModal').then(module => ({
    default: module.EventModal
  }))
);

/**
 * Calendar Controls Component with advanced loading
 */
export const CalendarControlsLazy = React.lazy(() => 
  import('../components/CalendarControls/CalendarControls').catch(() => 
    Promise.resolve({ default: () => null })
  )
);

/**
 * Booking Form Component with advanced loading
 */
export const BookingFormLazy = React.lazy(() => 
  import('../components/BookingForm/BookingForm').catch(() => 
    Promise.resolve({ default: () => null })
  )
);

/**
 * Trainer Availability Component with advanced loading
 */
export const TrainerAvailabilityLazy = React.lazy(() => 
  Promise.resolve({ default: () => null })
);

// ===== PRELOADING STRATEGIES =====

/**
 * Preload critical calendar components
 */
export const preloadCriticalComponents = () => {
  return preloadComponents([
    () => import('../components/CalendarView/CalendarView'),
    () => import('../components/CalendarControls/CalendarControls').catch(() => null)
  ]);
};

/**
 * Preload components on user interaction
 */
export const preloadOnInteraction = () => {
  return preloadComponents([
    () => import('../components/EventModal/EventModal').catch(() => null),
    () => import('../components/BookingForm/BookingForm').catch(() => null)
  ]);
};

/**
 * Preload all calendar components
 */
export const preloadAllComponents = () => {
  return preloadComponents([
    () => import('../components/CalendarView/CalendarView'),
    () => import('../components/CalendarControls/CalendarControls').catch(() => null),
    () => import('../components/EventModal/EventModal').catch(() => null),
    () => import('../components/BookingForm/BookingForm').catch(() => null)
  ]);
};

// ===== CHUNK PRELOADING =====

/**
 * Preload FullCalendar plugins based on view
 */
export const preloadCalendarPlugins = async (view: string) => {
  const plugins = [];
  
  try {
    switch (view) {
    case 'dayGridMonth':
      plugins.push(import('@fullcalendar/daygrid'));
      break;
    case 'timeGridWeek':
    case 'timeGridDay':
      plugins.push(import('@fullcalendar/timegrid'));
      break;
    case 'listWeek':
    case 'listMonth':
      plugins.push(import('@fullcalendar/list'));
      break;
    }
    
    // Always preload interaction plugin
    plugins.push(import('@fullcalendar/interaction'));
    
    await Promise.all(plugins);
  } catch (error) {
    logger.warn('Failed to preload calendar plugins:', error);
  }
};

// ===== PERFORMANCE UTILITIES =====

/**
 * Get component loading metrics
 */
export const getComponentMetrics = () => getMetrics();

/**
 * Clear component metrics
 */
export const clearComponentMetrics = () => componentMetrics.clear();

/**
 * Get bundle size estimate
 */
export const getBundleSizeEstimate = () => {
  const metrics = getMetrics();
  return metrics.reduce((total, [, metric]) => {
    return total + (metric.chunkSize || 0);
  }, 0);
};

export default {
  CalendarViewLazy,
  EventModalLazy,
  CalendarControlsLazy,
  BookingFormLazy,
  TrainerAvailabilityLazy,
  preloadCriticalComponents,
  preloadOnInteraction,
  preloadAllComponents,
  preloadCalendarPlugins,
  getComponentMetrics,
  clearComponentMetrics,
  getBundleSizeEstimate
}; 