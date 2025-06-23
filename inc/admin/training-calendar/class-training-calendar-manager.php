<?php
/**
 * FitCopilot Training Calendar Manager
 * 
 * Main orchestrator class for Training Calendar admin functionality
 * Follows the FitCopilot Complex Manager pattern established in Personal Training
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Calendar Manager Class
 * 
 * Extends FitCopilot_Complex_Manager for consistent architecture
 * Implements comprehensive admin interface for managing calendar events and trainer availability
 */
class FitCopilot_Training_Calendar_Manager extends FitCopilot_Complex_Manager {
    
    /**
     * Module instances following established patterns
     */
    private $ajax_handler;
    private $data_manager;
    private $settings_manager;
    private $renderer;
    private $data_provider;
    private $availability_handler;
    private $schema_manager;
    private $assignment_manager;
    
    /**
     * Constructor
     * 
     * Initialize with 'training-calendar' feature name for consistency
     */
    public function __construct() {
        // Initialize with 'training-calendar' feature name
        parent::__construct('training-calendar');
        
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
        $base_path = get_template_directory() . '/inc/admin/training-calendar/';
        
        require_once $base_path . 'class-training-calendar-ajax.php';
        require_once $base_path . 'class-training-calendar-data.php';
        require_once $base_path . 'class-training-calendar-settings.php';
        require_once $base_path . 'class-training-calendar-renderer.php';
        require_once $base_path . 'class-training-calendar-provider.php';
        require_once $base_path . 'class-trainer-availability-handler.php';
        require_once $base_path . 'class-training-calendar-schema-manager.php';
        require_once $base_path . 'class-trainer-assignment-manager.php';
        
        // Include shared admin functions
        require_once get_template_directory() . '/inc/admin/shared/admin-base-template.php';
    }
    
    /**
     * Initialize module instances
     */
    private function init_modules() {
        $this->data_manager = new FitCopilot_Training_Calendar_Data();
        $this->settings_manager = new FitCopilot_Training_Calendar_Settings($this->data_manager);
        $this->ajax_handler = new FitCopilot_Training_Calendar_Ajax($this->data_manager);
        $this->renderer = new FitCopilot_Training_Calendar_Renderer($this->data_manager);
        $this->data_provider = new FitCopilot_Training_Calendar_Provider($this->data_manager);
        $this->availability_handler = new FitCopilot_Trainer_Availability_Handler();
        $this->schema_manager = new FitCopilot_Training_Calendar_Schema_Manager();
        $this->assignment_manager = new FitCopilot_Trainer_Assignment_Manager();
    }
    
     /**
     * Initialize module-specific hooks
     */
    private function init_module_hooks() {
        // Initialize modules
        $this->ajax_handler->init();
        $this->settings_manager->init();
        $this->data_provider->init();
        
        // Initialize availability handler - this will register all AJAX handlers
        $this->availability_handler->init();
        
        // REMOVED: Hook frontend data provider to wp_enqueue_scripts
        // This is now handled directly in functions.php fitcopilot_enqueue_scripts()
        // to ensure proper script enqueue timing
        // add_action('wp_enqueue_scripts', array($this, 'provide_frontend_data'), 20);
    }
    
    /**
     * Setup database tables if needed
     */
    private function setup_database() {
        // Only create tables if they don't exist and we're in admin area
        // This prevents database operations during regular page loads
        if (is_admin()) {
            $tables_created = get_option('fitcopilot_training_calendar_tables_created', false);
            
            if (!$tables_created) {
                // First create basic tables
                $result = $this->data_manager->create_tables();
                if ($result) {
                    update_option('fitcopilot_training_calendar_tables_created', true);
                }
            }
            
            // Handle schema updates for event type assignments
            if ($this->schema_manager && method_exists($this->schema_manager, 'maybe_update_schema')) {
                // Schema manager will automatically check and update if needed
                // This handles both fresh installations and updates
            }
        }
    }
    
    // ===== ABSTRACT METHOD IMPLEMENTATIONS FROM FitCopilot_Complex_Manager =====
    
    /**
     * Enqueue feature-specific styles
     * Required by FitCopilot_Complex_Manager
     */
    protected function enqueue_feature_styles() {
        // Training Calendar uses specific calendar and theme styles
        wp_enqueue_style(
            'fitcopilot-training-calendar-base',
            get_template_directory_uri() . '/assets/admin/css/training-calendar/training-calendar-base.css',
            array('fitcopilot-admin-base'),
            filemtime(get_template_directory() . '/assets/admin/css/training-calendar/training-calendar-base.css')
        );
        
        wp_enqueue_style(
            'fitcopilot-training-calendar-grid',
            get_template_directory_uri() . '/assets/admin/css/training-calendar/training-calendar-grid.css',
            array('fitcopilot-admin-base', 'fitcopilot-training-calendar-base'),
            filemtime(get_template_directory() . '/assets/admin/css/training-calendar/training-calendar-grid.css')
        );
        
        wp_enqueue_style(
            'fitcopilot-training-calendar-theme',
            get_template_directory_uri() . '/assets/admin/css/training-calendar/training-calendar-theme.css',
            array('fitcopilot-admin-base', 'fitcopilot-training-calendar-base', 'fitcopilot-training-calendar-grid'),
            filemtime(get_template_directory() . '/assets/admin/css/training-calendar/training-calendar-theme.css')
        );
    }
    
    /**
     * Enqueue feature-specific scripts
     * Required by FitCopilot_Complex_Manager
     */
    protected function enqueue_feature_scripts() {
        // Enqueue React and FullCalendar for admin calendar widget
        wp_enqueue_script('react');
        wp_enqueue_script('react-dom');
        
        // Enqueue the main homepage bundle which includes FullCalendar
        wp_enqueue_script(
            'fitcopilot-homepage',
            get_template_directory_uri() . '/dist/homepage.js',
            array('react', 'react-dom'),
            filemtime(get_template_directory() . '/dist/homepage.js'),
            true
        );
        
        wp_enqueue_script(
            'fitcopilot-training-calendar-admin',
            get_template_directory_uri() . '/assets/admin/js/training-calendar/training-calendar-admin.js',
            array('jquery', 'fitcopilot-homepage'),
            filemtime(get_template_directory() . '/assets/admin/js/training-calendar/training-calendar-admin.js'),
            true
        );
        
        // Enqueue trainer availability management modules (Phase 2 modular architecture)
        wp_enqueue_script(
            'fitcopilot-trainer-availability-event-types',
            get_template_directory_uri() . '/assets/admin/js/training-calendar/modules/event-types.js',
            array('jquery'),
            filemtime(get_template_directory() . '/assets/admin/js/training-calendar/modules/event-types.js'),
            true
        );
        
        wp_enqueue_script(
            'fitcopilot-trainer-availability-form-management',
            get_template_directory_uri() . '/assets/admin/js/training-calendar/modules/form-management.js',
            array('jquery', 'fitcopilot-trainer-availability-event-types'),
            filemtime(get_template_directory() . '/assets/admin/js/training-calendar/modules/form-management.js'),
            true
        );
        
        wp_enqueue_script(
            'fitcopilot-trainer-availability-time-slot-manager',
            get_template_directory_uri() . '/assets/admin/js/training-calendar/modules/time-slot-manager.js',
            array('jquery', 'fitcopilot-trainer-availability-event-types', 'fitcopilot-trainer-availability-form-management'),
            filemtime(get_template_directory() . '/assets/admin/js/training-calendar/modules/time-slot-manager.js'),
            true
        );
        
        wp_enqueue_script(
            'fitcopilot-trainer-availability-form-validation',
            get_template_directory_uri() . '/assets/admin/js/training-calendar/modules/form-validation.js',
            array('jquery', 'fitcopilot-trainer-availability-event-types', 'fitcopilot-trainer-availability-form-management'),
            filemtime(get_template_directory() . '/assets/admin/js/training-calendar/modules/form-validation.js'),
            true
        );
        
        wp_enqueue_script(
            'fitcopilot-trainer-availability-modal-manager',
            get_template_directory_uri() . '/assets/admin/js/training-calendar/modules/modal-manager.js',
            array('jquery', 'fitcopilot-trainer-availability-form-management'),
            filemtime(get_template_directory() . '/assets/admin/js/training-calendar/modules/modal-manager.js'),
            true
        );
        
        wp_enqueue_script(
            'fitcopilot-trainer-availability-event-integration',
            get_template_directory_uri() . '/assets/admin/js/training-calendar/modules/event-type-integration.js',
            array('jquery', 'fitcopilot-trainer-availability-event-types'),
            filemtime(get_template_directory() . '/assets/admin/js/training-calendar/modules/event-type-integration.js'),
            true
        );
        
        // Day 3: Assignment Manager module
        wp_enqueue_script(
            'fitcopilot-trainer-availability-assignment-manager',
            get_template_directory_uri() . '/assets/admin/js/training-calendar/modules/assignment-manager.js',
            array('jquery', 'fitcopilot-trainer-availability-event-types'),
            filemtime(get_template_directory() . '/assets/admin/js/training-calendar/modules/assignment-manager.js'),
            true
        );
        
        // Enqueue main trainer availability admin orchestrator (depends on all modules)
        wp_enqueue_script(
            'fitcopilot-trainer-availability-admin',
            get_template_directory_uri() . '/assets/admin/js/training-calendar/trainer-availability-admin.js',
            array(
                'jquery', 
                'fitcopilot-training-calendar-admin',
                'fitcopilot-trainer-availability-event-types',
                'fitcopilot-trainer-availability-form-management',
                'fitcopilot-trainer-availability-time-slot-manager',
                'fitcopilot-trainer-availability-form-validation',
                'fitcopilot-trainer-availability-modal-manager',
                'fitcopilot-trainer-availability-event-integration',
                'fitcopilot-trainer-availability-assignment-manager'
            ),
            filemtime(get_template_directory() . '/assets/admin/js/training-calendar/trainer-availability-admin.js'),
            true
        );
        
        // Localize script with AJAX configuration
        wp_localize_script('fitcopilot-training-calendar-admin', 'fitcopilotTrainingCalendarAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('fitcopilot_training_calendar_nonce'),
            'strings' => array(
                'confirmDelete' => __('Are you sure you want to delete this event?', 'fitcopilot'),
                'confirmBulkDelete' => __('Are you sure you want to delete the selected events?', 'fitcopilot'),
                'saveSuccess' => __('Event saved successfully!', 'fitcopilot'),
                'saveError' => __('Error saving event. Please try again.', 'fitcopilot'),
                'loadingEvents' => __('Loading calendar events...', 'fitcopilot'),
                'noEventsFound' => __('No events found for the selected period.', 'fitcopilot')
            )
        ));
        
        // Provide calendar data for admin widget
        $this->data_provider->provide_frontend_data();
    }
    
    /**
     * Get admin page capability requirement
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_admin_capability() {
        return 'manage_options';
    }
    
    /**
     * Get admin menu configuration
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_menu_config() {
        return array(
            'page_title' => __('Training Calendar Manager', 'fitcopilot'),
            'menu_title' => __('Training Calendar', 'fitcopilot'),
            'menu_slug' => 'fitcopilot-training-calendar',
            'position' => 25 // Position after Personal Training (20) and Training Features (23)
        );
    }
    
    /**
     * Render admin page content
     * Required by FitCopilot_Complex_Manager
     */
    public function render_admin_page() {
        $this->renderer->render_page();
    }
    
    /**
     * Handle form submissions
     * Required by FitCopilot_Complex_Manager
     */
    public function handle_form_submissions() {
        if (!isset($_POST['fitcopilot_training_calendar_nonce']) || 
            !wp_verify_nonce($_POST['fitcopilot_training_calendar_nonce'], 'fitcopilot_training_calendar_save')) {
            return;
        }
        
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to perform this action.'));
        }
        
        // Handle different form submissions
        if (isset($_POST['action'])) {
            switch ($_POST['action']) {
                case 'save_calendar_settings':
                    $this->handle_settings_save();
                    break;
                    
                case 'bulk_event_operations':
                    $this->handle_bulk_operations();
                    break;
                    
                case 'import_events':
                    $this->handle_event_import();
                    break;
                    
                case 'reset_calendar_defaults':
                    $this->handle_reset_defaults();
                    break;
            }
        }
        
        // Redirect to prevent resubmission
        wp_redirect(admin_url('admin.php?page=fitcopilot-training-calendar&updated=1'));
        exit;
    }
    
    /**
     * Handle settings save
     */
    private function handle_settings_save() {
        if (isset($_POST['calendar_settings'])) {
            $settings_data = $_POST['calendar_settings'];
            
            // Sanitize settings data
            $sanitized_settings = $this->settings_manager->sanitize_settings($settings_data);
            
            // Save settings
            $result = $this->data_manager->save_settings($sanitized_settings);
            
            if ($result) {
                add_action('admin_notices', function() {
                    echo '<div class="notice notice-success is-dismissible"><p>' . 
                         __('Calendar settings saved successfully!', 'fitcopilot') . '</p></div>';
                });
            } else {
                add_action('admin_notices', function() {
                    echo '<div class="notice notice-error is-dismissible"><p>' . 
                         __('Error saving calendar settings. Please try again.', 'fitcopilot') . '</p></div>';
                });
            }
        }
    }
    
    /**
     * Handle bulk operations
     */
    private function handle_bulk_operations() {
        if (isset($_POST['bulk_action']) && isset($_POST['selected_events'])) {
            $bulk_action = sanitize_text_field($_POST['bulk_action']);
            $selected_events = array_map('absint', $_POST['selected_events']);
            
            $result = false;
            
            switch ($bulk_action) {
                case 'delete':
                    $result = $this->data_manager->bulk_delete_events($selected_events);
                    break;
                    
                case 'activate':
                    $result = $this->data_manager->bulk_update_status($selected_events, 'confirmed');
                    break;
                    
                case 'deactivate':
                    $result = $this->data_manager->bulk_update_status($selected_events, 'cancelled');
                    break;
            }
            
            if ($result) {
                add_action('admin_notices', function() use ($bulk_action) {
                    echo '<div class="notice notice-success is-dismissible"><p>' . 
                         sprintf(__('Bulk %s operation completed successfully!', 'fitcopilot'), $bulk_action) . '</p></div>';
                });
            }
        }
    }
    
    /**
     * Handle event import
     */
    private function handle_event_import() {
        if (isset($_FILES['import_file'])) {
            $result = $this->data_manager->import_events($_FILES['import_file']);
            
            if ($result['success']) {
                add_action('admin_notices', function() use ($result) {
                    echo '<div class="notice notice-success is-dismissible"><p>' . 
                         sprintf(__('Successfully imported %d events!', 'fitcopilot'), $result['imported_count']) . '</p></div>';
                });
            } else {
                add_action('admin_notices', function() use ($result) {
                    echo '<div class="notice notice-error is-dismissible"><p>' . 
                         sprintf(__('Import failed: %s', 'fitcopilot'), $result['error']) . '</p></div>';
                });
            }
        }
    }
    
    /**
     * Handle reset to defaults
     */
    private function handle_reset_defaults() {
        $result = $this->data_manager->reset_to_defaults();
        
        if ($result) {
            add_action('admin_notices', function() {
                echo '<div class="notice notice-success is-dismissible"><p>' . 
                     __('Calendar reset to defaults successfully!', 'fitcopilot') . '</p></div>';
            });
        }
    }
    
    /**
     * Get feature statistics for dashboard
     */
    public function get_feature_statistics() {
        return $this->data_manager->get_statistics();
    }
    
    /**
     * Check if feature is properly configured
     */
    public function is_feature_configured() {
        $events_count = $this->data_manager->get_events_count();
        $settings = $this->data_manager->get_settings();
        
        return ($events_count > 0 || !empty($settings['default_view']));
    }
    
    // ===== ABSTRACT METHOD IMPLEMENTATIONS FROM PARENT CLASSES =====
    
    /**
     * Get current data
     * Required by FitCopilot_Admin_Manager_Base
     */
    protected function get_current_data() {
        return $this->data_manager->get_settings();
    }
    
    /**
     * Get current settings
     * Required by FitCopilot_Admin_Manager_Base
     */
    protected function get_current_settings() {
        return $this->data_manager->get_settings();
    }
    
    /**
     * Render tab content
     * Required by FitCopilot_Admin_Manager_Base
     */
    protected function render_tab_content($active_tab, $data, $settings) {
        // Calendar uses a different rendering approach with custom page layout
        $this->renderer->render_page();
    }
    
    /**
     * Get additional tabs for complex manager
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_additional_tabs() {
        return array(
            'calendar-overview' => array('label' => 'Calendar Overview'),
            'calendar-settings' => array('label' => 'Settings')
        );
    }
    
    /**
     * Get item name plural for status messages
     * Required by FitCopilot_Complex_Manager
     */
    protected function get_item_name_plural() {
        return 'calendar events';
    }
    
    /**
     * Register settings with WordPress
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
    
    /**
     * Get the data provider instance
     * Used for accessing calendar data in test environments and frontend
     * 
     * @return FitCopilot_Training_Calendar_Provider
     */
    public function get_provider() {
        return $this->data_provider;
    }
    
    /**
     * Get the data manager instance
     * Used for direct data access when needed
     * 
     * @return FitCopilot_Training_Calendar_Data
     */
    public function get_data_manager() {
        return $this->data_manager;
    }
} 