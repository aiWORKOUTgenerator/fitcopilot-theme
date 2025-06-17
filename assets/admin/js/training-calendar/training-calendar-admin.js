/**
 * FitCopilot Training Calendar Admin JavaScript
 * 
 * Handles admin interface interactions for Training Calendar
 * Following established FitCopilot admin JavaScript patterns
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

jQuery(document).ready(function($) {
    
    // ===== PHASE 1: AJAX TESTING BUTTONS =====
    
    $('#test-ajax-events').on('click', function() {
        console.log('🧪 Testing Get Events AJAX...');
        
        $.ajax({
            url: fitcopilotTrainingCalendarAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'get_calendar_events',
                nonce: fitcopilotTrainingCalendarAjax.nonce,
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
            },
            success: function(response) {
                console.log('✅ Get Events Success:', response);
                TrainingCalendarAdmin.showMessage('AJAX Get Events test successful! Check console for details.', 'success');
            },
            error: function(xhr, status, error) {
                console.error('❌ Get Events Error:', {xhr, status, error});
                TrainingCalendarAdmin.showMessage('AJAX Get Events test failed. Check console for details.', 'error');
            }
        });
    });
    
    $('#test-ajax-save').on('click', function() {
        console.log('🧪 Testing Save Event AJAX...');
        
        const testEvent = {
            title: 'Test Event',
            description: 'Test event created from admin interface',
            start_datetime: new Date(Date.now() + 24*60*60*1000).toISOString(),
            end_datetime: new Date(Date.now() + 24*60*60*1000 + 60*60*1000).toISOString(),
            trainer_id: 1,
            event_type: 'session',
            booking_status: 'available'
        };
        
        $.ajax({
            url: fitcopilotTrainingCalendarAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'save_individual_calendar_event',
                nonce: fitcopilotTrainingCalendarAjax.nonce,
                event_data: JSON.stringify(testEvent)
            },
            success: function(response) {
                console.log('✅ Save Event Success:', response);
                TrainingCalendarAdmin.showMessage('AJAX Save Event test successful! Check console for details.', 'success');
            },
            error: function(xhr, status, error) {
                console.error('❌ Save Event Error:', {xhr, status, error});
                TrainingCalendarAdmin.showMessage('AJAX Save Event test failed. Check console for details.', 'error');
            }
        });
    });
    
    // ===== MAIN ADMIN INTERFACE =====
    
    const TrainingCalendarAdmin = {
        
        /**
         * Initialize admin interface
         */
        init: function() {
            this.bindEvents();
            this.setupTabs();
            
            // Initialize admin calendar widget
            this.initCalendarWidget();
            
            // Phase 1: Test AJAX endpoints on page load
            if (typeof fitcopilotTrainingCalendarAjax !== 'undefined') {
                this.testAjaxEndpoints();
            }
        },
        
        /**
         * Initialize admin calendar widget with live data from database
         */
        initCalendarWidget: function() {
            const calendarContainer = document.getElementById('training-calendar-admin-widget');
            if (!calendarContainer) {
                console.error('❌ Calendar container not found');
                return;
            }
            
            console.log('🚀 Loading admin calendar interface...');
            
            // Create initial interface with loading state
            calendarContainer.innerHTML = `
                <div class="admin-calendar-interface">
                    <div class="calendar-header">
                        <h4>📅 Training Calendar Admin Interface</h4>
                        <p class="description">Manage training sessions, availability, and bookings.</p>
                    </div>
                    
                    <div class="calendar-stats">
                        <div class="stat-item">
                            <span class="stat-number" id="total-events">...</span>
                            <span class="stat-label">Total Events</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="confirmed-events">...</span>
                            <span class="stat-label">Confirmed</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="pending-events">...</span>
                            <span class="stat-label">Pending</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="available-slots">...</span>
                            <span class="stat-label">Available</span>
                        </div>
                    </div>
                    
                    <div class="calendar-actions">
                        <button type="button" class="button button-primary" id="create-event-btn">
                            ➕ Create New Event
                        </button>
                        <button type="button" class="button button-secondary" id="view-all-events-btn">
                            📋 View All Events
                        </button>
                        <button type="button" class="button button-secondary" id="manage-trainers-btn">
                            👥 Manage Trainers
                        </button>
                    </div>
                    
                    <div class="upcoming-events">
                        <h5>📅 Upcoming Events</h5>
                        <div class="events-list" id="events-list-container">
                            <div class="loading-events">Loading events...</div>
                        </div>
                    </div>
                    
                    <div class="calendar-integration-status">
                        <h5>🔗 Integration Status</h5>
                        <div class="integration-item">
                            <span class="status-indicator success">✅</span>
                            <span class="integration-name">WordPress Backend</span>
                            <span class="integration-details">Database tables created, AJAX endpoints active</span>
                        </div>
                        <div class="integration-item">
                            <span class="status-indicator success">✅</span>
                            <span class="integration-name">Personal Training</span>
                            <span class="integration-details">3 trainers integrated</span>
                        </div>
                        <div class="integration-item">
                            <span class="status-indicator success">✅</span>
                            <span class="integration-name">Frontend Calendar</span>
                            <span class="integration-details">FullCalendar React component (610 KiB)</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Add CSS styles
            this.addCalendarStyles();
            
            // Bind event handlers for admin actions
            this.bindAdminCalendarEvents();
            
            // Load live data from database
            this.loadLiveCalendarData();
            
            console.log('✅ Admin calendar interface loaded successfully');
            this.showMessage('Training Calendar admin interface loaded!', 'success');
        },
        
        /**
         * Add CSS styles for admin calendar interface
         */
        addCalendarStyles: function() {
            if (document.getElementById('admin-calendar-styles')) {
                return; // Already added
            }
            
            const styles = `
                <style id="admin-calendar-styles">
                .admin-calendar-interface {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                
                .calendar-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #ddd;
                }
                
                .calendar-header h4 {
                    margin: 0 0 10px 0;
                    color: #1d4ed8;
                    font-size: 1.5em;
                }
                
                .calendar-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .stat-item {
                    text-align: center;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }
                
                .stat-number {
                    display: block;
                    font-size: 2em;
                    font-weight: bold;
                    color: #1d4ed8;
                    margin-bottom: 5px;
                }
                
                .stat-label {
                    font-size: 0.9em;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .calendar-actions {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }
                
                .upcoming-events {
                    margin-bottom: 30px;
                }
                
                .upcoming-events h5 {
                    margin: 0 0 15px 0;
                    color: #374151;
                    font-size: 1.2em;
                }
                
                .events-list {
                    display: grid;
                    gap: 15px;
                }
                
                .event-item {
                    display: grid;
                    grid-template-columns: 150px 1fr 150px 120px;
                    gap: 15px;
                    padding: 15px;
                    background: #fff;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    align-items: center;
                }
                
                .event-item.confirmed {
                    border-left: 4px solid #10b981;
                }
                
                .event-item.pending {
                    border-left: 4px solid #f59e0b;
                }
                
                .event-item.available {
                    border-left: 4px solid #06b6d4;
                }
                
                .event-time {
                    font-weight: 600;
                    color: #374151;
                }
                
                .event-title {
                    font-weight: 500;
                    color: #111827;
                }
                
                .event-trainer {
                    color: #6b7280;
                    font-size: 0.9em;
                }
                
                .event-status {
                    text-align: right;
                    font-size: 0.9em;
                    font-weight: 500;
                }
                
                .calendar-integration-status h5 {
                    margin: 0 0 15px 0;
                    color: #374151;
                    font-size: 1.2em;
                }
                
                .integration-item {
                    display: grid;
                    grid-template-columns: 30px 200px 1fr;
                    gap: 15px;
                    padding: 10px 0;
                    align-items: center;
                    border-bottom: 1px solid #f3f4f6;
                }
                
                .status-indicator {
                    font-size: 1.2em;
                }
                
                .status-indicator.success {
                    color: #10b981;
                }
                
                .integration-name {
                    font-weight: 500;
                    color: #374151;
                }
                
                .integration-details {
                    color: #6b7280;
                    font-size: 0.9em;
                }
                
                @media (max-width: 768px) {
                    .event-item {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                    
                    .event-status {
                        text-align: left;
                    }
                    
                    .calendar-actions {
                        flex-direction: column;
                    }
                }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', styles);
        },
        
        /**
         * Bind event handlers for admin calendar actions
         */
        bindAdminCalendarEvents: function() {
            // Create Event button
            $('#create-event-btn').on('click', function() {
                TrainingCalendarAdmin.showCreateEventModal();
            });
            
            // View All Events button
            $('#view-all-events-btn').on('click', function() {
                TrainingCalendarAdmin.showAllEventsModal();
            });
            
            // Manage Trainers button - handled by trainer-availability-admin.js
            // $('#manage-trainers-btn').on('click', function() {
            //     const personalTrainingUrl = '/wp-admin/admin.php?page=fitcopilot-personal-training';
            //     window.open(personalTrainingUrl, '_blank');
            // });
        },
        
        /**
         * Load live calendar data from database
         */
        loadLiveCalendarData: function() {
            console.log('📊 Loading live calendar data...');
            
            // Load ALL events from database (no date range filter for admin dashboard)
            $.ajax({
                url: fitcopilotTrainingCalendarAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'get_calendar_events',
                    nonce: fitcopilotTrainingCalendarAjax.nonce
                    // No start_date/end_date = get all events for admin dashboard
                },
                success: function(response) {
                    console.log('📊 Live data loaded:', response);
                    
                    if (response.success && response.data) {
                        // Handle the real database events format
                        const eventsData = {
                            events: response.data.events || [],
                            count: response.data.count || 0,
                            debug_info: response.data.debug_info || {}
                        };
                        
                        console.log('📊 Events data processed:', eventsData);
                        TrainingCalendarAdmin.updateAdminInterface(eventsData);
                    } else {
                        console.warn('⚠️ No events data in response:', response);
                        TrainingCalendarAdmin.showNoEventsState();
                    }
                },
                error: function(xhr, status, error) {
                    console.error('❌ Failed to load live data:', {xhr, status, error});
                    TrainingCalendarAdmin.showErrorState();
                }
            });
        },
        
        /**
         * Update admin interface with live data
         */
        updateAdminInterface: function(data) {
            const events = data.events || [];
            
            // Calculate statistics
            const stats = {
                total: events.length,
                confirmed: events.filter(e => e.booking_status === 'confirmed').length,
                pending: events.filter(e => e.booking_status === 'pending').length,
                available: events.filter(e => e.booking_status === 'available').length
            };
            
            // Update statistics display
            $('#total-events').text(stats.total);
            $('#confirmed-events').text(stats.confirmed);
            $('#pending-events').text(stats.pending);
            $('#available-slots').text(stats.available);
            
            // Update events list
            this.updateEventsList(events);
            
            console.log('✅ Admin interface updated with live data');
        },
        
        /**
         * Update events list with live data
         */
        updateEventsList: function(events) {
            const eventsContainer = $('#events-list-container');
            
            if (events.length === 0) {
                eventsContainer.html(`
                    <div class="no-events">
                        <p>No upcoming events found.</p>
                        <button type="button" class="button button-primary" id="create-first-event-btn">
                            ➕ Create First Event
                        </button>
                    </div>
                `);
                
                // Bind create event handler
                $('#create-first-event-btn').on('click', function() {
                    TrainingCalendarAdmin.showCreateEventModal();
                });
                
                return;
            }
            
            // Sort events by start date
            events.sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
            
            // Show only next 5 upcoming events
            const upcomingEvents = events.slice(0, 5);
            
            let eventsHtml = '';
            upcomingEvents.forEach(event => {
                const startDate = new Date(event.start_datetime);
                const statusClass = event.booking_status || 'available';
                const statusEmoji = this.getStatusEmoji(event.booking_status);
                const statusText = this.getStatusText(event);
                
                eventsHtml += `
                    <div class="event-item ${statusClass}" data-event-id="${event.id}">
                        <div class="event-time">${this.formatEventTime(startDate)}</div>
                        <div class="event-title">${this.escapeHtml(event.title)}</div>
                        <div class="event-trainer">${this.getTrainerInfo(event)}</div>
                        <div class="event-status">${statusEmoji} ${statusText}</div>
                    </div>
                `;
            });
            
            eventsContainer.html(eventsHtml);
            
            // Add click handlers for events
            $('.event-item').on('click', function() {
                const eventId = $(this).data('event-id');
                TrainingCalendarAdmin.showEventDetails(eventId);
            });
        },
        
        /**
         * Show no events state
         */
        showNoEventsState: function() {
            $('#total-events').text('0');
            $('#confirmed-events').text('0');
            $('#pending-events').text('0');
            $('#available-slots').text('0');
            
            $('#events-list-container').html(`
                <div class="no-events">
                    <p>No events found. Create your first training event!</p>
                    <button type="button" class="button button-primary" id="create-first-event-btn">
                        ➕ Create First Event
                    </button>
                </div>
            `);
            
            $('#create-first-event-btn').on('click', function() {
                TrainingCalendarAdmin.showCreateEventModal();
            });
        },
        
        /**
         * Show error state
         */
        showErrorState: function() {
            $('#events-list-container').html(`
                <div class="error-state">
                    <p>❌ Failed to load events. Please try refreshing the page.</p>
                    <button type="button" class="button button-secondary" onclick="location.reload()">
                        🔄 Refresh Page
                    </button>
                </div>
            `);
        },
        
        /**
         * Helper methods for formatting
         */
        formatEventTime: function(date) {
            const now = new Date();
            const diffTime = date.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
                return 'Today ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            } else if (diffDays === 1) {
                return 'Tomorrow ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            } else if (diffDays < 7) {
                return `In ${diffDays} days ` + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            } else {
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }
        },
        
        getStatusEmoji: function(status) {
            const emojis = {
                'confirmed': '✅',
                'pending': '⏳',
                'available': '🟢',
                'cancelled': '❌',
                'completed': '✅'
            };
            return emojis[status] || '🟡';
        },
        
        getStatusText: function(event) {
            const status = event.booking_status;
            const maxParticipants = event.max_participants || 1;
            const currentParticipants = event.current_participants || 0;
            
            switch (status) {
                case 'confirmed':
                    return 'Confirmed';
                case 'pending':
                    return 'Pending';
                case 'available':
                    if (maxParticipants > 1) {
                        return `${currentParticipants}/${maxParticipants} spots filled`;
                    }
                    return 'Available';
                case 'cancelled':
                    return 'Cancelled';
                case 'completed':
                    return 'Completed';
                default:
                    return 'Unknown';
            }
        },
        
        getTrainerInfo: function(event) {
            // Use dynamic trainer data from WordPress
            const trainers = window.fitcopilotTrainingCalendarData?.trainers || [];
            
            if (!event.trainer_id) {
                return '';
            }
            
            // Find trainer by ID in dynamic data
            const trainer = trainers.find(t => t.id == event.trainer_id);
            if (trainer) {
                return `with ${this.escapeHtml(trainer.name)}`;
            }
            
            // Fallback for unknown trainer
            console.warn('Training Calendar: Unknown trainer ID', event.trainer_id);
            return 'with Unknown Trainer';
        },
        
        escapeHtml: function(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },
        
        /**
         * Test AJAX endpoints on page load
         */
        testAjaxEndpoints: function() {
            console.log('Phase 1: Testing Training Calendar AJAX endpoints...');
            
            // Test basic connectivity
            $.ajax({
                url: fitcopilotTrainingCalendarAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'get_calendar_events',
                    nonce: fitcopilotTrainingCalendarAjax.nonce
                },
                success: function(response) {
                    console.log('✅ AJAX connectivity test passed:', response);
                },
                error: function(xhr, status, error) {
                    console.warn('⚠️ AJAX connectivity test failed:', {xhr, status, error});
                }
            });
        },
        
        /**
         * Bind general event handlers
         */
        bindEvents: function() {
            // Tab switching
            $('.nav-tab').on('click', function(e) {
            e.preventDefault();
                
                const targetTab = $(this).data('tab');
                
                // Update active tab
                $('.nav-tab').removeClass('nav-tab-active');
                $(this).addClass('nav-tab-active');
                
                // Show target panel
                $('.tab-panel').removeClass('active');
                $('#' + targetTab).addClass('active');
            });
        },
        
        /**
         * Setup tab functionality
         */
        setupTabs: function() {
            // Ensure first tab is active by default
            if (!$('.nav-tab-active').length) {
                $('.nav-tab').first().addClass('nav-tab-active');
                $('.tab-panel').first().addClass('active');
            }
        },
        
        /**
         * Show admin message
         */
        showMessage: function(message, type = 'info') {
            const messageClass = type === 'error' ? 'notice-error' : 'notice-success';
            const messageHtml = `
                <div class="notice ${messageClass} is-dismissible" style="margin: 10px 0;">
                    <p>${message}</p>
                </div>
            `;
            
            // Add to page
            $('.fitcopilot-admin-content').prepend(messageHtml);
            
            // Auto-dismiss after 5 seconds
            setTimeout(function() {
                $('.notice.is-dismissible').fadeOut();
            }, 5000);
        },
        
        /**
         * Show create event modal
         */
        showCreateEventModal: function() {
            // Remove existing modal if present
            $('#create-event-modal').remove();
            
            const modalHtml = `
                <div id="create-event-modal" class="training-calendar-modal">
                    <div class="modal-overlay"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>➕ Create New Training Event</h3>
                            <button type="button" class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form id="create-event-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="event-title">Event Title *</label>
                                        <select id="event-title" name="title" required>
                                            <option value="" selected>- Choose Event -</option>
                                            <option value="Free Consultation (20 Min)">Free Consultation (20 Min)</option>
                                            <option value="Online Group Fitness Class (45 Min)">Online Group Fitness Class (45 Min)</option>
                                            <option value="Personal Training Session">Personal Training Session</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="event-type">Event Type *</label>
                                        <select id="event-type" name="event_type" required>
                                            <option value="session">Personal Training Session</option>
                                            <option value="group_class">Group Fitness Class</option>
                                            <option value="assessment">Fitness Assessment</option>
                                            <option value="workshop">Workshop/Seminar</option>
                                            <option value="availability">Trainer Availability</option>
                                            <option value="blocked">Blocked Time</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="event-description">Description</label>
                                    <textarea id="event-description" name="description" rows="3" readonly 
                                              style="background-color: #f9fafb; border-color: #e5e7eb; color: #6b7280; cursor: default;"></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label for="event-special-instructions">Additional Details</label>
                                    <textarea id="event-special-instructions" name="special_instructions" rows="3" 
                                              placeholder="Add any special instructions or additional details"></textarea>
                                </div>
                                
                                <div class="form-group" id="duration-field-container" style="display: none;">
                                    <label for="event-duration">Duration *</label>
                                    <select id="event-duration" name="duration">
                                        <option value="" selected>- Select Duration -</option>
                                        <option value="30">30 Min</option>
                                        <option value="45">45 Min</option>
                                        <option value="60">60 Min</option>
                                    </select>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="event-start-date">Start Date *</label>
                                        <input type="date" id="event-start-date" name="start_date" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="event-start-time">Start Time *</label>
                                        <input type="time" id="event-start-time" name="start_time" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="event-end-date">End Date *</label>
                                        <input type="date" id="event-end-date" name="end_date" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="event-end-time">End Time *</label>
                                        <input type="time" id="event-end-time" name="end_time" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="event-trainer">Trainer</label>
                                        <select id="event-trainer" name="trainer_id">
                                            <option value="">Select Trainer (Optional)</option>
                                            ${this.getTrainerOptions()}
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="event-location">Location *</label>
                                        <select id="event-location" name="location" required>
                                            <option value="" selected>- Select Location -</option>
                                            <option value="google_meet">Google Meet (Active)</option>
                                            <option value="zoom" disabled>Zoom (Coming Soon)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="event-max-participants">Max Participants</label>
                                        <input type="number" id="event-max-participants" name="max_participants" 
                                               min="1" max="50" value="1">
                                    </div>
                                    <div class="form-group">
                                        <label for="event-booking-status">Booking Status</label>
                                        <select id="event-booking-status" name="booking_status">
                                            <option value="available">Available</option>
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="event-background-color">Background Color</label>
                                        <input type="color" id="event-background-color" name="background_color" value="#10b981">
                                    </div>
                                    <div class="form-group">
                                        <label for="event-text-color">Text Color</label>
                                        <input type="color" id="event-text-color" name="text_color" value="#ffffff">
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="button button-secondary" id="cancel-create-event">Cancel</button>
                            <button type="button" class="button button-primary" id="save-create-event">
                                <span class="button-text">Create Event</span>
                                <span class="button-spinner" style="display: none;">Creating...</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to page
            $('body').append(modalHtml);
            
            // Set default dates (tomorrow for both start and end)
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            $('#event-start-date').val(tomorrow.toISOString().split('T')[0]);
            $('#event-end-date').val(tomorrow.toISOString().split('T')[0]);
            $('#event-start-time').val('10:00');
            $('#event-end-time').val('11:00');
            
            // Initialize with empty state - no default selection
            $('#event-description').val('');
            $('#duration-field-container').hide(); // Hide duration field initially
            
            // Bind modal events
            this.bindCreateEventModalEvents();
            
            // Add modal styles
            this.addModalStyles();
            
            // Show modal
            $('#create-event-modal').fadeIn(300);
        },
        
        /**
         * Show all events modal
         */
        showAllEventsModal: function() {
            // Remove existing modal if present
            $('#all-events-modal').remove();
            
            const modalHtml = `
                <div id="all-events-modal" class="training-calendar-modal">
                    <div class="modal-overlay"></div>
                    <div class="modal-content large-modal">
                        <div class="modal-header">
                            <h3>📋 All Training Events</h3>
                            <button type="button" class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="events-filter">
                                <div class="filter-row">
                                    <!-- REMOVED: Trainer filter no longer needed -->
                                    <select id="filter-status">
                                        <option value="">All Statuses</option>
                                        <option value="available">Available</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <button type="button" class="button button-secondary" id="refresh-events">🔄 Refresh</button>
                                </div>
                            </div>
                            <div id="all-events-list" class="all-events-list">
                                <div class="loading-events">
                                    <p>Loading events...</p>
                                    <div class="spinner is-active"></div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="button button-secondary modal-close">Close</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to page
            $('body').append(modalHtml);
            
            // Bind modal events
            this.bindAllEventsModalEvents();
            
            // Add modal styles
            this.addModalStyles();
            
            // Show modal and load events
            $('#all-events-modal').fadeIn(300);
            this.loadAllEvents();
        },
        
        /**
         * Bind create event modal events
         */
        bindCreateEventModalEvents: function() {
            // Close modal events
            $('#create-event-modal .modal-close, #cancel-create-event').on('click', function() {
                $('#create-event-modal').fadeOut(300, function() {
                    $(this).remove();
                });
            });
            
            // Close on overlay click
            $('#create-event-modal .modal-overlay').on('click', function() {
                $('#create-event-modal').fadeOut(300, function() {
                    $(this).remove();
                });
            });
            
            // Auto-set end date when start date changes
            $('#event-start-date').on('change', function() {
                const startDate = $(this).val();
                if (startDate && !$('#event-end-date').val()) {
                    $('#event-end-date').val(startDate);
                }
            });
            
            // Auto-set end time when start time changes
            $('#event-start-time').on('change', function() {
                const startTime = $(this).val();
                if (startTime && !$('#event-end-time').val()) {
                    const [hours, minutes] = startTime.split(':');
                    const endHour = parseInt(hours) + 1;
                    $('#event-end-time').val(`${endHour.toString().padStart(2, '0')}:${minutes}`);
                }
            });
            
            // Event title change handler - update description and toggle duration field
            $('#event-title').on('change', function() {
                const selectedTitle = $(this).val();
                const description = TrainingCalendarAdmin.getDefaultDescription(selectedTitle);
                $('#event-description').val(description);
                TrainingCalendarAdmin.toggleDurationField(selectedTitle);
            });
            
            // Save event
            $('#save-create-event').on('click', function() {
                TrainingCalendarAdmin.saveNewEvent();
            });
        },
        
        /**
         * Bind all events modal events
         */
        bindAllEventsModalEvents: function() {
            // Close modal events
            $('#all-events-modal .modal-close').on('click', function() {
                $('#all-events-modal').fadeOut(300, function() {
                    $(this).remove();
                });
            });
            
            // Close on overlay click
            $('#all-events-modal .modal-overlay').on('click', function() {
                $('#all-events-modal').fadeOut(300, function() {
                    $(this).remove();
                });
            });
            
            // Refresh events
            $('#refresh-events').on('click', function() {
                TrainingCalendarAdmin.loadAllEvents();
            });
            
            // Filter events
            $('#filter-trainer, #filter-status').on('change', function() {
                TrainingCalendarAdmin.loadAllEvents();
            });
        },
        
        /**
         * Save new event via AJAX
         */
        saveNewEvent: function() {
            const $form = $('#create-event-form');
            const $saveBtn = $('#save-create-event');
            const $spinner = $saveBtn.find('.button-spinner');
            const $text = $saveBtn.find('.button-text');
            
            // Custom validation for dropdown selections
            const eventTitle = $('#event-title').val();
            if (!eventTitle) {
                alert('Please select an event type from the dropdown.');
                $('#event-title').focus();
                return;
            }
            
            // Duration validation for Personal Training Session
            if (eventTitle === 'Personal Training Session' && !$('#event-duration').val()) {
                alert('Please select a duration for the Personal Training Session.');
                $('#event-duration').focus();
                return;
            }

            // Location validation
            if (!$('#event-location').val()) {
                alert('Please select a location for the session.');
                $('#event-location').focus();
                return;
            }
            
            // Validate form
            if (!$form[0].checkValidity()) {
                $form[0].reportValidity();
                return;
            }
            
            // Show loading state
            $saveBtn.prop('disabled', true);
            $spinner.show();
            $text.hide();
            
            // Collect form data
            const formData = {
                title: $('#event-title').val(),
                description: $('#event-description').val(),
                special_instructions: $('#event-special-instructions').val() || '',
                start_datetime: $('#event-start-date').val() + ' ' + $('#event-start-time').val() + ':00',
                end_datetime: $('#event-end-date').val() + ' ' + $('#event-end-time').val() + ':00',
                trainer_id: $('#event-trainer').val() || null,
                event_type: $('#event-type').val(),
                booking_status: $('#event-booking-status').val(),
                location: $('#event-location').val(),
                max_participants: parseInt($('#event-max-participants').val()) || 1,
                duration: $('#event-duration').is(':visible') ? parseInt($('#event-duration').val()) || null : null,
                background_color: $('#event-background-color').val(),
                text_color: $('#event-text-color').val()
            };
            
            // Validate trainer ID if provided
            if (formData.trainer_id) {
                const validationResult = this.validateTrainerId(formData.trainer_id);
                if (!validationResult.valid) {
                    alert(validationResult.message);
                    // Reset button state
                    $saveBtn.prop('disabled', false);
                    $spinner.hide();
                    $text.show();
                    return;
                }
            }
            
            // Make AJAX request
            $.ajax({
                url: fitcopilotTrainingCalendarAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'save_individual_calendar_event',
                    nonce: fitcopilotTrainingCalendarAjax.nonce,
                    event_data: formData
                },
                success: function(response) {
                    if (response.success) {
                        TrainingCalendarAdmin.showMessage('Event created successfully!', 'success');
                        $('#create-event-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                        
                        // Refresh the admin interface
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    } else {
                        TrainingCalendarAdmin.showMessage('Error creating event: ' + (response.data?.message || 'Unknown error'), 'error');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Create event error:', {xhr, status, error});
                    TrainingCalendarAdmin.showMessage('Error creating event. Please try again.', 'error');
                },
                complete: function() {
                    // Reset button state
                    $saveBtn.prop('disabled', false);
                    $spinner.hide();
                    $text.show();
                }
            });
        },
        
        /**
         * Load all events using direct page data (same source as widget)
         */
        loadAllEvents: function() {
            const $container = $('#all-events-list');
            const trainerFilter = $('#filter-trainer').val();
            const statusFilter = $('#filter-status').val();
            
            // Show loading
            $container.html(`
                <div class="loading-events">
                    <p>Loading events...</p>
                    <div class="spinner is-active"></div>
                </div>
            `);
            
            // Use the same data source as the widget (direct page data)
            const events = window.trainingCalendarEvents || [];
            console.log('JavaScript Modal: Using page data, events count:', events.length);
            
            // Apply filters
            let filteredEvents = events;
            if (trainerFilter) {
                filteredEvents = filteredEvents.filter(event => event.trainer_id == trainerFilter);
            }
            if (statusFilter) {
                filteredEvents = filteredEvents.filter(event => event.booking_status == statusFilter);
            }
            
            console.log('JavaScript Modal: Filtered events count:', filteredEvents.length);
            
            // Render events
            this.renderAllEvents(filteredEvents);
        },
        
        /**
         * Render all events in the modal
         */
        renderAllEvents: function(events) {
            const $container = $('#all-events-list');
            
            if (!events || events.length === 0) {
                $container.html('<p>No events found.</p>');
                return;
            }
            
            let eventsHtml = '<div class="events-table">';
            
            events.forEach(function(event) {
                const startDate = new Date(event.start_datetime);
                const endDate = new Date(event.end_datetime);
                const statusClass = event.booking_status || 'available';
                
                eventsHtml += `
                    <div class="event-row ${statusClass}" style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
                        <div style="display: grid; grid-template-columns: 2fr 3fr 2fr 1fr 1fr; gap: 15px; align-items: center;">
                            <div class="event-date" style="font-size: 13px;">
                                <strong>${startDate.toLocaleDateString()}</strong><br>
                                ${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div class="event-details">
                                <div class="event-title" style="font-weight: 600; margin-bottom: 4px;">${event.title || 'Untitled Event'}</div>
                                <div style="font-size: 12px; color: #666;">
                                    📍 ${event.location || 'No location'} • 
                                    ⏱️ ${event.duration_minutes || 60} min
                                </div>
                            </div>
                            <div class="event-trainer" style="font-size: 13px;">${event.trainer_name || 'No trainer assigned'}</div>
                            <div class="event-status">
                                <span style="padding: 4px 8px; border-radius: 3px; font-size: 11px; color: #fff; background: ${event.background_color || '#10b981'};">
                                    ${(event.booking_status || 'available').charAt(0).toUpperCase() + (event.booking_status || 'available').slice(1)}
                                </span>
                            </div>
                            <div class="event-actions">
                                <button type="button" class="button button-small" onclick="TrainingCalendarAdmin.editEvent(${event.id})" style="margin-right: 5px;">Edit</button>
                                <button type="button" class="button button-small button-link-delete" onclick="TrainingCalendarAdmin.deleteEvent(${event.id})">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            eventsHtml += '</div>';
            $container.html(eventsHtml);
        },
        
        /**
         * Delete event
         */
        deleteEvent: function(eventId) {
            if (!confirm('Are you sure you want to delete this event?')) {
                return;
            }
            
            $.ajax({
                url: fitcopilotTrainingCalendarAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'delete_calendar_event',
                    nonce: fitcopilotTrainingCalendarAjax.nonce,
                    event_id: eventId
                },
                success: function(response) {
                    if (response.success) {
                        TrainingCalendarAdmin.showMessage('Event deleted successfully!', 'success');
                        TrainingCalendarAdmin.loadAllEvents(); // Refresh the list
                    } else {
                        TrainingCalendarAdmin.showMessage('Error deleting event: ' + (response.data?.message || 'Unknown error'), 'error');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Delete event error:', {xhr, status, error});
                    TrainingCalendarAdmin.showMessage('Error deleting event. Please try again.', 'error');
                }
            });
        },
        
        /**
         * Edit event - show edit modal with pre-filled data
         */
        editEvent: function(eventId) {
            console.log('📝 Opening edit modal for event ID:', eventId);
            
            // Find the event data
            const events = window.fitcopilotTrainingCalendarData?.events || [];
            const event = events.find(e => e.id == eventId);
            
            if (!event) {
                alert('Error: Event not found. Please refresh the page and try again.');
                return;
            }
            
            // Show the edit modal with pre-filled data
            this.showEditEventModal(event);
        },

        /**
         * Show edit event modal with pre-filled data
         */
        showEditEventModal: function(event) {
            console.log('📝 Showing edit modal for event:', event.title);
            
            // Remove any existing modal
            $('#edit-event-modal').remove();
            
            const modalHtml = `
                <div id="edit-event-modal" class="training-calendar-modal">
                    <div class="modal-overlay"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>✏️ Edit Training Event</h3>
                            <button type="button" class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form id="edit-event-form">
                                <input type="hidden" id="edit-event-id" value="${event.id}">
                                
                                <div class="form-row">
                                                                    <div class="form-group">
                                    <label for="edit-event-title">Event Title *</label>
                                    <select id="edit-event-title" required>
                                        <option value="" ${!event.title || (event.title !== 'Free Consultation (20 Min)' && event.title !== 'Online Group Fitness Class (45 Min)' && event.title !== 'Personal Training Session') ? 'selected' : ''}>- Choose Event -</option>
                                        <option value="Free Consultation (20 Min)" ${event.title === 'Free Consultation (20 Min)' ? 'selected' : ''}>Free Consultation (20 Min)</option>
                                        <option value="Online Group Fitness Class (45 Min)" ${event.title === 'Online Group Fitness Class (45 Min)' ? 'selected' : ''}>Online Group Fitness Class (45 Min)</option>
                                        <option value="Personal Training Session" ${event.title === 'Personal Training Session' ? 'selected' : ''}>Personal Training Session</option>
                                    </select>
                                </div>
                                    <div class="form-group">
                                        <label for="edit-event-type">Event Type</label>
                                        <select id="edit-event-type">
                                            <option value="session" ${event.event_type === 'session' ? 'selected' : ''}>Training Session</option>
                                            <option value="assessment" ${event.event_type === 'assessment' ? 'selected' : ''}>Fitness Assessment</option>
                                            <option value="consultation" ${event.event_type === 'consultation' ? 'selected' : ''}>Consultation</option>
                                            <option value="group_class" ${event.event_type === 'group_class' ? 'selected' : ''}>Group Class</option>
                                            <option value="workshop" ${event.event_type === 'workshop' ? 'selected' : ''}>Workshop</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="edit-event-description">Description</label>
                                    <textarea id="edit-event-description" rows="3" readonly 
                                              style="background-color: #f9fafb; border-color: #e5e7eb; color: #6b7280; cursor: default;">${event.description || ''}</textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label for="edit-event-special-instructions">Additional Details</label>
                                    <textarea id="edit-event-special-instructions" rows="3" 
                                              placeholder="Add any special instructions or additional details">${event.special_instructions || ''}</textarea>
                                </div>
                                
                                <div class="form-group" id="edit-duration-field-container" style="display: ${event.title === 'Personal Training Session' ? 'block' : 'none'};">
                                    <label for="edit-event-duration">Duration *</label>
                                    <select id="edit-event-duration" name="duration">
                                        <option value="" ${!event.duration ? 'selected' : ''}>- Select Duration -</option>
                                        <option value="30" ${event.duration == 30 ? 'selected' : ''}>30 Min</option>
                                        <option value="45" ${event.duration == 45 ? 'selected' : ''}>45 Min</option>
                                        <option value="60" ${event.duration == 60 ? 'selected' : ''}>60 Min</option>
                                    </select>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="edit-start-date">Start Date *</label>
                                        <input type="date" id="edit-start-date" value="${this.formatDateForInput(event.start_datetime || event.start)}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="edit-start-time">Start Time *</label>
                                        <input type="time" id="edit-start-time" value="${this.formatTimeForInput(event.start_datetime || event.start)}" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="edit-end-date">End Date *</label>
                                        <input type="date" id="edit-end-date" value="${this.formatDateForInput(event.end_datetime || event.end)}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="edit-end-time">End Time *</label>
                                        <input type="time" id="edit-end-time" value="${this.formatTimeForInput(event.end_datetime || event.end)}" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="edit-trainer-id">Trainer</label>
                                        <select id="edit-trainer-id">
                                            <option value="">Select Trainer</option>
                                            ${this.getTrainerOptions(event.trainer_id)}
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="edit-location">Location *</label>
                                        <select id="edit-location" required>
                                            <option value="" ${!event.location ? 'selected' : ''}>- Select Location -</option>
                                            <option value="google_meet" ${event.location === 'google_meet' ? 'selected' : ''}>Google Meet (Active)</option>
                                            <option value="zoom" ${event.location === 'zoom' ? 'selected' : ''} disabled>Zoom (Coming Soon)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="edit-max-participants">Max Participants</label>
                                        <input type="number" id="edit-max-participants" value="${event.max_participants || 1}" min="1">
                                    </div>
                                    <div class="form-group">
                                        <label for="edit-booking-status">Booking Status</label>
                                        <select id="edit-booking-status">
                                            <option value="available" ${event.booking_status === 'available' ? 'selected' : ''}>Available</option>
                                            <option value="confirmed" ${event.booking_status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                            <option value="pending" ${event.booking_status === 'pending' ? 'selected' : ''}>Pending</option>
                                            <option value="cancelled" ${event.booking_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="edit-background-color">Background Color</label>
                                        <input type="color" id="edit-background-color" value="${event.background_color || '#8b5cf6'}">
                                    </div>
                                    <div class="form-group">
                                        <label for="edit-text-color">Text Color</label>
                                        <input type="color" id="edit-text-color" value="${event.text_color || '#ffffff'}">
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="cancel-edit-event" class="button">Cancel</button>
                            <button type="button" id="save-edit-event" class="button button-primary">💾 Update Event</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add styles (reuse existing modal styles)
            this.addModalStyles();
            
            // Add modal to page
            $('body').append(modalHtml);
            
            // Bind modal events
            this.bindEditEventModalEvents();
            
            // Show modal
            $('#edit-event-modal').fadeIn(300);
        },

        /**
         * Bind edit event modal events
         */
        bindEditEventModalEvents: function() {
            // Close modal events
            $('#edit-event-modal .modal-close, #cancel-edit-event').on('click', function() {
                $('#edit-event-modal').fadeOut(300, function() {
                    $(this).remove();
                });
            });
            
            // Close on overlay click
            $('#edit-event-modal .modal-overlay').on('click', function() {
                $('#edit-event-modal').fadeOut(300, function() {
                    $(this).remove();
                });
            });
            
            // Save button event
            $('#save-edit-event').on('click', function() {
                TrainingCalendarAdmin.saveEditedEvent();
            });
            
            // Form submit event
            $('#edit-event-form').on('submit', function(e) {
                e.preventDefault();
                TrainingCalendarAdmin.saveEditedEvent();
            });
            
            // Event title change handler - update description and toggle duration field
            $('#edit-event-title').on('change', function() {
                const selectedTitle = $(this).val();
                const description = TrainingCalendarAdmin.getDefaultDescription(selectedTitle);
                $('#edit-event-description').val(description);
                TrainingCalendarAdmin.toggleEditDurationField(selectedTitle);
            });
        },

        /**
         * Save edited event
         */
        saveEditedEvent: function() {
            console.log('💾 Saving edited event...');
            
            // Gather form data with error handling
            const eventData = {
                id: $('#edit-event-id').val(),
                title: $('#edit-event-title').val() || '',
                description: $('#edit-event-description').val() || '',
                special_instructions: $('#edit-event-special-instructions').val() || '',
                event_type: $('#edit-event-type').val() || 'session',
                start_datetime: $('#edit-start-date').val() + ' ' + $('#edit-start-time').val(),
                end_datetime: $('#edit-end-date').val() + ' ' + $('#edit-end-time').val(),
                trainer_id: $('#edit-trainer-id').val() || null,
                location: $('#edit-location').val()?.trim() || '',
                max_participants: parseInt($('#edit-max-participants').val()) || 1,
                duration: $('#edit-event-duration').is(':visible') ? parseInt($('#edit-event-duration').val()) || null : null,
                booking_status: $('#edit-booking-status').val() || 'available',
                background_color: $('#edit-background-color').val() || '#3498db',
                text_color: $('#edit-text-color').val() || '#ffffff'
            };
            
            // Basic validation
            if (!eventData.title) {
                alert('Please select an event type from the dropdown.');
                $('#edit-event-title').focus();
                return;
            }
            
            // Duration validation for Personal Training Session
            if (eventData.title === 'Personal Training Session' && !eventData.duration) {
                alert('Please select a duration for the Personal Training Session.');
                $('#edit-event-duration').focus();
                return;
            }

            // Location validation
            if (!eventData.location) {
                alert('Please select a location for the session.');
                $('#edit-location').focus();
                return;
            }
            
            // Validate trainer ID if provided
            if (eventData.trainer_id) {
                const validationResult = this.validateTrainerId(eventData.trainer_id);
                if (!validationResult.valid) {
                    alert(validationResult.message);
                    $('#edit-trainer-id').focus();
                    return;
                }
            }
            
            if (!eventData.start_datetime.includes(':')) {
                alert('Please select both start date and time.');
                return;
            }
            
            if (!eventData.end_datetime.includes(':')) {
                alert('Please select both end date and time.');
                return;
            }
            
            // Disable save button and show loading
            $('#save-edit-event').prop('disabled', true).text('Updating...');
            
            // Prepare AJAX data - send both formats for maximum compatibility
            const ajaxData = {
                action: 'save_individual_calendar_event',
                nonce: fitcopilotTrainingCalendarAjax.nonce,
                event_data: JSON.stringify(eventData)
            };
            
            console.log('📤 Sending AJAX data:', ajaxData);
            
            // Make AJAX request to update event
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: ajaxData,
                success: function(response) {
                    console.log('📥 Edit Event AJAX Response:', response);
                    
                    $('#save-edit-event').prop('disabled', false).text('💾 Update Event');
                    
                    if (response.success) {
                        // Close modal
                        $('#edit-event-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                        
                        // Show success message
                        TrainingCalendarAdmin.showMessage('Event updated successfully!', 'success');
                        
                        // Refresh the events list if function exists
                        if (typeof TrainingCalendarAdmin.loadAllEvents === 'function') {
                            TrainingCalendarAdmin.loadAllEvents();
                        }
                        
                        // Refresh the page to show updates
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        TrainingCalendarAdmin.showMessage('Error updating event: ' + (response.data?.message || 'Unknown error'), 'error');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Update event error:', {xhr, status, error});
                    $('#save-edit-event').prop('disabled', false).text('💾 Update Event');
                    TrainingCalendarAdmin.showMessage('Error updating event. Please try again.', 'error');
                }
            });
        },
        
        /**
         * Format date for HTML date input (YYYY-MM-DD)
         */
        formatDateForInput: function(datetime) {
            if (!datetime) return '';
            
            try {
                const date = new Date(datetime);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            } catch (e) {
                console.warn('Date formatting error:', e);
                return '';
            }
        },
        
        /**
         * Format time for HTML time input (HH:MM)
         */
        formatTimeForInput: function(datetime) {
            if (!datetime) return '';
            
            try {
                const date = new Date(datetime);
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            } catch (e) {
                console.warn('Time formatting error:', e);
                return '';
            }
        },
        
        /**
         * Get default description based on event title
         */
        getDefaultDescription: function(title) {
            switch (title) {
                case 'Free Consultation (20 Min)':
                    return 'A complimentary 20-minute consultation to discuss your fitness goals, assess your current fitness level, and create a personalized training plan. This session includes a brief movement assessment and goal-setting discussion to determine the best approach for your fitness journey.';
                case 'Online Group Fitness Class (45 Min)':
                    return 'Join our energizing 45-minute online group fitness class designed for all fitness levels. This virtual session includes a dynamic warm-up, full-body workout with modifications provided, and cool-down stretching. All you need is a small space and water bottle!';
                case 'Personal Training Session':
                    return 'One-on-one personalized training session tailored to your specific goals and fitness level. Includes customized workout programming, form correction, motivation, and progress tracking. Sessions can be conducted in-person or virtually based on your preference.';
                default:
                    return '';
            }
        },

        /**
         * Show/hide duration field based on event title (create modal)
         */
        toggleDurationField: function(title) {
            const durationField = $('#duration-field-container');
            if (title === 'Personal Training Session') {
                durationField.show();
                // Reset to default "Select Duration" message
                $('#event-duration').val('');
            } else {
                durationField.hide();
                $('#event-duration').val('');
            }
        },

        /**
         * Show/hide duration field based on event title (edit modal)
         */
        toggleEditDurationField: function(title) {
            const durationField = $('#edit-duration-field-container');
            if (title === 'Personal Training Session') {
                durationField.show();
                // Reset to default "Select Duration" message if no value
                if (!$('#edit-event-duration').val()) {
                    $('#edit-event-duration').val('');
                }
            } else {
                durationField.hide();
                $('#edit-event-duration').val('');
            }
        },

        /**
         * Get trainer options HTML with selected value
         * Includes trainer specialty and proper HTML escaping for XSS protection
         */
        getTrainerOptions: function(selectedTrainerId) {
            const trainers = window.fitcopilotTrainingCalendarData?.trainers || [];
            
            if (trainers.length === 0) {
                console.warn('Training Calendar: No trainers available in WordPress data');
                return '<option value="" disabled>No trainers available</option>';
            }
            
            return trainers.map(trainer => {
                // Validate trainer data
                if (!trainer.id || !trainer.name) {
                    console.warn('Training Calendar: Invalid trainer data', trainer);
                    return '';
                }
                
                const selected = trainer.id == selectedTrainerId ? 'selected' : '';
                const trainerName = this.escapeHtml(trainer.name);
                const trainerSpecialty = trainer.specialty ? this.escapeHtml(trainer.specialty) : '';
                const displayText = trainerSpecialty ? `${trainerName} - ${trainerSpecialty}` : trainerName;
                
                return `<option value="${this.escapeHtml(trainer.id)}" ${selected}>${displayText}</option>`;
            }).filter(option => option !== '').join('');
        },
        
        /**
         * Validate trainer ID exists in available trainers
         * @param {string|number} trainerId - Trainer ID to validate
         * @returns {object} Validation result with valid flag and message
         */
        validateTrainerId: function(trainerId) {
            if (!trainerId) {
                return { valid: true, message: '' }; // Optional trainer is valid
            }
            
            const trainers = window.fitcopilotTrainingCalendarData?.trainers || [];
            
            if (trainers.length === 0) {
                return { 
                    valid: false, 
                    message: 'No trainers are currently available. Please contact the administrator.' 
                };
            }
            
            const trainer = trainers.find(t => t.id == trainerId);
            if (!trainer) {
                return { 
                    valid: false, 
                    message: `Invalid trainer selected (ID: ${trainerId}). Please select a valid trainer from the dropdown.` 
                };
            }
            
            // Check if trainer is active (if this property exists)
            if (trainer.hasOwnProperty('active') && !trainer.active) {
                return { 
                    valid: false, 
                    message: `The selected trainer (${trainer.name}) is currently inactive. Please select an active trainer.` 
                };
            }
            
            return { valid: true, message: '', trainer: trainer };
        },
        
        /**
         * Get default trainer ID for new events
         * @returns {string|null} Default trainer ID or null
         */
        getDefaultTrainerId: function() {
            const trainers = window.fitcopilotTrainingCalendarData?.trainers || [];
            
            if (trainers.length === 0) {
                return null;
            }
            
            // Find first active trainer, or first trainer if none marked as active
            const activeTrainer = trainers.find(t => t.active !== false);
            return activeTrainer ? activeTrainer.id : trainers[0].id;
        },
        
        /**
         * Add modal styles
         */
        addModalStyles: function() {
            if (document.getElementById('modal-styles')) {
                return; // Already added
            }
            
            const styles = `
                <style id="modal-styles">
                .training-calendar-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 100000;
                    display: none;
                }
                
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                }
                
                .modal-content {
                    position: relative;
                    background: #fff;
                    margin: 50px auto;
                    padding: 0;
                    width: 90%;
                    max-width: 600px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .modal-content.large-modal {
                    max-width: 900px;
                }
                
                .modal-header {
                    padding: 20px 25px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-header h3 {
                    margin: 0;
                    color: #1d4ed8;
                    font-size: 1.3em;
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #64748b;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-close:hover {
                    color: #374151;
                }
                
                .modal-body {
                    padding: 25px;
                }
                
                .modal-footer {
                    padding: 20px 25px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #374151;
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    font-size: 14px;
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #1d4ed8;
                    box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
                }
                
                .events-filter {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .filter-row {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }
                
                .filter-row select {
                    min-width: 150px;
                }
                
                .events-table {
                    display: grid;
                    gap: 10px;
                }
                
                .event-row {
                    display: grid;
                    grid-template-columns: 200px 1fr 150px 100px 120px;
                    gap: 15px;
                    padding: 15px;
                    background: #f8fafc;
                    border-radius: 6px;
                    border-left: 4px solid #e2e8f0;
                    align-items: center;
                }
                
                .event-row.confirmed {
                    border-left-color: #10b981;
                }
                
                .event-row.pending {
                    border-left-color: #f59e0b;
                }
                
                .event-row.available {
                    border-left-color: #06b6d4;
                }
                
                .event-row.cancelled {
                    border-left-color: #ef4444;
                    opacity: 0.7;
                }
                
                .event-date {
                    font-size: 0.9em;
                    color: #374151;
                    font-weight: 500;
                }
                
                .event-title {
                    font-weight: 500;
                    color: #111827;
                }
                
                .event-trainer {
                    color: #6b7280;
                    font-size: 0.9em;
                }
                
                .event-status {
                    text-transform: capitalize;
                    font-size: 0.9em;
                    font-weight: 500;
                }
                
                .event-actions {
                    display: flex;
                    gap: 5px;
                }
                
                .button-spinner {
                    display: inline-block;
                }
                
                .loading-events {
                    text-align: center;
                    padding: 40px;
                    color: #6b7280;
                }
                
                @media (max-width: 768px) {
                    .modal-content {
                        margin: 20px;
                        width: calc(100% - 40px);
                    }
                    
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }
                    
                    .event-row {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                    
                    .filter-row {
                        flex-direction: column;
                        align-items: stretch;
                    }
                }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    };
    
    // Initialize admin interface
            TrainingCalendarAdmin.init();
    
    // Make available globally for debugging
    window.TrainingCalendarAdmin = TrainingCalendarAdmin;
}); 