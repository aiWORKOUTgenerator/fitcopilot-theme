<?php
/**
 * FitCopilot Testimonials Manager Admin Page
 * 
 * Provides admin interface for managing testimonials across the site
 * 
 * @package FitCopilot
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the Testimonials Manager admin page
 */
function fitcopilot_register_testimonials_manager_page() {
    add_submenu_page(
        'fitcopilot-dashboard',         // Parent slug (under Fitcopilot main menu)
        'Testimonials Manager',         // Page title
        'Testimonials',                 // Menu title
        'manage_options',               // Capability required
        'fitcopilot-testimonials',      // Menu slug
        'fitcopilot_render_testimonials_manager_page' // Callback function
    );
}
add_action('admin_menu', 'fitcopilot_register_testimonials_manager_page');

/**
 * Register settings for testimonials
 */
function fitcopilot_register_testimonials_settings() {
    // Register testimonials settings
    register_setting(
        'fitcopilot_testimonials_options',
        'fitcopilot_testimonials_data',
        array(
            'type'              => 'array',
            'sanitize_callback' => 'fitcopilot_sanitize_testimonials_settings',
            'default'           => array()
        )
    );

    // Register carousel settings
    register_setting(
        'fitcopilot_testimonials_options',
        'fitcopilot_testimonials_carousel_settings',
        array(
            'type'              => 'array',
            'sanitize_callback' => 'fitcopilot_sanitize_carousel_settings',
            'default'           => array(
                'autoplay' => false,
                'autoplay_speed' => 3000,
                'show_indicators' => true,
                'show_navigation' => true,
                'items_per_page_desktop' => 3,
                'items_per_page_mobile' => 1
            )
        )
    );
}
add_action('admin_init', 'fitcopilot_register_testimonials_settings');

/**
 * Sanitize testimonials settings data
 * 
 * @param array $input The raw settings data
 * @return array Sanitized settings data
 */
function fitcopilot_sanitize_testimonials_settings($input) {
    $sanitized_input = array();
    
    if (is_array($input)) {
        foreach ($input as $index => $testimonial) {
            $sanitized_input[$index] = array(
                'id'     => absint($testimonial['id'] ?? $index + 1),
                'name'   => sanitize_text_field($testimonial['name'] ?? ''),
                'role'   => sanitize_text_field($testimonial['role'] ?? ''),
                'quote'  => wp_kses_post($testimonial['quote'] ?? ''),
                'avatar' => esc_url_raw($testimonial['avatar'] ?? ''),
                'rating' => max(1, min(5, absint($testimonial['rating'] ?? 5))),
                'active' => !empty($testimonial['active'])
            );
        }
    }
    
    return $sanitized_input;
}

/**
 * Sanitize carousel settings data
 * 
 * @param array $input The raw settings data
 * @return array Sanitized settings data
 */
function fitcopilot_sanitize_carousel_settings($input) {
    return array(
        'autoplay' => !empty($input['autoplay']),
        'autoplay_speed' => max(1000, min(10000, absint($input['autoplay_speed'] ?? 3000))),
        'show_indicators' => !empty($input['show_indicators']),
        'show_navigation' => !empty($input['show_navigation']),
        'items_per_page_desktop' => max(1, min(5, absint($input['items_per_page_desktop'] ?? 3))),
        'items_per_page_mobile' => max(1, min(3, absint($input['items_per_page_mobile'] ?? 1)))
    );
}

/**
 * Get default testimonials data
 */
function fitcopilot_get_default_testimonials() {
    return array(
        array(
            'id' => 1,
            'name' => 'Sarah Johnson',
            'role' => 'Marathon Runner',
            'quote' => 'This AI workout generator transformed my training routine. I\'ve seen more progress in 3 months than in my previous year of self-guided workouts.',
            'avatar' => '',
            'rating' => 5,
            'active' => true
        ),
        array(
            'id' => 2,
            'name' => 'Mike Reynolds',
            'role' => 'Busy Professional',
            'quote' => 'With my hectic schedule, I never had time to plan effective workouts. Now I get personalized routines that fit perfectly into my day.',
            'avatar' => '',
            'rating' => 5,
            'active' => true
        ),
        array(
            'id' => 3,
            'name' => 'Emma Chen',
            'role' => 'Fitness Enthusiast',
            'quote' => 'The variety keeps me engaged and motivated. I\'ve discovered exercises I never would have tried on my own, and my results speak for themselves.',
            'avatar' => '',
            'rating' => 4,
            'active' => true
        ),
        array(
            'id' => 4,
            'name' => 'David Park',
            'role' => 'Personal Trainer',
            'quote' => 'As a trainer, I use this tool to create diverse programs for my clients. The AI suggests combinations I hadn\'t considered, enhancing my training arsenal.',
            'avatar' => '',
            'rating' => 5,
            'active' => true
        ),
        array(
            'id' => 5,
            'name' => 'Lisa Thompson',
            'role' => 'Working Mom',
            'quote' => 'Finding time for fitness was impossible until I found this app. Quick, effective workouts that fit into my busy lifestyle perfectly.',
            'avatar' => '',
            'rating' => 5,
            'active' => true
        ),
        array(
            'id' => 6,
            'name' => 'James Martinez',
            'role' => 'College Student',
            'quote' => 'Budget-friendly and effective! No gym membership needed. I can work out in my dorm room with bodyweight exercises the AI suggests.',
            'avatar' => '',
            'rating' => 4,
            'active' => true
        ),
        array(
            'id' => 7,
            'name' => 'Rachel Kim',
            'role' => 'Senior Executive',
            'quote' => 'Travel constantly for work, but these location-independent workouts keep me consistent. Love the hotel room and airport exercise options.',
            'avatar' => '',
            'rating' => 5,
            'active' => true
        ),
        array(
            'id' => 8,
            'name' => 'Tom Wilson',
            'role' => 'Retiree',
            'quote' => 'At 65, I thought my fitness journey was over. This app proved me wrong with gentle yet effective senior-focused workout routines.',
            'avatar' => '',
            'rating' => 5,
            'active' => true
        )
    );
}

/**
 * Render the Testimonials Manager admin page
 */
function fitcopilot_render_testimonials_manager_page() {
    // Get saved options
    $testimonials_data = get_option('fitcopilot_testimonials_data', fitcopilot_get_default_testimonials());
    $carousel_settings = get_option('fitcopilot_testimonials_carousel_settings', array(
        'autoplay' => false,
        'autoplay_speed' => 3000,
        'show_indicators' => true,
        'show_navigation' => true,
        'items_per_page_desktop' => 3,
        'items_per_page_mobile' => 1
    ));

    // Handle form submissions
    if (isset($_POST['fitcopilot_testimonials_submit'])) {
        check_admin_referer('fitcopilot_testimonials_action', 'fitcopilot_testimonials_nonce');
        
        // Update testimonials data
        $updated_testimonials = array();
        if (isset($_POST['testimonials']) && is_array($_POST['testimonials'])) {
            foreach ($_POST['testimonials'] as $index => $testimonial) {
                $updated_testimonials[] = array(
                    'id' => absint($testimonial['id'] ?? $index + 1),
                    'name' => sanitize_text_field($testimonial['name'] ?? ''),
                    'role' => sanitize_text_field($testimonial['role'] ?? ''),
                    'quote' => wp_kses_post($testimonial['quote'] ?? ''),
                    'avatar' => esc_url_raw($testimonial['avatar'] ?? ''),
                    'rating' => max(1, min(5, absint($testimonial['rating'] ?? 5))),
                    'active' => !empty($testimonial['active'])
                );
            }
        }
        
        update_option('fitcopilot_testimonials_data', $updated_testimonials);
        $testimonials_data = $updated_testimonials;
        
        echo '<div class="notice notice-success"><p>Testimonials updated successfully!</p></div>';
    }

    // Handle reset to defaults
    if (isset($_POST['fitcopilot_reset_defaults'])) {
        check_admin_referer('fitcopilot_reset_action', 'fitcopilot_reset_nonce');
        
        delete_option('fitcopilot_testimonials_data');
        $testimonials_data = fitcopilot_get_default_testimonials();
        update_option('fitcopilot_testimonials_data', $testimonials_data);
        
        echo '<div class="notice notice-success"><p>Testimonials reset to default set (8 testimonials loaded)!</p></div>';
    }

    if (isset($_POST['fitcopilot_carousel_submit'])) {
        check_admin_referer('fitcopilot_carousel_action', 'fitcopilot_carousel_nonce');
        
        // Update carousel settings
        $updated_carousel = array(
            'autoplay' => !empty($_POST['autoplay']),
            'autoplay_speed' => max(1000, min(10000, absint($_POST['autoplay_speed'] ?? 3000))),
            'show_indicators' => !empty($_POST['show_indicators']),
            'show_navigation' => !empty($_POST['show_navigation']),
            'items_per_page_desktop' => max(1, min(5, absint($_POST['items_per_page_desktop'] ?? 3))),
            'items_per_page_mobile' => max(1, min(3, absint($_POST['items_per_page_mobile'] ?? 1)))
        );
        
        update_option('fitcopilot_testimonials_carousel_settings', $updated_carousel);
        $carousel_settings = $updated_carousel;
        
        echo '<div class="notice notice-success"><p>Carousel settings updated successfully!</p></div>';
    }
    ?>
    
    <div class="wrap fitcopilot-testimonials-admin">
        <!-- Animated background particles -->
        <div class="fitcopilot-admin-background">
            <div class="fitcopilot-particle"></div>
            <div class="fitcopilot-particle"></div>
            <div class="fitcopilot-particle"></div>
            <div class="fitcopilot-particle"></div>
        </div>
        
        <div class="fitcopilot-admin-container">
            <div class="fitcopilot-admin-header">
                <div class="fitcopilot-admin-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            </div>
        
        <div class="nav-tab-wrapper">
            <a href="#testimonials-content" class="nav-tab nav-tab-active"><?php esc_html_e('Manage Testimonials', 'fitcopilot'); ?></a>
            <a href="#carousel-settings" class="nav-tab"><?php esc_html_e('Carousel Settings', 'fitcopilot'); ?></a>
            <a href="#export-import" class="nav-tab"><?php esc_html_e('Export / Import', 'fitcopilot'); ?></a>
        </div>
        
        <!-- Registration-style gradient divider -->
        <div class="fitcopilot-divider"></div>
        
        <!-- Testimonials Management Tab -->
        <div id="testimonials-content" class="tab-content fitcopilot-card">
            <form method="post" action="">
                <?php wp_nonce_field('fitcopilot_testimonials_action', 'fitcopilot_testimonials_nonce'); ?>
                
                <div class="testimonials-header">
                    <h2><?php esc_html_e('Testimonials Management', 'fitcopilot'); ?></h2>
                    <p><?php esc_html_e('Add, edit, and manage testimonials that appear in your testimonials carousel.', 'fitcopilot'); ?></p>
                    <div style="background: rgba(132, 225, 188, 0.1); border: 1px solid rgba(132, 225, 188, 0.3); border-radius: 8px; padding: 1rem; margin: 1rem 0; color: #ffffff;">
                        <strong>📊 Current Status:</strong> <?php echo count($testimonials_data); ?> testimonials loaded. 
                        <?php if (count($testimonials_data) === 3): ?>
                            <em style="color: #84e1bc;">Click "Reset to Defaults" to load 8 example testimonials for testing the grid layout.</em>
                        <?php endif; ?>
                    </div>
                    <button type="button" class="button button-secondary add-testimonial-btn">
                        <?php esc_html_e('+ Add New Testimonial', 'fitcopilot'); ?>
                    </button>
                </div>
                
                <div class="testimonials-list" id="testimonials-list">
                    <?php foreach ($testimonials_data as $index => $testimonial): ?>
                        <?php fitcopilot_render_testimonial_row($index, $testimonial); ?>
                    <?php endforeach; ?>
                </div>
                
                <p class="submit">
                    <input type="submit" 
                           name="fitcopilot_testimonials_submit" 
                           id="submit" 
                           class="button button-primary" 
                           value="<?php esc_attr_e('Save Testimonials', 'fitcopilot'); ?>" />
                    <form method="post" action="" style="display: inline;">
                        <?php wp_nonce_field('fitcopilot_reset_action', 'fitcopilot_reset_nonce'); ?>
                        <button type="submit" name="fitcopilot_reset_defaults" class="button button-secondary reset-to-defaults-btn" onclick="return confirm('This will reset all testimonials to the default set of 8 testimonials. Are you sure?');">
                            <?php esc_html_e('Reset to Defaults (8 testimonials)', 'fitcopilot'); ?>
                        </button>
                    </form>
                </p>
            </form>
        </div>
        
        <!-- Carousel Settings Tab -->
        <div id="carousel-settings" class="tab-content fitcopilot-card" style="display: none;">
            <form method="post" action="">
                <?php wp_nonce_field('fitcopilot_carousel_action', 'fitcopilot_carousel_nonce'); ?>
                
                <h2><?php esc_html_e('Carousel Configuration', 'fitcopilot'); ?></h2>
                <p><?php esc_html_e('Configure how the testimonials carousel behaves and appears.', 'fitcopilot'); ?></p>
                
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php esc_html_e('Autoplay', 'fitcopilot'); ?></th>
                        <td>
                            <label>
                                <input type="checkbox" name="autoplay" value="1" <?php checked($carousel_settings['autoplay'], true); ?> />
                                <?php esc_html_e('Enable automatic carousel rotation', 'fitcopilot'); ?>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e('Autoplay Speed', 'fitcopilot'); ?></th>
                        <td>
                            <input type="number" name="autoplay_speed" value="<?php echo esc_attr($carousel_settings['autoplay_speed']); ?>" min="1000" max="10000" step="500" />
                            <p class="description"><?php esc_html_e('Time between slides in milliseconds (1000-10000)', 'fitcopilot'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e('Show Indicators', 'fitcopilot'); ?></th>
                        <td>
                            <label>
                                <input type="checkbox" name="show_indicators" value="1" <?php checked($carousel_settings['show_indicators'], true); ?> />
                                <?php esc_html_e('Show dot indicators below the carousel', 'fitcopilot'); ?>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e('Show Navigation', 'fitcopilot'); ?></th>
                        <td>
                            <label>
                                <input type="checkbox" name="show_navigation" value="1" <?php checked($carousel_settings['show_navigation'], true); ?> />
                                <?php esc_html_e('Show previous/next arrow buttons', 'fitcopilot'); ?>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e('Items Per Page (Desktop)', 'fitcopilot'); ?></th>
                        <td>
                            <select name="items_per_page_desktop">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                    <option value="<?php echo $i; ?>" <?php selected($carousel_settings['items_per_page_desktop'], $i); ?>><?php echo $i; ?></option>
                                <?php endfor; ?>
                            </select>
                            <p class="description"><?php esc_html_e('Number of testimonials visible at once on desktop', 'fitcopilot'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e('Items Per Page (Mobile)', 'fitcopilot'); ?></th>
                        <td>
                            <select name="items_per_page_mobile">
                                <?php for ($i = 1; $i <= 3; $i++): ?>
                                    <option value="<?php echo $i; ?>" <?php selected($carousel_settings['items_per_page_mobile'], $i); ?>><?php echo $i; ?></option>
                                <?php endfor; ?>
                            </select>
                            <p class="description"><?php esc_html_e('Number of testimonials visible at once on mobile devices', 'fitcopilot'); ?></p>
                        </td>
                    </tr>
                </table>
                
                <p class="submit">
                    <input type="submit" 
                           name="fitcopilot_carousel_submit" 
                           id="submit" 
                           class="button button-primary" 
                           value="<?php esc_attr_e('Save Carousel Settings', 'fitcopilot'); ?>" />
                </p>
            </form>
        </div>
        
        <!-- Export/Import Tab -->
        <div id="export-import" class="tab-content fitcopilot-card" style="display: none;">
            <h2><?php esc_html_e('Export / Import Testimonials', 'fitcopilot'); ?></h2>
            <p><?php esc_html_e('Export your testimonials data or import testimonials from a JSON file.', 'fitcopilot'); ?></p>
            
            <div class="export-section">
                <h3><?php esc_html_e('Export Testimonials', 'fitcopilot'); ?></h3>
                <p><?php esc_html_e('Download your current testimonials as a JSON file for backup or migration.', 'fitcopilot'); ?></p>
                <button type="button" class="button export-testimonials-btn">
                    <?php esc_html_e('Export Testimonials', 'fitcopilot'); ?>
                </button>
            </div>
            
            <div class="import-section" style="margin-top: 30px;">
                <h3><?php esc_html_e('Import Testimonials', 'fitcopilot'); ?></h3>
                <p><?php esc_html_e('Import testimonials from a JSON file. This will replace all existing testimonials.', 'fitcopilot'); ?></p>
                <input type="file" id="import-file" accept=".json" style="margin-bottom: 10px;" />
                <br>
                <button type="button" class="button import-testimonials-btn">
                    <?php esc_html_e('Import Testimonials', 'fitcopilot'); ?>
                </button>
            </div>
        </div>
        </div> <!-- Close fitcopilot-admin-container -->
    </div> <!-- Close fitcopilot-testimonials-admin wrap -->
    
    <!-- Hidden template for new testimonial rows -->
    <script type="text/template" id="testimonial-row-template">
        <?php fitcopilot_render_testimonial_row('{{INDEX}}', array(), true); ?>
    </script>
    
    <script>
    jQuery(document).ready(function($) {
        let testimonialIndex = <?php echo count($testimonials_data); ?>;
        
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
        
        // Add new testimonial
        $('.add-testimonial-btn').on('click', function() {
            const template = $('#testimonial-row-template').html();
            const newRow = template.replace(/\{\{INDEX\}\}/g, testimonialIndex);
            $('#testimonials-list').append(newRow);
            testimonialIndex++;
        });
        
        // Remove testimonial
        $(document).on('click', '.remove-testimonial-btn', function() {
            if (confirm('Are you sure you want to remove this testimonial?')) {
                $(this).closest('.testimonial-row').remove();
            }
        });
        
        // Media uploader for avatars
        $(document).on('click', '.upload-avatar-btn', function(e) {
            e.preventDefault();
            
            const targetInput = $(this).data('target');
            const imagePreview = $(this).closest('.avatar-upload').find('.avatar-preview');
            
            const mediaUploader = wp.media({
                title: 'Select Avatar Image',
                button: { text: 'Use this image' },
                multiple: false
            });
            
            mediaUploader.on('select', function() {
                const attachment = mediaUploader.state().get('selection').first().toJSON();
                $('#' + targetInput).val(attachment.url);
                
                if (attachment.url) {
                    imagePreview.html('<img src="' + attachment.url + '" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />');
                }
            });
            
            mediaUploader.open();
        });
        
        // Export testimonials
        $('.export-testimonials-btn').on('click', function() {
            const data = <?php echo json_encode($testimonials_data); ?>;
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fitcopilot-testimonials-' + new Date().toISOString().split('T')[0] + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        
        // Import testimonials
        $('.import-testimonials-btn').on('click', function() {
            const fileInput = document.getElementById('import-file');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select a JSON file first.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (confirm('This will replace all existing testimonials. Are you sure?')) {
                        // Clear existing testimonials
                        $('#testimonials-list').empty();
                        
                        // Add imported testimonials
                        data.forEach(function(testimonial, index) {
                            const template = $('#testimonial-row-template').html();
                            let newRow = template.replace(/\{\{INDEX\}\}/g, index);
                            
                            // Populate with data
                            const $row = $(newRow);
                            $row.find('input[name*="[name]"]').val(testimonial.name || '');
                            $row.find('input[name*="[role]"]').val(testimonial.role || '');
                            $row.find('textarea[name*="[quote]"]').val(testimonial.quote || '');
                            $row.find('input[name*="[avatar]"]').val(testimonial.avatar || '');
                            $row.find('select[name*="[rating]"]').val(testimonial.rating || 5);
                            if (testimonial.active !== false) {
                                $row.find('input[name*="[active]"]').prop('checked', true);
                            }
                            
                            if (testimonial.avatar) {
                                $row.find('.avatar-preview').html('<img src="' + testimonial.avatar + '" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />');
                            }
                            
                            $('#testimonials-list').append($row);
                        });
                        
                        testimonialIndex = data.length;
                        alert('Testimonials imported successfully! Remember to save your changes.');
                    }
                } catch (error) {
                    alert('Invalid JSON file. Please check the file format.');
                }
            };
            reader.readAsText(file);
        });
        
        // Reset to defaults is now handled by form submission
    });
    </script>
    

    <?php
}

/**
 * Render a single testimonial row
 */
function fitcopilot_render_testimonial_row($index, $testimonial = array(), $is_template = false) {
    $testimonial = wp_parse_args($testimonial, array(
        'id' => $index + 1,
        'name' => '',
        'role' => '',
        'quote' => '',
        'avatar' => '',
        'rating' => 5,
        'active' => true
    ));
    
    $index_attr = $is_template ? '{{INDEX}}' : $index;
    ?>
    <div class="testimonial-row" data-index="<?php echo esc_attr($index_attr); ?>">
        <div class="testimonial-row-header">
            <h4><?php echo $is_template ? 'New Testimonial' : sprintf('Testimonial #%d: %s', $index + 1, esc_html($testimonial['name'] ?: 'Unnamed')); ?></h4>
            <button type="button" class="button button-link-delete remove-testimonial-btn">Remove</button>
        </div>
        
        <div class="testimonial-fields">
            <div class="field-group">
                <label><?php esc_html_e('Name', 'fitcopilot'); ?></label>
                <input type="text" name="testimonials[<?php echo $index_attr; ?>][name]" value="<?php echo esc_attr($testimonial['name']); ?>" placeholder="Customer Name" />
                <input type="hidden" name="testimonials[<?php echo $index_attr; ?>][id]" value="<?php echo esc_attr($testimonial['id']); ?>" />
            </div>
            
            <div class="field-group">
                <label><?php esc_html_e('Role/Title', 'fitcopilot'); ?></label>
                <input type="text" name="testimonials[<?php echo $index_attr; ?>][role]" value="<?php echo esc_attr($testimonial['role']); ?>" placeholder="Job Title or Role" />
            </div>
            
            <div class="field-group quote-field">
                <label><?php esc_html_e('Testimonial Quote', 'fitcopilot'); ?></label>
                <textarea name="testimonials[<?php echo $index_attr; ?>][quote]" placeholder="Enter the testimonial quote..."><?php echo esc_textarea($testimonial['quote']); ?></textarea>
            </div>
            
            <div class="field-group">
                <label><?php esc_html_e('Avatar Image', 'fitcopilot'); ?></label>
                <div class="avatar-upload">
                    <div class="avatar-preview">
                        <?php if ($testimonial['avatar']): ?>
                            <img src="<?php echo esc_url($testimonial['avatar']); ?>" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />
                        <?php else: ?>
                            <?php esc_html_e('No Image', 'fitcopilot'); ?>
                        <?php endif; ?>
                    </div>
                    <input type="url" name="testimonials[<?php echo $index_attr; ?>][avatar]" id="avatar_<?php echo $index_attr; ?>" value="<?php echo esc_attr($testimonial['avatar']); ?>" placeholder="Image URL" />
                    <button type="button" class="button upload-avatar-btn" data-target="avatar_<?php echo $index_attr; ?>">
                        <?php esc_html_e('Upload', 'fitcopilot'); ?>
                    </button>
                </div>
            </div>
            
            <div class="field-group">
                <label><?php esc_html_e('Rating', 'fitcopilot'); ?></label>
                <select name="testimonials[<?php echo $index_attr; ?>][rating]">
                    <?php for ($i = 1; $i <= 5; $i++): ?>
                        <option value="<?php echo $i; ?>" <?php selected($testimonial['rating'], $i); ?>><?php echo $i; ?> Star<?php echo $i > 1 ? 's' : ''; ?></option>
                    <?php endfor; ?>
                </select>
            </div>
        </div>
        
        <div class="testimonial-controls">
            <div class="active-toggle">
                <input type="checkbox" name="testimonials[<?php echo $index_attr; ?>][active]" value="1" <?php checked($testimonial['active'], true); ?> id="active_<?php echo $index_attr; ?>" />
                <label for="active_<?php echo $index_attr; ?>"><?php esc_html_e('Active (show in carousel)', 'fitcopilot'); ?></label>
            </div>
        </div>
    </div>
    <?php
}

/**
 * Enqueue CSS and scripts for the testimonials admin page
 */
function fitcopilot_testimonials_manager_admin_scripts($hook) {
    if ('fitcopilot_page_fitcopilot-testimonials' !== $hook) {
        return;
    }
    
    // Enqueue CSS files in proper order
    wp_enqueue_style(
        'fitcopilot-testimonials-base',
        get_template_directory_uri() . '/assets/admin/css/testimonials-base.css',
        array(),
        filemtime(get_template_directory() . '/assets/admin/css/testimonials-base.css')
    );
    
    wp_enqueue_style(
        'fitcopilot-testimonials-grid',
        get_template_directory_uri() . '/assets/admin/css/testimonials-grid.css',
        array('fitcopilot-testimonials-base'),
        filemtime(get_template_directory() . '/assets/admin/css/testimonials-grid.css')
    );
    
    wp_enqueue_style(
        'fitcopilot-testimonials-theme',
        get_template_directory_uri() . '/assets/admin/css/testimonials-theme.css',
        array('fitcopilot-testimonials-base', 'fitcopilot-testimonials-grid'),
        filemtime(get_template_directory() . '/assets/admin/css/testimonials-theme.css')
    );
    
    // Enqueue JavaScript
    wp_enqueue_media();
    wp_enqueue_script('jquery');
}
add_action('admin_enqueue_scripts', 'fitcopilot_testimonials_manager_admin_scripts');

/**
 * Provide testimonials data to frontend components
 */
function fitcopilot_provide_testimonials_data_for_frontend() {
    // Get testimonials settings
    $testimonials_data = get_option('fitcopilot_testimonials_data', fitcopilot_get_default_testimonials());
    $carousel_settings = get_option('fitcopilot_testimonials_carousel_settings', array(
        'autoplay' => false,
        'autoplay_speed' => 3000,
        'show_indicators' => true,
        'show_navigation' => true,
        'items_per_page_desktop' => 3,
        'items_per_page_mobile' => 1
    ));
    
    // Filter only active testimonials
    $active_testimonials = array_filter($testimonials_data, function($testimonial) {
        return !empty($testimonial['active']);
    });
    
    // Format the data for frontend
    $testimonials_frontend_data = array(
        'testimonials' => array_values($active_testimonials),
        'carousel' => $carousel_settings
    );
    
    // Add debug logging
    error_log('FitCopilot: Testimonials data from admin: ' . json_encode($testimonials_frontend_data));
    
    // Localize the script
    wp_localize_script(
        'fitcopilot-homepage', // Handle of your main React script
        'fitcopilotTestimonialsData',
        $testimonials_frontend_data
    );
    
    // Also include in athleteDashboardData if it exists
    $athlete_dashboard_data = array();
    
    // Get existing data if already localized
    $existing_data = wp_scripts()->get_data('athlete-dashboard-script', 'data');
    if ($existing_data) {
        // Extract the JSON part from the inline script
        preg_match('/var\s+athleteDashboardData\s*=\s*(\{.*?\});/s', $existing_data, $matches);
        if (!empty($matches[1])) {
            $athlete_dashboard_data = json_decode($matches[1], true) ?: array();
        }
    }
    
    // Add testimonials data to athleteDashboardData
    if (!isset($athlete_dashboard_data['wpData'])) {
        $athlete_dashboard_data['wpData'] = array();
    }
    
    $athlete_dashboard_data['wpData']['testimonialsData'] = $testimonials_frontend_data;
    
    // Update the athlete dashboard data
    wp_localize_script(
        'athlete-dashboard-script',
        'athleteDashboardData',
        $athlete_dashboard_data
    );
    
    // Debug output to console
    wp_add_inline_script('fitcopilot-homepage', "console.log('Testimonials data loaded:', fitcopilotTestimonialsData);", 'after');
}
add_action('wp_enqueue_scripts', 'fitcopilot_provide_testimonials_data_for_frontend', 20);