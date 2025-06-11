<?php
/**
 * FitCopilot Personal Training Data Manager
 * 
 * Handles all trainer data operations, sanitization, and validation
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Personal Training Data Manager Class
 * 
 * Manages trainer data CRUD operations and validation
 */
class FitCopilot_Personal_Training_Data {
    
    /**
     * Database option keys
     */
    const DATA_OPTION = 'fitcopilot_personal_training_data';
    const SETTINGS_OPTION = 'fitcopilot_personal_training_settings';
    const LAST_UPDATED_OPTION = 'fitcopilot_personal_training_last_updated';
    
    /**
     * Get all trainer data
     * 
     * @param bool $active_only Whether to return only active trainers
     * @return array Trainer data
     */
    public function get_trainers($active_only = false) {
        $data = get_option(self::DATA_OPTION, $this->get_default_data());
        
        if ($active_only) {
            return array_filter($data, function($trainer) {
                return !empty($trainer['active']);
            });
        }
        
        return $data;
    }
    
    /**
     * Get single trainer by index
     * 
     * @param int $index Trainer index
     * @return array|null Trainer data or null if not found
     */
    public function get_trainer($index) {
        $trainers = $this->get_trainers();
        return isset($trainers[$index]) ? $trainers[$index] : null;
    }
    
    /**
     * Save all trainer data
     * 
     * @param array $trainers_data Raw trainer data
     * @return bool Success status
     */
    public function save_trainers($trainers_data) {
        $sanitized_data = $this->sanitize_trainers_data($trainers_data);
        $result = update_option(self::DATA_OPTION, $sanitized_data);
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
        }
        
        return $result;
    }
    
    /**
     * Save individual trainer
     * 
     * @param int $index Trainer index
     * @param array $trainer_data Raw trainer data
     * @return bool Success status
     */
    public function save_trainer($index, $trainer_data) {
        $current_trainers = $this->get_trainers();
        $sanitized_trainer = $this->sanitize_trainer_data($trainer_data, $index);
        
        if (isset($current_trainers[$index])) {
            $current_trainers[$index] = $sanitized_trainer;
        } else {
            $current_trainers[] = $sanitized_trainer;
        }
        
        $result = update_option(self::DATA_OPTION, $current_trainers);
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
        }
        
        return $result;
    }
    
    /**
     * Delete trainer by index (DEPRECATED - use delete_trainer_by_id)
     * 
     * @param int $index Trainer index
     * @return bool Success status
     */
    public function delete_trainer($index) {
        $trainers = $this->get_trainers();
        
        if (isset($trainers[$index])) {
            unset($trainers[$index]);
            $trainers = array_values($trainers); // Re-index array
            
            $result = update_option(self::DATA_OPTION, $trainers);
            
            if ($result) {
                update_option(self::LAST_UPDATED_OPTION, time());
            }
            
            return $result;
        }
        
        return false;
    }

    /**
     * Delete trainer by ID (PREFERRED METHOD)
     * 
     * @param int $trainer_id Trainer ID
     * @return array|false Success status with details or false
     */
    public function delete_trainer_by_id($trainer_id) {
        $trainers = $this->get_trainers();
        $trainer_id = absint($trainer_id);
        
        // Find trainer by ID
        $found_index = null;
        $found_trainer = null;
        
        foreach ($trainers as $index => $trainer) {
            if (absint($trainer['id'] ?? 0) === $trainer_id) {
                $found_index = $index;
                $found_trainer = $trainer;
                break;
            }
        }
        
        if ($found_index !== null) {
            // Remove trainer and re-index array
            unset($trainers[$found_index]);
            $trainers = array_values($trainers);
            
            $result = update_option(self::DATA_OPTION, $trainers);
            
            if ($result) {
                update_option(self::LAST_UPDATED_OPTION, time());
                
                return array(
                    'success' => true,
                    'deleted_trainer' => $found_trainer,
                    'previous_index' => $found_index,
                    'remaining_count' => count($trainers)
                );
            }
        }
        
        return false;
    }
    
    /**
     * Reset to default data
     * 
     * @return bool Success status
     */
    public function reset_to_defaults() {
        $default_data = $this->get_default_data();
        
        // Ensure all trainers are active
        foreach ($default_data as &$trainer) {
            $trainer['active'] = true;
            $trainer['updated_at'] = current_time('mysql');
        }
        
        $result = update_option(self::DATA_OPTION, $default_data);
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
        }
        
        return $result;
    }
    
    /**
     * Sanitize multiple trainers data
     * 
     * @param array $input Raw trainers data
     * @return array Sanitized data
     */
    public function sanitize_trainers_data($input) {
        $sanitized_input = array();
        
        if (is_array($input)) {
            foreach ($input as $index => $trainer) {
                $sanitized_input[$index] = $this->sanitize_trainer_data($trainer, $index);
            }
        }
        
        return $sanitized_input;
    }
    
    /**
     * Sanitize single trainer data
     * 
     * @param array $trainer Raw trainer data
     * @param int $index Trainer index
     * @return array Sanitized trainer data
     */
    public function sanitize_trainer_data($trainer, $index = 0) {
        return array(
            'id'               => absint($trainer['id'] ?? $index + 1),
            'name'             => sanitize_text_field($trainer['name'] ?? ''),
            'specialty'        => sanitize_text_field($trainer['specialty'] ?? ''),
            'bio'              => wp_kses_post($trainer['bio'] ?? ''),
            'image_url'        => esc_url_raw($trainer['image_url'] ?? ''),
            'years_experience' => max(0, absint($trainer['years_experience'] ?? 0)),
            'clients_count'    => max(0, absint($trainer['clients_count'] ?? 0)),
            'featured'         => !empty($trainer['featured']),
            'active'           => !empty($trainer['active']),
            'coach_type'       => sanitize_text_field($trainer['coach_type'] ?? 'strength'),
            'video_title'      => sanitize_text_field($trainer['video_title'] ?? ''),
            'video_url'        => esc_url_raw($trainer['video_url'] ?? ''),
            'video_poster'     => esc_url_raw($trainer['video_poster'] ?? ''),
            'order'            => absint($trainer['order'] ?? $index + 1),
            'created_at'       => sanitize_text_field($trainer['created_at'] ?? current_time('mysql')),
            'updated_at'       => current_time('mysql')
        );
    }
    
    /**
     * Get default trainer data
     * 
     * @return array Default trainer data
     */
    public function get_default_data() {
        return array(
            array(
                'id' => 1,
                'name' => 'Justin Fassio',
                'specialty' => 'Strength & Conditioning',
                'bio' => 'Specialized in transforming physiques through science-based training protocols. Justin has helped over 200 clients achieve their fitness goals.',
                'image_url' => '',
                'years_experience' => 8,
                'clients_count' => 178,
                'featured' => true,
                'active' => true,
                'coach_type' => 'strength',
                'video_title' => 'High-Intensity Workout Demo',
                'video_url' => 'https://www.youtube.com/embed/L27wfHkk2O8',
                'video_poster' => '',
                'order' => 1,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ),
            array(
                'id' => 2,
                'name' => 'Morgan Chen',
                'specialty' => 'Nutrition & Weight Loss',
                'bio' => 'Certified nutritionist and weight management specialist. Morgan creates personalized diet plans that complement your training regimen.',
                'image_url' => '',
                'years_experience' => 6,
                'clients_count' => 152,
                'featured' => false,
                'active' => true,
                'coach_type' => 'nutrition',
                'video_title' => '',
                'video_url' => '',
                'video_poster' => '',
                'order' => 2,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ),
            array(
                'id' => 3,
                'name' => 'Jordan Smith',
                'specialty' => 'Athletic Performance',
                'bio' => 'Former professional athlete who now trains competitors at all levels. Specializes in sport-specific training and performance enhancement.',
                'image_url' => '',
                'years_experience' => 10,
                'clients_count' => 215,
                'featured' => false,
                'active' => true,
                'coach_type' => 'performance',
                'video_title' => '',
                'video_url' => '',
                'video_poster' => '',
                'order' => 3,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ),
            array(
                'id' => 4,
                'name' => 'Taylor Martinez',
                'specialty' => 'Group Class Instruction',
                'bio' => 'Lead group fitness instructor specializing in HIIT, yoga, and dance cardio classes. Taylor creates energetic group experiences that motivate and inspire.',
                'image_url' => '',
                'years_experience' => 7,
                'clients_count' => 240,
                'featured' => false,
                'active' => true,
                'coach_type' => 'performance',
                'video_title' => 'Group Class Energy Demo',
                'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'video_poster' => '',
                'order' => 4,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ),
            array(
                'id' => 5,
                'name' => 'Alex Rivera',
                'specialty' => 'Recovery & Wellness',
                'bio' => 'Certified massage therapist and recovery specialist. Alex focuses on injury prevention, mobility work, and helping athletes optimize their recovery for peak performance.',
                'image_url' => '',
                'years_experience' => 5,
                'clients_count' => 120,
                'featured' => false,
                'active' => true,
                'coach_type' => 'recovery',
                'video_title' => 'Recovery Techniques Demo',
                'video_url' => 'https://www.youtube.com/embed/E1xkXZs0cAQ',
                'video_poster' => '',
                'order' => 5,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            )
        );
    }
    
    /**
     * Validate trainer data
     * 
     * @param array $trainer Trainer data
     * @return array Validation errors (empty if valid)
     */
    public function validate_trainer($trainer) {
        $errors = array();
        
        if (empty($trainer['name'])) {
            $errors[] = 'Trainer name is required';
        }
        
        if (empty($trainer['specialty'])) {
            $errors[] = 'Trainer specialty is required';
        }
        
        if (!empty($trainer['video_url']) && !filter_var($trainer['video_url'], FILTER_VALIDATE_URL)) {
            $errors[] = 'Video URL is not valid';
        }
        
        if (!empty($trainer['image_url']) && !filter_var($trainer['image_url'], FILTER_VALIDATE_URL)) {
            $errors[] = 'Image URL is not valid';
        }
        
        return $errors;
    }
    
    /**
     * Get trainer statistics
     * 
     * @return array Statistics data
     */
    public function get_statistics() {
        $all_trainers = $this->get_trainers();
        $active_trainers = $this->get_trainers(true);
        
        return array(
            'total_count' => count($all_trainers),
            'active_count' => count($active_trainers),
            'inactive_count' => count($all_trainers) - count($active_trainers),
            'featured_count' => count(array_filter($all_trainers, function($t) { return !empty($t['featured']); })),
            'last_updated' => get_option(self::LAST_UPDATED_OPTION, 'never')
        );
    }
    
    /**
     * Get settings data
     * 
     * @return array Settings data
     */
    public function get_settings() {
        return get_option(self::SETTINGS_OPTION, array(
            'section_title' => 'Personal Trainers',
            'section_subtitle' => 'Work directly with our certified fitness professionals',
            'show_featured_trainer' => true,
            'show_group_instructor' => true,
            'max_display_count' => -1,
            'cta_enabled' => true,
            'cta_title' => 'Ready to Start Your Fitness Journey?',
            'cta_subtitle' => 'Our expert trainers are here to guide you every step of the way. Whether you\'re just starting out or looking to reach new heights, we\'ll create a personalized plan that fits your goals and lifestyle.',
            'cta_button_text' => 'Book Your Free Consultation',
            'cta_button_url' => '#contact',
            'cta_background_color' => '#1a1a1a',
            'cta_text_color' => '#ffffff',
            'cta_icon_type' => 'lucide', // 'lucide', 'logo', or 'none'
            'cta_lucide_icon' => 'Users', // Default Lucide icon name
            'cta_logo_url' => '', // Custom logo URL
        ));
    }

    /**
     * Save settings data
     * 
     * @param array $settings Raw settings data
     * @return bool Success status
     */
    public function save_settings($settings) {
        $sanitized_settings = $this->sanitize_settings_data($settings);
        $result = update_option(self::SETTINGS_OPTION, $sanitized_settings);
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
        }
        
        return $result;
    }

    /**
     * Sanitize settings data
     * 
     * @param array $settings Raw settings data
     * @return array Sanitized settings data
     */
    public function sanitize_settings_data($settings) {
        // Validate icon type
        $valid_icon_types = array('lucide', 'logo', 'none');
        $icon_type = in_array($settings['cta_icon_type'] ?? 'lucide', $valid_icon_types) 
            ? $settings['cta_icon_type'] 
            : 'lucide';

        return array(
            'section_title' => sanitize_text_field($settings['section_title'] ?? 'Personal Trainers'),
            'section_subtitle' => sanitize_textarea_field($settings['section_subtitle'] ?? ''),
            'show_featured_trainer' => !empty($settings['show_featured_trainer']),
            'show_group_instructor' => !empty($settings['show_group_instructor']),
            'max_display_count' => absint($settings['max_display_count'] ?? -1),
            'cta_enabled' => !empty($settings['cta_enabled']),
            'cta_title' => sanitize_text_field($settings['cta_title'] ?? 'Ready to Start Your Fitness Journey?'),
            'cta_subtitle' => sanitize_textarea_field($settings['cta_subtitle'] ?? ''),
            'cta_button_text' => sanitize_text_field($settings['cta_button_text'] ?? 'Book Your Free Consultation'),
            'cta_button_url' => esc_url_raw($settings['cta_button_url'] ?? '#contact'),
            'cta_background_color' => sanitize_hex_color($settings['cta_background_color'] ?? '#1a1a1a'),
            'cta_text_color' => sanitize_hex_color($settings['cta_text_color'] ?? '#ffffff'),
            'cta_icon_type' => $icon_type,
            'cta_lucide_icon' => sanitize_text_field($settings['cta_lucide_icon'] ?? 'Users'),
            'cta_logo_url' => esc_url_raw($settings['cta_logo_url'] ?? ''),
        );
    }
} 