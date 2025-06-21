/**
 * Training Calendar - Form Validation Module
 * 
 * Handles comprehensive form validation for trainer availability
 * Part of the modular trainer availability system
 */

(function($) {
    'use strict';

    // Form Validation Module
    window.TrainerAvailabilityFormValidation = {
        
        // Configuration
        config: {
            eventTypesModule: null,
            formManagementModule: null,
            validationRules: {
                required_fields: ['trainer_id', 'event_type'],
                time_slot_required: true,
                min_time_slots_per_day: 1,
                max_time_slots_per_day: 10
            }
        },
        
        // Validation state
        state: {
            errors: [],
            warnings: []
        },
        
        /**
         * Initialize form validation
         */
        init: function(eventTypesModule, formManagementModule) {
            this.config.eventTypesModule = eventTypesModule;
            this.config.formManagementModule = formManagementModule;
            this.bindValidationEvents();
            console.log('TrainerAvailabilityFormValidation: Initialized');
        },
        
        /**
         * Bind validation-specific events
         */
        bindValidationEvents: function() {
            // Real-time validation on field changes
            $(document).on('blur', '#trainer-availability-form input, #trainer-availability-form select', 
                          this.validateField.bind(this));
            
            // Form submission validation
            $(document).on('submit', '#trainer-availability-form', this.validateForm.bind(this));
        },
        
        /**
         * Validate individual field
         */
        validateField: function(e) {
            const $field = $(e.target);
            const fieldName = $field.attr('name') || $field.attr('id');
            const value = $field.val();
            
            this.clearFieldError($field);
            
            // Required field validation
            if (this.isRequiredField(fieldName) && !value) {
                this.showFieldError($field, 'This field is required.');
                return false;
            }
            
            // Specific field validations
            switch (fieldName) {
                case 'event_type':
                case 'event-type-select':
                    return this.validateEventType($field, value);
                    
                case 'duration':
                case 'event-duration-select':
                    return this.validateDuration($field, value);
                    
                default:
                    if (fieldName && fieldName.includes('time')) {
                        return this.validateTimeField($field, value);
                    }
            }
            
            return true;
        },
        
        /**
         * Comprehensive form validation
         */
        validateForm: function(e) {
            this.clearAllErrors();
            
            const formData = this.collectFormData();
            const validation = {
                valid: true,
                errors: [],
                warnings: [],
                data: formData
            };
            
            // Basic required fields
            validation.valid &= this.validateRequiredFields(formData, validation);
            
            // Event type validation
            validation.valid &= this.validateEventTypeSelection(formData, validation);
            
            // Duration validation
            validation.valid &= this.validateDurationSelection(formData, validation);
            
            // Availability validation
            validation.valid &= this.validateAvailabilityData(formData, validation);
            
            // Time slot validation
            validation.valid &= this.validateTimeSlots(formData, validation);
            
            // Event type specific validation
            validation.valid &= this.validateEventTypeRules(formData, validation);
            
            if (!validation.valid) {
                e.preventDefault();
                this.displayValidationErrors(validation.errors, validation.warnings);
            }
            
            return validation;
        },
        
        /**
         * Validate required fields
         */
        validateRequiredFields: function(formData, validation) {
            let isValid = true;
            
            this.config.validationRules.required_fields.forEach(field => {
                if (!formData[field] || formData[field] === '') {
                    validation.errors.push(`${this.getFieldLabel(field)} is required.`);
                    this.highlightRequiredField(field);
                    isValid = false;
                }
            });
            
            return isValid;
        },
        
        /**
         * Validate event type selection
         */
        validateEventTypeSelection: function(formData, validation) {
            if (!formData.event_type || formData.event_type === '') {
                validation.errors.push('Please select an event type.');
                return false;
            }
            
            // Validate event type exists
            const eventType = this.config.eventTypesModule?.getEventType(formData.event_type);
            if (!eventType) {
                validation.errors.push('Selected event type is not valid.');
                return false;
            }
            
            return true;
        },
        
        /**
         * Validate duration selection
         */
        validateDurationSelection: function(formData, validation) {
            const eventType = this.config.eventTypesModule?.getEventType(formData.event_type);
            
            if (eventType) {
                // Skip duration validation for trainer-scheduled events
                if (eventType.trainer_scheduled) {
                    return true;
                }
                
                // Validate duration is required for duration-based events
                if (eventType.requires_duration_selection && (!formData.duration || formData.duration === '')) {
                    validation.errors.push('Please select a duration for this event type.');
                    return false;
                }
                
                // Validate duration is allowed for this event type
                if (formData.duration && eventType.durations) {
                    const duration = parseInt(formData.duration);
                    if (!eventType.durations.includes(duration)) {
                        validation.errors.push(`Selected duration (${duration} minutes) is not available for this event type.`);
                        return false;
                    }
                }
            }
            
            return true;
        },
        
        /**
         * Validate availability data
         */
        validateAvailabilityData: function(formData, validation) {
            if (!formData.availability || Object.keys(formData.availability).length === 0) {
                validation.errors.push('Please set availability for at least one day of the week.');
                return false;
            }
            
            let hasTimeSlots = false;
            
            Object.keys(formData.availability).forEach(day => {
                const dayData = formData.availability[day];
                
                if (dayData.enabled && dayData.time_slots && dayData.time_slots.length > 0) {
                    hasTimeSlots = true;
                }
            });
            
            if (!hasTimeSlots) {
                validation.errors.push('Please add at least one time slot to your availability.');
                return false;
            }
            
            return true;
        },
        
        /**
         * Validate time slots
         */
        validateTimeSlots: function(formData, validation) {
            let isValid = true;
            
            Object.keys(formData.availability).forEach(day => {
                const dayData = formData.availability[day];
                
                if (dayData.enabled && dayData.time_slots) {
                    dayData.time_slots.forEach((slot, index) => {
                        const dayName = this.getDayName(parseInt(day));
                        
                        // Validate time slot completeness
                        if (!slot.start_time || !slot.end_time) {
                            validation.errors.push(`${dayName}: Time slot ${index + 1} must have both start and end times.`);
                            isValid = false;
                        }
                        
                        // Validate time range
                        if (slot.start_time && slot.end_time && slot.start_time >= slot.end_time) {
                            validation.errors.push(`${dayName}: Time slot ${index + 1} end time must be after start time.`);
                            isValid = false;
                        }
                        
                        // Validate max bookings
                        if (slot.max_bookings && (slot.max_bookings < 1 || slot.max_bookings > 50)) {
                            validation.errors.push(`${dayName}: Time slot ${index + 1} max bookings must be between 1 and 50.`);
                            isValid = false;
                        }
                    });
                    
                    // Check for overlapping time slots
                    if (!this.validateNoOverlappingSlots(dayData.time_slots, day, validation)) {
                        isValid = false;
                    }
                }
            });
            
            return isValid;
        },
        
        /**
         * Validate event type specific rules
         */
        validateEventTypeRules: function(formData, validation) {
            const eventType = this.config.eventTypesModule?.getEventType(formData.event_type);
            if (!eventType || !eventType.availability_rules) {
                return true;
            }
            
            const rules = eventType.availability_rules;
            let isValid = true;
            
            // Validate allowed days
            if (rules.allowed_days) {
                Object.keys(formData.availability).forEach(day => {
                    const dayNum = parseInt(day);
                    if (formData.availability[day].enabled && !rules.allowed_days.includes(dayNum)) {
                        validation.warnings.push(`${this.getDayName(dayNum)} is not typically available for ${eventType.title} events.`);
                    }
                });
            }
            
            // Validate business hours
            if (rules.business_hours) {
                Object.keys(formData.availability).forEach(day => {
                    const dayData = formData.availability[day];
                    if (dayData.enabled && dayData.time_slots) {
                        dayData.time_slots.forEach(slot => {
                            if (!this.isWithinBusinessHours(slot, rules.business_hours)) {
                                validation.warnings.push(`${this.getDayName(parseInt(day))}: Time slot ${slot.start_time}-${slot.end_time} is outside recommended business hours.`);
                            }
                        });
                    }
                });
            }
            
            return isValid;
        },
        
        /**
         * Check for overlapping time slots
         */
        validateNoOverlappingSlots: function(timeSlots, day, validation) {
            for (let i = 0; i < timeSlots.length; i++) {
                for (let j = i + 1; j < timeSlots.length; j++) {
                    if (this.slotsOverlap(timeSlots[i], timeSlots[j])) {
                        validation.errors.push(`${this.getDayName(parseInt(day))}: Time slots ${i + 1} and ${j + 1} overlap.`);
                        return false;
                    }
                }
            }
            return true;
        },
        
        /**
         * Check if two time slots overlap
         */
        slotsOverlap: function(slot1, slot2) {
            return slot1.start_time < slot2.end_time && slot2.start_time < slot1.end_time;
        },
        
        /**
         * Check if time slot is within business hours
         */
        isWithinBusinessHours: function(slot, businessHours) {
            return slot.start_time >= businessHours.start && 
                   slot.end_time <= businessHours.end;
        },
        
        // Utility methods
        isRequiredField: function(fieldName) {
            return this.config.validationRules.required_fields.includes(fieldName) ||
                   fieldName === 'event-type-select' || fieldName === 'availability-trainer-select';
        },
        
        getFieldLabel: function(fieldName) {
            const labels = {
                'trainer_id': 'Trainer',
                'event_type': 'Event Type',
                'duration': 'Duration'
            };
            return labels[fieldName] || fieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        },
        
        getDayName: function(dayNumber) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[dayNumber] || `Day ${dayNumber}`;
        },
        
        collectFormData: function() {
            return this.config.formManagementModule?.getFormData() || {};
        },
        
        // Error display methods
        showFieldError: function($field, message) {
            $field.addClass('error');
            
            let $error = $field.next('.field-error');
            if ($error.length === 0) {
                $error = $('<div class="field-error"></div>');
                $field.after($error);
            }
            $error.text(message).show();
        },
        
        clearFieldError: function($field) {
            $field.removeClass('error');
            $field.next('.field-error').remove();
        },
        
        clearAllErrors: function() {
            $('.field-error').remove();
            $('.error').removeClass('error');
            $('#validation-summary').remove();
        },
        
        displayValidationErrors: function(errors, warnings) {
            let html = '<div id="validation-summary" class="notice notice-error"><ul>';
            
            errors.forEach(error => {
                html += `<li><strong>Error:</strong> ${error}</li>`;
            });
            
            warnings.forEach(warning => {
                html += `<li><strong>Warning:</strong> ${warning}</li>`;
            });
            
            html += '</ul></div>';
            
            $('#trainer-availability-form').prepend($(html));
            
            // Scroll to top
            $('html, body').animate({
                scrollTop: $('#validation-summary').offset().top - 50
            }, 500);
        },
        
        highlightRequiredField: function(fieldName) {
            const selectors = [`#${fieldName}`, `[name="${fieldName}"]`, `#${fieldName.replace('_', '-')}-select`];
            
            selectors.forEach(selector => {
                const $field = $(selector);
                if ($field.length) {
                    $field.addClass('error');
                    $field.focus();
                }
            });
        }
    };

})(jQuery || $); 