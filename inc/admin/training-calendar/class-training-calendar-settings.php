<?php
/**
 * FitCopilot Training Calendar Settings Manager
 * 
 * Handles settings management for Training Calendar admin interface
 * Following the established Personal Training settings pattern
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Calendar Settings Manager Class
 * 
 * Manages calendar configuration settings and validation
 */
class FitCopilot_Training_Calendar_Settings {
    
    /**
     * Data manager instance
     */
    private $data_manager;
    
    /**
     * Constructor
     * 
     * @param FitCopilot_Training_Calendar_Data $data_manager Data manager instance
     */
    public function __construct($data_manager) {
        $this->data_manager = $data_manager;
    }
    
    /**
     * Initialize settings functionality
     */
    public function init() {
        // Hook into WordPress settings API
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    /**
     * Register WordPress settings
     * Following Personal Training pattern for settings registration
     */
    public function register_settings() {
        // Register the main settings option
        register_setting(
            'fitcopilot_training_calendar_settings_group',
            'fitcopilot_training_calendar_settings',
            array(
                'type' => 'array',
                'description' => 'Training Calendar settings',
                'sanitize_callback' => array($this, 'sanitize_settings'),
                'default' => $this->data_manager->get_default_settings()
            )
        );
        
        // Register individual settings sections
        $this->register_calendar_view_settings();
        $this->register_booking_settings();
        $this->register_notification_settings();
    }
    
    /**
     * Register calendar view settings
     */
    private function register_calendar_view_settings() {
        add_settings_section(
            'calendar_view_settings',
            __('Calendar Display Settings', 'fitcopilot'),
            array($this, 'render_calendar_view_section'),
            'fitcopilot_training_calendar_settings'
        );
        
        add_settings_field(
            'default_view',
            __('Default View', 'fitcopilot'),
            array($this, 'render_default_view_field'),
            'fitcopilot_training_calendar_settings',
            'calendar_view_settings'
        );
        
        add_settings_field(
            'first_day',
            __('First Day of Week', 'fitcopilot'),
            array($this, 'render_first_day_field'),
            'fitcopilot_training_calendar_settings',
            'calendar_view_settings'
        );
    }
    
    /**
     * Register booking settings
     */
    private function register_booking_settings() {
        add_settings_section(
            'booking_settings',
            __('Booking Configuration', 'fitcopilot'),
            array($this, 'render_booking_section'),
            'fitcopilot_training_calendar_settings'
        );
        
        add_settings_field(
            'booking_advance_days',
            __('Booking Advance Days', 'fitcopilot'),
            array($this, 'render_booking_advance_field'),
            'fitcopilot_training_calendar_settings',
            'booking_settings'
        );
        
        add_settings_field(
            'booking_notice_hours',
            __('Minimum Notice Hours', 'fitcopilot'),
            array($this, 'render_booking_notice_field'),
            'fitcopilot_training_calendar_settings',
            'booking_settings'
        );
    }
    
    /**
     * Register notification settings
     */
    private function register_notification_settings() {
        add_settings_section(
            'notification_settings',
            __('Email Notifications', 'fitcopilot'),
            array($this, 'render_notification_section'),
            'fitcopilot_training_calendar_settings'
        );
        
        add_settings_field(
            'email_notifications',
            __('Enable Email Notifications', 'fitcopilot'),
            array($this, 'render_email_notifications_field'),
            'fitcopilot_training_calendar_settings',
            'notification_settings'
        );
    }
    
    // ===== SECTION CALLBACKS =====
    
    /**
     * Render calendar view settings section
     */
    public function render_calendar_view_section() {
        echo '<p>' . __('Configure how the calendar is displayed to users.', 'fitcopilot') . '</p>';
    }
    
    /**
     * Render booking settings section
     */
    public function render_booking_section() {
        echo '<p>' . __('Configure booking rules and restrictions.', 'fitcopilot') . '</p>';
    }
    
    /**
     * Render notification settings section
     */
    public function render_notification_section() {
        echo '<p>' . __('Configure email notification settings.', 'fitcopilot') . '</p>';
    }
    
    // ===== FIELD CALLBACKS =====
    
    /**
     * Render default view field
     */
    public function render_default_view_field() {
        $settings = $this->data_manager->get_settings();
        $value = $settings['default_view'] ?? 'dayGridMonth';
        
        $options = array(
            'dayGridMonth' => __('Month View', 'fitcopilot'),
            'timeGridWeek' => __('Week View', 'fitcopilot'),
            'timeGridDay' => __('Day View', 'fitcopilot'),
            'listWeek' => __('List View', 'fitcopilot')
        );
        
        echo '<select name="fitcopilot_training_calendar_settings[default_view]">';
        foreach ($options as $option_value => $option_label) {
            $selected = selected($value, $option_value, false);
            echo "<option value='{$option_value}' {$selected}>{$option_label}</option>";
        }
        echo '</select>';
        echo '<p class="description">' . __('Default calendar view when page loads.', 'fitcopilot') . '</p>';
    }
    
    /**
     * Render first day field
     */
    public function render_first_day_field() {
        $settings = $this->data_manager->get_settings();
        $value = $settings['first_day'] ?? 0;
        
        $options = array(
            0 => __('Sunday', 'fitcopilot'),
            1 => __('Monday', 'fitcopilot')
        );
        
        echo '<select name="fitcopilot_training_calendar_settings[first_day]">';
        foreach ($options as $option_value => $option_label) {
            $selected = selected($value, $option_value, false);
            echo "<option value='{$option_value}' {$selected}>{$option_label}</option>";
        }
        echo '</select>';
        echo '<p class="description">' . __('First day of the week in calendar display.', 'fitcopilot') . '</p>';
    }
    
    /**
     * Render booking advance field
     */
    public function render_booking_advance_field() {
        $settings = $this->data_manager->get_settings();
        $value = $settings['booking_advance_days'] ?? 30;
        
        echo '<input type="number" name="fitcopilot_training_calendar_settings[booking_advance_days]" value="' . esc_attr($value) . '" min="1" max="365" class="small-text" />';
        echo '<p class="description">' . __('Maximum days in advance clients can book.', 'fitcopilot') . '</p>';
    }
    
    /**
     * Render booking notice field
     */
    public function render_booking_notice_field() {
        $settings = $this->data_manager->get_settings();
        $value = $settings['booking_notice_hours'] ?? 24;
        
        echo '<input type="number" name="fitcopilot_training_calendar_settings[booking_notice_hours]" value="' . esc_attr($value) . '" min="1" max="168" class="small-text" />';
        echo '<p class="description">' . __('Minimum hours notice required for booking.', 'fitcopilot') . '</p>';
    }
    
    /**
     * Render email notifications field
     */
    public function render_email_notifications_field() {
        $settings = $this->data_manager->get_settings();
        $value = $settings['email_notifications'] ?? true;
        
        echo '<label>';
        echo '<input type="checkbox" name="fitcopilot_training_calendar_settings[email_notifications]" value="1" ' . checked($value, true, false) . ' />';
        echo ' ' . __('Send email notifications for bookings and updates', 'fitcopilot');
        echo '</label>';
    }
    
    // ===== VALIDATION AND SANITIZATION =====
    
    /**
     * Sanitize settings data
     * 
     * @param array $input Raw settings input
     * @return array Sanitized settings
     */
    public function sanitize_settings($input) {
        $sanitized = array();
        
        // Default view
        $valid_views = array('dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek');
        $sanitized['default_view'] = in_array($input['default_view'] ?? '', $valid_views) 
            ? $input['default_view'] 
            : 'dayGridMonth';
        
        // First day
        $sanitized['first_day'] = in_array($input['first_day'] ?? 0, array(0, 1)) 
            ? absint($input['first_day']) 
            : 0;
        
        // Time format
        $sanitized['time_format'] = sanitize_text_field($input['time_format'] ?? 'h:mm a');
        
        // Date format
        $sanitized['date_format'] = sanitize_text_field($input['date_format'] ?? 'MMM d, yyyy');
        
        // Slot duration
        $sanitized['slot_duration'] = sanitize_text_field($input['slot_duration'] ?? '00:30:00');
        
        // Business hours
        $sanitized['business_hours'] = array(
            'start' => sanitize_text_field($input['business_hours']['start'] ?? '09:00'),
            'end' => sanitize_text_field($input['business_hours']['end'] ?? '17:00')
        );
        
        // Weekend enabled
        $sanitized['weekend_enabled'] = !empty($input['weekend_enabled']);
        
        // Booking settings
        $sanitized['booking_advance_days'] = max(1, min(365, absint($input['booking_advance_days'] ?? 30)));
        $sanitized['booking_notice_hours'] = max(1, min(168, absint($input['booking_notice_hours'] ?? 24)));
        $sanitized['auto_confirm_bookings'] = !empty($input['auto_confirm_bookings']);
        
        // Email notifications
        $sanitized['email_notifications'] = !empty($input['email_notifications']);
        
        // Calendar colors
        if (isset($input['calendar_colors']) && is_array($input['calendar_colors'])) {
            $sanitized['calendar_colors'] = array();
            $valid_types = array('session', 'availability', 'blocked', 'group_class', 'workshop', 'assessment');
            
            foreach ($valid_types as $type) {
                $sanitized['calendar_colors'][$type] = sanitize_hex_color($input['calendar_colors'][$type] ?? '');
            }
        } else {
            // Use defaults
            $defaults = $this->data_manager->get_default_settings();
            $sanitized['calendar_colors'] = $defaults['calendar_colors'];
        }
        
        return $sanitized;
    }
    
    /**
     * Validate settings
     * 
     * @param array $settings Settings to validate
     * @return bool|array True if valid, array of errors if invalid
     */
    public function validate_settings($settings) {
        $errors = array();
        
        // Validate business hours
        if (!empty($settings['business_hours'])) {
            $start = $settings['business_hours']['start'] ?? '';
            $end = $settings['business_hours']['end'] ?? '';
            
            if ($start && $end && strtotime($end) <= strtotime($start)) {
                $errors[] = __('Business end time must be after start time.', 'fitcopilot');
            }
        }
        
        // Validate booking settings
        if ($settings['booking_advance_days'] < 1 || $settings['booking_advance_days'] > 365) {
            $errors[] = __('Booking advance days must be between 1 and 365.', 'fitcopilot');
        }
        
        if ($settings['booking_notice_hours'] < 1 || $settings['booking_notice_hours'] > 168) {
            $errors[] = __('Booking notice hours must be between 1 and 168.', 'fitcopilot');
        }
        
        return empty($errors) ? true : $errors;
    }
} 