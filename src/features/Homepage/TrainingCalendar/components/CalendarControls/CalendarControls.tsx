/**
 * Calendar Controls Component
 * 
 * Navigation and filtering controls for the training calendar
 * Handles view switching, date navigation, and event filtering
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useCallback, useState } from 'react';

import { BookingStatus, CalendarView, EventType, TrainerData } from '../../interfaces';
import './CalendarControls.scss';

/**
 * Event Filters Interface
 */
interface EventFilters {
  trainerId?: number;
  eventType?: EventType;
  bookingStatus?: BookingStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Calendar Controls Props
 */
interface CalendarControlsProps {
  /** Current calendar view */
  currentView: CalendarView;
  /** Current date */
  currentDate: Date;
  /** Available trainers */
  trainers: TrainerData[];
  /** Active filters */
  filters?: EventFilters;
  /** Loading state */
  loading?: boolean;
  /** View change handler */
  onViewChange: (view: CalendarView) => void;
  /** Navigation handler */
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  /** Date change handler */
  onDateChange: (date: Date) => void;
  /** Filter change handler */
  onFilterChange: (filters: EventFilters) => void;
  /** Create event handler */
  onCreateEvent?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Calendar Controls Component
 */
const CalendarControls: React.FC<CalendarControlsProps> = ({
  currentView,
  currentDate,
  trainers,
  filters = {},
  loading = false,
  onViewChange,
  onNavigate,
  onDateChange,
  onFilterChange,
  onCreateEvent,
  className = ''
}) => {
  
  // ===== STATE =====
  
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // ===== HANDLERS =====
  
  const handleViewChange = useCallback((view: CalendarView) => {
    onViewChange(view);
  }, [onViewChange]);
  
  const handleNavigation = useCallback((direction: 'prev' | 'next' | 'today') => {
    onNavigate(direction);
  }, [onNavigate]);
  
  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onDateChange(newDate);
      setShowDatePicker(false);
    }
  }, [onDateChange]);
  
  const handleFilterChange = useCallback((key: keyof EventFilters, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value === '' ? undefined : value
    };
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);
  
  const handleClearFilters = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);
  
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);
  
  const toggleDatePicker = useCallback(() => {
    setShowDatePicker(prev => !prev);
  }, []);
  
  // ===== RENDER HELPERS =====
  
  const formatCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    
    if (currentView === 'timeGridWeek' || currentView === 'listWeek') {
      // For week views, show week range
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.getDate()}-${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      } else {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    } else if (currentView === 'timeGridDay') {
      // For day view, show specific date
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      // For month view, show month and year
      return currentDate.toLocaleDateString('en-US', options);
    }
  };
  
  const getViewOptions = (): { value: CalendarView; label: string; icon: string }[] => [
    { value: 'dayGridMonth', label: 'Month', icon: '📅' },
    { value: 'timeGridWeek', label: 'Week', icon: '📊' },
    { value: 'timeGridDay', label: 'Day', icon: '📋' },
    { value: 'listWeek', label: 'List', icon: '📝' }
  ];
  
  const getEventTypeOptions = (): { value: EventType; label: string }[] => [
    { value: 'session', label: 'Training Sessions' },
    { value: 'availability', label: 'Availability' },
    { value: 'blocked', label: 'Blocked Time' },
    { value: 'group_class', label: 'Group Classes' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'assessment', label: 'Assessments' }
  ];
  
  const getBookingStatusOptions = (): { value: BookingStatus; label: string }[] => [
    { value: 'available', label: 'Available' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' }
  ];
  
  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== '').length;
  };
  
  // ===== RENDER =====
  
  return (
    <div className={`calendar-controls ${className}`}>
      {/* Main Controls Row */}
      <div className="calendar-controls__main">
        {/* Navigation Section */}
        <div className="calendar-controls__navigation">
          <button
            type="button"
            className="calendar-controls__nav-button"
            onClick={() => handleNavigation('prev')}
            disabled={loading}
            aria-label="Previous period"
          >
            ‹
          </button>
          
          <div className="calendar-controls__date-display">
            <button
              type="button"
              className="calendar-controls__date-button"
              onClick={toggleDatePicker}
              disabled={loading}
              aria-label="Select date"
            >
              {formatCurrentDate()}
              <span className="calendar-controls__date-arrow">▼</span>
            </button>
            
            {showDatePicker && (
              <div className="calendar-controls__date-picker">
                <input
                  type="date"
                  value={currentDate.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  className="calendar-controls__date-input"
                />
              </div>
            )}
          </div>
          
          <button
            type="button"
            className="calendar-controls__nav-button"
            onClick={() => handleNavigation('next')}
            disabled={loading}
            aria-label="Next period"
          >
            ›
          </button>
          
          <button
            type="button"
            className="calendar-controls__today-button"
            onClick={() => handleNavigation('today')}
            disabled={loading}
          >
            Today
          </button>
        </div>
        
        {/* View Switcher */}
        <div className="calendar-controls__view-switcher">
          {getViewOptions().map(option => (
            <button
              key={option.value}
              type="button"
              className={`calendar-controls__view-button ${
                currentView === option.value ? 'active' : ''
              }`}
              onClick={() => handleViewChange(option.value)}
              disabled={loading}
              aria-label={`Switch to ${option.label} view`}
            >
              <span className="calendar-controls__view-icon">{option.icon}</span>
              <span className="calendar-controls__view-label">{option.label}</span>
            </button>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="calendar-controls__actions">
          <button
            type="button"
            className={`calendar-controls__filter-button ${
              showFilters ? 'active' : ''
            } ${getActiveFiltersCount() > 0 ? 'has-filters' : ''}`}
            onClick={toggleFilters}
            disabled={loading}
            aria-label="Toggle filters"
          >
            🔍
            {getActiveFiltersCount() > 0 && (
              <span className="calendar-controls__filter-count">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
          
          {onCreateEvent && (
            <button
              type="button"
              className="calendar-controls__create-button"
              onClick={onCreateEvent}
              disabled={loading}
              aria-label="Create new event"
            >
              + New Event
            </button>
          )}
        </div>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div className="calendar-controls__filters">
          <div className="calendar-controls__filters-header">
            <h3>Filter Events</h3>
            {getActiveFiltersCount() > 0 && (
              <button
                type="button"
                className="calendar-controls__clear-filters"
                onClick={handleClearFilters}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="calendar-controls__filters-grid">
            {/* Trainer Filter */}
            <div className="calendar-controls__filter-group">
              <label className="calendar-controls__filter-label">
                Trainer
              </label>
              <select
                className="calendar-controls__filter-select"
                value={filters.trainerId || ''}
                onChange={(e) => handleFilterChange('trainerId', e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">All Trainers</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name} - {trainer.specialty}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Event Type Filter */}
            <div className="calendar-controls__filter-group">
              <label className="calendar-controls__filter-label">
                Event Type
              </label>
              <select
                className="calendar-controls__filter-select"
                value={filters.eventType || ''}
                onChange={(e) => handleFilterChange('eventType', e.target.value)}
              >
                <option value="">All Types</option>
                {getEventTypeOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Booking Status Filter */}
            <div className="calendar-controls__filter-group">
              <label className="calendar-controls__filter-label">
                Status
              </label>
              <select
                className="calendar-controls__filter-select"
                value={filters.bookingStatus || ''}
                onChange={(e) => handleFilterChange('bookingStatus', e.target.value)}
              >
                <option value="">All Statuses</option>
                {getBookingStatusOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {loading && (
        <div className="calendar-controls__loading">
          <div className="calendar-controls__loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarControls; 