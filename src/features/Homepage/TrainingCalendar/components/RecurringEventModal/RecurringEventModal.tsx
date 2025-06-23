import {
  Calendar,
  Check,
  Clock,
  Repeat,
  X
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { CalendarEvent, RecurringEventPattern, RecurringUpdateType } from '../../types';
import './RecurringEventModal.scss';

interface RecurringEventModalProps {
    /**
     * Whether modal is open
     */
    isOpen: boolean;
    
    /**
     * Event to configure recurrence for
     */
    event: CalendarEvent | null;
    
    /**
     * Whether this is a new event or editing existing
     */
    mode: 'create' | 'edit';
    
    /**
     * Close modal handler
     */
    onClose: () => void;
    
    /**
     * Save recurring pattern handler
     */
    onSave: (pattern: RecurringEventPattern, updateType?: RecurringUpdateType) => Promise<void>;
    
    /**
     * Delete recurring series handler
     */
    onDelete?: (deleteType: 'this' | 'future' | 'all') => Promise<void>;
}

/**
 * Default recurring pattern
 */
const getDefaultPattern = (): RecurringEventPattern => ({
  frequency: 'weekly',
  interval: 1,
  daysOfWeek: [1], // Monday
  occurrences: 10
});

/**
 * Frequency options
 */
const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

/**
 * Days of week options
 */
const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' }
];

/**
 * RecurringEventModal Component
 * 
 * Advanced interface for configuring recurring event patterns with visual preview
 */
export const RecurringEventModal: React.FC<RecurringEventModalProps> = ({
  isOpen,
  event,
  mode,
  onClose,
  onSave,
  onDelete
}) => {
  const [pattern, setPattern] = useState<RecurringEventPattern>(getDefaultPattern());
  const [endType, setEndType] = useState<'never' | 'date' | 'count'>('count');
  const [updateType, setUpdateType] = useState<RecurringUpdateType>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize pattern from event if editing
  React.useEffect(() => {
    if (event && event.recurringRule) {
      setPattern(event.recurringRule);
            
      if (event.recurringRule.endDate) {
        setEndType('date');
      } else if (event.recurringRule.occurrences) {
        setEndType('count');
      } else {
        setEndType('never');
      }
    } else {
      setPattern(getDefaultPattern());
      setEndType('count');
    }
  }, [event]);

  // Handle pattern field changes
  const handlePatternChange = useCallback((field: keyof RecurringEventPattern, value: any) => {
    setPattern(prev => {
      const newPattern = { ...prev, [field]: value };
            
      // Clear conflicting end conditions
      if (field === 'endDate') {
        delete newPattern.occurrences;
      } else if (field === 'occurrences') {
        delete newPattern.endDate;
      }
            
      return newPattern;
    });
        
    // Clear errors for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Handle days of week selection for weekly patterns
  const handleDayToggle = useCallback((dayValue: number) => {
    setPattern(prev => {
      const currentDays = prev.daysOfWeek || [];
      const newDays = currentDays.includes(dayValue)
        ? currentDays.filter(day => day !== dayValue)
        : [...currentDays, dayValue].sort((a, b) => a - b);
            
      return { ...prev, daysOfWeek: newDays };
    });
  }, []);

  // Handle end type change
  const handleEndTypeChange = useCallback((type: 'never' | 'date' | 'count') => {
    setEndType(type);
        
    setPattern(prev => {
      const newPattern = { ...prev };
            
      // Clear end conditions based on selection
      switch (type) {
      case 'never':
        delete newPattern.endDate;
        delete newPattern.occurrences;
        break;
      case 'date':
        delete newPattern.occurrences;
        if (!newPattern.endDate) {
          const futureDate = new Date();
          futureDate.setMonth(futureDate.getMonth() + 3);
          newPattern.endDate = futureDate.toISOString().split('T')[0];
        }
        break;
      case 'count':
        delete newPattern.endDate;
        if (!newPattern.occurrences) {
          newPattern.occurrences = 10;
        }
        break;
      }
            
      return newPattern;
    });
  }, []);

  // Validate pattern
  const validatePattern = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate interval
    if (!pattern.interval || pattern.interval < 1) {
      newErrors.interval = 'Interval must be at least 1';
    }

    // Validate weekly pattern
    if (pattern.frequency === 'weekly' && (!pattern.daysOfWeek || pattern.daysOfWeek.length === 0)) {
      newErrors.daysOfWeek = 'Please select at least one day of the week';
    }

    // Validate end conditions
    if (endType === 'date' && pattern.endDate) {
      const endDate = new Date(pattern.endDate);
      const eventDate = new Date(event?.start || Date.now());
            
      if (endDate <= eventDate) {
        newErrors.endDate = 'End date must be after the event start date';
      }
    }

    if (endType === 'count' && (!pattern.occurrences || pattern.occurrences < 1)) {
      newErrors.occurrences = 'Number of occurrences must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [pattern, endType, event]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
        
    if (!validatePattern()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(pattern, mode === 'edit' ? updateType : undefined);
      onClose();
    } catch (error) {
      logger.error('Failed to save recurring pattern:', error);
      setErrors({ general: 'Failed to save recurring pattern. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [pattern, validatePattern, onSave, onClose, mode, updateType]);

  // Handle delete series
  const handleDelete = useCallback(async (deleteType: 'this' | 'future' | 'all') => {
    if (!onDelete) return;

    setIsSubmitting(true);

    try {
      await onDelete(deleteType);
      onClose();
    } catch (error) {
      logger.error('Failed to delete recurring series:', error);
      setErrors({ general: 'Failed to delete recurring series. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [onDelete, onClose]);

  // Generate preview text
  const generatePreviewText = useCallback((): string => {
    const { frequency, interval, daysOfWeek, endDate, occurrences } = pattern;
        
    let text = '';
        
    // Frequency and interval
    if (interval === 1) {
      text = `Every ${frequency.slice(0, -2)}`;
    } else {
      text = `Every ${interval} ${frequency === 'daily' ? 'days' : frequency.slice(0, -2) + 's'}`;
    }
        
    // Days of week for weekly
    if (frequency === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
      const dayNames = daysOfWeek.map(day => DAYS_OF_WEEK[day].short).join(', ');
      text += ` on ${dayNames}`;
    }
        
    // End condition
    if (endDate) {
      const endDateFormatted = new Date(endDate).toLocaleDateString();
      text += `, until ${endDateFormatted}`;
    } else if (occurrences) {
      text += `, for ${occurrences} occurrence${occurrences > 1 ? 's' : ''}`;
    }
        
    return text;
  }, [pattern]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="recurring-event-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="recurring-event-modal">
        <div className="recurring-event-modal__header">
          <div className="header-icon">
            <Repeat size={24} />
          </div>
          <div className="header-content">
            <h2>{mode === 'create' ? 'Create Recurring Event' : 'Edit Recurring Series'}</h2>
            <p>Configure the recurrence pattern for this event</p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close recurring event modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="recurring-event-modal__form">
          {/* Frequency Selection */}
          <div className="form-section">
            <label className="form-label">Frequency</label>
            <div className="frequency-selector">
              {FREQUENCY_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`frequency-option ${pattern.frequency === option.value ? 'active' : ''}`}
                  onClick={() => handlePatternChange('frequency', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interval */}
          <div className="form-section">
            <label className="form-label">
              Repeat every
              <input
                type="number"
                min="1"
                max="365"
                value={pattern.interval}
                onChange={(e) => handlePatternChange('interval', parseInt(e.target.value))}
                className={`form-input interval-input ${errors.interval ? 'error' : ''}`}
              />
              {pattern.frequency === 'daily' && 'days'}
              {pattern.frequency === 'weekly' && 'weeks'}
              {pattern.frequency === 'monthly' && 'months'}
              {pattern.frequency === 'yearly' && 'years'}
            </label>
            {errors.interval && <span className="error-message">{errors.interval}</span>}
          </div>

          {/* Days of Week (for weekly pattern) */}
          {pattern.frequency === 'weekly' && (
            <div className="form-section">
              <label className="form-label">Days of the week</label>
              <div className="days-selector">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    className={`day-option ${pattern.daysOfWeek?.includes(day.value) ? 'active' : ''}`}
                    onClick={() => handleDayToggle(day.value)}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
              {errors.daysOfWeek && <span className="error-message">{errors.daysOfWeek}</span>}
            </div>
          )}

          {/* End Condition */}
          <div className="form-section">
            <label className="form-label">Ends</label>
            <div className="end-selector">
              <label className="radio-option">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === 'never'}
                  onChange={() => handleEndTypeChange('never')}
                />
                <span>Never</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === 'date'}
                  onChange={() => handleEndTypeChange('date')}
                />
                <span>On</span>
                {endType === 'date' && (
                  <input
                    type="date"
                    value={pattern.endDate || ''}
                    onChange={(e) => handlePatternChange('endDate', e.target.value)}
                    className={`form-input date-input ${errors.endDate ? 'error' : ''}`}
                  />
                )}
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === 'count'}
                  onChange={() => handleEndTypeChange('count')}
                />
                <span>After</span>
                {endType === 'count' && (
                  <>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={pattern.occurrences || ''}
                      onChange={(e) => handlePatternChange('occurrences', parseInt(e.target.value))}
                      className={`form-input count-input ${errors.occurrences ? 'error' : ''}`}
                    />
                    <span>occurrences</span>
                  </>
                )}
              </label>
            </div>
            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            {errors.occurrences && <span className="error-message">{errors.occurrences}</span>}
          </div>

          {/* Update Type (for editing existing series) */}
          {mode === 'edit' && event?.recurring && (
            <div className="form-section">
              <label className="form-label">Apply changes to</label>
              <div className="update-type-selector">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="updateType"
                    checked={updateType === 'this'}
                    onChange={() => setUpdateType('this')}
                  />
                  <span>This event only</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="updateType"
                    checked={updateType === 'future'}
                    onChange={() => setUpdateType('future')}
                  />
                  <span>This and future events</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="updateType"
                    checked={updateType === 'all'}
                    onChange={() => setUpdateType('all')}
                  />
                  <span>All events in the series</span>
                </label>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="form-section preview-section">
            <label className="form-label">
              <Calendar size={16} />
              Preview
            </label>
            <div className="preview-text">
              {generatePreviewText()}
            </div>
          </div>

          {/* Error Display */}
          {errors.general && (
            <div className="error-section">
              <span className="error-message">{errors.general}</span>
            </div>
          )}

          {/* Actions */}
          <div className="recurring-event-modal__actions">
            <div className="actions-left">
              {mode === 'edit' && onDelete && (
                <div className="delete-actions">
                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={() => handleDelete('this')}
                    disabled={isSubmitting}
                  >
                    Delete This Event
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={() => handleDelete('all')}
                    disabled={isSubmitting}
                  >
                    Delete Series
                  </button>
                </div>
              )}
            </div>
            <div className="actions-right">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Clock size={16} className="spinning" />
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    {mode === 'create' ? 'Create Series' : 'Update Series'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}; 