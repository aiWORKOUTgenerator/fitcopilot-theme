<?php
/**
 * FitCopilot User Registration REST API
 *
 * Handles REST API endpoints for user registration, email validation, and account management
 * Integrates with Phase 2.1 WordPress User Fields system
 *
 * @package FitCopilot
 * @subpackage UserManagement
 * @since 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * User Registration API Class
 */
class FitCopilot_User_Registration_API {

    /**
     * User management instance
     *
     * @var FitCopilot_User_Management_Init
     */
    private $user_management;

    /**
     * Email manager instance
     *
     * @var FitCopilot_User_Email_Manager
     */
    private $email_manager;

    /**
     * Rate limiting configuration
     */
    const RATE_LIMIT_ATTEMPTS = 5;
    const RATE_LIMIT_WINDOW = 300; // 5 minutes

    /**
     * Initialize the API
     */
    public function init() {
        $this->user_management = FitCopilot_User_Management_Init::get_instance();
        $this->email_manager = new FitCopilot_User_Email_Manager();
        
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Check if email exists
        register_rest_route('fitcopilot/v1', '/users/check-email', array(
            'methods' => 'POST',
            'callback' => array($this, 'check_email_exists'),
            'permission_callback' => '__return_true', // Public endpoint
            'args' => array(
                'email' => array(
                    'required' => true,
                    'type' => 'string',
                    'format' => 'email',
                    'sanitize_callback' => 'sanitize_email',
                    'validate_callback' => array($this, 'validate_email')
                )
            )
        ));

        // Register new user
        register_rest_route('fitcopilot/v1', '/users/register', array(
            'methods' => 'POST',
            'callback' => array($this, 'register_user'),
            'permission_callback' => '__return_true', // Public endpoint for registration
            'args' => array(
                'email' => array(
                    'required' => true,
                    'type' => 'string',
                    'format' => 'email',
                    'sanitize_callback' => 'sanitize_email',
                    'validate_callback' => array($this, 'validate_email')
                ),
                'firstName' => array(
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => array($this, 'validate_first_name')
                ),
                'acceptsPrivacyPolicy' => array(
                    'required' => true,
                    'type' => 'boolean',
                    'validate_callback' => array($this, 'validate_privacy_acceptance')
                ),
                'eventData' => array(
                    'required' => false,
                    'type' => 'object',
                    'description' => 'Event data to associate with user registration'
                )
            )
        ));

        // Send welcome email
        register_rest_route('fitcopilot/v1', '/users/send-welcome-email', array(
            'methods' => 'POST',
            'callback' => array($this, 'send_welcome_email'),
            'permission_callback' => array($this, 'check_user_permissions'),
            'args' => array(
                'user_id' => array(
                    'required' => true,
                    'type' => 'integer',
                    'sanitize_callback' => 'absint'
                )
            )
        ));

        // Get user profile
        register_rest_route('fitcopilot/v1', '/users/profile', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_user_profile'),
            'permission_callback' => array($this, 'check_user_permissions')
        ));

        // Update user profile
        register_rest_route('fitcopilot/v1', '/users/profile', array(
            'methods' => 'POST',
            'callback' => array($this, 'update_user_profile'),
            'permission_callback' => array($this, 'check_user_permissions'),
            'args' => array(
                'firstName' => array(
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                'lastName' => array(
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                'phone' => array(
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                )
            )
        ));
    }

    /**
     * Check if email exists
     *
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response|WP_Error Response object
     */
    public function check_email_exists($request) {
        $email = $request->get_param('email');
        
        if (empty($email)) {
            return new WP_Error(
                'missing_email',
                'Email address is required',
                array('status' => 400)
            );
        }
        
        $user_exists = email_exists($email);
        
        return rest_ensure_response(array(
            'exists' => (bool) $user_exists,
            'user_id' => $user_exists ? $user_exists : null,
            'message' => $user_exists ? 'Email already registered' : 'Email available'
        ));
    }

    /**
     * Register new user
     *
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response|WP_Error Response object
     */
    public function register_user($request) {
        $email = $request->get_param('email');
        $first_name = $request->get_param('firstName');
        $accepts_privacy = $request->get_param('acceptsPrivacyPolicy');
        $event_data = $request->get_param('eventData');
        
        // Verify privacy policy acceptance
        if (!$accepts_privacy) {
            return new WP_Error(
                'privacy_not_accepted',
                'Privacy policy must be accepted to create an account',
                array('status' => 400)
            );
        }
        
        // Check if email already exists
        if (email_exists($email)) {
            return new WP_Error(
                'email_exists',
                'An account with this email already exists',
                array('status' => 409)
            );
        }
        
        try {
            // Generate username from email
            $username = $this->generate_username_from_email($email);
            
            // Generate secure password
            $password = wp_generate_password(12, true, true);
            
            // Create user
            $user_id = wp_create_user($username, $password, $email);
            
            if (is_wp_error($user_id)) {
                return new WP_Error(
                    'user_creation_failed',
                    'Failed to create user account: ' . $user_id->get_error_message(),
                    array('status' => 500)
                );
            }
            
            // Update user meta with additional information
            update_user_meta($user_id, 'first_name', $first_name);
            update_user_meta($user_id, 'fitcopilot_privacy_accepted', current_time('mysql'));
            update_user_meta($user_id, 'fitcopilot_registration_source', 'training_calendar');
            
            // Set user role to subscriber (or custom role if needed)
            $user = new WP_User($user_id);
            $user->set_role('subscriber');
            
            // Send welcome email
            $welcome_sent = $this->send_welcome_email_internal($user_id, $password);
            
            // Log the registration
            error_log("FitCopilot: New user registered - ID: {$user_id}, Email: {$email}");
            
            // If event data provided, associate it with the user
            $event_association = null;
            if ($event_data && is_array($event_data)) {
                $event_association = $this->associate_event_with_user($user_id, $event_data);
            }
            
            return rest_ensure_response(array(
                'success' => true,
                'user_id' => $user_id,
                'username' => $username,
                'email' => $email,
                'first_name' => $first_name,
                'welcome_email_sent' => $welcome_sent,
                'event_association' => $event_association,
                'message' => 'Account created successfully! Check your email for login details.'
            ));
            
        } catch (Exception $e) {
            error_log('User Registration Error: ' . $e->getMessage());
            
            return new WP_Error(
                'registration_error',
                'Failed to create account. Please try again.',
                array('status' => 500)
            );
        }
    }

    /**
     * Send welcome email
     *
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response|WP_Error Response object
     */
    public function send_welcome_email($request) {
        $user_id = $request->get_param('user_id');
        
        if (!$user_id) {
            return new WP_Error(
                'missing_user_id',
                'User ID is required',
                array('status' => 400)
            );
        }
        
        $user = get_user_by('id', $user_id);
        if (!$user) {
            return new WP_Error(
                'user_not_found',
                'User not found',
                array('status' => 404)
            );
        }
        
        $sent = $this->send_welcome_email_internal($user_id);
        
        return rest_ensure_response(array(
            'success' => $sent,
            'message' => $sent ? 'Welcome email sent successfully' : 'Failed to send welcome email'
        ));
    }

    /**
     * Get user profile
     *
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response|WP_Error Response object
     */
    public function get_user_profile($request) {
        $current_user = wp_get_current_user();
        
        if (!$current_user->ID) {
            return new WP_Error(
                'not_authenticated',
                'User must be logged in',
                array('status' => 401)
            );
        }
        
        $user_meta = get_user_meta($current_user->ID);
        
        return rest_ensure_response(array(
            'user_id' => $current_user->ID,
            'username' => $current_user->user_login,
            'email' => $current_user->user_email,
            'first_name' => $user_meta['first_name'][0] ?? '',
            'last_name' => $user_meta['last_name'][0] ?? '',
            'phone' => $user_meta['fitcopilot_phone'][0] ?? '',
            'registration_date' => $current_user->user_registered,
            'privacy_accepted' => $user_meta['fitcopilot_privacy_accepted'][0] ?? '',
            'upcoming_events' => $this->get_user_upcoming_events($current_user->ID)
        ));
    }

    /**
     * Update user profile
     *
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response|WP_Error Response object
     */
    public function update_user_profile($request) {
        $current_user = wp_get_current_user();
        
        if (!$current_user->ID) {
            return new WP_Error(
                'not_authenticated',
                'User must be logged in',
                array('status' => 401)
            );
        }
        
        $updated_fields = array();
        
        // Update first name
        if ($request->has_param('firstName')) {
            $first_name = $request->get_param('firstName');
            update_user_meta($current_user->ID, 'first_name', $first_name);
            $updated_fields[] = 'first_name';
        }
        
        // Update last name
        if ($request->has_param('lastName')) {
            $last_name = $request->get_param('lastName');
            update_user_meta($current_user->ID, 'last_name', $last_name);
            $updated_fields[] = 'last_name';
        }
        
        // Update phone
        if ($request->has_param('phone')) {
            $phone = $request->get_param('phone');
            update_user_meta($current_user->ID, 'fitcopilot_phone', $phone);
            $updated_fields[] = 'phone';
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'updated_fields' => $updated_fields,
            'message' => 'Profile updated successfully'
        ));
    }

    /**
     * Check user permissions for protected endpoints
     *
     * @param WP_REST_Request $request Request object
     * @return bool
     */
    public function check_user_permissions($request) {
        // Allow access if user is logged in
        if (is_user_logged_in()) {
            return true;
        }
        
        // Check for valid REST nonce
        $nonce = $request->get_header('X-WP-Nonce');
        if ($nonce && wp_verify_nonce($nonce, 'wp_rest')) {
            return true;
        }
        
        return false;
    }

    /**
     * Validation callbacks
     */
    public function validate_email($value, $request, $param) {
        if (!is_email($value)) {
            return new WP_Error(
                'invalid_email',
                'Please enter a valid email address'
            );
        }
        return true;
    }

    public function validate_first_name($value, $request, $param) {
        if (strlen(trim($value)) < 2) {
            return new WP_Error(
                'invalid_first_name',
                'First name must be at least 2 characters long'
            );
        }
        return true;
    }

    public function validate_privacy_acceptance($value, $request, $param) {
        if (!$value) {
            return new WP_Error(
                'privacy_required',
                'Privacy policy acceptance is required'
            );
        }
        return true;
    }

    /**
     * Helper Methods
     */

    /**
     * Generate unique username from email
     */
    private function generate_username_from_email($email) {
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
     * Send welcome email with login credentials
     */
    private function send_welcome_email_internal($user_id, $password = null) {
        $user = get_user_by('id', $user_id);
        if (!$user) {
            return false;
        }
        
        $site_name = get_bloginfo('name');
        $login_url = wp_login_url();
        
        $subject = sprintf('%s - Welcome to Your Fitness Journey!', $site_name);
        
        $message = sprintf("
Hi %s,

Welcome to %s! Your account has been created successfully.

Your login details:
Username: %s
Email: %s
%s

You can log in at: %s

Ready to start your fitness journey? Here's what you can do:
• Schedule your free consultation
• Browse our training programs
• Track your progress
• Connect with your personal trainer

If you have any questions, feel free to reach out to our support team.

Best regards,
The %s Team
        ",
            $user->first_name ?: $user->display_name,
            $site_name,
            $user->user_login,
            $user->user_email,
            $password ? "Password: {$password}" : "Use your chosen password to log in.",
            $login_url,
            $site_name
        );
        
        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . $site_name . ' <noreply@' . $_SERVER['HTTP_HOST'] . '>'
        );
        
        return wp_mail($user->user_email, $subject, $message, $headers);
    }

    /**
     * Associate event data with newly registered user
     */
    private function associate_event_with_user($user_id, $event_data) {
        try {
            // Add user context to event data
            $event_data['user_id'] = $user_id;
            $event_data['created_by'] = $user_id;
            $event_data['booking_status'] = 'pending'; // Set to pending for new registrations
            
            // Store event association in user meta for later processing
            $associations = get_user_meta($user_id, 'fitcopilot_pending_events', true) ?: array();
            $associations[] = array(
                'event_data' => $event_data,
                'created_at' => current_time('mysql'),
                'status' => 'pending_creation'
            );
            
            update_user_meta($user_id, 'fitcopilot_pending_events', $associations);
            
            return array(
                'status' => 'associated',
                'event_type' => $event_data['title'] ?? 'Unknown Event',
                'message' => 'Event will be created after registration confirmation'
            );
            
        } catch (Exception $e) {
            error_log('Event Association Error: ' . $e->getMessage());
            return array(
                'status' => 'failed',
                'message' => 'Event association failed'
            );
        }
    }

    /**
     * Get user's upcoming events
     */
    private function get_user_upcoming_events($user_id) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'fitcopilot_training_calendar';
        
        // Check if table exists
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
            return array();
        }
        
        $events = $wpdb->get_results($wpdb->prepare("
            SELECT * FROM {$table_name}
            WHERE user_id = %d
            AND start >= %s
            AND booking_status IN ('confirmed', 'pending')
            ORDER BY start ASC
            LIMIT 10
        ", $user_id, current_time('mysql')), ARRAY_A);
        
        return $events ?: array();
    }
} 