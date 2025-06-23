/**
 * Group Fitness Class Event Module Tests
 * 
 * Comprehensive test suite for Group Fitness Class events
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../../interfaces';
import {
  getGroupClassSpecificErrors,
  getGroupFitnessClassFormConfig,
  GroupFitnessClassConfig,
  GroupFitnessClassModule,
  isGroupFitnessClass,
  isGroupFitnessClassEvent,
  validateGroupFitnessClass
} from './index';

describe('Group Fitness Class Event Module', () => {
  
  // ===== CONFIGURATION TESTS =====
  
  describe('GroupFitnessClassConfig', () => {
    it('should have correct basic configuration', () => {
      expect(GroupFitnessClassConfig.id).toBe('group_fitness_class');
      expect(GroupFitnessClassConfig.title).toBe('Online Group Fitness Class (45 Min)');
      expect(GroupFitnessClassConfig.category).toBe('class');
    });
    
    it('should have 45-minute fixed duration', () => {
      expect(GroupFitnessClassConfig.defaultDuration).toBe(45);
      expect(GroupFitnessClassConfig.requiresDuration).toBe(false);
      expect(GroupFitnessClassConfig.availableDurations).toEqual([45]);
    });
    
    it('should be configured for group sessions', () => {
      expect(GroupFitnessClassConfig.minParticipants).toBe(1);
      expect(GroupFitnessClassConfig.maxParticipants).toBe(20);
      expect(GroupFitnessClassConfig.defaultSessionType).toBe('group');
      expect(GroupFitnessClassConfig.defaultEventType).toBe('group_class');
    });
    
    it('should support pricing', () => {
      expect(GroupFitnessClassConfig.defaultPrice).toBe(25);
      expect(GroupFitnessClassConfig.supportsPricing).toBe(true);
    });
    
    it('should require location selection', () => {
      expect(GroupFitnessClassConfig.requiresLocation).toBe(true);
    });
  });
  
  // ===== MODULE TESTS =====
  
  describe('GroupFitnessClassModule', () => {
    it('should have correct configuration reference', () => {
      expect(GroupFitnessClassModule.config).toBe(GroupFitnessClassConfig);
    });
    
    it('should have validator function', () => {
      expect(GroupFitnessClassModule.validator).toBe(validateGroupFitnessClass);
    });
    
    it('should return duration options without empty option', () => {
      const options = GroupFitnessClassModule.getDurationOptions();
      expect(options).toEqual([
        { value: 45, label: '45 Min' }
      ]);
    });
    
    it('should return correct form defaults', () => {
      const defaults = GroupFitnessClassModule.getFormDefaults();
      expect(defaults.title).toBe('Online Group Fitness Class (45 Min)');
      expect(defaults.duration).toBe(45);
      expect(defaults.price).toBe(25);
      expect(defaults.maxParticipants).toBe(20);
      expect(defaults.sessionType).toBe('group');
      expect(defaults.eventType).toBe('group_class');
    });
  });
  
  // ===== VALIDATION TESTS =====
  
  describe('validateGroupFitnessClass', () => {
    const validFormData: Partial<CalendarEvent> = {
      title: 'Online Group Fitness Class (45 Min)',
      duration: 45,
      location: 'google_meet',
      sessionType: 'group',
      maxParticipants: 20,
      price: 25,
      eventType: 'group_class'
    };
    
    it('should pass validation for valid group class data', () => {
      const errors = validateGroupFitnessClass(validFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });
    
    it('should require correct title', () => {
      const errors = validateGroupFitnessClass({
        ...validFormData,
        title: 'Wrong Title'
      });
      expect(errors.title).toBe('Invalid group class type selected');
    });
    
    it('should require 45-minute duration if duration is provided', () => {
      const errors = validateGroupFitnessClass({
        ...validFormData,
        duration: 60
      });
      expect(errors.duration).toBe('Group fitness classes are 45 minutes long');
    });
    
    it('should require group session type', () => {
      const errors = validateGroupFitnessClass({
        ...validFormData,
        sessionType: 'individual'
      });
      expect(errors.sessionType).toBe('Group fitness classes must be group sessions');
    });
    
    it('should validate participant limits', () => {
      const errors1 = validateGroupFitnessClass({
        ...validFormData,
        maxParticipants: 0
      });
      expect(errors1.maxParticipants).toBe('Group classes must allow at least 1 participant');
      
      const errors2 = validateGroupFitnessClass({
        ...validFormData,
        maxParticipants: 60
      });
      expect(errors2.maxParticipants).toBe('Group classes cannot exceed 50 participants for quality instruction');
    });
    
    it('should validate pricing', () => {
      const errors = validateGroupFitnessClass({
        ...validFormData,
        price: -10
      });
      expect(errors.price).toBe('Group class price cannot be negative');
    });
    
    it('should require location', () => {
      const errors = validateGroupFitnessClass({
        ...validFormData,
        location: ''
      });
      expect(errors.location).toBe('Please select a location for the group class');
    });
    
    it('should require group_class event type', () => {
      const errors = validateGroupFitnessClass({
        ...validFormData,
        eventType: 'session'
      });
      expect(errors.eventType).toBe('Group fitness classes must be group_class type events');
    });
  });
  
  // ===== HELPER FUNCTION TESTS =====
  
  describe('isGroupFitnessClass', () => {
    it('should return true for Group Fitness Class title', () => {
      const formData = { title: 'Online Group Fitness Class (45 Min)' };
      expect(isGroupFitnessClass(formData)).toBe(true);
    });
    
    it('should return false for other titles', () => {
      const formData = { title: 'Personal Training Session' };
      expect(isGroupFitnessClass(formData)).toBe(false);
    });
    
    it('should return false for empty title', () => {
      const formData = { title: '' };
      expect(isGroupFitnessClass(formData)).toBe(false);
    });
  });
  
  describe('isGroupFitnessClassEvent', () => {
    it('should return true for Group Fitness Class events', () => {
      const formData = { title: 'Online Group Fitness Class (45 Min)' };
      expect(isGroupFitnessClassEvent(formData)).toBe(true);
    });
    
    it('should return false for other events', () => {
      const formData = { title: 'Free Consultation (20 Min)' };
      expect(isGroupFitnessClassEvent(formData)).toBe(false);
    });
  });
  
  describe('getGroupFitnessClassFormConfig', () => {
    it('should return correct form configuration', () => {
      const config = getGroupFitnessClassFormConfig();
      expect(config.showDurationField).toBe(false);
      expect(config.descriptionReadonly).toBe(true);
      expect(config.showPriceField).toBe(true);
      expect(config.maxParticipantsDefault).toBe(20);
      expect(config.sessionTypeOptions).toEqual([
        { value: 'group', label: 'Group' }
      ]);
      expect(config.eventTypeFixed).toBe('group_class');
      expect(config.allowWaitlist).toBe(true);
      expect(config.autoConfirmBookings).toBe(false);
      expect(config.requirePaymentUpfront).toBe(true);
      expect(config.placeholderText.specialInstructions).toContain('fitness experience');
    });
  });
  
  describe('getGroupClassSpecificErrors', () => {
    it('should validate capacity management', () => {
      const formData = {
        currentParticipants: 25,
        maxParticipants: 20
      };
      const errors = getGroupClassSpecificErrors(formData);
      expect(errors.currentParticipants).toBe('Current participants cannot exceed maximum capacity');
    });
    
    it('should validate completed classes have participants', () => {
      const formData = {
        bookingStatus: 'completed',
        currentParticipants: 0
      };
      const errors = getGroupClassSpecificErrors(formData as any);
      expect(errors.currentParticipants).toBe('Completed classes must have at least one participant');
    });
    
    it('should validate trainer assignment for booked classes', () => {
      const formData = {
        currentParticipants: 5,
        trainerId: undefined
      };
      const errors = getGroupClassSpecificErrors(formData);
      expect(errors.trainerId).toBe('A trainer must be assigned for group classes with participants');
    });
    
    it('should warn about high pricing', () => {
      const formData = {
        price: 150,
        currentParticipants: 10
      };
      const errors = getGroupClassSpecificErrors(formData);
      expect(errors.price).toBe('Group class price seems unusually high (>$100). Please verify.');
    });
  });
  
  // ===== INTEGRATION TESTS =====
  
  describe('Integration Tests', () => {
    it('should work with complete workflow', () => {
      // 1. Get form defaults
      const defaults = GroupFitnessClassModule.getFormDefaults();
      
      // 2. Validate the defaults
      const errors = GroupFitnessClassModule.validator(defaults);
      
      // 3. Should only fail on location (not provided in defaults)
      expect(Object.keys(errors)).toEqual(['location']);
      
      // 4. Add location and revalidate
      const completeData = { ...defaults, location: 'google_meet' };
      const finalErrors = GroupFitnessClassModule.validator(completeData);
      
      // 5. Should pass validation
      expect(Object.keys(finalErrors)).toHaveLength(0);
    });
    
    it('should identify group class events correctly', () => {
      const groupClassData = GroupFitnessClassModule.getFormDefaults();
      expect(isGroupFitnessClassEvent(groupClassData)).toBe(true);
      
      const otherEventData = { title: 'Personal Training Session' };
      expect(isGroupFitnessClassEvent(otherEventData)).toBe(false);
    });
    
    it('should handle capacity and pricing correctly', () => {
      const defaults = GroupFitnessClassModule.getFormDefaults();
      expect(defaults.maxParticipants).toBe(20);
      expect(defaults.price).toBe(25);
      expect(defaults.sessionType).toBe('group');
      expect(defaults.eventType).toBe('group_class');
    });
  });
}); 