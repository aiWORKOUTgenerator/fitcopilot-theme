<?php
/**
 * FitCopilot Training Features Data Provider
 * 
 * Handles frontend data integration for Training Features
 * Following the established Personal Training Admin provider pattern
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Features Data Provider Class
 * 
 * Manages data flow from WordPress admin to frontend React components
 */
class FitCopilot_Training_Features_Provider {
    
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
     * Initialize frontend data provider
     */
    public function init() {
        // Data provider is called through base class hook pattern:
        // Base class hook → Manager::provide_frontend_data() → Provider::provide_frontend_data()
        // No duplicate hook registration needed
    }
    
    /**
     * Provide training features data for frontend
     * Following the established Personal Training data provision pattern
     */
    public function provide_frontend_data() {
        // Get all training features
        $data = $this->data_manager->get_features();
        
        // Filter only active features for frontend
        $active_features = $this->data_manager->get_features(true);
        
        // Get section settings
        $settings = $this->data_manager->get_settings();
        
        // Apply display limits if configured
        $max_display = $settings['max_display_count'] ?? -1;
        if ($max_display > 0 && count($active_features) > $max_display) {
            $active_features = array_slice($active_features, 0, $max_display);
        }
        
        // Transform data for React component compatibility
        $frontend_features = array_map(array($this, 'transform_feature_for_frontend'), $active_features);
        
        // Prepare data for React components
        $frontend_data = array(
            'features' => array_values($frontend_features), // Reset array keys
            'settings' => array(
                'sectionTitle' => $settings['section_title'] ?? 'Training Features',
                'sectionDescription' => $settings['section_description'] ?? 'Discover our comprehensive training features designed to help you achieve your fitness goals.',
                'gridColumns' => $settings['layout_columns'] ?? 3,
                'cardStyle' => $settings['card_style'] ?? 'default',
                'showDifficulty' => !empty($settings['show_difficulty']),
                'showDuration' => !empty($settings['show_duration']),
                'enableAnimations' => !empty($settings['enable_animations']),
                'ctaEnabled' => !empty($settings['cta_enabled']),
                'ctaTitle' => $settings['cta_title'] ?? '',
                'ctaSubtitle' => $settings['cta_subtitle'] ?? '',
                'ctaButtonText' => $settings['cta_button_text'] ?? 'Explore Features',
                'ctaButtonUrl' => $settings['cta_button_url'] ?? '',
                'ctaBackgroundColor' => $settings['cta_background_color'] ?? '',
                'ctaTextColor' => $settings['cta_text_color'] ?? '',
                'ctaIconType' => $settings['cta_icon_type'] ?? 'lucide',
                'ctaLucideIcon' => $settings['cta_lucide_icon'] ?? 'ArrowRight',
                'ctaLogoUrl' => $settings['cta_logo_url'] ?? ''
            ),
            'meta' => array(
                'total_count' => count($data),
                'active_count' => count($active_features),
                'display_count' => count($frontend_features),
                'last_updated' => get_option('fitcopilot_training_features_last_updated', time())
            )
        );
        
        // Localize script data for React
        wp_localize_script(
            'fitcopilot-homepage',                    // Frontend script handle
            'fitcopilotTrainingFeaturesData',         // JavaScript global variable
            $frontend_data                            // Data payload
        );
        
        // Debug logging (remove in production)
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('Training Features Data Provider: Provided ' . count($frontend_features) . ' features to frontend');
        }
    }
    
    /**
     * Transform feature data for frontend compatibility
     * Converts database fields to React component expected format
     * 
     * @param array $feature Database feature record
     * @return array Transformed feature for frontend
     */
    private function transform_feature_for_frontend($feature) {
        return array(
            'id' => (int) $feature['id'],
            'title' => $feature['title'],
            'description' => $feature['description'],
            'featureType' => $feature['feature_type'],
            'difficultyLevel' => $feature['difficulty_level'],
            'durationMinutes' => (int) $feature['duration_minutes'],
            'imageUrl' => $feature['image_url'],
            'videoUrl' => $feature['video_url'],
            'videoPoster' => $feature['video_poster'],
            'icon' => array(
                'type' => $feature['icon_type'],
                'name' => $feature['icon_name']
            ),
            'gradientClass' => $feature['gradient_class'],
            'flipCard' => array(
                'frontText' => $feature['flip_front_text'],
                'backTitle' => $feature['flip_back_title'],
                'backDetails' => $feature['flip_back_details']
            ),
            'cta' => array(
                'text' => $feature['cta_text'],
                'url' => $feature['cta_url']
            ),
            'displayOrder' => (int) $feature['display_order'],
            'isFeatured' => (bool) $feature['is_featured'],
            'isActive' => (bool) $feature['is_active']
        );
    }
    
    /**
     * Get feature statistics for admin interface
     * 
     * @return array Feature statistics
     */
    public function get_feature_statistics() {
        $features = $this->data_manager->get_features();
        $active_features = $this->data_manager->get_features(true);
        
        $stats = array(
            'total' => count($features),
            'active' => count($active_features),
            'inactive' => count($features) - count($active_features),
            'featured' => count(array_filter($features, function($f) { return !empty($f['is_featured']); })),
            'by_type' => array(),
            'by_difficulty' => array(
                'beginner' => 0,
                'intermediate' => 0,
                'advanced' => 0
            )
        );
        
        // Calculate type distribution
        foreach ($features as $feature) {
            $type = $feature['feature_type'] ?? 'general';
            $difficulty = $feature['difficulty_level'] ?? 'beginner';
            
            if (!isset($stats['by_type'][$type])) {
                $stats['by_type'][$type] = 0;
            }
            $stats['by_type'][$type]++;
            $stats['by_difficulty'][$difficulty]++;
        }
        
        return $stats;
    }
    
    /**
     * Validate frontend data structure
     * Ensures data integrity before sending to React components
     * 
     * @param array $feature Feature data to validate
     * @return bool True if valid, false otherwise
     */
    private function validate_frontend_feature($feature) {
        $required_fields = array('id', 'title', 'description', 'featureType');
        
        foreach ($required_fields as $field) {
            if (empty($feature[$field])) {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log("Training Features Provider: Missing required field '$field' in feature ID " . ($feature['id'] ?? 'unknown'));
                }
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Get localized script data for JavaScript access
     * Provides admin-side data for testing and debugging
     * 
     * @return array Localized script data
     */
    public function get_admin_script_data() {
        return array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('fitcopilot_training_features_ajax'),
            'messages' => array(
                'saving' => __('Saving...', 'fitcopilot'),
                'saved' => __('✅ Saved!', 'fitcopilot'),
                'error' => __('❌ Error saving', 'fitcopilot'),
                'confirm_delete' => __('Are you sure you want to delete this feature?', 'fitcopilot'),
                'confirm_reset' => __('Are you sure you want to reset all features to defaults? This cannot be undone.', 'fitcopilot')
            ),
            'limits' => array(
                'max_title_length' => 255,
                'max_description_length' => 1000,
                'max_duration_minutes' => 300
            ),
            'statistics' => $this->get_feature_statistics()
        );
    }
} 