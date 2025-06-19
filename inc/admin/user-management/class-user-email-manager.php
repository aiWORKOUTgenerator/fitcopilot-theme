<?php
/**
 * FitCopilot User Email Manager
 *
 * Handles email communications for user registration and management
 * Integrates with WordPress email system and user management
 *
 * @package FitCopilot
 * @subpackage UserManagement
 * @since 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * User Email Manager Class
 */
class FitCopilot_User_Email_Manager {

    /**
     * Email templates directory
     */
    const TEMPLATES_DIR = 'inc/admin/user-management/email-templates/';

    /**
     * Default from email name
     */
    const FROM_NAME = 'FitCopilot';

    /**
     * Initialize email manager
     */
    public function init() {
        // Set up WordPress email filters
        add_filter('wp_mail_from_name', array($this, 'set_from_name'));
        add_filter('wp_mail_content_type', array($this, 'set_content_type'));
    }

    /**
     * Send welcome email to new user
     *
     * @param int $user_id WordPress user ID
     * @param string $email User email address
     * @return bool Success status
     */
    public function send_welcome_email($user_id, $email) {
        $user = get_userdata($user_id);
        if (!$user) {
            error_log("FitCopilot Email: User not found for ID {$user_id}");
            return false;
        }

        // Get user's FitCopilot data
        if (function_exists('fitcopilot_get_user_data')) {
            $user_data = fitcopilot_get_user_data($user_id);
        } else {
            // Fallback to basic WordPress user data
            $user_data = array(
                'firstName' => $user->first_name ?: 'Valued Client',
                'lastName' => $user->last_name ?: '',
                'clientType' => get_user_meta($user_id, 'fitcopilot_client_type', true) ?: 'new',
                'experienceLevel' => get_user_meta($user_id, 'fitcopilot_experience_level', true) ?: 'beginner',
                'registrationDate' => $user->user_registered
            );
        }
        
        if (!$user_data) {
            error_log("FitCopilot Email: Could not get user data for ID {$user_id}");
            return false;
        }

        // Prepare email data
        $email_data = array(
            'user_id' => $user_id,
            'email' => $email,
            'first_name' => $user_data['firstName'],
            'last_name' => $user_data['lastName'],
            'client_type' => $user_data['clientType'],
            'experience_level' => $user_data['experienceLevel'],
            'registration_date' => $user_data['registrationDate'],
            'login_url' => wp_login_url(),
            'calendar_url' => home_url('/#training-calendar'),
            'profile_url' => home_url('/my-profile/'),
            'contact_url' => home_url('/contact/'),
            'site_name' => get_bloginfo('name'),
            'site_url' => home_url(),
            'support_email' => get_option('admin_email')
        );

        // Get email template
        $subject = $this->get_welcome_email_subject($email_data);
        $message = $this->get_welcome_email_content($email_data);

        if (!$message) {
            error_log("FitCopilot Email: Could not generate welcome email content");
            return false;
        }

        // Send email
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . self::FROM_NAME . ' <' . get_option('admin_email') . '>'
        );

        $sent = wp_mail($email, $subject, $message, $headers);

        // Log email sending
        if ($sent) {
            // Update user meta to track welcome email
            update_user_meta($user_id, 'fitcopilot_welcome_email_sent', current_time('mysql'));
            error_log("FitCopilot Email: Welcome email sent successfully to {$email}");
        } else {
            error_log("FitCopilot Email: Failed to send welcome email to {$email}");
        }

        return $sent;
    }

    /**
     * Send booking confirmation email
     *
     * @param int $user_id WordPress user ID
     * @param array $event_data Event/booking data
     * @return bool Success status
     */
    public function send_booking_confirmation($user_id, $event_data) {
        $user = get_userdata($user_id);
        if (!$user) {
            return false;
        }

        $email_data = array(
            'user_id' => $user_id,
            'email' => $user->user_email,
            'first_name' => $user->first_name,
            'event_title' => $event_data['title'] ?? 'Training Session',
            'event_date' => $event_data['start'] ?? '',
            'event_time' => $event_data['start'] ?? '',
            'trainer_name' => $event_data['trainer_name'] ?? 'Your Trainer',
            'location' => $event_data['location'] ?? 'Virtual Session',
            'duration' => $event_data['duration'] ?? '60 minutes',
            'special_instructions' => $event_data['special_instructions'] ?? '',
            'calendar_url' => home_url('/#training-calendar'),
            'contact_url' => home_url('/contact/'),
            'site_name' => get_bloginfo('name')
        );

        $subject = $this->get_booking_confirmation_subject($email_data);
        $message = $this->get_booking_confirmation_content($email_data);

        if (!$message) {
            return false;
        }

        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . self::FROM_NAME . ' <' . get_option('admin_email') . '>'
        );

        $sent = wp_mail($user->user_email, $subject, $message, $headers);

        if ($sent) {
            error_log("FitCopilot Email: Booking confirmation sent to {$user->user_email}");
        }

        return $sent;
    }

    /**
     * Send password reset email
     *
     * @param int $user_id WordPress user ID
     * @param string $reset_key Password reset key
     * @return bool Success status
     */
    public function send_password_reset($user_id, $reset_key) {
        $user = get_userdata($user_id);
        if (!$user) {
            return false;
        }

        $reset_url = network_site_url("wp-login.php?action=rp&key={$reset_key}&login=" . rawurlencode($user->user_login), 'login');

        $email_data = array(
            'user_id' => $user_id,
            'email' => $user->user_email,
            'first_name' => $user->first_name,
            'username' => $user->user_login,
            'reset_url' => $reset_url,
            'site_name' => get_bloginfo('name'),
            'contact_url' => home_url('/contact/')
        );

        $subject = "Reset Your {$email_data['site_name']} Password";
        $message = $this->get_password_reset_content($email_data);

        if (!$message) {
            return false;
        }

        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . self::FROM_NAME . ' <' . get_option('admin_email') . '>'
        );

        return wp_mail($user->user_email, $subject, $message, $headers);
    }

    /**
     * Get welcome email subject
     *
     * @param array $data Email data
     * @return string Subject
     */
    private function get_welcome_email_subject($data) {
        $subject = "Welcome to {$data['site_name']}, {$data['first_name']}!";
        return apply_filters('fitcopilot_welcome_email_subject', $subject, $data);
    }

    /**
     * Get welcome email content
     *
     * @param array $data Email data
     * @return string|false Email content or false on failure
     */
    private function get_welcome_email_content($data) {
        // Try to load custom template first
        $template_path = get_template_directory() . '/' . self::TEMPLATES_DIR . 'welcome-email.php';
        
        if (file_exists($template_path)) {
            ob_start();
            extract($data);
            include $template_path;
            $content = ob_get_clean();
            
            if (!empty($content)) {
                return $content;
            }
        }

        // Fallback to built-in template
        return $this->get_default_welcome_email($data);
    }

    /**
     * Get booking confirmation subject
     *
     * @param array $data Email data
     * @return string Subject
     */
    private function get_booking_confirmation_subject($data) {
        $subject = "Your {$data['event_title']} is Confirmed!";
        return apply_filters('fitcopilot_booking_confirmation_subject', $subject, $data);
    }

    /**
     * Get booking confirmation content
     *
     * @param array $data Email data
     * @return string|false Email content or false on failure
     */
    private function get_booking_confirmation_content($data) {
        $template_path = get_template_directory() . '/' . self::TEMPLATES_DIR . 'booking-confirmation.php';
        
        if (file_exists($template_path)) {
            ob_start();
            extract($data);
            include $template_path;
            $content = ob_get_clean();
            
            if (!empty($content)) {
                return $content;
            }
        }

        return $this->get_default_booking_confirmation($data);
    }

    /**
     * Get password reset content
     *
     * @param array $data Email data
     * @return string|false Email content or false on failure
     */
    private function get_password_reset_content($data) {
        $template_path = get_template_directory() . '/' . self::TEMPLATES_DIR . 'password-reset.php';
        
        if (file_exists($template_path)) {
            ob_start();
            extract($data);
            include $template_path;
            $content = ob_get_clean();
            
            if (!empty($content)) {
                return $content;
            }
        }

        return $this->get_default_password_reset($data);
    }

    /**
     * Default welcome email template
     *
     * @param array $data Email data
     * @return string Email HTML
     */
    private function get_default_welcome_email($data) {
        $experience_messages = array(
            'beginner' => 'Perfect for those just starting their fitness journey!',
            'intermediate' => 'Great for building on your existing fitness foundation!',
            'advanced' => 'Excellent for pushing your limits and achieving new goals!',
            'professional' => 'Ideal for elite-level training and performance optimization!'
        );

        $experience_message = $experience_messages[$data['experience_level']] ?? 'Perfect for your fitness journey!';

        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ' . esc_html($data['site_name']) . '</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
                .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
                .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
                .highlight { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; }
                .stats { display: flex; gap: 20px; margin: 20px 0; }
                .stat { flex: 1; text-align: center; padding: 15px; background: #f8fafc; border-radius: 6px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Welcome to ' . esc_html($data['site_name']) . '!</h1>
                <p>Hi ' . esc_html($data['first_name']) . ', your fitness journey starts here</p>
            </div>
            
            <div class="content">
                <h2>🎉 Account Successfully Created!</h2>
                <p>Congratulations! Your FitCopilot account has been created successfully. We\'re excited to help you achieve your fitness goals.</p>
                
                <div class="highlight">
                    <h3>Your Profile Summary</h3>
                    <p><strong>Experience Level:</strong> ' . esc_html(ucfirst($data['experience_level'])) . '</p>
                    <p><strong>Client Type:</strong> ' . esc_html(ucfirst($data['client_type'])) . '</p>
                    <p>' . esc_html($experience_message) . '</p>
                </div>
                
                <h3>🚀 What\'s Next?</h3>
                <p>Here\'s how to get started with your FitCopilot journey:</p>
                
                <div class="stats">
                    <div class="stat">
                        <h4>📅 Schedule</h4>
                        <p>Book your first session</p>
                    </div>
                    <div class="stat">
                        <h4>👤 Profile</h4>
                        <p>Complete your profile</p>
                    </div>
                    <div class="stat">
                        <h4>🎯 Goals</h4>
                        <p>Set your fitness targets</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="' . esc_url($data['calendar_url']) . '" class="button">📅 View Training Calendar</a>
                    <a href="' . esc_url($data['profile_url']) . '" class="button">👤 Complete Profile</a>
                </div>
                
                <h3>💡 Quick Tips for Success</h3>
                <ul>
                    <li><strong>Schedule Regular Sessions:</strong> Consistency is key to achieving your fitness goals</li>
                    <li><strong>Set Clear Goals:</strong> Complete your profile with specific fitness objectives</li>
                    <li><strong>Communicate with Trainers:</strong> Share any concerns or preferences during sessions</li>
                    <li><strong>Track Progress:</strong> Use our tools to monitor your fitness journey</li>
                </ul>
                
                <div class="highlight">
                    <h3>🆓 Your Free Consultation</h3>
                    <p>As a new member, you\'re entitled to a <strong>FREE 20-minute consultation</strong> to discuss your goals and create a personalized plan.</p>
                    <div style="text-align: center;">
                        <a href="' . esc_url($data['calendar_url']) . '" class="button">Book Free Consultation</a>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Need Help?</strong></p>
                <p>Have questions? We\'re here to help!</p>
                <p>
                    <a href="' . esc_url($data['contact_url']) . '">Contact Support</a> | 
                    <a href="' . esc_url($data['site_url']) . '">Visit Website</a>
                </p>
                <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
                    This email was sent to ' . esc_html($data['email']) . ' because you created an account with ' . esc_html($data['site_name']) . '.<br>
                    Registration Date: ' . esc_html(date('F j, Y', strtotime($data['registration_date']))) . '
                </p>
            </div>
        </body>
        </html>';

        return $html;
    }

    /**
     * Default booking confirmation template
     *
     * @param array $data Email data
     * @return string Email HTML
     */
    private function get_default_booking_confirmation($data) {
        $event_date = date('l, F j, Y', strtotime($data['event_date']));
        $event_time = date('g:i A', strtotime($data['event_time']));

        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmed</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
                .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
                .booking-details { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
                .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>✅ Booking Confirmed!</h1>
                <p>Hi ' . esc_html($data['first_name']) . ', your session is all set</p>
            </div>
            
            <div class="content">
                <h2>Your Training Session Details</h2>
                
                <div class="booking-details">
                    <h3>' . esc_html($data['event_title']) . '</h3>
                    <p><strong>📅 Date:</strong> ' . esc_html($event_date) . '</p>
                    <p><strong>🕒 Time:</strong> ' . esc_html($event_time) . '</p>
                    <p><strong>👨‍💼 Trainer:</strong> ' . esc_html($data['trainer_name']) . '</p>
                    <p><strong>📍 Location:</strong> ' . esc_html($data['location']) . '</p>
                    <p><strong>⏱️ Duration:</strong> ' . esc_html($data['duration']) . '</p>
                </div>
                
                ' . (!empty($data['special_instructions']) ? '<div class="booking-details"><h3>📝 Special Instructions</h3><p>' . esc_html($data['special_instructions']) . '</p></div>' : '') . '
                
                <h3>📋 Before Your Session</h3>
                <ul>
                    <li>Arrive 5-10 minutes early for virtual sessions to test your connection</li>
                    <li>Have water and a towel ready</li>
                    <li>Wear comfortable workout attire</li>
                    <li>Prepare any questions you\'d like to discuss with your trainer</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="' . esc_url($data['calendar_url']) . '" class="button">📅 View Full Calendar</a>
                    <a href="' . esc_url($data['contact_url']) . '" class="button">📞 Contact Support</a>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Need to make changes?</strong></p>
                <p>Please contact us at least 24 hours before your session for cancellations or rescheduling.</p>
                <p><a href="' . esc_url($data['contact_url']) . '">Contact Support</a></p>
            </div>
        </body>
        </html>';

        return $html;
    }

    /**
     * Default password reset template
     *
     * @param array $data Email data
     * @return string Email HTML
     */
    private function get_default_password_reset($data) {
        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
                .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
                .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
                .warning { background: #fef3cd; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🔐 Password Reset Request</h1>
                <p>Hi ' . esc_html($data['first_name']) . ', reset your password</p>
            </div>
            
            <div class="content">
                <h2>Reset Your Password</h2>
                <p>We received a request to reset the password for your ' . esc_html($data['site_name']) . ' account.</p>
                
                <p><strong>Username:</strong> ' . esc_html($data['username']) . '</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="' . esc_url($data['reset_url']) . '" class="button">🔐 Reset Password</a>
                </div>
                
                <div class="warning">
                    <h3>⚠️ Security Notice</h3>
                    <p>This password reset link will expire in 24 hours for security reasons.</p>
                    <p>If you didn\'t request this password reset, please ignore this email.</p>
                </div>
                
                <p>If the button above doesn\'t work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
                    ' . esc_url($data['reset_url']) . '
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Need Help?</strong></p>
                <p>If you\'re having trouble resetting your password, please contact our support team.</p>
                <p><a href="' . esc_url($data['contact_url']) . '">Contact Support</a></p>
            </div>
        </body>
        </html>';

        return $html;
    }

    /**
     * Set from name for WordPress emails
     *
     * @param string $from_name Current from name
     * @return string Modified from name
     */
    public function set_from_name($from_name) {
        return self::FROM_NAME;
    }

    /**
     * Set content type to HTML
     *
     * @return string Content type
     */
    public function set_content_type() {
        return 'text/html';
    }
} 