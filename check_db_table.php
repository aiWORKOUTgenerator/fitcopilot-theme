<?php
/**
 * Quick script to check if training features table exists
 */

// Load WordPress
require_once __DIR__ . '/wp-config.php';
require_once __DIR__ . '/wp-load.php';

global $wpdb;

// Check if table exists
$table_name = $wpdb->prefix . 'fitcopilot_training_features';
$table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$table_name}'");

echo "=== Training Features Database Check ===\n";
echo "Table name: {$table_name}\n";
echo "Table exists: " . ($table_exists ? "YES" : "NO") . "\n";

if ($table_exists) {
    // Get table structure
    $columns = $wpdb->get_results("DESCRIBE {$table_name}");
    echo "\nTable structure:\n";
    foreach ($columns as $column) {
        echo "- {$column->Field} ({$column->Type})\n";
    }
    
    // Get row count
    $count = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name}");
    echo "\nTotal rows: {$count}\n";
    
    if ($count > 0) {
        echo "\nFirst few rows:\n";
        $rows = $wpdb->get_results("SELECT id, title, is_active FROM {$table_name} LIMIT 3", ARRAY_A);
        foreach ($rows as $row) {
            echo "- ID: {$row['id']}, Title: {$row['title']}, Active: {$row['is_active']}\n";
        }
    }
} else {
    echo "\n❌ TABLE DOES NOT EXIST!\n";
    echo "This is likely the root cause of the save issue.\n";
}

echo "\n=== AJAX Actions Check ===\n";
// Check if our AJAX action is registered
$has_action = has_action('wp_ajax_fitcopilot_save_individual_feature');
echo "AJAX action registered: " . ($has_action ? "YES" : "NO") . "\n";

echo "\n=== Done ===\n"; 