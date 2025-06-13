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
                    <button type="button" id="add-new-feature" class="button button-primary">
                        ➕ Add New Feature
                    </button>
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
                <h4>
                    <?php if ($is_featured): ?>
                        ⭐ Featured Feature: 
                    <?php endif; ?>
                    <span class="feature-name-display"><?php echo esc_html($feature['title'] ?: 'New Feature'); ?></span>
                </h4>
                
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
            
            <div class="feature-fields-grid">
                <!-- Basic Information Fields -->
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
                
                <div class="field-group">
                    <label>Difficulty Level</label>
                    <select name="features[<?php echo $index; ?>][difficulty_level]" class="regular-text">
                        <option value="beginner" <?php selected($feature['difficulty_level'], 'beginner'); ?>>Beginner</option>
                        <option value="intermediate" <?php selected($feature['difficulty_level'], 'intermediate'); ?>>Intermediate</option>
                        <option value="advanced" <?php selected($feature['difficulty_level'], 'advanced'); ?>>Advanced</option>
                    </select>
                </div>
                
                <div class="field-group">
                    <label>Duration (minutes)</label>
                    <input type="number" name="features[<?php echo $index; ?>][duration_minutes]" 
                           value="<?php echo esc_attr($feature['duration_minutes']); ?>" 
                           min="0" max="300" step="5" class="small-text" />
                </div>
                
                <div class="field-group full-width">
                    <label>Description</label>
                    <textarea name="features[<?php echo $index; ?>][description]" 
                              placeholder="Describe this training feature and its benefits..."
                              rows="3" class="large-text"><?php echo esc_textarea($feature['description']); ?></textarea>
                </div>
                
                <!-- Media Fields -->
                <div class="field-group full-width">
                    <label>Feature Image</label>
                    <div class="image-upload-group">
                        <input type="url" name="features[<?php echo $index; ?>][image_url]" 
                               value="<?php echo esc_attr($feature['image_url']); ?>" 
                               placeholder="https://example.com/feature-image.jpg"
                               class="image-url-input regular-text" />
                        <button type="button" class="upload-image-button button button-secondary">
                            📷 Choose Image
                        </button>
                    </div>
                    <?php if (!empty($feature['image_url'])): ?>
                        <div class="image-preview">
                            <img src="<?php echo esc_url($feature['image_url']); ?>" 
                                 alt="<?php echo esc_attr($feature['title']); ?>" 
                                 style="max-width: 100px; height: auto; margin-top: 10px; border-radius: 8px;" />
                        </div>
                    <?php endif; ?>
                </div>
                
                <div class="field-group">
                    <label>Video URL</label>
                    <input type="url" name="features[<?php echo $index; ?>][video_url]" 
                           value="<?php echo esc_attr($feature['video_url']); ?>" 
                           placeholder="https://example.com/video.mp4"
                           class="regular-text" />
                </div>
                
                <div class="field-group">
                    <label>Video Poster</label>
                    <input type="url" name="features[<?php echo $index; ?>][video_poster]" 
                           value="<?php echo esc_attr($feature['video_poster']); ?>" 
                           placeholder="https://example.com/poster.jpg"
                           class="regular-text" />
                </div>
                
                <!-- Icon Configuration -->
                <div class="field-group">
                    <label>Icon Type</label>
                    <select name="features[<?php echo $index; ?>][icon_type]" class="icon-type-select regular-text" 
                            onchange="toggleIconOptions(this.value, '<?php echo $index; ?>')">
                        <option value="lucide" <?php selected($feature['icon_type'], 'lucide'); ?>>Lucide Icon</option>
                        <option value="emoji" <?php selected($feature['icon_type'], 'emoji'); ?>>Emoji</option>
                        <option value="custom" <?php selected($feature['icon_type'], 'custom'); ?>>Custom Image</option>
                    </select>
                </div>
                
                <div class="field-group icon-name-field" 
                     style="display: <?php echo $feature['icon_type'] === 'lucide' ? 'block' : 'none'; ?>;">
                    <label>Lucide Icon Name</label>
                    <select name="features[<?php echo $index; ?>][icon_name]" class="regular-text">
                        <?php $this->render_lucide_icon_options($feature['icon_name']); ?>
                    </select>
                </div>
                
                <div class="field-group">
                    <label>Gradient Class</label>
                    <select name="features[<?php echo $index; ?>][gradient_class]" class="regular-text">
                        <option value="from-lime-300 to-emerald-400" <?php selected($feature['gradient_class'], 'from-lime-300 to-emerald-400'); ?>>Lime to Emerald</option>
                        <option value="from-blue-400 to-purple-500" <?php selected($feature['gradient_class'], 'from-blue-400 to-purple-500'); ?>>Blue to Purple</option>
                        <option value="from-pink-400 to-red-500" <?php selected($feature['gradient_class'], 'from-pink-400 to-red-500'); ?>>Pink to Red</option>
                        <option value="from-yellow-400 to-orange-500" <?php selected($feature['gradient_class'], 'from-yellow-400 to-orange-500'); ?>>Yellow to Orange</option>
                        <option value="from-green-400 to-blue-500" <?php selected($feature['gradient_class'], 'from-green-400 to-blue-500'); ?>>Green to Blue</option>
                    </select>
                </div>
                
                <!-- Flip Card Content -->
                <div class="field-group full-width">
                    <label>Front Side Text</label>
                    <textarea name="features[<?php echo $index; ?>][flip_front_text]" 
                              placeholder="Text shown on the front of the feature card..."
                              rows="2" class="large-text"><?php echo esc_textarea($feature['flip_front_text']); ?></textarea>
                </div>
                
                <div class="field-group">
                    <label>Back Side Title</label>
                    <input type="text" name="features[<?php echo $index; ?>][flip_back_title]" 
                           value="<?php echo esc_attr($feature['flip_back_title']); ?>" 
                           placeholder="Title for card back"
                           class="regular-text" />
                </div>
                
                <div class="field-group full-width">
                    <label>Back Side Details</label>
                    <textarea name="features[<?php echo $index; ?>][flip_back_details]" 
                              placeholder="Detailed information shown on card back..."
                              rows="3" class="large-text"><?php echo esc_textarea($feature['flip_back_details']); ?></textarea>
                </div>
                
                <!-- CTA Configuration -->
                <div class="field-group">
                    <label>CTA Button Text</label>
                    <input type="text" name="features[<?php echo $index; ?>][cta_text]" 
                           value="<?php echo esc_attr($feature['cta_text']); ?>" 
                           placeholder="e.g., Learn More"
                           class="regular-text" />
                </div>
                
                <div class="field-group">
                    <label>CTA Button URL</label>
                    <input type="url" name="features[<?php echo $index; ?>][cta_url]" 
                           value="<?php echo esc_attr($feature['cta_url']); ?>" 
                           placeholder="https://example.com/signup"
                           class="regular-text" />
                </div>
                
                <!-- Meta Fields -->
                <div class="field-group">
                    <label>Display Order</label>
                    <input type="number" name="features[<?php echo $index; ?>][display_order]" 
                           value="<?php echo esc_attr($feature['display_order']); ?>" 
                           min="0" step="1" class="small-text" />
                </div>
                
                <div class="field-group">
                    <label class="featured-toggle">
                        <input type="checkbox" name="features[<?php echo $index; ?>][is_featured]" 
                               value="1" <?php checked($is_featured); ?> />
                        <span class="toggle-label">Featured Feature</span>
                    </label>
                </div>
            </div>
            
            <!-- Individual Save Button -->
            <div class="feature-save-section">
                <button type="button" class="save-individual-feature button button-primary" 
                        data-feature-index="<?php echo esc_attr($index); ?>"
                        data-feature-id="<?php echo esc_attr($feature['id']); ?>">
                    💾 Save This Feature
                </button>
                <span class="save-status" id="save-status-<?php echo esc_attr($index); ?>"></span>
            </div>
        </div>
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
                            <label for="section_subtitle">Section Subtitle</label>
                        </th>
                        <td>
                            <textarea id="section_subtitle" name="settings[section_subtitle]" 
                                      rows="3" class="large-text"><?php echo esc_textarea($settings['section_subtitle'] ?? 'Discover our comprehensive training features designed to help you achieve your fitness goals.'); ?></textarea>
                            <p class="description">Subtitle or description text for the section.</p>
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
                            <label for="grid_columns">Grid Columns</label>
                        </th>
                        <td>
                            <select id="grid_columns" name="settings[grid_columns]" class="regular-text">
                                <option value="1" <?php selected($settings['grid_columns'] ?? 3, 1); ?>>1 Column</option>
                                <option value="2" <?php selected($settings['grid_columns'] ?? 3, 2); ?>>2 Columns</option>
                                <option value="3" <?php selected($settings['grid_columns'] ?? 3, 3); ?>>3 Columns</option>
                                <option value="4" <?php selected($settings['grid_columns'] ?? 3, 4); ?>>4 Columns</option>
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