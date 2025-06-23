<?php
/**
 * Training Calendar - Trainer Assignment Manager
 * 
 * Manages trainer-event type assignments and integration with availability system
 * Handles the junction table logic for the Event Type Assignment system
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
 * Trainer Assignment Manager Class
 */
class FitCopilot_Trainer_Assignment_Manager {
    
    /**
     * Database table names
     */
    private $assignments_table;
    private $availability_table;
    
    /**
     * Constructor
     */
    public function __construct() {
        global $wpdb;
        
        $this->assignments_table = $wpdb->prefix . 'training_calendar_trainer_assignments';
        $this->availability_table = $wpdb->prefix . 'training_calendar_availability';
    }
    
    /**
     * Get trainer assignments for specific trainer
     * 
     * @param int $trainer_id Trainer ID
     * @param bool $active_only Only return active assignments
     * @return array Trainer assignments
     */
    public function get_trainer_assignments($trainer_id, $active_only = true) {
        global $wpdb;
        
        $where_conditions = array('trainer_id = %d');
        $where_values = array($trainer_id);
        
        if ($active_only) {
            $where_conditions[] = 'is_active = 1';
        }
        
        $where_clause = implode(' AND ', $where_conditions);
        
        $sql = "SELECT * FROM {$this->assignments_table} WHERE {$where_clause} ORDER BY event_type";
        $sql = $wpdb->prepare($sql, $where_values);
        
        $assignments = $wpdb->get_results($sql, ARRAY_A);
        
        // Enrich with event type configuration
        foreach ($assignments as &$assignment) {
            $assignment['event_config'] = $this->get_event_type_config($assignment['event_type']);
        }
        
        return $assignments;
    }
    
    /**
     * Get trainers assigned to specific event type
     * 
     * @param string $event_type Event type ID
     * @param bool $active_only Only return active assignments
     * @return array Trainer assignments
     */
    public function get_event_type_trainers($event_type, $active_only = true) {
        global $wpdb;
        
        $where_conditions = array('event_type = %s');
        $where_values = array($event_type);
        
        if ($active_only) {
            $where_conditions[] = 'is_active = 1';
        }
        
        $where_clause = implode(' AND ', $where_conditions);
        
        $sql = "SELECT * FROM {$this->assignments_table} WHERE {$where_clause} ORDER BY trainer_id";
        $sql = $wpdb->prepare($sql, $where_values);
        
        $assignments = $wpdb->get_results($sql, ARRAY_A);
        
        // Enrich with trainer information
        foreach ($assignments as &$assignment) {
            $assignment['trainer_info'] = $this->get_trainer_info($assignment['trainer_id']);
        }
        
        return $assignments;
    }
    
    /**
     * Create or update trainer assignment
     * 
     * @param int $trainer_id Trainer ID
     * @param string $event_type Event type ID
     * @param array $assignment_data Assignment configuration data
     * @return bool|int Assignment ID on success, false on failure
     */
    public function assign_trainer_to_event_type($trainer_id, $event_type, $assignment_data = array()) {
        global $wpdb;
        
        // Validate event type
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            require_once get_template_directory() . '/inc/admin/training-calendar/config/event-types-config.php';
        }
        
        if (!FitCopilot_Training_Calendar_Event_Types_Config::event_type_exists($event_type)) {
            return false;
        }
        
        // Check if assignment already exists
        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT id, is_active FROM {$this->assignments_table} WHERE trainer_id = %d AND event_type = %s",
            $trainer_id,
            $event_type
        ));
        
        $default_data = array(
            'is_active' => true,
            'specialization_notes' => '',
            'hourly_rate' => null,
            'max_sessions_per_day' => 8
        );
        
        $assignment_data = wp_parse_args($assignment_data, $default_data);
        
        if ($existing) {
            // Update existing assignment
            $update_data = array(
                'is_active' => $assignment_data['is_active'] ? 1 : 0,
                'specialization_notes' => sanitize_textarea_field($assignment_data['specialization_notes']),
                'hourly_rate' => !empty($assignment_data['hourly_rate']) ? floatval($assignment_data['hourly_rate']) : null,
                'max_sessions_per_day' => intval($assignment_data['max_sessions_per_day']),
                'updated_at' => current_time('mysql')
            );
            
            $result = $wpdb->update(
                $this->assignments_table,
                $update_data,
                array('id' => $existing->id),
                array('%d', '%s', '%f', '%d', '%s'),
                array('%d')
            );
            
            return $result !== false ? $existing->id : false;
            
        } else {
            // Create new assignment
            $insert_data = array(
                'trainer_id' => intval($trainer_id),
                'event_type' => sanitize_text_field($event_type),
                'is_active' => $assignment_data['is_active'] ? 1 : 0,
                'specialization_notes' => sanitize_textarea_field($assignment_data['specialization_notes']),
                'hourly_rate' => !empty($assignment_data['hourly_rate']) ? floatval($assignment_data['hourly_rate']) : null,
                'max_sessions_per_day' => intval($assignment_data['max_sessions_per_day']),
                'created_at' => current_time('mysql')
            );
            
            $result = $wpdb->insert(
                $this->assignments_table,
                $insert_data,
                array('%d', '%s', '%d', '%s', '%f', '%d', '%s')
            );
            
            return $result !== false ? $wpdb->insert_id : false;
        }
    }
    
    /**
     * Remove trainer assignment
     * 
     * @param int $trainer_id Trainer ID
     * @param string $event_type Event type ID
     * @param bool $soft_delete Soft delete (set inactive) or hard delete
     * @return bool Success status
     */
    public function remove_trainer_assignment($trainer_id, $event_type, $soft_delete = true) {
        global $wpdb;
        
        if ($soft_delete) {
            // Soft delete: set inactive
            $result = $wpdb->update(
                $this->assignments_table,
                array(
                    'is_active' => 0,
                    'updated_at' => current_time('mysql')
                ),
                array(
                    'trainer_id' => intval($trainer_id),
                    'event_type' => sanitize_text_field($event_type)
                ),
                array('%d', '%s'),
                array('%d', '%s')
            );
        } else {
            // Hard delete: remove from database
            $result = $wpdb->delete(
                $this->assignments_table,
                array(
                    'trainer_id' => intval($trainer_id),
                    'event_type' => sanitize_text_field($event_type)
                ),
                array('%d', '%s')
            );
        }
        
        // Also clean up related availability data
        if ($result !== false) {
            $this->cleanup_availability_data($trainer_id, $event_type);
        }
        
        return $result !== false;
    }
    
    /**
     * Check if trainer is assigned to event type
     * 
     * @param int $trainer_id Trainer ID
     * @param string $event_type Event type ID
     * @return bool True if assigned and active
     */
    public function is_trainer_assigned($trainer_id, $event_type) {
        global $wpdb;
        
        $count = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->assignments_table} WHERE trainer_id = %d AND event_type = %s AND is_active = 1",
            $trainer_id,
            $event_type
        ));
        
        return intval($count) > 0;
    }
    
    /**
     * Get trainer assignment details
     * 
     * @param int $trainer_id Trainer ID
     * @param string $event_type Event type ID
     * @return array|null Assignment details or null if not found
     */
    public function get_assignment_details($trainer_id, $event_type) {
        global $wpdb;
        
        $assignment = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->assignments_table} WHERE trainer_id = %d AND event_type = %s",
            $trainer_id,
            $event_type
        ), ARRAY_A);
        
        if ($assignment) {
            $assignment['event_config'] = $this->get_event_type_config($event_type);
            $assignment['trainer_info'] = $this->get_trainer_info($trainer_id);
        }
        
        return $assignment;
    }
    
    /**
     * Bulk assign trainer to multiple event types
     * 
     * @param int $trainer_id Trainer ID
     * @param array $event_types Array of event type IDs
     * @param array $default_assignment_data Default assignment data
     * @return array Results array with success/failure per event type
     */
    public function bulk_assign_trainer($trainer_id, $event_types, $default_assignment_data = array()) {
        $results = array();
        
        foreach ($event_types as $event_type) {
            $result = $this->assign_trainer_to_event_type($trainer_id, $event_type, $default_assignment_data);
            $results[$event_type] = $result !== false;
        }
        
        return $results;
    }
    
    /**
     * Get all active trainer assignments (for overview/statistics)
     * 
     * @return array All active assignments grouped by trainer
     */
    public function get_all_active_assignments() {
        global $wpdb;
        
        $assignments = $wpdb->get_results(
            "SELECT * FROM {$this->assignments_table} WHERE is_active = 1 ORDER BY trainer_id, event_type",
            ARRAY_A
        );
        
        $grouped = array();
        
        foreach ($assignments as $assignment) {
            $trainer_id = $assignment['trainer_id'];
            
            if (!isset($grouped[$trainer_id])) {
                $grouped[$trainer_id] = array(
                    'trainer_info' => $this->get_trainer_info($trainer_id),
                    'assignments' => array()
                );
            }
            
            $assignment['event_config'] = $this->get_event_type_config($assignment['event_type']);
            $grouped[$trainer_id]['assignments'][] = $assignment;
        }
        
        return $grouped;
    }
    
    /**
     * Get assignment statistics
     * 
     * @return array Statistics about trainer assignments
     */
    public function get_assignment_statistics() {
        global $wpdb;
        
        $stats = array(
            'total_assignments' => 0,
            'active_assignments' => 0,
            'inactive_assignments' => 0,
            'trainers_with_assignments' => 0,
            'event_types_with_trainers' => 0,
            'assignments_by_event_type' => array(),
            'coverage_rate' => '0%',
            'avg_assignments_per_trainer' => '0',
            'specialization_rate' => '0%',
            'coverage_detail' => 'No data available',
            'assignment_range' => 'No data available', 
            'specialization_detail' => 'No data available',
            'trainer_summary' => array(),
            'event_type_coverage' => array(),
            'recommendations' => array()
        );
        
        // Get total and active counts
        $counts = $wpdb->get_row(
            "SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive
             FROM {$this->assignments_table}",
            ARRAY_A
        );
        
        if ($counts) {
            $stats['total_assignments'] = intval($counts['total']);
            $stats['active_assignments'] = intval($counts['active']);
            $stats['inactive_assignments'] = intval($counts['inactive']);
        }
        
        // Get unique trainer count
        $stats['trainers_with_assignments'] = intval($wpdb->get_var(
            "SELECT COUNT(DISTINCT trainer_id) FROM {$this->assignments_table} WHERE is_active = 1"
        ));
        
        // Get unique event type count
        $stats['event_types_with_trainers'] = intval($wpdb->get_var(
            "SELECT COUNT(DISTINCT event_type) FROM {$this->assignments_table} WHERE is_active = 1"
        ));
        
        // Get assignments by event type
        $by_event_type = $wpdb->get_results(
            "SELECT event_type, COUNT(*) as count 
             FROM {$this->assignments_table} 
             WHERE is_active = 1 
             GROUP BY event_type 
             ORDER BY count DESC",
            ARRAY_A
        );
        
        foreach ($by_event_type as $row) {
            $stats['assignments_by_event_type'][$row['event_type']] = intval($row['count']);
            $stats['event_type_coverage'][$row['event_type']] = intval($row['count']);
        }
        
        // Calculate enhanced statistics
        $total_trainers = $this->get_total_trainers_count();
        $total_event_types = 4; // We have 4 event types
        
        if ($total_trainers > 0) {
            $coverage_percentage = round(($stats['trainers_with_assignments'] / $total_trainers) * 100);
            $stats['coverage_rate'] = $coverage_percentage . '%';
            $stats['coverage_detail'] = "{$stats['trainers_with_assignments']} of {$total_trainers} trainers have assignments";
            
            $avg_assignments = $stats['trainers_with_assignments'] > 0 ? 
                round($stats['active_assignments'] / $stats['trainers_with_assignments'], 1) : 0;
            $stats['avg_assignments_per_trainer'] = $avg_assignments;
        }
        
        // Calculate specialization rate (trainers assigned to multiple event types)
        $specialized_trainers = $wpdb->get_var(
            "SELECT COUNT(*) FROM (
                SELECT trainer_id 
                FROM {$this->assignments_table} 
                WHERE is_active = 1 
                GROUP BY trainer_id 
                HAVING COUNT(DISTINCT event_type) > 1
            ) as specialized"
        );
        
        if ($stats['trainers_with_assignments'] > 0) {
            $specialization_percentage = round(($specialized_trainers / $stats['trainers_with_assignments']) * 100);
            $stats['specialization_rate'] = $specialization_percentage . '%';
            $stats['specialization_detail'] = "{$specialized_trainers} trainers certified for multiple event types";
        }
        
        // Generate trainer summary
        $stats['trainer_summary'] = $this->generate_trainer_summary();
        
        // Generate recommendations
        $stats['recommendations'] = $this->generate_assignment_recommendations($stats);
        
        // Assignment range info
        if ($stats['trainers_with_assignments'] > 0) {
            $assignment_counts = $wpdb->get_results(
                "SELECT trainer_id, COUNT(*) as count 
                 FROM {$this->assignments_table} 
                 WHERE is_active = 1 
                 GROUP BY trainer_id 
                 ORDER BY count",
                ARRAY_A
            );
            
            if (!empty($assignment_counts)) {
                $min_assignments = $assignment_counts[0]['count'];
                $max_assignments = end($assignment_counts)['count'];
                $stats['assignment_range'] = "{$min_assignments}-{$max_assignments} assignments per trainer";
            }
        }
        
        return $stats;
    }
    
    /**
     * Get total trainers count from Personal Training module
     * 
     * @return int Total number of trainers
     */
    private function get_total_trainers_count() {
        $personal_training_data = get_option('fitcopilot_personal_training_data', array());
        return count($personal_training_data);
    }
    
    /**
     * Generate trainer summary for statistics
     * 
     * @return array Trainer summary data
     */
    private function generate_trainer_summary() {
        global $wpdb;
        
        $trainer_data = $wpdb->get_results(
            "SELECT 
                trainer_id,
                COUNT(*) as assignment_count,
                GROUP_CONCAT(event_type SEPARATOR ', ') as event_types,
                AVG(CASE WHEN hourly_rate IS NOT NULL THEN hourly_rate END) as avg_rate
             FROM {$this->assignments_table} 
             WHERE is_active = 1 
             GROUP BY trainer_id 
             ORDER BY assignment_count DESC",
            ARRAY_A
        );
        
        $summary = array();
        
        foreach ($trainer_data as $row) {
            $trainer_info = $this->get_trainer_info($row['trainer_id']);
            
            $summary[] = array(
                'trainer_id' => $row['trainer_id'],
                'name' => $trainer_info['name'],
                'assignment_count' => intval($row['assignment_count']),
                'event_types' => $row['event_types'],
                'avg_rate' => $row['avg_rate'] ? round(floatval($row['avg_rate']), 2) : null
            );
        }
        
        return $summary;
    }
    
    /**
     * Generate assignment recommendations
     * 
     * @param array $stats Current assignment statistics
     * @return array Recommendations array
     */
    private function generate_assignment_recommendations($stats) {
        $recommendations = array();
        
        // Check coverage rate
        $coverage_rate = intval(str_replace('%', '', $stats['coverage_rate']));
        if ($coverage_rate < 50) {
            $recommendations[] = array(
                'type' => 'warning',
                'title' => 'Low Trainer Coverage',
                'description' => 'Less than 50% of trainers have event type assignments. Consider assigning more trainers to improve availability.',
                'action' => 'TrainerAvailabilityAssignmentManager.showBulkAssignModal()',
                'action_label' => 'Bulk Assign Trainers'
            );
        }
        
        // Check event type coverage
        $uncovered_event_types = array();
        $event_types = array('fitness_assessment', 'personal_training', 'group_fitness', 'group_forum');
        
        foreach ($event_types as $event_type) {
            if (empty($stats['event_type_coverage'][$event_type])) {
                $uncovered_event_types[] = $event_type;
            }
        }
        
        if (!empty($uncovered_event_types)) {
            $recommendations[] = array(
                'type' => 'warning',
                'title' => 'Uncovered Event Types',
                'description' => 'Some event types have no assigned trainers: ' . implode(', ', $uncovered_event_types),
                'action' => 'TrainerAvailabilityAssignmentManager.focusEventType("' . $uncovered_event_types[0] . '")',
                'action_label' => 'Assign Trainers'
            );
        }
        
        // Check specialization
        $specialization_rate = intval(str_replace('%', '', $stats['specialization_rate']));
        if ($specialization_rate < 25 && $stats['trainers_with_assignments'] > 3) {
            $recommendations[] = array(
                'type' => 'info',
                'title' => 'Cross-Training Opportunity',
                'description' => 'Consider cross-training more trainers on multiple event types to improve scheduling flexibility.',
                'action' => null,
                'action_label' => null
            );
        }
        
        // Positive feedback
        if ($coverage_rate >= 75 && $specialization_rate >= 30) {
            $recommendations[] = array(
                'type' => 'success',
                'title' => 'Excellent Coverage',
                'description' => 'Great job! Your trainer assignments provide excellent coverage and flexibility.',
                'action' => null,
                'action_label' => null
            );
        }
        
        return $recommendations;
    }
    
    /**
     * Validate trainer exists and is active
     * 
     * @param int $trainer_id Trainer ID
     * @return bool True if trainer is valid and active
     */
    public function validate_trainer($trainer_id) {
        $trainer_info = $this->get_trainer_info($trainer_id);
        return $trainer_info && ($trainer_info['active'] ?? true);
    }
    
    /**
     * Get assignment matrix data for frontend
     * 
     * @return array Formatted assignment matrix data
     */
    public function get_assignment_matrix_data() {
        $assignments = $this->get_all_active_assignments();
        $matrix_data = array();
        
        // Get all trainers from Personal Training module
        $personal_training_data = get_option('fitcopilot_personal_training_data', array());
        
        foreach ($personal_training_data as $trainer) {
            $trainer_id = $trainer['id'] ?? 0;
            
            if ($trainer_id > 0) {
                $matrix_data[$trainer_id] = array(
                    'trainer_info' => array(
                        'id' => $trainer_id,
                        'name' => $trainer['name'] ?? 'Unknown Trainer',
                        'specialty' => $trainer['specialty'] ?? '',
                        'active' => $trainer['active'] ?? true
                    ),
                    'assignments' => array()
                );
                
                // Add assignment data if exists
                if (isset($assignments[$trainer_id])) {
                    foreach ($assignments[$trainer_id]['assignments'] as $assignment) {
                        $matrix_data[$trainer_id]['assignments'][$assignment['event_type']] = $assignment;
                    }
                }
            }
        }
        
        return $matrix_data;
    }
    
    // ===== PRIVATE HELPER METHODS =====
    
    /**
     * Get event type configuration
     * 
     * @param string $event_type Event type ID
     * @return array|null Event type configuration
     */
    private function get_event_type_config($event_type) {
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            require_once get_template_directory() . '/inc/admin/training-calendar/config/event-types-config.php';
        }
        
        return FitCopilot_Training_Calendar_Event_Types_Config::get_event_type($event_type);
    }
    
    /**
     * Get trainer information from Personal Training module
     * 
     * @param int $trainer_id Trainer ID
     * @return array Trainer information
     */
    private function get_trainer_info($trainer_id) {
        // Get trainer data from Personal Training module
        $personal_training_data = get_option('fitcopilot_personal_training_data', array());
        
        foreach ($personal_training_data as $trainer) {
            if (($trainer['id'] ?? 0) == $trainer_id) {
                return array(
                    'id' => $trainer_id,
                    'name' => $trainer['name'] ?? 'Unknown Trainer',
                    'specialty' => $trainer['specialty'] ?? '',
                    'active' => $trainer['active'] ?? true
                );
            }
        }
        
        // Fallback trainer info
        return array(
            'id' => $trainer_id,
            'name' => "Trainer #{$trainer_id}",
            'specialty' => '',
            'active' => true
        );
    }
    
    /**
     * Clean up availability data when assignment is removed
     * 
     * @param int $trainer_id Trainer ID
     * @param string $event_type Event type ID
     */
    private function cleanup_availability_data($trainer_id, $event_type) {
        global $wpdb;
        
        // Remove availability data for this trainer/event type combination
        $wpdb->delete(
            $this->availability_table,
            array(
                'trainer_id' => $trainer_id,
                'event_type' => $event_type
            ),
            array('%d', '%s')
        );
    }
} 