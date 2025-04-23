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

// Include React enqueue functions
require_once get_template_directory() . '/inc/react-enqueue.php';

// Include theme variants functionality
require_once get_template_directory() . '/includes/theme-variants.php'; 