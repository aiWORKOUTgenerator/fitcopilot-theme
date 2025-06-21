/**
 * Training Calendar - Trainer Availability Admin Interface (Modular)
 * 
 * Orchestrates the modular trainer availability system
 * Integrates Event Types, Form Management, and Modal Management modules
 * 
 * Part of Phase 1: JavaScript Modularization
 */

(function($) {
    'use strict';
    
    // Ensure $ is available - fallback to jQuery if $ is not defined
    if (typeof $ === 'undefined' && typeof jQuery !== 'undefined') {
        $ = jQuery;
    }

    // Main TrainerAvailability orchestrator (now modular)
    window.TrainerAvailability = {
        
        // Configuration
        config: {
            nonce: (window.fitcopilotTrainingCalendarAjax && window.fitcopilotTrainingCalendarAjax.nonce) || 
                   (window.fitcopilotTrainingCalendarData && window.fitcopilotTrainingCalendarData.nonce) || '',
            ajaxUrl: (window.fitcopilotTrainingCalendarAjax && window.fitcopilotTrainingCalendarAjax.ajax_url) || 
                     window.ajaxurl || '/wp-admin/admin-ajax.php'
        },
        
        // Module references
        modules: {
            eventTypes: null,
            form: null,
            modal: null
        },
        
        // Current state
        state: {
            selectedTrainerId: null,
            currentAvailability: {},
            isLoading: false
        },
        
        /**
         * Initialize the modular trainer availability interface
         */
        init: function() {
            console.log('TrainerAvailability: Initializing modular system...');
            
            // Initialize modules in dependency order
            try {
                this.initializeModules();
                this.bindCoreEvents();
                console.log('TrainerAvailability: Modular system initialized successfully');
            } catch (error) {
                console.error('TrainerAvailability: Initialization failed:', error);
                this.fallbackToLegacyMode();
            }
        },
        
        /**
         * Initialize all modules
         */
        initializeModules: function() {
            // Check module availability
            if (typeof TrainerAvailabilityEventTypes === 'undefined') {
                console.warn('Event Types module not loaded');
            } else {
                this.modules.eventTypes = TrainerAvailabilityEventTypes;
            }
            
            // Initialize Form Management module
            if (typeof TrainerAvailabilityFormManagement === 'undefined') {
                console.warn('Form Management module not loaded');
            } else {
                this.modules.formManagement = TrainerAvailabilityFormManagement;
                this.modules.formManagement.init(this.modules.eventTypes);
            }
            
            // Initialize Time Slot Manager module
            if (typeof TrainerAvailabilityTimeSlotManager === 'undefined') {
                console.warn('Time Slot Manager module not loaded');
            } else {
                this.modules.timeSlotManager = TrainerAvailabilityTimeSlotManager;
                this.modules.timeSlotManager.init(this.modules.eventTypes, this.modules.formManagement);
            }
            
            // Initialize Form Validation module
            if (typeof TrainerAvailabilityFormValidation === 'undefined') {
                console.warn('Form Validation module not loaded');
            } else {
                this.modules.formValidation = TrainerAvailabilityFormValidation;
                this.modules.formValidation.init(this.modules.eventTypes, this.modules.formManagement);
            }
            
            // Initialize Modal module (depends on other modules)
            if (typeof TrainerAvailabilityModal === 'undefined') {
                console.warn('Modal module not loaded');
            } else {
                this.modules.modal = TrainerAvailabilityModal;
                this.modules.modal.init(this.modules.formManagement);
            }
            
            // Legacy compatibility
            this.modules.form = this.modules.formManagement;
        },
        
        /**
         * Bind core orchestrator events only
         */
        bindCoreEvents: function() {
            // Trainer selection (core orchestrator responsibility)
            $(document).on('change', '#availability-trainer-select', this.onTrainerSelect.bind(this));
            $(document).on('click', '#load-trainer-availability', this.loadTrainerAvailability.bind(this));
            
            // Form submission (core orchestrator responsibility)
            $(document).on('click', '#preview-schedule', this.previewSchedule.bind(this));
            $(document).on('submit', '#trainer-availability-form', this.saveAvailability.bind(this));
            
            // Note: Modal events are handled by TrainerAvailabilityModal module
            // Note: Form events are handled by TrainerAvailabilityForm module
            // Note: Event type events are handled by TrainerAvailabilityEventTypes module
        },
        
        /**
         * Fallback to legacy mode if modules fail
         */
        fallbackToLegacyMode: function() {
            console.warn('TrainerAvailability: Falling back to legacy mode');
            // Basic functionality without modules
            this.bindLegacyEvents();
        },
        
        /**
         * Bind minimal legacy events
         */
        bindLegacyEvents: function() {
            $(document).on('click', '#manage-trainers-btn', function() {
                alert('Trainer availability system is not fully loaded. Please refresh the page.');
            });
        },
        
        /**
         * Handle trainer selection (delegates to modal module)
         */
        onTrainerSelect: function(e) {
            const trainerId = $(e.target).val();
            this.state.selectedTrainerId = trainerId;
            
            if (this.modules.modal) {
                if (trainerId) {
                    // Reset form and prepare for loading
                    if (this.modules.form) {
                        this.modules.form.resetForm();
                    }
                } else {
                    this.modules.modal.showNoTrainerSelected();
                }
            }
        },
        
        /**
         * Load trainer availability via AJAX
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
                    
                    if (response.success) {
                        this.handleAvailabilityLoaded(response.data);
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
         * Handle successful availability data load
         */
        handleAvailabilityLoaded: function(data) {
            if (this.modules.formManagement && this.modules.modal) {
                // Populate the form with loaded data
                this.populateAvailabilityForm(data.availability);
                this.modules.modal.showForm();
                this.showSuccess('Trainer availability loaded successfully');
            }
            
            this.state.currentAvailability = data.availability || [];
        },
        
        /**
         * Populate availability form with data
         */
        populateAvailabilityForm: function(availability) {
            if (!availability) return;
            
            Object.keys(availability).forEach(day => {
                const dayData = availability[day];
                
                if (dayData.enabled) {
                    // Enable the day
                    $(`#day-${day}-enabled`).prop('checked', true);
                    this.modules.timeSlotManager?.toggleDaySettings(day, true);
                    
                    // Add time slots
                    if (dayData.time_slots && dayData.time_slots.length > 0) {
                        dayData.time_slots.forEach(slot => {
                            this.modules.timeSlotManager?.addTimeSlot(null, day, slot);
                        });
                    }
                }
            });
        },
        
        /**
         * Preview schedule (delegates to validation module)
         */
        previewSchedule: function(e) {
            e.preventDefault();
            
            if (this.modules.formValidation) {
                const validation = this.modules.formValidation.validateForm(e);
                if (validation.valid) {
                    this.generateSchedulePreview(validation.data);
                } else {
                    this.showError('Please fix form errors: ' + validation.errors.join(', '));
                }
            }
        },
        
        /**
         * Generate schedule preview
         */
        generateSchedulePreview: function(formData) {
            // Simple preview implementation
            let previewText = 'Schedule Preview:\n\n';
            
            if (formData.event_type && this.modules.eventTypes) {
                const eventType = this.modules.eventTypes.getEventType(formData.event_type);
                if (eventType) {
                    previewText += `Event Type: ${eventType.title}\n`;
                    if (formData.duration) {
                        previewText += `Duration: ${formData.duration} minutes\n`;
                    }
                    previewText += '\n';
                }
            }
            
            const enabledDays = Object.keys(formData.availability || {}).filter(day => formData.availability[day].enabled);
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            
            enabledDays.forEach(day => {
                const dayData = formData.availability[day];
                previewText += `${dayNames[day]}:\n`;
                
                if (dayData.time_slots && dayData.time_slots.length > 0) {
                    dayData.time_slots.forEach(slot => {
                        previewText += `  ${slot.start_time} - ${slot.end_time}\n`;
                    });
                }
                previewText += '\n';
            });
            
            alert(previewText);
        },
        
        /**
         * Save availability (main orchestrator responsibility)
         */
        saveAvailability: function(e) {
            e.preventDefault();
            
            if (!this.modules.form) {
                this.showError('Form module not available');
                return;
            }
            
            const validation = this.modules.form.validateForm();
            if (!validation.valid) {
                this.showError('Validation failed: ' + validation.errors.join(', '));
                return;
            }
            
            this.showLoading(true);
            
            const ajaxData = {
                action: 'save_trainer_availability',
                trainer_id: this.state.selectedTrainerId,
                nonce: this.config.nonce,
                ...validation.data
            };
            
            $.ajax({
                url: this.config.ajaxUrl,
                type: 'POST',
                data: ajaxData,
                success: (response) => {
                    this.showLoading(false);
                    
                    if (response.success) {
                        this.showSuccess('Trainer availability saved successfully!');
                        if (this.modules.form) {
                            this.modules.form.clearUnsavedChanges();
                        }
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
         * Show loading state (delegates to modal)
         */
        showLoading: function(show) {
            this.state.isLoading = show;
            if (this.modules.modal) {
                if (show) {
                    this.modules.modal.showLoading();
                } else {
                    this.modules.modal.hideLoading();
                }
            }
        },
        
        /**
         * Show success message (delegates to modal)
         */
        showSuccess: function(message) {
            if (this.modules.modal) {
                this.modules.modal.showSuccess(message);
            } else {
                console.log('Success: ' + message);
            }
        },
        
        /**
         * Show error message (delegates to modal)
         */
        showError: function(message) {
            if (this.modules.modal) {
                this.modules.modal.showError(message);
            } else {
                console.error('Error: ' + message);
                alert('Error: ' + message);
            }
        }
    };
    
    // Initialize when document is ready
    $(document).ready(function() {
        console.log('TrainerAvailability: Document ready, initializing modular system...');
        TrainerAvailability.init();
    });
    
})(jQuery); 