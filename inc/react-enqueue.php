<?php
/**
 * Functions for enqueueing React assets
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Enqueue React and ReactDOM from CDN for the entire site
 */
function fitcopilot_enqueue_react() {
    // Only load these on frontend (not admin)
    if (!is_admin()) {
        wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', array(), '18.0.0', true);
        wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', array('react'), '18.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'fitcopilot_enqueue_react');

/**
 * Get the React build manifest and return it as an array
 */
function fitcopilot_get_react_manifest() {
    static $manifest = null;
    
    if ($manifest === null) {
        $manifest_path = get_template_directory() . '/dist/manifest.json';
        $manifest = file_exists($manifest_path) ? json_decode(file_get_contents($manifest_path), true) : [];
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
                get_template_directory_uri() . '/dist/' . $file,
                $deps,
                filemtime($file_path),
                $in_footer
            );
            return true;
        }
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
                get_template_directory_uri() . '/dist/' . $file,
                $deps,
                filemtime($file_path)
            );
            return true;
        }
    }
    
    return false;
}

/**
 * Function to check if current page is using a React template
 */
function fitcopilot_is_react_template() {
    global $template;
    
    $react_templates = array(
        'homepage-template.php',
        'page-homepage.php'
    );
    
    foreach ($react_templates as $react_template) {
        if (strpos($template, $react_template) !== false) {
            return true;
        }
    }
    
    return false;
} 