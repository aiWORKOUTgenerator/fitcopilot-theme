<?php
/**
 * Fitcopilot Theme Diagnostics - ROBUST VERSION
 * 
 * Provides advanced diagnostics tools for debugging theme issues.
 * Access by appending ?fitcopilot_diagnostics=1 to any URL.
 */

// Don't allow direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Robust diagnostics class with comprehensive error handling
 */
class Fitcopilot_Diagnostics {
    /**
     * Initialize diagnostics
     */
    public static function init() {
        add_action('init', array(__CLASS__, 'check_diagnostics_request'));
        add_action('init', array(__CLASS__, 'handle_debug_actions'));
    }
    
    /**
     * Handle debug actions (enable/disable debug mode)
     */
    public static function handle_debug_actions() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        if (isset($_GET['fitcopilot_action'])) {
            switch ($_GET['fitcopilot_action']) {
                case 'enable_debug':
                    self::enable_debug_mode();
                    break;
                case 'disable_debug':
                    self::disable_debug_mode();
                    break;
            }
        }
    }
    
    /**
     * Enable WordPress debug mode
     */
    public static function enable_debug_mode() {
        // Simple message for now - no file writing to avoid errors
        wp_redirect(add_query_arg(array('fitcopilot_diagnostics' => '1', 'debug_enabled' => '1'), home_url()));
        exit;
    }
    
    /**
     * Disable WordPress debug mode
     */
    public static function disable_debug_mode() {
        wp_redirect(add_query_arg('fitcopilot_diagnostics', '1', home_url()));
        exit;
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
     * Safe function to check for theme loading errors
     */
    public static function check_theme_errors() {
        $errors = array();
        
        try {
            // Check if functions exist
            if (!function_exists('fitcopilot_enqueue_assets')) {
                $errors[] = "Missing function: fitcopilot_enqueue_assets";
            }
            
            // Check critical files
            $critical_files = array(
                'functions.php',
                'inc/react-enqueue.php',
                'homepage-template.php',
                'dist/manifest.json'
            );
            
            foreach ($critical_files as $file) {
                $full_path = get_template_directory() . '/' . $file;
                if (!file_exists($full_path)) {
                    $errors[] = "Missing critical file: $file";
                }
            }
            
        } catch (Exception $e) {
            $errors[] = "Error checking theme: " . $e->getMessage();
        }
        
        return $errors;
    }
    
    /**
     * Get recent PHP errors safely
     */
    public static function get_recent_errors() {
        $error_info = array();
        
        try {
            // Check common error log locations
            $error_log_paths = array(
                WP_CONTENT_DIR . '/debug.log',
                ABSPATH . 'error_log',
                ini_get('error_log')
            );
            
            foreach ($error_log_paths as $log_path) {
                if ($log_path && file_exists($log_path) && is_readable($log_path)) {
                    $size = filesize($log_path);
                    $error_info[] = array(
                        'path' => $log_path,
                        'size' => $size,
                        'exists' => true,
                        'readable' => true
                    );
                    
                    // Get last few lines if file is not too large
                    if ($size > 0 && $size < 1000000) { // Less than 1MB
                        $content = file_get_contents($log_path);
                        $lines = explode("\n", $content);
                        $recent_lines = array_slice($lines, -10); // Last 10 lines
                        $error_info[count($error_info) - 1]['recent_content'] = implode("\n", $recent_lines);
                    }
                } else {
                    $error_info[] = array(
                        'path' => $log_path,
                        'exists' => file_exists($log_path),
                        'readable' => $log_path && file_exists($log_path) ? is_readable($log_path) : false
                    );
                }
            }
        } catch (Exception $e) {
            $error_info[] = array('error' => 'Error reading logs: ' . $e->getMessage());
        }
        
        return $error_info;
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
        echo '<title>🔧 Fitcopilot Advanced Diagnostics</title>';
        echo '<style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background: #f5f5f5;
                color: #333;
                margin: 0;
                padding: 20px;
                line-height: 1.6;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 30px;
            }
            h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 15px; }
            h2 { color: #34495e; margin-top: 40px; border-left: 4px solid #3498db; padding-left: 15px; }
            h3 { color: #7f8c8d; }
            .status-good { color: #27ae60; font-weight: bold; }
            .status-warning { color: #f39c12; font-weight: bold; }
            .status-error { color: #e74c3c; font-weight: bold; }
            .error-box {
                background: #fdf2f2;
                border: 2px solid #e74c3c;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .success-box {
                background: #f0f9ff;
                border: 2px solid #3498db;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .warning-box {
                background: #fffbf0;
                border: 2px solid #f39c12;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                background: white;
            }
            th, td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #ecf0f1;
            }
            th {
                background: #34495e;
                color: white;
                font-weight: 600;
            }
            tr:hover { background: #f8f9fa; }
            .button {
                display: inline-block;
                background: #3498db;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 6px;
                margin: 8px;
                font-weight: 500;
                transition: background 0.3s;
            }
            .button:hover { background: #2980b9; color: white; }
            .button-danger { background: #e74c3c; }
            .button-danger:hover { background: #c0392b; }
            .button-success { background: #27ae60; }
            .button-success:hover { background: #229954; }
            pre {
                background: #2c3e50;
                color: #ecf0f1;
                padding: 20px;
                border-radius: 6px;
                overflow: auto;
                font-size: 14px;
                max-height: 400px;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            .card {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 20px;
            }
        </style>';
        echo '</head>';
        echo '<body>';
        echo '<div class="container">';
        
        // Header
        echo '<h1>🔧 Fitcopilot Advanced Diagnostics</h1>';
        echo '<p><strong>Scan Time:</strong> ' . current_time('mysql') . '</p>';
        
        // Debug Actions
        echo '<div class="success-box">';
        echo '<h3>🎛️ Debug Controls</h3>';
        
        $debug_enabled = defined('WP_DEBUG') && WP_DEBUG;
        if ($debug_enabled) {
            echo '<p class="status-good">Debug Mode: ENABLED ✅</p>';
            echo '<a href="' . add_query_arg(array('fitcopilot_action' => 'disable_debug', 'fitcopilot_diagnostics' => '1'), home_url()) . '" class="button button-danger">Turn OFF Debug</a>';
        } else {
            echo '<p class="status-warning">Debug Mode: DISABLED ⚠️</p>';
            echo '<a href="' . add_query_arg(array('fitcopilot_action' => 'enable_debug', 'fitcopilot_diagnostics' => '1'), home_url()) . '" class="button button-success">Turn ON Debug</a>';
        }
        
        echo '<a href="' . home_url() . '" class="button">🏠 Test Homepage</a>';
        echo '<a href="' . add_query_arg('fitcopilot_diagnostics', '1', home_url()) . '" class="button">🔄 Refresh</a>';
        echo '</div>';
        
        // Critical Error Detection
        echo '<h2>🚨 Critical Error Detection</h2>';
        
        $theme_errors = self::check_theme_errors();
        if (!empty($theme_errors)) {
            echo '<div class="error-box">';
            echo '<h3>❌ CRITICAL ISSUES FOUND:</h3>';
            foreach ($theme_errors as $error) {
                echo '<p class="status-error">• ' . esc_html($error) . '</p>';
            }
            echo '</div>';
        } else {
            echo '<div class="success-box">';
            echo '<p class="status-good">✅ No critical theme loading errors detected!</p>';
            echo '</div>';
        }
        
        // PHP Error Logs Analysis
        echo '<h2>📋 PHP Error Log Analysis</h2>';
        
        $error_logs = self::get_recent_errors();
        if (!empty($error_logs)) {
            foreach ($error_logs as $log_info) {
                if (isset($log_info['error'])) {
                    echo '<div class="warning-box">';
                    echo '<p class="status-warning">' . esc_html($log_info['error']) . '</p>';
                    echo '</div>';
                } else {
                    echo '<div class="card">';
                    echo '<h4>Log: ' . esc_html($log_info['path']) . '</h4>';
                    echo '<p><strong>Exists:</strong> ' . ($log_info['exists'] ? '<span class="status-good">Yes</span>' : '<span class="status-error">No</span>') . '</p>';
        
                    if ($log_info['exists']) {
                        echo '<p><strong>Readable:</strong> ' . ($log_info['readable'] ? '<span class="status-good">Yes</span>' : '<span class="status-error">No</span>') . '</p>';
                        
                        if (isset($log_info['size'])) {
                            echo '<p><strong>Size:</strong> ' . size_format($log_info['size']) . '</p>';
                            
                            if ($log_info['size'] > 0 && isset($log_info['recent_content'])) {
                                echo '<h5>Recent Entries:</h5>';
                                echo '<pre>' . esc_html($log_info['recent_content']) . '</pre>';
                            } elseif ($log_info['size'] == 0) {
                                echo '<p class="status-good">✅ Log is empty (no errors)</p>';
                            }
                        }
                    }
                    echo '</div>';
                }
            }
        }
        
        // System Information Grid
        echo '<h2>💻 System Information</h2>';
        echo '<div class="grid">';
        
        // WordPress Info Card
        echo '<div class="card">';
        echo '<h3>🔷 WordPress Info</h3>';
        echo '<table>';
        echo '<tr><td><strong>WP Version</strong></td><td>' . get_bloginfo('version') . '</td></tr>';
        echo '<tr><td><strong>PHP Version</strong></td><td>' . phpversion() . '</td></tr>';
        echo '<tr><td><strong>Theme</strong></td><td>' . wp_get_theme()->get('Name') . ' v' . wp_get_theme()->get('Version') . '</td></tr>';
        echo '<tr><td><strong>Memory Usage</strong></td><td>' . size_format(memory_get_usage()) . ' / ' . ini_get('memory_limit') . '</td></tr>';
        echo '<tr><td><strong>Site URL</strong></td><td>' . home_url() . '</td></tr>';
        echo '</table>';
        echo '</div>';
        
        // Theme Files Card
        echo '<div class="card">';
        echo '<h3>📁 Theme Files</h3>';
        echo '<table>';
        
        $critical_files = array(
            'functions.php' => 'Core theme functions',
            'inc/react-enqueue.php' => 'Asset loading',
            'homepage-template.php' => 'Homepage template',
            'dist/manifest.json' => 'Build manifest',
            'style.css' => 'Theme stylesheet'
        );
        
        foreach ($critical_files as $file => $description) {
            $full_path = get_template_directory() . '/' . $file;
            $exists = file_exists($full_path);
            $size = $exists ? size_format(filesize($full_path)) : 'N/A';
            
            echo '<tr>';
            echo '<td><strong>' . $file . '</strong><br><small>' . $description . '</small></td>';
            echo '<td>' . ($exists ? '<span class="status-good">✅ ' . $size . '</span>' : '<span class="status-error">❌ Missing</span>') . '</td>';
            echo '</tr>';
        }
        echo '</table>';
        echo '</div>';
        
        echo '</div>'; // End grid
        
        // Asset Verification
        echo '<h2>🎯 Build Assets Analysis</h2>';
        
        $dist_dir = get_template_directory() . '/dist';
        $manifest_file = $dist_dir . '/manifest.json';
        
        if (file_exists($manifest_file)) {
            $manifest_content = file_get_contents($manifest_file);
            $manifest = json_decode($manifest_content, true);
            
            if (json_last_error() === JSON_ERROR_NONE) {
                echo '<div class="success-box">';
                echo '<h3>✅ Build Manifest Valid</h3>';
                echo '<table>';
                
                foreach ($manifest as $key => $filename) {
                    $file_path = $dist_dir . '/' . $filename;
                    $exists = file_exists($file_path);
                    $size = $exists ? size_format(filesize($file_path)) : 'Missing';
                    $readable = $exists ? is_readable($file_path) : false;
            
                    echo '<tr>';
                    echo '<td><strong>' . $key . '</strong></td>';
                    echo '<td>' . $filename . '</td>';
                    echo '<td>' . ($exists ? '<span class="status-good">✅ ' . $size . '</span>' : '<span class="status-error">❌ Missing</span>') . '</td>';
                    echo '<td>' . ($readable ? '<span class="status-good">Readable</span>' : '<span class="status-error">Permission Error</span>') . '</td>';
                    echo '</tr>';
                }
                echo '</table>';
                echo '</div>';
            } else {
                echo '<div class="error-box">';
                echo '<h3>❌ Manifest JSON Error</h3>';
                echo '<p>Error: ' . json_last_error_msg() . '</p>';
                echo '</div>';
            }
        } else {
            echo '<div class="error-box">';
            echo '<h3>❌ Build Manifest Missing</h3>';
            echo '<p>The dist/manifest.json file is missing. This will cause the theme to fail loading assets.</p>';
            echo '</div>';
        }
        
        // Server Environment
        echo '<h2>🖥️ Server Environment</h2>';
        echo '<table>';
        echo '<tr><th>Setting</th><th>Value</th></tr>';
        echo '<tr><td>Server Software</td><td>' . $_SERVER['SERVER_SOFTWARE'] . '</td></tr>';
        echo '<tr><td>PHP Memory Limit</td><td>' . ini_get('memory_limit') . '</td></tr>';
        echo '<tr><td>PHP Max Execution Time</td><td>' . ini_get('max_execution_time') . 's</td></tr>';
        echo '<tr><td>PHP Error Reporting</td><td>' . (error_reporting() ? 'Enabled' : 'Disabled') . '</td></tr>';
        echo '<tr><td>Display Errors</td><td>' . (ini_get('display_errors') ? 'On' : 'Off') . '</td></tr>';
        echo '<tr><td>Log Errors</td><td>' . (ini_get('log_errors') ? 'On' : 'Off') . '</td></tr>';
        echo '<tr><td>Error Log Location</td><td>' . ini_get('error_log') . '</td></tr>';
        echo '</table>';
        
        // Active Plugins
        echo '<h2>🔌 Active Plugins</h2>';
        echo '<table>';
        echo '<tr><th>Plugin</th><th>Version</th></tr>';
        
        $active_plugins = get_option('active_plugins');
        if (!empty($active_plugins)) {
            foreach ($active_plugins as $plugin) {
                $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin);
                echo '<tr><td>' . $plugin_data['Name'] . '</td><td>' . $plugin_data['Version'] . '</td></tr>';
            }
        } else {
            echo '<tr><td colspan="2">No active plugins</td></tr>';
        }
        echo '</table>';
        
        // Footer
        echo '<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d;">';
        echo '<p>🔧 Fitcopilot Advanced Diagnostics v2.1 | ';
        echo '<a href="' . add_query_arg('fitcopilot_diagnostics', '1', home_url()) . '">Refresh Results</a>';
        echo '</p>';
        echo '</div>';
        
        echo '</div>'; // End container
        echo '</body>';
        echo '</html>';
    }
}

// Initialize diagnostics
Fitcopilot_Diagnostics::init(); 