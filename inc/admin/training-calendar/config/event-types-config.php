<?php
/**
 * Training Calendar - Event Types Configuration
 * 
 * Backend event type definitions that match frontend JavaScript modules
 * Provides configuration for the 4 event types in the system
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
 * Event Types Configuration Class
 */
class FitCopilot_Training_Calendar_Event_Types_Config {
    
    /**
     * Get all event types configuration
     * 
     * @return array Complete event types configuration
     */
    public static function get_all_event_types() {
        return array(
            'fitness_assessment' => array(
                'id' => 'fitness_assessment',
                'title' => 'Fitness Assessment',
                'duration' => 20,
                'durations' => array(20),
                'description' => 'Comprehensive fitness evaluation and goal setting session',
                'requires_duration_selection' => false,
                'category' => 'assessment',
                'color' => '#10b981', // Emerald
                'max_participants' => 1,
                'buffer_time' => 10,
                'pricing' => array(
                    'type' => 'free',
                    'amount' => 0
                ),
                'availability_rules' => array(
                    'advance_booking_hours' => 4,
                    'max_advance_days' => 30,
                    'allowed_days' => array(1, 2, 3, 4, 5), // Weekdays only
                    'preferred_times' => array('09:00', '11:00', '14:00', '16:00'),
                    'business_hours' => array(
                        'start' => '09:00',
                        'end' => '17:00'
                    )
                )
            ),
            
            'personal_training' => array(
                'id' => 'personal_training',
                'title' => 'Personal Training Session',
                'durations' => array(20, 30, 45, 60, 90),
                'description' => 'One-on-one personalized training session',
                'requires_duration_selection' => true,
                'category' => 'training',
                'color' => '#3b82f6', // Blue
                'max_participants' => 1,
                'buffer_time' => 15,
                'pricing' => array(
                    'type' => 'duration_based',
                    'rates' => array(
                        20 => 30,
                        30 => 45,
                        45 => 65,
                        60 => 80,
                        90 => 110
                    )
                ),
                'availability_rules' => array(
                    'advance_booking_hours' => 2,
                    'max_advance_days' => 60,
                    'allowed_days' => array(1, 2, 3, 4, 5, 6), // Monday to Saturday
                    'preferred_times' => array('06:00', '07:00', '08:00', '17:00', '18:00', '19:00'),
                    'business_hours' => array(
                        'start' => '06:00',
                        'end' => '21:00'
                    )
                )
            ),
            
            'group_fitness' => array(
                'id' => 'group_fitness',
                'title' => 'Group Fitness Class',
                'description' => 'Energizing group fitness class with professional instruction',
                'requires_duration_selection' => false,
                'trainer_scheduled' => true, // Special flag for pre-scheduled classes
                'category' => 'group',
                'color' => '#f59e0b', // Amber
                'max_participants' => 15,
                'buffer_time' => 15,
                'pricing' => array(
                    'type' => 'fixed',
                    'amount' => 25
                ),
                'availability_rules' => array(
                    'advance_booking_hours' => 1,
                    'max_advance_days' => 14,
                    'allowed_days' => array(1, 2, 3, 4, 5, 6, 0), // All days
                    'scheduled_times' => array('06:00', '07:00', '09:00', '18:00', '19:00'), // Pre-scheduled
                    'business_hours' => array(
                        'start' => '06:00',
                        'end' => '20:00'
                    )
                )
            ),
            
            'group_forum' => array(
                'id' => 'group_forum',
                'title' => 'Group Discussion Forum',
                'duration' => 30,
                'durations' => array(30, 45),
                'description' => 'Interactive group discussion on fitness topics and goal sharing',
                'requires_duration_selection' => false,
                'category' => 'forum',
                'color' => '#8b5cf6', // Violet
                'max_participants' => 8,
                'buffer_time' => 10,
                'pricing' => array(
                    'type' => 'free',
                    'amount' => 0
                ),
                'availability_rules' => array(
                    'advance_booking_hours' => 2,
                    'max_advance_days' => 21,
                    'allowed_days' => array(2, 4, 6), // Tuesday, Thursday, Saturday
                    'preferred_times' => array('10:00', '14:00', '16:00'),
                    'business_hours' => array(
                        'start' => '10:00',
                        'end' => '17:00'
                    )
                )
            )
        );
    }
    
    /**
     * Get specific event type configuration
     * 
     * @param string $event_type_id Event type ID
     * @return array|null Event type configuration or null if not found
     */
    public static function get_event_type($event_type_id) {
        $event_types = self::get_all_event_types();
        return isset($event_types[$event_type_id]) ? $event_types[$event_type_id] : null;
    }
    
    /**
     * Get event type by title (for backward compatibility)
     * 
     * @param string $title Event type title
     * @return array|null Event type configuration or null if not found
     */
    public static function get_event_type_by_title($title) {
        $event_types = self::get_all_event_types();
        
        foreach ($event_types as $event_type) {
            if ($event_type['title'] === $title) {
                return $event_type;
            }
        }
        
        return null;
    }
    
    /**
     * Check if event type exists
     * 
     * @param string $event_type_id Event type ID
     * @return bool True if event type exists
     */
    public static function event_type_exists($event_type_id) {
        $event_types = self::get_all_event_types();
        return isset($event_types[$event_type_id]);
    }
    
    /**
     * Get event type IDs
     * 
     * @return array Array of event type IDs
     */
    public static function get_event_type_ids() {
        return array_keys(self::get_all_event_types());
    }
    
    /**
     * Get event types for dropdown options
     * 
     * @param bool $include_default Whether to include default option
     * @return array Array of options for dropdown
     */
    public static function get_dropdown_options($include_default = true) {
        $options = array();
        
        if ($include_default) {
            $options[''] = '- Select Event Type -';
        }
        
        $event_types = self::get_all_event_types();
        
        foreach ($event_types as $id => $config) {
            $options[$id] = $config['title'];
        }
        
        return $options;
    }
    
    /**
     * Get duration options for specific event type
     * 
     * @param string $event_type_id Event type ID
     * @param bool $include_default Whether to include default option
     * @return array Array of duration options
     */
    public static function get_duration_options($event_type_id, $include_default = true) {
        $event_type = self::get_event_type($event_type_id);
        if (!$event_type) {
            return array();
        }
        
        $options = array();
        
        if ($include_default) {
            if ($event_type['requires_duration_selection']) {
                $options[''] = '- Select Duration -';
            } elseif (isset($event_type['trainer_scheduled']) && $event_type['trainer_scheduled']) {
                $options['trainer_scheduled'] = 'Trainer Scheduled';
                return $options;
            }
        }
        
        if (isset($event_type['durations']) && is_array($event_type['durations'])) {
            foreach ($event_type['durations'] as $duration) {
                $price = self::get_duration_price($event_type_id, $duration);
                $price_text = $price > 0 ? " ($${price})" : '';
                $options[$duration] = "{$duration} minutes{$price_text}";
            }
        } elseif (isset($event_type['duration'])) {
            $price = self::get_duration_price($event_type_id, $event_type['duration']);
            $price_text = $price > 0 ? " ($${price})" : '';
            $options[$event_type['duration']] = "{$event_type['duration']} minutes{$price_text}";
        }
        
        return $options;
    }
    
    /**
     * Get price for specific duration
     * 
     * @param string $event_type_id Event type ID
     * @param int $duration Duration in minutes
     * @return float Price for duration
     */
    public static function get_duration_price($event_type_id, $duration) {
        $event_type = self::get_event_type($event_type_id);
        if (!$event_type || !isset($event_type['pricing'])) {
            return 0;
        }
        
        $pricing = $event_type['pricing'];
        
        switch ($pricing['type']) {
            case 'free':
                return 0;
            case 'fixed':
                return isset($pricing['amount']) ? floatval($pricing['amount']) : 0;
            case 'duration_based':
                if (isset($pricing['rates'][$duration])) {
                    return floatval($pricing['rates'][$duration]);
                }
                return 0;
            default:
                return 0;
        }
    }
    
    /**
     * Validate event type and duration combination
     * 
     * @param string $event_type_id Event type ID
     * @param int|string $duration Duration (may be 'trainer_scheduled')
     * @return array Validation result with 'valid' and 'message' keys
     */
    public static function validate_event_type_duration($event_type_id, $duration) {
        $event_type = self::get_event_type($event_type_id);
        
        if (!$event_type) {
            return array(
                'valid' => false,
                'message' => 'Invalid event type selected'
            );
        }
        
        // Check if duration selection is required
        if ($event_type['requires_duration_selection'] && empty($duration)) {
            return array(
                'valid' => false,
                'message' => "Duration selection is required for {$event_type['title']}"
            );
        }
        
        // Check if trainer scheduled
        if (isset($event_type['trainer_scheduled']) && $event_type['trainer_scheduled']) {
            if ($duration !== 'trainer_scheduled' && !empty($duration)) {
                return array(
                    'valid' => false,
                    'message' => "{$event_type['title']} uses trainer-scheduled timing"
                );
            }
            return array('valid' => true, 'message' => '');
        }
        
        // Validate duration against allowed durations
        if (!empty($duration) && $duration !== 'trainer_scheduled') {
            $numeric_duration = intval($duration);
            $allowed_durations = isset($event_type['durations']) ? $event_type['durations'] : array($event_type['duration']);
            
            if (!in_array($numeric_duration, $allowed_durations)) {
                return array(
                    'valid' => false,
                    'message' => "Invalid duration for {$event_type['title']}. Allowed: " . implode(', ', $allowed_durations) . ' minutes'
                );
            }
        }
        
        return array('valid' => true, 'message' => '');
    }
    
    /**
     * Get event types grouped by category
     * 
     * @return array Event types grouped by category
     */
    public static function get_event_types_by_category() {
        $event_types = self::get_all_event_types();
        $grouped = array();
        
        foreach ($event_types as $id => $config) {
            $category = $config['category'];
            if (!isset($grouped[$category])) {
                $grouped[$category] = array();
            }
            $grouped[$category][$id] = $config;
        }
        
        return $grouped;
    }
} 