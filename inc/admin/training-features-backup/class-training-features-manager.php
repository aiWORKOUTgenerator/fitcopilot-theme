<?php
/**
 * FitCopilot Training Features Manager
 * 
 * Main orchestrator class for Training Features admin functionality
 * Follows the FitCopilot Complex Manager pattern established in Personal Training
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
 * Training Features Manager Class
 * 
 * Extends FitCopilot_Complex_Manager for consistent architecture
 * Implements comprehensive admin interface for managing training feature content
 */
class FitCopilot_Training_Features_Manager extends FitCopilot_Complex_Manager {
    
    /**
     * Module instances following established patterns
     */
    private $ajax_handler;
    private $data_manager;
    private $settings_manager;
    private $renderer;
    private $data_provider;
    
    /**
     * Constructor
     * 
     * Initialize with 'training-features' feature name for consistency
     */
    public function __construct() {
        // Initialize with 'training-features' feature name
        parent::__construct('training-features');
        
        $this->load_dependencies();
        $this->init_modules();
        $this->init_module_hooks();
        $this->setup_database();
    }
    
    /**
     * Load required module files
     * Following the established dependency loading pattern
     */
    private function load_dependencies() {
        $base_path = get_template_directory() . '/inc/admin/training-features/';
        
        require_once $base_path . 'class-training-features-ajax.php';
        require_once $base_path . 'class-training-features-data.php';
        require_once $base_path . 'class-training-features-settings.php';
        require_once $base_path . 'class-training-features-renderer.php';
        require_once $base_path . 'class-training-features-provider.php';
        
        // Include shared admin functions
        require_once get_template_directory() . '/inc/admin/shared/admin-base-template.php';
    }
    
    /**
     * Initialize module instances
     * Following the established modular architecture pattern
     */
    private function init_modules() {
        $this->data_manager = new FitCopilot_Training_Features_Data();
        $this->settings_manager = new FitCopilot_Training_Features_Settings($this->data_manager);
        $this->ajax_handler = new FitCopilot_Training_Features_Ajax($this->data_manager);
        $this->renderer = new FitCopilot_Training_Features_Renderer($this->data_manager);
        $this->data_provider = new FitCopilot_Training_Features_Provider($this->data_manager);
    }
    
    /**
     * Initialize module-specific hooks
     * Following established hook initialization patterns
     */
    private function init_module_hooks() {
        // Initialize modules
        $this->ajax_handler->init();
        $this->settings_manager->init();
        $this->data_provider->init();
        
        // Add database setup hook
        add_action('admin_init', array($this, 'check_database_version'));
    }
    
    /**
     * Setup database tables and initial data
     * Creates the wp_fitcopilot_training_features table as per PRD specifications
     */
    private function setup_database() {
        // Create database table on first run
        $this->create_database_table();
        
        // Migrate hardcoded data if table is empty
        $this->migrate_hardcoded_data();
    }
    
    /**
     * Create the training features database table
     * Following PRD database schema requirements
     */
    private function create_database_table() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'fitcopilot_training_features';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            title varchar(255) NOT NULL,
            description longtext,
            feature_type varchar(50) DEFAULT 'general',
            difficulty_level enum('beginner','intermediate','advanced') DEFAULT 'beginner',
            duration_minutes int(11) DEFAULT 0,
            image_url varchar(500),
            video_url varchar(500),
            video_poster varchar(500),
            icon_type enum('lucide','custom','emoji') DEFAULT 'lucide',
            icon_name varchar(100) DEFAULT 'Star',
            gradient_class varchar(100) DEFAULT 'from-lime-300 to-emerald-400',
            flip_front_text longtext,
            flip_back_title varchar(255),
            flip_back_details longtext,
            cta_text varchar(100),
            cta_url varchar(500),
            display_order int(11) DEFAULT 0,
            is_featured tinyint(1) DEFAULT 0,
            is_active tinyint(1) DEFAULT 1,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_active (is_active),
            KEY idx_featured (is_featured),
            KEY idx_order (display_order),
            KEY idx_type (feature_type)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Update database version
        update_option('fitcopilot_training_features_db_version', '1.0.0');
    }
    
    /**
     * Check database version and run updates if needed
     */
    public function check_database_version() {
        $current_version = get_option('fitcopilot_training_features_db_version', '0.0.0');
        if (version_compare($current_version, '1.0.0', '<')) {
            $this->create_database_table();
        }
    }
    
    /**
     * Migrate hardcoded training features data to database
     * Extracts data from React components and populates database
     */
    private function migrate_hardcoded_data() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'fitcopilot_training_features';
        
        // Check if we already have data
        $existing_count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
        if ($existing_count > 0) {
            return; // Already migrated
        }
        
        // Default training features data extracted from React components
        $default_features = array(
            array(
                'title' => 'Live Virtual Sessions',
                'description' => 'Real-time coaching and feedback from anywhere in the world.',
                'feature_type' => 'technology',
                'difficulty_level' => 'beginner',
                'duration_minutes' => 60,
                'image_url' => '/wp-content/themes/fitcopilot/src/features/Homepage/TrainingFeatures/media/videos/drone-video-poster.jpg',
                'video_url' => '/wp-content/themes/fitcopilot/src/features/Homepage/TrainingFeatures/media/videos/Drone Video 3.mp4',
                'icon_type' => 'lucide',
                'icon_name' => 'Video',
                'gradient_class' => 'from-lime-300 to-emerald-400',
                'flip_front_text' => 'Get expert coaching from anywhere with our high-quality video platform.',
                'flip_back_title' => 'Live Virtual Session',
                'flip_back_details' => 'HD video with crystal clear audio|Screen sharing for technique analysis|Record sessions for later review|Works on any device',
                'display_order' => 1,
                'is_featured' => 1,
                'is_active' => 1
            ),
            array(
                'title' => 'Flexible Scheduling',
                'description' => 'Book sessions when it works for you with easy rescheduling.',
                'feature_type' => 'convenience',
                'difficulty_level' => 'beginner',
                'duration_minutes' => 0,
                'image_url' => '/assets/features/calendar.jpg',
                'icon_type' => 'lucide',
                'icon_name' => 'Calendar',
                'gradient_class' => 'from-cyan-300 to-blue-400',
                'flip_front_text' => 'Life gets busy. Our flexible scheduling adapts to your changing needs.',
                'flip_back_title' => 'Smart Calendar',
                'flip_back_details' => '24/7 online booking system|Automated reminders and notifications|Easy rescheduling with no fees|Time zone intelligent',
                'display_order' => 2,
                'is_featured' => 0,
                'is_active' => 1
            ),
            array(
                'title' => 'Progress Tracking',
                'description' => 'Detailed metrics and benchmarks to visualize your improvement.',
                'feature_type' => 'analytics',
                'difficulty_level' => 'intermediate',
                'duration_minutes' => 0,
                'image_url' => '/assets/features/progress-tracking.jpg',
                'icon_type' => 'lucide',
                'icon_name' => 'BarChart',
                'gradient_class' => 'from-violet-300 to-purple-400',
                'flip_front_text' => 'Track every aspect of your fitness journey with intuitive visualizations.',
                'flip_back_title' => 'Data Insights',
                'flip_back_details' => 'Custom progress dashboards|Performance trend analysis|Goal achievement tracking|Body composition metrics',
                'display_order' => 3,
                'is_featured' => 0,
                'is_active' => 1
            ),
            array(
                'title' => 'Continuous Support',
                'description' => 'Direct messaging with your trainer between sessions.',
                'feature_type' => 'support',
                'difficulty_level' => 'beginner',
                'duration_minutes' => 0,
                'image_url' => '/assets/features/support.jpg',
                'icon_type' => 'lucide',
                'icon_name' => 'MessageSquare',
                'gradient_class' => 'from-amber-300 to-orange-400',
                'flip_front_text' => 'Questions between sessions? Your trainer is just a message away.',
                'flip_back_title' => 'Always Connected',
                'flip_back_details' => 'Encrypted private messaging|Share photos and videos for form checks|Quick response time guarantee|Access to knowledge base',
                'display_order' => 4,
                'is_featured' => 0,
                'is_active' => 1
            ),
            array(
                'title' => 'Custom Workouts',
                'description' => 'Personalized training plans designed for your specific goals.',
                'feature_type' => 'personalization',
                'difficulty_level' => 'intermediate',
                'duration_minutes' => 45,
                'image_url' => '/assets/features/custom-workout.jpg',
                'icon_type' => 'lucide',
                'icon_name' => 'Download',
                'gradient_class' => 'from-lime-300 to-emerald-400',
                'flip_front_text' => 'Every workout is designed specifically for your body, goals, and equipment.',
                'flip_back_title' => 'Tailored Programs',
                'flip_back_details' => 'AI-assisted program design|Adapts to your progress rate|Equipment-flexible options|Recovery-optimized scheduling',
                'display_order' => 5,
                'is_featured' => 0,
                'is_active' => 1
            ),
            array(
                'title' => 'Mobile Experience',
                'description' => 'Access your training plan and resources on any device.',
                'feature_type' => 'technology',
                'difficulty_level' => 'beginner',
                'duration_minutes' => 0,
                'image_url' => '/assets/features/mobile.jpg',
                'icon_type' => 'lucide',
                'icon_name' => 'Smartphone',
                'gradient_class' => 'from-cyan-300 to-blue-400',
                'flip_front_text' => 'Your entire fitness plan in your pocket, accessible anywhere and anytime.',
                'flip_back_title' => 'Mobile-First Design',
                'flip_back_details' => 'Works offline for gym usage|Exercise video library|Voice-guided workouts|Wearable device integration',
                'display_order' => 6,
                'is_featured' => 0,
                'is_active' => 1
            )
        );
        
        // Insert default data
        foreach ($default_features as $feature) {
            $wpdb->insert($table_name, $feature);
        }
    }
    
    // ===== ABSTRACT METHOD IMPLEMENTATIONS FROM FitCopilot_Complex_Manager =====
    
    /**
     * Enqueue feature-specific styles
     * Required by FitCopilot_Complex_Manager
     */
    protected function enqueue_feature_styles() {
        // Training Features uses specific grid and theme styles
        wp_enqueue_style(
            'fitcopilot-training-features-grid',
            get_template_directory_uri() . '/assets/admin/css/training-features-grid.css',
            array('fitcopilot-admin-base'),
            filemtime(get_template_directory() . '/assets/admin/css/training-features-grid.css')
        );
        
        wp_enqueue_style(
            'fitcopilot-training-features-theme',
            get_template_directory_uri() . '/assets/admin/css/training-features-theme.css',
            array('fitcopilot-admin-base', 'fitcopilot-training-features-grid'),
            filemtime(get_template_directory() . '/assets/admin/css/training-features-theme.css')
        );
    }
    
    /**
     * Enqueue feature-specific scripts
     * Required by FitCopilot_Complex_Manager
     */
    protected function enqueue_feature_scripts() {
        // Enqueue training features admin JavaScript
        wp_enqueue_script(
            'fitcopilot-training-features-admin',
            get_template_directory_uri() . '/assets/admin/js/training-features-admin.js',
            array('jquery'),
            filemtime(get_template_directory() . '/assets/admin/js/training-features-admin.js'),
            true
        );
        
        // Localize script for AJAX (following established pattern)
        wp_localize_script('fitcopilot-training-features-admin', 'fitcopilotTrainingFeaturesAjax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('fitcopilot_save_individual_feature'),
            'saving' => __('Saving...', 'fitcopilot'),
            'saved' => __('✅ Saved!', 'fitcopilot'),
            'error' => __('❌ Error', 'fitcopilot'),
            'confirm_delete' => __('Are you sure you want to delete this feature?', 'fitcopilot'),
            'confirm_reset' => __('Are you sure you want to reset all features to defaults? This cannot be undone.', 'fitcopilot')
        ));
    }
    
    /**
     * Handle form submissions
     * Required by FitCopilot_Complex_Manager
     */
    protected function handle_form_submissions() {
        // Main form submission
        if (isset($_POST['fitcopilot_training_features_submit'])) {
            check_admin_referer('fitcopilot_training_features_action', 'fitcopilot_training_features_nonce');
            
            // Update features data
            if (isset($_POST['features']) && is_array($_POST['features'])) {
                $result = $this->data_manager->save_features($_POST['features']);
                
                if ($result) {
                    echo '<div class="notice notice-success is-dismissible"><p>Training features data updated successfully!</p></div>';
                } else {
                    echo '<div class="notice notice-error is-dismissible"><p>Error updating training features data.</p></div>';
                }
            }
            
            // Update settings - MERGE with existing settings instead of replacing
            if (isset($_POST['settings'])) {
                // Get current settings
                $current_settings = $this->data_manager->get_settings();
                
                // Merge new settings with existing settings to preserve all fields
                $merged_settings = array_merge($current_settings, $_POST['settings']);
                
                // Save merged settings
                $result = $this->settings_manager->save_settings($merged_settings);
                
                if ($result) {
                    echo '<div class="notice notice-success is-dismissible"><p>Settings updated successfully!</p></div>';
                } else {
                    echo '<div class="notice notice-error is-dismissible"><p>Error updating settings.</p></div>';
                }
            }
        }
        
        // Reset to defaults
        if (isset($_POST['fitcopilot_reset_defaults'])) {
            check_admin_referer('fitcopilot_reset_action', 'fitcopilot_reset_nonce');
            
            $this->data_manager->reset_to_defaults();
            echo '<div class="notice notice-success is-dismissible"><p>Training features data reset to defaults!</p></div>';
        }
    }
    
    /**
     * Get current data
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_current_data() {
        return $this->data_manager->get_features();
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
     * Render status indicator
     * Required by FitCopilot_Complex_Manager
     */
    protected function render_status_indicator($data) {
        $count = is_array($data) ? count($data) : 0;
        $active_count = 0;
        $featured_count = 0;
        
        if (is_array($data)) {
            foreach ($data as $feature) {
                if (!empty($feature['is_active'])) {
                    $active_count++;
                }
                if (!empty($feature['is_featured'])) {
                    $featured_count++;
                }
            }
        }
        
        ?>
        <div class="fitcopilot-status-indicator">
            <strong>📊 Current Status:</strong> 
            <?php echo $count; ?> <?php echo $this->get_item_name_plural(); ?> loaded.
            <?php if ($active_count !== $count): ?>
                <?php echo $active_count; ?> active on frontend.
            <?php endif; ?>
            <?php if ($featured_count > 0): ?>
                <?php echo $featured_count; ?> featured.
            <?php endif; ?>
        </div>
        <?php
    }
    
    /**
     * Get additional tabs configuration
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_additional_tabs() {
        return array(
            'categories' => array(
                'label' => 'Categories',
                'description' => 'Manage feature categories and types'
            ),
            'display-options' => array(
                'label' => 'Display Options',
                'description' => 'Configure layout and styling options'
            ),
            'export-import' => array(
                'label' => 'Export/Import',
                'description' => 'Export and import training features data'
            ),
            'cta-management' => array(
                'label' => 'CTA Management',
                'description' => 'Configure call-to-action settings'
            )
        );
    }
    
    /**
     * Get item name plural
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_item_name_plural() {
        return 'training features';
    }
    
    /**
     * Register settings
     * Required by FitCopilot_Complex_Manager
     */
    public function register_settings() {
        $this->settings_manager->register_settings();
    }
    
    /**
     * Provide frontend data
     * Required by FitCopilot_Complex_Manager
     */
    public function provide_frontend_data() {
        $this->data_provider->provide_frontend_data();
    }
    
    // ===== PUBLIC ACCESSORS FOR MODULE INSTANCES =====
    
    /**
     * Get data manager instance
     */
    public function get_data_manager() {
        return $this->data_manager;
    }
    
    /**
     * Get renderer instance
     */
    public function get_renderer() {
        return $this->renderer;
    }
    
    /**
     * Get AJAX handler instance
     */
    public function get_ajax_handler() {
        return $this->ajax_handler;
    }
    
    /**
     * Get settings manager instance
     */
    public function get_settings_manager() {
        return $this->settings_manager;
    }
    
    /**
     * Get data provider instance
     */
    public function get_data_provider() {
        return $this->data_provider;
    }
} 