<?php
/**
 * FitCopilot Training Features Settings Manager
 * 
 * Handles settings management for Training Features admin interface
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
 * Training Features Settings Manager Class
 * 
 * Manages section-level settings for the Training Features admin interface
 */
class FitCopilot_Training_Features_Settings {
    
    /**
     * Data manager instance
     */
    private $data_manager;
    
    /**
     * Constructor
     * 
     * @param FitCopilot_Training_Features_Data $data_manager Data manager instance
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
            'fitcopilot_training_features_settings_group',
            'fitcopilot_training_features_settings',
            array(
                'type' => 'array',
                'description' => 'Training Features section settings',
                'sanitize_callback' => array($this, 'sanitize_settings'),
                'default' => $this->data_manager->get_default_settings()
            )
        );
        
        // Register individual settings sections
        $this->register_section_settings();
        $this->register_display_settings();
        $this->register_cta_settings();
    }
    
    /**
     * Register section-level settings
     */
    private function register_section_settings() {
        add_settings_section(
            'fitcopilot_training_features_section',
            'Section Configuration',
            array($this, 'render_section_description'),
            'fitcopilot_training_features_settings'
        );
        
        // Section title
        add_settings_field(
            'section_title',
            'Section Title',
            array($this, 'render_text_field'),
            'fitcopilot_training_features_settings',
            'fitcopilot_training_features_section',
            array(
                'field' => 'section_title',
                'placeholder' => 'Comprehensive Training Features',
                'description' => 'Main title displayed at the top of the Training Features section'
            )
        );
        
        // Section description
        add_settings_field(
            'section_description',
            'Section Description',
            array($this, 'render_textarea_field'),
            'fitcopilot_training_features_settings',
            'fitcopilot_training_features_section',
            array(
                'field' => 'section_description',
                'placeholder' => 'Our training platform includes everything you need...',
                'description' => 'Description text displayed below the section title'
            )
        );
        
        // Section tag text
        add_settings_field(
            'section_tag_text',
            'Section Tag Text',
            array($this, 'render_text_field'),
            'fitcopilot_training_features_settings',
            'fitcopilot_training_features_section',
            array(
                'field' => 'section_tag_text',
                'placeholder' => 'Premium Experience',
                'description' => 'Tag text displayed above the section title'
            )
        );
    }
    
    /**
     * Register display settings
     */
    private function register_display_settings() {
        add_settings_section(
            'fitcopilot_training_features_display',
            'Display Options',
            array($this, 'render_display_description'),
            'fitcopilot_training_features_display'
        );
        
        // Max display count
        add_settings_field(
            'max_display_count',
            'Max Features to Display',
            array($this, 'render_number_field'),
            'fitcopilot_training_features_display',
            'fitcopilot_training_features_display',
            array(
                'field' => 'max_display_count',
                'min' => -1,
                'max' => 50,
                'description' => 'Maximum number of features to display (-1 for all)'
            )
        );
        
        // Layout columns
        add_settings_field(
            'layout_columns',
            'Layout Columns',
            array($this, 'render_select_field'),
            'fitcopilot_training_features_display',
            'fitcopilot_training_features_display',
            array(
                'field' => 'layout_columns',
                'options' => array(
                    1 => '1 Column',
                    2 => '2 Columns',
                    3 => '3 Columns',
                    4 => '4 Columns'
                ),
                'description' => 'Number of columns in the features grid'
            )
        );
        
        // Show featured first
        add_settings_field(
            'show_featured_first',
            'Featured Features First',
            array($this, 'render_checkbox_field'),
            'fitcopilot_training_features_display',
            'fitcopilot_training_features_display',
            array(
                'field' => 'show_featured_first',
                'description' => 'Display featured features before regular features'
            )
        );
        
        // Enable animations
        add_settings_field(
            'enable_animations',
            'Enable Animations',
            array($this, 'render_checkbox_field'),
            'fitcopilot_training_features_display',
            'fitcopilot_training_features_display',
            array(
                'field' => 'enable_animations',
                'description' => 'Enable card flip animations and transitions'
            )
        );
    }
    
    /**
     * Register CTA settings
     */
    private function register_cta_settings() {
        add_settings_section(
            'fitcopilot_training_features_cta',
            'Call-to-Action Settings',
            array($this, 'render_cta_description'),
            'fitcopilot_training_features_cta'
        );
        
        // CTA enabled
        add_settings_field(
            'cta_enabled',
            'Enable CTA Section',
            array($this, 'render_checkbox_field'),
            'fitcopilot_training_features_cta',
            'fitcopilot_training_features_cta',
            array(
                'field' => 'cta_enabled',
                'description' => 'Show call-to-action section after features'
            )
        );
        
        // CTA title
        add_settings_field(
            'cta_title',
            'CTA Title',
            array($this, 'render_text_field'),
            'fitcopilot_training_features_cta',
            'fitcopilot_training_features_cta',
            array(
                'field' => 'cta_title',
                'placeholder' => 'Ready to Get Started?',
                'description' => 'Title for the CTA section'
            )
        );
        
        // CTA subtitle
        add_settings_field(
            'cta_subtitle',
            'CTA Subtitle',
            array($this, 'render_textarea_field'),
            'fitcopilot_training_features_cta',
            'fitcopilot_training_features_cta',
            array(
                'field' => 'cta_subtitle',
                'placeholder' => 'Join thousands of fitness enthusiasts...',
                'description' => 'Subtitle/description for the CTA section'
            )
        );
        
        // CTA button text
        add_settings_field(
            'cta_button_text',
            'Button Text',
            array($this, 'render_text_field'),
            'fitcopilot_training_features_cta',
            'fitcopilot_training_features_cta',
            array(
                'field' => 'cta_button_text',
                'placeholder' => 'Explore Features',
                'description' => 'Text displayed on the CTA button'
            )
        );
        
        // CTA button URL
        add_settings_field(
            'cta_button_url',
            'Button URL',
            array($this, 'render_url_field'),
            'fitcopilot_training_features_cta',
            'fitcopilot_training_features_cta',
            array(
                'field' => 'cta_button_url',
                'placeholder' => 'https://example.com/signup',
                'description' => 'URL for the CTA button'
            )
        );
    }
    
    /**
     * Get current settings
     * 
     * @return array Current settings data
     */
    public function get_settings() {
        return $this->data_manager->get_settings();
    }
    
    /**
     * Save settings
     * 
     * @param array $settings Settings data
     * @return bool Success status
     */
    public function save_settings($settings) {
        return $this->data_manager->save_settings($settings);
    }
    

    
    /**
     * Sanitize settings callback
     * 
     * @param array $settings Raw settings data
     * @return array Sanitized settings
     */
    public function sanitize_settings($settings) {
        return $this->data_manager->sanitize_settings_data($settings);
    }
    
    // ===== FIELD RENDERING METHODS =====
    
    /**
     * Render section description
     */
    public function render_section_description() {
        echo '<p>Configure the main section settings for the Training Features component.</p>';
    }
    
    /**
     * Render display description
     */
    public function render_display_description() {
        echo '<p>Control how training features are displayed on the frontend.</p>';
    }
    
    /**
     * Render CTA description
     */
    public function render_cta_description() {
        echo '<p>Configure the call-to-action section that appears after the training features.</p>';
    }
    
    /**
     * Render text field
     * 
     * @param array $args Field arguments
     */
    public function render_text_field($args) {
        $settings = $this->get_settings();
        $field = $args['field'];
        $value = $settings[$field] ?? '';
        $placeholder = $args['placeholder'] ?? '';
        $description = $args['description'] ?? '';
        
        printf(
            '<input type="text" id="%s" name="fitcopilot_training_features_settings[%s]" value="%s" placeholder="%s" class="regular-text" />',
            esc_attr($field),
            esc_attr($field),
            esc_attr($value),
            esc_attr($placeholder)
        );
        
        if ($description) {
            printf('<p class="description">%s</p>', esc_html($description));
        }
    }
    
    /**
     * Render textarea field
     * 
     * @param array $args Field arguments
     */
    public function render_textarea_field($args) {
        $settings = $this->get_settings();
        $field = $args['field'];
        $value = $settings[$field] ?? '';
        $placeholder = $args['placeholder'] ?? '';
        $description = $args['description'] ?? '';
        
        printf(
            '<textarea id="%s" name="fitcopilot_training_features_settings[%s]" placeholder="%s" class="large-text" rows="3">%s</textarea>',
            esc_attr($field),
            esc_attr($field),
            esc_attr($placeholder),
            esc_textarea($value)
        );
        
        if ($description) {
            printf('<p class="description">%s</p>', esc_html($description));
        }
    }
    
    /**
     * Render number field
     * 
     * @param array $args Field arguments
     */
    public function render_number_field($args) {
        $settings = $this->get_settings();
        $field = $args['field'];
        $value = $settings[$field] ?? '';
        $min = $args['min'] ?? '';
        $max = $args['max'] ?? '';
        $description = $args['description'] ?? '';
        
        printf(
            '<input type="number" id="%s" name="fitcopilot_training_features_settings[%s]" value="%s" min="%s" max="%s" class="small-text" />',
            esc_attr($field),
            esc_attr($field),
            esc_attr($value),
            esc_attr($min),
            esc_attr($max)
        );
        
        if ($description) {
            printf('<p class="description">%s</p>', esc_html($description));
        }
    }
    
    /**
     * Render select field
     * 
     * @param array $args Field arguments
     */
    public function render_select_field($args) {
        $settings = $this->get_settings();
        $field = $args['field'];
        $value = $settings[$field] ?? '';
        $options = $args['options'] ?? array();
        $description = $args['description'] ?? '';
        
        printf('<select id="%s" name="fitcopilot_training_features_settings[%s]">', esc_attr($field), esc_attr($field));
        
        foreach ($options as $option_value => $option_label) {
            printf(
                '<option value="%s" %s>%s</option>',
                esc_attr($option_value),
                selected($value, $option_value, false),
                esc_html($option_label)
            );
        }
        
        echo '</select>';
        
        if ($description) {
            printf('<p class="description">%s</p>', esc_html($description));
        }
    }
    
    /**
     * Render checkbox field
     * 
     * @param array $args Field arguments
     */
    public function render_checkbox_field($args) {
        $settings = $this->get_settings();
        $field = $args['field'];
        $value = !empty($settings[$field]);
        $description = $args['description'] ?? '';
        
        printf(
            '<input type="checkbox" id="%s" name="fitcopilot_training_features_settings[%s]" value="1" %s />',
            esc_attr($field),
            esc_attr($field),
            checked($value, true, false)
        );
        
        if ($description) {
            printf('<label for="%s"> %s</label>', esc_attr($field), esc_html($description));
        }
    }
    
    /**
     * Render URL field
     * 
     * @param array $args Field arguments
     */
    public function render_url_field($args) {
        $settings = $this->get_settings();
        $field = $args['field'];
        $value = $settings[$field] ?? '';
        $placeholder = $args['placeholder'] ?? '';
        $description = $args['description'] ?? '';
        
        printf(
            '<input type="url" id="%s" name="fitcopilot_training_features_settings[%s]" value="%s" placeholder="%s" class="regular-text" />',
            esc_attr($field),
            esc_attr($field),
            esc_attr($value),
            esc_attr($placeholder)
        );
        
        if ($description) {
            printf('<p class="description">%s</p>', esc_html($description));
        }
    }
} 