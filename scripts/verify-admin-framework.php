<?php
/**
 * FitCopilot Admin Framework Verification Script
 * 
 * Verifies that all Phase 1 framework components are properly installed
 * 
 * @package FitCopilot
 */

// Only run in WordPress environment
if (!defined('ABSPATH')) {
    die('This script must be run within WordPress');
}

/**
 * Verify Phase 1 Framework Installation
 */
function fitcopilot_verify_admin_framework() {
    $results = array(
        'success' => true,
        'components' => array(),
        'errors' => array(),
        'warnings' => array()
    );
    
    // Required framework files
    $required_files = array(
        'admin-patterns' => 'inc/admin/shared/admin-patterns.php',
        'form-helpers' => 'inc/admin/shared/admin-form-helpers.php', 
        'field-configs' => 'inc/admin/shared/field-configs.php',
        'base-template' => 'inc/admin/shared/admin-base-template.php'
    );
    
    // Required classes
    $required_classes = array(
        'FitCopilot_Admin_Manager_Base',
        'FitCopilot_Simple_Manager',
        'FitCopilot_Complex_Manager',
        'FitCopilot_Admin_Sanitizer',
        'FitCopilot_Frontend_Provider'
    );
    
    // Required functions
    $required_functions = array(
        'fitcopilot_render_admin_field',
        'fitcopilot_render_item_row',
        'fitcopilot_render_export_import_tab',
        'fitcopilot_render_admin_header',
        'fitcopilot_render_add_item_button',
        'fitcopilot_get_testimonials_field_config',
        'fitcopilot_get_personal_training_field_config'
    );
    
    // Check file existence
    foreach ($required_files as $name => $file_path) {
        $full_path = get_template_directory() . '/' . $file_path;
        
        if (file_exists($full_path)) {
            $results['components'][$name] = array(
                'status' => 'found',
                'path' => $file_path,
                'size' => filesize($full_path)
            );
            
            // Include the file to make classes/functions available
            require_once $full_path;
        } else {
            $results['success'] = false;
            $results['errors'][] = "Missing file: {$file_path}";
            $results['components'][$name] = array(
                'status' => 'missing',
                'path' => $file_path
            );
        }
    }
    
    // Check class existence
    foreach ($required_classes as $class_name) {
        if (class_exists($class_name)) {
            $reflection = new ReflectionClass($class_name);
            $results['components']['class_' . $class_name] = array(
                'status' => 'found',
                'type' => 'class',
                'methods' => count($reflection->getMethods()),
                'abstract' => $reflection->isAbstract()
            );
        } else {
            $results['success'] = false;
            $results['errors'][] = "Missing class: {$class_name}";
        }
    }
    
    // Check function existence  
    foreach ($required_functions as $function_name) {
        if (function_exists($function_name)) {
            $reflection = new ReflectionFunction($function_name);
            $results['components']['function_' . $function_name] = array(
                'status' => 'found',
                'type' => 'function',
                'parameters' => count($reflection->getParameters())
            );
        } else {
            $results['warnings'][] = "Missing function: {$function_name} (may be conditionally loaded)";
        }
    }
    
    // Check CSS architecture
    $css_base_path = get_template_directory() . '/assets/admin/css/shared/admin-base.css';
    if (file_exists($css_base_path)) {
        $results['components']['css_base'] = array(
            'status' => 'found',
            'type' => 'css',
            'size' => filesize($css_base_path)
        );
    } else {
        $results['warnings'][] = "Missing base CSS file: assets/admin/css/shared/admin-base.css";
    }
    
    // Check reference implementations
    $testimonials_path = get_template_directory() . '/inc/admin/testimonials-manager.php';
    $personal_training_path = get_template_directory() . '/inc/admin/personal-training-manager.php';
    
    if (file_exists($testimonials_path)) {
        $results['components']['testimonials_reference'] = array(
            'status' => 'found',
            'type' => 'reference',
            'complexity' => 'simple',
            'size' => filesize($testimonials_path)
        );
    } else {
        $results['warnings'][] = "Missing testimonials reference implementation";
    }
    
    if (file_exists($personal_training_path)) {
        $results['components']['personal_training_reference'] = array(
            'status' => 'found', 
            'type' => 'reference',
            'complexity' => 'complex',
            'size' => filesize($personal_training_path)
        );
    } else {
        $results['warnings'][] = "Missing personal training reference implementation";
    }
    
    // Generate summary
    $total_components = count($results['components']);
    $found_components = count(array_filter($results['components'], function($comp) {
        return $comp['status'] === 'found';
    }));
    
    $results['summary'] = array(
        'total_components' => $total_components,
        'found_components' => $found_components,
        'completion_percentage' => $total_components > 0 ? round(($found_components / $total_components) * 100) : 0,
        'framework_ready' => $results['success'] && count($results['errors']) === 0
    );
    
    return $results;
}

/**
 * Display verification results
 */
function fitcopilot_display_framework_verification() {
    $results = fitcopilot_verify_admin_framework();
    
    ?>
    <div class="wrap">
        <h1>FitCopilot Admin Framework Verification</h1>
        
        <div class="card">
            <h2>Framework Status</h2>
            <p><strong>Completion:</strong> <?php echo $results['summary']['completion_percentage']; ?>%</p>
            <p><strong>Framework Ready:</strong> <?php echo $results['summary']['framework_ready'] ? '✅ Yes' : '❌ No'; ?></p>
            <p><strong>Components Found:</strong> <?php echo $results['summary']['found_components']; ?> / <?php echo $results['summary']['total_components']; ?></p>
        </div>
        
        <?php if (!empty($results['errors'])): ?>
        <div class="card">
            <h2>❌ Errors (Must Fix)</h2>
            <ul>
                <?php foreach ($results['errors'] as $error): ?>
                    <li style="color: #d63638;"><?php echo esc_html($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php endif; ?>
        
        <?php if (!empty($results['warnings'])): ?>
        <div class="card">
            <h2>⚠️ Warnings</h2>
            <ul>
                <?php foreach ($results['warnings'] as $warning): ?>
                    <li style="color: #d68e00;"><?php echo esc_html($warning); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php endif; ?>
        
        <div class="card">
            <h2>📦 Component Details</h2>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($results['components'] as $name => $component): ?>
                        <tr>
                            <td><?php echo esc_html($name); ?></td>
                            <td>
                                <?php if ($component['status'] === 'found'): ?>
                                    <span style="color: #00a32a;">✅ Found</span>
                                <?php else: ?>
                                    <span style="color: #d63638;">❌ Missing</span>
                                <?php endif; ?>
                            </td>
                            <td><?php echo esc_html($component['type'] ?? 'file'); ?></td>
                            <td>
                                <?php
                                $details = array();
                                if (isset($component['size'])) {
                                    $details[] = 'Size: ' . round($component['size'] / 1024, 1) . ' KB';
                                }
                                if (isset($component['methods'])) {
                                    $details[] = 'Methods: ' . $component['methods'];
                                }
                                if (isset($component['parameters'])) {
                                    $details[] = 'Parameters: ' . $component['parameters'];
                                }
                                if (isset($component['complexity'])) {
                                    $details[] = 'Complexity: ' . $component['complexity'];
                                }
                                if (isset($component['abstract']) && $component['abstract']) {
                                    $details[] = 'Abstract';
                                }
                                echo esc_html(implode(', ', $details));
                                ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        
        <?php if ($results['summary']['framework_ready']): ?>
        <div class="card" style="border-left: 4px solid #00a32a;">
            <h2>🚀 Ready for Phase 2!</h2>
            <p>The FitCopilot Admin Framework is properly installed and ready for implementation.</p>
            <p><strong>Next Steps:</strong></p>
            <ol>
                <li>Create a test Features Manager using the implementation guide</li>
                <li>Refactor Personal Training Manager using the complex pattern</li>
                <li>Implement missing admin managers following priority order</li>
            </ol>
        </div>
        <?php else: ?>
        <div class="card" style="border-left: 4px solid #d63638;">
            <h2>🔧 Framework Needs Attention</h2>
            <p>Please fix the errors above before proceeding to Phase 2.</p>
        </div>
        <?php endif; ?>
    </div>
    <?php
}

// If called directly, display results
if (isset($_GET['verify_framework']) && current_user_can('manage_options')) {
    add_action('admin_notices', function() {
        fitcopilot_display_framework_verification();
    });
} 