/**
 * Training Calendar - Event Type Integration Module
 * 
 * Bridges frontend and backend event type systems with AJAX communication
 * Part of Phase 2: Frontend-Backend Bridge
 */

(function($) {
    'use strict';

    // Event Type Integration Module
    window.TrainerAvailabilityEventIntegration = {
        
        // Configuration
        config: {
            ajaxUrl: (window.fitcopilotTrainingCalendarAjax && window.fitcopilotTrainingCalendarAjax.ajax_url) || 
                     window.ajaxurl || '/wp-admin/admin-ajax.php',
            nonce: (window.fitcopilotTrainingCalendarAjax && window.fitcopilotTrainingCalendarAjax.nonce) || 
                   (window.fitcopilotTrainingCalendarData && window.fitcopilotTrainingCalendarData.nonce) || '',
            timeout: 10000, // 10 seconds
            cache: {
                eventTypes: null,
                ttl: 300000 // 5 minutes
            }
        },
        
        // State
        state: {
            currentEventType: null,
            eventConfig: null,
            isLoading: false
        },
        
        /**
         * Initialize event type integration
         */
        init: function() {
            this.bindIntegrationEvents();
            this.loadEventTypeConfig();
            console.log('TrainerAvailabilityEventIntegration: Initialized');
        },
        
        /**
         * Bind integration-specific events
         */
        bindIntegrationEvents: function() {
            // Event type configuration loading
            $(document).on('focus', '#event-type-select', this.ensureEventConfigLoaded.bind(this));
            
            // Real-time validation
            $(document).on('change', '#event-type-select, #event-duration-select', this.validateEventTypeData.bind(this));
            
            // Backend synchronization
            $(document).on('availability:beforeSave', this.onBeforeSave.bind(this));
            $(document).on('availability:afterSave', this.onAfterSave.bind(this));
        },
        
        /**
         * Load event type configuration from backend
         */
        loadEventTypeConfig: async function() {
            // Check cache first
            if (this.isCacheValid()) {
                return this.config.cache.eventTypes;
            }
            
            try {
                this.state.isLoading = true;
                
                // Debug AJAX configuration
                console.log('Event Integration Debug - AJAX Config:', {
                    url: this.config.ajaxUrl,
                    nonce: this.config.nonce ? 'Present' : 'Missing',
                    action: 'get_event_type_config'
                });
                
                const response = await $.ajax({
                    url: this.config.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'get_event_type_config',
                        nonce: this.config.nonce
                    },
                    timeout: this.config.timeout
                });
                
                console.log('Event Integration Debug - AJAX Response:', response);
                
                if (response.success) {
                    this.config.cache.eventTypes = response.data;
                    this.config.cache.loadedAt = Date.now();
                    this.populateEventTypeSelect(response.data);
                    return response.data;
                } else {
                    throw new Error(response.data?.message || 'Failed to load event type configuration');
                }
                
            } catch (error) {
                console.error('Event Type Integration - Load Config Error:', error);
                this.showLoadError('Failed to load event type configuration');
                return null;
            } finally {
                this.state.isLoading = false;
            }
        },
        
        /**
         * Ensure event configuration is loaded
         */
        ensureEventConfigLoaded: async function() {
            if (!this.config.cache.eventTypes || !this.isCacheValid()) {
                await this.loadEventTypeConfig();
            }
        },
        
        /**
         * Populate event type select dropdown
         */
        populateEventTypeSelect: function(eventTypes) {
            const select = $('#event-type-select');
            if (select.length === 0) return;
            
            // Save current selection
            const currentValue = select.val();
            
            // Build options HTML
            let options = '<option value="">Select Event Type...</option>';
            
            Object.keys(eventTypes).forEach(eventId => {
                const eventType = eventTypes[eventId];
                const durationText = this.getDurationDisplayText(eventType);
                options += `<option value="${eventId}">${eventType.title}${durationText}</option>`;
            });
            
            // Update select and restore selection
            select.html(options);
            if (currentValue) {
                select.val(currentValue);
            }
        },
        
        /**
         * Get duration display text for event type
         */
        getDurationDisplayText: function(eventType) {
            if (eventType.trainer_scheduled) {
                return ' (Trainer Scheduled)';
            } else if (eventType.duration && !eventType.requires_duration_selection) {
                return ` (${eventType.duration} min)`;
            } else if (eventType.durations && eventType.durations.length > 0) {
                return ` (${eventType.durations.join('/')} min)`;
            }
            return '';
        },
        
        /**
         * Update form for selected event type
         */
        updateFormForEventType: function(eventTypeId) {
            const eventType = this.getEventType(eventTypeId);
            if (!eventType) return;
            
            this.state.currentEventType = eventTypeId;
            this.state.eventConfig = eventType;
            
            // Update duration selector
            this.updateDurationSelector(eventType);
            
            // Update form description
            this.updateEventDescription(eventType);
            
            // Update pricing display
            this.updatePricingDisplay(eventType);
            
            // Apply availability rules
            this.applyAvailabilityRules(eventType);
            
            // Trigger event for other modules
            $(document).trigger('eventType:changed', [eventTypeId, eventType]);
        },
        
        /**
         * Update duration selector based on event type
         */
        updateDurationSelector: function(eventType) {
            const durationSelect = $('#event-duration-select');
            const durationContainer = durationSelect.closest('.form-field');
            
            if (eventType.trainer_scheduled) {
                // Hide duration selector for trainer-scheduled events
                durationContainer.hide();
                this.showTrainerScheduledNotice();
            } else {
                durationContainer.show();
                this.hideTrainerScheduledNotice();
                
                if (eventType.requires_duration_selection && eventType.durations) {
                    // Populate duration options
                    let options = '<option value="">Select Duration...</option>';
                    eventType.durations.forEach(duration => {
                        const pricing = this.getDurationPricing(eventType, duration);
                        const priceText = pricing ? ` ($${pricing})` : '';
                        options += `<option value="${duration}">${duration} minutes${priceText}</option>`;
                    });
                    durationSelect.html(options);
                } else if (eventType.duration) {
                    // Fixed duration
                    durationSelect.html(`<option value="${eventType.duration}" selected>${eventType.duration} minutes</option>`);
                }
            }
        },
        
        /**
         * Get pricing for specific duration
         */
        getDurationPricing: function(eventType, duration) {
            if (!eventType.pricing) return null;
            
            if (eventType.pricing.type === 'duration_based' && eventType.pricing.rates) {
                return eventType.pricing.rates[duration] || null;
            } else if (eventType.pricing.type === 'fixed') {
                return eventType.pricing.amount;
            } else if (eventType.pricing.type === 'free') {
                return 0;
            }
            
            return null;
        },
        
        /**
         * Update event description display
         */
        updateEventDescription: function(eventType) {
            const descElement = $('#event-type-description');
            if (descElement.length) {
                descElement.html(eventType.description || '').show();
            }
        },
        
        /**
         * Update pricing display
         */
        updatePricingDisplay: function(eventType) {
            const pricingElement = $('#event-pricing-display');
            if (pricingElement.length) {
                const pricingText = this.getPricingDisplayText(eventType);
                if (pricingText) {
                    pricingElement.html(pricingText).show();
                } else {
                    pricingElement.hide();
                }
            }
        },
        
        /**
         * Get pricing display text
         */
        getPricingDisplayText: function(eventType) {
            if (!eventType.pricing) return '';
            
            if (eventType.pricing.type === 'free') {
                return '<span class="pricing-free">Free</span>';
            } else if (eventType.pricing.type === 'fixed') {
                return `<span class="pricing-fixed">$${eventType.pricing.amount}</span>`;
            } else if (eventType.pricing.type === 'duration_based') {
                return '<span class="pricing-variable">Pricing varies by duration</span>';
            }
            
            return '';
        },
        
        /**
         * Apply availability rules based on event type
         */
        applyAvailabilityRules: function(eventType) {
            if (!eventType.availability_rules) return;
            
            const rules = eventType.availability_rules;
            
            // Apply day restrictions
            if (rules.allowed_days) {
                for (let day = 0; day < 7; day++) {
                    const dayCheckbox = $(`#day-${day}-enabled`);
                    const isAllowed = rules.allowed_days.includes(day);
                    
                    if (!isAllowed) {
                        dayCheckbox.prop('disabled', true);
                        dayCheckbox.prop('checked', false);
                        this.showDayRestrictionWarning(day, eventType.title);
                    } else {
                        dayCheckbox.prop('disabled', false);
                    }
                }
            }
            
            // Apply preferred times
            if (rules.preferred_times) {
                this.highlightPreferredTimes(rules.preferred_times);
            }
        },
        
        /**
         * Validate event type data via AJAX
         */
        validateEventTypeData: async function(e) {
            const eventType = $('#event-type-select').val();
            const duration = $('#event-duration-select').val();
            
            if (!eventType) return;
            
            try {
                const response = await $.ajax({
                    url: this.config.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'validate_event_type_data',
                        event_type: eventType,
                        duration: duration,
                        nonce: this.config.nonce
                    },
                    timeout: this.config.timeout
                });
                
                if (response.success) {
                    this.clearValidationErrors();
                    if (response.data.warnings && response.data.warnings.length > 0) {
                        this.showValidationWarnings(response.data.warnings);
                    }
                } else {
                    this.showValidationErrors(response.data.errors || ['Validation failed']);
                }
                
            } catch (error) {
                console.warn('Event Type Integration - Validation Error:', error);
            }
        },
        
        /**
         * Handle before save event
         */
        onBeforeSave: function(e, formData) {
            // Add event type context to form data
            if (this.state.currentEventType) {
                formData.event_type = this.state.currentEventType;
                formData.event_config = this.state.eventConfig;
            }
        },
        
        /**
         * Handle after save event
         */
        onAfterSave: function(e, result) {
            if (result.success) {
                // Clear cache to ensure fresh data on next load
                this.invalidateCache();
                
                // Trigger integration sync event
                $(document).trigger('eventType:synced', [this.state.currentEventType, result]);
            }
        },
        
        // Utility methods
        
        /**
         * Get event type configuration
         */
        getEventType: function(eventTypeId) {
            if (!this.config.cache.eventTypes) return null;
            return this.config.cache.eventTypes[eventTypeId] || null;
        },
        
        /**
         * Check if cache is valid
         */
        isCacheValid: function() {
            return this.config.cache.eventTypes && 
                   this.config.cache.loadedAt && 
                   (Date.now() - this.config.cache.loadedAt) < this.config.cache.ttl;
        },
        
        /**
         * Invalidate cache
         */
        invalidateCache: function() {
            this.config.cache.eventTypes = null;
            this.config.cache.loadedAt = null;
        },
        
        /**
         * Show trainer scheduled notice
         */
        showTrainerScheduledNotice: function() {
            const notice = $('#trainer-scheduled-notice');
            if (notice.length === 0) {
                const noticeHtml = '<div id="trainer-scheduled-notice" class="notice notice-info inline">' +
                                 '<p>This event type uses trainer-scheduled sessions. Duration is set by the trainer.</p></div>';
                $('#event-duration-select').closest('.form-field').after(noticeHtml);
            } else {
                notice.show();
            }
        },
        
        /**
         * Hide trainer scheduled notice
         */
        hideTrainerScheduledNotice: function() {
            $('#trainer-scheduled-notice').hide();
        },
        
        /**
         * Show day restriction warning
         */
        showDayRestrictionWarning: function(day, eventTitle) {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const warning = `${dayNames[day]} is not available for ${eventTitle} events`;
            
            const dayLabel = $(`label[for="day-${day}-enabled"]`);
            dayLabel.attr('title', warning).addClass('day-restricted');
        },
        
        /**
         * Highlight preferred times
         */
        highlightPreferredTimes: function(preferredTimes) {
            // Add visual indicators for preferred times
            $('.time-input').removeClass('preferred-time');
            
            preferredTimes.forEach(time => {
                $(`.time-input[value="${time}"]`).addClass('preferred-time');
            });
        },
        
        /**
         * Show validation errors
         */
        showValidationErrors: function(errors) {
            this.clearValidationMessages();
            
            const errorHtml = '<div id="event-type-validation-errors" class="notice notice-error inline"><ul>' +
                            errors.map(error => `<li>${error}</li>`).join('') +
                            '</ul></div>';
            
            $('#event-type-select').closest('.form-field').after(errorHtml);
        },
        
        /**
         * Show validation warnings
         */
        showValidationWarnings: function(warnings) {
            const warningHtml = '<div id="event-type-validation-warnings" class="notice notice-warning inline"><ul>' +
                              warnings.map(warning => `<li>${warning}</li>`).join('') +
                              '</ul></div>';
            
            $('#event-type-select').closest('.form-field').after(warningHtml);
        },
        
        /**
         * Clear validation messages
         */
        clearValidationMessages: function() {
            $('#event-type-validation-errors, #event-type-validation-warnings').remove();
        },
        
        /**
         * Clear validation errors
         */
        clearValidationErrors: function() {
            $('#event-type-validation-errors').remove();
        },
        
        /**
         * Show load error
         */
        showLoadError: function(message) {
            const errorHtml = '<div id="event-type-load-error" class="notice notice-error inline">' +
                            `<p>${message}</p></div>`;
            
            $('#event-type-select').closest('.form-field').after(errorHtml);
        },
        
        /**
         * Get current event type
         */
        getCurrentEventType: function() {
            return this.state.currentEventType;
        },
        
        /**
         * Get current event configuration
         */
        getCurrentEventConfig: function() {
            return this.state.eventConfig;
        },
        
        /**
         * Check if integration is loading
         */
        isLoading: function() {
            return this.state.isLoading;
        }
    };

})(jQuery || $); 