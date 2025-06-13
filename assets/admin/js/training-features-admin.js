/**
 * FitCopilot Training Features Admin JavaScript
 * 
 * Handles interactive functionality for the Training Features admin interface
 * Following the established Personal Training Admin JavaScript patterns
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

(function($) {
    'use strict';
    
    /**
     * Training Features Admin Controller
     */
    const TrainingFeaturesAdmin = {
        
        /**
         * Configuration and state
         */
        config: {
            featureIndex: 0,
            isLoading: false,
            ajax: window.fitcopilotTrainingFeaturesAjax || {}
        },
        
        /**
         * Initialize the admin interface
         */
        init: function() {
            console.log('🚀 Training Features Admin initializing...');
            
            this.bindEvents();
            this.initializeFeatureIndex();
            this.initializeMediaUploader();
            this.initializeDynamicTitleUpdates();
            this.initializeValidation();
            
            console.log('✅ Training Features Admin initialized successfully');
        },
        
        /**
         * Bind event handlers
         */
        bindEvents: function() {
            // Add new feature
            $(document).on('click', '#add-new-feature', this.addNewFeature.bind(this));
            
            // Remove feature
            $(document).on('click', '.remove-feature-row', this.removeFeature.bind(this));
            
            // Individual feature save
            $(document).on('click', '.save-individual-feature', this.saveIndividualFeature.bind(this));
            
            // Test frontend data
            $(document).on('click', '#test-frontend-data', this.testFrontendData.bind(this));
            
            // Export features
            $(document).on('click', '#export-features', this.exportFeatures.bind(this));
            
            // Feature title changes
            $(document).on('input', '.feature-title-input', this.updateFeatureName.bind(this));
            
            // Icon type changes
            $(document).on('change', '.icon-type-select', this.toggleIconOptions.bind(this));
            
            // Active/inactive toggle changes
            $(document).on('change', 'input[name*="[is_active]"]', this.toggleFeatureStatus.bind(this));
            
            // Media upload buttons (both old and new Phase 3 buttons)
            $(document).on('click', '.upload-image-button', this.openMediaUploader.bind(this));
            $(document).on('click', '.upload-media-library-button', this.openMediaLibraryUploader.bind(this));
            
            // Image/media remove buttons
            $(document).on('click', '.remove-image-button', this.removeImage.bind(this));
            
            // Form submission prevention for individual saves
            $(document).on('submit', '#training-features-form', this.handleFormSubmission.bind(this));
            
            // Real-time field validation
            $(document).on('blur', 'input[required], textarea[required]', this.validateField.bind(this));
            
            // Add visual feedback for form changes (Personal Training pattern)
            $(document).on('input change', '.feature-row input, .feature-row textarea, .feature-row select', this.handleFormChanges.bind(this));
            
            // Keyboard shortcut for save (Personal Training pattern - Ctrl+S or Cmd+S)
            $(document).on('keydown', '.feature-row', this.handleKeyboardShortcuts.bind(this));

            // ===== NEW PHASE 1 ENHANCEMENTS =====
            
            // Collapsible section toggles
            $(document).on('click', '.clickable-header', this.toggleCollapsibleSection.bind(this));
            
            // Bulk actions
            $(document).on('click', '#apply-bulk-action', this.applyBulkAction.bind(this));
            $(document).on('change', '#select-all-features', this.toggleSelectAll.bind(this));
            $(document).on('change', '.feature-bulk-select', this.updateSelectAllState.bind(this));
            
            // Enhanced keyboard navigation for accessibility
            $(document).on('keydown', '.clickable-header', this.handleSectionKeyboard.bind(this));
        },
        
        /**
         * Initialize feature index counter
         */
        initializeFeatureIndex: function() {
            const existingFeatures = $('.feature-row:not([data-index="{{INDEX}}"])');
            this.config.featureIndex = existingFeatures.length;
            console.log(`📊 Found ${this.config.featureIndex} existing features`);
        },
        
        /**
         * Add new feature row
         */
        addNewFeature: function(e) {
            e.preventDefault();
            
            console.log('➕ Adding new feature...');
            
            const template = $('#feature-template').html();
            const newIndex = this.config.featureIndex++;
            const newFeatureHtml = template.replace(/{{INDEX}}/g, newIndex);
            
            const $newFeature = $(newFeatureHtml);
            $newFeature.hide().appendTo('#features-container').fadeIn(300);
            
            // Focus on the title field
            $newFeature.find('.feature-title-input').focus();
            
            // Initialize new feature
            this.initializeFeatureRow($newFeature);
            
            console.log(`✅ Added new feature with index ${newIndex}`);
        },
        
        /**
         * Remove feature row
         */
        removeFeature: function(e) {
            e.preventDefault();
            
            const $featureRow = $(e.target).closest('.feature-row');
            const featureName = $featureRow.find('.feature-name-display').text() || 'New Feature';
            
            if (confirm(`${this.config.ajax.confirm_delete || 'Are you sure you want to delete this feature?'}\n\nFeature: ${featureName}`)) {
                console.log(`🗑️ Removing feature: ${featureName}`);
                
                $featureRow.fadeOut(300, function() {
                    $(this).remove();
                });
            }
        },
        
        /**
         * Save individual feature via AJAX
         */
        saveIndividualFeature: function(e) {
            e.preventDefault();
            
            const $button = $(e.target);
            const featureIndex = $button.data('feature-index');
            const featureId = $button.data('feature-id') || '';
            const $featureRow = $button.closest('.feature-row');
            const $statusSpan = $featureRow.find('.save-status');
            
            const featureName = $featureRow.find('.feature-title-input').val() || 'Unnamed Feature';
            
            console.log(`💾 Saving individual feature: ${featureName} (Index: ${featureIndex})`);
            
            // Loading spinner removed - green checkmark provides sufficient feedback
            
            // Collect feature data
            const featureData = this.collectFeatureData($featureRow, featureIndex);
            
            // AJAX request (Personal Training pattern exactly)
            var ajaxData = {
                action: 'save_individual_feature',           // Match Personal Training action exactly
                nonce: this.config.ajax.nonce,
                feature_data: featureData,                   // Match Personal Training data structure  
                feature_index: featureIndex                  // Match Personal Training index parameter
            };
            
            console.log('🌐 AJAX data being sent (Personal Training pattern):', ajaxData);
            
            $.ajax({
                url: this.config.ajax.ajax_url,
                type: 'POST',
                data: ajaxData,
                dataType: 'json',
                timeout: 30000, // 30 second timeout (Personal Training pattern)
                success: (response) => {
                    console.log('✅ Training Features AJAX Response:', response);
                    
                    if (response.success) {
                        // Show success state with feature name (Personal Training pattern)
                        var successMessage = this.config.ajax.saved || 'Feature saved successfully!';
                        if (response.data.feature_name) {
                            successMessage += ' (' + response.data.feature_name + ')';
                        }
                        this.showSaveStatus($statusSpan, 'success', successMessage);
                        
                        // Update feature name display if changed (Personal Training pattern)
                        if (response.data.feature_name) {
                            $featureRow.find('.feature-name-display').text(response.data.feature_name);
                        }
                        
                        // Update feature ID if returned (Personal Training pattern)
                        if (response.data.feature_id) {
                            $button.data('feature-id', response.data.feature_id);
                            $featureRow.find('input[name="features[' + featureIndex + '][id]"]').val(response.data.feature_id);
                        }
                        
                        // Flash success feedback (Personal Training pattern)
                        $featureRow.addClass('just-saved');
                        setTimeout(function() {
                            $featureRow.removeClass('just-saved');
                        }, 2000);
                        
                        // Remove unsaved changes indicator (Personal Training pattern)
                        $featureRow.removeClass('has-unsaved-changes');
                        $button.removeClass('has-changes');
                        
                        // Reset status after 3 seconds (Personal Training pattern)
                        setTimeout(() => {
                            this.showSaveStatus($statusSpan, 'hide');
                        }, 3000);
                        
                        // Log successful save for frontend verification (Personal Training pattern)
                        console.log('✅ Feature saved successfully:', {
                            name: response.data.feature_name,
                            id: response.data.feature_id,
                            status: response.data.active_status,
                            updated: response.data.updated_at
                        });
                        
                    } else {
                        // Handle validation errors with specific feedback
                        if (response.error_type === 'validation') {
                            this.showValidationErrors($featureRow, response);
                        } else {
                            // Show user-friendly error state (Enhanced Personal Training pattern)
                            var errorMessage = response.message || this.config.ajax.error || 'Save failed';
                            
                            // Log technical details for debugging while showing user-friendly message
                            if (response.technical_message) {
                                console.error('🔧 Technical error:', response.technical_message);
                            }
                            
                            this.showSaveStatus($statusSpan, 'error', errorMessage);
                        }
                            
                        console.error('❌ Feature save failed:', response.message || 'Unknown error');
                    }
                },
                error: (xhr, status, error) => {
                    console.error('🚨 AJAX Error Details:', {
                        status: status,
                        error: error,
                        response: xhr.responseText,
                        readyState: xhr.readyState,
                        statusCode: xhr.status
                    });
                    
                    // Show error state with detailed info (Personal Training pattern)
                    var errorMessage = this.config.ajax.error || 'Request failed';
                    if (status === 'timeout') {
                        errorMessage += ': Request timed out';
                    } else if (xhr.status === 0) {
                        errorMessage += ': Network connection error';
                    } else if (xhr.status === 500) {
                        errorMessage += ': Server error (500)';
                    } else {
                        errorMessage += ': ' + (error || 'Unknown error');
                    }
                    
                    this.showSaveStatus($statusSpan, 'error', errorMessage);
                }
                // Loading spinner removed - complete callback no longer needed
            });
        },
        
        /**
         * Test frontend data flow
         */
        testFrontendData: function(e) {
            e.preventDefault();
            
            console.log('🔍 Testing frontend data flow...');
            
            const $button = $(e.target);
            // Loading spinner removed
            
            $.ajax({
                url: this.config.ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'test_training_features_frontend_data',
                    nonce: this.config.ajax.nonce
                },
                success: (response) => {
                    console.log('📊 Frontend data test results:', response);
                    
                    if (response.success) {
                        const data = response.data;
                        const stats = data.statistics || {};
                        
                        let message = `Frontend Data Test Results:\n\n`;
                        message += `Total Features: ${stats.total || 0}\n`;
                        message += `Active Features: ${stats.active || 0}\n`;
                        message += `Featured Features: ${stats.featured || 0}\n`;
                        message += `Data Provider Working: ${data.provider_working ? 'Yes' : 'No'}\n`;
                        
                        if (data.sample_feature) {
                            message += `\nSample Feature:\n`;
                            message += `- Name: ${data.sample_feature.title || 'N/A'}\n`;
                            message += `- Type: ${data.sample_feature.featureType || 'N/A'}\n`;
                            message += `- Active: ${data.sample_feature.isActive ? 'Yes' : 'No'}`;
                        }
                        
                        alert(message);
                    } else {
                        alert(`Test failed: ${response.data?.message || 'Unknown error'}`);
                    }
                },
                error: (xhr, status, error) => {
                    console.error('❌ Test failed:', error);
                    alert(`Test failed: ${error}`);
                }
                // Loading spinner removed - complete callback no longer needed
            });
        },
        
        /**
         * Export features as JSON
         */
        exportFeatures: function(e) {
            e.preventDefault();
            
            console.log('📥 Exporting features...');
            
            const $button = $(e.target);
            // Loading spinner removed
            
            $.ajax({
                url: this.config.ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'export_training_features',
                    nonce: this.config.ajax.nonce
                },
                success: (response) => {
                    if (response.success) {
                        const data = response.data;
                        const jsonString = JSON.stringify(data.features, null, 2);
                        const blob = new Blob([jsonString], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `training-features-export-${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        
                        console.log('✅ Features exported successfully');
                    } else {
                        alert(`Export failed: ${response.data?.message || 'Unknown error'}`);
                    }
                },
                error: (xhr, status, error) => {
                    console.error('❌ Export failed:', error);
                    alert(`Export failed: ${error}`);
                }
                // Loading spinner removed - complete callback no longer needed
            });
        },
        
        /**
         * Update feature name display
         */
        updateFeatureName: function(e) {
            const $input = $(e.target);
            const $featureRow = $input.closest('.feature-row');
            const $nameDisplay = $featureRow.find('.feature-name-display');
            
            const newName = $input.val().trim() || 'New Feature';
            $nameDisplay.text(newName);
        },
        
        /**
         * Toggle icon options based on icon type
         */
        toggleIconOptions: function(e) {
            const iconType = $(e.target).val();
            const $featureRow = $(e.target).closest('.feature-row');
            const $iconNameField = $featureRow.find('.icon-name-field');
            
            if (iconType === 'lucide') {
                $iconNameField.show();
            } else {
                $iconNameField.hide();
            }
        },
        
        /**
         * Toggle feature active/inactive status
         */
        toggleFeatureStatus: function(e) {
            const $checkbox = $(e.target);
            const $featureRow = $checkbox.closest('.feature-row');
            const isActive = $checkbox.prop('checked');
            
            if (isActive) {
                $featureRow.removeClass('inactive');
                $featureRow.find('.inactive-notice').hide();
            } else {
                $featureRow.addClass('inactive');
                $featureRow.find('.inactive-notice').show();
            }
        },
        
        /**
         * Initialize WordPress media uploader
         */
        initializeMediaUploader: function() {
            // Only initialize if wp.media is available
            if (typeof wp !== 'undefined' && wp.media) {
                console.log('📷 Media uploader initialized');
            } else {
                console.warn('⚠️ WordPress media uploader not available');
            }
        },
        
        /**
         * Open media uploader
         */
        openMediaUploader: function(e) {
            e.preventDefault();
            
            if (typeof wp === 'undefined' || !wp.media) {
                alert('Media uploader not available. Please enter the URL manually.');
                return;
            }
            
            const $button = $(e.target);
            const $featureRow = $button.closest('.feature-row');
            const $urlInput = $featureRow.find('.image-url-input');
            
            const mediaUploader = wp.media({
                title: 'Choose Feature Image',
                button: {
                    text: 'Use this image'
                },
                multiple: false,
                library: {
                    type: 'image'
                }
            });
            
            mediaUploader.on('select', function() {
                const attachment = mediaUploader.state().get('selection').first().toJSON();
                
                $urlInput.val(attachment.url);
                
                // Update preview
                let $preview = $featureRow.find('.image-preview');
                if ($preview.length === 0) {
                    $preview = $('<div class="image-preview"></div>');
                    $button.parent().after($preview);
                }
                
                $preview.html(`<img src="${attachment.url}" alt="Feature image" style="max-width: 100px; height: auto; margin-top: 10px; border-radius: 6px;" />`);
                
                console.log('✅ Image selected:', attachment.url);
            });
            
            mediaUploader.open();
        },
        
        /**
         * Open WordPress media library for Phase 3 enhanced buttons
         */
        openMediaLibraryUploader: function(e) {
            e.preventDefault();
            
            if (typeof wp === 'undefined' || !wp.media) {
                alert('WordPress media library not available. Please enter the URL manually.');
                return;
            }
            
            const $button = $(e.target);
            const mediaType = $button.data('media-type') || 'image';
            const targetField = $button.data('target');
            const previewTarget = $button.data('preview-target');
            
            // Find the target input field - use more flexible selectors
            let $targetInput;
            
            // First try by exact name attribute
            $targetInput = $button.closest('.enhanced-media-upload-group').find('input[name="' + targetField + '"]');
            
            // If not found, try by class-based selectors for specific media types
            if ($targetInput.length === 0) {
                if (mediaType === 'video') {
                    $targetInput = $button.closest('.enhanced-video-upload-group').find('.video-url-input');
                } else if (mediaType === 'image') {
                    $targetInput = $button.closest('.enhanced-media-upload-group').find('.image-url-input, .poster-url-input');
                }
            }
            
            // Final fallback - find any URL input in the container
            if ($targetInput.length === 0) {
                $targetInput = $button.closest('.enhanced-media-upload-group, .enhanced-video-upload-group').find('input[type="url"]').first();
            }
            
            if ($targetInput.length === 0) {
                console.error('Target input field not found:', targetField, 'Media type:', mediaType);
                console.log('Button context:', $button.closest('.enhanced-media-upload-group, .enhanced-video-upload-group')[0]);
                return;
            }
            
            console.log('✅ Found target input:', $targetInput[0], 'for media type:', mediaType);
            
            // Configure media uploader based on media type
            const mediaConfig = {
                title: mediaType === 'video' ? 'Choose Video' : 'Choose Image',
                button: {
                    text: mediaType === 'video' ? 'Use this video' : 'Use this image'
                },
                multiple: false,
                library: {
                    type: mediaType === 'video' ? ['video'] : ['image']
                }
            };
            
            const mediaUploader = wp.media(mediaConfig);
            
            mediaUploader.on('select', function() {
                const attachment = mediaUploader.state().get('selection').first().toJSON();
                
                // Update the input field
                $targetInput.val(attachment.url);
                
                // Update preview if specified
                if (previewTarget) {
                    const $previewContainer = $('#' + previewTarget);
                    if ($previewContainer.length > 0) {
                        if (mediaType === 'video') {
                            // Enhanced video preview with proper WordPress structure
                            $previewContainer.html(`
                                <div class="video-preview-wrapper">
                                    <div class="video-thumbnail">
                                        <video controls style="max-width: 200px; max-height: 150px; border-radius: 6px;">
                                            <source src="${attachment.url}" type="${attachment.mime || 'video/mp4'}">
                                            Your browser does not support the video tag.
                                        </video>
                                        <div class="video-play-overlay">
                                            <button type="button" class="video-play-button">▶️</button>
                                        </div>
                                    </div>
                                    <div class="video-metadata">
                                        <small class="video-info">Video: ${attachment.filename}</small>
                                    </div>
                                </div>
                            `);
                        } else {
                            // Enhanced image preview
                            $previewContainer.html(`
                                <div class="image-preview-container">
                                    <img src="${attachment.url}" alt="Preview" style="max-width: 200px; max-height: 150px; border-radius: 6px; object-fit: cover;" />
                                    <div class="image-metadata">
                                        <small class="image-info">Image: ${attachment.filename}</small>
                                    </div>
                                </div>
                            `);
                        }
                    }
                }
                
                // Show success feedback
                const $feedback = $button.closest('.enhanced-media-upload-group').find('.media-validation-feedback');
                if ($feedback.length > 0) {
                    $feedback.html('<span class="validation-success">✅ Media selected successfully</span>').show();
                    setTimeout(() => {
                        $feedback.fadeOut();
                    }, 3000);
                }
                
                console.log('✅ Media selected:', attachment.url);
            });
            
            mediaUploader.open();
        },
        
        /**
         * Remove image/media from feature
         */
        removeImage: function(e) {
            e.preventDefault();
            
            const $button = $(e.target);
            const targetField = $button.data('target');
            const previewTarget = $button.data('preview-target');
            
            // Confirm removal
            if (!confirm('Are you sure you want to remove this image? This action cannot be undone.')) {
                return;
            }
            
            // Find and clear the input field
            let $targetInput;
            if (targetField) {
                // Try to find by exact name attribute
                $targetInput = $('input[name="' + targetField + '"]');
                
                // Fallback to finding within the same container
                if ($targetInput.length === 0) {
                    $targetInput = $button.closest('.enhanced-media-upload-group, .enhanced-video-upload-group')
                                         .find('input[type="url"]').first();
                }
            }
            
            if ($targetInput.length > 0) {
                // Clear the input field
                $targetInput.val('').trigger('change');
                
                // Update preview container
                if (previewTarget) {
                    const $previewContainer = $('#' + previewTarget);
                    if ($previewContainer.length > 0) {
                        $previewContainer.html(`
                            <div class="no-image-placeholder">
                                <div class="placeholder-icon">🖼️</div>
                                <p>No image selected</p>
                            </div>
                        `);
                    }
                } else {
                    // Fallback: find and update preview in the same container
                    const $previewContainer = $button.closest('.image-preview-container');
                    if ($previewContainer.length > 0) {
                        $previewContainer.closest('.enhanced-image-preview').html(`
                            <div class="no-image-placeholder">
                                <div class="placeholder-icon">🖼️</div>
                                <p>No image selected</p>
                            </div>
                        `);
                    }
                }
                
                // Show success feedback
                const $feedback = $button.closest('.enhanced-media-upload-group, .enhanced-video-upload-group')
                                        .find('.media-validation-feedback');
                if ($feedback.length > 0) {
                    $feedback.html('<span class="validation-success">✅ Image removed successfully</span>').show();
                    setTimeout(() => {
                        $feedback.fadeOut();
                    }, 3000);
                }
                
                console.log('✅ Image removed from field:', targetField);
            } else {
                console.error('❌ Could not find target input field:', targetField);
                alert('Error: Could not remove image. Please try refreshing the page.');
            }
        },
        
        /**
         * Initialize dynamic title updates
         */
        initializeDynamicTitleUpdates: function() {
            $('.feature-title-input').each(function() {
                const $input = $(this);
                const $featureRow = $input.closest('.feature-row');
                const $nameDisplay = $featureRow.find('.feature-name-display');
                
                if ($input.val()) {
                    $nameDisplay.text($input.val());
                }
            });
        },
        
        /**
         * Initialize form validation
         */
        initializeValidation: function() {
            console.log('🔍 Form validation initialized');
        },
        
        /**
         * Validate individual field
         */
        validateField: function(e) {
            const $field = $(e.target);
            const value = $field.val().trim();
            const isRequired = $field.prop('required');
            const fieldType = $field.attr('type') || 'text';
            
            let isValid = true;
            let errorMessage = '';
            
            // Required validation
            if (isRequired && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            
            // URL validation
            if (fieldType === 'url' && value) {
                const urlPattern = /^https?:\/\/.+/;
                if (!urlPattern.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid URL (starting with http:// or https://)';
                }
            }
            
            // Number validation
            if (fieldType === 'number' && value) {
                const min = $field.attr('min');
                const max = $field.attr('max');
                const numValue = parseFloat(value);
                
                if (min && numValue < parseFloat(min)) {
                    isValid = false;
                    errorMessage = `Value must be at least ${min}`;
                }
                
                if (max && numValue > parseFloat(max)) {
                    isValid = false;
                    errorMessage = `Value must be no more than ${max}`;
                }
            }
            
            // Update field appearance
            if (isValid) {
                $field.removeClass('error').addClass('valid');
                this.removeFieldError($field);
            } else {
                $field.removeClass('valid').addClass('error');
                this.showFieldError($field, errorMessage);
            }
            
            return isValid;
        },
        
        /**
         * Show field error
         */
        showFieldError: function($field, message) {
            this.removeFieldError($field);
            
            const $error = $(`<div class="field-error" style="color: #ff6b6b; font-size: 12px; margin-top: 4px;">${message}</div>`);
            $field.after($error);
        },
        
        /**
         * Remove field error
         */
        removeFieldError: function($field) {
            $field.siblings('.field-error').remove();
        },
        
        /**
         * Handle form submission
         */
        handleFormSubmission: function(e) {
            // Allow normal form submission for "Save All" button
            const isIndividualSave = $(e.relatedTarget).hasClass('save-individual-feature');
            
            if (isIndividualSave) {
                e.preventDefault();
                return false;
            }
            
            // Validate all required fields before submission
            let isValid = true;
            $('input[required], textarea[required]').each((index, field) => {
                if (!this.validateField({ target: field })) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fix the validation errors before saving.');
                return false;
            }
            
            console.log('📝 Form submitted for bulk save');
            return true;
        },
        
        /**
         * Initialize feature row
         */
        initializeFeatureRow: function($featureRow) {
            // Set up icon type toggles
            const iconType = $featureRow.find('.icon-type-select').val();
            this.toggleIconOptions({ target: $featureRow.find('.icon-type-select')[0] });
            
            // Set up active/inactive status
            const isActive = $featureRow.find('input[name*="[is_active]"]').prop('checked');
            if (!isActive) {
                $featureRow.addClass('inactive');
            }
        },
        
        /**
         * Collect feature data from form
         */
        collectFeatureData: function($featureRow, index) {
            const data = {};
            
            // Collect all form fields for this feature
            $featureRow.find('input, select, textarea').each(function() {
                const $field = $(this);
                const name = $field.attr('name');
                
                if (name && name.includes(`[${index}]`)) {
                    // Extract field name (e.g., "features[0][title]" -> "title")
                    const fieldName = name.match(/\[([^\]]+)\]$/);
                    if (fieldName && fieldName[1]) {
                        const key = fieldName[1];
                        
                        if ($field.attr('type') === 'checkbox') {
                            data[key] = $field.prop('checked') ? 1 : 0;
                        } else {
                            data[key] = $field.val();
                        }
                    }
                }
            });
            
            return data;
        },
        
        /**
         * setButtonLoading method removed - loading spinner no longer needed
         * Green checkmark provides sufficient user feedback
         */
        
        /**
         * Show save status message
         */
        showSaveStatus: function($statusSpan, type, message = '') {
            $statusSpan.removeClass('show success error');
            
            if (type === 'hide') {
                $statusSpan.removeClass('show');
                return;
            }
            
            $statusSpan.addClass('show').addClass(type).text(message);
        },
        
        /**
         * Show detailed validation errors with specific field feedback
         */
        showValidationErrors: function($featureRow, response) {
            const $statusSpan = $featureRow.find('.save-status');
            const validationErrors = response.validation_errors || [];
            const errorCount = response.error_count || validationErrors.length;
            
            // Create summary message
            const summary = errorCount === 1 
                ? "Please fix this issue:" 
                : `Please fix these ${errorCount} issues:`;
            
            // Show summary in status span
            this.showSaveStatus($statusSpan, 'error', summary);
            
            // Create detailed error popup/modal
            this.showValidationModal($featureRow, validationErrors, summary);
            
            // Highlight problematic fields
            this.highlightErrorFields($featureRow, validationErrors);
            
            // Log detailed validation errors for debugging
            console.error('🔧 Validation errors:', validationErrors);
        },
        
        /**
         * Show validation errors in a modal dialog
         */
        showValidationModal: function($featureRow, errors, summary) {
            // Remove any existing validation modal
            $('.validation-error-modal').remove();
            
            // Create modal HTML
            const modalHtml = `
                <div class="validation-error-modal" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 2px solid #dc3232;
                    border-radius: 8px;
                    padding: 20px;
                    max-width: 500px;
                    max-height: 400px;
                    overflow-y: auto;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">
                    <div class="modal-header" style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #ddd;
                    ">
                        <h3 style="margin: 0; color: #dc3232; font-size: 18px;">
                            ⚠️ Validation Errors
                        </h3>
                        <button class="close-modal" style="
                            background: none;
                            border: none;
                            font-size: 24px;
                            cursor: pointer;
                            color: #666;
                            padding: 0;
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p style="margin: 0 0 15px 0; font-weight: 600; color: #333;">
                            ${summary}
                        </p>
                        <ol style="margin: 0; padding-left: 20px; line-height: 1.6;">
                            ${errors.map(error => `<li style="margin-bottom: 8px; color: #555;">${error}</li>`).join('')}
                        </ol>
                    </div>
                    <div class="modal-footer" style="
                        margin-top: 20px;
                        padding-top: 15px;
                        border-top: 1px solid #ddd;
                        text-align: right;
                    ">
                        <button class="close-modal button button-primary" style="
                            background: #0073aa;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                        ">Got it</button>
                    </div>
                </div>
                <div class="validation-modal-overlay" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                "></div>
            `;
            
            // Add modal to page
            $('body').append(modalHtml);
            
            // Handle modal close
            $('.close-modal, .validation-modal-overlay').on('click', function() {
                $('.validation-error-modal, .validation-modal-overlay').remove();
            });
            
            // Handle escape key
            $(document).on('keydown.validation-modal', function(e) {
                if (e.keyCode === 27) { // Escape key
                    $('.validation-error-modal, .validation-modal-overlay').remove();
                    $(document).off('keydown.validation-modal');
                }
            });
        },
        
        /**
         * Highlight fields that have validation errors
         */
        highlightErrorFields: function($featureRow, errors) {
            // Remove existing error highlights
            $featureRow.find('.field-error').removeClass('field-error');
            
            // Map error messages to field selectors
            const fieldMappings = {
                'Feature Title': 'input[name*="[title]"]',
                'Feature Description': 'textarea[name*="[description]"]',
                'Image URL': 'input[name*="[image_url]"]',
                'Video URL': 'input[name*="[video_url]"]',
                'Video Poster URL': 'input[name*="[video_poster]"]',
                'CTA Button URL': 'input[name*="[cta_url]"]',
                'Duration': 'input[name*="[duration_minutes]"]',
                'Feature Type': 'select[name*="[feature_type]"]',
                'Difficulty Level': 'select[name*="[difficulty_level]"]'
            };
            
            // Highlight fields mentioned in error messages
            errors.forEach(error => {
                Object.keys(fieldMappings).forEach(fieldName => {
                    if (error.includes(fieldName)) {
                        const $field = $featureRow.find(fieldMappings[fieldName]);
                        $field.addClass('field-error');
                        
                        // Add red border styling
                        $field.css({
                            'border-color': '#dc3232',
                            'box-shadow': '0 0 0 1px #dc3232'
                        });
                        
                        // Remove error styling when user starts typing
                        $field.one('input change', function() {
                            $(this).removeClass('field-error').css({
                                'border-color': '',
                                'box-shadow': ''
                            });
                        });
                    }
                });
            });
        },
        
        /**
         * Handle form changes (Personal Training pattern)
         */
        handleFormChanges: function(e) {
            var $featureRow = $(e.target).closest('.feature-row');
            var $saveButton = $featureRow.find('.save-individual-feature');
            
            // Add "unsaved changes" indicator
            if (!$featureRow.hasClass('has-unsaved-changes')) {
                $featureRow.addClass('has-unsaved-changes');
                $saveButton.addClass('has-changes');
            }
        },
        
        /**
         * Handle keyboard shortcuts (Personal Training pattern)
         */
        handleKeyboardShortcuts: function(e) {
            if ((e.ctrlKey || e.metaKey) && e.which === 83) { // Ctrl/Cmd + S
                e.preventDefault();
                $(e.target).closest('.feature-row').find('.save-individual-feature').click();
            }
        },

        // ===== PHASE 1 ENHANCEMENT METHODS =====

        /**
         * Toggle collapsible section
         */
        toggleCollapsibleSection: function(e) {
            e.preventDefault();
            
            const $header = $(e.currentTarget);
            const sectionId = $header.data('section');
            const $content = $('#' + sectionId);
            const $icon = $header.find('.collapse-icon');
            
            if ($content.hasClass('collapsed')) {
                // Expand section
                $content.removeClass('collapsed');
                $icon.css('transform', 'rotate(0deg)');
                console.log(`📖 Expanded section: ${sectionId}`);
            } else {
                // Collapse section
                $content.addClass('collapsed');
                $icon.css('transform', 'rotate(-90deg)');
                console.log(`📕 Collapsed section: ${sectionId}`);
            }
        },

        /**
         * Handle section keyboard navigation for accessibility
         */
        handleSectionKeyboard: function(e) {
            if (e.which === 13 || e.which === 32) { // Enter or Space
                e.preventDefault();
                this.toggleCollapsibleSection(e);
            }
        },

        /**
         * Apply bulk action to selected features
         */
        applyBulkAction: function(e) {
            e.preventDefault();
            
            const action = $('#bulk-action-select').val();
            const $selectedFeatures = $('.feature-bulk-select:checked');
            
            if (!action) {
                alert('Please select a bulk action first.');
                return;
            }
            
            if ($selectedFeatures.length === 0) {
                alert('Please select at least one feature to apply the action to.');
                return;
            }
            
            // Confirm destructive actions
            if (action === 'delete') {
                const confirmMessage = `Are you sure you want to delete ${$selectedFeatures.length} selected feature(s)? This cannot be undone.`;
                if (!confirm(confirmMessage)) {
                    return;
                }
            }
            
            console.log(`🔧 Applying bulk action "${action}" to ${$selectedFeatures.length} features`);
            
            // Apply action to each selected feature
            $selectedFeatures.each((index, checkbox) => {
                const $featureRow = $(checkbox).closest('.feature-row');
                const featureIndex = $(checkbox).data('feature-index');
                
                this.applyActionToFeature(action, $featureRow, featureIndex);
            });
            
            // Reset selections
            this.clearAllSelections();
            
            // Show success message
            this.showBulkActionSuccess(action, $selectedFeatures.length);
        },

        /**
         * Apply individual action to a feature
         */
        applyActionToFeature: function(action, $featureRow, featureIndex) {
            switch (action) {
                case 'activate':
                    $featureRow.find('input[name*="[is_active]"]').prop('checked', true).trigger('change');
                    break;
                    
                case 'deactivate':
                    $featureRow.find('input[name*="[is_active]"]').prop('checked', false).trigger('change');
                    break;
                    
                case 'feature':
                    $featureRow.find('input[name*="[is_featured]"]').prop('checked', true).trigger('change');
                    break;
                    
                case 'unfeature':
                    $featureRow.find('input[name*="[is_featured]"]').prop('checked', false).trigger('change');
                    break;
                    
                case 'delete':
                    $featureRow.fadeOut(300, function() {
                        $(this).remove();
                    });
                    break;
            }
        },

        /**
         * Toggle select all features
         */
        toggleSelectAll: function(e) {
            const isChecked = $(e.target).prop('checked');
            $('.feature-bulk-select').prop('checked', isChecked);
            
            console.log(`${isChecked ? '✅' : '❌'} Select all features: ${isChecked}`);
        },

        /**
         * Update select all state based on individual selections
         */
        updateSelectAllState: function() {
            const $allCheckboxes = $('.feature-bulk-select');
            const $checkedCheckboxes = $('.feature-bulk-select:checked');
            const $selectAll = $('#select-all-features');
            
            if ($checkedCheckboxes.length === 0) {
                $selectAll.prop('indeterminate', false).prop('checked', false);
            } else if ($checkedCheckboxes.length === $allCheckboxes.length) {
                $selectAll.prop('indeterminate', false).prop('checked', true);
            } else {
                $selectAll.prop('indeterminate', true).prop('checked', false);
            }
        },

        /**
         * Clear all feature selections
         */
        clearAllSelections: function() {
            $('.feature-bulk-select, #select-all-features').prop('checked', false);
            $('#select-all-features').prop('indeterminate', false);
            $('#bulk-action-select').val('');
        },

        /**
         * Show bulk action success message
         */
        showBulkActionSuccess: function(action, count) {
            const actionNames = {
                'activate': 'activated',
                'deactivate': 'deactivated', 
                'feature': 'marked as featured',
                'unfeature': 'unmarked as featured',
                'delete': 'deleted'
            };
            
            const actionName = actionNames[action] || action;
            const message = `✅ Successfully ${actionName} ${count} feature(s)`;
            
            // Create temporary success message
            const $message = $(`<div class="bulk-success-message" style="
                position: fixed;
                top: 32px;
                right: 20px;
                background: rgba(132, 225, 188, 0.9);
                color: #1a1a1a;
                padding: 12px 20px;
                border-radius: 6px;
                font-weight: 600;
                z-index: 99999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ">${message}</div>`);
            
            $('body').append($message);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                $message.fadeOut(300, function() {
                    $(this).remove();
                });
            }, 3000);
        }
    };
    
    /**
     * Global function for icon type toggle (called from PHP)
     */
    window.toggleIconOptions = function(iconType, index) {
        const $featureRow = $(`[data-index="${index}"]`);
        const $iconNameField = $featureRow.find('.icon-name-field');
        
        if (iconType === 'lucide') {
            $iconNameField.show();
        } else {
            $iconNameField.hide();
        }
    };
    
    /**
     * Initialize when document is ready
     */
    $(document).ready(function() {
        TrainingFeaturesAdmin.init();
    });
    
})(jQuery); 