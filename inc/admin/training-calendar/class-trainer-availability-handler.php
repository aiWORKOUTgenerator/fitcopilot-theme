<?php
/**
 * Training Calendar - Trainer Availability Handler
 * 
 * Handles AJAX requests for trainer availability with event type integration
 * Part of Phase 2: Event Type Backend Integration
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Trainer Availability Handler Class
 */
class FitCopilot_Trainer_Availability_Handler {
    
    /**
     * Assignment manager for trainer-event type relationships
     * @var FitCopilot_Trainer_Assignment_Manager
     */
    private $assignment_manager;
    
    /**
     * Initialize the handler
     */
    public function __construct() {
        // Load assignment manager
        require_once get_template_directory() . '/inc/admin/training-calendar/class-trainer-assignment-manager.php';
        $this->assignment_manager = new FitCopilot_Trainer_Assignment_Manager();
    }
    
    /**
     * Initialize the handler - called by Training Calendar Manager
     */
    public function init() {
        $this->register_ajax_handlers();
    }
    
    /**
     * Register AJAX handlers
     */
    public function register_ajax_handlers() {
        // Trainer availability AJAX handlers
        add_action('wp_ajax_get_trainer_availability', array($this, 'get_availability'));
        add_action('wp_ajax_save_trainer_availability', array($this, 'save_availability'));
        
        // Event type configuration AJAX handlers
        add_action('wp_ajax_get_event_type_config', array($this, 'get_event_config'));
        add_action('wp_ajax_validate_event_type_data', array($this, 'validate_event_data'));
        
        // Event type availability integration
        add_action('wp_ajax_get_event_type_availability', array($this, 'get_event_type_availability'));
        
        // Trainer assignment management AJAX handlers (Day 2 enhancement)
        add_action('wp_ajax_assign_trainer_to_event_type', array($this, 'assign_trainer_to_event_type'));
        add_action('wp_ajax_get_trainer_assignments', array($this, 'get_trainer_assignments'));
        add_action('wp_ajax_remove_trainer_assignment', array($this, 'remove_trainer_assignment'));
        add_action('wp_ajax_get_assignment_statistics', array($this, 'get_assignment_statistics'));
    }
    
    /**
     * Get trainer availability
     */
    public function get_availability() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'fitcopilot_training_calendar_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        $trainer_id = sanitize_text_field($_POST['trainer_id']);
        $event_type = sanitize_text_field($_POST['event_type'] ?? '');
        
        if (empty($trainer_id)) {
            wp_send_json_error(array('message' => 'Trainer ID is required'));
            return;
        }
        
        try {
            // Get availability data
            $availability_data = $this->fetch_trainer_availability($trainer_id, $event_type);
            
            // Add event type context if provided
            if (!empty($event_type)) {
                $availability_data['event_type_config'] = $this->get_event_type_config_data($event_type);
            }
            
            wp_send_json_success($availability_data);
            
        } catch (Exception $e) {
            error_log('Training Calendar - Get Availability Error: ' . $e->getMessage());
            wp_send_json_error(array('message' => 'Failed to load trainer availability'));
        }
    }
    
    /**
     * Save trainer availability
     */
    public function save_availability() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'fitcopilot_training_calendar_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        $trainer_id = sanitize_text_field($_POST['trainer_id']);
        $event_type = sanitize_text_field($_POST['event_type'] ?? '');
        $duration = sanitize_text_field($_POST['duration'] ?? '');
        $availability_json = wp_unslash($_POST['availability'] ?? '');
        
        if (empty($trainer_id)) {
            wp_send_json_error(array('message' => 'Trainer ID is required'));
            return;
        }
        
        try {
            // Parse availability data
            $availability = json_decode($availability_json, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                wp_send_json_error(array('message' => 'Invalid availability data format'));
                return;
            }
            
            // Validate against event type rules
            $validation = $this->validate_availability_against_event_type($availability, $event_type, $duration);
            if (!$validation['valid']) {
                wp_send_json_error(array(
                    'message' => 'Validation failed',
                    'errors' => $validation['errors']
                ));
                return;
            }
            
            // Save availability data
            $result = $this->save_trainer_availability_data($trainer_id, $event_type, $duration, $availability);
            
            if ($result) {
                wp_send_json_success(array(
                    'message' => 'Trainer availability saved successfully',
                    'availability_id' => $result
                ));
            } else {
                wp_send_json_error(array('message' => 'Failed to save trainer availability'));
            }
            
        } catch (Exception $e) {
            error_log('Training Calendar - Save Availability Error: ' . $e->getMessage());
            wp_send_json_error(array('message' => 'Failed to save trainer availability'));
        }
    }
    
    /**
     * Get event type configuration
     */
    public function get_event_config() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'fitcopilot_training_calendar_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        try {
            // Load event type configuration
            if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
                require_once get_template_directory() . '/inc/admin/training-calendar/config/event-types-config.php';
            }
            
            $config = FitCopilot_Training_Calendar_Event_Types_Config::get_all_event_types();
            
            wp_send_json_success($config);
            
        } catch (Exception $e) {
            error_log('Training Calendar - Get Event Config Error: ' . $e->getMessage());
            wp_send_json_error(array('message' => 'Failed to load event type configuration'));
        }
    }
    
    /**
     * Validate event type data
     */
    public function validate_event_data() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'fitcopilot_training_calendar_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        $event_type = sanitize_text_field($_POST['event_type'] ?? '');
        $duration = sanitize_text_field($_POST['duration'] ?? '');
        
        try {
            $validation = $this->validate_event_type_selection($event_type, $duration);
            
            wp_send_json_success($validation);
            
        } catch (Exception $e) {
            error_log('Training Calendar - Validate Event Data Error: ' . $e->getMessage());
            wp_send_json_error(array('message' => 'Validation failed'));
        }
    }
    
    /**
     * Get event type specific availability
     */
    public function get_event_type_availability() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'fitcopilot_training_calendar_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        $event_type = sanitize_text_field($_POST['event_type'] ?? '');
        $date_range = sanitize_text_field($_POST['date_range'] ?? '');
        
        try {
            $availability = $this->get_availability_by_event_type($event_type, $date_range);
            
            wp_send_json_success($availability);
            
        } catch (Exception $e) {
            error_log('Training Calendar - Get Event Type Availability Error: ' . $e->getMessage());
            wp_send_json_error(array('message' => 'Failed to load event type availability'));
        }
    }
    
    /**
     * Fetch trainer availability from database
     */
    private function fetch_trainer_availability($trainer_id, $event_type = '') {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'training_calendar_availability';
        
        $query = $wpdb->prepare(
            "SELECT * FROM {$table_name} WHERE trainer_id = %s",
            $trainer_id
        );
        
        // Add event type filter if provided
        if (!empty($event_type)) {
            $query = $wpdb->prepare(
                "SELECT * FROM {$table_name} WHERE trainer_id = %s AND event_type = %s",
                $trainer_id,
                $event_type
            );
        }
        
        $results = $wpdb->get_results($query, ARRAY_A);
        
        return array(
            'trainer_id' => $trainer_id,
            'event_type' => $event_type,
            'availability' => $this->format_availability_data($results)
        );
    }
    
    /**
     * Format availability data for frontend
     */
    private function format_availability_data($raw_data) {
        $formatted = array();
        
        foreach ($raw_data as $row) {
            $day = intval($row['day_of_week']);
            
            if (!isset($formatted[$day])) {
                $formatted[$day] = array(
                    'enabled' => true,
                    'time_slots' => array()
                );
            }
            
            $formatted[$day]['time_slots'][] = array(
                'start_time' => $row['start_time'],
                'end_time' => $row['end_time'],
                'max_bookings' => intval($row['max_bookings'] ?? 1)
            );
        }
        
        return $formatted;
    }
    
    /**
     * Get event type configuration data
     */
    private function get_event_type_config_data($event_type) {
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            require_once get_template_directory() . '/inc/admin/training-calendar/config/event-types-config.php';
        }
        
        return FitCopilot_Training_Calendar_Event_Types_Config::get_event_type($event_type);
    }
    
    /**
     * Validate availability against event type rules
     */
    private function validate_availability_against_event_type($availability, $event_type, $duration) {
        $validation = array(
            'valid' => true,
            'errors' => array(),
            'warnings' => array()
        );
        
        if (empty($event_type)) {
            return $validation; // Skip validation if no event type
        }
        
        $event_config = $this->get_event_type_config_data($event_type);
        if (!$event_config) {
            $validation['errors'][] = 'Invalid event type specified';
            $validation['valid'] = false;
            return $validation;
        }
        
        // Validate duration selection
        if ($event_config['requires_duration_selection'] && empty($duration)) {
            $validation['errors'][] = 'Duration is required for this event type';
            $validation['valid'] = false;
        }
        
        // Validate duration is allowed
        if (!empty($duration) && isset($event_config['durations'])) {
            if (!in_array(intval($duration), $event_config['durations'])) {
                $validation['errors'][] = 'Selected duration is not available for this event type';
                $validation['valid'] = false;
            }
        }
        
        // Validate availability rules
        if (isset($event_config['availability_rules'])) {
            $rules = $event_config['availability_rules'];
            
            foreach ($availability as $day => $day_data) {
                if ($day_data['enabled']) {
                    // Check allowed days
                    if (isset($rules['allowed_days']) && !in_array(intval($day), $rules['allowed_days'])) {
                        $validation['warnings'][] = "Day {$day} is not typically allowed for this event type";
                    }
                    
                    // Validate time slots against business hours
                    if (isset($rules['business_hours']) && isset($day_data['time_slots'])) {
                        foreach ($day_data['time_slots'] as $slot) {
                            if (!$this->is_within_business_hours($slot, $rules['business_hours'])) {
                                $validation['warnings'][] = "Time slot {$slot['start_time']}-{$slot['end_time']} is outside business hours";
                            }
                        }
                    }
                }
            }
        }
        
        return $validation;
    }
    
    /**
     * Save trainer availability data to database
     */
    private function save_trainer_availability_data($trainer_id, $event_type, $duration, $availability) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'training_calendar_availability';
        
        // Start transaction
        $wpdb->query('START TRANSACTION');
        
        try {
            // Delete existing availability for this trainer/event type combination
            $delete_query = $wpdb->prepare(
                "DELETE FROM {$table_name} WHERE trainer_id = %s AND event_type = %s",
                $trainer_id,
                $event_type
            );
            $wpdb->query($delete_query);
            
            // Insert new availability data
            foreach ($availability as $day => $day_data) {
                if ($day_data['enabled'] && isset($day_data['time_slots'])) {
                    foreach ($day_data['time_slots'] as $slot) {
                        $wpdb->insert(
                            $table_name,
                            array(
                                'trainer_id' => $trainer_id,
                                'event_type' => $event_type,
                                'duration' => intval($duration),
                                'day_of_week' => intval($day),
                                'start_time' => sanitize_text_field($slot['start_time']),
                                'end_time' => sanitize_text_field($slot['end_time']),
                                'max_bookings' => intval($slot['max_bookings'] ?? 1),
                                'created_at' => current_time('mysql')
                            ),
                            array('%s', '%s', '%d', '%d', '%s', '%s', '%d', '%s')
                        );
                    }
                }
            }
            
            // Commit transaction
            $wpdb->query('COMMIT');
            
            return $wpdb->insert_id;
            
        } catch (Exception $e) {
            // Rollback transaction
            $wpdb->query('ROLLBACK');
            throw $e;
        }
    }
    
    /**
     * Validate event type selection
     */
    private function validate_event_type_selection($event_type, $duration) {
        $validation = array(
            'valid' => true,
            'errors' => array(),
            'event_config' => null
        );
        
        if (empty($event_type)) {
            $validation['errors'][] = 'Event type is required';
            $validation['valid'] = false;
            return $validation;
        }
        
        $event_config = $this->get_event_type_config_data($event_type);
        if (!$event_config) {
            $validation['errors'][] = 'Invalid event type';
            $validation['valid'] = false;
            return $validation;
        }
        
        $validation['event_config'] = $event_config;
        
        // Validate duration requirements
        if ($event_config['requires_duration_selection']) {
            if (empty($duration)) {
                $validation['errors'][] = 'Duration is required for this event type';
                $validation['valid'] = false;
            } elseif (isset($event_config['durations'])) {
                if (!in_array(intval($duration), $event_config['durations'])) {
                    $validation['errors'][] = 'Selected duration is not available for this event type';
                    $validation['valid'] = false;
                }
            }
        }
        
        return $validation;
    }
    
    /**
     * Get availability by event type
     */
    private function get_availability_by_event_type($event_type, $date_range) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'training_calendar_availability';
        
        $query = $wpdb->prepare(
            "SELECT * FROM {$table_name} WHERE event_type = %s ORDER BY day_of_week, start_time",
            $event_type
        );
        
        $results = $wpdb->get_results($query, ARRAY_A);
        
        return $this->format_availability_data($results);
    }
    
    /**
     * Check if time slot is within business hours
     */
    private function is_within_business_hours($slot, $business_hours) {
        return $slot['start_time'] >= $business_hours['start'] && 
               $slot['end_time'] <= $business_hours['end'];
    }
    
    // ===== DAY 2 ENHANCEMENT: TRAINER ASSIGNMENT AJAX HANDLERS =====
    
    /**
     * AJAX handler for assigning trainer to event type
     */
    public function assign_trainer_to_event_type() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'fitcopilot_training_calendar_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        $trainer_id = sanitize_text_field($_POST['trainer_id'] ?? '');
        $event_type = sanitize_text_field($_POST['event_type'] ?? '');
        $assignment_data = $_POST['assignment_data'] ?? array();
        
        if (empty($trainer_id) || empty($event_type)) {
            wp_send_json_error(array('message' => 'Trainer ID and event type are required'));
            return;
        }
        
        try {
            // Check if assignment table exists and create if needed
            if (!$this->assignment_table_exists()) {
                // Try to create tables
                if (!$this->create_assignment_table()) {
                    wp_send_json_error(array('message' => 'Assignment system not available. Please contact administrator.'));
                    return;
                }
            }
            
            $result = $this->assignment_manager->assign_trainer_to_event_type(
                intval($trainer_id),
                $event_type,
                $assignment_data
            );
            
            if ($result !== false) {
                wp_send_json_success(array(
                    'message' => 'Trainer assignment saved successfully',
                    'assignment' => array(
                        'assignment_id' => $result,
                        'trainer_id' => $trainer_id,
                        'event_type' => $event_type,
                        'is_active' => true
                    )
                ));
            } else {
                wp_send_json_error(array('message' => 'Failed to save trainer assignment'));
            }
            
        } catch (Exception $e) {
            error_log('Training Calendar - Assign Trainer Error: ' . $e->getMessage());
            wp_send_json_error(array('message' => 'Failed to save assignment: ' . $e->getMessage()));
        }
    }
    
    /**
     * AJAX handler for getting trainer assignments
     */
    public function get_trainer_assignments() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'fitcopilot_training_calendar_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        $trainer_id = sanitize_text_field($_POST['trainer_id'] ?? '');
        $event_type = sanitize_text_field($_POST['event_type'] ?? '');
        
        try {
            // Check if assignment table exists
            if (!$this->assignment_table_exists()) {
                wp_send_json_success(array(
                    'assignments' => array(),
                    'message' => 'Assignment system not yet configured'
                ));
                return;
            }
            
            if (!empty($trainer_id)) {
                // Get assignments for specific trainer
                $assignments = $this->assignment_manager->get_trainer_assignments(intval($trainer_id));
                
                wp_send_json_success(array(
                    'assignments' => $assignments,
                    'trainer_id' => $trainer_id
                ));
                
            } elseif (!empty($event_type)) {
                // Get trainers for specific event type
                $trainers = $this->assignment_manager->get_event_type_trainers($event_type);
                
                wp_send_json_success(array(
                    'trainers' => $trainers,
                    'event_type' => $event_type
                ));
                
            } else {
                // Get assignment matrix data (enhanced format for frontend)
                $matrix_data = $this->assignment_manager->get_assignment_matrix_data();
                
                wp_send_json_success(array(
                    'assignments' => $matrix_data,
                    'matrix_format' => true,
                    'total_trainers' => count($matrix_data),
                    'trainers_with_assignments' => count(array_filter($matrix_data, function($trainer) {
                        return !empty($trainer['assignments']);
                    }))
                ));
            }
            
        } catch (Exception $e) {
            error_log('Training Calendar - Get Assignments Error: ' . $e->getMessage());
            wp_send_json_error(array('message' => 'Failed to retrieve assignments: ' . $e->getMessage()));
        }
    }
    
    /**
     * AJAX handler for removing trainer assignment
     */
    public function remove_trainer_assignment() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'fitcopilot_training_calendar_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        $trainer_id = sanitize_text_field($_POST['trainer_id'] ?? '');
        $event_type = sanitize_text_field($_POST['event_type'] ?? '');
        $hard_delete = isset($_POST['hard_delete']) && $_POST['hard_delete'] === 'true';
        
        if (empty($trainer_id) || empty($event_type)) {
            wp_send_json_error(array('message' => 'Trainer ID and event type are required'));
            return;
        }
        
        try {
            $result = $this->assignment_manager->remove_trainer_assignment(
                intval($trainer_id),
                $event_type,
                !$hard_delete // soft_delete is opposite of hard_delete
            );
            
            if ($result) {
                wp_send_json_success(array(
                    'message' => 'Trainer assignment removed successfully',
                    'trainer_id' => $trainer_id,
                    'event_type' => $event_type,
                    'hard_delete' => $hard_delete
                ));
            } else {
                wp_send_json_error(array('message' => 'Failed to remove trainer assignment'));
            }
            
        } catch (Exception $e) {
            error_log('Training Calendar - Remove Assignment Error: ' . $e->getMessage());
            wp_send_json_error(array('message' => 'Failed to remove assignment: ' . $e->getMessage()));
        }
    }
    
    /**
     * AJAX handler for getting assignment statistics
     */
    public function get_assignment_statistics() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'fitcopilot_training_calendar_nonce')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        try {
            // Check if assignment table exists
            if (!$this->assignment_table_exists()) {
                wp_send_json_success(array(
                    'total_assignments' => 0,
                    'active_assignments' => 0,
                    'trainers_with_assignments' => 0,
                    'coverage_rate' => '0%',
                    'avg_assignments_per_trainer' => '0',
                    'specialization_rate' => '0%',
                    'coverage_detail' => 'Assignment system not configured',
                    'assignment_range' => 'No data available',
                    'specialization_detail' => 'No data available',
                    'trainer_summary' => array(),
                    'event_type_coverage' => array(),
                    'recommendations' => array(
                        array(
                            'type' => 'info',
                            'title' => 'System Setup',
                            'description' => 'Assignment system is not yet configured. Start by assigning trainers to event types.',
                            'action' => null,
                            'action_label' => null
                        )
                    ),
                    'generated_at' => current_time('mysql'),
                    'message' => 'Assignment system not configured'
                ));
                return;
            }
            
            $statistics = $this->assignment_manager->get_assignment_statistics();
            $statistics['generated_at'] = current_time('mysql');
            
            wp_send_json_success($statistics);
            
        } catch (Exception $e) {
            error_log('Training Calendar - Get Statistics Error: ' . $e->getMessage());
            wp_send_json_error(array('message' => 'Failed to retrieve statistics: ' . $e->getMessage()));
        }
    }
    
         /**
      * Check if assignment table exists
      * 
      * @return bool True if table exists
      */
     private function assignment_table_exists() {
         global $wpdb;
         
         $table_name = $wpdb->prefix . 'training_calendar_trainer_assignments';
         $table_exists = $wpdb->get_var($wpdb->prepare(
             "SHOW TABLES LIKE %s",
             $table_name
         )) === $table_name;
         
         return $table_exists;
     }
     
     /**
      * Create assignment table
      * 
      * @return bool True if table created successfully
      */
     private function create_assignment_table() {
         global $wpdb;
         
         $table_name = $wpdb->prefix . 'training_calendar_trainer_assignments';
         
         $charset_collate = $wpdb->get_charset_collate();
         
         $sql = "CREATE TABLE $table_name (
             id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
             trainer_id bigint(20) unsigned NOT NULL,
             event_type varchar(50) NOT NULL,
             is_active tinyint(1) NOT NULL DEFAULT 1,
             specialization_notes text,
             hourly_rate decimal(8,2) DEFAULT NULL,
             max_sessions_per_day int(11) DEFAULT 8,
             created_at datetime DEFAULT CURRENT_TIMESTAMP,
             updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
             PRIMARY KEY (id),
             UNIQUE KEY trainer_event_type (trainer_id, event_type),
             KEY idx_trainer_id (trainer_id),
             KEY idx_event_type (event_type),
             KEY idx_is_active (is_active)
         ) $charset_collate;";
         
         require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
         dbDelta($sql);
         
         // Check if table was created
         return $this->assignment_table_exists();
     }
} 