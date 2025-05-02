<?php
/**
 * FitCopilot Video Manager Admin Page
 * 
 * Provides admin interface for managing videos across different sections of the site
 * 
 * @package FitCopilot
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the Video Manager admin page
 */
function fitcopilot_register_video_manager_page() {
    add_submenu_page(
        'fitcopilot-dashboard',         // Parent slug (under Fitcopilot main menu)
        'Video Manager',                // Page title
        'Video Manager',                // Menu title
        'manage_options',               // Capability required
        'fitcopilot-video-manager',     // Menu slug
        'fitcopilot_render_video_manager_page' // Callback function
    );
}
add_action('admin_menu', 'fitcopilot_register_video_manager_page');

/**
 * Register settings for videos
 */
function fitcopilot_register_video_settings() {
    // Register Personal Training section settings
    register_setting(
        'fitcopilot_video_options',
        'fitcopilot_personal_training_videos',
        array(
            'type'              => 'array',
            'sanitize_callback' => 'fitcopilot_sanitize_video_settings',
            'default'           => array(
                'featured_trainer_video' => array(
                    'url'   => '',
                    'title' => 'Training Demo',
                    'image' => ''
                )
            )
        )
    );
}
add_action('admin_init', 'fitcopilot_register_video_settings');

/**
 * Sanitize video settings data
 * 
 * @param array $input The raw settings data
 * @return array Sanitized settings data
 */
function fitcopilot_sanitize_video_settings($input) {
    $sanitized_input = array();
    
    // Sanitize featured trainer video data
    if (isset($input['featured_trainer_video'])) {
        $featured_trainer = $input['featured_trainer_video'];
        
        $sanitized_input['featured_trainer_video'] = array(
            'url'   => esc_url_raw($featured_trainer['url'] ?? ''),
            'title' => sanitize_text_field($featured_trainer['title'] ?? ''),
            'image' => esc_url_raw($featured_trainer['image'] ?? '')
        );
    }
    
    return $sanitized_input;
}

/**
 * Render the Video Manager admin page
 */
function fitcopilot_render_video_manager_page() {
    // Get saved options
    $video_options = get_option('fitcopilot_personal_training_videos', array(
        'featured_trainer_video' => array(
            'url'   => '',
            'title' => 'Training Demo',
            'image' => ''
        )
    ));
    
    // Default values
    $featured_trainer_video = $video_options['featured_trainer_video'] ?? array(
        'url'   => '',
        'title' => 'Training Demo',
        'image' => ''
    );
    
    // Handle form submission
    if (isset($_POST['fitcopilot_video_manager_submit'])) {
        check_admin_referer('fitcopilot_video_manager_action', 'fitcopilot_video_manager_nonce');
        
        $video_options['featured_trainer_video'] = array(
            'url'   => esc_url_raw($_POST['featured_trainer_video_url'] ?? ''),
            'title' => sanitize_text_field($_POST['featured_trainer_video_title'] ?? ''),
            'image' => esc_url_raw($_POST['featured_trainer_video_image'] ?? '')
        );
        
        update_option('fitcopilot_personal_training_videos', $video_options);
        
        echo '<div class="notice notice-success"><p>Video settings updated successfully!</p></div>';
        
        // Update values after save
        $featured_trainer_video = $video_options['featured_trainer_video'];
    }
    ?>
    <div class="wrap">
        <div class="fitcopilot-admin-header">
            <div class="fitcopilot-admin-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.75 3.03v.41c0 .98.75 1.56 1.72 1.56H16V3.75a.75.75 0 1 1 1.5 0v1.41l1.72.78c.45.2.72.64.72 1.12V21a1.5 1.5 0 0 1-1.5 1.5h-13.5a1.5 1.5 0 0 1-1.5-1.5V7.06c0-.48.27-.93.72-1.12l6.05-2.72c.38-.17.82-.17 1.2 0l.2.09zm-.22 1.72a.75.75 0 0 0-.99.7v16.05h10.22V7.38l-1.72-.78V8.4c0 .98-.75 1.56-1.72 1.56H14.3a1.5 1.5 0 0 1-1.28-.72l-.22-.32V4.75Z"/></svg>
            </div>
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        </div>
        
        <div class="nav-tab-wrapper">
            <a href="#personal-training" class="nav-tab nav-tab-active"><?php esc_html_e('Personal Training Section', 'fitcopilot'); ?></a>
            <a href="#future-section" class="nav-tab"><?php esc_html_e('Future Sections', 'fitcopilot'); ?></a>
        </div>
        
        <div id="personal-training" class="tab-content fitcopilot-card">
            <form method="post" action="">
                <?php wp_nonce_field('fitcopilot_video_manager_action', 'fitcopilot_video_manager_nonce'); ?>
                
                <h2><?php esc_html_e('Featured Trainer Video', 'fitcopilot'); ?></h2>
                <p><?php esc_html_e('Configure the video shown in the featured trainer card in the Personal Training section.', 'fitcopilot'); ?></p>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="featured_trainer_video_url"><?php esc_html_e('Video URL', 'fitcopilot'); ?></label>
                        </th>
                        <td>
                            <input type="url" 
                                   name="featured_trainer_video_url" 
                                   id="featured_trainer_video_url" 
                                   class="regular-text" 
                                   value="<?php echo esc_attr($featured_trainer_video['url']); ?>" 
                                   placeholder="https://www.youtube.com/embed/VIDEO_ID" />
                            <p class="description">
                                <?php esc_html_e('Enter a YouTube embed URL (https://www.youtube.com/embed/VIDEO_ID) or a direct video file URL (.mp4, .webm)', 'fitcopilot'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="featured_trainer_video_title"><?php esc_html_e('Video Title', 'fitcopilot'); ?></label>
                        </th>
                        <td>
                            <input type="text" 
                                   name="featured_trainer_video_title" 
                                   id="featured_trainer_video_title" 
                                   class="regular-text" 
                                   value="<?php echo esc_attr($featured_trainer_video['title']); ?>" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="featured_trainer_video_image"><?php esc_html_e('Poster Image', 'fitcopilot'); ?></label>
                        </th>
                        <td>
                            <div class="image-preview-wrapper">
                                <?php if (!empty($featured_trainer_video['image'])): ?>
                                    <img src="<?php echo esc_url($featured_trainer_video['image']); ?>" alt="<?php esc_attr_e('Preview', 'fitcopilot'); ?>" style="max-width: 150px; height: auto;" />
                                <?php endif; ?>
                            </div>
                            <input type="url" 
                                   name="featured_trainer_video_image" 
                                   id="featured_trainer_video_image" 
                                   class="regular-text" 
                                   value="<?php echo esc_attr($featured_trainer_video['image']); ?>" />
                            <button type="button" class="button media-upload-btn" data-target="featured_trainer_video_image">
                                <?php esc_html_e('Select Image', 'fitcopilot'); ?>
                            </button>
                            <p class="description">
                                <?php esc_html_e('Select a poster image to display before the video plays', 'fitcopilot'); ?>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <p class="submit">
                    <input type="submit" 
                           name="fitcopilot_video_manager_submit" 
                           id="submit" 
                           class="button button-primary" 
                           value="<?php esc_attr_e('Save Changes', 'fitcopilot'); ?>" />
                </p>
            </form>
        </div>
        
        <div id="future-section" class="tab-content fitcopilot-card" style="display: none;">
            <h2><?php esc_html_e('Future Sections', 'fitcopilot'); ?></h2>
            <p><?php esc_html_e('Additional video configuration options for other sections will be added here.', 'fitcopilot'); ?></p>
        </div>
    </div>
    
    <script>
    jQuery(document).ready(function($) {
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
        
        // Media uploader for selecting images
        $('.media-upload-btn').on('click', function(e) {
            e.preventDefault();
            
            var targetInput = $(this).data('target');
            var imagePreview = $(this).closest('td').find('.image-preview-wrapper');
            
            var mediaUploader = wp.media({
                title: 'Select Image',
                button: {
                    text: 'Use this image'
                },
                multiple: false
            });
            
            mediaUploader.on('select', function() {
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                $('#' + targetInput).val(attachment.url);
                
                // Update preview
                if (attachment.url) {
                    if (imagePreview.find('img').length === 0) {
                        imagePreview.html('<img src="' + attachment.url + '" alt="Preview" style="max-width: 150px; height: auto;" />');
                    } else {
                        imagePreview.find('img').attr('src', attachment.url);
                    }
                }
            });
            
            mediaUploader.open();
        });
    });
    </script>
    
    <style>
    .fitcopilot-admin-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .fitcopilot-admin-logo {
        margin-right: 15px;
        width: 40px;
        height: 40px;
    }
    
    .fitcopilot-admin-logo svg {
        width: 100%;
        height: 100%;
        fill: #2271b1;
    }
    
    .tab-content {
        margin-top: 20px;
        background: #fff;
        padding: 20px;
        border: 1px solid #ccd0d4;
        box-shadow: 0 1px 1px rgba(0,0,0,.04);
    }
    
    .image-preview-wrapper {
        margin-bottom: 10px;
    }
    
    .fitcopilot-card {
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 1px rgba(0,0,0,.04);
        margin-bottom: 20px;
        border: 1px solid #ccd0d4;
    }
    </style>
    <?php
}

/**
 * Enqueue necessary scripts for the admin page
 */
function fitcopilot_video_manager_admin_scripts($hook) {
    if ('fitcopilot_page_fitcopilot-video-manager' !== $hook) {
        return;
    }
    
    wp_enqueue_media();
    wp_enqueue_script('jquery');
}
add_action('admin_enqueue_scripts', 'fitcopilot_video_manager_admin_scripts');

/**
 * Provide video data to frontend components
 */
function fitcopilot_provide_video_data_for_frontend() {
    // Get video settings
    $video_options = get_option('fitcopilot_personal_training_videos', array(
        'featured_trainer_video' => array(
            'url'   => '',
            'title' => 'Training Demo',
            'image' => ''
        )
    ));
    
    // Format the data for frontend
    $video_data = array(
        'personalTraining' => array(
            'featuredTrainer' => array(
                'url'   => $video_options['featured_trainer_video']['url'],
                'title' => $video_options['featured_trainer_video']['title'],
                'image' => $video_options['featured_trainer_video']['image']
            )
        )
    );
    
    // Add debug logging
    error_log('FitCopilot: Video data from admin: ' . json_encode($video_data));
    
    // Always localize the script, even if data is empty
    wp_localize_script(
        'fitcopilot-react-jsx', // Handle of your main React script
        'fitcopilotVideoData',
        $video_data
    );
    
    // Also include the data in athleteDashboardData if it exists
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
    
    // Add video data to athleteDashboardData
    if (!isset($athlete_dashboard_data['wpData'])) {
        $athlete_dashboard_data['wpData'] = array();
    }
    
    $athlete_dashboard_data['wpData']['videoData'] = $video_data;
    
    // Update the athlete dashboard data
    wp_localize_script(
        'athlete-dashboard-script',
        'athleteDashboardData',
        $athlete_dashboard_data
    );
    
    // Also provide directly to main script
    wp_localize_script(
        'fitcopilot-main-script',
        'fitcopilotVideoData',
        $video_data
    );
    
    // Debug output to console
    wp_add_inline_script('fitcopilot-react-jsx', "console.log('Video data loaded:', fitcopilotVideoData);", 'after');
    
    // Debug output for athlete dashboard data
    wp_add_inline_script('athlete-dashboard-script', "console.log('Athlete dashboard data:', athleteDashboardData);", 'after');
}
add_action('wp_enqueue_scripts', 'fitcopilot_provide_video_data_for_frontend', 20); 