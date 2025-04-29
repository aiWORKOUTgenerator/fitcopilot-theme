<?php
/**
 * Fitcopilot Theme Diagnostics
 * 
 * Provides diagnostics tools for debugging theme issues.
 * Access by appending ?fitcopilot_diagnostics=1 to any URL.
 */

// Don't allow direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main diagnostics class
 */
class Fitcopilot_Diagnostics {
    /**
     * Initialize diagnostics
     */
    public static function init() {
        add_action('init', array(__CLASS__, 'check_diagnostics_request'));
    }
    
    /**
     * Check if diagnostics have been requested
     */
    public static function check_diagnostics_request() {
        if (isset($_GET['fitcopilot_diagnostics']) && $_GET['fitcopilot_diagnostics'] == 1) {
            // Only allow admins to access diagnostics
            if (!current_user_can('manage_options')) {
                wp_die('You do not have permission to access diagnostics.');
            }
            
            // Run diagnostics and exit
            self::run_diagnostics();
            exit;
        }
    }
    
    /**
     * Run diagnostics and display results
     */
    public static function run_diagnostics() {
        // Disable any output buffers
        while (ob_get_level()) {
            ob_end_clean();
        }
        
        // Set headers
        header('Content-Type: text/html; charset=utf-8');
        header('X-Robots-Tag: noindex, nofollow');
        
        // Begin output
        echo '<!DOCTYPE html>';
        echo '<html>';
        echo '<head>';
        echo '<meta charset="utf-8">';
        echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
        echo '<title>Fitcopilot Theme Diagnostics</title>';
        echo '<style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                background: #f5f5f5;
                color: #333;
                margin: 0;
                padding: 20px;
                line-height: 1.6;
            }
            .diagnostics-container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 5px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                padding: 20px;
            }
            h1 {
                color: #23282d;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            h2 {
                margin-top: 30px;
                color: #0073aa;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            table, th, td {
                border: 1px solid #e1e1e1;
            }
            th, td {
                padding: 10px;
                text-align: left;
            }
            th {
                background: #f8f9fa;
            }
            .success {
                color: #46b450;
            }
            .warning {
                color: #ffb900;
            }
            .error {
                color: #dc3232;
            }
            pre {
                background: #f6f7f7;
                padding: 15px;
                border-radius: 3px;
                overflow: auto;
                max-height: 300px;
            }
            .code {
                font-family: Monaco, Consolas, "Andale Mono", "DejaVu Sans Mono", monospace;
                background: #f6f7f7;
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 13px;
            }
        </style>';
        echo '</head>';
        echo '<body>';
        echo '<div class="diagnostics-container">';
        
        // Header
        echo '<h1>Fitcopilot Theme Diagnostics</h1>';
        echo '<p>Run time: ' . current_time('mysql') . '</p>';
        
        // WordPress Info
        echo '<h2>WordPress Information</h2>';
        echo '<table>';
        echo '<tr><th>WordPress Version</th><td>' . get_bloginfo('version') . '</td></tr>';
        echo '<tr><th>PHP Version</th><td>' . phpversion() . '</td></tr>';
        echo '<tr><th>Theme</th><td>' . wp_get_theme()->get('Name') . ' v' . wp_get_theme()->get('Version') . '</td></tr>';
        echo '<tr><th>Debug Mode</th><td>' . (defined('WP_DEBUG') && WP_DEBUG ? '<span class="success">Enabled</span>' : '<span class="warning">Disabled</span>') . '</td></tr>';
        echo '<tr><th>Site URL</th><td>' . site_url() . '</td></tr>';
        echo '<tr><th>Home URL</th><td>' . home_url() . '</td></tr>';
        echo '</table>';
        
        // Theme Config
        echo '<h2>Theme Configuration</h2>';
        echo '<table>';
        $theme_variant = get_theme_mod('fitcopilot_theme_variant', 'default');
        echo '<tr><th>Current Theme Variant</th><td>' . esc_html($theme_variant) . '</td></tr>';
        
        // Check React enqueue functions
        $react_enqueue_file = get_template_directory() . '/inc/react-enqueue.php';
        $react_enqueue_exists = file_exists($react_enqueue_file);
        echo '<tr><th>React Enqueue File</th><td>' . ($react_enqueue_exists ? '<span class="success">Found</span>' : '<span class="error">Missing</span>') . '</td></tr>';
        
        // Check homepage template
        $homepage_template = get_template_directory() . '/homepage-template.php';
        $homepage_template_exists = file_exists($homepage_template);
        echo '<tr><th>Homepage Template</th><td>' . ($homepage_template_exists ? '<span class="success">Found</span>' : '<span class="error">Missing</span>') . '</td></tr>';
        
        // Check for React mount point in template
        if ($homepage_template_exists) {
            $template_content = file_get_contents($homepage_template);
            $has_mount_point = strpos($template_content, 'athlete-dashboard-root') !== false;
            echo '<tr><th>React Mount Point</th><td>' . ($has_mount_point ? '<span class="success">Found</span>' : '<span class="error">Missing</span>') . '</td></tr>';
        }
        
        // Check Tailwind config
        $tailwind_config = get_template_directory() . '/tailwind.config.js';
        $tailwind_config_exists = file_exists($tailwind_config);
        echo '<tr><th>Tailwind Config</th><td>' . ($tailwind_config_exists ? '<span class="success">Found</span>' : '<span class="warning">Missing</span>') . '</td></tr>';
        
        // Check Theme variables
        $theme_variables = get_template_directory() . '/src/styles/variants/theme-variables.scss';
        $theme_variables_exists = file_exists($theme_variables);
        echo '<tr><th>Theme Variables</th><td>' . ($theme_variables_exists ? '<span class="success">Found</span>' : '<span class="warning">Missing</span>') . '</td></tr>';
        
        echo '</table>';
        
        // Asset Verification
        echo '<h2>Asset Verification</h2>';
        echo '<table>';
        
        // Check dist directory
        $dist_dir = get_template_directory() . '/dist';
        $dist_exists = is_dir($dist_dir);
        echo '<tr><th>Dist Directory</th><td>' . ($dist_exists ? '<span class="success">Found</span>' : '<span class="error">Missing</span>') . '</td></tr>';
        
        // Check manifest file
        $manifest_file = $dist_dir . '/manifest.json';
        $manifest_exists = file_exists($manifest_file);
        echo '<tr><th>Manifest File</th><td>' . ($manifest_exists ? '<span class="success">Found</span>' : '<span class="error">Missing</span>') . '</td></tr>';
        
        // Check manifest contents
        if ($manifest_exists) {
            $manifest = json_decode(file_get_contents($manifest_file), true);
            $has_homepage_js = isset($manifest['homepage.js']);
            $has_homepage_css = isset($manifest['homepage.css']);
            
            echo '<tr><th>Homepage JS in Manifest</th><td>' . ($has_homepage_js ? '<span class="success">Found: ' . esc_html($manifest['homepage.js']) . '</span>' : '<span class="error">Missing</span>') . '</td></tr>';
            echo '<tr><th>Homepage CSS in Manifest</th><td>' . ($has_homepage_css ? '<span class="success">Found: ' . esc_html($manifest['homepage.css']) . '</span>' : '<span class="error">Missing</span>') . '</td></tr>';
            
            // Check if files exist
            if ($has_homepage_js) {
                $js_file = $dist_dir . '/' . $manifest['homepage.js'];
                $js_exists = file_exists($js_file);
                echo '<tr><th>Homepage JS File</th><td>' . ($js_exists ? '<span class="success">Found (' . size_format(filesize($js_file)) . ')</span>' : '<span class="error">Missing</span>') . '</td></tr>';
            }
            
            if ($has_homepage_css) {
                $css_file = $dist_dir . '/' . $manifest['homepage.css'];
                $css_exists = file_exists($css_file);
                echo '<tr><th>Homepage CSS File</th><td>' . ($css_exists ? '<span class="success">Found (' . size_format(filesize($css_file)) . ')</span>' : '<span class="error">Missing</span>') . '</td></tr>';
            }
        }
        
        echo '</table>';
        
        // Active Plugins
        echo '<h2>Active Plugins</h2>';
        echo '<table>';
        echo '<tr><th>Plugin</th><th>Version</th></tr>';
        
        $active_plugins = get_option('active_plugins');
        if (!empty($active_plugins)) {
            foreach ($active_plugins as $plugin) {
                $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin);
                echo '<tr><td>' . $plugin_data['Name'] . '</td><td>' . $plugin_data['Version'] . '</td></tr>';
            }
        } else {
            echo '<tr><td colspan="2">No active plugins found.</td></tr>';
        }
        
        echo '</table>';
        
        // PHP Information
        echo '<h2>PHP Information</h2>';
        echo '<table>';
        echo '<tr><th>PHP Memory Limit</th><td>' . ini_get('memory_limit') . '</td></tr>';
        echo '<tr><th>PHP Max Execution Time</th><td>' . ini_get('max_execution_time') . ' seconds</td></tr>';
        echo '<tr><th>PHP Upload Max Filesize</th><td>' . ini_get('upload_max_filesize') . '</td></tr>';
        echo '<tr><th>PHP Post Max Size</th><td>' . ini_get('post_max_size') . '</td></tr>';
        echo '</table>';
        
        // Server Information
        echo '<h2>Server Information</h2>';
        echo '<table>';
        echo '<tr><th>Server Software</th><td>' . $_SERVER['SERVER_SOFTWARE'] . '</td></tr>';
        echo '<tr><th>Server Protocol</th><td>' . $_SERVER['SERVER_PROTOCOL'] . '</td></tr>';
        echo '<tr><th>Request Method</th><td>' . $_SERVER['REQUEST_METHOD'] . '</td></tr>';
        echo '<tr><th>HTTPS</th><td>' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'Yes' : 'No') . '</td></tr>';
        echo '<tr><th>Server Time</th><td>' . date('Y-m-d H:i:s') . '</td></tr>';
        echo '</table>';
        
        // Theme Directory Structure
        echo '<h2>Theme Directory Structure</h2>';
        echo '<pre>';
        $theme_dir = get_template_directory();
        $root_items = scandir($theme_dir);
        $important_dirs = array('src', 'dist', 'inc', 'includes');
        
        foreach ($important_dirs as $dir) {
            if (in_array($dir, $root_items) && is_dir($theme_dir . '/' . $dir)) {
                echo "+ $dir/\n";
                $items = scandir($theme_dir . '/' . $dir);
                foreach ($items as $item) {
                    if ($item != '.' && $item != '..') {
                        $is_dir = is_dir($theme_dir . '/' . $dir . '/' . $item);
                        echo "  " . ($is_dir ? "+" : "-") . " $item" . ($is_dir ? "/" : "") . "\n";
                    }
                }
            }
        }
        echo '</pre>';
        
        // Footer
        echo '<p style="margin-top: 30px; text-align: center; color: #777;">Fitcopilot Theme Diagnostics Tool v1.0 | Refresh for updated results</p>';
        
        echo '</div>';
        echo '</body>';
        echo '</html>';
    }
}

// Initialize diagnostics
Fitcopilot_Diagnostics::init(); 