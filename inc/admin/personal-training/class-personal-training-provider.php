<?php
/**
 * FitCopilot Personal Training Data Provider
 * 
 * Handles frontend data integration for Personal Training
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Personal Training Data Provider Class
 * 
 * Manages data flow from WordPress admin to frontend React components
 */
class FitCopilot_Personal_Training_Provider {
    
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
     * Initialize frontend data provider
     */
    public function init() {
        // REMOVED: Duplicate hook registration
        // The base FitCopilot_Admin_Manager_Base class already registers this hook
        // add_action('wp_enqueue_scripts', array($this, 'provide_frontend_data'), 20);
        
        // Data provider is now called through: 
        // Base class hook → Manager::provide_frontend_data() → Provider::provide_frontend_data()
    }
    
    /**
     * Provide personal training data for frontend
     */
    public function provide_frontend_data() {
        $data = $this->data_manager->get_trainers();
        
        // Filter only active trainers for frontend
        $active_trainers = $this->data_manager->get_trainers(true);
        
        // Get section settings
        $settings = $this->data_manager->get_settings();
        
        // Prepare data for React components
        $frontend_data = array(
            'trainers' => array_values($active_trainers), // Reset array keys
            'settings' => $settings,
            'meta' => array(
                'total_count' => count($data),
                'active_count' => count($active_trainers),
                'last_updated' => get_option('fitcopilot_personal_training_last_updated', time())
            )
        );
        
        // Localize script data for React
        wp_localize_script(
            'fitcopilot-homepage',              // Frontend script handle
            'fitcopilotPersonalTrainingData',   // JavaScript global variable
            $frontend_data                      // Data payload
        );
        
        // Debug logging (remove in production)
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('FitCopilot Personal Training Data Provider: ' . json_encode(array(
                'total_items' => count($data),
                'active_items' => count($active_trainers),
                'data_structure' => array_keys($frontend_data),
                'script_handle_exists' => wp_script_is('fitcopilot-homepage', 'enqueued'),
                'last_updated' => get_option('fitcopilot_personal_training_last_updated', 'never'),
                'trainer_details' => array_map(function($trainer) {
                    return array(
                        'name' => $trainer['name'] ?? 'Unknown',
                        'active' => !empty($trainer['active']),
                        'featured' => !empty($trainer['featured']),
                        'featured_raw' => $trainer['featured'] ?? null
                    );
                }, $active_trainers)
            )));
        }
    }
    
    /**
     * Get frontend-ready trainer data
     * 
     * @return array Frontend-ready data
     */
    public function get_frontend_data() {
        $active_trainers = $this->data_manager->get_trainers(true);
        $settings = $this->data_manager->get_settings();
        
        return array(
            'trainers' => array_values($active_trainers),
            'settings' => $settings,
            'meta' => array(
                'total_count' => count($this->data_manager->get_trainers()),
                'active_count' => count($active_trainers),
                'last_updated' => get_option('fitcopilot_personal_training_last_updated', time())
            )
        );
    }
    
    /**
     * Test frontend data flow
     * 
     * @return array Test results
     */
    public function test_frontend_data() {
        $stats = $this->data_manager->get_statistics();
        $active_trainers = $this->data_manager->get_trainers(true);
        $settings = $this->data_manager->get_settings();
        
        return array(
            'statistics' => $stats,
            'provider_working' => true,
            'settings_exist' => !empty($settings),
            'sample_trainer' => !empty($active_trainers) ? array(
                'name' => $active_trainers[0]['name'] ?? 'Unknown',
                'specialty' => $active_trainers[0]['specialty'] ?? 'Unknown',
                'active' => $active_trainers[0]['active'] ?? false
            ) : null,
            'data_structure' => array_keys($this->data_manager->get_trainers()[0] ?? array()),
            'frontend_data_format' => array(
                'trainers' => array_values($active_trainers),
                'settings' => $settings,
                'meta' => $stats
            )
        );
    }
} 