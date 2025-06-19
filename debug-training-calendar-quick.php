<?php
/**
 * Training Calendar Quick Debug Test
 * Comprehensive testing tool for data localization fix
 */

// Security check
if (!defined('ABSPATH') && !current_user_can('manage_options')) {
    die('Access denied');
}

function debug_training_calendar_comprehensive() {
    echo "<div style='font-family: Arial, sans-serif; max-width: 1200px; margin: 20px;'>";
    echo "<h1>🔍 Training Calendar Comprehensive Debug Test</h1>";
    echo "<p><strong>Generated:</strong> " . current_time('mysql') . "</p>";
    echo "<p><strong>Test Type:</strong> Data Localization Fix Verification</p>";
    echo "<hr>";
    
    // Test 1: Data Components Initialization
    echo "<h2>📋 Test 1: Data Components Initialization</h2>";
    
    // Force initialization
    if (function_exists('fitcopilot_ensure_training_calendar_data')) {
        fitcopilot_ensure_training_calendar_data();
        echo "<p>✅ <strong>Initialization function:</strong> Called successfully</p>";
    } else {
        echo "<p>❌ <strong>Initialization function:</strong> Not found</p>";
    }
    
    // Check global data provider
    global $fitcopilot_training_calendar_data_provider;
    if ($fitcopilot_training_calendar_data_provider) {
        echo "<p>✅ <strong>Global Data Provider:</strong> Available</p>";
        echo "<p><strong>Provider Class:</strong> " . get_class($fitcopilot_training_calendar_data_provider) . "</p>";
    } else {
        echo "<p>❌ <strong>Global Data Provider:</strong> Not available</p>";
    }
    
    // Test 2: Manager Initialization
    echo "<h2>🏗️ Test 2: Manager Initialization</h2>";
    
    // Force Manager initialization
    if (function_exists('fitcopilot_ensure_training_calendar_manager')) {
        fitcopilot_ensure_training_calendar_manager();
        echo "<p>✅ <strong>Manager initialization function:</strong> Called successfully</p>";
    } else {
        echo "<p>❌ <strong>Manager initialization function:</strong> Not found</p>";
    }
    
    // Check global variable
    global $fitcopilot_training_calendar_manager;
    
    if ($fitcopilot_training_calendar_manager) {
        echo "<p>✅ <strong>Manager Instance:</strong> Available</p>";
        echo "<p>✅ <strong>Manager Class:</strong> " . get_class($fitcopilot_training_calendar_manager) . "</p>";
        
        // Test Manager methods
        if (method_exists($fitcopilot_training_calendar_manager, 'get_events')) {
            echo "<p>✅ <strong>Manager Methods:</strong> get_events() accessible</p>";
        } else {
            echo "<p>❌ <strong>Manager Methods:</strong> get_events() not accessible</p>";
        }
        
        // Test data manager access
        if (method_exists($fitcopilot_training_calendar_manager, 'get_current_data')) {
            echo "<p>✅ <strong>Manager Data Access:</strong> get_current_data() accessible</p>";
        } else {
            echo "<p>❌ <strong>Manager Data Access:</strong> get_current_data() not accessible</p>";
        }
    } else {
        echo "<p>❌ <strong>Manager Instance:</strong> Not Found</p>";
        
        // Try helper function
        if (function_exists('fitcopilot_get_training_calendar_manager')) {
            $manager = fitcopilot_get_training_calendar_manager();
            if ($manager) {
                echo "<p>✅ <strong>Manager via Helper:</strong> Available</p>";
                echo "<p>✅ <strong>Helper Function Class:</strong> " . get_class($manager) . "</p>";
            } else {
                echo "<p>❌ <strong>Manager via Helper:</strong> Failed</p>";
            }
        } else {
            echo "<p>❌ <strong>Helper Function:</strong> Not available</p>";
        }
    }
    
    // Test 3: Force Data Localization
    echo "<h2>🌐 Test 3: Data Localization</h2>";
    
    if ($fitcopilot_training_calendar_data_provider) {
        echo "<p>📤 <strong>Forcing data localization...</strong></p>";
        
        // Capture output
        ob_start();
        $fitcopilot_training_calendar_data_provider->provide_frontend_data();
        $localization_output = ob_get_clean();
        
        echo "<p>✅ <strong>Localization method:</strong> Executed</p>";
        echo "<p><strong>Output length:</strong> " . strlen($localization_output) . " characters</p>";
        
        // Check global data storage
        global $fitcopilot_training_calendar_localized_data;
        if ($fitcopilot_training_calendar_localized_data) {
            echo "<p>✅ <strong>Global data storage:</strong> Available</p>";
            echo "<p><strong>Events count:</strong> " . count($fitcopilot_training_calendar_localized_data['events']) . "</p>";
            echo "<p><strong>Trainers count:</strong> " . count($fitcopilot_training_calendar_localized_data['trainers']) . "</p>";
            echo "<p><strong>Nonce:</strong> " . substr($fitcopilot_training_calendar_localized_data['nonce'], 0, 10) . "...</p>";
        } else {
            echo "<p>❌ <strong>Global data storage:</strong> Not available</p>";
        }
    } else {
        echo "<p>❌ <strong>Data localization:</strong> Cannot test - provider not available</p>";
    }
    
    // Test 4: AJAX Endpoints
    echo "<h2>🔌 Test 4: AJAX Endpoints</h2>";
    
    $ajax_endpoints = [
        'get_calendar_events' => admin_url('admin-ajax.php?action=get_calendar_events'),
        'save_individual_calendar_event' => admin_url('admin-ajax.php?action=save_individual_calendar_event'),
        'delete_calendar_event' => admin_url('admin-ajax.php?action=delete_calendar_event')
    ];
    
    foreach ($ajax_endpoints as $action => $url) {
        echo "<p><strong>$action:</strong> $url</p>";
    }
    
    // Test 5: REST API Endpoints
    echo "<h2>🌐 Test 5: REST API Endpoints</h2>";
    
    $rest_endpoints = [
        'API Root' => home_url('/wp-json/fitcopilot/v1'),
        'Trainer Availability' => home_url('/wp-json/fitcopilot/v1/trainer-availability'),
        'User Registration' => home_url('/wp-json/fitcopilot/v1/users/register')
    ];
    
    foreach ($rest_endpoints as $name => $url) {
        echo "<p><strong>$name:</strong> <a href='$url' target='_blank'>$url</a></p>";
    }
    
    // Test 6: Frontend Data Check
    echo "<h2>💻 Test 6: Frontend Data Verification</h2>";
    echo "<div id='frontend-data-test'>";
    echo "<p>🔄 <strong>Checking frontend data availability...</strong></p>";
    echo "</div>";
    
    echo "<script>";
    echo "setTimeout(function() {";
    echo "  var testDiv = document.getElementById('frontend-data-test');";
    echo "  if (window.fitcopilotTrainingCalendarData) {";
    echo "    testDiv.innerHTML = '<p>✅ <strong>window.fitcopilotTrainingCalendarData:</strong> Available</p>' +";
    echo "      '<p><strong>Events:</strong> ' + (window.fitcopilotTrainingCalendarData.events?.length || 0) + '</p>' +";
    echo "      '<p><strong>Trainers:</strong> ' + (window.fitcopilotTrainingCalendarData.trainers?.length || 0) + '</p>' +";
    echo "      '<p><strong>Nonce:</strong> ' + (window.fitcopilotTrainingCalendarData.nonce?.substring(0, 10) || 'Not set') + '...</p>' +";
    echo "      '<p><strong>Localization Method:</strong> ' + (window.fitcopilotTrainingCalendarData.debug?.localizationMethod || 'Unknown') + '</p>';";
    echo "    console.log('Training Calendar Data:', window.fitcopilotTrainingCalendarData);";
    echo "  } else {";
    echo "    testDiv.innerHTML = '<p>❌ <strong>window.fitcopilotTrainingCalendarData:</strong> Not available</p>';";
    echo "  }";
    echo "}, 100);";
    echo "</script>";
    
    // Test 7: Database Connection
    echo "<h2>🗄️ Test 7: Database Connection</h2>";
    
    if (class_exists('FitCopilot_Training_Calendar_Data')) {
        $data_manager = new FitCopilot_Training_Calendar_Data();
        $stats = $data_manager->get_statistics();
        
        echo "<p>✅ <strong>Database connection:</strong> Working</p>";
        echo "<p><strong>Total events:</strong> " . $stats['total_events'] . "</p>";
        echo "<p><strong>Confirmed events:</strong> " . $stats['confirmed_events'] . "</p>";
        echo "<p><strong>Last updated:</strong> " . $stats['last_updated'] . "</p>";
    } else {
        echo "<p>❌ <strong>Database connection:</strong> Data manager class not available</p>";
    }
    
    // Test 8: Manager Initialization Performance Test
    echo "<h2>⚡ Test 8: Manager Performance & Timing</h2>";
    
    // Performance test
    $start_time = microtime(true);
    
    // Test multiple access patterns
    echo "<p><strong>Testing multiple access patterns...</strong></p>";
    
    // Pattern 1: Direct global access
    global $fitcopilot_training_calendar_manager;
    $pattern1_success = !empty($fitcopilot_training_calendar_manager);
    echo "<p><strong>Pattern 1 (Direct Global):</strong> " . ($pattern1_success ? "✅ Success" : "❌ Failed") . "</p>";
    
    // Pattern 2: Helper function access
    if (function_exists('fitcopilot_get_training_calendar_manager')) {
        $manager_via_helper = fitcopilot_get_training_calendar_manager();
        $pattern2_success = !empty($manager_via_helper);
        echo "<p><strong>Pattern 2 (Helper Function):</strong> " . ($pattern2_success ? "✅ Success" : "❌ Failed") . "</p>";
    } else {
        echo "<p><strong>Pattern 2 (Helper Function):</strong> ❌ Helper function not available</p>";
        $pattern2_success = false;
    }
    
    // Pattern 3: Force initialization
    if (function_exists('fitcopilot_ensure_training_calendar_manager')) {
        fitcopilot_ensure_training_calendar_manager();
        global $fitcopilot_training_calendar_manager;
        $pattern3_success = !empty($fitcopilot_training_calendar_manager);
        echo "<p><strong>Pattern 3 (Force Init):</strong> " . ($pattern3_success ? "✅ Success" : "❌ Failed") . "</p>";
    } else {
        echo "<p><strong>Pattern 3 (Force Init):</strong> ❌ Init function not available</p>";
        $pattern3_success = false;
    }
    
    $end_time = microtime(true);
    $total_time = ($end_time - $start_time) * 1000; // Convert to milliseconds
    
    echo "<p><strong>Total initialization time:</strong> " . number_format($total_time, 2) . " ms</p>";
    
    // Context information
    echo "<h2>🌍 Test 9: Context Information</h2>";
    echo "<p><strong>Current context:</strong> " . (is_admin() ? "Admin" : "Frontend") . "</p>";
    echo "<p><strong>Request URI:</strong> " . $_SERVER['REQUEST_URI'] . "</p>";
    echo "<p><strong>User can manage options:</strong> " . (current_user_can('manage_options') ? "Yes" : "No") . "</p>";
    echo "<p><strong>WordPress hooks fired:</strong> " . (did_action('init') > 0 ? "init (" . did_action('init') . ")" : "init not fired") . "</p>";
    echo "<p><strong>Admin hooks fired:</strong> " . (did_action('admin_init') > 0 ? "admin_init (" . did_action('admin_init') . ")" : "admin_init not fired") . "</p>";
    echo "<p><strong>REST API hooks fired:</strong> " . (did_action('rest_api_init') > 0 ? "rest_api_init (" . did_action('rest_api_init') . ")" : "rest_api_init not fired") . "</p>";
    
    // Summary
    echo "<h2>📊 Test Summary</h2>";
    echo "<div style='background: #f0f0f0; padding: 15px; border-radius: 5px;'>";
    echo "<p><strong>Manager Initialization Fix Status:</strong></p>";
    echo "<ul>";
    echo "<li>" . ($pattern1_success ? "✅" : "❌") . " Direct global access working</li>";
    echo "<li>" . ($pattern2_success ? "✅" : "❌") . " Helper function access working</li>";
    echo "<li>" . ($pattern3_success ? "✅" : "❌") . " Force initialization working</li>";
    echo "<li>" . ($total_time < 50 ? "✅" : "⚠️") . " Performance acceptable (" . number_format($total_time, 2) . " ms)</li>";
    echo "</ul>";
    echo "</div>";
    
    $success_count = array_sum([$pattern1_success, $pattern2_success, $pattern3_success]);
    echo "<p><strong>Overall Success Rate:</strong> " . $success_count . "/3 (" . round(($success_count/3)*100) . "%)</p>";
    
    if ($success_count === 3) {
        echo "<div style='background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
        echo "<h3>🎉 SUCCESS: Manager Initialization Fix Complete!</h3>";
        echo "<p>All access patterns are working correctly. The Training Calendar Manager is now properly initialized and globally accessible.</p>";
        echo "</div>";
    } else {
        echo "<div style='background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
        echo "<h3>⚠️ PARTIAL SUCCESS: Some patterns failed</h3>";
        echo "<p>Manager initialization is partially working. Check error logs for details.</p>";
        echo "</div>";
    }
    
    echo "<p><strong>Next Steps:</strong> Run the backend testing tool to verify all components are working.</p>";
    echo "</div>";
}

// Run the test
if (isset($_GET['tc_test']) && current_user_can('manage_options')) {
    debug_training_calendar_comprehensive();
    exit;
}
?> 