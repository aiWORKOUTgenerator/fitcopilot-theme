<?php
/**
 * FitCopilot Training Calendar AJAX Handler
 * 
 * Handles all AJAX requests for the Training Calendar admin interface
 * Following Personal Training AJAX patterns for calendar-specific operations
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Calendar AJAX Handler Class
 * 
 * Implements Personal Training patterns for Training Calendar functionality
 * All methods follow the exact architecture and error handling patterns
 * established in the Personal Training gold standard implementation
 */
class FitCopilot_Training_Calendar_Ajax {
    
    /**
     * Data manager instance
     * 
     * @var FitCopilot_Training_Calendar_Data
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
     * Initialize AJAX handlers
     * Following Personal Training hook registration pattern exactly
     */
    public function init() {
        // Calendar event operations
        add_action('wp_ajax_save_individual_calendar_event', array($this, 'save_individual_event'));
        add_action('wp_ajax_delete_calendar_event', array($this, 'delete_event'));
        add_action('wp_ajax_get_calendar_events', array($this, 'get_events'));
        
        // Trainer availability operations
        add_action('wp_ajax_save_trainer_availability', array($this, 'save_trainer_availability'));
        add_action('wp_ajax_get_trainer_availability', array($this, 'get_trainer_availability'));
        
        // Bulk operations
        add_action('wp_ajax_bulk_calendar_operations', array($this, 'handle_bulk_operations'));
        
        // Recurring events generation
        add_action('wp_ajax_generate_recurring_events', array($this, 'generate_recurring_events'));
        
        // Settings and utilities
        add_action('wp_ajax_reset_calendar_defaults', array($this, 'reset_defaults'));
        add_action('wp_ajax_test_calendar_frontend_data', array($this, 'test_frontend_data'));
    }
    
    /**
     * AJAX handler for saving individual calendar event
     * Following Personal Training pattern exactly
     */
    public function save_individual_event() {
        try {
            // Log that we reached the handler
            $this->log_debug('AJAX Save Event Handler Called', array(
                'action' => $_POST['action'] ?? 'not_set',
                'nonce_received' => isset($_POST['nonce']) ? 'yes' : 'no',
                'event_data_received' => isset($_POST['event_data']) ? 'yes' : 'no'
            ));
            
            // Security and permission checks (identical to Personal Training)
            $this->verify_request_security();
            
            // Validate required data
            if (!isset($_POST['event_data'])) {
                $this->send_error('Missing required data');
            }
            
            $event_data = $_POST['event_data'];
            
            // Handle both JSON string and array formats from frontend
            if (is_string($event_data)) {
                // If it's a JSON string, decode it
                $decoded_data = json_decode($event_data, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $event_data = $decoded_data;
                } else {
                    $this->send_error('Invalid JSON in event_data: ' . json_last_error_msg());
                }
            }
            // If it's already an array (from form-encoded data), use it as-is
            
            // Debug logging (identical to Personal Training)
            $this->log_debug('Individual Event Save Request', array(
                'event_data' => $event_data,
                'data_keys' => is_array($event_data) ? array_keys($event_data) : 'not_array'
            ));
            
            // Validate event data
            $validation_result = $this->validate_event_data($event_data);
            if ($validation_result !== true) {
                $this->send_validation_error($validation_result);
            }
            
            // Save event
            $result = $this->data_manager->save_event($event_data);
            
            $this->log_debug('Save Event Result', array(
                'result' => $result,
                'event_title' => $event_data['title'] ?? 'Unknown'
            ));
            
            if ($result) {
                $this->send_success('Event saved successfully!', array(
                    'event_title' => $event_data['title'] ?? 'Unknown',
                    'event_id' => $result,
                    'updated_at' => current_time('mysql'),
                    'booking_status' => $event_data['booking_status'] ?? 'available',
                    'operation' => 'create'
                ));
            } else {
                $this->send_error('Failed to save event');
            }
            
        } catch (Exception $e) {
            $this->log_error('Save Individual Event Error: ' . $e->getMessage());
            $this->send_error('Save failed: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for deleting calendar event
     */
    public function delete_event() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['event_id'])) {
                $this->send_error('Missing event ID');
            }
            
            $event_id = absint($_POST['event_id']);
            
            $result = $this->data_manager->delete_event($event_id);
            
            if ($result) {
                $this->send_success('Event deleted successfully!', array(
                    'deleted_event_id' => $event_id,
                    'deleted_at' => current_time('mysql')
                ));
            } else {
                $this->send_error('Failed to delete event');
            }
            
        } catch (Exception $e) {
            $this->log_error('Delete Event Error: ' . $e->getMessage());
            $this->send_error('Delete failed: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for getting calendar events (SIMPLIFIED)
     * Note: This method is now unused since modal uses direct page data
     * Kept for backward compatibility only
     */
    public function get_events() {
        try {
            $this->verify_request_security();
            
            // Simple implementation - just return all events
                $events = $this->data_manager->get_all_events();
            
            $this->send_success('Events retrieved successfully', array(
                'events' => $events,
                'count' => count($events)
            ));
            
        } catch (Exception $e) {
            $this->log_error('Get Events Error: ' . $e->getMessage());
            $this->send_error('Failed to retrieve events: ' . $e->getMessage());
        }
    }
    
    /**
     * Get sample events for Phase 1 testing
     * 
     * @return array Sample events data
     */
    private function get_sample_events() {
        return array(
            array(
                'id' => 1,
                'title' => 'Personal Training Session',
                'description' => 'One-on-one training with certified trainer',
                'start_datetime' => date('Y-m-d H:i:s', strtotime('+1 day 10:00')),
                'end_datetime' => date('Y-m-d H:i:s', strtotime('+1 day 11:00')),
                'trainer_id' => 1,
                'event_type' => 'session',
                'booking_status' => 'confirmed',
                'location' => 'Gym Floor A',
                'max_participants' => 1,
                'current_participants' => 1
            ),
            array(
                'id' => 2,
                'title' => 'Group Fitness Class',
                'description' => 'High-intensity interval training class',
                'start_datetime' => date('Y-m-d H:i:s', strtotime('+2 days 18:00')),
                'end_datetime' => date('Y-m-d H:i:s', strtotime('+2 days 19:00')),
                'trainer_id' => 2,
                'event_type' => 'group_class',
                'booking_status' => 'available',
                'location' => 'Studio B',
                'max_participants' => 15,
                'current_participants' => 8
            )
        );
    }
    
    /**
     * AJAX handler for saving trainer availability
     */
    public function save_trainer_availability() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['trainer_id'])) {
                $this->send_error('Missing trainer ID');
            }
            
            $trainer_id = absint($_POST['trainer_id']);
            $availability_data = $_POST; // Get all form data
            
            // Validate trainer ID
            if ($trainer_id <= 0) {
                $this->send_error('Invalid trainer ID');
            }
            
            // Save availability using data manager
            $result = $this->data_manager->save_trainer_availability($trainer_id, $availability_data);
            
            if ($result) {
            $this->send_success('Trainer availability saved successfully!', array(
                'trainer_id' => $trainer_id,
                'updated_at' => current_time('mysql')
            ));
            } else {
                $this->send_error('Failed to save trainer availability');
            }
            
        } catch (Exception $e) {
            $this->log_error('Save Availability Error: ' . $e->getMessage());
            $this->send_error('Save availability failed: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for getting trainer availability
     */
    public function get_trainer_availability() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['trainer_id'])) {
                $this->send_error('Missing trainer ID');
            }
            
            $trainer_id = absint($_POST['trainer_id']);
            $date = sanitize_text_field($_POST['date'] ?? '');
            
            $availability = $this->data_manager->get_trainer_availability($trainer_id, $date);
            
            // Debug logging
            $this->log_debug('Get Trainer Availability', array(
                'trainer_id' => $trainer_id,
                'date' => $date,
                'availability_count' => is_array($availability) ? count($availability) : 'NOT_ARRAY',
                'availability_type' => gettype($availability),
                'availability_data' => $availability
            ));
            
            // Ensure availability is always an array
            if (!is_array($availability)) {
                $availability = array();
            }
            
            $this->send_success('Availability retrieved successfully', array(
                'trainer_id' => $trainer_id,
                'availability' => $availability,
                'date' => $date,
                'debug_info' => array(
                    'availability_count' => count($availability),
                    'has_availability_table' => $this->check_availability_table_exists()
                )
            ));
            
        } catch (Exception $e) {
            $this->log_error('Get Availability Error: ' . $e->getMessage());
            $this->send_error('Failed to retrieve availability: ' . $e->getMessage());
        }
    }
    
    /**
     * Check if availability table exists
     */
    private function check_availability_table_exists() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'fitcopilot_calendar_availability';
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") === $table_name;
        return $table_exists;
    }
    
    /**
     * AJAX handler for bulk operations
     */
    public function handle_bulk_operations() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['bulk_action']) || !isset($_POST['selected_events'])) {
                $this->send_error('Missing bulk operation data');
            }
            
            $bulk_action = sanitize_text_field($_POST['bulk_action']);
            $selected_events = array_map('absint', $_POST['selected_events']);
            
            $result = false;
            
            switch ($bulk_action) {
                case 'delete':
                    $result = $this->data_manager->bulk_delete_events($selected_events);
                    break;
                    
                case 'confirm':
                    $result = $this->data_manager->bulk_update_status($selected_events, 'confirmed');
                    break;
                    
                case 'cancel':
                    $result = $this->data_manager->bulk_update_status($selected_events, 'cancelled');
                    break;
            }
            
            if ($result) {
                $this->send_success('Bulk operation completed successfully!', array(
                    'action' => $bulk_action,
                    'affected_events' => count($selected_events),
                    'processed_at' => current_time('mysql')
                ));
            } else {
                $this->send_error('Bulk operation failed');
            }
            
        } catch (Exception $e) {
            $this->log_error('Bulk Operation Error: ' . $e->getMessage());
            $this->send_error('Bulk operation failed: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for generating recurring events
     */
    public function generate_recurring_events() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['trainer_id']) || !isset($_POST['start_date']) || !isset($_POST['end_date'])) {
                $this->send_error('Missing required parameters');
            }
            
            $trainer_id = absint($_POST['trainer_id']);
            $start_date = sanitize_text_field($_POST['start_date']);
            $end_date = sanitize_text_field($_POST['end_date']);
            $event_type = sanitize_text_field($_POST['event_type'] ?? 'assessment');
            
            // Validate dates
            if (!strtotime($start_date) || !strtotime($end_date)) {
                $this->send_error('Invalid date format');
            }
            
            if (strtotime($start_date) >= strtotime($end_date)) {
                $this->send_error('End date must be after start date');
            }
            
            // Generate events
            $events_created = $this->data_manager->generate_recurring_events($trainer_id, $start_date, $end_date, $event_type);
            
            $this->send_success('Recurring events generated successfully!', array(
                'trainer_id' => $trainer_id,
                'events_created' => $events_created,
                'date_range' => array(
                    'start' => $start_date,
                    'end' => $end_date
                ),
                'event_type' => $event_type
            ));
            
        } catch (Exception $e) {
            $this->log_error('Generate Recurring Events Error: ' . $e->getMessage());
            $this->send_error('Failed to generate recurring events: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for resetting to defaults
     * Following Personal Training pattern exactly
     */
    public function reset_defaults() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            // Reset to defaults
            $result = $this->data_manager->reset_to_defaults();
            
            if ($result) {
                $stats = $this->data_manager->get_statistics();
                
                $this->send_success('Successfully reset calendar to defaults', array(
                    'total_events' => $stats['total_events'],
                    'confirmed_events' => $stats['confirmed_events'],
                    'reset_timestamp' => time()
                ));
            } else {
                $this->send_error('Failed to reset data');
            }
            
        } catch (Exception $e) {
            $this->log_error('Reset Defaults Error: ' . $e->getMessage());
            $this->send_error('Reset failed: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for testing frontend data
     */
    public function test_frontend_data() {
        try {
            $this->verify_request_security();
            
            $calendar_data = $this->data_manager->get_settings();
            $stats = $this->data_manager->get_statistics();
            
            $this->send_success('Frontend data test successful', array(
                'calendar_settings' => $calendar_data,
                'statistics' => $stats,
                'integration_status' => 'active',
                'test_timestamp' => current_time('mysql')
            ));
            
        } catch (Exception $e) {
            $this->log_error('Frontend Data Test Error: ' . $e->getMessage());
            $this->send_error('Frontend data test failed: ' . $e->getMessage());
        }
    }
    
    // ===== PRIVATE HELPER METHODS =====
    
    /**
     * Verify request security (identical to Personal Training)
     * PHASE 1: Enhanced security checking for different nonce parameter names
     */
    private function verify_request_security() {
        // PHASE 1: Check for nonce with multiple parameter names for compatibility
        $nonce_value = $_POST['nonce'] ?? $_POST['fitcopilot_training_calendar_nonce'] ?? $_REQUEST['_wpnonce'] ?? '';
        
        // Accept both nonce formats for compatibility between Manager and Provider
        $nonce_valid = wp_verify_nonce($nonce_value, 'fitcopilot_training_calendar_nonce') || 
                      wp_verify_nonce($nonce_value, 'training_calendar_nonce');
        
        if (!$nonce_valid) {
            $this->log_error('Nonce verification failed. Nonce value: ' . substr($nonce_value, 0, 10) . '...');
            throw new Exception('Security check failed');
        }
        
        // Check permissions
        if (!current_user_can('manage_options')) {
            $this->log_error('Permission check failed');
            throw new Exception('Insufficient permissions');
        }
    }
    
    /**
     * Validate event data
     */
    private function validate_event_data($event_data) {
        $errors = array();
        
        // Required fields
        if (empty($event_data['title'])) {
            $errors[] = 'Event title is required';
        }
        
        if (empty($event_data['start_datetime'])) {
            $errors[] = 'Start date and time is required';
        }
        
        if (empty($event_data['end_datetime'])) {
            $errors[] = 'End date and time is required';
        }
        
        // Date validation
        if (!empty($event_data['start_datetime']) && !empty($event_data['end_datetime'])) {
            $start_time = strtotime($event_data['start_datetime']);
            $end_time = strtotime($event_data['end_datetime']);
            
            if ($start_time === false) {
                $errors[] = 'Invalid start date/time format';
            }
            
            if ($end_time === false) {
                $errors[] = 'Invalid end date/time format';
            }
            
            if ($start_time && $end_time && $end_time <= $start_time) {
                $errors[] = 'End time must be after start time';
            }
            
            if ($start_time && $start_time < time()) {
                $errors[] = 'Event cannot be scheduled in the past';
            }
        }
        
        // Optional but validate if provided
        if (isset($event_data['max_participants']) && $event_data['max_participants'] < 1) {
            $errors[] = 'Maximum participants must be at least 1';
        }
        
        if (isset($event_data['trainer_id']) && !empty($event_data['trainer_id']) && !is_numeric($event_data['trainer_id'])) {
            $errors[] = 'Invalid trainer ID';
        }
        
        return empty($errors) ? true : $errors;
    }
    
    /**
     * Send success response (identical to Personal Training)
     */
    private function send_success($message, $data = array()) {
        wp_send_json_success(array(
            'message' => $message,
            'data' => $data,
            'timestamp' => current_time('mysql')
        ));
    }
    
    /**
     * Send error response (identical to Personal Training)
     */
    private function send_error($message) {
        wp_send_json_error(array(
            'message' => $message,
            'timestamp' => current_time('mysql')
        ));
    }
    
    /**
     * Send validation error response
     */
    private function send_validation_error($errors) {
        wp_send_json_error(array(
            'message' => 'Validation failed',
            'errors' => $errors,
            'timestamp' => current_time('mysql')
        ));
    }
    
    /**
     * Log debug information (identical to Personal Training)
     */
    private function log_debug($message, $data = array()) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('Training Calendar Debug: ' . $message . ' - ' . print_r($data, true));
        }
    }
    
    /**
     * Log error information (identical to Personal Training)
     */
    private function log_error($message) {
        error_log('Training Calendar Error: ' . $message);
    }
    
    // REMOVED: format_events_for_frontend() - No longer needed since modal uses direct page data
    // REMOVED: get_trainer_name() - Duplicated functionality, handled in renderer
    
    // REMOVED: All Phase 3 over-engineered features (600+ lines)
    // - Recurring events system
    // - Drag & drop operations  
    // - Real-time updates
    // - Mobile booking
    // - Complex validation layers
    // These features were over-engineered and not needed for basic modal functionality
} 