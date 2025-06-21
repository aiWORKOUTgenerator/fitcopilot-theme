/**
 * Training Calendar - Time Slot Manager Module
 * 
 * Handles time slot creation, removal, and management for trainer availability
 * Part of the modular trainer availability system
 */

(function($) {
    'use strict';

    // Time Slot Manager Module
    window.TrainerAvailabilityTimeSlotManager = {
        
        // Configuration
        config: {
            timeSlotTemplate: null,
            eventTypesModule: null,
            formManagementModule: null
        },
        
        /**
         * Initialize time slot manager
         */
        init: function(eventTypesModule, formManagementModule) {
            this.config.eventTypesModule = eventTypesModule;
            this.config.formManagementModule = formManagementModule;
            this.loadTimeSlotTemplate();
            this.bindTimeSlotEvents();
            console.log('TrainerAvailabilityTimeSlotManager: Initialized');
        },
        
        /**
         * Load time slot template
         */
        loadTimeSlotTemplate: function() {
            const template = $('#time-slot-template').html();
            if (template) {
                this.config.timeSlotTemplate = template;
            } else {
                console.warn('TrainerAvailabilityTimeSlotManager: Time slot template not found');
                this.createDefaultTemplate();
            }
        },
        
        /**
         * Create default time slot template if none exists
         */
        createDefaultTemplate: function() {
            this.config.timeSlotTemplate = `
                <div class="time-slot">
                    <div class="time-slot-fields">
                        <div class="time-field">
                            <label>Start Time:</label>
                            <input type="time" name="start_time" required>
                        </div>
                        <div class="time-field">
                            <label>End Time:</label>
                            <input type="time" name="end_time" required>
                        </div>
                        <div class="time-field">
                            <label>Max Bookings:</label>
                            <input type="number" name="max_bookings" min="1" max="10" value="1">
                        </div>
                        <div class="time-slot-actions">
                            <button type="button" class="remove-time-slot button-secondary">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        },
        
        /**
         * Bind time slot related events
         */
        bindTimeSlotEvents: function() {
            // Day enable/disable toggles
            $(document).on('change', '[id^="day-"][id$="-enabled"]', this.onDayToggle.bind(this));
            
            // Time slot management
            $(document).on('click', '.add-time-slot', this.addTimeSlot.bind(this));
            $(document).on('click', '.remove-time-slot', this.removeTimeSlot.bind(this));
            
            // Time input changes
            $(document).on('change', '[name*="time_slots"] input[type="time"]', this.onTimeSlotChange.bind(this));
            $(document).on('change', '[name*="max_bookings"]', this.onMaxBookingsChange.bind(this));
        },
        
        /**
         * Handle day toggle
         */
        onDayToggle: function(e) {
            const checkbox = $(e.target);
            const dayMatch = checkbox.attr('id').match(/day-(\d+)-enabled/);
            
            if (dayMatch) {
                const day = parseInt(dayMatch[1]);
                const isEnabled = checkbox.is(':checked');
                
                this.toggleDaySettings(day, isEnabled);
                
                // Apply event type preferences if enabling day
                if (isEnabled && this.config.formManagementModule) {
                    const currentEventType = this.config.formManagementModule.getCurrentEventType();
                    if (currentEventType) {
                        this.applyEventTypePreferences(day, currentEventType);
                    }
                }
            }
        },
        
        /**
         * Toggle day settings visibility and setup
         */
        toggleDaySettings: function(day, show) {
            const slotsContainer = $(`#day-${day}-slots`);
            const settingsContainer = $(`#day-${day}-settings`);
            
            if (show) {
                slotsContainer.show();
                settingsContainer.show();
                
                // Add default time slot if none exist
                if (slotsContainer.find('.time-slot').length === 0) {
                    this.addTimeSlot(null, day);
                }
            } else {
                slotsContainer.hide();
                settingsContainer.hide();
                slotsContainer.empty(); // Clear time slots
            }
        },
        
        /**
         * Add time slot to a day
         */
        addTimeSlot: function(e, day = null, data = null) {
            if (e) {
                e.preventDefault();
                day = $(e.target).data('day');
            }
            
            if (!this.config.timeSlotTemplate) {
                console.error('Time slot template not available');
                return;
            }
            
            // Replace placeholders in template
            const slotHtml = this.config.timeSlotTemplate
                .replace(/name="/g, `name="availability[${day}][time_slots][${Date.now()}]`)
                .replace(/\[([^\]]*)\]/g, `[time_slots][${Date.now()}][$1]`);
            
            const $slot = $(slotHtml);
            
            // Apply event type preferences or provided data
            if (data) {
                this.populateTimeSlot($slot, data);
            } else {
                const currentEventType = this.config.formManagementModule?.getCurrentEventType();
                if (currentEventType) {
                    this.applyEventTypeTimeSlotDefaults($slot, currentEventType);
                }
            }
            
            // Add to container
            const slotsContainer = $(`#day-${day}-slots`);
            slotsContainer.append($slot);
            
            // Focus on first input
            $slot.find('input:first').focus();
            
            this.updateSlotNumbers(day);
        },
        
        /**
         * Remove time slot
         */
        removeTimeSlot: function(e) {
            e.preventDefault();
            
            const $slot = $(e.target).closest('.time-slot');
            const $container = $slot.closest('[id$="-slots"]');
            const day = this.extractDayFromContainer($container);
            
            if ($container.find('.time-slot').length > 1) {
                $slot.fadeOut(200, function() {
                    $(this).remove();
                });
                
                // Update slot numbers after removal
                setTimeout(() => this.updateSlotNumbers(day), 250);
            } else {
                alert('At least one time slot is required when the day is enabled.');
            }
        },
        
        /**
         * Handle time slot change
         */
        onTimeSlotChange: function(e) {
            const $input = $(e.target);
            const $slot = $input.closest('.time-slot');
            
            // Validate time range
            this.validateTimeSlot($slot);
            
            // Auto-calculate end time if start time is set and end time is empty
            if ($input.attr('name').includes('start_time')) {
                this.autoCalculateEndTime($slot);
            }
        },
        
        /**
         * Handle max bookings change
         */
        onMaxBookingsChange: function(e) {
            const value = parseInt($(e.target).val());
            const eventType = this.config.formManagementModule?.getCurrentEventType();
            
            // Validate against event type limits
            if (eventType && this.config.eventTypesModule) {
                const maxParticipants = this.config.eventTypesModule.getEventType(eventType)?.max_participants;
                if (maxParticipants && value > maxParticipants) {
                    $(e.target).val(maxParticipants);
                    this.showValidationMessage(`Maximum bookings cannot exceed ${maxParticipants} for this event type.`);
                }
            }
        },
        
        /**
         * Apply event type preferences to a day
         */
        applyEventTypePreferences: function(day, eventTypeId) {
            if (!this.config.eventTypesModule) return;
            
            const eventType = this.config.eventTypesModule.getEventType(eventTypeId);
            if (!eventType || !eventType.availability_rules) return;
            
            const rules = eventType.availability_rules;
            
            // Check if day is allowed
            if (rules.allowed_days && !rules.allowed_days.includes(day)) {
                // Disable day if not allowed
                $(`#day-${day}-enabled`).prop('checked', false);
                this.toggleDaySettings(day, false);
                return;
            }
            
            // Apply preferred times if available
            if (rules.preferred_times && rules.preferred_times.length > 0) {
                const slotsContainer = $(`#day-${day}-slots`);
                slotsContainer.empty();
                
                rules.preferred_times.forEach(time => {
                    this.addTimeSlotWithTime(day, time, eventType.duration || 30);
                });
            }
        },
        
        /**
         * Apply event type defaults to a time slot
         */
        applyEventTypeTimeSlotDefaults: function($slot, eventTypeId) {
            if (!this.config.eventTypesModule) return;
            
            const eventType = this.config.eventTypesModule.getEventType(eventTypeId);
            if (!eventType) return;
            
            // Set max bookings based on event type
            const maxBookingsInput = $slot.find('input[name*="max_bookings"]');
            if (eventType.max_participants) {
                maxBookingsInput.val(Math.min(eventType.max_participants, 10));
            }
            
            // Set default duration if available
            if (eventType.duration) {
                const startTimeInput = $slot.find('input[name*="start_time"]');
                if (startTimeInput.val()) {
                    this.setEndTimeFromDuration($slot, eventType.duration);
                }
            }
        },
        
        /**
         * Add time slot with specific time
         */
        addTimeSlotWithTime: function(day, startTime, duration) {
            this.addTimeSlot(null, day);
            
            const $lastSlot = $(`#day-${day}-slots .time-slot:last`);
            $lastSlot.find('input[name*="start_time"]').val(startTime);
            
            if (duration) {
                this.setEndTimeFromDuration($lastSlot, duration);
            }
        },
        
        /**
         * Set end time based on duration
         */
        setEndTimeFromDuration: function($slot, duration) {
            const startTimeInput = $slot.find('input[name*="start_time"]');
            const endTimeInput = $slot.find('input[name*="end_time"]');
            
            if (startTimeInput.val()) {
                const startTime = new Date(`2000-01-01T${startTimeInput.val()}:00`);
                const endTime = new Date(startTime.getTime() + duration * 60000);
                endTimeInput.val(endTime.toTimeString().substr(0, 5));
            }
        },
        
        /**
         * Auto-calculate end time based on event type
         */
        autoCalculateEndTime: function($slot) {
            const eventType = this.config.formManagementModule?.getCurrentEventType();
            if (!eventType || !this.config.eventTypesModule) return;
            
            const eventTypeData = this.config.eventTypesModule.getEventType(eventType);
            if (eventTypeData?.duration) {
                this.setEndTimeFromDuration($slot, eventTypeData.duration);
            }
        },
        
        /**
         * Validate time slot
         */
        validateTimeSlot: function($slot) {
            const startTime = $slot.find('input[name*="start_time"]').val();
            const endTime = $slot.find('input[name*="end_time"]').val();
            
            if (startTime && endTime) {
                if (startTime >= endTime) {
                    this.showValidationMessage('End time must be after start time.');
                    $slot.find('input[name*="end_time"]').addClass('error');
                } else {
                    $slot.find('input[name*="end_time"]').removeClass('error');
                }
            }
        },
        
        /**
         * Populate time slot with data
         */
        populateTimeSlot: function($slot, data) {
            if (data.start_time) {
                $slot.find('input[name*="start_time"]').val(data.start_time);
            }
            if (data.end_time) {
                $slot.find('input[name*="end_time"]').val(data.end_time);
            }
            if (data.max_bookings) {
                $slot.find('input[name*="max_bookings"]').val(data.max_bookings);
            }
        },
        
        /**
         * Update slot numbers for visual organization
         */
        updateSlotNumbers: function(day) {
            $(`#day-${day}-slots .time-slot`).each(function(index) {
                $(this).find('.slot-number').text(index + 1);
            });
        },
        
        /**
         * Extract day number from container ID
         */
        extractDayFromContainer: function($container) {
            const match = $container.attr('id').match(/day-(\d+)-slots/);
            return match ? parseInt(match[1]) : null;
        },
        
        /**
         * Show validation message
         */
        showValidationMessage: function(message) {
            // Create or update validation message
            let $message = $('#time-slot-validation');
            if ($message.length === 0) {
                $message = $('<div id="time-slot-validation" class="notice notice-warning inline"></div>');
                $('.time-slots-container').prepend($message);
            }
            
            $message.html(`<p>${message}</p>`).show();
            
            // Auto-hide after 5 seconds
            setTimeout(() => $message.fadeOut(), 5000);
        }
    };

})(jQuery || $); 