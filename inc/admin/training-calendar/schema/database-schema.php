<?php
/**
 * Training Calendar - Clean Database Schema for Event Type Assignments
 * 
 * Creates and updates database structure for Event Type → Trainer relationships
 * Clean implementation without migration complexity
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
 * Training Calendar Database Schema Class
 */
class FitCopilot_Training_Calendar_Schema {
    
    /**
     * Schema version
     */
    const SCHEMA_VERSION = '2.0.0';
    
    /**
     * WordPress database object
     * @var wpdb
     */
    private $wpdb;
    
    /**
     * Database table prefix
     * @var string
     */
    private $table_prefix;
    
    /**
     * Constructor
     */
    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table_prefix = $wpdb->prefix;
    }
    
    /**
     * Update database schema for event type assignments
     * 
     * @return bool Success status
     */
    public function update_schema() {
        try {
            // Update availability table structure
            $this->update_availability_table();
            
            // Create trainer event assignments table
            $this->create_trainer_assignments_table();
            
            // Update schema version
            update_option('fitcopilot_training_calendar_schema_version', self::SCHEMA_VERSION);
            
            // Log successful update
            error_log('FitCopilot Training Calendar: Schema updated to version ' . self::SCHEMA_VERSION);
            
            return true;
            
        } catch (Exception $e) {
            // Log schema update error
            error_log('FitCopilot Training Calendar: Schema update failed - ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Update availability table to support event types
     */
    private function update_availability_table() {
        $table_name = $this->table_prefix . 'training_calendar_availability';
        
        // Check if table exists
        if ($this->wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") !== $table_name) {
            throw new Exception("Availability table does not exist: {$table_name}");
        }
        
        // Add event type fields
        $this->wpdb->query("ALTER TABLE {$table_name} 
            ADD COLUMN IF NOT EXISTS event_type varchar(50) NOT NULL DEFAULT 'personal_training' AFTER trainer_id,
            ADD COLUMN IF NOT EXISTS event_type_config JSON AFTER event_type,
            ADD COLUMN IF NOT EXISTS max_bookings int DEFAULT 1 AFTER buffer_time");
        
        // Remove old session_duration field (replaced by event type configuration)
        $this->wpdb->query("ALTER TABLE {$table_name} 
            DROP COLUMN IF EXISTS session_duration");
        
        // Add new indexes for performance
        $this->wpdb->query("ALTER TABLE {$table_name} 
            ADD INDEX IF NOT EXISTS idx_trainer_event_type (trainer_id, event_type),
            ADD INDEX IF NOT EXISTS idx_event_type (event_type)");
        
        // Verify table structure
        $columns = $this->wpdb->get_results("DESCRIBE {$table_name}", ARRAY_A);
        $column_names = array_column($columns, 'Field');
        
        if (!in_array('event_type', $column_names)) {
            throw new Exception("Failed to add event_type column to availability table");
        }
    }
    
    /**
     * Create trainer event assignments table
     */
    private function create_trainer_assignments_table() {
        $table_name = $this->table_prefix . 'training_calendar_trainer_event_assignments';
        
        $charset_collate = $this->wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            trainer_id bigint(20) unsigned NOT NULL,
            event_type varchar(50) NOT NULL,
            is_active boolean DEFAULT true,
            
            -- Assignment configuration
            specialization_notes text,
            hourly_rate decimal(10,2),
            max_daily_sessions int DEFAULT 8,
            certification_level varchar(50),
            
            -- Event type customization
            custom_duration_options JSON,
            custom_pricing JSON,
            availability_preferences JSON,
            
            -- Metadata
            assigned_by bigint(20) unsigned,
            assignment_date datetime DEFAULT CURRENT_TIMESTAMP,
            last_modified_by bigint(20) unsigned,
            
            -- Timestamps
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            PRIMARY KEY (id),
            UNIQUE KEY unique_trainer_event (trainer_id, event_type),
            KEY idx_trainer_id (trainer_id),
            KEY idx_event_type (event_type),
            KEY idx_active_assignments (trainer_id, event_type, is_active),
            KEY idx_assignment_date (assignment_date)
        ) {$charset_collate};";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Verify table creation
        if ($this->wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") !== $table_name) {
            throw new Exception("Failed to create trainer assignments table: {$table_name}");
        }
        
        // Insert default assignments for existing trainers
        $this->insert_default_trainer_assignments();
    }
    
    /**
     * Insert default event type assignments for existing trainers
     */
    private function insert_default_trainer_assignments() {
        // Get existing trainers from Personal Training system
        $trainers = $this->get_existing_trainers();
        
        if (empty($trainers)) {
            return; // No trainers to assign
        }
        
        $assignments_table = $this->table_prefix . 'training_calendar_trainer_event_assignments';
        
        // Default event types that all trainers can handle
        $default_assignments = [
            'fitness_assessment' => [
                'hourly_rate' => 0.00, // Free
                'max_daily_sessions' => 6,
                'certification_level' => 'basic'
            ],
            'personal_training' => [
                'hourly_rate' => 80.00,
                'max_daily_sessions' => 8,
                'certification_level' => 'certified'
            ]
        ];
        
        foreach ($trainers as $trainer) {
            foreach ($default_assignments as $event_type => $config) {
                // Check if assignment already exists
                $existing = $this->wpdb->get_var($this->wpdb->prepare(
                    "SELECT id FROM {$assignments_table} WHERE trainer_id = %d AND event_type = %s",
                    $trainer['id'],
                    $event_type
                ));
                
                if (!$existing) {
                    $this->wpdb->insert(
                        $assignments_table,
                        [
                            'trainer_id' => $trainer['id'],
                            'event_type' => $event_type,
                            'is_active' => true,
                            'hourly_rate' => $config['hourly_rate'],
                            'max_daily_sessions' => $config['max_daily_sessions'],
                            'certification_level' => $config['certification_level'],
                            'specialization_notes' => 'Default assignment created during schema update'
                        ],
                        ['%d', '%s', '%d', '%f', '%d', '%s', '%s']
                    );
                }
            }
        }
    }
    
    /**
     * Get existing trainers from Personal Training system
     */
    private function get_existing_trainers() {
        // Check if Personal Training data exists
        $personal_training_data = get_option('fitcopilot_personal_training_data', []);
        
        if (!empty($personal_training_data['trainers'])) {
            return $personal_training_data['trainers'];
        }
        
        // Fallback: create sample trainers for testing
        return [
            [
                'id' => 1,
                'name' => 'Justin Fassio',
                'specialty' => 'Personal Training',
                'active' => true
            ]
        ];
    }
    
    /**
     * Check if schema update is needed
     * 
     * @return bool True if update is needed
     */
    public static function needs_update() {
        $current_version = get_option('fitcopilot_training_calendar_schema_version', '1.0.0');
        return version_compare($current_version, self::SCHEMA_VERSION, '<');
    }
    
    /**
     * Get schema status
     * 
     * @return array Schema status information
     */
    public static function get_status() {
        global $wpdb;
        
        $current_version = get_option('fitcopilot_training_calendar_schema_version', '1.0.0');
        $tables_exist = [
            'availability' => $wpdb->get_var("SHOW TABLES LIKE '{$wpdb->prefix}training_calendar_availability'"),
            'assignments' => $wpdb->get_var("SHOW TABLES LIKE '{$wpdb->prefix}training_calendar_trainer_event_assignments'")
        ];
        
        // Check if availability table has event_type column
        $availability_columns = [];
        if ($tables_exist['availability']) {
            $columns = $wpdb->get_results("DESCRIBE {$wpdb->prefix}training_calendar_availability", ARRAY_A);
            $availability_columns = array_column($columns, 'Field');
        }
        
        return [
            'current_version' => $current_version,
            'target_version' => self::SCHEMA_VERSION,
            'needs_update' => self::needs_update(),
            'tables_exist' => $tables_exist,
            'availability_has_event_type' => in_array('event_type', $availability_columns),
            'status' => self::needs_update() ? 'pending' : 'complete'
        ];
    }
    
    /**
     * Rollback schema changes (for testing)
     */
    public function rollback() {
        try {
            $availability_table = $this->table_prefix . 'training_calendar_availability';
            $assignments_table = $this->table_prefix . 'training_calendar_trainer_event_assignments';
            
            // Remove event type columns from availability table
            $this->wpdb->query("ALTER TABLE {$availability_table} 
                DROP COLUMN IF EXISTS event_type,
                DROP COLUMN IF EXISTS event_type_config,
                DROP COLUMN IF EXISTS max_bookings,
                ADD COLUMN IF NOT EXISTS session_duration int DEFAULT 60 COMMENT 'Duration in minutes'");
            
            // Drop assignments table
            $this->wpdb->query("DROP TABLE IF EXISTS {$assignments_table}");
            
            // Reset schema version
            update_option('fitcopilot_training_calendar_schema_version', '1.0.0');
            
            return true;
            
        } catch (Exception $e) {
            error_log('Schema rollback failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Create all tables from scratch (for new installations)
     */
    public function create_fresh_schema() {
        try {
            // Create availability table with event type support
            $this->create_availability_table_with_event_types();
            
            // Create trainer assignments table
            $this->create_trainer_assignments_table();
            
            // Set schema version
            update_option('fitcopilot_training_calendar_schema_version', self::SCHEMA_VERSION);
            
            return true;
            
        } catch (Exception $e) {
            error_log('Fresh schema creation failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Create availability table with event type support from scratch
     */
    private function create_availability_table_with_event_types() {
        $table_name = $this->table_prefix . 'training_calendar_availability';
        
        $charset_collate = $this->wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            trainer_id bigint(20) unsigned NOT NULL,
            event_type varchar(50) NOT NULL DEFAULT 'personal_training',
            event_type_config JSON,
            
            -- Time configuration
            day_of_week tinyint(1) NOT NULL COMMENT '0=Sunday, 6=Saturday',
            start_time time NOT NULL,
            end_time time NOT NULL,
            
            -- Availability rules
            is_active boolean DEFAULT true,
            effective_date date,
            expiry_date date,
            break_start_time time NULL,
            break_end_time time NULL,
            
            -- Event type specific settings
            buffer_time int DEFAULT 15 COMMENT 'Buffer between sessions in minutes',
            max_bookings int DEFAULT 1,
            max_sessions_per_day int DEFAULT 8,
            
            -- Location and type
            location varchar(255),
            availability_type enum('in_person','virtual','both') DEFAULT 'both',
            hourly_rate decimal(10,2) DEFAULT 0.00,
            notes text,
            
            -- Timestamps
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            PRIMARY KEY (id),
            KEY idx_trainer_id (trainer_id),
            KEY idx_event_type (event_type),
            KEY idx_trainer_event_type (trainer_id, event_type),
            KEY idx_day_of_week (day_of_week),
            KEY idx_is_active (is_active),
            KEY idx_effective_date (effective_date),
            KEY idx_expiry_date (expiry_date),
            UNIQUE KEY unique_trainer_event_day_time (trainer_id, event_type, day_of_week, start_time, end_time, effective_date)
        ) {$charset_collate};";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Verify table creation
        if ($this->wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") !== $table_name) {
            throw new Exception("Failed to create availability table: {$table_name}");
        }
    }
}

/**
 * Function to update schema programmatically 
 * 
 * @return bool Update success
 */
function fitcopilot_training_calendar_update_schema() {
    $schema = new FitCopilot_Training_Calendar_Schema();
    return $schema->update_schema();
}

/**
 * Function to check schema status
 * 
 * @return array Schema status
 */
function fitcopilot_training_calendar_schema_status() {
    return FitCopilot_Training_Calendar_Schema::get_status();
}

/**
 * Function to create fresh schema
 * 
 * @return bool Creation success
 */
function fitcopilot_training_calendar_create_fresh_schema() {
    $schema = new FitCopilot_Training_Calendar_Schema();
    return $schema->create_fresh_schema();
} 