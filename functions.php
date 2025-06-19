<?php
/**
 * FitCopilot Theme Functions
 */

// Set up theme support
function fitcopilot_theme_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Enable support for Post Thumbnails on posts and pages
    add_theme_support('post-thumbnails');

    // Add support for responsive embeds
    add_theme_support('responsive-embeds');

    // Add support for custom logo
    add_theme_support('custom-logo');

    // Add support for full and wide align images
    add_theme_support('align-wide');

    // Add support for editor styles
    add_theme_support('editor-styles');

    // Register nav menus
    register_nav_menus(
        array(
            'primary' => __('Primary Menu', 'fitcopilot'),
            'footer' => __('Footer Menu', 'fitcopilot'),
        )
    );
}
add_action('after_setup_theme', 'fitcopilot_theme_setup');

// Enqueue styles and scripts
function fitcopilot_enqueue_scripts() {
    // Enqueue main theme stylesheet
    wp_enqueue_style('fitcopilot-style', get_stylesheet_uri(), array(), '1.0.0');

    // Existing webpack bundle
    $homepage_asset_file = get_template_directory() . '/dist/homepage.asset.php';
    
    if (file_exists($homepage_asset_file)) {
        $homepage_asset = include $homepage_asset_file;
        $dependencies = $homepage_asset['dependencies'] ?? [];
        $version = $homepage_asset['version'] ?? filemtime(get_template_directory() . '/dist/homepage.js');
        
        wp_enqueue_script(
            'fitcopilot-homepage',
            get_template_directory_uri() . '/dist/homepage.js',
            $dependencies,
            $version,
            true
        );
        
        wp_enqueue_style(
            'fitcopilot-homepage-style',
            get_template_directory_uri() . '/dist/homepage.css',
            [],
            $version
        );

        // CRITICAL FIX: Add WordPress REST API settings for nonce authentication
        wp_localize_script('fitcopilot-homepage', 'wpApiSettings', array(
    'root' => esc_url_raw(rest_url()),
    'nonce' => wp_create_nonce('wp_rest'),
    'api_url' => home_url('/wp-json/'),
    'rest_url' => esc_url_raw(rest_url('fitcopilot/v1/'))
));

// Enhanced API configuration for better nonce handling
wp_localize_script('fitcopilot-homepage', 'fitcopilotApiConfig', array(
    'restUrl' => esc_url_raw(rest_url('fitcopilot/v1/')),
    'restNonce' => wp_create_nonce('wp_rest'),
    'ajaxUrl' => admin_url('admin-ajax.php'),
    'ajaxNonce' => wp_create_nonce('fitcopilot_training_calendar_nonce'),
    'debug' => WP_DEBUG
));
        
        // Initialize providers for data localization
        if (class_exists('FitCopilot_Personal_Training_Provider')) {
            $personal_training_provider = new FitCopilot_Personal_Training_Provider();
            $personal_training_provider->provide_frontend_data();
        }
        
        if (class_exists('FitCopilot_Training_Features_Provider')) {
            $training_features_provider = new FitCopilot_Training_Features_Provider();
            $training_features_provider->provide_frontend_data();
        }
        
        // CRITICAL FIX: Training Calendar data localization
        // Call the data provider directly after script is enqueued to ensure proper timing
        global $fitcopilot_training_calendar_manager;
        if (isset($fitcopilot_training_calendar_manager) && !is_admin()) {
            error_log('FitCopilot: Manually calling Training Calendar data provider from fitcopilot_enqueue_scripts');
            $fitcopilot_training_calendar_manager->provide_frontend_data();
        } else {
            error_log('FitCopilot: Training Calendar manager not available in fitcopilot_enqueue_scripts');
        }
        
        // EMERGENCY FALLBACK: Ensure fitcopilotTrainingCalendarData always exists
        // This prevents the frontend from breaking if the provider fails
        if (!is_admin()) {
            wp_localize_script('fitcopilot-homepage', 'fitcopilotTrainingCalendarData', array(
                'nonce' => wp_create_nonce('training_calendar_nonce'),
                'api' => array(
                    'ajaxUrl' => admin_url('admin-ajax.php'),
                    'ajaxNonce' => wp_create_nonce('training_calendar_nonce'),
                    'restNonce' => wp_create_nonce('wp_rest'),
                ),
                'events' => array(),
                'trainers' => array(),
                'settings' => array(
                    'defaultView' => 'dayGridMonth',
                    'timeFormat' => 'h:mm a',
                ),
                'debug' => array(
                    'source' => 'Emergency Fallback',
                    'timestamp' => current_time('mysql'),
                    'message' => 'Minimal data to prevent frontend errors'
                )
            ));
            error_log('FitCopilot: Emergency fallback Training Calendar data localized');
        }
    }
}
add_action('wp_enqueue_scripts', 'fitcopilot_enqueue_scripts');

// Remove unwanted default WordPress styles (optional)
function fitcopilot_dequeue_styles() {
    // If we're not in the admin area and not logged in
    if (!is_admin() && !is_user_logged_in()) {
        wp_dequeue_style('wp-block-library'); // WordPress core
        wp_dequeue_style('wp-block-library-theme'); // WordPress core
        wp_dequeue_style('global-styles'); // Global styles
    }
}
add_action('wp_enqueue_scripts', 'fitcopilot_dequeue_styles', 100);

/**
 * Add theme variant data attribute to body
 * This allows CSS to apply different styles based on the chosen theme variant
 */
function fitcopilot_body_attributes($attributes) {
    // Ensure $attributes is an array
    $attributes = (is_array($attributes)) ? $attributes : array();
    
    $current_variant = get_theme_mod('fitcopilot_theme_variant', 'default');
    
    // Sanitize the variant name
    $current_variant = sanitize_html_class($current_variant);
    
    // Add data-theme attribute to the array of attributes
    $attributes['data-theme'] = esc_attr($current_variant);
    
    // Add debug info as data attribute if WP_DEBUG is enabled
    if (defined('WP_DEBUG') && WP_DEBUG) {
        $attributes['data-debug'] = 'true';
    }
    
    return $attributes;
}
add_filter('body_attributes', 'fitcopilot_body_attributes');

// Add theme variant as a body class
function fitcopilot_add_body_data_theme($classes) {
    // Ensure $classes is an array
    $classes = (is_array($classes)) ? $classes : array();
    
    $current_variant = get_theme_mod('fitcopilot_theme_variant', 'default');
    
    // Add the theme variant as a body class
    $classes[] = 'theme-' . sanitize_html_class($current_variant);
    
    return $classes;
}
add_filter('body_class', 'fitcopilot_add_body_data_theme');

// Include React enqueue functions
require_once get_template_directory() . '/inc/react-enqueue.php';

// Include theme variants functionality
require_once get_template_directory() . '/includes/theme-variants.php';

// Include component variants functionality
require_once get_template_directory() . '/inc/component-variants.php';

// Include admin dashboard
require_once get_template_directory() . '/includes/admin-dashboard.php';

// Include video manager admin page
require_once get_template_directory() . '/inc/admin/video-manager.php';

// Include testimonials manager admin page
require_once get_template_directory() . '/inc/admin/testimonials-manager.php';

// Include personal training manager admin page
require_once get_template_directory() . '/inc/admin/personal-training-manager.php';

// Include training features manager admin page
require_once get_template_directory() . '/inc/admin/training-features-manager.php';

// Include user management utility functions FIRST - Phase 2.1: User Fields Integration
require_once get_template_directory() . '/inc/user-management-functions.php';

// Include user management system AFTER functions are loaded
require_once get_template_directory() . '/inc/admin/user-management/class-user-management-init.php';

// Initialize User Management System - Phase 2.2: REST API Implementation
add_action('init', function() {
    try {
        // Initialize the user management system
        $user_mgmt = FitCopilot_User_Management_Init::get_instance();
        
        if ($user_mgmt) {
            error_log('FitCopilot: User Management System initialized successfully');
            
            // Add debug info about the instance
            error_log('FitCopilot: User Management System class: ' . get_class($user_mgmt));
        } else {
            error_log('FitCopilot: User Management System initialization returned null');
        }
    } catch (Exception $e) {
        error_log('FitCopilot: User Management System initialization error: ' . $e->getMessage());
        error_log('FitCopilot: User Management System error trace: ' . $e->getTraceAsString());
    } catch (Error $e) {
        error_log('FitCopilot: User Management System fatal error: ' . $e->getMessage());
        error_log('FitCopilot: User Management System fatal error file: ' . $e->getFile() . ' line: ' . $e->getLine());
    }
}, 5); // Early priority to ensure it's ready before other systems

// Include critical CSS functions
require_once get_template_directory() . '/inc/critical-css.php';

// Add debugging script to help diagnose React mount issues
function fitcopilot_add_debug_script() {
    if (is_page_template('homepage-template.php')) {
        ?>
        <script type="text/javascript">
            document.addEventListener('DOMContentLoaded', function() {
                console.log('Debug: DOM fully loaded');
                console.log('Debug: #athlete-dashboard-root exists:', !!document.getElementById('athlete-dashboard-root'));
                console.log('Debug: athleteDashboardData exists:', typeof window.athleteDashboardData !== 'undefined');
                if (window.athleteDashboardData) {
                    console.log('Debug: athleteDashboardData.wpData exists:', typeof window.athleteDashboardData.wpData !== 'undefined');
                }
                
                // Check if scripts are loaded
                const scripts = document.querySelectorAll('script');
                const scriptUrls = Array.from(scripts).map(s => s.src);
                console.log('Debug: All script URLs:', scriptUrls);
                
                // Monitor for errors
                window.addEventListener('error', function(event) {
                    console.log('Debug: JavaScript error detected:', event.message, 'at', event.filename, 'line', event.lineno);
                });
                
                // Define global callback that React can use to signal successful mounting
                window.fitcopilotReactMounted = function() {
                    console.log('WordPress received React mounted notification');
                    document.body.classList.add('react-mounted');
                };
            });
        </script>
        <?php
    }
}
add_action('wp_footer', 'fitcopilot_add_debug_script', 999);

/**
 * Include theme diagnostics tool
 */
require get_template_directory() . '/inc/diagnostics.php';

/**
 * Include admin diagnostics page
 */
require get_template_directory() . '/inc/admin-diagnostics.php';

/**
 * Include React debugging tools
 */
require get_template_directory() . '/inc/react-debug.php';

/**
 * Include critical issues debug script
 */
require get_template_directory() . '/debug-critical-issues.php';

/**
 * Include nonce fix debug script
 */
require get_template_directory() . '/debug-nonce-fix.php';

/**
 * Add a debug option to show React component debug info
 */
function fitcopilot_debug_scripts() {
    if (isset($_GET['show_react_debug']) && current_user_can('manage_options')) {
        echo '<script>console.log("FitCopilot React debug mode enabled.");</script>';
        do_shortcode('[fitcopilot_react_debug]');
    }
}
add_action('wp_footer', 'fitcopilot_debug_scripts', 999);

/**
 * Output body attributes on frontend
 */
function fitcopilot_output_body_attributes() {
    $attributes = apply_filters('body_attributes', array());
    
    $output = '';
    if (is_array($attributes)) {
        foreach ($attributes as $name => $value) {
            $output .= esc_attr($name) . '="' . esc_attr($value) . '" ';
        }
    }
    
    echo trim($output);
}

// Initialize Training Calendar Manager - PHASE 1: Backend Foundation
// Load admin patterns first to ensure base classes are available
require_once get_template_directory() . '/inc/admin/shared/admin-patterns.php';

// COMPREHENSIVE FIX: Ensure Training Calendar data is always available
function fitcopilot_ensure_training_calendar_data() {
    // Always initialize core components for data provision
    static $initialized = false;
    
    if ($initialized) {
        return;
    }
    
    try {
        // Load required dependencies
        $base_path = get_template_directory() . '/inc/admin/training-calendar/';
        $required_files = [
            $base_path . 'class-training-calendar-data.php',
            $base_path . 'class-training-calendar-provider.php'
        ];
        
        foreach ($required_files as $file) {
            if (!file_exists($file)) {
                error_log("FitCopilot: Required file not found: $file");
                return;
            }
            require_once $file;
        }
        
        // Initialize data components
        if (class_exists('FitCopilot_Training_Calendar_Data') && class_exists('FitCopilot_Training_Calendar_Provider')) {
            $data_manager = new FitCopilot_Training_Calendar_Data();
            $data_provider = new FitCopilot_Training_Calendar_Provider($data_manager);
            
            // Store globally for access
            global $fitcopilot_training_calendar_data_provider;
            $fitcopilot_training_calendar_data_provider = $data_provider;
            
            $initialized = true;
            error_log('FitCopilot: Training Calendar data components initialized successfully');
        } else {
            error_log('FitCopilot: Training Calendar classes not found after loading files');
        }
        
    } catch (Exception $e) {
        error_log('FitCopilot: Error initializing Training Calendar data: ' . $e->getMessage());
    }
}

// NEW: Ensure Training Calendar Manager is properly initialized and globally accessible
function fitcopilot_ensure_training_calendar_manager() {
    global $fitcopilot_training_calendar_manager;
    
    // If already initialized, return existing manager
    if (isset($fitcopilot_training_calendar_manager)) {
        return $fitcopilot_training_calendar_manager;
    }
    
    try {
        // Check if base class exists
        if (!class_exists('FitCopilot_Complex_Manager')) {
            error_log('FitCopilot: Base class FitCopilot_Complex_Manager not found for Manager initialization');
            return null;
        }
        
        // Load Manager class
        $manager_file = get_template_directory() . '/inc/admin/training-calendar/class-training-calendar-manager.php';
        if (file_exists($manager_file)) {
            require_once $manager_file;
        } else {
            error_log('FitCopilot: Manager file not found at ' . $manager_file);
            return null;
        }
        
        // Initialize Manager
        if (class_exists('FitCopilot_Training_Calendar_Manager')) {
            $fitcopilot_training_calendar_manager = new FitCopilot_Training_Calendar_Manager();
            
            error_log('FitCopilot: Training Calendar Manager initialized successfully');
            return $fitcopilot_training_calendar_manager;
        } else {
            error_log('FitCopilot: Training Calendar Manager class not found after including file');
        }
    } catch (Exception $e) {
        error_log('FitCopilot: Manager initialization failed: ' . $e->getMessage());
    } catch (Error $e) {
        error_log('FitCopilot: Manager initialization fatal error: ' . $e->getMessage());
    }
    
    return null;
}

// NEW: Helper function for easy Manager access
function fitcopilot_get_training_calendar_manager() {
    global $fitcopilot_training_calendar_manager;
    
    if (!$fitcopilot_training_calendar_manager) {
        fitcopilot_ensure_training_calendar_manager();
    }
    
    return $fitcopilot_training_calendar_manager;
}

// Initialize data components early
add_action('init', 'fitcopilot_ensure_training_calendar_data', 5);

// COMPREHENSIVE FIX: Force data localization on script enqueue
function fitcopilot_force_training_calendar_localization() {
    // Ensure data components are available
    fitcopilot_ensure_training_calendar_data();
    
    global $fitcopilot_training_calendar_data_provider;
    
    if (!$fitcopilot_training_calendar_data_provider) {
        error_log('FitCopilot: Data provider not available for localization');
        return;
    }
    
    // Check if we need to localize data
    $needs_localization = !is_admin() && (
        is_front_page() || 
        is_home() || 
        isset($_GET['debug_training_calendar']) ||
        isset($_GET['tc_test']) ||
        strpos($_SERVER['REQUEST_URI'], 'wp-json') !== false
    );
    
    if ($needs_localization) {
        // Ensure homepage script is enqueued first
        if (!wp_script_is('fitcopilot-homepage', 'enqueued')) {
            $script_path = get_template_directory() . '/dist/homepage.js';
            if (file_exists($script_path)) {
                wp_enqueue_script(
                    'fitcopilot-homepage',
                    get_template_directory_uri() . '/dist/homepage.js',
                    array('react', 'react-dom'),
                    filemtime($script_path),
                    true
                );
                error_log('FitCopilot: Enqueued homepage script for data localization');
            }
        }
        
        // Force data localization
        $fitcopilot_training_calendar_data_provider->provide_frontend_data();
        error_log('FitCopilot: Forced Training Calendar data localization');
    }
}

// Hook to wp_enqueue_scripts with high priority
add_action('wp_enqueue_scripts', 'fitcopilot_force_training_calendar_localization', 25);

// Early initialization for REST API endpoints (must run on all requests)
function fitcopilot_init_rest_api_early() {
    // Prevent double initialization
    if (defined('FITCOPILOT_TRAINER_API_INITIALIZED')) {
        return;
    }
    
    $api_file = get_template_directory() . '/inc/admin/training-calendar/class-trainer-availability-api.php';
    if (file_exists($api_file)) {
        require_once $api_file;
        
        if (class_exists('FitCopilot_Trainer_Availability_API')) {
            $fitcopilot_trainer_availability_api = new FitCopilot_Trainer_Availability_API();
            $fitcopilot_trainer_availability_api->init();
            define('FITCOPILOT_TRAINER_API_INITIALIZED', true);
            error_log('FitCopilot: REST API routes initialized early');
        } else {
            error_log('FitCopilot: API class not found after requiring file');
        }
    } else {
        error_log('FitCopilot: API file not found at ' . $api_file);
    }
}
add_action('rest_api_init', 'fitcopilot_init_rest_api_early', 5); // Early priority

// Initialize Training Calendar Manager with enhanced error handling and frontend data provision
function fitcopilot_init_training_calendar_phase2() {
    // Check if already initialized to prevent duplicate menu registration
    global $fitcopilot_training_calendar_manager;
    if (isset($fitcopilot_training_calendar_manager)) {
        return;
    }

    try {
        // PHASE 2: Enable frontend data provision while maintaining admin safety
        $is_admin_area = is_admin();
        $needs_frontend_data = !is_admin() && (is_front_page() || is_home());
        $is_debug_request = !is_admin() && (isset($_GET['debug_user_registration']) || isset($_GET['fix_nonce_mismatch']) || isset($_GET['tc_test']));
        
        // PHASE 2: Initialize manager on admin area, specific frontend pages, AND debug requests
        // NOTE: API routes are initialized separately in rest_api_init hook above
        if (!$is_admin_area && !$needs_frontend_data && !$is_debug_request) {
            return;
        }
        
        // Check if base class exists (should be available everywhere now)
        if (!class_exists('FitCopilot_Complex_Manager')) {
            error_log('FitCopilot Training Calendar Phase 2: Base class FitCopilot_Complex_Manager not found');
            return;
        }
        
        // Load Training Calendar Manager
        $manager_file = get_template_directory() . '/inc/admin/training-calendar/class-training-calendar-manager.php';
        if (!file_exists($manager_file)) {
            error_log('FitCopilot Training Calendar Phase 2: Manager file not found at ' . $manager_file);
            return;
        }
        
        require_once $manager_file;
        
        // Check if Training Calendar Manager class exists
        if (!class_exists('FitCopilot_Training_Calendar_Manager')) {
            error_log('FitCopilot Training Calendar Phase 2: Manager class not found after including file');
            return;
        }
        
        // PHASE 2: Initialize the manager (includes AJAX handlers)
        $fitcopilot_training_calendar_manager = new FitCopilot_Training_Calendar_Manager();
        
        error_log('FitCopilot Training Calendar Phase 2: Successfully initialized (full manager with AJAX handlers)');
        
    } catch (Exception $e) {
        error_log('FitCopilot Training Calendar Phase 2 Error: ' . $e->getMessage());
        error_log('FitCopilot Training Calendar Phase 2 Stack Trace: ' . $e->getTraceAsString());
        
        // Add admin error notice
        if (is_admin()) {
            add_action('admin_notices', function() use ($e) {
                if (current_user_can('manage_options')) {
                    echo '<div class="notice notice-error is-dismissible">';
                    echo '<p><strong>Training Calendar Phase 2 Error:</strong> ' . esc_html($e->getMessage()) . '</p>';
                    echo '</div>';
                }
            });
        }
        
    } catch (Error $e) {
        error_log('FitCopilot Training Calendar Phase 2 Fatal Error: ' . $e->getMessage());
        error_log('FitCopilot Training Calendar Phase 2 Fatal Error File: ' . $e->getFile() . ' Line: ' . $e->getLine());
        
        // Add admin error notice for fatal errors
        if (is_admin()) {
            add_action('admin_notices', function() use ($e) {
                if (current_user_can('manage_options')) {
                    echo '<div class="notice notice-error is-dismissible">';
                    echo '<p><strong>Training Calendar Phase 2 Fatal Error:</strong> ' . esc_html($e->getMessage()) . '</p>';
                    echo '</div>';
                }
            });
        }
    }
}

// PHASE 2: Initialize in both admin and frontend contexts
add_action('init', 'fitcopilot_init_training_calendar_phase2');

// Add debug functionality for user registration issues
if (isset($_GET['debug_user_registration']) && current_user_can('manage_options')) {
    require_once get_template_directory() . '/debug-user-registration-issues.php';
    debug_user_registration_issues();
    exit;
}

// Add debug functionality for nonce mismatch issues
if (isset($_GET['fix_nonce_mismatch']) && current_user_can('manage_options')) {
    require_once get_template_directory() . '/fix-nonce-mismatch.php';
    fix_training_calendar_nonce_issues();
    exit;
}

// Add debug functionality for training calendar initialization
if (isset($_GET['debug_training_calendar']) && current_user_can('manage_options')) {
    echo "<h2>🔍 Training Calendar Initialization Debug</h2>";
    echo "<p><strong>Generated:</strong> " . current_time('mysql') . "</p>";
    echo "<hr>";
    
    echo "<h3>📋 Environment Check</h3>";
    echo "<p><strong>is_admin():</strong> " . (is_admin() ? 'Yes' : 'No') . "</p>";
    echo "<p><strong>is_front_page():</strong> " . (is_front_page() ? 'Yes' : 'No') . "</p>";
    echo "<p><strong>is_home():</strong> " . (is_home() ? 'Yes' : 'No') . "</p>";
    echo "<p><strong>Current URL:</strong> " . esc_url($_SERVER['REQUEST_URI']) . "</p>";
    
    echo "<h3>🏗️ Manager Status</h3>";
    global $fitcopilot_training_calendar_manager;
    if (isset($fitcopilot_training_calendar_manager)) {
        echo "<p>✅ <strong>Training Calendar Manager:</strong> Initialized</p>";
        echo "<p><strong>Manager Class:</strong> " . get_class($fitcopilot_training_calendar_manager) . "</p>";
        
        // Test data provider
        if (method_exists($fitcopilot_training_calendar_manager, 'provide_frontend_data')) {
            echo "<p>✅ <strong>provide_frontend_data method:</strong> Available</p>";
            
            // Try to get data
            ob_start();
            $fitcopilot_training_calendar_manager->provide_frontend_data();
            $output = ob_get_clean();
            
            echo "<p><strong>Data provider output length:</strong> " . strlen($output) . " characters</p>";
        } else {
            echo "<p>❌ <strong>provide_frontend_data method:</strong> Not available</p>";
        }
    } else {
        echo "<p>❌ <strong>Training Calendar Manager:</strong> Not initialized</p>";
    }
    
    echo "<h3>🌐 Frontend Data Check</h3>";
    echo "<script>";
    echo "console.log('Training Calendar Debug Data:', window.fitcopilotTrainingCalendarData);";
    echo "if (window.fitcopilotTrainingCalendarData) {";
    echo "  document.write('<p>✅ <strong>window.fitcopilotTrainingCalendarData:</strong> Available</p>');";
    echo "  document.write('<p><strong>Nonce:</strong> ' + (window.fitcopilotTrainingCalendarData.nonce || 'Not set') + '</p>');";
    echo "  document.write('<p><strong>Events count:</strong> ' + (window.fitcopilotTrainingCalendarData.events?.length || 0) + '</p>');";
    echo "  document.write('<p><strong>Trainers count:</strong> ' + (window.fitcopilotTrainingCalendarData.trainers?.length || 0) + '</p>');";
    echo "} else {";
    echo "  document.write('<p>❌ <strong>window.fitcopilotTrainingCalendarData:</strong> Not available</p>');";
    echo "}";
    echo "</script>";
    
    exit;
}

// TEMPORARY: Direct User Registration API initialization for debugging
// This bypasses the User Management Init class to test if the API works directly
function fitcopilot_direct_user_registration_api_init() {
    error_log('FitCopilot: Direct User Registration API initialization started');
    
    $user_api_file = get_template_directory() . '/inc/admin/user-management/class-user-registration-api.php';
    $email_manager_file = get_template_directory() . '/inc/admin/user-management/class-user-email-manager.php';
    
    if (file_exists($user_api_file) && file_exists($email_manager_file)) {
        require_once $user_api_file;
        require_once $email_manager_file;
        
        if (class_exists('FitCopilot_User_Registration_API') && class_exists('FitCopilot_User_Email_Manager')) {
            $user_api = new FitCopilot_User_Registration_API();
            $user_api->init();
            
            $email_manager = new FitCopilot_User_Email_Manager();
            $email_manager->init();
            
            error_log('FitCopilot: Direct User Registration API initialized successfully');
        } else {
            error_log('FitCopilot: Direct User Registration API - classes not found after require');
        }
    } else {
        error_log('FitCopilot: Direct User Registration API - files not found');
        error_log('FitCopilot: User API file exists: ' . (file_exists($user_api_file) ? 'Yes' : 'No'));
        error_log('FitCopilot: Email Manager file exists: ' . (file_exists($email_manager_file) ? 'Yes' : 'No'));
    }
}
add_action('rest_api_init', 'fitcopilot_direct_user_registration_api_init', 5);

// Debug User Registration API
require_once get_template_directory() . '/debug-user-registration-api.php';

// Verify API Status
require_once get_template_directory() . '/verify-api-status.php';

// Training Calendar Testing Tools
require_once get_template_directory() . '/debug-training-calendar-quick.php';
require_once get_template_directory() . '/training-calendar-quick-test.php';

// NEW: Backend Testing Tool Handler for Manager Initialization Test
add_action('init', function() {
    if (isset($_GET['test_manager']) && $_GET['test_manager'] === '1') {
        // Output manager test results for backend testing tool
        add_action('wp_loaded', function() {
            // Force manager initialization
            fitcopilot_ensure_training_calendar_manager();
            
            // Test if manager is available
            global $fitcopilot_training_calendar_manager;
            
            if ($fitcopilot_training_calendar_manager) {
                echo "Training Calendar Manager initialized successfully";
                echo " - Class: " . get_class($fitcopilot_training_calendar_manager);
                echo " - manager initialized: true";
            } else {
                echo "Training Calendar Manager initialization failed";
            }
            
            exit; // Stop normal WordPress processing
        }, 999);
    }
}); 