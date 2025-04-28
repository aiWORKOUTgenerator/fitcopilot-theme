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

// Enqueue React and ReactDOM from CDN
wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', array(), '18.0.0', true);
wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', array('react'), '18.0.0', true);

// Get the manifest file
$manifest_path = get_template_directory() . '/dist/manifest.json';
$manifest = file_exists($manifest_path) ? json_decode(file_get_contents($manifest_path), true) : [];

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
    }
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
                'siteLinks' => [
                    'registration' => site_url('/registration'),
                    'login' => site_url('/login'),
                    'workoutBuilder' => 'https://builder.aiworkoutgenerator.com',
                ],
                'assets' => [
                    'logo' => get_theme_file_uri('/assets/images/logo.png')
                ],
                'wpData' => [
                    'restUrl' => esc_url_raw(rest_url()),
                    'nonce' => wp_create_nonce('wp_rest'),
                    'userId' => get_current_user_id(),
                ]
            ]
        );
    }
}

get_header();
?>

<!-- React application root element -->
<div id="athlete-dashboard-root" style="display: block; width: 100%; min-height: 500px;"></div>

<?php get_footer(); ?> 