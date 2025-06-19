<?php
/**
 * FitCopilot User Fields Management
 *
 * Manages custom user meta fields for FitCopilot clients
 * Integrates with WordPress admin user profiles
 *
 * @package FitCopilot
 * @subpackage UserManagement
 * @since 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * FitCopilot User Fields Class
 *
 * Handles custom user meta fields and WordPress admin integration
 */
class FitCopilot_User_Fields {

    /**
     * Meta field prefix for namespacing
     */
    const META_PREFIX = 'fitcopilot_';

    /**
     * Available client types
     */
    const CLIENT_TYPES = [
        'new' => 'New Client',
        'returning' => 'Returning Client',
        'premium' => 'Premium Member',
        'trial' => 'Trial Member'
    ];

    /**
     * Available experience levels
     */
    const EXPERIENCE_LEVELS = [
        'beginner' => 'Beginner',
        'intermediate' => 'Intermediate',
        'advanced' => 'Advanced',
        'professional' => 'Professional Athlete'
    ];

    /**
     * Available contact methods
     */
    const CONTACT_METHODS = [
        'email' => 'Email',
        'phone' => 'Phone',
        'text' => 'Text Message',
        'app_notification' => 'App Notification'
    ];

    /**
     * Registration sources
     */
    const REGISTRATION_SOURCES = [
        'training_calendar' => 'Training Calendar',
        'contact_form' => 'Contact Form',
        'personal_training' => 'Personal Training Page',
        'referral' => 'Referral',
        'social_media' => 'Social Media',
        'search_engine' => 'Search Engine',
        'other' => 'Other'
    ];

    /**
     * Initialize the user fields system
     */
    public function init() {
        add_action('show_user_profile', [$this, 'show_extra_profile_fields']);
        add_action('edit_user_profile', [$this, 'show_extra_profile_fields']);
        add_action('personal_options_update', [$this, 'save_extra_profile_fields']);
        add_action('edit_user_profile_update', [$this, 'save_extra_profile_fields']);
        add_action('user_register', [$this, 'save_extra_profile_fields']);
        
        // Add custom columns to users table
        add_filter('manage_users_columns', [$this, 'add_user_columns']);
        add_filter('manage_users_custom_column', [$this, 'add_user_column_content'], 10, 3);
        add_filter('manage_users_sortable_columns', [$this, 'add_sortable_columns']);
        
        // Add user filters
        add_action('restrict_manage_users', [$this, 'add_user_filters']);
        add_filter('pre_get_users', [$this, 'filter_users_by_meta']);
        
        // Enqueue admin styles
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }

    /**
     * Display extra profile fields on user edit pages
     *
     * @param WP_User $user The user object
     */
    public function show_extra_profile_fields($user) {
        if (!current_user_can('edit_user', $user->ID)) {
            return;
        }

        $client_type = get_user_meta($user->ID, self::META_PREFIX . 'client_type', true) ?: 'new';
        $fitness_goals = get_user_meta($user->ID, self::META_PREFIX . 'fitness_goals', true);
        $experience_level = get_user_meta($user->ID, self::META_PREFIX . 'experience_level', true) ?: 'beginner';
        $preferred_contact = get_user_meta($user->ID, self::META_PREFIX . 'preferred_contact', true) ?: 'email';
        $registration_source = get_user_meta($user->ID, self::META_PREFIX . 'registration_source', true);
        $registration_date = get_user_meta($user->ID, self::META_PREFIX . 'registration_date', true);
        $privacy_accepted = get_user_meta($user->ID, self::META_PREFIX . 'privacy_policy_accepted', true);
        $marketing_consent = get_user_meta($user->ID, self::META_PREFIX . 'marketing_consent', true);
        $emergency_contact_name = get_user_meta($user->ID, self::META_PREFIX . 'emergency_contact_name', true);
        $emergency_contact_phone = get_user_meta($user->ID, self::META_PREFIX . 'emergency_contact_phone', true);
        $medical_conditions = get_user_meta($user->ID, self::META_PREFIX . 'medical_conditions', true);
        $dietary_restrictions = get_user_meta($user->ID, self::META_PREFIX . 'dietary_restrictions', true);
        $phone_number = get_user_meta($user->ID, self::META_PREFIX . 'phone_number', true);
        $date_of_birth = get_user_meta($user->ID, self::META_PREFIX . 'date_of_birth', true);
        ?>
        
        <div class="fitcopilot-user-fields">
            <h2><?php _e('FitCopilot Client Information', 'fitcopilot'); ?></h2>
            <table class="form-table" role="presentation">
                
                <!-- Client Classification Section -->
                <tr class="user-section-header">
                    <th colspan="2">
                        <h3><?php _e('Client Classification', 'fitcopilot'); ?></h3>
                    </th>
                </tr>
                
                <tr>
                    <th><label for="fitcopilot_client_type"><?php _e('Client Type', 'fitcopilot'); ?></label></th>
                    <td>
                        <select name="fitcopilot_client_type" id="fitcopilot_client_type" class="regular-text">
                            <?php foreach (self::CLIENT_TYPES as $value => $label): ?>
                                <option value="<?php echo esc_attr($value); ?>" <?php selected($client_type, $value); ?>>
                                    <?php echo esc_html($label); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description"><?php _e('Classification based on membership level and engagement.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <tr>
                    <th><label for="fitcopilot_experience_level"><?php _e('Experience Level', 'fitcopilot'); ?></label></th>
                    <td>
                        <select name="fitcopilot_experience_level" id="fitcopilot_experience_level" class="regular-text">
                            <?php foreach (self::EXPERIENCE_LEVELS as $value => $label): ?>
                                <option value="<?php echo esc_attr($value); ?>" <?php selected($experience_level, $value); ?>>
                                    <?php echo esc_html($label); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description"><?php _e('Client\'s self-reported fitness experience level.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <!-- Fitness Information Section -->
                <tr class="user-section-header">
                    <th colspan="2">
                        <h3><?php _e('Fitness Information', 'fitcopilot'); ?></h3>
                    </th>
                </tr>

                <tr>
                    <th><label for="fitcopilot_fitness_goals"><?php _e('Fitness Goals', 'fitcopilot'); ?></label></th>
                    <td>
                        <textarea name="fitcopilot_fitness_goals" id="fitcopilot_fitness_goals" 
                                  rows="4" cols="50" class="large-text"><?php echo esc_textarea($fitness_goals); ?></textarea>
                        <p class="description"><?php _e('Client\'s specific fitness goals and objectives.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <tr>
                    <th><label for="fitcopilot_medical_conditions"><?php _e('Medical Conditions', 'fitcopilot'); ?></label></th>
                    <td>
                        <textarea name="fitcopilot_medical_conditions" id="fitcopilot_medical_conditions" 
                                  rows="3" cols="50" class="large-text"><?php echo esc_textarea($medical_conditions); ?></textarea>
                        <p class="description"><?php _e('Any medical conditions or limitations to consider during training.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <tr>
                    <th><label for="fitcopilot_dietary_restrictions"><?php _e('Dietary Restrictions', 'fitcopilot'); ?></label></th>
                    <td>
                        <textarea name="fitcopilot_dietary_restrictions" id="fitcopilot_dietary_restrictions" 
                                  rows="3" cols="50" class="large-text"><?php echo esc_textarea($dietary_restrictions); ?></textarea>
                        <p class="description"><?php _e('Any dietary restrictions or preferences for nutrition guidance.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <!-- Contact Information Section -->
                <tr class="user-section-header">
                    <th colspan="2">
                        <h3><?php _e('Contact Information', 'fitcopilot'); ?></h3>
                    </th>
                </tr>

                <tr>
                    <th><label for="fitcopilot_phone_number"><?php _e('Phone Number', 'fitcopilot'); ?></label></th>
                    <td>
                        <input type="tel" name="fitcopilot_phone_number" id="fitcopilot_phone_number" 
                               value="<?php echo esc_attr($phone_number); ?>" class="regular-text" />
                        <p class="description"><?php _e('Primary phone number for contact and emergency purposes.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <tr>
                    <th><label for="fitcopilot_preferred_contact"><?php _e('Preferred Contact Method', 'fitcopilot'); ?></label></th>
                    <td>
                        <select name="fitcopilot_preferred_contact" id="fitcopilot_preferred_contact" class="regular-text">
                            <?php foreach (self::CONTACT_METHODS as $value => $label): ?>
                                <option value="<?php echo esc_attr($value); ?>" <?php selected($preferred_contact, $value); ?>>
                                    <?php echo esc_html($label); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description"><?php _e('How the client prefers to be contacted for appointments and updates.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <!-- Emergency Contact Section -->
                <tr class="user-section-header">
                    <th colspan="2">
                        <h3><?php _e('Emergency Contact', 'fitcopilot'); ?></h3>
                    </th>
                </tr>

                <tr>
                    <th><label for="fitcopilot_emergency_contact_name"><?php _e('Emergency Contact Name', 'fitcopilot'); ?></label></th>
                    <td>
                        <input type="text" name="fitcopilot_emergency_contact_name" id="fitcopilot_emergency_contact_name" 
                               value="<?php echo esc_attr($emergency_contact_name); ?>" class="regular-text" />
                        <p class="description"><?php _e('Full name of emergency contact person.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <tr>
                    <th><label for="fitcopilot_emergency_contact_phone"><?php _e('Emergency Contact Phone', 'fitcopilot'); ?></label></th>
                    <td>
                        <input type="tel" name="fitcopilot_emergency_contact_phone" id="fitcopilot_emergency_contact_phone" 
                               value="<?php echo esc_attr($emergency_contact_phone); ?>" class="regular-text" />
                        <p class="description"><?php _e('Phone number for emergency contact person.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <!-- Personal Information Section -->
                <tr class="user-section-header">
                    <th colspan="2">
                        <h3><?php _e('Personal Information', 'fitcopilot'); ?></h3>
                    </th>
                </tr>

                <tr>
                    <th><label for="fitcopilot_date_of_birth"><?php _e('Date of Birth', 'fitcopilot'); ?></label></th>
                    <td>
                        <input type="date" name="fitcopilot_date_of_birth" id="fitcopilot_date_of_birth" 
                               value="<?php echo esc_attr($date_of_birth); ?>" class="regular-text" />
                        <p class="description"><?php _e('Used for age-appropriate training recommendations and emergency purposes.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <!-- Registration Tracking Section -->
                <tr class="user-section-header">
                    <th colspan="2">
                        <h3><?php _e('Registration Information', 'fitcopilot'); ?></h3>
                    </th>
                </tr>

                <tr>
                    <th><label for="fitcopilot_registration_source"><?php _e('Registration Source', 'fitcopilot'); ?></label></th>
                    <td>
                        <select name="fitcopilot_registration_source" id="fitcopilot_registration_source" class="regular-text">
                            <option value=""><?php _e('-- Select Source --', 'fitcopilot'); ?></option>
                            <?php foreach (self::REGISTRATION_SOURCES as $value => $label): ?>
                                <option value="<?php echo esc_attr($value); ?>" <?php selected($registration_source, $value); ?>>
                                    <?php echo esc_html($label); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description"><?php _e('How the client discovered and registered for FitCopilot services.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

                <?php if ($registration_date): ?>
                <tr>
                    <th><?php _e('Registration Date', 'fitcopilot'); ?></th>
                    <td>
                        <strong><?php echo esc_html(date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($registration_date))); ?></strong>
                        <p class="description"><?php _e('When the client initially registered.', 'fitcopilot'); ?></p>
                    </td>
                </tr>
                <?php endif; ?>

                <!-- Privacy & Consent Section -->
                <tr class="user-section-header">
                    <th colspan="2">
                        <h3><?php _e('Privacy & Consent', 'fitcopilot'); ?></h3>
                    </th>
                </tr>

                <?php if ($privacy_accepted): ?>
                <tr>
                    <th><?php _e('Privacy Policy', 'fitcopilot'); ?></th>
                    <td>
                        <span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span> 
                        <strong><?php _e('Accepted', 'fitcopilot'); ?></strong>
                        <em>(<?php echo esc_html(date_i18n(get_option('date_format'), strtotime($privacy_accepted))); ?>)</em>
                        <p class="description"><?php _e('Client has accepted the privacy policy.', 'fitcopilot'); ?></p>
                    </td>
                </tr>
                <?php endif; ?>

                <tr>
                    <th><label for="fitcopilot_marketing_consent"><?php _e('Marketing Communications', 'fitcopilot'); ?></label></th>
                    <td>
                        <label for="fitcopilot_marketing_consent">
                            <input type="checkbox" name="fitcopilot_marketing_consent" id="fitcopilot_marketing_consent" 
                                   value="1" <?php checked($marketing_consent, '1'); ?> />
                            <?php _e('Client consents to receive marketing communications', 'fitcopilot'); ?>
                        </label>
                        <p class="description"><?php _e('Whether the client has opted in to receive marketing emails and promotions.', 'fitcopilot'); ?></p>
                    </td>
                </tr>

            </table>
        </div>

        <style>
        .fitcopilot-user-fields .user-section-header th {
            background: #f9f9f9;
            border-left: 4px solid #0073aa;
            padding: 15px 20px 5px;
        }
        .fitcopilot-user-fields .user-section-header h3 {
            margin: 0;
            color: #0073aa;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .fitcopilot-user-fields .form-table th {
            width: 200px;
            vertical-align: top;
            padding-top: 15px;
        }
        .fitcopilot-user-fields .large-text {
            width: 100%;
            max-width: 500px;
        }
        .fitcopilot-user-fields .description {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        </style>
        <?php
    }

    /**
     * Save extra profile fields
     *
     * @param int $user_id User ID
     */
    public function save_extra_profile_fields($user_id) {
        if (!current_user_can('edit_user', $user_id)) {
            return false;
        }

        $fields = [
            'fitcopilot_client_type' => 'sanitize_text_field',
            'fitcopilot_fitness_goals' => 'sanitize_textarea_field',
            'fitcopilot_experience_level' => 'sanitize_text_field',
            'fitcopilot_preferred_contact' => 'sanitize_text_field',
            'fitcopilot_registration_source' => 'sanitize_text_field',
            'fitcopilot_medical_conditions' => 'sanitize_textarea_field',
            'fitcopilot_dietary_restrictions' => 'sanitize_textarea_field',
            'fitcopilot_phone_number' => 'sanitize_text_field',
            'fitcopilot_date_of_birth' => 'sanitize_text_field',
            'fitcopilot_emergency_contact_name' => 'sanitize_text_field',
            'fitcopilot_emergency_contact_phone' => 'sanitize_text_field',
            'fitcopilot_marketing_consent' => 'absint'
        ];

        foreach ($fields as $field => $sanitize_callback) {
            if (isset($_POST[$field])) {
                $value = call_user_func($sanitize_callback, $_POST[$field]);
                update_user_meta($user_id, $field, $value);
            } elseif ($field === 'fitcopilot_marketing_consent') {
                // Checkbox fields need special handling
                update_user_meta($user_id, $field, '0');
            }
        }

        // Set registration date if not already set
        if (!get_user_meta($user_id, 'fitcopilot_registration_date', true)) {
            update_user_meta($user_id, 'fitcopilot_registration_date', current_time('mysql'));
        }
    }

    /**
     * Add custom columns to users table
     *
     * @param array $columns Existing columns
     * @return array Modified columns
     */
    public function add_user_columns($columns) {
        $columns['fitcopilot_client_type'] = __('Client Type', 'fitcopilot');
        $columns['fitcopilot_experience'] = __('Experience', 'fitcopilot');
        $columns['fitcopilot_source'] = __('Source', 'fitcopilot');
        return $columns;
    }

    /**
     * Add content to custom user columns
     *
     * @param string $value Column value
     * @param string $column_name Column name
     * @param int $user_id User ID
     * @return string Column content
     */
    public function add_user_column_content($value, $column_name, $user_id) {
        switch ($column_name) {
            case 'fitcopilot_client_type':
                $client_type = get_user_meta($user_id, 'fitcopilot_client_type', true);
                if ($client_type && isset(self::CLIENT_TYPES[$client_type])) {
                    $value = '<span class="fitcopilot-client-type client-type-' . esc_attr($client_type) . '">' . 
                            esc_html(self::CLIENT_TYPES[$client_type]) . '</span>';
                }
                break;
                
            case 'fitcopilot_experience':
                $experience = get_user_meta($user_id, 'fitcopilot_experience_level', true);
                if ($experience && isset(self::EXPERIENCE_LEVELS[$experience])) {
                    $value = esc_html(self::EXPERIENCE_LEVELS[$experience]);
                }
                break;
                
            case 'fitcopilot_source':
                $source = get_user_meta($user_id, 'fitcopilot_registration_source', true);
                if ($source && isset(self::REGISTRATION_SOURCES[$source])) {
                    $value = esc_html(self::REGISTRATION_SOURCES[$source]);
                }
                break;
        }
        return $value;
    }

    /**
     * Make custom columns sortable
     *
     * @param array $columns Sortable columns
     * @return array Modified columns
     */
    public function add_sortable_columns($columns) {
        $columns['fitcopilot_client_type'] = 'fitcopilot_client_type';
        $columns['fitcopilot_experience'] = 'fitcopilot_experience_level';
        $columns['fitcopilot_source'] = 'fitcopilot_registration_source';
        return $columns;
    }

    /**
     * Add user filters to admin
     */
    public function add_user_filters() {
        // Client Type Filter
        $client_type = isset($_GET['fitcopilot_client_type']) ? $_GET['fitcopilot_client_type'] : '';
        echo '<select name="fitcopilot_client_type">';
        echo '<option value="">' . __('All Client Types', 'fitcopilot') . '</option>';
        foreach (self::CLIENT_TYPES as $value => $label) {
            echo '<option value="' . esc_attr($value) . '" ' . selected($client_type, $value, false) . '>' . 
                 esc_html($label) . '</option>';
        }
        echo '</select>';

        // Experience Level Filter
        $experience = isset($_GET['fitcopilot_experience']) ? $_GET['fitcopilot_experience'] : '';
        echo '<select name="fitcopilot_experience">';
        echo '<option value="">' . __('All Experience Levels', 'fitcopilot') . '</option>';
        foreach (self::EXPERIENCE_LEVELS as $value => $label) {
            echo '<option value="' . esc_attr($value) . '" ' . selected($experience, $value, false) . '>' . 
                 esc_html($label) . '</option>';
        }
        echo '</select>';
    }

    /**
     * Filter users by meta fields
     *
     * @param WP_User_Query $query User query
     */
    public function filter_users_by_meta($query) {
        global $pagenow;
        
        if ($pagenow !== 'users.php') {
            return;
        }

        $meta_query = [];

        if (!empty($_GET['fitcopilot_client_type'])) {
            $meta_query[] = [
                'key' => 'fitcopilot_client_type',
                'value' => sanitize_text_field($_GET['fitcopilot_client_type']),
                'compare' => '='
            ];
        }

        if (!empty($_GET['fitcopilot_experience'])) {
            $meta_query[] = [
                'key' => 'fitcopilot_experience_level',
                'value' => sanitize_text_field($_GET['fitcopilot_experience']),
                'compare' => '='
            ];
        }

        if (!empty($meta_query)) {
            $query->set('meta_query', $meta_query);
        }
    }

    /**
     * Enqueue admin assets
     *
     * @param string $hook Current admin page hook
     */
    public function enqueue_admin_assets($hook) {
        if ($hook === 'profile.php' || $hook === 'user-edit.php' || $hook === 'users.php') {
            wp_add_inline_style('wp-admin', '
                .fitcopilot-client-type {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 3px;
                    font-size: 11px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .client-type-new { background: #e1f5fe; color: #0277bd; }
                .client-type-returning { background: #f3e5f5; color: #7b1fa2; }
                .client-type-premium { background: #fff3e0; color: #ef6c00; }
                .client-type-trial { background: #e8f5e8; color: #2e7d32; }
            ');
        }
    }

    /**
     * Get user meta field value with fallback
     *
     * @param int $user_id User ID
     * @param string $field Field key (without prefix)
     * @param mixed $default Default value
     * @return mixed Field value
     */
    public function get_user_field($user_id, $field, $default = '') {
        return get_user_meta($user_id, self::META_PREFIX . $field, true) ?: $default;
    }

    /**
     * Update user meta field
     *
     * @param int $user_id User ID
     * @param string $field Field key (without prefix)
     * @param mixed $value Field value
     * @return bool Success
     */
    public function update_user_field($user_id, $field, $value) {
        return update_user_meta($user_id, self::META_PREFIX . $field, $value);
    }

    /**
     * Get all FitCopilot user data
     *
     * @param int $user_id User ID
     * @return array User data
     */
    public function get_complete_user_data($user_id) {
        $user = get_userdata($user_id);
        if (!$user) {
            return false;
        }

        return [
            'id' => $user_id,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'displayName' => $user->display_name,
            'roles' => $user->roles,
            'clientType' => $this->get_user_field($user_id, 'client_type', 'new'),
            'fitnessGoals' => $this->get_user_field($user_id, 'fitness_goals'),
            'experienceLevel' => $this->get_user_field($user_id, 'experience_level', 'beginner'),
            'preferredContactMethod' => $this->get_user_field($user_id, 'preferred_contact', 'email'),
            'registrationSource' => $this->get_user_field($user_id, 'registration_source'),
            'registrationDate' => $this->get_user_field($user_id, 'registration_date'),
            'phoneNumber' => $this->get_user_field($user_id, 'phone_number'),
            'dateOfBirth' => $this->get_user_field($user_id, 'date_of_birth'),
            'emergencyContact' => [
                'name' => $this->get_user_field($user_id, 'emergency_contact_name'),
                'phone' => $this->get_user_field($user_id, 'emergency_contact_phone')
            ],
            'medicalConditions' => $this->get_user_field($user_id, 'medical_conditions'),
            'dietaryRestrictions' => $this->get_user_field($user_id, 'dietary_restrictions'),
            'privacyPolicyAccepted' => $this->get_user_field($user_id, 'privacy_policy_accepted'),
            'marketingConsent' => $this->get_user_field($user_id, 'marketing_consent', '0') === '1'
        ];
    }
} 