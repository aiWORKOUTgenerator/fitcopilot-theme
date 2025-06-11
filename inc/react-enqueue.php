<?php
/**
 * Functions for enqueueing React assets
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Main function to enqueue all Fitcopilot theme assets
 * This is the primary function that loads homepage React components
 */
function fitcopilot_enqueue_assets() {
    // Only enqueue on frontend, not admin
    if (is_admin()) {
        return;
    }
    
    // Get the manifest for cache-busted filenames
    $manifest = fitcopilot_get_react_manifest();
    
    if (empty($manifest)) {
        error_log('Fitcopilot: Cannot load assets - manifest is empty');
        return;
    }
    
    // Enqueue critical CSS first for performance
    if (isset($manifest['critical.css'])) {
        fitcopilot_enqueue_react_style('fitcopilot-critical', 'critical.css');
    }
    
    // Load homepage assets if we're on a page that needs React
    if (fitcopilot_is_react_template() || is_front_page() || is_home()) {
        
        // Enqueue homepage CSS
        if (isset($manifest['homepage.css'])) {
            fitcopilot_enqueue_react_style('fitcopilot-homepage', 'homepage.css', array('fitcopilot-critical'));
        }
        
        // Enqueue vendor dependencies first
        if (isset($manifest['vendors.js'])) {
            fitcopilot_enqueue_react_script('fitcopilot-vendors', 'vendors.js', array('react', 'react-dom'));
        }
        
        // Enqueue framework utilities
        if (isset($manifest['framework.js'])) {
            fitcopilot_enqueue_react_script('fitcopilot-framework', 'framework.js', array('fitcopilot-vendors'));
        }
        
        // Enqueue utility functions
        if (isset($manifest['utils.js'])) {
            fitcopilot_enqueue_react_script('fitcopilot-utils', 'utils.js', array('fitcopilot-framework'));
        }
        
        // Enqueue main homepage script
        if (isset($manifest['homepage.js'])) {
            fitcopilot_enqueue_react_script('fitcopilot-homepage', 'homepage.js', array('fitcopilot-utils'));
            
            // Add theme configuration data for React
            $theme_config = array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('fitcopilot_nonce'),
                'themeUrl' => get_template_directory_uri(),
                'currentTheme' => get_theme_mod('fitcopilot_theme_variant', 'default'),
                'isDebug' => defined('WP_DEBUG') && WP_DEBUG
            );
            
            wp_localize_script('fitcopilot-homepage', 'fitcopilotConfig', $theme_config);
        }
        
        // Load debug assets in debug mode
        if (defined('WP_DEBUG') && WP_DEBUG && isset($manifest['debug.js'])) {
            fitcopilot_enqueue_react_script('fitcopilot-debug', 'debug.js', array('fitcopilot-homepage'));
        }
    }
}
add_action('wp_enqueue_scripts', 'fitcopilot_enqueue_assets', 10);

/**
 * Enqueue React and ReactDOM from CDN for the entire site
 */
function fitcopilot_enqueue_react() {
    // Only load these on frontend (not admin)
    if (!is_admin()) {
        // Use development versions in debug mode for better error messages
        if (defined('WP_DEBUG') && WP_DEBUG) {
            wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.development.js', array(), '18.0.0', true);
            wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.development.js', array('react'), '18.0.0', true);
        } else {
            wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', array(), '18.0.0', true);
            wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', array('react'), '18.0.0', true);
        }
        
        // Add console message to verify React is loaded
        wp_add_inline_script('react-dom', 'console.log("React and ReactDOM loaded from CDN");', 'after');
    }
}
add_action('wp_enqueue_scripts', 'fitcopilot_enqueue_react', 5); // Load React before other assets

/**
 * Get the React build manifest and return it as an array
 */
function fitcopilot_get_react_manifest() {
    static $manifest = null;
    
    if ($manifest === null) {
        $manifest_path = get_template_directory() . '/dist/manifest.json';
        
        if (file_exists($manifest_path)) {
            $manifest = json_decode(file_get_contents($manifest_path), true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log('Error parsing React manifest JSON: ' . json_last_error_msg());
                $manifest = array();
            }
        } else {
            error_log('React manifest file not found at: ' . $manifest_path);
            $manifest = array();
        }
    }
    
    return $manifest;
}

/**
 * Enqueue a React script with cache busting from the manifest
 */
function fitcopilot_enqueue_react_script($handle, $manifest_key, $deps = array(), $in_footer = true) {
    $manifest = fitcopilot_get_react_manifest();
    
    if (isset($manifest[$manifest_key])) {
        $file = $manifest[$manifest_key];
        $file_path = get_template_directory() . '/dist/' . $file;
        
        if (file_exists($file_path)) {
            wp_enqueue_script(
                $handle,
                get_template_directory_uri() . '/dist/' . $file . '?cachebust=' . time() . rand(1000, 9999),
                array_merge($deps, array('react', 'react-dom')), // Always depend on React
                time(), // Force cache bust - use current timestamp
                $in_footer
            );
            
            // Add debugging info
            if (defined('WP_DEBUG') && WP_DEBUG) {
                wp_add_inline_script($handle, 'console.log("' . $handle . ' script loaded from: ' . get_template_directory_uri() . '/dist/' . $file . '");', 'before');
            }
            
            return true;
        } else {
            error_log('React script file not found: ' . $file_path);
        }
    } else {
        error_log('React manifest key not found: ' . $manifest_key);
    }
    
    return false;
}

/**
 * Enqueue a React style with cache busting from the manifest
 */
function fitcopilot_enqueue_react_style($handle, $manifest_key, $deps = array()) {
    $manifest = fitcopilot_get_react_manifest();
    
    if (isset($manifest[$manifest_key])) {
        $file = $manifest[$manifest_key];
        $file_path = get_template_directory() . '/dist/' . $file;
        
        if (file_exists($file_path)) {
            wp_enqueue_style(
                $handle,
                get_template_directory_uri() . '/dist/' . $file . '?cachebust=' . time() . rand(1000, 9999),
                $deps,
                time() // Force cache bust - use current timestamp
            );
            return true;
        } else {
            error_log('React style file not found: ' . $file_path);
        }
    } else {
        error_log('React manifest key not found for style: ' . $manifest_key);
    }
    
    return false;
}

/**
 * Function to check if current page is using a React template
 */
function fitcopilot_is_react_template() {
    global $template;
    
    $react_templates = array(
        'homepage-template.php'
    );
    
    foreach ($react_templates as $react_template) {
        if (strpos($template, $react_template) !== false) {
            return true;
        }
    }
    
    return false;
} 