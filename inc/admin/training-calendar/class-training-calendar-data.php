<?php
/**
 * FitCopilot Training Calendar Data Manager
 * 
 * Handles all database operations for Training Calendar
 * Follows the Personal Training data management pattern with calendar-specific enhancements
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Calendar Data Manager Class
 * 
 * Follows Personal Training data management patterns for consistency
 * Implements comprehensive calendar events and trainer availability management
 */
class FitCopilot_Training_Calendar_Data {
    
    /**
     * Database table names
     */
    private $events_table;
    private $availability_table;
    
    /**
     * WordPress option names for settings storage
     */
    const SETTINGS_OPTION = 'fitcopilot_training_calendar_settings';
    const LAST_UPDATED_OPTION = 'fitcopilot_training_calendar_last_updated';
    
    /**
     * Constructor
     */
    public function __construct() {
        global $wpdb;
        
        // Initialize table names (use unique names to avoid conflicts)
        $this->events_table = $wpdb->prefix . 'fitcopilot_calendar_events';
        $this->availability_table = $wpdb->prefix . 'fitcopilot_calendar_availability';
    }
    
    /**
     * Create database tables
     * 
     * @return bool Success status
     */
    public function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Skip if tables already exist
        if ($this->tables_exist()) {
            return true;
        }
        
        // Calendar Events Table
        $events_table_sql = "CREATE TABLE {$this->events_table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            title varchar(255) NOT NULL,
            description text,
            start_datetime datetime NOT NULL,
            end_datetime datetime NOT NULL,
            trainer_id bigint(20) unsigned,
            event_type enum('session','availability','blocked','group_class','workshop','assessment') DEFAULT 'session',
            booking_status enum('available','pending','confirmed','cancelled','completed') DEFAULT 'available',
            
            -- User Association (Phase 3)
            user_id bigint(20) unsigned,
            created_by bigint(20) unsigned,
            
            -- Client information (legacy support)
            client_name varchar(255),
            client_email varchar(255),
            client_phone varchar(20),
            client_notes text,
            
            -- Event configuration
            max_participants int DEFAULT 1,
            current_participants int DEFAULT 0,
            location varchar(255),
            session_type enum('individual','group','assessment') DEFAULT 'individual',
            duration_minutes int DEFAULT 60,
            
            -- Recurring events
            recurring_rule json,
            parent_event_id bigint(20) unsigned,
            
            -- Integration with other features
            feature_source varchar(50),
            source_id bigint(20) unsigned,
            
            -- Styling
            background_color varchar(7),
            border_color varchar(7),
            text_color varchar(7),
            
            -- Timestamps
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            PRIMARY KEY (id),
            KEY trainer_id (trainer_id),
            KEY user_id (user_id),
            KEY created_by (created_by),
            KEY start_datetime (start_datetime),
            KEY event_type (event_type),
            KEY booking_status (booking_status),
            KEY feature_source (feature_source),
            KEY parent_event_id (parent_event_id)
        ) $charset_collate;";
        
        // Trainer Availability Table
        $availability_table_sql = "CREATE TABLE {$this->availability_table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            trainer_id bigint(20) unsigned NOT NULL,
            
            -- Time configuration
            day_of_week tinyint(1) NOT NULL,
            start_time time NOT NULL,
            end_time time NOT NULL,
            
            -- Availability rules
            is_active boolean DEFAULT true,
            effective_date date,
            expiry_date date,
            timezone varchar(50) DEFAULT 'America/New_York',
            
            -- Exceptions and overrides
            exception_dates json,
            override_events json,
            
            -- Booking configuration
            min_booking_notice_hours int DEFAULT 24,
            max_booking_advance_days int DEFAULT 30,
            buffer_minutes_before int DEFAULT 15,
            buffer_minutes_after int DEFAULT 15,
            
            -- Metadata
            notes text,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            PRIMARY KEY (id),
            KEY trainer_id (trainer_id),
            KEY day_of_week (day_of_week),
            KEY effective_date (effective_date),
            KEY is_active (is_active)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        
        $result1 = dbDelta($events_table_sql);
        $result2 = dbDelta($availability_table_sql);
        
        // Check if tables were created successfully
        $events_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->events_table}'") === $this->events_table;
        $availability_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->availability_table}'") === $this->availability_table;
        
        if ($events_exists && $availability_exists) {
            // Initialize with default data if tables are newly created
            $this->initialize_default_data();
            update_option(self::LAST_UPDATED_OPTION, time());
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if tables exist
     * 
     * @return bool Tables existence status
     */
    private function tables_exist() {
        global $wpdb;
        
        $events_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->events_table}'") === $this->events_table;
        $availability_exists = $wpdb->get_var("SHOW TABLES LIKE '{$this->availability_table}'") === $this->availability_table;
        
        return $events_exists && $availability_exists;
    }
    
    /**
     * Get calendar settings
     * 
     * @return array Settings data
     */
    public function get_settings() {
        return get_option(self::SETTINGS_OPTION, $this->get_default_settings());
    }
    
    /**
     * Get default settings
     * 
     * @return array Default settings
     */
    public function get_default_settings() {
        return array(
            'default_view' => 'dayGridMonth',
            'first_day' => 0, // Sunday
            'time_format' => 'h:mm a',
            'date_format' => 'MMM d, yyyy',
            'slot_duration' => '00:30:00',
            'business_hours' => array(
                'start' => '09:00',
                'end' => '17:00'
            ),
            'weekend_enabled' => false,
            'booking_advance_days' => 30,
            'booking_notice_hours' => 24,
            'auto_confirm_bookings' => false,
            'email_notifications' => true,
            'calendar_colors' => array(
                'session' => '#4CAF50',
                'availability' => '#2196F3',
                'blocked' => '#F44336',
                'group_class' => '#FF9800',
                'workshop' => '#9C27B0',
                'assessment' => '#00BCD4'
            )
        );
    }
    
    /**
     * Initialize default calendar data
     */
    private function initialize_default_data() {
        // Initialize default settings
        $default_settings = $this->get_default_settings();
        update_option(self::SETTINGS_OPTION, $default_settings);
        
        // Add sample events for demonstration
        $this->create_sample_events();
    }
    
    /**
     * Create sample events for demonstration
     */
    private function create_sample_events() {
        global $wpdb;
        
        // Check if sample events already exist
        $existing_events = $wpdb->get_var("SELECT COUNT(*) FROM {$this->events_table}");
        if ($existing_events > 0) {
            return; // Don't create duplicates
        }
        
        $sample_events = array(
            array(
                'title' => 'Personal Training Session',
                'description' => 'One-on-one strength training session',
                'start_datetime' => date('Y-m-d H:i:s', strtotime('+1 day 10:00')),
                'end_datetime' => date('Y-m-d H:i:s', strtotime('+1 day 11:00')),
                'trainer_id' => 1,
                'event_type' => 'session',
                'booking_status' => 'confirmed',
                'location' => 'Gym Floor A',
                'max_participants' => 1,
                'current_participants' => 1,
                'background_color' => '#10b981',
                'border_color' => '#059669',
                'text_color' => '#ffffff'
            ),
            array(
                'title' => 'Group HIIT Class',
                'description' => 'High-intensity interval training for all levels',
                'start_datetime' => date('Y-m-d H:i:s', strtotime('+2 days 18:00')),
                'end_datetime' => date('Y-m-d H:i:s', strtotime('+2 days 19:00')),
                'trainer_id' => 2,
                'event_type' => 'group_class',
                'booking_status' => 'available',
                'location' => 'Studio B',
                'max_participants' => 15,
                'current_participants' => 8,
                'background_color' => '#f59e0b',
                'border_color' => '#d97706',
                'text_color' => '#ffffff'
            ),
            array(
                'title' => 'Fitness Assessment',
                'description' => 'Comprehensive fitness evaluation and goal setting',
                'start_datetime' => date('Y-m-d H:i:s', strtotime('+3 days 14:00')),
                'end_datetime' => date('Y-m-d H:i:s', strtotime('+3 days 15:30')),
                'trainer_id' => 1,
                'event_type' => 'assessment',
                'booking_status' => 'pending',
                'location' => 'Assessment Room',
                'max_participants' => 1,
                'current_participants' => 0,
                'background_color' => '#06b6d4',
                'border_color' => '#0891b2',
                'text_color' => '#ffffff'
            ),
            array(
                'title' => 'Nutrition Workshop',
                'description' => 'Learn about healthy eating habits and meal planning',
                'start_datetime' => date('Y-m-d H:i:s', strtotime('+7 days 16:00')),
                'end_datetime' => date('Y-m-d H:i:s', strtotime('+7 days 18:00')),
                'trainer_id' => 3,
                'event_type' => 'workshop',
                'booking_status' => 'available',
                'location' => 'Conference Room',
                'max_participants' => 20,
                'current_participants' => 5,
                'background_color' => '#8b5cf6',
                'border_color' => '#7c3aed',
                'text_color' => '#ffffff'
            )
        );
        
        foreach ($sample_events as $event) {
            $this->save_single_event($event);
        }
    }
    
    /**
     * Get feature statistics
     * 
     * @return array Statistics
     */
    public function get_statistics() {
        global $wpdb;
        
        $total_events = $wpdb->get_var("SELECT COUNT(*) FROM {$this->events_table}");
        $confirmed_events = $wpdb->get_var("SELECT COUNT(*) FROM {$this->events_table} WHERE booking_status = 'confirmed'");
        
        return array(
            'total_events' => $total_events ?: 0,
            'confirmed_events' => $confirmed_events ?: 0,
            'last_updated' => get_option(self::LAST_UPDATED_OPTION, 'never')
        );
    }
    
    /**
     * Get events count
     * 
     * @return int Events count
     */
    public function get_events_count() {
        global $wpdb;
        
        return $wpdb->get_var("SELECT COUNT(*) FROM {$this->events_table}") ?: 0;
    }
    
    /**
     * Save calendar settings
     * 
     * @param array $settings Settings data
     * @return bool Success status
     */
    public function save_settings($settings) {
        $result = update_option(self::SETTINGS_OPTION, $settings);
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
        }
        
        return $result;
    }
    
    /**
     * Reset to defaults
     * 
     * @return bool Success status
     */
    public function reset_to_defaults() {
        $default_settings = $this->get_default_settings();
        $result = update_option(self::SETTINGS_OPTION, $default_settings);
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
        }
        
        return $result;
    }
    
    /**
     * Bulk delete events
     * 
     * @param array $event_ids Event IDs
     * @return bool Success status
     */
    public function bulk_delete_events($event_ids) {
        global $wpdb;
        
        if (empty($event_ids)) {
            return false;
        }
        
        $placeholders = implode(',', array_fill(0, count($event_ids), '%d'));
        $sql = "DELETE FROM {$this->events_table} WHERE id IN ($placeholders)";
        
        $result = $wpdb->query($wpdb->prepare($sql, $event_ids));
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
            return true;
        }
        
        return false;
    }
    
    /**
     * Bulk update event status
     * 
     * @param array $event_ids Event IDs
     * @param string $status New status
     * @return bool Success status
     */
    public function bulk_update_status($event_ids, $status) {
        global $wpdb;
        
        if (empty($event_ids)) {
            return false;
        }
        
        $placeholders = implode(',', array_fill(0, count($event_ids), '%d'));
        $sql = "UPDATE {$this->events_table} SET booking_status = %s WHERE id IN ($placeholders)";
        
        $params = array_merge(array($status), $event_ids);
        $result = $wpdb->query($wpdb->prepare($sql, $params));
        
        if ($result !== false) {
            update_option(self::LAST_UPDATED_OPTION, time());
            return true;
        }
        
        return false;
    }
    
    /**
     * Import events from file
     * 
     * @param array $file_data File upload data
     * @return array Result with success status and details
     */
    public function import_events($file_data) {
        // Basic implementation - can be enhanced later
        return array(
            'success' => false,
            'error' => 'Import functionality not yet implemented',
            'imported_count' => 0
        );
    }
    
    // ===== REMOVED: COMPLEX RECURRING EVENTS SYSTEM =====
    // Removed 500+ lines of over-engineered recurring events functionality:
    // - create_recurring_event()
    // - update_recurring_series() 
    // - delete_recurring_series()
    // - validate_recurrence_pattern()
    // - generate_recurring_instances()
    // - advance_date_by_pattern()
    // - advance_to_next_weekday()
    // This complex system was not needed for basic calendar functionality
    
    // ===== PHASE 1: AJAX ENDPOINT SUPPORT METHODS =====
    
    /**
     * Save event (simplified for basic functionality)
     * 
     * @param array $event_data Event data
     * @return int|false Event ID or false on failure
     */
    public function save_event($event_data) {
        global $wpdb;
        
        // Sanitize and prepare data
        $sanitized_data = array(
            'title' => sanitize_text_field($event_data['title']),
            'description' => sanitize_textarea_field($event_data['description'] ?? ''),
            'start_datetime' => $event_data['start_datetime'],
            'end_datetime' => $event_data['end_datetime'],
            'trainer_id' => absint($event_data['trainer_id'] ?? 0),
            'event_type' => sanitize_text_field($event_data['event_type'] ?? 'session'),
            'booking_status' => sanitize_text_field($event_data['booking_status'] ?? 'available'),
            'max_participants' => absint($event_data['max_participants'] ?? 1),
            'location' => sanitize_text_field($event_data['location'] ?? ''),
            'session_type' => sanitize_text_field($event_data['session_type'] ?? 'individual'),
            'duration_minutes' => absint($event_data['duration_minutes'] ?? 60),
            'background_color' => sanitize_hex_color($event_data['background_color'] ?? ''),
            'border_color' => sanitize_hex_color($event_data['border_color'] ?? ''),
            'text_color' => sanitize_hex_color($event_data['text_color'] ?? ''),
            
            // Phase 3: User Association Fields
            'user_id' => absint($event_data['userId'] ?? $event_data['user_id'] ?? 0),
            'created_by' => absint($event_data['createdBy'] ?? $event_data['created_by'] ?? get_current_user_id()),
            
            // Legacy client info (maintain backward compatibility)
            'client_name' => sanitize_text_field($event_data['client_name'] ?? ''),
            'client_email' => sanitize_email($event_data['client_email'] ?? ''),
            'client_phone' => sanitize_text_field($event_data['client_phone'] ?? ''),
            'client_notes' => sanitize_textarea_field($event_data['client_notes'] ?? '')
        );
        
        // Remove empty values to prevent database constraint issues
        $sanitized_data = array_filter($sanitized_data, function($value) {
            return !empty($value) || $value === 0;
        });
        
        $result = $wpdb->insert($this->events_table, $sanitized_data);
        
        if ($result) {
            // Log successful event creation with user context
            error_log(sprintf(
                'Training Calendar: Event created - ID: %d, Title: %s, User: %d, Created By: %d',
                $wpdb->insert_id,
                $sanitized_data['title'],
                $sanitized_data['user_id'] ?? 0,
                $sanitized_data['created_by'] ?? 0
            ));
        }
        
        return $result ? $wpdb->insert_id : false;
    }
    
    /**
     * Update event (simplified for basic functionality)
     * 
     * @param int $event_id Event ID
     * @param array $event_data Event data
     * @return bool Success status
     */
    public function update_event($event_id, $event_data) {
        global $wpdb;
        
        // Enhanced update implementation supporting all event fields
        $sanitized_data = array();
        
        // Basic fields
        if (isset($event_data['title'])) {
            $sanitized_data['title'] = sanitize_text_field($event_data['title']);
        }
        if (isset($event_data['description'])) {
            $sanitized_data['description'] = sanitize_textarea_field($event_data['description']);
        }
        
        // Date/time fields
        if (isset($event_data['start'])) {
            $sanitized_data['start_datetime'] = sanitize_text_field($event_data['start']);
        }
        if (isset($event_data['end'])) {
            $sanitized_data['end_datetime'] = sanitize_text_field($event_data['end']);
        }
        
        // Event configuration
        if (isset($event_data['trainerId']) || isset($event_data['trainer_id'])) {
            $sanitized_data['trainer_id'] = absint($event_data['trainerId'] ?? $event_data['trainer_id']);
        }
        if (isset($event_data['eventType']) || isset($event_data['event_type'])) {
            $sanitized_data['event_type'] = sanitize_text_field($event_data['eventType'] ?? $event_data['event_type']);
        }
        if (isset($event_data['bookingStatus']) || isset($event_data['booking_status'])) {
            $sanitized_data['booking_status'] = sanitize_text_field($event_data['bookingStatus'] ?? $event_data['booking_status'] ?? 'available');
        }
        if (isset($event_data['sessionType']) || isset($event_data['session_type'])) {
            $sanitized_data['session_type'] = sanitize_text_field($event_data['sessionType'] ?? $event_data['session_type']);
        }
        
        // Location and capacity
        if (isset($event_data['location'])) {
            $sanitized_data['location'] = sanitize_text_field($event_data['location']);
        }
        if (isset($event_data['maxParticipants']) || isset($event_data['max_participants'])) {
            $sanitized_data['max_participants'] = absint($event_data['maxParticipants'] ?? $event_data['max_participants']);
        }
        if (isset($event_data['currentParticipants']) || isset($event_data['current_participants'])) {
            $sanitized_data['current_participants'] = absint($event_data['currentParticipants'] ?? $event_data['current_participants']);
        }
        
        // Styling
        if (isset($event_data['backgroundColor']) || isset($event_data['background_color'])) {
            $sanitized_data['background_color'] = sanitize_hex_color($event_data['backgroundColor'] ?? $event_data['background_color']);
        }
        if (isset($event_data['borderColor']) || isset($event_data['border_color'])) {
            $sanitized_data['border_color'] = sanitize_hex_color($event_data['borderColor'] ?? $event_data['border_color']);
        }
        if (isset($event_data['textColor']) || isset($event_data['text_color'])) {
            $sanitized_data['text_color'] = sanitize_hex_color($event_data['textColor'] ?? $event_data['text_color']);
        }
        
        // Pricing
        if (isset($event_data['price'])) {
            $sanitized_data['price'] = floatval($event_data['price']);
        }
        if (isset($event_data['currency'])) {
            $sanitized_data['currency'] = sanitize_text_field($event_data['currency']);
        }
        
        // Virtual session data
        if (isset($event_data['zoomLink']) || isset($event_data['zoom_link'])) {
            $sanitized_data['zoom_link'] = esc_url_raw($event_data['zoomLink'] ?? $event_data['zoom_link']);
        }
        if (isset($event_data['specialInstructions']) || isset($event_data['special_instructions'])) {
            $sanitized_data['special_instructions'] = sanitize_textarea_field($event_data['specialInstructions'] ?? $event_data['special_instructions']);
        }
        
        // Recurring event fields
        if (isset($event_data['recurring'])) {
            $sanitized_data['recurring'] = $event_data['recurring'] ? 1 : 0;
        }
        if (isset($event_data['recurringRule']) || isset($event_data['recurring_rule'])) {
            $recurring_rule = $event_data['recurringRule'] ?? $event_data['recurring_rule'];
            $sanitized_data['recurring_rule'] = is_array($recurring_rule) ? json_encode($recurring_rule) : sanitize_text_field($recurring_rule);
        }
        
        // Metadata
        if (isset($event_data['tags'])) {
            $tags = is_array($event_data['tags']) ? implode(',', array_map('sanitize_text_field', $event_data['tags'])) : sanitize_text_field($event_data['tags']);
            $sanitized_data['tags'] = $tags;
        }
        if (isset($event_data['metadata'])) {
            $metadata = is_array($event_data['metadata']) ? json_encode($event_data['metadata']) : sanitize_text_field($event_data['metadata']);
            $sanitized_data['metadata'] = $metadata;
        }
        
        // Update timestamp
        $sanitized_data['updated'] = current_time('mysql');
        
        // Validation: ensure we have at least one field to update
        if (empty($sanitized_data)) {
            error_log('Training Calendar: No valid fields provided for event update');
            return false;
        }
        
        // Perform update
        $result = $wpdb->update(
            $this->events_table, 
            $sanitized_data, 
            array('id' => $event_id), 
            null, 
            array('%d')
        );
        
        if ($result !== false) {
            update_option(self::LAST_UPDATED_OPTION, time());
            return true;
        }
        
        return false;
    }
    
    /**
     * Delete event (public method for AJAX handlers)
     * 
     * @param int $event_id Event ID
     * @return bool Success status
     */
    public function delete_event($event_id) {
        global $wpdb;
        
                    $result = $wpdb->delete($this->events_table, array('id' => $event_id), array('%d'));
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
            return true;
        }
        
        return false;
    }
    
    /**
     * Get events by date range (simplified - just return all events)
     * Note: Complex filtering removed since modal uses direct page data
     * 
     * @param string $start_date Start date (unused)
     * @param string $end_date End date (unused)
     * @param array $filters Additional filters (unused)
     * @return array Array of events
     */
    public function get_events_by_date_range($start_date = '', $end_date = '', $filters = array()) {
        // Simplified: just return all events since modal uses direct page data
        return $this->get_all_events();
    }
    
    /**
     * Get trainer availability (public method for AJAX handlers)
     * 
     * @param int $trainer_id Trainer ID
     * @param string $date Date (Y-m-d format)
     * @return array Availability data
     */
    public function get_trainer_availability($trainer_id, $date = '') {
        global $wpdb;
        
        $where_conditions = array('trainer_id = %d', 'is_active = 1');
        $where_values = array($trainer_id);
        
        if (!empty($date)) {
            $where_conditions[] = '(effective_date IS NULL OR effective_date <= %s)';
            $where_conditions[] = '(expiry_date IS NULL OR expiry_date >= %s)';
            $where_values[] = $date;
            $where_values[] = $date;
        }
        
        $where_clause = implode(' AND ', $where_conditions);
        $sql = "SELECT * FROM {$this->availability_table} WHERE {$where_clause} ORDER BY day_of_week, start_time";
        
        $sql = $wpdb->prepare($sql, $where_values);
        $availability = $wpdb->get_results($sql, ARRAY_A);
        
        return $availability ?: array();
    }
    
    /**
     * Save trainer availability schedule
     * 
     * @param int $trainer_id Trainer ID
     * @param array $availability_data Availability schedule data
     * @return bool Success status
     */
    public function save_trainer_availability($trainer_id, $availability_data) {
        global $wpdb;
        
        // Start transaction
        $wpdb->query('START TRANSACTION');
        
        try {
            // First, deactivate existing availability for this trainer
            $wpdb->update(
                $this->availability_table,
                array('is_active' => 0),
                array('trainer_id' => $trainer_id),
                array('%d'),
                array('%d')
            );
            
            // Process each day's availability
            foreach ($availability_data['availability'] as $day_of_week => $day_data) {
                if (empty($day_data['enabled'])) {
                    continue; // Skip disabled days
                }
                
                // Process time slots for this day
                if (!empty($day_data['time_slots'])) {
                    foreach ($day_data['time_slots'] as $slot) {
                        $availability_record = array(
                            'trainer_id' => $trainer_id,
                            'day_of_week' => $day_of_week,
                            'start_time' => sanitize_text_field($slot['start_time']),
                            'end_time' => sanitize_text_field($slot['end_time']),
                            'break_start_time' => !empty($slot['break_start']) ? sanitize_text_field($slot['break_start']) : null,
                            'break_end_time' => !empty($slot['break_end']) ? sanitize_text_field($slot['break_end']) : null,
                            'session_duration' => absint($day_data['session_duration'] ?? 60),
                            'buffer_time' => absint($day_data['buffer_time'] ?? 15),
                            'max_sessions_per_day' => absint($day_data['max_sessions'] ?? 8),
                            'location' => sanitize_text_field($day_data['location'] ?? ''),
                            'availability_type' => sanitize_text_field($availability_data['availability_type'] ?? 'both'),
                            'effective_date' => !empty($availability_data['effective_date']) ? $availability_data['effective_date'] : null,
                            'expiry_date' => !empty($availability_data['expiry_date']) ? $availability_data['expiry_date'] : null,
                            'timezone' => sanitize_text_field($availability_data['timezone'] ?? 'America/New_York'),
                            'notes' => sanitize_textarea_field($availability_data['notes'] ?? ''),
                            'is_active' => 1
                        );
                        
                        $result = $wpdb->insert($this->availability_table, $availability_record);
                        
                        if ($result === false) {
                            throw new Exception('Failed to insert availability record');
                        }
                    }
                }
            }
            
            // Commit transaction
            $wpdb->query('COMMIT');
            update_option(self::LAST_UPDATED_OPTION, time());
            
            return true;
            
        } catch (Exception $e) {
            // Rollback transaction
            $wpdb->query('ROLLBACK');
            error_log('Save trainer availability error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Delete trainer availability
     * 
     * @param int $trainer_id Trainer ID
     * @param int $availability_id Optional specific availability ID
     * @return bool Success status
     */
    public function delete_trainer_availability($trainer_id, $availability_id = null) {
        global $wpdb;
        
        if ($availability_id) {
            // Delete specific availability record
            $result = $wpdb->delete(
                $this->availability_table,
                array('id' => $availability_id, 'trainer_id' => $trainer_id),
                array('%d', '%d')
            );
                } else {
            // Delete all availability for trainer (or just deactivate)
            $result = $wpdb->update(
                $this->availability_table,
                array('is_active' => 0),
                array('trainer_id' => $trainer_id),
                array('%d'),
                array('%d')
            );
        }
        
        if ($result !== false) {
            update_option(self::LAST_UPDATED_OPTION, time());
            return true;
        }
        
        return false;
    }
    
    /**
     * Generate recurring events from trainer availability
     * 
     * @param int $trainer_id Trainer ID
     * @param string $start_date Start date (Y-m-d)
     * @param string $end_date End date (Y-m-d)
     * @param string $event_type Event type (default: 'assessment')
     * @return int Number of events created
     */
    public function generate_recurring_events($trainer_id, $start_date, $end_date, $event_type = 'assessment') {
        global $wpdb;
        
        // Get trainer availability
        $availability = $this->get_trainer_availability($trainer_id);
        
        if (empty($availability)) {
            return 0;
        }
        
        $events_created = 0;
        $current_date = new DateTime($start_date);
        $end_date_obj = new DateTime($end_date);
        
        while ($current_date <= $end_date_obj) {
            $day_of_week = $current_date->format('w'); // 0 = Sunday, 6 = Saturday
            
            // Find availability for this day of week
            foreach ($availability as $avail) {
                if ($avail['day_of_week'] == $day_of_week) {
                    // Generate time slots for this day
                    $slots = $this->generate_time_slots(
                        $avail['start_time'],
                        $avail['end_time'],
                        $avail['session_duration'],
                        $avail['buffer_time'],
                        $avail['break_start_time'],
                        $avail['break_end_time']
                    );
                    
                    foreach ($slots as $slot) {
                        $start_datetime = $current_date->format('Y-m-d') . ' ' . $slot['start'];
                        $end_datetime = $current_date->format('Y-m-d') . ' ' . $slot['end'];
                        
                        // Check if event already exists
                        $existing = $wpdb->get_var($wpdb->prepare(
                            "SELECT id FROM {$this->events_table} WHERE trainer_id = %d AND start_datetime = %s",
                            $trainer_id,
                            $start_datetime
                        ));
                        
                        if (!$existing) {
                            $event_data = array(
                                'title' => $event_type === 'assessment' ? 'Fitness Assessment - Available' : 'Training Session - Available',
                                'description' => $event_type === 'assessment' ? 'Free 20-minute fitness assessment' : 'Personal training session',
                                'start_datetime' => $start_datetime,
                                'end_datetime' => $end_datetime,
                                'trainer_id' => $trainer_id,
                                'event_type' => $event_type,
                                'booking_status' => 'available',
                                'location' => $avail['location'],
                                'max_participants' => 1,
                                'current_participants' => 0,
                                'duration_minutes' => $avail['session_duration'],
                                'background_color' => $event_type === 'assessment' ? '#06b6d4' : '#10b981',
                                'border_color' => $event_type === 'assessment' ? '#0891b2' : '#059669',
                                'text_color' => '#ffffff'
                            );
                            
                            $result = $wpdb->insert($this->events_table, $event_data);
                            
                            if ($result) {
                                $events_created++;
                            }
                        }
                    }
                }
            }
            
            $current_date->add(new DateInterval('P1D')); // Add 1 day
        }
        
        if ($events_created > 0) {
            update_option(self::LAST_UPDATED_OPTION, time());
        }
        
        return $events_created;
    }
    
    /**
     * Generate time slots from availability window
     * 
     * @param string $start_time Start time (H:i:s)
     * @param string $end_time End time (H:i:s)
     * @param int $duration Session duration in minutes
     * @param int $buffer Buffer time in minutes
     * @param string $break_start Break start time (optional)
     * @param string $break_end Break end time (optional)
     * @return array Array of time slots
     */
    private function generate_time_slots($start_time, $end_time, $duration, $buffer, $break_start = null, $break_end = null) {
        $slots = array();
        
        $current = new DateTime($start_time);
        $end = new DateTime($end_time);
        $session_interval = new DateInterval('PT' . ($duration + $buffer) . 'M');
        
        while ($current < $end) {
            $slot_end = clone $current;
            $slot_end->add(new DateInterval('PT' . $duration . 'M'));
            
            // Check if slot conflicts with break time
            if ($break_start && $break_end) {
                $break_start_obj = new DateTime($break_start);
                $break_end_obj = new DateTime($break_end);
                
                // Skip if slot overlaps with break
                if ($current < $break_end_obj && $slot_end > $break_start_obj) {
                    // Jump to after break
                    $current = clone $break_end_obj;
                    continue;
                }
            }
            
            // Make sure slot doesn't exceed end time
            if ($slot_end <= $end) {
                $slots[] = array(
                    'start' => $current->format('H:i:s'),
                    'end' => $slot_end->format('H:i:s')
                );
            }
            
            $current->add($session_interval);
        }
        
        return $slots;
    }
    
    /**
     * Get all events (for testing and debugging)
     * 
     * @return array All events
     */
    public function get_all_events() {
        global $wpdb;
        
        $sql = "SELECT * FROM {$this->events_table} ORDER BY start_datetime ASC";
        $events = $wpdb->get_results($sql, ARRAY_A);
        
        return $events ?: array();
    }
    
    /**
     * Get all trainers (integrated with Personal Training data)
     * 
     * @return array Trainer data
     */
    public function get_integrated_trainers() {
        // Get Personal Training data if available
        $personal_training_data = get_option('fitcopilot_personal_training_data', array());
        
        if (empty($personal_training_data)) {
            // Return sample trainers if no Personal Training data
            return array(
                array(
                    'id' => 1,
                    'name' => 'Justin Fassio',
                    'specialty' => 'Strength Training',
                    'active' => true
                ),
                array(
                    'id' => 2,
                    'name' => 'Sarah Johnson',
                    'specialty' => 'HIIT & Cardio',
                    'active' => true
                )
            );
        }
        
        $trainers = array();
        foreach ($personal_training_data as $trainer) {
            if (isset($trainer['active']) && $trainer['active']) {
                $trainers[] = array(
                    'id' => $trainer['id'] ?? 0,
                    'name' => $trainer['name'] ?? '',
                    'specialty' => $trainer['specialty'] ?? '',
                    'active' => true
                );
            }
        }
        
        return $trainers;
    }
    
    /**
     * Get events for a specific trainer
     * Phase 2: Support for availability calculation
     * 
     * @param int $trainer_id Trainer ID
     * @param array $options Query options (start_date, end_date, status)
     * @return array Trainer events
     */
    public function get_trainer_events($trainer_id, $options = array()) {
        global $wpdb;
        
        // Default options
        $defaults = array(
            'start_date' => current_time('Y-m-d'),
            'end_date' => date('Y-m-d', strtotime('+30 days')),
            'status' => null
        );
        
        $options = array_merge($defaults, $options);
        
        // Build query
        $where_conditions = array();
        $where_conditions[] = $wpdb->prepare('trainer_id = %d', $trainer_id);
        
        if (!empty($options['start_date'])) {
            $where_conditions[] = $wpdb->prepare('DATE(start_datetime) >= %s', $options['start_date']);
        }
        
        if (!empty($options['end_date'])) {
            $where_conditions[] = $wpdb->prepare('DATE(start_datetime) <= %s', $options['end_date']);
        }
        
        if (!empty($options['status'])) {
            $where_conditions[] = $wpdb->prepare('booking_status = %s', $options['status']);
        }
        
        $where_clause = 'WHERE ' . implode(' AND ', $where_conditions);
        
        $sql = "SELECT * FROM {$this->events_table} {$where_clause} ORDER BY start_datetime ASC";
        $events = $wpdb->get_results($sql, ARRAY_A);
        
        return $events ?: array();
    }
    
    /**
     * Update event status for trainer management
     * Phase 2: Support for trainer deactivation/deletion handling
     * 
     * @param int $event_id Event ID
     * @param array $data Event data to update
     * @return bool Success status
     */
    public function update_event_status($event_id, $data) {
        global $wpdb;
        
        // Validate event exists
        $existing_event = $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM {$this->events_table} WHERE id = %d", $event_id),
            ARRAY_A
        );
        
        if (!$existing_event) {
            error_log('Training Calendar: Cannot update non-existent event ID: ' . $event_id);
            return false;
        }
        
        // Sanitize and validate update data
        $allowed_fields = array(
            'booking_status', 'trainer_id', 'notes'
        );
        
        $update_data = array();
        foreach ($data as $field => $value) {
            if (in_array($field, $allowed_fields)) {
                $update_data[$field] = $value;
            }
        }
        
        if (empty($update_data)) {
            error_log('Training Calendar: No valid fields to update for event ID: ' . $event_id);
            return false;
        }
        
        // Add updated timestamp
        $update_data['updated_at'] = current_time('mysql');
        
        // Perform update
        $result = $wpdb->update(
            $this->events_table,
            $update_data,
            array('id' => $event_id),
            null,
            array('%d')
        );
        
        if ($result === false) {
            error_log('Training Calendar: Database error updating event ID: ' . $event_id . ' - ' . $wpdb->last_error);
            return false;
        }
        
        // Update last modified timestamp
        update_option(self::LAST_UPDATED_OPTION, current_time('timestamp'));
        
        // Clear related caches
        wp_cache_delete('fitcopilot_training_calendar_event_' . $event_id);
        wp_cache_delete('fitcopilot_training_calendar_events_list');
        
        return true;
    }
    
    /**
     * Get events by status
     * Phase 2: Support for event management
     * 
     * @param string $status Event status
     * @param array $options Additional query options
     * @return array Events with specified status
     */
    public function get_events_by_status($status, $options = array()) {
        global $wpdb;
        
        $defaults = array(
            'limit' => 50,
            'offset' => 0,
            'order_by' => 'start_datetime',
            'order' => 'ASC'
        );
        
        $options = array_merge($defaults, $options);
        
        $sql = $wpdb->prepare(
            "SELECT * FROM {$this->events_table} 
             WHERE booking_status = %s 
             ORDER BY {$options['order_by']} {$options['order']} 
             LIMIT %d OFFSET %d",
            $status,
            $options['limit'],
            $options['offset']
        );
        
        $events = $wpdb->get_results($sql, ARRAY_A);
        
        return $events ?: array();
    }
} 