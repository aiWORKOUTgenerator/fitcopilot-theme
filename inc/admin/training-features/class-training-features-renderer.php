<?php
/**
 * FitCopilot Training Features Renderer
 * 
 * Handles all HTML rendering for Training Features admin interface
 * Following the established Personal Training Admin renderer pattern
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Features Renderer Class
 * 
 * Manages all HTML output for the admin interface following PRD specifications
 */
class FitCopilot_Training_Features_Renderer {
    
    /**
     * Data manager instance
     */
    private $data_manager;
    
    /**
     * Constructor
     * 
     * @param FitCopilot_Training_Features_Data $data_manager Data manager instance
     */
    public function __construct($data_manager) {
        $this->data_manager = $data_manager;
    }
    
    /**
     * Render the main admin page
     */
    public function render_page() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }

        // Get current data
        $features_data = $this->data_manager->get_features();
        $settings = $this->data_manager->get_settings();

        // Get current active tab
        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'main-content';
        
        $this->render_admin_wrapper($features_data, $settings, $active_tab);
    }
    
    /**
     * Render tab content (required by Complex Manager pattern)
     * 
     * @param string $active_tab Current active tab
     * @param array $data Current training features data
     * @param array $settings Current settings
     */
    public function render_tab_content($active_tab, $data, $settings) {
        if ($active_tab === 'main-content') {
            $this->render_main_content_tab($data);
        } elseif ($active_tab === 'cta-management') {
            $this->render_cta_management_tab($settings);
        } elseif ($active_tab === 'categories') {
            $this->render_categories_tab($data);
        } elseif ($active_tab === 'settings') {
            $this->render_settings_tab($settings);
        } elseif ($active_tab === 'display-options') {
            $this->render_display_options_tab($settings);
        } elseif ($active_tab === 'export-import') {
            $this->render_export_import_tab();
        }
    }
    
    /**
     * Render the main admin wrapper
     */
    private function render_admin_wrapper($features_data, $settings, $active_tab) {
        ?>
        <div class="wrap fitcopilot-training-features-admin">
            <!-- Animated background -->
            <div class="fitcopilot-admin-background">
                <div class="fitcopilot-particle"></div>
                <div class="fitcopilot-particle"></div>
                <div class="fitcopilot-particle"></div>
                <div class="fitcopilot-particle"></div>
            </div>
            
            <div class="fitcopilot-admin-container">
                <?php $this->render_header(); ?>
                <?php $this->render_tab_navigation($active_tab); ?>
                <?php $this->render_status_indicator($features_data); ?>
                
                <?php $this->render_tab_content($active_tab, $features_data, $settings); ?>
            </div>
        </div>
        <?php
    }
    
    /**
     * Render admin header
     */
    private function render_header() {
        ?>
        <div class="fitcopilot-admin-header">
            <div class="fitcopilot-admin-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            </div>
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        </div>
        <?php
    }
    
    /**
     * Render tab navigation
     */
    private function render_tab_navigation($active_tab) {
        ?>
        <div class="nav-tab-wrapper">
            <a href="?page=fitcopilot-training-features&tab=main-content" 
               class="nav-tab <?php echo $active_tab === 'main-content' ? 'nav-tab-active' : ''; ?>">
               Manage Features
            </a>
            <a href="?page=fitcopilot-training-features&tab=cta-management" 
               class="nav-tab <?php echo $active_tab === 'cta-management' ? 'nav-tab-active' : ''; ?>">
               CTA Management
            </a>
            <a href="?page=fitcopilot-training-features&tab=categories" 
               class="nav-tab <?php echo $active_tab === 'categories' ? 'nav-tab-active' : ''; ?>">
               Categories
            </a>
            <a href="?page=fitcopilot-training-features&tab=settings" 
               class="nav-tab <?php echo $active_tab === 'settings' ? 'nav-tab-active' : ''; ?>">
               Settings
            </a>
            <a href="?page=fitcopilot-training-features&tab=display-options" 
               class="nav-tab <?php echo $active_tab === 'display-options' ? 'nav-tab-active' : ''; ?>">
               Display Options
            </a>
            <a href="?page=fitcopilot-training-features&tab=export-import" 
               class="nav-tab <?php echo $active_tab === 'export-import' ? 'nav-tab-active' : ''; ?>">
               Export / Import
            </a>
        </div>
        <?php
    }
    
    /**
     * Render status indicator
     */
    private function render_status_indicator($features_data) {
        $active_count = count(array_filter($features_data, function($feature) { 
            return !empty($feature['is_active']); 
        }));
        ?>
        <div class="fitcopilot-status-indicator">
            <strong>📊 Current Status:</strong> 
            <?php echo count($features_data); ?> training features loaded. 
            <?php echo $active_count . ' active on frontend.'; ?>
            
            <?php if ($active_count !== count($features_data)): ?>
                <br><span style="color: #ff6b6b;">⚠️ <?php echo (count($features_data) - $active_count); ?> features are hidden from frontend</span>
            <?php endif; ?>
            
            <?php if (defined('WP_DEBUG') && WP_DEBUG): ?>
                <br><small style="color: rgba(255,255,255,0.7);">
                    <strong>Debug Info:</strong>
                    <?php foreach ($features_data as $index => $feature): ?>
                        <?php $status = !empty($feature['is_active']) ? '✅' : '❌'; ?>
                        <?php echo $status . ' ' . htmlspecialchars($feature['title'] ?? "Feature $index") . ' '; ?>
                    <?php endforeach; ?>
                </small>
            <?php endif; ?>
        </div>
        <?php
    }
    
    /**
     * Render main content tab - Feature management
     */
    private function render_main_content_tab($features_data) {
        ?>
        <div id="main-content" class="tab-content fitcopilot-card">
            <form method="post" action="" id="training-features-form">
                <?php wp_nonce_field('fitcopilot_training_features_action', 'fitcopilot_training_features_nonce'); ?>
                
                <div class="features-header">
                    <h2>🏋️ Training Features Management</h2>
                    <div class="header-controls">
                        <button type="button" id="add-new-feature" class="button button-primary">
                            ➕ Add New Feature
                        </button>
                        
                        <!-- Bulk Actions -->
                        <div class="bulk-actions-container">
                            <select id="bulk-action-select" class="bulk-action-select">
                                <option value="">Bulk Actions</option>
                                <option value="activate">✅ Activate Selected</option>
                                <option value="deactivate">❌ Deactivate Selected</option>
                                <option value="feature">⭐ Mark as Featured</option>
                                <option value="unfeature">⭐ Remove Featured</option>
                                <option value="delete">🗑️ Delete Selected</option>
                            </select>
                            <button type="button" id="apply-bulk-action" class="button button-secondary">
                                Apply
                            </button>
                        </div>
                        
                        <!-- Select All Controls -->
                        <div class="select-all-container">
                            <label class="select-all-toggle">
                                <input type="checkbox" id="select-all-features" />
                                <span class="toggle-label">Select All</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div id="features-container" class="features-grid">
                    <?php foreach ($features_data as $index => $feature): ?>
                        <?php $this->render_feature_row($index, $feature); ?>
                    <?php endforeach; ?>
                </div>
                
                <div id="feature-template" style="display: none;">
                    <?php $this->render_feature_row('{{INDEX}}', array(), true); ?>
                </div>
                
                <div class="form-actions">
                    <input type="submit" name="fitcopilot_training_features_submit" 
                           class="button button-primary" value="Save All Changes" />
                    
                    <input type="submit" name="fitcopilot_reset_defaults" 
                           class="button button-secondary" 
                           value="Reset to Defaults"
                           onclick="return confirm('Are you sure you want to reset all data to defaults? This cannot be undone.');" 
                           style="margin-left: 10px;" />
                           
                    <button type="button" id="test-frontend-data" class="button button-secondary" 
                            style="margin-left: 10px;">
                        🔍 Test Frontend Data Flow
                    </button>
                </div>
            </form>
        </div>
        <?php
    }
    
    /**
     * Render CTA management tab (dedicated tab for call-to-action settings)
     */
    private function render_cta_management_tab($settings) {
        ?>
        <div id="cta-management" class="tab-content fitcopilot-card">
            <form method="post" action="">
                <?php wp_nonce_field('fitcopilot_training_features_action', 'fitcopilot_training_features_nonce'); ?>
                
                <div class="cta-header">
                    <h2>📢 Call-to-Action Management</h2>
                    <p class="tab-description">
                        Manage the call-to-action section that appears below your training features. 
                        This helps convert visitors into clients by providing a clear next step.
                    </p>
                </div>

                <!-- CTA Status Overview -->
                <div class="fitcopilot-status-indicator">
                    <strong>📊 CTA Status:</strong> 
                    
                    <span style="color: <?php echo !empty($settings['cta_enabled']) ? '#84E1BC' : '#ff6b6b'; ?>;">
                        <?php echo !empty($settings['cta_enabled']) ? '✅ Enabled' : '❌ Disabled'; ?>
                    </span>
                    
                    <br><strong>Current Title:</strong> 
                    "<?php echo esc_html($settings['cta_title'] ?? 'Ready to Transform Your Fitness?'); ?>"
                    
                    <br><strong>Button Action:</strong> 
                    <?php echo esc_html($settings['cta_button_text'] ?? 'Explore All Features'); ?>
                </div>

                <!-- CTA Configuration -->
                <h3>⚙️ CTA Configuration</h3>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="cta_enabled">Enable CTA Section</label>
                        </th>
                        <td>
                            <label>
                                <input type="checkbox" id="cta_enabled" name="settings[cta_enabled]" 
                                       value="1" <?php checked(!empty($settings['cta_enabled'])); ?> />
                                Show call-to-action section on frontend
                            </label>
                            <p class="description">
                                Toggle to show/hide the entire CTA section below training features
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Content Settings -->
                <h3>📝 Content Settings</h3>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="cta_title">CTA Title</label>
                        </th>
                        <td>
                            <input type="text" id="cta_title" name="settings[cta_title]" 
                                   value="<?php echo esc_attr($settings['cta_title'] ?? 'Ready to Transform Your Fitness?'); ?>" 
                                   class="regular-text" />
                            <p class="description">Main headline that grabs attention and sets the tone</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cta_subtitle">CTA Description</label>
                        </th>
                        <td>
                            <textarea id="cta_subtitle" name="settings[cta_subtitle]" 
                                      class="large-text" rows="4"
                                      placeholder="Compelling description that explains your value proposition and encourages action..."><?php echo esc_textarea($settings['cta_subtitle'] ?? ''); ?></textarea>
                            <p class="description">
                                Supporting text that explains the value proposition and benefits of taking action.
                                <br><strong>Tip:</strong> Focus on benefits, address concerns, and create urgency.
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Button Settings -->
                <h3>🔘 Button Settings</h3>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="cta_button_text">Button Text</label>
                        </th>
                        <td>
                            <input type="text" id="cta_button_text" name="settings[cta_button_text]" 
                                   value="<?php echo esc_attr($settings['cta_button_text'] ?? 'Explore All Features'); ?>" 
                                   class="regular-text" />
                            <p class="description">
                                Action-oriented text for the CTA button.
                                <br><strong>Examples:</strong> "Explore All Features", "Schedule Free Virtual Consultation", "Start Your Journey"
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cta_button_url">Button Destination</label>
                        </th>
                        <td>
                            <input type="url" id="cta_button_url" name="settings[cta_button_url]" 
                                   value="<?php echo esc_attr($settings['cta_button_url'] ?? '#contact'); ?>" 
                                   class="regular-text" 
                                   placeholder="https://example.com/contact" />
                            <p class="description">
                                Where visitors go when they click the button.
                                <br><strong>Examples:</strong> Contact form, booking page, phone number (tel:+1234567890), email (mailto:info@gym.com)
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Icon & Logo Settings -->
                <h3>🎯 Icon & Logo Settings</h3>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="cta_icon_type">Icon Type</label>
                        </th>
                        <td>
                            <fieldset>
                                <legend class="screen-reader-text"><span>Choose icon type for CTA section</span></legend>
                                <label>
                                    <input type="radio" name="settings[cta_icon_type]" value="lucide" 
                                           <?php checked($settings['cta_icon_type'] ?? 'lucide', 'lucide'); ?> 
                                           onchange="toggleIconOptions(this.value)" />
                                    <strong>Lucide Icon</strong> - Choose from 1000+ professional icons
                                </label><br />
                                <label>
                                    <input type="radio" name="settings[cta_icon_type]" value="logo" 
                                           <?php checked($settings['cta_icon_type'] ?? 'lucide', 'logo'); ?> 
                                           onchange="toggleIconOptions(this.value)" />
                                    <strong>Custom Logo</strong> - Upload your own logo image
                                </label><br />
                                <label>
                                    <input type="radio" name="settings[cta_icon_type]" value="none" 
                                           <?php checked($settings['cta_icon_type'] ?? 'lucide', 'none'); ?> 
                                           onchange="toggleIconOptions(this.value)" />
                                    <strong>No Icon</strong> - Text-only CTA section
                                </label>
                            </fieldset>
                            <p class="description">Choose how you want to visually represent your CTA section</p>
                        </td>
                    </tr>
                    <tr class="icon-option lucide-option" style="display: <?php echo ($settings['cta_icon_type'] ?? 'lucide') === 'lucide' ? 'table-row' : 'none'; ?>;">
                        <th scope="row">
                            <label for="cta_lucide_icon">Lucide Icon</label>
                        </th>
                        <td>
                            <select id="cta_lucide_icon" name="settings[cta_lucide_icon]" class="regular-text">
                                <?php 
                                $current_icon = $settings['cta_lucide_icon'] ?? 'ArrowRight';
                                
                                // Training Features specific icons
                                $icon_categories = array(
                                    'Popular Training & CTA' => array(
                                        'ArrowRight' => '➡️ Arrow Right - Next Step',
                                        'ChevronRight' => '▶️ Chevron Right - Continue',
                                        'Play' => '▶️ Play - Start/Action',
                                        'Zap' => '⚡ Zap - Energy/Power',
                                        'Target' => '🎯 Target - Goals/Focus',
                                        'Trophy' => '🏆 Trophy - Achievement',
                                        'Star' => '⭐ Star - Excellence',
                                        'Heart' => '❤️ Heart - Health/Care',
                                        'Activity' => '📈 Activity - Progress',
                                        'Award' => '🏅 Award - Recognition',
                                        'CheckCircle' => '✅ Check Circle - Success',
                                        'Dumbbell' => '🏋️ Dumbbell - Fitness',
                                        'Flame' => '🔥 Flame - Motivation',
                                        'Rocket' => '🚀 Rocket - Launch',
                                        'Sparkles' => '✨ Sparkles - Magic',
                                    )
                                );
                                
                                foreach ($icon_categories as $category => $icons) {
                                    echo "<optgroup label=\"{$category}\">";
                                    foreach ($icons as $value => $label) {
                                        $selected = selected($current_icon, $value, false);
                                        echo "<option value=\"{$value}\" {$selected}>{$label}</option>";
                                    }
                                    echo "</optgroup>";
                                }
                                ?>
                            </select>
                            <p class="description">Choose an icon that represents your training features or call-to-action</p>
                        </td>
                    </tr>
                    <tr class="icon-option logo-option" style="display: <?php echo ($settings['cta_icon_type'] ?? 'lucide') === 'logo' ? 'table-row' : 'none'; ?>;">
                        <th scope="row">
                            <label for="cta_logo_url">Custom Logo URL</label>
                        </th>
                        <td>
                            <input type="url" id="cta_logo_url" name="settings[cta_logo_url]" 
                                   value="<?php echo esc_attr($settings['cta_logo_url'] ?? ''); ?>" 
                                   class="regular-text" 
                                   placeholder="https://example.com/logo.png" />
                            <p class="description">URL to your custom logo image (recommended size: 64x64px)</p>
                        </td>
                    </tr>
                </table>

                <!-- Styling Settings -->
                <h3>🎨 Styling Settings</h3>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="cta_background_color">Background Color</label>
                        </th>
                        <td>
                            <input type="color" id="cta_background_color" name="settings[cta_background_color]" 
                                   value="<?php echo esc_attr($settings['cta_background_color'] ?? '#8b5cf6'); ?>" 
                                   class="color-picker" />
                            <p class="description">Background color for the CTA section (default: violet gradient)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cta_text_color">Text Color</label>
                        </th>
                        <td>
                            <input type="color" id="cta_text_color" name="settings[cta_text_color]" 
                                   value="<?php echo esc_attr($settings['cta_text_color'] ?? '#ffffff'); ?>" 
                                   class="color-picker" />
                            <p class="description">Text color for the CTA section (leave empty for default)</p>
                        </td>
                    </tr>
                </table>

                <!-- Save Button -->
                <p class="submit">
                    <input type="submit" name="fitcopilot_training_features_submit" 
                           class="button button-primary" value="Save CTA Settings" />
                </p>
            </form>
        </div>
        
        <script type="text/javascript">
            function toggleIconOptions(iconType) {
                // Hide all icon options
                document.querySelectorAll('.icon-option').forEach(function(option) {
                    option.style.display = 'none';
                });
                
                // Show selected icon option
                if (iconType === 'lucide') {
                    document.querySelector('.lucide-option').style.display = 'table-row';
                } else if (iconType === 'logo') {
                    document.querySelector('.logo-option').style.display = 'table-row';
                }
            }
        </script>
        <?php
    }
    
    /**
     * Render individual feature row with rich field types
     * 
     * @param int|string $index Feature index
     * @param array $feature Feature data
     * @param bool $is_template Whether this is a template row
     */
    private function render_feature_row($index, $feature = array(), $is_template = false) {
        // Merge with defaults
        $feature = array_merge(array(
            'id' => '',
            'title' => '',
            'description' => '',
            'feature_type' => 'general',
            'difficulty_level' => 'beginner',
            'duration_minutes' => 0,
            'image_url' => '',
            'video_url' => '',
            'video_poster' => '',
            'icon_type' => 'lucide',
            'icon_name' => 'Star',
            'gradient_class' => 'from-lime-300 to-emerald-400',
            'flip_front_text' => '',
            'flip_back_title' => '',
            'flip_back_details' => '',
            'cta_text' => '',
            'cta_url' => '',
            'display_order' => 0,
            'is_featured' => false,
            'is_active' => true
        ), $feature);
        
        $is_active = !empty($feature['is_active']);
        $is_featured = !empty($feature['is_featured']);
        
        $row_class = 'feature-row';
        if ($is_featured) $row_class .= ' featured';
        if (!$is_active) $row_class .= ' inactive';
        
        ?>
        <div class="<?php echo esc_attr($row_class); ?>" data-index="<?php echo esc_attr($index); ?>">
            <?php if (!$is_template): ?>
                <input type="hidden" name="features[<?php echo $index; ?>][id]" value="<?php echo esc_attr($feature['id']); ?>" />
            <?php endif; ?>
            
            <div class="feature-row-header">
                <div class="feature-header-left">
                    <label class="feature-select-checkbox">
                        <input type="checkbox" class="feature-bulk-select" 
                               data-feature-index="<?php echo esc_attr($index); ?>" />
                        <span class="sr-only">Select this feature</span>
                    </label>
                    <h4>
                        <?php if ($is_featured): ?>
                            ⭐ Featured Feature: 
                        <?php endif; ?>
                        <span class="feature-name-display"><?php echo esc_html($feature['title'] ?: 'New Feature'); ?></span>
                    </h4>
                </div>
                
                <div class="row-controls">
                    <label class="active-toggle">
                        <input type="checkbox" name="features[<?php echo $index; ?>][is_active]" 
                               value="1" <?php checked($is_active); ?> />
                        <span class="toggle-label">Show on Frontend</span>
                    </label>
                    
                    <button type="button" class="remove-feature-row button-link-delete" 
                            aria-label="Remove feature">🗑️</button>
                </div>
            </div>
            
            <?php if (!$is_active): ?>
                <div class="inactive-notice">
                    ⚠️ This feature is hidden from the frontend
                </div>
            <?php endif; ?>
            
            <!-- Essential Fields Section -->
            <div class="feature-fields-section">
                <div class="fields-section-header">
                    <h5 class="fields-section-title">📝 Essential Information</h5>
                    <span class="fields-section-subtitle">Core feature details</span>
                </div>
                <div class="feature-fields-grid essential-fields">
                    <div class="field-group">
                        <label>Feature Title</label>
                        <input type="text" name="features[<?php echo $index; ?>][title]" 
                               value="<?php echo esc_attr($feature['title']); ?>" 
                               placeholder="e.g., Live Virtual Sessions"
                               class="regular-text feature-title-input" required />
                    </div>
                    
                    <div class="field-group">
                        <label>Feature Type</label>
                        <select name="features[<?php echo $index; ?>][feature_type]" class="regular-text">
                            <option value="general" <?php selected($feature['feature_type'], 'general'); ?>>General</option>
                            <option value="strength" <?php selected($feature['feature_type'], 'strength'); ?>>Strength Training</option>
                            <option value="cardio" <?php selected($feature['feature_type'], 'cardio'); ?>>Cardio</option>
                            <option value="flexibility" <?php selected($feature['feature_type'], 'flexibility'); ?>>Flexibility</option>
                            <option value="nutrition" <?php selected($feature['feature_type'], 'nutrition'); ?>>Nutrition</option>
                            <option value="technology" <?php selected($feature['feature_type'], 'technology'); ?>>Technology</option>
                            <option value="community" <?php selected($feature['feature_type'], 'community'); ?>>Community</option>
                        </select>
                    </div>
                    
                    <div class="field-group full-width">
                        <label>Description</label>
                        <textarea name="features[<?php echo $index; ?>][description]" 
                                  placeholder="Describe this training feature and its benefits..."
                                  rows="3" class="large-text"><?php echo esc_textarea($feature['description']); ?></textarea>
                    </div>
                    
                    <div class="field-group">
                        <label class="featured-toggle">
                            <input type="checkbox" name="features[<?php echo $index; ?>][is_featured]" 
                                   value="1" <?php checked($is_featured); ?> />
                            <span class="toggle-label">⭐ Featured Feature</span>
                        </label>
                    </div>
                    
                    <div class="field-group">
                        <label>Display Order</label>
                        <input type="number" name="features[<?php echo $index; ?>][display_order]" 
                               value="<?php echo esc_attr($feature['display_order']); ?>" 
                               min="0" step="1" class="small-text" />
                    </div>
                </div>
            </div>

            <!-- Media & Visual Section -->
            <div class="feature-fields-section collapsible-section">
                <div class="fields-section-header clickable-header" data-section="media-<?php echo $index; ?>">
                    <h5 class="fields-section-title">🎨 Media & Visual Design</h5>
                    <span class="fields-section-subtitle">Images, videos, and styling options</span>
                    <button type="button" class="collapse-toggle" aria-label="Toggle section">
                        <span class="collapse-icon">▼</span>
                    </button>
                </div>
                <div class="feature-fields-grid collapsible-content" id="media-<?php echo $index; ?>">
                    <!-- PHASE 3: Enhanced WordPress Media Library Integration -->
                    <div class="field-group full-width">
                        <label>Feature Image</label>
                        <div class="enhanced-media-upload-group">
                            <div class="media-input-container">
                            <input type="url" name="features[<?php echo $index; ?>][image_url]" 
                                   value="<?php echo esc_attr($feature['image_url']); ?>" 
                                   placeholder="https://example.com/feature-image.jpg"
                                       class="image-url-input regular-text" 
                                       data-validation="image" />
                                <div class="media-buttons">
                                    <button type="button" class="upload-media-library-button button button-primary" 
                                            data-media-type="image" 
                                            data-target="features[<?php echo $index; ?>][image_url]"
                                            data-preview-target="image-preview-<?php echo $index; ?>">
                                        📷 Media Library
                                    </button>
                                    <button type="button" class="validate-media-button button button-secondary" 
                                            data-media-type="image" 
                                            data-target="features[<?php echo $index; ?>][image_url]">
                                        ✓ Validate
                            </button>
                        </div>
                            </div>
                            <div class="media-validation-feedback" id="image-validation-<?php echo $index; ?>"></div>
                        </div>
                        
                        <!-- Enhanced Image Preview with Actions -->
                        <div class="enhanced-image-preview" id="image-preview-<?php echo $index; ?>">
                        <?php if (!empty($feature['image_url'])): ?>
                                <div class="image-preview-container">
                                <img src="<?php echo esc_url($feature['image_url']); ?>" 
                                     alt="<?php echo esc_attr($feature['title']); ?>" 
                                         class="preview-image" />
                                    <div class="image-preview-actions">
                                        <button type="button" class="edit-image-button button button-small" 
                                                data-image-url="<?php echo esc_url($feature['image_url']); ?>">
                                            ✏️ Edit
                                        </button>
                                        <button type="button" class="remove-image-button button button-small" 
                                                data-target="features[<?php echo $index; ?>][image_url]"
                                                data-preview-target="image-preview-<?php echo $index; ?>">
                                            🗑️ Remove
                                        </button>
                                    </div>
                                    <div class="image-metadata">
                                        <small class="image-info">Click to view full size</small>
                                    </div>
                                </div>
                            <?php else: ?>
                                <div class="no-image-placeholder">
                                    <div class="placeholder-icon">🖼️</div>
                                    <p>No image selected</p>
                            </div>
                        <?php endif; ?>
                        </div>
                    </div>
                    
                    <!-- PHASE 3: Enhanced Video Management -->
                    <div class="field-group">
                        <label>Video URL</label>
                        <div class="enhanced-video-upload-group">
                            <div class="media-input-container">
                        <input type="url" name="features[<?php echo $index; ?>][video_url]" 
                               value="<?php echo esc_attr($feature['video_url']); ?>" 
                                       placeholder="YouTube, Vimeo, or direct video file URL"
                                       class="video-url-input regular-text" 
                                       data-validation="video" />
                                <div class="media-buttons">
                                    <button type="button" class="upload-media-library-button button button-primary" 
                                            data-media-type="video" 
                                            data-target="features[<?php echo $index; ?>][video_url]"
                                            data-preview-target="video-preview-<?php echo $index; ?>">
                                        🎥 Media Library
                                    </button>
                                    <button type="button" class="validate-media-button button button-secondary" 
                                            data-media-type="video" 
                                            data-target="features[<?php echo $index; ?>][video_url]">
                                        ✓ Validate
                                    </button>
                                </div>
                            </div>
                            <div class="media-validation-feedback" id="video-validation-<?php echo $index; ?>"></div>
                            <div class="video-platform-detector" id="video-platform-<?php echo $index; ?>"></div>
                        </div>
                    </div>
                    
                    <!-- PHASE 3: Enhanced Video Poster Management -->
                    <div class="field-group">
                        <label>Video Poster Image</label>
                        <div class="enhanced-media-upload-group">
                            <div class="media-input-container">
                        <input type="url" name="features[<?php echo $index; ?>][video_poster]" 
                               value="<?php echo esc_attr($feature['video_poster']); ?>" 
                               placeholder="https://example.com/poster.jpg"
                                       class="poster-url-input regular-text" 
                                       data-validation="image" />
                                <div class="media-buttons">
                                    <button type="button" class="upload-media-library-button button button-primary" 
                                            data-media-type="image" 
                                            data-target="features[<?php echo $index; ?>][video_poster]"
                                            data-preview-target="poster-preview-<?php echo $index; ?>">
                                        🖼️ Choose Poster
                                    </button>
                                    <button type="button" class="auto-generate-poster button button-secondary" 
                                            data-video-target="features[<?php echo $index; ?>][video_url]" 
                                            data-poster-target="features[<?php echo $index; ?>][video_poster]">
                                        🎬 Auto-Generate
                                    </button>
                                </div>
                            </div>
                            <div class="media-validation-feedback" id="poster-validation-<?php echo $index; ?>"></div>
                    </div>
                    
                        <!-- Video Poster Preview Container -->
                        <div class="enhanced-image-preview" id="poster-preview-<?php echo $index; ?>">
                            <?php if (!empty($feature['video_poster'])): ?>
                                <div class="image-preview-container">
                                    <img src="<?php echo esc_url($feature['video_poster']); ?>" 
                                         alt="Video poster preview" 
                                         class="preview-image" />
                                    <div class="image-preview-actions">
                                        <button type="button" class="edit-image-button button button-small" 
                                                data-image-url="<?php echo esc_url($feature['video_poster']); ?>">
                                            ✏️ Edit
                                        </button>
                                        <button type="button" class="remove-image-button button button-small" 
                                                data-target="features[<?php echo $index; ?>][video_poster]"
                                                data-preview-target="poster-preview-<?php echo $index; ?>">
                                            🗑️ Remove
                                        </button>
                                    </div>
                                    <div class="image-metadata">
                                        <small class="image-info">Video poster image</small>
                                    </div>
                                </div>
                            <?php else: ?>
                                <div class="no-image-placeholder">
                                    <div class="placeholder-icon">🖼️</div>
                                    <p>No poster image selected</p>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <!-- Video Preview Container -->
                        <div class="video-preview-container" id="video-preview-<?php echo $index; ?>">
                            <?php if (!empty($feature['video_url'])): ?>
                                <div class="video-preview-wrapper">
                                    <div class="video-thumbnail">
                                        <?php if (!empty($feature['video_poster'])): ?>
                                            <img src="<?php echo esc_url($feature['video_poster']); ?>" 
                                                 alt="Video preview" class="poster-preview" />
                                        <?php else: ?>
                                            <div class="video-placeholder">
                                                <div class="video-icon">🎥</div>
                                                <p>Video Preview</p>
                                            </div>
                                        <?php endif; ?>
                                        <div class="video-play-overlay">
                                            <button type="button" class="video-play-button" 
                                                    data-video-url="<?php echo esc_url($feature['video_url']); ?>">
                                                ▶️
                                            </button>
                                        </div>
                                    </div>
                                    <div class="video-metadata">
                                        <small class="video-info">Click to preview video</small>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <!-- PHASE 3: Enhanced Icon Picker System -->
                    <div class="field-group full-width">
                        <label>Icon Selection</label>
                        <div class="enhanced-icon-picker-container">
                            <div class="icon-type-tabs">
                                <button type="button" class="icon-type-tab <?php echo $feature['icon_type'] === 'lucide' ? 'active' : ''; ?>" 
                                        data-icon-type="lucide" data-feature-index="<?php echo $index; ?>">
                                    🔷 Lucide Icons
                                </button>
                                <button type="button" class="icon-type-tab <?php echo $feature['icon_type'] === 'emoji' ? 'active' : ''; ?>" 
                                        data-icon-type="emoji" data-feature-index="<?php echo $index; ?>">
                                    😀 Emojis
                                </button>
                                <button type="button" class="icon-type-tab <?php echo $feature['icon_type'] === 'custom' ? 'active' : ''; ?>" 
                                        data-icon-type="custom" data-feature-index="<?php echo $index; ?>">
                                    🖼️ Custom
                                </button>
                            </div>
                            
                            <!-- Hidden select for form submission -->
                            <input type="hidden" name="features[<?php echo $index; ?>][icon_type]" 
                                   value="<?php echo esc_attr($feature['icon_type']); ?>" 
                                   class="icon-type-input" />
                            <input type="hidden" name="features[<?php echo $index; ?>][icon_name]" 
                                   value="<?php echo esc_attr($feature['icon_name']); ?>" 
                                   class="icon-name-input" />
                            
                            <!-- Lucide Icon Panel -->
                            <div class="icon-panel lucide-panel <?php echo $feature['icon_type'] === 'lucide' ? 'active' : ''; ?>" 
                                 id="lucide-panel-<?php echo $index; ?>">
                                <div class="icon-search-container">
                                    <input type="text" class="icon-search-input" 
                                           placeholder="Search icons..." 
                                           data-target="lucide-grid-<?php echo $index; ?>" />
                                </div>
                                <div class="icon-grid lucide-grid" id="lucide-grid-<?php echo $index; ?>">
                                    <?php $this->render_lucide_icon_grid($feature['icon_name']); ?>
                                </div>
                            </div>
                            
                            <!-- Emoji Panel -->
                            <div class="icon-panel emoji-panel <?php echo $feature['icon_type'] === 'emoji' ? 'active' : ''; ?>" 
                                 id="emoji-panel-<?php echo $index; ?>">
                                <div class="emoji-categories">
                                    <button type="button" class="emoji-category-btn active" data-category="fitness">💪 Fitness</button>
                                    <button type="button" class="emoji-category-btn" data-category="activities">🏃 Activities</button>
                                    <button type="button" class="emoji-category-btn" data-category="food">🍎 Food</button>
                                    <button type="button" class="emoji-category-btn" data-category="objects">⚽ Objects</button>
                                    <button type="button" class="emoji-category-btn" data-category="symbols">⭐ Symbols</button>
                                </div>
                                <div class="emoji-grid" id="emoji-grid-<?php echo $index; ?>">
                                    <?php $this->render_emoji_grid($feature['icon_name']); ?>
                                </div>
                            </div>
                            
                            <!-- Custom Icon Panel -->
                            <div class="icon-panel custom-panel <?php echo $feature['icon_type'] === 'custom' ? 'active' : ''; ?>" 
                                 id="custom-panel-<?php echo $index; ?>">
                                <div class="custom-icon-upload">
                                    <input type="url" class="custom-icon-url" 
                                           placeholder="Enter custom icon URL or upload..." 
                                           value="<?php echo $feature['icon_type'] === 'custom' ? esc_attr($feature['icon_name']) : ''; ?>" />
                                    <button type="button" class="upload-custom-icon-button button button-primary">
                                        📁 Upload Icon
                                    </button>
                                </div>
                                <div class="custom-icon-preview">
                                    <?php if ($feature['icon_type'] === 'custom' && !empty($feature['icon_name'])): ?>
                                        <img src="<?php echo esc_url($feature['icon_name']); ?>" 
                                             alt="Custom icon" class="custom-icon-img" />
                                    <?php endif; ?>
                                </div>
                            </div>
                            
                            <!-- Selected Icon Preview -->
                            <div class="selected-icon-preview">
                                <div class="preview-label">Selected Icon:</div>
                                <div class="preview-icon" id="selected-icon-preview-<?php echo $index; ?>">
                                    <?php $this->render_selected_icon_preview($feature); ?>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="field-group">
                        <label>Gradient Class</label>
                        <select name="features[<?php echo $index; ?>][gradient_class]" class="regular-text">
                            <option value="from-lime-300 to-emerald-400" <?php selected($feature['gradient_class'], 'from-lime-300 to-emerald-400'); ?>>Lime to Emerald</option>
                            <option value="from-blue-400 to-purple-500" <?php selected($feature['gradient_class'], 'from-blue-400 to-purple-500'); ?>>Blue to Purple</option>
                            <option value="from-pink-400 to-red-500" <?php selected($feature['gradient_class'], 'from-pink-400 to-red-500'); ?>>Pink to Red</option>
                            <option value="from-yellow-400 to-orange-500" <?php selected($feature['gradient_class'], 'from-yellow-400 to-orange-500'); ?>>Yellow to Orange</option>
                            <option value="from-green-400 to-blue-500" <?php selected($feature['gradient_class'], 'from-green-400 to-blue-500'); ?>>Green to Blue</option>
                            <option value="from-purple-400 to-pink-500" <?php selected($feature['gradient_class'], 'from-purple-400 to-pink-500'); ?>>Purple to Pink</option>
                            <option value="from-gray-400 to-gray-600" <?php selected($feature['gradient_class'], 'from-gray-400 to-gray-600'); ?>>Gray Scale</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Enhanced Content Section - PHASE 2 IMPLEMENTATION -->
            <div class="feature-fields-section collapsible-section">
                <div class="fields-section-header clickable-header" data-section="content-<?php echo $index; ?>">
                    <h5 class="fields-section-title">📝 Enhanced Content</h5>
                    <span class="fields-section-subtitle">Rich content and detailed information</span>
                    <button type="button" class="collapse-toggle" aria-label="Toggle section">
                        <span class="collapse-icon">▼</span>
                    </button>
                </div>
                <div class="feature-fields-grid collapsible-content" id="content-<?php echo $index; ?>">
                    <!-- Difficulty Level with Visual Indicator -->
                    <div class="field-group difficulty-field">
                        <label>Difficulty Level</label>
                        <div class="difficulty-selector">
                            <div class="difficulty-options">
                                <label class="difficulty-option <?php echo $feature['difficulty_level'] === 'beginner' ? 'selected' : ''; ?>">
                                    <input type="radio" name="features[<?php echo $index; ?>][difficulty_level]" 
                                           value="beginner" <?php checked($feature['difficulty_level'], 'beginner'); ?> />
                                    <span class="difficulty-indicator beginner">🟢</span>
                                    <span class="difficulty-label">Beginner</span>
                                </label>
                                <label class="difficulty-option <?php echo $feature['difficulty_level'] === 'intermediate' ? 'selected' : ''; ?>">
                                    <input type="radio" name="features[<?php echo $index; ?>][difficulty_level]" 
                                           value="intermediate" <?php checked($feature['difficulty_level'], 'intermediate'); ?> />
                                    <span class="difficulty-indicator intermediate">🟡</span>
                                    <span class="difficulty-label">Intermediate</span>
                                </label>
                                <label class="difficulty-option <?php echo $feature['difficulty_level'] === 'advanced' ? 'selected' : ''; ?>">
                                    <input type="radio" name="features[<?php echo $index; ?>][difficulty_level]" 
                                           value="advanced" <?php checked($feature['difficulty_level'], 'advanced'); ?> />
                                    <span class="difficulty-indicator advanced">🔴</span>
                                    <span class="difficulty-label">Advanced</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Duration with Smart Slider -->
                    <div class="field-group duration-field">
                        <label>Duration (Minutes)</label>
                        <div class="duration-slider-container">
                            <input type="range" 
                                   name="features[<?php echo $index; ?>][duration_minutes]" 
                                   value="<?php echo esc_attr($feature['duration_minutes']); ?>" 
                                   min="0" max="180" step="5" 
                                   class="duration-slider" 
                                   data-index="<?php echo $index; ?>"
                                   oninput="updateDurationDisplay(this)" />
                            <div class="duration-display">
                                <span class="duration-value" id="duration-display-<?php echo $index; ?>">
                                    <?php echo $feature['duration_minutes']; ?> min
                                </span>
                                <div class="duration-presets">
                                    <button type="button" class="duration-preset" data-value="15" data-target="<?php echo $index; ?>">15m</button>
                                    <button type="button" class="duration-preset" data-value="30" data-target="<?php echo $index; ?>">30m</button>
                                    <button type="button" class="duration-preset" data-value="45" data-target="<?php echo $index; ?>">45m</button>
                                    <button type="button" class="duration-preset" data-value="60" data-target="<?php echo $index; ?>">1h</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Rich Text Editor for Flip Content -->
                    <div class="field-group full-width">
                        <label>Flip Card - Front Text</label>
                        <div class="rich-text-container">
                            <?php
                            wp_editor(
                                $feature['flip_front_text'], 
                                'flip_front_text_' . $index,
                                array(
                                    'textarea_name' => 'features[' . $index . '][flip_front_text]',
                                    'media_buttons' => false,
                                    'textarea_rows' => 4,
                                    'teeny' => true,
                                    'tinymce' => array(
                                        'toolbar1' => 'bold,italic,underline,link,unlink,undo,redo',
                                        'toolbar2' => '',
                                        'height' => 150
                                    ),
                                    'quicktags' => array(
                                        'buttons' => 'strong,em,link,ul,ol,li'
                                    )
                                )
                            );
                            ?>
                        </div>
                    </div>

                    <!-- Flip Back Title -->
                    <div class="field-group">
                        <label>Flip Card - Back Title</label>
                        <input type="text" name="features[<?php echo $index; ?>][flip_back_title]" 
                               value="<?php echo esc_attr($feature['flip_back_title']); ?>" 
                               placeholder="e.g., Live Virtual Session"
                               class="regular-text" />
                    </div>

                    <!-- Enhanced Flip Back Details with Tag Input -->
                    <div class="field-group full-width">
                        <label>Flip Card - Feature Details</label>
                        <div class="tag-input-container">
                            <div class="tags-display" id="tags-display-<?php echo $index; ?>">
                                <?php
                                $details = !empty($feature['flip_back_details']) ? explode('|', $feature['flip_back_details']) : array();
                                foreach ($details as $detail):
                                    if (trim($detail)):
                                ?>
                                    <span class="feature-tag">
                                        <?php echo esc_html(trim($detail)); ?>
                                        <button type="button" class="remove-tag" onclick="removeTag(this)">×</button>
                                    </span>
                                <?php
                                    endif;
                                endforeach;
                                ?>
                            </div>
                            <input type="text" class="tag-input" 
                                   placeholder="Type a feature detail and press Enter..."
                                   data-target="tags-display-<?php echo $index; ?>"
                                   data-hidden-input="features[<?php echo $index; ?>][flip_back_details]"
                                   onkeypress="handleTagInput(event, this)" />
                            <input type="hidden" name="features[<?php echo $index; ?>][flip_back_details]" 
                                   value="<?php echo esc_attr($feature['flip_back_details']); ?>" />
                        </div>
                        <div class="field-help">
                            <small>Press Enter to add each feature detail. Use clear, benefit-focused language.</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Call-to-Action Section - PHASE 2 ENHANCEMENT -->
            <div class="feature-fields-section collapsible-section">
                <div class="fields-section-header clickable-header" data-section="cta-<?php echo $index; ?>">
                    <h5 class="fields-section-title">🎯 Call-to-Action</h5>
                    <span class="fields-section-subtitle">Action buttons and engagement</span>
                    <button type="button" class="collapse-toggle" aria-label="Toggle section">
                        <span class="collapse-icon">▼</span>
                    </button>
                </div>
                <div class="feature-fields-grid collapsible-content" id="cta-<?php echo $index; ?>">
                    <div class="field-group">
                        <label>CTA Button Text</label>
                        <input type="text" name="features[<?php echo $index; ?>][cta_text]" 
                               value="<?php echo esc_attr($feature['cta_text']); ?>" 
                               placeholder="e.g., Learn More"
                               class="regular-text" />
                    </div>

                    <div class="field-group">
                        <label>CTA URL</label>
                        <input type="url" name="features[<?php echo $index; ?>][cta_url]" 
                               value="<?php echo esc_attr($feature['cta_url']); ?>" 
                               placeholder="https://example.com/feature-details"
                               class="regular-text url-input" />
                    </div>

                    <!-- CTA Preview -->
                    <div class="field-group full-width">
                        <label>CTA Preview</label>
                        <div class="cta-preview" id="cta-preview-<?php echo $index; ?>">
                            <?php if (!empty($feature['cta_text']) && !empty($feature['cta_url'])): ?>
                                <a href="<?php echo esc_url($feature['cta_url']); ?>" 
                                   class="preview-cta-button" target="_blank" rel="noopener">
                                    <?php echo esc_html($feature['cta_text']); ?>
                                </a>
                            <?php else: ?>
                                <div class="cta-placeholder">
                                    <span>CTA preview will appear when both text and URL are provided</span>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Individual Feature Save Button -->
            <div class="feature-save-section">
                <button type="button" class="save-individual-feature button button-primary" 
                        data-feature-index="<?php echo esc_attr($index); ?>">
                    💾 Save This Feature
                </button>
                <div class="save-status" id="save-status-<?php echo $index; ?>"></div>
            </div>
        </div>

        <?php if ($is_template): ?>
            <script type="text/javascript">
                // Phase 2: Enhanced JavaScript functionality
                function updateDurationDisplay(slider) {
                    const index = slider.dataset.index;
                    const display = document.getElementById('duration-display-' + index);
                    if (display) {
                        display.textContent = slider.value + ' min';
                    }
                }

                function handleTagInput(event, input) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        
                        const value = input.value.trim();
                        if (value) {
                            const tagsDisplay = document.getElementById(input.dataset.target);
                            const hiddenInput = document.querySelector('input[name="' + input.dataset.hiddenInput + '"]');
                            
                            if (tagsDisplay && hiddenInput) {
                                // Create tag element
                                const tag = document.createElement('span');
                                tag.className = 'feature-tag';
                                tag.innerHTML = value + '<button type="button" class="remove-tag" onclick="removeTag(this)">×</button>';
                                
                                tagsDisplay.appendChild(tag);
                                
                                // Update hidden input
                                const currentTags = hiddenInput.value ? hiddenInput.value.split('|') : [];
                                currentTags.push(value);
                                hiddenInput.value = currentTags.join('|');
                                
                                // Clear input
                                input.value = '';
                            }
                        }
                    }
                }

                function removeTag(button) {
                    const tag = button.parentElement;
                    const tagsDisplay = tag.parentElement;
                    const tagText = tag.textContent.replace('×', '').trim();
                    
                    // Find corresponding hidden input
                    const container = tagsDisplay.closest('.tag-input-container');
                    const hiddenInput = container.querySelector('input[type="hidden"]');
                    
                    if (hiddenInput) {
                        const currentTags = hiddenInput.value ? hiddenInput.value.split('|') : [];
                        const filteredTags = currentTags.filter(t => t.trim() !== tagText);
                        hiddenInput.value = filteredTags.join('|');
                    }
                    
                    tag.remove();
                }

                // Duration preset buttons
                document.addEventListener('click', function(e) {
                    if (e.target.classList.contains('duration-preset')) {
                        const value = e.target.dataset.value;
                        const target = e.target.dataset.target;
                        const slider = document.querySelector(`input[name="features[${target}][duration_minutes]"]`);
                        
                        if (slider) {
                            slider.value = value;
                            updateDurationDisplay(slider);
                        }
                    }
                });

                // Difficulty option selection
                document.addEventListener('click', function(e) {
                    if (e.target.closest('.difficulty-option')) {
                        const option = e.target.closest('.difficulty-option');
                        const radio = option.querySelector('input[type="radio"]');
                        
                        if (radio) {
                            // Remove selected class from siblings
                            option.parentElement.querySelectorAll('.difficulty-option').forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            
                            // Add selected class to current
                            option.classList.add('selected');
                            radio.checked = true;
                        }
                    }
                });
            </script>
        <?php endif; ?>
        <?php
    }
    
    /**
     * Render Lucide icon options
     */
    private function render_lucide_icon_options($selected_icon = 'Star') {
        $icons = array(
            'Star' => '⭐ Star',
            'Heart' => '❤️ Heart',
            'Zap' => '⚡ Zap',
            'Award' => '🏆 Award',
            'Target' => '🎯 Target',
            'Dumbbell' => '🏋️ Dumbbell',
            'Activity' => '📈 Activity',
            'Video' => '📹 Video',
            'Users' => '👥 Users',
            'Clock' => '🕒 Clock',
            'Calendar' => '📅 Calendar',
            'CheckCircle' => '✅ Check Circle',
            'Play' => '▶️ Play',
            'Settings' => '⚙️ Settings',
            'Smartphone' => '📱 Smartphone',
            'Headphones' => '🎧 Headphones',
            'Globe' => '🌍 Globe',
            'Wifi' => '📶 Wifi',
            'Camera' => '📷 Camera',
            'Monitor' => '🖥️ Monitor'
        );
        
        foreach ($icons as $value => $label) {
            $selected = selected($selected_icon, $value, false);
            echo "<option value=\"{$value}\" {$selected}>{$label}</option>";
        }
    }
    
    /**
     * PHASE 3: Render enhanced Lucide icon grid
     * 
     * @param string $selected_icon Currently selected icon
     */
    private function render_lucide_icon_grid($selected_icon = 'Star') {
        $lucide_icons = array(
            'fitness' => array('Activity', 'Dumbbell', 'Heart', 'Zap', 'Target', 'Award', 'Trophy', 'Shield'),
            'charts' => array('BarChart', 'TrendingUp', 'PieChart', 'BarChart2', 'LineChart', 'Activity'),
            'time' => array('Clock', 'Calendar', 'Timer', 'AlarmClock', 'Stopwatch', 'CalendarDays'),
            'people' => array('Users', 'User', 'UserCheck', 'UserPlus', 'Team', 'Crown'),
            'media' => array('Video', 'Play', 'Pause', 'Camera', 'Image', 'Film', 'Music', 'Volume2'),
            'actions' => array('CheckCircle', 'Plus', 'Minus', 'X', 'Check', 'Star', 'Bookmark', 'Flag'),
            'tech' => array('Globe', 'Wifi', 'Smartphone', 'Monitor', 'Headphones', 'Mic', 'Settings', 'Tool')
        );
        
        foreach ($lucide_icons as $category => $icons) {
            echo '<div class="icon-category" data-category="' . esc_attr($category) . '">';
            echo '<div class="icon-category-title">' . ucfirst($category) . '</div>';
            echo '<div class="icon-row">';
            
            foreach ($icons as $icon) {
                $is_selected = ($selected_icon === $icon) ? 'selected' : '';
                echo '<button type="button" class="icon-option ' . $is_selected . '" ';
                echo 'data-icon-name="' . esc_attr($icon) . '" ';
                echo 'data-icon-type="lucide" ';
                echo 'title="' . esc_attr($icon) . '">';
                echo '<span class="icon-preview lucide-' . strtolower($icon) . '"></span>';
                echo '<span class="icon-label">' . esc_html($icon) . '</span>';
                echo '</button>';
            }
            
            echo '</div></div>';
        }
    }
    
    /**
     * PHASE 3: Render emoji grid for icon selection
     * 
     * @param string $selected_emoji Currently selected emoji
     */
    private function render_emoji_grid($selected_emoji = '') {
        $emoji_categories = array(
            'fitness' => array('💪', '🏃', '🏋️', '🚴', '🧘', '🤸', '⚽', '🏀', '🎾', '🏓'),
            'activities' => array('🏊', '🚶', '🧗', '⛷️', '🏄', '🚣', '🏇', '🤺', '🏌️', '🥊'),
            'food' => array('🍎', '🥕', '🥗', '🍌', '🥑', '🫐', '🍓', '🥤', '💧', '🥛'),
            'objects' => array('⏰', '📱', '💻', '📺', '🎧', '📷', '⚖️', '🔬', '📊', '📈'),
            'symbols' => array('⭐', '✨', '🔥', '💎', '🎯', '🏆', '🎖️', '🏅', '💯', '✅')
        );
        
        foreach ($emoji_categories as $category => $emojis) {
            echo '<div class="emoji-category-section" data-category="' . esc_attr($category) . '"';
            echo ($category !== 'fitness' ? ' style="display: none;"' : '') . '>';
            
            foreach ($emojis as $emoji) {
                $is_selected = ($selected_emoji === $emoji) ? 'selected' : '';
                echo '<button type="button" class="emoji-option ' . $is_selected . '" ';
                echo 'data-icon-name="' . esc_attr($emoji) . '" ';
                echo 'data-icon-type="emoji" ';
                echo 'title="' . esc_attr($emoji) . '">';
                echo '<span class="emoji-preview">' . $emoji . '</span>';
                echo '</button>';
            }
            
            echo '</div>';
        }
    }
    
    /**
     * PHASE 3: Render selected icon preview
     * 
     * @param array $feature Feature data containing icon information
     */
    private function render_selected_icon_preview($feature) {
        $icon_type = $feature['icon_type'] ?? 'lucide';
        $icon_name = $feature['icon_name'] ?? 'Star';
        
        switch ($icon_type) {
            case 'lucide':
                echo '<span class="lucide-icon-preview lucide-' . strtolower($icon_name) . '"></span>';
                echo '<span class="icon-name">' . esc_html($icon_name) . '</span>';
                break;
                
            case 'emoji':
                echo '<span class="emoji-icon-preview">' . esc_html($icon_name) . '</span>';
                echo '<span class="icon-name">Emoji</span>';
                break;
                
            case 'custom':
                if (!empty($icon_name)) {
                    echo '<img src="' . esc_url($icon_name) . '" alt="Custom icon" class="custom-icon-preview" />';
                    echo '<span class="icon-name">Custom</span>';
                } else {
                    echo '<span class="no-icon-placeholder">No custom icon</span>';
                }
                break;
                
            default:
                echo '<span class="default-icon-preview">🔷</span>';
                echo '<span class="icon-name">Default</span>';
        }
    }
    
    /**
     * Render categories tab
     */
    private function render_categories_tab($features_data) {
        $categories = array();
        
        // Extract categories from features
        foreach ($features_data as $feature) {
            $type = $feature['feature_type'] ?? 'general';
            if (!isset($categories[$type])) {
                $categories[$type] = 0;
            }
            $categories[$type]++;
        }
        
        ?>
        <div id="categories" class="tab-content fitcopilot-card">
            <h2>📂 Feature Categories</h2>
            <p>Overview of your training features organized by category.</p>
            
            <div class="categories-grid">
                <?php foreach ($categories as $category => $count): ?>
                    <div class="category-card">
                        <h3><?php echo esc_html(ucfirst(str_replace('_', ' ', $category))); ?></h3>
                        <p class="category-count"><?php echo $count; ?> feature<?php echo $count !== 1 ? 's' : ''; ?></p>
                        <a href="?page=fitcopilot-training-features&tab=main-content&filter=<?php echo esc_attr($category); ?>" 
                           class="button button-secondary">View Features</a>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
    }
    
    /**
     * Render settings tab
     */
    private function render_settings_tab($settings) {
        ?>
        <div id="settings" class="tab-content fitcopilot-card">
            <form method="post" action="">
                <?php wp_nonce_field('fitcopilot_training_features_action', 'fitcopilot_training_features_nonce'); ?>
                
                <h2>⚙️ Training Features Settings</h2>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="section_title">Section Title</label>
                        </th>
                        <td>
                            <input type="text" id="section_title" name="settings[section_title]" 
                                   value="<?php echo esc_attr($settings['section_title'] ?? 'Training Features'); ?>" 
                                   class="regular-text" />
                            <p class="description">Main heading for the training features section.</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="section_description">Section Description</label>
                        </th>
                        <td>
                            <textarea id="section_description" name="settings[section_description]" 
                                      rows="3" class="large-text"><?php echo esc_textarea($settings['section_description'] ?? 'Discover our comprehensive training features designed to help you achieve your fitness goals.'); ?></textarea>
                            <p class="description">Description text for the section.</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="max_display_count">Maximum Features to Display</label>
                        </th>
                        <td>
                            <input type="number" id="max_display_count" name="settings[max_display_count]" 
                                   value="<?php echo esc_attr($settings['max_display_count'] ?? -1); ?>" 
                                   min="-1" step="1" class="small-text" />
                            <p class="description">Maximum number of features to show on frontend. Use -1 for unlimited.</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="enable_animations">Enable Animations</label>
                        </th>
                        <td>
                            <label>
                                <input type="checkbox" id="enable_animations" name="settings[enable_animations]" 
                                       value="1" <?php checked(!empty($settings['enable_animations'])); ?> />
                                Enable feature card animations and transitions
                            </label>
                        </td>
                    </tr>
                </table>
                
                <p class="submit">
                    <input type="submit" name="fitcopilot_training_features_submit" 
                           class="button button-primary" value="Save Settings" />
                </p>
            </form>
        </div>
        <?php
    }
    
    /**
     * Render display options tab
     */
    private function render_display_options_tab($settings) {
        ?>
        <div id="display-options" class="tab-content fitcopilot-card">
            <form method="post" action="">
                <?php wp_nonce_field('fitcopilot_training_features_action', 'fitcopilot_training_features_nonce'); ?>
                
                <h2>🎨 Display Options</h2>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="layout_columns">Grid Columns</label>
                        </th>
                        <td>
                            <select id="layout_columns" name="settings[layout_columns]" class="regular-text">
                                <option value="1" <?php selected($settings['layout_columns'] ?? 3, 1); ?>>1 Column</option>
                                <option value="2" <?php selected($settings['layout_columns'] ?? 3, 2); ?>>2 Columns</option>
                                <option value="3" <?php selected($settings['layout_columns'] ?? 3, 3); ?>>3 Columns</option>
                                <option value="4" <?php selected($settings['layout_columns'] ?? 3, 4); ?>>4 Columns</option>
                            </select>
                            <p class="description">Number of columns in the features grid layout.</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="card_style">Card Style</label>
                        </th>
                        <td>
                            <select id="card_style" name="settings[card_style]" class="regular-text">
                                <option value="default" <?php selected($settings['card_style'] ?? 'default', 'default'); ?>>Default</option>
                                <option value="modern" <?php selected($settings['card_style'] ?? 'default', 'modern'); ?>>Modern</option>
                                <option value="minimal" <?php selected($settings['card_style'] ?? 'default', 'minimal'); ?>>Minimal</option>
                                <option value="bold" <?php selected($settings['card_style'] ?? 'default', 'bold'); ?>>Bold</option>
                            </select>
                            <p class="description">Visual style for feature cards.</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="show_difficulty">Show Difficulty Levels</label>
                        </th>
                        <td>
                            <label>
                                <input type="checkbox" id="show_difficulty" name="settings[show_difficulty]" 
                                       value="1" <?php checked(!empty($settings['show_difficulty'])); ?> />
                                Display difficulty level indicators on feature cards
                            </label>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="show_duration">Show Duration</label>
                        </th>
                        <td>
                            <label>
                                <input type="checkbox" id="show_duration" name="settings[show_duration]" 
                                       value="1" <?php checked(!empty($settings['show_duration'])); ?> />
                                Display duration information on feature cards
                            </label>
                        </td>
                    </tr>
                </table>
                
                <p class="submit">
                    <input type="submit" name="fitcopilot_training_features_submit" 
                           class="button button-primary" value="Save Display Options" />
                </p>
            </form>
        </div>
        <?php
    }
    
    /**
     * Render export/import tab
     */
    private function render_export_import_tab() {
        ?>
        <div id="export-import" class="tab-content fitcopilot-card">
            <h2>📤 Export / Import</h2>
            
            <div class="export-section">
                <h3>Export Training Features</h3>
                <p>Download your current training features configuration as a JSON file.</p>
                <button type="button" id="export-features" class="button button-secondary">
                    📥 Export Features
                </button>
            </div>
            
            <div class="import-section">
                <h3>Import Training Features</h3>
                <p>Upload a JSON file to import training features. This will replace existing data.</p>
                <form method="post" enctype="multipart/form-data">
                    <?php wp_nonce_field('fitcopilot_training_features_import', 'fitcopilot_training_features_import_nonce'); ?>
                    <input type="file" name="import_file" accept=".json" required />
                    <input type="submit" name="fitcopilot_import_features" class="button button-primary" 
                           value="📤 Import Features" 
                           onclick="return confirm('This will replace all existing training features. Are you sure?');" />
                </form>
            </div>
        </div>
        <?php
    }
} 