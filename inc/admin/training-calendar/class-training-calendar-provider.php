<?php
/**
 * FitCopilot Training Calendar Provider
 * 
 * Provides Training Calendar data to the frontend React components
 * Following the established Personal Training provider pattern
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Calendar Provider Class
 * 
 * Provides calendar data to frontend following Personal Training patterns
 */
class FitCopilot_Training_Calendar_Provider {
    
    /**
     * Data manager instance
     */
    private $data_manager;
    
    /**
     * Constructor
     * 
     * @param FitCopilot_Training_Calendar_Data $data_manager Data manager instance
     */
    public function __construct($data_manager) {
        $this->data_manager = $data_manager;
    }
    
    /**
     * Initialize frontend data provider
     * Phase 2: Enhanced with real-time synchronization
     */
    public function init() {
        // Provide data to frontend
        add_action('wp_enqueue_scripts', array($this, 'provide_frontend_data'));
        
        // AJAX endpoints for frontend
        add_action('wp_ajax_get_training_calendar_data', array($this, 'get_calendar_data'));
        add_action('wp_ajax_nopriv_get_training_calendar_data', array($this, 'get_calendar_data'));
        
        // Phase 2: Real-time synchronization hooks
        add_action('fitcopilot_personal_training_data_updated', array($this, 'handle_trainer_data_update'));
        add_action('fitcopilot_personal_training_trainer_saved', array($this, 'handle_trainer_saved'), 10, 2);
        add_action('fitcopilot_personal_training_trainer_deleted', array($this, 'handle_trainer_deleted'), 10, 1);
        
        // Cache invalidation hooks
        add_action('save_post', array($this, 'maybe_invalidate_cache'));
        add_action('deleted_post', array($this, 'maybe_invalidate_cache'));
        
        // Performance optimization hooks
        add_action('wp_loaded', array($this, 'schedule_cache_cleanup'));
        add_filter('fitcopilot_training_calendar_cache_duration', array($this, 'adjust_cache_duration'), 10, 2);
    }
    
    /**
     * Get sample events for testing
     * 
     * @return array Sample events data
     */
    private function get_sample_events() {
        return [
            [
                'id' => 1,
                'title' => 'Personal Training Session',
                'description' => 'One-on-one training with certified trainer',
                'start' => date('Y-m-d H:i:s', strtotime('+1 day 10:00')),
                'end' => date('Y-m-d H:i:s', strtotime('+1 day 11:00')),
                'trainerId' => 1,
                'eventType' => 'session',
                'bookingStatus' => 'confirmed',
                'sessionType' => 'individual',
                'location' => 'Gym Floor A',
                'maxParticipants' => 1,
                'currentParticipants' => 1,
                'price' => 100,
                'currency' => 'USD',
                'backgroundColor' => '#10b981',
                'borderColor' => '#059669',
                'textColor' => '#ffffff'
            ],
            [
                'id' => 2,
                'title' => 'Group Fitness Class',
                'description' => 'High-intensity interval training class',
                'start' => date('Y-m-d H:i:s', strtotime('+2 days 18:00')),
                'end' => date('Y-m-d H:i:s', strtotime('+2 days 19:00')),
                'trainerId' => 2,
                'eventType' => 'group_class',
                'bookingStatus' => 'available',
                'sessionType' => 'group',
                'location' => 'Studio B',
                'maxParticipants' => 15,
                'currentParticipants' => 8,
                'price' => 25,
                'currency' => 'USD',
                'backgroundColor' => '#f59e0b',
                'borderColor' => '#d97706',
                'textColor' => '#ffffff'
            ],
            [
                'id' => 3,
                'title' => 'Fitness Assessment',
                'description' => 'Comprehensive fitness evaluation',
                'start' => date('Y-m-d H:i:s', strtotime('+3 days 14:00')),
                'end' => date('Y-m-d H:i:s', strtotime('+3 days 15:30')),
                'trainerId' => 1,
                'eventType' => 'assessment',
                'bookingStatus' => 'pending',
                'sessionType' => 'individual',
                'location' => 'Assessment Room',
                'maxParticipants' => 1,
                'currentParticipants' => 0,
                'price' => 75,
                'currency' => 'USD',
                'backgroundColor' => '#06b6d4',
                'borderColor' => '#0891b2',
                'textColor' => '#ffffff'
            ],
            [
                'id' => 4,
                'title' => 'Nutrition Workshop',
                'description' => 'Learn about healthy eating habits',
                'start' => date('Y-m-d H:i:s', strtotime('+7 days 16:00')),
                'end' => date('Y-m-d H:i:s', strtotime('+7 days 18:00')),
                'trainerId' => 3,
                'eventType' => 'workshop',
                'bookingStatus' => 'available',
                'sessionType' => 'group',
                'location' => 'Conference Room',
                'maxParticipants' => 20,
                'currentParticipants' => 5,
                'price' => 40,
                'currency' => 'USD',
                'backgroundColor' => '#8b5cf6',
                'borderColor' => '#7c3aed',
                'textColor' => '#ffffff'
            ]
        ];
    }

    /**
     * Get sample trainers for testing
     * 
     * @return array Sample trainers data
     */
    private function get_sample_trainers() {
        return [
            [
                'id' => 1,
                'name' => 'Justin Fassio',
                'specialty' => 'Strength Training',
                'bio' => 'Certified personal trainer with 10+ years experience',
                'imageUrl' => '/wp-content/themes/fitcopilot/assets/media/images/trainers/justin.jpg',
                'yearsExperience' => 10,
                'clientsCount' => 150,
                'featured' => true,
                'active' => true,
                'coachType' => 'personal',
                'color' => '#10b981'
            ],
            [
                'id' => 2,
                'name' => 'Sarah Johnson',
                'specialty' => 'HIIT & Cardio',
                'bio' => 'High-energy fitness instructor specializing in group classes',
                'imageUrl' => '/wp-content/themes/fitcopilot/assets/media/images/trainers/sarah.jpg',
                'yearsExperience' => 7,
                'clientsCount' => 200,
                'featured' => false,
                'active' => true,
                'coachType' => 'group',
                'color' => '#f59e0b'
            ],
            [
                'id' => 3,
                'name' => 'Mike Chen',
                'specialty' => 'Nutrition & Wellness',
                'bio' => 'Certified nutritionist and wellness coach',
                'imageUrl' => '/wp-content/themes/fitcopilot/assets/media/images/trainers/mike.jpg',
                'yearsExperience' => 5,
                'clientsCount' => 75,
                'featured' => false,
                'active' => true,
                'coachType' => 'specialized',
                'color' => '#8b5cf6'
            ]
        ];
    }

    /**
     * Determine if calendar data should be loaded
     * Following Personal Training conditional loading pattern
     */
    private function should_load_calendar_data() {
        // Load on homepage
        if (is_front_page() || is_home()) {
            return true;
        }
        
        // Load on calendar-specific pages
        if (is_page_template('page-calendar.php')) {
            return true;
        }
        
        // Load on admin pages for training calendar
        if (is_admin() && isset($_GET['page']) && $_GET['page'] === 'fitcopilot-training-calendar') {
            return true;
        }
        
        // Load on pages with calendar shortcode
        global $post;
        if ($post && has_shortcode($post->post_content, 'training_calendar')) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Provide frontend data for React components
     * PHASE 2: Enhanced data structure for React integration
     * 
     * @return void
     */
    public function provide_frontend_data() {
        // COMPREHENSIVE FIX: Always provide data regardless of conditions
        // The data should be available when needed, not restricted by page context
        
        // Debug logging
        error_log('FitCopilot: Training Calendar Provider - provide_frontend_data() called');
        error_log('FitCopilot: is_front_page(): ' . (is_front_page() ? 'true' : 'false'));
        error_log('FitCopilot: is_home(): ' . (is_home() ? 'true' : 'false'));
        error_log('FitCopilot: should_load_calendar_data(): ' . ($this->should_load_calendar_data() ? 'true' : 'false'));
        
        // Get real events and database statistics instead of sample data
        $real_stats = $this->data_manager->get_statistics();
        $events = $this->data_manager->get_all_events();
        $trainers = $this->get_integrated_trainers(); // FIXED: Use real trainers from Personal Training
        
        // Get settings
        $settings = $this->data_manager->get_settings();
        
        // PHASE 2: Prepare calendar data with React-compatible structure
        $calendar_data = [
            'settings' => [
                'defaultView' => $settings['default_view'] ?? 'dayGridMonth',
                'firstDay' => $settings['first_day'] ?? 0,
                'timeFormat' => $settings['time_format'] ?? 'h:mm a',
                'dateFormat' => $settings['date_format'] ?? 'MMM d, yyyy',
                'slotDuration' => $settings['slot_duration'] ?? '00:30:00',
                'businessHours' => [
                    'start' => $settings['business_hours']['start'] ?? '09:00',
                    'end' => $settings['business_hours']['end'] ?? '17:00'
                ],
                'weekendEnabled' => $settings['weekend_enabled'] ?? false,
                'emailNotifications' => $settings['email_notifications'] ?? true,
                'calendarColors' => $settings['calendar_colors'] ?? [
                    'session' => '#4CAF50',
                    'availability' => '#2196F3',
                    'blocked' => '#F44336',
                    'group_class' => '#FF9800',
                    'workshop' => '#9C27B0',
                    'assessment' => '#00BCD4'
                ],
                'bookingSettings' => [
                    'advanceDays' => $settings['booking_advance_days'] ?? 30,
                    'noticeHours' => $settings['booking_notice_hours'] ?? 24,
                    'autoConfirm' => $settings['auto_confirm_bookings'] ?? false,
                    'requirePayment' => $settings['require_payment'] ?? false,
                    'allowCancellation' => $settings['allow_cancellation'] ?? true,
                    'cancellationHours' => $settings['cancellation_hours'] ?? 24,
                    'maxBookingsPerClient' => $settings['max_bookings_per_client'] ?? 10,
                    'waitlistEnabled' => $settings['waitlist_enabled'] ?? false
                ]
            ],
            'events' => $this->format_database_events_for_frontend($events),
            'trainers' => $this->format_trainers_for_frontend($trainers),
            'statistics' => [
                'totalEvents' => $real_stats['total_events'],
                'confirmedEvents' => $real_stats['confirmed_events'],
                'lastUpdated' => $real_stats['last_updated']
            ],
            'integration' => [
                'personalTraining' => [
                    'enabled' => true,
                    'dataSource' => 'FitCopilot_Personal_Training_Provider',
                    'trainersCount' => count($trainers)
                ],
                'trainingFeatures' => [
                    'enabled' => true,
                    'dataSource' => 'FitCopilot_Training_Features_Provider'
                ],
                'status' => 'active',
                'version' => '2.0.0'
            ],
            'endpoints' => [
                'getEvents' => admin_url('admin-ajax.php?action=get_calendar_events'),
                'saveEvent' => admin_url('admin-ajax.php?action=save_individual_calendar_event'),
                'deleteEvent' => admin_url('admin-ajax.php?action=delete_calendar_event'),
                'getTrainers' => admin_url('admin-ajax.php?action=get_trainer_availability'),
                'saveBooking' => admin_url('admin-ajax.php?action=mobile_book_event'),
                'getAvailability' => admin_url('admin-ajax.php?action=get_trainer_availability'),
                'trainerAvailabilityAPI' => home_url('/wp-json/fitcopilot/v1/trainer-availability'),
                'trainerAvailabilityRangeAPI' => home_url('/wp-json/fitcopilot/v1/trainer-availability/range')
            ],
            'api' => [
                'baseUrl' => home_url('/wp-json/fitcopilot/v1'),
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'restNonce' => wp_create_nonce('wp_rest'),
                'ajaxNonce' => wp_create_nonce('training_calendar_nonce'),
                'userRegistration' => [
                    'checkEmail' => home_url('/wp-json/fitcopilot/v1/users/check-email'),
                    'register' => home_url('/wp-json/fitcopilot/v1/users/register'),
                    'sendWelcome' => home_url('/wp-json/fitcopilot/v1/users/send-welcome-email'),
                    'profile' => home_url('/wp-json/fitcopilot/v1/users/profile')
                ]
            ],
            'debug' => [
                'phase' => 'Phase 2 - Smart Scheduling Integration',
                'timestamp' => current_time('mysql'),
                'dataSource' => 'WordPress Database + REST API',
                'eventsCount' => count($events),
                'trainersCount' => count($trainers),
                'realStats' => $real_stats,
                'apiEndpoints' => [
                    'trainerAvailability' => 'ACTIVE',
                    'smartScheduling' => 'ACTIVE',
                    'eventMapping' => 'Free Consultation ↔ Fitness Assessment'
                ],
                'localizationMethod' => 'COMPREHENSIVE_FIX'
            ],
            'nonce' => wp_create_nonce('training_calendar_nonce')
        ];
        
        // COMPREHENSIVE FIX: Multiple localization strategies
        $localization_success = false;
        
        // Strategy 1: Try to localize to homepage script
        $script_handle = 'fitcopilot-homepage';
        if (wp_script_is($script_handle, 'enqueued') || wp_script_is($script_handle, 'registered')) {
            $localize_result = wp_localize_script(
                $script_handle,
                'fitcopilotTrainingCalendarData',
                $calendar_data
            );
            
            if ($localize_result) {
                $localization_success = true;
                error_log('FitCopilot: Successfully localized to homepage script');
            }
        }
        
        // Strategy 2: If homepage script not available, create inline script
        if (!$localization_success) {
            add_action('wp_footer', function() use ($calendar_data) {
                echo '<script type="text/javascript">';
                echo 'window.fitcopilotTrainingCalendarData = ' . wp_json_encode($calendar_data) . ';';
                echo 'console.log("FitCopilot: Training Calendar data loaded via inline script");';
                echo '</script>';
            }, 5);
            
            $localization_success = true;
            error_log('FitCopilot: Scheduled inline script for data localization');
        }
        
        // Strategy 3: Store data globally for PHP access
        global $fitcopilot_training_calendar_localized_data;
        $fitcopilot_training_calendar_localized_data = $calendar_data;
        
        if ($localization_success) {
            error_log('FitCopilot: Training Calendar data localization completed successfully');
        } else {
            error_log('FitCopilot: Failed to localize Training Calendar data');
        }
    }
    
    /**
     * Get formatted calendar data for frontend
     * Following Personal Training data formatting pattern
     */
    public function get_formatted_calendar_data() {
        $settings = $this->data_manager->get_settings();
        $stats = $this->data_manager->get_statistics();
        
        // Format data for React component consumption
        $calendar_data = array(
            'settings' => array(
                'defaultView' => $settings['default_view'] ?? 'dayGridMonth',
                'firstDay' => $settings['first_day'] ?? 0,
                'timeFormat' => $settings['time_format'] ?? 'h:mm a',
                'dateFormat' => $settings['date_format'] ?? 'MMM d, yyyy',
                'slotDuration' => $settings['slot_duration'] ?? '00:30:00',
                'businessHours' => $settings['business_hours'] ?? array(
                    'start' => '09:00',
                    'end' => '17:00'
                ),
                'weekendEnabled' => $settings['weekend_enabled'] ?? false,
                'emailNotifications' => $settings['email_notifications'] ?? true,
                'calendarColors' => $settings['calendar_colors'] ?? array(
                    'session' => '#4CAF50',
                    'availability' => '#2196F3',
                    'blocked' => '#F44336',
                    'group_class' => '#FF9800',
                    'workshop' => '#9C27B0',
                    'assessment' => '#00BCD4'
                ),
                'bookingSettings' => array(
                    'advanceDays' => $settings['booking_advance_days'] ?? 30,
                    'noticeHours' => $settings['booking_notice_hours'] ?? 24,
                    'autoConfirm' => $settings['auto_confirm_bookings'] ?? false
                )
            ),
            'statistics' => array(
                'totalEvents' => $stats['total_events'],
                'confirmedEvents' => $stats['confirmed_events'],
                'lastUpdated' => $stats['last_updated']
            ),
            'events' => array(), // Will be populated via AJAX for performance
            'trainers' => $this->get_integrated_trainers(),
            'integration' => array(
                'personalTraining' => $this->check_personal_training_integration(),
                'trainingFeatures' => $this->check_training_features_integration(),
                'status' => 'active',
                'version' => '1.0.0'
            ),
            'endpoints' => array(
                'getEvents' => wp_nonce_url(admin_url('admin-ajax.php?action=get_training_calendar_data'), 'training_calendar_nonce'),
                'saveEvent' => wp_nonce_url(admin_url('admin-ajax.php?action=save_calendar_event'), 'training_calendar_nonce'),
                'deleteEvent' => wp_nonce_url(admin_url('admin-ajax.php?action=delete_calendar_event'), 'training_calendar_nonce')
            )
        );
        
        return $calendar_data;
    }
    
    /**
     * Get integrated trainers from Personal Training
     * Phase 2: Enhanced integration with caching and real-time sync
     */
    private function get_integrated_trainers() {
        // Check cache first for performance
        $cache_key = 'fitcopilot_training_calendar_trainers_v2';
        $cached_data = wp_cache_get($cache_key);
        
        if ($cached_data !== false && is_array($cached_data)) {
            return $cached_data;
        }
        
        // Get Personal Training data using the same pattern as Personal Training Provider
        $personal_training_data = get_option('fitcopilot_personal_training_data', array());
        
        if (empty($personal_training_data)) {
            // Cache empty result to prevent repeated database calls
            wp_cache_set($cache_key, array(), '', 300); // 5 minutes cache
            return array();
        }
        
        $trainers = array();
        $last_sync = get_option('fitcopilot_training_calendar_last_sync', 0);
        
        foreach ($personal_training_data as $trainer) {
            // Enhanced validation and data integrity checks
            if (!$this->validate_trainer_data($trainer)) {
                continue;
            }
            
            if (isset($trainer['active']) && $trainer['active']) {
                $trainer_data = array(
                    'id' => $trainer['id'] ?? 0,
                    'name' => $trainer['name'] ?? '',
                    'specialty' => $trainer['specialty'] ?? '',
                    'bio' => $trainer['bio'] ?? '',
                    'yearsExperience' => $trainer['years_experience'] ?? 0,
                    'clientsCount' => $trainer['clients_count'] ?? 0,
                    'featured' => $trainer['featured'] ?? false,
                    'imageUrl' => $trainer['image_url'] ?? '',
                    'coachType' => $trainer['coach_type'] ?? 'personal',
                    'active' => true,
                    'availability' => $this->get_trainer_availability($trainer['id'] ?? 0),
                    'calendarConfig' => array(
                        'color' => $this->get_trainer_color($trainer['id'] ?? 0),
                        'borderColor' => $this->get_trainer_border_color($trainer['id'] ?? 0),
                        'textColor' => '#ffffff'
                    ),
                    'integrationMeta' => array(
                        'sourceModule' => 'personal-training',
                        'lastSync' => current_time('mysql'),
                        'dataVersion' => get_option('fitcopilot_personal_training_last_updated', 0)
                    )
                );
                
                $trainers[] = $trainer_data;
            }
        }
        
        // Cache the processed trainer data for 10 minutes
        wp_cache_set($cache_key, $trainers, '', 600);
        
        // Update last sync timestamp
        update_option('fitcopilot_training_calendar_last_sync', current_time('timestamp'));
        
        return $trainers;
    }
    
    /**
     * Check Personal Training integration status
     */
    private function check_personal_training_integration() {
        $personal_training_data = get_option('fitcopilot_personal_training_data', array());
        
        return array(
            'enabled' => !empty($personal_training_data),
            'trainersCount' => count($personal_training_data),
            'dataSource' => 'fitcopilot_personal_training_data'
        );
    }
    
    /**
     * Check Training Features integration status
     */
    private function check_training_features_integration() {
        $training_features_data = get_option('fitcopilot_training_features_data', array());
        
        return array(
            'enabled' => !empty($training_features_data),
            'featuresCount' => count($training_features_data),
            'dataSource' => 'fitcopilot_training_features_data'
        );
    }
    
    /**
     * Get trainer calendar color
     */
    private function get_trainer_color($trainer_id) {
        $colors = array('#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', '#00BCD4');
        return $colors[$trainer_id % count($colors)];
    }
    
    /**
     * Get trainer border color
     */
    private function get_trainer_border_color($trainer_id) {
        $colors = array('#388E3C', '#1976D2', '#F57C00', '#7B1FA2', '#C2185B', '#0097A7');
        return $colors[$trainer_id % count($colors)];
    }
    
    /**
     * Validate trainer data structure and integrity
     * Phase 2: Enhanced validation for data consistency
     */
    private function validate_trainer_data($trainer) {
        // Required fields validation
        if (!isset($trainer['id']) || empty($trainer['id'])) {
            error_log('Training Calendar: Invalid trainer - missing ID');
            return false;
        }
        
        if (!isset($trainer['name']) || empty(trim($trainer['name']))) {
            error_log('Training Calendar: Invalid trainer - missing name for ID ' . $trainer['id']);
            return false;
        }
        
        // Data type validation
        if (!is_numeric($trainer['id'])) {
            error_log('Training Calendar: Invalid trainer - non-numeric ID: ' . $trainer['id']);
            return false;
        }
        
        // Optional fields validation
        if (isset($trainer['active']) && !is_bool($trainer['active'])) {
            // Try to convert string boolean values
            if (in_array($trainer['active'], ['1', '0', 1, 0, 'true', 'false'], true)) {
                // Valid convertible value, will be handled later
            } else {
                error_log('Training Calendar: Invalid trainer - invalid active status for ID ' . $trainer['id']);
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Get trainer availability from calendar events
     * Phase 2: Real-time availability calculation
     */
    private function get_trainer_availability($trainer_id) {
        // Get trainer's existing events to calculate availability
        $events = $this->data_manager->get_trainer_events($trainer_id, array(
            'start_date' => current_time('Y-m-d'),
            'end_date' => date('Y-m-d', strtotime('+30 days'))
        ));
        
        $availability = array();
        
        // Default availability slots (9 AM to 5 PM, Monday to Friday)
        $default_hours = array(
            'monday' => array('09:00', '17:00'),
            'tuesday' => array('09:00', '17:00'),
            'wednesday' => array('09:00', '17:00'),
            'thursday' => array('09:00', '17:00'),
            'friday' => array('09:00', '17:00'),
            'saturday' => array('10:00', '14:00'),
            'sunday' => array() // Not available
        );
        
        foreach ($default_hours as $day => $hours) {
            if (empty($hours)) {
                continue;
            }
            
            $day_number = array_search($day, array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'));
            
            $availability[] = array(
                'dayOfWeek' => $day_number,
                'startTime' => $hours[0],
                'endTime' => $hours[1],
                'dayName' => ucfirst($day),
                'available' => true,
                'bookedSlots' => $this->count_booked_slots($events, $day_number)
            );
        }
        
        return $availability;
    }
    
    /**
     * Count booked time slots for a specific day
     */
    private function count_booked_slots($events, $day_of_week) {
        $booked_count = 0;
        
        foreach ($events as $event) {
            $event_day = date('w', strtotime($event['start_datetime']));
            if ($event_day == $day_of_week && $event['booking_status'] !== 'cancelled') {
                $booked_count++;
            }
        }
        
        return $booked_count;
    }
    
    /**
     * AJAX handler for getting calendar data
     */
    public function get_calendar_data() {
        // Verify nonce for security
        $nonce_value = $_POST['nonce'] ?? $_POST['fitcopilot_training_calendar_nonce'] ?? $_REQUEST['_wpnonce'] ?? '';
        if (!wp_verify_nonce($nonce_value, 'training_calendar_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
        }
        
        $start_date = sanitize_text_field($_REQUEST['start'] ?? '');
        $end_date = sanitize_text_field($_REQUEST['end'] ?? '');
        
        // Get events for date range
        $events = array(); // Would get from data manager
        
        // Format events for FullCalendar
        $formatted_events = array();
        foreach ($events as $event) {
            $formatted_events[] = array(
                'id' => $event['id'],
                'title' => $event['title'],
                'start' => $event['start_datetime'],
                'end' => $event['end_datetime'],
                'backgroundColor' => $event['background_color'] ?? '#4CAF50',
                'borderColor' => $event['border_color'] ?? '#388E3C',
                'textColor' => $event['text_color'] ?? '#ffffff',
                'extendedProps' => array(
                    'trainerId' => $event['trainer_id'],
                    'eventType' => $event['event_type'],
                    'bookingStatus' => $event['booking_status'],
                    'sessionType' => $event['session_type'],
                    'location' => $event['location'],
                    'description' => $event['description']
                )
            );
        }
        
        wp_send_json_success(array(
            'events' => $formatted_events,
            'dateRange' => array(
                'start' => $start_date,
                'end' => $end_date
            ),
            'timestamp' => current_time('mysql')
        ));
    }
    
    /**
     * Get calendar data for specific page/context
     * Following Personal Training context-specific data pattern
     */
    public function get_context_data($context = 'homepage') {
        $base_data = $this->get_formatted_calendar_data();
        
        switch ($context) {
            case 'homepage':
                // Homepage specific calendar configuration
                $base_data['settings']['defaultView'] = 'listWeek';
                $base_data['settings']['height'] = 400;
                break;
                
            case 'fullpage':
                // Full page calendar configuration
                $base_data['settings']['defaultView'] = 'dayGridMonth';
                $base_data['settings']['height'] = 'auto';
                break;
                
            case 'widget':
                // Widget calendar configuration
                $base_data['settings']['defaultView'] = 'listWeek';
                $base_data['settings']['height'] = 300;
                $base_data['settings']['headerToolbar'] = false;
                break;
        }
        
        return $base_data;
    }
    
    /**
     * Check if calendar feature is enabled
     * Following Personal Training feature check pattern
     */
    public function is_calendar_enabled() {
        $settings = $this->data_manager->get_settings();
        return !empty($settings['default_view']);
    }
    
    /**
     * Get calendar shortcode data
     * For [training_calendar] shortcode support
     */
    public function get_shortcode_data($atts = array()) {
        $defaults = array(
            'view' => 'dayGridMonth',
            'height' => 400,
            'trainer' => '',
            'type' => ''
        );
        
        $atts = shortcode_atts($defaults, $atts, 'training_calendar');
        
        $data = $this->get_formatted_calendar_data();
        
        // Override settings based on shortcode attributes
        $data['settings']['defaultView'] = $atts['view'];
        $data['settings']['height'] = $atts['height'];
        
        // Filter by trainer if specified
        if (!empty($atts['trainer'])) {
            $data['filters']['trainer'] = $atts['trainer'];
        }
        
        // Filter by type if specified
        if (!empty($atts['type'])) {
            $data['filters']['type'] = $atts['type'];
        }
        
        return $data;
    }
    
    // ===== PHASE 2: DATA FORMATTING METHODS =====
    
    /**
     * Format database events for React frontend consumption
     * PHASE 2: Handle real database event structure
     * 
     * @param array $events Raw database events data
     * @return array Formatted events
     */
    private function format_database_events_for_frontend($events) {
        $formatted_events = [];
        
        foreach ($events as $event) {
            $formatted_events[] = [
                'id' => $event['id'],
                'title' => $event['title'],
                'description' => $event['description'] ?? '',
                'start' => $event['start_datetime'],
                'end' => $event['end_datetime'],
                
                // FullCalendar specific properties
                'backgroundColor' => $event['background_color'] ?? '#10b981',
                'borderColor' => $event['border_color'] ?? '#059669', 
                'textColor' => $event['text_color'] ?? '#ffffff',
                'allDay' => false,
                'editable' => true,
                'startEditable' => true,
                'durationEditable' => true,
                
                // Extended properties for event details
                'extendedProps' => [
                    'trainerId' => $event['trainer_id'] ?? null,
                    'trainerName' => $this->get_trainer_name($event['trainer_id'] ?? null),
                    'eventType' => $event['event_type'] ?? 'session',
                    'bookingStatus' => $event['booking_status'] ?? 'available',
                    'sessionType' => $event['session_type'] ?? 'individual',
                    'location' => $event['location'] ?? '',
                    'maxParticipants' => $event['max_participants'] ?? 1,
                    'currentParticipants' => $event['current_participants'] ?? 0,
                    'durationMinutes' => $event['duration_minutes'] ?? 60,
                    'description' => $event['description'] ?? ''
                ]
            ];
        }
        
        return $formatted_events;
    }
    
    /**
     * Format trainers for React frontend consumption
     * PHASE 2: Ensure component compatibility
     * 
     * @param array $trainers Raw trainers data
     * @return array Formatted trainers
     */
    private function format_trainers_for_frontend($trainers) {
        $formatted_trainers = [];
        
        foreach ($trainers as $trainer) {
            $formatted_trainers[] = [
                'id' => $trainer['id'],
                'name' => $trainer['name'],
                'specialty' => $trainer['specialty'] ?? '',
                'bio' => $trainer['bio'] ?? '',
                'imageUrl' => $trainer['imageUrl'] ?? '',
                'yearsExperience' => $trainer['yearsExperience'] ?? 0,
                'clientsCount' => $trainer['clientsCount'] ?? 0,
                'featured' => $trainer['featured'] ?? false,
                'active' => $trainer['active'] ?? true,
                'coachType' => $trainer['coachType'] ?? 'personal',
                'color' => $trainer['color'] ?? $this->get_trainer_color($trainer['id']),
                
                // Calendar-specific properties
                'availability' => $this->get_trainer_availability_summary($trainer['id']),
                'calendarConfig' => [
                    'color' => $trainer['color'] ?? $this->get_trainer_color($trainer['id']),
                    'borderColor' => $this->get_trainer_border_color($trainer['id']),
                    'textColor' => '#ffffff'
                ]
            ];
        }
        
        return $formatted_trainers;
    }
    
    /**
     * Get trainer name by ID
     * 
     * @param int|null $trainer_id Trainer ID
     * @return string Trainer name
     */
    private function get_trainer_name($trainer_id) {
        if (empty($trainer_id)) {
            return '';
        }
        
        $trainers = $this->get_sample_trainers();
        foreach ($trainers as $trainer) {
            if ($trainer['id'] == $trainer_id) {
                return $trainer['name'];
            }
        }
        
        return 'Unknown Trainer';
    }
    
    /**
     * Get trainer availability summary
     * 
     * @param int $trainer_id Trainer ID
     * @return array Availability summary
     */
    private function get_trainer_availability_summary($trainer_id) {
        // For Phase 2, return basic availability structure
        // This will be enhanced in later phases with real availability data
        return [
            'totalHours' => 40,
            'availableDays' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            'timeSlots' => [
                ['start' => '09:00', 'end' => '17:00']
            ],
            'nextAvailable' => date('Y-m-d H:i:s', strtotime('+1 day 10:00'))
        ];
    }
    
    // ===== PHASE 2: REAL-TIME SYNCHRONIZATION HANDLERS =====
    
    /**
     * Handle Personal Training data update - ENHANCED for real-time sync
     * Called when Personal Training module saves data
     */
    public function handle_trainer_data_update() {
        // Get current trainer data for comparison
        $current_trainers = $this->get_integrated_trainers();
        $previous_trainer_ids = get_option('fitcopilot_training_calendar_trainer_ids', array());
        $current_trainer_ids = array_column($current_trainers, 'id');
        
        // Detect changes
        $added_trainers = array_diff($current_trainer_ids, $previous_trainer_ids);
        $removed_trainers = array_diff($previous_trainer_ids, $current_trainer_ids);
        
        // Handle added trainers
        if (!empty($added_trainers)) {
            foreach ($added_trainers as $trainer_id) {
                $this->handle_trainer_added($trainer_id);
            }
        }
        
        // Handle removed trainers
        if (!empty($removed_trainers)) {
            foreach ($removed_trainers as $trainer_id) {
                $this->handle_trainer_removed($trainer_id);
            }
        }
        
        // Update stored trainer IDs for next comparison
        update_option('fitcopilot_training_calendar_trainer_ids', $current_trainer_ids);
        
        // Invalidate trainer cache immediately
        $this->invalidate_trainer_cache();
        
        // Log synchronization event with details
        error_log('Training Calendar: Trainer data synchronized - Added: ' . count($added_trainers) . ', Removed: ' . count($removed_trainers) . ', Total: ' . count($current_trainers));
        
        // Trigger enhanced custom action for other integrations
        do_action('fitcopilot_training_calendar_trainers_synced', array(
            'added' => $added_trainers,
            'removed' => $removed_trainers,
            'total_trainers' => count($current_trainers),
            'sync_timestamp' => current_time('timestamp')
        ));
    }
    
    /**
     * Handle trainer added to Personal Training
     */
    private function handle_trainer_added($trainer_id) {
        // Log new trainer
        error_log("Training Calendar: New trainer detected - ID: {$trainer_id}");
        
        // Optionally auto-assign to common event types
        $auto_assign_settings = get_option('fitcopilot_training_calendar_auto_assign', array(
            'enabled' => false,
            'event_types' => array('fitness_assessment') // Default to free assessments
        ));
        
        if (!empty($auto_assign_settings['enabled']) && !empty($auto_assign_settings['event_types'])) {
            $this->auto_assign_trainer($trainer_id, $auto_assign_settings['event_types']);
        }
        
        // Trigger action for frontend notifications
        do_action('fitcopilot_training_calendar_trainer_added', $trainer_id);
    }
    
    /**
     * Handle trainer removed from Personal Training
     */
    private function handle_trainer_removed($trainer_id) {
        // Log removal
        error_log("Training Calendar: Trainer removed - ID: {$trainer_id}");
        
        // Clean up assignments for removed trainer
        $this->cleanup_trainer_assignments($trainer_id);
        
        // Update any events assigned to this trainer
        $this->reassign_trainer_events($trainer_id);
        
        // Trigger action for frontend notifications
        do_action('fitcopilot_training_calendar_trainer_removed', $trainer_id);
    }
    
    /**
     * Auto-assign trainer to specified event types
     */
    private function auto_assign_trainer($trainer_id, $event_types) {
        // Get assignment manager
        if (!class_exists('FitCopilot_Trainer_Assignment_Manager')) {
            return;
        }
        
        $assignment_manager = new FitCopilot_Trainer_Assignment_Manager();
        
        foreach ($event_types as $event_type) {
            try {
                $result = $assignment_manager->assign_trainer($trainer_id, $event_type, array(
                    'is_active' => true,
                    'auto_assigned' => true,
                    'specialization_notes' => 'Auto-assigned when trainer was added',
                    'created_at' => current_time('mysql')
                ));
                
                if ($result) {
                    error_log("Training Calendar: Auto-assigned trainer {$trainer_id} to {$event_type}");
                }
            } catch (Exception $e) {
                error_log("Training Calendar: Failed to auto-assign trainer {$trainer_id} to {$event_type}: " . $e->getMessage());
            }
        }
    }
    
    /**
     * Clean up assignments for removed trainer
     */
    private function cleanup_trainer_assignments($trainer_id) {
        // Get assignment manager
        if (!class_exists('FitCopilot_Trainer_Assignment_Manager')) {
            return;
        }
        
        $assignment_manager = new FitCopilot_Trainer_Assignment_Manager();
        
        try {
            // Get trainer's assignments
            $assignments = $assignment_manager->get_trainer_assignments($trainer_id);
            
            // Remove each assignment
            foreach ($assignments as $assignment) {
                $assignment_manager->remove_assignment($trainer_id, $assignment['event_type']);
                error_log("Training Calendar: Removed assignment for trainer {$trainer_id} from {$assignment['event_type']}");
            }
            
            // Log cleanup completion
            error_log("Training Calendar: Cleaned up " . count($assignments) . " assignments for removed trainer {$trainer_id}");
        } catch (Exception $e) {
            error_log("Training Calendar: Failed to cleanup assignments for trainer {$trainer_id}: " . $e->getMessage());
        }
    }
    
    /**
     * Handle individual trainer save
     * Called when a specific trainer is saved in Personal Training
     * 
     * @param int $trainer_id Trainer ID
     * @param array $trainer_data Trainer data
     */
    public function handle_trainer_saved($trainer_id, $trainer_data) {
        // Invalidate cache for this specific trainer
        $cache_key = 'fitcopilot_training_calendar_trainer_' . $trainer_id;
        wp_cache_delete($cache_key);
        
        // Invalidate the main trainer list cache
        $this->invalidate_trainer_cache();
        
        // Update calendar events if trainer status changed
        if (isset($trainer_data['active']) && !$trainer_data['active']) {
            $this->handle_trainer_deactivation($trainer_id);
        }
        
        error_log('Training Calendar: Individual trainer synchronized - ID: ' . $trainer_id);
    }
    
    /**
     * Handle trainer deletion
     * Called when a trainer is deleted from Personal Training
     * 
     * @param int $trainer_id Trainer ID
     */
    public function handle_trainer_deleted($trainer_id) {
        // Remove trainer-specific cache
        $cache_key = 'fitcopilot_training_calendar_trainer_' . $trainer_id;
        wp_cache_delete($cache_key);
        
        // Invalidate main trainer cache
        $this->invalidate_trainer_cache();
        
        // Handle existing calendar events for this trainer
        $this->reassign_trainer_events($trainer_id);
        
        error_log('Training Calendar: Trainer removed from calendar - ID: ' . $trainer_id);
    }
    
    /**
     * Handle trainer deactivation
     * Cancel or reassign future events when trainer is deactivated
     * 
     * @param int $trainer_id Trainer ID
     */
    private function handle_trainer_deactivation($trainer_id) {
        // Get future events for this trainer
        $future_events = $this->data_manager->get_trainer_events($trainer_id, array(
            'start_date' => current_time('Y-m-d'),
            'end_date' => date('Y-m-d', strtotime('+1 year'))
        ));
        
        foreach ($future_events as $event) {
            // Mark events as cancelled or require manual reassignment
            if ($event['booking_status'] === 'available') {
                // Cancel available slots
                $this->data_manager->update_event_status($event['id'], array(
                    'booking_status' => 'cancelled',
                    'notes' => 'Trainer deactivated - event cancelled'
                ));
            } else {
                // Flag booked events for manual review
                $this->data_manager->update_event_status($event['id'], array(
                    'booking_status' => 'requires_attention',
                    'notes' => 'Trainer deactivated - requires reassignment'
                ));
            }
        }
    }
    
    /**
     * Reassign events when trainer is deleted
     * 
     * @param int $trainer_id Deleted trainer ID
     */
    private function reassign_trainer_events($trainer_id) {
        // Get all future events for the deleted trainer
        $events = $this->data_manager->get_trainer_events($trainer_id, array(
            'start_date' => current_time('Y-m-d')
        ));
        
        // Get active trainers for reassignment
        $active_trainers = $this->get_integrated_trainers();
        
        foreach ($events as $event) {
            if (empty($active_trainers)) {
                // No trainers available, cancel the event
                $this->data_manager->update_event_status($event['id'], array(
                    'booking_status' => 'cancelled',
                    'trainer_id' => null,
                    'notes' => 'Original trainer deleted - no replacement available'
                ));
            } else {
                // Mark for manual reassignment
                $this->data_manager->update_event_status($event['id'], array(
                    'booking_status' => 'requires_attention',
                    'notes' => 'Original trainer deleted - requires manual reassignment'
                ));
            }
        }
    }
    
    /**
     * Invalidate trainer cache
     */
    private function invalidate_trainer_cache() {
        $cache_keys = array(
            'fitcopilot_training_calendar_trainers_v2',
            'fitcopilot_training_calendar_integration_status'
        );
        
        foreach ($cache_keys as $key) {
            wp_cache_delete($key);
        }
        
        // Update last sync timestamp
        update_option('fitcopilot_training_calendar_last_sync', current_time('timestamp'));
    }
    
    /**
     * Maybe invalidate cache on post save
     * Only if it's a calendar-related post type
     * 
     * @param int $post_id Post ID
     */
    public function maybe_invalidate_cache($post_id) {
        // Only invalidate for relevant post types
        $post_type = get_post_type($post_id);
        
        if (in_array($post_type, array('fitcopilot_event', 'fitcopilot_trainer'))) {
            $this->invalidate_trainer_cache();
        }
    }
    
    /**
     * Schedule cache cleanup
     * Remove stale cache entries periodically
     */
    public function schedule_cache_cleanup() {
        if (!wp_next_scheduled('fitcopilot_training_calendar_cache_cleanup')) {
            wp_schedule_event(time(), 'hourly', 'fitcopilot_training_calendar_cache_cleanup');
        }
        
        // Hook the cleanup function
        add_action('fitcopilot_training_calendar_cache_cleanup', array($this, 'cleanup_stale_cache'));
    }
    
    /**
     * Clean up stale cache entries
     */
    public function cleanup_stale_cache() {
        // This would typically involve more complex cache management
        // For now, just clean up known cache keys older than 1 hour
        $stale_keys = array(
            'fitcopilot_training_calendar_trainers_v2',
            'fitcopilot_training_calendar_integration_status'
        );
        
        foreach ($stale_keys as $key) {
            // WordPress object cache doesn't have expiration checking,
            // so we'll rely on the TTL set when caching
            wp_cache_delete($key);
        }
    }
    
    /**
     * Adjust cache duration based on context
     * 
     * @param int $duration Current duration
     * @param string $context Cache context
     * @return int Adjusted duration
     */
    public function adjust_cache_duration($duration, $context) {
        switch ($context) {
            case 'trainer_data':
                // Shorter cache for trainer data (5 minutes)
                return 300;
                
            case 'availability':
                // Very short cache for availability (1 minute)
                return 60;
                
            case 'events':
                // Medium cache for events (10 minutes)
                return 600;
                
            default:
                return $duration;
        }
    }
} 