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

// Initialize Training Calendar Manager with enhanced error handling and frontend data provision
function fitcopilot_init_training_calendar_phase2() {
    try {
        // PHASE 2: Enable frontend data provision while maintaining admin safety
        $is_admin_area = is_admin();
        $needs_frontend_data = !is_admin() && (is_front_page() || is_home());
        
        // PHASE 2: Always initialize in admin area, and on specific frontend pages
        if (!$is_admin_area && !$needs_frontend_data) {
            return;
        }
        
        // Check if base class exists for admin area
        if (!class_exists('FitCopilot_Complex_Manager') && $is_admin_area) {
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
        global $fitcopilot_training_calendar_manager;
        $fitcopilot_training_calendar_manager = new FitCopilot_Training_Calendar_Manager();
        
        error_log('FitCopilot Training Calendar Phase 2: Successfully initialized (full manager with AJAX handlers)');
        
        // PHASE 2 VERIFICATION: Add admin notice to confirm initialization
        if ($is_admin_area) {
            add_action('admin_notices', function() {
                if (current_user_can('manage_options')) {
                    echo '<div class="notice notice-success is-dismissible">';
                    echo '<p><strong>Training Calendar Phase 2:</strong> Backend foundation + AJAX handlers initialized successfully.</p>';
                    echo '</div>';
                }
            });
        }
        
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