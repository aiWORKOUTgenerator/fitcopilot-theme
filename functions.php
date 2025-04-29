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

// Include admin dashboard
require_once get_template_directory() . '/includes/admin-dashboard.php';

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