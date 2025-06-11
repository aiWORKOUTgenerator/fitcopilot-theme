<?php
/**
 * FitCopilot Admin Field Configuration Library
 * Standardized field configurations for consistent admin interfaces
 * 
 * @package FitCopilot
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get testimonials field configuration (Simple pattern reference)
 */
function fitcopilot_get_testimonials_field_config() {
    return array(
        'name' => array(
            'type' => 'text',
            'label' => 'Customer Name',
            'required' => true,
            'placeholder' => 'Enter customer name',
            'input_class' => 'regular-text'
        ),
        'role' => array(
            'type' => 'text',
            'label' => 'Role/Title',
            'placeholder' => 'Job Title or Role',
            'input_class' => 'regular-text'
        ),
        'quote' => array(
            'type' => 'textarea',
            'label' => 'Testimonial Quote',
            'required' => true,
            'placeholder' => 'Enter the testimonial quote...',
            'rows' => 4,
            'class' => 'full-width'
        ),
        'avatar' => array(
            'type' => 'image_upload',
            'label' => 'Avatar Image',
            'placeholder' => 'Image URL',
            'class' => 'full-width'
        ),
        'rating' => array(
            'type' => 'rating',
            'label' => 'Rating',
            'default' => 5
        )
    );
}

/**
 * Get testimonials settings configuration
 */
function fitcopilot_get_testimonials_settings_config() {
    return array(
        'autoplay' => array(
            'type' => 'checkbox',
            'label' => 'Autoplay',
            'checkbox_label' => 'Enable automatic carousel rotation',
            'description' => 'Automatically rotate testimonials',
            'default' => false
        ),
        'autoplay_speed' => array(
            'type' => 'number',
            'label' => 'Autoplay Speed (ms)',
            'min' => 1000,
            'max' => 10000,
            'step' => 500,
            'default' => 3000,
            'description' => 'Time between automatic rotations'
        ),
        'show_indicators' => array(
            'type' => 'checkbox', 
            'label' => 'Show Indicators',
            'checkbox_label' => 'Show dot indicators below the carousel',
            'default' => true
        ),
        'show_navigation' => array(
            'type' => 'checkbox',
            'label' => 'Show Navigation',
            'checkbox_label' => 'Show previous/next arrow buttons',
            'default' => true
        ),
        'items_per_page_desktop' => array(
            'type' => 'select',
            'label' => 'Items Per Page (Desktop)',
            'options' => array(
                1 => '1',
                2 => '2', 
                3 => '3',
                4 => '4',
                5 => '5'
            ),
            'default' => 3,
            'description' => 'Number of testimonials visible at once on desktop'
        ),
        'items_per_page_mobile' => array(
            'type' => 'select',
            'label' => 'Items Per Page (Mobile)',
            'options' => array(
                1 => '1',
                2 => '2',
                3 => '3'
            ),
            'default' => 1,
            'description' => 'Number of testimonials visible at once on mobile devices'
        )
    );
}

/**
 * Get personal training field configuration (Complex pattern reference)
 */
function fitcopilot_get_personal_training_field_config() {
    return array(
        'name' => array(
            'type' => 'text',
            'label' => 'Trainer Name',
            'required' => true,
            'placeholder' => 'Enter trainer name',
            'input_class' => 'trainer-name-input regular-text'
        ),
        'specialty' => array(
            'type' => 'text',
            'label' => 'Specialty',
            'required' => true,
            'placeholder' => 'e.g., Strength & Conditioning',
            'input_class' => 'regular-text'
        ),
        'bio' => array(
            'type' => 'textarea',
            'label' => 'Bio/Description',
            'placeholder' => 'Tell clients about this trainer\'s experience and approach...',
            'rows' => 3,
            'class' => 'full-width'
        ),
        'image_url' => array(
            'type' => 'image_upload',
            'label' => 'Trainer Image',
            'placeholder' => 'https://example.com/trainer-photo.jpg',
            'class' => 'full-width'
        ),
        'years_experience' => array(
            'type' => 'number',
            'label' => 'Years Experience',
            'min' => 0,
            'max' => 50,
            'step' => 1,
            'input_class' => 'small-text'
        ),
        'clients_count' => array(
            'type' => 'number',
            'label' => 'Clients Trained',
            'min' => 0,
            'step' => 1,
            'input_class' => 'small-text'
        ),
        'coach_type' => array(
            'type' => 'select',
            'label' => 'Coach Type',
            'options' => array(
                'strength' => 'Strength Training',
                'nutrition' => 'Nutrition',
                'performance' => 'Athletic Performance',
                'recovery' => 'Recovery & Wellness'
            ),
            'default' => 'strength',
            'input_class' => 'regular-text'
        ),
        'video_title' => array(
            'type' => 'text',
            'label' => 'Video Title',
            'placeholder' => 'e.g., High-Intensity Workout Demo',
            'input_class' => 'regular-text',
            'class' => 'full-width'
        ),
        'video_url' => array(
            'type' => 'url',
            'label' => 'Video URL',
            'placeholder' => 'YouTube embed URL (e.g., https://www.youtube.com/embed/ABC123)',
            'input_class' => 'regular-text',
            'class' => 'full-width'
        ),
        'video_poster' => array(
            'type' => 'url',
            'label' => 'Video Poster Image',
            'placeholder' => 'Video poster image URL (optional)',
            'input_class' => 'regular-text',
            'class' => 'full-width'
        ),
        'featured' => array(
            'type' => 'checkbox',
            'label' => 'Featured Trainer',
            'toggle_label' => '⭐ Featured Trainer',
            'description' => 'Featured trainers get prominent display on the frontend'
        ),
        'order' => array(
            'type' => 'number',
            'label' => 'Order/Priority',
            'min' => 1,
            'step' => 1,
            'input_class' => 'small-text'
        )
    );
}

/**
 * Get personal training settings configuration
 */
function fitcopilot_get_personal_training_settings_config() {
    return array(
        'section_title' => array(
            'type' => 'text',
            'label' => 'Section Title',
            'default' => 'Personal Trainers',
            'description' => 'Main heading for the personal training section'
        ),
        'section_subtitle' => array(
            'type' => 'text',
            'label' => 'Section Subtitle', 
            'default' => 'Work directly with our certified fitness professionals',
            'description' => 'Subheading for the personal training section'
        ),
        'show_featured_trainer' => array(
            'type' => 'checkbox',
            'label' => 'Show Featured Trainer',
            'checkbox_label' => 'Display featured trainer prominently',
            'default' => true
        ),
        'show_group_instructor' => array(
            'type' => 'checkbox',
            'label' => 'Show Group Instructors',
            'checkbox_label' => 'Display group fitness instructors',
            'default' => true
        ),
        'max_display_count' => array(
            'type' => 'number',
            'label' => 'Max Display Count',
            'min' => -1,
            'step' => 1,
            'default' => -1,
            'description' => 'Use -1 to show all active trainers'
        )
    );
}

/**
 * Common field configurations for reuse across managers
 */
function fitcopilot_get_common_field_configs() {
    return array(
        
        // Basic content fields
        'title' => array(
            'type' => 'text',
            'label' => 'Title',
            'required' => true,
            'placeholder' => 'Enter title...',
            'input_class' => 'regular-text'
        ),
        
        'description' => array(
            'type' => 'textarea',
            'label' => 'Description',
            'placeholder' => 'Enter description...',
            'rows' => 3,
            'class' => 'full-width'
        ),
        
        'content' => array(
            'type' => 'textarea',
            'label' => 'Content',
            'placeholder' => 'Enter content...',
            'rows' => 5,
            'class' => 'full-width'
        ),
        
        // Media fields
        'image' => array(
            'type' => 'image_upload',
            'label' => 'Image',
            'placeholder' => 'https://example.com/image.jpg',
            'class' => 'full-width'
        ),
        
        'icon' => array(
            'type' => 'text',
            'label' => 'Icon',
            'placeholder' => 'Icon name or URL',
            'input_class' => 'regular-text'
        ),
        
        'video_url' => array(
            'type' => 'url',
            'label' => 'Video URL',
            'placeholder' => 'YouTube or Vimeo URL',
            'input_class' => 'regular-text'
        ),
        
        // CTA fields
        'cta_text' => array(
            'type' => 'text',
            'label' => 'Call-to-Action Text',
            'placeholder' => 'e.g., Learn More, Get Started',
            'input_class' => 'regular-text'
        ),
        
        'cta_url' => array(
            'type' => 'url',
            'label' => 'Call-to-Action URL',
            'placeholder' => 'https://example.com/action',
            'input_class' => 'regular-text'
        ),
        
        // Status fields
        'featured' => array(
            'type' => 'checkbox',
            'label' => 'Featured',
            'toggle_label' => '⭐ Featured Item',
            'description' => 'Featured items receive prominent display'
        ),
        
        'active' => array(
            'type' => 'checkbox',
            'label' => 'Active',
            'toggle_label' => 'Show on Frontend',
            'description' => 'Only active items appear on the website',
            'default' => true
        ),
        
        // Ordering fields
        'order' => array(
            'type' => 'number',
            'label' => 'Display Order',
            'min' => 1,
            'step' => 1,
            'input_class' => 'small-text',
            'description' => 'Lower numbers appear first'
        ),
        
        // Pricing fields
        'price' => array(
            'type' => 'text',
            'label' => 'Price',
            'placeholder' => '$99.99',
            'input_class' => 'regular-text'
        ),
        
        'currency' => array(
            'type' => 'select',
            'label' => 'Currency',
            'options' => array(
                'USD' => 'US Dollar ($)',
                'EUR' => 'Euro (€)',
                'GBP' => 'British Pound (£)',
                'CAD' => 'Canadian Dollar (C$)'
            ),
            'default' => 'USD'
        ),
        
        // Contact fields
        'email' => array(
            'type' => 'email',
            'label' => 'Email Address',
            'placeholder' => 'email@example.com',
            'input_class' => 'regular-text'
        ),
        
        'phone' => array(
            'type' => 'text',
            'label' => 'Phone Number',
            'placeholder' => '+1 (555) 123-4567',
            'input_class' => 'regular-text'
        ),
        
        'website' => array(
            'type' => 'url',
            'label' => 'Website',
            'placeholder' => 'https://example.com',
            'input_class' => 'regular-text'
        )
    );
}

/**
 * Common settings configurations for reuse across managers
 */
function fitcopilot_get_common_settings_configs() {
    return array(
        
        // Section display settings
        'section_title' => array(
            'type' => 'text',
            'label' => 'Section Title',
            'description' => 'Main heading for this section'
        ),
        
        'section_subtitle' => array(
            'type' => 'text',
            'label' => 'Section Subtitle',
            'description' => 'Subheading for this section'
        ),
        
        'section_description' => array(
            'type' => 'textarea',
            'label' => 'Section Description',
            'rows' => 3,
            'description' => 'Optional description text for the section'
        ),
        
        // Display control settings
        'items_per_page' => array(
            'type' => 'number',
            'label' => 'Items Per Page',
            'min' => 1,
            'max' => 20,
            'step' => 1,
            'default' => 6,
            'description' => 'Number of items to display'
        ),
        
        'show_featured_only' => array(
            'type' => 'checkbox',
            'label' => 'Featured Items Only',
            'checkbox_label' => 'Show only featured items',
            'default' => false
        ),
        
        'enable_pagination' => array(
            'type' => 'checkbox',
            'label' => 'Enable Pagination',
            'checkbox_label' => 'Add pagination controls',
            'default' => false
        ),
        
        // Animation settings
        'enable_animations' => array(
            'type' => 'checkbox',
            'label' => 'Enable Animations',
            'checkbox_label' => 'Enable entrance animations',
            'default' => true
        ),
        
        'animation_delay' => array(
            'type' => 'number',
            'label' => 'Animation Delay (ms)',
            'min' => 0,
            'max' => 2000,
            'step' => 100,
            'default' => 200,
            'description' => 'Delay between item animations'
        ),
        
        // Layout settings
        'layout_style' => array(
            'type' => 'select',
            'label' => 'Layout Style',
            'options' => array(
                'grid' => 'Grid Layout',
                'list' => 'List Layout',
                'carousel' => 'Carousel Layout'
            ),
            'default' => 'grid'
        ),
        
        'columns_desktop' => array(
            'type' => 'select',
            'label' => 'Columns (Desktop)',
            'options' => array(
                1 => '1 Column',
                2 => '2 Columns',
                3 => '3 Columns',
                4 => '4 Columns'
            ),
            'default' => 3
        ),
        
        'columns_mobile' => array(
            'type' => 'select',
            'label' => 'Columns (Mobile)',
            'options' => array(
                1 => '1 Column',
                2 => '2 Columns'
            ),
            'default' => 1
        )
    );
}

/**
 * Generate field configuration for a specific feature
 * 
 * @param string $feature_type Feature type (simple, medium, complex)
 * @param array $custom_fields Additional custom fields
 * @return array Complete field configuration
 */
function fitcopilot_generate_field_config($feature_type = 'simple', $custom_fields = array()) {
    $common_fields = fitcopilot_get_common_field_configs();
    
    switch ($feature_type) {
        case 'simple':
            $base_fields = array(
                'title' => $common_fields['title'],
                'description' => $common_fields['description'],
                'image' => $common_fields['image'],
                'active' => $common_fields['active']
            );
            break;
            
        case 'medium':
            $base_fields = array(
                'title' => $common_fields['title'],
                'description' => $common_fields['description'],
                'content' => $common_fields['content'],
                'image' => $common_fields['image'],
                'cta_text' => $common_fields['cta_text'],
                'cta_url' => $common_fields['cta_url'],
                'featured' => $common_fields['featured'],
                'active' => $common_fields['active'],
                'order' => $common_fields['order']
            );
            break;
            
        case 'complex':
            $base_fields = array(
                'title' => $common_fields['title'],
                'description' => $common_fields['description'],
                'content' => $common_fields['content'],
                'image' => $common_fields['image'],
                'video_url' => $common_fields['video_url'],
                'cta_text' => $common_fields['cta_text'],
                'cta_url' => $common_fields['cta_url'],
                'price' => $common_fields['price'],
                'featured' => $common_fields['featured'],
                'active' => $common_fields['active'],
                'order' => $common_fields['order']
            );
            break;
            
        default:
            $base_fields = array();
    }
    
    return array_merge($base_fields, $custom_fields);
}

/**
 * Generate settings configuration for a specific feature
 * 
 * @param string $feature_type Feature type (simple, medium, complex)
 * @param array $custom_settings Additional custom settings
 * @return array Complete settings configuration
 */
function fitcopilot_generate_settings_config($feature_type = 'simple', $custom_settings = array()) {
    $common_settings = fitcopilot_get_common_settings_configs();
    
    switch ($feature_type) {
        case 'simple':
            $base_settings = array(
                'section_title' => $common_settings['section_title'],
                'items_per_page' => $common_settings['items_per_page']
            );
            break;
            
        case 'medium':
            $base_settings = array(
                'section_title' => $common_settings['section_title'],
                'section_subtitle' => $common_settings['section_subtitle'],
                'items_per_page' => $common_settings['items_per_page'],
                'layout_style' => $common_settings['layout_style'],
                'enable_animations' => $common_settings['enable_animations']
            );
            break;
            
        case 'complex':
            $base_settings = array(
                'section_title' => $common_settings['section_title'],
                'section_subtitle' => $common_settings['section_subtitle'],
                'section_description' => $common_settings['section_description'],
                'items_per_page' => $common_settings['items_per_page'],
                'show_featured_only' => $common_settings['show_featured_only'],
                'layout_style' => $common_settings['layout_style'],
                'columns_desktop' => $common_settings['columns_desktop'],
                'columns_mobile' => $common_settings['columns_mobile'],
                'enable_animations' => $common_settings['enable_animations'],
                'animation_delay' => $common_settings['animation_delay']
            );
            break;
            
        default:
            $base_settings = array();
    }
    
    return array_merge($base_settings, $custom_settings);
} 