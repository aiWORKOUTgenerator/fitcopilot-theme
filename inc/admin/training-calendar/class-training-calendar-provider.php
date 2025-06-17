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
     * Following Personal Training hook pattern exactly
     */
    public function init() {
        // Provide data to frontend
        add_action('wp_enqueue_scripts', array($this, 'provide_frontend_data'));
        
        // AJAX endpoints for frontend
        add_action('wp_ajax_get_training_calendar_data', array($this, 'get_calendar_data'));
        add_action('wp_ajax_nopriv_get_training_calendar_data', array($this, 'get_calendar_data'));
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
     * Provide frontend data
     * PHASE 2: Enhanced data structure for React integration
     * 
     * @return void
     */
    public function provide_frontend_data() {
        // Only provide data on pages where needed
        if (!$this->should_load_calendar_data()) {
            return;
        }
        
        // Get real events and database statistics instead of sample data
        $real_stats = $this->data_manager->get_statistics();
        $events = $this->data_manager->get_all_events();
        $trainers = $this->get_sample_trainers(); // Keep trainers as sample for now
        
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
                'getAvailability' => admin_url('admin-ajax.php?action=get_trainer_availability')
            ],
            'debug' => [
                'phase' => 'Phase 2 - Real Database Integration',
                'timestamp' => current_time('mysql'),
                'dataSource' => 'WordPress Database',
                'eventsCount' => count($events),
                'trainersCount' => count($trainers),
                'realStats' => $real_stats
            ],
            'nonce' => wp_create_nonce('training_calendar_nonce')
        ];
        
        // Localize script
        wp_localize_script(
            'fitcopilot-homepage',
            'fitcopilotTrainingCalendarData',
            $calendar_data
        );
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
     * Following cross-feature integration pattern
     */
    private function get_integrated_trainers() {
        // Get Personal Training data if available
        $personal_training_data = get_option('fitcopilot_personal_training_data', array());
        
        if (empty($personal_training_data)) {
            return array();
        }
        
        $trainers = array();
        
        foreach ($personal_training_data as $trainer) {
            if (isset($trainer['active']) && $trainer['active']) {
                $trainers[] = array(
                    'id' => $trainer['id'] ?? 0,
                    'name' => $trainer['name'] ?? '',
                    'specialty' => $trainer['specialty'] ?? '',
                    'yearsExperience' => $trainer['years_experience'] ?? 0,
                    'clientsCount' => $trainer['clients_count'] ?? 0,
                    'featured' => $trainer['featured'] ?? false,
                    'imageUrl' => $trainer['image_url'] ?? '',
                    'coachType' => $trainer['coach_type'] ?? 'personal',
                    'availability' => array(), // Will be populated separately
                    'calendarConfig' => array(
                        'color' => $this->get_trainer_color($trainer['id'] ?? 0),
                        'borderColor' => $this->get_trainer_border_color($trainer['id'] ?? 0),
                        'textColor' => '#ffffff'
                    )
                );
            }
        }
        
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
} 