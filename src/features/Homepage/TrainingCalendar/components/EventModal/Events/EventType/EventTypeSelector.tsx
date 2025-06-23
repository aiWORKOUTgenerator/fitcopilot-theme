/**
 * Event Type Selector Component
 * 
 * Handles event type selection with smart scheduling integration
 * Migrated from EventModal.tsx event type selection logic
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useCallback, useMemo } from 'react';
import { EVENT_TYPE_OPTIONS, getAutomaticSelections, getDurationOptionsForEventType, getEventTypeOption, hasAutomaticSelections } from './EventTypeConfig';
import { DurationSelectorProps, EventTypeSelectorProps, SchedulingPreference } from './EventTypeInterfaces';
import './EventTypeSelector.scss';

/**
 * Duration Selector Component
 * 
 * Handles duration selection for events that require it (e.g., Personal Training)
 */
const DurationSelector: React.FC<DurationSelectorProps> = ({
  eventType,
  selectedDuration,
  durationOptions,
  disabled = false,
  onChange,
  className = ''
}) => {
  const handleDurationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const duration = value === '' ? undefined : parseInt(value);
    if (duration !== undefined) {
      onChange(duration);
    }
  }, [onChange]);

  return (
    <div className={`event-type-selector__duration ${className}`}>
      <label className="event-type-selector__label">
        Duration
        <span className="event-type-selector__required">*</span>
      </label>
      <select
        className="event-type-selector__select"
        value={selectedDuration || ''}
        disabled={disabled}
        onChange={handleDurationChange}
        aria-label={`Select duration for ${eventType}`}
      >
        {durationOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedDuration && (
        <div className="event-type-selector__duration-description">
          {durationOptions.find(opt => opt.value === selectedDuration)?.description}
        </div>
      )}
    </div>
  );
};

/**
 * Event Type Selector Component
 * 
 * Main component for selecting event types with smart scheduling integration
 */
const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({
  selectedEventType = '',
  eventTypeOptions = EVENT_TYPE_OPTIONS,
  disabled = false,
  loading = false,
  error,
  selectedDate,
  onChange,
  onDurationChange,
  onAutomaticSelectionsChange,
  onTriggerSmartScheduling,
  className = ''
}) => {
  
  // ===== MEMOIZED VALUES =====
  
  const selectedOption = useMemo(() => {
    return getEventTypeOption(selectedEventType);
  }, [selectedEventType]);

  const durationOptions = useMemo(() => {
    return getDurationOptionsForEventType(selectedEventType);
  }, [selectedEventType]);

  const showDurationSelector = useMemo(() => {
    return selectedOption?.requiresDuration && durationOptions.length > 0;
  }, [selectedOption, durationOptions]);

  const showSmartScheduling = useMemo(() => {
    return selectedEventType && selectedEventType !== '';
  }, [selectedEventType]);

  // ===== EVENT HANDLERS =====
  
  const handleEventTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange(value);
    
    // Check if this event type has automatic event type selection
    if (value && hasAutomaticSelections(value) && onAutomaticSelectionsChange) {
      const automaticSelections = getAutomaticSelections(value);
      if (automaticSelections) {
        onAutomaticSelectionsChange(automaticSelections);
      }
    }
  }, [onChange, onAutomaticSelectionsChange]);

  const handleDurationChange = useCallback((duration: number) => {
    if (onDurationChange) {
      onDurationChange(duration);
    }
  }, [onDurationChange]);

  const handleTriggerSmartScheduling = useCallback(() => {
    if (onTriggerSmartScheduling) {
      // Include selected date in preferences if available
      const preferences: SchedulingPreference = {
        preferredTimeOfDay: 'any',
        preferredDays: selectedDate ? [selectedDate.getDay()] : [1, 2, 3, 4, 5],
        timezone: 'America/New_York',
        wantsEarliestSlot: false
      };
      
      // Add selected date context for smart scheduling
      if (selectedDate) {
        logger.info('🎯 Smart Scheduling triggered for date:', selectedDate.toLocaleDateString());
        logger.info('📋 Event Type:', selectedEventType);
        logger.info('⚙️ Preferences:', preferences);
      }
      
      onTriggerSmartScheduling(preferences);
    }
  }, [onTriggerSmartScheduling, selectedDate, selectedEventType]);

  // ===== RENDER =====
  
  return (
    <div className={`event-type-selector ${className}`}>
      {/* Event Type Selection */}
      <div className="event-type-selector__field">
        <label className="event-type-selector__label">
          Event Type
          <span className="event-type-selector__required">*</span>
        </label>
        <select
          className={`event-type-selector__select ${error ? 'event-type-selector__select--error' : ''}`}
          value={selectedEventType}
          disabled={disabled || loading}
          onChange={handleEventTypeChange}
          aria-label="Select event type"
          aria-invalid={!!error}
          aria-describedby={error ? 'event-type-error' : undefined}
        >
          {eventTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <div id="event-type-error" className="event-type-selector__error" role="alert">
            {error}
          </div>
        )}
      </div>

      {/* Event Description */}
      {selectedOption && selectedOption.value !== '' && (
        <div className="event-type-selector__description">
          <div className="event-type-selector__description-text">
            {selectedOption.description}
          </div>
          <div className="event-type-selector__description-meta">
            {selectedOption.duration && (
              <span className="event-type-selector__meta-item">
                Duration: {selectedOption.duration} minutes
              </span>
            )}
            <span className="event-type-selector__meta-item">
              Category: {selectedOption.category}
            </span>
            {selectedOption.supportsPricing && (
              <span className="event-type-selector__meta-item">
                Paid service
              </span>
            )}
          </div>
        </div>
      )}

      {/* Duration Selection (for Personal Training) */}
      {showDurationSelector && onDurationChange && (
        <DurationSelector
          eventType={selectedEventType}
          selectedDuration={undefined} // Will be passed from parent
          durationOptions={durationOptions}
          disabled={disabled || loading}
          onChange={handleDurationChange}
          className="event-type-selector__duration-field"
        />
      )}

      {/* Smart Scheduling Widget */}
      {showSmartScheduling && (
        <div className="event-type-selector__smart-scheduling">
          <div className="event-type-selector__smart-scheduling-header">
            <h4>Smart Scheduling</h4>
            <span className="event-type-selector__badge">Coming Soon</span>
          </div>
          <div className="event-type-selector__smart-scheduling-content">
            <div className="event-type-selector__smart-scheduling-icon">📅</div>
            <div className="event-type-selector__smart-scheduling-text">
              {selectedDate ? (
                <>
                  <h5>Selected Date: {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</h5>
                  <ul>
                    <li>Event type: {selectedEventType}</li>
                    <li>Trainer availability for this date</li>
                    <li>Optimal time slots based on preferences</li>
                  </ul>
                </>
              ) : (
                <>
                  <h5>Automatic Scheduling Based On:</h5>
                  <ul>
                    <li>Selected event type and duration</li>
                    <li>Trainer availability</li>
                    <li>Client preferences</li>
                  </ul>
                </>
              )}
            </div>
            {onTriggerSmartScheduling && (
              <button
                type="button"
                className="event-type-selector__smart-scheduling-trigger"
                onClick={handleTriggerSmartScheduling}
                disabled={loading}
              >
                {selectedDate ? 'Find Times for This Date' : 'Find Available Times'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="event-type-selector__loading">
          <div className="event-type-selector__spinner"></div>
          <span>Loading event options...</span>
        </div>
      )}
    </div>
  );
};

export default EventTypeSelector; 