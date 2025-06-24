/**
 * Training Calendar - Assignment Manager Module
 * 
 * Handles trainer-event type assignment management for Day 3 Frontend Assignment UI
 * Integrates with Day 2 backend infrastructure
 */

(function($) {
    'use strict';

    // Assignment Manager Module
    window.TrainerAvailabilityAssignmentManager = {
        
        // Configuration
        config: {
            ajaxUrl: (window.fitcopilotTrainingCalendarAjax && window.fitcopilotTrainingCalendarAjax.ajax_url) || 
                     window.ajaxurl || '/wp-admin/admin-ajax.php',
            nonce: (window.fitcopilotTrainingCalendarAjax && window.fitcopilotTrainingCalendarAjax.nonce) || 
                   (window.fitcopilotTrainingCalendarData && window.fitcopilotTrainingCalendarData.nonce) || '',
            timeout: 10000,
            eventTypes: {
                'fitness_assessment': {
                    title: 'Fitness Assessment',
                    icon: '🏃‍♂️',
                    color: '#10b981',
                    description: 'Free, 20 min'
                },
                'personal_training': {
                    title: 'Personal Training',
                    icon: '💪',
                    color: '#3b82f6',
                    description: 'Duration-based pricing'
                },
                'group_fitness': {
                    title: 'Group Fitness Class',
                    icon: '🤸‍♀️',
                    color: '#f59e0b',
                    description: '$25, Trainer scheduled'
                },
                'group_forum': {
                    title: 'Group Discussion Forum',
                    icon: '💬',
                    color: '#8b5cf6',
                    description: 'Free, 30-45 min'
                }
            }
        },
        
        // State
        state: {
            assignments: {},
            trainers: [],
            statistics: {},
            isLoading: false,
            selectedTrainer: null,
            selectedEventType: null
        },
        
        /**
         * Initialize assignment manager - ENHANCED with real-time sync
         */
        init: function() {
            this.bindAssignmentEvents();
            this.loadTrainerData();
            this.initializeRealTimeSync();
            console.log('TrainerAvailabilityAssignmentManager: Initialized with real-time sync');
        },
        
        /**
         * Initialize real-time synchronization
         */
        initializeRealTimeSync: function() {
            // Listen for trainer data changes from Personal Training module
            $(document).on('fitcopilot:trainers:updated', this.handleTrainerDataUpdate.bind(this));
            $(document).on('fitcopilot:trainer:added', this.handleTrainerAdded.bind(this));
            $(document).on('fitcopilot:trainer:removed', this.handleTrainerRemoved.bind(this));
            
            // Set up periodic sync check (every 30 seconds)
            this.setupPeriodicSync();
            
            // Listen for window focus to refresh data
            $(window).on('focus', this.handleWindowFocus.bind(this));
            
            console.log('Assignment Manager: Real-time sync initialized');
        },
        
        /**
         * Set up periodic synchronization check
         */
        setupPeriodicSync: function() {
            setInterval(() => {
                if (!this.state.isLoading && this.isAssignmentTabVisible()) {
                    this.checkForTrainerUpdates();
                }
            }, 30000); // Check every 30 seconds
        },
        
        /**
         * Check if assignment tab is currently visible
         */
        isAssignmentTabVisible: function() {
            return $('#tab-assignments').hasClass('active') && $('#tab-assignments').is(':visible');
        },
        
        /**
         * Handle window focus event
         */
        handleWindowFocus: function() {
            // Refresh data when user returns to the page
            if (this.isAssignmentTabVisible()) {
                setTimeout(() => {
                    this.checkForTrainerUpdates();
                }, 1000); // Small delay to ensure page is fully focused
            }
        },
        
        /**
         * Check for trainer updates via AJAX
         */
        checkForTrainerUpdates: async function() {
            try {
                const response = await $.ajax({
                    url: this.config.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'check_trainer_updates',
                        last_sync: this.state.lastSyncTimestamp || 0,
                        nonce: this.config.nonce
                    },
                    timeout: 5000
                });
                
                if (response.success && response.data.has_updates) {
                    console.log('Assignment Manager: Trainer updates detected, refreshing...');
                    this.handleTrainerDataUpdate(null, response.data);
                }
            } catch (error) {
                // Silently fail for background sync checks
                console.debug('Assignment Manager: Background sync check failed:', error.message);
            }
        },
        
        /**
         * Handle trainer data update event
         */
        handleTrainerDataUpdate: function(event, data) {
            console.log('Assignment Manager: Handling trainer data update', data);
            
            // Update local trainer data
            this.loadTrainerData();
            
            // Refresh assignment matrix
            this.loadAssignmentMatrix();
            
            // Update statistics if visible
            if ($('#tab-statistics').hasClass('active')) {
                this.loadAssignmentStatistics();
            }
            
            // Update last sync timestamp
            this.state.lastSyncTimestamp = data?.sync_timestamp || Date.now();
            
            // Show notification about changes
            if (data?.added?.length > 0 || data?.removed?.length > 0) {
                this.showSyncNotification(data);
            }
        },
        
        /**
         * Handle trainer added event
         */
        handleTrainerAdded: function(event, trainerId) {
            console.log('Assignment Manager: Trainer added:', trainerId);
            
            // Refresh data
            this.handleTrainerDataUpdate(event, {
                added: [trainerId],
                removed: [],
                sync_timestamp: Date.now()
            });
        },
        
        /**
         * Handle trainer removed event
         */
        handleTrainerRemoved: function(event, trainerId) {
            console.log('Assignment Manager: Trainer removed:', trainerId);
            
            // Refresh data
            this.handleTrainerDataUpdate(event, {
                added: [],
                removed: [trainerId],
                sync_timestamp: Date.now()
            });
        },
        
        /**
         * Show synchronization notification
         */
        showSyncNotification: function(data) {
            const addedCount = data.added?.length || 0;
            const removedCount = data.removed?.length || 0;
            
            let message = 'Trainer data synchronized: ';
            const changes = [];
            
            if (addedCount > 0) {
                changes.push(`${addedCount} trainer${addedCount > 1 ? 's' : ''} added`);
            }
            
            if (removedCount > 0) {
                changes.push(`${removedCount} trainer${removedCount > 1 ? 's' : ''} removed`);
            }
            
            message += changes.join(', ');
            
            this.showNotice(message, 'info', 3000);
        },
        
        /**
         * Bind assignment-specific events
         */
        bindAssignmentEvents: function() {
            // Tab activation - listen for custom tab events from modal manager
            $(document).on('tab:activated:assignments', this.onAssignmentTabActivated.bind(this));
            $(document).on('tab:activated:statistics', this.onStatisticsTabActivated.bind(this));
            
            // Dashboard actions
            $(document).on('click', '#bulk-assign-btn', this.showBulkAssignModal.bind(this));
            $(document).on('click', '#refresh-assignments-btn', this.refreshAssignmentData.bind(this));
            $(document).on('click', '#export-assignments-btn', this.exportAssignments.bind(this));
            
            // Individual assignment form
            $(document).on('change', '#assignment-trainer-select', this.onTrainerSelect.bind(this));
            $(document).on('change', '#assignment-event-type-select', this.onEventTypeSelect.bind(this));
            $(document).on('click', '#save-assignment-btn', this.saveAssignment.bind(this));
            $(document).on('click', '#remove-assignment-btn', this.removeAssignment.bind(this));
            
            // Matrix interactions
            $(document).on('click', '.assignment-checkbox', this.onMatrixCheckboxChange.bind(this));
            $(document).on('change', '#assignment-filter', this.filterAssignmentMatrix.bind(this));
            
            // Statistics actions
            $(document).on('click', '#export-summary-btn', this.exportSummary.bind(this));
        },
        
        /**
         * Load trainer data from WordPress
         */
        loadTrainerData: function() {
            const trainers = window.fitcopilotTrainingCalendarData?.trainers || [];
            this.state.trainers = trainers;
            console.log('Assignment Manager: Loaded', trainers.length, 'trainers');
        },
        
        /**
         * Handle assignment tab activation
         */
        onAssignmentTabActivated: function() {
            this.loadAssignmentMatrix();
            this.updateDashboardStats();
        },
        
        /**
         * Handle statistics tab activation
         */
        onStatisticsTabActivated: function() {
            console.log('Assignment Manager: Statistics tab activated');
            this.loadAssignmentStatistics();
        },
        
                 /**
         * Load assignment matrix via AJAX
         */
        loadAssignmentMatrix: async function() {
            const $matrix = $('#assignment-matrix');
            
            try {
                this.state.isLoading = true;
                
                // Show loading state
                $matrix.html(`
                    <div class="matrix-loading" style="padding: 40px; text-align: center; color: #666;">
                        <div class="spinner is-active" style="float: none; margin: 0 auto 15px;"></div>
                        <p>Loading assignment matrix...</p>
                    </div>
                `);
                
                // Debug configuration
                console.log('Assignment Manager Debug - AJAX Config:', {
                    url: this.config.ajaxUrl,
                    nonce: this.config.nonce ? 'Present' : 'Missing',
                    timeout: this.config.timeout
                });
                
                const response = await $.ajax({
                    url: this.config.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'get_trainer_assignments',
                        nonce: this.config.nonce
                    },
                    timeout: this.config.timeout
                });
                
                console.log('Assignment Manager Debug - AJAX Response:', response);
                
                if (response.success) {
                    // Handle the assignments data (can be nested or direct)
                    this.state.assignments = response.data.assignments || response.data || {};
                    
                    // Show info message if system not configured
                    if (response.data.message) {
                        console.log('Assignment Manager Info:', response.data.message);
                    }
                    
                    this.renderAssignmentMatrix();
                    this.updateDashboardStats();
                } else {
                    throw new Error(response.data?.message || 'Failed to load assignments');
                }
                
            } catch (error) {
                console.error('Assignment Manager - Load Matrix Error:', error);
                
                // Provide more detailed error information
                let errorMessage = 'Failed to load assignment matrix';
                if (error.status) {
                    errorMessage += ` (HTTP ${error.status})`;
                }
                if (error.responseText) {
                    console.error('Assignment Manager - Server Response:', error.responseText);
                    errorMessage += ': ' + error.message;
                } else {
                    errorMessage += ': ' + error.message;
                }
                
                this.showMatrixError(errorMessage);
            } finally {
                this.state.isLoading = false;
            }
        },
        
        /**
         * Render assignment matrix - FIXED with proper table structure
         */
        renderAssignmentMatrix: function() {
            const $matrix = $('#assignment-matrix');
            const eventTypes = Object.keys(this.config.eventTypes);
            
            // Check if we have trainers to display
            if (!this.state.trainers || this.state.trainers.length === 0) {
                $matrix.html(`
                    <div class="assignment-matrix-container">
                        <div style="padding: 40px; text-align: center; color: #666;">
                            <p><strong>No trainers found.</strong></p>
                            <p>Configure trainers in the Personal Training module to see them here.</p>
                        </div>
                    </div>
                `);
                return;
            }
            
            let tableHtml = '<div class="assignment-matrix-container">';
            tableHtml += '<table class="assignment-matrix-table">';
            
            // Table header
            tableHtml += '<thead><tr>';
            tableHtml += '<th>Trainer</th>';
            eventTypes.forEach(eventType => {
                const config = this.config.eventTypes[eventType];
                tableHtml += `<th title="${config.description}">
                    <div class="event-type-header">
                        <span class="event-icon">${config.icon}</span>
                        <span class="event-title">${config.title}</span>
                    </div>
                </th>`;
            });
            tableHtml += '</tr></thead>';
            
            // Table body - trainer rows
            tableHtml += '<tbody>';
            this.state.trainers.forEach(trainer => {
                tableHtml += '<tr>';
                tableHtml += `<td class="trainer-name" title="${trainer.specialty || ''}">${trainer.name}</td>`;
                
                eventTypes.forEach(eventType => {
                    const isAssigned = this.isTrainerAssigned(trainer.id, eventType);
                    const assignmentData = this.getAssignmentData(trainer.id, eventType);
                    
                    tableHtml += `<td class="matrix-cell assignment ${isAssigned ? 'assigned' : ''}" 
                                       data-trainer-id="${trainer.id}" 
                                       data-event-type="${eventType}"
                                       title="${isAssigned ? 'Assigned - Click to configure' : 'Not assigned - Click to assign'}">
                        <label class="assignment-label">
                            <input type="checkbox" class="assignment-checkbox" 
                                   ${isAssigned ? 'checked' : ''} 
                                   data-trainer-id="${trainer.id}" 
                                   data-event-type="${eventType}">
                            ${isAssigned && assignmentData?.hourly_rate ? 
                                `<span class="assignment-rate">$${assignmentData.hourly_rate}/hr</span>` : ''}
                        </label>
                    </td>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody></table></div>';
            
            $matrix.html(tableHtml);
            
            // Log success
            console.log('Assignment Matrix: Rendered successfully with', this.state.trainers.length, 'trainers');
        },
        
        /**
         * Check if trainer is assigned to event type
         */
        isTrainerAssigned: function(trainerId, eventType) {
            return this.state.assignments[trainerId] && 
                   this.state.assignments[trainerId][eventType] && 
                   this.state.assignments[trainerId][eventType].is_active;
        },
        
        /**
         * Get assignment data for trainer-event type
         */
        getAssignmentData: function(trainerId, eventType) {
            return this.state.assignments[trainerId] && 
                   this.state.assignments[trainerId][eventType] || null;
        },
        
        /**
         * Handle matrix checkbox change
         */
        onMatrixCheckboxChange: function(e) {
            e.stopPropagation();
            
            const $checkbox = $(e.target);
            const trainerId = $checkbox.data('trainer-id');
            const eventType = $checkbox.data('event-type');
            const isChecked = $checkbox.is(':checked');
            
            if (isChecked) {
                this.quickAssignTrainer(trainerId, eventType);
            } else {
                this.quickRemoveAssignment(trainerId, eventType);
            }
        },
        
        /**
         * Quick assign trainer to event type
         */
        quickAssignTrainer: async function(trainerId, eventType) {
            try {
                const response = await $.ajax({
                    url: this.config.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'assign_trainer_to_event_type',
                        trainer_id: trainerId,
                        event_type: eventType,
                        is_active: 1,
                        nonce: this.config.nonce
                    },
                    timeout: this.config.timeout
                });
                
                if (response.success) {
                    // Update local state
                    if (!this.state.assignments[trainerId]) {
                        this.state.assignments[trainerId] = {};
                    }
                    
                    // Handle new response structure
                    const assignmentData = response.data.assignment || {
                        trainer_id: trainerId,
                        event_type: eventType,
                        is_active: true,
                        assignment_id: response.data.assignment_id
                    };
                    
                    this.state.assignments[trainerId][eventType] = assignmentData;
                    
                    // Update UI
                    this.updateMatrixCell(trainerId, eventType, true);
                    this.updateDashboardStats();
                    this.showSuccess('Trainer assigned successfully');
                } else {
                    throw new Error(response.data?.message || 'Assignment failed');
                }
                
            } catch (error) {
                console.error('Quick assign error:', error);
                this.showError('Failed to assign trainer: ' + error.message);
                // Revert checkbox
                $(`.assignment-checkbox[data-trainer-id="${trainerId}"][data-event-type="${eventType}"]`).prop('checked', false);
            }
        },
        
        /**
         * Quick remove assignment
         */
        quickRemoveAssignment: async function(trainerId, eventType) {
            try {
                const response = await $.ajax({
                    url: this.config.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'remove_trainer_assignment',
                        trainer_id: trainerId,
                        event_type: eventType,
                        nonce: this.config.nonce
                    },
                    timeout: this.config.timeout
                });
                
                if (response.success) {
                    // Update local state
                    if (this.state.assignments[trainerId] && this.state.assignments[trainerId][eventType]) {
                        delete this.state.assignments[trainerId][eventType];
                    }
                    
                    // Update UI
                    this.updateMatrixCell(trainerId, eventType, false);
                    this.updateDashboardStats();
                    this.showSuccess('Assignment removed successfully');
                } else {
                    throw new Error(response.data?.message || 'Removal failed');
                }
                
            } catch (error) {
                console.error('Quick remove error:', error);
                this.showError('Failed to remove assignment: ' + error.message);
                // Revert checkbox
                $(`.assignment-checkbox[data-trainer-id="${trainerId}"][data-event-type="${eventType}"]`).prop('checked', true);
            }
        },
        
        /**
         * Update matrix cell appearance
         */
        updateMatrixCell: function(trainerId, eventType, isAssigned) {
            const $cell = $(`.matrix-cell[data-trainer-id="${trainerId}"][data-event-type="${eventType}"]`);
            
            if (isAssigned) {
                $cell.addClass('assigned');
                $cell.attr('title', 'Click to configure');
            } else {
                $cell.removeClass('assigned');
                $cell.attr('title', 'Click to assign');
                // Remove any rate display
                $cell.find('small').remove();
            }
        },
        
        /**
         * Handle trainer selection in individual form
         */
        onTrainerSelect: function(e) {
            const trainerId = $(e.target).val();
            this.state.selectedTrainer = trainerId;
            
            if (trainerId) {
                this.loadTrainerAssignments(trainerId);
            } else {
                this.resetAssignmentForm();
            }
        },
        
        /**
         * Handle event type selection in individual form
         */
        onEventTypeSelect: function(e) {
            const eventType = $(e.target).val();
            this.state.selectedEventType = eventType;
            
            if (eventType && this.state.selectedTrainer) {
                this.showAssignmentConfig();
                this.loadAssignmentData(this.state.selectedTrainer, eventType);
            } else {
                this.hideAssignmentConfig();
            }
        },
        
        /**
         * Load trainer assignments for individual form
         */
        loadTrainerAssignments: function(trainerId) {
            const trainerAssignments = this.state.assignments[trainerId] || {};
            const eventTypes = Object.keys(this.config.eventTypes);
            
            // Update event type dropdown to show current assignments
            const $eventTypeSelect = $('#assignment-event-type-select');
            $eventTypeSelect.find('option').each(function() {
                const $option = $(this);
                const eventType = $option.val();
                
                if (eventType && trainerAssignments[eventType]) {
                    $option.text($option.text().replace(' ✅', '') + ' ✅');
                }
            });
        },
        
        /**
         * Show assignment configuration form
         */
        showAssignmentConfig: function() {
            $('#assignment-config').show();
            $('#save-assignment-btn').prop('disabled', false);
        },
        
        /**
         * Hide assignment configuration form
         */
        hideAssignmentConfig: function() {
            $('#assignment-config').hide();
            $('#save-assignment-btn').prop('disabled', true);
            $('#remove-assignment-btn').hide();
        },
        
        /**
         * Load assignment data for editing - ENHANCED with advanced configuration
         */
        loadAssignmentData: function(trainerId, eventType) {
            const assignmentData = this.getAssignmentData(trainerId, eventType);
            const eventConfig = this.config.eventTypes[eventType];
            
            if (assignmentData) {
                // Populate form with existing data
                $('#specialization-notes').val(assignmentData.specialization_notes || '');
                $('#hourly-rate').val(assignmentData.hourly_rate || '');
                $('#max-sessions-per-day').val(assignmentData.max_sessions_per_day || 8);
                $('#assignment-status').val(assignmentData.is_active ? '1' : '0');
                
                // Enhanced fields
                $('#certification-level').val(assignmentData.certification_level || 'basic');
                $('#availability-priority').val(assignmentData.availability_priority || 'normal');
                $('#auto-assign-enabled').prop('checked', assignmentData.auto_assign_enabled || false);
                $('#preferred-time-slots').val(assignmentData.preferred_time_slots || '');
                $('#max-advance-booking-days').val(assignmentData.max_advance_booking_days || 30);
                $('#min-notice-hours').val(assignmentData.min_notice_hours || 24);
                
                // Show assignment date info
                if (assignmentData.created_at) {
                    $('#assignment-created').text('Assigned: ' + new Date(assignmentData.created_at).toLocaleDateString());
                }
                if (assignmentData.updated_at) {
                    $('#assignment-updated').text('Updated: ' + new Date(assignmentData.updated_at).toLocaleDateString());
                }
                
                $('#remove-assignment-btn').show();
            } else {
                // Reset form for new assignment with smart defaults
                $('#specialization-notes').val('');
                $('#hourly-rate').val(this.getDefaultHourlyRate(eventType));
                $('#max-sessions-per-day').val(this.getDefaultMaxSessions(eventType));
                $('#assignment-status').val('1');
                
                // Enhanced field defaults
                $('#certification-level').val('basic');
                $('#availability-priority').val('normal');
                $('#auto-assign-enabled').prop('checked', eventType === 'fitness_assessment'); // Auto-assign for free assessments
                $('#preferred-time-slots').val('');
                $('#max-advance-booking-days').val(eventConfig?.default_advance_days || 30);
                $('#min-notice-hours').val(eventConfig?.default_notice_hours || 24);
                
                // Clear assignment date info
                $('#assignment-created').text('');
                $('#assignment-updated').text('');
                
                $('#remove-assignment-btn').hide();
            }
            
            // Update form based on event type
            this.updateFormForEventType(eventType);
        },
        
        /**
         * Get default hourly rate for event type
         */
        getDefaultHourlyRate: function(eventType) {
            const defaults = {
                'fitness_assessment': '0', // Free
                'personal_training': '75',
                'group_fitness': '40',
                'group_forum': '0' // Free
            };
            return defaults[eventType] || '50';
        },
        
        /**
         * Get default max sessions for event type
         */
        getDefaultMaxSessions: function(eventType) {
            const defaults = {
                'fitness_assessment': '4', // Limited assessments per day
                'personal_training': '8',
                'group_fitness': '3', // Fewer group classes
                'group_forum': '2' // Limited forums
            };
            return defaults[eventType] || '6';
        },
        
        /**
         * Update form based on event type configuration
         */
        updateFormForEventType: function(eventType) {
            const eventConfig = this.config.eventTypes[eventType];
            
            // Update form hints and constraints
            $('#hourly-rate').attr('placeholder', `Default rate for ${eventConfig.title}`);
            
            // Show/hide relevant fields based on event type
            if (eventType === 'fitness_assessment' || eventType === 'group_forum') {
                // Free events - hide or disable rate field
                $('#hourly-rate').val('0').prop('readonly', true);
                $('.hourly-rate-field').addClass('disabled');
            } else {
                $('#hourly-rate').prop('readonly', false);
                $('.hourly-rate-field').removeClass('disabled');
            }
            
            // Update max sessions constraints
            if (eventType === 'group_fitness') {
                $('#max-sessions-per-day').attr('max', '4');
                $('.max-sessions-hint').text('Group classes are typically limited to 4 per day');
            } else {
                $('#max-sessions-per-day').attr('max', '12');
                $('.max-sessions-hint').text('Maximum sessions this trainer can handle per day');
            }
            
            // Update certification level options based on event type
            this.updateCertificationOptions(eventType);
        },
        
        /**
         * Update certification level options for event type
         */
        updateCertificationOptions: function(eventType) {
            const $certLevel = $('#certification-level');
            const baseOptions = '<option value="basic">Basic Certified</option>';
            
            let additionalOptions = '';
            switch (eventType) {
                case 'personal_training':
                    additionalOptions = `
                        <option value="advanced">Advanced Personal Trainer</option>
                        <option value="specialist">Specialist (Strength/Cardio)</option>
                        <option value="master">Master Trainer</option>
                    `;
                    break;
                case 'group_fitness':
                    additionalOptions = `
                        <option value="group_instructor">Group Fitness Instructor</option>
                        <option value="specialty_instructor">Specialty Class Instructor</option>
                        <option value="lead_instructor">Lead Instructor</option>
                    `;
                    break;
                case 'fitness_assessment':
                    additionalOptions = `
                        <option value="assessment_specialist">Assessment Specialist</option>
                        <option value="movement_specialist">Movement Analysis Specialist</option>
                    `;
                    break;
                case 'group_forum':
                    additionalOptions = `
                        <option value="wellness_coach">Wellness Coach</option>
                        <option value="nutrition_specialist">Nutrition Specialist</option>
                        <option value="lifestyle_coach">Lifestyle Coach</option>
                    `;
                    break;
            }
            
            $certLevel.html(baseOptions + additionalOptions);
        },
        
        /**
         * Save assignment via individual form
         */
        saveAssignment: async function(e) {
            e.preventDefault();
            
            if (!this.state.selectedTrainer || !this.state.selectedEventType) {
                this.showError('Please select both trainer and event type');
                return;
            }
            
            const $saveBtn = $('#save-assignment-btn');
            const originalText = $saveBtn.text();
            
            try {
                $saveBtn.prop('disabled', true).text('Saving...');
                
                const formData = {
                    action: 'assign_trainer_to_event_type',
                    trainer_id: this.state.selectedTrainer,
                    event_type: this.state.selectedEventType,
                    specialization_notes: $('#specialization-notes').val(),
                    hourly_rate: $('#hourly-rate').val(),
                    max_sessions_per_day: $('#max-sessions-per-day').val(),
                    is_active: $('#assignment-status').val(),
                    
                    // Enhanced configuration fields
                    certification_level: $('#certification-level').val(),
                    availability_priority: $('#availability-priority').val(),
                    auto_assign_enabled: $('#auto-assign-enabled').is(':checked') ? 1 : 0,
                    preferred_time_slots: $('#preferred-time-slots').val(),
                    max_advance_booking_days: $('#max-advance-booking-days').val(),
                    min_notice_hours: $('#min-notice-hours').val(),
                    
                    // System fields
                    updated_at: new Date().toISOString(),
                    nonce: this.config.nonce
                };
                
                const response = await $.ajax({
                    url: this.config.ajaxUrl,
                    method: 'POST',
                    data: formData,
                    timeout: this.config.timeout
                });
                
                if (response.success) {
                    // Update local state
                    if (!this.state.assignments[this.state.selectedTrainer]) {
                        this.state.assignments[this.state.selectedTrainer] = {};
                    }
                    this.state.assignments[this.state.selectedTrainer][this.state.selectedEventType] = response.data.assignment;
                    
                    // Update UI
                    this.updateMatrixCell(this.state.selectedTrainer, this.state.selectedEventType, true);
                    this.updateDashboardStats();
                    this.showSuccess('Assignment saved successfully');
                    $('#remove-assignment-btn').show();
                } else {
                    throw new Error(response.data?.message || 'Save failed');
                }
                
            } catch (error) {
                console.error('Save assignment error:', error);
                this.showError('Failed to save assignment: ' + error.message);
            } finally {
                $saveBtn.prop('disabled', false).text(originalText);
            }
        },
        
        /**
         * Remove assignment via individual form
         */
        removeAssignment: async function(e) {
            e.preventDefault();
            
            if (!confirm('Are you sure you want to remove this assignment?')) {
                return;
            }
            
            const $removeBtn = $('#remove-assignment-btn');
            const originalText = $removeBtn.text();
            
            try {
                $removeBtn.prop('disabled', true).text('Removing...');
                
                const response = await $.ajax({
                    url: this.config.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'remove_trainer_assignment',
                        trainer_id: this.state.selectedTrainer,
                        event_type: this.state.selectedEventType,
                        nonce: this.config.nonce
                    },
                    timeout: this.config.timeout
                });
                
                if (response.success) {
                    // Update local state
                    if (this.state.assignments[this.state.selectedTrainer]) {
                        delete this.state.assignments[this.state.selectedTrainer][this.state.selectedEventType];
                    }
                    
                    // Update UI
                    this.updateMatrixCell(this.state.selectedTrainer, this.state.selectedEventType, false);
                    this.updateDashboardStats();
                    this.resetAssignmentForm();
                    this.showSuccess('Assignment removed successfully');
                } else {
                    throw new Error(response.data?.message || 'Removal failed');
                }
                
            } catch (error) {
                console.error('Remove assignment error:', error);
                this.showError('Failed to remove assignment: ' + error.message);
            } finally {
                $removeBtn.prop('disabled', false).text(originalText);
            }
        },
        
        /**
         * Reset assignment form
         */
        resetAssignmentForm: function() {
            $('#assignment-trainer-select').val('');
            $('#assignment-event-type-select').val('');
            this.hideAssignmentConfig();
            this.state.selectedTrainer = null;
            this.state.selectedEventType = null;
        },
        
        /**
         * Update dashboard statistics
         */
        updateDashboardStats: function() {
            const stats = this.calculateStatistics();
            
            $('#total-assignments').text(stats.totalAssignments);
            $('#active-trainers').text(stats.activeTrainers);
        },
        
        /**
         * Calculate assignment statistics
         */
        calculateStatistics: function() {
            let totalAssignments = 0;
            let activeTrainers = 0;
            const trainerAssignmentCounts = {};
            
            Object.keys(this.state.assignments).forEach(trainerId => {
                const trainerAssignments = this.state.assignments[trainerId];
                let trainerActiveAssignments = 0;
                
                Object.keys(trainerAssignments).forEach(eventType => {
                    if (trainerAssignments[eventType].is_active) {
                        totalAssignments++;
                        trainerActiveAssignments++;
                    }
                });
                
                if (trainerActiveAssignments > 0) {
                    activeTrainers++;
                    trainerAssignmentCounts[trainerId] = trainerActiveAssignments;
                }
            });
            
            return {
                totalAssignments,
                activeTrainers,
                trainerAssignmentCounts
            };
        },
        
        /**
         * Load assignment statistics for statistics tab
         */
        loadAssignmentStatistics: async function() {
            console.log('Assignment Manager: Loading statistics...');
            console.log('AJAX Config:', {
                url: this.config.ajaxUrl,
                nonce: this.config.nonce ? 'Present' : 'Missing',
                timeout: this.config.timeout
            });
            
            try {
                const response = await $.ajax({
                    url: this.config.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'get_assignment_statistics',
                        nonce: this.config.nonce
                    },
                    timeout: this.config.timeout
                });
                
                console.log('Assignment Manager: AJAX response received:', response);
                
                if (response.success) {
                    console.log('Assignment Manager: Statistics data:', response.data);
                    this.renderStatistics(response.data || response);
                } else {
                    throw new Error(response.data?.message || 'Failed to load statistics');
                }
                
            } catch (error) {
                console.error('Assignment Manager: Load statistics error:', error);
                console.error('Error details:', {
                    status: error.status,
                    statusText: error.statusText,
                    responseText: error.responseText
                });
                this.showStatisticsError('Failed to load statistics: ' + error.message);
            }
        },
        
        /**
         * Render statistics dashboard - ENHANCED with detailed analytics
         */
        renderStatistics: function(data) {
            console.log('Assignment Manager: Rendering statistics with data:', data);
            
            // Update metric cards with enhanced data
            $('#stat-total-assignments').text(data.total_assignments || 0);
            $('#stat-coverage-rate').text(data.coverage_rate || '0%');
            $('#stat-avg-assignments').text(data.avg_assignments_per_trainer || '0');
            $('#stat-specialization-rate').text(data.specialization_rate || '0%');
            
            // Enhanced metrics
            $('#stat-auto-assignments').text(data.auto_assignments || 0);
            $('#stat-certification-distribution').text(data.certification_distribution || 'Loading...');
            $('#stat-availability-score').text(data.availability_score || '0%');
            $('#stat-utilization-rate').text(data.utilization_rate || '0%');
            
            // Update details with enhanced data
            $('#stat-assignment-change').text(data.assignment_change || 'No recent changes');
            $('#stat-coverage-detail').text(data.coverage_detail || 'Loading...');
            $('#stat-assignment-range').text(data.assignment_range || 'No data available');
            $('#stat-specialization-detail').text(data.specialization_detail || 'Loading...');
            
            // Enhanced detail sections
            $('#stat-peak-hours').text(data.peak_hours || 'Not analyzed');
            $('#stat-capacity-utilization').text(data.capacity_utilization || 'Calculating...');
            $('#stat-trainer-workload').text(data.trainer_workload_balance || 'Balanced');
            
            // Render enhanced visualizations
            this.renderCoverageBars(data.event_type_coverage || {});
            this.renderCertificationChart(data.certification_breakdown || {});
            this.renderAvailabilityHeatmap(data.availability_heatmap || {});
            this.renderWorkloadDistribution(data.workload_distribution || []);
            
            // Render trainer summary with enhanced data
            this.renderTrainerSummary(data.trainer_summary || []);
            
            // Render intelligent recommendations
            this.renderRecommendations(data.recommendations || []);
            
            // Render performance trends
            this.renderPerformanceTrends(data.performance_trends || {});
        },
        
        /**
         * Render certification level breakdown chart
         */
        renderCertificationChart: function(certificationData) {
            const chartContainer = $('#certification-chart');
            if (!chartContainer.length) return;
            
            const total = Object.values(certificationData).reduce((sum, count) => sum + count, 0);
            if (total === 0) {
                chartContainer.html('<p class="no-data">No certification data available</p>');
                return;
            }
            
            let html = '<div class="certification-breakdown">';
            html += '<h4>Trainer Certification Levels</h4>';
            
            const certificationLabels = {
                'basic': 'Basic Certified',
                'advanced': 'Advanced',
                'specialist': 'Specialist',
                'master': 'Master Trainer',
                'group_instructor': 'Group Instructor',
                'assessment_specialist': 'Assessment Specialist'
            };
            
            for (const [level, count] of Object.entries(certificationData)) {
                const percentage = Math.round((count / total) * 100);
                const label = certificationLabels[level] || level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                html += `
                    <div class="cert-level-item">
                        <div class="cert-level-header">
                            <span class="cert-level-name">${label}</span>
                            <span class="cert-level-stats">${count} trainers (${percentage}%)</span>
                        </div>
                        <div class="cert-level-bar">
                            <div class="cert-level-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
            chartContainer.html(html);
        },
        
        /**
         * Render availability heatmap
         */
        renderAvailabilityHeatmap: function(heatmapData) {
            const heatmapContainer = $('#availability-heatmap');
            if (!heatmapContainer.length) return;
            
            if (Object.keys(heatmapData).length === 0) {
                heatmapContainer.html('<p class="no-data">No availability data for heatmap</p>');
                return;
            }
            
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const hours = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];
            
            let html = '<div class="availability-heatmap">';
            html += '<h4>Trainer Availability Heatmap</h4>';
            html += '<div class="heatmap-grid">';
            
            // Header row
            html += '<div class="heatmap-row header">';
            html += '<div class="heatmap-cell">Time</div>';
            days.forEach(day => {
                html += `<div class="heatmap-cell">${day.substring(0, 3)}</div>`;
            });
            html += '</div>';
            
            // Data rows
            hours.forEach(hour => {
                html += '<div class="heatmap-row">';
                html += `<div class="heatmap-cell time-label">${hour}</div>`;
                
                days.forEach((day, dayIndex) => {
                    const availability = heatmapData[dayIndex]?.[hour] || 0;
                    const intensity = Math.min(availability / 5, 1); // Normalize to 0-1
                    const opacity = 0.1 + (intensity * 0.9); // Min 10% opacity
                    
                    html += `<div class="heatmap-cell availability-cell" 
                                  style="background-color: rgba(34, 197, 94, ${opacity})"
                                  title="${day} ${hour}: ${availability} trainers available">
                        ${availability}
                    </div>`;
                });
                
                html += '</div>';
            });
            
            html += '</div></div>';
            heatmapContainer.html(html);
        },
        
        /**
         * Render workload distribution chart
         */
        renderWorkloadDistribution: function(workloadData) {
            const chartContainer = $('#workload-distribution');
            if (!chartContainer.length) return;
            
            if (workloadData.length === 0) {
                chartContainer.html('<p class="no-data">No workload data available</p>');
                return;
            }
            
            let html = '<div class="workload-chart">';
            html += '<h4>Trainer Workload Distribution</h4>';
            
            const maxWorkload = Math.max(...workloadData.map(trainer => trainer.total_sessions));
            
            workloadData.forEach(trainer => {
                const percentage = maxWorkload > 0 ? (trainer.total_sessions / maxWorkload) * 100 : 0;
                const workloadLevel = percentage > 80 ? 'high' : percentage > 50 ? 'medium' : 'low';
                
                html += `
                    <div class="workload-item">
                        <div class="workload-header">
                            <span class="trainer-name">${trainer.name}</span>
                            <span class="workload-stats">${trainer.total_sessions} sessions</span>
                        </div>
                        <div class="workload-bar">
                            <div class="workload-fill workload-${workloadLevel}" style="width: ${percentage}%"></div>
                        </div>
                        <div class="workload-details">
                            <small>Avg: ${trainer.avg_sessions_per_day || 0}/day | Peak: ${trainer.peak_day_sessions || 0}/day</small>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            chartContainer.html(html);
        },
        
        /**
         * Render performance trends
         */
        renderPerformanceTrends: function(trendsData) {
            const trendsContainer = $('#performance-trends');
            if (!trendsContainer.length) return;
            
            if (!trendsData.weekly_growth && !trendsData.monthly_growth) {
                trendsContainer.html('<p class="no-data">No trend data available</p>');
                return;
            }
            
            let html = '<div class="performance-trends">';
            html += '<h4>Assignment Performance Trends</h4>';
            
            // Weekly trends
            if (trendsData.weekly_growth !== undefined) {
                const weeklyClass = trendsData.weekly_growth >= 0 ? 'positive' : 'negative';
                const weeklyIcon = trendsData.weekly_growth >= 0 ? '↗️' : '↘️';
                
                html += `
                    <div class="trend-item">
                        <div class="trend-label">Weekly Growth</div>
                        <div class="trend-value ${weeklyClass}">
                            ${weeklyIcon} ${Math.abs(trendsData.weekly_growth)}%
                        </div>
                    </div>
                `;
            }
            
            // Monthly trends
            if (trendsData.monthly_growth !== undefined) {
                const monthlyClass = trendsData.monthly_growth >= 0 ? 'positive' : 'negative';
                const monthlyIcon = trendsData.monthly_growth >= 0 ? '📈' : '📉';
                
                html += `
                    <div class="trend-item">
                        <div class="trend-label">Monthly Growth</div>
                        <div class="trend-value ${monthlyClass}">
                            ${monthlyIcon} ${Math.abs(trendsData.monthly_growth)}%
                        </div>
                    </div>
                `;
            }
            
            // Efficiency metrics
            if (trendsData.efficiency_score) {
                html += `
                    <div class="trend-item">
                        <div class="trend-label">System Efficiency</div>
                        <div class="trend-value">⚡ ${trendsData.efficiency_score}%</div>
                    </div>
                `;
            }
            
            html += '</div>';
            trendsContainer.html(html);
        },
        
        /**
         * Render event type coverage bars
         */
        renderCoverageBars: function(eventTypeCoverage) {
            const coverageContainer = $('#coverage-bars');
            if (!coverageContainer.length) return;
            
            const eventTypes = {
                'fitness_assessment': 'Fitness Assessment',
                'personal_training': 'Personal Training', 
                'group_fitness': 'Group Fitness',
                'group_forum': 'Group Forum'
            };
            
            let html = '<div class="coverage-bars">';
            
            for (const [eventType, displayName] of Object.entries(eventTypes)) {
                const count = eventTypeCoverage[eventType] || 0;
                const percentage = count > 0 ? Math.min((count / 10) * 100, 100) : 0; // Assuming max 10 trainers for visualization
                
                html += `
                    <div class="coverage-bar-item">
                        <div class="coverage-label">
                            <span class="event-type-name">${displayName}</span>
                            <span class="coverage-count">${count} trainers</span>
                        </div>
                        <div class="coverage-bar">
                            <div class="coverage-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
            coverageContainer.html(html);
        },
        
        /**
         * Render trainer summary table
         */
        renderTrainerSummary: function(trainerSummary) {
            const summaryContainer = $('#trainer-summary-table');
            if (!summaryContainer.length) return;
            
            if (!trainerSummary.length) {
                summaryContainer.html('<p class="no-data">No trainer assignments yet.</p>');
                return;
            }
            
            let html = `
                <table class="trainer-summary-table">
                    <thead>
                        <tr>
                            <th>Trainer</th>
                            <th>Assignments</th>
                            <th>Event Types</th>
                            <th>Avg Rate</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            trainerSummary.forEach(trainer => {
                const avgRate = trainer.avg_rate ? `$${trainer.avg_rate}/hr` : 'Not set';
                
                html += `
                    <tr>
                        <td class="trainer-name">${trainer.name}</td>
                        <td class="assignment-count">${trainer.assignment_count}</td>
                        <td class="event-types">${trainer.event_types}</td>
                        <td class="avg-rate">${avgRate}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            summaryContainer.html(html);
        },
        
        /**
         * Render recommendations panel
         */
        renderRecommendations: function(recommendations) {
            const recommendationsContainer = $('#recommendations-list');
            if (!recommendationsContainer.length) return;
            
            if (!recommendations.length) {
                recommendationsContainer.html('<p class="no-recommendations">System is optimally configured! 🎉</p>');
                return;
            }
            
            let html = '<div class="recommendations-list">';
            
            recommendations.forEach(rec => {
                const iconMap = {
                    'warning': '⚠️',
                    'info': 'ℹ️',
                    'success': '✅',
                    'error': '❌'
                };
                
                const icon = iconMap[rec.type] || 'ℹ️';
                
                html += `
                    <div class="recommendation-item recommendation-${rec.type}">
                        <div class="recommendation-header">
                            <span class="recommendation-icon">${icon}</span>
                            <span class="recommendation-title">${rec.title}</span>
                        </div>
                        <div class="recommendation-description">
                            ${rec.description}
                        </div>
                `;
                
                if (rec.action && rec.action_label) {
                    html += `
                        <div class="recommendation-action">
                            <button class="button button-secondary" onclick="${rec.action}">
                                ${rec.action_label}
                            </button>
                        </div>
                    `;
                }
                
                html += '</div>';
            });
            
            html += '</div>';
            recommendationsContainer.html(html);
        },
        
        /**
         * Show bulk assign modal (called from recommendations)
         */
        showBulkAssignModal: function() {
            // Implementation will be added in Day 3
            alert('Bulk assignment feature coming soon!');
        },
        
        /**
         * Focus on specific event type (called from recommendations)
         */
        focusEventType: function(eventType) {
            // Implementation will be added in Day 3
            alert(`Focusing on ${eventType} assignments - feature coming soon!`);
        },
        
        /**
         * Show matrix error
         */
        showMatrixError: function(message) {
            $('#assignment-matrix').html(`
                <div style="padding: 40px; text-align: center; color: #d63638;">
                    <span class="dashicons dashicons-warning" style="font-size: 48px; margin-bottom: 15px;"></span>
                    <p><strong>Error:</strong> ${message}</p>
                    <button type="button" class="button button-secondary" onclick="TrainerAvailabilityAssignmentManager.loadAssignmentMatrix()">
                        Try Again
                    </button>
                </div>
            `);
        },
        
        /**
         * Show statistics error
         */
        showStatisticsError: function(message) {
            $('.statistics-dashboard').html(`
                <div style="padding: 40px; text-align: center; color: #d63638;">
                    <span class="dashicons dashicons-warning" style="font-size: 48px; margin-bottom: 15px;"></span>
                    <p><strong>Error:</strong> ${message}</p>
                    <button type="button" class="button button-secondary" onclick="TrainerAvailabilityAssignmentManager.loadAssignmentStatistics()">
                        Try Again
                    </button>
                </div>
            `);
        },
        
        /**
         * Show success message
         */
        showSuccess: function(message) {
            this.showNotice(message, 'success');
        },
        
        /**
         * Show error message
         */
        showError: function(message) {
            this.showNotice(message, 'error');
        },
        
        /**
         * Show notice message
         */
        showNotice: function(message, type = 'info') {
            const noticeClass = type === 'error' ? 'notice-error' : 'notice-success';
            const notice = $(`
                <div class="notice ${noticeClass} is-dismissible" style="margin: 10px 0;">
                    <p>${message}</p>
                    <button type="button" class="notice-dismiss">
                        <span class="screen-reader-text">Dismiss this notice.</span>
                    </button>
                </div>
            `);
            
            const $modalBody = $('.modal-body');
            $modalBody.prepend(notice);
            
            // Auto-remove notice
            setTimeout(() => {
                notice.fadeOut(() => notice.remove());
            }, 4000);
            
            // Handle dismiss button
            notice.find('.notice-dismiss').on('click', function() {
                notice.fadeOut(() => notice.remove());
            });
        },
        
        /**
         * Refresh assignment data
         */
        refreshAssignmentData: function() {
            this.loadAssignmentMatrix();
            this.loadAssignmentStatistics();
        },
        
        /**
         * Export assignments data
         */
        exportAssignments: function() {
            // TODO: Implement export functionality
            alert('Export assignments feature coming soon!');
        },
        
        /**
         * Export summary data
         */
        exportSummary: function() {
            // TODO: Implement export summary functionality
            alert('Export summary feature coming soon!');
        },
        
        /**
         * Filter assignment matrix
         */
        filterAssignmentMatrix: function(e) {
            const filter = $(e.target).val();
            // TODO: Implement matrix filtering
            console.log('Filtering matrix by:', filter);
        }
    };

})(jQuery || $); 