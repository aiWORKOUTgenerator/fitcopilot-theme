/**
 * User Registration Modal Component
 * 
 * Modal component for user account creation during event booking workflow
 * Captures user information and creates WordPress accounts
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarEvent, RegisteredUser, UserRegistrationData } from '../../interfaces';
import './UserRegistrationModal.scss';

/**
 * User Registration Modal Props Interface
 */
interface UserRegistrationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Event data that triggered registration */
  eventData: Partial<CalendarEvent>;
  
  /** Loading state */
  loading?: boolean;
  
  /** Success callback with registered user data */
  onUserRegistered: (user: RegisteredUser) => void;
  
  /** Close modal callback */
  onClose: () => void;
  
  /** Skip registration and proceed as guest (optional) */
  onSkipRegistration?: () => void;
  
  /** CSS class name */
  className?: string;
}

/**
 * Form validation errors interface
 */
interface RegistrationErrors {
  email?: string;
  firstName?: string;
  acceptsPrivacyPolicy?: string;
  general?: string;
}

/**
 * User Registration Modal Component
 * 
 * Provides user account creation with:
 * - Email and first name validation
 * - Privacy policy acceptance
 * - WordPress account creation
 * - Error handling and loading states
 * - Accessibility features
 */
const UserRegistrationModal: React.FC<UserRegistrationModalProps> = React.memo(({
  isOpen,
  eventData,
  loading = false,
  onUserRegistered,
  onClose,
  onSkipRegistration,
  className = ''
}) => {
  
  // ===== STATE =====
  
  const [formData, setFormData] = useState<UserRegistrationData>({
    email: '',
    firstName: '',
    acceptsPrivacyPolicy: false
  });
  
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  
  // ===== REFS FOR ACCESSIBILITY =====
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  // ===== EFFECTS =====
  
  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      // Focus the first input when modal opens
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        email: '',
        firstName: '',
        acceptsPrivacyPolicy: false
      });
      setErrors({});
      setIsSubmitting(false);
      setCheckingEmail(false);
      setEmailExists(false);
    }
  }, [isOpen]);
  
  // ===== VALIDATION =====
  
  const validateEmail = useCallback((email: string): string | null => {
    if (!email.trim()) {
      return 'Email address is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return null;
  }, []);
  
  const validateFirstName = useCallback((firstName: string): string | null => {
    if (!firstName.trim()) {
      return 'First name is required';
    }
    
    if (firstName.trim().length < 2) {
      return 'First name must be at least 2 characters';
    }
    
    if (firstName.trim().length > 50) {
      return 'First name must be less than 50 characters';
    }
    
    return null;
  }, []);
  
  const validateForm = useCallback((): boolean => {
    const newErrors: RegistrationErrors = {};
    
    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    // Validate first name
    const firstNameError = validateFirstName(formData.firstName);
    if (firstNameError) {
      newErrors.firstName = firstNameError;
    }
    
    // Validate privacy policy acceptance
    if (!formData.acceptsPrivacyPolicy) {
      newErrors.acceptsPrivacyPolicy = 'You must accept the privacy policy to continue';
    }
    
    // Check if email already exists
    if (emailExists) {
      newErrors.email = 'An account with this email already exists. Please use a different email.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, emailExists, validateEmail, validateFirstName]);
  
  // ===== EMAIL CHECKING =====
  
  const checkEmailExists = useCallback(async (email: string) => {
    if (!email || validateEmail(email)) {
      return;
    }
    
    setCheckingEmail(true);
    
    try {
      // TODO: Implement actual API call to check email existence
      // const { checkEmailExists } = await import('../../services/userRegistrationApi');
      // const exists = await checkEmailExists(email);
      // setEmailExists(exists);
      
      // Placeholder logic for now
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      const mockExistingEmails = ['test@example.com', 'admin@fitcopilot.com'];
      setEmailExists(mockExistingEmails.includes(email.toLowerCase()));
      
    } catch (error) {
      logger.error('Error checking email existence:', error);
      // Don't set emailExists to avoid blocking registration on API errors
    } finally {
      setCheckingEmail(false);
    }
  }, [validateEmail]);
  
  // ===== EVENT HANDLERS =====
  
  const handleInputChange = useCallback((field: keyof UserRegistrationData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific errors when user starts typing
    if (errors[field as keyof RegistrationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Check email existence when email changes
    if (field === 'email' && typeof value === 'string' && value.length > 0) {
      const emailError = validateEmail(value);
      if (!emailError) {
        // Debounce email checking
        const timeoutId = setTimeout(() => {
          checkEmailExists(value);
        }, 750);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [errors, validateEmail, checkEmailExists]);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, general: undefined }));
    
    try {
      // TODO: Implement actual user registration API call
      // const { registerUserWithValidation } = await import('../../services/userRegistrationApi');
      // const result = await registerUserWithValidation(formData);
      
      // Placeholder registration logic
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const mockUser: RegisteredUser = {
        id: Date.now(), // Mock ID
        email: formData.email,
        firstName: formData.firstName,
        username: formData.email.split('@')[0],
      };
      
      logger.info('✅ User registration successful:', mockUser);
      onUserRegistered(mockUser);
      
    } catch (error) {
      logger.error('❌ User registration failed:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Registration failed. Please try again or contact support if the problem persists.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onUserRegistered]);
  
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    
    // Handle Tab navigation with focus trapping
    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [onClose]);
  
  // ===== RENDER =====
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="user-registration-modal__backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div 
        className={`user-registration-modal__container ${className}`}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        aria-modal="true"
        aria-labelledby="registration-modal-title"
        aria-describedby="registration-modal-description"
        role="dialog"
      >
        
        {/* Header */}
        <div className="user-registration-modal__header">
          <h2 id="registration-modal-title" className="user-registration-modal__title">
            Create Your Account
          </h2>
          <button
            className="user-registration-modal__close"
            onClick={onClose}
            aria-label="Close registration modal"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="user-registration-modal__content">
          <div id="registration-modal-description" className="user-registration-modal__description">
            <p>
              To complete your booking for <strong>{eventData.title || 'this event'}</strong>, 
              please create a quick account. This will allow you to:
            </p>
            <ul>
              <li>Receive booking confirmations via email</li>
              <li>View your upcoming appointments</li>
              <li>Manage your fitness journey</li>
            </ul>
          </div>
          
          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="user-registration-modal__form">
            
            {/* General Error */}
            {errors.general && (
              <div className="user-registration-modal__error user-registration-modal__error--general" role="alert">
                {errors.general}
              </div>
            )}
            
            {/* Email Field */}
            <div className="user-registration-modal__field">
              <label 
                className="user-registration-modal__label"
                htmlFor="registration-email"
              >
                Email Address
                <span className="user-registration-modal__required" aria-label="required">*</span>
              </label>
              <div className="user-registration-modal__input-wrapper">
                <input
                  ref={firstInputRef}
                  id="registration-email"
                  type="email"
                  className={`user-registration-modal__input ${errors.email ? 'user-registration-modal__input--error' : ''}`}
                  value={formData.email}
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  autoComplete="email"
                  required
                />
                {checkingEmail && (
                  <div className="user-registration-modal__input-status">
                    <div className="user-registration-modal__spinner"></div>
                    <span>Checking...</span>
                  </div>
                )}
              </div>
              {errors.email && (
                <span id="email-error" className="user-registration-modal__field-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>
            
            {/* First Name Field */}
            <div className="user-registration-modal__field">
              <label 
                className="user-registration-modal__label"
                htmlFor="registration-firstName"
              >
                First Name
                <span className="user-registration-modal__required" aria-label="required">*</span>
              </label>
              <input
                id="registration-firstName"
                type="text"
                className={`user-registration-modal__input ${errors.firstName ? 'user-registration-modal__input--error' : ''}`}
                value={formData.firstName}
                placeholder="Your first name"
                disabled={isSubmitting}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                autoComplete="given-name"
                required
              />
              {errors.firstName && (
                <span id="firstName-error" className="user-registration-modal__field-error" role="alert">
                  {errors.firstName}
                </span>
              )}
            </div>
            
            {/* Privacy Policy Checkbox */}
            <div className="user-registration-modal__field user-registration-modal__field--checkbox">
              <label className="user-registration-modal__checkbox-label">
                <input
                  type="checkbox"
                  className={`user-registration-modal__checkbox ${errors.acceptsPrivacyPolicy ? 'user-registration-modal__checkbox--error' : ''}`}
                  checked={formData.acceptsPrivacyPolicy}
                  disabled={isSubmitting}
                  onChange={(e) => handleInputChange('acceptsPrivacyPolicy', e.target.checked)}
                  aria-invalid={!!errors.acceptsPrivacyPolicy}
                  aria-describedby={errors.acceptsPrivacyPolicy ? 'privacy-error' : undefined}
                  required
                />
                <span className="user-registration-modal__checkbox-text">
                  I accept the{' '}
                  <a 
                    href="/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="user-registration-modal__link"
                  >
                    Privacy Policy
                  </a>
                  {' '}and{' '}
                  <a 
                    href="/terms-of-service" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="user-registration-modal__link"
                  >
                    Terms of Service
                  </a>
                  <span className="user-registration-modal__required" aria-label="required">*</span>
                </span>
              </label>
              {errors.acceptsPrivacyPolicy && (
                <span id="privacy-error" className="user-registration-modal__field-error" role="alert">
                  {errors.acceptsPrivacyPolicy}
                </span>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="user-registration-modal__submit"
              disabled={isSubmitting || checkingEmail || emailExists}
            >
              {isSubmitting ? (
                <>
                  <div className="user-registration-modal__spinner"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account & Book Event'
              )}
            </button>
            
          </form>
          
          {/* Alternative Actions */}
          <div className="user-registration-modal__actions">
            {onSkipRegistration && (
              <button
                type="button"
                className="user-registration-modal__skip"
                onClick={onSkipRegistration}
                disabled={isSubmitting}
              >
                Continue as Guest
              </button>
            )}
            <button
              type="button"
              className="user-registration-modal__cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
          
        </div>
        
      </div>
    </div>
  );
});

UserRegistrationModal.displayName = 'UserRegistrationModal';

export default UserRegistrationModal; 