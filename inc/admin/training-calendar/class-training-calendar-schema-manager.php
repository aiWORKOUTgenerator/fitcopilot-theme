<?php
/**
 * Training Calendar Schema Manager
 * 
 * Manages database schema updates and initialization for Training Calendar
 * Integrates with existing Training Calendar Manager for seamless operation
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Training Calendar Schema Manager Class
 */
class FitCopilot_Training_Calendar_Schema_Manager {
    
    /**
     * Schema instance
     * @var FitCopilot_Training_Calendar_Schema
     */
    private $schema;
    
    /**
     * Constructor
     */
    public function __construct() {
        // Include schema class
        require_once __DIR__ . '/schema/database-schema.php';
        $this->schema = new FitCopilot_Training_Calendar_Schema();
        
        // Initialize hooks
        $this->init_hooks();
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Run schema update on admin init
        add_action('admin_init', array($this, 'maybe_update_schema'));
        
        // Add admin notice for schema updates
        add_action('admin_notices', array($this, 'schema_update_notice'));
        
        // AJAX handler for manual schema update
        add_action('wp_ajax_training_calendar_update_schema', array($this, 'ajax_update_schema'));
    }
    
    /**
     * Maybe update schema if needed
     */
    public function maybe_update_schema() {
        // Only run on Training Calendar admin pages
        if (!$this->is_training_calendar_page()) {
            return;
        }
        
        // Check if update is needed
        if (!$this->schema::needs_update()) {
            return;
        }
        
        // Don't auto-update in production - require manual trigger
        if (defined('WP_ENV') && WP_ENV === 'production') {
            return;
        }
        
        // Auto-update in development
        $this->update_schema();
    }
    
    /**
     * Update database schema
     * 
     * @return bool Update success
     */
    public function update_schema() {
        // Check if original tables exist first
        if (!$this->has_existing_tables()) {
            // Fresh installation - create new schema
            return $this->schema->create_fresh_schema();
        } else {
            // Update existing schema
            return $this->schema->update_schema();
        }
    }
    
    /**
     * Check if this is a Training Calendar admin page
     * 
     * @return bool
     */
    private function is_training_calendar_page() {
        $screen = get_current_screen();
        
        if (!$screen) {
            return false;
        }
        
        return strpos($screen->id, 'training-calendar') !== false ||
               strpos($screen->id, 'personal-training') !== false;
    }
    
    /**
     * Check if existing tables are present
     * 
     * @return bool
     */
    private function has_existing_tables() {
        global $wpdb;
        
        $availability_table = $wpdb->prefix . 'training_calendar_availability';
        return $wpdb->get_var("SHOW TABLES LIKE '{$availability_table}'") === $availability_table;
    }
    
    /**
     * Show admin notice for schema updates
     */
    public function schema_update_notice() {
        if (!$this->is_training_calendar_page()) {
            return;
        }
        
        $status = $this->schema::get_status();
        
        if ($status['needs_update']) {
            $this->show_update_needed_notice($status);
        } elseif ($status['status'] === 'complete') {
            $this->show_update_complete_notice($status);
        }
    }
    
    /**
     * Show update needed notice
     * 
     * @param array $status Schema status
     */
    private function show_update_needed_notice($status) {
        ?>
        <div class="notice notice-warning is-dismissible">
            <h3>🔄 Training Calendar Database Update Required</h3>
            <p>
                <strong>Database Schema Update:</strong> 
                Version <?php echo esc_html($status['current_version']); ?> → 
                <?php echo esc_html($status['target_version']); ?>
            </p>
            <p>
                <strong>New Features:</strong> Event Type → Trainer assignments, improved availability management
            </p>
            <p>
                <button type="button" id="update-training-calendar-schema" class="button button-primary">
                    Update Database Schema
                </button>
                <button type="button" id="show-schema-details" class="button button-secondary">
                    View Details
                </button>
            </p>
            <div id="schema-update-status" style="display: none; margin-top: 10px;"></div>
        </div>
        
        <script>
        jQuery(document).ready(function($) {
            $('#update-training-calendar-schema').on('click', function() {
                var $button = $(this);
                var $status = $('#schema-update-status');
                
                $button.prop('disabled', true).text('Updating...');
                $status.show().html('<p>⏳ Updating database schema...</p>');
                
                $.ajax({
                    url: ajaxurl,
                    method: 'POST',
                    data: {
                        action: 'training_calendar_update_schema',
                        nonce: '<?php echo wp_create_nonce('training_calendar_schema_update'); ?>'
                    },
                    success: function(response) {
                        if (response.success) {
                            $status.html('<p style="color: green;">✅ Schema updated successfully!</p>');
                            setTimeout(function() {
                                location.reload();
                            }, 2000);
                        } else {
                            $status.html('<p style="color: red;">❌ Update failed: ' + (response.data.message || 'Unknown error') + '</p>');
                            $button.prop('disabled', false).text('Retry Update');
                        }
                    },
                    error: function() {
                        $status.html('<p style="color: red;">❌ Update failed: Network error</p>');
                        $button.prop('disabled', false).text('Retry Update');
                    }
                });
            });
            
            $('#show-schema-details').on('click', function() {
                var details = `
                    <div style="background: #f9f9f9; padding: 15px; margin-top: 10px; border-radius: 5px;">
                        <h4>Database Changes:</h4>
                        <ul>
                            <li>📋 Add event_type field to availability table</li>
                            <li>🔗 Create trainer-event type assignments table</li>
                            <li>📊 Add performance indexes</li>
                            <li>🔧 Replace session_duration with event_type configuration</li>
                        </ul>
                        <p><strong>Impact:</strong> Existing availability data will be preserved and converted to use Personal Training event type.</p>
                    </div>
                `;
                $(this).after(details).remove();
            });
        });
        </script>
        <?php
    }
    
    /**
     * Show update complete notice
     * 
     * @param array $status Schema status
     */
    private function show_update_complete_notice($status) {
        // Only show once after update
        if (get_transient('training_calendar_schema_updated')) {
            delete_transient('training_calendar_schema_updated');
            ?>
            <div class="notice notice-success is-dismissible">
                <h3>✅ Training Calendar Database Updated</h3>
                <p>
                    <strong>Schema Version:</strong> <?php echo esc_html($status['current_version']); ?>
                </p>
                <p>
                    <strong>New Features Available:</strong>
                    Event Type assignments, improved trainer availability management
                </p>
                <p>
                    <a href="<?php echo admin_url('admin.php?page=personal-training'); ?>" class="button button-primary">
                        Manage Trainer Assignments
                    </a>
                </p>
            </div>
            <?php
        }
    }
    
    /**
     * AJAX handler for schema update
     */
    public function ajax_update_schema() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'training_calendar_schema_update')) {
            wp_send_json_error(array('message' => 'Security check failed'));
            return;
        }
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }
        
        try {
            // Run schema update
            $success = $this->update_schema();
            
            if ($success) {
                // Set transient to show success notice
                set_transient('training_calendar_schema_updated', true, 60);
                
                wp_send_json_success(array(
                    'message' => 'Schema updated successfully',
                    'status' => $this->schema::get_status()
                ));
            } else {
                wp_send_json_error(array('message' => 'Schema update failed'));
            }
            
        } catch (Exception $e) {
            wp_send_json_error(array('message' => $e->getMessage()));
        }
    }
    
    /**
     * Get schema status for admin dashboard
     * 
     * @return array Schema status
     */
    public function get_admin_status() {
        $status = $this->schema::get_status();
        
        // Add user-friendly information
        $status['description'] = $this->get_status_description($status);
        $status['actions'] = $this->get_available_actions($status);
        
        return $status;
    }
    
    /**
     * Get user-friendly status description
     * 
     * @param array $status Schema status
     * @return string Description
     */
    private function get_status_description($status) {
        if ($status['needs_update']) {
            return 'Database schema needs to be updated to support Event Type assignments.';
        } elseif ($status['status'] === 'complete') {
            return 'Database schema is up to date with Event Type assignment support.';
        } else {
            return 'Database schema status unknown.';
        }
    }
    
    /**
     * Get available actions for current status
     * 
     * @param array $status Schema status
     * @return array Available actions
     */
    private function get_available_actions($status) {
        $actions = array();
        
        if ($status['needs_update']) {
            $actions[] = array(
                'label' => 'Update Schema',
                'action' => 'update',
                'class' => 'button-primary'
            );
        }
        
        $actions[] = array(
            'label' => 'View Status',
            'action' => 'status',
            'class' => 'button-secondary'
        );
        
        return $actions;
    }
    
    /**
     * Initialize schema for new installations
     */
    public function initialize_for_new_installation() {
        return $this->schema->create_fresh_schema();
    }
    
    /**
     * Check if trainer assignments are available
     * 
     * @return bool
     */
    public function trainer_assignments_available() {
        global $wpdb;
        
        $table = $wpdb->prefix . 'training_calendar_trainer_event_assignments';
        return $wpdb->get_var("SHOW TABLES LIKE '{$table}'") === $table;
    }
    
    /**
     * Get assignment statistics
     * 
     * @return array Statistics
     */
    public function get_assignment_statistics() {
        if (!$this->trainer_assignments_available()) {
            return array();
        }
        
        global $wpdb;
        
        $table = $wpdb->prefix . 'training_calendar_trainer_event_assignments';
        
        $stats = array();
        
        // Total assignments
        $stats['total_assignments'] = $wpdb->get_var("SELECT COUNT(*) FROM {$table} WHERE is_active = 1");
        
        // Assignments by event type
        $event_type_stats = $wpdb->get_results(
            "SELECT event_type, COUNT(*) as count FROM {$table} WHERE is_active = 1 GROUP BY event_type",
            ARRAY_A
        );
        
        $stats['by_event_type'] = array();
        foreach ($event_type_stats as $stat) {
            $stats['by_event_type'][$stat['event_type']] = $stat['count'];
        }
        
        // Trainers with assignments
        $stats['trainers_with_assignments'] = $wpdb->get_var(
            "SELECT COUNT(DISTINCT trainer_id) FROM {$table} WHERE is_active = 1"
        );
        
        return $stats;
    }
}

/**
 * Initialize schema manager
 */
function fitcopilot_training_calendar_init_schema_manager() {
    return new FitCopilot_Training_Calendar_Schema_Manager();
}

// Initialize if not already done
if (!function_exists('fitcopilot_get_training_calendar_schema_manager')) {
    function fitcopilot_get_training_calendar_schema_manager() {
        static $instance = null;
        
        if ($instance === null) {
            $instance = fitcopilot_training_calendar_init_schema_manager();
        }
        
        return $instance;
    }
} 