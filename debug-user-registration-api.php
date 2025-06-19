<?php
/**
 * Debug User Registration API
 * 
 * Add ?debug_user_api=1 to any frontend page to test the API
 */

if (isset($_GET['debug_user_api'])) {
    add_action('wp_head', function() {
        ?>
        <script>
        console.log('🔍 User Registration API Debug Starting...');
        </script>
        <?php
    });
    
    add_action('wp_footer', function() {
        ?>
        <div style="position: fixed; top: 10px; right: 10px; background: white; border: 2px solid #333; padding: 20px; max-width: 400px; z-index: 9999; font-family: monospace; font-size: 12px;">
            <h3>🔍 User Registration API Debug</h3>
            
            <h4>1. File Check</h4>
            <?php
            $api_file = get_template_directory() . '/inc/admin/user-management/class-user-registration-api.php';
            echo '<p>File exists: ' . (file_exists($api_file) ? '✅ Yes' : '❌ No') . '</p>';
            echo '<p>File path: ' . $api_file . '</p>';
            ?>
            
            <h4>2. Class Check</h4>
            <?php
            echo '<p>Class exists: ' . (class_exists('FitCopilot_User_Registration_API') ? '✅ Yes' : '❌ No') . '</p>';
            ?>
            
            <h4>3. REST API Routes</h4>
            <?php
            $rest_server = rest_get_server();
            $routes = $rest_server->get_routes();
            $fitcopilot_routes = array_filter($routes, function($route) {
                return strpos($route, '/fitcopilot/v1') === 0;
            }, ARRAY_FILTER_USE_KEY);
            
            echo '<p>FitCopilot routes found: ' . count($fitcopilot_routes) . '</p>';
            foreach ($fitcopilot_routes as $route => $methods) {
                echo '<p>• ' . $route . '</p>';
            }
            ?>
            
            <h4>4. Function Check</h4>
            <?php
            global $fitcopilot_user_registration_api;
            echo '<p>Global var set: ' . (isset($fitcopilot_user_registration_api) ? '✅ Yes' : '❌ No') . '</p>';
            ?>
            
            <h4>5. Hook Debug</h4>
            <?php
            echo '<p>Current action: ' . current_action() . '</p>';
            echo '<p>Did rest_api_init: ' . (did_action('rest_api_init') ? '✅ Yes' : '❌ No') . '</p>';
            ?>
            
            <h4>6. Test API Endpoint</h4>
            <button onclick="testUserAPI()">Test API</button>
            <div id="api-test-result"></div>
        </div>
        
        <script>
        async function testUserAPI() {
            const resultDiv = document.getElementById('api-test-result');
            resultDiv.innerHTML = 'Testing...';
            
            try {
                const response = await fetch('/wp-json/fitcopilot/v1/users/check-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'test@example.com'
                    })
                });
                
                const data = await response.json();
                
                resultDiv.innerHTML = `
                    <p>Status: ${response.status}</p>
                    <p>Response: ${JSON.stringify(data, null, 2)}</p>
                `;
            } catch (error) {
                resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            }
        }
        </script>
        <?php
    });
}
?> 