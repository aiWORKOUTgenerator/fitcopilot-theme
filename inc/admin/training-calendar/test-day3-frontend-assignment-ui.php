<?php
/**
 * Day 3 Frontend Assignment UI - Comprehensive Test Suite
 * 
 * Tests the complete Day 3 implementation including:
 * - Modal interface with tabs
 * - Assignment manager JavaScript module
 * - Integration with Day 2 backend
 * - UI components and styling
 * - Responsive design
 * - Accessibility features
 * 
 * Run this test: /wp-admin/admin.php?page=fitcopilot-training-calendar&test_day3=1
 */

// Security check
if (!defined('ABSPATH') || !current_user_can('manage_options')) {
    die('Access denied');
}

class FitCopilot_Training_Calendar_Day3_Test {
    
    private $test_results = array();
    private $error_count = 0;
    private $success_count = 0;
    
    public function __construct() {
        add_action('admin_init', array($this, 'run_tests'));
    }
    
    public function run_tests() {
        if (!isset($_GET['test_day3']) || $_GET['test_day3'] !== '1') {
            return;
        }
        
        echo '<div class="wrap">';
        echo '<h1>🚀 Day 3: Frontend Assignment UI - Test Suite</h1>';
        echo '<div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">';
        
        $this->test_modal_template();
        $this->test_javascript_module();
        $this->test_css_styles();
        $this->test_backend_integration();
        $this->test_responsive_design();
        $this->test_accessibility();
        $this->test_user_experience();
        
        $this->display_results();
        echo '</div>';
        echo '</div>';
    }
    
    /**
     * Test modal template structure
     */
    private function test_modal_template() {
        $this->log_test_section('📋 Modal Template Structure');
        
        // Check if modal template file exists
        $template_path = get_template_directory() . '/inc/admin/training-calendar/templates/trainer-availability-modal.php';
        if (!file_exists($template_path)) {
            $this->log_error('Modal template file not found: ' . $template_path);
            return;
        }
        
        $template_content = file_get_contents($template_path);
        
        // Test tab navigation structure
        if (strpos($template_content, 'modal-tabs') !== false) {
            $this->log_success('✅ Tab navigation structure found');
        } else {
            $this->log_error('❌ Tab navigation structure missing');
        }
        
        // Test tab buttons
        $required_tabs = array('availability', 'assignments', 'statistics');
        foreach ($required_tabs as $tab) {
            if (strpos($template_content, 'data-tab="' . $tab . '"') !== false) {
                $this->log_success("✅ {$tab} tab button found");
            } else {
                $this->log_error("❌ {$tab} tab button missing");
            }
        }
        
        // Test assignment dashboard
        if (strpos($template_content, 'assignment-dashboard') !== false) {
            $this->log_success('✅ Assignment dashboard section found');
        } else {
            $this->log_error('❌ Assignment dashboard section missing');
        }
        
        // Test assignment matrix
        if (strpos($template_content, 'assignment-matrix') !== false) {
            $this->log_success('✅ Assignment matrix container found');
        } else {
            $this->log_error('❌ Assignment matrix container missing');
        }
        
        // Test individual assignment form
        if (strpos($template_content, 'individual-assignment-form') !== false) {
            $this->log_success('✅ Individual assignment form found');
        } else {
            $this->log_error('❌ Individual assignment form missing');
        }
        
        // Test statistics dashboard
        if (strpos($template_content, 'statistics-dashboard') !== false) {
            $this->log_success('✅ Statistics dashboard found');
        } else {
            $this->log_error('❌ Statistics dashboard missing');
        }
        
        // Test event type selectors
        $event_types = array('fitness_assessment', 'personal_training', 'group_fitness', 'group_forum');
        foreach ($event_types as $event_type) {
            if (strpos($template_content, 'value="' . $event_type . '"') !== false) {
                $this->log_success("✅ {$event_type} option found");
            } else {
                $this->log_error("❌ {$event_type} option missing");
            }
        }
    }
    
    /**
     * Test JavaScript module
     */
    private function test_javascript_module() {
        $this->log_test_section('🔧 JavaScript Assignment Manager Module');
        
        // Check if JavaScript file exists
        $js_path = get_template_directory() . '/assets/admin/js/training-calendar/modules/assignment-manager.js';
        if (!file_exists($js_path)) {
            $this->log_error('Assignment manager JavaScript file not found: ' . $js_path);
            return;
        }
        
        $js_content = file_get_contents($js_path);
        
        // Test module structure
        if (strpos($js_content, 'TrainerAvailabilityAssignmentManager') !== false) {
            $this->log_success('✅ Assignment manager module defined');
        } else {
            $this->log_error('❌ Assignment manager module not defined');
        }
        
        // Test required methods
        $required_methods = array(
            'init',
            'loadAssignmentMatrix',
            'onMatrixCheckboxChange',
            'quickAssignTrainer',
            'quickRemoveAssignment',
            'saveAssignment',
            'loadAssignmentStatistics',
            'renderStatistics'
        );
        
        foreach ($required_methods as $method) {
            if (strpos($js_content, $method . ':') !== false || strpos($js_content, $method . '(') !== false) {
                $this->log_success("✅ {$method} method found");
            } else {
                $this->log_error("❌ {$method} method missing");
            }
        }
        
        // Test AJAX integration
        $ajax_actions = array(
            'get_trainer_assignments',
            'assign_trainer_to_event_type',
            'remove_trainer_assignment',
            'get_assignment_statistics'
        );
        
        foreach ($ajax_actions as $action) {
            if (strpos($js_content, "action: '" . $action . "'") !== false) {
                $this->log_success("✅ {$action} AJAX action found");
            } else {
                $this->log_error("❌ {$action} AJAX action missing");
            }
        }
        
        // Test event type configuration
        if (strpos($js_content, 'fitness_assessment') !== false && 
            strpos($js_content, 'personal_training') !== false) {
            $this->log_success('✅ Event type configuration found');
        } else {
            $this->log_error('❌ Event type configuration missing');
        }
    }
    
    /**
     * Test CSS styles
     */
    private function test_css_styles() {
        $this->log_test_section('🎨 CSS Styles');
        
        // Check if CSS file exists
        $css_path = get_template_directory() . '/assets/admin/css/training-calendar/training-calendar-admin.css';
        if (!file_exists($css_path)) {
            $this->log_error('CSS file not found: ' . $css_path);
            return;
        }
        
        $css_content = file_get_contents($css_path);
        
        // Test tab styles
        $tab_styles = array(
            '.modal-tabs',
            '.tab-button',
            '.tab-content',
            '.tab-button.active'
        );
        
        foreach ($tab_styles as $style) {
            if (strpos($css_content, $style) !== false) {
                $this->log_success("✅ {$style} style found");
            } else {
                $this->log_error("❌ {$style} style missing");
            }
        }
        
        // Test assignment matrix styles
        $matrix_styles = array(
            '.assignment-matrix-grid',
            '.matrix-cell',
            '.matrix-cell.assigned',
            '.assignment-checkbox'
        );
        
        foreach ($matrix_styles as $style) {
            if (strpos($css_content, $style) !== false) {
                $this->log_success("✅ {$style} style found");
            } else {
                $this->log_error("❌ {$style} style missing");
            }
        }
        
        // Test dashboard styles
        $dashboard_styles = array(
            '.assignment-dashboard',
            '.dashboard-stats',
            '.stat-item',
            '.quick-actions'
        );
        
        foreach ($dashboard_styles as $style) {
            if (strpos($css_content, $style) !== false) {
                $this->log_success("✅ {$style} style found");
            } else {
                $this->log_error("❌ {$style} style missing");
            }
        }
        
        // Test responsive design
        if (strpos($css_content, '@media (max-width: 768px)') !== false) {
            $this->log_success('✅ Mobile responsive styles found');
        } else {
            $this->log_error('❌ Mobile responsive styles missing');
        }
        
        // Test accessibility
        if (strpos($css_content, 'prefers-reduced-motion') !== false) {
            $this->log_success('✅ Accessibility motion preferences found');
        } else {
            $this->log_error('❌ Accessibility motion preferences missing');
        }
    }
    
    /**
     * Test backend integration
     */
    private function test_backend_integration() {
        $this->log_test_section('🔗 Backend Integration');
        
        // Test Training Calendar Manager integration
        if (class_exists('FitCopilot_Training_Calendar_Manager')) {
            $this->log_success('✅ Training Calendar Manager class exists');
            
            // Check if assignment manager JavaScript is loaded
            $manager = new FitCopilot_Training_Calendar_Manager();
            if (method_exists($manager, 'enqueue_feature_scripts')) {
                $this->log_success('✅ Script loading method exists');
            } else {
                $this->log_error('❌ Script loading method missing');
            }
        } else {
            $this->log_error('❌ Training Calendar Manager class not found');
        }
        
        // Test Assignment Manager backend class
        if (class_exists('FitCopilot_Training_Calendar_Trainer_Assignment_Manager')) {
            $this->log_success('✅ Assignment Manager backend class exists');
        } else {
            $this->log_error('❌ Assignment Manager backend class not found');
        }
        
        // Test AJAX Handler integration
        if (class_exists('FitCopilot_Training_Calendar_Trainer_Availability_Handler')) {
            $this->log_success('✅ AJAX Handler class exists');
            
            // Check for assignment-related AJAX actions
            $handler = new FitCopilot_Training_Calendar_Trainer_Availability_Handler();
            $reflection = new ReflectionClass($handler);
            $methods = $reflection->getMethods();
            
            $ajax_methods = array();
            foreach ($methods as $method) {
                if (strpos($method->getName(), 'handle_') === 0) {
                    $ajax_methods[] = $method->getName();
                }
            }
            
            if (count($ajax_methods) >= 4) {
                $this->log_success('✅ AJAX handler methods found (' . count($ajax_methods) . ')');
            } else {
                $this->log_error('❌ Insufficient AJAX handler methods');
            }
        } else {
            $this->log_error('❌ AJAX Handler class not found');
        }
        
        // Test Event Types Config
        if (class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            $this->log_success('✅ Event Types Config class exists');
        } else {
            $this->log_error('❌ Event Types Config class not found');
        }
    }
    
    /**
     * Test responsive design
     */
    private function test_responsive_design() {
        $this->log_test_section('📱 Responsive Design');
        
        $css_path = get_template_directory() . '/assets/admin/css/training-calendar/training-calendar-admin.css';
        if (!file_exists($css_path)) {
            $this->log_error('CSS file not found for responsive testing');
            return;
        }
        
        $css_content = file_get_contents($css_path);
        
        // Test breakpoints
        $breakpoints = array(
            '@media (max-width: 1024px)',
            '@media (max-width: 768px)',
            '@media (max-width: 480px)'
        );
        
        foreach ($breakpoints as $breakpoint) {
            if (strpos($css_content, $breakpoint) !== false) {
                $this->log_success("✅ {$breakpoint} breakpoint found");
            } else {
                $this->log_error("❌ {$breakpoint} breakpoint missing");
            }
        }
        
        // Test mobile-specific styles
        $mobile_styles = array(
            'flex-direction: column',
            'grid-template-columns: 1fr',
            'max-width: calc(100% - 20px)'
        );
        
        $mobile_style_count = 0;
        foreach ($mobile_styles as $style) {
            if (strpos($css_content, $style) !== false) {
                $mobile_style_count++;
            }
        }
        
        if ($mobile_style_count >= 2) {
            $this->log_success("✅ Mobile-specific styles found ({$mobile_style_count})");
        } else {
            $this->log_error("❌ Insufficient mobile-specific styles ({$mobile_style_count})");
        }
    }
    
    /**
     * Test accessibility features
     */
    private function test_accessibility() {
        $this->log_test_section('♿ Accessibility Features');
        
        // Test modal template accessibility
        $template_path = get_template_directory() . '/inc/admin/training-calendar/templates/trainer-availability-modal.php';
        if (file_exists($template_path)) {
            $template_content = file_get_contents($template_path);
            
            // Test ARIA attributes
            if (strpos($template_content, 'aria-') !== false) {
                $this->log_success('✅ ARIA attributes found');
            } else {
                $this->log_error('❌ ARIA attributes missing');
            }
            
            // Test label associations
            if (strpos($template_content, 'for=') !== false) {
                $this->log_success('✅ Label associations found');
            } else {
                $this->log_error('❌ Label associations missing');
            }
        }
        
        // Test CSS accessibility
        $css_path = get_template_directory() . '/assets/admin/css/training-calendar/training-calendar-admin.css';
        if (file_exists($css_path)) {
            $css_content = file_get_contents($css_path);
            
            // Test focus styles
            if (strpos($css_content, ':focus') !== false) {
                $this->log_success('✅ Focus styles found');
            } else {
                $this->log_error('❌ Focus styles missing');
            }
            
            // Test screen reader styles
            if (strpos($css_content, '.sr-only') !== false) {
                $this->log_success('✅ Screen reader styles found');
            } else {
                $this->log_error('❌ Screen reader styles missing');
            }
        }
        
        // Test JavaScript accessibility
        $js_path = get_template_directory() . '/assets/admin/js/training-calendar/modules/assignment-manager.js';
        if (file_exists($js_path)) {
            $js_content = file_get_contents($js_path);
            
            // Test keyboard navigation
            if (strpos($js_content, 'keydown') !== false || strpos($js_content, 'keyup') !== false) {
                $this->log_success('✅ Keyboard navigation support found');
            } else {
                $this->log_warning('⚠️ Keyboard navigation support not explicitly found');
            }
        }
    }
    
    /**
     * Test user experience features
     */
    private function test_user_experience() {
        $this->log_test_section('🎯 User Experience Features');
        
        $js_path = get_template_directory() . '/assets/admin/js/training-calendar/modules/assignment-manager.js';
        if (file_exists($js_path)) {
            $js_content = file_get_contents($js_path);
            
            // Test loading states
            if (strpos($js_content, 'loading') !== false) {
                $this->log_success('✅ Loading states implemented');
            } else {
                $this->log_error('❌ Loading states missing');
            }
            
            // Test error handling
            if (strpos($js_content, 'catch') !== false && strpos($js_content, 'error') !== false) {
                $this->log_success('✅ Error handling implemented');
            } else {
                $this->log_error('❌ Error handling missing');
            }
            
            // Test success notifications
            if (strpos($js_content, 'showSuccess') !== false) {
                $this->log_success('✅ Success notifications implemented');
            } else {
                $this->log_error('❌ Success notifications missing');
            }
            
            // Test confirmation dialogs
            if (strpos($js_content, 'confirm(') !== false) {
                $this->log_success('✅ Confirmation dialogs implemented');
            } else {
                $this->log_error('❌ Confirmation dialogs missing');
            }
        }
        
        // Test CSS animations
        $css_path = get_template_directory() . '/assets/admin/css/training-calendar/training-calendar-admin.css';
        if (file_exists($css_path)) {
            $css_content = file_get_contents($css_path);
            
            if (strpos($css_content, '@keyframes') !== false) {
                $this->log_success('✅ CSS animations implemented');
            } else {
                $this->log_error('❌ CSS animations missing');
            }
            
            if (strpos($css_content, 'transition:') !== false) {
                $this->log_success('✅ CSS transitions implemented');
            } else {
                $this->log_error('❌ CSS transitions missing');
            }
        }
    }
    
    /**
     * Display test results
     */
    private function display_results() {
        echo '<div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">';
        echo '<h2>📊 Test Results Summary</h2>';
        
        $total_tests = $this->success_count + $this->error_count;
        $success_rate = $total_tests > 0 ? round(($this->success_count / $total_tests) * 100, 1) : 0;
        
        echo '<div style="display: flex; gap: 20px; margin-bottom: 20px;">';
        echo '<div style="flex: 1; padding: 15px; background: white; border-radius: 6px; text-align: center;">';
        echo '<div style="font-size: 24px; font-weight: bold; color: #10b981;">' . $this->success_count . '</div>';
        echo '<div style="color: #666;">Passed</div>';
        echo '</div>';
        
        echo '<div style="flex: 1; padding: 15px; background: white; border-radius: 6px; text-align: center;">';
        echo '<div style="font-size: 24px; font-weight: bold; color: #ef4444;">' . $this->error_count . '</div>';
        echo '<div style="color: #666;">Failed</div>';
        echo '</div>';
        
        echo '<div style="flex: 1; padding: 15px; background: white; border-radius: 6px; text-align: center;">';
        echo '<div style="font-size: 24px; font-weight: bold; color: #3b82f6;">' . $success_rate . '%</div>';
        echo '<div style="color: #666;">Success Rate</div>';
        echo '</div>';
        echo '</div>';
        
        if ($success_rate >= 90) {
            echo '<div style="padding: 15px; background: #d1fae5; color: #065f46; border-radius: 6px; border: 1px solid #a7f3d0;">';
            echo '<strong>🎉 Excellent!</strong> Day 3 implementation is highly successful with ' . $success_rate . '% test coverage.';
            echo '</div>';
        } elseif ($success_rate >= 75) {
            echo '<div style="padding: 15px; background: #fef3c7; color: #92400e; border-radius: 6px; border: 1px solid #fcd34d;">';
            echo '<strong>⚠️ Good Progress!</strong> Day 3 implementation is mostly complete with ' . $success_rate . '% success rate. Address the failed tests above.';
            echo '</div>';
        } else {
            echo '<div style="padding: 15px; background: #fee2e2; color: #991b1b; border-radius: 6px; border: 1px solid #fca5a5;">';
            echo '<strong>❌ Needs Attention!</strong> Day 3 implementation needs significant work with only ' . $success_rate . '% success rate.';
            echo '</div>';
        }
        
        echo '</div>';
        
        // Display detailed results
        echo '<div style="margin-top: 20px;">';
        echo '<h3>📋 Detailed Test Results</h3>';
        echo '<div style="background: white; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 13px; line-height: 1.6; max-height: 400px; overflow-y: auto;">';
        foreach ($this->test_results as $result) {
            echo $result . '<br>';
        }
        echo '</div>';
        echo '</div>';
    }
    
    /**
     * Log test section
     */
    private function log_test_section($title) {
        $this->test_results[] = '<strong>' . $title . '</strong>';
    }
    
    /**
     * Log success
     */
    private function log_success($message) {
        $this->test_results[] = $message;
        $this->success_count++;
    }
    
    /**
     * Log error
     */
    private function log_error($message) {
        $this->test_results[] = $message;
        $this->error_count++;
    }
    
    /**
     * Log warning
     */
    private function log_warning($message) {
        $this->test_results[] = $message;
        // Warnings don't count as pass/fail
    }
}

// Initialize test if requested
if (isset($_GET['test_day3']) && $_GET['test_day3'] === '1') {
    new FitCopilot_Training_Calendar_Day3_Test();
} 