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

// Add our critical CSS output function
add_action('wp_head', 'fitcopilot_output_critical_css', 5);

// Add direct CSS override for hero buttons
add_action('wp_head', function() {
    echo '
    <style>
    /* Force green border on hero buttons */
    .hero-button.hero-button-primary,
    .hero-button.hero-button-secondary {
        border: 1px solid rgba(34, 197, 94, 0.45) !important;
    }
    
    .hero-button.hero-button-primary:hover,
    .hero-button.hero-button-secondary:hover {
        border-color: rgba(34, 197, 94, 0.6) !important;
    }
    </style>
    ';
}, 6);

// Get the manifest file
$manifest_path = get_template_directory() . '/dist/manifest.json';
$manifest = file_exists($manifest_path) ? json_decode(file_get_contents($manifest_path), true) : [];

if (empty($manifest)) {
    error_log('Homepage template: React manifest is empty or invalid');
}

// Ensure React is enqueued first with the correct global variable names that webpack expects
wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', array(), '18.0.0', false);
wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', array('react'), '18.0.0', true);

// Add script to explicitly assign React and ReactDOM to window globals for webpack externals
wp_add_inline_script('react-dom', '
// Ensure React and ReactDOM are assigned to window globals with proper capitalization
window.React = window.React || React;
window.ReactDOM = window.ReactDOM || ReactDOM;
console.log("React and ReactDOM globals initialized for webpack externals");
', 'after');

// PERFORMANCE FIX: Only load homepage-specific CSS, not feature CSS
// This prevents the 792KB feature-styles.css from loading on homepage
if (isset($manifest['homepage-styles.css'])) {
    $css_file = $manifest['homepage-styles.css'];
    $css_path = get_template_directory() . '/dist/' . $css_file;
    
    if (file_exists($css_path)) {
        // Load homepage CSS directly for better performance
        wp_enqueue_style(
            'homepage-styles',
            get_template_directory_uri() . '/dist/' . $css_file,
            array(),
            filemtime($css_path),
            'all'
        );
        error_log('Homepage template: Homepage-specific CSS loaded: ' . $css_file);
    } else {
        error_log('Homepage template: Homepage CSS file not found at ' . $css_path);
    }
} else {
    error_log('Homepage template: homepage-styles.css not found in manifest');
}

// PERFORMANCE OPTIMIZATION: Do NOT load feature-styles.css on homepage
// Feature styles (792KB) are only loaded when needed by other pages
// This prevents the performance regression reported by the user

// Set up efficient preloading of chunk files (only for chunks that will be used)
foreach ($manifest as $key => $value) {
    // Only preload JavaScript chunks that are actually needed for the homepage
    if ($key !== 'critical.css' && 
        $key !== 'homepage.js' && // Homepage script is loaded normally
        strpos($key, '.js') !== false && 
        strpos($key, 'vendor') === false && // Don't preload vendor chunks
        strpos($key, 'node_modules') === false) { // Don't preload node_modules chunks
        
        $chunk_path = get_template_directory() . '/dist/' . $value;
        
        if (file_exists($chunk_path)) {
            // Add chunk as a preload with crossorigin for modules
            add_action('wp_head', function() use ($value) {
                echo '<link rel="preload" href="' . get_template_directory_uri() . '/dist/' . $value . '" as="script" crossorigin="anonymous">';
            }, 7);
            
            // Still enqueue the script normally but with defer attribute
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
        
        // Prepare data for localization
        $localized_data = [
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
                'themeVariants' => [
                    'hero' => get_theme_mod('fitcopilot_theme_variant', 'default'),
                    'features' => get_theme_mod('fitcopilot_theme_variant', 'default'),
                    'testimonials' => get_theme_mod('fitcopilot_theme_variant', 'default'),
                    'pricing' => get_theme_mod('fitcopilot_theme_variant', 'default')
                ]
            ]
        ];
        
        // Allow plugins and theme components to modify the data
        $localized_data = apply_filters('fitcopilot_localized_data', $localized_data);
        
        // Pass data to JavaScript
        wp_localize_script(
            'athlete-dashboard-homepage',
            'athleteDashboardData',
            $localized_data
        );
    } else {
        error_log('Homepage template: JS file not found at ' . $js_path);
    }
} else {
    error_log('Homepage template: homepage.js not found in manifest');
}

// Add inline performance monitoring script in head
add_action('wp_head', function() {
    echo '
    <script>
    // Performance monitoring
    window.performance && window.performance.mark && window.performance.mark("critical-css-loaded");
    
    // Add load timing for FCP (First Contentful Paint) monitoring
    document.addEventListener("DOMContentLoaded", function() {
        window.performance && window.performance.mark && window.performance.mark("dom-content-loaded");
    });
    
    // Register onload complete
    window.addEventListener("load", function() {
        window.performance && window.performance.mark && window.performance.mark("fully-loaded");
        
        // Measure and log times
        if (window.performance && window.performance.measure) {
            window.performance.measure("critical-render-time", "navigationStart", "critical-css-loaded");
            window.performance.measure("dom-ready-time", "navigationStart", "dom-content-loaded");
            window.performance.measure("full-load-time", "navigationStart", "fully-loaded");
            
            console.log("Performance metrics:", {
                criticalRenderTime: Math.round(window.performance.getEntriesByName("critical-render-time")[0].duration),
                domReadyTime: Math.round(window.performance.getEntriesByName("dom-ready-time")[0].duration),
                fullLoadTime: Math.round(window.performance.getEntriesByName("full-load-time")[0].duration)
            });
        }
    });
    </script>
    ';
}, 10);

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