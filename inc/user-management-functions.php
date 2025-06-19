<?php
/**
 * FitCopilot User Management Utility Functions
 *
 * Global utility functions for user management throughout the FitCopilot system
 *
 * @package FitCopilot
 * @subpackage UserManagement
 * @since 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Get FitCopilot user management instance
 *
 * @return FitCopilot_User_Management_Init
 */
function fitcopilot_user_management() {
    return FitCopilot_User_Management_Init::get_instance();
}

/**
 * Check if user is a FitCopilot client
 *
 * @param int|WP_User|null $user User ID, user object, or null for current user
 * @return bool
 */
function fitcopilot_is_client($user = null) {
    if ($user === null) {
        $user = get_current_user_id();
    }
    
    return fitcopilot_user_management()->is_fitcopilot_client($user);
}

/**
 * Check if user is a FitCopilot trainer
 *
 * @param int|WP_User|null $user User ID, user object, or null for current user
 * @return bool
 */
function fitcopilot_is_trainer($user = null) {
    if ($user === null) {
        $user = get_current_user_id();
    }
    
    return fitcopilot_user_management()->is_fitcopilot_trainer($user);
}

/**
 * Get complete FitCopilot user data
 *
 * @param int|null $user_id User ID or null for current user
 * @return array|false User data or false if not found
 */
function fitcopilot_get_user_data($user_id = null) {
    if ($user_id === null) {
        $user_id = get_current_user_id();
    }
    
    return fitcopilot_user_management()->get_complete_user_data($user_id);
}

/**
 * Get user's FitCopilot role
 *
 * @param int|WP_User|null $user User ID, user object, or null for current user
 * @return string|false FitCopilot role or false if none
 */
function fitcopilot_get_user_role($user = null) {
    if ($user === null) {
        $user = get_current_user_id();
    }
    
    return fitcopilot_user_management()->get_role_manager()->get_user_fitcopilot_role($user);
}

/**
 * Get user field value
 *
 * @param string $field Field name (without fitcopilot_ prefix)
 * @param int|null $user_id User ID or null for current user
 * @param mixed $default Default value if field doesn't exist
 * @return mixed Field value
 */
function fitcopilot_get_user_field($field, $user_id = null, $default = '') {
    if ($user_id === null) {
        $user_id = get_current_user_id();
    }
    
    return fitcopilot_user_management()->get_user_fields()->get_user_field($user_id, $field, $default);
}

/**
 * Update user field value
 *
 * @param string $field Field name (without fitcopilot_ prefix)
 * @param mixed $value Field value
 * @param int|null $user_id User ID or null for current user
 * @return bool Success
 */
function fitcopilot_update_user_field($field, $value, $user_id = null) {
    if ($user_id === null) {
        $user_id = get_current_user_id();
    }
    
    return fitcopilot_user_management()->get_user_fields()->update_user_field($user_id, $field, $value);
}

/**
 * Get all FitCopilot users
 *
 * @param string $role Optional role filter
 * @return array Users
 */
function fitcopilot_get_users($role = '') {
    return fitcopilot_user_management()->get_fitcopilot_users($role);
}

/**
 * Get all FitCopilot clients
 *
 * @return array Client users
 */
function fitcopilot_get_clients() {
    return fitcopilot_get_users(FitCopilot_User_Role_Manager::FITCOPILOT_CLIENT_ROLE);
}

/**
 * Get all FitCopilot trainers
 *
 * @return array Trainer users
 */
function fitcopilot_get_trainers() {
    return fitcopilot_get_users(FitCopilot_User_Role_Manager::FITCOPILOT_TRAINER_ROLE);
}

/**
 * Check if user has specific FitCopilot capability
 *
 * @param string $capability Capability to check
 * @param int|WP_User|null $user User ID, user object, or null for current user
 * @return bool
 */
function fitcopilot_user_can($capability, $user = null) {
    if ($user === null) {
        $user = get_current_user_id();
    }
    
    return fitcopilot_user_management()->get_role_manager()->user_can($user, $capability);
}

/**
 * Create a new FitCopilot client user
 *
 * @param array $user_data User data including WordPress fields and FitCopilot meta
 * @return int|WP_Error User ID on success, WP_Error on failure
 */
function fitcopilot_create_client($user_data) {
    // Required fields
    $required_fields = ['user_email', 'first_name'];
    foreach ($required_fields as $field) {
        if (empty($user_data[$field])) {
            return new WP_Error('missing_field', "Missing required field: {$field}");
        }
    }
    
    // Check if email already exists
    if (email_exists($user_data['user_email'])) {
        return new WP_Error('email_exists', 'Email already exists');
    }
    
    // Generate username if not provided
    if (empty($user_data['user_login'])) {
        $user_data['user_login'] = fitcopilot_generate_username($user_data['user_email']);
    }
    
    // Generate password if not provided
    if (empty($user_data['user_pass'])) {
        $user_data['user_pass'] = wp_generate_password(12, true, true);
    }
    
    // Set default role
    $user_data['role'] = FitCopilot_User_Role_Manager::FITCOPILOT_CLIENT_ROLE;
    
    // Create the user
    $user_id = wp_insert_user($user_data);
    
    if (is_wp_error($user_id)) {
        return $user_id;
    }
    
    // Set FitCopilot meta fields
    $meta_fields = [
        'client_type' => $user_data['client_type'] ?? 'new',
        'fitness_goals' => $user_data['fitness_goals'] ?? '',
        'experience_level' => $user_data['experience_level'] ?? 'beginner',
        'preferred_contact' => $user_data['preferred_contact'] ?? 'email',
        'registration_source' => $user_data['registration_source'] ?? 'manual',
        'phone_number' => $user_data['phone_number'] ?? '',
        'date_of_birth' => $user_data['date_of_birth'] ?? '',
        'emergency_contact_name' => $user_data['emergency_contact_name'] ?? '',
        'emergency_contact_phone' => $user_data['emergency_contact_phone'] ?? '',
        'medical_conditions' => $user_data['medical_conditions'] ?? '',
        'dietary_restrictions' => $user_data['dietary_restrictions'] ?? '',
        'marketing_consent' => $user_data['marketing_consent'] ?? '0',
        'registration_date' => current_time('mysql'),
        'privacy_policy_accepted' => current_time('mysql')
    ];
    
    foreach ($meta_fields as $field => $value) {
        fitcopilot_update_user_field($field, $value, $user_id);
    }
    
    return $user_id;
}

/**
 * Generate unique username from email
 *
 * @param string $email Email address
 * @return string Unique username
 */
function fitcopilot_generate_username($email) {
    $base_username = sanitize_user(substr($email, 0, strpos($email, '@')));
    $username = $base_username;
    $counter = 1;
    
    while (username_exists($username)) {
        $username = $base_username . $counter;
        $counter++;
    }
    
    return $username;
}

/**
 * Get user's preferred contact method
 *
 * @param int|null $user_id User ID or null for current user
 * @return string Contact method
 */
function fitcopilot_get_user_contact_method($user_id = null) {
    return fitcopilot_get_user_field('preferred_contact', $user_id, 'email');
}

/**
 * Get user's client type
 *
 * @param int|null $user_id User ID or null for current user
 * @return string Client type
 */
function fitcopilot_get_user_client_type($user_id = null) {
    return fitcopilot_get_user_field('client_type', $user_id, 'new');
}

/**
 * Get user's experience level
 *
 * @param int|null $user_id User ID or null for current user
 * @return string Experience level
 */
function fitcopilot_get_user_experience_level($user_id = null) {
    return fitcopilot_get_user_field('experience_level', $user_id, 'beginner');
}

/**
 * Get user's fitness goals
 *
 * @param int|null $user_id User ID or null for current user
 * @return string Fitness goals
 */
function fitcopilot_get_user_fitness_goals($user_id = null) {
    return fitcopilot_get_user_field('fitness_goals', $user_id, '');
}

/**
 * Check if user has marketing consent
 *
 * @param int|null $user_id User ID or null for current user
 * @return bool Marketing consent status
 */
function fitcopilot_user_has_marketing_consent($user_id = null) {
    return fitcopilot_get_user_field('marketing_consent', $user_id, '0') === '1';
}

/**
 * Get user's registration source
 *
 * @param int|null $user_id User ID or null for current user
 * @return string Registration source
 */
function fitcopilot_get_user_registration_source($user_id = null) {
    return fitcopilot_get_user_field('registration_source', $user_id, '');
}

/**
 * Get user's emergency contact information
 *
 * @param int|null $user_id User ID or null for current user
 * @return array Emergency contact info
 */
function fitcopilot_get_user_emergency_contact($user_id = null) {
    return [
        'name' => fitcopilot_get_user_field('emergency_contact_name', $user_id, ''),
        'phone' => fitcopilot_get_user_field('emergency_contact_phone', $user_id, '')
    ];
}

/**
 * Check if current user can manage FitCopilot users
 *
 * @return bool
 */
function fitcopilot_current_user_can_manage_users() {
    return current_user_can('fitcopilot_manage_all_users') || current_user_can('manage_options');
}

/**
 * Check if current user can view client data
 *
 * @param int $client_id Client user ID
 * @return bool
 */
function fitcopilot_current_user_can_view_client($client_id) {
    $current_user_id = get_current_user_id();
    
    // User can view their own data
    if ($current_user_id === $client_id) {
        return true;
    }
    
    // Admins can view all client data
    if (fitcopilot_current_user_can_manage_users()) {
        return true;
    }
    
    // Trainers can view their assigned clients
    if (fitcopilot_is_trainer()) {
        // TODO: Implement trainer-client relationship check
        return fitcopilot_user_can('fitcopilot_view_client_bookings');
    }
    
    return false;
}

/**
 * Get user statistics for dashboard
 *
 * @return array User statistics
 */
function fitcopilot_get_user_statistics() {
    $stats = [
        'total_clients' => 0,
        'total_trainers' => 0,
        'new_clients_this_month' => 0,
        'active_clients' => 0,
        'clients_by_experience' => [
            'beginner' => 0,
            'intermediate' => 0,
            'advanced' => 0,
            'professional' => 0
        ],
        'clients_by_type' => [
            'new' => 0,
            'returning' => 0,
            'premium' => 0,
            'trial' => 0
        ]
    ];
    
    // Get all FitCopilot users
    $clients = fitcopilot_get_clients();
    $trainers = fitcopilot_get_trainers();
    
    $stats['total_clients'] = count($clients);
    $stats['total_trainers'] = count($trainers);
    
    // Analyze client data
    $current_month = date('Y-m');
    
    foreach ($clients as $client) {
        $user_data = fitcopilot_get_user_data($client->ID);
        
        // Count new clients this month
        if ($user_data && isset($user_data['registrationDate'])) {
            $registration_month = date('Y-m', strtotime($user_data['registrationDate']));
            if ($registration_month === $current_month) {
                $stats['new_clients_this_month']++;
            }
        }
        
        // Count by experience level
        $experience = fitcopilot_get_user_experience_level($client->ID);
        if (isset($stats['clients_by_experience'][$experience])) {
            $stats['clients_by_experience'][$experience]++;
        }
        
        // Count by client type
        $client_type = fitcopilot_get_user_client_type($client->ID);
        if (isset($stats['clients_by_type'][$client_type])) {
            $stats['clients_by_type'][$client_type]++;
        }
        
        // Count active clients (logged in within last 30 days)
        $last_login = get_user_meta($client->ID, 'fitcopilot_last_login', true);
        if ($last_login && (strtotime($last_login) > strtotime('-30 days'))) {
            $stats['active_clients']++;
        }
    }
    
    return $stats;
}

/**
 * Sanitize user registration data
 *
 * @param array $data Raw user data
 * @return array Sanitized user data
 */
function fitcopilot_sanitize_user_data($data) {
    $sanitized = [];
    
    // WordPress core fields
    if (isset($data['user_email'])) {
        $sanitized['user_email'] = sanitize_email($data['user_email']);
    }
    if (isset($data['first_name'])) {
        $sanitized['first_name'] = sanitize_text_field($data['first_name']);
    }
    if (isset($data['last_name'])) {
        $sanitized['last_name'] = sanitize_text_field($data['last_name']);
    }
    if (isset($data['user_login'])) {
        $sanitized['user_login'] = sanitize_user($data['user_login']);
    }
    
    // FitCopilot custom fields
    $text_fields = [
        'client_type', 'experience_level', 'preferred_contact', 
        'registration_source', 'phone_number', 'date_of_birth',
        'emergency_contact_name', 'emergency_contact_phone'
    ];
    
    foreach ($text_fields as $field) {
        if (isset($data[$field])) {
            $sanitized[$field] = sanitize_text_field($data[$field]);
        }
    }
    
    $textarea_fields = ['fitness_goals', 'medical_conditions', 'dietary_restrictions'];
    
    foreach ($textarea_fields as $field) {
        if (isset($data[$field])) {
            $sanitized[$field] = sanitize_textarea_field($data[$field]);
        }
    }
    
    // Boolean fields
    if (isset($data['marketing_consent'])) {
        $sanitized['marketing_consent'] = $data['marketing_consent'] ? '1' : '0';
    }
    
    return $sanitized;
}

/**
 * Format user data for API response
 *
 * @param array $user_data Raw user data
 * @return array Formatted user data
 */
function fitcopilot_format_user_data_for_api($user_data) {
    if (!$user_data) {
        return false;
    }
    
    return [
        'id' => $user_data['id'],
        'username' => $user_data['username'],
        'email' => $user_data['email'],
        'firstName' => $user_data['firstName'],
        'lastName' => $user_data['lastName'] ?? '',
        'displayName' => $user_data['displayName'],
        'roles' => $user_data['roles'],
        'clientType' => $user_data['clientType'],
        'experienceLevel' => $user_data['experienceLevel'],
        'preferredContactMethod' => $user_data['preferredContactMethod'],
        'registrationSource' => $user_data['registrationSource'],
        'registrationDate' => $user_data['registrationDate'],
        'marketingConsent' => $user_data['marketingConsent']
    ];
} 