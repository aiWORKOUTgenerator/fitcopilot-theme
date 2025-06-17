/**
 * Personal Training Session Event Module Tests
 * 
 * Comprehensive test suite for Personal Training Session events
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../../interfaces';
import {
    getPersonalTrainingSessionFormConfig,
    getPersonalTrainingSpecificErrors,
    getSuggestedPricing,
    isPersonalTrainingSession,
    isPersonalTrainingSessionEvent,
    isValidDuration,
    PersonalTrainingSessionConfig,
    PersonalTrainingSessionModule,
    validatePersonalTrainingSession
} from './index';

describe('Personal Training Session Event Module', () => {
  
  // ===== CONFIGURATION TESTS =====
  
  describe('PersonalTrainingSessionConfig', () => {
    it('should have correct basic configuration', () => {
      expect(PersonalTrainingSessionConfig.id).toBe('personal_training_session');
      expect(PersonalTrainingSessionConfig.title).toBe('Personal Training Session');
      expect(PersonalTrainingSessionConfig.category).toBe('training');
    });
    
    it('should require duration selection', () => {
      expect(PersonalTrainingSessionConfig.defaultDuration).toBeUndefined();
      expect(PersonalTrainingSessionConfig.requiresDuration).toBe(true);
      expect(PersonalTrainingSessionConfig.availableDurations).toEqual([30, 45, 60]);
    });
    
    it('should be configured for individual sessions', () => {
      expect(PersonalTrainingSessionConfig.minParticipants).toBe(1);
      expect(PersonalTrainingSessionConfig.maxParticipants).toBe(1);
      expect(PersonalTrainingSessionConfig.defaultSessionType).toBe('individual');
      expect(PersonalTrainingSessionConfig.defaultEventType).toBe('session');
    });
    
    it('should support pricing', () => {
      expect(PersonalTrainingSessionConfig.defaultPrice).toBe(85);
      expect(PersonalTrainingSessionConfig.supportsPricing).toBe(true);
    });
    
    it('should require location selection', () => {
      expect(PersonalTrainingSessionConfig.requiresLocation).toBe(true);
    });
  });
  
  // ===== MODULE TESTS =====
  
  describe('PersonalTrainingSessionModule', () => {
    it('should have correct configuration reference', () => {
      expect(PersonalTrainingSessionModule.config).toBe(PersonalTrainingSessionConfig);
    });
    
    it('should have validator function', () => {
      expect(PersonalTrainingSessionModule.validator).toBe(validatePersonalTrainingSession);
    });
    
    it('should return duration options with empty option', () => {
      const options = PersonalTrainingSessionModule.getDurationOptions();
      expect(options).toEqual([
        { value: '', label: '- Select Duration -' },
        { value: 30, label: '30 Min' },
        { value: 45, label: '45 Min' },
        { value: 60, label: '60 Min' }
      ]);
    });
    
    it('should return correct form defaults', () => {
      const defaults = PersonalTrainingSessionModule.getFormDefaults();
      expect(defaults.title).toBe('Personal Training Session');
      expect(defaults.duration).toBeUndefined(); // No default duration
      expect(defaults.price).toBe(85);
      expect(defaults.maxParticipants).toBe(1);
      expect(defaults.sessionType).toBe('individual');
      expect(defaults.eventType).toBe('session');
    });
  });
  
  // ===== VALIDATION TESTS =====
  
  describe('validatePersonalTrainingSession', () => {
    const validFormData: Partial<CalendarEvent> = {
      title: 'Personal Training Session',
      duration: 45,
      location: 'google_meet',
      sessionType: 'individual',
      maxParticipants: 1,
      price: 85,
      eventType: 'session'
    };
    
    it('should pass validation for valid training session data', () => {
      const errors = validatePersonalTrainingSession(validFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });
    
    it('should require correct title', () => {
      const errors = validatePersonalTrainingSession({
        ...validFormData,
        title: 'Wrong Title'
      });
      expect(errors.title).toBe('Invalid training session type selected');
    });
    
    it('should require duration selection', () => {
      const errors1 = validatePersonalTrainingSession({
        ...validFormData,
        duration: undefined
      });
      expect(errors1.duration).toBe('Please select a duration for the training session');
      
      const errors2 = validatePersonalTrainingSession({
        ...validFormData,
        duration: 90 // Invalid duration
      });
      expect(errors2.duration).toBe('Please select a valid duration (30, 45, or 60 minutes)');
    });
    
    it('should require individual session type', () => {
      const errors = validatePersonalTrainingSession({
        ...validFormData,
        sessionType: 'group'
      });
      expect(errors.sessionType).toBe('Personal training sessions must be individual sessions');
    });
    
    it('should validate participant limits', () => {
      const errors = validatePersonalTrainingSession({
        ...validFormData,
        maxParticipants: 2
      });
      expect(errors.maxParticipants).toBe('Personal training sessions are limited to one participant');
    });
    
    it('should validate pricing', () => {
      const errors1 = validatePersonalTrainingSession({
        ...validFormData,
        price: -10
      });
      expect(errors1.price).toBe('Training session price cannot be negative');
      
      const errors2 = validatePersonalTrainingSession({
        ...validFormData,
        price: 20 // Too low
      });
      expect(errors2.price).toBe('Personal training session price seems unusually low. Please verify.');
    });
    
    it('should require location', () => {
      const errors = validatePersonalTrainingSession({
        ...validFormData,
        location: ''
      });
      expect(errors.location).toBe('Please select a location for the training session');
    });
    
    it('should require session event type', () => {
      const errors = validatePersonalTrainingSession({
        ...validFormData,
        eventType: 'group_class'
      });
      expect(errors.eventType).toBe('Personal training sessions must be session type events');
    });
  });
  
  // ===== HELPER FUNCTION TESTS =====
  
  describe('isPersonalTrainingSession', () => {
    it('should return true for Personal Training Session title', () => {
      const formData = { title: 'Personal Training Session' };
      expect(isPersonalTrainingSession(formData)).toBe(true);
    });
    
    it('should return false for other titles', () => {
      const formData = { title: 'Free Consultation (20 Min)' };
      expect(isPersonalTrainingSession(formData)).toBe(false);
    });
    
    it('should return false for empty title', () => {
      const formData = { title: '' };
      expect(isPersonalTrainingSession(formData)).toBe(false);
    });
  });
  
  describe('isPersonalTrainingSessionEvent', () => {
    it('should return true for Personal Training Session events', () => {
      const formData = { title: 'Personal Training Session' };
      expect(isPersonalTrainingSessionEvent(formData)).toBe(true);
    });
    
    it('should return false for other events', () => {
      const formData = { title: 'Online Group Fitness Class (45 Min)' };
      expect(isPersonalTrainingSessionEvent(formData)).toBe(false);
    });
  });
  
  describe('getPersonalTrainingSessionFormConfig', () => {
    it('should return correct form configuration', () => {
      const config = getPersonalTrainingSessionFormConfig();
      expect(config.showDurationField).toBe(true);
      expect(config.durationRequired).toBe(true);
      expect(config.descriptionReadonly).toBe(true);
      expect(config.showPriceField).toBe(true);
      expect(config.maxParticipantsFixed).toBe(1);
      expect(config.sessionTypeOptions).toEqual([
        { value: 'individual', label: 'Individual' }
      ]);
      expect(config.eventTypeFixed).toBe('session');
      expect(config.requireTrainerSelection).toBe(true);
      expect(config.allowRescheduling).toBe(true);
      expect(config.requirePaymentUpfront).toBe(true);
      expect(config.placeholderText.specialInstructions).toContain('fitness goals');
    });
  });
  
  describe('getSuggestedPricing', () => {
    it('should return pricing for valid durations', () => {
      const pricing30 = getSuggestedPricing(30);
      expect(pricing30).toEqual({ min: 40, max: 70, suggested: 55 });
      
      const pricing45 = getSuggestedPricing(45);
      expect(pricing45).toEqual({ min: 60, max: 100, suggested: 85 });
      
      const pricing60 = getSuggestedPricing(60);
      expect(pricing60).toEqual({ min: 80, max: 130, suggested: 110 });
    });
    
    it('should return null for invalid durations', () => {
      expect(getSuggestedPricing(90)).toBeNull();
      expect(getSuggestedPricing(15)).toBeNull();
    });
  });
  
  describe('isValidDuration', () => {
    it('should validate duration options', () => {
      expect(isValidDuration(30)).toBe(true);
      expect(isValidDuration(45)).toBe(true);
      expect(isValidDuration(60)).toBe(true);
      expect(isValidDuration(90)).toBe(false);
      expect(isValidDuration(15)).toBe(false);
    });
  });
  
  describe('getPersonalTrainingSpecificErrors', () => {
    it('should validate trainer assignment for booked sessions', () => {
      const formData = {
        currentParticipants: 1,
        trainerId: undefined
      };
      const errors = getPersonalTrainingSpecificErrors(formData);
      expect(errors.trainerId).toBe('A trainer must be assigned for booked personal training sessions');
    });
    
    it('should validate completed sessions have participants', () => {
      const formData = {
        bookingStatus: 'completed',
        currentParticipants: 0
      };
      const errors = getPersonalTrainingSpecificErrors(formData as any);
      expect(errors.currentParticipants).toBe('Completed training sessions must have a participant');
    });
    
    it('should validate confirmed sessions have pricing', () => {
      const formData = {
        bookingStatus: 'confirmed',
        price: 0
      };
      const errors = getPersonalTrainingSpecificErrors(formData as any);
      expect(errors.price).toBe('Confirmed personal training sessions should have pricing information');
    });
    
    it('should validate duration-based pricing', () => {
      const formData1 = {
        duration: 60,
        price: 30 // Too low per minute
      };
      const errors1 = getPersonalTrainingSpecificErrors(formData1);
      expect(errors1.price).toBe('Training session price seems low for the selected duration');
      
      const formData2 = {
        duration: 30,
        price: 120 // Too high per minute
      };
      const errors2 = getPersonalTrainingSpecificErrors(formData2);
      expect(errors2.price).toBe('Training session price seems high for the selected duration');
    });
    
    it('should validate capacity limits', () => {
      const formData = {
        currentParticipants: 2
      };
      const errors = getPersonalTrainingSpecificErrors(formData);
      expect(errors.currentParticipants).toBe('Personal training sessions can only have one participant');
    });
  });
  
  // ===== INTEGRATION TESTS =====
  
  describe('Integration Tests', () => {
    it('should work with complete workflow', () => {
      // 1. Get form defaults
      const defaults = PersonalTrainingSessionModule.getFormDefaults();
      
      // 2. Validate the defaults
      const errors = PersonalTrainingSessionModule.validator(defaults);
      
      // 3. Should fail on duration and location (not provided in defaults)
      expect(Object.keys(errors).sort()).toEqual(['duration', 'location']);
      
      // 4. Add required fields and revalidate
      const completeData = { 
        ...defaults, 
        duration: 45, 
        location: 'google_meet' 
      };
      const finalErrors = PersonalTrainingSessionModule.validator(completeData);
      
      // 5. Should pass validation
      expect(Object.keys(finalErrors)).toHaveLength(0);
    });
    
    it('should identify training session events correctly', () => {
      const trainingData = PersonalTrainingSessionModule.getFormDefaults();
      expect(isPersonalTrainingSessionEvent(trainingData)).toBe(true);
      
      const otherEventData = { title: 'Free Consultation (20 Min)' };
      expect(isPersonalTrainingSessionEvent(otherEventData)).toBe(false);
    });
    
    it('should handle duration and pricing correctly', () => {
      const defaults = PersonalTrainingSessionModule.getFormDefaults();
      expect(defaults.duration).toBeUndefined(); // Must be selected
      expect(defaults.price).toBe(85); // Default pricing
      expect(defaults.sessionType).toBe('individual');
      expect(defaults.eventType).toBe('session');
      
      // Test pricing suggestions
      const pricing = getSuggestedPricing(45);
      expect(pricing?.suggested).toBe(85); // Matches default
    });
    
    it('should validate complex training session scenarios', () => {
      // Scenario: Confirmed session with participant
      const confirmedSession = {
        title: 'Personal Training Session',
        duration: 60,
        location: 'google_meet',
        sessionType: 'individual',
        maxParticipants: 1,
        currentParticipants: 1,
        price: 110,
        eventType: 'session',
        bookingStatus: 'confirmed',
        trainerId: 'trainer-123'
      };
      
      const errors = validatePersonalTrainingSession(confirmedSession as any);
      expect(Object.keys(errors)).toHaveLength(0);
      
      // Additional specific validation
      const specificErrors = getPersonalTrainingSpecificErrors(confirmedSession as any);
      expect(Object.keys(specificErrors)).toHaveLength(0);
    });
  });
}); 