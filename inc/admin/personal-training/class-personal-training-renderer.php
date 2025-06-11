<?php
/**
 * FitCopilot Personal Training Renderer
 * 
 * Handles all HTML rendering for Personal Training admin interface
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Personal Training Renderer Class
 * 
 * Manages all HTML output for the admin interface
 */
class FitCopilot_Personal_Training_Renderer {
    
    /**
     * Data manager instance
     */
    private $data_manager;
    
    /**
     * Constructor
     * 
     * @param FitCopilot_Personal_Training_Data $data_manager Data manager instance
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
        $trainers_data = $this->data_manager->get_trainers();
        $settings = $this->data_manager->get_settings();

        // Handle form submissions (legacy method - now handled by manager)
        // $this->handle_form_submissions($trainers_data, $settings);

        // Get current active tab
        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'main-content';
        
        $this->render_admin_wrapper($trainers_data, $settings, $active_tab);
    }
    
    /**
     * Render tab content (required by Complex Manager pattern)
     * 
     * @param string $active_tab Current active tab
     * @param array $data Current trainer data
     * @param array $settings Current settings
     */
    public function render_tab_content($active_tab, $data, $settings) {
        if ($active_tab === 'main-content') {
            $this->render_main_content_tab($data);
        } elseif ($active_tab === 'settings') {
            $this->render_settings_tab($settings);
        } elseif ($active_tab === 'export-import') {
            $this->render_export_import_tab();
        } elseif ($active_tab === 'trainer-profiles') {
            $this->render_trainer_profiles_tab($data);
        } elseif ($active_tab === 'group-instructors') {
            $this->render_group_instructors_tab($data);
        }
    }
    
    /**
     * Render trainer profiles tab (additional tab from Complex Manager)
     */
    private function render_trainer_profiles_tab($trainers_data) {
        $featured_trainers = array_filter($trainers_data, function($trainer) {
            return !empty($trainer['featured']);
        });
        ?>
        <div id="trainer-profiles" class="tab-content fitcopilot-card">
            <h2>Featured Trainer Profiles</h2>
            <p>Manage featured trainer profiles and their detailed information.</p>
            
            <?php if (empty($featured_trainers)): ?>
                <div class="notice notice-warning">
                    <p>No featured trainers found. Mark trainers as "featured" in the main trainers tab to see them here.</p>
                </div>
            <?php else: ?>
                <div class="trainer-profiles-grid">
                    <?php foreach ($featured_trainers as $index => $trainer): ?>
                        <div class="trainer-profile-card">
                            <h3><?php echo esc_html($trainer['name'] ?? 'Unnamed Trainer'); ?></h3>
                            <p><strong>Specialty:</strong> <?php echo esc_html($trainer['specialty'] ?? 'N/A'); ?></p>
                            <p><strong>Experience:</strong> <?php echo absint($trainer['years_experience'] ?? 0); ?> years</p>
                            <p><strong>Clients:</strong> <?php echo absint($trainer['clients_count'] ?? 0); ?></p>
                            <?php if (!empty($trainer['bio'])): ?>
                                <p><strong>Bio:</strong> <?php echo wp_kses_post($trainer['bio']); ?></p>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }
    
    /**
     * Render group instructors tab (additional tab from Complex Manager)
     */
    private function render_group_instructors_tab($trainers_data) {
        $group_instructors = array_filter($trainers_data, function($trainer) {
            return !empty($trainer['coach_type']) && $trainer['coach_type'] === 'performance';
        });
        ?>
        <div id="group-instructors" class="tab-content fitcopilot-card">
            <h2>Group Class Instructors</h2>
            <p>Manage instructors who lead group fitness classes.</p>
            
            <?php if (empty($group_instructors)): ?>
                <div class="notice notice-warning">
                    <p>No group instructors found. Set trainer coach type to "performance" to see them here.</p>
                </div>
            <?php else: ?>
                <div class="instructor-grid">
                    <?php foreach ($group_instructors as $index => $instructor): ?>
                        <div class="instructor-card">
                            <h3><?php echo esc_html($instructor['name'] ?? 'Unnamed Instructor'); ?></h3>
                            <p><strong>Specialty:</strong> <?php echo esc_html($instructor['specialty'] ?? 'N/A'); ?></p>
                            <p><strong>Status:</strong> <?php echo !empty($instructor['active']) ? '✅ Active' : '❌ Inactive'; ?></p>
                            <?php if (!empty($instructor['video_url'])): ?>
                                <p><strong>Demo Video:</strong> <a href="<?php echo esc_url($instructor['video_url']); ?>" target="_blank">View Demo</a></p>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }
    
    /**
     * Render the main admin wrapper (legacy compatibility method)
     * 
     * This method is kept for backward compatibility but is no longer used
     * when the new Complex Manager base class is active.
     */
    private function render_admin_wrapper($trainers_data, $settings, $active_tab) {
        ?>
        <div class="wrap fitcopilot-personal-training-admin">
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
                <?php $this->render_status_indicator($trainers_data); ?>
                
                <?php if ($active_tab === 'main-content'): ?>
                    <?php $this->render_main_content_tab($trainers_data); ?>
                <?php elseif ($active_tab === 'settings'): ?>
                    <?php $this->render_settings_tab($settings); ?>
                <?php elseif ($active_tab === 'export-import'): ?>
                    <?php $this->render_export_import_tab(); ?>
                <?php endif; ?>
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
            <a href="?page=fitcopilot-personal-training&tab=main-content" 
               class="nav-tab <?php echo $active_tab === 'main-content' ? 'nav-tab-active' : ''; ?>">
               Manage Trainers
            </a>
            <a href="?page=fitcopilot-personal-training&tab=settings" 
               class="nav-tab <?php echo $active_tab === 'settings' ? 'nav-tab-active' : ''; ?>">
               Settings
            </a>
            <a href="?page=fitcopilot-personal-training&tab=export-import" 
               class="nav-tab <?php echo $active_tab === 'export-import' ? 'nav-tab-active' : ''; ?>">
               Export / Import
            </a>
        </div>
        <?php
    }
    
    /**
     * Render status indicator
     */
    private function render_status_indicator($trainers_data) {
        $active_count = count(array_filter($trainers_data, function($trainer) { 
            return !empty($trainer['active']); 
        }));
        ?>
        <div class="fitcopilot-status-indicator">
            <strong>📊 Current Status:</strong> 
            <?php echo count($trainers_data); ?> trainers loaded. 
            <?php echo $active_count . ' active on frontend.'; ?>
            
            <?php if ($active_count !== count($trainers_data)): ?>
                <br><span style="color: #ff6b6b;">⚠️ <?php echo (count($trainers_data) - $active_count); ?> trainers are hidden from frontend</span>
            <?php endif; ?>
            
            <?php if (defined('WP_DEBUG') && WP_DEBUG): ?>
                <br><small style="color: rgba(255,255,255,0.7);">
                    <strong>Debug Info:</strong>
                    <?php foreach ($trainers_data as $index => $trainer): ?>
                        <?php $status = !empty($trainer['active']) ? '✅' : '❌'; ?>
                        <?php echo $status . ' ' . htmlspecialchars($trainer['name'] ?? "Trainer $index") . ' '; ?>
                    <?php endforeach; ?>
                </small>
            <?php endif; ?>
        </div>
        <?php
    }
    
    /**
     * Render main content tab
     */
    private function render_main_content_tab($trainers_data) {
        ?>
        <div id="main-content" class="tab-content fitcopilot-card">
            <form method="post" action="">
                <?php wp_nonce_field('fitcopilot_personal_training_action', 'fitcopilot_personal_training_nonce'); ?>
                
                <div class="trainers-header">
                    <h2>Manage Personal Trainers</h2>
                    <div class="header-controls">
                        <button type="button" id="add-trainer-row" class="button button-secondary">
                            ➕ Add New Trainer
                        </button>
                        
                        <?php if (defined('WP_DEBUG') && WP_DEBUG): ?>
                            <button type="button" id="debug-test-save" class="button button-secondary" 
                                    style="margin-left: 10px;">
                                🔧 Debug Test Save
                            </button>
                            <button type="button" id="activate-all-trainers" class="button button-secondary" 
                                    style="margin-left: 10px;">
                                ✅ Activate All Trainers
                            </button>
                            <button type="button" id="reset-to-defaults" class="button button-secondary" 
                                    style="margin-left: 10px;">
                                🔄 Reset to Defaults
                            </button>
                        <?php endif; ?>
                    </div>
                </div>
                
                <div class="trainers-list" id="trainers-list">
                    <?php foreach ($trainers_data as $index => $trainer): ?>
                        <?php $this->render_trainer_row($index, $trainer); ?>
                    <?php endforeach; ?>
                </div>
                
                <!-- Template row (hidden) -->
                <div id="trainer-template" style="display: none;">
                    <?php $this->render_trainer_row('{{INDEX}}', array(), true); ?>
                </div>
                
                <div class="form-actions">
                    <input type="submit" name="fitcopilot_personal_training_submit" 
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
     * Render settings tab
     */
    private function render_settings_tab($settings) {
        ?>
        <div id="settings" class="tab-content fitcopilot-card">
            <form method="post" action="">
                <?php wp_nonce_field('fitcopilot_personal_training_action', 'fitcopilot_personal_training_nonce'); ?>
                
                <h2>Section Settings</h2>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">Section Title</th>
                        <td>
                            <input type="text" name="settings[section_title]" 
                                   value="<?php echo esc_attr($settings['section_title']); ?>" 
                                   class="regular-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Section Subtitle</th>
                        <td>
                            <input type="text" name="settings[section_subtitle]" 
                                   value="<?php echo esc_attr($settings['section_subtitle']); ?>" 
                                   class="regular-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Display Options</th>
                        <td>
                            <label>
                                <input type="checkbox" name="settings[show_featured_trainer]" 
                                       value="1" <?php checked(!empty($settings['show_featured_trainer'])); ?> />
                                Show Featured Trainer
                            </label><br />
                            
                            <label>
                                <input type="checkbox" name="settings[show_group_instructor]" 
                                       value="1" <?php checked(!empty($settings['show_group_instructor'])); ?> />
                                Show Group Instructors
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Max Display Count</th>
                        <td>
                            <input type="number" name="settings[max_display_count]" 
                                   value="<?php echo esc_attr($settings['max_display_count']); ?>" 
                                   min="-1" step="1" />
                            <p class="description">Use -1 to show all active trainers</p>
                        </td>
                    </tr>
                </table>
                
                <p class="submit">
                    <input type="submit" name="fitcopilot_personal_training_submit" 
                           class="button button-primary" value="Save Settings" />
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
            <h2>Export / Import Data</h2>
            
            <div class="export-section">
                <h3>Export Current Data</h3>
                <p>Download current trainer data as JSON:</p>
                <a href="?page=fitcopilot-personal-training&action=export" 
                   class="button button-secondary">📥 Export Trainers Data</a>
            </div>
            
            <div class="import-section" style="margin-top: 30px;">
                <h3>Import Data</h3>
                <p><strong>⚠️ Warning:</strong> This will replace all current data.</p>
                <form method="post" enctype="multipart/form-data">
                    <?php wp_nonce_field('fitcopilot_import_action', 'fitcopilot_import_nonce'); ?>
                    <input type="file" name="import_file" accept=".json" />
                    <input type="submit" name="fitcopilot_import_submit" 
                           class="button button-secondary" value="📤 Import Data" 
                           onclick="return confirm('This will replace all current data. Continue?');" />
                </form>
            </div>
        </div>
        <?php
    }
    
    /**
     * Render individual trainer row
     */
    public function render_trainer_row($index, $trainer = array(), $is_template = false) {
        // Handle template placeholder index safely
        $numeric_index = is_numeric($index) ? intval($index) : 0;
        
        $trainer = wp_parse_args($trainer, array(
            'id' => $numeric_index + 1,
            'name' => '',
            'specialty' => '',
            'bio' => '',
            'image_url' => '',
            'years_experience' => 0,
            'clients_count' => 0,
            'featured' => false,
            'active' => true,
            'coach_type' => 'strength',
            'video_title' => '',
            'video_url' => '',
            'video_poster' => '',
            'order' => $numeric_index + 1
        ));
        
        $is_active = !empty($trainer['active']);
        $row_class = $is_active ? 'trainer-row active' : 'trainer-row inactive';
        
        // Add featured class for special styling
        if (!empty($trainer['featured'])) {
            $row_class .= ' featured';
        }
        
        if ($is_template) {
            $row_class .= ' template-row';
        }
        ?>
        
        <div class="<?php echo esc_attr($row_class); ?>" data-index="<?php echo esc_attr($index); ?>">
            <?php if (!$is_template): ?>
                <input type="hidden" name="trainers[<?php echo $index; ?>][id]" value="<?php echo esc_attr($trainer['id']); ?>" />
            <?php endif; ?>
            
            <div class="trainer-row-header">
                <h4>
                    <?php if ($trainer['featured']): ?>
                        ⭐ Featured Trainer: 
                    <?php endif; ?>
                    <span class="trainer-name-display"><?php echo esc_html($trainer['name'] ?: 'New Trainer'); ?></span>
                </h4>
                
                <div class="row-controls">
                    <label class="active-toggle">
                        <input type="checkbox" name="trainers[<?php echo $index; ?>][active]" 
                               value="1" <?php checked($is_active); ?> />
                        <span class="toggle-label">Show on Frontend</span>
                    </label>
                    
                    <button type="button" class="remove-trainer-row button-link-delete" 
                            aria-label="Remove trainer">🗑️</button>
                </div>
            </div>
            
            <?php if (!$is_active): ?>
                <div class="inactive-notice">
                    ⚠️ This trainer is hidden from the frontend
                </div>
            <?php endif; ?>
            
            <div class="trainer-fields-grid">
                <div class="field-group">
                    <label>Trainer Name *</label>
                    <input type="text" name="trainers[<?php echo $index; ?>][name]" 
                           value="<?php echo esc_attr($trainer['name']); ?>" 
                           placeholder="Enter trainer name"
                           class="trainer-name-input regular-text" required />
                </div>
                
                <div class="field-group">
                    <label>Specialty *</label>
                    <input type="text" name="trainers[<?php echo $index; ?>][specialty]" 
                           value="<?php echo esc_attr($trainer['specialty']); ?>" 
                           placeholder="e.g., Strength & Conditioning"
                           class="regular-text" required />
                </div>
                
                <div class="field-group">
                    <label>Coach Type</label>
                    <select name="trainers[<?php echo $index; ?>][coach_type]" class="regular-text">
                        <option value="strength" <?php selected($trainer['coach_type'], 'strength'); ?>>Strength Training</option>
                        <option value="nutrition" <?php selected($trainer['coach_type'], 'nutrition'); ?>>Nutrition</option>
                        <option value="performance" <?php selected($trainer['coach_type'], 'performance'); ?>>Athletic Performance</option>
                        <option value="recovery" <?php selected($trainer['coach_type'], 'recovery'); ?>>Recovery & Wellness</option>
                    </select>
                </div>
                
                <div class="field-group full-width">
                    <label>Bio/Description</label>
                    <textarea name="trainers[<?php echo $index; ?>][bio]" 
                              placeholder="Tell clients about this trainer's experience and approach..."
                              rows="3" class="large-text"><?php echo esc_textarea($trainer['bio']); ?></textarea>
                </div>
                
                <div class="field-group">
                    <label>Years Experience</label>
                    <input type="number" name="trainers[<?php echo $index; ?>][years_experience]" 
                           value="<?php echo esc_attr($trainer['years_experience']); ?>" 
                           min="0" max="50" step="1" class="small-text" />
                </div>
                
                <div class="field-group">
                    <label>Clients Trained</label>
                    <input type="number" name="trainers[<?php echo $index; ?>][clients_count]" 
                           value="<?php echo esc_attr($trainer['clients_count']); ?>" 
                           min="0" step="1" class="small-text" />
                </div>
                
                <div class="field-group">
                    <label>Order/Priority</label>
                    <input type="number" name="trainers[<?php echo $index; ?>][order]" 
                           value="<?php echo esc_attr($trainer['order']); ?>" 
                           min="1" step="1" class="small-text" />
                </div>
                
                <div class="field-group full-width">
                    <label>Trainer Image</label>
                    <div class="image-upload-group">
                        <input type="url" name="trainers[<?php echo $index; ?>][image_url]" 
                               value="<?php echo esc_attr($trainer['image_url']); ?>" 
                               placeholder="https://example.com/trainer-photo.jpg"
                               class="image-url-input regular-text" />
                        <button type="button" class="upload-image-button button button-secondary">
                            📷 Choose Image
                        </button>
                    </div>
                    <?php if (!empty($trainer['image_url'])): ?>
                        <div class="image-preview">
                            <img src="<?php echo esc_url($trainer['image_url']); ?>" 
                                 alt="<?php echo esc_attr($trainer['name']); ?>" 
                                 style="max-width: 100px; height: auto; margin-top: 10px; border-radius: 8px;" />
                        </div>
                    <?php endif; ?>
                </div>
                
                <div class="field-group full-width">
                    <label>Video Demo (Optional)</label>
                    <div class="video-fields">
                        <input type="text" name="trainers[<?php echo $index; ?>][video_title]" 
                               value="<?php echo esc_attr($trainer['video_title']); ?>" 
                               placeholder="Video title (e.g., 'High-Intensity Workout Demo')"
                               class="regular-text" style="margin-bottom: 5px;" />
                        
                        <input type="url" name="trainers[<?php echo $index; ?>][video_url]" 
                               value="<?php echo esc_attr($trainer['video_url']); ?>" 
                               placeholder="YouTube embed URL (e.g., https://www.youtube.com/embed/ABC123)"
                               class="regular-text" style="margin-bottom: 5px;" />
                        
                        <input type="url" name="trainers[<?php echo $index; ?>][video_poster]" 
                               value="<?php echo esc_attr($trainer['video_poster']); ?>" 
                               placeholder="Video poster image URL (optional)"
                               class="regular-text" />
                    </div>
                </div>
                
                <div class="field-group">
                    <label class="featured-toggle">
                        <input type="checkbox" name="trainers[<?php echo $index; ?>][featured]" 
                               value="1" <?php checked(!empty($trainer['featured'])); ?> />
                        <span class="toggle-label">⭐ Featured Trainer</span>
                    </label>
                    <p class="description">Featured trainers get prominent display on the frontend</p>
                </div>
            </div>
            
            <!-- Individual Trainer Save Button -->
            <div class="trainer-save-section">
                <button type="button" class="save-individual-trainer button button-primary" 
                        data-trainer-index="<?php echo esc_attr($index); ?>"
                        data-trainer-id="<?php echo esc_attr($trainer['id']); ?>">
                    💾 Save This Trainer
                </button>
                <span class="save-status" id="save-status-<?php echo esc_attr($index); ?>"></span>
            </div>
        </div>
        <?php
    }
} 