/**
 * Time Slot Selector Component
 * 
 * Displays available time slots for event scheduling
 * Handles slot selection and integrates with booking flow
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useCallback, useMemo, useState } from 'react';
import { AvailableTimeSlot, SchedulingResult } from '../Events/EventType/EventTypeInterfaces';
import './TimeSlotSelector.scss';

/**
 * Time Slot Selector Props
 */
interface TimeSlotSelectorProps {
  /** Scheduling result with available slots */
  schedulingResult: SchedulingResult | null;
  
  /** Selected time slot */
  selectedSlot: AvailableTimeSlot | null;
  
  /** Loading state */
  loading?: boolean;
  
  /** Event type for context */
  eventType?: string;
  
  /** Selected date for context */
  selectedDate?: Date;
  
  /** Slot selection handler */
  onSlotSelect: (slot: AvailableTimeSlot) => void;
  
  /** Retry handler for failed API calls */
  onRetry?: () => void;
  
  /** CSS class name */
  className?: string;
}

/**
 * Time Slot Selector Component
 */
const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  schedulingResult,
  selectedSlot,
  loading = false,
  eventType,
  selectedDate,
  onSlotSelect,
  onRetry,
  className = ''
}) => {
  
  // ===== STATE =====
  
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // ===== MEMOIZED VALUES =====
  
  const groupedSlots = useMemo(() => {
    if (!schedulingResult?.availableSlots) return {};
    
    return schedulingResult.availableSlots.reduce((groups, slot) => {
      const timeKey = slot.startTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      
      groups[timeKey].push(slot);
      
      return groups;
    }, {} as Record<string, AvailableTimeSlot[]>);
  }, [schedulingResult?.availableSlots]);
  
  const availabilityStats = useMemo(() => {
    if (!schedulingResult?.availableSlots) {
      return { total: 0, available: 0, limited: 0, waitlist: 0 };
    }
    
    return schedulingResult.availableSlots.reduce((stats, slot) => {
      stats.total++;
      stats[slot.status]++;
      return stats;
    }, { total: 0, available: 0, limited: 0, waitlist: 0 });
  }, [schedulingResult?.availableSlots]);
  
  // ===== EVENT HANDLERS =====
  
  const handleSlotClick = useCallback((slot: AvailableTimeSlot) => {
    onSlotSelect(slot);
  }, [onSlotSelect]);
  
  const handleViewModeChange = useCallback((mode: 'list' | 'grid') => {
    setViewMode(mode);
  }, []);
  
  // ===== HELPER FUNCTIONS =====
  
  const formatSlotTime = (slot: AvailableTimeSlot): string => {
    const start = slot.startTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    const end = slot.endTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    return `${start} - ${end}`;
  };
  
  const getSlotStatusIcon = (status: AvailableTimeSlot['status']): string => {
    switch (status) {
    case 'available': return '✅';
    case 'limited': return '⚠️';
    case 'waitlist': return '⏳';
    default: return '❓';
    }
  };
  
  const getSlotStatusText = (status: AvailableTimeSlot['status']): string => {
    switch (status) {
    case 'available': return 'Available';
    case 'limited': return 'Limited Spots';
    case 'waitlist': return 'Waitlist';
    default: return 'Unknown';
    }
  };
  
  // ===== RENDER HELPERS =====
  
  const renderSlotCard = (slot: AvailableTimeSlot, index: number) => {
    const isSelected = selectedSlot?.startTime.getTime() === slot.startTime.getTime();
    
    return (
      <div 
        key={`${slot.startTime.getTime()}-${slot.trainerId}-${index}`}
        className={`time-slot-card ${isSelected ? 'time-slot-card--selected' : ''} time-slot-card--${slot.status}`}
        onClick={() => handleSlotClick(slot)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSlotClick(slot);
          }
        }}
        aria-pressed={isSelected}
        aria-label={`Select ${formatSlotTime(slot)} with ${slot.trainerName || 'trainer'}, ${getSlotStatusText(slot.status)}`}
      >
        <div className="time-slot-card__header">
          <div className="time-slot-card__time">
            {formatSlotTime(slot)}
          </div>
          <div className="time-slot-card__status">
            <span className="time-slot-card__status-icon">
              {getSlotStatusIcon(slot.status)}
            </span>
            <span className="time-slot-card__status-text">
              {getSlotStatusText(slot.status)}
            </span>
          </div>
        </div>
        
        <div className="time-slot-card__details">
          {slot.trainerName && (
            <div className="time-slot-card__trainer">
              <span className="time-slot-card__trainer-label">Trainer:</span>
              <span className="time-slot-card__trainer-name">{slot.trainerName}</span>
            </div>
          )}
          
          {slot.spotsRemaining !== undefined && (
            <div className="time-slot-card__spots">
              <span className="time-slot-card__spots-label">Spots:</span>
              <span className="time-slot-card__spots-count">{slot.spotsRemaining} remaining</span>
            </div>
          )}
          
          {slot.price !== undefined && slot.price > 0 && (
            <div className="time-slot-card__price">
              <span className="time-slot-card__price-amount">${slot.price}</span>
            </div>
          )}
        </div>
        
        {isSelected && (
          <div className="time-slot-card__selected-indicator">
            ✓ Selected
          </div>
        )}
      </div>
    );
  };
  
  const renderEmptyState = () => (
    <div className="time-slot-selector__empty">
      <div className="time-slot-selector__empty-icon">📅</div>
      <h3 className="time-slot-selector__empty-title">No Available Time Slots</h3>
      <p className="time-slot-selector__empty-message">
        {selectedDate ? (
          <>
            No available time slots found for{' '}
            <strong>{selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}</strong>
            {eventType && (
              <>
                {' '}for <strong>{eventType}</strong>
              </>
            )}
            .
          </>
        ) : (
          'No available time slots found for the selected criteria.'
        )}
      </p>
      <p className="time-slot-selector__empty-suggestion">
        Try selecting a different date or event type.
      </p>
      {onRetry && (
        <button
          type="button"
          className="time-slot-selector__retry-button"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
  
  const renderErrorState = () => (
    <div className="time-slot-selector__error">
      <div className="time-slot-selector__error-icon">⚠️</div>
      <h3 className="time-slot-selector__error-title">Unable to Load Time Slots</h3>
      <p className="time-slot-selector__error-message">
        {schedulingResult?.error || 'An error occurred while loading available time slots.'}
      </p>
      {onRetry && (
        <button
          type="button"
          className="time-slot-selector__retry-button"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
  
  const renderLoadingState = () => (
    <div className="time-slot-selector__loading">
      <div className="time-slot-selector__loading-spinner"></div>
      <p className="time-slot-selector__loading-text">
        Finding available time slots...
      </p>
    </div>
  );
  
  // ===== MAIN RENDER =====
  
  if (loading) {
    return (
      <div className={`time-slot-selector ${className}`}>
        {renderLoadingState()}
      </div>
    );
  }
  
  if (!schedulingResult) {
    return null;
  }
  
  if (!schedulingResult.success) {
    return (
      <div className={`time-slot-selector ${className}`}>
        {renderErrorState()}
      </div>
    );
  }
  
  if (!schedulingResult.availableSlots || schedulingResult.availableSlots.length === 0) {
    return (
      <div className={`time-slot-selector ${className}`}>
        {renderEmptyState()}
      </div>
    );
  }
  
  return (
    <div className={`time-slot-selector ${className}`}>
      {/* Header */}
      <div className="time-slot-selector__header">
        <div className="time-slot-selector__title-section">
          <h3 className="time-slot-selector__title">
            Available Time Slots
            {selectedDate && (
              <span className="time-slot-selector__date">
                {' '}for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            )}
          </h3>
          
          <div className="time-slot-selector__stats">
            <span className="time-slot-selector__stat">
              {availabilityStats.total} slots found
            </span>
            {schedulingResult.recommendedSlot && (
              <span className="time-slot-selector__recommended">
                ⭐ Recommended slot available
              </span>
            )}
          </div>
        </div>
        
        <div className="time-slot-selector__controls">
          <div className="time-slot-selector__view-mode">
            <button
              type="button"
              className={`time-slot-selector__view-button ${viewMode === 'list' ? 'time-slot-selector__view-button--active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              aria-pressed={viewMode === 'list'}
            >
              List
            </button>
            <button
              type="button"
              className={`time-slot-selector__view-button ${viewMode === 'grid' ? 'time-slot-selector__view-button--active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              aria-pressed={viewMode === 'grid'}
            >
              Grid
            </button>
          </div>
        </div>
      </div>
      
      {/* Recommended Slot */}
      {schedulingResult.recommendedSlot && (
        <div className="time-slot-selector__recommended-section">
          <h4 className="time-slot-selector__recommended-title">
            ⭐ Recommended Slot
          </h4>
          {renderSlotCard(schedulingResult.recommendedSlot, -1)}
        </div>
      )}
      
      {/* Time Slots */}
      <div className={`time-slot-selector__slots time-slot-selector__slots--${viewMode}`}>
        {viewMode === 'list' ? (
          schedulingResult.availableSlots.map((slot, index) => renderSlotCard(slot, index))
        ) : (
          Object.entries(groupedSlots).map(([timeKey, slots]) => (
            <div key={timeKey} className="time-slot-selector__time-group">
              <h4 className="time-slot-selector__time-group-title">{timeKey}</h4>
              <div className="time-slot-selector__time-group-slots">
                {slots.map((slot, index) => renderSlotCard(slot, index))}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Performance Info (Development) */}
      {process.env.NODE_ENV === 'development' && schedulingResult.metadata && (
        <div className="time-slot-selector__debug">
          <details>
            <summary>Performance Metrics</summary>
            <pre>{JSON.stringify(schedulingResult.metadata, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector; 