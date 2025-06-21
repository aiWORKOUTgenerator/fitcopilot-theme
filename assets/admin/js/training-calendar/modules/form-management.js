/**
 * Training Calendar - Form Management Module
 * 
 * Handles core form utilities, data collection, validation, and state management
 * Part of the modular trainer availability system
 */

(function($) {
    'use strict';

    // Form Management Module
    window.TrainerAvailabilityFormManagement = {
        
        // Configuration
        config: {
            eventTypesModule: null,
            formSelector: '#trainer-availability-form'
        },
        
        // State
        state: {
            hasUnsavedChanges: false,
            formData: {},
            currentEventType: null
        },
        
        /**
         * Initialize form management
         */
        init: function(eventTypesModule) {
            this.config.eventTypesModule = eventTypesModule;
            this.bindFormEvents();
            console.log('TrainerAvailabilityFormManagement: Initialized');
        },
        
        /**
         * Bind form-specific events
         */
        bindFormEvents: function() {
            // Form field changes (mark as unsaved)
            $(document).on('change', this.config.formSelector + ' input, ' + 
                          this.config.formSelector + ' select, ' + 
                          this.config.formSelector + ' textarea', 
                          this.markUnsavedChanges.bind(this));
            
            // Event type selection
            $(document).on('change', '#event-type-select', this.onEventTypeChange.bind(this));
            
            // Duration selection
            $(document).on('change', '#event-duration-select', this.onDurationChange.bind(this));
        },
        
        /**
         * Handle event type selection change
         */
        onEventTypeChange: function(e) {
            const eventTypeId = $(e.target).val();
            const eventTypesModule = this.config.eventTypesModule;
            
            if (!eventTypesModule) {
                console.error('Event types module not available');
                return;
            }
            
            this.state.currentEventType = eventTypeId;
            
            // Update duration options
            const durationSelect = $('#event-duration-select');
            if (durationSelect.length) {
                const durationOptions = eventTypesModule.getDurationOptions(eventTypeId, true);
                durationSelect.html(durationOptions);
                
                // Show/hide duration select based on event type
                const eventType = eventTypesModule.getEventType(eventTypeId);
                if (eventType) {
                    const durationContainer = durationSelect.closest('.form-field');
                    if (eventType.trainer_scheduled) {
                        durationContainer.hide();
                        this.showTrainerScheduledMessage();
                    } else {
                        durationContainer.show();
                        this.hideTrainerScheduledMessage();
                    }
                }
            }
            
            // Update form description
            this.updateEventTypeDescription(eventTypeId);
            this.markUnsavedChanges();
        },
        
        /**
         * Handle duration selection change
         */
        onDurationChange: function(e) {
            const duration = $(e.target).val();
            const eventTypeId = this.state.currentEventType;
            
            if (eventTypeId && this.config.eventTypesModule) {
                // Update pricing display if needed
                this.updatePricingDisplay(eventTypeId, duration);
            }
            
            this.markUnsavedChanges();
        },
        
        /**
         * Update event type description
         */
        updateEventTypeDescription: function(eventTypeId) {
            const eventType = this.config.eventTypesModule?.getEventType(eventTypeId);
            const descriptionElement = $('#event-type-description');
            
            if (eventType && descriptionElement.length) {
                descriptionElement.html(eventType.description || '').show();
            } else {
                descriptionElement.hide();
            }
        },
        
        /**
         * Update pricing display
         */
        updatePricingDisplay: function(eventTypeId, duration) {
            const pricing = this.config.eventTypesModule?.getPricing(eventTypeId, duration);
            const pricingElement = $('#event-pricing-display');
            
            if (pricing && pricingElement.length) {
                let pricingText = '';
                if (pricing.type === 'free') {
                    pricingText = 'Free';
                } else if (pricing.amount) {
                    pricingText = `$${pricing.amount}`;
                }
                pricingElement.text(pricingText).show();
            } else {
                pricingElement.hide();
            }
        },
        
        /**
         * Show trainer scheduled message
         */
        showTrainerScheduledMessage: function() {
            const messageElement = $('#trainer-scheduled-message');
            if (messageElement.length === 0) {
                const message = $('<div id="trainer-scheduled-message" class="notice notice-info inline">' +
                                '<p>This event type uses trainer-scheduled time slots.</p></div>');
                $('#event-duration-select').closest('.form-field').after(message);
            } else {
                messageElement.show();
            }
        },
        
        /**
         * Hide trainer scheduled message
         */
        hideTrainerScheduledMessage: function() {
            $('#trainer-scheduled-message').hide();
        },
        
        /**
         * Collect all form data
         */
        collectFormData: function() {
            const formData = {
                trainer_id: $('#availability-trainer-select').val(),
                event_type: $('#event-type-select').val(),
                duration: $('#event-duration-select').val(),
                availability: this.collectAvailabilityData()
            };
            
            this.state.formData = formData;
            return formData;
        },
        
        /**
         * Collect availability data for all days
         */
        collectAvailabilityData: function() {
            const availability = {};
            
            for (let day = 0; day < 7; day++) {
                const dayEnabled = $(`#day-${day}-enabled`).is(':checked');
                
                if (dayEnabled) {
                    availability[day] = {
                        enabled: true,
                        time_slots: this.collectDayTimeSlots(day)
                    };
                }
            }
            
            return availability;
        },
        
        /**
         * Collect time slots for a specific day
         */
        collectDayTimeSlots: function(day) {
            const timeSlots = [];
            
            $(`#day-${day}-slots .time-slot`).each(function() {
                const startTime = $(this).find('input[name*="start_time"]').val();
                const endTime = $(this).find('input[name*="end_time"]').val();
                const maxBookings = $(this).find('input[name*="max_bookings"]').val() || 1;
                
                if (startTime && endTime) {
                    timeSlots.push({
                        start_time: startTime,
                        end_time: endTime,
                        max_bookings: parseInt(maxBookings)
                    });
                }
            });
            
            return timeSlots;
        },
        
        /**
         * Reset form to initial state
         */
        resetForm: function() {
            $(this.config.formSelector)[0]?.reset();
            this.state.hasUnsavedChanges = false;
            this.state.formData = {};
            this.state.currentEventType = null;
            
            // Hide all day settings
            for (let day = 0; day < 7; day++) {
                this.toggleDaySettings(day, false);
            }
            
            // Clear messages
            this.hideTrainerScheduledMessage();
            $('#event-type-description').hide();
            $('#event-pricing-display').hide();
        },
        
        /**
         * Toggle day settings visibility
         */
        toggleDaySettings: function(day, show) {
            const slotsContainer = $(`#day-${day}-slots`);
            const settingsContainer = $(`#day-${day}-settings`);
            
            if (show) {
                slotsContainer.show();
                settingsContainer.show();
            } else {
                slotsContainer.hide();
                settingsContainer.hide();
                slotsContainer.empty(); // Clear time slots
            }
        },
        
        /**
         * Mark form as having unsaved changes
         */
        markUnsavedChanges: function() {
            this.state.hasUnsavedChanges = true;
            
            // Update UI to show unsaved state
            const saveButton = $('#save-availability');
            saveButton.addClass('unsaved-changes').text('Save Changes *');
        },
        
        /**
         * Mark form as saved
         */
        markSaved: function() {
            this.state.hasUnsavedChanges = false;
            
            // Update UI to show saved state
            const saveButton = $('#save-availability');
            saveButton.removeClass('unsaved-changes').text('Save Availability');
        },
        
        /**
         * Check if form has unsaved changes
         */
        hasUnsavedChanges: function() {
            return this.state.hasUnsavedChanges;
        },
        
        /**
         * Get current form data
         */
        getFormData: function() {
            return this.collectFormData();
        },
        
        /**
         * Get current event type
         */
        getCurrentEventType: function() {
            return this.state.currentEventType;
        }
    };

})(jQuery || $); 