<?php
/**
 * Training Calendar - Event Type Helper Functions
 * 
 * Utility functions for event type management, validation, and formatting
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
 * Event Type Helper Class
 */
class FitCopilot_Training_Calendar_Event_Type_Helper {
    
    /**
     * Format duration for display
     * 
     * @param int $duration Duration in minutes
     * @param bool $include_unit Include "minutes" unit
     * @return string
     */
    public static function format_duration($duration, $include_unit = true) {
        if ($duration === 'trainer_scheduled') {
            return 'Trainer Scheduled';
        }
        
        $numeric_duration = intval($duration);
        
        if ($numeric_duration <= 0) {
            return 'Invalid Duration';
        }
        
        if ($numeric_duration >= 60) {
            $hours = floor($numeric_duration / 60);
            $minutes = $numeric_duration % 60;
            
            $formatted = $hours . 'h';
            if ($minutes > 0) {
                $formatted .= ' ' . $minutes . 'm';
            }
            
            return $formatted;
        }
        
        return $numeric_duration . ($include_unit ? ' minutes' : '');
    }
    
    /**
     * Format price for display
     * 
     * @param float $price
     * @param string $currency
     * @return string
     */
    public static function format_price($price, $currency = 'USD') {
        if ($price <= 0) {
            return 'Free';
        }
        
        $symbol = '$'; // Default to USD symbol
        switch (strtoupper($currency)) {
            case 'EUR':
                $symbol = '€';
                break;
            case 'GBP':
                $symbol = '£';
                break;
            case 'JPY':
                $symbol = '¥';
                break;
        }
        
        return $symbol . number_format($price, 2);
    }
    
    /**
     * Generate event type dropdown options
     * 
     * @param bool $include_default Include default option
     * @param string $selected_value Currently selected value
     * @return string
     */
    public static function get_event_type_dropdown_options($include_default = true, $selected_value = '') {
        $options = '';
        
        if ($include_default) {
            $selected = empty($selected_value) ? ' selected' : '';
            $options .= '<option value=""' . $selected . '>- Select Event Type -</option>';
        }
        
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            return $options;
        }
        
        $event_types = FitCopilot_Training_Calendar_Event_Types_Config::get_event_types();
        
        foreach ($event_types as $id => $config) {
            $selected = ($selected_value === $id) ? ' selected' : '';
            $options .= sprintf(
                '<option value="%s" data-category="%s"%s>%s</option>',
                esc_attr($id),
                esc_attr($config['category']),
                $selected,
                esc_html($config['title'])
            );
        }
        
        return $options;
    }
    
    /**
     * Generate duration dropdown options for event type
     * 
     * @param string $event_type_id
     * @param bool $include_default
     * @param mixed $selected_value
     * @return string
     */
    public static function get_duration_dropdown_options($event_type_id, $include_default = true, $selected_value = '') {
        $options = '';
        
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            return $options;
        }
        
        $event_type = FitCopilot_Training_Calendar_Event_Types_Config::get_event_type($event_type_id);
        
        if (!$event_type) {
            return '<option value="">Select event type first</option>';
        }
        
        if ($include_default) {
            if ($event_type['requires_duration_selection']) {
                $selected = empty($selected_value) ? ' selected' : '';
                $options .= '<option value=""' . $selected . '>- Select Duration -</option>';
            } elseif ($event_type['trainer_scheduled']) {
                $selected = ($selected_value === 'trainer_scheduled') ? ' selected' : '';
                $options .= '<option value="trainer_scheduled"' . $selected . '>Trainer Scheduled</option>';
                return $options;
            }
        }
        
        $durations = isset($event_type['durations']) ? $event_type['durations'] : array($event_type['duration']);
        
        foreach ($durations as $duration) {
            $price = FitCopilot_Training_Calendar_Event_Types_Config::get_pricing($event_type_id, $duration);
            $price_text = $price > 0 ? ' (' . self::format_price($price) . ')' : '';
            $selected = ($selected_value == $duration) ? ' selected' : '';
            
            $options .= sprintf(
                '<option value="%d"%s>%s%s</option>',
                $duration,
                $selected,
                self::format_duration($duration),
                $price_text
            );
        }
        
        return $options;
    }
    
    /**
     * Validate trainer compatibility with event type
     * 
     * @param array $trainer
     * @param string $event_type_id
     * @return array
     */
    public static function validate_trainer_compatibility($trainer, $event_type_id) {
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            return array('valid' => true);
        }
        
        $event_type = FitCopilot_Training_Calendar_Event_Types_Config::get_event_type($event_type_id);
        
        if (!$event_type) {
            return array(
                'valid' => false,
                'error' => 'Invalid event type'
            );
        }
        
        $errors = array();
        
        // Check trainer certifications
        if (isset($event_type['requirements']['trainer_certification'])) {
            $required_certs = $event_type['requirements']['trainer_certification'];
            $trainer_certs = isset($trainer['certifications']) ? $trainer['certifications'] : array();
            
            $has_required_cert = false;
            foreach ($required_certs as $required_cert) {
                if (in_array($required_cert, $trainer_certs)) {
                    $has_required_cert = true;
                    break;
                }
            }
            
            if (!$has_required_cert) {
                $errors[] = sprintf(
                    'Trainer lacks required certification. Required: %s',
                    implode(' or ', $required_certs)
                );
            }
        }
        
        // Check trainer specialty compatibility
        $trainer_specialty = strtolower($trainer['specialty'] ?? '');
        $event_category = $event_type['category'];
        
        $specialty_compatibility = array(
            'assessment' => array('general', 'assessment', 'fitness', 'personal'),
            'training' => array('personal', 'strength', 'training', 'fitness'),
            'group' => array('group', 'fitness', 'instructor', 'class'),
            'forum' => array('coaching', 'wellness', 'group', 'facilitation')
        );
        
        if (isset($specialty_compatibility[$event_category])) {
            $compatible_specialties = $specialty_compatibility[$event_category];
            $is_compatible = false;
            
            foreach ($compatible_specialties as $compatible) {
                if (strpos($trainer_specialty, $compatible) !== false) {
                    $is_compatible = true;
                    break;
                }
            }
            
            if (!$is_compatible) {
                $errors[] = sprintf(
                    'Trainer specialty (%s) may not be ideal for %s',
                    $trainer['specialty'] ?? 'Unknown',
                    $event_type['title']
                );
            }
        }
        
        return array(
            'valid' => empty($errors),
            'errors' => $errors,
            'warnings' => array() // Could add warnings for non-blocking issues
        );
    }
    
    /**
     * Get event type icon HTML
     * 
     * @param string $event_type_id
     * @param string $size
     * @return string
     */
    public static function get_event_type_icon($event_type_id, $size = '16') {
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            return '';
        }
        
        $event_type = FitCopilot_Training_Calendar_Event_Types_Config::get_event_type($event_type_id);
        
        if (!$event_type || !isset($event_type['icon'])) {
            return '';
        }
        
        $icon_map = array(
            'clipboard-check' => 'dashicons-yes-alt',
            'dumbbell' => 'dashicons-awards',
            'users' => 'dashicons-groups',
            'message-circle' => 'dashicons-format-chat'
        );
        
        $icon_class = isset($icon_map[$event_type['icon']]) ? $icon_map[$event_type['icon']] : 'dashicons-calendar-alt';
        
        return sprintf(
            '<span class="dashicons %s" style="font-size: %spx; width: %spx; height: %spx;"></span>',
            esc_attr($icon_class),
            esc_attr($size),
            esc_attr($size),
            esc_attr($size)
        );
    }
    
    /**
     * Get event type color CSS
     * 
     * @param string $event_type_id
     * @param string $property CSS property (color, background-color, border-color)
     * @return string
     */
    public static function get_event_type_color_css($event_type_id, $property = 'color') {
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            return '';
        }
        
        $event_type = FitCopilot_Training_Calendar_Event_Types_Config::get_event_type($event_type_id);
        
        if (!$event_type || !isset($event_type['color'])) {
            return '';
        }
        
        return sprintf('%s: %s;', $property, $event_type['color']);
    }
    
    /**
     * Calculate time slots for event type
     * 
     * @param string $event_type_id
     * @param string $start_time
     * @param string $end_time
     * @param string $break_start
     * @param string $break_end
     * @return array
     */
    public static function calculate_time_slots($event_type_id, $start_time, $end_time, $break_start = '', $break_end = '') {
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            return array();
        }
        
        $event_type = FitCopilot_Training_Calendar_Event_Types_Config::get_event_type($event_type_id);
        
        if (!$event_type) {
            return array();
        }
        
        $duration = isset($event_type['duration']) ? $event_type['duration'] : 60;
        $buffer_time = isset($event_type['buffer_time']) ? $event_type['buffer_time'] : 15;
        
        $slots = array();
        $current_time = strtotime($start_time);
        $end_timestamp = strtotime($end_time);
        $break_start_timestamp = $break_start ? strtotime($break_start) : null;
        $break_end_timestamp = $break_end ? strtotime($break_end) : null;
        
        while ($current_time + ($duration * 60) <= $end_timestamp) {
            $slot_end = $current_time + ($duration * 60);
            
            // Check if slot conflicts with break time
            $conflicts_with_break = false;
            if ($break_start_timestamp && $break_end_timestamp) {
                if (($current_time < $break_end_timestamp) && ($slot_end > $break_start_timestamp)) {
                    $conflicts_with_break = true;
                }
            }
            
            if (!$conflicts_with_break) {
                $slots[] = array(
                    'start_time' => date('H:i', $current_time),
                    'end_time' => date('H:i', $slot_end),
                    'duration' => $duration,
                    'event_type_id' => $event_type_id
                );
            }
            
            // Move to next slot
            if ($conflicts_with_break && $break_end_timestamp) {
                // Skip to after break
                $current_time = $break_end_timestamp;
            } else {
                // Normal progression
                $current_time += ($duration + $buffer_time) * 60;
            }
        }
        
        return $slots;
    }
    
    /**
     * Get event type summary for display
     * 
     * @param string $event_type_id
     * @return array
     */
    public static function get_event_type_summary($event_type_id) {
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            return array();
        }
        
        $event_type = FitCopilot_Training_Calendar_Event_Types_Config::get_event_type($event_type_id);
        
        if (!$event_type) {
            return array();
        }
        
        $durations = isset($event_type['durations']) ? $event_type['durations'] : array($event_type['duration']);
        $pricing = $event_type['pricing'];
        
        return array(
            'title' => $event_type['title'],
            'description' => $event_type['description'],
            'category' => $event_type['category'],
            'duration_options' => array_map(array(self::class, 'format_duration'), $durations),
            'pricing_type' => $pricing['type'],
            'price_range' => self::get_price_range($event_type_id),
            'max_participants' => $event_type['max_participants'],
            'requires_duration_selection' => $event_type['requires_duration_selection'],
            'trainer_scheduled' => $event_type['trainer_scheduled'],
            'advance_booking' => FitCopilot_Training_Calendar_Event_Types_Config::get_advance_booking_rules($event_type_id)
        );
    }
    
    /**
     * Get price range for event type
     * 
     * @param string $event_type_id
     * @return string
     */
    private static function get_price_range($event_type_id) {
        if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
            return 'Free';
        }
        
        $event_type = FitCopilot_Training_Calendar_Event_Types_Config::get_event_type($event_type_id);
        
        if (!$event_type || !isset($event_type['pricing'])) {
            return 'Free';
        }
        
        $pricing = $event_type['pricing'];
        
        switch ($pricing['type']) {
            case 'free':
                return 'Free';
                
            case 'fixed':
                return self::format_price($pricing['amount'], $pricing['currency']);
                
            case 'duration_based':
                if (isset($pricing['rates']) && !empty($pricing['rates'])) {
                    $prices = array_values($pricing['rates']);
                    $min_price = min($prices);
                    $max_price = max($prices);
                    
                    if ($min_price === $max_price) {
                        return self::format_price($min_price, $pricing['currency']);
                    }
                    
                    return self::format_price($min_price, $pricing['currency']) . 
                           ' - ' . 
                           self::format_price($max_price, $pricing['currency']);
                }
                return 'Varies';
                
            default:
                return 'Contact for pricing';
        }
    }
    
    /**
     * Validate event type form data
     * 
     * @param array $form_data
     * @return array
     */
    public static function validate_event_type_form_data($form_data) {
        $errors = array();
        
        // Validate event type selection
        if (empty($form_data['event_type'])) {
            $errors[] = 'Event type selection is required';
        } else {
            // Validate event type exists
            if (!class_exists('FitCopilot_Training_Calendar_Event_Types_Config')) {
                $errors[] = 'Event types configuration not available';
            } else {
                $event_type = FitCopilot_Training_Calendar_Event_Types_Config::get_event_type($form_data['event_type']);
                if (!$event_type) {
                    $errors[] = 'Invalid event type selected';
                } else {
                    // Validate duration if required
                    $duration_validation = FitCopilot_Training_Calendar_Event_Types_Config::validate_event_type_duration(
                        $form_data['event_type'],
                        $form_data['duration'] ?? ''
                    );
                    
                    if (!$duration_validation['valid']) {
                        $errors[] = $duration_validation['error'];
                    }
                }
            }
        }
        
        return array(
            'valid' => empty($errors),
            'errors' => $errors
        );
    }
} 