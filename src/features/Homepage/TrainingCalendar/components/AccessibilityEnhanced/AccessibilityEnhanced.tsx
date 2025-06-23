import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarEvent, IntegratedTrainer } from '../../types';
import './AccessibilityEnhanced.scss';

interface AccessibilityEnhancedProps {
  /**
   * Calendar events for accessibility announcements
   */
  events: CalendarEvent[];
  
  /**
   * Available trainers for context
   */
  trainers: IntegratedTrainer[];
  
  /**
   * Current calendar view for navigation context
   */
  currentView: string;
  
  /**
   * Selected date for announcements
   */
  selectedDate?: Date;
  
  /**
   * Current filter state for context
   */
  activeFilters: {
    trainers: string[];
    eventTypes: string[];
    availableOnly: boolean;
  };
  
  /**
   * Callback for keyboard navigation events
   */
  onKeyboardNavigate?: (direction: 'prev' | 'next' | 'today', view?: string) => void;
  
  /**
   * Callback for event selection via keyboard
   */
  onEventSelect?: (event: CalendarEvent) => void;
}

/**
 * Screen reader announcement hook
 */
const useScreenReaderAnnouncements = () => {
  const announcementRef = useRef<HTMLDivElement>(null);
  
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announcementRef, announce };
};

/**
 * Keyboard navigation hook for calendar accessibility
 */
const useKeyboardNavigation = (
  events: CalendarEvent[],
  onNavigate?: (direction: 'prev' | 'next' | 'today', view?: string) => void,
  onEventSelect?: (event: CalendarEvent) => void
) => {
  const [focusedEventIndex, setFocusedEventIndex] = useState<number>(-1);
  const [navigationMode, setNavigationMode] = useState<'calendar' | 'events'>('calendar');

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Skip if user is typing in form fields
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return;
    }

    switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      if (navigationMode === 'calendar') {
        onNavigate?.('prev');
      } else if (navigationMode === 'events' && focusedEventIndex > 0) {
        setFocusedEventIndex(focusedEventIndex - 1);
      }
      break;
        
    case 'ArrowRight':
      event.preventDefault();
      if (navigationMode === 'calendar') {
        onNavigate?.('next');
      } else if (navigationMode === 'events' && focusedEventIndex < events.length - 1) {
        setFocusedEventIndex(focusedEventIndex + 1);
      }
      break;
        
    case 'ArrowUp':
      event.preventDefault();
      if (navigationMode === 'events' && focusedEventIndex > 0) {
        setFocusedEventIndex(Math.max(0, focusedEventIndex - 1));
      }
      break;
        
    case 'ArrowDown':
      event.preventDefault();
      if (navigationMode === 'events' && focusedEventIndex < events.length - 1) {
        setFocusedEventIndex(Math.min(events.length - 1, focusedEventIndex + 1));
      }
      break;
        
    case 'Home':
      event.preventDefault();
      if (navigationMode === 'events') {
        setFocusedEventIndex(0);
      } else {
        onNavigate?.('today');
      }
      break;
        
    case 'End':
      event.preventDefault();
      if (navigationMode === 'events') {
        setFocusedEventIndex(events.length - 1);
      }
      break;
        
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (navigationMode === 'events' && focusedEventIndex >= 0 && events[focusedEventIndex]) {
        onEventSelect?.(events[focusedEventIndex]);
      }
      break;
        
    case 'Tab':
      // Switch between calendar and events navigation
      if (event.shiftKey) {
        setNavigationMode(navigationMode === 'events' ? 'calendar' : 'events');
      }
      break;
        
    case 'Escape':
      event.preventDefault();
      setFocusedEventIndex(-1);
      setNavigationMode('calendar');
      break;
        
      // View switching shortcuts
    case 'M':
    case 'm':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        onNavigate?.('today', 'dayGridMonth');
      }
      break;
        
    case 'W':
    case 'w':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        onNavigate?.('today', 'timeGridWeek');
      }
      break;
        
    case 'D':
    case 'd':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        onNavigate?.('today', 'timeGridDay');
      }
      break;
        
    case 'L':
    case 'l':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        onNavigate?.('today', 'listWeek');
      }
      break;
    }
  }, [events, focusedEventIndex, navigationMode, onNavigate, onEventSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    focusedEventIndex,
    navigationMode,
    setNavigationMode,
    setFocusedEventIndex
  };
};

/**
 * Reduced motion preferences hook
 */
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Focus management hook for modal and overlay components
 */
const useFocusManagement = () => {
  const focusTrapRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const trapFocus = useCallback((isActive: boolean) => {
    if (isActive) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus first focusable element in trap
      if (focusTrapRef.current) {
        const focusableElements = focusTrapRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
    } else {
      // Restore previous focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, []);

  const handleFocusTrap = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !focusTrapRef.current) return;

    const focusableElements = focusTrapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, []);

  return {
    focusTrapRef,
    trapFocus,
    handleFocusTrap
  };
};

/**
 * Color contrast validation hook
 */
const useColorContrast = () => {
  const [contrastIssues, setContrastIssues] = useState<string[]>([]);

  const validateContrast = useCallback((backgroundColor: string, textColor: string = '#ffffff') => {
    // Simple contrast ratio calculation (production would use more sophisticated methods)
    const bgLuminance = calculateLuminance(backgroundColor);
    const textLuminance = calculateLuminance(textColor);
    
    const contrastRatio = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                         (Math.min(bgLuminance, textLuminance) + 0.05);
    
    // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
    return contrastRatio >= 4.5;
  }, []);

  const calculateLuminance = (color: string): number => {
    // Convert hex to RGB and calculate relative luminance
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  return { validateContrast, contrastIssues };
};

/**
 * Accessibility Enhanced Calendar Component
 */
export const AccessibilityEnhanced: React.FC<AccessibilityEnhancedProps> = ({
  events,
  trainers,
  currentView,
  selectedDate,
  activeFilters,
  onKeyboardNavigate,
  onEventSelect
}) => {
  const { announcementRef, announce } = useScreenReaderAnnouncements();
  const { focusedEventIndex, navigationMode } = useKeyboardNavigation(
    events,
    onKeyboardNavigate,
    onEventSelect
  );
  const prefersReducedMotion = useReducedMotion();
  const { focusTrapRef } = useFocusManagement();
  const { validateContrast } = useColorContrast();

  // Announce filter changes
  useEffect(() => {
    const activeFilterCount = activeFilters.trainers.length + 
                             activeFilters.eventTypes.length + 
                             (activeFilters.availableOnly ? 1 : 0);
    
    if (activeFilterCount > 0) {
      const filterDescription = [];
      
      if (activeFilters.trainers.length > 0) {
        const trainerNames = activeFilters.trainers
          .map(id => trainers.find(t => t.id === id)?.name)
          .filter(Boolean)
          .join(', ');
        filterDescription.push(`${activeFilters.trainers.length} trainer${activeFilters.trainers.length > 1 ? 's' : ''}: ${trainerNames}`);
      }
      
      if (activeFilters.eventTypes.length > 0) {
        filterDescription.push(`${activeFilters.eventTypes.length} event type${activeFilters.eventTypes.length > 1 ? 's' : ''}`);
      }
      
      if (activeFilters.availableOnly) {
        filterDescription.push('available events only');
      }
      
      announce(`Filters applied: ${filterDescription.join(', ')}. Showing ${events.length} event${events.length !== 1 ? 's' : ''}.`);
    } else {
      announce(`All filters cleared. Showing ${events.length} event${events.length !== 1 ? 's' : ''}.`);
    }
  }, [activeFilters, events.length, trainers, announce]);

  // Announce view changes
  useEffect(() => {
    const viewNames = {
      'dayGridMonth': 'Month view',
      'timeGridWeek': 'Week view',
      'timeGridDay': 'Day view',
      'listWeek': 'List view'
    };
    
    const viewName = viewNames[currentView as keyof typeof viewNames] || currentView;
    announce(`Calendar view changed to ${viewName}`);
  }, [currentView, announce]);

  // Announce date selections
  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
      
      announce(`Selected ${dateString}. ${dayEvents.length} event${dayEvents.length !== 1 ? 's' : ''} on this date.`);
    }
  }, [selectedDate, events, announce]);

  // Generate keyboard shortcuts help
  const keyboardShortcuts = [
    { key: 'Arrow Keys', description: 'Navigate calendar or events' },
    { key: 'Enter/Space', description: 'Select focused event' },
    { key: 'Home', description: 'Go to first event or today' },
    { key: 'End', description: 'Go to last event' },
    { key: 'Escape', description: 'Clear focus and return to calendar' },
    { key: 'Ctrl/Cmd + M', description: 'Switch to month view' },
    { key: 'Ctrl/Cmd + W', description: 'Switch to week view' },
    { key: 'Ctrl/Cmd + D', description: 'Switch to day view' },
    { key: 'Ctrl/Cmd + L', description: 'Switch to list view' }
  ];

  return (
    <div 
      className={`accessibility-enhanced ${prefersReducedMotion ? 'accessibility-enhanced--reduced-motion' : ''}`}
      ref={focusTrapRef}
    >
      {/* Screen Reader Announcements */}
      <div
        ref={announcementRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      />

      {/* Skip Links */}
      <div className="skip-links">
        <a href="#calendar-main" className="skip-link">
          Skip to calendar
        </a>
        <a href="#calendar-controls" className="skip-link">
          Skip to calendar controls
        </a>
        <a href="#event-list" className="skip-link">
          Skip to events list
        </a>
      </div>

      {/* Keyboard Navigation Instructions */}
      <div className="accessibility-instructions" id="accessibility-help">
        <button
          className="instructions-toggle"
          aria-expanded="false"
          aria-controls="keyboard-shortcuts"
          onClick={(e) => {
            const button = e.currentTarget;
            const content = document.getElementById('keyboard-shortcuts');
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            button.setAttribute('aria-expanded', (!isExpanded).toString());
            if (content) {
              content.hidden = isExpanded;
            }
          }}
        >
          <span className="instructions-icon" aria-hidden="true">⌨️</span>
          Keyboard Navigation Help
        </button>
        
        <div id="keyboard-shortcuts" className="keyboard-shortcuts" hidden>
          <h3>Keyboard Shortcuts</h3>
          <dl className="shortcuts-list">
            {keyboardShortcuts.map((shortcut, index) => (
              <div key={index} className="shortcut-item">
                <dt className="shortcut-key">
                  <kbd>{shortcut.key}</kbd>
                </dt>
                <dd className="shortcut-description">{shortcut.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Focus Indicator for Events */}
      {navigationMode === 'events' && focusedEventIndex >= 0 && events[focusedEventIndex] && (
        <div className="focus-indicator" aria-live="polite">
          Focused on event: {events[focusedEventIndex].title} at{' '}
          {new Date(events[focusedEventIndex].start).toLocaleString()}
        </div>
      )}

      {/* High Contrast Mode Toggle */}
      <button
        className="high-contrast-toggle"
        onClick={() => {
          document.body.classList.toggle('high-contrast-mode');
          announce('High contrast mode toggled');
        }}
        aria-label="Toggle high contrast mode"
      >
        <span className="contrast-icon" aria-hidden="true">◐</span>
        <span className="sr-only">Toggle High Contrast</span>
      </button>

      {/* Reduced Motion Indicator */}
      {prefersReducedMotion && (
        <div className="reduced-motion-notice" role="status">
          <span className="motion-icon" aria-hidden="true">🐌</span>
          Reduced motion mode active
        </div>
      )}
    </div>
  );
};

export default AccessibilityEnhanced; 