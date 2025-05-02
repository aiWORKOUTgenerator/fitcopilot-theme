<?php
/**
 * Component Variants Functionality
 *
 * This file handles the component-specific variant system, including:
 * - Customizer settings for individual components
 * - Helper functions for getting component variants
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add component-specific variant options to the WordPress customizer
 */
function fitcopilot_component_variants_customizer($wp_customize) {
    // Make sure we have the section already created
    if (!$wp_customize->get_section('fitcopilot_theme_variants')) {
        $wp_customize->add_section('fitcopilot_theme_variants', array(
            'title'      => __('Theme Variants', 'fitcopilot'),
            'priority'   => 30,
        ));
    }

    // Get available variants
    $variants = fitcopilot_get_theme_variants();
    
    // Add variant settings for each component
    $components = [
        'hero' => __('Hero Section', 'fitcopilot'),
        'features' => __('Features Section', 'fitcopilot'),
        'testimonials' => __('Testimonials Section', 'fitcopilot'),
        'pricing' => __('Pricing Section', 'fitcopilot')
    ];
    
    foreach ($components as $component_key => $component_label) {
        // Add setting
        $wp_customize->add_setting('fitcopilot_' . $component_key . '_variant', array(
            'default'           => 'default',
            'sanitize_callback' => 'fitcopilot_sanitize_component_variant',
            'transport'         => 'refresh',
        ));
        
        // Add control
        $wp_customize->add_control('fitcopilot_' . $component_key . '_variant', array(
            'label'    => sprintf(__('%s Variant', 'fitcopilot'), $component_label),
            'section'  => 'fitcopilot_theme_variants',
            'type'     => 'select',
            'choices'  => $variants,
            'priority' => 20,
        ));
    }
}
add_action('customize_register', 'fitcopilot_component_variants_customizer', 11);

/**
 * Sanitize component variant selection
 */
function fitcopilot_sanitize_component_variant($input) {
    $valid_variants = array_keys(fitcopilot_get_theme_variants());
    
    if (in_array($input, $valid_variants)) {
        return $input;
    }
    
    return 'default';
}

/**
 * Get component variants for localization to JavaScript
 */
function fitcopilot_get_component_variants() {
    $global_variant = get_theme_mod('fitcopilot_theme_variant', 'default');
    
    // Add cache busting to avoid stale data
    $cache_buster = time();
    
    // When global variant is 'registration', force the registration variant for components
    if ($global_variant === 'registration') {
        return [
            'hero' => 'registration',
            'features' => 'registration',
            'testimonials' => get_theme_mod('fitcopilot_testimonials_variant', $global_variant),
            'pricing' => get_theme_mod('fitcopilot_pricing_variant', $global_variant),
            '_cache_buster' => $cache_buster
        ];
    }
    
    // Otherwise, get individual component variants with fallback to global
    return [
        'hero' => get_theme_mod('fitcopilot_hero_variant', $global_variant),
        'features' => get_theme_mod('fitcopilot_features_variant', $global_variant),
        'testimonials' => get_theme_mod('fitcopilot_testimonials_variant', $global_variant),
        'pricing' => get_theme_mod('fitcopilot_pricing_variant', $global_variant),
        '_cache_buster' => $cache_buster
    ];
}

/**
 * Add component variant data to localized script
 */
function fitcopilot_add_component_variants_to_localized_data($data) {
    if (isset($data['wpData']) && is_array($data['wpData'])) {
        $variants = fitcopilot_get_component_variants();
        $data['wpData']['themeVariants'] = $variants;
        
        // Add debug information
        if (defined('WP_DEBUG') && WP_DEBUG) {
            $data['wpData']['debug'] = $data['wpData']['debug'] ?? [];
            $data['wpData']['debug']['componentVariants'] = [
                'globalThemeVariant' => get_theme_mod('fitcopilot_theme_variant', 'default'),
                'appliedVariants' => $variants
            ];
        }
    }
    return $data;
}
add_filter('fitcopilot_localized_data', 'fitcopilot_add_component_variants_to_localized_data', 999);

// Remove the previous filter functions that might be causing conflicts
remove_filter('fitcopilot_localized_data', 'fitcopilot_filter_component_variants_data'); 