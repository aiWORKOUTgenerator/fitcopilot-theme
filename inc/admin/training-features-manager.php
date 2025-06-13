<?php
/**
 * FitCopilot Training Features Manager Entry Point
 * 
 * Main initialization file for the Training Features admin interface
 * Follows the established Personal Training admin architecture patterns
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Initialize the Training Features Manager
if (!class_exists('FitCopilot_Training_Features_Manager')) {
    // Load the manager class
    require_once get_template_directory() . '/inc/admin/training-features/class-training-features-manager.php';
    
    // Initialize the admin interface
    new FitCopilot_Training_Features_Manager();
} 