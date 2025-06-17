/**
 * Event Modal Component
 * 
 * Modal component for displaying and editing calendar event details
 * Handles event creation, editing, and deletion with form validation
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useCallback, useEffect, useState } from 'react';

import { BookingStatus, CalendarEvent, EventType, SessionType, TrainerData } from '../../interfaces';
import './EventModal.scss';

/**
 * Event Modal Props
 */
interface EventModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Event to display/edit (null for new event) */
  event: CalendarEvent | null;
  /** Available trainers */
  trainers: TrainerData[];
  /** Modal mode */
  mode: 'view' | 'edit' | 'create';
  /** Loading state */
  loading?: boolean;
  /** Close modal handler */
  onClose: () => void;
  /** Save event handler */
  onSave: (event: Partial<CalendarEvent>) => Promise<void>;
  /** Delete event handler */
  onDelete?: (eventId: number) => Promise<void>;
  /** Mode change handler */
  onModeChange?: (mode: 'view' | 'edit' | 'create') => void;
}

/**
 * Form validation errors
 */
interface ValidationErrors {
  title?: string;
  start?: string;
  end?: string;
  trainerId?: string;
  maxParticipants?: string;
  location?: string;
  price?: string;
}

/**
 * Event Modal Component
 */
const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  event,
  trainers,
  mode,
  loading = false,
  onClose,
  onSave,
  onDelete,
  onModeChange
}) => {
  
  // ===== STATE =====
  
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // ===== EFFECTS =====
  
  // Initialize form data when event changes
  useEffect(() => {
    if (event) {
      setFormData({
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        trainerId: event.trainerId,
        eventType: event.eventType,
        bookingStatus: event.bookingStatus,
        sessionType: event.sessionType,
        location: event.location,
        maxParticipants: event.maxParticipants,
        currentParticipants: event.currentParticipants,
        price: event.price,
        currency: event.currency,
        backgroundColor: event.backgroundColor,
        borderColor: event.borderColor,
        textColor: event.textColor
      });
    } else if (mode === 'create') {
      // Initialize with defaults for new event
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      setFormData({
        title: '',
        description: '',
        start: now.toISOString().slice(0, 16), // Format for datetime-local input
        end: oneHourLater.toISOString().slice(0, 16),
                 trainerId: trainers.length > 0 ? trainers[0].id : 0,
        eventType: 'session',
        bookingStatus: 'available',
        sessionType: 'individual',
        location: '',
        maxParticipants: 1,
        currentParticipants: 0,
        price: 0,
        currency: 'USD',
        backgroundColor: '',
        borderColor: '',
        textColor: ''
      });
    }
    
    // Clear errors when event changes
    setErrors({});
  }, [event, mode, trainers]);
  
  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setSaving(false);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [isOpen]);
  
  // ===== FORM HANDLING =====
  
  const handleInputChange = useCallback((field: keyof CalendarEvent, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);
  
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Required fields
    if (!formData.title?.trim()) {
      newErrors.title = 'Event title is required';
    }
    
    if (!formData.start) {
      newErrors.start = 'Start date and time is required';
    }
    
    if (!formData.end) {
      newErrors.end = 'End date and time is required';
    }
    
    if (!formData.trainerId) {
      newErrors.trainerId = 'Trainer selection is required';
    }
    
    // Date validation
    if (formData.start && formData.end) {
      const startDate = new Date(formData.start);
      const endDate = new Date(formData.end);
      
      if (endDate <= startDate) {
        newErrors.end = 'End time must be after start time';
      }
      
      if (startDate < new Date()) {
        newErrors.start = 'Start time cannot be in the past';
      }
    }
    
    // Participants validation
    if (formData.maxParticipants && formData.maxParticipants < 1) {
      newErrors.maxParticipants = 'Maximum participants must be at least 1';
    }
    
    // Price validation
    if (formData.price && formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      // Handle error (could show toast notification)
    } finally {
      setSaving(false);
    }
  }, [formData, validateForm, onSave, onClose]);
  
  const handleDelete = useCallback(async () => {
    if (!event?.id || !onDelete) return;
    
    setDeleting(true);
    
    try {
      await onDelete(event.id);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      // Handle error (could show toast notification)
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [event, onDelete, onClose]);
  
  // ===== EVENT HANDLERS =====
  
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  
  const handleModeChange = useCallback((newMode: 'view' | 'edit' | 'create') => {
    if (onModeChange) {
      onModeChange(newMode);
    }
  }, [onModeChange]);
  
  // ===== RENDER HELPERS =====
  
  const renderFormField = (
    label: string,
    field: keyof CalendarEvent,
    type: 'text' | 'textarea' | 'datetime-local' | 'number' | 'select',
    options?: { value: any; label: string }[],
    placeholder?: string
  ) => {
    const value = formData[field] || '';
    const error = errors[field as keyof ValidationErrors];
    const isReadonly = mode === 'view';
    
    return (
      <div className="event-modal__form-field">
        <label className="event-modal__form-label">
          {label}
          {!isReadonly && <span className="required">*</span>}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            className={`event-modal__form-input ${error ? 'error' : ''}`}
            value={value as string}
            placeholder={placeholder}
            readOnly={isReadonly}
            onChange={(e) => handleInputChange(field, e.target.value)}
            rows={3}
          />
        ) : type === 'select' ? (
          <select
            className={`event-modal__form-input ${error ? 'error' : ''}`}
            value={value as string}
            disabled={isReadonly}
            onChange={(e) => handleInputChange(field, e.target.value)}
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            className={`event-modal__form-input ${error ? 'error' : ''}`}
            value={value as string}
            placeholder={placeholder}
            readOnly={isReadonly}
            onChange={(e) => {
              const inputValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
              handleInputChange(field, inputValue);
            }}
          />
        )}
        
        {error && (
          <span className="event-modal__form-error">{error}</span>
        )}
      </div>
    );
  };
  
  const getSelectedTrainer = () => {
    return trainers.find(t => t.id === formData.trainerId);
  };
  
  const getEventTypeOptions = (): { value: EventType; label: string }[] => [
    { value: 'session', label: 'Training Session' },
    { value: 'availability', label: 'Availability Slot' },
    { value: 'blocked', label: 'Blocked Time' },
    { value: 'group_class', label: 'Group Class' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'assessment', label: 'Assessment' }
  ];
  
  const getBookingStatusOptions = (): { value: BookingStatus; label: string }[] => [
    { value: 'available', label: 'Available' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' }
  ];
  
  const getSessionTypeOptions = (): { value: SessionType; label: string }[] => [
    { value: 'individual', label: 'Individual' },
    { value: 'group', label: 'Group' },
    { value: 'assessment', label: 'Assessment' }
  ];
  
     const getTrainerOptions = () => {
     return trainers.map(trainer => ({
       value: trainer.id.toString(),
       label: `${trainer.name} - ${trainer.specialty}`
     }));
   };
  
  // ===== RENDER =====
  
  if (!isOpen) return null;
  
  const selectedTrainer = getSelectedTrainer();
  const isEditable = mode === 'edit' || mode === 'create';
  const modalTitle = mode === 'create' ? 'Create New Event' : 
                   mode === 'edit' ? 'Edit Event' : 'Event Details';
  
  return (
    <div 
      className="event-modal__backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div className="event-modal__container">
        <div className="event-modal__header">
          <h2 id="event-modal-title" className="event-modal__title">
            {modalTitle}
          </h2>
          
          <div className="event-modal__header-actions">
            {mode === 'view' && event && (
              <button
                type="button"
                className="event-modal__button event-modal__button--secondary"
                onClick={() => handleModeChange('edit')}
                disabled={loading}
              >
                Edit
              </button>
            )}
            
            <button
              type="button"
              className="event-modal__button event-modal__button--ghost"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="event-modal__content">
          {loading ? (
            <div className="event-modal__loading">
              <div className="spinner"></div>
              <span>Loading event details...</span>
            </div>
          ) : (
            <form className="event-modal__form" onSubmit={(e) => e.preventDefault()}>
              <div className="event-modal__form-grid">
                {/* Basic Information */}
                <div className="event-modal__form-section">
                  <h3 className="event-modal__section-title">Basic Information</h3>
                  
                  {renderFormField('Event Title', 'title', 'text', undefined, 'Enter event title')}
                  {renderFormField('Description', 'description', 'textarea', undefined, 'Enter event description')}
                  {renderFormField('Location', 'location', 'text', undefined, 'Enter location')}
                </div>
                
                {/* Date & Time */}
                <div className="event-modal__form-section">
                  <h3 className="event-modal__section-title">Date & Time</h3>
                  
                  {renderFormField('Start Date & Time', 'start', 'datetime-local')}
                  {renderFormField('End Date & Time', 'end', 'datetime-local')}
                </div>
                
                {/* Event Configuration */}
                <div className="event-modal__form-section">
                  <h3 className="event-modal__section-title">Event Configuration</h3>
                  
                  {renderFormField('Trainer', 'trainerId', 'select', getTrainerOptions())}
                  {renderFormField('Event Type', 'eventType', 'select', getEventTypeOptions())}
                  {renderFormField('Session Type', 'sessionType', 'select', getSessionTypeOptions())}
                  {renderFormField('Booking Status', 'bookingStatus', 'select', getBookingStatusOptions())}
                </div>
                
                {/* Capacity & Pricing */}
                <div className="event-modal__form-section">
                  <h3 className="event-modal__section-title">Capacity & Pricing</h3>
                  
                  {renderFormField('Maximum Participants', 'maxParticipants', 'number')}
                  
                  {mode === 'view' && (
                    <div className="event-modal__form-field">
                      <label className="event-modal__form-label">Current Participants</label>
                      <input
                        type="number"
                        className="event-modal__form-input"
                        value={formData.currentParticipants || 0}
                        readOnly
                      />
                    </div>
                  )}
                  
                  {renderFormField('Price', 'price', 'number')}
                  
                  <div className="event-modal__form-field">
                    <label className="event-modal__form-label">Currency</label>
                    <select
                      className="event-modal__form-input"
                      value={formData.currency || 'USD'}
                      disabled={mode === 'view'}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Trainer Information */}
              {selectedTrainer && (
                <div className="event-modal__trainer-info">
                  <h3 className="event-modal__section-title">Trainer Information</h3>
                  <div className="event-modal__trainer-card">
                    {selectedTrainer.imageUrl && (
                      <img
                        src={selectedTrainer.imageUrl}
                        alt={selectedTrainer.name}
                        className="event-modal__trainer-avatar"
                      />
                    )}
                    <div className="event-modal__trainer-details">
                      <h4>{selectedTrainer.name}</h4>
                      <p>{selectedTrainer.specialty}</p>
                      <p>{selectedTrainer.yearsExperience} years experience</p>
                      <p>{selectedTrainer.clientsCount} clients trained</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
        
        <div className="event-modal__footer">
          {isEditable && !loading && (
            <>
              <button
                type="button"
                className="event-modal__button event-modal__button--secondary"
                onClick={onClose}
                disabled={saving || deleting}
              >
                Cancel
              </button>
              
              <button
                type="button"
                className="event-modal__button event-modal__button--primary"
                onClick={handleSave}
                disabled={saving || deleting}
              >
                {saving ? (
                  <>
                    <div className="spinner spinner--small"></div>
                    Saving...
                  </>
                ) : (
                  mode === 'create' ? 'Create Event' : 'Save Changes'
                )}
              </button>
            </>
          )}
          
          {mode === 'edit' && event && onDelete && (
            <button
              type="button"
              className="event-modal__button event-modal__button--danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={saving || deleting}
            >
              {deleting ? (
                <>
                  <div className="spinner spinner--small"></div>
                  Deleting...
                </>
              ) : (
                'Delete Event'
              )}
            </button>
          )}
        </div>
        
        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="event-modal__delete-confirm">
            <div className="event-modal__delete-confirm-content">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="event-modal__delete-confirm-actions">
                <button
                  type="button"
                  className="event-modal__button event-modal__button--secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="event-modal__button event-modal__button--danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal; 