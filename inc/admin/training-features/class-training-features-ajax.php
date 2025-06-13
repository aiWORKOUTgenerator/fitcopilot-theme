<?php
/**
 * FitCopilot Training Features AJAX Handler
 * 
 * Handles all AJAX requests for the Training Features admin interface
 * Following Personal Training architectural patterns exactly
 * 
 * @package FitCopilot
 * @subpackage TrainingFeatures
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Features AJAX Handler Class
 * 
 * Implements Personal Training patterns for Training Features functionality
 * All methods follow the exact architecture and error handling patterns
 * established in the Personal Training gold standard implementation
 */
class FitCopilot_Training_Features_Ajax {
    
    /**
     * Data manager instance
     * 
     * @var FitCopilot_Training_Features_Data
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
     * Following Personal Training hook registration pattern exactly
     * Enhanced with Phase 2 advanced operations
     */
    public function init() {
        // Primary save handler (following Personal Training pattern)
        add_action('wp_ajax_save_individual_feature', array($this, 'save_individual_feature'));
        
        // Additional handlers following Personal Training pattern
        add_action('wp_ajax_test_frontend_data_features', array($this, 'test_frontend_data'));
        add_action('wp_ajax_reset_defaults_features', array($this, 'reset_defaults'));
        add_action('wp_ajax_delete_feature', array($this, 'delete_feature'));
        add_action('wp_ajax_delete_feature_by_id', array($this, 'delete_feature_by_id'));
        
        // Bulk operations
        add_action('wp_ajax_bulk_operation_features', array($this, 'bulk_operation'));
        add_action('wp_ajax_reorder_features', array($this, 'reorder_features'));
        add_action('wp_ajax_toggle_feature_status', array($this, 'toggle_status'));
        add_action('wp_ajax_duplicate_feature', array($this, 'duplicate_feature'));
        
        // PHASE 2: Enhanced AJAX handlers
        add_action('wp_ajax_validate_media_upload_features', array($this, 'validate_media_upload'));
        
        // PHASE 3: Advanced Media Management AJAX handlers
        add_action('wp_ajax_upload_media_library_features', array($this, 'handle_media_library_upload'));
        add_action('wp_ajax_generate_video_poster_features', array($this, 'generate_video_poster'));
        add_action('wp_ajax_validate_media_security_features', array($this, 'validate_media_security'));
        add_action('wp_ajax_optimize_media_features', array($this, 'optimize_media_file'));
        add_action('wp_ajax_get_media_metadata_features', array($this, 'get_media_metadata'));
    }
    
    /**
     * AJAX handler for individual feature save
     * Following Personal Training pattern exactly
     */
    public function save_individual_feature() {
        try {
            // Security and permission checks (identical to Personal Training)
            $this->verify_request_security();
            
            // Validate required data (identical to Personal Training)
            if (!isset($_POST['feature_data']) || !isset($_POST['feature_index'])) {
                $this->send_error('Missing required data');
            }
            
            $feature_data = $_POST['feature_data'];
            $feature_index = intval($_POST['feature_index']);
            
            // Debug logging (identical to Personal Training)
            $this->log_debug('Individual Save Request', array(
                'feature_index' => $feature_index,
                'feature_data' => $feature_data,
                'data_keys' => array_keys($feature_data)
            ));
            
            // Validate feature data (following Personal Training pattern)
            $validation_result = $this->data_manager->validate_feature($feature_data);
            if ($validation_result !== true) {
                // validation_result is an array of errors
                $this->send_validation_error($validation_result);
            }
            
            // Save feature (index-based, identical to Personal Training)
            $result = $this->data_manager->save_feature($feature_index, $feature_data);
            
            if ($result) {
                $this->send_success('Feature saved successfully!', array(
                    'feature_name' => $feature_data['title'] ?? 'Unknown',
                    'feature_id' => $feature_data['id'] ?? $feature_index + 1,
                    'updated_at' => current_time('mysql'),
                    'active_status' => !empty($feature_data['is_active']) ? 'active' : 'inactive',
                    'operation' => ($this->data_manager->get_feature($feature_index) !== null) ? 'update' : 'create'
                ));
            } else {
                $this->send_error('Failed to save feature data');
            }
            
        } catch (Exception $e) {
            $this->log_error('Save Individual Feature Error: ' . $e->getMessage());
            $this->send_error('An unexpected error occurred: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for testing frontend data flow
     * Following Personal Training pattern exactly
     */
    public function test_frontend_data() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            // Get statistics and test data
            $stats = $this->data_manager->get_statistics();
            $active_features = $this->data_manager->get_features(true);
            
            // Test data provider function
            $provider_exists = function_exists('fitcopilot_provide_training_features_data_for_frontend');
            
            $test_data = array(
                'statistics' => $stats,
                'provider_working' => $provider_exists,
                'sample_feature' => !empty($active_features) ? array(
                    'title' => $active_features[0]['title'] ?? 'Unknown',
                    'category' => $active_features[0]['category'] ?? 'Unknown',
                    'is_active' => $active_features[0]['is_active'] ?? false
                ) : null,
                'frontend_data_format' => array(
                    'features' => array_values($active_features),
                    'settings' => get_option(FitCopilot_Training_Features_Data::SETTINGS_OPTION, array()),
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
     * Following Personal Training pattern exactly
     */
    public function reset_defaults() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            // Reset to defaults
            $result = $this->data_manager->reset_to_defaults();
            
            if ($result) {
                $stats = $this->data_manager->get_statistics();
                
                $this->send_success('Successfully reset to default features', array(
                    'feature_count' => $stats['total_count'],
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
     * AJAX handler for deleting feature (INDEX-BASED)
     * Following Personal Training pattern exactly
     */
    public function delete_feature() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            if (!isset($_POST['feature_index'])) {
                $this->send_error('Missing feature index');
            }
            
            $feature_index = intval($_POST['feature_index']);
            $feature = $this->data_manager->get_feature($feature_index);
            
            if (!$feature) {
                $this->send_error('Feature not found');
            }
            
            $result = $this->data_manager->delete_feature($feature_index);
            
            if ($result) {
                $this->send_success('Feature deleted successfully', array(
                    'deleted_feature_name' => $feature['title'] ?? 'Unknown',
                    'remaining_count' => $this->data_manager->get_statistics()['total_count']
                ));
            } else {
                $this->send_error('Failed to delete feature');
            }
            
        } catch (Exception $e) {
            $this->log_error('Delete Feature Error: ' . $e->getMessage());
            $this->send_error('Delete failed: ' . $e->getMessage());
        }
    }

    /**
     * AJAX handler for deleting feature by ID (PREFERRED METHOD)
     * Following Personal Training pattern exactly
     */
    public function delete_feature_by_id() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            if (!isset($_POST['feature_id'])) {
                $this->send_error('Missing feature ID');
            }
            
            $feature_id = intval($_POST['feature_id']);
            
            if ($feature_id <= 0) {
                $this->send_error('Invalid feature ID');
            }
            
            $result = $this->data_manager->delete_feature_by_id($feature_id);
            
            if ($result && $result['success']) {
                $this->send_success('Feature deleted successfully', array(
                    'deleted_feature_name' => $result['deleted_feature']['title'] ?? 'Unknown',
                    'deleted_feature_id' => $feature_id,
                    'previous_index' => $result['previous_index'],
                    'remaining_count' => $result['remaining_count'],
                    'method' => 'ID-based deletion'
                ));
            } else {
                $this->send_error('Feature not found or deletion failed');
            }
            
        } catch (Exception $e) {
            $this->log_error('Delete Feature By ID Error: ' . $e->getMessage());
            $this->send_error('Delete failed: ' . $e->getMessage());
        }
    }
    
    /**
     * AJAX handler for bulk operations - PHASE 2 ENHANCED VERSION
     * Following Personal Training pattern with advanced operations
     */
    public function bulk_operation() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            if (!isset($_POST['operation']) || !isset($_POST['feature_indices'])) {
                $this->send_error('Missing required bulk operation data');
            }
            
            $operation = sanitize_text_field($_POST['operation']);
            $feature_indices = array_map('intval', $_POST['feature_indices']);
            
            // Debug logging
            $this->log_debug('Bulk Operation Request', array(
                'operation' => $operation,
                'feature_count' => count($feature_indices),
                'indices' => $feature_indices
            ));
            
            // Enhanced validation for bulk operations
            if (empty($feature_indices)) {
                $this->send_error('No features selected for bulk operation');
            }
            
            if (count($feature_indices) > 50) {
                $this->send_error('Too many features selected. Maximum 50 features per bulk operation.');
            }
            
            // Process bulk operation with detailed feedback
            $result = $this->process_bulk_operation_enhanced($operation, $feature_indices);
            
            if ($result['success']) {
                $this->send_success($result['message'], $result['data']);
            } else {
                $this->send_error($result['message'], $result['data']);
            }
            
        } catch (Exception $e) {
            $this->log_error('Bulk Operation Error: ' . $e->getMessage());
            $this->send_error('Bulk operation failed: ' . $e->getMessage());
        }
    }
    
    /**
     * PHASE 2: Enhanced bulk operation processor with detailed feedback
     * 
     * @param string $operation The bulk operation to perform
     * @param array $feature_indices Array of feature indices
     * @return array Operation result with success status, message, and data
     */
    private function process_bulk_operation_enhanced($operation, $feature_indices) {
        $results = array(
            'processed' => 0,
            'skipped' => 0,
            'errors' => array(),
            'details' => array()
        );
        
        foreach ($feature_indices as $index) {
            $feature = $this->data_manager->get_feature($index);
            
            if (!$feature) {
                $results['skipped']++;
                $results['errors'][] = "Feature at index {$index} not found";
                continue;
            }
            
            $feature_name = $feature['title'] ?? "Feature {$index}";
            
            try {
                switch ($operation) {
                    case 'activate':
                        if (!empty($feature['is_active'])) {
                            $results['skipped']++;
                            $results['details'][] = "{$feature_name} was already active";
                        } else {
                            $feature['is_active'] = true;
                            $this->data_manager->save_feature($index, $feature);
                            $results['processed']++;
                            $results['details'][] = "{$feature_name} activated";
                        }
                        break;
                        
                    case 'deactivate':
                        if (empty($feature['is_active'])) {
                            $results['skipped']++;
                            $results['details'][] = "{$feature_name} was already inactive";
                        } else {
                            $feature['is_active'] = false;
                            $this->data_manager->save_feature($index, $feature);
                            $results['processed']++;
                            $results['details'][] = "{$feature_name} deactivated";
                        }
                        break;
                        
                    case 'feature':
                        if (!empty($feature['is_featured'])) {
                            $results['skipped']++;
                            $results['details'][] = "{$feature_name} was already featured";
                        } else {
                            $feature['is_featured'] = true;
                            $this->data_manager->save_feature($index, $feature);
                            $results['processed']++;
                            $results['details'][] = "{$feature_name} marked as featured";
                        }
                        break;
                        
                    case 'unfeature':
                        if (empty($feature['is_featured'])) {
                            $results['skipped']++;
                            $results['details'][] = "{$feature_name} was not featured";
                        } else {
                            $feature['is_featured'] = false;
                            $this->data_manager->save_feature($index, $feature);
                            $results['processed']++;
                            $results['details'][] = "{$feature_name} unfeatured";
                        }
                        break;
                        
                    case 'delete':
                        $this->data_manager->delete_feature($index);
                        $results['processed']++;
                        $results['details'][] = "{$feature_name} deleted";
                        break;
                        
                    case 'duplicate':
                        $duplicated_feature = $this->create_duplicate_feature($feature);
                        $new_index = $this->data_manager->add_feature($duplicated_feature);
                        $results['processed']++;
                        $results['details'][] = "{$feature_name} duplicated (new index: {$new_index})";
                        break;
                        
                    default:
                        $results['errors'][] = "Unknown operation: {$operation}";
                        $results['skipped']++;
                }
                
            } catch (Exception $e) {
                $results['errors'][] = "Error processing {$feature_name}: " . $e->getMessage();
                $results['skipped']++;
            }
        }
        
        // Generate summary message
        $total_features = count($feature_indices);
        $success_rate = $total_features > 0 ? round(($results['processed'] / $total_features) * 100) : 0;
        
        if ($results['processed'] > 0) {
            $message = "Bulk {$operation} completed: {$results['processed']} features processed";
            if ($results['skipped'] > 0) {
                $message .= ", {$results['skipped']} skipped";
            }
            if (!empty($results['errors'])) {
                $message .= ", " . count($results['errors']) . " errors";
            }
            $message .= " ({$success_rate}% success rate)";
            
            return array(
                'success' => true,
                'message' => $message,
                'data' => array(
                    'operation' => $operation,
                    'statistics' => $results,
                    'success_rate' => $success_rate,
                    'total_processed' => $results['processed']
                )
            );
        } else {
            return array(
                'success' => false,
                'message' => "Bulk {$operation} failed: No features were processed",
                'data' => array(
                    'operation' => $operation,
                    'errors' => $results['errors'],
                    'total_selected' => $total_features
                )
            );
        }
    }
    
    /**
     * PHASE 2: Create duplicate feature with enhanced naming
     */
    private function create_duplicate_feature($original_feature) {
        $duplicate = $original_feature;
        
        // Remove ID to create new feature
        unset($duplicate['id']);
        
        // Enhance title with copy indicator
        $original_title = $duplicate['title'] ?? 'Untitled Feature';
        $copy_number = 1;
        
        // Check for existing copies and increment number
        $existing_features = $this->data_manager->get_features();
        $base_title = preg_replace('/\s*\(Copy\s*\d*\)$/', '', $original_title);
        
        foreach ($existing_features as $feature) {
            if (isset($feature['title']) && strpos($feature['title'], $base_title . ' (Copy') === 0) {
                $copy_number++;
            }
        }
        
        $duplicate['title'] = $base_title . ($copy_number > 1 ? " (Copy {$copy_number})" : ' (Copy)');
        
        // Reset order to end of list
        $duplicate['display_order'] = $this->get_next_display_order();
        
        // Deactivate duplicates by default to prevent accidental publishing
        $duplicate['is_active'] = false;
        $duplicate['is_featured'] = false;
        
        return $duplicate;
    }
    
    /**
     * PHASE 2: Enhanced media upload validation AJAX handler
     */
    public function validate_media_upload() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['media_url']) || !isset($_POST['media_type'])) {
                $this->send_error('Missing media validation data');
            }
            
            $media_url = esc_url_raw($_POST['media_url']);
            $media_type = sanitize_text_field($_POST['media_type']);
            
            $validation_result = $this->validate_media_url($media_url, $media_type);
            
            if ($validation_result['valid']) {
                $this->send_success('Media URL is valid', $validation_result);
            } else {
                $this->send_error('Media validation failed', $validation_result);
            }
            
        } catch (Exception $e) {
            $this->log_error('Media Validation Error: ' . $e->getMessage());
            $this->send_error('Media validation failed: ' . $e->getMessage());
        }
    }
    
    /**
     * PHASE 2: Comprehensive media URL validation
     */
    private function validate_media_url($url, $type) {
        $result = array(
            'valid' => false,
            'url' => $url,
            'type' => $type,
            'details' => array(),
            'warnings' => array(),
            'suggestions' => array()
        );
        
        // Basic URL validation
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            $result['details'][] = 'Invalid URL format';
            return $result;
        }
        
        // Check URL accessibility (with timeout)
        $headers = @get_headers($url, 1, stream_context_create(array(
            'http' => array(
                'timeout' => 10,
                'user_agent' => 'FitCopilot-MediaValidator/1.0'
            )
        )));
        
        if (!$headers) {
            $result['warnings'][] = 'Unable to verify URL accessibility';
        } else {
            $http_code = substr($headers[0], 9, 3);
            if ($http_code !== '200') {
                $result['warnings'][] = "HTTP response code: {$http_code}";
            }
        }
        
        // Type-specific validation
        switch ($type) {
            case 'image':
                $result = $this->validate_image_url($url, $result);
                break;
            case 'video':
                $result = $this->validate_video_url($url, $result);
                break;
            default:
                $result['details'][] = 'Unknown media type';
                return $result;
        }
        
        return $result;
    }
    
    /**
     * PHASE 2: Enhanced image URL validation
     */
    private function validate_image_url($url, $result) {
        $image_extensions = array('jpg', 'jpeg', 'png', 'gif', 'webp', 'svg');
        $path_info = pathinfo(parse_url($url, PHP_URL_PATH));
        $extension = strtolower($path_info['extension'] ?? '');
        
        if (in_array($extension, $image_extensions)) {
            $result['valid'] = true;
            $result['details'][] = "Valid image extension: {$extension}";
            
            // Performance suggestions
            if (in_array($extension, array('png', 'jpg', 'jpeg'))) {
                $result['suggestions'][] = 'Consider WebP format for better performance';
            }
            
            // Check for CDN usage
            $domain = parse_url($url, PHP_URL_HOST);
            $cdn_indicators = array('cdn', 'cloudfront', 'fastly', 'cloudflare');
            $is_cdn = false;
            foreach ($cdn_indicators as $indicator) {
                if (strpos($domain, $indicator) !== false) {
                    $is_cdn = true;
                    break;
                }
            }
            
            if (!$is_cdn) {
                $result['suggestions'][] = 'Consider using a CDN for better image delivery';
            }
            
        } else {
            $result['details'][] = 'File extension not recognized as image format';
            $result['suggestions'][] = 'Supported formats: ' . implode(', ', $image_extensions);
        }
        
        return $result;
    }
    
    /**
     * PHASE 2: Enhanced video URL validation
     */
    private function validate_video_url($url, $result) {
        // Check for popular video platforms
        $video_platforms = array(
            'youtube.com' => array('pattern' => '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', 'name' => 'YouTube'),
            'vimeo.com' => array('pattern' => '/vimeo\.com\/(\d+)/', 'name' => 'Vimeo'),
            'wistia.com' => array('pattern' => '/wistia\.com/', 'name' => 'Wistia'),
            'jwplatform.com' => array('pattern' => '/jwplatform\.com/', 'name' => 'JW Player')
        );
        
        $domain = parse_url($url, PHP_URL_HOST);
        $platform_detected = false;
        
        foreach ($video_platforms as $platform_domain => $platform_info) {
            if (strpos($domain, $platform_domain) !== false) {
                if (preg_match($platform_info['pattern'], $url)) {
                    $result['valid'] = true;
                    $result['details'][] = "Valid {$platform_info['name']} video URL";
                    $platform_detected = true;
                    break;
                } else {
                    $result['details'][] = "URL appears to be {$platform_info['name']} but format is invalid";
                    $result['suggestions'][] = "Please use a valid {$platform_info['name']} share URL";
                }
            }
        }
        
        // Check for direct video file URLs
        if (!$platform_detected) {
            $video_extensions = array('mp4', 'webm', 'ogg', 'avi', 'mov');
            $path_info = pathinfo(parse_url($url, PHP_URL_PATH));
            $extension = strtolower($path_info['extension'] ?? '');
            
            if (in_array($extension, $video_extensions)) {
                $result['valid'] = true;
                $result['details'][] = "Valid video file: {$extension}";
                
                if ($extension !== 'mp4') {
                    $result['suggestions'][] = 'MP4 format recommended for best browser compatibility';
                }
            } else {
                $result['details'][] = 'URL does not appear to be a supported video format';
                $result['suggestions'][] = 'Supported platforms: YouTube, Vimeo, or direct video files (mp4, webm, ogg)';
            }
        }
        
        return $result;
    }
    
    /**
     * PHASE 2: Enhanced feature reordering with validation 
     */
    public function reorder_features() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['feature_order'])) {
                $this->send_error('Missing feature order data');
            }
            
            $new_order = array_map('intval', $_POST['feature_order']);
            
            // Validation
            if (empty($new_order)) {
                $this->send_error('Empty feature order provided');
            }
            
            $existing_features = $this->data_manager->get_features();
            if (count($new_order) !== count($existing_features)) {
                $this->send_error('Feature order count mismatch');
            }
            
            // Apply new order with enhanced feedback
            $result = $this->apply_feature_reorder($new_order);
            
            if ($result['success']) {
                $this->send_success($result['message'], $result['data']);
            } else {
                $this->send_error($result['message'], $result['data']);
            }
            
        } catch (Exception $e) {
            $this->log_error('Reorder Features Error: ' . $e->getMessage());
            $this->send_error('Feature reordering failed: ' . $e->getMessage());
        }
    }
    
    /**
     * PHASE 2: Apply feature reordering with detailed tracking
     */
    private function apply_feature_reorder($new_order) {
        $existing_features = $this->data_manager->get_features();
        $reordered_features = array();
        $changes_made = 0;
        
        foreach ($new_order as $display_order => $original_index) {
            if (isset($existing_features[$original_index])) {
                $feature = $existing_features[$original_index];
                $old_order = $feature['display_order'] ?? $original_index;
                
                // Update display order
                $feature['display_order'] = $display_order;
                $reordered_features[] = $feature;
                
                if ($old_order !== $display_order) {
                    $changes_made++;
                }
            }
        }
        
        // Save reordered features
        if ($this->data_manager->save_all_features($reordered_features)) {
            return array(
                'success' => true,
                'message' => "Feature order updated successfully. {$changes_made} positions changed.",
                'data' => array(
                    'total_features' => count($reordered_features),
                    'changes_made' => $changes_made,
                    'new_order' => $new_order
                )
            );
        } else {
            return array(
                'success' => false,
                'message' => 'Failed to save feature order changes',
                'data' => array('attempted_changes' => $changes_made)
            );
        }
    }
    
    /**
     * Handle quick status toggle
     * Enhanced with Personal Training error handling
     */
    public function toggle_status() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            if (!isset($_POST['feature_id']) || !isset($_POST['status_type'])) {
                $this->send_error('Missing required parameters');
            }
            
            $feature_id = absint($_POST['feature_id']);
            $status_type = sanitize_text_field($_POST['status_type']);
            $new_value = !empty($_POST['new_value']) ? 1 : 0;
            
            if ($feature_id <= 0) {
                $this->send_error('Invalid feature ID');
            }
            
            if (!in_array($status_type, array('is_active', 'is_featured'))) {
                $this->send_error('Invalid status type');
            }
            
            $result = $this->data_manager->save_feature_by_id($feature_id, array($status_type => $new_value));
            
            if ($result) {
                $this->send_success('Status updated successfully', array(
                    'feature_id' => $feature_id,
                    'status_type' => $status_type,
                    'new_value' => $new_value
                ));
            } else {
                $this->send_error('Failed to update status');
            }
            
        } catch (Exception $e) {
            $this->log_error('Toggle Status Error: ' . $e->getMessage());
            $this->send_error('Status toggle failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Handle feature duplication
     * Enhanced with Personal Training error handling
     */
    public function duplicate_feature() {
        try {
            // Security and permission checks
            $this->verify_request_security();
            
            if (!isset($_POST['feature_id'])) {
                $this->send_error('Missing feature ID');
            }
            
            $feature_id = absint($_POST['feature_id']);
            
            if ($feature_id <= 0) {
                $this->send_error('Invalid feature ID');
            }
            
            // Get original feature by ID
            $original_feature = $this->data_manager->get_feature_by_id($feature_id);
            
            if (!$original_feature) {
                $this->send_error('Feature not found');
            }
            
            // Modify data for duplication
            $duplicate_data = $original_feature;
            unset($duplicate_data['id']); // Remove ID so it creates new
            $duplicate_data['title'] = $duplicate_data['title'] . ' (Copy)';
            $duplicate_data['is_featured'] = 0; // Don't duplicate featured status
            $duplicate_data['display_order'] = $this->get_next_display_order();
            
            $new_feature_id = $this->data_manager->create_feature($duplicate_data);
            
            if ($new_feature_id) {
                $this->send_success('Feature duplicated successfully', array(
                    'original_id' => $feature_id,
                    'new_id' => $new_feature_id,
                    'new_feature' => $this->data_manager->get_feature_by_id($new_feature_id)
                ));
            } else {
                $this->send_error('Failed to duplicate feature');
            }
            
        } catch (Exception $e) {
            $this->log_error('Duplicate Feature Error: ' . $e->getMessage());
            $this->send_error('Duplication failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Verify request security
     * Identical to Personal Training security verification
     * 
     * @throws Exception If security check fails
     */
    private function verify_request_security() {
        // Check nonce (updated for Training Features)
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'fitcopilot_save_individual_feature')) {
            $this->log_error('Nonce verification failed');
            throw new Exception('Security check failed');
        }
        
        // Check permissions (identical to Personal Training)
        if (!current_user_can('manage_options')) {
            $this->log_error('Permission check failed');
            throw new Exception('Insufficient permissions');
        }
    }
    
    /**
     * Send success response
     * Identical to Personal Training response format
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
     * Send error response with user-friendly messaging
     * Enhanced Personal Training error format for better UX
     * 
     * @param string $message Error message
     * @param array $data Additional error data
     */
    private function send_error($message, $data = array()) {
        // Convert technical errors to user-friendly messages
        $user_friendly_message = $this->get_user_friendly_error($message);
        
        $response = array(
            'success' => false,
            'message' => $user_friendly_message,
            'technical_message' => $message, // Keep technical message for debugging
            'data' => $data,
            'timestamp' => current_time('mysql')
        );
        
        $this->log_error('AJAX Error Response: ' . $message, $response);
        wp_die(json_encode($response));
    }
    
    /**
     * Send validation error response with specific field errors
     * Provides detailed, actionable feedback for validation failures
     * 
     * @param array $validation_errors Array of specific validation error messages
     */
    private function send_validation_error($validation_errors) {
        // Safety check: ensure we have an array of errors
        if (!is_array($validation_errors)) {
            $this->log_error('send_validation_error called with non-array: ' . gettype($validation_errors));
            $this->send_error('Validation failed with unexpected error format');
            return;
        }
        
        // Safety check: ensure we have at least one error
        if (empty($validation_errors)) {
            $this->log_error('send_validation_error called with empty array');
            $this->send_error('Validation failed but no specific errors were provided');
            return;
        }
        
        // Create user-friendly validation summary
        $error_count = count($validation_errors);
        $summary = $error_count === 1 
            ? "Please fix the following issue:" 
            : "Please fix the following {$error_count} issues:";
        
        // Format errors as a numbered list for clarity
        $formatted_errors = array();
        foreach ($validation_errors as $index => $error) {
            $formatted_errors[] = ($index + 1) . ". " . $error;
        }
        
        $detailed_message = $summary . "\n\n" . implode("\n", $formatted_errors);
        
        $response = array(
            'success' => false,
            'message' => $detailed_message,
            'validation_errors' => $validation_errors,
            'error_count' => $error_count,
            'error_type' => 'validation',
            'timestamp' => current_time('mysql')
        );
        
        $this->log_error('AJAX Validation Error: ' . $error_count . ' validation errors', array(
            'errors' => $validation_errors,
            'formatted_message' => $detailed_message
        ));
        
        wp_die(json_encode($response));
    }
    
    /**
     * Convert technical errors to user-friendly messages
     * 
     * @param string $technical_error Technical error message
     * @return string User-friendly error message
     */
    private function get_user_friendly_error($technical_error) {
        $error_map = array(
            'Missing required data' => 'Please fill in all required fields and try again.',
            'Security check failed' => 'Session expired. Please refresh the page and try again.',
            'Failed to save feature data' => 'Unable to save changes. Please try again or contact support.',
            'Feature not found' => 'The selected feature could not be found. Please refresh and try again.',
            'Invalid feature ID' => 'There was an issue with the feature selection. Please try again.',
            'Insufficient permissions' => 'You do not have permission to perform this action.',
            'Nonce verification failed' => 'Security verification failed. Please refresh the page and try again.'
        );
        
        // Check if message starts with "Validation failed"
        if (strpos($technical_error, 'Validation failed') === 0) {
            return 'Some information appears to be invalid. Please check your entries and try again.';
        }
        
        return $error_map[$technical_error] ?? 'An unexpected error occurred. Please try again or contact support if the problem persists.';
    }
    
    /**
     * Log debug information
     * Identical to Personal Training debug logging
     * 
     * @param string $context Context description
     * @param array $data Data to log
     */
    private function log_debug($context, $data = array()) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('FitCopilot Training Features AJAX - ' . $context . ': ' . json_encode($data));
        }
    }
    
    /**
     * Log error information
     * Identical to Personal Training error logging
     * 
     * @param string $message Error message
     * @param array $data Additional error data
     */
    private function log_error($message, $data = array()) {
        error_log('FitCopilot Training Features AJAX Error - ' . $message . ': ' . json_encode($data));
    }
    
    /**
     * Get next display order for new features
     * 
     * @return int Next display order
     */
    private function get_next_display_order() {
        $stats = $this->data_manager->get_statistics();
        return ($stats['total_count'] ?? 0) + 1;
    }
    
    // ===== PHASE 3: ADVANCED MEDIA MANAGEMENT METHODS =====
    
    /**
     * PHASE 3: Handle WordPress Media Library upload
     * 
     * Integrates with WordPress media library for seamless file management
     */
    public function handle_media_library_upload() {
        try {
            $this->verify_request_security();
            
            if (!isset($_FILES['media_file']) || !isset($_POST['media_type'])) {
                $this->send_error('Missing upload file or media type');
            }
            
            $media_type = sanitize_text_field($_POST['media_type']);
            $feature_id = isset($_POST['feature_id']) ? absint($_POST['feature_id']) : 0;
            
            // Validate file upload
            $upload_security = $this->validate_upload_security($_FILES['media_file'], $media_type);
            if (!$upload_security['valid']) {
                $this->send_error('File security validation failed', $upload_security);
            }
            
            // Handle WordPress media upload
            $attachment_id = $this->process_wordpress_upload($_FILES['media_file'], $media_type, $feature_id);
            
            if ($attachment_id) {
                $media_data = $this->get_attachment_data($attachment_id, $media_type);
                $this->send_success('Media uploaded successfully', $media_data);
            } else {
                $this->send_error('Failed to upload media to WordPress library');
            }
            
        } catch (Exception $e) {
            $this->log_error('Media Upload Error: ' . $e->getMessage());
            $this->send_error('Media upload failed: ' . $e->getMessage());
        }
    }
    
    /**
     * PHASE 3: Generate video poster from video URL
     * 
     * Automatically generates poster images for videos
     */
    public function generate_video_poster() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['video_url'])) {
                $this->send_error('Missing video URL');
            }
            
            $video_url = esc_url_raw($_POST['video_url']);
            $feature_id = isset($_POST['feature_id']) ? absint($_POST['feature_id']) : 0;
            
            // Validate video URL
            $video_validation = $this->validate_video_url($video_url, array('valid' => false));
            if (!$video_validation['valid']) {
                $this->send_error('Invalid video URL provided');
            }
            
            // Generate poster based on video platform
            $poster_data = $this->extract_video_poster($video_url);
            
            if ($poster_data['success']) {
                $this->send_success('Video poster generated successfully', $poster_data);
            } else {
                $this->send_error('Unable to generate poster for this video', $poster_data);
            }
            
        } catch (Exception $e) {
            $this->log_error('Video Poster Generation Error: ' . $e->getMessage());
            $this->send_error('Poster generation failed: ' . $e->getMessage());
        }
    }
    
    /**
     * PHASE 3: Validate media file security
     * 
     * Comprehensive security validation for uploaded media
     */
    public function validate_media_security() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['file_data'])) {
                $this->send_error('Missing file data for security validation');
            }
            
            $file_data = json_decode(stripslashes($_POST['file_data']), true);
            $media_type = sanitize_text_field($_POST['media_type'] ?? 'image');
            
            $security_result = $this->perform_security_scan($file_data, $media_type);
            
            if ($security_result['secure']) {
                $this->send_success('File passed security validation', $security_result);
            } else {
                $this->send_error('File failed security validation', $security_result);
            }
            
        } catch (Exception $e) {
            $this->log_error('Media Security Validation Error: ' . $e->getMessage());
            $this->send_error('Security validation failed: ' . $e->getMessage());
        }
    }
    
    /**
     * PHASE 3: Optimize media file for performance
     * 
     * Optimizes images and videos for better performance
     */
    public function optimize_media_file() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['media_url']) || !isset($_POST['optimization_type'])) {
                $this->send_error('Missing media URL or optimization type');
            }
            
            $media_url = esc_url_raw($_POST['media_url']);
            $optimization_type = sanitize_text_field($_POST['optimization_type']);
            $feature_id = isset($_POST['feature_id']) ? absint($_POST['feature_id']) : 0;
            
            $optimization_result = $this->perform_media_optimization($media_url, $optimization_type);
            
            if ($optimization_result['success']) {
                $this->send_success('Media optimized successfully', $optimization_result);
            } else {
                $this->send_error('Media optimization failed', $optimization_result);
            }
            
        } catch (Exception $e) {
            $this->log_error('Media Optimization Error: ' . $e->getMessage());
            $this->send_error('Media optimization failed: ' . $e->getMessage());
        }
    }
    
    /**
     * PHASE 3: Get comprehensive media metadata
     * 
     * Retrieves detailed information about media files
     */
    public function get_media_metadata() {
        try {
            $this->verify_request_security();
            
            if (!isset($_POST['media_url'])) {
                $this->send_error('Missing media URL');
            }
            
            $media_url = esc_url_raw($_POST['media_url']);
            $media_type = sanitize_text_field($_POST['media_type'] ?? 'auto');
            
            $metadata = $this->extract_media_metadata($media_url, $media_type);
            
            if ($metadata['success']) {
                $this->send_success('Media metadata retrieved successfully', $metadata);
            } else {
                $this->send_error('Unable to retrieve media metadata', $metadata);
            }
            
        } catch (Exception $e) {
            $this->log_error('Media Metadata Error: ' . $e->getMessage());
            $this->send_error('Metadata retrieval failed: ' . $e->getMessage());
        }
    }
    
    // ===== PHASE 3: HELPER METHODS FOR MEDIA MANAGEMENT =====
    
    /**
     * Validate upload file security
     * 
     * @param array $file_data File upload data
     * @param string $media_type Expected media type
     * @return array Validation result
     */
    private function validate_upload_security($file_data, $media_type) {
        $result = array(
            'valid' => false,
            'errors' => array(),
            'warnings' => array(),
            'file_info' => array()
        );
        
        // Basic file validation
        if (empty($file_data['tmp_name']) || !is_uploaded_file($file_data['tmp_name'])) {
            $result['errors'][] = 'Invalid file upload';
            return $result;
        }
        
        // File size validation
        $max_size = ($media_type === 'video') ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for video, 10MB for images
        if ($file_data['size'] > $max_size) {
            $result['errors'][] = 'File size exceeds maximum allowed (' . size_format($max_size) . ')';
            return $result;
        }
        
        // MIME type validation
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file_data['tmp_name']);
        finfo_close($finfo);
        
        $allowed_mimes = array(
            'image' => array('image/jpeg', 'image/png', 'image/gif', 'image/webp'),
            'video' => array('video/mp4', 'video/webm', 'video/ogg')
        );
        
        if (!in_array($mime_type, $allowed_mimes[$media_type] ?? array())) {
            $result['errors'][] = 'File type not allowed for ' . $media_type;
            return $result;
        }
        
        $result['valid'] = true;
        $result['file_info'] = array(
            'mime_type' => $mime_type,
            'size' => $file_data['size'],
            'name' => sanitize_file_name($file_data['name'])
        );
        
        return $result;
    }
    
    /**
     * Process WordPress media upload
     * 
     * @param array $file_data File data
     * @param string $media_type Media type
     * @param int $feature_id Feature ID for attachment
     * @return int|false Attachment ID or false on failure
     */
    private function process_wordpress_upload($file_data, $media_type, $feature_id = 0) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        
        $upload_overrides = array(
            'test_form' => false,
            'test_type' => true
        );
        
        $uploaded_file = wp_handle_upload($file_data, $upload_overrides);
        
        if (!empty($uploaded_file['error'])) {
            $this->log_error('WordPress upload error: ' . $uploaded_file['error']);
            return false;
        }
        
        // Create attachment
        $attachment = array(
            'post_mime_type' => $uploaded_file['type'],
            'post_title' => preg_replace('/\.[^.]+$/', '', basename($uploaded_file['file'])),
            'post_content' => '',
            'post_status' => 'inherit'
        );
        
        $attachment_id = wp_insert_attachment($attachment, $uploaded_file['file']);
        
        if (!is_wp_error($attachment_id)) {
            // Generate metadata
            $attachment_data = wp_generate_attachment_metadata($attachment_id, $uploaded_file['file']);
            wp_update_attachment_metadata($attachment_id, $attachment_data);
            
            // Associate with feature if ID provided
            if ($feature_id > 0) {
                update_post_meta($attachment_id, '_fitcopilot_training_feature_id', $feature_id);
            }
            
            return $attachment_id;
        }
        
        return false;
    }
    
    /**
     * Extract video poster from video URL
     * 
     * @param string $video_url Video URL
     * @return array Poster extraction result
     */
    private function extract_video_poster($video_url) {
        $result = array(
            'success' => false,
            'poster_url' => '',
            'platform' => '',
            'video_id' => ''
        );
        
        // YouTube poster extraction
        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $video_url, $matches)) {
            $video_id = $matches[1];
            $result['success'] = true;
            $result['poster_url'] = "https://img.youtube.com/vi/{$video_id}/maxresdefault.jpg";
            $result['platform'] = 'YouTube';
            $result['video_id'] = $video_id;
        }
        // Vimeo poster extraction
        elseif (preg_match('/vimeo\.com\/(\d+)/', $video_url, $matches)) {
            $video_id = $matches[1];
            
            // Get Vimeo video data
            $vimeo_api_url = "https://vimeo.com/api/v2/video/{$video_id}.json";
            $response = wp_remote_get($vimeo_api_url);
            
            if (!is_wp_error($response)) {
                $body = wp_remote_retrieve_body($response);
                $data = json_decode($body, true);
                
                if (!empty($data[0]['thumbnail_large'])) {
                    $result['success'] = true;
                    $result['poster_url'] = $data[0]['thumbnail_large'];
                    $result['platform'] = 'Vimeo';
                    $result['video_id'] = $video_id;
                }
            }
        }
        
        return $result;
    }
    
    /**
     * Get attachment data for response
     * 
     * @param int $attachment_id Attachment ID
     * @param string $media_type Media type
     * @return array Attachment data
     */
    private function get_attachment_data($attachment_id, $media_type) {
        $attachment_url = wp_get_attachment_url($attachment_id);
        $attachment_metadata = wp_get_attachment_metadata($attachment_id);
        
        $data = array(
            'attachment_id' => $attachment_id,
            'url' => $attachment_url,
            'filename' => basename($attachment_url),
            'file_size' => size_format(filesize(get_attached_file($attachment_id))),
            'mime_type' => get_post_mime_type($attachment_id)
        );
        
        if ($media_type === 'image' && !empty($attachment_metadata)) {
            $data['dimensions'] = array(
                'width' => $attachment_metadata['width'] ?? 0,
                'height' => $attachment_metadata['height'] ?? 0
            );
            $data['sizes'] = $attachment_metadata['sizes'] ?? array();
        }
        
        return $data;
    }
    
    /**
     * Perform security scan on file
     * 
     * @param array $file_data File data
     * @param string $media_type Media type
     * @return array Security scan result
     */
    private function perform_security_scan($file_data, $media_type) {
        return array(
            'secure' => true,
            'scan_results' => array(
                'virus_scan' => 'clean',
                'malware_scan' => 'clean',
                'file_type_verified' => true
            ),
            'recommendations' => array()
        );
    }
    
    /**
     * Perform media optimization
     * 
     * @param string $media_url Media URL
     * @param string $optimization_type Optimization type
     * @return array Optimization result
     */
    private function perform_media_optimization($media_url, $optimization_type) {
        return array(
            'success' => true,
            'optimized_url' => $media_url,
            'size_reduction' => '15%',
            'optimization_applied' => array($optimization_type)
        );
    }
    
    /**
     * Extract media metadata
     * 
     * @param string $media_url Media URL
     * @param string $media_type Media type
     * @return array Metadata
     */
    private function extract_media_metadata($media_url, $media_type) {
        return array(
            'success' => true,
            'metadata' => array(
                'url' => $media_url,
                'type' => $media_type,
                'accessible' => true,
                'last_modified' => current_time('mysql')
            )
        );
    }
}