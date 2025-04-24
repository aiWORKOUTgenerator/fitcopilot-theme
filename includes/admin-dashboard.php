<?php
/**
 * FitCopilot Admin Dashboard
 * 
 * Handles the WordPress admin dashboard including:
 * - Creating an admin menu item
 * - Adding a dashboard page with settings
 * - Providing toggles for theme features
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Register the Fitcopilot admin menu
 */
function fitcopilot_register_admin_menu() {
    add_menu_page(
        __('FitCopilot Dashboard', 'fitcopilot'),
        __('FitCopilot', 'fitcopilot'),
        'manage_options',
        'fitcopilot-dashboard',
        'fitcopilot_dashboard_page',
        'dashicons-performance', // Fitness-related icon
        30 // Position in menu
    );
}
add_action('admin_menu', 'fitcopilot_register_admin_menu');

/**
 * Render the dashboard page content
 */
function fitcopilot_dashboard_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // Handle form submission
    if (isset($_POST['fitcopilot_settings_submit'])) {
        check_admin_referer('fitcopilot_dashboard_nonce');
        
        // Update demo mode setting
        $demo_mode = isset($_POST['fitcopilot_demo_mode']) ? true : false;
        set_theme_mod('fitcopilot_demo_mode', $demo_mode);
        
        // Show success message
        echo '<div class="notice notice-success is-dismissible"><p>' . __('Settings saved successfully!', 'fitcopilot') . '</p></div>';
    }

    // Get current settings
    $demo_mode = get_theme_mod('fitcopilot_demo_mode', false);
    
    // CSS for admin page
    ?>
    <style>
        .fitcopilot-admin-wrap {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .fitcopilot-admin-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .fitcopilot-admin-header h1 {
            margin: 0;
            padding: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .fitcopilot-admin-logo {
            width: 40px;
            height: 40px;
            margin-right: 15px;
            background: #84cc16;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .fitcopilot-admin-logo svg {
            width: 24px;
            height: 24px;
            fill: white;
        }
        .fitcopilot-card {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .fitcopilot-card h2 {
            margin-top: 0;
            font-size: 18px;
            font-weight: 600;
        }
        .fitcopilot-toggle-wrap {
            margin: 20px 0;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .fitcopilot-toggle {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .fitcopilot-toggle label {
            font-weight: 500;
            margin-left: 10px;
        }
        .fitcopilot-toggle-desc {
            margin-left: 34px;
            color: #666;
            font-size: 13px;
        }
        .fitcopilot-submit {
            margin-top: 20px;
        }
        .fitcopilot-links {
            margin-top: 30px;
        }
        .fitcopilot-links a {
            display: inline-block;
            margin-right: 15px;
            text-decoration: none;
        }
    </style>

    <div class="wrap fitcopilot-admin-wrap">
        <div class="fitcopilot-admin-header">
            <div class="fitcopilot-admin-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.75 3.03v.41c0 .98.75 1.56 1.72 1.56H16V3.75a.75.75 0 1 1 1.5 0v1.41l1.72.78c.45.2.72.64.72 1.12V21a1.5 1.5 0 0 1-1.5 1.5h-13.5a1.5 1.5 0 0 1-1.5-1.5V7.06c0-.48.27-.93.72-1.12l6.05-2.72c.38-.17.82-.17 1.2 0l.2.09zm-.22 1.72a.75.75 0 0 0-.99.7v16.05h10.22V7.38l-1.72-.78V8.4c0 .98-.75 1.56-1.72 1.56H14.3a1.5 1.5 0 0 1-1.28-.72l-.22-.32V4.75Z"/></svg>
            </div>
            <h1><?php echo esc_html__('FitCopilot Dashboard', 'fitcopilot'); ?></h1>
        </div>
        
        <form method="post" action="">
            <?php wp_nonce_field('fitcopilot_dashboard_nonce'); ?>
            
            <div class="fitcopilot-card">
                <h2><?php echo esc_html__('Theme Settings', 'fitcopilot'); ?></h2>
                <p><?php echo esc_html__('Configure how your FitCopilot theme behaves and appears.', 'fitcopilot'); ?></p>
                
                <div class="fitcopilot-toggle-wrap">
                    <div class="fitcopilot-toggle">
                        <input 
                            type="checkbox" 
                            id="fitcopilot_demo_mode" 
                            name="fitcopilot_demo_mode" 
                            <?php checked($demo_mode, true); ?> 
                        />
                        <label for="fitcopilot_demo_mode"><?php echo esc_html__('Enable Demo Mode', 'fitcopilot'); ?></label>
                    </div>
                    <p class="fitcopilot-toggle-desc">
                        <?php echo esc_html__('Shows a navigation menu for demoing all sections and variants on the homepage.', 'fitcopilot'); ?>
                    </p>
                </div>
            </div>
            
            <!-- Troubleshooting Card -->
            <div class="fitcopilot-card">
                <h2><?php echo esc_html__('Troubleshooting', 'fitcopilot'); ?></h2>
                <p><?php echo esc_html__('Use these tools to check if Demo Mode is working correctly.', 'fitcopilot'); ?></p>
                
                <div class="fitcopilot-debug-info">
                    <h3 style="margin-top: 15px; font-size: 14px;">Current Settings Status</h3>
                    <div style="background: #f0f0f0; padding: 10px; border-radius: 4px; margin-top: 10px; font-family: monospace; font-size: 12px;">
                        <?php
                        echo 'Demo Mode: <strong>' . ($demo_mode ? 'Enabled ✅' : 'Disabled ❌') . '</strong><br>';
                        echo 'Hero Variant: <strong>' . esc_html(get_theme_mod('fitcopilot_hero_variant', 'default')) . '</strong><br>';
                        echo 'Features Variant: <strong>' . esc_html(get_theme_mod('fitcopilot_features_variant', 'default')) . '</strong><br>';
                        ?>
                    </div>
                    
                    <h3 style="margin-top: 15px; font-size: 14px;">Check Demo Mode</h3>
                    <p style="font-size: 13px;">
                        If demo mode is not working, try these steps:
                    </p>
                    <ol style="font-size: 13px; margin-left: 20px;">
                        <li>Save settings and <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank">visit the homepage</a></li>
                        <li>Check your browser console for errors</li>
                        <li>Look for "Demo Mode Active: true" indicator in the bottom left of the page</li>
                        <li>Look for a panel on the right side with variant options</li>
                    </ol>
                    
                    <div style="margin-top: 15px;">
                        <a href="<?php echo esc_url(home_url('/?demo=1')); ?>" target="_blank" class="button">
                            <?php echo esc_html__('Test Homepage in Demo Mode', 'fitcopilot'); ?>
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="fitcopilot-submit">
                <input type="submit" name="fitcopilot_settings_submit" class="button button-primary" value="<?php echo esc_attr__('Save Settings', 'fitcopilot'); ?>" />
                <a href="<?php echo esc_url(admin_url('customize.php?autofocus[section]=fitcopilot_variants')); ?>" class="button" style="margin-left: 10px;">
                    <?php echo esc_html__('Customize Theme Variants', 'fitcopilot'); ?>
                </a>
            </div>
        </form>
        
        <div class="fitcopilot-links">
            <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank"><?php echo esc_html__('View Homepage', 'fitcopilot'); ?></a>
            <a href="<?php echo esc_url(admin_url('customize.php')); ?>"><?php echo esc_html__('Customize Theme', 'fitcopilot'); ?></a>
        </div>
    </div>
    <?php
}

/**
 * Add quick link to dashboard in admin bar
 */
function fitcopilot_admin_bar_link($wp_admin_bar) {
    // Only show to users who can manage options
    if (!current_user_can('manage_options')) {
        return;
    }

    $wp_admin_bar->add_node([
        'id'    => 'fitcopilot-dashboard',
        'title' => __('FitCopilot Dashboard', 'fitcopilot'),
        'href'  => admin_url('admin.php?page=fitcopilot-dashboard'),
    ]);
}
add_action('admin_bar_menu', 'fitcopilot_admin_bar_link', 100); 