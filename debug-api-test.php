<?php
/**
 * Trainer Availability API Debug Test
 * 
 * Simple test file to debug the 403 authentication issue
 * Access this at: yoursite.com/debug-api-test.php
 */

// Load WordPress - correct path: themes/fitcopilot -> wp-content -> public -> wp-load.php
require_once('../../../wp-load.php');

// Set headers
header('Content-Type: text/html; charset=utf-8');

echo "<h1>Trainer Availability API Debug Test</h1>";
echo "<h2>Authentication Diagnostics</h2>";

// Check if user is logged in
echo "<p><strong>User Status:</strong> " . (is_user_logged_in() ? 'Logged in (ID: ' . get_current_user_id() . ')' : 'Not logged in') . "</p>";

// Check REST API
echo "<p><strong>REST API URL:</strong> " . rest_url() . "</p>";
echo "<p><strong>REST API Status:</strong> " . (rest_url() ? 'ENABLED' : 'DISABLED') . "</p>";

// Generate nonces
$rest_nonce = wp_create_nonce('wp_rest');
$training_calendar_nonce = wp_create_nonce('training_calendar_nonce');

echo "<h3>Available Nonces</h3>";
echo "<p><strong>REST Nonce:</strong> " . $rest_nonce . "</p>";
echo "<p><strong>Training Calendar Nonce:</strong> " . $training_calendar_nonce . "</p>";

// Check if API class is loaded
echo "<h3>API Class Status</h3>";
$api_file = get_template_directory() . '/inc/admin/training-calendar/class-trainer-availability-api.php';
echo "<p><strong>API File Path:</strong> " . $api_file . "</p>";
echo "<p><strong>API File Exists:</strong> " . (file_exists($api_file) ? 'YES' : 'NO') . "</p>";

if (file_exists($api_file)) {
    require_once $api_file;
    echo "<p><strong>API Class Exists:</strong> " . (class_exists('FitCopilot_Trainer_Availability_API') ? 'YES' : 'NO') . "</p>";
}

// Check available REST routes
echo "<h3>Available REST Routes</h3>";
$rest_server = rest_get_server();
$routes = $rest_server->get_routes();

echo "<p><strong>Total Routes Registered:</strong> " . count($routes) . "</p>";

// Look for our specific route
$our_routes = array();
foreach ($routes as $route_path => $route_data) {
    if (strpos($route_path, 'fitcopilot') !== false) {
        $our_routes[$route_path] = $route_data;
    }
}

echo "<p><strong>FitCopilot Routes Found:</strong> " . count($our_routes) . "</p>";

if (count($our_routes) > 0) {
    echo "<ul>";
    foreach ($our_routes as $route_path => $route_data) {
        echo "<li><strong>" . $route_path . "</strong>";
        if (isset($route_data[0]['methods'])) {
            $methods = is_array($route_data[0]['methods']) ? implode(', ', array_keys($route_data[0]['methods'])) : $route_data[0]['methods'];
            echo " (Methods: " . $methods . ")";
        }
        echo "</li>";
    }
    echo "</ul>";
} else {
    echo "<p style='color: red;'><strong>ERROR:</strong> No FitCopilot routes found! This explains the 404 errors.</p>";
}

// Check if our specific route exists
$our_route_exists = isset($routes['/fitcopilot/v1/trainer-availability']);
echo "<p><strong>Our Route (/fitcopilot/v1/trainer-availability) Registered:</strong> " . ($our_route_exists ? 'YES' : 'NO') . "</p>";

// Test API endpoint directly
echo "<h3>Direct API Test</h3>";
$test_url = rest_url('fitcopilot/v1/trainer-availability');
echo "<p><strong>Full API URL:</strong> <a href='" . $test_url . "?date=2025-06-19&event_type=Free%20Consultation%20(20%20Min)&duration=20&_wpnonce=" . $rest_nonce . "' target='_blank'>" . $test_url . "</a></p>";

// Test with CURL if available
if (function_exists('curl_init')) {
    echo "<h3>CURL Test</h3>";
    
    $test_params = array(
        'date' => '2025-06-19',
        'event_type' => 'Free Consultation (20 Min)',
        'duration' => 20
    );
    
    $test_url_with_params = $test_url . '?' . http_build_query($test_params);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $test_url_with_params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'X-WP-Nonce: ' . $rest_nonce
    ));
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    echo "<p><strong>HTTP Status Code:</strong> " . $http_code . "</p>";
    
    if ($curl_error) {
        echo "<p><strong>CURL Error:</strong> " . $curl_error . "</p>";
    }
    
    if ($response) {
        echo "<p><strong>Response:</strong></p>";
        echo "<pre style='background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto;'>";
        echo htmlspecialchars($response);
        echo "</pre>";
    }
} else {
    echo "<p><strong>CURL not available</strong> for direct testing.</p>";
}

// WordPress debug info
echo "<h3>WordPress Debug Info</h3>";
echo "<p><strong>WP_DEBUG:</strong> " . (defined('WP_DEBUG') && WP_DEBUG ? 'ENABLED' : 'DISABLED') . "</p>";
echo "<p><strong>WP_DEBUG_LOG:</strong> " . (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG ? 'ENABLED' : 'DISABLED') . "</p>";
echo "<p><strong>WordPress Version:</strong> " . get_bloginfo('version') . "</p>";
echo "<p><strong>Current Theme:</strong> " . get_template() . "</p>";

echo "<h3>Next Steps</h3>";
if (count($our_routes) === 0) {
    echo "<p style='color: red;'>The API routes are not being registered. Check:</p>";
    echo "<ul>";
    echo "<li>Functions.php initialization</li>";
    echo "<li>API class init() method being called</li>";
    echo "<li>rest_api_init hook firing</li>";
    echo "<li>WordPress error logs</li>";
    echo "</ul>";
} else {
    echo "<p style='color: green;'>Routes are registered! The issue might be authentication or parameters.</p>";
}
?> 