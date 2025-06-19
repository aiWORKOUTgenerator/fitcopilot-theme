<?php
/**
 * Training Calendar Quick Testing Tool
 * 
 * Add ?tc_test=1 to any WordPress page to run the testing interface
 * Usage: http://fitcopilot-theme.local/?tc_test=1
 */

if (isset($_GET['tc_test'])) {
    add_action('wp_head', function() {
        ?>
        <style>
            .tc-test-panel {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 999999;
                overflow-y: auto;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .tc-test-content {
                background: white;
                margin: 20px;
                padding: 30px;
                border-radius: 8px;
                max-width: 1200px;
                margin: 20px auto;
            }
            .tc-test-header {
                background: #0073aa;
                color: white;
                padding: 20px;
                margin: -30px -30px 30px -30px;
                border-radius: 8px 8px 0 0;
            }
            .tc-test-section {
                background: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 20px;
                margin: 20px 0;
            }
            .tc-test-success { color: #46b450; font-weight: bold; }
            .tc-test-error { color: #dc3232; font-weight: bold; }
            .tc-test-warning { color: #ffb900; font-weight: bold; }
            .tc-test-button {
                background: #0073aa;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 4px;
                cursor: pointer;
                margin: 5px;
            }
            .tc-test-button:hover { background: #005177; }
            .tc-test-response {
                background: #f0f0f0;
                padding: 15px;
                border-radius: 4px;
                margin: 10px 0;
                font-family: monospace;
                white-space: pre-wrap;
                max-height: 300px;
                overflow-y: auto;
            }
            .tc-test-close {
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            }
            .tc-test-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 20px 0;
            }
            @media (max-width: 768px) {
                .tc-test-grid { grid-template-columns: 1fr; }
                .tc-test-content { margin: 10px; padding: 20px; }
            }
        </style>
        <?php
    });
    
    add_action('wp_footer', function() {
        ?>
        <div class="tc-test-panel" id="tcTestPanel">
            <div class="tc-test-content">
                <div class="tc-test-header">
                    <button class="tc-test-close" onclick="document.getElementById('tcTestPanel').style.display='none'">&times;</button>
                    <h1>🔍 Training Calendar System Testing Tool</h1>
                    <p>Comprehensive testing interface for Training Calendar components</p>
                    <p><strong>Generated:</strong> <?php echo current_time('mysql'); ?></p>
                </div>
                
                <div class="tc-test-grid">
                    <div class="tc-test-section">
                        <h2>📋 System Status</h2>
                        
                        <h3>WordPress Environment</h3>
                        <p>WordPress Version: <strong><?php echo get_bloginfo('version'); ?></strong></p>
                        <p>Current User: <strong><?php echo is_user_logged_in() ? wp_get_current_user()->user_login : 'Not logged in'; ?></strong></p>
                        <p>Theme: <strong><?php echo get_template(); ?></strong></p>
                        
                        <h3>Critical Classes</h3>
                        <?php
                        $critical_classes = [
                            'FitCopilot_Training_Calendar_Manager',
                            'FitCopilot_Training_Calendar_Provider',
                            'FitCopilot_Training_Calendar_Ajax',
                            'FitCopilot_User_Registration_API',
                            'FitCopilot_Trainer_Availability_API'
                        ];
                        
                        foreach ($critical_classes as $class) {
                            $exists = class_exists($class);
                            echo '<p>' . $class . ': <span class="tc-test-' . ($exists ? 'success">✅ Loaded' : 'error">❌ Missing') . '</span></p>';
                        }
                        ?>
                        
                        <h3>Global Variables</h3>
                        <?php
                        $globals = [
                            'fitcopilot_training_calendar_manager' => 'Training Calendar Manager',
                            'fitcopilot_user_registration_api' => 'User Registration API'
                        ];
                        
                        foreach ($globals as $var => $name) {
                            $exists = isset($GLOBALS[$var]);
                            echo '<p>' . $name . ': <span class="tc-test-' . ($exists ? 'success">✅ Set' : 'error">❌ Not Set') . '</span></p>';
                        }
                        ?>
                        
                        <h3>REST API Routes</h3>
                        <?php
                        $routes = rest_get_server()->get_routes();
                        $fitcopilot_routes = [];
                        
                        foreach ($routes as $route => $handlers) {
                            if (strpos($route, 'fitcopilot') !== false) {
                                $fitcopilot_routes[] = $route;
                            }
                        }
                        
                        if (empty($fitcopilot_routes)) {
                            echo '<p class="tc-test-error">❌ No FitCopilot routes found</p>';
                        } else {
                            echo '<p class="tc-test-success">✅ Found ' . count($fitcopilot_routes) . ' FitCopilot routes:</p>';
                            echo '<ul>';
                            foreach (array_slice($fitcopilot_routes, 0, 5) as $route) {
                                echo '<li><code>' . esc_html($route) . '</code></li>';
                            }
                            if (count($fitcopilot_routes) > 5) {
                                echo '<li><em>... and ' . (count($fitcopilot_routes) - 5) . ' more</em></li>';
                            }
                            echo '</ul>';
                        }
                        ?>
                    </div>
                    
                    <div class="tc-test-section">
                        <h2>🧪 Interactive Tests</h2>
                        
                        <h3>Frontend Data Test</h3>
                        <button class="tc-test-button" onclick="testFrontendData()">Check fitcopilotTrainingCalendarData</button>
                        <div id="frontend-data-result" class="tc-test-response" style="display:none;"></div>
                        
                        <h3>User Registration API Test</h3>
                        <button class="tc-test-button" onclick="testUserRegistrationAPI()">Test Check Email Endpoint</button>
                        <div id="user-api-result" class="tc-test-response" style="display:none;"></div>
                        
                        <h3>Training Calendar AJAX Test</h3>
                        <button class="tc-test-button" onclick="testTrainingCalendarAJAX()">Test Get Events Endpoint</button>
                        <div id="calendar-ajax-result" class="tc-test-response" style="display:none;"></div>
                        
                        <h3>Trainer Availability API Test</h3>
                        <button class="tc-test-button" onclick="testTrainerAvailabilityAPI()">Test Get Availability</button>
                        <div id="trainer-api-result" class="tc-test-response" style="display:none;"></div>
                        
                        <h3>Comprehensive Test Suite</h3>
                        <button class="tc-test-button" onclick="runAllTests()" style="background: #dc3232;">🚀 Run All Tests</button>
                        <div id="all-tests-result" class="tc-test-response" style="display:none;"></div>
                    </div>
                </div>
                
                <div class="tc-test-section">
                    <h2>📊 Test Results Summary</h2>
                    <div id="test-summary">
                        <p>Click "Run All Tests" to see comprehensive results</p>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            // API Configuration
            const tcTestConfig = {
                restUrl: '<?php echo esc_js(rest_url("fitcopilot/v1")); ?>',
                restNonce: '<?php echo wp_create_nonce("wp_rest"); ?>',
                ajaxUrl: '<?php echo admin_url("admin-ajax.php"); ?>',
                ajaxNonce: '<?php echo wp_create_nonce("training_calendar_nonce"); ?>'
            };
            
            console.log('TC Test Config:', tcTestConfig);
            
            // Test Functions
            async function testFrontendData() {
                const resultDiv = document.getElementById('frontend-data-result');
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = 'Testing...';
                
                try {
                    if (typeof window.fitcopilotTrainingCalendarData !== 'undefined') {
                        const data = window.fitcopilotTrainingCalendarData;
                        resultDiv.innerHTML = '✅ SUCCESS: fitcopilotTrainingCalendarData is available\n\n' + 
                                            JSON.stringify(data, null, 2);
                    } else {
                        resultDiv.innerHTML = '❌ FAILED: fitcopilotTrainingCalendarData is undefined\n\n' +
                                            'Available window properties:\n' +
                                            Object.keys(window).filter(key => key.includes('fitcopilot')).join('\n');
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ ERROR: ' + error.message;
                }
            }
            
            async function testUserRegistrationAPI() {
                const resultDiv = document.getElementById('user-api-result');
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = 'Testing...';
                
                try {
                    const response = await fetch(tcTestConfig.restUrl + '/users/check-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-WP-Nonce': tcTestConfig.restNonce
                        },
                        body: JSON.stringify({ email: 'test@example.com' }),
                        credentials: 'same-origin'
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        resultDiv.innerHTML = '✅ SUCCESS: User Registration API is working\n\n' + 
                                            JSON.stringify(data, null, 2);
                    } else {
                        resultDiv.innerHTML = '❌ FAILED: HTTP ' + response.status + '\n\n' + 
                                            JSON.stringify(data, null, 2);
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ ERROR: ' + error.message;
                }
            }
            
            async function testTrainingCalendarAJAX() {
                const resultDiv = document.getElementById('calendar-ajax-result');
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = 'Testing...';
                
                try {
                    const formData = new FormData();
                    formData.append('action', 'get_calendar_events');
                    formData.append('nonce', tcTestConfig.ajaxNonce);
                    
                    const response = await fetch(tcTestConfig.ajaxUrl, {
                        method: 'POST',
                        body: formData,
                        credentials: 'same-origin'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success !== undefined) {
                        resultDiv.innerHTML = '✅ SUCCESS: Training Calendar AJAX is working\n\n' + 
                                            JSON.stringify(data, null, 2);
                    } else {
                        resultDiv.innerHTML = '❌ FAILED: Unexpected response format\n\n' + 
                                            JSON.stringify(data, null, 2);
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ ERROR: ' + error.message;
                }
            }
            
            async function testTrainerAvailabilityAPI() {
                const resultDiv = document.getElementById('trainer-api-result');
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = 'Testing...';
                
                try {
                    const response = await fetch(tcTestConfig.restUrl + '/trainer-availability', {
                        method: 'GET',
                        headers: {
                            'X-WP-Nonce': tcTestConfig.restNonce
                        },
                        credentials: 'same-origin'
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        resultDiv.innerHTML = '✅ SUCCESS: Trainer Availability API is working\n\n' + 
                                            JSON.stringify(data, null, 2);
                    } else {
                        resultDiv.innerHTML = '❌ FAILED: HTTP ' + response.status + '\n\n' + 
                                            JSON.stringify(data, null, 2);
                    }
                } catch (error) {
                    resultDiv.innerHTML = '❌ ERROR: ' + error.message;
                }
            }
            
            async function runAllTests() {
                const resultDiv = document.getElementById('all-tests-result');
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = 'Running comprehensive test suite...\n\n';
                
                const tests = [
                    { name: 'Frontend Data', func: testFrontendData, resultId: 'frontend-data-result' },
                    { name: 'User Registration API', func: testUserRegistrationAPI, resultId: 'user-api-result' },
                    { name: 'Training Calendar AJAX', func: testTrainingCalendarAJAX, resultId: 'calendar-ajax-result' },
                    { name: 'Trainer Availability API', func: testTrainerAvailabilityAPI, resultId: 'trainer-api-result' }
                ];
                
                let summary = 'COMPREHENSIVE TEST RESULTS:\n' + '='.repeat(50) + '\n\n';
                let passed = 0;
                let failed = 0;
                
                for (const test of tests) {
                    summary += `Testing ${test.name}...\n`;
                    
                    try {
                        await test.func();
                        
                        // Check result
                        const testResult = document.getElementById(test.resultId).innerHTML;
                        if (testResult.includes('✅ SUCCESS')) {
                            summary += `✅ PASSED: ${test.name}\n`;
                            passed++;
                        } else {
                            summary += `❌ FAILED: ${test.name}\n`;
                            failed++;
                        }
                    } catch (error) {
                        summary += `❌ ERROR: ${test.name} - ${error.message}\n`;
                        failed++;
                    }
                    
                    summary += '\n';
                    
                    // Small delay between tests
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                summary += '='.repeat(50) + '\n';
                summary += `FINAL RESULTS:\n`;
                summary += `✅ Passed: ${passed}\n`;
                summary += `❌ Failed: ${failed}\n`;
                summary += `📊 Success Rate: ${passed + failed > 0 ? Math.round((passed / (passed + failed)) * 100) : 0}%\n\n`;
                
                if (failed === 0) {
                    summary += '🎉 ALL TESTS PASSED! Ready for Week 2 implementation.\n';
                } else {
                    summary += '⚠️  Some tests failed. Review individual test results above.\n';
                }
                
                resultDiv.innerHTML = summary;
                
                // Update summary section
                document.getElementById('test-summary').innerHTML = `
                    <h3>Latest Test Run Results</h3>
                    <p><strong>Total Tests:</strong> ${passed + failed}</p>
                    <p><strong>Passed:</strong> <span class="tc-test-success">${passed}</span></p>
                    <p><strong>Failed:</strong> <span class="tc-test-error">${failed}</span></p>
                    <p><strong>Success Rate:</strong> ${passed + failed > 0 ? Math.round((passed / (passed + failed)) * 100) : 0}%</p>
                    ${failed === 0 ? '<p class="tc-test-success">🎉 Ready for Week 2!</p>' : '<p class="tc-test-warning">⚠️ Issues need resolution</p>'}
                `;
            }
        </script>
        <?php
    });
}
?> 