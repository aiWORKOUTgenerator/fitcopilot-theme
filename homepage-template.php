<?php
/**
 * Template Name: AI Workout Generator Homepage
 * Description: A custom template for the React-powered homepage
 */

// Get clean header
remove_all_actions('wp_head');
remove_all_actions('wp_print_styles');
remove_all_actions('wp_print_head_scripts');

// Restore essential WordPress actions
add_action('wp_head', 'wp_enqueue_scripts', 1);
add_action('wp_head', 'wp_resource_hints', 2);
add_action('wp_head', 'feed_links', 3);
add_action('wp_head', 'feed_links_extra', 4);
add_action('wp_head', 'rsd_link');
add_action('wp_head', 'wlwmanifest_link');
add_action('wp_head', 'adjacent_posts_rel_link_wp_head');
add_action('wp_head', 'locale_stylesheet');
add_action('wp_head', 'noindex', 1);
add_action('wp_head', 'wp_print_styles', 8);
add_action('wp_head', 'wp_print_head_scripts', 9);
add_action('wp_head', 'wp_site_icon', 99);

// Get the manifest file
$manifest_path = get_template_directory() . '/dist/manifest.json';
$manifest = file_exists($manifest_path) ? json_decode(file_get_contents($manifest_path), true) : [];

if (empty($manifest)) {
    error_log('Homepage template: React manifest is empty or invalid');
}

// Ensure React is enqueued first with the correct global variable names that webpack expects
wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', array(), '18.0.0', true);
wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', array('react'), '18.0.0', true);

// Add script to explicitly assign React and ReactDOM to window globals for webpack externals
wp_add_inline_script('react-dom', '
// Ensure React and ReactDOM are assigned to window globals with proper capitalization
window.React = window.React || React;
window.ReactDOM = window.ReactDOM || ReactDOM;
console.log("React and ReactDOM globals initialized for webpack externals");
', 'after');

// Enqueue homepage CSS with cache busting
if (isset($manifest['homepage.css'])) {
    $css_file = $manifest['homepage.css'];
    $css_path = get_template_directory() . '/dist/' . $css_file;
    
    if (file_exists($css_path)) {
        wp_enqueue_style(
            'athlete-dashboard-homepage',
            get_template_directory_uri() . '/dist/' . $css_file,
            [],
            filemtime($css_path)
        );
    } else {
        error_log('Homepage template: CSS file not found at ' . $css_path);
    }
} else {
    error_log('Homepage template: homepage.css not found in manifest');
}

// Enqueue any chunk files if they exist
foreach ($manifest as $key => $value) {
    if ($key !== 'homepage.css' && $key !== 'homepage.js' && strpos($key, '.js') !== false) {
        $chunk_path = get_template_directory() . '/dist/' . $value;
        
        if (file_exists($chunk_path)) {
            wp_enqueue_script(
                'chunk-' . substr($key, 0, strpos($key, '.')),
                get_template_directory_uri() . '/dist/' . $value,
                ['react', 'react-dom'],
                filemtime($chunk_path),
                true
            );
        } else {
            error_log('Homepage template: Chunk file not found at ' . $chunk_path);
        }
    }
}

// Enqueue homepage JS with cache busting
if (isset($manifest['homepage.js'])) {
    $js_file = $manifest['homepage.js'];
    $js_path = get_template_directory() . '/dist/' . $js_file;
    
    if (file_exists($js_path)) {
        wp_enqueue_script(
            'athlete-dashboard-homepage',
            get_template_directory_uri() . '/dist/' . $js_file,
            ['react', 'react-dom'],
            filemtime($js_path),
            true
        );
        
        // Pass data to JavaScript
        wp_localize_script(
            'athlete-dashboard-homepage',
            'athleteDashboardData',
            [
                'wpData' => [
                    'siteLinks' => [
                        'registration' => site_url('/registration'),
                        'login' => site_url('/login'),
                        'workoutBuilder' => 'https://builder.aiworkoutgenerator.com',
                    ],
                    'assets' => [
                        'logo' => get_theme_file_uri('/assets/images/logo.png')
                    ],
                    'restUrl' => esc_url_raw(rest_url()),
                    'nonce' => wp_create_nonce('wp_rest'),
                    'userId' => get_current_user_id(),
                ]
            ]
        );
        
        // Add inline script to verify data is available
        wp_add_inline_script(
            'athlete-dashboard-homepage',
            'console.log("athleteDashboardData is available:", window.athleteDashboardData);',
            'before'
        );
    } else {
        error_log('Homepage template: JS file not found at ' . $js_path);
    }
} else {
    error_log('Homepage template: homepage.js not found in manifest');
}

get_header();
?>

<!-- React application root element -->
<div id="athlete-dashboard-root" style="display: block; width: 100%; min-height: 500px; position: relative;">
    <!-- Loading indicator while React initializes -->
    <div id="react-loading" style="text-align: center; padding: 2rem;">
        <p>Loading application...</p>
    </div>
</div>

<script type="text/javascript">
    // Verify DOM and React mount point
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Homepage template: DOM loaded, checking React mount point');
        const mountPoint = document.getElementById('athlete-dashboard-root');
        if (mountPoint) {
            console.log('Homepage template: Mount point exists');
            // Hide loading indicator when main script begins executing
            const mainScript = document.querySelector('script[src*="homepage."]');
            if (mainScript) {
                mainScript.addEventListener('load', function() {
                    console.log('Homepage script loaded, app should initialize soon');
                    const loadingEl = document.getElementById('react-loading');
                    if (loadingEl) {
                        loadingEl.style.display = 'none';
                    }
                });
            }
        } else {
            console.error('Homepage template: Mount point missing!');
        }
    });
</script>

<?php get_footer(); ?> 