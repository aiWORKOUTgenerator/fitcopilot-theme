<div id="trainer-availability-modal" class="training-calendar-modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content large-modal">
        <div class="modal-header">
            <h3>👥 Manage Trainer Availability</h3>
            <button type="button" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <!-- Trainer Selection -->
            <div class="trainer-selection" style="margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <h4 style="margin: 0 0 15px 0; color: #1d2327;">Select Trainer</h4>
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 15px; align-items: end;">
                    <div>
                        <label for="availability-trainer-select" style="display: block; margin-bottom: 5px; font-weight: 500;">Trainer:</label>
                        <select id="availability-trainer-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">Select a trainer...</option>
                            <?php
                            // Get trainers from Personal Training system
                            if (class_exists('FitCopilot_Personal_Training_Data')) {
                                $pt_data_manager = new FitCopilot_Personal_Training_Data();
                                $trainers = $pt_data_manager->get_trainers(true); // Get only active trainers
                                
                                foreach ($trainers as $trainer) {
                                    $trainer_id = $trainer['id'] ?? 0;
                                    $trainer_name = $trainer['name'] ?? 'Unknown Trainer';
                                    $trainer_specialty = $trainer['specialty'] ?? '';
                                    
                                    echo '<option value="' . esc_attr($trainer_id) . '">';
                                    echo esc_html($trainer_name);
                                    if ($trainer_specialty) {
                                        echo ' - ' . esc_html($trainer_specialty);
                                    }
                                    echo '</option>';
                                }
                            } else {
                                // Fallback if Personal Training system not available
                                echo '<option value="1">Justin Fassio - Strength & Conditioning</option>';
                                echo '<option value="2">Morgan Chen - Nutrition & Weight Loss</option>';
                                echo '<option value="3">Jordan Smith - Athletic Performance</option>';
                            }
                            ?>
                        </select>
                    </div>
                    <button type="button" id="load-trainer-availability" class="button button-secondary">
                        <span class="dashicons dashicons-download" style="margin-top: 3px;"></span>
                        Load Schedule
                    </button>
                </div>
            </div>

            <!-- Availability Schedule Form -->
            <div id="availability-schedule-form" style="display: none;">
                <div class="schedule-header" style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #1d2327;">Weekly Availability Schedule</h4>
                    <p style="margin: 0; color: #666; font-size: 14px;">Set recurring weekly availability for fitness assessments and training sessions.</p>
                </div>

                <form id="trainer-availability-form">
                    <input type="hidden" id="selected-trainer-id" name="trainer_id" value="">
                    
                    <!-- Days of Week Schedule -->
                    <div class="weekly-schedule">
                        <?php
                        $days = [
                            0 => 'Sunday',
                            1 => 'Monday', 
                            2 => 'Tuesday',
                            3 => 'Wednesday',
                            4 => 'Thursday',
                            5 => 'Friday',
                            6 => 'Saturday'
                        ];
                        
                        foreach ($days as $day_num => $day_name): ?>
                        <div class="day-schedule" style="margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #fff;">
                            <div class="day-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                                <div style="display: flex; align-items: center;">
                                    <input type="checkbox" id="day-<?php echo $day_num; ?>-enabled" 
                                           name="availability[<?php echo $day_num; ?>][enabled]" 
                                           value="1" style="margin-right: 10px;">
                                    <label for="day-<?php echo $day_num; ?>-enabled" style="font-weight: 600; font-size: 16px; margin: 0;">
                                        <?php echo $day_name; ?>
                                    </label>
                                </div>
                                <button type="button" class="button button-small add-time-slot" data-day="<?php echo $day_num; ?>">
                                    <span class="dashicons dashicons-plus-alt" style="margin-top: 2px;"></span>
                                    Add Time Slot
                                </button>
                            </div>
                            
                            <div class="time-slots" id="day-<?php echo $day_num; ?>-slots" style="display: none;">
                                <!-- Time slots will be added dynamically -->
                            </div>
                            
                            <!-- Day Settings -->
                            <div class="day-settings" id="day-<?php echo $day_num; ?>-settings" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                                    <div>
                                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Session Duration:</label>
                                        <select name="availability[<?php echo $day_num; ?>][session_duration]" style="width: 100%; padding: 6px;">
                                            <option value="20">20 minutes (Fitness Assessment)</option>
                                            <option value="30">30 minutes</option>
                                            <option value="45">45 minutes</option>
                                            <option value="60" selected>60 minutes</option>
                                            <option value="90">90 minutes</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Buffer Time:</label>
                                        <select name="availability[<?php echo $day_num; ?>][buffer_time]" style="width: 100%; padding: 6px;">
                                            <option value="0">No buffer</option>
                                            <option value="5">5 minutes</option>
                                            <option value="10">10 minutes</option>
                                            <option value="15" selected>15 minutes</option>
                                            <option value="30">30 minutes</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Location:</label>
                                        <input type="text" name="availability[<?php echo $day_num; ?>][location]" 
                                               placeholder="e.g., Gym Floor A, Virtual" 
                                               style="width: 100%; padding: 6px;">
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Max Sessions:</label>
                                        <input type="number" name="availability[<?php echo $day_num; ?>][max_sessions]" 
                                               value="8" min="1" max="20" 
                                               style="width: 100%; padding: 6px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>

                    <!-- Global Settings -->
                    <div class="global-settings" style="margin-top: 30px; padding: 20px; background: #f0f6fc; border: 1px solid #c3d4e6; border-radius: 8px;">
                        <h4 style="margin: 0 0 15px 0; color: #1d2327;">Global Settings</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Effective Date:</label>
                                <input type="date" name="effective_date" id="effective-date" 
                                       value="<?php echo date('Y-m-d'); ?>" 
                                       style="width: 100%; padding: 8px;">
                                <small style="color: #666;">When this schedule becomes active</small>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Expiry Date (Optional):</label>
                                <input type="date" name="expiry_date" id="expiry-date" 
                                       style="width: 100%; padding: 8px;">
                                <small style="color: #666;">Leave blank for permanent schedule</small>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Availability Type:</label>
                                <select name="availability_type" style="width: 100%; padding: 8px;">
                                    <option value="both">In-Person & Virtual</option>
                                    <option value="in_person">In-Person Only</option>
                                    <option value="virtual">Virtual Only</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Timezone:</label>
                                <select name="timezone" style="width: 100%; padding: 8px;">
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Chicago">Central Time</option>
                                    <option value="America/Denver">Mountain Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Notes:</label>
                            <textarea name="notes" rows="3" placeholder="Special instructions, holiday schedules, etc." 
                                      style="width: 100%; padding: 8px; resize: vertical;"></textarea>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: right;">
                        <button type="button" class="button button-secondary" id="preview-schedule">
                            <span class="dashicons dashicons-visibility" style="margin-top: 3px;"></span>
                            Preview Schedule
                        </button>
                        <button type="button" class="button button-secondary" style="margin-left: 10px;" id="reset-schedule">
                            <span class="dashicons dashicons-undo" style="margin-top: 3px;"></span>
                            Reset
                        </button>
                        <button type="submit" class="button button-primary" style="margin-left: 10px;">
                            <span class="dashicons dashicons-saved" style="margin-top: 3px;"></span>
                            Save Availability Schedule
                        </button>
                    </div>
                </form>
            </div>

            <!-- Loading State -->
            <div id="availability-loading" style="display: none; text-align: center; padding: 40px;">
                <div class="spinner is-active" style="float: none; margin: 0 auto 20px;"></div>
                <p>Loading trainer availability...</p>
            </div>

            <!-- No Trainer Selected State -->
            <div id="no-trainer-selected" style="text-align: center; padding: 40px; color: #666;">
                <span class="dashicons dashicons-groups" style="font-size: 48px; margin-bottom: 20px; color: #ccc;"></span>
                <h4>Select a Trainer</h4>
                <p>Choose a trainer from the dropdown above to manage their availability schedule.</p>
            </div>
        </div>
    </div>
</div>

<!-- Time Slot Template (Hidden) -->
<template id="time-slot-template">
    <div class="time-slot" style="display: grid; grid-template-columns: auto auto auto 1fr auto; gap: 10px; align-items: center; margin-bottom: 10px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
        <div>
            <label style="display: block; font-size: 12px; margin-bottom: 2px;">Start:</label>
            <input type="time" name="start_time" value="09:00" style="padding: 4px;">
        </div>
        <div>
            <label style="display: block; font-size: 12px; margin-bottom: 2px;">End:</label>
            <input type="time" name="end_time" value="17:00" style="padding: 4px;">
        </div>
        <div>
            <label style="display: block; font-size: 12px; margin-bottom: 2px;">Break Start:</label>
            <input type="time" name="break_start" placeholder="12:00" style="padding: 4px;">
        </div>
        <div>
            <label style="display: block; font-size: 12px; margin-bottom: 2px;">Break End:</label>
            <input type="time" name="break_end" placeholder="13:00" style="padding: 4px;">
        </div>
        <button type="button" class="button button-small remove-time-slot" style="background: #dc3545; color: white; border-color: #dc3545;">
            <span class="dashicons dashicons-trash" style="margin-top: 2px;"></span>
        </button>
    </div>
</template> 