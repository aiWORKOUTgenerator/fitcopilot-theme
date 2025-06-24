/**
 * Event Form Component
 * 
 * Form component for creating and editing events
 * Leverages existing EventTypeSelector - follows form-management.js patterns
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useCallback, useEffect } from 'react';
import { CalendarEvent } from '../../../../interfaces';
import { EVENT_TYPE_OPTIONS, EventTypeSelector } from '../../Events/EventType';
import { AvailableTimeSlot, SchedulingPreference } from '../../Events/EventType/EventTypeInterfaces';
import TimeSlotSelector from '../../TimeSlotSelector/TimeSlotSelector';
import { ValidationErrors } from '../../types';
import './EventForm.scss';

export interface EventFormProps {
  // Core form props
  formData: Partial<CalendarEvent>;
  onFormDataChange: (data: Partial<CalendarEvent>) => void;
  
  // Event type handling
  selectedEventType: string;
  selectedDuration: number | undefined;
  onEventTypeChange: (eventType: string) => void;
  onDurationChange: (duration: number) => void;
  onAutomaticSelectionsChange: (selections: {
    eventType?: string;
    sessionType?: string;
    bookingStatus?: string;
    price?: number;
  }) => void;
  
  // Smart scheduling
  selectedDate?: Date;
  onTriggerSmartScheduling?: (preferences: SchedulingPreference) => void;
  
  // Time slot handling
  showTimeSlotSelector: boolean;
  selectedTimeSlot: AvailableTimeSlot | null;
  onTimeSlotSelect?: (slot: AvailableTimeSlot) => void;
  onShowTimeSlotSelector?: (show: boolean) => void;
  
  // Validation
  errors: ValidationErrors;
  onFieldChange?: (field: string, value: any) => void;
  
  // State
  isLoading?: boolean;
  isSaving?: boolean;
  className?: string;
}

/**
 * EventForm Component
 * 
 * Renders form for event creation/editing using existing components
 */
export const EventForm: React.FC<EventFormProps> = React.memo(({
  formData,
  onFormDataChange,
  selectedEventType,
  selectedDuration,
  onEventTypeChange,
  onDurationChange,
  onAutomaticSelectionsChange,
  selectedDate,
  onTriggerSmartScheduling,
  showTimeSlotSelector,
  selectedTimeSlot,
  onTimeSlotSelect,
  onShowTimeSlotSelector,
  errors,
  onFieldChange,
  isLoading = false,
  isSaving = false,
  className = ''
}) => {

  // ===== COMPUTED VALUES =====

  const isDisabled = isLoading || isSaving;

  // ===== EVENT HANDLERS =====

  const handleFieldChange = useCallback((field: string, value: any) => {
    // Update form data
    onFormDataChange({
      ...formData,
      [field]: value
    });
    
    // Notify parent of field change for validation
    onFieldChange?.(field, value);
  }, [formData, onFormDataChange, onFieldChange]);

  const handleSpecialInstructionsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleFieldChange('specialInstructions', e.target.value);
  }, [handleFieldChange]);

  // ===== EFFECTS =====

  // Clear time slot selector when form is disabled
  useEffect(() => {
    if (isDisabled && showTimeSlotSelector) {
      onShowTimeSlotSelector?.(false);
    }
  }, [isDisabled, showTimeSlotSelector, onShowTimeSlotSelector]);

  // ===== RENDER HELPERS =====

  const renderSelectedTimeSlot = () => {
    if (!selectedTimeSlot) return null;

    // Defensive programming for time slot display
    try {
      // Validate time slot structure
      const hasValidStartTime = selectedTimeSlot.startTime && 
                              (selectedTimeSlot.startTime instanceof Date || 
                               typeof selectedTimeSlot.startTime === 'string');
      
      const hasValidEndTime = selectedTimeSlot.endTime && 
                            (selectedTimeSlot.endTime instanceof Date || 
                             typeof selectedTimeSlot.endTime === 'string');

      if (!hasValidStartTime || !hasValidEndTime) {
        return null;
      }

      // Convert to Date objects if needed
      const startTime = selectedTimeSlot.startTime instanceof Date 
        ? selectedTimeSlot.startTime 
        : new Date(selectedTimeSlot.startTime);
      
      const endTime = selectedTimeSlot.endTime instanceof Date 
        ? selectedTimeSlot.endTime 
        : new Date(selectedTimeSlot.endTime);

      // Validate Date objects
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        return null;
      }

      return (
        <div className="event-form__selected-slot">
          <h4 className="event-form__selected-slot-title">Selected Time Slot</h4>
          <div className="event-form__selected-slot-content">
            <p className="event-form__selected-slot-time">
              <strong>Time:</strong> {startTime.toLocaleString()} - {endTime.toLocaleString()}
            </p>
            {selectedTimeSlot.trainerName && (
              <p className="event-form__selected-slot-trainer">
                <strong>Trainer:</strong> {selectedTimeSlot.trainerName}
              </p>
            )}
            {selectedTimeSlot.price && (
              <p className="event-form__selected-slot-price">
                <strong>Price:</strong> ${selectedTimeSlot.price}
              </p>
            )}
            <button
              type="button"
              onClick={() => onShowTimeSlotSelector?.(true)}
              className="event-form__change-slot-button"
              disabled={isDisabled}
            >
              Change Time Slot
            </button>
          </div>
        </div>
      );

    } catch (error) {
      console.error('Error rendering time slot:', error);
      
      return (
        <div className="event-form__selected-slot event-form__selected-slot--error">
          <h4 className="event-form__selected-slot-title">Time Slot Selected</h4>
          <p className="event-form__selected-slot-error">
            <em>Time slot information temporarily unavailable</em>
          </p>
          <button
            type="button"
            onClick={() => onShowTimeSlotSelector?.(true)}
            className="event-form__change-slot-button"
            disabled={isDisabled}
          >
            Change Time Slot
          </button>
        </div>
      );
    }
  };

  // ===== RENDER =====

  return (
    <div className={`event-form ${className}`}>
      
      {/* EventType Smart Scheduling Integration */}
      <div className="event-form__section">
        <EventTypeSelector
          selectedEventType={selectedEventType}
          eventTypeOptions={EVENT_TYPE_OPTIONS}
          disabled={isDisabled}
          loading={isLoading}
          selectedDate={selectedDate}
          onChange={onEventTypeChange}
          onDurationChange={onDurationChange}
          onAutomaticSelectionsChange={onAutomaticSelectionsChange}
          onTriggerSmartScheduling={onTriggerSmartScheduling}
          className="event-form__event-type-selector"
        />
        
        {errors.title && (
          <div className="event-form__field-error">
            {errors.title}
          </div>
        )}
        
        {errors.duration && (
          <div className="event-form__field-error">
            {errors.duration}
          </div>
        )}
      </div>

      {/* Selected Time Slot Display */}
      {renderSelectedTimeSlot()}

      {/* Additional Details Section */}
      <div className="event-form__section">
        <label htmlFor="special-instructions" className="event-form__label">
          Additional Details
        </label>
        <textarea
          id="special-instructions"
          className="event-form__textarea"
          placeholder="Any special instructions or notes for this event..."
          value={formData.specialInstructions || ''}
          onChange={handleSpecialInstructionsChange}
          disabled={isDisabled}
          rows={4}
        />
        <div className="event-form__field-help">
          Optional: Add any specific requirements, preparation notes, or special instructions.
        </div>
      </div>

      {/* Time Slot Selector */}
      {showTimeSlotSelector && (
        <div className="event-form__time-slot-selector">
          <TimeSlotSelector
            schedulingResult={null} // Will be provided by parent component
            selectedSlot={selectedTimeSlot}
            loading={isLoading}
            eventType={selectedEventType}
            selectedDate={selectedDate}
            onSlotSelect={onTimeSlotSelect || (() => {})}
            className="event-form__time-slot-selector-component"
          />
        </div>
      )}
    </div>
  );
});

EventForm.displayName = 'EventForm'; 