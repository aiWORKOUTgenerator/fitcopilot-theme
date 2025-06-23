<?php
/**
 * Training Calendar Schema Implementation Test
 * 
 * Simple test script to verify database schema implementation
 * Run this via WP CLI or by accessing directly in admin
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
 * Training Calendar Schema Test Class
 */
class FitCopilot_Training_Calendar_Schema_Test {
    
    /**
     * Run all tests
     */
    public static function run_tests() {
        $results = array();
        
        $results['schema_class'] = self::test_schema_class_loading();
        $results['schema_status'] = self::test_schema_status();
        $results['database_structure'] = self::test_database_structure();
        $results['assignment_functionality'] = self::test_assignment_functionality();
        
        return $results;
    }
    
    /**
     * Test schema class loading
     */
    private static function test_schema_class_loading() {
        try {
            // Test schema class loading
            require_once __DIR__ . '/schema/database-schema.php';
            
            if (!class_exists('FitCopilot_Training_Calendar_Schema')) {
                return array('status' => 'fail', 'message' => 'Schema class not found');
            }
            
            $schema = new FitCopilot_Training_Calendar_Schema();
            
            return array('status' => 'pass', 'message' => 'Schema class loaded successfully');
            
        } catch (Exception $e) {
            return array('status' => 'fail', 'message' => 'Schema class loading failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Test schema status functionality
     */
    private static function test_schema_status() {
        try {
            require_once __DIR__ . '/schema/database-schema.php';
            
            $status = FitCopilot_Training_Calendar_Schema::get_status();
            
            if (!is_array($status)) {
                return array('status' => 'fail', 'message' => 'Schema status not returned as array');
            }
            
            $required_keys = array('current_version', 'target_version', 'needs_update', 'status');
            foreach ($required_keys as $key) {
                if (!array_key_exists($key, $status)) {
                    return array('status' => 'fail', 'message' => "Missing status key: {$key}");
                }
            }
            
            return array(
                'status' => 'pass', 
                'message' => 'Schema status working correctly',
                'data' => $status
            );
            
        } catch (Exception $e) {
            return array('status' => 'fail', 'message' => 'Schema status test failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Test database structure
     */
    private static function test_database_structure() {
        global $wpdb;
        
        try {
            $results = array();
            
            // Check availability table structure
            $availability_table = $wpdb->prefix . 'training_calendar_availability';
            $availability_exists = $wpdb->get_var("SHOW TABLES LIKE '{$availability_table}'");
            
            if ($availability_exists) {
                $columns = $wpdb->get_results("DESCRIBE {$availability_table}", ARRAY_A);
                $column_names = array_column($columns, 'Field');
                
                $results['availability_table'] = array(
                    'exists' => true,
                    'has_event_type' => in_array('event_type', $column_names),
                    'has_event_type_config' => in_array('event_type_config', $column_names),
                    'has_max_bookings' => in_array('max_bookings', $column_names),
                    'columns' => $column_names
                );
            } else {
                $results['availability_table'] = array('exists' => false);
            }
            
            // Check assignments table structure
            $assignments_table = $wpdb->prefix . 'training_calendar_trainer_event_assignments';
            $assignments_exists = $wpdb->get_var("SHOW TABLES LIKE '{$assignments_table}'");
            
            if ($assignments_exists) {
                $columns = $wpdb->get_results("DESCRIBE {$assignments_table}", ARRAY_A);
                $column_names = array_column($columns, 'Field');
                
                $results['assignments_table'] = array(
                    'exists' => true,
                    'columns' => $column_names
                );
            } else {
                $results['assignments_table'] = array('exists' => false);
            }
            
            return array(
                'status' => 'pass',
                'message' => 'Database structure analyzed',
                'data' => $results
            );
            
        } catch (Exception $e) {
            return array('status' => 'fail', 'message' => 'Database structure test failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Test assignment functionality
     */
    private static function test_assignment_functionality() {
        global $wpdb;
        
        try {
            $assignments_table = $wpdb->prefix . 'training_calendar_trainer_event_assignments';
            
            // Check if assignments table exists
            if (!$wpdb->get_var("SHOW TABLES LIKE '{$assignments_table}'")) {
                return array('status' => 'skip', 'message' => 'Assignments table does not exist yet');
            }
            
            // Count existing assignments
            $assignment_count = $wpdb->get_var("SELECT COUNT(*) FROM {$assignments_table}");
            
            // Get assignments by event type
            $event_type_counts = $wpdb->get_results(
                "SELECT event_type, COUNT(*) as count FROM {$assignments_table} GROUP BY event_type",
                ARRAY_A
            );
            
            return array(
                'status' => 'pass',
                'message' => 'Assignment functionality working',
                'data' => array(
                    'total_assignments' => $assignment_count,
                    'by_event_type' => $event_type_counts
                )
            );
            
        } catch (Exception $e) {
            return array('status' => 'fail', 'message' => 'Assignment functionality test failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Display test results in admin-friendly format
     */
    public static function display_test_results($results) {
        echo '<div class="wrap">';
        echo '<h1>Training Calendar Schema Test Results</h1>';
        
        foreach ($results as $test_name => $result) {
            $status_class = $result['status'] === 'pass' ? 'notice-success' : 
                          ($result['status'] === 'skip' ? 'notice-warning' : 'notice-error');
            
            echo '<div class="notice ' . $status_class . '">';
            echo '<h3>' . ucwords(str_replace('_', ' ', $test_name)) . '</h3>';
            echo '<p><strong>Status:</strong> ' . strtoupper($result['status']) . '</p>';
            echo '<p><strong>Message:</strong> ' . esc_html($result['message']) . '</p>';
            
            if (isset($result['data'])) {
                echo '<details>';
                echo '<summary>View Details</summary>';
                echo '<pre>' . esc_html(print_r($result['data'], true)) . '</pre>';
                echo '</details>';
            }
            
            echo '</div>';
        }
        
        echo '</div>';
    }
}

/**
 * Run tests if accessed directly via admin
 */
if (is_admin() && isset($_GET['run_schema_test'])) {
    add_action('admin_notices', function() {
        $results = FitCopilot_Training_Calendar_Schema_Test::run_tests();
        FitCopilot_Training_Calendar_Schema_Test::display_test_results($results);
    });
}

/**
 * WP CLI command for running tests
 */
if (defined('WP_CLI') && WP_CLI) {
    /**
     * Test Training Calendar schema implementation
     */
    WP_CLI::add_command('fitcopilot test-schema', function() {
        $results = FitCopilot_Training_Calendar_Schema_Test::run_tests();
        
        WP_CLI::line('Training Calendar Schema Test Results:');
        WP_CLI::line('=====================================');
        
        foreach ($results as $test_name => $result) {
            $status_symbol = $result['status'] === 'pass' ? '✅' : 
                           ($result['status'] === 'skip' ? '⚠️' : '❌');
            
            WP_CLI::line($status_symbol . ' ' . ucwords(str_replace('_', ' ', $test_name)) . ': ' . $result['message']);
            
            if (isset($result['data'])) {
                WP_CLI::line('   Data: ' . json_encode($result['data'], JSON_PRETTY_PRINT));
            }
        }
    });
} 