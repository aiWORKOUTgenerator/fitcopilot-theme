/**
 * Event Modal Header Component
 * 
 * Header component for EventModal with title, mode switching, and close functionality
 * Follows modal-manager.js patterns for header state management
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useCallback, useRef } from 'react';
import './EventModalHeader.scss';

export interface EventModalHeaderProps {
  mode: 'view' | 'edit' | 'create';
  title?: string;
  onClose: () => void;
  onModeChange?: (mode: 'view' | 'edit' | 'create') => void;
  className?: string;
  showModeSwitch?: boolean;
  hasUnsavedChanges?: boolean;
  isLoading?: boolean;
}

/**
 * EventModalHeader Component
 * 
 * Handles modal header with title, mode switching, and close button
 */
export const EventModalHeader: React.FC<EventModalHeaderProps> = React.memo(({
  mode,
  title,
  onClose,
  onModeChange,
  className = '',
  showModeSwitch = true,
  hasUnsavedChanges = false,
  isLoading = false
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ===== COMPUTED VALUES =====

  const modalTitle = title || getDefaultTitle(mode);
  const showUnsavedIndicator = hasUnsavedChanges && mode !== 'view';

  // ===== EVENT HANDLERS =====

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check for unsaved changes
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to close?')) {
      return;
    }

    onClose();
  }, [onClose, hasUnsavedChanges]);

  const handleModeSwitch = useCallback((newMode: 'view' | 'edit' | 'create') => {
    if (newMode === mode) return;

    if (hasUnsavedChanges && mode !== 'view') {
      if (!confirm('You have unsaved changes. Are you sure you want to switch modes?')) {
        return;
      }
    }

    onModeChange?.(newMode);
  }, [mode, onModeChange, hasUnsavedChanges]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose(e as any);
    }
  }, [handleClose]);

  // ===== RENDER =====

  return (
    <div 
      className={`event-modal-header ${className}`}
      onKeyDown={handleKeyDown}
    >
      <div className="event-modal-header__content">
        {/* Title Section */}
        <div className="event-modal-header__title-section">
          <h2 
            id="event-modal-title" 
            className="event-modal-header__title"
          >
            {modalTitle}
            {showUnsavedIndicator && (
              <span className="event-modal-header__unsaved-indicator" title="Unsaved changes">
                *
              </span>
            )}
          </h2>
          
          {isLoading && (
            <div className="event-modal-header__loading-indicator">
              <span className="spinner spinner--small" />
            </div>
          )}
        </div>

        {/* Mode Switch */}
        {showModeSwitch && onModeChange && mode !== 'create' && (
          <div className="event-modal-header__mode-switch">
            {/* Only show View button when in Edit mode */}
            {mode === 'edit' && (
              <button
                type="button"
                className="mode-button"
                onClick={() => handleModeSwitch('view')}
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            {/* Only show Edit button when in View mode */}
            {mode === 'view' && (
              <button
                type="button"
                className="mode-button mode-button--primary"
                onClick={() => handleModeSwitch('edit')}
                disabled={isLoading}
              >
                Edit
              </button>
            )}
          </div>
        )}

        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          className="event-modal-header__close"
          onClick={handleClose}
          aria-label="Close modal"
          disabled={isLoading}
        >
          ×
        </button>
      </div>
    </div>
  );
});

EventModalHeader.displayName = 'EventModalHeader';

// ===== HELPER FUNCTIONS =====

/**
 * Get default title based on mode
 */
function getDefaultTitle(mode: 'view' | 'edit' | 'create'): string {
  switch (mode) {
    case 'create':
      return 'Create New Event';
    case 'edit':
      return 'Edit Event';
    case 'view':
    default:
      return 'Event Details';
  }
} 