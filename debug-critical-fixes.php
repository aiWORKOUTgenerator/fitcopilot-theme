<?php
/**
 * Critical Fixes Debug Verification Script
 * 
 * This script verifies the two critical fixes implemented for Training Calendar:
 * 1. REST API Nonce Authentication Fix
 * 2. React Defensive Programming for Time Slot Errors
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Debug Critical Fixes Implementation
 * 
 * Tests both REST API nonce and React error handling fixes
 */
function debug_critical_fixes() {
    echo "<h1>🔧 Critical Fixes Debug Verification</h1>";
    echo "<div style='font-family: monospace; background: #f0f0f0; padding: 20px; margin: 20px 0;'>";
    
    // === Fix 1: REST API Nonce Verification ===
    echo "<h2>🔐 Fix 1: REST API Nonce Authentication</h2>";
    
    // Check if wpApiSettings is being localized
    global $wp_scripts;
    $homepage_script_registered = isset($wp_scripts->registered['fitcopilot-homepage']);
    echo "<p><strong>Homepage Script Registered:</strong> " . ($homepage_script_registered ? "✅ YES" : "❌ NO") . "</p>";
    
    if ($homepage_script_registered) {
        $localized_data = $wp_scripts->registered['fitcopilot-homepage']->extra['data'] ?? '';
        $has_wp_api_settings = strpos($localized_data, 'wpApiSettings') !== false;
        echo "<p><strong>wpApiSettings Localized:</strong> " . ($has_wp_api_settings ? "✅ YES" : "❌ NO") . "</p>";
        
        if ($has_wp_api_settings) {
            echo "<p><strong>Expected Frontend Data:</strong></p>";
            echo "<pre style='background: #e8f4f8; padding: 10px; border-left: 4px solid #2196F3;'>";
            echo "window.wpApiSettings = {\n";
            echo "    root: '" . esc_url_raw(rest_url()) . "',\n";
            echo "    nonce: '" . wp_create_nonce('wp_rest') . "',\n";
            echo "    api_url: '" . home_url('/wp-json/') . "',\n";
            echo "    rest_url: '" . esc_url_raw(rest_url('fitcopilot/v1/')) . "'\n";
            echo "};\n";
            echo "</pre>";
        }
    }
    
    // Test REST API endpoint accessibility
    echo "<h3>🧪 REST API Endpoint Test</h3>";
    $rest_url = rest_url('fitcopilot/v1/trainer-availability');
    echo "<p><strong>Endpoint URL:</strong> <code>{$rest_url}</code></p>";
    
    // Check if REST API is enabled
    $rest_enabled = function_exists('rest_get_server');
    echo "<p><strong>REST API Enabled:</strong> " . ($rest_enabled ? "✅ YES" : "❌ NO") . "</p>";
    
    // Check if custom endpoint is registered
    $rest_server = rest_get_server();
    $routes = $rest_server->get_routes();
    $custom_route_exists = isset($routes['/fitcopilot/v1/trainer-availability']);
    echo "<p><strong>Custom Route Registered:</strong> " . ($custom_route_exists ? "✅ YES" : "❌ NO") . "</p>";
    
    if ($custom_route_exists) {
        echo "<p><strong>Route Details:</strong></p>";
        echo "<pre style='background: #e8f4f8; padding: 10px; border-left: 4px solid #2196F3;'>";
        print_r($routes['/fitcopilot/v1/trainer-availability']);
        echo "</pre>";
    }
    
    // === Fix 2: React Defensive Programming Verification ===
    echo "<h2>🛡️ Fix 2: React Defensive Programming</h2>";
    
    // Check if EventModal.tsx has defensive programming
    $event_modal_path = get_template_directory() . '/src/features/Homepage/TrainingCalendar/components/EventModal/EventModal.tsx';
    $event_modal_exists = file_exists($event_modal_path);
    echo "<p><strong>EventModal.tsx Exists:</strong> " . ($event_modal_exists ? "✅ YES" : "❌ NO") . "</p>";
    
    if ($event_modal_exists) {
        $event_modal_content = file_get_contents($event_modal_path);
        
        // Check for defensive programming patterns
        $defensive_patterns = [
            'selectedTimeSlot &&' => 'Null check for selectedTimeSlot',
            'selectedTimeSlot.startTime &&' => 'Null check for startTime',
            'selectedTimeSlot.endTime &&' => 'Null check for endTime',
            'typeof selectedTimeSlot.startTime.toLocaleString === \'function\'' => 'Function type validation',
            'try {' => 'Try-catch error handling',
            'catch (' => 'Catch block implementation',
            'event-modal__error-fallback' => 'Error fallback UI class',
            'console.warn(' => 'Development logging',
            'console.error(' => 'Error logging'
        ];
        
        echo "<p><strong>Defensive Programming Patterns:</strong></p>";
        echo "<ul style='background: #e8f4f8; padding: 15px; border-left: 4px solid #2196F3;'>";
        
        foreach ($defensive_patterns as $pattern => $description) {
            $pattern_exists = strpos($event_modal_content, $pattern) !== false;
            $status = $pattern_exists ? "✅" : "❌";
            echo "<li><strong>{$status} {$description}:</strong> <code>{$pattern}</code></li>";
        }
        echo "</ul>";
        
        // Count occurrences of key defensive patterns
        $null_checks = substr_count($event_modal_content, 'selectedTimeSlot &&');
        $try_catch_blocks = substr_count($event_modal_content, 'try {');
        $error_logs = substr_count($event_modal_content, 'console.error(');
        
        echo "<p><strong>Pattern Statistics:</strong></p>";
        echo "<ul style='background: #f0f8ff; padding: 15px; border-left: 4px solid #0066cc;'>";
        echo "<li>Null Checks: <strong>{$null_checks}</strong></li>";
        echo "<li>Try-Catch Blocks: <strong>{$try_catch_blocks}</strong></li>";
        echo "<li>Error Logs: <strong>{$error_logs}</strong></li>";
        echo "</ul>";
    }
    
    // Check if error state styling exists
    $event_modal_scss_path = get_template_directory() . '/src/features/Homepage/TrainingCalendar/components/EventModal/EventModal.scss';
    $scss_exists = file_exists($event_modal_scss_path);
    echo "<p><strong>EventModal.scss Exists:</strong> " . ($scss_exists ? "✅ YES" : "❌ NO") . "</p>";
    
    if ($scss_exists) {
        $scss_content = file_get_contents($event_modal_scss_path);
        $has_error_styles = strpos($scss_content, 'event-modal__error-fallback') !== false;
        echo "<p><strong>Error Fallback Styles:</strong> " . ($has_error_styles ? "✅ YES" : "❌ NO") . "</p>";
    }
    
    // === Build Status Check ===
    echo "<h2>🏗️ Build Status</h2>";
    
    $dist_path = get_template_directory() . '/dist';
    $homepage_js = $dist_path . '/homepage.js';
    $homepage_css = $dist_path . '/homepage.css';
    
    echo "<p><strong>Dist Directory:</strong> " . (is_dir($dist_path) ? "✅ EXISTS" : "❌ MISSING") . "</p>";
    echo "<p><strong>homepage.js:</strong> " . (file_exists($homepage_js) ? "✅ EXISTS (" . number_format(filesize($homepage_js) / 1024, 2) . " KB)" : "❌ MISSING") . "</p>";
    echo "<p><strong>homepage.css:</strong> " . (file_exists($homepage_css) ? "✅ EXISTS (" . number_format(filesize($homepage_css) / 1024, 2) . " KB)" : "❌ MISSING") . "</p>";
    
    if (file_exists($homepage_js)) {
        $last_modified = filemtime($homepage_js);
        $time_ago = human_time_diff($last_modified, current_time('timestamp'));
        echo "<p><strong>Last Build:</strong> {$time_ago} ago (" . date('Y-m-d H:i:s', $last_modified) . ")</p>";
    }
    
    // === Test Recommendations ===
    echo "<h2>🧪 Testing Recommendations</h2>";
    echo "<div style='background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px;'>";
    echo "<h3>Manual Testing Steps:</h3>";
    echo "<ol>";
    echo "<li><strong>REST API Test:</strong> Open browser dev tools → Network tab → Try creating event → Check for 200 OK on trainer-availability endpoint</li>";
    echo "<li><strong>React Error Test:</strong> Open dev tools → Console tab → Look for defensive programming logs during event creation</li>";
    echo "<li><strong>Time Slot Error Test:</strong> Try selecting invalid time slots → Should show fallback UI instead of crashing</li>";
    echo "<li><strong>Build Verification:</strong> Check homepage loads without JavaScript errors</li>";
    echo "</ol>";
    echo "</div>";
    
    // === Expected Outcomes ===
    echo "<h2>✅ Expected Outcomes</h2>";
    echo "<div style='background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px;'>";
    echo "<h3>After Fixes:</h3>";
    echo "<ul>";
    echo "<li><strong>API Calls:</strong> Should return 200 OK instead of 403 Forbidden</li>";
    echo "<li><strong>React Errors:</strong> Should show graceful fallback instead of runtime crashes</li>";
    echo "<li><strong>Event Creation:</strong> Should work end-to-end without critical errors</li>";
    echo "<li><strong>Time Slot Display:</strong> Should handle invalid data gracefully</li>";
    echo "</ul>";
    echo "</div>";
    
    echo "</div>";
    
    // === Footer ===
    echo "<hr>";
    echo "<p><em>Debug verification completed at " . current_time('Y-m-d H:i:s') . "</em></p>";
}

// Add debug page to admin menu for testing
add_action('admin_menu', function() {
    add_submenu_page(
        'tools.php',
        'Training Calendar Debug',
        'Training Calendar Debug',
        'manage_options',
        'training-calendar-debug',
        'debug_critical_fixes'
    );
});

// Add admin notice for quick access
add_action('admin_notices', function() {
    $screen = get_current_screen();
    if ($screen && in_array($screen->id, ['dashboard', 'toplevel_page_fitcopilot-admin'])) {
        echo '<div class="notice notice-info is-dismissible">';
        echo '<p><strong>Training Calendar Critical Fixes:</strong> <a href="' . admin_url('tools.php?page=training-calendar-debug') . '">Run Debug Verification →</a></p>';
        echo '</div>';
    }
});
?> 