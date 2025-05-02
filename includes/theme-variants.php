<?php
/**
 * Theme Variants Functionality
 *
 * This file handles the theme variant system, including:
 * - Customizer settings
 * - Body class and attribute handling
 * - Admin UI for selecting variants
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add theme variant options to the WordPress customizer
 */
function fitcopilot_theme_customizer($wp_customize) {
    // Add Theme Variants section
    $wp_customize->add_section('fitcopilot_theme_variants', array(
        'title'      => __('Theme Variants', 'fitcopilot'),
        'priority'   => 30,
    ));

    // Add theme variant setting
    $wp_customize->add_setting('fitcopilot_theme_variant', array(
        'default'           => 'default',
        'sanitize_callback' => 'fitcopilot_sanitize_theme_variant',
        'transport'         => 'refresh',
    ));

    // Add control for theme variant
    $wp_customize->add_control('fitcopilot_theme_variant', array(
        'label'    => __('Select Theme Variant', 'fitcopilot'),
        'section'  => 'fitcopilot_theme_variants',
        'type'     => 'select',
        'choices'  => fitcopilot_get_theme_variants(),
    ));
}
add_action('customize_register', 'fitcopilot_theme_customizer');

/**
 * Sanitize the theme variant selection
 */
function fitcopilot_sanitize_theme_variant($input) {
    $valid_variants = array_keys(fitcopilot_get_theme_variants());
    
    if (in_array($input, $valid_variants)) {
        return $input;
    }
    
    return 'default';
}

/**
 * Get available theme variants
 */
function fitcopilot_get_theme_variants() {
    return apply_filters('fitcopilot_theme_variants', array(
        'default'     => __('Default', 'fitcopilot'),
        'modern'      => __('Modern', 'fitcopilot'),
        'classic'     => __('Classic', 'fitcopilot'),
        'minimalist'  => __('Minimalist', 'fitcopilot'),
        'sports'      => __('Sports', 'fitcopilot'),
        'wellness'    => __('Wellness', 'fitcopilot'),
        'registration' => __('Registration', 'fitcopilot'),
    ));
}

/**
 * Add theme variant class to body
 */
function fitcopilot_add_variant_body_class($classes) {
    $current_variant = get_theme_mod('fitcopilot_theme_variant', 'default');
    
    // Add the theme variant as a body class
    $classes[] = 'theme-variant-' . sanitize_html_class($current_variant);
    
    // Add a class to indicate this is using the variant system
    $classes[] = 'has-theme-variant';
    
    return $classes;
}
add_filter('body_class', 'fitcopilot_add_variant_body_class');

/**
 * Add data attributes to the body tag for JavaScript access
 */
function fitcopilot_add_body_data_attributes($attributes) {
    $current_variant = get_theme_mod('fitcopilot_theme_variant', 'default');
    
    // Ensure $attributes is an array
    $attributes = (is_array($attributes)) ? $attributes : array();
    
    // Add theme variant as data attribute
    $attributes['data-theme-variant'] = esc_attr($current_variant);
    
    return $attributes;
}
add_filter('body_attributes', 'fitcopilot_add_body_data_attributes');

/**
 * Pass theme variant to JavaScript
 */
function fitcopilot_localize_theme_variant() {
    $current_variant = get_theme_mod('fitcopilot_theme_variant', 'default');
    
    // Only add if we're on a page that uses our React app
    if (is_page_template('homepage-template.php')) {
        wp_localize_script('fitcopilot-react', 'fitcopilotTheme', array(
            'variant' => $current_variant,
            'variants' => array_keys(fitcopilot_get_theme_variants()),
        ));
    }
}
add_action('wp_enqueue_scripts', 'fitcopilot_localize_theme_variant', 100);

/**
 * Add admin bar menu for quick theme variant switching
 */
function fitcopilot_admin_bar_theme_variants($admin_bar) {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    $current_variant = get_theme_mod('fitcopilot_theme_variant', 'default');
    $variants = fitcopilot_get_theme_variants();
    
    // Add top-level menu
    $admin_bar->add_menu(array(
        'id'    => 'fitcopilot-theme-variants',
        'title' => __('Theme Variant', 'fitcopilot') . ': ' . $variants[$current_variant],
        'href'  => admin_url('customize.php?autofocus[section]=fitcopilot_theme_variants'),
    ));
    
    // Add submenu for each variant
    foreach ($variants as $variant_key => $variant_name) {
        $admin_bar->add_menu(array(
            'id'     => 'fitcopilot-theme-variant-' . $variant_key,
            'parent' => 'fitcopilot-theme-variants',
            'title'  => $variant_name . ($variant_key === $current_variant ? ' ✓' : ''),
            'href'   => '#',
            'meta'   => array(
                'onclick' => 'fitcopilotSwitchThemeVariant("' . esc_js($variant_key) . '"); return false;',
            ),
        ));
    }
}
add_action('admin_bar_menu', 'fitcopilot_admin_bar_theme_variants', 100);

/**
 * Add JavaScript to handle quick variant switching
 */
function fitcopilot_theme_variant_switcher_script() {
    if (!is_admin_bar_showing() || !current_user_can('manage_options')) {
        return;
    }
    ?>
    <script type="text/javascript">
    function fitcopilotSwitchThemeVariant(variant) {
        // Store the selection in a cookie for preview purposes
        document.cookie = "fitcopilot_theme_variant_preview=" + variant + "; path=/";
        
        // Update body classes immediately for preview
        const body = document.body;
        const classes = body.className.split(' ');
        const newClasses = classes.filter(cls => !cls.startsWith('theme-variant-'));
        newClasses.push('theme-variant-' + variant);
        body.className = newClasses.join(' ');
        
        // Update data attribute
        body.setAttribute('data-theme-variant', variant);
        
        // Reload the page to apply changes
        window.location.reload();
    }
    </script>
    <?php
}
add_action('wp_footer', 'fitcopilot_theme_variant_switcher_script');

/**
 * Handle preview cookie if set
 */
function fitcopilot_handle_preview_cookie() {
    if (isset($_COOKIE['fitcopilot_theme_variant_preview']) && current_user_can('manage_options')) {
        $preview_variant = sanitize_key($_COOKIE['fitcopilot_theme_variant_preview']);
        $valid_variants = array_keys(fitcopilot_get_theme_variants());
        
        if (in_array($preview_variant, $valid_variants)) {
            add_filter('theme_mod_fitcopilot_theme_variant', function() use ($preview_variant) {
                return $preview_variant;
            });
        }
    }
}
add_action('init', 'fitcopilot_handle_preview_cookie'); 