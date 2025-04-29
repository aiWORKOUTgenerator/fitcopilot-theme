<?php
/**
 * Fitcopilot Admin Diagnostics Page
 * 
 * Adds a diagnostics page to the WordPress admin.
 */

// Don't allow direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Admin Diagnostics Class
 */
class Fitcopilot_Admin_Diagnostics {
    /**
     * Initialize the admin diagnostics page
     */
    public static function init() {
        add_action('admin_menu', array(__CLASS__, 'add_diagnostics_page'));
    }
    
    /**
     * Add the diagnostics page to the admin menu
     */
    public static function add_diagnostics_page() {
        // Add as submenu to the Fitcopilot menu
        add_submenu_page(
            'fitcopilot-dashboard', // Parent slug (Fitcopilot main menu)
            'Fitcopilot Diagnostics', // Page title
            'Diagnostics', // Menu title
            'manage_options', // Capability
            'fitcopilot-diagnostics', // Menu slug
            array(__CLASS__, 'render_diagnostics_page') // Callback function
        );
    }
    
    /**
     * Render the diagnostics page
     */
    public static function render_diagnostics_page() {
        ?>
        <div class="wrap">
            <h1>Fitcopilot Theme Diagnostics</h1>
            
            <p>This page provides diagnostics tools for the Fitcopilot theme. You can run these diagnostics to troubleshoot issues with your React application and theme configuration.</p>
            
            <div class="card">
                <h2>Run Diagnostics</h2>
                <p>Click the button below to run the full diagnostics report in a new window:</p>
                <a href="<?php echo add_query_arg('fitcopilot_diagnostics', '1', home_url()); ?>" class="button button-primary" target="_blank">Run Full Diagnostics</a>
            </div>
            
            <div class="card" style="margin-top: 20px;">
                <h2>React Component Debug</h2>
                <p>View the React component debug page to check if your components are loading correctly:</p>
                <a href="<?php echo add_query_arg('show_react_debug', 'true', home_url()); ?>" class="button button-secondary" target="_blank">View React Debug</a>
            </div>
            
            <div class="card" style="margin-top: 20px;">
                <h2>Cache Management</h2>
                <p>Clear the theme's caches to resolve potential issues:</p>
                <form method="post" action="">
                    <?php wp_nonce_field('fitcopilot_clear_cache', 'fitcopilot_cache_nonce'); ?>
                    <input type="hidden" name="action" value="clear_cache">
                    <button type="submit" class="button">Clear Theme Cache</button>
                </form>
                
                <?php
                // Process cache clearing
                if (isset($_POST['action']) && $_POST['action'] === 'clear_cache') {
                    if (isset($_POST['fitcopilot_cache_nonce']) && wp_verify_nonce($_POST['fitcopilot_cache_nonce'], 'fitcopilot_clear_cache')) {
                        // Clear transients
                        delete_transient('fitcopilot_asset_manifest');
                        
                        // Add any other cache clearing logic here
                        
                        echo '<div class="notice notice-success inline"><p>Theme cache cleared successfully!</p></div>';
                    } else {
                        echo '<div class="notice notice-error inline"><p>Security check failed. Please try again.</p></div>';
                    }
                }
                ?>
            </div>
            
            <div class="card" style="margin-top: 20px;">
                <h2>Quick System Check</h2>
                <table class="widefat" style="margin-top: 10px;">
                    <thead>
                        <tr>
                            <th>Check</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        // Check dist directory
                        $dist_dir = get_template_directory() . '/dist';
                        $dist_exists = is_dir($dist_dir);
                        
                        echo '<tr>';
                        echo '<td>Dist Directory</td>';
                        echo '<td>' . ($dist_exists ? '<span style="color: green;">✓ Found</span>' : '<span style="color: red;">✗ Missing</span>') . '</td>';
                        echo '</tr>';
                        
                        // Check manifest file
                        $manifest_file = $dist_dir . '/manifest.json';
                        $manifest_exists = file_exists($manifest_file);
                        
                        echo '<tr>';
                        echo '<td>Manifest File</td>';
                        echo '<td>' . ($manifest_exists ? '<span style="color: green;">✓ Found</span>' : '<span style="color: red;">✗ Missing</span>') . '</td>';
                        echo '</tr>';
                        
                        // Check React mount point
                        $homepage_template = get_template_directory() . '/homepage-template.php';
                        if (file_exists($homepage_template)) {
                            $template_content = file_get_contents($homepage_template);
                            $has_mount_point = strpos($template_content, 'athlete-dashboard-root') !== false;
                            
                            echo '<tr>';
                            echo '<td>React Mount Point</td>';
                            echo '<td>' . ($has_mount_point ? '<span style="color: green;">✓ Found</span>' : '<span style="color: red;">✗ Missing</span>') . '</td>';
                            echo '</tr>';
                        }
                        
                        // Check theme variant
                        $theme_variant = get_theme_mod('fitcopilot_theme_variant', 'default');
                        
                        echo '<tr>';
                        echo '<td>Current Theme Variant</td>';
                        echo '<td>' . esc_html($theme_variant) . '</td>';
                        echo '</tr>';
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php
    }
}

// Initialize the admin diagnostics
Fitcopilot_Admin_Diagnostics::init(); 