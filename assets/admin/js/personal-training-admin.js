jQuery(document).ready(function($) {
    
    // Handle individual trainer save
    $(document).on('click', '.save-individual-trainer', function() {
        var button = $(this);
        var trainerIndex = button.data('trainer-index');
        var trainerId = button.data('trainer-id');
        var trainerRow = button.closest('.trainer-row');
        var statusElement = $('#save-status-' + trainerIndex);
        
        console.log('🚀 Starting individual save for trainer:', {
            index: trainerIndex,
            id: trainerId,
            button: button[0]
        });
        
        // Show saving state
        button.prop('disabled', true);
        button.text(fitcopilotPersonalTrainingAjax.saving_text);
        statusElement.removeClass('success error').addClass('saving').text('Saving...');
        
        // Collect all form data for this trainer
        var trainerData = {};
        
        // Get all input values from this trainer row
        trainerRow.find('input, textarea, select').each(function() {
            var input = $(this);
            var name = input.attr('name');
            
            if (name && name.includes('[' + trainerIndex + ']')) {
                // Extract field name using improved regex
                var matches = name.match(/\[([^\]]+)\]$/);
                if (matches && matches[1]) {
                    var fieldName = matches[1];
                
                if (input.attr('type') === 'checkbox') {
                        // Handle checkboxes properly
                        trainerData[fieldName] = input.is(':checked') ? '1' : '';
                } else {
                        // Handle all other input types
                        trainerData[fieldName] = input.val() || '';
                    }
                    
                    console.log('📝 Field collected:', fieldName, '=', trainerData[fieldName]);
                }
            }
        });
        
        // Add trainer ID if available
        if (trainerId) {
            trainerData.id = trainerId;
        }
        
        console.log('📦 Complete trainer data to save:', trainerData);
        
        // Prepare AJAX data
        var ajaxData = {
            action: 'save_individual_trainer',
            nonce: fitcopilotPersonalTrainingAjax.nonce,
            trainer_data: trainerData,
            trainer_index: trainerIndex
        };
        
        console.log('🌐 AJAX data being sent:', ajaxData);
        
        // Send AJAX request
        $.ajax({
            url: fitcopilotPersonalTrainingAjax.ajax_url,
            type: 'POST',
            data: ajaxData,
            dataType: 'json',
            timeout: 30000, // 30 second timeout
            success: function(response) {
                console.log('✅ Personal Training AJAX Response:', response);
                
                if (response.success) {
                    // Show success state with trainer name
                    var successMessage = fitcopilotPersonalTrainingAjax.saved_text;
                    if (response.trainer_name) {
                        successMessage += ' (' + response.trainer_name + ')';
                    }
                    statusElement.removeClass('saving error').addClass('success').text(successMessage);
                    
                    // Update trainer name display if changed
                    if (response.trainer_name) {
                        trainerRow.find('.trainer-name-display').text(response.trainer_name);
                    }
                    
                    // Update trainer ID if returned
                    if (response.trainer_id) {
                        button.data('trainer-id', response.trainer_id);
                        // Also update the hidden ID field
                        trainerRow.find('input[name="trainers[' + trainerIndex + '][id]"]').val(response.trainer_id);
                    }
                    
                    // Flash success feedback
                    trainerRow.addClass('just-saved');
                    setTimeout(function() {
                        trainerRow.removeClass('just-saved');
                    }, 2000);
                    
                    // Remove unsaved changes indicator
                    trainerRow.removeClass('has-unsaved-changes');
                    button.removeClass('has-changes');
                    
                    // Reset status after 3 seconds
                    setTimeout(function() {
                        statusElement.removeClass('success').text('');
                    }, 3000);
                    
                    // Log successful save for frontend verification
                    console.log('✅ Trainer saved successfully:', {
                        name: response.trainer_name,
                        id: response.trainer_id,
                        status: response.active_status,
                        updated: response.updated_at
                    });
                    
                } else {
                    // Show error state
                    var errorMessage = fitcopilotPersonalTrainingAjax.error_text;
                    if (response.message) {
                        errorMessage += ': ' + response.message;
                    }
                    statusElement.removeClass('saving success').addClass('error').text(errorMessage);
                        
                    console.error('❌ Trainer save failed:', response.message || 'Unknown error');
                }
            },
            error: function(xhr, status, error) {
                console.error('🚨 AJAX Error Details:', {
                    status: status,
                    error: error,
                    response: xhr.responseText,
                    readyState: xhr.readyState,
                    statusCode: xhr.status
                });
                
                // Show error state with detailed info
                var errorMessage = fitcopilotPersonalTrainingAjax.error_text + ': ';
                if (status === 'timeout') {
                    errorMessage += 'Request timed out';
                } else if (xhr.status === 0) {
                    errorMessage += 'Network connection error';
                } else if (xhr.status === 500) {
                    errorMessage += 'Server error (500)';
                } else {
                    errorMessage += error || 'Unknown error';
                }
                
                statusElement.removeClass('saving success').addClass('error').text(errorMessage);
            },
            complete: function() {
                // Reset button state
                button.prop('disabled', false);
                button.text('💾 Save This Trainer');
            }
        });
    });
    
    // Add visual feedback for form changes
    $(document).on('input change', '.trainer-row input, .trainer-row textarea, .trainer-row select', function() {
        var trainerRow = $(this).closest('.trainer-row');
        var saveButton = trainerRow.find('.save-individual-trainer');
        
        // Add "unsaved changes" indicator
        if (!trainerRow.hasClass('has-unsaved-changes')) {
            trainerRow.addClass('has-unsaved-changes');
            saveButton.addClass('has-changes');
        }
    });
    
    // Remove unsaved changes indicator after save
    $(document).on('ajax:success', '.save-individual-trainer', function() {
        var trainerRow = $(this).closest('.trainer-row');
        trainerRow.removeClass('has-unsaved-changes');
        $(this).removeClass('has-changes');
    });
    
    // Keyboard shortcut for save (Ctrl+S or Cmd+S)
    $(document).on('keydown', '.trainer-row', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.which === 83) { // Ctrl/Cmd + S
            e.preventDefault();
            $(this).find('.save-individual-trainer').click();
        }
    });
    
    // Update existing functionality for compatibility
    
    // Add new trainer row
    $('#add-trainer-row').on('click', function() {
        var template = $('#trainer-template').html();
        var index = $('.trainer-row').length;
        template = template.replace(/\{\{INDEX\}\}/g, index);
        $('#trainers-list').append(template);
    });
    
    // Remove trainer row - FIXED: ID-based deletion to prevent index mismatches
    $(document).on('click', '.remove-trainer-row', function() {
        var button = $(this);
        var trainerRow = button.closest('.trainer-row');
        var trainerIndex = trainerRow.data('index');
        var trainerName = trainerRow.find('.trainer-name-display').text();
        var trainerId = trainerRow.find('input[name*="[id]"]').val();
        
        // CRITICAL: Use trainer ID for deletion, not index
        if (!trainerId) {
            console.error('❌ Cannot delete trainer: missing trainer ID');
            alert('❌ Error: Trainer ID not found. Please refresh the page and try again.');
            return;
        }
        
        // Confirm deletion with trainer details
        var confirmMessage = 'Are you sure you want to permanently delete this trainer?\n\n';
        confirmMessage += 'Trainer: ' + trainerName + '\n';
        confirmMessage += 'This action cannot be undone.';
        
        if (!confirm(confirmMessage)) {
            return;
        }
        
        console.log('🗑️ Starting trainer deletion:', {
            index: trainerIndex,
            id: trainerId,
            name: trainerName
        });
        
        // Disable delete button and show loading state
        button.prop('disabled', true).text('🔄 Deleting...');
        trainerRow.addClass('deleting').css('opacity', '0.5');
        
        // Send AJAX request to delete trainer - USING ID instead of INDEX
        $.ajax({
            url: fitcopilotPersonalTrainingAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'delete_trainer_by_id',  // NEW ACTION
                nonce: fitcopilotPersonalTrainingAjax.nonce,
                trainer_id: trainerId,           // PRIMARY: Use ID for deletion
                trainer_index: trainerIndex      // BACKUP: Keep index for logging
            },
            dataType: 'json',
            timeout: 15000,
            success: function(response) {
                console.log('✅ Delete trainer response:', response);
                
                if (response.success) {
                    // Success: Show notification and refresh to re-sync indexes
                    console.log('✅ Trainer deletion completed successfully:', response.data);
                    
                    // Show success message with details
                    var successMessage = '✅ Trainer "' + trainerName + '" has been permanently deleted.';
                    if (response.data && response.data.remaining_count !== undefined) {
                        successMessage += '\n\nRemaining trainers: ' + response.data.remaining_count;
                        successMessage += '\nMethod: ' + (response.data.method || 'ID-based deletion');
                    }
                    successMessage += '\n\nPage will refresh to update trainer list...';
                    
                    // Show notification
                    alert(successMessage);
                    
                    // CRITICAL: Refresh page to re-sync all trainer indexes and data
                    // This prevents the architectural index mismatch issue
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                } else {
                    // Error: Restore row state and show error
                    trainerRow.removeClass('deleting').css('opacity', '1');
                    button.prop('disabled', false).text('❌');
                    
                    var errorMessage = 'Failed to delete trainer: ' + (response.message || 'Unknown error');
                    console.error('❌ Trainer deletion failed:', response.message);
                    alert('❌ ' + errorMessage);
                    
                    // Reset button after brief delay
                    setTimeout(function() {
                        button.text('🗑️');
                    }, 2000);
                }
            },
            error: function(xhr, status, error) {
                console.error('🚨 Delete trainer AJAX error:', {
                    status: status,
                    error: error,
                    response: xhr.responseText,
                    statusCode: xhr.status
                });
                
                // Restore row state
                trainerRow.removeClass('deleting').css('opacity', '1');
                button.prop('disabled', false).text('❌');
                
                // Show detailed error message
                var errorMessage = 'Error deleting trainer: ';
                if (status === 'timeout') {
                    errorMessage += 'Request timed out. Please try again.';
                } else if (xhr.status === 0) {
                    errorMessage += 'Network connection error.';
                } else if (xhr.status === 500) {
                    errorMessage += 'Server error. Please check admin logs.';
                } else {
                    errorMessage += error || 'Unknown error occurred.';
                }
                
                alert('❌ ' + errorMessage);
                
                // Reset button after brief delay
                setTimeout(function() {
                    button.text('🗑️');
                }, 2000);
            }
        });
    });
    
    // Update trainer name display
    $(document).on('input', '.trainer-name-input', function() {
        var name = $(this).val() || 'New Trainer';
        $(this).closest('.trainer-row').find('.trainer-name-display').text(name);
    });
    
    // Media library integration
    $(document).on('click', '.upload-image-button', function(e) {
        e.preventDefault();
        var button = $(this);
        var targetInput = button.siblings('.image-url-input');
        
        var frame = wp.media({
            title: 'Select Trainer Image',
            button: { text: 'Use Image' },
            multiple: false
        });
        
        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            targetInput.val(attachment.url);
            
            // Trigger change event to show unsaved changes
            targetInput.trigger('change');
        });
        
        frame.open();
    });
    
    // Test frontend data flow
    $('#test-frontend-data').on('click', function() {
        var button = $(this);
        button.prop('disabled', true).text('🔍 Testing...');
        
        console.log('🧪 Testing Personal Training frontend data flow...');
        
        // Test AJAX endpoint to get current data
        $.ajax({
            url: fitcopilotPersonalTrainingAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'test_personal_training_frontend_data',
                nonce: fitcopilotPersonalTrainingAjax.nonce
            },
            dataType: 'json',
            success: function(response) {
                console.log('🧪 Frontend data test response:', response);
                
                if (response.success) {
                    var data = response.data;
                    
                    console.log('📊 Data Test Results:', {
                        totalTrainers: data.total_count,
                        activeTrainers: data.active_count,
                        providerFunction: data.provider_working ? 'EXISTS' : 'MISSING',
                        lastUpdated: data.last_updated,
                        hasSettings: data.settings_exist,
                        sampleTrainer: data.sample_trainer
                    });
                    
                    // Show test results in admin
                    var results = '✅ Test Results:\n';
                    results += 'Total Trainers: ' + data.total_count + '\n';
                    results += 'Active Trainers: ' + data.active_count + '\n';
                    results += 'Data Provider: ' + (data.provider_working ? 'Working' : 'Not Found') + '\n';
                    results += 'Last Updated: ' + data.last_updated + '\n';
                    
                    if (data.sample_trainer) {
                        results += 'Sample Trainer: ' + data.sample_trainer.name + ' (' + data.sample_trainer.specialty + ')';
                    }
                    
                    alert(results);
                } else {
                    console.error('❌ Frontend data test failed:', response.message);
                    alert('❌ Test failed: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('🚨 Frontend data test error:', error);
                alert('❌ Test error: ' + error);
            },
            complete: function() {
                button.prop('disabled', false).text('🔍 Test Frontend Data Flow');
            }
        });
    });
    
    // Debug Test Save (only available in WP_DEBUG mode)
    $('#debug-test-save').on('click', function() {
        var button = $(this);
        button.prop('disabled', true).text('🔧 Testing...');
        
        console.log('🔧 Running debug test save...');
        
        // Test with known good data
        var testTrainerData = {
            id: 999,
            name: 'Debug Test Trainer',
            specialty: 'Debug Testing',
            bio: 'This is a test trainer created for debugging purposes.',
            image_url: '',
            years_experience: 5,
            clients_count: 100,
            featured: '1',
            active: '1',
            coach_type: 'strength',
            video_title: 'Debug Test Video',
            video_url: '',
            video_poster: '',
            order: 99
        };
        
        var ajaxData = {
            action: 'save_individual_trainer',
            nonce: fitcopilotPersonalTrainingAjax.nonce,
            trainer_data: testTrainerData,
            trainer_index: 999
        };
        
        console.log('🔧 Debug test AJAX data:', ajaxData);
        
        $.ajax({
            url: fitcopilotPersonalTrainingAjax.ajax_url,
            type: 'POST',
            data: ajaxData,
            dataType: 'json',
            timeout: 30000,
            success: function(response) {
                console.log('✅ Debug test response:', response);
                
                if (response.success) {
                    alert('✅ Debug Test PASSED!\n\nTrainer saved successfully:\n' +
                          'Name: ' + response.trainer_name + '\n' +
                          'ID: ' + response.trainer_id + '\n' +
                          'Status: ' + response.active_status + '\n' +
                          'Operation: ' + response.operation);
                } else {
                    alert('❌ Debug Test FAILED!\n\nError: ' + response.message +
                          '\n\nCheck browser console for details.');
                }
            },
            error: function(xhr, status, error) {
                console.error('🚨 Debug test AJAX error:', {
                    status: status,
                    error: error,
                    response: xhr.responseText
                });
                
                alert('❌ Debug Test ERROR!\n\nAJAX Error: ' + error +
                      '\nStatus: ' + status +
                      '\n\nCheck browser console for details.');
            },
            complete: function() {
                button.prop('disabled', false).text('🔧 Debug Test Save');
            }
        });
    });
    
    // Activate All Trainers (Debug Mode)
    $('#activate-all-trainers').on('click', function() {
        var button = $(this);
        var confirmed = confirm('🔧 DEBUG: Activate all trainers?\n\nThis will set all trainers to "active" so they appear on the frontend.');
        
        if (!confirmed) {
            return;
        }
        
        button.prop('disabled', true).text('✅ Activating...');
        
        console.log('🔧 Activating all trainers...');
        
        // Find all trainer rows and activate them
        $('.trainer-row').each(function(index) {
            var row = $(this);
            var checkbox = row.find('input[name*="[active]"]');
            
            // Check the active checkbox
            checkbox.prop('checked', true);
            
            // Add unsaved changes indicator
            row.addClass('has-unsaved-changes');
            row.find('.save-individual-trainer').addClass('has-changes');
            
            console.log('✅ Activated trainer at index:', index);
        });
        
        // Visual feedback
        setTimeout(function() {
            button.prop('disabled', false).text('✅ Activate All Trainers');
            alert('✅ All trainers activated!\n\nNow use "Save All Changes" or individual save buttons to persist the changes.');
        }, 500);
    });
    
    // Clean Debug Data (Debug Mode)
    $('#cleanup-debug-data').on('click', function() {
        var button = $(this);
        var confirmed = confirm('🧹 DEBUG: Clean up debug/test data?\n\nThis will remove any trainers with "debug", "test", or similar keywords in their names.\n\nThis action cannot be undone.');
        
        if (!confirmed) {
            return;
        }
        
        button.prop('disabled', true).text('🧹 Cleaning...');
        
        console.log('🧹 Cleaning debug data...');
        
        // Find trainer rows with debug/test data and remove them
        var removedCount = 0;
        $('.trainer-row').each(function(index) {
            var row = $(this);
            var nameInput = row.find('input[name*="[name]"]');
            var name = nameInput.val() || '';
            
            // Check if name contains debug/test keywords
            var debugKeywords = ['debug', 'test', 'temp', 'sample', 'example'];
            var isDebugData = debugKeywords.some(keyword => 
                name.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (isDebugData) {
                console.log('🗑️ Removing debug trainer:', name);
                row.fadeOut(300, function() {
                    $(this).remove();
                });
                removedCount++;
            }
        });
        
        // Visual feedback
        setTimeout(function() {
            button.prop('disabled', false).text('🧹 Clean Debug Data');
            
            if (removedCount > 0) {
                alert(`🧹 Cleanup Complete!\n\nRemoved ${removedCount} debug/test trainer(s).\n\nNow click "Save All Changes" to persist the cleanup.`);
            } else {
                alert('✅ No debug data found!\n\nYour trainer data is already clean.');
            }
        }, 500);
    });
    
    // Reset to Defaults (Debug Mode)
    $('#reset-to-defaults').on('click', function() {
        var button = $(this);
        var confirmed = confirm('🔄 DEBUG: Reset to default trainers?\n\nThis will:\n• Remove ALL existing trainers\n• Load clean default data (4 production trainers)\n• Set all trainers to active\n\nThis action cannot be undone.');
        
        if (!confirmed) {
            return;
        }
        
        button.prop('disabled', true).text('🔄 Resetting...');
        
        console.log('🔄 Resetting to default trainers...');
        
        // Make AJAX call to reset data
        $.ajax({
            url: fitcopilotPersonalTrainingAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'reset_personal_training_defaults',
                nonce: fitcopilotPersonalTrainingAjax.nonce
            },
            dataType: 'json',
            timeout: 30000,
            success: function(response) {
                console.log('✅ Reset response:', response);
                
                if (response.success) {
                    alert('✅ Reset Complete!\n\n' +
                          'Loaded ' + response.trainer_count + ' default trainers.\n' +
                          'All trainers are active and will appear on frontend.\n\n' +
                          'Page will reload to show updated data.');
                    
                    // Reload the page to show fresh data
                    window.location.reload();
                } else {
                    alert('❌ Reset Failed!\n\nError: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('🚨 Reset AJAX error:', {
                    status: status,
                    error: error,
                    response: xhr.responseText
                });
                
                alert('❌ Reset ERROR!\n\nAJAX Error: ' + error + '\nStatus: ' + status);
            },
            complete: function() {
                button.prop('disabled', false).text('🔄 Reset to Defaults');
            }
        });
    });
}); 