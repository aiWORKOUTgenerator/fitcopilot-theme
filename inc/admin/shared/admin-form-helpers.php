<?php
/**
 * FitCopilot Admin Form Helpers
 * Standardized form rendering functions for consistent admin interfaces
 * 
 * @package FitCopilot
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render a standardized form field
 * 
 * @param string $field_name Field name attribute
 * @param array $field_config Field configuration
 * @param mixed $value Current value
 * @param string $prefix Optional prefix for field names
 */
function fitcopilot_render_admin_field($field_name, $field_config, $value = '', $prefix = '') {
    $field_id = $prefix ? $prefix . '_' . $field_name : $field_name;
    $field_name_attr = $prefix ? $prefix . '[' . $field_name . ']' : $field_name;
    
    $required = !empty($field_config['required']) ? 'required' : '';
    $placeholder = $field_config['placeholder'] ?? '';
    $description = $field_config['description'] ?? '';
    $label = $field_config['label'] ?? ucfirst(str_replace('_', ' ', $field_name));
    
    ?>
    <div class="field-group <?php echo esc_attr($field_config['class'] ?? ''); ?>">
        <label for="<?php echo esc_attr($field_id); ?>">
            <?php echo esc_html($label); ?>
            <?php if (!empty($field_config['required'])): ?>
                <span class="required">*</span>
            <?php endif; ?>
        </label>
        
        <?php
        switch ($field_config['type']) {
            case 'text':
            case 'email':
            case 'url':
            case 'number':
                ?>
                <input type="<?php echo esc_attr($field_config['type']); ?>"
                       id="<?php echo esc_attr($field_id); ?>"
                       name="<?php echo esc_attr($field_name_attr); ?>"
                       value="<?php echo esc_attr($value); ?>"
                       placeholder="<?php echo esc_attr($placeholder); ?>"
                       class="<?php echo esc_attr($field_config['input_class'] ?? 'regular-text'); ?>"
                       <?php echo $required; ?>
                       <?php if ($field_config['type'] === 'number'): ?>
                           min="<?php echo esc_attr($field_config['min'] ?? '0'); ?>"
                           max="<?php echo esc_attr($field_config['max'] ?? ''); ?>"
                           step="<?php echo esc_attr($field_config['step'] ?? '1'); ?>"
                       <?php endif; ?> />
                <?php
                break;
                
            case 'textarea':
                ?>
                <textarea id="<?php echo esc_attr($field_id); ?>"
                          name="<?php echo esc_attr($field_name_attr); ?>"
                          placeholder="<?php echo esc_attr($placeholder); ?>"
                          class="<?php echo esc_attr($field_config['input_class'] ?? 'large-text'); ?>"
                          rows="<?php echo esc_attr($field_config['rows'] ?? '3'); ?>"
                          <?php echo $required; ?>><?php echo esc_textarea($value); ?></textarea>
                <?php
                break;
                
            case 'select':
                ?>
                <select id="<?php echo esc_attr($field_id); ?>"
                        name="<?php echo esc_attr($field_name_attr); ?>"
                        class="<?php echo esc_attr($field_config['input_class'] ?? 'regular-text'); ?>"
                        <?php echo $required; ?>>
                    <?php foreach ($field_config['options'] as $option_value => $option_label): ?>
                        <option value="<?php echo esc_attr($option_value); ?>" 
                                <?php selected($value, $option_value); ?>>
                            <?php echo esc_html($option_label); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <?php
                break;
                
            case 'checkbox':
                ?>
                <label class="checkbox-toggle">
                    <input type="checkbox"
                           id="<?php echo esc_attr($field_id); ?>"
                           name="<?php echo esc_attr($field_name_attr); ?>"
                           value="1"
                           <?php checked(!empty($value)); ?> />
                    <span class="toggle-label"><?php echo esc_html($field_config['toggle_label'] ?? $label); ?></span>
                </label>
                <?php
                break;
                
            case 'image_upload':
                ?>
                <div class="image-upload-group">
                    <input type="url"
                           id="<?php echo esc_attr($field_id); ?>"
                           name="<?php echo esc_attr($field_name_attr); ?>"
                           value="<?php echo esc_attr($value); ?>"
                           placeholder="<?php echo esc_attr($placeholder ?: 'https://example.com/image.jpg'); ?>"
                           class="image-url-input regular-text" />
                    <button type="button" class="upload-image-button button button-secondary"
                            data-target="<?php echo esc_attr($field_id); ?>">
                        📷 Choose Image
                    </button>
                </div>
                <?php if (!empty($value)): ?>
                    <div class="image-preview">
                        <img src="<?php echo esc_url($value); ?>" 
                             alt="Preview" 
                             style="max-width: 100px; height: auto; margin-top: 10px; border-radius: 8px;" />
                    </div>
                <?php endif; ?>
                <?php
                break;
                
            case 'rating':
                ?>
                <select id="<?php echo esc_attr($field_id); ?>"
                        name="<?php echo esc_attr($field_name_attr); ?>"
                        class="<?php echo esc_attr($field_config['input_class'] ?? 'regular-text'); ?>">
                    <?php for ($i = 1; $i <= 5; $i++): ?>
                        <option value="<?php echo $i; ?>" <?php selected($value, $i); ?>>
                            <?php echo $i; ?> Star<?php echo $i > 1 ? 's' : ''; ?>
                        </option>
                    <?php endfor; ?>
                </select>
                <?php
                break;
        }
        ?>
        
        <?php if ($description): ?>
            <p class="description"><?php echo esc_html($description); ?></p>
        <?php endif; ?>
    </div>
    <?php
}

/**
 * Render a form row for an item (testimonial, trainer, etc.)
 * 
 * @param int|string $index Row index
 * @param array $item Item data
 * @param array $field_config Field configuration
 * @param string $item_type Type of item (testimonial, trainer, etc.)
 * @param bool $is_template Whether this is a template row
 */
function fitcopilot_render_item_row($index, $item, $field_config, $item_type, $is_template = false) {
    $index_attr = $is_template ? '{{INDEX}}' : $index;
    $item_name = $item['name'] ?? ($is_template ? 'New ' . ucfirst($item_type) : 'Unnamed');
    $is_active = !empty($item['active']);
    
    $row_class = 'item-row ' . $item_type . '-row';
    if (!$is_active) {
        $row_class .= ' inactive';
    }
    if ($is_template) {
        $row_class .= ' template-row';
    }
    
    ?>
    <div class="<?php echo esc_attr($row_class); ?>" data-index="<?php echo esc_attr($index_attr); ?>">
        <!-- Item Header -->
        <div class="item-row-header">
            <h4>
                <?php if (!empty($item['featured'])): ?>
                    ⭐ Featured: 
                <?php endif; ?>
                <span class="item-name-display"><?php echo esc_html($item_name); ?></span>
            </h4>
            
            <div class="row-controls">
                <label class="active-toggle">
                    <input type="checkbox" 
                           name="<?php echo esc_attr($item_type); ?>s[<?php echo $index_attr; ?>][active]" 
                           value="1" <?php checked($is_active); ?> />
                    <span class="toggle-label">Show on Frontend</span>
                </label>
                
                <button type="button" class="remove-item-row button-link-delete" 
                        aria-label="Remove <?php echo esc_attr($item_type); ?>">❌</button>
            </div>
        </div>
        
        <!-- Inactive Notice -->
        <?php if (!$is_active): ?>
            <div class="inactive-notice">
                ⚠️ This <?php echo esc_html($item_type); ?> is hidden from the frontend
            </div>
        <?php endif; ?>
        
        <!-- Item Fields -->
        <div class="item-fields-grid">
            <?php
            // Add hidden ID field
            if (!$is_template) {
                echo '<input type="hidden" name="' . esc_attr($item_type) . 's[' . $index_attr . '][id]" value="' . esc_attr($item['id'] ?? $index + 1) . '" />';
            }
            
            // Render each field
            foreach ($field_config as $field_name => $config) {
                if ($field_name === 'id' || $field_name === 'active') {
                    continue; // Skip ID and active fields as they're handled separately
                }
                
                $field_value = $item[$field_name] ?? ($config['default'] ?? '');
                $field_name_attr = $item_type . 's[' . $index_attr . '][' . $field_name . ']';
                
                fitcopilot_render_admin_field($field_name, $config, $field_value, $item_type . 's[' . $index_attr . ']');
            }
            ?>
        </div>
    </div>
    <?php
}

/**
 * Render export/import tab content
 * 
 * @param string $feature_name Feature name for labels
 * @param string $export_filename Export filename
 */
function fitcopilot_render_export_import_tab($feature_name, $export_filename = null) {
    if (!$export_filename) {
        $export_filename = sanitize_key($feature_name) . '-data';
    }
    
    ?>
    <div class="fitcopilot-card">
        <h2>Export / Import <?php echo esc_html(ucfirst($feature_name)); ?></h2>
        
        <div class="export-section">
            <h3>Export Current Data</h3>
            <p>Download current <?php echo esc_html($feature_name); ?> data as JSON:</p>
            <button type="button" class="button button-secondary export-data-btn" 
                    data-filename="<?php echo esc_attr($export_filename); ?>">
                📥 Export <?php echo esc_html(ucfirst($feature_name)); ?> Data
            </button>
        </div>
        
        <div class="import-section" style="margin-top: 30px;">
            <h3>Import Data</h3>
            <p><strong>⚠️ Warning:</strong> This will replace all current data.</p>
            <form method="post" enctype="multipart/form-data">
                <?php wp_nonce_field('fitcopilot_import_action', 'fitcopilot_import_nonce'); ?>
                <input type="file" name="import_file" accept=".json" />
                <input type="submit" name="fitcopilot_import_submit" 
                       class="button button-secondary" value="📤 Import Data" 
                       onclick="return confirm('This will replace all current data. Continue?');" />
            </form>
        </div>
    </div>
    <?php
}

/**
 * Render settings tab content
 * 
 * @param array $settings Current settings
 * @param array $settings_config Settings field configuration
 * @param string $feature_name Feature name
 */
function fitcopilot_render_settings_tab($settings, $settings_config, $feature_name) {
    ?>
    <div class="fitcopilot-card">
        <form method="post" action="">
            <?php wp_nonce_field('fitcopilot_' . sanitize_key($feature_name) . '_action', 'fitcopilot_' . sanitize_key($feature_name) . '_nonce'); ?>
            
            <h2><?php echo esc_html(ucfirst($feature_name)); ?> Settings</h2>
            
            <table class="form-table">
                <?php foreach ($settings_config as $setting_name => $config): ?>
                    <tr>
                        <th scope="row"><?php echo esc_html($config['label']); ?></th>
                        <td>
                            <?php
                            $setting_value = $settings[$setting_name] ?? ($config['default'] ?? '');
                            
                            switch ($config['type']) {
                                case 'text':
                                    ?>
                                    <input type="text" name="settings[<?php echo esc_attr($setting_name); ?>]" 
                                           value="<?php echo esc_attr($setting_value); ?>" 
                                           class="regular-text" />
                                    <?php
                                    break;
                                    
                                case 'checkbox':
                                    ?>
                                    <label>
                                        <input type="checkbox" name="settings[<?php echo esc_attr($setting_name); ?>]" 
                                               value="1" <?php checked(!empty($setting_value)); ?> />
                                        <?php echo esc_html($config['checkbox_label'] ?? $config['label']); ?>
                                    </label>
                                    <?php
                                    break;
                                    
                                case 'number':
                                    ?>
                                    <input type="number" name="settings[<?php echo esc_attr($setting_name); ?>]" 
                                           value="<?php echo esc_attr($setting_value); ?>" 
                                           min="<?php echo esc_attr($config['min'] ?? '0'); ?>" 
                                           step="<?php echo esc_attr($config['step'] ?? '1'); ?>" />
                                    <?php
                                    break;
                                    
                                case 'select':
                                    ?>
                                    <select name="settings[<?php echo esc_attr($setting_name); ?>]">
                                        <?php foreach ($config['options'] as $value => $label): ?>
                                            <option value="<?php echo esc_attr($value); ?>" 
                                                    <?php selected($setting_value, $value); ?>>
                                                <?php echo esc_html($label); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    <?php
                                    break;
                            }
                            ?>
                            
                            <?php if (!empty($config['description'])): ?>
                                <p class="description"><?php echo esc_html($config['description']); ?></p>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </table>
            
            <p class="submit">
                <input type="submit" name="fitcopilot_<?php echo esc_attr(sanitize_key($feature_name)); ?>_submit" 
                       class="button button-primary" value="Save Settings" />
            </p>
        </form>
    </div>
    <?php
}

/**
 * Generate JavaScript for admin interactions
 * 
 * @param string $feature_name Feature name
 * @param array $data Current data
 * @param string $item_type Type of items (testimonial, trainer, etc.)
 */
function fitcopilot_render_admin_javascript($feature_name, $data, $item_type) {
    $feature_slug = sanitize_key($feature_name);
    $item_count = count($data);
    ?>
    <script>
    jQuery(document).ready(function($) {
        let <?php echo $item_type; ?>Index = <?php echo $item_count; ?>;
        
        // Handle tab navigation
        $('.nav-tab').on('click', function(e) {
            e.preventDefault();
            
            // Hide all tab content
            $('.tab-content').hide();
            
            // Remove active class from all tabs
            $('.nav-tab').removeClass('nav-tab-active');
            
            // Show selected tab content and mark tab as active
            $($(this).attr('href')).show();
            $(this).addClass('nav-tab-active');
        });
        
        // Add new item
        $('.add-<?php echo $item_type; ?>-btn').on('click', function() {
            const template = $('#<?php echo $item_type; ?>-row-template').html();
            const newRow = template.replace(/\{\{INDEX\}\}/g, <?php echo $item_type; ?>Index);
            $('#<?php echo $item_type; ?>s-list').append(newRow);
            <?php echo $item_type; ?>Index++;
        });
        
        // Remove item
        $(document).on('click', '.remove-item-row', function() {
            if (confirm('Are you sure you want to remove this <?php echo $item_type; ?>?')) {
                $(this).closest('.item-row').remove();
            }
        });
        
        // Update item name display when name field changes
        $(document).on('input', '.item-name-input', function() {
            const newName = $(this).val() || 'Unnamed <?php echo ucfirst($item_type); ?>';
            $(this).closest('.item-row').find('.item-name-display').text(newName);
        });
        
        // Media uploader
        $(document).on('click', '.upload-image-button', function(e) {
            e.preventDefault();
            
            const targetInputId = $(this).data('target');
            const targetInput = $('#' + targetInputId);
            const imagePreview = $(this).closest('.image-upload-group').siblings('.image-preview');
            
            const mediaUploader = wp.media({
                title: 'Select Image',
                button: { text: 'Use this image' },
                multiple: false
            });
            
            mediaUploader.on('select', function() {
                const attachment = mediaUploader.state().get('selection').first().toJSON();
                targetInput.val(attachment.url);
                
                if (attachment.url) {
                    if (imagePreview.length) {
                        imagePreview.html('<img src="' + attachment.url + '" alt="Preview" style="max-width: 100px; height: auto; margin-top: 10px; border-radius: 8px;" />');
                    } else {
                        targetInput.after('<div class="image-preview"><img src="' + attachment.url + '" alt="Preview" style="max-width: 100px; height: auto; margin-top: 10px; border-radius: 8px;" /></div>');
                    }
                }
            });
            
            mediaUploader.open();
        });
        
        // Export data
        $('.export-data-btn').on('click', function() {
            const filename = $(this).data('filename') || '<?php echo $feature_slug; ?>-data';
            const data = <?php echo json_encode($data); ?>;
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename + '-' + new Date().toISOString().split('T')[0] + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });
    </script>
    <?php
} 