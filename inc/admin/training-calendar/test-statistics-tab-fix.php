<?php
/**
 * Test Statistics Tab Fix Implementation
 * 
 * Comprehensive testing for Assignment Statistics debugging
 * Part of Day 4: Assignment Statistics Debug Sprint
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class FitCopilot_Statistics_Tab_Test {
    
    private $test_results = array();
    
    /**
     * Run all tests
     */
    public function run_all_tests() {
        echo "<div style='max-width: 1200px; margin: 20px; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;'>";
        echo "<h1 style='color: #1d2327; border-bottom: 2px solid #007cba; padding-bottom: 10px;'>📊 Statistics Tab Fix - Test Results</h1>";
        
        // Test 1: Backend Components
        $this->test_backend_components();
        
        // Test 2: AJAX Handler
        $this->test_ajax_handler();
        
        // Test 3: DOM Elements
        $this->test_dom_elements();
        
        // Test 4: Statistics Data
        $this->test_statistics_data();
        
        // Test 5: JavaScript Integration
        $this->test_javascript_integration();
        
        // Display Summary
        $this->display_test_summary();
        
        echo "</div>";
    }
    
    /**
     * Test 1: Backend Components
     */
    private function test_backend_components() {
        echo "<h2 style='color: #007cba; margin-top: 30px;'>🔧 Test 1: Backend Components</h2>";
        
        // Test assignment manager exists
        if (class_exists('FitCopilot_Trainer_Assignment_Manager')) {
            $this->test_results['assignment_manager'] = '✅ Assignment Manager class exists';
            
            $manager = new FitCopilot_Trainer_Assignment_Manager();
            
            // Test statistics method exists
            if (method_exists($manager, 'get_assignment_statistics')) {
                $this->test_results['statistics_method'] = '✅ get_assignment_statistics() method exists';
                
                try {
                    $stats = $manager->get_assignment_statistics();
                    $this->test_results['statistics_execution'] = '✅ Statistics method executes without errors';
                    $this->test_results['statistics_structure'] = '✅ Returns array with ' . count($stats) . ' properties';
                } catch (Exception $e) {
                    $this->test_results['statistics_execution'] = '❌ Statistics method error: ' . $e->getMessage();
                }
            } else {
                $this->test_results['statistics_method'] = '❌ get_assignment_statistics() method missing';
            }
        } else {
            $this->test_results['assignment_manager'] = '❌ Assignment Manager class missing';
        }
        
        // Test handler class
        if (class_exists('FitCopilot_Trainer_Availability_Handler')) {
            $this->test_results['handler_class'] = '✅ Availability Handler class exists';
            
            $handler = new FitCopilot_Trainer_Availability_Handler();
            
            if (method_exists($handler, 'get_assignment_statistics')) {
                $this->test_results['handler_method'] = '✅ AJAX handler method exists';
            } else {
                $this->test_results['handler_method'] = '❌ AJAX handler method missing';
            }
        } else {
            $this->test_results['handler_class'] = '❌ Availability Handler class missing';
        }
    }
    
    /**
     * Test 2: AJAX Handler Registration
     */
    private function test_ajax_handler() {
        echo "<h2 style='color: #007cba; margin-top: 30px;'>📡 Test 2: AJAX Handler Registration</h2>";
        
        // Check if action is registered
        $registered_actions = array();
        
        global $wp_filter;
        if (isset($wp_filter['wp_ajax_get_assignment_statistics'])) {
            $this->test_results['ajax_registration'] = '✅ get_assignment_statistics AJAX action registered';
            $registered_actions[] = 'wp_ajax_get_assignment_statistics';
        } else {
            $this->test_results['ajax_registration'] = '❌ get_assignment_statistics AJAX action NOT registered';
        }
        
        // Test AJAX response
        if (!empty($registered_actions)) {
            $this->test_results['ajax_ready'] = '✅ AJAX endpoint ready for testing';
        } else {
            $this->test_results['ajax_ready'] = '❌ AJAX endpoint not available';
        }
    }
    
    /**
     * Test 3: DOM Elements (Template Check)
     */
    private function test_dom_elements() {
        echo "<h2 style='color: #007cba; margin-top: 30px;'>🏗️ Test 3: DOM Elements</h2>";
        
        $template_path = get_template_directory() . '/inc/admin/training-calendar/templates/trainer-availability-modal.php';
        
        if (file_exists($template_path)) {
            $this->test_results['template_exists'] = '✅ Modal template file exists';
            
            $template_content = file_get_contents($template_path);
            
            // Check for required DOM elements
            $required_elements = array(
                '#stat-total-assignments' => 'Total assignments metric',
                '#stat-coverage-rate' => 'Coverage rate metric',
                '#stat-avg-assignments' => 'Average assignments metric',
                '#stat-specialization-rate' => 'Specialization rate metric',
                '#certification-chart' => 'Certification chart container',
                '#availability-heatmap' => 'Availability heatmap container',
                '#workload-distribution' => 'Workload distribution container',
                '#performance-trends' => 'Performance trends container',
                '#recommendations-list' => 'Recommendations list container',
                '#trainer-summary-table' => 'Trainer summary table container'
            );
            
            foreach ($required_elements as $element_id => $description) {
                $id_without_hash = str_replace('#', '', $element_id);
                if (strpos($template_content, 'id="' . $id_without_hash . '"') !== false) {
                    $this->test_results['element_' . $id_without_hash] = '✅ ' . $description . ' exists';
                } else {
                    $this->test_results['element_' . $id_without_hash] = '❌ ' . $description . ' missing';
                }
            }
            
        } else {
            $this->test_results['template_exists'] = '❌ Modal template file missing';
        }
    }
    
    /**
     * Test 4: Statistics Data Structure
     */
    private function test_statistics_data() {
        echo "<h2 style='color: #007cba; margin-top: 30px;'>📊 Test 4: Statistics Data Structure</h2>";
        
        if (class_exists('FitCopilot_Trainer_Assignment_Manager')) {
            $manager = new FitCopilot_Trainer_Assignment_Manager();
            
            try {
                $stats = $manager->get_assignment_statistics();
                
                // Check required fields
                $required_fields = array(
                    'total_assignments',
                    'active_assignments', 
                    'trainers_with_assignments',
                    'coverage_rate',
                    'avg_assignments_per_trainer',
                    'specialization_rate',
                    'trainer_summary',
                    'event_type_coverage',
                    'recommendations'
                );
                
                foreach ($required_fields as $field) {
                    if (array_key_exists($field, $stats)) {
                        $this->test_results['field_' . $field] = '✅ ' . $field . ' field present';
                    } else {
                        $this->test_results['field_' . $field] = '❌ ' . $field . ' field missing';
                    }
                }
                
                // Test data types
                $this->test_results['coverage_rate_format'] = is_string($stats['coverage_rate']) ? '✅ Coverage rate is string' : '❌ Coverage rate wrong type';
                $this->test_results['recommendations_array'] = is_array($stats['recommendations']) ? '✅ Recommendations is array' : '❌ Recommendations wrong type';
                $this->test_results['trainer_summary_array'] = is_array($stats['trainer_summary']) ? '✅ Trainer summary is array' : '❌ Trainer summary wrong type';
                
            } catch (Exception $e) {
                $this->test_results['statistics_data_error'] = '❌ Statistics data error: ' . $e->getMessage();
            }
        }
    }
    
    /**
     * Test 5: JavaScript Integration
     */
    private function test_javascript_integration() {
        echo "<h2 style='color: #007cba; margin-top: 30px;'>⚡ Test 5: JavaScript Integration</h2>";
        
        $js_file_path = get_template_directory() . '/assets/admin/js/training-calendar/modules/assignment-manager.js';
        
        if (file_exists($js_file_path)) {
            $this->test_results['js_file_exists'] = '✅ Assignment manager JS file exists';
            
            $js_content = file_get_contents($js_file_path);
            
            // Check for key methods
            $required_methods = array(
                'onStatisticsTabActivated' => 'Tab activation handler',
                'loadAssignmentStatistics' => 'Statistics loading method',
                'renderStatistics' => 'Statistics rendering method',
                'renderCoverageBars' => 'Coverage bars rendering',
                'renderRecommendations' => 'Recommendations rendering'
            );
            
            foreach ($required_methods as $method => $description) {
                if (strpos($js_content, $method . ':') !== false || strpos($js_content, $method . ' :') !== false) {
                    $this->test_results['js_method_' . $method] = '✅ ' . $description . ' method exists';
                } else {
                    $this->test_results['js_method_' . $method] = '❌ ' . $description . ' method missing';
                }
            }
            
            // Check AJAX call
            if (strpos($js_content, 'get_assignment_statistics') !== false) {
                $this->test_results['js_ajax_call'] = '✅ AJAX call to get_assignment_statistics found';
            } else {
                $this->test_results['js_ajax_call'] = '❌ AJAX call to get_assignment_statistics missing';
            }
            
            // Check for debugging code
            if (strpos($js_content, 'console.log') !== false && strpos($js_content, 'Statistics tab activated') !== false) {
                $this->test_results['js_debugging'] = '✅ Debug logging added';
            } else {
                $this->test_results['js_debugging'] = '❌ Debug logging missing';
            }
            
        } else {
            $this->test_results['js_file_exists'] = '❌ Assignment manager JS file missing';
        }
    }
    
    /**
     * Display test summary
     */
    private function display_test_summary() {
        echo "<h2 style='color: #007cba; margin-top: 30px;'>📋 Test Summary</h2>";
        
        $total_tests = count($this->test_results);
        $passed_tests = count(array_filter($this->test_results, function($result) {
            return strpos($result, '✅') === 0;
        }));
        $failed_tests = $total_tests - $passed_tests;
        
        echo "<div style='background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;'>";
        echo "<h3 style='margin: 0 0 15px 0; color: #1d2327;'>Overall Results</h3>";
        echo "<div style='display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;'>";
        
        echo "<div style='text-align: center; padding: 15px; background: white; border-radius: 6px; border: 1px solid #ddd;'>";
        echo "<div style='font-size: 32px; font-weight: bold; color: #10b981;'>{$total_tests}</div>";
        echo "<div style='font-size: 14px; color: #666;'>Total Tests</div>";
        echo "</div>";
        
        echo "<div style='text-align: center; padding: 15px; background: white; border-radius: 6px; border: 1px solid #ddd;'>";
        echo "<div style='font-size: 32px; font-weight: bold; color: #10b981;'>{$passed_tests}</div>";
        echo "<div style='font-size: 14px; color: #666;'>Tests Passed</div>";
        echo "</div>";
        
        echo "<div style='text-align: center; padding: 15px; background: white; border-radius: 6px; border: 1px solid #ddd;'>";
        echo "<div style='font-size: 32px; font-weight: bold; color: " . ($failed_tests > 0 ? '#dc3545' : '#10b981') . ";'>{$failed_tests}</div>";
        echo "<div style='font-size: 14px; color: #666;'>Tests Failed</div>";
        echo "</div>";
        
        $success_rate = round(($passed_tests / $total_tests) * 100);
        echo "<div style='text-align: center; padding: 15px; background: white; border-radius: 6px; border: 1px solid #ddd;'>";
        echo "<div style='font-size: 32px; font-weight: bold; color: " . ($success_rate >= 80 ? '#10b981' : '#dc3545') . ";'>{$success_rate}%</div>";
        echo "<div style='font-size: 14px; color: #666;'>Success Rate</div>";
        echo "</div>";
        
        echo "</div>";
        
        // Status message
        if ($success_rate >= 90) {
            echo "<div style='padding: 15px; background: #d1e7dd; color: #0f5132; border-radius: 6px; margin-top: 15px;'>";
            echo "<strong>🎉 Excellent!</strong> Statistics tab fix is ready for production.";
            echo "</div>";
        } elseif ($success_rate >= 70) {
            echo "<div style='padding: 15px; background: #fff3cd; color: #664d03; border-radius: 6px; margin-top: 15px;'>";
            echo "<strong>⚠️ Good Progress!</strong> Most components working, minor issues to resolve.";
            echo "</div>";
        } else {
            echo "<div style='padding: 15px; background: #f8d7da; color: #721c24; border-radius: 6px; margin-top: 15px;'>";
            echo "<strong>❌ Needs Work!</strong> Major issues found, additional debugging required.";
            echo "</div>";
        }
        
        echo "</div>";
        
        // Detailed results
        echo "<h3 style='color: #1d2327; margin-top: 30px;'>Detailed Test Results</h3>";
        echo "<div style='background: white; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>";
        
        foreach ($this->test_results as $test_name => $result) {
            $is_passed = strpos($result, '✅') === 0;
            $bg_color = $is_passed ? '#f8f9fa' : '#fff5f5';
            
            echo "<div style='padding: 12px 20px; border-bottom: 1px solid #eee; background: {$bg_color};'>";
            echo "<strong>" . ucwords(str_replace('_', ' ', $test_name)) . ":</strong> {$result}";
            echo "</div>";
        }
        
        echo "</div>";
        
        // Next steps
        if ($failed_tests > 0) {
            echo "<h3 style='color: #1d2327; margin-top: 30px;'>🔧 Next Steps</h3>";
            echo "<div style='background: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffeaa7;'>";
            echo "<ol style='margin: 0; padding-left: 20px;'>";
            echo "<li>Review failed tests above</li>";
            echo "<li>Check browser console for JavaScript errors</li>";
            echo "<li>Verify AJAX endpoint is accessible via network tab</li>";
            echo "<li>Test modal tab switching functionality</li>";
            echo "<li>Validate DOM element IDs match JavaScript selectors</li>";
            echo "</ol>";
            echo "</div>";
        }
    }
}

// Create test instance and run tests if accessed directly
if (isset($_GET['run_statistics_test']) && $_GET['run_statistics_test'] === '1') {
    $test = new FitCopilot_Statistics_Tab_Test();
    $test->run_all_tests();
    exit;
} 