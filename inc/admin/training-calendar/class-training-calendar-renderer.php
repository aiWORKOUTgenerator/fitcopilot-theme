<?php
/**
 * FitCopilot Training Calendar Renderer
 * 
 * Handles rendering of Training Calendar admin interface
 * Following the established Personal Training renderer pattern
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Calendar Renderer Class
 * 
 * Renders admin interface HTML following Personal Training patterns
 */
class FitCopilot_Training_Calendar_Renderer {
    
    /**
     * Data manager instance
     */
    private $data_manager;
    
    /**
     * Constructor
     */
    public function __construct($data_manager) {
        $this->data_manager = $data_manager;
    }
    
    /**
     * Render main admin page
     */
    public function render_page() {
        $calendar_data = $this->data_manager->get_settings();
        $stats = $this->data_manager->get_statistics();
        
        ?>
        <div class="wrap fitcopilot-admin-wrap">
            <h1 class="wp-heading-inline"><?php _e('Training Calendar Manager', 'fitcopilot'); ?></h1>
            
            <?php $this->render_admin_notices(); ?>
            
            <div class="fitcopilot-admin-content">
                <div class="fitcopilot-admin-header">
                    <div class="fitcopilot-admin-header-content">
                        <div class="fitcopilot-admin-header-info">
                            <h2><?php _e('Calendar Management', 'fitcopilot'); ?></h2>
                            <p class="description">
                                <?php _e('Manage training session schedules, trainer availability, and booking settings.', 'fitcopilot'); ?>
                            </p>
                        </div>
                        
                        <div class="fitcopilot-admin-header-stats">
                            <div class="stat-item">
                                <span class="stat-value"><?php echo esc_html($stats['total_events']); ?></span>
                                <span class="stat-label"><?php _e('Total Events', 'fitcopilot'); ?></span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value"><?php echo esc_html($stats['confirmed_events']); ?></span>
                                <span class="stat-label"><?php _e('Confirmed', 'fitcopilot'); ?></span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <nav class="nav-tab-wrapper fitcopilot-nav-tabs">
                    <a href="#calendar-overview" class="nav-tab nav-tab-active" data-tab="calendar-overview">
                        <?php _e('Calendar Overview', 'fitcopilot'); ?>
                    </a>
                    <a href="#calendar-settings" class="nav-tab" data-tab="calendar-settings">
                        <?php _e('Settings', 'fitcopilot'); ?>
                    </a>
                </nav>
                
                <div class="fitcopilot-tab-content">
                    <div id="calendar-overview" class="tab-panel active">
                        <?php $this->render_calendar_overview($calendar_data, $stats); ?>
                    </div>
                    
                    <div id="calendar-settings" class="tab-panel">
                        <?php $this->render_calendar_settings($calendar_data); ?>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
    
    /**
     * Render calendar overview tab
     */
    private function render_calendar_overview($calendar_data, $stats) {
        ?>
        <div class="fitcopilot-section">
            <h3><?php _e('Calendar Quick Stats', 'fitcopilot'); ?></h3>
            
            <div class="fitcopilot-stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📅</div>
                    <div class="stat-content">
                        <h4><?php echo esc_html($stats['total_events']); ?></h4>
                        <p><?php _e('Total Events', 'fitcopilot'); ?></p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <h4><?php echo esc_html($stats['confirmed_events']); ?></h4>
                        <p><?php _e('Confirmed Bookings', 'fitcopilot'); ?></p>
                    </div>
                </div>
            </div>
            
            <div class="training-calendar-data-widget" style="margin-top: 30px; padding: 20px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px;">
                <h4><?php _e('📅 Training Calendar Admin Interface', 'fitcopilot'); ?></h4>
                <p class="description"><?php _e('Manage training sessions, availability, and bookings.', 'fitcopilot'); ?></p>
                
                <div id="training-calendar-data-display" class="calendar-data-stats">
                    <div class="data-loading" style="text-align: center; padding: 20px;">
                        <div class="spinner is-active" style="float: none; margin: 0 auto;"></div>
                        <p><?php _e('Loading calendar data...', 'fitcopilot'); ?></p>
                    </div>
                </div>
                
                <div class="calendar-actions" style="margin-top: 20px;">
                    <div class="action-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <button type="button" class="button button-primary" id="create-event-btn">
                            <span class="dashicons dashicons-plus-alt" style="margin-top: 3px;"></span>
                            <?php _e('Create New Event', 'fitcopilot'); ?>
                        </button>
                        <button type="button" class="button button-secondary" id="view-all-events-btn">
                            <span class="dashicons dashicons-list-view" style="margin-top: 3px;"></span>
                            <?php _e('View All Events', 'fitcopilot'); ?>
                        </button>
                        <button type="button" class="button button-secondary" id="manage-trainers-btn">
                            <span class="dashicons dashicons-groups" style="margin-top: 3px;"></span>
                            <?php _e('Manage Trainers', 'fitcopilot'); ?>
                        </button>
                    </div>
                </div>
                
                <div id="upcoming-events-widget" style="margin-top: 25px;">
                    <h5><?php _e('📅 Upcoming Events', 'fitcopilot'); ?></h5>
                    <div id="upcoming-events-list" class="upcoming-events-container">
                        <div class="events-loading">
                            <p><?php _e('Loading upcoming events...', 'fitcopilot'); ?></p>
                        </div>
                    </div>
                </div>
                
                <div id="integration-status-widget" style="margin-top: 25px;">
                    <h5><?php _e('🔗 Integration Status', 'fitcopilot'); ?></h5>
                    <div id="integration-status-display" class="integration-status">
                        <div class="status-loading">
                            <p><?php _e('Checking integration status...', 'fitcopilot'); ?></p>
                        </div>
                    </div>
                </div>
            </div>
            
            <script type="text/javascript">
            // Provide events data directly to page (same source as widget)
            <?php 
            $events = $this->data_manager->get_all_events();
            $formatted_events = $this->format_events_for_display($events);
            ?>
            var trainingCalendarEvents = <?php echo json_encode($formatted_events); ?>;
            console.log('Training Calendar: Events loaded on page:', trainingCalendarEvents.length, 'events');
            
            document.addEventListener('DOMContentLoaded', function() {
                // Initialize TrainingCalendarData widget
                if (typeof fitcopilotTrainingCalendarData !== 'undefined') {
                    TrainingCalendarDataWidget.init(fitcopilotTrainingCalendarData);
                } else {
                    console.warn('Training Calendar Data not available');
                    TrainingCalendarDataWidget.showError();
                }
            });
            
            var TrainingCalendarDataWidget = {
                init: function(calendarData) {
                    this.displayStats(calendarData.statistics);
                    this.displayUpcomingEvents(calendarData.events);
                    this.displayIntegrationStatus(calendarData.integration);
                    this.initActionButtons();
                },
                
                displayStats: function(stats) {
                    var container = document.getElementById('training-calendar-data-display');
                    
                    var statsHtml = '<div class="data-stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 15px 0;">';
                    
                    // Total Events
                    statsHtml += '<div class="stat-box" style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 15px; text-align: center;">';
                    statsHtml += '<div class="stat-number" style="font-size: 24px; font-weight: bold; color: #2271b1;">' + stats.totalEvents + '</div>';
                    statsHtml += '<div class="stat-label" style="font-size: 12px; color: #666; margin-top: 5px;">Total Events</div>';
                    statsHtml += '</div>';
                    
                    // Confirmed Events
                    statsHtml += '<div class="stat-box" style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 15px; text-align: center;">';
                    statsHtml += '<div class="stat-number" style="font-size: 24px; font-weight: bold; color: #00a32a;">' + stats.confirmedEvents + '</div>';
                    statsHtml += '<div class="stat-label" style="font-size: 12px; color: #666; margin-top: 5px;">Confirmed</div>';
                    statsHtml += '</div>';
                    
                    // Pending Events (calculated)
                    var pendingEvents = stats.totalEvents - stats.confirmedEvents;
                    statsHtml += '<div class="stat-box" style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 15px; text-align: center;">';
                    statsHtml += '<div class="stat-number" style="font-size: 24px; font-weight: bold; color: #dba617;">' + pendingEvents + '</div>';
                    statsHtml += '<div class="stat-label" style="font-size: 12px; color: #666; margin-top: 5px;">Pending</div>';
                    statsHtml += '</div>';
                    
                    // Available Slots (for now, same as pending)
                    statsHtml += '<div class="stat-box" style="background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 15px; text-align: center;">';
                    statsHtml += '<div class="stat-number" style="font-size: 24px; font-weight: bold; color: #72aee6;">' + pendingEvents + '</div>';
                    statsHtml += '<div class="stat-label" style="font-size: 12px; color: #666; margin-top: 5px;">Available</div>';
                    statsHtml += '</div>';
                    
                    statsHtml += '</div>';
                    
                    container.innerHTML = statsHtml;
                },
                
                displayUpcomingEvents: function(events) {
                    var container = document.getElementById('upcoming-events-list');
                    
                    if (!events || events.length === 0) {
                        container.innerHTML = '<div style="padding: 15px; text-align: center; color: #666; background: #fff; border: 1px solid #ddd; border-radius: 4px;">' +
                                            '<p>No upcoming events found.</p>' +
                                            '<button type="button" class="button button-primary" style="margin-top: 10px;">' +
                                            '<span class="dashicons dashicons-plus-alt" style="margin-top: 3px;"></span> Create First Event' +
                                            '</button></div>';
                        return;
                    }
                    
                    // Filter to only show future events (upcoming events only)
                    var now = new Date();
                    var futureEvents = events.filter(function(event) {
                        var eventDate = new Date(event.start);
                        return eventDate > now; // Only events in the future
                    });
                    
                    // Check if we have any upcoming events after filtering
                    if (futureEvents.length === 0) {
                        container.innerHTML = '<div style="padding: 15px; text-align: center; color: #666; background: #fff; border: 1px solid #ddd; border-radius: 4px;">' +
                                            '<p>No upcoming events found. All events are in the past.</p>' +
                                            '<button type="button" class="button button-primary" style="margin-top: 10px;">' +
                                            '<span class="dashicons dashicons-plus-alt" style="margin-top: 3px;"></span> Create New Event' +
                                            '</button></div>';
                        return;
                    }
                    
                    var eventsHtml = '<div class="events-list">';
                    
                    // Show first 3 upcoming events from the filtered future events
                    var upcomingEvents = futureEvents.slice(0, 3);
                    upcomingEvents.forEach(function(event) {
                        var eventDate = new Date(event.start);
                        var formattedDate = eventDate.toLocaleDateString() + ' ' + eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        
                        eventsHtml += '<div class="event-item" style="background: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 12px; margin-bottom: 10px;">';
                        eventsHtml += '<div style="display: flex; justify-content: space-between; align-items: center;">';
                        eventsHtml += '<div>';
                        eventsHtml += '<strong>' + event.title + '</strong><br>';
                        eventsHtml += '<small style="color: #666;">' + formattedDate + '</small>';
                        if (event.extendedProps && event.extendedProps.location) {
                            eventsHtml += '<br><small style="color: #666;">📍 ' + event.extendedProps.location + '</small>';
                        }
                        eventsHtml += '</div>';
                        eventsHtml += '<div class="event-status" style="padding: 4px 8px; border-radius: 3px; font-size: 11px; color: #fff; background: ' + event.backgroundColor + ';">';
                        eventsHtml += event.extendedProps.bookingStatus || 'Available';
                        eventsHtml += '</div>';
                        eventsHtml += '</div>';
                        eventsHtml += '</div>';
                    });
                    
                    eventsHtml += '</div>';
                    container.innerHTML = eventsHtml;
                },
                
                displayIntegrationStatus: function(integration) {
                    var container = document.getElementById('integration-status-display');
                    
                    var statusHtml = '<div class="integration-items">';
                    
                    // WordPress Backend Status
                    statusHtml += '<div class="integration-item" style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">';
                    statusHtml += '<span style="color: #00a32a; margin-right: 8px;">✅</span>';
                    statusHtml += '<div><strong>WordPress Backend</strong><br><small>Database tables created, AJAX endpoints active</small></div>';
                    statusHtml += '</div>';
                    
                    // Personal Training Integration
                    if (integration.personalTraining && integration.personalTraining.enabled) {
                        statusHtml += '<div class="integration-item" style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">';
                        statusHtml += '<span style="color: #00a32a; margin-right: 8px;">✅</span>';
                        statusHtml += '<div><strong>Personal Training</strong><br><small>' + integration.personalTraining.trainersCount + ' trainers integrated</small></div>';
                        statusHtml += '</div>';
                    }
                    
                    // Frontend Calendar Status
                    statusHtml += '<div class="integration-item" style="display: flex; align-items: center; padding: 8px 0;">';
                    statusHtml += '<span style="color: #00a32a; margin-right: 8px;">✅</span>';
                    statusHtml += '<div><strong>Frontend Calendar</strong><br><small>FullCalendar React component (610 KiB)</small></div>';
                    statusHtml += '</div>';
                    
                    statusHtml += '</div>';
                    container.innerHTML = statusHtml;
                },
                
                initActionButtons: function() {
                    // Wait for TrainingCalendarAdmin to load, then bind events
                    var attempts = 0;
                    var maxAttempts = 50; // 5 seconds max wait
                    
                    var bindEvents = function() {
                        if (typeof TrainingCalendarAdmin !== 'undefined') {
                            TrainingCalendarAdmin.bindAdminCalendarEvents();
                        } else if (attempts < maxAttempts) {
                            attempts++;
                            setTimeout(bindEvents, 100);
                        } else {
                            console.error('TrainingCalendarAdmin failed to load after 5 seconds');
                        }
                    };
                    
                    bindEvents();
                },
                
                showError: function() {
                    var container = document.getElementById('training-calendar-data-display');
                    container.innerHTML = '<div style="padding: 20px; text-align: center; color: #d63638; background: #fff2f2; border: 1px solid #f5c6cb; border-radius: 4px;">' +
                                        '<p><strong>Error:</strong> Training Calendar data not available.</p>' +
                                        '<p><small>Please check that the data provider is properly loaded.</small></p></div>';
                }
            };
            
            // Note: Modal handling is now managed by dedicated JavaScript files:
            // - training-calendar-admin.js handles Create Events and View All Events
            // - trainer-availability-admin.js handles Manage Trainers modal
            </script>
            
            <?php 
            // Include modal templates
            include get_template_directory() . '/inc/admin/training-calendar/templates/events-modal.php';
            include get_template_directory() . '/inc/admin/training-calendar/templates/trainer-availability-modal.php';
            ?>
        </div>
        <?php
    }
    
    /**
     * Render calendar settings tab
     */
    private function render_calendar_settings($calendar_data) {
        ?>
        <div class="fitcopilot-section">
            <form method="post" action="<?php echo admin_url('admin.php?page=fitcopilot-training-calendar'); ?>">
                <?php wp_nonce_field('fitcopilot_training_calendar_save', 'fitcopilot_training_calendar_nonce'); ?>
                <input type="hidden" name="action" value="save_calendar_settings" />
                
                <h3><?php _e('Calendar Display Settings', 'fitcopilot'); ?></h3>
                
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php _e('Default View', 'fitcopilot'); ?></th>
                        <td>
                            <select name="calendar_settings[default_view]">
                                <option value="dayGridMonth" <?php selected($calendar_data['default_view'] ?? 'dayGridMonth', 'dayGridMonth'); ?>>
                                    <?php _e('Month View', 'fitcopilot'); ?>
                                </option>
                                <option value="timeGridWeek" <?php selected($calendar_data['default_view'] ?? 'dayGridMonth', 'timeGridWeek'); ?>>
                                    <?php _e('Week View', 'fitcopilot'); ?>
                                </option>
                            </select>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row"><?php _e('Email Notifications', 'fitcopilot'); ?></th>
                        <td>
                            <label>
                                <input type="checkbox" name="calendar_settings[email_notifications]" value="1" 
                                       <?php checked($calendar_data['email_notifications'] ?? true, true); ?> />
                                <?php _e('Send email notifications for bookings and updates', 'fitcopilot'); ?>
                            </label>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(__('Save Settings', 'fitcopilot'), 'primary', 'submit', false); ?>
                
            </form>
        </div>
        <?php
    }
    
    /**
     * Render admin notices
     */
    private function render_admin_notices() {
        if (isset($_GET['updated']) && $_GET['updated'] == '1') {
            ?>
            <div class="notice notice-success is-dismissible">
                <p><?php _e('Calendar settings updated successfully!', 'fitcopilot'); ?></p>
            </div>
            <?php
        }
    }
    
    /**
     * Format events for display (same format used by widget and modal)
     * 
     * @param array $events Raw database events
     * @return array Formatted events
     */
    private function format_events_for_display($events) {
        $formatted_events = array();
        
        foreach ($events as $event) {
            $formatted_events[] = array(
                'id' => $event['id'],
                'title' => $event['title'],
                'description' => $event['description'] ?? '',
                'start_datetime' => $event['start_datetime'],
                'end_datetime' => $event['end_datetime'],
                'trainer_id' => $event['trainer_id'] ?? null,
                'trainer_name' => $this->get_trainer_name($event['trainer_id'] ?? null),
                'event_type' => $event['event_type'] ?? 'session',
                'booking_status' => $event['booking_status'] ?? 'available',
                'location' => $event['location'] ?? '',
                'max_participants' => $event['max_participants'] ?? 1,
                'current_participants' => $event['current_participants'] ?? 0,
                'duration_minutes' => $event['duration_minutes'] ?? 60,
                'background_color' => $event['background_color'] ?? '#10b981',
                'border_color' => $event['border_color'] ?? '#059669',
                'text_color' => $event['text_color'] ?? '#ffffff'
            );
        }
        
        return $formatted_events;
    }
    
    /**
     * Get trainer name by ID
     * 
     * @param int|null $trainer_id Trainer ID
     * @return string Trainer name
     */
    private function get_trainer_name($trainer_id) {
        if (empty($trainer_id)) {
            return 'No trainer assigned';
        }
        
        // Get trainer names (matches provider pattern)
        $trainers = array(
            1 => 'Justin Fassio',
            2 => 'Sarah Johnson', 
            3 => 'Mike Chen'
        );
        
        return $trainers[$trainer_id] ?? 'Unknown Trainer';
    }
} 