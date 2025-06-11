<?php
/**
 * FitCopilot Admin Base Template
 * Reusable HTML structure for all admin interfaces
 * 
 * @package FitCopilot
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render admin page header
 * 
 * @param string $title Page title
 * @param array $tabs Tab configuration
 */
function fitcopilot_render_admin_header($title, $tabs = []) {
    ?>
    <div class="fitcopilot-admin-background">
        <div class="fitcopilot-particle"></div>
        <div class="fitcopilot-particle"></div>
        <div class="fitcopilot-particle"></div>
        <div class="fitcopilot-particle"></div>
    </div>
    
    <div class="fitcopilot-admin-container">
        <!-- Header -->
        <div class="fitcopilot-admin-header">
            <div class="fitcopilot-admin-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            </div>
            <h1><?php echo esc_html($title); ?></h1>
        </div>
        
        <?php if (!empty($tabs)): ?>
        <!-- Tab Navigation -->
        <div class="nav-tab-wrapper">
            <?php foreach ($tabs as $id => $tab): ?>
                <a href="#<?php echo esc_attr($id); ?>" 
                   class="nav-tab <?php echo ($tab['active'] ?? false) ? 'nav-tab-active' : ''; ?>">
                    <?php echo esc_html($tab['label']); ?>
                </a>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    <?php
}

/**
 * Render admin page footer
 */
function fitcopilot_render_admin_footer() {
    ?>
    </div> <!-- .fitcopilot-admin-container -->
    <?php
}

/**
 * Render status indicator
 * 
 * @param int $count Item count
 * @param string $item_type Type of items
 */
function fitcopilot_render_status_indicator($count, $item_type = 'items') {
    ?>
    <div class="fitcopilot-status-indicator">
        <strong>📊 Current Status:</strong> <?php echo absint($count); ?> <?php echo esc_html($item_type); ?> loaded.
    </div>
    <?php
}

/**
 * Render success/error notices
 * 
 * @param string $message Message to display
 * @param string $type Notice type (success, error, warning, info)
 */
function fitcopilot_render_admin_notice($message, $type = 'success') {
    $icon_map = [
        'success' => '✅',
        'error' => '❌',
        'warning' => '⚠️',
        'info' => 'ℹ️'
    ];
    
    $icon = $icon_map[$type] ?? '📋';
    ?>
    <div class="notice notice-<?php echo esc_attr($type); ?> is-dismissible">
        <p><?php echo $icon; ?> <?php echo esc_html($message); ?></p>
    </div>
    <?php
}

/**
 * Render add new item button
 * 
 * @param string $item_type Type of item (testimonial, trainer, etc.)
 * @param string $button_text Custom button text
 */
function fitcopilot_render_add_item_button($item_type, $button_text = null) {
    if (!$button_text) {
        $button_text = '➕ Add New ' . ucfirst($item_type);
    }
    ?>
    <button type="button" class="button button-secondary add-<?php echo esc_attr($item_type); ?>-btn">
        <?php echo esc_html($button_text); ?>
    </button>
    <?php
}

/**
 * Render form actions section
 * 
 * @param string $feature_name Feature name for submit button
 * @param bool $show_reset Whether to show reset button
 * @param bool $show_test Whether to show test button (for complex features)
 */
function fitcopilot_render_form_actions($feature_name, $show_reset = true, $show_test = false) {
    $feature_slug = sanitize_key($feature_name);
    ?>
    <div class="form-actions">
        <input type="submit" name="fitcopilot_<?php echo esc_attr($feature_slug); ?>_submit" 
               class="button button-primary" value="Save All Changes" />
        
        <?php if ($show_reset): ?>
            <input type="submit" name="fitcopilot_reset_defaults" 
                   class="button button-secondary" 
                   value="Reset to Defaults"
                   onclick="return confirm('Are you sure you want to reset all data to defaults? This cannot be undone.');" 
                   style="margin-left: 10px;" />
        <?php endif; ?>
        
        <?php if ($show_test): ?>
            <button type="button" id="test-frontend-data" class="button button-secondary" 
                    style="margin-left: 10px;">
                🔍 Test Frontend Data Flow
            </button>
        <?php endif; ?>
    </div>
    <?php
} 