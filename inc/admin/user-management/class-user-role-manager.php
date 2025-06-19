<?php
/**
 * FitCopilot User Role Manager
 *
 * Manages custom user roles and capabilities for FitCopilot
 *
 * @package FitCopilot
 * @subpackage UserManagement
 * @since 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * FitCopilot User Role Manager Class
 *
 * Handles creation and management of custom user roles
 */
class FitCopilot_User_Role_Manager {

    /**
     * Custom role names
     */
    const FITCOPILOT_CLIENT_ROLE = 'fitcopilot_client';
    const FITCOPILOT_TRAINER_ROLE = 'fitcopilot_trainer';
    const FITCOPILOT_ADMIN_ROLE = 'fitcopilot_admin';

    /**
     * Initialize the role manager
     */
    public function init() {
        add_action('init', [$this, 'create_custom_roles']);
        add_action('admin_init', [$this, 'update_role_capabilities']);
        
        // Clean up roles on deactivation (if needed)
        register_deactivation_hook(__FILE__, [$this, 'cleanup_roles']);
    }

    /**
     * Create custom user roles
     */
    public function create_custom_roles() {
        // Only run once to avoid performance issues
        if (get_option('fitcopilot_roles_created')) {
            return;
        }

        $this->create_client_role();
        $this->create_trainer_role();
        $this->create_admin_role();

        // Mark roles as created
        update_option('fitcopilot_roles_created', true);
    }

    /**
     * Create FitCopilot Client role
     */
    private function create_client_role() {
        $capabilities = [
            // Reading capabilities
            'read' => true,
            
            // FitCopilot specific capabilities
            'fitcopilot_book_sessions' => true,
            'fitcopilot_view_calendar' => true,
            'fitcopilot_manage_profile' => true,
            'fitcopilot_view_booking_history' => true,
            'fitcopilot_cancel_bookings' => true,
            'fitcopilot_reschedule_bookings' => true,
            'fitcopilot_access_client_portal' => true,
            'fitcopilot_view_workout_plans' => true,
            'fitcopilot_track_progress' => true,
            'fitcopilot_message_trainers' => true,
            
            // Restricted capabilities (explicitly denied)
            'edit_posts' => false,
            'delete_posts' => false,
            'publish_posts' => false,
            'upload_files' => false,
            'edit_published_posts' => false,
            'edit_others_posts' => false,
            'delete_published_posts' => false,
            'delete_others_posts' => false,
            'edit_private_posts' => false,
            'delete_private_posts' => false,
            'edit_pages' => false,
            'delete_pages' => false,
            'edit_others_pages' => false,
            'delete_others_pages' => false,
            'edit_published_pages' => false,
            'delete_published_pages' => false,
            'manage_categories' => false,
            'manage_links' => false,
            'moderate_comments' => false,
            'manage_options' => false,
            'edit_themes' => false,
            'edit_plugins' => false,
            'edit_users' => false,
            'edit_files' => false,
            'manage_categories' => false,
            'import' => false,
            'unfiltered_html' => false
        ];

        add_role(
            self::FITCOPILOT_CLIENT_ROLE, 
            __('FitCopilot Client', 'fitcopilot'), 
            $capabilities
        );
    }

    /**
     * Create FitCopilot Trainer role
     */
    private function create_trainer_role() {
        $capabilities = [
            // Basic WordPress capabilities
            'read' => true,
            'upload_files' => true,
            'edit_posts' => true,
            'edit_published_posts' => true,
            'publish_posts' => true,
            'delete_posts' => true,
            'delete_published_posts' => true,
            
            // All client capabilities
            'fitcopilot_book_sessions' => true,
            'fitcopilot_view_calendar' => true,
            'fitcopilot_manage_profile' => true,
            'fitcopilot_view_booking_history' => true,
            'fitcopilot_cancel_bookings' => true,
            'fitcopilot_reschedule_bookings' => true,
            'fitcopilot_access_client_portal' => true,
            'fitcopilot_view_workout_plans' => true,
            'fitcopilot_track_progress' => true,
            'fitcopilot_message_trainers' => true,
            
            // Trainer-specific capabilities
            'fitcopilot_manage_availability' => true,
            'fitcopilot_view_client_bookings' => true,
            'fitcopilot_manage_client_sessions' => true,
            'fitcopilot_create_workout_plans' => true,
            'fitcopilot_edit_workout_plans' => true,
            'fitcopilot_view_client_progress' => true,
            'fitcopilot_message_clients' => true,
            'fitcopilot_access_trainer_dashboard' => true,
            'fitcopilot_manage_trainer_profile' => true,
            'fitcopilot_view_trainer_analytics' => true,
            'fitcopilot_export_client_data' => true,
            'fitcopilot_approve_bookings' => true,
            'fitcopilot_block_time_slots' => true
        ];

        add_role(
            self::FITCOPILOT_TRAINER_ROLE, 
            __('FitCopilot Trainer', 'fitcopilot'), 
            $capabilities
        );
    }

    /**
     * Create FitCopilot Admin role
     */
    private function create_admin_role() {
        // Get all administrator capabilities
        $admin_role = get_role('administrator');
        $admin_capabilities = $admin_role ? $admin_role->capabilities : [];

        // Add all FitCopilot capabilities
        $fitcopilot_capabilities = [
            // All client capabilities
            'fitcopilot_book_sessions' => true,
            'fitcopilot_view_calendar' => true,
            'fitcopilot_manage_profile' => true,
            'fitcopilot_view_booking_history' => true,
            'fitcopilot_cancel_bookings' => true,
            'fitcopilot_reschedule_bookings' => true,
            'fitcopilot_access_client_portal' => true,
            'fitcopilot_view_workout_plans' => true,
            'fitcopilot_track_progress' => true,
            'fitcopilot_message_trainers' => true,
            
            // All trainer capabilities
            'fitcopilot_manage_availability' => true,
            'fitcopilot_view_client_bookings' => true,
            'fitcopilot_manage_client_sessions' => true,
            'fitcopilot_create_workout_plans' => true,
            'fitcopilot_edit_workout_plans' => true,
            'fitcopilot_view_client_progress' => true,
            'fitcopilot_message_clients' => true,
            'fitcopilot_access_trainer_dashboard' => true,
            'fitcopilot_manage_trainer_profile' => true,
            'fitcopilot_view_trainer_analytics' => true,
            'fitcopilot_export_client_data' => true,
            'fitcopilot_approve_bookings' => true,
            'fitcopilot_block_time_slots' => true,
            
            // Admin-specific capabilities
            'fitcopilot_manage_all_bookings' => true,
            'fitcopilot_manage_all_trainers' => true,
            'fitcopilot_manage_all_clients' => true,
            'fitcopilot_view_all_analytics' => true,
            'fitcopilot_manage_system_settings' => true,
            'fitcopilot_export_all_data' => true,
            'fitcopilot_import_data' => true,
            'fitcopilot_manage_user_roles' => true,
            'fitcopilot_view_system_logs' => true,
            'fitcopilot_manage_integrations' => true,
            'fitcopilot_manage_notifications' => true,
            'fitcopilot_access_admin_dashboard' => true
        ];

        $capabilities = array_merge($admin_capabilities, $fitcopilot_capabilities);

        add_role(
            self::FITCOPILOT_ADMIN_ROLE, 
            __('FitCopilot Administrator', 'fitcopilot'), 
            $capabilities
        );
    }

    /**
     * Update role capabilities (for existing installations)
     */
    public function update_role_capabilities() {
        // Check if we need to update capabilities
        $version = get_option('fitcopilot_role_version', '1.0.0');
        $current_version = '1.1.0'; // Update this when capabilities change

        if (version_compare($version, $current_version, '<')) {
            $this->refresh_role_capabilities();
            update_option('fitcopilot_role_version', $current_version);
        }
    }

    /**
     * Refresh all role capabilities
     */
    private function refresh_role_capabilities() {
        // Remove existing roles
        remove_role(self::FITCOPILOT_CLIENT_ROLE);
        remove_role(self::FITCOPILOT_TRAINER_ROLE);
        remove_role(self::FITCOPILOT_ADMIN_ROLE);

        // Recreate with updated capabilities
        $this->create_client_role();
        $this->create_trainer_role();
        $this->create_admin_role();
    }

    /**
     * Check if user has specific FitCopilot capability
     *
     * @param int|WP_User $user User ID or user object
     * @param string $capability Capability to check
     * @return bool
     */
    public function user_can($user, $capability) {
        if (is_int($user)) {
            $user = get_userdata($user);
        }

        if (!$user || !($user instanceof WP_User)) {
            return false;
        }

        return $user->has_cap($capability);
    }

    /**
     * Get user's FitCopilot role
     *
     * @param int|WP_User $user User ID or user object
     * @return string|false FitCopilot role or false if none
     */
    public function get_user_fitcopilot_role($user) {
        if (is_int($user)) {
            $user = get_userdata($user);
        }

        if (!$user || !($user instanceof WP_User)) {
            return false;
        }

        $fitcopilot_roles = [
            self::FITCOPILOT_ADMIN_ROLE,
            self::FITCOPILOT_TRAINER_ROLE,
            self::FITCOPILOT_CLIENT_ROLE
        ];

        foreach ($fitcopilot_roles as $role) {
            if (in_array($role, $user->roles)) {
                return $role;
            }
        }

        return false;
    }

    /**
     * Assign FitCopilot role to user
     *
     * @param int $user_id User ID
     * @param string $role Role name
     * @return bool Success
     */
    public function assign_role($user_id, $role) {
        $user = get_userdata($user_id);
        if (!$user) {
            return false;
        }

        $valid_roles = [
            self::FITCOPILOT_CLIENT_ROLE,
            self::FITCOPILOT_TRAINER_ROLE,
            self::FITCOPILOT_ADMIN_ROLE
        ];

        if (!in_array($role, $valid_roles)) {
            return false;
        }

        // Remove any existing FitCopilot roles
        foreach ($valid_roles as $existing_role) {
            $user->remove_role($existing_role);
        }

        // Add the new role
        $user->add_role($role);

        return true;
    }

    /**
     * Get all users with FitCopilot roles
     *
     * @param string $role Specific role to filter by (optional)
     * @return array Users
     */
    public function get_fitcopilot_users($role = '') {
        $args = [
            'meta_query' => [
                'relation' => 'OR',
                [
                    'key' => 'wp_capabilities',
                    'value' => self::FITCOPILOT_CLIENT_ROLE,
                    'compare' => 'LIKE'
                ],
                [
                    'key' => 'wp_capabilities',
                    'value' => self::FITCOPILOT_TRAINER_ROLE,
                    'compare' => 'LIKE'
                ],
                [
                    'key' => 'wp_capabilities',
                    'value' => self::FITCOPILOT_ADMIN_ROLE,
                    'compare' => 'LIKE'
                ]
            ]
        ];

        if ($role) {
            $args = [
                'role' => $role
            ];
        }

        return get_users($args);
    }

    /**
     * Get role display name
     *
     * @param string $role Role name
     * @return string Display name
     */
    public function get_role_display_name($role) {
        $role_names = [
            self::FITCOPILOT_CLIENT_ROLE => __('FitCopilot Client', 'fitcopilot'),
            self::FITCOPILOT_TRAINER_ROLE => __('FitCopilot Trainer', 'fitcopilot'),
            self::FITCOPILOT_ADMIN_ROLE => __('FitCopilot Administrator', 'fitcopilot')
        ];

        return isset($role_names[$role]) ? $role_names[$role] : $role;
    }

    /**
     * Check if user is FitCopilot client
     *
     * @param int|WP_User $user User ID or user object
     * @return bool
     */
    public function is_client($user) {
        return $this->get_user_fitcopilot_role($user) === self::FITCOPILOT_CLIENT_ROLE;
    }

    /**
     * Check if user is FitCopilot trainer
     *
     * @param int|WP_User $user User ID or user object
     * @return bool
     */
    public function is_trainer($user) {
        return $this->get_user_fitcopilot_role($user) === self::FITCOPILOT_TRAINER_ROLE;
    }

    /**
     * Check if user is FitCopilot admin
     *
     * @param int|WP_User $user User ID or user object
     * @return bool
     */
    public function is_fitcopilot_admin($user) {
        return $this->get_user_fitcopilot_role($user) === self::FITCOPILOT_ADMIN_ROLE;
    }

    /**
     * Get capabilities for a specific role
     *
     * @param string $role Role name
     * @return array Capabilities
     */
    public function get_role_capabilities($role) {
        $wp_role = get_role($role);
        return $wp_role ? $wp_role->capabilities : [];
    }

    /**
     * Cleanup roles on deactivation
     */
    public function cleanup_roles() {
        // Only remove custom roles, not built-in ones
        remove_role(self::FITCOPILOT_CLIENT_ROLE);
        remove_role(self::FITCOPILOT_TRAINER_ROLE);
        remove_role(self::FITCOPILOT_ADMIN_ROLE);
        
        // Clean up options
        delete_option('fitcopilot_roles_created');
        delete_option('fitcopilot_role_version');
    }
} 