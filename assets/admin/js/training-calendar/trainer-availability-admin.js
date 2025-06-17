/**
 * Training Calendar - Trainer Availability Admin Interface
 * 
 * Handles the recurring schedule management interface for trainers
 */

(function($) {
    'use strict';

    // Main TrainerAvailability object
    window.TrainerAvailability = {
        
        // Configuration
        config: {
            nonce: (window.fitcopilotTrainingCalendarAjax && window.fitcopilotTrainingCalendarAjax.nonce) || 
                   (window.fitcopilotTrainingCalendarData && window.fitcopilotTrainingCalendarData.nonce) || '',
            ajaxUrl: (window.fitcopilotTrainingCalendarAjax && window.fitcopilotTrainingCalendarAjax.ajax_url) || 
                     window.ajaxurl || '/wp-admin/admin-ajax.php'
        },
        
        // Current state
        state: {
            selectedTrainerId: null,
            currentAvailability: {},
            isLoading: false,
            hasUnsavedChanges: false
        },
        
        /**
         * Initialize the trainer availability interface
         */
        init: function() {
            console.log('TrainerAvailability: Configuration:', this.config);
            console.log('TrainerAvailability: Available global objects:', {
                fitcopilotTrainingCalendarAjax: window.fitcopilotTrainingCalendarAjax,
                fitcopilotTrainingCalendarData: window.fitcopilotTrainingCalendarData,
                ajaxurl: window.ajaxurl
            });
            
            this.bindEvents();
            this.initializeModal();
            console.log('TrainerAvailability: Initialized');
        },
        
        /**
         * Bind all event handlers
         */
        bindEvents: function() {
            // Modal triggers
            $(document).on('click', '#manage-trainers-btn', this.showAvailabilityModal.bind(this));
            
            // Modal controls
            $(document).on('click', '#trainer-availability-modal .modal-close', this.hideModal.bind(this));
            $(document).on('click', '#trainer-availability-modal .modal-overlay', this.hideModal.bind(this));
            
            // Trainer selection
            $(document).on('change', '#availability-trainer-select', this.onTrainerSelect.bind(this));
            $(document).on('click', '#load-trainer-availability', this.loadTrainerAvailability.bind(this));
            
            // Day management
            $(document).on('change', '[id^="day-"][id$="-enabled"]', this.onDayToggle.bind(this));
            $(document).on('click', '.add-time-slot', this.addTimeSlot.bind(this));
            $(document).on('click', '.remove-time-slot', this.removeTimeSlot.bind(this));
            
            // Form actions
            $(document).on('click', '#preview-schedule', this.previewSchedule.bind(this));
            $(document).on('click', '#reset-schedule', this.resetSchedule.bind(this));
            $(document).on('submit', '#trainer-availability-form', this.saveAvailability.bind(this));
            
            // Prevent accidental navigation
            $(window).on('beforeunload', this.onBeforeUnload.bind(this));
        },
        
        /**
         * Initialize modal state
         */
        initializeModal: function() {
            // Hide all sections initially
            $('#availability-schedule-form').hide();
            $('#availability-loading').hide();
            $('#no-trainer-selected').show();
        },
        
        /**
         * Show the trainer availability modal
         */
        showAvailabilityModal: function(e) {
            e.preventDefault();
            
            $('#trainer-availability-modal').fadeIn(300);
            $('body').addClass('modal-open');
            
            // Reset form state
            this.resetForm();
            
            console.log('TrainerAvailability: Modal opened');
        },
        
        /**
         * Hide the modal
         */
        hideModal: function(e) {
            if (e) e.preventDefault();
            
            // Check for unsaved changes
            if (this.state.hasUnsavedChanges) {
                if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
                    return;
                }
            }
            
            $('#trainer-availability-modal').fadeOut(300);
            $('body').removeClass('modal-open');
            
            this.resetForm();
            console.log('TrainerAvailability: Modal closed');
        },
        
        /**
         * Handle trainer selection
         */
        onTrainerSelect: function(e) {
            const trainerId = $(e.target).val();
            
            if (trainerId) {
                this.state.selectedTrainerId = trainerId;
                $('#selected-trainer-id').val(trainerId);
                $('#load-trainer-availability').prop('disabled', false);
                $('#no-trainer-selected').hide();
            } else {
                this.state.selectedTrainerId = null;
                $('#selected-trainer-id').val('');
                $('#load-trainer-availability').prop('disabled', true);
                $('#availability-schedule-form').hide();
                $('#no-trainer-selected').show();
            }
        },
        
        /**
         * Load trainer availability data
         */
        loadTrainerAvailability: function(e) {
            e.preventDefault();
            
            if (!this.state.selectedTrainerId) {
                this.showError('Please select a trainer first');
                return;
            }
            
            this.showLoading(true);
            
            $.ajax({
                url: this.config.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'get_trainer_availability',
                    trainer_id: this.state.selectedTrainerId,
                    nonce: this.config.nonce
                },
                success: (response) => {
                    this.showLoading(false);
                    
                    console.log('TrainerAvailability: AJAX Response:', response);
                    
                    if (response.success) {
                        const availability = response.data.availability;
                        
                        this.populateAvailabilityForm(availability);
                        $('#availability-schedule-form').show();
                        $('#no-trainer-selected').hide();
                        
                        if (availability && availability.length > 0) {
                            this.showSuccess(`Trainer availability loaded successfully (${availability.length} records)`);
                        } else {
                            this.showSuccess('No existing availability found. You can create a new schedule below.');
                        }
                        
                        // Debug information
                        if (response.data.debug_info) {
                            console.log('Debug Info:', response.data.debug_info);
                        }
                    } else {
                        this.showError(response.data?.message || 'Failed to load trainer availability');
                    }
                },
                error: (xhr, status, error) => {
                    this.showLoading(false);
                    this.showError('Network error: ' + error);
                }
            });
        },
        
        /**
         * Populate form with availability data
         */
        populateAvailabilityForm: function(availability) {
            // Clear existing data
            this.resetScheduleForm();
            
            // Defensive programming: ensure availability is an array
            if (!availability || !Array.isArray(availability)) {
                console.log('TrainerAvailability: No availability data found, showing empty form');
                this.state.currentAvailability = [];
                this.state.hasUnsavedChanges = false;
                return;
            }
            
            // Group availability by day of week
            const availabilityByDay = {};
            availability.forEach(avail => {
                const day = avail.day_of_week;
                if (!availabilityByDay[day]) {
                    availabilityByDay[day] = [];
                }
                availabilityByDay[day].push(avail);
            });
            
            // Populate each day
            for (let day = 0; day <= 6; day++) {
                const dayAvailability = availabilityByDay[day] || [];
                
                if (dayAvailability.length > 0) {
                    // Enable the day
                    $(`#day-${day}-enabled`).prop('checked', true);
                    this.toggleDaySettings(day, true);
                    
                    // Add time slots
                    dayAvailability.forEach(avail => {
                        this.addTimeSlot(null, day, {
                            start_time: avail.start_time,
                            end_time: avail.end_time,
                            break_start: avail.break_start_time,
                            break_end: avail.break_end_time
                        });
                        
                        // Set day settings from first availability record
                        if (dayAvailability.indexOf(avail) === 0) {
                            $(`[name="availability[${day}][session_duration]"]`).val(avail.session_duration);
                            $(`[name="availability[${day}][buffer_time]"]`).val(avail.buffer_time);
                            $(`[name="availability[${day}][location]"]`).val(avail.location);
                            $(`[name="availability[${day}][max_sessions]"]`).val(avail.max_sessions_per_day);
                        }
                    });
                    
                    // Set global settings from first record
                    if (day === 0 && dayAvailability.length > 0) {
                        const firstAvail = dayAvailability[0];
                        if (firstAvail.effective_date) {
                            $('#effective-date').val(firstAvail.effective_date);
                        }
                        if (firstAvail.expiry_date) {
                            $('#expiry-date').val(firstAvail.expiry_date);
                        }
                        if (firstAvail.availability_type) {
                            $('[name="availability_type"]').val(firstAvail.availability_type);
                        }
                        if (firstAvail.timezone) {
                            $('[name="timezone"]').val(firstAvail.timezone);
                        }
                        if (firstAvail.notes) {
                            $('[name="notes"]').val(firstAvail.notes);
                        }
                    }
                }
            }
            
            this.state.currentAvailability = availability;
            this.state.hasUnsavedChanges = false;
        },
        
        /**
         * Handle day enable/disable toggle
         */
        onDayToggle: function(e) {
            const checkbox = $(e.target);
            const dayMatch = checkbox.attr('id').match(/day-(\d+)-enabled/);
            
            if (dayMatch) {
                const day = parseInt(dayMatch[1]);
                const isEnabled = checkbox.is(':checked');
                
                this.toggleDaySettings(day, isEnabled);
                this.markUnsavedChanges();
            }
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
         * Add a time slot to a day
         */
        addTimeSlot: function(e, day = null, data = null) {
            if (e) {
                e.preventDefault();
                day = $(e.target).data('day');
            }
            
            const template = $('#time-slot-template').html();
            const slotHtml = template.replace(/name="/g, `name="availability[${day}][time_slots][]`);
            
            const $slot = $(slotHtml);
            
            // Populate with data if provided
            if (data) {
                $slot.find('[name$="[start_time]"]').val(data.start_time || '09:00');
                $slot.find('[name$="[end_time]"]').val(data.end_time || '17:00');
                $slot.find('[name$="[break_start]"]').val(data.break_start || '');
                $slot.find('[name$="[break_end]"]').val(data.break_end || '');
            }
            
            $(`#day-${day}-slots`).append($slot);
            this.markUnsavedChanges();
        },
        
        /**
         * Remove a time slot
         */
        removeTimeSlot: function(e) {
            e.preventDefault();
            
            if (confirm('Remove this time slot?')) {
                $(e.target).closest('.time-slot').remove();
                this.markUnsavedChanges();
            }
        },
        
        /**
         * Preview the schedule
         */
        previewSchedule: function(e) {
            e.preventDefault();
            
            const scheduleData = this.collectFormData();
            
            // Create preview modal or alert
            let previewText = 'Schedule Preview:\n\n';
            
            for (let day = 0; day <= 6; day++) {
                const dayData = scheduleData.availability[day];
                if (dayData && dayData.enabled) {
                    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    previewText += `${dayNames[day]}:\n`;
                    
                    if (dayData.time_slots && dayData.time_slots.length > 0) {
                        dayData.time_slots.forEach(slot => {
                            previewText += `  ${slot.start_time} - ${slot.end_time}`;
                            if (slot.break_start && slot.break_end) {
                                previewText += ` (Break: ${slot.break_start} - ${slot.break_end})`;
                            }
                            previewText += '\n';
                        });
                    }
                    
                    previewText += `  Duration: ${dayData.session_duration}min, Buffer: ${dayData.buffer_time}min\n`;
                    if (dayData.location) {
                        previewText += `  Location: ${dayData.location}\n`;
                    }
                    previewText += '\n';
                }
            }
            
            alert(previewText);
        },
        
        /**
         * Reset the schedule form
         */
        resetSchedule: function(e) {
            if (e) e.preventDefault();
            
            if (confirm('Reset all schedule data? This will clear all current settings.')) {
                this.resetScheduleForm();
                this.markUnsavedChanges();
            }
        },
        
        /**
         * Save trainer availability
         */
        saveAvailability: function(e) {
            e.preventDefault();
            
            if (!this.state.selectedTrainerId) {
                this.showError('Please select a trainer first');
                return;
            }
            
            const formData = this.collectFormData();
            
            // Validate form data
            const validation = this.validateFormData(formData);
            if (!validation.valid) {
                this.showError('Validation failed: ' + validation.errors.join(', '));
                return;
            }
            
            this.showLoading(true);
            
            // Prepare AJAX data
            const ajaxData = {
                action: 'save_trainer_availability',
                trainer_id: this.state.selectedTrainerId,
                nonce: this.config.nonce,
                ...formData
            };
            
            $.ajax({
                url: this.config.ajaxUrl,
                type: 'POST',
                data: ajaxData,
                success: (response) => {
                    this.showLoading(false);
                    
                    if (response.success) {
                        this.showSuccess('Trainer availability saved successfully!');
                        this.state.hasUnsavedChanges = false;
                        
                        // Optionally generate recurring events
                        this.promptGenerateEvents();
                    } else {
                        this.showError(response.data?.message || 'Failed to save trainer availability');
                    }
                },
                error: (xhr, status, error) => {
                    this.showLoading(false);
                    this.showError('Network error: ' + error);
                }
            });
        },
        
        /**
         * Prompt to generate recurring events
         */
        promptGenerateEvents: function() {
            const generate = confirm('Availability saved! Would you like to generate recurring events for the next 30 days?');
            
            if (generate) {
                const startDate = new Date().toISOString().split('T')[0];
                const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                
                this.generateRecurringEvents(startDate, endDate, 'assessment');
            }
        },
        
        /**
         * Generate recurring events
         */
        generateRecurringEvents: function(startDate, endDate, eventType) {
            this.showLoading(true);
            
            $.ajax({
                url: this.config.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'generate_recurring_events',
                    trainer_id: this.state.selectedTrainerId,
                    start_date: startDate,
                    end_date: endDate,
                    event_type: eventType,
                    nonce: this.config.nonce
                },
                success: (response) => {
                    this.showLoading(false);
                    
                    if (response.success) {
                        this.showSuccess(`Generated ${response.data.events_created} recurring events!`);
                    } else {
                        this.showError(response.data?.message || 'Failed to generate recurring events');
                    }
                },
                error: (xhr, status, error) => {
                    this.showLoading(false);
                    this.showError('Network error: ' + error);
                }
            });
        },
        
        /**
         * Collect form data
         */
        collectFormData: function() {
            const formData = {
                trainer_id: this.state.selectedTrainerId,
                availability: {},
                effective_date: $('#effective-date').val(),
                expiry_date: $('#expiry-date').val(),
                availability_type: $('[name="availability_type"]').val(),
                timezone: $('[name="timezone"]').val(),
                notes: $('[name="notes"]').val()
            };
            
            // Collect availability for each day
            for (let day = 0; day <= 6; day++) {
                const isEnabled = $(`#day-${day}-enabled`).is(':checked');
                
                if (isEnabled) {
                    formData.availability[day] = {
                        enabled: true,
                        session_duration: $(`[name="availability[${day}][session_duration]"]`).val(),
                        buffer_time: $(`[name="availability[${day}][buffer_time]"]`).val(),
                        location: $(`[name="availability[${day}][location]"]`).val(),
                        max_sessions: $(`[name="availability[${day}][max_sessions]"]`).val(),
                        time_slots: []
                    };
                    
                    // Collect time slots for this day
                    $(`#day-${day}-slots .time-slot`).each(function() {
                        const $slot = $(this);
                        formData.availability[day].time_slots.push({
                            start_time: $slot.find('[name$="[start_time]"]').val(),
                            end_time: $slot.find('[name$="[end_time]"]').val(),
                            break_start: $slot.find('[name$="[break_start]"]').val(),
                            break_end: $slot.find('[name$="[break_end]"]').val()
                        });
                    });
                }
            }
            
            return formData;
        },
        
        /**
         * Validate form data
         */
        validateFormData: function(data) {
            const errors = [];
            
            // Check if at least one day is enabled
            const enabledDays = Object.keys(data.availability).filter(day => data.availability[day].enabled);
            if (enabledDays.length === 0) {
                errors.push('At least one day must be enabled');
            }
            
            // Validate time slots
            enabledDays.forEach(day => {
                const dayData = data.availability[day];
                if (!dayData.time_slots || dayData.time_slots.length === 0) {
                    errors.push(`Day ${day} is enabled but has no time slots`);
                }
                
                dayData.time_slots.forEach((slot, index) => {
                    if (!slot.start_time || !slot.end_time) {
                        errors.push(`Day ${day}, slot ${index + 1}: Start and end times are required`);
                    }
                    
                    if (slot.start_time >= slot.end_time) {
                        errors.push(`Day ${day}, slot ${index + 1}: End time must be after start time`);
                    }
                });
            });
            
            // Validate dates
            if (data.effective_date && data.expiry_date) {
                if (new Date(data.effective_date) >= new Date(data.expiry_date)) {
                    errors.push('Expiry date must be after effective date');
                }
            }
            
            return {
                valid: errors.length === 0,
                errors: errors
            };
        },
        
        /**
         * Reset the entire form
         */
        resetForm: function() {
            $('#availability-trainer-select').val('');
            $('#selected-trainer-id').val('');
            $('#load-trainer-availability').prop('disabled', true);
            
            this.resetScheduleForm();
            
            $('#availability-schedule-form').hide();
            $('#availability-loading').hide();
            $('#no-trainer-selected').show();
            
            this.state.selectedTrainerId = null;
            this.state.currentAvailability = {};
            this.state.hasUnsavedChanges = false;
        },
        
        /**
         * Reset just the schedule form
         */
        resetScheduleForm: function() {
            // Uncheck all days and hide their settings
            for (let day = 0; day <= 6; day++) {
                $(`#day-${day}-enabled`).prop('checked', false);
                $(`#day-${day}-slots`).hide().empty();
                $(`#day-${day}-settings`).hide();
            }
            
            // Reset global settings
            $('#effective-date').val(new Date().toISOString().split('T')[0]);
            $('#expiry-date').val('');
            $('[name="availability_type"]').val('both');
            $('[name="timezone"]').val('America/New_York');
            $('[name="notes"]').val('');
        },
        
        /**
         * Mark form as having unsaved changes
         */
        markUnsavedChanges: function() {
            this.state.hasUnsavedChanges = true;
        },
        
        /**
         * Handle before unload
         */
        onBeforeUnload: function(e) {
            if (this.state.hasUnsavedChanges) {
                const message = 'You have unsaved changes. Are you sure you want to leave?';
                e.returnValue = message;
                return message;
            }
        },
        
        /**
         * Show loading state
         */
        showLoading: function(show) {
            this.state.isLoading = show;
            
            if (show) {
                $('#availability-loading').show();
                $('#availability-schedule-form').hide();
                $('#no-trainer-selected').hide();
            } else {
                $('#availability-loading').hide();
            }
        },
        
        /**
         * Show success message
         */
        showSuccess: function(message) {
            // Create temporary success notice
            const notice = $(`<div class="notice notice-success is-dismissible" style="margin: 10px 0;"><p>${message}</p></div>`);
            $('#trainer-availability-modal .modal-body').prepend(notice);
            
            setTimeout(() => {
                notice.fadeOut(() => notice.remove());
            }, 3000);
        },
        
        /**
         * Show error message
         */
        showError: function(message) {
            // Create temporary error notice
            const notice = $(`<div class="notice notice-error is-dismissible" style="margin: 10px 0;"><p>${message}</p></div>`);
            $('#trainer-availability-modal .modal-body').prepend(notice);
            
            setTimeout(() => {
                notice.fadeOut(() => notice.remove());
            }, 5000);
        }
    };
    
    // Initialize when document is ready
    $(document).ready(function() {
        TrainerAvailability.init();
    });
    
})(jQuery); 