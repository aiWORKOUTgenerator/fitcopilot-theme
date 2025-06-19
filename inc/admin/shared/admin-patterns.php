<?php
/**
 * FitCopilot Admin Patterns Framework
 * Flexible base classes and patterns for all admin managers
 * 
 * @package FitCopilot
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Base Admin Manager Class
 * Provides consistent structure while allowing complexity scaling
 */
abstract class FitCopilot_Admin_Manager_Base {
    
    /**
     * Feature identification
     */
    protected $feature_name;
    protected $feature_slug;
    protected $complexity_level; // 'simple', 'medium', 'complex'
    
    /**
     * Admin page configuration
     */
    protected $page_title;
    protected $menu_title;
    protected $capability = 'manage_options';
    protected $menu_slug;
    protected $parent_slug = 'fitcopilot-dashboard';
    
    /**
     * Constructor
     */
    public function __construct($feature_name, $complexity_level = 'medium') {
        $this->feature_name = $feature_name;
        $this->feature_slug = sanitize_key($feature_name);
        $this->complexity_level = $complexity_level;
        $this->menu_slug = 'fitcopilot-' . $this->feature_slug;
        
        // Set default titles
        $this->page_title = ucfirst($feature_name) . ' Manager';
        $this->menu_title = ucfirst($feature_name);
        
        $this->init();
    }
    
    /**
     * Initialize the admin manager
     */
    protected function init() {
        add_action('admin_menu', array($this, 'register_admin_page'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_enqueue_scripts', array($this, 'provide_frontend_data'), 20);
    }
    
    /**
     * Register admin page - consistent across all managers
     */
    public function register_admin_page() {
        // Check if child class overrides menu configuration
        if (method_exists($this, 'get_menu_config')) {
            $menu_config = $this->get_menu_config();
            
            add_submenu_page(
                $this->parent_slug,
                $menu_config['page_title'] ?? $this->page_title,
                $menu_config['menu_title'] ?? $this->menu_title,
                $this->capability,
                $menu_config['menu_slug'] ?? $this->menu_slug,
                array($this, 'render_admin_page')
            );
        } else {
            add_submenu_page(
                $this->parent_slug,
                $this->page_title,
                $this->menu_title,
                $this->capability,
                $this->menu_slug,
                array($this, 'render_admin_page')
            );
        }
    }
    
    /**
     * Enqueue admin assets with complexity-aware loading
     */
    public function enqueue_admin_assets($hook) {
        if ('fitcopilot_page_' . $this->menu_slug !== $hook) {
            return;
        }
        
        // Always load base styles first
        wp_enqueue_style(
            'fitcopilot-admin-base',
            get_template_directory_uri() . '/assets/admin/css/shared/admin-base.css',
            array(),
            filemtime(get_template_directory() . '/assets/admin/css/shared/admin-base.css')
        );
        
        // Load feature-specific styles in order
        $this->enqueue_feature_styles();
        
        // Load WordPress media library for complex features
        if (in_array($this->complexity_level, ['medium', 'complex'])) {
            wp_enqueue_media();
        }
        
        // Load jQuery for all features
        wp_enqueue_script('jquery');
        
        // Load feature-specific scripts
        $this->enqueue_feature_scripts();
    }
    
    /**
     * Render admin page with consistent structure
     */
    public function render_admin_page() {
        // Check user capabilities
        if (!current_user_can($this->capability)) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        
        // Handle form submissions
        $this->handle_form_submissions();
        
        // Get current data
        $data = $this->get_current_data();
        $settings = $this->get_current_settings();
        
        // Get active tab
        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : $this->get_default_tab();
        
        // Render the page
        ?>
        <div class="wrap fitcopilot-<?php echo esc_attr($this->feature_slug); ?>-admin">
            <!-- Consistent animated background -->
            <div class="fitcopilot-admin-background">
                <div class="fitcopilot-particle"></div>
                <div class="fitcopilot-particle"></div>
                <div class="fitcopilot-particle"></div>
                <div class="fitcopilot-particle"></div>
            </div>
            
            <div class="fitcopilot-admin-container">
                <!-- Consistent header -->
                <div class="fitcopilot-admin-header">
                    <div class="fitcopilot-admin-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h1><?php echo esc_html($this->page_title); ?></h1>
                </div>
                
                <!-- Consistent tab navigation -->
                <?php $this->render_tab_navigation($active_tab); ?>
                
                <!-- Consistent status indicator -->
                <?php $this->render_status_indicator($data); ?>
                
                <!-- Feature-specific content -->
                <?php $this->render_tab_content($active_tab, $data, $settings); ?>
            </div>
        </div>
        <?php
    }
    
    /**
     * Render tab navigation
     */
    protected function render_tab_navigation($active_tab) {
        $tabs = $this->get_tab_config();
        
        if (empty($tabs)) {
            return;
        }
        
        ?>
        <div class="nav-tab-wrapper">
            <?php foreach ($tabs as $tab_id => $tab_config): ?>
                <a href="?page=<?php echo esc_attr($this->menu_slug); ?>&tab=<?php echo esc_attr($tab_id); ?>" 
                   class="nav-tab <?php echo $active_tab === $tab_id ? 'nav-tab-active' : ''; ?>">
                   <?php echo esc_html($tab_config['label']); ?>
                </a>
            <?php endforeach; ?>
        </div>
        <?php
    }
    
    /**
     * Render status indicator
     */
    protected function render_status_indicator($data) {
        $count = is_array($data) ? count($data) : 0;
        $active_count = $this->get_active_count($data);
        
        ?>
        <div class="fitcopilot-status-indicator">
            <strong>📊 Current Status:</strong> 
            <?php echo $count; ?> <?php echo $this->get_item_name_plural(); ?> loaded.
            <?php if ($active_count !== $count): ?>
                <?php echo $active_count; ?> active on frontend.
            <?php endif; ?>
        </div>
        <?php
    }
    
    /**
     * Get complexity-aware tab configuration
     */
    protected function get_tab_config() {
        $base_tabs = array(
            'main-content' => array('label' => 'Manage ' . ucfirst($this->feature_name)),
            'settings' => array('label' => 'Settings'),
            'export-import' => array('label' => 'Export / Import')
        );
        
        // Add complexity-specific tabs
        return array_merge($base_tabs, $this->get_additional_tabs());
    }
    
    /**
     * Get default tab
     */
    protected function get_default_tab() {
        return 'main-content';
    }
    
    /**
     * Get active count from data
     */
    protected function get_active_count($data) {
        if (!is_array($data)) {
            return 0;
        }
        
        return count(array_filter($data, function($item) {
            return !empty($item['active']);
        }));
    }
    
    // Abstract methods that each manager must implement
    abstract protected function enqueue_feature_styles();
    abstract protected function enqueue_feature_scripts();
    abstract protected function handle_form_submissions();
    abstract protected function get_current_data();
    abstract protected function get_current_settings();
    abstract protected function render_tab_content($active_tab, $data, $settings);
    abstract protected function get_additional_tabs();
    abstract protected function get_item_name_plural();
    abstract public function register_settings();
    abstract public function provide_frontend_data();
}

/**
 * Simple Feature Manager
 * For features like testimonials with basic requirements
 */
abstract class FitCopilot_Simple_Manager extends FitCopilot_Admin_Manager_Base {
    
    public function __construct($feature_name) {
        parent::__construct($feature_name, 'simple');
    }
    
    /**
     * Simple features use basic 3-file CSS pattern
     */
    protected function enqueue_feature_styles() {
        $css_files = array(
            $this->feature_slug . '-base',
            $this->feature_slug . '-grid', 
            $this->feature_slug . '-theme'
        );
        
        $dependencies = array('fitcopilot-admin-base');
        
        foreach ($css_files as $index => $file) {
            $file_path = get_template_directory() . '/assets/admin/css/' . $file . '.css';
            
            if (file_exists($file_path)) {
                wp_enqueue_style(
                    'fitcopilot-' . $file,
                    get_template_directory_uri() . '/assets/admin/css/' . $file . '.css',
                    $dependencies,
                    filemtime($file_path)
                );
                
                $dependencies[] = 'fitcopilot-' . $file;
            }
        }
    }
    
    /**
     * Simple features typically don't need complex JavaScript
     */
    protected function enqueue_feature_scripts() {
        // Override in child class if needed
    }
    
    /**
     * Simple features have minimal additional tabs
     */
    protected function get_additional_tabs() {
        return array();
    }
}

/**
 * Complex Feature Manager  
 * For features like personal training with rich requirements
 */
abstract class FitCopilot_Complex_Manager extends FitCopilot_Admin_Manager_Base {
    
    public function __construct($feature_name) {
        parent::__construct($feature_name, 'complex');
    }
    
    /**
     * Complex features may have additional CSS files
     */
    protected function enqueue_feature_styles() {
        $css_files = array(
            $this->feature_slug . '-base',
            $this->feature_slug . '-grid',
            $this->feature_slug . '-theme',
            $this->feature_slug . '-forms', // Additional for complex forms
            $this->feature_slug . '-media'  // Additional for media management
        );
        
        $dependencies = array('fitcopilot-admin-base');
        
        foreach ($css_files as $file) {
            $file_path = get_template_directory() . '/assets/admin/css/' . $file . '.css';
            
            if (file_exists($file_path)) {
                wp_enqueue_style(
                    'fitcopilot-' . $file,
                    get_template_directory_uri() . '/assets/admin/css/' . $file . '.css',
                    $dependencies,
                    filemtime($file_path)
                );
                
                $dependencies[] = 'fitcopilot-' . $file;
            }
        }
    }
    
    /**
     * Complex features often need JavaScript for interactions
     */
    protected function enqueue_feature_scripts() {
        $script_path = get_template_directory() . '/assets/admin/js/' . $this->feature_slug . '-admin.js';
        
        if (file_exists($script_path)) {
            wp_enqueue_script(
                'fitcopilot-' . $this->feature_slug . '-admin',
                get_template_directory_uri() . '/assets/admin/js/' . $this->feature_slug . '-admin.js',
                array('jquery'),
                filemtime($script_path),
                true
            );
            
            // Localize script for AJAX
            wp_localize_script(
                'fitcopilot-' . $this->feature_slug . '-admin',
                'fitcopilot' . ucfirst($this->feature_slug) . 'Ajax',
                array(
                    'ajax_url' => admin_url('admin-ajax.php'),
                    'nonce' => wp_create_nonce('fitcopilot_' . $this->feature_slug . '_action'),
                    'saving_text' => __('Saving...', 'fitcopilot'),
                    'saved_text' => __('✅ Saved!', 'fitcopilot'),
                    'error_text' => __('❌ Error saving', 'fitcopilot')
                )
            );
        }
    }
    
    /**
     * Complex features may have additional tabs for media, settings, etc.
     */
    protected function get_additional_tabs() {
        return array(
            'media-library' => array('label' => 'Media Library'),
            'advanced-settings' => array('label' => 'Advanced Settings')
        );
    }
}

/**
 * Data Sanitization Patterns
 */
class FitCopilot_Admin_Sanitizer {
    
    /**
     * Sanitize basic text fields
     */
    public static function sanitize_basic_item($item, $field_config) {
        $sanitized = array();
        
        foreach ($field_config as $field => $config) {
            $value = $item[$field] ?? $config['default'] ?? '';
            
            switch ($config['type']) {
                case 'text':
                    $sanitized[$field] = sanitize_text_field($value);
                    break;
                case 'textarea':
                    $sanitized[$field] = wp_kses_post($value);
                    break;
                case 'url':
                    $sanitized[$field] = esc_url_raw($value);
                    break;
                case 'number':
                    $sanitized[$field] = absint($value);
                    break;
                case 'boolean':
                    $sanitized[$field] = !empty($value);
                    break;
                case 'select':
                    $sanitized[$field] = in_array($value, $config['options']) ? $value : $config['default'];
                    break;
                default:
                    $sanitized[$field] = sanitize_text_field($value);
            }
        }
        
        return $sanitized;
    }
    
    /**
     * Sanitize array of items
     */
    public static function sanitize_items_array($items, $field_config) {
        $sanitized = array();
        
        if (is_array($items)) {
            foreach ($items as $index => $item) {
                $sanitized[$index] = self::sanitize_basic_item($item, $field_config);
            }
        }
        
        return $sanitized;
    }
}

/**
 * Frontend Data Provider Patterns
 */
class FitCopilot_Frontend_Provider {
    
    /**
     * Provide data to frontend with consistent structure
     */
    public static function localize_data($script_handle, $variable_name, $data, $settings = array()) {
        // Filter only active items
        $active_items = array_filter($data, function($item) {
            return !empty($item['active']);
        });
        
        // Prepare data for React components
        $frontend_data = array(
            'items' => array_values($active_items),
            'settings' => $settings,
            'meta' => array(
                'total_count' => count($data),
                'active_count' => count($active_items),
                'last_updated' => time()
            )
        );
        
        // Localize script data for React
        wp_localize_script($script_handle, $variable_name, $frontend_data);
        
        // Debug logging in development
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('FitCopilot Frontend Data Provider - ' . $variable_name . ': ' . json_encode(array(
                'total_items' => count($data),
                'active_items' => count($active_items),
                'script_handle' => $script_handle,
                'variable_name' => $variable_name
            )));
        }
    }
} 