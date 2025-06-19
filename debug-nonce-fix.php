<?php
/**
 * Nonce Fix Debug Script
 * 
 * Comprehensive debugging and fixing for the 403 API errors
 * caused by malformed nonce (&_wpnonce=:1)
 * 
 * @package FitCopilot
 * @subpackage Debug
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Debug and fix nonce issues
 */
function debug_and_fix_nonce_issues() {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Nonce Fix Debug Report</title>
        <style>
            body { font-family: monospace; margin: 20px; background: #f5f5f5; }
            .debug-section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #007cba; }
            .debug-section h2 { margin-top: 0; color: #007cba; }
            .success { color: #00a32a; font-weight: bold; }
            .error { color: #d63638; font-weight: bold; }
            .warning { color: #dba617; font-weight: bold; }
            .code { background: #f6f7f7; padding: 10px; border-radius: 4px; margin: 10px 0; }
            .fix-button { background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 5px; }
            .fix-button:hover { background: #005a87; }
        </style>
    </head>
    <body>
        <h1>🔧 Nonce Fix Debug Report</h1>
        <p><strong>Timestamp:</strong> <?php echo date('Y-m-d H:i:s'); ?></p>
        
        <div class="debug-section">
            <h2>🔐 Issue Analysis: Malformed Nonce (&_wpnonce=:1)</h2>
            
            <?php
            // Test current nonce generation
            $rest_nonce = wp_create_nonce('wp_rest');
            $training_nonce = wp_create_nonce('fitcopilot_training_calendar_nonce');
            
            echo "<h3>Current Nonce Status</h3>";
            echo "<div class='code'>";
            echo "REST API Nonce: " . esc_html($rest_nonce) . "<br>";
            echo "Training Calendar Nonce: " . esc_html($training_nonce) . "<br>";
            echo "Nonce Length: " . strlen($rest_nonce) . " characters<br>";
            echo "Expected Length: 10 characters<br>";
            echo "</div>";
            
            if (strlen($rest_nonce) === 10) {
                echo "<p class='success'>✅ Nonce generation is working correctly</p>";
            } else {
                echo "<p class='error'>❌ Nonce generation is broken</p>";
            }
            ?>
            
            <h3>Diagnosed Issues</h3>
            <div class="code">
                <strong>Problem:</strong> API requests showing malformed nonce: &_wpnonce=:1<br>
                <strong>Root Cause:</strong> JavaScript is not properly accessing wpApiSettings.nonce<br>
                <strong>Evidence:</strong> Backend nonce is valid (<?php echo esc_html($rest_nonce); ?>) but frontend gets malformed version
            </div>
        </div>
        
        <div class="debug-section">
            <h2>🛠️ Fix 1: Enhanced wp_localize_script</h2>
            
            <?php
            echo "<h3>Current wpApiSettings Configuration</h3>";
            echo "<div class='code'>";
            echo "wp_localize_script('fitcopilot-homepage', 'wpApiSettings', array(<br>";
            echo "&nbsp;&nbsp;'root' => '" . esc_url_raw(rest_url()) . "',<br>";
            echo "&nbsp;&nbsp;'nonce' => '" . wp_create_nonce('wp_rest') . "',<br>";
            echo "&nbsp;&nbsp;'api_url' => '" . home_url('/wp-json/') . "',<br>";
            echo "&nbsp;&nbsp;'rest_url' => '" . esc_url_raw(rest_url('fitcopilot/v1/')) . "'<br>";
            echo "));<br>";
            echo "</div>";
            
            // Check if the script is enqueued
            global $wp_scripts;
            $homepage_script_enqueued = isset($wp_scripts->registered['fitcopilot-homepage']);
            
            if ($homepage_script_enqueued) {
                echo "<p class='success'>✅ fitcopilot-homepage script is registered</p>";
                
                // Check if wpApiSettings is localized
                $localized_data = $wp_scripts->registered['fitcopilot-homepage']->extra ?? [];
                $has_wpapi_settings = false;
                
                if (isset($localized_data['data'])) {
                    $data_string = $localized_data['data'];
                    $has_wpapi_settings = strpos($data_string, 'wpApiSettings') !== false;
                }
                
                if ($has_wpapi_settings) {
                    echo "<p class='success'>✅ wpApiSettings is localized to fitcopilot-homepage</p>";
                } else {
                    echo "<p class='error'>❌ wpApiSettings is NOT localized to fitcopilot-homepage</p>";
                }
            } else {
                echo "<p class='error'>❌ fitcopilot-homepage script is NOT registered</p>";
            }
            ?>
            
            <h3>Enhanced Fix Implementation</h3>
            <div class="code">
                // Add this to functions.php after existing wp_localize_script<br>
                wp_localize_script('fitcopilot-homepage', 'fitcopilotApiConfig', array(<br>
                &nbsp;&nbsp;'restUrl' => esc_url_raw(rest_url('fitcopilot/v1/')),<br>
                &nbsp;&nbsp;'restNonce' => wp_create_nonce('wp_rest'),<br>
                &nbsp;&nbsp;'ajaxUrl' => admin_url('admin-ajax.php'),<br>
                &nbsp;&nbsp;'ajaxNonce' => wp_create_nonce('fitcopilot_training_calendar_nonce'),<br>
                &nbsp;&nbsp;'debug' => WP_DEBUG<br>
                ));
            </div>
        </div>
        
        <div class="debug-section">
            <h2>🔧 Fix 2: Frontend Nonce Access Update</h2>
            
            <h3>Current JavaScript Nonce Access</h3>
            <div class="code">
                // Current method in trainerApi.ts<br>
                private getNonce(): string {<br>
                &nbsp;&nbsp;const restNonce = <br>
                &nbsp;&nbsp;&nbsp;&nbsp;(window as any).fitcopilotTrainingCalendarData?.api?.restNonce ||<br>
                &nbsp;&nbsp;&nbsp;&nbsp;(window as any).wpApiSettings?.nonce ||<br>
                &nbsp;&nbsp;&nbsp;&nbsp;(window as any).fitcopilotTrainingCalendarAjax?.nonce ||<br>
                &nbsp;&nbsp;&nbsp;&nbsp;'';<br>
                &nbsp;&nbsp;return restNonce;<br>
                }
            </div>
            
            <h3>Enhanced JavaScript Nonce Access</h3>
            <div class="code">
                // Enhanced method with better fallbacks<br>
                private getNonce(): string {<br>
                &nbsp;&nbsp;// Try multiple sources in order of preference<br>
                &nbsp;&nbsp;const sources = [<br>
                &nbsp;&nbsp;&nbsp;&nbsp;() => (window as any).fitcopilotApiConfig?.restNonce,<br>
                &nbsp;&nbsp;&nbsp;&nbsp;() => (window as any).wpApiSettings?.nonce,<br>
                &nbsp;&nbsp;&nbsp;&nbsp;() => (window as any).fitcopilotTrainingCalendarData?.api?.restNonce,<br>
                &nbsp;&nbsp;&nbsp;&nbsp;() => (window as any).fitcopilotTrainingCalendarAjax?.nonce<br>
                &nbsp;&nbsp;];<br>
                <br>
                &nbsp;&nbsp;for (const source of sources) {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;try {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const nonce = source();<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (nonce && typeof nonce === 'string' && nonce.length === 10) {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return nonce;<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
                &nbsp;&nbsp;&nbsp;&nbsp;} catch (e) { /* Continue to next source */ }<br>
                &nbsp;&nbsp;}<br>
                <br>
                &nbsp;&nbsp;console.error('No valid nonce found');<br>
                &nbsp;&nbsp;return '';<br>
                }
            </div>
        </div>
        
        <div class="debug-section">
            <h2>🚀 Fix 3: Apply Fixes</h2>
            
            <p>Click the buttons below to apply the fixes:</p>
            
            <button class="fix-button" onclick="applyFix1()">Apply Enhanced wp_localize_script</button>
            <button class="fix-button" onclick="applyFix2()">Update Frontend Nonce Access</button>
            <button class="fix-button" onclick="testApiAfterFix()">Test API After Fixes</button>
            
            <div id="fix-results" style="margin-top: 20px;"></div>
        </div>
        
        <div class="debug-section">
            <h2>📋 Manual Fix Instructions</h2>
            
            <h3>Step 1: Update functions.php</h3>
            <div class="code">
                // Add this after the existing wp_localize_script call<br>
                wp_localize_script('fitcopilot-homepage', 'fitcopilotApiConfig', array(<br>
                &nbsp;&nbsp;'restUrl' => esc_url_raw(rest_url('fitcopilot/v1/')),<br>
                &nbsp;&nbsp;'restNonce' => wp_create_nonce('wp_rest'),<br>
                &nbsp;&nbsp;'ajaxUrl' => admin_url('admin-ajax.php'),<br>
                &nbsp;&nbsp;'ajaxNonce' => wp_create_nonce('fitcopilot_training_calendar_nonce'),<br>
                &nbsp;&nbsp;'debug' => WP_DEBUG<br>
                ));
            </div>
            
            <h3>Step 2: Update trainerApi.ts</h3>
            <div class="code">
                // Replace the getNonce() method with the enhanced version above
            </div>
            
            <h3>Step 3: Rebuild Frontend</h3>
            <div class="code">
                npm run build
            </div>
            
            <h3>Step 4: Test</h3>
            <div class="code">
                // Run the frontend debug script in browser console<br>
                // Check for successful API calls without 403 errors
            </div>
        </div>
        
        <script>
            function applyFix1() {
                document.getElementById('fix-results').innerHTML = '<p class="warning">⚠️ Fix 1 requires manual code changes to functions.php</p>';
            }
            
            function applyFix2() {
                document.getElementById('fix-results').innerHTML = '<p class="warning">⚠️ Fix 2 requires manual code changes to trainerApi.ts</p>';
            }
            
            function testApiAfterFix() {
                document.getElementById('fix-results').innerHTML = '<p class="warning">⚠️ Please run the frontend debug script in browser console to test API</p>';
            }
        </script>
    </body>
    </html>
    <?php
}

// Hook for WordPress admin
if (isset($_GET['debug_nonce_fix']) && $_GET['debug_nonce_fix'] === '1') {
    add_action('init', function() {
        debug_and_fix_nonce_issues();
        exit;
    });
}
?> 