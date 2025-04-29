<?php
/**
 * Fitcopilot React Debugging Helpers
 * 
 * Provides tools for debugging React components.
 */

// Don't allow direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

/**
 * React Debug class
 */
class Fitcopilot_React_Debug {
    /**
     * Initialize debugging features
     */
    public static function init() {
        add_action('template_redirect', array(__CLASS__, 'check_react_debug_request'));
        add_action('wp_enqueue_scripts', array(__CLASS__, 'enqueue_debug_scripts'));
    }
    
    /**
     * Check if React debug has been requested
     */
    public static function check_react_debug_request() {
        if (isset($_GET['show_react_debug']) && $_GET['show_react_debug'] === 'true') {
            // Only allow admins to access debug
            if (!current_user_can('manage_options')) {
                wp_die('You do not have permission to access React debug features.');
            }
            
            // Add filter to output debug info
            add_filter('body_class', array(__CLASS__, 'add_debug_body_class'));
        }
    }
    
    /**
     * Add debug body class
     */
    public static function add_debug_body_class($classes) {
        $classes[] = 'react-debug-active';
        return $classes;
    }
    
    /**
     * Enqueue debug scripts
     */
    public static function enqueue_debug_scripts() {
        // Only enqueue when debug is active
        if (isset($_GET['show_react_debug']) && $_GET['show_react_debug'] === 'true') {
            wp_enqueue_script(
                'fitcopilot-react-debug',
                get_template_directory_uri() . '/dist/debug.js',
                array(),
                filemtime(get_template_directory() . '/dist/debug.js'),
                true
            );
            
            // Localize script with debug data
            wp_localize_script(
                'fitcopilot-react-debug',
                'fitcopilotDebug',
                array(
                    'isDebugMode' => true,
                    'themePath' => get_template_directory_uri(),
                    'manifestPath' => get_template_directory_uri() . '/dist/manifest.json',
                    'mountPointId' => 'athlete-dashboard-root',
                    'themeVariant' => get_theme_mod('fitcopilot_theme_variant', 'default'),
                )
            );
        }
    }
    
    /**
     * Get component render time
     * 
     * @param string $component_name The name of the component
     * @return string Formatted render time HTML
     */
    public static function get_component_render_time($component_name) {
        // Only output when debug is active
        if (isset($_GET['show_react_debug']) && $_GET['show_react_debug'] === 'true') {
            $unique_id = 'react-debug-' . sanitize_title($component_name);
            
            return sprintf(
                '<div class="react-debug-component" data-component="%s" id="%s">
                    <span class="react-debug-component-name">%s</span>
                    <span class="react-debug-render-time"></span>
                </div>',
                esc_attr($component_name),
                esc_attr($unique_id),
                esc_html($component_name)
            );
        }
        
        return '';
    }
    
    /**
     * Output React debug information
     */
    public static function output_debug_info() {
        // Only output when debug is active
        if (isset($_GET['show_react_debug']) && $_GET['show_react_debug'] === 'true') {
            ?>
            <div id="react-debug-panel" class="react-debug-panel">
                <h2>React Debug Information</h2>
                <div class="react-debug-content">
                    <div class="react-debug-section">
                        <h3>Theme Configuration</h3>
                        <ul>
                            <li>Theme Variant: <?php echo esc_html(get_theme_mod('fitcopilot_theme_variant', 'default')); ?></li>
                            <li>Homepage Template: <?php echo file_exists(get_template_directory() . '/homepage-template.php') ? 'Found' : 'Missing'; ?></li>
                            <li>Mount Point: <span id="mount-point-status">Checking...</span></li>
                        </ul>
                    </div>
                    
                    <div class="react-debug-section">
                        <h3>Asset Information</h3>
                        <ul id="asset-list">
                            <li>Loading asset information...</li>
                        </ul>
                    </div>
                    
                    <div class="react-debug-section">
                        <h3>Component Rendering</h3>
                        <div id="component-timing">
                            <p>Waiting for components to render...</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .react-debug-panel {
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    width: 400px;
                    background: rgba(0, 0, 0, 0.8);
                    color: #fff;
                    z-index: 9999;
                    font-family: monospace;
                    font-size: 12px;
                    padding: 10px;
                    border-top-left-radius: 5px;
                    max-height: 50vh;
                    overflow-y: auto;
                }
                
                .react-debug-panel h2 {
                    margin: 0 0 10px;
                    font-size: 14px;
                    color: #a3e635;
                }
                
                .react-debug-section {
                    margin-bottom: 15px;
                }
                
                .react-debug-section h3 {
                    margin: 0 0 5px;
                    font-size: 13px;
                    color: #a3e635;
                }
                
                .react-debug-component {
                    display: inline-block;
                    background: rgba(163, 230, 53, 0.1);
                    border: 1px dashed #a3e635;
                    padding: 2px;
                    margin: 2px;
                    border-radius: 3px;
                }
                
                .react-debug-component-name {
                    font-weight: bold;
                    color: #a3e635;
                }
                
                .react-debug-render-time {
                    margin-left: 5px;
                    color: #ccc;
                }
            </style>
            <?php
        }
    }
}

// Initialize React debug
Fitcopilot_React_Debug::init();

// Add a shortcode to display debug information
add_shortcode('fitcopilot_react_debug', array('Fitcopilot_React_Debug', 'output_debug_info')); 