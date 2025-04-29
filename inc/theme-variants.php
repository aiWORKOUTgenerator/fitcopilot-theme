/**
 * Add CSS variables for theme variants
 */
function fitcopilot_add_theme_variant_css_variables() {
    $current_variant = fitcopilot_get_current_theme_variant();
    
    // Default color palette
    $colors = array(
        'primary' => '#3182ce',
        'secondary' => '#718096',
        'accent' => '#ed64a6',
        'background' => '#ffffff',
        'text' => '#2d3748',
    );
    
    // Variant-specific color overrides
    switch ($current_variant) {
        case 'athlete':
            $colors['primary'] = '#2b6cb0';
            $colors['accent'] = '#f56565';
            break;
        case 'coach':
            $colors['primary'] = '#2c5282';
            $colors['accent'] = '#9f7aea';
            break;
        case 'nutrition':
            $colors['primary'] = '#38a169';
            $colors['accent'] = '#ecc94b';
            break;
    }
    
    // Output CSS variables
    echo '<style id="fitcopilot-theme-variables">';
    echo ':root {';
    foreach ($colors as $name => $value) {
        echo "--fc-color-$name: $value;";
    }
    echo '}';
    echo '</style>';
}
add_action('wp_head', 'fitcopilot_add_theme_variant_css_variables', 5);

/**
 * Add body classes for theme variant
 */
function fitcopilot_add_variant_body_classes($classes) {
    $current_variant = fitcopilot_get_current_theme_variant();
    $classes[] = 'fitcopilot-theme';
    $classes[] = 'variant-' . $current_variant;
    
    return $classes;
}
add_filter('body_class', 'fitcopilot_add_variant_body_classes'); 