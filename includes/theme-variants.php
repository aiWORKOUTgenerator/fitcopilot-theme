<?php
/**
 * FitCopilot Theme Variants
 * 
 * Handles the WordPress side of theme variants including:
 * - Customizer integration for selecting variants
 * - Passing variant choices to the React front-end
 * - Default variant settings
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Register theme customizer settings for variants
 */
function fitcopilot_register_variant_customizer($wp_customize) {
    // Add a section for theme variants
    $wp_customize->add_section('fitcopilot_variants', array(
        'title'       => __('Theme Variants', 'fitcopilot'),
        'description' => __('Customize the appearance of different sections by selecting variants.', 'fitcopilot'),
        'priority'    => 30,
    ));

    // Hero Section Variant
    $wp_customize->add_setting('fitcopilot_hero_variant', array(
        'default'           => 'default',
        'sanitize_callback' => 'fitcopilot_sanitize_variant',
    ));

    $wp_customize->add_control('fitcopilot_hero_variant', array(
        'label'       => __('Hero Section Variant', 'fitcopilot'),
        'description' => __('Select the style variant for the hero section.', 'fitcopilot'),
        'section'     => 'fitcopilot_variants',
        'type'        => 'select',
        'choices'     => array(
            'default' => __('Default', 'fitcopilot'),
            'gym'     => __('Gym', 'fitcopilot'),
        ),
    ));

    // Features Section Variant
    $wp_customize->add_setting('fitcopilot_features_variant', array(
        'default'           => 'default',
        'sanitize_callback' => 'fitcopilot_sanitize_variant',
    ));

    $wp_customize->add_control('fitcopilot_features_variant', array(
        'label'       => __('Features Section Variant', 'fitcopilot'),
        'description' => __('Select the style variant for the features section.', 'fitcopilot'),
        'section'     => 'fitcopilot_variants',
        'type'        => 'select',
        'choices'     => array(
            'default' => __('Default', 'fitcopilot'),
            'gym'     => __('Gym', 'fitcopilot'),
        ),
    ));

    // Add more variants as needed for other sections
}
add_action('customize_register', 'fitcopilot_register_variant_customizer');

/**
 * Sanitize variant choices
 */
function fitcopilot_sanitize_variant($input) {
    $valid = array('default', 'gym');
    
    if (in_array($input, $valid, true)) {
        return $input;
    }
    
    return 'default';
}

/**
 * Pass variant settings to React via wp_localize_script
 */
function fitcopilot_localize_variant_data() {
    // Get all variant settings
    $variants = array(
        'hero'     => get_theme_mod('fitcopilot_hero_variant', 'default'),
        'features' => get_theme_mod('fitcopilot_features_variant', 'default'),
        // Add more variants as needed
    );
    
    // Prepare the data to be passed to React
    $data = array(
        'wpData' => array(
            'themeVariants' => $variants,
            'siteUrl'       => get_site_url(),
            'ajaxUrl'       => admin_url('admin-ajax.php'),
            'nonce'         => wp_create_nonce('fitcopilot_ajax_nonce'),
        ),
    );
    
    // Localize the script
    wp_localize_script(
        'fitcopilot-app', // The handle of your main React script
        'athleteDashboardData',
        $data
    );
}
add_action('wp_enqueue_scripts', 'fitcopilot_localize_variant_data', 20);

/**
 * Admin interface additions
 */
function fitcopilot_admin_variant_notice() {
    $screen = get_current_screen();
    
    // Only show on dashboard
    if ($screen->id !== 'dashboard') {
        return;
    }
    
    ?>
    <div class="notice notice-info is-dismissible">
        <p>
            <strong><?php _e('Theme Variants Available:', 'fitcopilot'); ?></strong> 
            <?php _e('Customize the appearance of your site by selecting different variants for each section in the Customizer.', 'fitcopilot'); ?>
            <a href="<?php echo esc_url(admin_url('customize.php?autofocus[section]=fitcopilot_variants')); ?>" class="button button-primary" style="margin-left: 10px;">
                <?php _e('Customize Variants', 'fitcopilot'); ?>
            </a>
        </p>
    </div>
    <?php
}
add_action('admin_notices', 'fitcopilot_admin_variant_notice'); 