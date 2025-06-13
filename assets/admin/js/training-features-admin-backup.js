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
            
            // Media upload buttons
            $(document).on('click', '.upload-image-button', this.openMediaUploader.bind(this));
            
            // Form submission prevention for individual saves
            $(document).on('submit', '#training-features-form', this.handleFormSubmission.bind(this));
            
            // Real-time field validation
            $(document).on('blur', 'input[required], textarea[required]', this.validateField.bind(this));
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
            
            // Show loading state
            this.setButtonLoading($button, true);
            this.showSaveStatus($statusSpan, 'loading', this.config.ajax.saving || 'Saving...');
            
            // Collect feature data
            const featureData = this.collectFeatureData($featureRow, featureIndex);
            
            // AJAX request
            $.ajax({
                url: this.config.ajax.ajax_url,
                type: 'POST',
                data: {
                    action: 'fitcopilot_save_individual_feature',
                    nonce: this.config.ajax.nonce,
                    feature_id: featureId,
                    feature_index: featureIndex,
                    feature: featureData
                },
                success: (response) => {
                    console.log('✅ Feature saved successfully:', response);
                    
                    if (response.success) {
                        // Update feature ID if it's a new feature
                        if (response.data && response.data.feature_id) {
                            $button.data('feature-id', response.data.feature_id);
                            $featureRow.find('input[name*="[id]"]').val(response.data.feature_id);
                        }
                        
                        this.showSaveStatus($statusSpan, 'success', this.config.ajax.saved || '✅ Saved!');
                        
                        // Update feature name display
                        $featureRow.find('.feature-name-display').text(featureData.title || 'New Feature');
                        
                        // Auto-hide success message after 3 seconds
                        setTimeout(() => {
                            this.showSaveStatus($statusSpan, 'hide');
                        }, 3000);
                        
                    } else {
                        const errorMsg = response.data?.message || 'Unknown error occurred';
                        console.error('❌ Save failed:', errorMsg);
                        this.showSaveStatus($statusSpan, 'error', `${this.config.ajax.error || '❌ Error'}: ${errorMsg}`);
                    }
                },
                error: (xhr, status, error) => {
                    console.error('❌ AJAX Error:', error);
                    this.showSaveStatus($statusSpan, 'error', `${this.config.ajax.error || '❌ Error'}: ${error}`);
                },
                complete: () => {
                    this.setButtonLoading($button, false);
                }
            });
        },
        
        /**
         * Test frontend data flow
         */
        testFrontendData: function(e) {
            e.preventDefault();
            
            console.log('🔍 Testing frontend data flow...');
            
            const $button = $(e.target);
            this.setButtonLoading($button, true);
            
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
                },
                complete: () => {
                    this.setButtonLoading($button, false);
                }
            });
        },
        
        /**
         * Export features as JSON
         */
        exportFeatures: function(e) {
            e.preventDefault();
            
            console.log('📥 Exporting features...');
            
            const $button = $(e.target);
            this.setButtonLoading($button, true);
            
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
                },
                complete: () => {
                    this.setButtonLoading($button, false);
                }
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
         * Set button loading state
         */
        setButtonLoading: function($button, isLoading) {
            if (isLoading) {
                $button.prop('disabled', true).addClass('loading');
                $button.data('original-text', $button.text());
                $button.text(this.config.ajax.saving || 'Saving...');
            } else {
                $button.prop('disabled', false).removeClass('loading');
                $button.text($button.data('original-text') || $button.text());
            }
        },
        
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