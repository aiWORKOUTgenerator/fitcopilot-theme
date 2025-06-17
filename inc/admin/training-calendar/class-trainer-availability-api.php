<?php
/**
 * Trainer Availability API Handler
 * 
 * Handles REST API endpoints for trainer availability and smart scheduling
 * Integrates with the existing Training Calendar system
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Trainer Availability API Class
 */
class FitCopilot_Trainer_Availability_API {
    
    /**
     * Initialize the API
     */
    public function init() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Get available time slots for a specific date
        register_rest_route('fitcopilot/v1', '/trainer-availability', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_trainer_availability'),
            'permission_callback' => array($this, 'check_permissions'),
            'args' => array(
                'date' => array(
                    'required' => true,
                    'type' => 'string',
                    'format' => 'date',
                    'description' => 'Target date in YYYY-MM-DD format'
                ),
                'event_type' => array(
                    'required' => true,
                    'type' => 'string',
                    'description' => 'Event type for scheduling'
                ),
                'duration' => array(
                    'required' => false,
                    'type' => 'integer',
                    'default' => 30,
                    'description' => 'Session duration in minutes'
                ),
                'trainer_id' => array(
                    'required' => false,
                    'type' => 'string',
                    'description' => 'Specific trainer ID (optional)'
                )
            )
        ));
        
        // Get trainer availability for date range
        register_rest_route('fitcopilot/v1', '/trainer-availability/range', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_availability_range'),
            'permission_callback' => array($this, 'check_permissions'),
            'args' => array(
                'start_date' => array(
                    'required' => true,
                    'type' => 'string',
                    'format' => 'date'
                ),
                'end_date' => array(
                    'required' => true,
                    'type' => 'string',
                    'format' => 'date'
                ),
                'event_type' => array(
                    'required' => true,
                    'type' => 'string'
                ),
                'duration' => array(
                    'required' => false,
                    'type' => 'integer',
                    'default' => 30
                )
            )
        ));
    }
    
    /**
     * Check API permissions
     */
    public function check_permissions($request) {
        // Enhanced debugging for authentication issues
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('=== TRAINER AVAILABILITY API AUTH DEBUG ===');
            error_log('Request method: ' . $request->get_method());
            error_log('Request URL: ' . $request->get_route());
            error_log('Request headers: ' . print_r($request->get_headers(), true));
            error_log('Current user ID: ' . get_current_user_id());
            error_log('Is user logged in: ' . (is_user_logged_in() ? 'yes' : 'no'));
            
            // Check nonce sources
            $wp_nonce_header = $request->get_header('X-WP-Nonce');
            $wp_nonce_param = $request->get_param('_wpnonce');
            $wp_nonce_get = $_GET['_wpnonce'] ?? null;
            $wp_nonce_post = $_POST['_wpnonce'] ?? null;
            
            error_log('X-WP-Nonce header: ' . ($wp_nonce_header ?: 'NOT SET'));
            error_log('_wpnonce param: ' . ($wp_nonce_param ?: 'NOT SET'));
            error_log('_wpnonce GET: ' . ($wp_nonce_get ?: 'NOT SET'));
            error_log('_wpnonce POST: ' . ($wp_nonce_post ?: 'NOT SET'));
            
            // Test nonce validation
            if ($wp_nonce_header) {
                $wp_rest_valid = wp_verify_nonce($wp_nonce_header, 'wp_rest');
                $training_calendar_valid = wp_verify_nonce($wp_nonce_header, 'training_calendar_nonce');
                error_log('wp_rest nonce validation: ' . ($wp_rest_valid ? 'VALID' : 'INVALID'));
                error_log('training_calendar nonce validation: ' . ($training_calendar_valid ? 'VALID' : 'INVALID'));
            }
            
            error_log('WordPress REST API status: ' . (rest_url() ? 'ENABLED' : 'DISABLED'));
            error_log('Current user capabilities: ' . print_r(wp_get_current_user()->allcaps ?? [], true));
            error_log('=== END AUTH DEBUG ===');
        }
        
        // Multiple authentication strategies
        
        // Strategy 1: Check if user is logged in (for admin/authenticated users)
        if (is_user_logged_in()) {
            return true;
        }
        
        // Strategy 2: Verify REST nonce (standard WordPress REST API auth)
        $nonce = $request->get_header('X-WP-Nonce');
        if ($nonce && wp_verify_nonce($nonce, 'wp_rest')) {
            return true;
        }
        
        // Strategy 3: Verify training calendar specific nonce
        if ($nonce && wp_verify_nonce($nonce, 'training_calendar_nonce')) {
            return true;
        }
        
        // Strategy 4: Check for nonce in URL parameters (fallback)
        $param_nonce = $request->get_param('_wpnonce');
        if ($param_nonce && wp_verify_nonce($param_nonce, 'wp_rest')) {
            return true;
        }
        
        // Strategy 5: Allow public access for trainer availability (calendar is public)
        // This is reasonable since trainer availability viewing should be public
        $route = $request->get_route();
        if (strpos($route, '/trainer-availability') !== false) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Allowing public access to trainer availability endpoint');
            }
            return true;
        }
        
        // If all strategies fail, log the issue and return false
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('TRAINER AVAILABILITY API: All authentication strategies failed');
        }
        
        return false;
    }
    
    /**
     * Get trainer availability for specific date
     */
    public function get_trainer_availability($request) {
        $start_time = microtime(true);
        
        try {
            $date = sanitize_text_field($request->get_param('date'));
            $event_type = sanitize_text_field($request->get_param('event_type'));
            $duration = intval($request->get_param('duration'));
            $trainer_id = sanitize_text_field($request->get_param('trainer_id'));
            
            // Validate date format
            $target_date = DateTime::createFromFormat('Y-m-d', $date);
            if (!$target_date) {
                return new WP_Error('invalid_date', 'Invalid date format. Use YYYY-MM-DD.', array('status' => 400));
            }
            
            // Check if date is not in the past
            $today = new DateTime();
            $today->setTime(0, 0, 0);
            if ($target_date < $today) {
                return new WP_Error('past_date', 'Cannot schedule appointments in the past.', array('status' => 400));
            }
            
            // Get available time slots
            $available_slots = $this->calculate_available_slots($target_date, $event_type, $duration, $trainer_id);
            
            // Get recommended slot
            $recommended_slot = $this->find_recommended_slot($available_slots, $event_type);
            
            $end_time = microtime(true);
            $performance_ms = round(($end_time - $start_time) * 1000, 2);
            
            return rest_ensure_response(array(
                'success' => true,
                'available_slots' => $available_slots,
                'recommended_slot' => $recommended_slot,
                'metadata' => array(
                    'date' => $date,
                    'event_type' => $event_type,
                    'duration' => $duration,
                    'total_slots_checked' => count($available_slots),
                    'performance_ms' => $performance_ms,
                    'search_criteria' => array(
                        'event_type' => $event_type,
                        'duration' => $duration,
                        'date_range' => array(
                            'start' => $date,
                            'end' => $date
                        )
                    )
                )
            ));
            
        } catch (Exception $e) {
            error_log('Trainer Availability API Error: ' . $e->getMessage());
            
            return new WP_Error(
                'availability_error',
                'Failed to retrieve trainer availability: ' . $e->getMessage(),
                array('status' => 500)
            );
        }
    }
    
    /**
     * Calculate available time slots for a specific date
     */
    private function calculate_available_slots($target_date, $event_type, $duration, $trainer_id = null) {
        $available_slots = array();
        
        // Map frontend event types to backend event types
        $mapped_event_type = $this->map_frontend_event_type($event_type);
        
        // Get existing calendar events for this date and event type
        $existing_events = $this->get_existing_calendar_events($target_date, $mapped_event_type);
        
        // If we found existing events that match, return them as available slots
        if (!empty($existing_events)) {
            foreach ($existing_events as $event) {
                // Only include events that are marked as available
                if ($this->is_event_available_for_booking($event)) {
                    $available_slots[] = array(
                        'start_time' => $event['start'],
                        'end_time' => $event['end'], 
                        'trainer_id' => $event['trainer_id'],
                        'trainer_name' => $this->get_trainer_name_by_id($event['trainer_id']),
                        'status' => $this->map_booking_status_to_availability($event['booking_status']),
                        'spots_remaining' => max(0, ($event['max_participants'] ?? 1) - ($event['current_participants'] ?? 0)),
                        'price' => $event['price'] ?? 0,
                        'event_id' => $event['id'],
                        'location' => $event['location'] ?? '',
                        'description' => $event['description'] ?? ''
                    );
                }
            }
        }
        
        // If no existing events found, generate potential slots based on trainer availability
        if (empty($available_slots)) {
            $available_slots = $this->generate_potential_slots($target_date, $mapped_event_type, $duration, $trainer_id);
        }
        
        // Sort slots by time
        usort($available_slots, function($a, $b) {
            return strtotime($a['start_time']) - strtotime($b['start_time']);
        });
        
        return $available_slots;
    }
    
    /**
     * Generate time slots for a specific day
     */
    private function generate_day_slots($target_date, $business_config, $duration) {
        $slots = array();
        
        $start_hour = $business_config['start_hour'];
        $end_hour = $business_config['end_hour'];
        $buffer_time = $business_config['buffer_time'];
        
        // Create datetime objects for the target date
        $current_slot = clone $target_date;
        $current_slot->setTime($start_hour, 0, 0);
        
        $end_of_day = clone $target_date;
        $end_of_day->setTime($end_hour, 0, 0);
        
        while ($current_slot < $end_of_day) {
            $slot_end = clone $current_slot;
            $slot_end->add(new DateInterval('PT' . $duration . 'M'));
            
            // Don't schedule past business hours
            if ($slot_end <= $end_of_day) {
                $slots[] = array(
                    'start_time' => clone $current_slot,
                    'end_time' => $slot_end
                );
            }
            
            // Move to next slot (duration + buffer time)
            $current_slot->add(new DateInterval('PT' . ($duration + $buffer_time) . 'M'));
        }
        
        return $slots;
    }
    
    /**
     * Check if a time slot is available for a trainer
     */
    private function is_slot_available($slot, $trainer, $target_date) {
        // Check if trainer works on this day
        $day_of_week = $target_date->format('w'); // 0 = Sunday, 6 = Saturday
        if (!$this->trainer_works_on_day($trainer, $day_of_week)) {
            return false;
        }
        
        // Check for existing bookings
        if ($this->has_conflicting_booking($slot, $trainer['id'])) {
            return false;
        }
        
        // Check trainer's specific availability rules
        if (!$this->meets_trainer_availability_rules($slot, $trainer)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Get business configuration for event type
     */
    private function get_business_config($event_type) {
        $default_config = array(
            'start_hour' => 6,  // 6 AM
            'end_hour' => 21,   // 9 PM
            'buffer_time' => 15, // 15 minutes between appointments
            'allowed_days' => array(1, 2, 3, 4, 5, 6) // Monday to Saturday
        );
        
        switch ($event_type) {
            case 'Free Consultation (20 Min)':
                return array_merge($default_config, array(
                    'start_hour' => 9,
                    'end_hour' => 17,
                    'buffer_time' => 10,
                    'allowed_days' => array(1, 2, 3, 4, 5) // Weekdays only
                ));
                
            case 'Online Group Fitness Class (45 Min)':
                return array_merge($default_config, array(
                    'start_hour' => 6,
                    'end_hour' => 20,
                    'buffer_time' => 15
                ));
                
            case 'Personal Training Session':
                return $default_config;
                
            default:
                return $default_config;
        }
    }
    
    /**
     * Get available trainers for event type
     */
    private function get_available_trainers($event_type) {
        // Get trainers from Personal Training data
        $personal_training_data = get_option('fitcopilot_personal_training_data', array());
        $trainers = isset($personal_training_data['trainers']) ? $personal_training_data['trainers'] : array();
        
        $available_trainers = array();
        
        foreach ($trainers as $trainer) {
            if (isset($trainer['active']) && $trainer['active'] && $this->trainer_supports_event_type($trainer, $event_type)) {
                $available_trainers[] = array(
                    'id' => $trainer['id'] ?? uniqid(),
                    'name' => $trainer['name'] ?? 'Unknown Trainer',
                    'specialty' => $trainer['specialty'] ?? '',
                    'availability' => $trainer['availability'] ?? array()
                );
            }
        }
        
        // Fallback: ensure at least one trainer is available
        if (empty($available_trainers)) {
            $available_trainers[] = array(
                'id' => 'default_trainer',
                'name' => 'Available Trainer',
                'specialty' => 'General Fitness',
                'availability' => array()
            );
        }
        
        return $available_trainers;
    }
    
    /**
     * Check if trainer supports the event type
     */
    private function trainer_supports_event_type($trainer, $event_type) {
        $specialty = strtolower($trainer['specialty'] ?? '');
        
        switch ($event_type) {
            case 'Free Consultation (20 Min)':
                return true; // All trainers can do consultations
                
            case 'Online Group Fitness Class (45 Min)':
                return strpos($specialty, 'group') !== false || 
                       strpos($specialty, 'fitness') !== false ||
                       strpos($specialty, 'cardio') !== false;
                
            case 'Personal Training Session':
                return strpos($specialty, 'personal') !== false || 
                       strpos($specialty, 'training') !== false ||
                       strpos($specialty, 'strength') !== false;
                
            default:
                return true;
        }
    }
    
    /**
     * Check for conflicting bookings
     */
    private function has_conflicting_booking($slot, $trainer_id) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'fitcopilot_calendar_events';
        
        // Check if table exists
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
            return false; // No conflicts if no events table
        }
        
        $start_time = $slot['start_time']->format('Y-m-d H:i:s');
        $end_time = $slot['end_time']->format('Y-m-d H:i:s');
        
        $conflicts = $wpdb->get_var($wpdb->prepare("
            SELECT COUNT(*) 
            FROM $table_name 
            WHERE trainer_id = %s 
            AND status != 'cancelled'
            AND (
                (start_datetime <= %s AND end_datetime > %s) OR
                (start_datetime < %s AND end_datetime >= %s) OR
                (start_datetime >= %s AND end_datetime <= %s)
            )
        ", $trainer_id, $start_time, $start_time, $end_time, $end_time, $start_time, $end_time));
        
        return $conflicts > 0;
    }
    
    /**
     * Check trainer's availability rules
     */
    private function meets_trainer_availability_rules($slot, $trainer) {
        // For now, assume all slots meet trainer rules
        // This would integrate with the trainer availability system from the admin interface
        return true;
    }
    
    /**
     * Check if trainer works on specific day
     */
    private function trainer_works_on_day($trainer, $day_of_week) {
        // Check trainer's availability rules
        $availability = $trainer['availability'] ?? array();
        
        if (empty($availability)) {
            // Default: work Monday to Friday
            return in_array($day_of_week, array(1, 2, 3, 4, 5));
        }
        
        // Check specific availability rules (would be defined in trainer availability system)
        return true; // For now, assume trainers work all configured days
    }
    
    /**
     * Get slot status (available, limited, waitlist)
     */
    private function get_slot_status($slot, $trainer) {
        // Simulate some business logic for slot status
        $hour = $slot['start_time']->format('H');
        
        // Peak hours (9-11 AM, 5-7 PM) might be limited
        if (($hour >= 9 && $hour <= 11) || ($hour >= 17 && $hour <= 19)) {
            return rand(0, 10) > 7 ? 'limited' : 'available';
        }
        
        return 'available';
    }
    
    /**
     * Get remaining spots for group events
     */
    private function get_spots_remaining($slot, $event_type) {
        if (strpos($event_type, 'Group') !== false) {
            // Group classes have limited spots
            return rand(1, 15); // Random for demo, would be calculated from bookings
        }
        
        return null; // Individual sessions don't have spot limits
    }
    
    /**
     * Get pricing for slot
     */
    private function get_slot_price($event_type, $duration, $trainer) {
        switch ($event_type) {
            case 'Free Consultation (20 Min)':
                return 0;
                
            case 'Online Group Fitness Class (45 Min)':
                return 25;
                
            case 'Personal Training Session':
                // Price based on duration
                $base_rate = 80; // Base rate per hour
                return round(($duration / 60) * $base_rate);
                
            default:
                return 0;
        }
    }
    
    /**
     * Find recommended slot from available slots
     */
    private function find_recommended_slot($available_slots, $event_type) {
        if (empty($available_slots)) {
            return null;
        }
        
        // For consultations, recommend morning slots
        if ($event_type === 'Free Consultation (20 Min)') {
            foreach ($available_slots as $slot) {
                $hour = date('H', strtotime($slot['start_time']));
                if ($hour >= 9 && $hour <= 12) {
                    return $slot;
                }
            }
        }
        
        // Default: return first available slot
        return $available_slots[0];
    }
    
    /**
     * Get trainer by ID
     */
    private function get_trainer_by_id($trainer_id) {
        $trainers = $this->get_available_trainers('');
        
        foreach ($trainers as $trainer) {
            if ($trainer['id'] === $trainer_id) {
                return $trainer;
            }
        }
        
        return null;
    }
    
    /**
     * Get availability for date range (future implementation)
     */
    public function get_availability_range($request) {
        // Future implementation for multi-day availability
        return rest_ensure_response(array(
            'success' => false,
            'message' => 'Range availability not yet implemented',
            'available_slots' => array()
        ));
    }
    
    /**
     * Map frontend event types to backend event types
     */
    private function map_frontend_event_type($frontend_event_type) {
        $mapping = array(
            'Free Consultation (20 Min)' => 'Fitness Assessment',
            'Online Group Fitness Class (45 Min)' => 'Group Fitness Class',
            'Personal Training Session' => 'Personal Training Session'
        );
        
        return $mapping[$frontend_event_type] ?? $frontend_event_type;
    }
    
    /**
     * Get existing calendar events for a specific date and event type
     */
    private function get_existing_calendar_events($target_date, $event_type) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'fitcopilot_training_calendar';
        $date_string = $target_date->format('Y-m-d');
        
        $query = $wpdb->prepare("
            SELECT * FROM {$table_name} 
            WHERE DATE(start) = %s 
            AND (title = %s OR event_type LIKE %s OR description LIKE %s)
            AND booking_status IN ('available', 'pending')
            ORDER BY start ASC
        ", $date_string, $event_type, '%' . $event_type . '%', '%' . $event_type . '%');
        
        $results = $wpdb->get_results($query, ARRAY_A);
        
        if ($wpdb->last_error) {
            error_log('Calendar Events Query Error: ' . $wpdb->last_error);
            return array();
        }
        
        return $results ?: array();
    }
    
    /**
     * Check if an event is available for booking
     */
    private function is_event_available_for_booking($event) {
        // Check booking status
        if (!in_array($event['booking_status'] ?? '', array('available', 'pending'))) {
            return false;
        }
        
        // Check if event is in the future
        $event_time = strtotime($event['start']);
        if ($event_time <= time()) {
            return false;
        }
        
        // Check if there are available spots
        $max_participants = intval($event['max_participants'] ?? 1);
        $current_participants = intval($event['current_participants'] ?? 0);
        
        return $current_participants < $max_participants;
    }
    
    /**
     * Map booking status to availability status
     */
    private function map_booking_status_to_availability($booking_status) {
        $mapping = array(
            'available' => 'available',
            'pending' => 'available',
            'confirmed' => 'limited',
            'cancelled' => 'waitlist',
            'completed' => 'waitlist'
        );
        
        return $mapping[$booking_status] ?? 'waitlist';
    }
    
    /**
     * Get trainer name by ID
     */
    private function get_trainer_name_by_id($trainer_id) {
        // Get trainer data from Personal Training module
        $personal_training_data = get_option('fitcopilot_personal_training_data', array());
        
        foreach ($personal_training_data as $trainer) {
            if (($trainer['id'] ?? 0) == $trainer_id) {
                return $trainer['name'] ?? 'Unknown Trainer';
            }
        }
        
        return 'Available Trainer';
    }
    
    /**
     * Generate potential slots when no existing events are found
     */
    private function generate_potential_slots($target_date, $event_type, $duration, $trainer_id = null) {
        $available_slots = array();
        
        // Get business hours configuration based on event type
        $business_config = $this->get_business_config($event_type);
        
        // Get all trainers or specific trainer
        $trainers = $trainer_id ? array($this->get_trainer_by_id($trainer_id)) : $this->get_available_trainers($event_type);
        
        // Generate time slots for the day
        $base_slots = $this->generate_day_slots($target_date, $business_config, $duration);
        
        // Check each slot against trainer availability and existing bookings
        foreach ($base_slots as $slot) {
            foreach ($trainers as $trainer) {
                if ($this->is_slot_available($slot, $trainer, $target_date)) {
                    $available_slots[] = array(
                        'start_time' => $slot['start_time']->format('c'), // ISO 8601 format
                        'end_time' => $slot['end_time']->format('c'),
                        'trainer_id' => $trainer['id'],
                        'trainer_name' => $trainer['name'],
                        'status' => $this->get_slot_status($slot, $trainer),
                        'spots_remaining' => $this->get_spots_remaining($slot, $event_type),
                        'price' => $this->get_slot_price($event_type, $duration, $trainer)
                    );
                }
            }
        }
        
        return $available_slots;
    }
}

// Note: Initialization moved to functions.php for proper WordPress integration 