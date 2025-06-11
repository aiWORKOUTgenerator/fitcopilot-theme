<?php
/**
 * FitCopilot Personal Training Manager
 * 
 * Main orchestrator class for Personal Training admin functionality
 * Follows the FitCopilot Complex Manager pattern established in Phase 1
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Load the base admin patterns framework
require_once get_template_directory() . '/inc/admin/shared/admin-patterns.php';

/**
 * Personal Training Manager Class
 * 
 * Extends FitCopilot_Complex_Manager for consistent architecture
 */
class FitCopilot_Personal_Training_Manager extends FitCopilot_Complex_Manager {
    
    /**
     * Module instances
     */
    private $ajax_handler;
    private $data_manager;
    private $settings_manager;
    private $renderer;
    private $data_provider;
    
    /**
     * Constructor
     */
    public function __construct() {
        // Initialize with 'personal-training' feature name
        parent::__construct('personal-training');
        
        $this->load_dependencies();
        $this->init_modules();
        $this->init_module_hooks();
    }
    
    /**
     * Load required module files
     */
    private function load_dependencies() {
        $base_path = get_template_directory() . '/inc/admin/personal-training/';
        
        require_once $base_path . 'class-personal-training-ajax.php';
        require_once $base_path . 'class-personal-training-data.php';
        require_once $base_path . 'class-personal-training-settings.php';
        require_once $base_path . 'class-personal-training-renderer.php';
        require_once $base_path . 'class-personal-training-provider.php';
        
        // Include shared admin functions
        require_once get_template_directory() . '/inc/admin/shared/admin-base-template.php';
    }
    
    /**
     * Initialize module instances
     */
    private function init_modules() {
        $this->data_manager = new FitCopilot_Personal_Training_Data();
        $this->settings_manager = new FitCopilot_Personal_Training_Settings($this->data_manager);
        $this->ajax_handler = new FitCopilot_Personal_Training_Ajax($this->data_manager);
        $this->renderer = new FitCopilot_Personal_Training_Renderer($this->data_manager);
        $this->data_provider = new FitCopilot_Personal_Training_Provider($this->data_manager);
    }
    
    /**
     * Initialize module-specific hooks
     */
    private function init_module_hooks() {
        // Initialize modules
        $this->ajax_handler->init();
        $this->settings_manager->init();
        $this->data_provider->init();
    }
    
    // ===== ABSTRACT METHOD IMPLEMENTATIONS FROM FitCopilot_Complex_Manager =====
    
    /**
     * Enqueue feature-specific styles
     * Required by FitCopilot_Complex_Manager
     */
    protected function enqueue_feature_styles() {
        // Personal Training uses specific grid and theme styles
        wp_enqueue_style(
            'fitcopilot-personal-training-grid',
            get_template_directory_uri() . '/assets/admin/css/personal-training-grid.css',
            array('fitcopilot-admin-base'),
            filemtime(get_template_directory() . '/assets/admin/css/personal-training-grid.css')
        );
        
        wp_enqueue_style(
            'fitcopilot-personal-training-theme',
            get_template_directory_uri() . '/assets/admin/css/personal-training-theme.css',
            array('fitcopilot-admin-base', 'fitcopilot-personal-training-grid'),
            filemtime(get_template_directory() . '/assets/admin/css/personal-training-theme.css')
        );
    }
    
    /**
     * Enqueue feature-specific scripts
     * Required by FitCopilot_Complex_Manager
     */
    protected function enqueue_feature_scripts() {
        // Enqueue personal training admin JavaScript
        wp_enqueue_script(
            'fitcopilot-personal-training-admin',
            get_template_directory_uri() . '/assets/admin/js/personal-training-admin.js',
            array('jquery'),
            filemtime(get_template_directory() . '/assets/admin/js/personal-training-admin.js'),
            true
        );
        
        // Localize script for AJAX (matches legacy exactly)
        wp_localize_script('fitcopilot-personal-training-admin', 'fitcopilotPersonalTrainingAjax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('fitcopilot_save_individual_trainer'),
            'saving_text' => __('Saving...', 'fitcopilot'),
            'saved_text' => __('✅ Saved!', 'fitcopilot'),
            'error_text' => __('❌ Error saving', 'fitcopilot')
        ));
    }
    
    /**
     * Handle form submissions
     * Required by FitCopilot_Complex_Manager
     */
    protected function handle_form_submissions() {
        // Main form submission
        if (isset($_POST['fitcopilot_personal_training_submit'])) {
            check_admin_referer('fitcopilot_personal_training_action', 'fitcopilot_personal_training_nonce');
            
            // Update trainers data
            if (isset($_POST['trainers']) && is_array($_POST['trainers'])) {
                $result = $this->data_manager->save_trainers($_POST['trainers']);
                
                if ($result) {
                    echo '<div class="notice notice-success is-dismissible"><p>Personal training data updated successfully!</p></div>';
                } else {
                    echo '<div class="notice notice-error is-dismissible"><p>Error updating personal training data.</p></div>';
                }
            }
            
            // Update settings
            if (isset($_POST['settings'])) {
                $this->settings_manager->save_settings($_POST['settings']);
                echo '<div class="notice notice-success is-dismissible"><p>Settings updated successfully!</p></div>';
            }
        }
        
        // Reset to defaults
        if (isset($_POST['fitcopilot_reset_defaults'])) {
            check_admin_referer('fitcopilot_reset_action', 'fitcopilot_reset_nonce');
            
            $this->data_manager->reset_to_defaults();
            echo '<div class="notice notice-success is-dismissible"><p>Personal training data reset to defaults!</p></div>';
        }
    }
    
    /**
     * Get current data
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_current_data() {
        return $this->data_manager->get_trainers();
    }
    
    /**
     * Get current settings
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_current_settings() {
        return $this->data_manager->get_settings();
    }
    
    /**
     * Render tab content
     * Required by FitCopilot_Complex_Manager
     */
    protected function render_tab_content($active_tab, $data, $settings) {
        $this->renderer->render_tab_content($active_tab, $data, $settings);
    }
    
    /**
     * Override base class status indicator with trainer-specific debug information
     * 
     * @param array $data Current trainer data
     */
    protected function render_status_indicator($data) {
        $active_count = count(array_filter($data, function($trainer) { 
            return !empty($trainer['active']); 
        }));
        ?>
        <div class="fitcopilot-status-indicator">
            <strong>📊 Current Status:</strong> 
            <?php echo count($data); ?> trainers loaded. 
            <?php echo $active_count . ' active on frontend.'; ?>
            
            <?php if ($active_count !== count($data)): ?>
                <br><span style="color: #ff6b6b;">⚠️ <?php echo (count($data) - $active_count); ?> trainers are hidden from frontend</span>
            <?php endif; ?>
            
            <?php if (defined('WP_DEBUG') && WP_DEBUG): ?>
                <br><small style="color: rgba(255,255,255,0.7);">
                    <strong>Debug Info:</strong>
                    <?php foreach ($data as $index => $trainer): ?>
                        <?php $status = !empty($trainer['active']) ? '✅' : '❌'; ?>
                        <?php echo $status . ' ' . htmlspecialchars($trainer['name'] ?? "Trainer $index") . ' '; ?>
                    <?php endforeach; ?>
                </small>
            <?php endif; ?>
        </div>
        <?php
    }
    
    /**
     * Get additional tabs for complex manager
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_additional_tabs() {
        return array(
            'trainer-profiles' => array('label' => 'Trainer Profiles'),
            'group-instructors' => array('label' => 'Group Instructors')
        );
    }
    
    /**
     * Get item name plural for status messages
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_item_name_plural() {
        return 'trainers';
    }
    
    /**
     * Register settings with WordPress
     * Required by FitCopilot_Complex_Manager
     */
    public function register_settings() {
        // Delegated to settings manager module
        $this->settings_manager->register_settings();
    }
    
    /**
     * Provide frontend data
     * Required by FitCopilot_Complex_Manager
     */
    public function provide_frontend_data() {
        // Delegated to data provider module
        $this->data_provider->provide_frontend_data();
    }
    
    // ===== PUBLIC API METHODS FOR MODULE ACCESS =====
    
    /**
     * Get data manager instance
     * 
     * @return FitCopilot_Personal_Training_Data
     */
    public function get_data_manager() {
        return $this->data_manager;
    }
    
    /**
     * Get renderer instance
     * 
     * @return FitCopilot_Personal_Training_Renderer
     */
    public function get_renderer() {
        return $this->renderer;
    }
    
    /**
     * Get AJAX handler instance
     * 
     * @return FitCopilot_Personal_Training_Ajax
     */
    public function get_ajax_handler() {
        return $this->ajax_handler;
    }
    
    /**
     * Get settings manager instance
     * 
     * @return FitCopilot_Personal_Training_Settings
     */
    public function get_settings_manager() {
        return $this->settings_manager;
    }
    
    /**
     * Get data provider instance
     * 
     * @return FitCopilot_Personal_Training_Provider
     */
    public function get_data_provider() {
        return $this->data_provider;
    }
}

// Initialize the manager
new FitCopilot_Personal_Training_Manager(); 