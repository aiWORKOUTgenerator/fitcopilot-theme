<?php
/**
 * FitCopilot Training Features AJAX Handler
 * 
 * Handles AJAX requests for Training Features admin interface
 * Following the established Personal Training AJAX pattern
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Features AJAX Handler Class
 * 
 * Manages AJAX operations for individual feature saves and bulk operations
 */
class FitCopilot_Training_Features_Ajax {
    
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
     * Initialize AJAX handlers
     */
    public function init() {
        // Individual feature save (following Personal Training pattern)
        add_action('wp_ajax_fitcopilot_save_individual_feature', array($this, 'handle_save_individual_feature'));
        
        // Bulk operations
        add_action('wp_ajax_fitcopilot_bulk_features_operation', array($this, 'handle_bulk_operation'));
        
        // Feature deletion
        add_action('wp_ajax_fitcopilot_delete_feature', array($this, 'handle_delete_feature'));
        
        // Feature duplication
        add_action('wp_ajax_fitcopilot_duplicate_feature', array($this, 'handle_duplicate_feature'));
        
        // Reorder features
        add_action('wp_ajax_fitcopilot_reorder_features', array($this, 'handle_reorder_features'));
        
        // Quick toggle (active/featured status)
        add_action('wp_ajax_fitcopilot_toggle_feature_status', array($this, 'handle_toggle_status'));
    }
    
    /**
     * Handle individual feature save
     * Following the exact Personal Training pattern for consistency
     */
    public function handle_save_individual_feature() {
        // Verify nonce
        if (!check_ajax_referer('fitcopilot_save_individual_feature', 'nonce', false)) {
            wp_send_json_error('Invalid nonce');
            return;
        }
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
            return;
        }
        
        // Get feature index (following Personal Training pattern)
        $feature_index = isset($_POST['feature_index']) ? absint($_POST['feature_index']) : 0;
        $feature_id = isset($_POST['feature_id']) ? absint($_POST['feature_id']) : 0;
        
        // Get feature data
        $feature_data = isset($_POST['feature']) ? $_POST['feature'] : array();
        
        if (empty($feature_data)) {
            wp_send_json_error('No feature data provided');
            return;
        }
        
        // Validate feature data
        $validation_result = $this->data_manager->validate_feature($feature_data);
        if ($validation_result !== true) {
            wp_send_json_error('Validation failed: ' . implode(', ', $validation_result));
            return;
        }
        
        // Save the feature using index-based pattern (allows index 0)
        // If feature_id exists and > 0, use ID-based save for existing features
        // Otherwise, use index-based save for new features
        if ($feature_id > 0) {
            $result = $this->data_manager->save_feature($feature_id, $feature_data);
        } else {
            $result = $this->data_manager->save_feature_by_index($feature_index, $feature_data);
        }
        
        if ($result) {
            wp_send_json_success(array(
                'message' => 'Feature saved successfully',
                'feature_id' => $feature_id,
                'feature_index' => $feature_index,
                'updated_at' => current_time('mysql')
            ));
        } else {
            wp_send_json_error('Failed to save feature');
        }
    }
    
    /**
     * Handle bulk operations
     */
    public function handle_bulk_operation() {
        // Verify nonce
        if (!check_ajax_referer('fitcopilot_training_features_bulk', 'nonce', false)) {
            wp_send_json_error('Invalid nonce');
            return;
        }
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
            return;
        }
        
        $operation = sanitize_text_field($_POST['operation'] ?? '');
        $feature_ids = isset($_POST['feature_ids']) ? array_map('absint', $_POST['feature_ids']) : array();
        
        if (empty($feature_ids)) {
            wp_send_json_error('No features selected');
            return;
        }
        
        $results = array();
        $success_count = 0;
        
        switch ($operation) {
            case 'activate':
                foreach ($feature_ids as $feature_id) {
                    if ($this->data_manager->save_feature($feature_id, array('is_active' => 1))) {
                        $success_count++;
                    }
                }
                $results['message'] = sprintf('%d features activated', $success_count);
                break;
                
            case 'deactivate':
                foreach ($feature_ids as $feature_id) {
                    if ($this->data_manager->save_feature($feature_id, array('is_active' => 0))) {
                        $success_count++;
                    }
                }
                $results['message'] = sprintf('%d features deactivated', $success_count);
                break;
                
            case 'feature':
                foreach ($feature_ids as $feature_id) {
                    if ($this->data_manager->save_feature($feature_id, array('is_featured' => 1))) {
                        $success_count++;
                    }
                }
                $results['message'] = sprintf('%d features marked as featured', $success_count);
                break;
                
            case 'unfeature':
                foreach ($feature_ids as $feature_id) {
                    if ($this->data_manager->save_feature($feature_id, array('is_featured' => 0))) {
                        $success_count++;
                    }
                }
                $results['message'] = sprintf('%d features unmarked as featured', $success_count);
                break;
                
            case 'delete':
                foreach ($feature_ids as $feature_id) {
                    if ($this->data_manager->delete_feature($feature_id)) {
                        $success_count++;
                    }
                }
                $results['message'] = sprintf('%d features deleted', $success_count);
                break;
                
            default:
                wp_send_json_error('Invalid operation');
                return;
        }
        
        $results['success_count'] = $success_count;
        $results['total_count'] = count($feature_ids);
        
        wp_send_json_success($results);
    }
    
    /**
     * Handle feature deletion
     */
    public function handle_delete_feature() {
        // Verify nonce
        if (!check_ajax_referer('fitcopilot_training_features_delete', 'nonce', false)) {
            wp_send_json_error('Invalid nonce');
            return;
        }
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
            return;
        }
        
        $feature_id = isset($_POST['feature_id']) ? absint($_POST['feature_id']) : 0;
        
        // Allow feature deletion (removed blocking validation on ID = 0)
        if ($feature_id === 0) {
            wp_send_json_error('Feature ID is required for deletion');
            return;
        }
        
        $result = $this->data_manager->delete_feature($feature_id);
        
        if ($result) {
            wp_send_json_success(array(
                'message' => 'Feature deleted successfully',
                'feature_id' => $feature_id,
                'remaining_count' => $result['remaining_count']
            ));
        } else {
            wp_send_json_error('Failed to delete feature');
        }
    }
    
    /**
     * Handle feature duplication
     */
    public function handle_duplicate_feature() {
        // Verify nonce
        if (!check_ajax_referer('fitcopilot_training_features_duplicate', 'nonce', false)) {
            wp_send_json_error('Invalid nonce');
            return;
        }
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
            return;
        }
        
        $feature_id = isset($_POST['feature_id']) ? absint($_POST['feature_id']) : 0;
        
        // Allow duplication (removed blocking validation on ID = 0)
        if ($feature_id === 0) {
            wp_send_json_error('Feature ID is required for duplication');
            return;
        }
        
        // Get original feature
        $original_feature = $this->data_manager->get_feature($feature_id);
        
        if (!$original_feature) {
            wp_send_json_error('Feature not found');
            return;
        }
        
        // Modify data for duplication
        $duplicate_data = $original_feature;
        unset($duplicate_data['id']); // Remove ID so it creates new
        $duplicate_data['title'] = $duplicate_data['title'] . ' (Copy)';
        $duplicate_data['is_featured'] = 0; // Don't duplicate featured status
        $duplicate_data['display_order'] = $this->get_next_display_order();
        
        $new_feature_id = $this->data_manager->create_feature($duplicate_data);
        
        if ($new_feature_id) {
            wp_send_json_success(array(
                'message' => 'Feature duplicated successfully',
                'original_id' => $feature_id,
                'new_id' => $new_feature_id,
                'new_feature' => $this->data_manager->get_feature($new_feature_id)
            ));
        } else {
            wp_send_json_error('Failed to duplicate feature');
        }
    }
    
    /**
     * Handle feature reordering
     */
    public function handle_reorder_features() {
        // Verify nonce
        if (!check_ajax_referer('fitcopilot_training_features_reorder', 'nonce', false)) {
            wp_send_json_error('Invalid nonce');
            return;
        }
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
            return;
        }
        
        $feature_order = isset($_POST['feature_order']) ? $_POST['feature_order'] : array();
        
        if (empty($feature_order) || !is_array($feature_order)) {
            wp_send_json_error('Invalid order data');
            return;
        }
        
        $success_count = 0;
        
        foreach ($feature_order as $index => $feature_id) {
            $feature_id = absint($feature_id);
            $display_order = $index + 1;
            
            if ($this->data_manager->save_feature($feature_id, array('display_order' => $display_order))) {
                $success_count++;
            }
        }
        
        wp_send_json_success(array(
            'message' => sprintf('%d features reordered', $success_count),
            'updated_count' => $success_count
        ));
    }
    
    /**
     * Handle quick status toggle
     */
    public function handle_toggle_status() {
        // Verify nonce
        if (!check_ajax_referer('fitcopilot_training_features_toggle', 'nonce', false)) {
            wp_send_json_error('Invalid nonce');
            return;
        }
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
            return;
        }
        
        $feature_id = isset($_POST['feature_id']) ? absint($_POST['feature_id']) : 0;
        $status_type = sanitize_text_field($_POST['status_type'] ?? '');
        $new_value = !empty($_POST['new_value']) ? 1 : 0;
        
        // Allow status toggle (removed blocking validation on ID = 0)
        if ($feature_id === 0) {
            wp_send_json_error('Feature ID is required for status toggle');
            return;
        }
        
        if (!in_array($status_type, array('is_active', 'is_featured'))) {
            wp_send_json_error('Invalid status type');
            return;
        }
        
        $result = $this->data_manager->save_feature($feature_id, array($status_type => $new_value));
        
        if ($result) {
            wp_send_json_success(array(
                'message' => 'Status updated successfully',
                'feature_id' => $feature_id,
                'status_type' => $status_type,
                'new_value' => $new_value
            ));
        } else {
            wp_send_json_error('Failed to update status');
        }
    }
    
    /**
     * Get next display order for new features
     * 
     * @return int Next display order
     */
    private function get_next_display_order() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'fitcopilot_training_features';
        $max_order = $wpdb->get_var("SELECT MAX(display_order) FROM {$table_name}");
        
        return ($max_order ? $max_order : 0) + 1;
    }
    
    /**
     * Sanitize feature data for AJAX operations
     * 
     * @param array $data Raw feature data
     * @return array Sanitized data
     */
    private function sanitize_ajax_feature_data($data) {
        return $this->data_manager->sanitize_feature_data($data);
    }
} 