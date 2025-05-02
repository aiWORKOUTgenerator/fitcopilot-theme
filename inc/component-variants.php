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
    return [
        'hero' => get_theme_mod('fitcopilot_hero_variant', get_theme_mod('fitcopilot_theme_variant', 'default')),
        'features' => get_theme_mod('fitcopilot_features_variant', get_theme_mod('fitcopilot_theme_variant', 'default')),
        'testimonials' => get_theme_mod('fitcopilot_testimonials_variant', get_theme_mod('fitcopilot_theme_variant', 'default')),
        'pricing' => get_theme_mod('fitcopilot_pricing_variant', get_theme_mod('fitcopilot_theme_variant', 'default'))
    ];
}

/**
 * Add component variant data to localized script
 */
function fitcopilot_add_component_variants_to_localized_data($data) {
    if (isset($data['wpData']) && is_array($data['wpData'])) {
        $data['wpData']['themeVariants'] = fitcopilot_get_component_variants();
    }
    return $data;
}
add_filter('fitcopilot_localized_data', 'fitcopilot_add_component_variants_to_localized_data'); 