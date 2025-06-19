<?php
/**
 * Fix Nonce Mismatch Issues
 * 
 * Quick fix for Training Calendar nonce mismatch between frontend and backend
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Fix Training Calendar Nonce Issues
 */
function fix_training_calendar_nonce_issues() {
    echo "<h2>🔧 Nonce Mismatch Fix</h2>";
    echo "<p><strong>Fixing nonce issues at:</strong> " . current_time('mysql') . "</p>";
    echo "<hr>";
    
    // ===== ISSUE ANALYSIS =====
    echo "<h3>📋 Issue Analysis</h3>";
    echo "<p><strong>Problem:</strong> Frontend expects 'nonce' from fitcopilotTrainingCalendarData, but it's empty</p>";
    echo "<p><strong>Root Cause:</strong> Provider class creates nonces but doesn't set 'nonce' field in main data</p>";
    
    // ===== CURRENT NONCE STATUS =====
    echo "<h3>🔍 Current Nonce Status</h3>";
    
    if (class_exists('FitCopilot_Training_Calendar_Provider')) {
        $provider = new FitCopilot_Training_Calendar_Provider();
        $calendar_data = $provider->get_frontend_data();
        
        echo "<table border='1' cellpadding='5' cellspacing='0'>";
        echo "<tr><th>Field</th><th>Value</th><th>Status</th></tr>";
        
        $nonce_main = isset($calendar_data['nonce']) ? $calendar_data['nonce'] : null;
        $nonce_ajax = isset($calendar_data['api']['ajaxNonce']) ? $calendar_data['api']['ajaxNonce'] : null;
        $nonce_rest = isset($calendar_data['api']['restNonce']) ? $calendar_data['api']['restNonce'] : null;
        
        echo "<tr><td>calendar_data['nonce']</td><td>" . ($nonce_main ?: 'NOT SET') . "</td><td>" . ($nonce_main ? '✅ OK' : '❌ MISSING') . "</td></tr>";
        echo "<tr><td>calendar_data['api']['ajaxNonce']</td><td>" . ($nonce_ajax ?: 'NOT SET') . "</td><td>" . ($nonce_ajax ? '✅ OK' : '❌ MISSING') . "</td></tr>";
        echo "<tr><td>calendar_data['api']['restNonce']</td><td>" . ($nonce_rest ?: 'NOT SET') . "</td><td>" . ($nonce_rest ? '✅ OK' : '❌ MISSING') . "</td></tr>";
        echo "</table>";
        
        // ===== THE FIX =====
        echo "<h3>🛠️ Applying Fix</h3>";
        
        if (!$nonce_main && $nonce_ajax) {
            echo "<p>✅ <strong>Fix Available:</strong> ajaxNonce exists, can copy to main nonce field</p>";
            echo "<p><strong>Recommended Action:</strong> Update provider class to set calendar_data['nonce'] = calendar_data['api']['ajaxNonce']</p>";
            
            echo "<div style='background: #f0f8ff; padding: 15px; border-left: 4px solid #0073aa;'>";
            echo "<h4>Code Fix for class-training-calendar-provider.php:</h4>";
            echo "<pre style='background: #f5f5f5; padding: 10px; overflow-x: auto;'>";
            echo "// In get_frontend_data() method, after creating the \$calendar_data array:
\$calendar_data['nonce'] = \$calendar_data['api']['ajaxNonce'];

// Or add this line around line 323:
'nonce' => wp_create_nonce('training_calendar_nonce'),";
            echo "</pre>";
            echo "</div>";
            
        } else {
            echo "<p>❌ <strong>Issue:</strong> No ajax nonce available to copy</p>";
        }
        
    } else {
        echo "<p style='color: red;'>❌ Provider class not found!</p>";
    }
    
    // ===== BACKEND NONCE VERIFICATION =====
    echo "<h3>🔐 Backend Nonce Verification</h3>";
    
    echo "<p>The AJAX handler accepts these nonce formats:</p>";
    echo "<ul>";
    echo "<li><code>wp_verify_nonce(\$nonce_value, 'fitcopilot_training_calendar_nonce')</code></li>";
    echo "<li><code>wp_verify_nonce(\$nonce_value, 'training_calendar_nonce')</code></li>";
    echo "</ul>";
    
    $test_nonce_1 = wp_create_nonce('fitcopilot_training_calendar_nonce');
    $test_nonce_2 = wp_create_nonce('training_calendar_nonce');
    
    echo "<p><strong>Generated test nonces:</strong></p>";
    echo "<ul>";
    echo "<li>fitcopilot_training_calendar_nonce: <code>$test_nonce_1</code></li>";
    echo "<li>training_calendar_nonce: <code>$test_nonce_2</code></li>";
    echo "</ul>";
    
    // ===== IMMEDIATE WORKAROUND =====
    echo "<h3>⚡ Immediate Workaround</h3>";
    
    echo "<div style='background: #fff8dc; padding: 15px; border-left: 4px solid #ffb900;'>";
    echo "<h4>🚀 Quick Fix Steps:</h4>";
    echo "<ol>";
    echo "<li><strong>Open:</strong> <code>inc/admin/training-calendar/class-training-calendar-provider.php</code></li>";
    echo "<li><strong>Find:</strong> The <code>get_frontend_data()</code> method around line 300-400</li>";
    echo "<li><strong>Add:</strong> <code>'nonce' => wp_create_nonce('training_calendar_nonce'),</code> to the main \$calendar_data array</li>";
    echo "<li><strong>Save</strong> and refresh the page</li>";
    echo "</ol>";
    echo "</div>";
    
    // ===== VERIFICATION SCRIPT =====
    echo "<h3>🧪 Verification Script</h3>";
    
    echo "<div style='background: #f0fff0; padding: 15px; border-left: 4px solid #00aa00;'>";
    echo "<h4>Test in Browser Console:</h4>";
    echo "<pre style='background: #f5f5f5; padding: 10px; overflow-x: auto;'>";
    echo "// Check if nonce is now available
console.log('Calendar Data Nonce:', window.fitcopilotTrainingCalendarData?.nonce);

// Test AJAX call with proper nonce
const testEventData = {
    title: 'Test Event',
    description: 'Test description',
    start_datetime: new Date(Date.now() + 24*60*60*1000).toISOString(),
    end_datetime: new Date(Date.now() + 25*60*60*1000).toISOString(),
    event_type: 'assessment',
    booking_status: 'pending'
};

const formData = new FormData();
formData.append('action', 'save_individual_calendar_event');
formData.append('nonce', window.fitcopilotTrainingCalendarData.nonce);
formData.append('event_data', JSON.stringify(testEventData));

fetch('/wp-admin/admin-ajax.php', {
    method: 'POST',
    body: formData,
    credentials: 'same-origin'
}).then(response => response.json())
  .then(data => console.log('AJAX Test Result:', data))
  .catch(error => console.error('AJAX Test Error:', error));";
    echo "</pre>";
    echo "</div>";
    
    echo "<hr>";
    echo "<p><em>Fix analysis completed at " . current_time('mysql') . "</em></p>";
}

// Run the fix analysis if accessed directly
if (isset($_GET['fix_nonce_mismatch'])) {
    fix_training_calendar_nonce_issues();
    exit;
}
?> 