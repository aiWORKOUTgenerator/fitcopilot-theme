<?php
/**
 * Training Calendar - Day 1 AJAX Endpoints Testing Script
 * 
 * Tests all AJAX endpoints to verify Day 1 fixes resolved the 500 errors
 * Run this script to verify AJAX handler registration and functionality
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Security check - only allow admin users
if (!current_user_can('manage_options')) {
    wp_die('Access denied. This testing script requires administrator privileges.');
}

// Ensure WordPress environment
if (!defined('ABSPATH')) {
    die('WordPress environment required');
}

/**
 * AJAX Endpoints Test Suite
 */
class FitCopilot_Training_Calendar_AJAX_Test_Suite {
    
    private $test_results = array();
    private $nonce;
    
    public function __construct() {
        $this->nonce = wp_create_nonce('fitcopilot_training_calendar_nonce');
    }
    
    /**
     * Run all tests
     */
    public function run_all_tests() {
        echo "<h2>🚨 Training Calendar - Day 1 AJAX Endpoints Test Suite</h2>\n";
        echo "<p><strong>Testing all AJAX endpoints to verify 500 errors are resolved...</strong></p>\n";
        
        // Test 1: Manager Initialization
        $this->test_manager_initialization();
        
        // Test 2: AJAX Handler Registration
        $this->test_ajax_handler_registration();
        
        // Test 3: Event Type Configuration
        $this->test_event_type_config_endpoint();
        
        // Test 4: Trainer Assignments Endpoint
        $this->test_trainer_assignments_endpoint();
        
        // Test 5: Assignment Statistics Endpoint
        $this->test_assignment_statistics_endpoint();
        
        // Test 6: Event Type Validation
        $this->test_event_type_validation_endpoint();
        
        // Test 7: Database Tables
        $this->test_database_tables();
        
        // Display Results Summary
        $this->display_test_summary();
    }
    
    /**
     * Test 1: Manager Initialization
     */
    private function test_manager_initialization() {
        echo "<h3>Test 1: Manager Initialization</h3>\n";
        
        try {
            // Check if manager class exists
            if (class_exists('FitCopilot_Training_Calendar_Manager')) {
                $this->test_results['manager_class'] = '✅ Manager class exists';
            } else {
                $this->test_results['manager_class'] = '❌ Manager class missing';
                return;
            }
            
            // Check if manager has been initialized
            if (function_exists('fitcopilot_get_training_calendar_manager')) {
                $manager = fitcopilot_get_training_calendar_manager();
                if ($manager) {
                    $this->test_results['manager_init'] = '✅ Manager initialized successfully';
                } else {
                    $this->test_results['manager_init'] = '❌ Manager initialization failed';
                }
            } else {
                $this->test_results['manager_init'] = '❌ Manager helper function missing';
            }
            
            // Check if availability handler exists
            if (class_exists('FitCopilot_Trainer_Availability_Handler')) {
                $this->test_results['availability_handler'] = '✅ Availability handler class exists';
            } else {
                $this->test_results['availability_handler'] = '❌ Availability handler class missing';
            }
            
        } catch (Exception $e) {
            $this->test_results['manager_init'] = '❌ Exception: ' . $e->getMessage();
        }
    }
    
    /**
     * Test 2: AJAX Handler Registration
     */
    private function test_ajax_handler_registration() {
        echo "<h3>Test 2: AJAX Handler Registration</h3>\n";
        
        $ajax_actions = array(
            'get_trainer_assignments',
            'assign_trainer_to_event_type',
            'remove_trainer_assignment',
            'get_assignment_statistics',
            'get_event_type_config',
            'validate_event_type_data'
        );
        
        foreach ($ajax_actions as $action) {
            $hook_name = 'wp_ajax_' . $action;
            if (has_action($hook_name)) {
                $this->test_results["ajax_$action"] = "✅ $action registered";
            } else {
                $this->test_results["ajax_$action"] = "❌ $action NOT registered";
            }
        }
    }
    
    /**
     * Test 3: Event Type Configuration Endpoint
     */
    private function test_event_type_config_endpoint() {
        echo "<h3>Test 3: Event Type Configuration Endpoint</h3>\n";
        
        try {
            // Simulate AJAX request
            $_POST['action'] = 'get_event_type_config';
            $_POST['nonce'] = $this->nonce;
            
            ob_start();
            
            // Create handler instance and test
            if (class_exists('FitCopilot_Trainer_Availability_Handler')) {
                $handler = new FitCopilot_Trainer_Availability_Handler();
                $handler->init();
                
                // Capture output
                $handler->get_event_config();
                $output = ob_get_clean();
                
                // Check if JSON response
                $response = json_decode($output, true);
                if ($response && isset($response['success'])) {
                    if ($response['success']) {
                        $this->test_results['event_config_endpoint'] = '✅ Event config endpoint working';
                        $this->test_results['event_config_data'] = '✅ Found ' . count($response['data']) . ' event types';
                    } else {
                        $this->test_results['event_config_endpoint'] = '❌ Event config endpoint error: ' . ($response['data']['message'] ?? 'Unknown error');
                    }
                } else {
                    $this->test_results['event_config_endpoint'] = '❌ Invalid JSON response: ' . $output;
                }
            } else {
                ob_end_clean();
                $this->test_results['event_config_endpoint'] = '❌ Handler class not available';
            }
            
        } catch (Exception $e) {
            ob_end_clean();
            $this->test_results['event_config_endpoint'] = '❌ Exception: ' . $e->getMessage();
        }
        
        // Clean up
        unset($_POST['action'], $_POST['nonce']);
    }
    
    /**
     * Test 4: Trainer Assignments Endpoint
     */
    private function test_trainer_assignments_endpoint() {
        echo "<h3>Test 4: Trainer Assignments Endpoint</h3>\n";
        
        try {
            // Simulate AJAX request
            $_POST['action'] = 'get_trainer_assignments';
            $_POST['nonce'] = $this->nonce;
            
            ob_start();
            
            if (class_exists('FitCopilot_Trainer_Availability_Handler')) {
                $handler = new FitCopilot_Trainer_Availability_Handler();
                $handler->init();
                
                $handler->get_trainer_assignments();
                $output = ob_get_clean();
                
                $response = json_decode($output, true);
                if ($response && isset($response['success'])) {
                    if ($response['success']) {
                        $this->test_results['assignments_endpoint'] = '✅ Assignments endpoint working';
                        if (isset($response['data']['message'])) {
                            $this->test_results['assignments_data'] = '📝 ' . $response['data']['message'];
                        } else {
                            $assignment_count = count($response['data']['assignments'] ?? $response['data'] ?? array());
                            $this->test_results['assignments_data'] = "✅ Found $assignment_count assignments";
                        }
                    } else {
                        $this->test_results['assignments_endpoint'] = '❌ Assignments endpoint error: ' . ($response['data']['message'] ?? 'Unknown error');
                    }
                } else {
                    $this->test_results['assignments_endpoint'] = '❌ Invalid JSON response: ' . $output;
                }
            } else {
                ob_end_clean();
                $this->test_results['assignments_endpoint'] = '❌ Handler class not available';
            }
            
        } catch (Exception $e) {
            ob_end_clean();
            $this->test_results['assignments_endpoint'] = '❌ Exception: ' . $e->getMessage();
        }
        
        // Clean up
        unset($_POST['action'], $_POST['nonce']);
    }
    
    /**
     * Test 5: Assignment Statistics Endpoint
     */
    private function test_assignment_statistics_endpoint() {
        echo "<h3>Test 5: Assignment Statistics Endpoint</h3>\n";
        
        try {
            $_POST['action'] = 'get_assignment_statistics';
            $_POST['nonce'] = $this->nonce;
            
            ob_start();
            
            if (class_exists('FitCopilot_Trainer_Availability_Handler')) {
                $handler = new FitCopilot_Trainer_Availability_Handler();
                $handler->init();
                
                $handler->get_assignment_statistics();
                $output = ob_get_clean();
                
                $response = json_decode($output, true);
                if ($response && isset($response['success'])) {
                    if ($response['success']) {
                        $this->test_results['statistics_endpoint'] = '✅ Statistics endpoint working';
                        $stats = $response['data']['statistics'];
                        $this->test_results['statistics_data'] = '✅ Stats: ' . 
                            ($stats['total_assignments'] ?? 0) . ' total, ' . 
                            ($stats['active_assignments'] ?? 0) . ' active';
                    } else {
                        $this->test_results['statistics_endpoint'] = '❌ Statistics endpoint error: ' . ($response['data']['message'] ?? 'Unknown error');
                    }
                } else {
                    $this->test_results['statistics_endpoint'] = '❌ Invalid JSON response: ' . $output;
                }
            } else {
                ob_end_clean();
                $this->test_results['statistics_endpoint'] = '❌ Handler class not available';
            }
            
        } catch (Exception $e) {
            ob_end_clean();
            $this->test_results['statistics_endpoint'] = '❌ Exception: ' . $e->getMessage();
        }
        
        unset($_POST['action'], $_POST['nonce']);
    }
    
    /**
     * Test 6: Event Type Validation Endpoint
     */
    private function test_event_type_validation_endpoint() {
        echo "<h3>Test 6: Event Type Validation Endpoint</h3>\n";
        
        try {
            $_POST['action'] = 'validate_event_type_data';
            $_POST['nonce'] = $this->nonce;
            $_POST['event_type'] = 'fitness_assessment';
            $_POST['duration'] = '20';
            
            ob_start();
            
            if (class_exists('FitCopilot_Trainer_Availability_Handler')) {
                $handler = new FitCopilot_Trainer_Availability_Handler();
                $handler->init();
                
                $handler->validate_event_data();
                $output = ob_get_clean();
                
                $response = json_decode($output, true);
                if ($response && isset($response['success'])) {
                    if ($response['success']) {
                        $this->test_results['validation_endpoint'] = '✅ Validation endpoint working';
                        $validation = $response['data'];
                        $this->test_results['validation_data'] = '✅ Validation: ' . 
                            ($validation['valid'] ? 'Passed' : 'Failed');
                    } else {
                        $this->test_results['validation_endpoint'] = '❌ Validation endpoint error: ' . ($response['data']['message'] ?? 'Unknown error');
                    }
                } else {
                    $this->test_results['validation_endpoint'] = '❌ Invalid JSON response: ' . $output;
                }
            } else {
                ob_end_clean();
                $this->test_results['validation_endpoint'] = '❌ Handler class not available';
            }
            
        } catch (Exception $e) {
            ob_end_clean();
            $this->test_results['validation_endpoint'] = '❌ Exception: ' . $e->getMessage();
        }
        
        unset($_POST['action'], $_POST['nonce'], $_POST['event_type'], $_POST['duration']);
    }
    
    /**
     * Test 7: Database Tables
     */
    private function test_database_tables() {
        echo "<h3>Test 7: Database Tables</h3>\n";
        
        global $wpdb;
        
        $tables = array(
            'training_calendar_events' => $wpdb->prefix . 'training_calendar_events',
            'training_calendar_availability' => $wpdb->prefix . 'training_calendar_availability',
            'training_calendar_trainer_assignments' => $wpdb->prefix . 'training_calendar_trainer_assignments'
        );
        
        foreach ($tables as $name => $table_name) {
            $exists = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name)) === $table_name;
            
            if ($exists) {
                $this->test_results["table_$name"] = "✅ Table $name exists";
            } else {
                $this->test_results["table_$name"] = "📝 Table $name missing (will be created when needed)";
            }
        }
    }
    
    /**
     * Display Test Results Summary
     */
    private function display_test_summary() {
        echo "<h2>📊 Test Results Summary</h2>\n";
        
        $passed = 0;
        $failed = 0;
        $warnings = 0;
        
        echo "<table style='border-collapse: collapse; width: 100%; margin-top: 20px;'>\n";
        echo "<thead><tr style='background-color: #f1f1f1;'><th style='padding: 10px; border: 1px solid #ddd; text-align: left;'>Test</th><th style='padding: 10px; border: 1px solid #ddd; text-align: left;'>Result</th></tr></thead>\n";
        echo "<tbody>\n";
        
        foreach ($this->test_results as $test => $result) {
            echo "<tr><td style='padding: 10px; border: 1px solid #ddd;'>$test</td><td style='padding: 10px; border: 1px solid #ddd;'>$result</td></tr>\n";
            
            if (strpos($result, '✅') === 0) {
                $passed++;
            } elseif (strpos($result, '❌') === 0) {
                $failed++;
            } else {
                $warnings++;
            }
        }
        
        echo "</tbody></table>\n";
        
        echo "<div style='margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;'>\n";
        echo "<h3>Summary:</h3>\n";
        echo "<p><strong>✅ Passed:</strong> $passed</p>\n";
        echo "<p><strong>❌ Failed:</strong> $failed</p>\n";
        echo "<p><strong>📝 Warnings:</strong> $warnings</p>\n";
        
        if ($failed === 0) {
            echo "<p style='color: green; font-weight: bold;'>🎉 All critical tests passed! Day 1 fixes appear to be working correctly.</p>\n";
        } else {
            echo "<p style='color: red; font-weight: bold;'>⚠️ Some tests failed. Please review the issues above.</p>\n";
        }
        
        echo "</div>\n";
        
        // Next Steps
        echo "<h3>🚀 Next Steps for Day 2 & 3:</h3>\n";
        echo "<ol>\n";
        echo "<li>Test the frontend Assignment Matrix loading (check browser console for 500 errors)</li>\n";
        echo "<li>Verify AJAX calls from the admin interface work properly</li>\n";
        echo "<li>Test trainer assignment creation/removal through the UI</li>\n";
        echo "<li>Implement any missing database table creation if needed</li>\n";
        echo "</ol>\n";
    }
}

// Run the test suite
$test_suite = new FitCopilot_Training_Calendar_AJAX_Test_Suite();
$test_suite->run_all_tests();
?> 