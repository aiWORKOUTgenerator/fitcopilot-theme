<?php
/**
 * FitCopilot Training Features Data Manager
 * 
 * Handles all training features data operations, sanitization, and validation
 * Extends database functionality beyond options-based storage used in Personal Training
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Features Data Manager Class
 * 
 * Manages training features data CRUD operations and validation
 * Uses custom database table for enhanced functionality over Personal Training pattern
 */
class FitCopilot_Training_Features_Data {
    
    /**
     * Database table name
     */
    private $table_name;
    
    /**
     * WordPress Options storage keys (following Personal Training pattern exactly)
     */
    const DATA_OPTION = 'fitcopilot_training_features_data';
    const SETTINGS_OPTION = 'fitcopilot_training_features_settings';
    const LAST_UPDATED_OPTION = 'fitcopilot_training_features_last_updated';
    
    /**
     * Constructor
     */
    public function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'fitcopilot_training_features';
    }
    
    /**
     * Get all training features data
     * Following Personal Training hybrid pattern - Options first, Database fallback
     * 
     * @param bool $active_only Whether to return only active features
     * @return array Training features data
     */
    public function get_features($active_only = false) {
        // Try WordPress Options first (Personal Training pattern)
        $options_data = get_option(self::DATA_OPTION, false);
        
        if ($options_data !== false && !empty($options_data)) {
            return $this->filter_active_features($options_data, $active_only);
        }
        
        // Fallback to database (existing pattern)
        return $this->get_features_from_database($active_only);
    }
    
    /**
     * Get features from WordPress Options (Personal Training pattern)
     * 
     * @param bool $active_only Whether to return only active features
     * @return array Features data
     */
    public function get_features_from_options($active_only = false) {
        $data = get_option(self::DATA_OPTION, $this->get_default_data());
        return $this->filter_active_features($data, $active_only);
    }
    
    /**
     * Get features from database (existing pattern)
     * 
     * @param bool $active_only Whether to return only active features
     * @return array Features data
     */
    public function get_features_from_database($active_only = false) {
        global $wpdb;
        
        $where_clause = $active_only ? 'WHERE is_active = 1' : '';
        $order_clause = 'ORDER BY display_order ASC, id ASC';
        
        $sql = "SELECT * FROM {$this->table_name} {$where_clause} {$order_clause}";
        
        $results = $wpdb->get_results($sql, ARRAY_A);
        
        if (empty($results)) {
            return array();
        }
        
        // Process results for compatibility with frontend
        return array_map(array($this, 'process_feature_data'), $results);
    }
    
    /**
     * Filter features by active status
     * 
     * @param array $features Features data
     * @param bool $active_only Whether to return only active features
     * @return array Filtered features
     */
    private function filter_active_features($features, $active_only = false) {
        if ($active_only) {
            return array_filter($features, function($feature) {
                return !empty($feature['is_active']);
            });
        }
        
        return $features;
    }
    
    /**
     * Get single training feature by index (Personal Training pattern)
     * 
     * @param int $index Feature index
     * @return array|null Feature data or null if not found
     */
    public function get_feature($index) {
        $features = $this->get_features();
        return isset($features[$index]) ? $features[$index] : null;
    }
    
    /**
     * Get single training feature by ID (database pattern)
     * 
     * @param int $id Feature ID
     * @return array|null Feature data or null if not found
     */
    public function get_feature_by_id($id) {
        global $wpdb;
        
        $sql = $wpdb->prepare("SELECT * FROM {$this->table_name} WHERE id = %d", $id);
        $result = $wpdb->get_row($sql, ARRAY_A);
        
        return $result ? $this->process_feature_data($result) : null;
    }
    
    /**
     * Save all training features data
     * 
     * @param array $features_data Raw features data
     * @return bool Success status
     */
    public function save_features($features_data) {
        if (!is_array($features_data)) {
            return false;
        }
        
        $success_count = 0;
        
        foreach ($features_data as $index => $feature_data) {
            if (isset($feature_data['id']) && !empty($feature_data['id'])) {
                // Update existing feature
                $result = $this->save_feature($feature_data['id'], $feature_data);
            } else {
                // Create new feature
                $result = $this->create_feature($feature_data);
            }
            
            if ($result) {
                $success_count++;
            }
        }
        
        if ($success_count > 0) {
            update_option(self::LAST_UPDATED_OPTION, time());
            return true;
        }
        
        return false;
    }
    

    
    /**
     * Save individual feature (Personal Training pattern exactly)
     * 
     * @param int $index Feature index
     * @param array $feature_data Raw feature data
     * @return bool Success status
     */
    public function save_feature($index, $feature_data) {
        $current_features = $this->get_features_from_options();
        $sanitized_feature = $this->sanitize_feature_data($feature_data, $index);
        
        if (isset($current_features[$index])) {
            $current_features[$index] = $sanitized_feature;
        } else {
            $current_features[] = $sanitized_feature;
        }
        
        $result = update_option(self::DATA_OPTION, $current_features);
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
        }
        
        return $result;
    }
    
    /**
     * Save training feature by ID (database operations)
     * 
     * @param int $id Feature ID
     * @param array $feature_data Raw feature data
     * @return bool Success status
     */
    public function save_feature_by_id($id, $feature_data) {
        global $wpdb;
        
        $sanitized_data = $this->sanitize_feature_data($feature_data, $id);
        
        // Remove ID from data for update
        unset($sanitized_data['id']);
        
        $result = $wpdb->update(
            $this->table_name,
            $sanitized_data,
            array('id' => $id),
            $this->get_data_format(),
            array('%d')
        );
        
        if ($result !== false) {
            update_option(self::LAST_UPDATED_OPTION, time());
            return true;
        }
        
        return false;
    }
    
    /**
     * Create new training feature
     * 
     * @param array $feature_data Raw feature data
     * @return int|false New feature ID or false on failure
     */
    public function create_feature($feature_data) {
        global $wpdb;
        
        $sanitized_data = $this->sanitize_feature_data($feature_data);
        
        // Remove ID for insert
        unset($sanitized_data['id']);
        
        $result = $wpdb->insert(
            $this->table_name,
            $sanitized_data,
            $this->get_data_format()
        );
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
            return $wpdb->insert_id;
        }
        
        return false;
    }
    
    /**
     * Delete feature by index (Personal Training pattern)
     * 
     * @param int $index Feature index
     * @return bool Success status
     */
    public function delete_feature($index) {
        $features = $this->get_features_from_options();
        
        if (isset($features[$index])) {
            unset($features[$index]);
            $features = array_values($features); // Re-index array
            
            $result = update_option(self::DATA_OPTION, $features);
            
            if ($result) {
                update_option(self::LAST_UPDATED_OPTION, time());
            }
            
            return $result;
        }
        
        return false;
    }

    /**
     * Delete feature by ID (database operations)
     * 
     * @param int $feature_id Feature ID
     * @return array|false Success status with details or false
     */
    public function delete_feature_by_id($feature_id) {
        global $wpdb;
        
        $feature_id = absint($feature_id);
        
        // Get feature data before deletion
        $feature = $this->get_feature_by_id($feature_id);
        if (!$feature) {
            return false;
        }
        
        $result = $wpdb->delete(
            $this->table_name,
            array('id' => $feature_id),
            array('%d')
        );
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
            
            return array(
                'success' => true,
                'deleted_feature' => $feature,
                'previous_index' => null, // Would need to calculate if needed
                'remaining_count' => $this->get_features_count()
            );
        }
        
        return false;
    }
    
    /**
     * Reset to default data (Personal Training pattern)
     * 
     * @return bool Success status
     */
    public function reset_to_defaults() {
        $default_data = $this->get_default_data();
        
        // Ensure all features are active
        foreach ($default_data as &$feature) {
            $feature['is_active'] = true;
            $feature['updated_at'] = current_time('mysql');
        }
        
        $result = update_option(self::DATA_OPTION, $default_data);
        
        if ($result) {
            update_option(self::LAST_UPDATED_OPTION, time());
        }
        
        return $result;
    }
    
    /**
     * Get default training features data (Personal Training pattern)
     * 
     * @return array Default features data
     */
    public function get_default_data() {
        return array(
            array(
                'id' => 1,
                'title' => 'Live Virtual Sessions',
                'description' => 'Real-time coaching and feedback from anywhere in the world.',
                'feature_type' => 'technology',
                'difficulty_level' => 'beginner',
                'duration_minutes' => 60,
                'image_url' => '/wp-content/themes/fitcopilot/src/features/Homepage/TrainingFeatures/media/videos/drone-video-poster.jpg',
                'video_url' => '/wp-content/themes/fitcopilot/src/features/Homepage/TrainingFeatures/media/videos/Drone Video 3.mp4',
                'icon_type' => 'lucide',
                'icon_name' => 'Video',
                'gradient_class' => 'from-lime-300 to-emerald-400',
                'flip_front_text' => 'Get expert coaching from anywhere with our high-quality video platform.',
                'flip_back_title' => 'Live Virtual Session',
                'flip_back_details' => 'HD video with crystal clear audio|Screen sharing for technique analysis|Record sessions for later review|Works on any device',
                'display_order' => 1,
                'is_featured' => 1,
                'is_active' => 1,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            ),
            array(
                'id' => 2,
                'title' => 'Flexible Scheduling',
                'description' => 'Book sessions when it works for you with easy rescheduling.',
                'feature_type' => 'convenience',
                'difficulty_level' => 'beginner',
                'duration_minutes' => 0,
                'image_url' => '/assets/features/calendar.jpg',
                'icon_type' => 'lucide',
                'icon_name' => 'Calendar',
                'gradient_class' => 'from-cyan-300 to-blue-400',
                'flip_front_text' => 'Life gets busy. Our flexible scheduling adapts to your changing needs.',
                'flip_back_title' => 'Smart Calendar',
                'flip_back_details' => '24/7 online booking system|Automated reminders and notifications|Easy rescheduling with no fees|Time zone intelligent',
                'display_order' => 2,
                'is_featured' => 0,
                'is_active' => 1,
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            )
        );
    }
    
    /**
     * Get features count
     * 
     * @param bool $active_only Count only active features
     * @return int Features count
     */
    public function get_features_count($active_only = false) {
        global $wpdb;
        
        $where_clause = $active_only ? 'WHERE is_active = 1' : '';
        $sql = "SELECT COUNT(*) FROM {$this->table_name} {$where_clause}";
        
        return (int) $wpdb->get_var($sql);
    }
    
    /**
     * Sanitize training feature data
     * 
     * @param array $feature Raw feature data
     * @param int $id Feature ID (for updates)
     * @return array Sanitized data
     */
    public function sanitize_feature_data($feature, $id = 0) {
        $sanitized = array();
        
        // Text fields
        $sanitized['title'] = sanitize_text_field($feature['title'] ?? '');
        $sanitized['description'] = wp_kses_post($feature['description'] ?? '');
        $sanitized['feature_type'] = sanitize_text_field($feature['feature_type'] ?? 'general');
        $sanitized['flip_front_text'] = wp_kses_post($feature['flip_front_text'] ?? '');
        $sanitized['flip_back_title'] = sanitize_text_field($feature['flip_back_title'] ?? '');
        $sanitized['flip_back_details'] = wp_kses_post($feature['flip_back_details'] ?? '');
        $sanitized['cta_text'] = sanitize_text_field($feature['cta_text'] ?? '');
        $sanitized['icon_name'] = sanitize_text_field($feature['icon_name'] ?? 'Star');
        $sanitized['gradient_class'] = sanitize_text_field($feature['gradient_class'] ?? 'from-lime-300 to-emerald-400');
        
        // URL fields
        $sanitized['image_url'] = esc_url_raw($feature['image_url'] ?? '');
        $sanitized['video_url'] = esc_url_raw($feature['video_url'] ?? '');
        $sanitized['video_poster'] = esc_url_raw($feature['video_poster'] ?? '');
        $sanitized['cta_url'] = esc_url_raw($feature['cta_url'] ?? '');
        
        // Enum fields
        $valid_difficulties = array('beginner', 'intermediate', 'advanced');
        $sanitized['difficulty_level'] = in_array($feature['difficulty_level'] ?? '', $valid_difficulties) 
            ? $feature['difficulty_level'] 
            : 'beginner';
        
        $valid_icon_types = array('lucide', 'custom', 'emoji');
        $sanitized['icon_type'] = in_array($feature['icon_type'] ?? '', $valid_icon_types) 
            ? $feature['icon_type'] 
            : 'lucide';
        
        // Numeric fields
        $sanitized['duration_minutes'] = absint($feature['duration_minutes'] ?? 0);
        $sanitized['display_order'] = absint($feature['display_order'] ?? 0);
        
        // Boolean fields
        $sanitized['is_featured'] = !empty($feature['is_featured']) ? 1 : 0;
        $sanitized['is_active'] = !empty($feature['is_active']) ? 1 : 0;
        
        // ID field for updates
        if ($id > 0) {
            $sanitized['id'] = absint($id);
        }
        
        return $sanitized;
    }
    
    /**
     * Process feature data for frontend compatibility
     * 
     * @param array $feature Raw database feature data
     * @return array Processed feature data
     */
    private function process_feature_data($feature) {
        // Convert flip_back_details from pipe-separated to array
        if (!empty($feature['flip_back_details'])) {
            $feature['flip_back_details_array'] = explode('|', $feature['flip_back_details']);
        } else {
            $feature['flip_back_details_array'] = array();
        }
        
        // Ensure boolean fields are properly typed
        $feature['is_featured'] = (bool) $feature['is_featured'];
        $feature['is_active'] = (bool) $feature['is_active'];
        
        return $feature;
    }
    
    /**
     * Get data format array for wpdb operations
     * 
     * @return array Format specifications
     */
    private function get_data_format() {
        return array(
            '%s', // title
            '%s', // description
            '%s', // feature_type
            '%s', // difficulty_level
            '%d', // duration_minutes
            '%s', // image_url
            '%s', // video_url
            '%s', // video_poster
            '%s', // icon_type
            '%s', // icon_name
            '%s', // gradient_class
            '%s', // flip_front_text
            '%s', // flip_back_title
            '%s', // flip_back_details
            '%s', // cta_text
            '%s', // cta_url
            '%d', // display_order
            '%d', // is_featured
            '%d', // is_active
        );
    }
    
    /**
     * Validate feature data
     * 
     * @param array $feature Feature data to validate
     * @return array|true Validation errors or true if valid
     */
    public function validate_feature($feature) {
        $errors = array();
        
        // Required fields validation
        if (empty($feature['title'])) {
            $errors[] = 'Feature Title is required and cannot be empty.';
        }
        
        if (empty($feature['description'])) {
            $errors[] = 'Feature Description is required and cannot be empty.';
        }
        
        // URL validation with specific feedback
        if (!empty($feature['image_url'])) {
            $image_url = trim($feature['image_url']);
            if (!filter_var($image_url, FILTER_VALIDATE_URL)) {
                $errors[] = "Image URL is invalid: '{$image_url}'. Please enter a valid URL starting with http:// or https://";
            } elseif (!$this->is_valid_image_url($image_url)) {
                $errors[] = "Image URL does not appear to be a valid image: '{$image_url}'. Please use URLs ending in .jpg, .jpeg, .png, .gif, .webp, or .svg";
            }
        }
        
        if (!empty($feature['video_url'])) {
            $video_url = trim($feature['video_url']);
            if (!filter_var($video_url, FILTER_VALIDATE_URL)) {
                $errors[] = "Video URL is invalid: '{$video_url}'. Please enter a valid URL starting with http:// or https://";
            } elseif (!$this->is_valid_video_url($video_url)) {
                $errors[] = "Video URL does not appear to be a valid video: '{$video_url}'. Please use YouTube, Vimeo, or direct video file URLs (.mp4, .webm, .ogg)";
            }
        }
        
        if (!empty($feature['video_poster'])) {
            $poster_url = trim($feature['video_poster']);
            if (!filter_var($poster_url, FILTER_VALIDATE_URL)) {
                $errors[] = "Video Poster URL is invalid: '{$poster_url}'. Please enter a valid URL starting with http:// or https://";
            } elseif (!$this->is_valid_image_url($poster_url)) {
                $errors[] = "Video Poster URL does not appear to be a valid image: '{$poster_url}'. Please use URLs ending in .jpg, .jpeg, .png, .gif, .webp, or .svg";
            }
        }
        
        if (!empty($feature['cta_url'])) {
            $cta_url = trim($feature['cta_url']);
            if (!filter_var($cta_url, FILTER_VALIDATE_URL)) {
                $errors[] = "CTA Button URL is invalid: '{$cta_url}'. Please enter a valid URL starting with http:// or https://";
            }
        }
        
        // Numeric validation with specific feedback
        if (isset($feature['duration_minutes'])) {
            $duration = intval($feature['duration_minutes']);
            if ($duration < 0) {
                $errors[] = "Duration cannot be negative. Please enter 0 or a positive number of minutes.";
            } elseif ($duration > 1440) { // 24 hours
                $errors[] = "Duration seems too long ({$duration} minutes). Please enter a reasonable duration (max 1440 minutes = 24 hours).";
            }
        }
        
        // Text length validation
        if (!empty($feature['title']) && strlen($feature['title']) > 100) {
            $errors[] = "Feature Title is too long (" . strlen($feature['title']) . " characters). Please keep it under 100 characters.";
        }
        
        if (!empty($feature['description']) && strlen($feature['description']) > 500) {
            $errors[] = "Feature Description is too long (" . strlen($feature['description']) . " characters). Please keep it under 500 characters.";
        }
        
        // Validate feature type
        if (!empty($feature['feature_type'])) {
            $valid_types = array('general', 'strength', 'cardio', 'flexibility', 'nutrition', 'technology', 'community');
            if (!in_array($feature['feature_type'], $valid_types)) {
                $errors[] = "Feature Type '{$feature['feature_type']}' is not valid. Please select from: " . implode(', ', $valid_types);
            }
        }
        
        // Validate difficulty level
        if (!empty($feature['difficulty_level'])) {
            $valid_levels = array('beginner', 'intermediate', 'advanced', 'expert');
            if (!in_array($feature['difficulty_level'], $valid_levels)) {
                $errors[] = "Difficulty Level '{$feature['difficulty_level']}' is not valid. Please select from: " . implode(', ', $valid_levels);
            }
        }
        
        return empty($errors) ? true : $errors;
    }
    
    /**
     * Check if URL appears to be a valid image
     * 
     * @param string $url URL to check
     * @return bool True if appears to be valid image URL
     */
    private function is_valid_image_url($url) {
        $image_extensions = array('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg');
        $url_lower = strtolower($url);
        
        foreach ($image_extensions as $ext) {
            if (strpos($url_lower, $ext) !== false) {
                return true;
            }
        }
        
        // Check for common image hosting patterns
        $image_hosts = array('imgur.com', 'cloudinary.com', 'unsplash.com', 'pexels.com', 'pixabay.com');
        foreach ($image_hosts as $host) {
            if (strpos($url_lower, $host) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Check if URL appears to be a valid video
     * 
     * @param string $url URL to check
     * @return bool True if appears to be valid video URL
     */
    private function is_valid_video_url($url) {
        $video_extensions = array('.mp4', '.webm', '.ogg', '.avi', '.mov');
        $url_lower = strtolower($url);
        
        // Check for direct video file extensions
        foreach ($video_extensions as $ext) {
            if (strpos($url_lower, $ext) !== false) {
                return true;
            }
        }
        
        // Check for video hosting platforms
        $video_hosts = array('youtube.com', 'youtu.be', 'vimeo.com', 'wistia.com', 'brightcove.com');
        foreach ($video_hosts as $host) {
            if (strpos($url_lower, $host) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Get statistics about training features
     * 
     * @return array Statistics data
     */
    public function get_statistics() {
        global $wpdb;
        
        $stats = array(
            'total' => $this->get_features_count(),
            'active' => $this->get_features_count(true),
            'featured' => $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_name} WHERE is_featured = 1"),
            'by_type' => array(),
            'by_difficulty' => array()
        );
        
        // Get counts by type
        $type_results = $wpdb->get_results("
            SELECT feature_type, COUNT(*) as count 
            FROM {$this->table_name} 
            GROUP BY feature_type
        ", ARRAY_A);
        
        foreach ($type_results as $row) {
            $stats['by_type'][$row['feature_type']] = (int) $row['count'];
        }
        
        // Get counts by difficulty
        $difficulty_results = $wpdb->get_results("
            SELECT difficulty_level, COUNT(*) as count 
            FROM {$this->table_name} 
            GROUP BY difficulty_level
        ", ARRAY_A);
        
        foreach ($difficulty_results as $row) {
            $stats['by_difficulty'][$row['difficulty_level']] = (int) $row['count'];
        }
        
        return $stats;
    }
    
    // ===== SETTINGS MANAGEMENT (Following Personal Training Pattern) =====
    
    /**
     * Get section settings
     * 
     * @return array Settings data
     */
    public function get_settings() {
        return get_option(self::SETTINGS_OPTION, $this->get_default_settings());
    }
    
    /**
     * Save section settings
     * 
     * @param array $settings Settings data
     * @return bool Success status
     */
    public function save_settings($settings) {
        try {
            // Log incoming settings for debugging
            error_log('Training Features Data: Incoming settings for sanitization: ' . print_r($settings, true));
            
            // Sanitize settings data
            $sanitized_settings = $this->sanitize_settings_data($settings);
            
            // Log sanitized settings for debugging
            error_log('Training Features Data: Sanitized settings: ' . print_r($sanitized_settings, true));
            
            // Validate that sanitization didn't fail
            if (empty($sanitized_settings)) {
                error_log('Training Features Data: Sanitization returned empty array - this indicates a sanitization failure');
                return false;
            }
            
            // Attempt to save
            $result = update_option(self::SETTINGS_OPTION, $sanitized_settings);
            
            // Log the result
            if ($result) {
                error_log('Training Features Data: Settings saved successfully to option: ' . self::SETTINGS_OPTION);
            } else {
                error_log('Training Features Data: update_option() returned false for option: ' . self::SETTINGS_OPTION);
                
                // Check if the option already exists with the same value
                $current_value = get_option(self::SETTINGS_OPTION);
                if ($current_value === $sanitized_settings) {
                    error_log('Training Features Data: Settings are identical to current value - WordPress returns false for unchanged data');
                    return true; // This is actually success - WordPress returns false when data is unchanged
                }
            }
            
            return $result;
            
        } catch (Exception $e) {
            error_log('Training Features Data: Exception in save_settings: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get default settings
     * 
     * @return array Default settings
     */
    public function get_default_settings() {
        return array(
            'section_title' => 'Comprehensive Training Features',
            'section_description' => 'Our training platform includes everything you need to succeed on your fitness journey, from cutting-edge tools to personalized support.',
            'section_tag_text' => 'Premium Experience',
            'max_display_count' => -1, // -1 = show all
            'layout_columns' => 3,
            'show_featured_first' => true,
            'enable_animations' => true,
            'cta_enabled' => false,
            'cta_title' => '',
            'cta_subtitle' => '',
            'cta_button_text' => 'Explore Features',
            'cta_button_url' => '',
            'cta_background_color' => '',
            'cta_text_color' => '',
            'cta_icon_type' => 'lucide',
            'cta_lucide_icon' => 'ArrowRight',
            'cta_logo_url' => ''
        );
    }
    
    /**
     * Sanitize settings data
     * 
     * @param array $settings Raw settings data
     * @return array Sanitized settings
     */
    public function sanitize_settings_data($settings) {
        $sanitized = array();
        
        // Text fields
        $sanitized['section_title'] = sanitize_text_field($settings['section_title'] ?? '');
        $sanitized['section_description'] = wp_kses_post($settings['section_description'] ?? '');
        $sanitized['section_tag_text'] = sanitize_text_field($settings['section_tag_text'] ?? '');
        $sanitized['cta_title'] = sanitize_text_field($settings['cta_title'] ?? '');
        $sanitized['cta_subtitle'] = wp_kses_post($settings['cta_subtitle'] ?? '');
        $sanitized['cta_button_text'] = sanitize_text_field($settings['cta_button_text'] ?? '');
        $sanitized['cta_lucide_icon'] = sanitize_text_field($settings['cta_lucide_icon'] ?? '');
        
        // URL fields
        $sanitized['cta_button_url'] = esc_url_raw($settings['cta_button_url'] ?? '');
        $sanitized['cta_logo_url'] = esc_url_raw($settings['cta_logo_url'] ?? '');
        
        // Color fields
        $sanitized['cta_background_color'] = $this->sanitize_hex_color($settings['cta_background_color'] ?? '');
        $sanitized['cta_text_color'] = $this->sanitize_hex_color($settings['cta_text_color'] ?? '');
        
        // Numeric fields
        $sanitized['max_display_count'] = intval($settings['max_display_count'] ?? -1);
        $sanitized['layout_columns'] = max(1, min(4, intval($settings['layout_columns'] ?? 3)));
        
        // Boolean fields
        $sanitized['show_featured_first'] = !empty($settings['show_featured_first']);
        $sanitized['enable_animations'] = !empty($settings['enable_animations']);
        $sanitized['cta_enabled'] = !empty($settings['cta_enabled']);
        
        // Enum fields
        $valid_icon_types = array('lucide', 'custom', 'emoji');
        $sanitized['cta_icon_type'] = in_array($settings['cta_icon_type'] ?? '', $valid_icon_types) 
            ? $settings['cta_icon_type'] 
            : 'lucide';
        
        return $sanitized;
    }
    
    /**
     * Sanitize hex color value
     * 
     * @param string $color Hex color value
     * @return string Sanitized hex color or empty string
     */
    private function sanitize_hex_color($color) {
        // Remove any whitespace
        $color = trim($color);
        
        // Return empty string if no color provided
        if (empty($color)) {
            return '';
        }
        
        // Add # if missing
        if (strpos($color, '#') !== 0) {
            $color = '#' . $color;
        }
        
        // Validate hex color format
        if (preg_match('/^#[a-fA-F0-9]{6}$/', $color)) {
            return $color;
        }
        
        // Handle 3-character hex colors (expand to 6)
        if (preg_match('/^#[a-fA-F0-9]{3}$/', $color)) {
            $color = '#' . $color[1] . $color[1] . $color[2] . $color[2] . $color[3] . $color[3];
            return $color;
        }
        
        // Invalid color format, return empty string
        return '';
    }
} 