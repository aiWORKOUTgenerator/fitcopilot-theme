# FitCopilot Admin Reference Patterns

## 📋 Overview

This document establishes the official reference patterns for all FitCopilot admin managers. These patterns ensure consistency while allowing complexity to scale with business requirements.

## 🎯 Reference Implementations

### **Simple Feature Pattern: Testimonials Manager**
**File**: `inc/admin/testimonials-manager.php` (747 lines)
**Purpose**: Basic content display and management
**Complexity Level**: Simple

#### **Field Configuration**
```php
$testimonial_fields = array(
    'name' => array(
        'type' => 'text',
        'label' => 'Customer Name',
        'required' => true,
        'placeholder' => 'Enter customer name'
    ),
    'role' => array(
        'type' => 'text', 
        'label' => 'Role/Title',
        'placeholder' => 'Job Title or Role'
    ),
    'quote' => array(
        'type' => 'textarea',
        'label' => 'Testimonial Quote',
        'required' => true,
        'placeholder' => 'Enter the testimonial quote...',
        'rows' => 4
    ),
    'avatar' => array(
        'type' => 'image_upload',
        'label' => 'Avatar Image',
        'placeholder' => 'Image URL'
    ),
    'rating' => array(
        'type' => 'rating',
        'label' => 'Rating',
        'default' => 5
    )
);
```

#### **Settings Configuration**
```php
$testimonial_settings = array(
    'autoplay' => array(
        'type' => 'checkbox',
        'label' => 'Autoplay',
        'checkbox_label' => 'Enable automatic carousel rotation',
        'default' => false
    ),
    'autoplay_speed' => array(
        'type' => 'number',
        'label' => 'Autoplay Speed (ms)',
        'min' => 1000,
        'max' => 10000,
        'step' => 500,
        'default' => 3000
    ),
    'items_per_page_desktop' => array(
        'type' => 'select',
        'label' => 'Items Per Page (Desktop)',
        'options' => array(1 => '1', 2 => '2', 3 => '3', 4 => '4', 5 => '5'),
        'default' => 3
    )
);
```

### **Complex Feature Pattern: Personal Training Manager**
**File**: `inc/admin/personal-training-manager.php` (1,103 lines)
**Purpose**: Professional services showcase and management
**Complexity Level**: Complex

#### **Field Configuration**
```php
$trainer_fields = array(
    'name' => array(
        'type' => 'text',
        'label' => 'Trainer Name',
        'required' => true,
        'placeholder' => 'Enter trainer name',
        'class' => 'trainer-name-input'
    ),
    'specialty' => array(
        'type' => 'text',
        'label' => 'Specialty',
        'required' => true,
        'placeholder' => 'e.g., Strength & Conditioning'
    ),
    'bio' => array(
        'type' => 'textarea',
        'label' => 'Bio/Description',
        'placeholder' => 'Tell clients about this trainer\'s experience...',
        'rows' => 3,
        'class' => 'full-width'
    ),
    'image_url' => array(
        'type' => 'image_upload',
        'label' => 'Trainer Image',
        'placeholder' => 'https://example.com/trainer-photo.jpg',
        'class' => 'full-width'
    ),
    'years_experience' => array(
        'type' => 'number',
        'label' => 'Years Experience',
        'min' => 0,
        'max' => 50,
        'step' => 1
    ),
    'clients_count' => array(
        'type' => 'number',
        'label' => 'Clients Trained',
        'min' => 0,
        'step' => 1
    ),
    'coach_type' => array(
        'type' => 'select',
        'label' => 'Coach Type',
        'options' => array(
            'strength' => 'Strength Training',
            'nutrition' => 'Nutrition',
            'performance' => 'Athletic Performance',
            'recovery' => 'Recovery & Wellness'
        ),
        'default' => 'strength'
    ),
    'video_title' => array(
        'type' => 'text',
        'label' => 'Video Title',
        'placeholder' => 'e.g., High-Intensity Workout Demo',
        'class' => 'full-width'
    ),
    'video_url' => array(
        'type' => 'url',
        'label' => 'Video URL',
        'placeholder' => 'YouTube embed URL',
        'class' => 'full-width'
    ),
    'featured' => array(
        'type' => 'checkbox',
        'label' => 'Featured Trainer',
        'toggle_label' => '⭐ Featured Trainer',
        'description' => 'Featured trainers get prominent display'
    ),
    'order' => array(
        'type' => 'number',
        'label' => 'Order/Priority',
        'min' => 1,
        'step' => 1
    )
);
```

## 🏗️ Architectural Standards

### **1. Admin Page Registration Pattern**
All admin managers must follow this exact pattern:

```php
function fitcopilot_register_[feature]_manager_page() {
    add_submenu_page(
        'fitcopilot-dashboard',                     // ✅ Consistent parent
        '[Feature] Manager',                        // ✅ Descriptive page title
        '[Menu Title]',                            // ✅ Clear menu title
        'manage_options',                          // ✅ Consistent capability
        'fitcopilot-[feature]',                    // ✅ Namespaced slug
        'fitcopilot_render_[feature]_manager_page' // ✅ Clear callback
    );
}
add_action('admin_menu', 'fitcopilot_register_[feature]_manager_page');
```

### **2. CSS Architecture Pattern (Three-File System)**
All admin managers must implement this structure:

```
assets/admin/css/
├── [feature]-base.css      # Layout and structure
├── [feature]-grid.css      # Content organization  
├── [feature]-theme.css     # Visual styling
└── shared/
    └── admin-base.css      # Global foundation (always loaded first)
```

#### **File Size Guidelines**
- **Simple Features**: ≤ 500 lines total CSS
- **Complex Features**: ≤ 1000 lines total CSS

### **3. Data Management Pattern**

#### **Option Storage**
```php
// Main data storage
update_option('fitcopilot_[feature]_data', $sanitized_data);

// Settings storage  
update_option('fitcopilot_[feature]_settings', $sanitized_settings);

// Last updated timestamp
update_option('fitcopilot_[feature]_last_updated', time());
```

#### **Data Sanitization**
```php
function fitcopilot_sanitize_[feature]_data($input) {
    return FitCopilot_Admin_Sanitizer::sanitize_items_array($input, $field_config);
}
```

#### **Frontend Data Provider**
```php
function fitcopilot_provide_[feature]_data_for_frontend() {
    $data = get_option('fitcopilot_[feature]_data', $default_data);
    $settings = get_option('fitcopilot_[feature]_settings', $default_settings);
    
    FitCopilot_Frontend_Provider::localize_data(
        'fitcopilot-homepage',
        'fitcopilot[Feature]Data', 
        $data,
        $settings
    );
}
add_action('wp_enqueue_scripts', 'fitcopilot_provide_[feature]_data_for_frontend', 20);
```

### **4. UI Structure Pattern**

#### **Required Elements (All Managers)**
```php
// ✅ Consistent header with logo and title
fitcopilot_render_admin_header($page_title, $tabs);

// ✅ Tab navigation (if multiple tabs)
$tabs = array(
    'main-content' => array('label' => 'Manage [Items]'),
    'settings' => array('label' => 'Settings'),
    'export-import' => array('label' => 'Export / Import')
);

// ✅ Status indicator
fitcopilot_render_status_indicator($item_count, $item_type);

// ✅ Form structure with nonce
wp_nonce_field('fitcopilot_[feature]_action', 'fitcopilot_[feature]_nonce');
```

#### **Tab Configuration by Complexity**

**Simple Features (2-3 tabs)**
- Main Content
- Settings  
- Export/Import

**Complex Features (4-6 tabs)**
- Main Content
- Media Library
- Advanced Settings
- Export/Import
- (Optional: Analytics, Integrations)

### **5. Security Pattern**
All managers must implement:

```php
// ✅ Nonce verification
check_admin_referer('fitcopilot_[feature]_action', 'fitcopilot_[feature]_nonce');

// ✅ Capability checking
if (!current_user_can('manage_options')) {
    wp_die(__('Insufficient permissions'));
}

// ✅ Data sanitization
$sanitized_data = fitcopilot_sanitize_[feature]_data($_POST['data']);

// ✅ Secure AJAX (for complex features)
wp_verify_nonce($_POST['nonce'], 'fitcopilot_[feature]_action');
```

## 📏 Implementation Guidelines

### **For Simple Features (Testimonials-like)**

#### **Complexity Limits**
- ≤ 800 lines PHP code
- ≤ 500 lines total CSS
- ≤ 8 data fields per item
- 2-3 admin tabs maximum
- Basic form submission only

#### **Use Cases**
- Content display (testimonials, features)
- Simple configuration (footer, basic settings)
- Static content management

#### **Example Implementation**
```php
class FitCopilot_Testimonials_Manager extends FitCopilot_Simple_Manager {
    
    public function __construct() {
        parent::__construct('testimonials');
    }
    
    protected function get_current_data() {
        return get_option('fitcopilot_testimonials_data', $this->get_default_data());
    }
    
    protected function get_item_name_plural() {
        return 'testimonials';
    }
    
    // ... implement other abstract methods
}

new FitCopilot_Testimonials_Manager();
```

### **For Complex Features (Personal Training-like)**

#### **Complexity Allowances**
- ≤ 1200 lines PHP code
- ≤ 1000 lines total CSS
- Business-justified data fields
- 4-6 admin tabs maximum
- Rich media management
- Individual item management (if business-critical)
- AJAX interactions

#### **Use Cases**
- Professional services (trainers, coaches)
- Rich content management (pricing, programs)
- Interactive features (journey steps, forms)

#### **Example Implementation**
```php
class FitCopilot_Personal_Training_Manager extends FitCopilot_Complex_Manager {
    
    public function __construct() {
        parent::__construct('personal-training');
    }
    
    protected function get_additional_tabs() {
        return array(
            'certifications' => array('label' => 'Certifications'),
            'scheduling' => array('label' => 'Availability')
        );
    }
    
    protected function enqueue_feature_scripts() {
        parent::enqueue_feature_scripts();
        // Add individual save functionality
        $this->setup_ajax_handlers();
    }
    
    // ... implement other abstract methods
}

new FitCopilot_Personal_Training_Manager();
```

## 🎯 Quality Gates

### **Universal Standards (All Features)**
- [ ] Follows admin page registration pattern
- [ ] Implements three-file CSS architecture
- [ ] Uses proper WordPress security patterns
- [ ] Includes standardized frontend data provider
- [ ] Has export/import functionality
- [ ] Passes WordPress coding standards

### **Simple Feature Checklist**
- [ ] ≤ 800 lines PHP
- [ ] ≤ 500 lines total CSS
- [ ] ≤ 8 data fields per item
- [ ] 2-3 admin tabs maximum
- [ ] Basic form submission workflow

### **Complex Feature Checklist**
- [ ] ≤ 1200 lines PHP
- [ ] ≤ 1000 lines total CSS
- [ ] Business-justified field complexity
- [ ] 4-6 admin tabs maximum
- [ ] Rich media management capabilities
- [ ] Individual item management (if required)
- [ ] Proper AJAX error handling

## 🚀 Implementation Templates

### **Template Generator Usage**
```bash
# Generate simple feature
php scripts/generate-admin-manager.php --name="Features" --type="simple" --fields="title,description,icon"

# Generate complex feature  
php scripts/generate-admin-manager.php --name="Pricing" --type="complex" --fields="name,price,features,popular"
```

### **Field Configuration Templates**

#### **Common Field Types**
```php
// Text field
'field_name' => array(
    'type' => 'text',
    'label' => 'Field Label',
    'required' => true,
    'placeholder' => 'Enter value...',
    'class' => 'regular-text'
),

// Rich textarea
'description' => array(
    'type' => 'textarea',
    'label' => 'Description',
    'rows' => 4,
    'class' => 'full-width'
),

// Image upload
'image' => array(
    'type' => 'image_upload',
    'label' => 'Image',
    'placeholder' => 'https://example.com/image.jpg'
),

// Feature toggle
'featured' => array(
    'type' => 'checkbox',
    'label' => 'Featured Item',
    'toggle_label' => '⭐ Featured',
    'description' => 'Featured items get prominent display'
)
```

## 🔄 Migration Strategy

### **Step 1: Document Current Implementation**
1. Map existing field structures
2. Identify complexity level
3. Note custom functionality

### **Step 2: Choose Reference Pattern**
- **Simple pattern** for basic content management
- **Complex pattern** for rich functionality requirements

### **Step 3: Implement Using Framework**
1. Extend appropriate base class
2. Configure fields and settings
3. Implement required abstract methods
4. Test functionality

### **Step 4: Validate Against Quality Gates**
1. Check file size limits
2. Verify security implementation
3. Test frontend integration
4. Confirm export/import works

This reference document ensures all FitCopilot admin managers maintain consistency while allowing appropriate complexity scaling based on business requirements. 