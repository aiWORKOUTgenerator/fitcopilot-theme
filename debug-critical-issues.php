<?php
/**
 * Critical Issues Debug Script
 * 
 * Comprehensive debugging for:
 * 1. REST API 403 Forbidden errors with malformed nonce
 * 2. React TypeError: Cannot read properties of undefined (reading 'start')
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
 * Comprehensive Debug Analysis
 */
function debug_critical_issues() {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Critical Issues Debug Report</title>
        <style>
            body { font-family: monospace; margin: 20px; background: #f5f5f5; }
            .debug-section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #007cba; }
            .debug-section h2 { color: #007cba; margin-top: 0; }
            .debug-section h3 { color: #d63638; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
            .success { color: #008a00; font-weight: bold; }
            .error { color: #d63638; font-weight: bold; }
            .warning { color: #b32d2e; font-weight: bold; }
            .info { color: #007cba; }
            .code { background: #f6f7f7; padding: 10px; border-radius: 4px; margin: 10px 0; overflow-x: auto; }
            .test-result { padding: 8px; margin: 8px 0; border-radius: 4px; }
            .test-pass { background: #d4edda; border: 1px solid #c3e6cb; }
            .test-fail { background: #f8d7da; border: 1px solid #f5c6cb; }
            .test-warn { background: #fff3cd; border: 1px solid #ffeaa7; }
            .button { background: #007cba; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
            .button:hover { background: #005a87; }
            #console-output { background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 4px; height: 300px; overflow-y: auto; font-family: 'Courier New', monospace; }
        </style>
    </head>
    <body>
        <h1>🔧 Critical Issues Debug Report</h1>
        <p><strong>Timestamp:</strong> <?php echo date('Y-m-d H:i:s'); ?></p>
        
        <div class="debug-section">
            <h2>🔐 Issue 1: REST API 403 Forbidden Analysis</h2>
            
            <h3>WordPress REST API Configuration</h3>
            <?php
            // Test REST API basics
            $rest_url = rest_url();
            $wp_nonce = wp_create_nonce('wp_rest');
            $custom_nonce = wp_create_nonce('fitcopilot_training_calendar_nonce');
            
            echo "<div class='test-result test-info'>";
            echo "<strong>REST URL:</strong> " . esc_html($rest_url) . "<br>";
            echo "<strong>WP REST Nonce:</strong> " . esc_html($wp_nonce) . "<br>";
            echo "<strong>Custom Nonce:</strong> " . esc_html($custom_nonce) . "<br>";
            echo "</div>";
            
            // Check wp_localize_script data
            echo "<h3>wp_localize_script Configuration</h3>";
            
            // Simulate what should be available to frontend
            $localized_data = array(
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest'),
                'api_url' => home_url('/wp-json/'),
                'rest_url' => esc_url_raw(rest_url('fitcopilot/v1/'))
            );
            
            echo "<div class='code'>wpApiSettings = " . json_encode($localized_data, JSON_PRETTY_PRINT) . "</div>";
            
            // Test if fitcopilot endpoints are registered
            echo "<h3>FitCopilot REST Endpoints</h3>";
            global $wp_rest_server;
            if (!$wp_rest_server) {
                $wp_rest_server = rest_get_server();
            }
            
            $routes = $wp_rest_server->get_routes();
            $fitcopilot_routes = array_filter($routes, function($route) {
                return strpos($route, '/fitcopilot/') !== false;
            }, ARRAY_FILTER_USE_KEY);
            
            if (empty($fitcopilot_routes)) {
                echo "<div class='test-result test-fail'>❌ No FitCopilot REST routes found!</div>";
            } else {
                echo "<div class='test-result test-pass'>✅ Found " . count($fitcopilot_routes) . " FitCopilot routes:</div>";
                foreach ($fitcopilot_routes as $route => $handlers) {
                    echo "<div class='info'>• " . esc_html($route) . "</div>";
                }
            }
            
            // Test specific trainer availability endpoint
            echo "<h3>Trainer Availability Endpoint Test</h3>";
            $test_url = rest_url('fitcopilot/v1/trainer-availability');
            $test_response = wp_remote_get($test_url, array(
                'headers' => array(
                    'X-WP-Nonce' => $wp_nonce
                )
            ));
            
            if (is_wp_error($test_response)) {
                echo "<div class='test-result test-fail'>❌ Internal API test failed: " . $test_response->get_error_message() . "</div>";
            } else {
                $response_code = wp_remote_retrieve_response_code($test_response);
                $response_body = wp_remote_retrieve_body($test_response);
                
                if ($response_code === 200) {
                    echo "<div class='test-result test-pass'>✅ Internal API test passed (200 OK)</div>";
                } else {
                    echo "<div class='test-result test-fail'>❌ Internal API test failed: HTTP " . $response_code . "</div>";
                    echo "<div class='code'>" . esc_html(substr($response_body, 0, 500)) . "</div>";
                }
            }
            ?>
        </div>
        
        <div class="debug-section">
            <h2>⚛️ Issue 2: React Runtime Error Analysis</h2>
            
            <h3>Frontend JavaScript Analysis</h3>
            <div class="test-result test-info">
                <strong>Error:</strong> TypeError: Cannot read properties of undefined (reading 'start')<br>
                <strong>Location:</strong> 975.f6472e70cdbce16a...js:1:103054<br>
                <strong>Likely Cause:</strong> Time slot object missing 'start' property
            </div>
            
            <h3>JavaScript Debug Tests</h3>
            <button class="button" onclick="runJavaScriptTests()">Run Frontend Tests</button>
            <button class="button" onclick="testApiCalls()">Test API Calls</button>
            <button class="button" onclick="inspectReactState()">Inspect React State</button>
            
            <div id="console-output">
                <div>Click buttons above to run tests...</div>
            </div>
        </div>
        
        <div class="debug-section">
            <h2>🔍 Environment Analysis</h2>
            
            <?php
            // PHP Environment
            echo "<h3>PHP Environment</h3>";
            echo "<div class='test-result test-info'>";
            echo "<strong>PHP Version:</strong> " . PHP_VERSION . "<br>";
            echo "<strong>WordPress Version:</strong> " . get_bloginfo('version') . "<br>";
            echo "<strong>Current Theme:</strong> " . get_stylesheet() . "<br>";
            echo "<strong>Site URL:</strong> " . site_url() . "<br>";
            echo "<strong>Home URL:</strong> " . home_url() . "<br>";
            echo "</div>";
            
            // WordPress Constants
            echo "<h3>WordPress Configuration</h3>";
            $constants = ['WP_DEBUG', 'WP_DEBUG_LOG', 'SCRIPT_DEBUG', 'WP_DEBUG_DISPLAY'];
            echo "<div class='test-result test-info'>";
            foreach ($constants as $constant) {
                $value = defined($constant) ? (constant($constant) ? 'true' : 'false') : 'undefined';
                echo "<strong>" . $constant . ":</strong> " . $value . "<br>";
            }
            echo "</div>";
            
            // Active Plugins
            echo "<h3>Active Plugins</h3>";
            $active_plugins = get_option('active_plugins');
            if (empty($active_plugins)) {
                echo "<div class='test-result test-pass'>✅ No active plugins</div>";
            } else {
                echo "<div class='test-result test-warn'>⚠️ " . count($active_plugins) . " active plugins:</div>";
                foreach ($active_plugins as $plugin) {
                    echo "<div class='info'>• " . esc_html($plugin) . "</div>";
                }
            }
            ?>
        </div>
        
        <div class="debug-section">
            <h2>🛠️ Recommended Fixes</h2>
            
            <h3>For 403 API Error:</h3>
            <div class="test-result test-warn">
                <strong>Issue:</strong> Malformed nonce in API calls (&_wpnonce=:1)<br>
                <strong>Root Cause:</strong> wpApiSettings not properly available to frontend JavaScript<br>
                <strong>Fix:</strong> Ensure wp_localize_script is called correctly in functions.php
            </div>
            
            <h3>For React Runtime Error:</h3>
            <div class="test-result test-warn">
                <strong>Issue:</strong> Undefined 'start' property access<br>
                <strong>Root Cause:</strong> Time slot object structure mismatch<br>
                <strong>Fix:</strong> Add defensive programming in EventModal.tsx
            </div>
            
            <button class="button" onclick="downloadDebugReport()">Download Debug Report</button>
        </div>
        
        <script>
            let outputDiv = document.getElementById('console-output');
            
            function log(message, type = 'info') {
                const timestamp = new Date().toISOString().substr(11, 12);
                const colors = {
                    info: '#d4d4d4',
                    success: '#4ec9b0',
                    error: '#f14c4c',
                    warning: '#ffd700'
                };
                
                outputDiv.innerHTML += `<div style="color: ${colors[type]};">[${timestamp}] ${message}</div>`;
                outputDiv.scrollTop = outputDiv.scrollHeight;
            }
            
            function clearOutput() {
                outputDiv.innerHTML = '';
            }
            
            async function runJavaScriptTests() {
                clearOutput();
                log('🧪 Starting JavaScript Environment Tests...', 'info');
                
                // Test 1: Check if wpApiSettings exists
                log('Test 1: Checking wpApiSettings...', 'info');
                if (typeof wpApiSettings !== 'undefined') {
                    log('✅ wpApiSettings found', 'success');
                    log(`   Root: ${wpApiSettings.root}`, 'info');
                    log(`   Nonce: ${wpApiSettings.nonce ? wpApiSettings.nonce.substr(0, 10) + '...' : 'MISSING'}`, wpApiSettings.nonce ? 'success' : 'error');
                    log(`   API URL: ${wpApiSettings.api_url}`, 'info');
                } else {
                    log('❌ wpApiSettings not found - THIS IS THE ROOT CAUSE!', 'error');
                }
                
                // Test 2: Check React availability
                log('Test 2: Checking React availability...', 'info');
                if (typeof React !== 'undefined') {
                    log(`✅ React ${React.version} available`, 'success');
                } else {
                    log('❌ React not available', 'error');
                }
                
                if (typeof ReactDOM !== 'undefined') {
                    log(`✅ ReactDOM available`, 'success');
                } else {
                    log('❌ ReactDOM not available', 'error');
                }
                
                // Test 3: Check for Training Calendar elements
                log('Test 3: Checking DOM elements...', 'info');
                const calendarElement = document.querySelector('[data-component="training-calendar"]');
                if (calendarElement) {
                    log('✅ Training Calendar element found', 'success');
                } else {
                    log('❌ Training Calendar element not found', 'error');
                }
            }
            
            async function testApiCalls() {
                clearOutput();
                log('🌐 Starting API Tests...', 'info');
                
                if (typeof wpApiSettings === 'undefined') {
                    log('❌ Cannot test API - wpApiSettings missing', 'error');
                    return;
                }
                
                // Test API endpoint with proper nonce
                const testUrl = `${wpApiSettings.rest_url}trainer-availability?eventType=Free%20Consultation%20(20%20Min)&duration=20`;
                log(`Testing: ${testUrl}`, 'info');
                
                try {
                    const response = await fetch(testUrl, {
                        method: 'GET',
                        headers: {
                            'X-WP-Nonce': wpApiSettings.nonce,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    log(`Response Status: ${response.status}`, response.ok ? 'success' : 'error');
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        log(`Error Response: ${errorText.substr(0, 200)}...`, 'error');
                    } else {
                        const data = await response.json();
                        log(`✅ API call successful`, 'success');
                        log(`Response data: ${JSON.stringify(data).substr(0, 100)}...`, 'info');
                    }
                } catch (error) {
                    log(`❌ API call failed: ${error.message}`, 'error');
                }
            }
            
            function inspectReactState() {
                clearOutput();
                log('⚛️ Inspecting React Component State...', 'info');
                
                // Try to find React components in the DOM
                const reactElements = document.querySelectorAll('[data-reactroot], [data-react-component]');
                log(`Found ${reactElements.length} potential React elements`, 'info');
                
                // Check for React DevTools
                if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                    log('✅ React DevTools detected', 'success');
                } else {
                    log('⚠️ React DevTools not available', 'warning');
                }
                
                log('Scanning for React-related errors...', 'info');
                log('Use browser DevTools Console to see actual React errors', 'info');
            }
            
            function downloadDebugReport() {
                const reportData = {
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    wpApiSettings: typeof wpApiSettings !== 'undefined' ? wpApiSettings : 'undefined',
                    reactAvailable: typeof React !== 'undefined',
                    reactDOMAvailable: typeof ReactDOM !== 'undefined',
                    consoleOutput: outputDiv.innerText
                };
                
                const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `fitcopilot_debug_report_${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                log('✅ Debug report downloaded', 'success');
            }
            
            // Auto-run basic tests on page load
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(runJavaScriptTests, 1000);
            });
        </script>
    </body>
    </html>
    <?php
}

// Hook into WordPress admin or add to functions.php
if (is_admin() && isset($_GET['debug_critical_issues'])) {
    debug_critical_issues();
    exit;
}
?> 