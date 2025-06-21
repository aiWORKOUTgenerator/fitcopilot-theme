/**
 * Training Calendar - Event Types Module
 * 
 * Handles event type definitions, configurations, and validation
 * Part of the modular trainer availability system
 */

(function($) {
    'use strict';

    // Event Types Configuration
    const EVENT_TYPES = {
        fitness_assessment: {
            id: 'fitness_assessment',
            title: 'Fitness Assessment',
            duration: 20,
            durations: [20],
            description: 'Comprehensive fitness evaluation and goal setting session',
            requires_duration_selection: false,
            category: 'assessment',
            color: '#10b981', // Emerald
            max_participants: 1,
            buffer_time: 10,
            pricing: {
                type: 'free',
                amount: 0
            },
            availability_rules: {
                advance_booking_hours: 4,
                max_advance_days: 30,
                allowed_days: [1, 2, 3, 4, 5], // Weekdays only
                preferred_times: ['09:00', '11:00', '14:00', '16:00']
            }
        },
        
        personal_training: {
            id: 'personal_training',
            title: 'Personal Training Session',
            durations: [20, 30, 45, 60, 90],
            description: 'One-on-one personalized training session',
            requires_duration_selection: true,
            category: 'training',
            color: '#3b82f6', // Blue
            max_participants: 1,
            buffer_time: 15,
            pricing: {
                type: 'duration_based',
                rates: {
                    20: 30,
                    30: 45,
                    45: 65,
                    60: 80,
                    90: 110
                }
            },
            availability_rules: {
                advance_booking_hours: 2,
                max_advance_days: 60,
                allowed_days: [1, 2, 3, 4, 5, 6], // Monday to Saturday
                preferred_times: ['06:00', '07:00', '08:00', '17:00', '18:00', '19:00']
            }
        },
        
        group_fitness: {
            id: 'group_fitness',
            title: 'Group Fitness Class',
            description: 'Energizing group fitness class with professional instruction',
            requires_duration_selection: false,
            trainer_scheduled: true, // Special flag for pre-scheduled classes
            category: 'group',
            color: '#f59e0b', // Amber
            max_participants: 15,
            buffer_time: 15,
            pricing: {
                type: 'fixed',
                amount: 25
            },
            availability_rules: {
                advance_booking_hours: 1,
                max_advance_days: 14,
                allowed_days: [1, 2, 3, 4, 5, 6, 0], // All days
                scheduled_times: ['06:00', '07:00', '09:00', '18:00', '19:00'] // Pre-scheduled
            }
        },
        
        group_forum: {
            id: 'group_forum',
            title: 'Group Discussion Forum',
            duration: 30,
            durations: [30, 45],
            description: 'Interactive group discussion on fitness topics and goal sharing',
            requires_duration_selection: false,
            category: 'forum',
            color: '#8b5cf6', // Violet
            max_participants: 8,
            buffer_time: 10,
            pricing: {
                type: 'free',
                amount: 0
            },
            availability_rules: {
                advance_booking_hours: 2,
                max_advance_days: 21,
                allowed_days: [2, 4, 6], // Tuesday, Thursday, Saturday
                preferred_times: ['10:00', '14:00', '16:00']
            }
        }
    };

    // Event Type Manager
    window.TrainerAvailabilityEventTypes = {
        
        /**
         * Get all event types
         */
        getEventTypes: function() {
            return EVENT_TYPES;
        },
        
        /**
         * Get event type by ID
         */
        getEventType: function(eventTypeId) {
            return EVENT_TYPES[eventTypeId] || null;
        },
        
        /**
         * Get event type options for dropdown
         */
        getEventTypeOptions: function(includeDefault = true) {
            let options = '';
            
            if (includeDefault) {
                options += '<option value="">- Select Event Type -</option>';
            }
            
            Object.values(EVENT_TYPES).forEach(eventType => {
                options += `<option value="${eventType.id}" data-category="${eventType.category}">${eventType.title}</option>`;
            });
            
            return options;
        },
        
        /**
         * Get duration options for specific event type
         */
        getDurationOptions: function(eventTypeId, includeDefault = true) {
            const eventType = this.getEventType(eventTypeId);
            if (!eventType) return '';
            
            let options = '';
            
            if (includeDefault) {
                if (eventType.requires_duration_selection) {
                    options += '<option value="">- Select Duration -</option>';
                } else if (eventType.trainer_scheduled) {
                    options += '<option value="trainer_scheduled">Trainer Scheduled</option>';
                    return options;
                }
            }
            
            if (eventType.durations && eventType.durations.length > 0) {
                eventType.durations.forEach(duration => {
                    const price = this.getDurationPrice(eventTypeId, duration);
                    const priceText = price > 0 ? ` ($${price})` : '';
                    options += `<option value="${duration}">${duration} minutes${priceText}</option>`;
                });
            } else if (eventType.duration) {
                const price = this.getDurationPrice(eventTypeId, eventType.duration);
                const priceText = price > 0 ? ` ($${price})` : '';
                options += `<option value="${eventType.duration}">${eventType.duration} minutes${priceText}</option>`;
            }
            
            return options;
        },
        
        /**
         * Get price for duration
         */
        getDurationPrice: function(eventTypeId, duration) {
            const eventType = this.getEventType(eventTypeId);
            if (!eventType || !eventType.pricing) return 0;
            
            switch (eventType.pricing.type) {
                case 'free':
                    return 0;
                case 'fixed': 
                    return eventType.pricing.amount;
                case 'duration_based':
                    return eventType.pricing.rates[duration] || 0;
                default:
                    return 0;
            }
        },
        
        /**
         * Validate event type and duration combination
         */
        validateEventTypeDuration: function(eventTypeId, duration) {
            const eventType = this.getEventType(eventTypeId);
            if (!eventType) {
                return { valid: false, error: 'Invalid event type selected' };
            }
            
            // Check if duration selection is required
            if (eventType.requires_duration_selection && !duration) {
                return { valid: false, error: `Duration selection is required for ${eventType.title}` };
            }
            
            // Check if trainer scheduled
            if (eventType.trainer_scheduled && duration !== 'trainer_scheduled') {
                return { valid: false, error: `${eventType.title} uses trainer-scheduled timing` };
            }
            
            // Validate duration against allowed durations
            if (duration && duration !== 'trainer_scheduled') {
                const numericDuration = parseInt(duration);
                const allowedDurations = eventType.durations || [eventType.duration];
                
                if (!allowedDurations.includes(numericDuration)) {
                    return { 
                        valid: false, 
                        error: `Invalid duration for ${eventType.title}. Allowed: ${allowedDurations.join(', ')} minutes` 
                    };
                }
            }
            
            return { valid: true };
        },
        
        /**
         * Get event type configuration for availability generation
         */
        getAvailabilityConfig: function(eventTypeId) {
            const eventType = this.getEventType(eventTypeId);
            if (!eventType) return null;
            
            return {
                id: eventType.id,
                title: eventType.title,
                category: eventType.category,
                buffer_time: eventType.buffer_time,
                max_participants: eventType.max_participants,
                availability_rules: eventType.availability_rules,
                trainer_scheduled: eventType.trainer_scheduled || false
            };
        },
        
        /**
         * Check if event type allows specific day
         */
        isAllowedDay: function(eventTypeId, dayOfWeek) {
            const eventType = this.getEventType(eventTypeId);
            if (!eventType || !eventType.availability_rules) return true;
            
            const allowedDays = eventType.availability_rules.allowed_days;
            return !allowedDays || allowedDays.includes(dayOfWeek);
        },
        
        /**
         * Get preferred times for event type
         */
        getPreferredTimes: function(eventTypeId) {
            const eventType = this.getEventType(eventTypeId);
            if (!eventType || !eventType.availability_rules) return [];
            
            return eventType.availability_rules.preferred_times || 
                   eventType.availability_rules.scheduled_times || [];
        },
        
        /**
         * Get event type color
         */
        getEventTypeColor: function(eventTypeId) {
            const eventType = this.getEventType(eventTypeId);
            return eventType ? eventType.color : '#6b7280';
        },
        
        /**
         * Get default description for event type
         */
        getEventTypeDescription: function(eventTypeId) {
            const eventType = this.getEventType(eventTypeId);
            return eventType ? eventType.description : '';
        },
        
        /**
         * Get advance booking requirements
         */
        getAdvanceBookingRules: function(eventTypeId) {
            const eventType = this.getEventType(eventTypeId);
            if (!eventType || !eventType.availability_rules) {
                return {
                    advance_booking_hours: 2,
                    max_advance_days: 30
                };
            }
            
            return {
                advance_booking_hours: eventType.availability_rules.advance_booking_hours || 2,
                max_advance_days: eventType.availability_rules.max_advance_days || 30
            };
        }
    };
    
})(jQuery); 