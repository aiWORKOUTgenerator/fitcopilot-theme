/**
 * FitCopilot Training Features Admin JavaScript
 * Enhanced for Phase 2 sophisticated field types and operations
 * Following Personal Training admin patterns
 */

jQuery(document).ready(function($) {
    'use strict';

    // PHASE 2: Enhanced initialization
    TrainingFeaturesAdmin.init();
});

/**
 * Main Training Features Admin Object - Phase 2 Enhanced
 */
var TrainingFeaturesAdmin = {
    
    /**
     * Initialize admin interface with Phase 2 enhancements
     */
    init: function() {
        this.bindEvents();
        this.initCollapsibleSections();
        this.initMediaValidation();
        this.initTagInputSystem();
        this.initCTAPreview();
        this.initDurationSliders();
        this.initDifficultySelector();
        this.initBulkOperations();
        this.initIndividualSave();
        
        // Legacy compatibility
        this.initLegacyFeatures();
        
        console.log('Training Features Admin (Phase 2) initialized successfully');
    },
    
    /**
     * Bind all event handlers
     */
    bindEvents: function() {
        var self = this;
        
        // Phase 2: Enhanced event bindings
        $(document).on('input', '.tag-input', function(e) {
            if (e.which === 13) { // Enter key
                self.handleTagInput(e);
            }
        });
        
        $(document).on('input', 'input[name*="[cta_text]"], input[name*="[cta_url]"]', function() {
            self.updateCTAPreview($(this));
        });
        
        $(document).on('input', '.duration-slider', function() {
            self.updateDurationDisplay($(this));
        });
        
        $(document).on('click', '.duration-preset', function() {
            self.setDurationPreset($(this));
        });
        
        $(document).on('change', '.difficulty-option input[type="radio"]', function() {
            self.updateDifficultySelection($(this));
        });
        
        $(document).on('click', '.clickable-header', function() {
            self.toggleCollapsibleSection($(this));
        });
        
        $(document).on('blur', '.image-url-input, input[name*="[video_url]"]', function() {
            self.validateMediaURL($(this));
        });
        
        $(document).on('click', '.remove-tag', function() {
            self.removeTag($(this));
        });
        
        // Enhanced bulk operations
        $(document).on('click', '#bulk-action-apply', function() {
            self.performBulkOperation();
        });
        
        $(document).on('change', '.feature-bulk-select', function() {
            self.updateBulkSelection();
        });
        
        $(document).on('change', '#bulk-select-all', function() {
            self.toggleAllSelection($(this).is(':checked'));
        });
    },
    
    /**
     * PHASE 2: Initialize collapsible sections
     */
    initCollapsibleSections: function() {
        $('.collapsible-section .clickable-header').each(function() {
            var $header = $(this);
            var $content = $header.next('.collapsible-content');
            
            // Set initial state (collapsed by default for non-essential sections)
            if ($header.data('section').indexOf('content-') === 0 || 
                $header.data('section').indexOf('cta-') === 0) {
                $content.addClass('collapsed').hide();
                $header.find('.collapse-icon').text('▶');
            }
        });
    },
    
    /**
     * PHASE 2: Toggle collapsible section
     */
    toggleCollapsibleSection: function($header) {
        var sectionId = $header.data('section');
        var $content = $('#' + sectionId);
        var $icon = $header.find('.collapse-icon');
        
        if ($content.hasClass('collapsed')) {
            $content.removeClass('collapsed').slideDown(300);
            $icon.text('▼');
        } else {
            $content.addClass('collapsed').slideUp(300);
            $icon.text('▶');
        }
        
        // Save preference to localStorage
        var collapsedSections = JSON.parse(localStorage.getItem('tf_collapsed_sections') || '[]');
        if ($content.hasClass('collapsed')) {
            if (collapsedSections.indexOf(sectionId) === -1) {
                collapsedSections.push(sectionId);
            }
        } else {
            collapsedSections = collapsedSections.filter(function(id) { return id !== sectionId; });
        }
        localStorage.setItem('tf_collapsed_sections', JSON.stringify(collapsedSections));
    },
    
    /**
     * PHASE 2: Initialize media validation
     */
    initMediaValidation: function() {
        // Add validation indicators to media fields
        $('.image-url-input, input[name*="[video_url]"]').each(function() {
            var $input = $(this);
            $input.after('<div class="media-validation-feedback"></div>');
        });
    },
    
    /**
     * PHASE 2: Validate media URL with enhanced feedback
     */
    validateMediaURL: function($input) {
        var url = $input.val().trim();
        var $feedback = $input.siblings('.media-validation-feedback');
        
        if (!url) {
            $feedback.empty();
            return;
        }
        
        var mediaType = $input.hasClass('image-url-input') ? 'image' : 'video';
        
        $feedback.html('<span class="validating">🔄 Validating...</span>');
        
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'validate_media_upload_features',
                media_url: url,
                media_type: mediaType,
                nonce: fitcopilotTrainingFeaturesAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    var data = response.data;
                    var feedback = '<span class="validation-success">✅ Valid</span>';
                    
                    if (data.suggestions && data.suggestions.length > 0) {
                        feedback += '<div class="validation-suggestions">';
                        data.suggestions.forEach(function(suggestion) {
                            feedback += '<small>💡 ' + suggestion + '</small>';
                        });
                        feedback += '</div>';
                    }
                    
                    $feedback.html(feedback);
                } else {
                    var errorFeedback = '<span class="validation-error">❌ Invalid</span>';
                    if (response.data && response.data.details) {
                        errorFeedback += '<div class="validation-details">';
                        response.data.details.forEach(function(detail) {
                            errorFeedback += '<small>' + detail + '</small>';
                        });
                        errorFeedback += '</div>';
                    }
                    $feedback.html(errorFeedback);
                }
            },
            error: function() {
                $feedback.html('<span class="validation-error">❌ Validation failed</span>');
            }
        });
    },
    
    /**
     * PHASE 2: Initialize tag input system
     */
    initTagInputSystem: function() {
        $('.tag-input').each(function() {
            var $input = $(this);
            var $tagsDisplay = $('#' + $input.data('target'));
            
            // Initialize tags from hidden input
            this.refreshTagsDisplay($input);
        }.bind(this));
    },
    
    /**
     * PHASE 2: Handle tag input (Enter key)
     */
    handleTagInput: function(e) {
        if (e.which === 13) {
            e.preventDefault();
            
            var $input = $(e.target);
            var value = $input.val().trim();
            
            if (value) {
                this.addTag($input, value);
                $input.val('');
            }
        }
    },
    
    /**
     * PHASE 2: Add tag to display and hidden input
     */
    addTag: function($input, value) {
        var $tagsDisplay = $('#' + $input.data('target'));
        var hiddenInputName = $input.data('hidden-input');
        var $hiddenInput = $('input[name="' + hiddenInputName + '"]');
        
        // Create tag element
        var $tag = $('<span class="feature-tag">' + 
                    value + 
                    '<button type="button" class="remove-tag">×</button>' +
                    '</span>');
        
        $tagsDisplay.append($tag);
        
        // Update hidden input
        var currentTags = $hiddenInput.val() ? $hiddenInput.val().split('|') : [];
        currentTags.push(value);
        $hiddenInput.val(currentTags.join('|'));
        
        // Animate tag appearance
        $tag.hide().fadeIn(300);
    },
    
    /**
     * PHASE 2: Remove tag
     */
    removeTag: function($button) {
        var $tag = $button.closest('.feature-tag');
        var $tagsDisplay = $tag.closest('.tags-display');
        var $container = $tagsDisplay.closest('.tag-input-container');
        var $hiddenInput = $container.find('input[type="hidden"]');
        var tagText = $tag.text().replace('×', '').trim();
        
        // Update hidden input
        var currentTags = $hiddenInput.val() ? $hiddenInput.val().split('|') : [];
        var filteredTags = currentTags.filter(function(t) { return t.trim() !== tagText; });
        $hiddenInput.val(filteredTags.join('|'));
        
        // Remove tag with animation
        $tag.fadeOut(300, function() {
            $(this).remove();
        });
    },
    
    /**
     * PHASE 2: Initialize CTA preview system
     */
    initCTAPreview: function() {
        $('input[name*="[cta_text]"], input[name*="[cta_url]"]').each(function() {
            this.updateCTAPreview($(this));
        }.bind(this));
    },
    
    /**
     * PHASE 2: Update CTA preview
     */
    updateCTAPreview: function($input) {
        var $row = $input.closest('.feature-row');
        var index = $row.data('index');
        var $preview = $('#cta-preview-' + index);
        
        var ctaText = $row.find('input[name*="[cta_text]"]').val();
        var ctaUrl = $row.find('input[name*="[cta_url]"]').val();
        
        if (ctaText && ctaUrl) {
            var previewHTML = '<a href="' + ctaUrl + '" class="preview-cta-button" target="_blank" rel="noopener">' +
                             ctaText + '</a>';
            $preview.html(previewHTML);
        } else {
            $preview.html('<div class="cta-placeholder"><span>CTA preview will appear when both text and URL are provided</span></div>');
        }
    },
    
    /**
     * PHASE 2: Initialize duration sliders
     */
    initDurationSliders: function() {
        $('.duration-slider').each(function() {
            this.updateDurationDisplay($(this));
        }.bind(this));
    },
    
    /**
     * PHASE 2: Update duration display
     */
    updateDurationDisplay: function($slider) {
        var index = $slider.data('index');
        var value = $slider.val();
        var $display = $('#duration-display-' + index);
        
        if ($display.length) {
            $display.text(value + ' min');
        }
    },
    
    /**
     * PHASE 2: Set duration preset
     */
    setDurationPreset: function($button) {
        var value = $button.data('value');
        var target = $button.data('target');
        var $slider = $('input[name="features[' + target + '][duration_minutes]"]');
        
        if ($slider.length) {
            $slider.val(value);
            this.updateDurationDisplay($slider);
            
            // Visual feedback
            $button.addClass('selected');
            setTimeout(function() {
                $button.removeClass('selected');
            }, 200);
        }
    },
    
    /**
     * PHASE 2: Initialize difficulty selector
     */
    initDifficultySelector: function() {
        $('.difficulty-option input[type="radio"]:checked').each(function() {
            $(this).closest('.difficulty-option').addClass('selected');
        });
    },
    
    /**
     * PHASE 2: Update difficulty selection
     */
    updateDifficultySelection: function($radio) {
        var $option = $radio.closest('.difficulty-option');
        var $container = $option.closest('.difficulty-options');
        
        // Remove selected class from all options
        $container.find('.difficulty-option').removeClass('selected');
        
        // Add selected class to current option
        $option.addClass('selected');
    },
    
    /**
     * PHASE 2: Initialize enhanced bulk operations
     */
    initBulkOperations: function() {
        var self = this;
        
        // Add enhanced bulk operation UI
        this.createBulkOperationUI();
        
        // Update selection counter initially
        this.updateBulkSelection();
    },
    
    /**
     * PHASE 2: Create enhanced bulk operation UI
     */
    createBulkOperationUI: function() {
        var $bulkContainer = $('#bulk-actions-container');
        
        if ($bulkContainer.length) {
            $bulkContainer.append(
                '<div class="bulk-operation-feedback">' +
                '<div class="bulk-selection-count">0 features selected</div>' +
                '<div class="bulk-progress" style="display: none;">' +
                '<div class="bulk-progress-bar"><div class="bulk-progress-fill"></div></div>' +
                '<div class="bulk-progress-text">Processing...</div>' +
                '</div>' +
                '</div>'
            );
        }
    },
    
    /**
     * PHASE 2: Update bulk selection counter
     */
    updateBulkSelection: function() {
        var selectedCount = $('.feature-bulk-select:checked').length;
        var totalCount = $('.feature-bulk-select').length;
        
        $('.bulk-selection-count').text(selectedCount + ' of ' + totalCount + ' features selected');
        
        // Update "Select All" checkbox state
        var $selectAll = $('#bulk-select-all');
        if (selectedCount === 0) {
            $selectAll.prop('indeterminate', false).prop('checked', false);
        } else if (selectedCount === totalCount) {
            $selectAll.prop('indeterminate', false).prop('checked', true);
        } else {
            $selectAll.prop('indeterminate', true);
        }
        
        // Enable/disable bulk action button
        $('#bulk-action-apply').prop('disabled', selectedCount === 0);
    },
    
    /**
     * PHASE 2: Toggle all selection
     */
    toggleAllSelection: function(checked) {
        $('.feature-bulk-select').prop('checked', checked);
        this.updateBulkSelection();
    },
    
    /**
     * PHASE 2: Perform enhanced bulk operation
     */
    performBulkOperation: function() {
        var operation = $('#bulk-action-select').val();
        var selectedIndices = [];
        
        $('.feature-bulk-select:checked').each(function() {
            selectedIndices.push($(this).data('feature-index'));
        });
        
        if (!operation) {
            this.showNotification('Please select a bulk action', 'error');
            return;
        }
        
        if (selectedIndices.length === 0) {
            this.showNotification('Please select features to perform bulk action on', 'error');
            return;
        }
        
        // Confirm destructive operations
        if (operation === 'delete') {
            var confirmMessage = 'Are you sure you want to delete ' + selectedIndices.length + ' features? This cannot be undone.';
            if (!confirm(confirmMessage)) {
                return;
            }
        }
        
        this.showBulkProgress(true);
        
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'bulk_operation_features',
                operation: operation,
                feature_indices: selectedIndices,
                nonce: fitcopilotTrainingFeaturesAjax.nonce
            },
            success: function(response) {
                this.showBulkProgress(false);
                
                if (response.success) {
                    this.showNotification(response.data.message, 'success');
                    
                    // Show detailed results if available
                    if (response.data.data && response.data.data.statistics) {
                        this.showBulkResults(response.data.data);
                    }
                    
                    // Reload page for certain operations
                    if (['delete', 'duplicate'].indexOf(operation) !== -1) {
                        setTimeout(function() {
                            location.reload();
                        }, 2000);
                    }
                } else {
                    this.showNotification(response.data.message || 'Bulk operation failed', 'error');
                }
            }.bind(this),
            error: function() {
                this.showBulkProgress(false);
                this.showNotification('Bulk operation failed due to server error', 'error');
            }.bind(this)
        });
    },
    
    /**
     * PHASE 2: Show/hide bulk progress
     */
    showBulkProgress: function(show) {
        var $progress = $('.bulk-progress');
        
        if (show) {
            $progress.show();
            $('.bulk-progress-fill').css('width', '0%').animate({width: '100%'}, 3000);
        } else {
            $progress.hide();
            $('.bulk-progress-fill').stop().css('width', '0%');
        }
    },
    
    /**
     * PHASE 2: Show bulk operation results
     */
    showBulkResults: function(data) {
        var stats = data.statistics;
        var details = '<strong>Operation Results:</strong><br>';
        details += 'Processed: ' + stats.processed + '<br>';
        
        if (stats.skipped > 0) {
            details += 'Skipped: ' + stats.skipped + '<br>';
        }
        
        if (stats.errors.length > 0) {
            details += 'Errors: ' + stats.errors.length + '<br>';
        }
        
        details += 'Success Rate: ' + data.success_rate + '%';
        
        this.showNotification(details, 'info', 5000);
    },
    
    /**
     * PHASE 2: Enhanced individual save functionality
     */
    initIndividualSave: function() {
        var self = this;
        
        $(document).on('click', '.save-individual-feature', function() {
            var $button = $(this);
            var featureIndex = $button.data('feature-index');
            
            self.saveIndividualFeature(featureIndex, $button);
        });
    },
    
    /**
     * PHASE 2: Save individual feature with enhanced feedback
     */
    saveIndividualFeature: function(featureIndex, $button) {
        var $row = $('.feature-row[data-index="' + featureIndex + '"]');
        var $status = $('#save-status-' + featureIndex);
        
        // Collect form data
        var featureData = {};
        $row.find('input, textarea, select').each(function() {
            var $field = $(this);
            var name = $field.attr('name');
            
            if (name && name.indexOf('features[' + featureIndex + ']') === 0) {
                var fieldName = name.replace('features[' + featureIndex + '][', '').replace(']', '');
                
                if ($field.attr('type') === 'checkbox') {
                    featureData[fieldName] = $field.is(':checked') ? 1 : 0;
                } else if ($field.attr('type') === 'radio') {
                    if ($field.is(':checked')) {
                        featureData[fieldName] = $field.val();
                    }
                } else {
                    featureData[fieldName] = $field.val();
                }
            }
        });
        
        // Show saving state
        $button.prop('disabled', true).text('💾 Saving...');
        $status.removeClass().addClass('save-status loading').text('Saving feature...').css('opacity', 1);
        
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'save_individual_feature',
                feature_index: featureIndex,
                feature_data: featureData,
                nonce: fitcopilotTrainingFeaturesAjax.nonce
            },
            success: function(response) {
                $button.prop('disabled', false).text('💾 Save This Feature');
                
                if (response.success) {
                    $status.removeClass().addClass('save-status success').text('✅ ' + response.data.message);
                    
                    // Update feature name display if changed
                    if (featureData.title) {
                        $row.find('.feature-name-display').text(featureData.title);
                    }
                    
                    // Auto-hide success message after 3 seconds
                    setTimeout(function() {
                        $status.css('opacity', 0);
                    }, 3000);
                    
                } else {
                    var errorMessage = response.data.message || 'Save failed';
                    $status.removeClass().addClass('save-status error').text('❌ ' + errorMessage);
                }
            },
            error: function() {
                $button.prop('disabled', false).text('💾 Save This Feature');
                $status.removeClass().addClass('save-status error').text('❌ Save failed - server error');
            }
        });
    },
    
    /**
     * Show notification message
     */
    showNotification: function(message, type, duration) {
        type = type || 'info';
        duration = duration || 3000;
        
        var $notification = $('<div class="tf-notification tf-notification-' + type + '">' + message + '</div>');
        
        $('body').append($notification);
        
        $notification.fadeIn(300);
        
        setTimeout(function() {
            $notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, duration);
    },
    
    /**
     * Legacy compatibility - maintain existing functionality
     */
    initLegacyFeatures: function() {
        // Initialize any existing features that need to remain functional
        console.log('Legacy features initialized for compatibility');
    }
}; 