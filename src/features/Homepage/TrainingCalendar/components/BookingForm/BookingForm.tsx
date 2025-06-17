/**
 * Booking Form Component
 * 
 * Comprehensive form for booking training sessions and events
 * Handles client information, payment details, and booking confirmation
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useCallback, useEffect, useState } from 'react';

import { BookingData, CalendarEvent, ClientInfo, EmergencyContact, TrainerData } from '../../interfaces';
import './BookingForm.scss';

/**
 * Booking Form Props
 */
interface BookingFormProps {
  /** Event to book */
  event: CalendarEvent;
  /** Trainer information */
  trainer: TrainerData;
  /** Loading state */
  loading?: boolean;
  /** Submit handler */
  onSubmit: (bookingData: BookingData) => Promise<void>;
  /** Cancel handler */
  onCancel: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Form validation errors
 */
interface ValidationErrors {
  // Client Info
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  
  // Emergency Contact
  emergencyName?: string;
  emergencyPhone?: string;
  
  // Medical & Goals
  medicalConditions?: string;
  fitnessGoals?: string;
  
  // Terms
  terms?: string;
  liability?: string;
}

/**
 * Booking Form Component
 */
const BookingForm: React.FC<BookingFormProps> = ({
  event,
  trainer,
  loading = false,
  onSubmit,
  onCancel,
  className = ''
}) => {
  
  // ===== STATE =====
  
  const [formData, setFormData] = useState<Partial<BookingData>>({
    eventId: event.id as number,
    clientInfo: {
      name: '',
      email: '',
      phone: '',
      preferences: {
        communicationMethod: 'email'
      }
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalConditions: '',
    fitnessGoals: '',
    bookingNotes: '',
    bookingStatus: 'pending'
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedLiability, setAcceptedLiability] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // ===== EFFECTS =====
  
  // Initialize form data
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      eventId: event.id as number,
      bookingDate: new Date().toISOString()
    }));
  }, [event.id]);
  
  // ===== FORM HANDLING =====
  
  const handleInputChange = useCallback((field: string, value: any) => {
    const fieldParts = field.split('.');
    
    setFormData(prev => {
      const newData = { ...prev };
      
      if (fieldParts.length === 1) {
        // Top-level field
        (newData as any)[field] = value;
      } else if (fieldParts.length === 2) {
        // Nested field (e.g., clientInfo.name)
        const [parent, child] = fieldParts;
        (newData as any)[parent] = {
          ...(newData as any)[parent],
          [child]: value
        };
      } else if (fieldParts.length === 3) {
        // Double nested field (e.g., clientInfo.preferences.communicationMethod)
        const [parent, child, grandchild] = fieldParts;
        (newData as any)[parent] = {
          ...(newData as any)[parent],
          [child]: {
            ...((newData as any)[parent]?.[child] || {}),
            [grandchild]: value
          }
        };
      }
      
      return newData;
    });
    
    // Clear error for this field
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);
  
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (step === 1) {
      // Client Information
      if (!formData.clientInfo?.name?.trim()) {
        newErrors.clientName = 'Full name is required';
      }
      
      if (!formData.clientInfo?.email?.trim()) {
        newErrors.clientEmail = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientInfo.email)) {
        newErrors.clientEmail = 'Please enter a valid email address';
      }
      
      if (!formData.clientInfo?.phone?.trim()) {
        newErrors.clientPhone = 'Phone number is required';
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.clientInfo.phone.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.clientPhone = 'Please enter a valid phone number';
      }
    }
    
    if (step === 2) {
      // Emergency Contact
      if (!formData.emergencyContact?.name?.trim()) {
        newErrors.emergencyName = 'Emergency contact name is required';
      }
      
      if (!formData.emergencyContact?.phone?.trim()) {
        newErrors.emergencyPhone = 'Emergency contact phone is required';
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.emergencyContact.phone.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.emergencyPhone = 'Please enter a valid phone number';
      }
    }
    
    if (step === 3) {
      // Terms and Conditions
      if (!acceptedTerms) {
        newErrors.terms = 'You must accept the terms and conditions';
      }
      
      if (!acceptedLiability) {
        newErrors.liability = 'You must accept the liability waiver';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, acceptedTerms, acceptedLiability]);
  
  const handleNextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  }, [currentStep, validateStep]);
  
  const handlePrevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const bookingData: BookingData = {
        eventId: event.id as number,
        clientInfo: formData.clientInfo as ClientInfo,
        emergencyContact: formData.emergencyContact as EmergencyContact,
        medicalConditions: formData.medicalConditions || '',
        fitnessGoals: formData.fitnessGoals || '',
        bookingNotes: formData.bookingNotes || '',
        bookingStatus: 'pending',
        bookingDate: new Date().toISOString()
      };
      
      await onSubmit(bookingData);
    } catch (error) {
      console.error('Error submitting booking:', error);
      // Handle error (could show toast notification)
    } finally {
      setSubmitting(false);
    }
  }, [event.id, formData, validateStep, onSubmit]);
  
  // ===== RENDER HELPERS =====
  
  const renderFormField = (
    label: string,
    field: string,
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select',
    options?: { value: string; label: string }[],
    placeholder?: string,
    required = false
  ) => {
    const fieldParts = field.split('.');
    let value = formData as any;
    
    for (const part of fieldParts) {
      value = value?.[part];
    }
    
    const error = errors[field as keyof ValidationErrors];
    
    return (
      <div className="booking-form__field">
        <label className="booking-form__label">
          {label}
          {required && <span className="required">*</span>}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            className={`booking-form__input ${error ? 'error' : ''}`}
            value={value || ''}
            placeholder={placeholder}
            onChange={(e) => handleInputChange(field, e.target.value)}
            rows={4}
          />
        ) : type === 'select' ? (
          <select
            className={`booking-form__input ${error ? 'error' : ''}`}
            value={value || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
          >
            <option value="">Select...</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            className={`booking-form__input ${error ? 'error' : ''}`}
            value={value || ''}
            placeholder={placeholder}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        )}
        
        {error && (
          <span className="booking-form__error">{error}</span>
        )}
      </div>
    );
  };
  
  const formatEventDateTime = () => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    
    return {
      date: startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: `${startDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })} - ${endDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`
    };
  };
  
  const getRelationshipOptions = () => [
    { value: 'spouse', label: 'Spouse/Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'other', label: 'Other' }
  ];
  
  const getCommunicationOptions = () => [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'sms', label: 'SMS/Text' }
  ];
  
  // ===== RENDER =====
  
  const eventDateTime = formatEventDateTime();
  
  return (
    <div className={`booking-form ${className}`}>
      {/* Event Summary */}
      <div className="booking-form__summary">
        <h2 className="booking-form__title">Book Training Session</h2>
        
        <div className="booking-form__event-details">
          <div className="event-info">
            <h3>{event.title}</h3>
            <p className="event-datetime">
              {eventDateTime.date} at {eventDateTime.time}
            </p>
            {event.location && (
              <p className="event-location">📍 {event.location}</p>
            )}
          </div>
          
          <div className="trainer-info">
            {trainer.imageUrl && (
              <img
                src={trainer.imageUrl}
                alt={trainer.name}
                className="trainer-avatar"
              />
            )}
            <div className="trainer-details">
              <h4>{trainer.name}</h4>
              <p>{trainer.specialty}</p>
              <p>{trainer.yearsExperience} years experience</p>
            </div>
          </div>
        </div>
        
        {event.price && (
          <div className="booking-form__pricing">
            <span className="price">
              {event.currency === 'USD' ? '$' : event.currency}{event.price}
            </span>
          </div>
        )}
      </div>
      
      {/* Progress Indicator */}
      <div className="booking-form__progress">
        <div className="progress-steps">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`progress-step ${
                step === currentStep ? 'active' : 
                step < currentStep ? 'completed' : ''
              }`}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 ? 'Personal Info' :
                 step === 2 ? 'Emergency Contact' : 'Review & Confirm'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Form Content */}
      <form className="booking-form__form" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="booking-form__step">
            <h3 className="step-title">Personal Information</h3>
            
            <div className="booking-form__grid">
              {renderFormField('Full Name', 'clientInfo.name', 'text', undefined, 'Enter your full name', true)}
              {renderFormField('Email Address', 'clientInfo.email', 'email', undefined, 'Enter your email address', true)}
              {renderFormField('Phone Number', 'clientInfo.phone', 'tel', undefined, 'Enter your phone number', true)}
              {renderFormField('Preferred Communication', 'clientInfo.preferences.communicationMethod', 'select', getCommunicationOptions())}
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="booking-form__step">
            <h3 className="step-title">Emergency Contact & Health Information</h3>
            
            <div className="booking-form__section">
              <h4>Emergency Contact</h4>
              <div className="booking-form__grid">
                {renderFormField('Contact Name', 'emergencyContact.name', 'text', undefined, 'Emergency contact full name', true)}
                {renderFormField('Contact Phone', 'emergencyContact.phone', 'tel', undefined, 'Emergency contact phone number', true)}
                {renderFormField('Relationship', 'emergencyContact.relationship', 'select', getRelationshipOptions())}
              </div>
            </div>
            
            <div className="booking-form__section">
              <h4>Health & Fitness Information</h4>
              <div className="booking-form__grid">
                {renderFormField('Medical Conditions', 'medicalConditions', 'textarea', undefined, 'Please list any medical conditions, injuries, or health concerns we should be aware of')}
                {renderFormField('Fitness Goals', 'fitnessGoals', 'textarea', undefined, 'What are your fitness goals for this training session?')}
                {renderFormField('Additional Notes', 'bookingNotes', 'textarea', undefined, 'Any additional information or special requests')}
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="booking-form__step">
            <h3 className="step-title">Review & Confirm</h3>
            
            {/* Booking Summary */}
            <div className="booking-form__review">
              <div className="review-section">
                <h4>Session Details</h4>
                <div className="review-item">
                  <span className="label">Event:</span>
                  <span className="value">{event.title}</span>
                </div>
                <div className="review-item">
                  <span className="label">Date & Time:</span>
                  <span className="value">{eventDateTime.date} at {eventDateTime.time}</span>
                </div>
                <div className="review-item">
                  <span className="label">Trainer:</span>
                  <span className="value">{trainer.name}</span>
                </div>
                {event.location && (
                  <div className="review-item">
                    <span className="label">Location:</span>
                    <span className="value">{event.location}</span>
                  </div>
                )}
                {event.price && (
                  <div className="review-item">
                    <span className="label">Price:</span>
                    <span className="value">
                      {event.currency === 'USD' ? '$' : event.currency}{event.price}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="review-section">
                <h4>Your Information</h4>
                <div className="review-item">
                  <span className="label">Name:</span>
                  <span className="value">{formData.clientInfo?.name}</span>
                </div>
                <div className="review-item">
                  <span className="label">Email:</span>
                  <span className="value">{formData.clientInfo?.email}</span>
                </div>
                <div className="review-item">
                  <span className="label">Phone:</span>
                  <span className="value">{formData.clientInfo?.phone}</span>
                </div>
                <div className="review-item">
                  <span className="label">Emergency Contact:</span>
                  <span className="value">
                    {formData.emergencyContact?.name} ({formData.emergencyContact?.phone})
                  </span>
                </div>
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="booking-form__terms">
              <div className="terms-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">
                    I agree to the <a href="#" target="_blank">Terms and Conditions</a>
                  </span>
                </label>
                {errors.terms && (
                  <span className="booking-form__error">{errors.terms}</span>
                )}
              </div>
              
              <div className="terms-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={acceptedLiability}
                    onChange={(e) => setAcceptedLiability(e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">
                    I acknowledge and accept the <a href="#" target="_blank">Liability Waiver</a>
                  </span>
                </label>
                {errors.liability && (
                  <span className="booking-form__error">{errors.liability}</span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="booking-form__actions">
          {currentStep > 1 && (
            <button
              type="button"
              className="booking-form__button booking-form__button--secondary"
              onClick={handlePrevStep}
              disabled={submitting}
            >
              Previous
            </button>
          )}
          
          <button
            type="button"
            className="booking-form__button booking-form__button--secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          
          {currentStep < 3 ? (
            <button
              type="button"
              className="booking-form__button booking-form__button--primary"
              onClick={handleNextStep}
              disabled={loading}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="booking-form__button booking-form__button--primary"
              disabled={submitting || loading}
            >
              {submitting ? (
                <>
                  <div className="spinner"></div>
                  Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          )}
        </div>
      </form>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="booking-form__loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Processing your booking...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm; 