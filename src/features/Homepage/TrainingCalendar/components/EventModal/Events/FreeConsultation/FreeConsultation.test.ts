/**
 * Free Consultation Event Module Tests
 * 
 * Comprehensive test suite for Free Consultation events
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../../interfaces';
import {
  FreeConsultationConfig,
  FreeConsultationModule,
  getFreeConsultationFormConfig,
  isFreeConsultation,
  isFreeConsultationEvent,
  validateFreeConsultation
} from './index';

describe('Free Consultation Event Module', () => {
  
  // ===== CONFIGURATION TESTS =====
  
  describe('FreeConsultationConfig', () => {
    it('should have correct basic configuration', () => {
      expect(FreeConsultationConfig.id).toBe('free_consultation');
      expect(FreeConsultationConfig.title).toBe('Free Consultation (20 Min)');
      expect(FreeConsultationConfig.category).toBe('consultation');
    });
    
    it('should have 20-minute fixed duration', () => {
      expect(FreeConsultationConfig.defaultDuration).toBe(20);
      expect(FreeConsultationConfig.requiresDuration).toBe(false);
      expect(FreeConsultationConfig.availableDurations).toEqual([20]);
    });
    
    it('should be configured for individual sessions', () => {
      expect(FreeConsultationConfig.minParticipants).toBe(1);
      expect(FreeConsultationConfig.maxParticipants).toBe(1);
      expect(FreeConsultationConfig.defaultSessionType).toBe('individual');
    });
    
    it('should be free of charge', () => {
      expect(FreeConsultationConfig.defaultPrice).toBe(0);
      expect(FreeConsultationConfig.supportsPricing).toBe(false);
    });
    
    it('should require location selection', () => {
      expect(FreeConsultationConfig.requiresLocation).toBe(true);
    });
  });
  
  // ===== MODULE TESTS =====
  
  describe('FreeConsultationModule', () => {
    it('should have correct configuration reference', () => {
      expect(FreeConsultationModule.config).toBe(FreeConsultationConfig);
    });
    
    it('should have validator function', () => {
      expect(FreeConsultationModule.validator).toBe(validateFreeConsultation);
    });
    
    it('should return duration options without empty option', () => {
      const options = FreeConsultationModule.getDurationOptions();
      expect(options).toEqual([
        { value: 20, label: '20 Min' }
      ]);
    });
    
    it('should return correct form defaults', () => {
      const defaults = FreeConsultationModule.getFormDefaults();
      expect(defaults.title).toBe('Free Consultation (20 Min)');
      expect(defaults.duration).toBe(20);
      expect(defaults.price).toBe(0);
      expect(defaults.maxParticipants).toBe(1);
      expect(defaults.sessionType).toBe('individual');
    });
  });
  
  // ===== VALIDATION TESTS =====
  
  describe('validateFreeConsultation', () => {
    const validFormData: Partial<CalendarEvent> = {
      title: 'Free Consultation (20 Min)',
      duration: 20,
      location: 'google_meet',
      sessionType: 'individual',
      maxParticipants: 1,
      price: 0
    };
    
    it('should pass validation for valid consultation data', () => {
      const errors = validateFreeConsultation(validFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });
    
    it('should require correct title', () => {
      const errors = validateFreeConsultation({
        ...validFormData,
        title: 'Wrong Title'
      });
      expect(errors.title).toBe('Invalid consultation type selected');
    });
    
    it('should require 20-minute duration if duration is provided', () => {
      const errors = validateFreeConsultation({
        ...validFormData,
        duration: 30
      });
      expect(errors.duration).toBe('Free consultations are limited to 20 minutes');
    });
    
    it('should require individual session type', () => {
      const errors = validateFreeConsultation({
        ...validFormData,
        sessionType: 'group'
      });
      expect(errors.sessionType).toBe('Free consultations are individual sessions only');
    });
    
    it('should require maximum one participant', () => {
      const errors = validateFreeConsultation({
        ...validFormData,
        maxParticipants: 2
      });
      expect(errors.maxParticipants).toBe('Free consultations are limited to one participant');
    });
    
    it('should not allow pricing', () => {
      const errors = validateFreeConsultation({
        ...validFormData,
        price: 50
      });
      expect(errors.price).toBe('Free consultations cannot have a price');
    });
    
    it('should require location', () => {
      const errors = validateFreeConsultation({
        ...validFormData,
        location: ''
      });
      expect(errors.location).toBe('Please select a location for the consultation');
    });
  });
  
  // ===== HELPER FUNCTION TESTS =====
  
  describe('isFreeConsultation', () => {
    it('should return true for Free Consultation title', () => {
      const formData = { title: 'Free Consultation (20 Min)' };
      expect(isFreeConsultation(formData)).toBe(true);
    });
    
    it('should return false for other titles', () => {
      const formData = { title: 'Personal Training Session' };
      expect(isFreeConsultation(formData)).toBe(false);
    });
    
    it('should return false for empty title', () => {
      const formData = { title: '' };
      expect(isFreeConsultation(formData)).toBe(false);
    });
  });
  
  describe('isFreeConsultationEvent', () => {
    it('should return true for Free Consultation events', () => {
      const formData = { title: 'Free Consultation (20 Min)' };
      expect(isFreeConsultationEvent(formData)).toBe(true);
    });
    
    it('should return false for other events', () => {
      const formData = { title: 'Online Group Fitness Class (45 Min)' };
      expect(isFreeConsultationEvent(formData)).toBe(false);
    });
  });
  
  describe('getFreeConsultationFormConfig', () => {
    it('should return correct form configuration', () => {
      const config = getFreeConsultationFormConfig();
      expect(config.showDurationField).toBe(false);
      expect(config.descriptionReadonly).toBe(true);
      expect(config.showPriceField).toBe(false);
      expect(config.maxParticipantsFixed).toBe(1);
      expect(config.sessionTypeOptions).toEqual([
        { value: 'individual', label: 'Individual' }
      ]);
      expect(config.placeholderText.specialInstructions).toContain('fitness goals');
    });
  });
  
  // ===== INTEGRATION TESTS =====
  
  describe('Integration Tests', () => {
    it('should work with complete workflow', () => {
      // 1. Get form defaults
      const defaults = FreeConsultationModule.getFormDefaults();
      
      // 2. Validate the defaults
      const errors = FreeConsultationModule.validator(defaults);
      
      // 3. Should only fail on location (not provided in defaults)
      expect(Object.keys(errors)).toEqual(['location']);
      
      // 4. Add location and revalidate
      const completeData = { ...defaults, location: 'google_meet' };
      const finalErrors = FreeConsultationModule.validator(completeData);
      
      // 5. Should pass validation
      expect(Object.keys(finalErrors)).toHaveLength(0);
    });
    
    it('should identify consultation events correctly', () => {
      const consultationData = FreeConsultationModule.getFormDefaults();
      expect(isFreeConsultationEvent(consultationData)).toBe(true);
      
      const otherEventData = { title: 'Personal Training Session' };
      expect(isFreeConsultationEvent(otherEventData)).toBe(false);
    });
  });
}); 