<?php
/**
 * FitCopilot Personal Training AJAX Handler
 * 
 * Handles all AJAX requests for Personal Training admin functionality
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Personal Training AJAX Handler Class
 * 
 * Manages all AJAX endpoints for trainer management
 */
class FitCopilot_Personal_Training_Ajax {
    
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
     * Initialize AJAX hooks
     */
    public function init() {
        add_action('wp_ajax_save_individual_trainer', array($this, 'save_individual_trainer'));
        add_action('wp_ajax_test_personal_training_frontend_data', array($this, 'test_frontend_data'));
        add_action('wp_ajax_reset_personal_training_defaults', array($this, 'reset_defaults'));
        add_action('wp_ajax_delete_trainer', array($this, 'delete_trainer'));
        add_action('wp_ajax_delete_trainer_by_id', array($this, 'delete_trainer_by_id'));
    }
    
    /**
     * AJAX handler for saving individual trainer
     */
    public function save_individual_trainer() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            // Validate required data
            if (!isset($_POST['trainer_data']) || !isset($_POST['trainer_index'])) {
                $this->send_error('Missing required data');
            }
            
            $trainer_data = $_POST['trainer_data'];
            $trainer_index = intval($_POST['trainer_index']);
            
            // Debug logging
            $this->log_debug('Individual Save Request', array(
                'trainer_index' => $trainer_index,
                'trainer_data' => $trainer_data,
                'data_keys' => array_keys($trainer_data)
            ));
            
            // Validate trainer data
            $validation_errors = $this->data_manager->validate_trainer($trainer_data);
            if (!empty($validation_errors)) {
                $this->send_error('Validation failed: ' . implode(', ', $validation_errors));
            }
            
            // Save trainer
            $result = $this->data_manager->save_trainer($trainer_index, $trainer_data);
            
            if ($result) {
                $this->send_success('Trainer saved successfully!', array(
                    'trainer_name' => $trainer_data['name'] ?? 'Unknown',
                    'trainer_id' => $trainer_data['id'] ?? $trainer_index + 1,
                    'updated_at' => current_time('mysql'),
                    'active_status' => !empty($trainer_data['active']) ? 'active' : 'inactive',
                                         'operation' => ($this->data_manager->get_trainer($trainer_index) !== null) ? 'update' : 'create'
                ));
            } else {
                $this->send_error('Failed to save trainer data to database');
            }
            
        } catch (Exception $e) {
            $this->log_error('Save Individual Trainer Error: ' . $e->getMessage());
            $this->send_error('An unexpected error occurred: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for testing frontend data flow
     */
    public function test_frontend_data() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            // Get statistics and test data
            $stats = $this->data_manager->get_statistics();
            $active_trainers = $this->data_manager->get_trainers(true);
            
            // Test data provider function
            $provider_exists = function_exists('fitcopilot_provide_personal_training_data_for_frontend');
            
            $test_data = array(
                'statistics' => $stats,
                'provider_working' => $provider_exists,
                'sample_trainer' => !empty($active_trainers) ? array(
                    'name' => $active_trainers[0]['name'] ?? 'Unknown',
                    'specialty' => $active_trainers[0]['specialty'] ?? 'Unknown',
                    'active' => $active_trainers[0]['active'] ?? false
                ) : null,
                'frontend_data_format' => array(
                    'trainers' => array_values($active_trainers),
                    'settings' => get_option(FitCopilot_Personal_Training_Data::SETTINGS_OPTION, array()),
                    'meta' => $stats
                )
            );
            
            $this->send_success('Frontend data test completed', $test_data);
            
        } catch (Exception $e) {
            $this->log_error('Test Frontend Data Error: ' . $e->getMessage());
            $this->send_error('Test failed: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for resetting to defaults
     */
    public function reset_defaults() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            // Reset to defaults
            $result = $this->data_manager->reset_to_defaults();
            
            if ($result) {
                $stats = $this->data_manager->get_statistics();
                
                $this->send_success('Successfully reset to default trainers', array(
                    'trainer_count' => $stats['total_count'],
                    'active_count' => $stats['active_count'],
                    'reset_timestamp' => time()
                ));
            } else {
                $this->send_error('Failed to reset data');
            }
            
        } catch (Exception $e) {
            $this->log_error('Reset Defaults Error: ' . $e->getMessage());
            $this->send_error('Reset failed: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for deleting trainer (INDEX-BASED - DEPRECATED)
     */
    public function delete_trainer() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            if (!isset($_POST['trainer_index'])) {
                $this->send_error('Missing trainer index');
            }
            
            $trainer_index = intval($_POST['trainer_index']);
            $trainer = $this->data_manager->get_trainer($trainer_index);
            
            if (!$trainer) {
                $this->send_error('Trainer not found');
            }
            
            $result = $this->data_manager->delete_trainer($trainer_index);
            
            if ($result) {
                $this->send_success('Trainer deleted successfully', array(
                    'deleted_trainer_name' => $trainer['name'] ?? 'Unknown',
                    'remaining_count' => $this->data_manager->get_statistics()['total_count']
                ));
            } else {
                $this->send_error('Failed to delete trainer');
            }
            
        } catch (Exception $e) {
            $this->log_error('Delete Trainer Error: ' . $e->getMessage());
            $this->send_error('Delete failed: ' . $e->getMessage());
        }
    }

    /**
     * AJAX handler for deleting trainer by ID (PREFERRED METHOD)
     */
    public function delete_trainer_by_id() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            if (!isset($_POST['trainer_id'])) {
                $this->send_error('Missing trainer ID');
            }
            
            $trainer_id = intval($_POST['trainer_id']);
            
            if ($trainer_id <= 0) {
                $this->send_error('Invalid trainer ID');
            }
            
            $result = $this->data_manager->delete_trainer_by_id($trainer_id);
            
            if ($result && $result['success']) {
                $this->send_success('Trainer deleted successfully', array(
                    'deleted_trainer_name' => $result['deleted_trainer']['name'] ?? 'Unknown',
                    'deleted_trainer_id' => $trainer_id,
                    'previous_index' => $result['previous_index'],
                    'remaining_count' => $result['remaining_count'],
                    'method' => 'ID-based deletion'
                ));
            } else {
                $this->send_error('Trainer not found or deletion failed');
            }
            
        } catch (Exception $e) {
            $this->log_error('Delete Trainer By ID Error: ' . $e->getMessage());
            $this->send_error('Delete failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Verify request security
     * 
     * @throws Exception If security check fails
     */
    private function verify_request_security() {
        // Check nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'fitcopilot_save_individual_trainer')) {
            $this->log_error('Nonce verification failed');
            throw new Exception('Security check failed');
        }
        
        // Check permissions
        if (!current_user_can('manage_options')) {
            $this->log_error('Permission check failed');
            throw new Exception('Insufficient permissions');
        }
    }
    
    /**
     * Send success response
     * 
     * @param string $message Success message
     * @param array $data Additional data
     */
    private function send_success($message, $data = array()) {
        $response = array(
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => current_time('mysql')
        );
        
        $this->log_debug('AJAX Success Response', $response);
        wp_die(json_encode($response));
    }
    
    /**
     * Send error response
     * 
     * @param string $message Error message
     * @param array $data Additional error data
     */
    private function send_error($message, $data = array()) {
        $response = array(
            'success' => false,
            'message' => $message,
            'data' => $data,
            'timestamp' => current_time('mysql')
        );
        
        $this->log_error('AJAX Error Response: ' . $message, $response);
        wp_die(json_encode($response));
    }
    
    /**
     * Log debug information
     * 
     * @param string $context Context description
     * @param array $data Data to log
     */
    private function log_debug($context, $data = array()) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('FitCopilot Personal Training AJAX - ' . $context . ': ' . json_encode($data));
        }
    }
    
    /**
     * Log error information
     * 
     * @param string $message Error message
     * @param array $data Additional error data
     */
    private function log_error($message, $data = array()) {
        error_log('FitCopilot Personal Training AJAX Error - ' . $message . ': ' . json_encode($data));
    }
} 