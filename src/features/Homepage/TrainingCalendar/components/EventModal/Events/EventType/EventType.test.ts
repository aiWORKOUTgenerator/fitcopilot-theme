/**
 * Event Type Module Tests
 * 
 * Tests for the smart scheduling event type system
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import {
  EVENT_TYPE_OPTIONS,
  getAutomaticSelections,
  getDurationOptionsForEventType,
  getEventTypeOption,
  getSmartSchedulingConfig,
  hasAutomaticSelections
} from './EventTypeConfig';
import {
  validateDuration,
  validateEventConfiguration,
  validateEventType
} from './EventTypeValidator';
import {
  createSchedulingEngine,
  findQuickAvailableSlots
} from './SchedulingEngine';
import {
  filterSlotsByPreferences,
  formatTimeSlot
} from './SchedulingUtils';

describe('EventType Module', () => {
  describe('EventTypeConfig', () => {
    test('should have correct event type options', () => {
      expect(EVENT_TYPE_OPTIONS).toHaveLength(4);
      expect(EVENT_TYPE_OPTIONS[0].value).toBe('');
      expect(EVENT_TYPE_OPTIONS[1].value).toBe('Free Consultation (20 Min)');
      expect(EVENT_TYPE_OPTIONS[2].value).toBe('Online Group Fitness Class (45 Min)');
      expect(EVENT_TYPE_OPTIONS[3].value).toBe('Personal Training Session');
    });

    test('should get event type option correctly', () => {
      const consultation = getEventTypeOption('Free Consultation (20 Min)');
      expect(consultation).toBeDefined();
      expect(consultation?.duration).toBe(20);
      expect(consultation?.requiresDuration).toBe(false);

      const personalTraining = getEventTypeOption('Personal Training Session');
      expect(personalTraining).toBeDefined();
      expect(personalTraining?.requiresDuration).toBe(true);
    });

    test('should get duration options for Personal Training', () => {
      const options = getDurationOptionsForEventType('Personal Training Session');
      expect(options).toHaveLength(4); // Default + 3 durations
      expect(options[1].value).toBe(30);
      expect(options[2].value).toBe(45);
      expect(options[3].value).toBe(60);
    });

    test('should get smart scheduling config', () => {
      const config = getSmartSchedulingConfig('Personal Training Session');
      expect(config).toBeDefined();
      expect(config?.enabled).toBe(true);
      expect(config?.minAdvanceHours).toBe(4);
    });

    test('should get automatic selections for Free Consultation', () => {
      const automaticSelections = getAutomaticSelections('Free Consultation (20 Min)');
      expect(automaticSelections).toBeDefined();
      expect(automaticSelections?.eventType).toBe('assessment');
      expect(automaticSelections?.sessionType).toBe('individual');
      expect(automaticSelections?.bookingStatus).toBe('pending');
      expect(automaticSelections?.price).toBe(0);
    });

    test('should return null for automatic selections when not configured', () => {
      const automaticSelections = getAutomaticSelections('Personal Training Session');
      expect(automaticSelections).toBeNull();
    });

    test('should check if event type has automatic selection', () => {
      expect(hasAutomaticSelections('Free Consultation (20 Min)')).toBe(true);
      expect(hasAutomaticSelections('Personal Training Session')).toBe(false);
      expect(hasAutomaticSelections('Invalid Event')).toBe(false);
    });
  });

  describe('EventTypeValidator', () => {
    test('should validate event type selection', () => {
      expect(validateEventType('')).toBe('Please select an event type');
      expect(validateEventType('Invalid Type')).toBe('Invalid event type selected');
      expect(validateEventType('Free Consultation (20 Min)')).toBeNull();
    });

    test('should validate duration for Personal Training', () => {
      expect(validateDuration('Personal Training Session')).toBe('Please select a duration');
      expect(validateDuration('Personal Training Session', 25)).toBe('Please select a valid duration (30, 45, or 60 minutes)');
      expect(validateDuration('Personal Training Session', 45)).toBeNull();
    });

    test('should validate event configuration', () => {
      const errors = validateEventConfiguration('Personal Training Session', 60);
      expect(errors).toHaveLength(0);

      const errorCase = validateEventConfiguration('', undefined);
      expect(errorCase.length).toBeGreaterThan(0);
    });
  });

  describe('SchedulingEngine', () => {
    test('should create scheduling engine', () => {
      const engine = createSchedulingEngine('Free Consultation (20 Min)', 20);
      expect(engine).toBeDefined();
    });

    test('should find quick available slots', async () => {
      const result = await findQuickAvailableSlots('Free Consultation (20 Min)', 20, {
        preferredDays: [1, 2, 3, 4, 5], // Weekdays
        preferredTimeOfDay: 'morning'
      });

      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.searchCriteria.eventType).toBe('Free Consultation (20 Min)');
      expect(result.metadata.searchCriteria.duration).toBe(20);
    });
  });

  describe('SchedulingUtils', () => {
    test('should format time slot correctly', () => {
      const slot = {
        startTime: new Date('2024-01-15T10:00:00'),
        endTime: new Date('2024-01-15T10:30:00'),
        status: 'available' as const
      };

      const formatted = formatTimeSlot(slot);
      expect(formatted).toContain('Monday');
      expect(formatted).toContain('10:00');
      expect(formatted).toContain('10:30');
    });

    test('should filter slots by preferences', () => {
      const slots = [
        {
          startTime: new Date('2024-01-15T10:00:00'), // Monday morning
          endTime: new Date('2024-01-15T10:30:00'),
          status: 'available' as const
        },
        {
          startTime: new Date('2024-01-15T18:00:00'), // Monday evening
          endTime: new Date('2024-01-15T18:30:00'),
          status: 'available' as const
        },
        {
          startTime: new Date('2024-01-13T10:00:00'), // Saturday morning
          endTime: new Date('2024-01-13T10:30:00'),
          status: 'available' as const
        }
      ];

      const preferences = {
        preferredDays: [1, 2, 3, 4, 5], // Weekdays only
        preferredTimeOfDay: 'morning' as const,
        timezone: 'America/New_York',
        wantsEarliestSlot: false
      };

      const filtered = filterSlotsByPreferences(slots, preferences);
      expect(filtered).toHaveLength(1); // Only Monday morning should match
      expect(filtered[0].startTime.getHours()).toBe(10);
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete scheduling workflow', async () => {
      // 1. Select event type
      const eventType = 'Personal Training Session';
      const duration = 60;

      // 2. Validate selection
      const validationErrors = validateEventConfiguration(eventType, duration);
      expect(validationErrors).toHaveLength(0);

      // 3. Get scheduling config
      const config = getSmartSchedulingConfig(eventType);
      expect(config?.enabled).toBe(true);

      // 4. Find available slots
      const result = await findQuickAvailableSlots(eventType, duration, {
        preferredDays: [1, 2, 3, 4, 5],
        preferredTimeOfDay: 'any'
      });

      expect(result.success).toBeDefined();
      expect(result.metadata.searchCriteria.eventType).toBe(eventType);
      expect(result.metadata.searchCriteria.duration).toBe(duration);
    });

    test('should handle error cases gracefully', async () => {
      const result = await findQuickAvailableSlots('Invalid Event Type', 30);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid event type selected');
    });
  });
}); 