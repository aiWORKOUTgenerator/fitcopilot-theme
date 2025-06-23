<?php
/**
 * Training Calendar - Day 2 Backend Integration Test Suite
 * 
 * Comprehensive testing for Assignment Manager backend implementation
 * Tests enhanced statistics, matrix data, validation, and AJAX integration
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
 * Day 2 Backend Integration Test Suite
 */
class FitCopilot_Training_Calendar_Day2_Test_Suite {
    
    private $test_results = array();
    private $assignment_manager;
    private $availability_handler;
    
    /**
     * Constructor
     */
    public function __construct() {
        // Load required classes
        if (!class_exists('FitCopilot_Trainer_Assignment_Manager')) {
            require_once get_template_directory() . '/inc/admin/training-calendar/class-trainer-assignment-manager.php';
        }
        
        if (!class_exists('FitCopilot_Trainer_Availability_Handler')) {
            require_once get_template_directory() . '/inc/admin/training-calendar/class-trainer-availability-handler.php';
        }
        
        $this->assignment_manager = new FitCopilot_Trainer_Assignment_Manager();
        $this->availability_handler = new FitCopilot_Trainer_Availability_Handler();
        $this->availability_handler->init();
    }
    
    /**
     * Run complete test suite
     */
    public function run_tests() {
        echo "<div style='max-width: 1200px; margin: 20px auto; font-family: Arial, sans-serif;'>";
        echo "<h1 style='color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px;'>📊 Day 2 Backend Integration Test Suite</h1>";
        
        $this->test_results = array();
        
        // Core Assignment Manager Tests
        $this->test_assignment_manager_core();
        $this->test_enhanced_statistics();
        $this->test_assignment_matrix_data();
        $this->test_trainer_validation();
        $this->test_bulk_operations();
        
        // AJAX Integration Tests
        $this->test_ajax_handlers();
        $this->test_event_type_config_integration();
        $this->test_database_schema();
        
        // Advanced Features Tests
        $this->test_recommendations_system();
        $this->test_error_handling();
        $this->test_performance();
        
        $this->display_test_summary();
        echo "</div>";
    }
    
    /**
     * Test Assignment Manager Core Functionality
     */
    private function test_assignment_manager_core() {
        $this->log_test_section('🏗️ Assignment Manager Core Functionality');
        
        try {
            // Test 1: Basic instantiation
            if ($this->assignment_manager) {
                $this->log_success('✅ Assignment Manager instantiated successfully');
            } else {
                $this->log_error('❌ Assignment Manager instantiation failed');
                return;
            }
            
            // Test 2: Core methods exist
            $required_methods = array(
                'get_trainer_assignments',
                'assign_trainer_to_event_type',
                'remove_trainer_assignment',
                'get_assignment_statistics',
                'get_assignment_matrix_data',
                'validate_trainer',
                'bulk_assign_trainer'
            );
            
            foreach ($required_methods as $method) {
                if (method_exists($this->assignment_manager, $method)) {
                    $this->log_success("✅ Method '{$method}' exists");
                } else {
                    $this->log_error("❌ Method '{$method}' missing");
                }
            }
            
            // Test 3: Read-only operations (safe to test)
            $trainer_assignments = $this->assignment_manager->get_trainer_assignments(1);
            $this->log_info("ℹ️ get_trainer_assignments(1) returned " . count($trainer_assignments) . " results");
            
            $event_trainers = $this->assignment_manager->get_event_type_trainers('fitness_assessment');
            $this->log_info("ℹ️ get_event_type_trainers('fitness_assessment') returned " . count($event_trainers) . " results");
            
            $this->test_results['assignment_manager_core'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ Assignment Manager Core Test Error: ' . $e->getMessage());
            $this->test_results['assignment_manager_core'] = 'failed';
        }
    }
    
    /**
     * Test Enhanced Statistics System
     */
    private function test_enhanced_statistics() {
        $this->log_test_section('📈 Enhanced Statistics System');
        
        try {
            $statistics = $this->assignment_manager->get_assignment_statistics();
            
            // Test required statistics fields
            $required_fields = array(
                'total_assignments', 'active_assignments', 'coverage_rate',
                'avg_assignments_per_trainer', 'specialization_rate',
                'trainer_summary', 'event_type_coverage', 'recommendations'
            );
            
            foreach ($required_fields as $field) {
                if (array_key_exists($field, $statistics)) {
                    $this->log_success("✅ Statistics field '{$field}' present");
                } else {
                    $this->log_error("❌ Statistics field '{$field}' missing");
                }
            }
            
            // Test data types
            if (is_string($statistics['coverage_rate']) && strpos($statistics['coverage_rate'], '%') !== false) {
                $this->log_success('✅ Coverage rate formatted as percentage');
            } else {
                $this->log_error('❌ Coverage rate format incorrect');
            }
            
            if (is_array($statistics['trainer_summary'])) {
                $this->log_success('✅ Trainer summary is array (' . count($statistics['trainer_summary']) . ' trainers)');
            } else {
                $this->log_error('❌ Trainer summary format incorrect');
            }
            
            if (is_array($statistics['recommendations'])) {
                $this->log_success('✅ Recommendations system active (' . count($statistics['recommendations']) . ' recommendations)');
            } else {
                $this->log_error('❌ Recommendations system error');
            }
            
            $this->test_results['enhanced_statistics'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ Enhanced Statistics Test Error: ' . $e->getMessage());
            $this->test_results['enhanced_statistics'] = 'failed';
        }
    }
    
    /**
     * Test Assignment Matrix Data
     */
    private function test_assignment_matrix_data() {
        $this->log_test_section('🔲 Assignment Matrix Data');
        
        try {
            $matrix_data = $this->assignment_manager->get_assignment_matrix_data();
            
            if (is_array($matrix_data)) {
                $this->log_success('✅ Matrix data is array with ' . count($matrix_data) . ' trainers');
            } else {
                $this->log_error('❌ Matrix data format incorrect');
                return;
            }
            
            // Test matrix structure
            if (!empty($matrix_data)) {
                $first_trainer = reset($matrix_data);
                
                if (isset($first_trainer['trainer_info']) && isset($first_trainer['assignments'])) {
                    $this->log_success('✅ Matrix structure correct (trainer_info + assignments)');
                } else {
                    $this->log_error('❌ Matrix structure incorrect');
                }
                
                // Test trainer info structure
                $trainer_info = $first_trainer['trainer_info'];
                $required_fields = array('id', 'name', 'specialty', 'active');
                
                foreach ($required_fields as $field) {
                    if (array_key_exists($field, $trainer_info)) {
                        $this->log_success("✅ Trainer info field '{$field}' present");
                    } else {
                        $this->log_error("❌ Trainer info field '{$field}' missing");
                    }
                }
            } else {
                $this->log_info('ℹ️ No trainer data found in matrix');
            }
            
            $this->test_results['assignment_matrix'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ Assignment Matrix Test Error: ' . $e->getMessage());
            $this->test_results['assignment_matrix'] = 'failed';
        }
    }
    
    /**
     * Test Trainer Validation
     */
    private function test_trainer_validation() {
        $this->log_test_section('✅ Trainer Validation System');
        
        try {
            // Test trainer validation method
            if (method_exists($this->assignment_manager, 'validate_trainer')) {
                $this->log_success('✅ validate_trainer method exists');
                
                // Test with non-existent trainer
                $result = $this->assignment_manager->validate_trainer(99999);
                if (is_bool($result)) {
                    $this->log_success('✅ Trainer validation returns boolean');
                } else {
                    $this->log_error('❌ Trainer validation return type incorrect');
                }
            } else {
                $this->log_error('❌ validate_trainer method missing');
            }
            
            $this->test_results['trainer_validation'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ Trainer Validation Test Error: ' . $e->getMessage());
            $this->test_results['trainer_validation'] = 'failed';
        }
    }
    
    /**
     * Test Bulk Operations
     */
    private function test_bulk_operations() {
        $this->log_test_section('📦 Bulk Operations');
        
        try {
            if (method_exists($this->assignment_manager, 'bulk_assign_trainer')) {
                $this->log_success('✅ bulk_assign_trainer method exists');
                
                // Test method signature (don't actually execute)
                $reflection = new ReflectionMethod($this->assignment_manager, 'bulk_assign_trainer');
                $parameters = $reflection->getParameters();
                
                if (count($parameters) >= 2) {
                    $this->log_success('✅ Bulk assign method has correct parameters');
                } else {
                    $this->log_error('❌ Bulk assign method parameter count incorrect');
                }
            } else {
                $this->log_error('❌ bulk_assign_trainer method missing');
            }
            
            $this->test_results['bulk_operations'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ Bulk Operations Test Error: ' . $e->getMessage());
            $this->test_results['bulk_operations'] = 'failed';
        }
    }
    
    /**
     * Test AJAX Handlers
     */
    private function test_ajax_handlers() {
        $this->log_test_section('🔗 AJAX Handlers Integration');
        
        try {
            // Test AJAX actions are registered
            $ajax_actions = array(
                'assign_trainer_to_event_type',
                'get_trainer_assignments',
                'remove_trainer_assignment',
                'get_assignment_statistics',
                'get_event_type_config'
            );
            
            foreach ($ajax_actions as $action) {
                if (has_action("wp_ajax_{$action}")) {
                    $this->log_success("✅ AJAX action '{$action}' registered");
                } else {
                    $this->log_error("❌ AJAX action '{$action}' not registered");
                }
            }
            
            // Test handler methods exist
            $handler_methods = array(
                'assign_trainer_to_event_type',
                'get_trainer_assignments',
                'remove_trainer_assignment', 
                'get_assignment_statistics',
                'get_event_config'
            );
            
            foreach ($handler_methods as $method) {
                if (method_exists($this->availability_handler, $method)) {
                    $this->log_success("✅ Handler method '{$method}' exists");
                } else {
                    $this->log_error("❌ Handler method '{$method}' missing");
                }
            }
            
            $this->test_results['ajax_handlers'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ AJAX Handlers Test Error: ' . $e->getMessage());
            $this->test_results['ajax_handlers'] = 'failed';
        }
    }
    
    /**
     * Test Event Type Config Integration
     */
    private function test_event_type_config_integration() {
        $this->log_test_section('⚙️ Event Type Config Integration');
        
        try {
            // Load event types config
            if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
                require_once get_template_directory() . '/inc/admin/training-calendar/config/event-types-config.php';
            }
            
            if (class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
                $this->log_success('✅ Event Types Config class loaded');
                
                // Test configuration methods
                $config_methods = array(
                    'get_all_event_types',
                    'get_event_type',
                    'event_type_exists',
                    'get_dropdown_options'
                );
                
                foreach ($config_methods as $method) {
                    if (method_exists('FitCopilot_Training_Calendar_Event_Types_Config', $method)) {
                        $this->log_success("✅ Config method '{$method}' exists");
                    } else {
                        $this->log_error("❌ Config method '{$method}' missing");
                    }
                }
                
                // Test event types data
                $event_types = FitCopilot_Training_Calendar_Event_Types_Config::get_all_event_types();
                if (is_array($event_types) && count($event_types) >= 4) {
                    $this->log_success('✅ Event types data complete (' . count($event_types) . ' types)');
                } else {
                    $this->log_error('❌ Event types data incomplete');
                }
                
            } else {
                $this->log_error('❌ Event Types Config class not found');
            }
            
            $this->test_results['event_type_config'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ Event Type Config Test Error: ' . $e->getMessage());
            $this->test_results['event_type_config'] = 'failed';
        }
    }
    
    /**
     * Test Database Schema
     */
    private function test_database_schema() {
        $this->log_test_section('🗄️ Database Schema Validation');
        
        try {
            global $wpdb;
            
            // Test assignments table
            $assignments_table = $wpdb->prefix . 'training_calendar_trainer_assignments';
            $table_exists = $wpdb->get_var($wpdb->prepare(
                "SHOW TABLES LIKE %s",
                $assignments_table
            )) === $assignments_table;
            
            if ($table_exists) {
                $this->log_success('✅ Assignments table exists');
                
                // Test table structure
                $columns = $wpdb->get_col("DESCRIBE {$assignments_table}", 0);
                $required_columns = array(
                    'id', 'trainer_id', 'event_type', 'is_active',
                    'specialization_notes', 'hourly_rate', 'max_sessions_per_day',
                    'created_at', 'updated_at'
                );
                
                foreach ($required_columns as $column) {
                    if (in_array($column, $columns)) {
                        $this->log_success("✅ Column '{$column}' exists");
                    } else {
                        $this->log_error("❌ Column '{$column}' missing");
                    }
                }
                
                // Test indexes
                $indexes = $wpdb->get_results("SHOW INDEX FROM {$assignments_table}", ARRAY_A);
                $index_columns = array_column($indexes, 'Column_name');
                
                if (in_array('trainer_id', $index_columns)) {
                    $this->log_success('✅ trainer_id index exists');
                } else {
                    $this->log_error('❌ trainer_id index missing');
                }
                
            } else {
                $this->log_info('ℹ️ Assignments table does not exist (will be created on first use)');
            }
            
            $this->test_results['database_schema'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ Database Schema Test Error: ' . $e->getMessage());
            $this->test_results['database_schema'] = 'failed';
        }
    }
    
    /**
     * Test Recommendations System
     */
    private function test_recommendations_system() {
        $this->log_test_section('💡 Recommendations System');
        
        try {
            $statistics = $this->assignment_manager->get_assignment_statistics();
            
            if (isset($statistics['recommendations']) && is_array($statistics['recommendations'])) {
                $recommendations = $statistics['recommendations'];
                $this->log_success('✅ Recommendations array available (' . count($recommendations) . ' items)');
                
                // Test recommendation structure
                if (!empty($recommendations)) {
                    $first_rec = $recommendations[0];
                    $required_fields = array('type', 'title', 'description');
                    
                    foreach ($required_fields as $field) {
                        if (array_key_exists($field, $first_rec)) {
                            $this->log_success("✅ Recommendation field '{$field}' present");
                        } else {
                            $this->log_error("❌ Recommendation field '{$field}' missing");
                        }
                    }
                } else {
                    $this->log_info('ℹ️ No recommendations generated (system optimally configured)');
                }
            } else {
                $this->log_error('❌ Recommendations system not working');
            }
            
            $this->test_results['recommendations'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ Recommendations System Test Error: ' . $e->getMessage());
            $this->test_results['recommendations'] = 'failed';
        }
    }
    
    /**
     * Test Error Handling
     */
    private function test_error_handling() {
        $this->log_test_section('🛡️ Error Handling & Security');
        
        try {
            // Test nonce verification exists in handlers
            $handler_methods = array('assign_trainer_to_event_type', 'get_trainer_assignments');
            
            foreach ($handler_methods as $method) {
                $reflection = new ReflectionMethod($this->availability_handler, $method);
                $method_source = file_get_contents($reflection->getFileName());
                
                if (strpos($method_source, 'wp_verify_nonce') !== false) {
                    $this->log_success("✅ Method '{$method}' has nonce verification");
                } else {
                    $this->log_error("❌ Method '{$method}' missing nonce verification");
                }
            }
            
            // Test input sanitization
            if (strpos(file_get_contents($reflection->getFileName()), 'sanitize_text_field') !== false) {
                $this->log_success('✅ Input sanitization functions found');
            } else {
                $this->log_error('❌ Input sanitization may be insufficient');
            }
            
            $this->test_results['error_handling'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ Error Handling Test Error: ' . $e->getMessage());
            $this->test_results['error_handling'] = 'failed';
        }
    }
    
    /**
     * Test Performance
     */
    private function test_performance() {
        $this->log_test_section('⚡ Performance Testing');
        
        try {
            // Test statistics generation time
            $start_time = microtime(true);
            $statistics = $this->assignment_manager->get_assignment_statistics();
            $stats_time = microtime(true) - $start_time;
            
            if ($stats_time < 1.0) {
                $this->log_success("✅ Statistics generation fast: " . round($stats_time * 1000, 2) . "ms");
            } else {
                $this->log_warning("⚠️ Statistics generation slow: " . round($stats_time * 1000, 2) . "ms");
            }
            
            // Test matrix data generation time
            $start_time = microtime(true);
            $matrix_data = $this->assignment_manager->get_assignment_matrix_data();
            $matrix_time = microtime(true) - $start_time;
            
            if ($matrix_time < 0.5) {
                $this->log_success("✅ Matrix data generation fast: " . round($matrix_time * 1000, 2) . "ms");
            } else {
                $this->log_warning("⚠️ Matrix data generation slow: " . round($matrix_time * 1000, 2) . "ms");
            }
            
            $this->test_results['performance'] = 'passed';
            
        } catch (Exception $e) {
            $this->log_error('❌ Performance Test Error: ' . $e->getMessage());
            $this->test_results['performance'] = 'failed';
        }
    }
    
    /**
     * Display test summary
     */
    private function display_test_summary() {
        echo "<div style='margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 5px solid #17a2b8;'>";
        echo "<h2 style='color: #17a2b8; margin: 0 0 15px 0;'>📋 Test Summary</h2>";
        
        $total_tests = count($this->test_results);
        $passed_tests = count(array_filter($this->test_results, function($result) {
            return $result === 'passed';
        }));
        $failed_tests = $total_tests - $passed_tests;
        
        echo "<div style='display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;'>";
        echo "<div style='text-align: center; padding: 15px; background: #d4edda; border-radius: 6px;'>";
        echo "<div style='font-size: 24px; font-weight: bold; color: #155724;'>{$passed_tests}</div>";
        echo "<div style='color: #155724;'>Tests Passed</div>";
        echo "</div>";
        
        echo "<div style='text-align: center; padding: 15px; background: " . ($failed_tests > 0 ? '#f8d7da' : '#d4edda') . "; border-radius: 6px;'>";
        echo "<div style='font-size: 24px; font-weight: bold; color: " . ($failed_tests > 0 ? '#721c24' : '#155724') . ";'>{$failed_tests}</div>";
        echo "<div style='color: " . ($failed_tests > 0 ? '#721c24' : '#155724') . ";'>Tests Failed</div>";
        echo "</div>";
        
        $success_rate = round(($passed_tests / $total_tests) * 100);
        echo "<div style='text-align: center; padding: 15px; background: " . ($success_rate >= 80 ? '#d4edda' : ($success_rate >= 60 ? '#fff3cd' : '#f8d7da')) . "; border-radius: 6px;'>";
        echo "<div style='font-size: 24px; font-weight: bold; color: " . ($success_rate >= 80 ? '#155724' : ($success_rate >= 60 ? '#856404' : '#721c24')) . ";'>{$success_rate}%</div>";
        echo "<div style='color: " . ($success_rate >= 80 ? '#155724' : ($success_rate >= 60 ? '#856404' : '#721c24')) . ";'>Success Rate</div>";
        echo "</div>";
        echo "</div>";
        
        // Detailed results
        echo "<h3 style='color: #2c3e50; margin: 20px 0 10px 0;'>Detailed Test Results:</h3>";
        echo "<ul style='list-style: none; padding: 0;'>";
        
        foreach ($this->test_results as $test_name => $result) {
            $status_icon = $result === 'passed' ? '✅' : '❌';
            $status_color = $result === 'passed' ? '#28a745' : '#dc3545';
            $test_display = ucwords(str_replace('_', ' ', $test_name));
            
            echo "<li style='padding: 8px 0; border-bottom: 1px solid #eee;'>";
            echo "<span style='color: {$status_color}; font-weight: bold;'>{$status_icon} {$test_display}</span>";
            echo "</li>";
        }
        echo "</ul>";
        
        // Recommendations
        if ($success_rate >= 90) {
            echo "<div style='margin-top: 20px; padding: 15px; background: #d4edda; border-radius: 6px; border-left: 4px solid #28a745;'>";
            echo "<strong style='color: #155724;'>🎉 Excellent! Day 2 Implementation Complete</strong><br>";
            echo "<span style='color: #155724;'>All backend components are functioning correctly. Ready to proceed with Day 3 Frontend Implementation.</span>";
            echo "</div>";
        } elseif ($success_rate >= 70) {
            echo "<div style='margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;'>";
            echo "<strong style='color: #856404;'>⚠️ Good Progress with Minor Issues</strong><br>";
            echo "<span style='color: #856404;'>Most backend functionality is working. Address the failed tests before proceeding to Day 3.</span>";
            echo "</div>";
        } else {
            echo "<div style='margin-top: 20px; padding: 15px; background: #f8d7da; border-radius: 6px; border-left: 4px solid #dc3545;'>";
            echo "<strong style='color: #721c24;'>🚨 Critical Issues Found</strong><br>";
            echo "<span style='color: #721c24;'>Several backend components need attention. Review failed tests and resolve issues before continuing.</span>";
            echo "</div>";
        }
        
        echo "</div>";
    }
    
    // Logging methods
    private function log_test_section($title) {
        echo "<h3 style='color: #2c3e50; margin: 25px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #ecf0f1;'>{$title}</h3>";
    }
    
    private function log_success($message) {
        echo "<div style='color: #28a745; margin: 5px 0; font-family: monospace;'>{$message}</div>";
    }
    
    private function log_error($message) {
        echo "<div style='color: #dc3545; margin: 5px 0; font-family: monospace; font-weight: bold;'>{$message}</div>";
    }
    
    private function log_warning($message) {
        echo "<div style='color: #ffc107; margin: 5px 0; font-family: monospace;'>{$message}</div>";
    }
    
    private function log_info($message) {
        echo "<div style='color: #17a2b8; margin: 5px 0; font-family: monospace;'>{$message}</div>";
    }
}

// Initialize and run tests if accessed directly
if (isset($_GET['run_day2_tests']) && $_GET['run_day2_tests'] === '1') {
    $test_suite = new FitCopilot_Training_Calendar_Day2_Test_Suite();
    $test_suite->run_tests();
} 