<?php
/**
 * Critical CSS handling functions
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Get the critical CSS from the compiled file
 * 
 * @return string The critical CSS content
 */
function fitcopilot_get_critical_css() {
    static $critical_css = null;
    
    if ($critical_css === null) {
        // Get the manifest file
        $manifest_path = get_template_directory() . '/dist/manifest.json';
        $manifest = file_exists($manifest_path) ? json_decode(file_get_contents($manifest_path), true) : [];
        
        if (empty($manifest)) {
            error_log('Critical CSS: React manifest is empty or invalid');
            return '';
        }
        
        // Look for critical CSS file
        if (isset($manifest['critical.css'])) {
            $css_file = $manifest['critical.css'];
            $css_path = get_template_directory() . '/dist/' . $css_file;
            
            if (file_exists($css_path)) {
                $critical_css = file_get_contents($css_path);
                
                // Basic minification of the CSS
                $critical_css = preg_replace('/\/\*[^*]*\*+([^\/][^*]*\*+)*\//', '', $critical_css); // Remove comments
                $critical_css = preg_replace('/\s+/', ' ', $critical_css); // Replace multiple spaces with single space
                $critical_css = preg_replace('/\s*([:,;{}])\s*/', '$1', $critical_css); // Remove spaces before and after :, ,, ;, {, }
                $critical_css = trim($critical_css);
            } else {
                error_log('Critical CSS: File not found at ' . $css_path);
                $critical_css = '';
            }
        } else {
            error_log('Critical CSS: critical.css not found in manifest');
            $critical_css = '';
        }
    }
    
    return $critical_css;
}

/**
 * Output the critical CSS in the document head
 */
function fitcopilot_output_critical_css() {
    $critical_css = fitcopilot_get_critical_css();
    
    if (!empty($critical_css)) {
        echo '<style id="fitcopilot-critical-css">' . $critical_css . '</style>';
    }
}

/**
 * Dequeue the critical CSS file since it's already inlined
 */
function fitcopilot_dequeue_critical_css() {
    // Get the manifest file
    $manifest_path = get_template_directory() . '/dist/manifest.json';
    $manifest = file_exists($manifest_path) ? json_decode(file_get_contents($manifest_path), true) : [];
    
    if (!empty($manifest) && isset($manifest['critical.css'])) {
        $css_file = $manifest['critical.css'];
        $handle = 'critical-css';
        
        // Check if the style is enqueued and dequeue it
        if (wp_style_is($handle, 'enqueued')) {
            wp_dequeue_style($handle);
        }
    }
}

/**
 * Add preload tags for non-critical CSS files
 */
function fitcopilot_add_preload_tags() {
    // Get the manifest file
    $manifest_path = get_template_directory() . '/dist/manifest.json';
    $manifest = file_exists($manifest_path) ? json_decode(file_get_contents($manifest_path), true) : [];
    
    if (empty($manifest)) {
        return;
    }
    
    // Skip critical CSS file since it's inlined
    foreach ($manifest as $key => $file) {
        if ($key !== 'critical.css' && strpos($key, '.css') !== false) {
            $css_url = get_template_directory_uri() . '/dist/' . $file;
            echo '<link rel="preload" href="' . esc_url($css_url) . '" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">';
            echo '<noscript><link rel="stylesheet" href="' . esc_url($css_url) . '"></noscript>';
        }
    }
}

// Hook functions to the appropriate actions based on template
function fitcopilot_setup_critical_css() {
    // Only apply to frontend
    if (is_admin()) {
        return;
    }
    
    // Check if we're on a template that uses React
    if (fitcopilot_is_react_template()) {
        // Add the critical CSS before any other styles
        add_action('wp_head', 'fitcopilot_output_critical_css', 1);
        
        // Dequeue the critical CSS file since it's already inlined
        add_action('wp_enqueue_scripts', 'fitcopilot_dequeue_critical_css', 99);
        
        // Add preload tags for non-critical CSS
        add_action('wp_head', 'fitcopilot_add_preload_tags', 2);
    }
}
add_action('template_redirect', 'fitcopilot_setup_critical_css'); 