# FitCopilot Admin Manager Implementation Guide

## 🚀 Quick Start: Creating a New Admin Manager

This guide shows you how to create a new admin manager using the established FitCopilot patterns. We'll use a "Features Manager" as an example.

## Step 1: Determine Complexity Level

**Choose your pattern based on requirements:**

### **Simple Pattern** (Use for basic content management)
- ≤ 8 data fields per item
- Basic display settings
- No media management
- **Examples**: Footer content, basic features list

### **Complex Pattern** (Use for rich functionality)
- Business-justified field complexity
- Rich media management
- Advanced settings and interactions
- **Examples**: Trainer profiles, pricing plans, journey steps

**For our Features Manager example, we'll use the Simple pattern.**

## Step 2: Create the Admin Manager File

Create `inc/admin/features-manager.php`:

```php
<?php
/**
 * FitCopilot Features Manager Admin Page
 * 
 * Provides admin interface for managing feature highlights
 * 
 * @package FitCopilot
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Include required files
require_once get_template_directory() . '/inc/admin/shared/admin-base-template.php';
require_once get_template_directory() . '/inc/admin/shared/admin-form-helpers.php';
require_once get_template_directory() . '/inc/admin/shared/field-configs.php';

/**
 * Features Manager Class - Simple Implementation
 */
class FitCopilot_Features_Manager extends FitCopilot_Simple_Manager {
    
    public function __construct() {
        parent::__construct('features');
    }
    
    /**
     * Get current features data
     */
    protected function get_current_data() {
        return get_option('fitcopilot_features_data', $this->get_default_data());
    }
    
    /**
     * Get current settings
     */
    protected function get_current_settings() {
        return get_option('fitcopilot_features_settings', array(
            'section_title' => 'Features',
            'section_subtitle' => 'Why choose FitCopilot for your fitness journey',
            'items_per_page' => 6,
            'layout_style' => 'grid'
        ));
    }
    
    /**
     * Handle form submissions
     */
    protected function handle_form_submissions() {
        if (isset($_POST['fitcopilot_features_submit'])) {
            check_admin_referer('fitcopilot_features_action', 'fitcopilot_features_nonce');
            
            // Update features data
            $updated_features = array();
            if (isset($_POST['features']) && is_array($_POST['features'])) {
                $field_config = $this->get_field_config();
                $updated_features = FitCopilot_Admin_Sanitizer::sanitize_items_array($_POST['features'], $field_config);
            }
            
            update_option('fitcopilot_features_data', $updated_features);
            
            // Update settings
            if (isset($_POST['settings'])) {
                $settings_config = $this->get_settings_config();
                $updated_settings = FitCopilot_Admin_Sanitizer::sanitize_basic_item($_POST['settings'], $settings_config);
                update_option('fitcopilot_features_settings', $updated_settings);
            }
            
            update_option('fitcopilot_features_last_updated', time());
            
            fitcopilot_render_admin_notice('Features updated successfully!');
        }
        
        // Handle reset to defaults
        if (isset($_POST['fitcopilot_reset_defaults'])) {
            check_admin_referer('fitcopilot_reset_action', 'fitcopilot_reset_nonce');
            
            delete_option('fitcopilot_features_data');
            delete_option('fitcopilot_features_settings');
            
            fitcopilot_render_admin_notice('Features reset to defaults!');
        }
    }
    
    /**
     * Render tab content
     */
    protected function render_tab_content($active_tab, $data, $settings) {
        switch ($active_tab) {
            case 'main-content':
                $this->render_main_content_tab($data);
                break;
            case 'settings':
                $this->render_settings_tab($settings);
                break;
            case 'export-import':
                fitcopilot_render_export_import_tab('features');
                break;
        }
    }
    
    /**
     * Render main content tab
     */
    private function render_main_content_tab($data) {
        ?>
        <div class="fitcopilot-card">
            <form method="post" action="">
                <?php wp_nonce_field('fitcopilot_features_action', 'fitcopilot_features_nonce'); ?>
                
                <div class="features-header">
                    <h2>Manage Features</h2>
                    <p>Add, edit, and manage features that appear on your homepage.</p>
                    <?php fitcopilot_render_add_item_button('feature'); ?>
                </div>
                
                <div class="features-list" id="features-list">
                    <?php foreach ($data as $index => $feature): ?>
                        <?php $this->render_feature_row($index, $feature); ?>
                    <?php endforeach; ?>
                </div>
                
                <!-- Template row (hidden) -->
                <div id="feature-template" style="display: none;">
                    <?php $this->render_feature_row('{{INDEX}}', array(), true); ?>
                </div>
                
                <?php fitcopilot_render_form_actions('features'); ?>
            </form>
        </div>
        
        <?php fitcopilot_render_admin_javascript('features', $data, 'feature'); ?>
        <?php
    }
    
    /**
     * Render settings tab
     */
    private function render_settings_tab($settings) {
        $settings_config = $this->get_settings_config();
        fitcopilot_render_settings_tab($settings, $settings_config, 'features');
    }
    
    /**
     * Render individual feature row
     */
    private function render_feature_row($index, $feature, $is_template = false) {
        $field_config = $this->get_field_config();
        fitcopilot_render_item_row($index, $feature, $field_config, 'feature', $is_template);
    }
    
    /**
     * Get field configuration
     */
    private function get_field_config() {
        // Use common fields plus feature-specific ones
        return fitcopilot_generate_field_config('simple', array(
            'icon' => array(
                'type' => 'text',
                'label' => 'Icon',
                'placeholder' => 'Icon name (e.g., star, heart, check)',
                'description' => 'Icon identifier for this feature'
            )
        ));
    }
    
    /**
     * Get settings configuration
     */
    private function get_settings_config() {
        return fitcopilot_generate_settings_config('simple');
    }
    
    /**
     * Get default data
     */
    private function get_default_data() {
        return array(
            array(
                'id' => 1,
                'title' => 'AI-Powered Workouts',
                'description' => 'Personalized workout plans generated by artificial intelligence.',
                'icon' => 'brain',
                'image' => '',
                'active' => true,
                'order' => 1
            ),
            array(
                'id' => 2,
                'title' => 'Progress Tracking',
                'description' => 'Track your fitness journey with detailed analytics and insights.',
                'icon' => 'chart',
                'image' => '',
                'active' => true,
                'order' => 2
            ),
            array(
                'id' => 3,
                'title' => 'Expert Guidance',
                'description' => 'Access to certified trainers and nutrition specialists.',
                'icon' => 'user-check',
                'image' => '',
                'active' => true,
                'order' => 3
            )
        );
    }
    
    /**
     * Get item name plural
     */
    protected function get_item_name_plural() {
        return 'features';
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting(
            'fitcopilot_features_options',
            'fitcopilot_features_data',
            array(
                'type' => 'array',
                'sanitize_callback' => array($this, 'sanitize_features_data'),
                'default' => array()
            )
        );
        
        register_setting(
            'fitcopilot_features_options',
            'fitcopilot_features_settings',
            array(
                'type' => 'array',
                'sanitize_callback' => array($this, 'sanitize_settings'),
                'default' => array()
            )
        );
    }
    
    /**
     * Sanitize features data
     */
    public function sanitize_features_data($input) {
        return FitCopilot_Admin_Sanitizer::sanitize_items_array($input, $this->get_field_config());
    }
    
    /**
     * Sanitize settings
     */
    public function sanitize_settings($input) {
        return FitCopilot_Admin_Sanitizer::sanitize_basic_item($input, $this->get_settings_config());
    }
    
    /**
     * Provide frontend data
     */
    public function provide_frontend_data() {
        $data = $this->get_current_data();
        $settings = $this->get_current_settings();
        
        FitCopilot_Frontend_Provider::localize_data(
            'fitcopilot-homepage',
            'fitcopilotFeaturesData',
            $data,
            $settings
        );
    }
}

// Initialize the manager
new FitCopilot_Features_Manager();
```

## Step 3: Create CSS Files

### **Base CSS** (`assets/admin/css/features-base.css`)
```css
/**
 * FitCopilot Features Admin - Base Layout & Structure
 */

.wrap.fitcopilot-features-admin {
    background: var(--fitcopilot-bg-primary);
    color: var(--fitcopilot-text-primary);
    min-height: 100vh;
    position: relative;
}

.features-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.features-header h2 {
    margin: 0;
    color: var(--fitcopilot-text-primary);
}

.features-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.feature-row {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.feature-row:hover {
    border-color: rgba(132, 225, 188, 0.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
```

### **Grid CSS** (`assets/admin/css/features-grid.css`)
```css
/**
 * FitCopilot Features Admin - Grid Layout System
 */

.item-fields-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.field-group.full-width {
    grid-column: 1 / -1;
}

.item-row-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.row-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}

@media (max-width: 768px) {
    .item-fields-grid {
        grid-template-columns: 1fr;
    }
    
    .item-row-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
```

### **Theme CSS** (`assets/admin/css/features-theme.css`)
```css
/**
 * FitCopilot Features Admin - Theme & Component Styles
 */

:root {
    --fitcopilot-bg-primary: #0B1121;
    --fitcopilot-text-primary: #FFFFFF;
    --fitcopilot-accent: #84E1BC;
    --fitcopilot-border: rgba(255, 255, 255, 0.1);
}

.fitcopilot-features-admin .field-group label {
    color: var(--fitcopilot-text-primary);
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
}

.fitcopilot-features-admin input[type="text"],
.fitcopilot-features-admin textarea,
.fitcopilot-features-admin select {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--fitcopilot-border);
    color: var(--fitcopilot-text-primary);
    border-radius: 8px;
    padding: 0.75rem;
    transition: all 0.3s ease;
}

.fitcopilot-features-admin input:focus,
.fitcopilot-features-admin textarea:focus,
.fitcopilot-features-admin select:focus {
    border-color: var(--fitcopilot-accent);
    background: rgba(255, 255, 255, 0.08);
    outline: none;
    box-shadow: 0 0 0 2px rgba(132, 225, 188, 0.2);
}

.inactive-notice {
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    border-radius: 6px;
    padding: 0.75rem;
    margin-bottom: 1rem;
    color: #ff6b6b;
    font-size: 0.9rem;
}

.form-actions {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}
```

## Step 4: Include in Theme

Add to your theme's `functions.php` or admin initialization file:

```php
// Include the features manager
require_once get_template_directory() . '/inc/admin/features-manager.php';
```

## Step 5: Create Frontend Integration

In your React component or theme templates:

```javascript
// Access the data in JavaScript
const featuresData = window.fitcopilotFeaturesData || { items: [], settings: {} };

// Or in PHP templates
$features_data = get_option('fitcopilot_features_data', array());
$features_settings = get_option('fitcopilot_features_settings', array());
```

## 🎯 Creating Complex Managers

For complex features (like Pricing Manager), follow the same pattern but:

1. **Extend `FitCopilot_Complex_Manager`** instead of `FitCopilot_Simple_Manager`
2. **Use `fitcopilot_generate_field_config('complex', $custom_fields)`**
3. **Add additional tabs** in `get_additional_tabs()` method
4. **Include AJAX functionality** for individual item management
5. **Add media management** capabilities

### **Complex Manager Example Structure**:
```php
class FitCopilot_Pricing_Manager extends FitCopilot_Complex_Manager {
    
    public function __construct() {
        parent::__construct('pricing');
    }
    
    protected function get_additional_tabs() {
        return array(
            'pricing-tiers' => array('label' => 'Pricing Tiers'),
            'payment-settings' => array('label' => 'Payment Settings')
        );
    }
    
    // ... implement other methods
}
```

## ✅ Quality Checklist

Before deploying your new admin manager:

### **Functionality**
- [ ] All form fields save correctly
- [ ] Active/inactive filtering works
- [ ] Export/import functionality works
- [ ] Frontend data provider works
- [ ] Settings are saved and applied

### **UI/UX**
- [ ] Follows FitCopilot admin design system
- [ ] Responsive on mobile devices
- [ ] Animations and interactions work
- [ ] Error states are handled gracefully

### **Code Quality**
- [ ] Follows WordPress coding standards
- [ ] All user input is sanitized
- [ ] Proper nonce verification
- [ ] No PHP errors or warnings
- [ ] CSS files stay within size limits

### **Testing**
- [ ] Test with no data (fresh install)
- [ ] Test with large datasets
- [ ] Test import/export functionality
- [ ] Test frontend integration
- [ ] Cross-browser compatibility

## 🔧 Troubleshooting

### **Common Issues**

**Admin page not appearing:**
- Check if `add_action('admin_menu', ...)` is called
- Verify user has `manage_options` capability
- Ensure parent menu exists

**CSS not loading:**
- Check file paths in `enqueue_feature_styles()`
- Verify CSS files exist and have correct permissions
- Clear any caching

**Frontend data not available:**
- Verify `provide_frontend_data()` is called on `wp_enqueue_scripts`
- Check if script handle exists when localizing
- Ensure data is not empty or malformed

**Form not saving:**
- Check nonce verification
- Verify field names match expected structure
- Check for PHP errors in error log

## 📚 Next Steps

1. **Create your first manager** using this guide
2. **Test thoroughly** with the quality checklist
3. **Document any custom functionality** for your team
4. **Consider contributing improvements** back to the framework

This implementation pattern ensures consistency across all FitCopilot admin interfaces while allowing appropriate complexity scaling for different business requirements. 