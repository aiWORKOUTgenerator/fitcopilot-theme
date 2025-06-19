<?php
/**
 * Verify API Status
 * 
 * Add ?verify_api=1 to any page to check API status
 */

if (isset($_GET['verify_api'])) {
    add_action('wp_footer', function() {
        echo '<pre style="position: fixed; top: 0; left: 0; background: white; border: 3px solid red; padding: 20px; z-index: 9999; max-width: 90%; max-height: 90%; overflow: auto;">';
        echo '<h2>🔍 API Status Verification Report</h2>';
        echo '<strong>Generated:</strong> ' . current_time('mysql') . "\n\n";
        
        echo '<h3>1. 📋 User Registration API Class Status</h3>';
        echo 'File exists: ' . (file_exists(get_template_directory() . '/inc/admin/user-management/class-user-registration-api.php') ? '✅' : '❌') . "\n";
        echo 'Class loaded: ' . (class_exists('FitCopilot_User_Registration_API') ? '✅' : '❌') . "\n";
        
        global $fitcopilot_user_registration_api;
        echo 'Global var set: ' . (isset($fitcopilot_user_registration_api) ? '✅' : '❌') . "\n";
        
        echo "\n<h3>2. 🌐 REST API Routes Check</h3>";
        $rest_server = rest_get_server();
        $routes = $rest_server->get_routes();
        
        $fitcopilot_routes = [];
        foreach ($routes as $route => $methods) {
            if (strpos($route, '/fitcopilot/') !== false) {
                $fitcopilot_routes[] = $route;
            }
        }
        
        echo 'Total WordPress routes: ' . count($routes) . "\n";
        echo 'FitCopilot routes found: ' . count($fitcopilot_routes) . "\n";
        
        if (!empty($fitcopilot_routes)) {
            echo 'FitCopilot routes:' . "\n";
            foreach ($fitcopilot_routes as $route) {
                echo '  • ' . $route . "\n";
            }
        } else {
            echo '❌ NO FITCOPILOT ROUTES FOUND!' . "\n";
        }
        
        echo "\n<h3>3. 🔌 Hook Status</h3>";
        echo 'rest_api_init action fired: ' . (did_action('rest_api_init') ? '✅' : '❌') . "\n";
        echo 'Current hook: ' . current_action() . "\n";
        
        echo "\n<h3>4. 🔧 Training Calendar Manager Status</h3>";
        global $fitcopilot_training_calendar_manager;
        echo 'Manager exists: ' . (isset($fitcopilot_training_calendar_manager) ? '✅' : '❌') . "\n";
        
        echo "\n<h3>5. 💡 Recommended Actions</h3>";
        if (!class_exists('FitCopilot_User_Registration_API')) {
            echo '🔧 User Registration API class not loaded - check require_once path' . "\n";
        }
        if (empty($fitcopilot_routes)) {
            echo '🔧 No FitCopilot routes - API init() method not called or failed' . "\n";
        }
        if (!isset($fitcopilot_user_registration_api)) {
            echo '🔧 Global variable not set - initialization failed' . "\n";
        }
        
        echo '</pre>';
    });
}
?> 