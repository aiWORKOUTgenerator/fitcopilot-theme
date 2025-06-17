<?php
/**
 * Training Calendar Database Rollback Script
 * 
 * Safely removes all Training Calendar database components
 * Use this script for emergency rollback or clean uninstallation
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class FitCopilot_Training_Calendar_Rollback {
    
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
     * Rollback log
     * @var array
     */
    private $rollback_log = [];
    
    /**
     * Constructor
     */
    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->table_prefix = $wpdb->prefix;
    }
    
    /**
     * Execute complete rollback
     * 
     * @param bool $preserve_data Whether to preserve user data
     * @return array Rollback results
     */
    public function execute($preserve_data = false) {
        $this->log('Starting Training Calendar rollback process');
        
        try {
            // Step 1: Deactivate calendar functionality
            $this->deactivate_calendar();
            
            // Step 2: Backup data if requested
            if ($preserve_data) {
                $this->backup_data();
            }
            
            // Step 3: Remove database tables
            $this->remove_database_tables();
            
            // Step 4: Remove WordPress options
            $this->remove_options();
            
            // Step 5: Clear caches
            $this->clear_caches();
            
            // Step 6: Remove uploaded files (if any)
            $this->remove_uploaded_files();
            
            $this->log('Training Calendar rollback completed successfully');
            
            return [
                'success' => true,
                'message' => 'Training Calendar has been successfully rolled back',
                'log' => $this->rollback_log,
                'timestamp' => current_time('mysql'),
                'data_backed_up' => $preserve_data
            ];
            
        } catch (Exception $e) {
            $this->log('Rollback failed: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Rollback failed: ' . $e->getMessage(),
                'log' => $this->rollback_log,
                'timestamp' => current_time('mysql')
            ];
        }
    }
    
    /**
     * Deactivate calendar functionality
     */
    private function deactivate_calendar() {
        $this->log('Deactivating Training Calendar functionality');
        
        // Disable calendar
        update_option('fitcopilot_training_calendar_active', false);
        
        // Mark as rolled back
        update_option('fitcopilot_training_calendar_rolled_back', true);
        update_option('fitcopilot_training_calendar_rollback_date', current_time('mysql'));
        
        $this->log('Calendar functionality deactivated');
    }
    
    /**
     * Backup existing data before removal
     */
    private function backup_data() {
        $this->log('Creating data backup');
        
        $backup_data = [];
        
        // Backup events
        $events = $this->wpdb->get_results(
            "SELECT * FROM {$this->table_prefix}training_calendar_events", 
            ARRAY_A
        );
        if ($events) {
            $backup_data['events'] = $events;
            $this->log('Backed up ' . count($events) . ' events');
        }
        
        // Backup bookings
        $bookings = $this->wpdb->get_results(
            "SELECT * FROM {$this->table_prefix}training_calendar_bookings", 
            ARRAY_A
        );
        if ($bookings) {
            $backup_data['bookings'] = $bookings;
            $this->log('Backed up ' . count($bookings) . ' bookings');
        }
        
        // Backup availability
        $availability = $this->wpdb->get_results(
            "SELECT * FROM {$this->table_prefix}training_calendar_availability", 
            ARRAY_A
        );
        if ($availability) {
            $backup_data['availability'] = $availability;
            $this->log('Backed up ' . count($availability) . ' availability records');
        }
        
        // Backup settings
        $settings = [
            'calendar_settings' => get_option('fitcopilot_training_calendar_settings'),
            'performance_settings' => get_option('fitcopilot_training_calendar_performance'),
            'email_templates' => get_option('fitcopilot_training_calendar_email_templates')
        ];
        $backup_data['settings'] = $settings;
        
        // Save backup to uploads directory
        $uploads_dir = wp_upload_dir();
        $backup_file = $uploads_dir['basedir'] . '/fitcopilot-calendar-backup-' . date('Y-m-d-H-i-s') . '.json';
        
        file_put_contents($backup_file, json_encode($backup_data, JSON_PRETTY_PRINT));
        
        // Store backup location
        update_option('fitcopilot_training_calendar_backup_file', $backup_file);
        
        $this->log('Data backup saved to: ' . $backup_file);
    }
    
    /**
     * Remove database tables
     */
    private function remove_database_tables() {
        $this->log('Removing database tables');
        
        $tables = [
            'training_calendar_bookings',  // Remove first due to foreign key
            'training_calendar_events',
            'training_calendar_availability'
        ];
        
        foreach ($tables as $table) {
            $table_name = $this->table_prefix . $table;
            
            // Check if table exists
            $table_exists = $this->wpdb->get_var("SHOW TABLES LIKE '{$table_name}'");
            
            if ($table_exists) {
                // Disable foreign key checks temporarily
                $this->wpdb->query('SET FOREIGN_KEY_CHECKS = 0');
                
                // Drop table
                $result = $this->wpdb->query("DROP TABLE IF EXISTS {$table_name}");
                
                // Re-enable foreign key checks
                $this->wpdb->query('SET FOREIGN_KEY_CHECKS = 1');
                
                if ($result !== false) {
                    $this->log("Successfully removed table: {$table_name}");
                } else {
                    throw new Exception("Failed to remove table: {$table_name}");
                }
            } else {
                $this->log("Table not found (already removed): {$table_name}");
            }
        }
        
        $this->log('All database tables removed successfully');
    }
    
    /**
     * Remove WordPress options
     */
    private function remove_options() {
        $this->log('Removing WordPress options');
        
        $options = [
            'fitcopilot_training_calendar_settings',
            'fitcopilot_training_calendar_performance',
            'fitcopilot_training_calendar_email_templates',
            'fitcopilot_training_calendar_db_version',
            'fitcopilot_training_calendar_first_run',
            'fitcopilot_training_calendar_installed_at',
            'fitcopilot_training_calendar_active'
        ];
        
        foreach ($options as $option) {
            if (get_option($option) !== false) {
                delete_option($option);
                $this->log("Removed option: {$option}");
            }
        }
        
        // Remove any transients
        $this->wpdb->query(
            "DELETE FROM {$this->wpdb->options} 
             WHERE option_name LIKE '_transient_fitcopilot_training_calendar_%' 
             OR option_name LIKE '_transient_timeout_fitcopilot_training_calendar_%'"
        );
        
        $this->log('WordPress options removed successfully');
    }
    
    /**
     * Clear all caches
     */
    private function clear_caches() {
        $this->log('Clearing caches');
        
        // WordPress object cache
        if (function_exists('wp_cache_flush')) {
            wp_cache_flush();
            $this->log('WordPress object cache flushed');
        }
        
        // Clear training calendar specific cache groups
        if (function_exists('wp_cache_flush_group')) {
            wp_cache_flush_group('training_calendar');
            $this->log('Training calendar cache group flushed');
        }
        
        // Clear any file-based caches
        $cache_dir = WP_CONTENT_DIR . '/cache/training-calendar/';
        if (is_dir($cache_dir)) {
            $this->remove_directory($cache_dir);
            $this->log('File-based cache directory removed');
        }
        
        // Clear opcache if available
        if (function_exists('opcache_reset')) {
            opcache_reset();
            $this->log('OPcache reset');
        }
        
        $this->log('Caches cleared successfully');
    }
    
    /**
     * Remove uploaded files
     */
    private function remove_uploaded_files() {
        $this->log('Checking for uploaded files to remove');
        
        $uploads_dir = wp_upload_dir();
        $calendar_uploads = $uploads_dir['basedir'] . '/training-calendar/';
        
        if (is_dir($calendar_uploads)) {
            $this->remove_directory($calendar_uploads);
            $this->log('Training calendar uploads directory removed');
        } else {
            $this->log('No training calendar uploads directory found');
        }
    }
    
    /**
     * Recursively remove directory
     * 
     * @param string $dir Directory path
     */
    private function remove_directory($dir) {
        if (!is_dir($dir)) {
            return;
        }
        
        $files = array_diff(scandir($dir), ['.', '..']);
        
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                $this->remove_directory($path);
            } else {
                unlink($path);
            }
        }
        
        rmdir($dir);
    }
    
    /**
     * Verify rollback completion
     * 
     * @return array Verification results
     */
    public function verify_rollback() {
        $verification = [
            'tables_removed' => true,
            'options_removed' => true,
            'cache_cleared' => true,
            'files_removed' => true,
            'issues' => []
        ];
        
        // Check tables
        $tables = ['training_calendar_events', 'training_calendar_bookings', 'training_calendar_availability'];
        foreach ($tables as $table) {
            $table_name = $this->table_prefix . $table;
            if ($this->wpdb->get_var("SHOW TABLES LIKE '{$table_name}'")) {
                $verification['tables_removed'] = false;
                $verification['issues'][] = "Table still exists: {$table_name}";
            }
        }
        
        // Check options
        $options = ['fitcopilot_training_calendar_settings', 'fitcopilot_training_calendar_db_version'];
        foreach ($options as $option) {
            if (get_option($option) !== false) {
                $verification['options_removed'] = false;
                $verification['issues'][] = "Option still exists: {$option}";
            }
        }
        
        $verification['overall_success'] = empty($verification['issues']);
        
        return $verification;
    }
    
    /**
     * Add entry to rollback log
     * 
     * @param string $message Log message
     */
    private function log($message) {
        $this->rollback_log[] = [
            'timestamp' => current_time('mysql'),
            'message' => $message
        ];
        
        // Also log to WordPress error log
        error_log('FitCopilot Training Calendar Rollback: ' . $message);
    }
    
    /**
     * Get rollback history
     * 
     * @return array Previous rollback attempts
     */
    public static function get_rollback_history() {
        return get_option('fitcopilot_training_calendar_rollback_history', []);
    }
    
    /**
     * Save rollback attempt to history
     * 
     * @param array $rollback_result Rollback result data
     */
    private function save_rollback_history($rollback_result) {
        $history = self::get_rollback_history();
        $history[] = $rollback_result;
        
        // Keep only last 10 rollback attempts
        $history = array_slice($history, -10);
        
        update_option('fitcopilot_training_calendar_rollback_history', $history);
    }
}

/**
 * Execute rollback if called directly
 */
if (defined('WP_CLI') && WP_CLI) {
    // WP-CLI rollback command
    $preserve_data = isset($argv[1]) && $argv[1] === '--preserve-data';
    
    $rollback = new FitCopilot_Training_Calendar_Rollback();
    $result = $rollback->execute($preserve_data);
    
    if ($result['success']) {
        WP_CLI::success($result['message']);
        if ($preserve_data) {
            WP_CLI::line('Data backup created before rollback');
        }
    } else {
        WP_CLI::error($result['message']);
    }
}

/**
 * Function to execute rollback programmatically
 * 
 * @param bool $preserve_data Whether to backup data before removal
 * @return array Rollback results
 */
function fitcopilot_training_calendar_rollback($preserve_data = false) {
    $rollback = new FitCopilot_Training_Calendar_Rollback();
    return $rollback->execute($preserve_data);
}

/**
 * Function to verify rollback completion
 * 
 * @return array Verification results
 */
function fitcopilot_training_calendar_verify_rollback() {
    $rollback = new FitCopilot_Training_Calendar_Rollback();
    return $rollback->verify_rollback();
}

/**
 * Emergency rollback function (minimal dependencies)
 * Use this if the main rollback class fails
 */
function fitcopilot_training_calendar_emergency_rollback() {
    global $wpdb;
    
    try {
        // Disable calendar
        update_option('fitcopilot_training_calendar_active', false);
        
        // Drop tables (order matters due to foreign keys)
        $wpdb->query('SET FOREIGN_KEY_CHECKS = 0');
        $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}training_calendar_bookings");
        $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}training_calendar_events");
        $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}training_calendar_availability");
        $wpdb->query('SET FOREIGN_KEY_CHECKS = 1');
        
        // Remove main options
        delete_option('fitcopilot_training_calendar_settings');
        delete_option('fitcopilot_training_calendar_db_version');
        
        // Clear cache
        wp_cache_flush();
        
        error_log('FitCopilot Training Calendar: Emergency rollback completed');
        
        return true;
        
    } catch (Exception $e) {
        error_log('FitCopilot Training Calendar: Emergency rollback failed - ' . $e->getMessage());
        return false;
    }
} 