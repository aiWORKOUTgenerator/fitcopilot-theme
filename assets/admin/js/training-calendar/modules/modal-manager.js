/**
 * Training Calendar - Modal Manager Module
 * 
 * Handles modal show/hide logic, state management, and event binding
 * Part of the modular trainer availability system
 */

(function($) {
    'use strict';

    // Modal Manager Module
    window.TrainerAvailabilityModal = {
        
        // Configuration
        config: {
            modalSelector: '#trainer-availability-modal',
            overlaySelector: '.modal-overlay',
            closeSelector: '.modal-close',
            bodyClass: 'modal-open',
            animationDuration: 300
        },
        
        // State
        state: {
            isOpen: false,
            modalJustOpened: false,
            preventClose: false,
            closeCallback: null
        },
        
        // Dependencies
        dependencies: {
            formModule: null
        },
        
        /**
         * Initialize modal manager
         */
        init: function(formModule) {
            this.dependencies.formModule = formModule;
            this.bindModalEvents();
            this.initializeModal();
            console.log('TrainerAvailabilityModal: Initialized');
        },
        
        /**
         * Bind modal-specific events
         */
        bindModalEvents: function() {
            // Modal trigger
            $(document).on('click', '#manage-trainers-btn', this.show.bind(this));
            
            // Close events
            $(document).on('click', this.config.modalSelector + ' ' + this.config.closeSelector, this.hide.bind(this));
            $(document).on('click', this.config.modalSelector + ' ' + this.config.overlaySelector, this.onOverlayClick.bind(this));
            
            // Escape key
            $(document).on('keydown', this.onKeyDown.bind(this));
            
            // Prevent accidental navigation
            $(window).on('beforeunload', this.onBeforeUnload.bind(this));
        },
        
        /**
         * Initialize modal state
         */
        initializeModal: function() {
            const $modal = $(this.config.modalSelector);
            
            if ($modal.length === 0) {
                console.log('TrainerAvailabilityModal: Modal template not found, skipping initialization');
                return;
            }
            
            // Ensure modal is hidden initially
            $modal.hide().removeClass('show');
            
            // Initialize form sections
            this.initializeFormSections();
            
            console.log('TrainerAvailabilityModal: Modal initialized');
        },
        
        /**
         * Initialize form sections visibility
         */
        initializeFormSections: function() {
            $('#availability-schedule-form').hide();
            $('#availability-loading').hide();
            $('#no-trainer-selected').show();
            
            // Initialize event type selector if present
            const $eventTypeSelect = $('#event-type-select');
            if ($eventTypeSelect.length === 0) {
                console.log('TrainerAvailabilityModal: Adding event type selector to modal');
                this.addEventTypeSelector();
            }
        },
        
        /**
         * Add event type selector to modal
         */
        addEventTypeSelector: function() {
            const $trainerSelection = $('.trainer-selection');
            if ($trainerSelection.length === 0) return;
            
            // Check if event types module is available
            if (typeof TrainerAvailabilityEventTypes === 'undefined') {
                console.warn('Event types module not available, skipping event type selector');
                return;
            }
            
            const eventTypeHtml = `
                <div class="event-type-selection" style="margin-bottom: 20px; padding: 20px; background: #f0f6fc; border: 1px solid #c3d4e6; border-radius: 8px;">
                    <h4 style="margin: 0 0 15px 0; color: #1d2327;">Event Type Configuration</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <label for="event-type-select" style="display: block; margin-bottom: 5px; font-weight: 500;">Event Type:</label>
                            <select id="event-type-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                ${TrainerAvailabilityEventTypes.getEventTypeOptions()}
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="event-duration-select" style="display: block; margin-bottom: 5px; font-weight: 500;">Duration:</label>
                            <select id="event-duration-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="">Select event type first</option>
                            </select>
                        </div>
                    </div>
                    <div id="event-type-description" style="margin-top: 10px; padding: 10px; background: #fff; border-radius: 4px; display: none; font-style: italic; color: #666;"></div>
                    <div id="pricing-display" style="margin-top: 10px; font-weight: 600; color: #10b981; display: none;"></div>
                </div>
            `;
            
            $trainerSelection.after(eventTypeHtml);
        },
        
        /**
         * Show modal
         */
        show: function(e) {
            if (e) e.preventDefault();
            
            const $modal = $(this.config.modalSelector);
            
            // Check if modal exists
            if ($modal.length === 0) {
                console.error('TrainerAvailabilityModal: Modal not found');
                this.showModalNotFoundError();
                return;
            }
            
            // Set flags
            this.state.isOpen = true;
            this.state.modalJustOpened = true;
            
            // Show modal with animation
            $modal.addClass('show').fadeIn(this.config.animationDuration);
            $('body').addClass(this.config.bodyClass);
            
            // Reset form if form module is available
            if (this.dependencies.formModule) {
                this.dependencies.formModule.resetForm();
            }
            
            // Reset prevent close flag after animation
            setTimeout(() => {
                this.state.modalJustOpened = false;
            }, this.config.animationDuration + 200);
            
            console.log('TrainerAvailabilityModal: Modal opened');
            
            // Focus management for accessibility
            this.setInitialFocus();
        },
        
        /**
         * Hide modal
         */
        hide: function(e, force = false) {
            if (e) e.preventDefault();
            
            // Prevent immediate closing
            if (this.state.modalJustOpened && !force) {
                console.log('TrainerAvailabilityModal: Preventing immediate close');
                return;
            }
            
            // Check for unsaved changes
            if (!force && this.hasUnsavedChanges()) {
                if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
                    return;
                }
            }
            
            // Set state
            this.state.isOpen = false;
            this.state.preventClose = false;
            
            // Hide modal
            const $modal = $(this.config.modalSelector);
            $modal.removeClass('show').fadeOut(this.config.animationDuration);
            
            // Restore body state
            $('body').removeClass(this.config.bodyClass);
            $('body').css('overflow', ''); // Ensure scrolling is restored
            
            // Reset form
            if (this.dependencies.formModule) {
                this.dependencies.formModule.resetForm();
            }
            
            // Execute callback if provided
            if (this.state.closeCallback) {
                this.state.closeCallback();
                this.state.closeCallback = null;
            }
            
            console.log('TrainerAvailabilityModal: Modal closed');
        },
        
        /**
         * Handle overlay click
         */
        onOverlayClick: function(e) {
            // Only close if clicking directly on overlay
            if (e.target === e.currentTarget) {
                this.hide(e);
            }
        },
        
        /**
         * Handle keyboard events
         */
        onKeyDown: function(e) {
            if (!this.state.isOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    this.hide(e);
                    break;
                case 'Tab':
                    this.handleTabKey(e);
                    break;
            }
        },
        
        /**
         * Handle tab key for focus trapping
         */
        handleTabKey: function(e) {
            const $modal = $(this.config.modalSelector);
            const focusableElements = $modal.find('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements.first();
            const lastElement = focusableElements.last();
            
            if (e.shiftKey && $(document.activeElement).is(firstElement)) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && $(document.activeElement).is(lastElement)) {
                e.preventDefault();
                firstElement.focus();
            }
        },
        
        /**
         * Set initial focus for accessibility
         */
        setInitialFocus: function() {
            setTimeout(() => {
                const $firstInput = $(this.config.modalSelector).find('select, input').first();
                if ($firstInput.length) {
                    $firstInput.focus();
                }
            }, this.config.animationDuration + 100);
        },
        
        /**
         * Handle before unload
         */
        onBeforeUnload: function(e) {
            if (this.state.isOpen && this.hasUnsavedChanges()) {
                const message = 'You have unsaved changes in the trainer availability modal. Are you sure you want to leave?';
                e.returnValue = message;
                return message;
            }
        },
        
        /**
         * Show loading state
         */
        showLoading: function(message = 'Loading...') {
            $('#availability-loading p').text(message);
            $('#availability-loading').show();
            $('#availability-schedule-form').hide();
            $('#no-trainer-selected').hide();
        },
        
        /**
         * Hide loading state
         */
        hideLoading: function() {
            $('#availability-loading').hide();
        },
        
        /**
         * Show success message
         */
        showSuccess: function(message, duration = 3000) {
            this.showNotice(message, 'success', duration);
        },
        
        /**
         * Show error message
         */
        showError: function(message, duration = 5000) {
            this.showNotice(message, 'error', duration);
        },
        
        /**
         * Show notice message
         */
        showNotice: function(message, type = 'info', duration = 3000) {
            const noticeClass = type === 'error' ? 'notice-error' : 'notice-success';
            const notice = $(`
                <div class="notice ${noticeClass} is-dismissible" style="margin: 10px 0;">
                    <p>${message}</p>
                    <button type="button" class="notice-dismiss">
                        <span class="screen-reader-text">Dismiss this notice.</span>
                    </button>
                </div>
            `);
            
            const $modalBody = $(this.config.modalSelector + ' .modal-body');
            $modalBody.prepend(notice);
            
            // Auto-remove notice
            setTimeout(() => {
                notice.fadeOut(() => notice.remove());
            }, duration);
            
            // Handle dismiss button
            notice.find('.notice-dismiss').on('click', function() {
                notice.fadeOut(() => notice.remove());
            });
        },
        
        /**
         * Show modal not found error
         */
        showModalNotFoundError: function() {
            alert('Trainer availability modal is not available. Please refresh the page and try again.');
        },
        
        /**
         * Check if form has unsaved changes
         */
        hasUnsavedChanges: function() {
            if (this.dependencies.formModule && typeof this.dependencies.formModule.hasUnsavedChanges === 'function') {
                return this.dependencies.formModule.hasUnsavedChanges();
            }
            return false;
        },
        
        /**
         * Show form
         */
        showForm: function() {
            $('#availability-schedule-form').show();
            $('#availability-loading').hide();
            $('#no-trainer-selected').hide();
        },
        
        /**
         * Show no trainer selected state
         */
        showNoTrainerSelected: function() {
            $('#no-trainer-selected').show();
            $('#availability-schedule-form').hide();
            $('#availability-loading').hide();
        },
        
        /**
         * Set close callback
         */
        setCloseCallback: function(callback) {
            this.state.closeCallback = callback;
        },
        
        /**
         * Prevent modal from closing
         */
        preventClose: function(prevent = true) {
            this.state.preventClose = prevent;
        },
        
        /**
         * Check if modal is open
         */
        isOpen: function() {
            return this.state.isOpen;
        },
        
        /**
         * Force close modal
         */
        forceClose: function() {
            this.hide(null, true);
        }
    };
    
})(jQuery); 