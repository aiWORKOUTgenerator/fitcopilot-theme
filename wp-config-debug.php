/**
 * WordPress Debug Configuration
 * Add these lines to your wp-config.php file (before "That's all, stop editing!")
 * to enable error logging and find the exact cause of the 500 error.
 */

// Enable WordPress debugging
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Set error log location
ini_set('log_errors', 1);
ini_set('error_log', '/path/to/your/site/wp-content/debug.log');

// Additional debugging for theme issues
define('SCRIPT_DEBUG', true);

/**
 * Instructions:
 * 1. Add the above lines to your wp-config.php
 * 2. Try loading your site again  
 * 3. Check /wp-content/debug.log for the actual PHP error
 * 4. Send me the error message from debug.log
 */ 