<?php
/**
 * Training Calendar - Event Types Configuration
 * 
 * Defines event types with specifications, duration options, and validation rules
 * Part of Phase 2: Event Type Configuration
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
     * Event types configuration
     * 
     * @var array
     */
    private static $event_types = array(
        'fitness_assessment' => array(
            'id' => 'fitness_assessment',
            'title' => 'Fitness Assessment',
            'short_title' => 'Assessment',
            'duration' => 20,
            'durations' => array(20),
            'description' => 'Comprehensive fitness evaluation and goal setting session',
            'long_description' => 'A thorough assessment of your current fitness level, health history, and personal goals. This session includes body composition analysis, movement screening, and personalized fitness planning.',
            'requires_duration_selection' => false,
            'trainer_scheduled' => false,
            'category' => 'assessment',
            'color' => '#10b981', // Emerald
            'icon' => 'clipboard-check',
            'max_participants' => 1,
            'buffer_time' => 10,
            'pricing' => array(
                'type' => 'free',
                'amount' => 0,
                'currency' => 'USD'
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
            ),
            'requirements' => array(
                'trainer_certification' => array('CPT', 'NASM', 'ACE'),
                'equipment_needed' => array('body_composition_scale', 'measuring_tape', 'blood_pressure_cuff'),
                'location_types' => array('in_person', 'virtual'),
                'prep_time' => 5
            ),
            'workflow' => array(
                'booking_confirmation' => true,
                'reminder_schedule' => array(24, 2), // Hours before
                'follow_up_required' => true,
                'assessment_form' => true
            )
        ),
        
        'personal_training' => array(
            'id' => 'personal_training',
            'title' => 'Personal Training Session',
            'short_title' => 'Personal Training',
            'durations' => array(20, 30, 45, 60, 90),
            'description' => 'One-on-one personalized training session',
            'long_description' => 'Individualized training session tailored to your specific goals, fitness level, and preferences. Includes exercise instruction, form correction, and progress tracking.',
            'requires_duration_selection' => true,
            'trainer_scheduled' => false,
            'category' => 'training',
            'color' => '#3b82f6', // Blue
            'icon' => 'dumbbell',
            'max_participants' => 1,
            'buffer_time' => 15,
            'pricing' => array(
                'type' => 'duration_based',
                'rates' => array(
                    20 => 35,
                    30 => 50,
                    45 => 70,
                    60 => 85,
                    90 => 120
                ),
                'currency' => 'USD',
                'packages' => array(
                    'single' => array('sessions' => 1, 'discount' => 0),
                    'package_4' => array('sessions' => 4, 'discount' => 5),
                    'package_8' => array('sessions' => 8, 'discount' => 10),
                    'package_12' => array('sessions' => 12, 'discount' => 15)
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
            ),
            'requirements' => array(
                'trainer_certification' => array('CPT', 'NASM', 'ACE', 'CSCS'),
                'equipment_needed' => array('varies_by_session'),
                'location_types' => array('in_person', 'virtual'),
                'prep_time' => 10
            ),
            'workflow' => array(
                'booking_confirmation' => true,
                'reminder_schedule' => array(24, 2),
                'follow_up_required' => false,
                'workout_plan' => true,
                'progress_tracking' => true
            )
        ),
        
        'group_fitness' => array(
            'id' => 'group_fitness',
            'title' => 'Group Fitness Class',
            'short_title' => 'Group Fitness',
            'duration' => 45, // Standard group class duration
            'durations' => array(30, 45, 60),
            'description' => 'Energizing group fitness class with professional instruction',
            'long_description' => 'High-energy group fitness class designed to challenge and motivate participants through varied workouts including cardio, strength training, and flexibility exercises.',
            'requires_duration_selection' => false,
            'trainer_scheduled' => true, // Special flag for pre-scheduled classes
            'category' => 'group',
            'color' => '#f59e0b', // Amber
            'icon' => 'users',
            'max_participants' => 15,
            'min_participants' => 3,
            'buffer_time' => 15,
            'pricing' => array(
                'type' => 'fixed',
                'amount' => 25,
                'currency' => 'USD',
                'drop_in' => 25,
                'packages' => array(
                    'single' => array('classes' => 1, 'price' => 25),
                    'package_5' => array('classes' => 5, 'price' => 110, 'discount' => 12),
                    'package_10' => array('classes' => 10, 'price' => 200, 'discount' => 20),
                    'unlimited_monthly' => array('classes' => -1, 'price' => 150)
                )
            ),
            'availability_rules' => array(
                'advance_booking_hours' => 1,
                'max_advance_days' => 14,
                'allowed_days' => array(1, 2, 3, 4, 5, 6, 0), // All days
                'scheduled_times' => array('06:00', '07:00', '09:00', '18:00', '19:00'),
                'business_hours' => array(
                    'start' => '06:00',
                    'end' => '20:00'
                )
            ),
            'requirements' => array(
                'trainer_certification' => array('Group Fitness', 'CPT', 'Specialty_Certifications'),
                'equipment_needed' => array('sound_system', 'mats', 'weights', 'varies_by_class'),
                'location_types' => array('in_person', 'virtual'),
                'prep_time' => 15,
                'class_types' => array('HIIT', 'Yoga', 'Pilates', 'Strength', 'Cardio', 'Dance')
            ),
            'workflow' => array(
                'booking_confirmation' => true,
                'reminder_schedule' => array(24, 2),
                'follow_up_required' => false,
                'class_roster' => true,
                'waitlist_enabled' => true,
                'cancellation_policy' => '2_hours_advance'
            )
        ),
        
        'group_forum' => array(
            'id' => 'group_forum',
            'title' => 'Group Discussion Forum',
            'short_title' => 'Group Forum',
            'duration' => 30,
            'durations' => array(30, 45),
            'description' => 'Interactive group discussion on fitness topics and goal sharing',
            'long_description' => 'Supportive group environment for discussing fitness challenges, sharing progress, and learning from peers. Topics include nutrition, motivation, workout planning, and lifestyle changes.',
            'requires_duration_selection' => false,
            'trainer_scheduled' => false,
            'category' => 'forum',
            'color' => '#8b5cf6', // Violet
            'icon' => 'message-circle',
            'max_participants' => 8,
            'min_participants' => 3,
            'buffer_time' => 10,
            'pricing' => array(
                'type' => 'free',
                'amount' => 0,
                'currency' => 'USD',
                'membership_required' => true
            ),
            'availability_rules' => array(
                'advance_booking_hours' => 2,
                'max_advance_days' => 21,
                'allowed_days' => array(2, 4, 6), // Tuesday, Thursday, Saturday
                'preferred_times' => array('10:00', '14:00', '16:00'),
                'business_hours' => array(
                    'start' => '10:00',
                    'end' => '18:00'
                )
            ),
            'requirements' => array(
                'trainer_certification' => array('Group_Facilitation', 'CPT', 'Wellness_Coach'),
                'equipment_needed' => array('video_conference', 'whiteboard', 'handouts'),
                'location_types' => array('virtual', 'in_person'),
                'prep_time' => 10,
                'topics' => array(
                    'Goal Setting',
                    'Nutrition Basics',
                    'Motivation & Mindset',
                    'Workout Planning',
                    'Progress Tracking',
                    'Lifestyle Integration'
                )
            ),
            'workflow' => array(
                'booking_confirmation' => true,
                'reminder_schedule' => array(24, 2),
                'follow_up_required' => true,
                'discussion_topics' => true,
                'resource_sharing' => true,
                'progress_check_ins' => true
            )
        )
    );
    
    /**
     * Get all event types
     * 
     * @return array
     */
    public static function get_event_types() {
        return self::$event_types;
    }
    
    /**
     * Get specific event type
     * 
     * @param string $event_type_id
     * @return array|null
     */
    public static function get_event_type($event_type_id) {
        return isset(self::$event_types[$event_type_id]) ? self::$event_types[$event_type_id] : null;
    }
    
    /**
     * Get event type titles for dropdown
     * 
     * @return array
     */
    public static function get_event_type_titles() {
        $titles = array();
        foreach (self::$event_types as $id => $config) {
            $titles[$id] = $config['title'];
        }
        return $titles;
    }
    
    /**
     * Get event type by category
     * 
     * @param string $category
     * @return array
     */
    public static function get_events_by_category($category) {
        $events = array();
        foreach (self::$event_types as $id => $config) {
            if ($config['category'] === $category) {
                $events[$id] = $config;
            }
        }
        return $events;
    }
    
    /**
     * Validate event type and duration combination
     * 
     * @param string $event_type_id
     * @param mixed $duration
     * @return array
     */
    public static function validate_event_type_duration($event_type_id, $duration) {
        $event_type = self::get_event_type($event_type_id);
        
        if (!$event_type) {
            return array(
                'valid' => false,
                'error' => 'Invalid event type selected'
            );
        }
        
        // Check if duration selection is required
        if ($event_type['requires_duration_selection'] && empty($duration)) {
            return array(
                'valid' => false,
                'error' => sprintf('Duration selection is required for %s', $event_type['title'])
            );
        }
        
        // Check if trainer scheduled
        if ($event_type['trainer_scheduled'] && $duration !== 'trainer_scheduled') {
            return array(
                'valid' => false,
                'error' => sprintf('%s uses trainer-scheduled timing', $event_type['title'])
            );
        }
        
        // Validate duration against allowed durations
        if ($duration && $duration !== 'trainer_scheduled') {
            $numeric_duration = intval($duration);
            $allowed_durations = isset($event_type['durations']) ? $event_type['durations'] : array($event_type['duration']);
            
            if (!in_array($numeric_duration, $allowed_durations)) {
                return array(
                    'valid' => false,
                    'error' => sprintf(
                        'Invalid duration for %s. Allowed: %s minutes',
                        $event_type['title'],
                        implode(', ', $allowed_durations)
                    )
                );
            }
        }
        
        return array('valid' => true);
    }
    
    /**
     * Get pricing for event type and duration
     * 
     * @param string $event_type_id
     * @param int $duration
     * @return float|array
     */
    public static function get_pricing($event_type_id, $duration = null) {
        $event_type = self::get_event_type($event_type_id);
        
        if (!$event_type || !isset($event_type['pricing'])) {
            return 0;
        }
        
        $pricing = $event_type['pricing'];
        
        switch ($pricing['type']) {
            case 'free':
                return 0;
                
            case 'fixed':
                return $pricing['amount'];
                
            case 'duration_based':
                if ($duration && isset($pricing['rates'][$duration])) {
                    return $pricing['rates'][$duration];
                }
                return 0;
                
            default:
                return 0;
        }
    }
    
    /**
     * Check if event type allows specific day
     * 
     * @param string $event_type_id
     * @param int $day_of_week (0 = Sunday, 6 = Saturday)
     * @return bool
     */
    public static function is_day_allowed($event_type_id, $day_of_week) {
        $event_type = self::get_event_type($event_type_id);
        
        if (!$event_type || !isset($event_type['availability_rules']['allowed_days'])) {
            return true;
        }
        
        return in_array($day_of_week, $event_type['availability_rules']['allowed_days']);
    }
    
    /**
     * Get preferred times for event type
     * 
     * @param string $event_type_id
     * @return array
     */
    public static function get_preferred_times($event_type_id) {
        $event_type = self::get_event_type($event_type_id);
        
        if (!$event_type || !isset($event_type['availability_rules'])) {
            return array();
        }
        
        $rules = $event_type['availability_rules'];
        
        return isset($rules['preferred_times']) ? $rules['preferred_times'] : 
               (isset($rules['scheduled_times']) ? $rules['scheduled_times'] : array());
    }
    
    /**
     * Get advance booking requirements
     * 
     * @param string $event_type_id
     * @return array
     */
    public static function get_advance_booking_rules($event_type_id) {
        $event_type = self::get_event_type($event_type_id);
        
        $defaults = array(
            'advance_booking_hours' => 2,
            'max_advance_days' => 30
        );
        
        if (!$event_type || !isset($event_type['availability_rules'])) {
            return $defaults;
        }
        
        $rules = $event_type['availability_rules'];
        
        return array(
            'advance_booking_hours' => isset($rules['advance_booking_hours']) ? $rules['advance_booking_hours'] : $defaults['advance_booking_hours'],
            'max_advance_days' => isset($rules['max_advance_days']) ? $rules['max_advance_days'] : $defaults['max_advance_days']
        );
    }
    
    /**
     * Get business hours for event type
     * 
     * @param string $event_type_id
     * @return array
     */
    public static function get_business_hours($event_type_id) {
        $event_type = self::get_event_type($event_type_id);
        
        $defaults = array(
            'start' => '09:00',
            'end' => '17:00'
        );
        
        if (!$event_type || !isset($event_type['availability_rules']['business_hours'])) {
            return $defaults;
        }
        
        return $event_type['availability_rules']['business_hours'];
    }
} 