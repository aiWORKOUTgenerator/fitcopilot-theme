<?php
/**
 * FitCopilot Personal Training Settings Manager
 * 
 * Handles settings registration and sanitization for Personal Training admin
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Personal Training Settings Manager Class
 * 
 * Manages WordPress settings registration and sanitization
 */
class FitCopilot_Personal_Training_Settings {
    
    /**
     * Data manager instance
     */
    private $data_manager;
    
    /**
     * Constructor
     * 
     * @param FitCopilot_Personal_Training_Data $data_manager Data manager instance
     */
    public function __construct($data_manager) {
        $this->data_manager = $data_manager;
    }
    
    /**
     * Initialize settings registration
     */
    public function init() {
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    /**
     * Register settings for personal training
     */
    public function register_settings() {
        // Register trainer data
        register_setting(
            'fitcopilot_personal_training_options',
            'fitcopilot_personal_training_data',
            array(
                'type'              => 'array',
                'sanitize_callback' => array($this->data_manager, 'sanitize_trainers_data'),
                'default'           => array()
            )
        );

        // Register section settings
        register_setting(
            'fitcopilot_personal_training_options',
            'fitcopilot_personal_training_settings',
            array(
                'type'              => 'array',
                'sanitize_callback' => array($this, 'sanitize_settings'),
                'default'           => array(
                    'section_title' => 'Personal Trainers',
                    'section_subtitle' => 'Work directly with our certified fitness professionals',
                    'show_featured_trainer' => true,
                    'show_group_instructor' => true,
                    'max_display_count' => -1
                )
            )
        );
    }
    
    /**
     * Sanitize personal training settings
     * 
     * @param array $input The raw settings data
     * @return array Sanitized settings data
     */
    public function sanitize_settings($input) {
        // ✅ Use data manager's comprehensive sanitization that includes CTA fields
        return $this->data_manager->sanitize_settings_data($input);
    }
    
    /**
     * Get default settings
     * 
     * @return array Default settings
     */
    public function get_default_settings() {
        // ✅ Use data manager's comprehensive defaults that include CTA fields
        return $this->data_manager->get_settings();
    }
    
    /**
     * Save settings data
     * 
     * @param array $settings_data Raw settings data to save
     * @return bool Success status
     */
    public function save_settings($settings_data) {
        // ✅ Use data manager's comprehensive save method
        return $this->data_manager->save_settings($settings_data);
    }
} 