<?php
/**
 * FitCopilot User Management Initialization
 *
 * Main initialization class for user management system
 * Coordinates user fields, roles, and WordPress integration
 *
 * @package FitCopilot
 * @subpackage UserManagement
 * @since 1.0.0
 */

defined('ABSPATH') || exit;

// Include required classes
require_once __DIR__ . '/class-user-fields.php';
require_once __DIR__ . '/class-user-role-manager.php';

/**
 * FitCopilot User Management Initialization Class
 *
 * Coordinates all user management components
 */
class FitCopilot_User_Management_Init {

    /**
     * Single instance of the class
     *
     * @var FitCopilot_User_Management_Init
     */
    private static $instance = null;

    /**
     * User Fields Manager
     *
     * @var FitCopilot_User_Fields
     */
    private $user_fields;

    /**
     * User Role Manager
     *
     * @var FitCopilot_User_Role_Manager
     */
    private $role_manager;

    /**
     * Get instance
     *
     * @return FitCopilot_User_Management_Init
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->init_components();
        $this->init_hooks();
    }

    /**
     * Initialize components
     */
    private function init_components() {
        try {
            error_log('FitCopilot User Management: Initializing components');
            
            // SIMPLIFIED: Skip User Fields and Role Manager for now - focus on REST API
            // These will be initialized later in the init() method if needed
            
            // Defer REST API initialization until WordPress is fully loaded
            add_action('rest_api_init', array($this, 'init_rest_api'), 10);
            error_log('FitCopilot User Management: REST API hook registered successfully');
            
        } catch (Exception $e) {
            error_log('FitCopilot User Management Error: Failed to initialize components - ' . $e->getMessage());
        } catch (Error $e) {
            error_log('FitCopilot User Management Fatal Error: Failed to initialize components - ' . $e->getMessage());
        }
    }
    
    /**
     * Initialize REST API (called on rest_api_init hook)
     */
    public function init_rest_api() {
        error_log('FitCopilot User API: init_rest_api() method called');
        
        // Initialize REST API if it's not already done
        if (!defined('FITCOPILOT_USER_API_INITIALIZED')) {
            error_log('FitCopilot User API: Starting initialization process');
            
            // Include required API classes
            $user_api_file = __DIR__ . '/class-user-registration-api.php';
            $email_manager_file = __DIR__ . '/class-user-email-manager.php';
            
            error_log('FitCopilot User API: Including files...');
            error_log('FitCopilot User API: User API file exists: ' . (file_exists($user_api_file) ? 'Yes' : 'No'));
            error_log('FitCopilot User API: Email Manager file exists: ' . (file_exists($email_manager_file) ? 'Yes' : 'No'));
            
            require_once $user_api_file;
            require_once $email_manager_file;
            
            // Check if classes were loaded successfully
            $user_api_exists = class_exists('FitCopilot_User_Registration_API');
            $email_manager_exists = class_exists('FitCopilot_User_Email_Manager');
            
            error_log('FitCopilot User API Debug: FitCopilot_User_Registration_API exists: ' . ($user_api_exists ? 'Yes' : 'No'));
            error_log('FitCopilot User API Debug: FitCopilot_User_Email_Manager exists: ' . ($email_manager_exists ? 'Yes' : 'No'));
            
            if ($user_api_exists && $email_manager_exists) {
                error_log('FitCopilot User API: Initializing API classes...');
                
                // Initialize User Registration API
                $user_api = new FitCopilot_User_Registration_API();
                $user_api->init();
                error_log('FitCopilot User API: User Registration API initialized');
                
                // Initialize Email Manager
                $email_manager = new FitCopilot_User_Email_Manager();
                $email_manager->init();
                error_log('FitCopilot User API: Email Manager initialized');
                
                // Mark as initialized
                define('FITCOPILOT_USER_API_INITIALIZED', true);
                error_log('FitCopilot User API: Successfully initialized REST API endpoints.');
            } else {
                error_log('FitCopilot User API Error: Required classes not found after including files.');
            }
        } else {
            error_log('FitCopilot User API: Already initialized, skipping.');
        }
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        add_action('init', [$this, 'init']);
        add_action('wp_loaded', [$this, 'wp_loaded']);
        
        // Admin initialization
        add_action('admin_init', [$this, 'admin_init']);
        
        // User registration hooks
        add_action('user_register', [$this, 'handle_user_registration']);
        add_action('wp_login', [$this, 'handle_user_login'], 10, 2);
        add_action('wp_logout', [$this, 'handle_user_logout']);
        
        // Database schema updates
        add_action('init', [$this, 'check_database_updates']);
    }

    /**
     * Initialize after WordPress loads
     */
    public function init() {
        try {
            error_log('FitCopilot User Management: init() method called');
            
            // Initialize User Fields and Role Manager if not already done
            if (!$this->user_fields && class_exists('FitCopilot_User_Fields')) {
                $this->user_fields = new FitCopilot_User_Fields();
                error_log('FitCopilot User Management: User Fields initialized in init()');
            }
            
            if (!$this->role_manager && class_exists('FitCopilot_User_Role_Manager')) {
                $this->role_manager = new FitCopilot_User_Role_Manager();
                error_log('FitCopilot User Management: Role Manager initialized in init()');
            }
            
            // Initialize role manager first (creates roles)
            if ($this->role_manager) {
                $this->role_manager->init();
                error_log('FitCopilot User Management: Role Manager init() called');
            }
            
            // Then initialize user fields (requires roles to exist)
            if ($this->user_fields) {
                $this->user_fields->init();
                error_log('FitCopilot User Management: User Fields init() called');
            }
            
            // Set up user management capabilities
            $this->setup_capabilities();
            error_log('FitCopilot User Management: Capabilities setup completed');
            
        } catch (Exception $e) {
            error_log('FitCopilot User Management Error in init(): ' . $e->getMessage());
        }
    }

    /**
     * WordPress loaded hook
     */
    public function wp_loaded() {
        // Perform any actions that need WordPress to be fully loaded
        $this->check_user_migration();
    }

    /**
     * Admin initialization
     */
    public function admin_init() {
        // Add admin notices if needed
        $this->check_admin_notices();
        
        // Initialize admin-specific functionality
        $this->init_admin_features();
    }

    /**
     * Handle new user registration
     *
     * @param int $user_id User ID
     */
    public function handle_user_registration($user_id) {
        // Get the user data
        $user = get_userdata($user_id);
        if (!$user) {
            return;
        }

        // Check if this is a FitCopilot registration
        $registration_source = get_user_meta($user_id, 'fitcopilot_registration_source', true);
        
        if ($registration_source === 'training_calendar' || $registration_source === 'Training Calendar') {
            // Assign default FitCopilot client role
            $this->role_manager->assign_role($user_id, FitCopilot_User_Role_Manager::FITCOPILOT_CLIENT_ROLE);
            
            // Set default client type if not already set
            if (!get_user_meta($user_id, 'fitcopilot_client_type', true)) {
                update_user_meta($user_id, 'fitcopilot_client_type', 'new');
            }
            
            // Set default experience level if not already set
            if (!get_user_meta($user_id, 'fitcopilot_experience_level', true)) {
                update_user_meta($user_id, 'fitcopilot_experience_level', 'beginner');
            }
            
            // Set default contact method if not already set
            if (!get_user_meta($user_id, 'fitcopilot_preferred_contact', true)) {
                update_user_meta($user_id, 'fitcopilot_preferred_contact', 'email');
            }
            
            // Log the registration
            error_log("FitCopilot: New client registered - User ID: {$user_id}, Email: {$user->user_email}");
        }
    }

    /**
     * Handle user login
     *
     * @param string $user_login Username
     * @param WP_User $user User object
     */
    public function handle_user_login($user_login, $user) {
        // Update last login time for FitCopilot users
        if ($this->role_manager->get_user_fitcopilot_role($user)) {
            update_user_meta($user->ID, 'fitcopilot_last_login', current_time('mysql'));
        }
    }

    /**
     * Handle user logout
     */
    public function handle_user_logout() {
        // Perform any cleanup needed on logout
        $user_id = get_current_user_id();
        if ($user_id && $this->role_manager->get_user_fitcopilot_role($user_id)) {
            update_user_meta($user_id, 'fitcopilot_last_logout', current_time('mysql'));
        }
    }

    /**
     * Setup user management capabilities
     */
    private function setup_capabilities() {
        // Add FitCopilot capabilities to existing administrator role
        $admin_role = get_role('administrator');
        if ($admin_role) {
            $fitcopilot_caps = [
                'fitcopilot_manage_all_users' => true,
                'fitcopilot_view_all_bookings' => true,
                'fitcopilot_manage_system_settings' => true,
                'fitcopilot_export_all_data' => true,
                'fitcopilot_import_data' => true,
                'fitcopilot_view_system_logs' => true,
                'fitcopilot_manage_integrations' => true,
                'fitcopilot_access_admin_dashboard' => true
            ];
            
            foreach ($fitcopilot_caps as $cap => $granted) {
                $admin_role->add_cap($cap, $granted);
            }
        }
    }

    /**
     * Check for database updates
     */
    public function check_database_updates() {
        $db_version = get_option('fitcopilot_user_db_version', '1.0.0');
        $current_version = '1.0.0';
        
        if (version_compare($db_version, $current_version, '<')) {
            $this->perform_database_updates($db_version, $current_version);
            update_option('fitcopilot_user_db_version', $current_version);
        }
    }

    /**
     * Perform database updates
     *
     * @param string $from_version Current version
     * @param string $to_version Target version
     */
    private function perform_database_updates($from_version, $to_version) {
        // Add any database migration logic here
        error_log("FitCopilot: Database updated from {$from_version} to {$to_version}");
    }

    /**
     * Check for user migration needs
     */
    private function check_user_migration() {
        // Check if we need to migrate existing users to FitCopilot roles
        $migration_status = get_option('fitcopilot_user_migration_status', 'pending');
        
        if ($migration_status === 'pending') {
            $this->migrate_existing_users();
            update_option('fitcopilot_user_migration_status', 'completed');
        }
    }

    /**
     * Migrate existing users to FitCopilot system
     */
    private function migrate_existing_users() {
        // Find users who might be FitCopilot clients but don't have the role
        $args = [
            'meta_query' => [
                [
                    'key' => 'fitcopilot_registration_source',
                    'compare' => 'EXISTS'
                ]
            ],
            'fields' => 'ID'
        ];
        
        $users = get_users($args);
        $migrated_count = 0;
        
        foreach ($users as $user_id) {
            $user = get_userdata($user_id);
            if (!$user) {
                continue;
            }
            
            // Check if user doesn't already have a FitCopilot role
            if (!$this->role_manager->get_user_fitcopilot_role($user_id)) {
                // Assign client role
                $this->role_manager->assign_role($user_id, FitCopilot_User_Role_Manager::FITCOPILOT_CLIENT_ROLE);
                $migrated_count++;
            }
        }
        
        if ($migrated_count > 0) {
            error_log("FitCopilot: Migrated {$migrated_count} existing users to FitCopilot client role");
        }
    }

    /**
     * Check for admin notices
     */
    private function check_admin_notices() {
        // Add any admin notices if needed - Only show on user management pages, not Training Calendar
        if (!get_option('fitcopilot_roles_created') && 
            (isset($_GET['page']) && strpos($_GET['page'], 'user-management') !== false)) {
            add_action('admin_notices', [$this, 'roles_not_created_notice']);
        }
    }

    /**
     * Display notice if roles are not created
     */
    public function roles_not_created_notice() {
        // Only show this notice on user management or dashboard pages
        $current_screen = get_current_screen();
        if ($current_screen && (strpos($current_screen->id, 'user-management') !== false || 
                                strpos($current_screen->id, 'dashboard') !== false)) {
            echo '<div class="notice notice-warning">';
            echo '<p><strong>FitCopilot:</strong> User roles are not properly initialized. Please check your WordPress permissions.</p>';
            echo '</div>';
        }
    }

    /**
     * Initialize admin features
     */
    private function init_admin_features() {
        // Add any admin-specific features here
        // This could include admin dashboard widgets, user management pages, etc.
    }

    /**
     * Get user fields manager
     *
     * @return FitCopilot_User_Fields
     */
    public function get_user_fields() {
        return $this->user_fields;
    }

    /**
     * Get role manager
     *
     * @return FitCopilot_User_Role_Manager
     */
    public function get_role_manager() {
        return $this->role_manager;
    }

    /**
     * Get complete user data
     *
     * @param int $user_id User ID
     * @return array|false User data or false if not found
     */
    public function get_complete_user_data($user_id) {
        return $this->user_fields->get_complete_user_data($user_id);
    }

    /**
     * Check if user is FitCopilot client
     *
     * @param int|WP_User $user User ID or user object
     * @return bool
     */
    public function is_fitcopilot_client($user) {
        return $this->role_manager->is_client($user);
    }

    /**
     * Check if user is FitCopilot trainer
     *
     * @param int|WP_User $user User ID or user object
     * @return bool
     */
    public function is_fitcopilot_trainer($user) {
        return $this->role_manager->is_trainer($user);
    }

    /**
     * Get FitCopilot users
     *
     * @param string $role Optional role filter
     * @return array Users
     */
    public function get_fitcopilot_users($role = '') {
        return $this->role_manager->get_fitcopilot_users($role);
    }

    /**
     * Activate user management system
     */
    public static function activate() {
        // Force role creation on activation
        delete_option('fitcopilot_roles_created');
        delete_option('fitcopilot_user_migration_status');
        
        // Initialize the system
        $instance = self::get_instance();
        $instance->init();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Deactivate user management system
     */
    public static function deactivate() {
        // Clean up if needed
        // Note: We typically don't remove user data on deactivation
        // Only on uninstall
    }

    /**
     * Uninstall user management system
     */
    public static function uninstall() {
        // Remove all FitCopilot user meta
        global $wpdb;
        
        $wpdb->query("DELETE FROM {$wpdb->usermeta} WHERE meta_key LIKE 'fitcopilot_%'");
        
        // Remove FitCopilot roles
        $role_manager = new FitCopilot_User_Role_Manager();
        $role_manager->cleanup_roles();
        
        // Remove options
        delete_option('fitcopilot_roles_created');
        delete_option('fitcopilot_role_version');
        delete_option('fitcopilot_user_db_version');
        delete_option('fitcopilot_user_migration_status');
    }
}

// Initialize the user management system
FitCopilot_User_Management_Init::get_instance(); 