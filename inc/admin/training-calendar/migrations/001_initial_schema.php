<?php
/**
 * Training Calendar Initial Database Schema Migration
 * 
 * Creates the required database tables for the Training Calendar system
 * This migration runs automatically on Training Calendar activation
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class FitCopilot_Training_Calendar_Migration_001 {
    
    /**
     * Current migration version
     * @var string
     */
    const VERSION = '1.0.0';
    
    /**
     * Database table prefix
     * @var string
     */
    private $table_prefix;
    
    /**
     * WordPress database object
     * @var wpdb
     */
    private $wpdb;
    
    /**
     * Constructor
     */
    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table_prefix = $wpdb->prefix;
    }
    
    /**
     * Run the migration
     * 
     * @return bool Migration success
     */
    public function up() {
        try {
            // Create database tables
            $this->create_events_table();
            $this->create_bookings_table();
            $this->create_availability_table();
            
            // Insert initial data
            $this->insert_default_settings();
            
            // Update migration version
            update_option('fitcopilot_training_calendar_db_version', self::VERSION);
            
            // Log successful migration
            error_log('FitCopilot Training Calendar: Database migration 001 completed successfully');
            
            return true;
            
        } catch (Exception $e) {
            // Log migration error
            error_log('FitCopilot Training Calendar: Migration 001 failed - ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Create training calendar events table
     */
    private function create_events_table() {
        $table_name = $this->table_prefix . 'training_calendar_events';
        
        $charset_collate = $this->wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            title varchar(255) NOT NULL,
            description text,
            start_datetime datetime NOT NULL,
            end_datetime datetime NOT NULL,
            trainer_id bigint(20) unsigned,
            event_type enum('session','availability','blocked','group_class') DEFAULT 'session',
            recurring_pattern text,
            recurring_parent_id bigint(20) unsigned NULL,
            booking_status enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
            client_name varchar(255),
            client_email varchar(255),
            client_phone varchar(20),
            max_participants int DEFAULT 1,
            current_participants int DEFAULT 0,
            price decimal(10,2) DEFAULT 0.00,
            currency varchar(3) DEFAULT 'USD',
            location varchar(255),
            zoom_link varchar(500),
            special_instructions text,
            created_by bigint(20) unsigned,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY trainer_id (trainer_id),
            KEY start_datetime (start_datetime),
            KEY end_datetime (end_datetime),
            KEY event_type (event_type),
            KEY booking_status (booking_status),
            KEY recurring_parent_id (recurring_parent_id),
            KEY created_by (created_by)
        ) {$charset_collate};";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Verify table creation
        if ($this->wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") !== $table_name) {
            throw new Exception("Failed to create table: {$table_name}");
        }
    }
    
    /**
     * Create training calendar bookings table
     */
    private function create_bookings_table() {
        $table_name = $this->table_prefix . 'training_calendar_bookings';
        
        $charset_collate = $this->wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            event_id bigint(20) unsigned NOT NULL,
            client_name varchar(255) NOT NULL,
            client_email varchar(255) NOT NULL,
            client_phone varchar(20),
            client_user_id bigint(20) unsigned NULL,
            booking_notes text,
            emergency_contact_name varchar(255),
            emergency_contact_phone varchar(20),
            medical_conditions text,
            fitness_goals text,
            booking_status enum('pending','confirmed','cancelled','completed','no_show') DEFAULT 'pending',
            payment_status enum('unpaid','paid','refunded','partial') DEFAULT 'unpaid',
            payment_amount decimal(10,2) DEFAULT 0.00,
            payment_method varchar(50),
            payment_transaction_id varchar(255),
            booking_date datetime DEFAULT CURRENT_TIMESTAMP,
            confirmed_date datetime NULL,
            cancelled_date datetime NULL,
            cancellation_reason text,
            completed_date datetime NULL,
            feedback_rating tinyint(1) NULL,
            feedback_comments text,
            reminder_sent_at datetime NULL,
            follow_up_required boolean DEFAULT false,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY event_id (event_id),
            KEY client_email (client_email),
            KEY client_user_id (client_user_id),
            KEY booking_status (booking_status),
            KEY payment_status (payment_status),
            KEY booking_date (booking_date),
            FOREIGN KEY (event_id) REFERENCES {$this->table_prefix}training_calendar_events(id) ON DELETE CASCADE
        ) {$charset_collate};";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Verify table creation
        if ($this->wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") !== $table_name) {
            throw new Exception("Failed to create table: {$table_name}");
        }
    }
    
    /**
     * Create trainer availability table
     */
    private function create_availability_table() {
        $table_name = $this->table_prefix . 'training_calendar_availability';
        
        $charset_collate = $this->wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            trainer_id bigint(20) unsigned NOT NULL,
            day_of_week tinyint(1) NOT NULL COMMENT '0=Sunday, 6=Saturday',
            start_time time NOT NULL,
            end_time time NOT NULL,
            is_active boolean DEFAULT true,
            effective_date date,
            expiry_date date,
            break_start_time time NULL,
            break_end_time time NULL,
            session_duration int DEFAULT 60 COMMENT 'Duration in minutes',
            buffer_time int DEFAULT 15 COMMENT 'Buffer between sessions in minutes',
            max_sessions_per_day int DEFAULT 8,
            location varchar(255),
            availability_type enum('in_person','virtual','both') DEFAULT 'both',
            hourly_rate decimal(10,2) DEFAULT 0.00,
            notes text,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY trainer_id (trainer_id),
            KEY day_of_week (day_of_week),
            KEY is_active (is_active),
            KEY effective_date (effective_date),
            KEY expiry_date (expiry_date),
            UNIQUE KEY unique_trainer_day_time (trainer_id, day_of_week, start_time, end_time, effective_date)
        ) {$charset_collate};";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Verify table creation
        if ($this->wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") !== $table_name) {
            throw new Exception("Failed to create table: {$table_name}");
        }
    }
    
    /**
     * Insert default settings and configuration
     */
    private function insert_default_settings() {
        // Training Calendar Settings
        $default_settings = [
            'calendar_view_default' => 'dayGridMonth',
            'time_slot_duration' => 60, // minutes
            'booking_buffer_time' => 15, // minutes
            'max_advance_booking_days' => 90,
            'cancellation_policy_hours' => 24,
            'email_notifications' => true,
            'sms_notifications' => false,
            'sync_with_personal_training' => true,
            'allow_recurring_events' => true,
            'calendar_theme' => 'default',
            'business_hours_start' => '06:00',
            'business_hours_end' => '22:00',
            'timezone' => wp_timezone_string(),
            'currency' => 'USD',
            'default_session_price' => 100.00,
            'require_payment_booking' => false,
            'auto_confirm_bookings' => false,
            'send_reminder_hours' => 24,
            'max_participants_default' => 1,
            'allow_online_payments' => false
        ];
        
        add_option('fitcopilot_training_calendar_settings', $default_settings);
        
        // Performance Settings
        $performance_settings = [
            'enable_caching' => true,
            'cache_duration' => 3600, // 1 hour
            'lazy_load_events' => true,
            'virtual_scrolling' => true,
            'bundle_optimization' => true,
            'prefetch_trainer_data' => true,
            'enable_real_time_updates' => false,
            'max_events_per_request' => 100,
            'database_query_cache' => true
        ];
        
        add_option('fitcopilot_training_calendar_performance', $performance_settings);
        
        // Email Templates
        $email_templates = [
            'booking_confirmation' => [
                'subject' => 'Booking Confirmed - {{event_title}}',
                'body' => 'Your training session has been confirmed for {{event_date}} at {{event_time}} with {{trainer_name}}.'
            ],
            'booking_reminder' => [
                'subject' => 'Reminder: Training Session Tomorrow',
                'body' => 'This is a reminder for your training session tomorrow at {{event_time}} with {{trainer_name}}.'
            ],
            'booking_cancellation' => [
                'subject' => 'Training Session Cancelled',
                'body' => 'Your training session on {{event_date}} at {{event_time}} has been cancelled.'
            ]
        ];
        
        add_option('fitcopilot_training_calendar_email_templates', $email_templates);
        
        // Calendar Options
        add_option('fitcopilot_training_calendar_active', true);
        add_option('fitcopilot_training_calendar_first_run', true);
        add_option('fitcopilot_training_calendar_installed_at', current_time('mysql'));
    }
    
    /**
     * Check if migration needs to run
     * 
     * @return bool True if migration is needed
     */
    public static function needs_migration() {
        $current_version = get_option('fitcopilot_training_calendar_db_version', '0.0.0');
        return version_compare($current_version, self::VERSION, '<');
    }
    
    /**
     * Get migration status
     * 
     * @return array Migration status information
     */
    public static function get_status() {
        global $wpdb;
        
        $current_version = get_option('fitcopilot_training_calendar_db_version', '0.0.0');
        $tables_exist = [
            'events' => $wpdb->get_var("SHOW TABLES LIKE '{$wpdb->prefix}training_calendar_events'"),
            'bookings' => $wpdb->get_var("SHOW TABLES LIKE '{$wpdb->prefix}training_calendar_bookings'"),
            'availability' => $wpdb->get_var("SHOW TABLES LIKE '{$wpdb->prefix}training_calendar_availability'")
        ];
        
        return [
            'current_version' => $current_version,
            'target_version' => self::VERSION,
            'needs_migration' => self::needs_migration(),
            'tables_exist' => $tables_exist,
            'settings_exist' => (bool) get_option('fitcopilot_training_calendar_settings'),
            'status' => self::needs_migration() ? 'pending' : 'complete'
        ];
    }
}

/**
 * Run migration if called directly
 */
if (defined('WP_CLI') && WP_CLI) {
    // Allow WP-CLI execution
    $migration = new FitCopilot_Training_Calendar_Migration_001();
    $result = $migration->up();
    
    if ($result) {
        WP_CLI::success('Training Calendar migration 001 completed successfully');
    } else {
        WP_CLI::error('Training Calendar migration 001 failed');
    }
}

/**
 * Function to run migration programmatically
 * 
 * @return bool Migration success
 */
function fitcopilot_training_calendar_run_migration_001() {
    $migration = new FitCopilot_Training_Calendar_Migration_001();
    return $migration->up();
}

/**
 * Function to check migration status
 * 
 * @return array Migration status
 */
function fitcopilot_training_calendar_migration_status() {
    return FitCopilot_Training_Calendar_Migration_001::get_status();
} 