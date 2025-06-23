<div id="trainer-availability-modal" class="training-calendar-modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content large-modal">
        <div class="modal-header">
            <h3>👥 Manage Trainer Availability & Assignments</h3>
            <button type="button" class="modal-close">&times;</button>
        </div>
        
        <!-- Tab Navigation -->
        <div class="modal-tabs" style="display: flex; border-bottom: 1px solid #ddd; background: #f8f9fa;">
            <button type="button" class="tab-button active" data-tab="availability" style="flex: 1; padding: 15px 20px; border: none; background: none; cursor: pointer; font-weight: 500; border-bottom: 2px solid #1d4ed8; color: #1d4ed8;">
                📅 Availability Schedule
            </button>
            <button type="button" class="tab-button" data-tab="assignments" style="flex: 1; padding: 15px 20px; border: none; background: none; cursor: pointer; font-weight: 500; border-bottom: 2px solid transparent; color: #666;">
                🎯 Event Type Assignments
            </button>
            <button type="button" class="tab-button" data-tab="statistics" style="flex: 1; padding: 15px 20px; border: none; background: none; cursor: pointer; font-weight: 500; border-bottom: 2px solid transparent; color: #666;">
                📊 Assignment Statistics
            </button>
        </div>
        
        <div class="modal-body">
            <!-- Tab Content: Availability Schedule (Existing) -->
            <div id="tab-availability" class="tab-content active">
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

            <!-- Tab Content: Event Type Assignments -->
            <div id="tab-assignments" class="tab-content">
                <!-- Assignment Overview Dashboard -->
                <div class="assignment-dashboard" style="margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #f0f6fc 0%, #e6f3ff 100%); border-radius: 12px; border: 1px solid #c3d4e6;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: #1d2327; font-size: 18px;">🎯 Event Type Assignment Manager</h4>
                            <p style="margin: 0; color: #666; font-size: 14px;">Assign trainers to specific event types to control which services they can offer.</p>
                        </div>
                        <div class="dashboard-stats" style="display: flex; gap: 20px;">
                            <div class="stat-card" style="text-align: center; padding: 10px 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div style="font-size: 24px; font-weight: bold; color: #10b981;" id="total-assignments">-</div>
                                <div style="font-size: 12px; color: #666;">Total Assignments</div>
                            </div>
                            <div class="stat-card" style="text-align: center; padding: 10px 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div style="font-size: 24px; font-weight: bold; color: #3b82f6;" id="active-trainers">-</div>
                                <div style="font-size: 12px; color: #666;">Active Trainers</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="quick-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button type="button" class="button button-primary" id="bulk-assign-btn">
                            <span class="dashicons dashicons-plus-alt" style="margin-top: 3px;"></span>
                            Bulk Assign
                        </button>
                        <button type="button" class="button button-secondary" id="refresh-assignments-btn">
                            <span class="dashicons dashicons-update" style="margin-top: 3px;"></span>
                            Refresh Data
                        </button>
                        <button type="button" class="button button-secondary" id="export-assignments-btn">
                            <span class="dashicons dashicons-download" style="margin-top: 3px;"></span>
                            Export Assignments
                        </button>
                    </div>
                </div>

                <!-- Assignment Matrix -->
                <div class="assignment-matrix-container" style="margin-bottom: 30px; background: white; border-radius: 8px; border: 1px solid #ddd; overflow: hidden;">
                    <div class="matrix-header" style="padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #ddd; display: flex; align-items: center; justify-content: space-between;">
                        <h4 style="margin: 0; color: #1d2327;">Trainer × Event Type Assignment Matrix</h4>
                        <div class="matrix-filters" style="display: flex; gap: 10px; align-items: center;">
                            <label style="font-size: 14px; color: #666;">Filter:</label>
                            <select id="assignment-filter" style="padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                <option value="all">All Assignments</option>
                                <option value="assigned">Assigned Only</option>
                                <option value="unassigned">Unassigned Only</option>
                                <option value="active">Active Trainers Only</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="assignment-matrix" id="assignment-matrix">
                        <!-- Loading state -->
                        <div class="matrix-loading" style="padding: 40px; text-align: center; color: #666;">
                            <div class="spinner is-active" style="float: none; margin: 0 auto 15px;"></div>
                            <p>Loading assignment matrix...</p>
                        </div>
                    </div>
                </div>

                <!-- Individual Assignment Management -->
                <div class="individual-assignment" style="background: white; border-radius: 8px; border: 1px solid #ddd; overflow: hidden;">
                    <div class="assignment-header" style="padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #ddd;">
                        <h4 style="margin: 0; color: #1d2327;">Individual Assignment Management</h4>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Manage assignments for specific trainers with detailed configuration.</p>
                    </div>
                    
                    <div class="assignment-form" style="padding: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div>
                                <label for="assignment-trainer-select" style="display: block; margin-bottom: 5px; font-weight: 500;">Select Trainer:</label>
                                <select id="assignment-trainer-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="">Choose a trainer...</option>
                                    <?php
                                    // Get trainers for assignment management
                                    if (class_exists('FitCopilot_Personal_Training_Data')) {
                                        $pt_data_manager = new FitCopilot_Personal_Training_Data();
                                        $trainers = $pt_data_manager->get_trainers(true);
                                        
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
                                        echo '<option value="1">Justin Fassio - Strength & Conditioning</option>';
                                        echo '<option value="2">Morgan Chen - Nutrition & Weight Loss</option>';
                                        echo '<option value="3">Jordan Smith - Athletic Performance</option>';
                                    }
                                    ?>
                                </select>
                            </div>
                            <div>
                                <label for="assignment-event-type-select" style="display: block; margin-bottom: 5px; font-weight: 500;">Event Type:</label>
                                <select id="assignment-event-type-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="">Choose event type...</option>
                                    <option value="fitness_assessment">🏃‍♂️ Fitness Assessment (Free, 20 min)</option>
                                    <option value="personal_training">💪 Personal Training (Duration-based pricing)</option>
                                    <option value="group_fitness">🤸‍♀️ Group Fitness Class ($25, Trainer scheduled)</option>
                                    <option value="group_forum">💬 Group Discussion Forum (Free, 30-45 min)</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Assignment Configuration -->
                        <div id="assignment-config" style="display: none; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
                            <h5 style="margin: 0 0 15px 0; color: #1d2327;">Assignment Configuration</h5>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Specialization Notes:</label>
                                    <textarea id="specialization-notes" rows="2" placeholder="e.g., Certified for advanced strength training" 
                                              style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Hourly Rate ($):</label>
                                    <input type="number" id="hourly-rate" min="0" max="500" step="5" placeholder="80" 
                                           style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Max Sessions/Day:</label>
                                    <input type="number" id="max-sessions-per-day" min="1" max="20" value="8" 
                                           style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Status:</label>
                                    <select id="assignment-status" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                                        <option value="1">✅ Active</option>
                                        <option value="0">❌ Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Assignment Actions -->
                        <div class="assignment-actions" style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button type="button" class="button button-secondary" id="remove-assignment-btn" style="display: none;">
                                <span class="dashicons dashicons-trash" style="margin-top: 3px;"></span>
                                Remove Assignment
                            </button>
                            <button type="button" class="button button-primary" id="save-assignment-btn" disabled>
                                <span class="dashicons dashicons-saved" style="margin-top: 3px;"></span>
                                Save Assignment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Content: Assignment Statistics -->
            <div id="tab-statistics" class="tab-content">
                <!-- Statistics Dashboard -->
                <div class="statistics-dashboard" style="margin-bottom: 30px;">
                    <div class="dashboard-header" style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 5px 0; color: #1d2327; font-size: 18px;">📊 Assignment Statistics & Analytics</h4>
                        <p style="margin: 0; color: #666; font-size: 14px;">Overview of trainer assignments and event type coverage across your team.</p>
                    </div>
                    
                    <!-- Key Metrics Cards -->
                    <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
                        <div class="metric-card" style="padding: 20px; background: white; border-radius: 8px; border: 1px solid #ddd; text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #10b981; margin-bottom: 5px;" id="stat-total-assignments">-</div>
                            <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Total Active Assignments</div>
                            <div style="font-size: 12px; color: #999;" id="stat-assignment-change">Loading...</div>
                        </div>
                        
                        <div class="metric-card" style="padding: 20px; background: white; border-radius: 8px; border: 1px solid #ddd; text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #3b82f6; margin-bottom: 5px;" id="stat-coverage-rate">-</div>
                            <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Event Type Coverage</div>
                            <div style="font-size: 12px; color: #999;" id="stat-coverage-detail">Loading...</div>
                        </div>
                        
                        <div class="metric-card" style="padding: 20px; background: white; border-radius: 8px; border: 1px solid #ddd; text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #f59e0b; margin-bottom: 5px;" id="stat-avg-assignments">-</div>
                            <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Avg Assignments/Trainer</div>
                            <div style="font-size: 12px; color: #999;" id="stat-assignment-range">Loading...</div>
                        </div>
                        
                        <div class="metric-card" style="padding: 20px; background: white; border-radius: 8px; border: 1px solid #ddd; text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #8b5cf6; margin-bottom: 5px;" id="stat-specialization-rate">-</div>
                            <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Specialization Rate</div>
                            <div style="font-size: 12px; color: #999;" id="stat-specialization-detail">Loading...</div>
                        </div>
                    </div>
                </div>
                
                <!-- Event Type Coverage Analysis -->
                <div class="coverage-analysis" style="margin-bottom: 30px; background: white; border-radius: 8px; border: 1px solid #ddd; overflow: hidden;">
                    <div class="analysis-header" style="padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #ddd;">
                        <h4 style="margin: 0; color: #1d2327;">Event Type Coverage Analysis</h4>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">How many trainers are assigned to each event type.</p>
                    </div>
                    
                    <div class="coverage-content" style="padding: 20px;">
                        <div class="coverage-bars" id="coverage-bars">
                            <!-- Coverage bars will be populated via JavaScript -->
                            <div style="text-align: center; padding: 20px; color: #666;">
                                <div class="spinner is-active" style="float: none; margin: 0 auto 10px;"></div>
                                <p>Loading coverage analysis...</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Trainer Assignment Summary -->
                <div class="trainer-summary" style="margin-bottom: 30px; background: white; border-radius: 8px; border: 1px solid #ddd; overflow: hidden;">
                    <div class="summary-header" style="padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #ddd; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h4 style="margin: 0; color: #1d2327;">Trainer Assignment Summary</h4>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Detailed breakdown of assignments per trainer.</p>
                        </div>
                        <div>
                            <button type="button" class="button button-secondary" id="export-summary-btn">
                                <span class="dashicons dashicons-download" style="margin-top: 3px;"></span>
                                Export Summary
                            </button>
                        </div>
                    </div>
                    
                    <div class="summary-content" style="padding: 20px;">
                        <div class="trainer-summary-table" id="trainer-summary-table">
                            <!-- Summary table will be populated via JavaScript -->
                            <div style="text-align: center; padding: 20px; color: #666;">
                                <div class="spinner is-active" style="float: none; margin: 0 auto 10px;"></div>
                                <p>Loading trainer summary...</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Assignment Recommendations -->
                <div class="assignment-recommendations" style="background: white; border-radius: 8px; border: 1px solid #ddd; overflow: hidden;">
                    <div class="recommendations-header" style="padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #ddd;">
                        <h4 style="margin: 0; color: #1d2327;">💡 Assignment Recommendations</h4>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Suggestions to optimize your trainer assignments.</p>
                    </div>
                    
                    <div class="recommendations-content" style="padding: 20px;">
                        <div class="recommendations-list" id="recommendations-list">
                            <!-- Recommendations will be populated via JavaScript -->
                            <div style="text-align: center; padding: 20px; color: #666;">
                                <div class="spinner is-active" style="float: none; margin: 0 auto 10px;"></div>
                                <p>Analyzing assignments for recommendations...</p>
                            </div>
                        </div>
                    </div>
                </div>
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