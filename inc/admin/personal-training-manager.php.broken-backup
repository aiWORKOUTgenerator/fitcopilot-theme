<?php
/**
 * FitCopilot Personal Training Manager Admin Page
 * 
 * Clean modular system loader - Phase 2 Migration Complete
 * 
 * @package FitCopilot
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * MIGRATION FEATURE FLAG
 * 
 * Phase 2 Migration: Use modular architecture
 */
define('FITCOPILOT_USE_MODULAR_PERSONAL_TRAINING', true);

// Load the modular system
if (defined('FITCOPILOT_USE_MODULAR_PERSONAL_TRAINING') && FITCOPILOT_USE_MODULAR_PERSONAL_TRAINING) {
    require_once get_template_directory() . '/inc/admin/personal-training/class-personal-training-manager.php';
    return; // Exit early - modular system handles everything
}

// Legacy system would be here but is deprecated
error_log('FitCopilot: Personal Training Manager legacy system attempted to load but is deprecated'); 