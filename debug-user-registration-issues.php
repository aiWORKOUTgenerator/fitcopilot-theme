<?php
/**
 * Debug User Registration Issues
 * 
 * Comprehensive debugging for Training Calendar user registration and nonce issues
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Debug User Registration Issues
 */
function debug_user_registration_issues() {
    echo "<h2>🔍 User Registration & Nonce Debug Report</h2>";
    echo "<p><strong>Generated:</strong> " . current_time('mysql') . "</p>";
    echo "<hr>";
    
    // ===== 1. NONCE ANALYSIS =====
    echo "<h3>1. 📋 Nonce Analysis</h3>";
    
    // Check what nonces are being generated
    $calendar_nonce_1 = wp_create_nonce('fitcopilot_training_calendar_nonce');
    $calendar_nonce_2 = wp_create_nonce('training_calendar_nonce');
    $rest_nonce = wp_create_nonce('wp_rest');
    
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>Nonce Type</th><th>Value</th><th>Length</th></tr>";
    echo "<tr><td>fitcopilot_training_calendar_nonce</td><td><code>$calendar_nonce_1</code></td><td>" . strlen($calendar_nonce_1) . "</td></tr>";
    echo "<tr><td>training_calendar_nonce</td><td><code>$calendar_nonce_2</code></td><td>" . strlen($calendar_nonce_2) . "</td></tr>";
    echo "<tr><td>wp_rest</td><td><code>$rest_nonce</code></td><td>" . strlen($rest_nonce) . "</td></tr>";
    echo "</table>";
    
    // ===== 2. LOCALIZED SCRIPT DATA =====
    echo "<h3>2. 🌐 Localized Script Data</h3>";
    
    // Check what data is being localized
    echo "<h4>Training Calendar Provider Data:</h4>";
    
    // Check if global manager exists
    global $fitcopilot_training_calendar_manager;
    if ($fitcopilot_training_calendar_manager && method_exists($fitcopilot_training_calendar_manager, 'provide_frontend_data')) {
        echo "<p style='color: green;'>✅ Training Calendar Manager found and initialized!</p>";
        
        // Try to get data from provider
        try {
            // Call the provider through the manager
            ob_start();
            $fitcopilot_training_calendar_manager->provide_frontend_data();
            $provider_output = ob_get_clean();
            
            echo "<p style='color: green;'>✅ Provider data method executed successfully!</p>";
            
            // Check if script was localized
            if (wp_script_is('fitcopilot-homepage', 'enqueued')) {
                echo "<p style='color: green;'>✅ fitcopilot-homepage script is enqueued!</p>";
            } else {
                echo "<p style='color: orange;'>⚠️ fitcopilot-homepage script is NOT enqueued!</p>";
            }
            
        } catch (Exception $e) {
            echo "<p style='color: red;'>❌ Error calling provider: " . $e->getMessage() . "</p>";
        }
        
    } elseif (class_exists('FitCopilot_Training_Calendar_Provider')) {
        echo "<p style='color: orange;'>⚠️ Provider class exists but manager not initialized!</p>";
        echo "<p>Classes found:</p>";
        echo "<ul>";
        if (class_exists('FitCopilot_Training_Calendar_Manager')) echo "<li>✅ FitCopilot_Training_Calendar_Manager</li>";
        if (class_exists('FitCopilot_Training_Calendar_Data')) echo "<li>✅ FitCopilot_Training_Calendar_Data</li>";
        if (class_exists('FitCopilot_Training_Calendar_Provider')) echo "<li>✅ FitCopilot_Training_Calendar_Provider</li>";
        if (class_exists('FitCopilot_Complex_Manager')) echo "<li>✅ FitCopilot_Complex_Manager</li>";
        echo "</ul>";
    } else {
        echo "<p style='color: red;'>❌ FitCopilot_Training_Calendar_Provider class not found!</p>";
        echo "<p>Available classes check:</p>";
        echo "<ul>";
        echo "<li>FitCopilot_Training_Calendar_Manager: " . (class_exists('FitCopilot_Training_Calendar_Manager') ? "✅ Found" : "❌ Not Found") . "</li>";
        echo "<li>FitCopilot_Training_Calendar_Data: " . (class_exists('FitCopilot_Training_Calendar_Data') ? "✅ Found" : "❌ Not Found") . "</li>";
        echo "<li>FitCopilot_Training_Calendar_Provider: " . (class_exists('FitCopilot_Training_Calendar_Provider') ? "✅ Found" : "❌ Not Found") . "</li>";
        echo "<li>FitCopilot_Complex_Manager: " . (class_exists('FitCopilot_Complex_Manager') ? "✅ Found" : "❌ Not Found") . "</li>";
        echo "</ul>";
    }
    
    // ===== 3. USER REGISTRATION API ENDPOINTS =====
    echo "<h3>3. 👥 User Registration API Status</h3>";
    
    // Check if user registration endpoints exist
    $user_registration_endpoints = array(
        'Check Email' => '/wp-json/fitcopilot/v1/users/check-email',
        'Register User' => '/wp-json/fitcopilot/v1/users/register',
        'Send Welcome' => '/wp-json/fitcopilot/v1/users/send-welcome-email',
        'User Profile' => '/wp-json/fitcopilot/v1/users/profile'
    );
    
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>Endpoint</th><th>URL</th><th>Status</th></tr>";
    
    foreach ($user_registration_endpoints as $name => $endpoint) {
        $full_url = home_url($endpoint);
        $status = "❓ Unknown";
        
        // Try to check if endpoint exists (basic check)
        $response = wp_remote_get($full_url);
        if (!is_wp_error($response)) {
            $response_code = wp_remote_retrieve_response_code($response);
            if ($response_code === 404) {
                $status = "❌ Not Found (404)";
            } elseif ($response_code === 401 || $response_code === 403) {
                $status = "🔐 Protected (Auth Required)";
            } elseif ($response_code === 200) {
                $status = "✅ Available";
            } else {
                $status = "⚠️ Response Code: $response_code";
            }
        } else {
            $status = "❌ Error: " . $response->get_error_message();
        }
        
        echo "<tr><td>$name</td><td><code>$full_url</code></td><td>$status</td></tr>";
    }
    echo "</table>";
    
    // ===== 4. AJAX HANDLER VERIFICATION =====
    echo "<h3>4. 🔌 AJAX Handler Status</h3>";
    
    $ajax_actions = array(
        'save_individual_calendar_event' => 'Calendar Event Save',
        'get_calendar_events' => 'Get Calendar Events',
        'delete_calendar_event' => 'Delete Calendar Event',
        'fitcopilot_register_user' => 'User Registration (if exists)',
        'fitcopilot_check_email' => 'Email Check (if exists)'
    );
    
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>AJAX Action</th><th>Description</th><th>Hook Status</th></tr>";
    
    foreach ($ajax_actions as $action => $description) {
        $hook_exists = has_action("wp_ajax_$action") || has_action("wp_ajax_nopriv_$action");
        $status = $hook_exists ? "✅ Registered" : "❌ Not Found";
        echo "<tr><td><code>$action</code></td><td>$description</td><td>$status</td></tr>";
    }
    echo "</table>";
    
    // ===== 5. USER CAPABILITIES CHECK =====
    echo "<h3>5. 🔑 User Capabilities</h3>";
    
    $current_user = wp_get_current_user();
    echo "<p><strong>Current User:</strong> " . ($current_user->ID ? $current_user->user_login . " (ID: {$current_user->ID})" : "Not logged in") . "</p>";
    
    if ($current_user->ID) {
        $capabilities = array(
            'manage_options' => 'Admin Management',
            'edit_users' => 'Edit Users',
            'create_users' => 'Create Users',
            'list_users' => 'List Users'
        );
        
        echo "<table border='1' cellpadding='5' cellspacing='0'>";
        echo "<tr><th>Capability</th><th>Description</th><th>Status</th></tr>";
        
        foreach ($capabilities as $cap => $desc) {
            $has_cap = current_user_can($cap);
            $status = $has_cap ? "✅ Yes" : "❌ No";
            echo "<tr><td><code>$cap</code></td><td>$desc</td><td>$status</td></tr>";
        }
        echo "</table>";
    }
    
    // ===== 6. WORDPRESS USER CREATION TEST =====
    echo "<h3>6. 👤 WordPress User Creation Test</h3>";
    
    // Test if we can create a user programmatically
    $test_email = 'test-user-' . time() . '@example.com';
    $test_username = 'testuser' . time();
    
    echo "<p><strong>Testing user creation with:</strong></p>";
    echo "<ul>";
    echo "<li>Email: $test_email</li>";
    echo "<li>Username: $test_username</li>";
    echo "</ul>";
    
    $user_id = wp_create_user($test_username, wp_generate_password(), $test_email);
    
    if (is_wp_error($user_id)) {
        echo "<p style='color: red;'>❌ <strong>User creation failed:</strong> " . $user_id->get_error_message() . "</p>";
    } else {
        echo "<p style='color: green;'>✅ <strong>User creation successful!</strong> User ID: $user_id</p>";
        
        // Clean up test user
        wp_delete_user($user_id);
        echo "<p style='color: blue;'>🧹 Test user cleaned up.</p>";
    }
    
    // ===== 7. FRONTEND JAVASCRIPT VERIFICATION =====
    echo "<h3>7. 🌐 Frontend JavaScript Check</h3>";
    
    echo "<p>Check browser console for these JavaScript objects:</p>";
    echo "<ul>";
    echo "<li><code>window.fitcopilotTrainingCalendarData</code> - Should contain nonce</li>";
    echo "<li><code>window.wpApiSettings</code> - Should contain REST API nonce</li>";
    echo "<li><code>window.fitcopilotTrainingCalendarAjax</code> - Should contain AJAX nonce</li>";
    echo "</ul>";
    
    echo "<script>";
    echo "console.log('🔍 Debug: fitcopilotTrainingCalendarData', window.fitcopilotTrainingCalendarData);";
    echo "console.log('🔍 Debug: wpApiSettings', window.wpApiSettings);";
    echo "console.log('🔍 Debug: fitcopilotTrainingCalendarAjax', window.fitcopilotTrainingCalendarAjax);";
    echo "</script>";
    
    // ===== 8. RECOMMENDATIONS =====
    echo "<h3>8. 💡 Recommendations</h3>";
    
    echo "<div style='background: #f0f8ff; padding: 15px; border-left: 4px solid #0073aa;'>";
    echo "<h4>🔧 Immediate Fixes Needed:</h4>";
    echo "<ol>";
    echo "<li><strong>Fix Nonce Mismatch:</strong> Frontend expects 'nonce' but backend creates 'fitcopilot_training_calendar_nonce'</li>";
    echo "<li><strong>Create User Registration API:</strong> No user registration endpoints found</li>";
    echo "<li><strong>Update Frontend Flow:</strong> Should register user BEFORE creating calendar event</li>";
    echo "<li><strong>Verify AJAX Handlers:</strong> Ensure all required AJAX actions are registered</li>";
    echo "</ol>";
    echo "</div>";
    
    echo "<div style='background: #fff8dc; padding: 15px; border-left: 4px solid #ffb900; margin-top: 10px;'>";
    echo "<h4>⚠️ Current Workflow Issue:</h4>";
    echo "<p>The system is trying to save a calendar event without user registration. The correct flow should be:</p>";
    echo "<ol>";
    echo "<li>User clicks 'Create Event'</li>";
    echo "<li>User Registration Modal appears</li>";
    echo "<li>User enters email/name and submits</li>";
    echo "<li>WordPress user account is created</li>";
    echo "<li>Calendar event is created with user association</li>";
    echo "<li>Booking confirmation is shown</li>";
    echo "</ol>";
    echo "</div>";
    
    echo "<hr>";
    echo "<p><em>Debug completed at " . current_time('mysql') . "</em></p>";
}

// Run the debug if accessed directly
if (isset($_GET['debug_user_registration'])) {
    debug_user_registration_issues();
    exit;
}
?> 