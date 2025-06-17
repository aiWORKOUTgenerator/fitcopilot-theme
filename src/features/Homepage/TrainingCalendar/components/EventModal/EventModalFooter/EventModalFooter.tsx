/**
 * Event Modal Footer Component
 * 
 * Footer section for EventModal containing action buttons and delete confirmation
 * Handles save, delete, and cancel operations with loading states
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useCallback } from 'react';
import { CalendarEvent } from '../../../interfaces';
import './EventModalFooter.scss';

/**
 * Event Modal Footer Props Interface
 */
interface EventModalFooterProps {
  /** Current modal mode */
  mode: 'view' | 'edit' | 'create';
  
  /** Loading state for the entire modal */
  loading: boolean;
  
  /** Saving state for save operations */
  saving: boolean;
  
  /** Deleting state for delete operations */
  deleting: boolean;
  
  /** Event being edited (for edit/view modes) */
  event?: CalendarEvent;
  
  /** Whether the modal is in editable state */
  isEditable: boolean;
  
  /** Whether delete confirmation is shown */
  showDeleteConfirm: boolean;
  
  /** Close modal handler */
  onClose: () => void;
  
  /** Save event handler */
  onSave: () => void;
  
  /** Delete event handler (optional for create mode) */
  onDelete?: () => void;
  
  /** Show/hide delete confirmation handler */
  onShowDeleteConfirm: (show: boolean) => void;
  
  /** Confirm delete handler */
  onConfirmDelete: () => void;
}

/**
 * Event Modal Footer Component
 * 
 * Renders action buttons and handles delete confirmation dialog
 */
const EventModalFooter: React.FC<EventModalFooterProps> = React.memo(({
  mode,
  loading,
  saving,
  deleting,
  event,
  isEditable,
  showDeleteConfirm,
  onClose,
  onSave,
  onDelete,
  onShowDeleteConfirm,
  onConfirmDelete
}) => {
  
  // ===== EVENT HANDLERS =====
  
  const handleShowDeleteConfirm = useCallback(() => {
    onShowDeleteConfirm(true);
  }, [onShowDeleteConfirm]);
  
  const handleHideDeleteConfirm = useCallback(() => {
    onShowDeleteConfirm(false);
  }, [onShowDeleteConfirm]);
  
  // ===== RENDER =====
  
  return (
    <>
      <div className="event-modal__footer">
        {isEditable && !loading && (
          <>
            <button
              type="button"
              className="event-modal__button event-modal__button--secondary"
              onClick={onClose}
              disabled={saving || deleting}
            >
              Cancel
            </button>
            
            <button
              type="button"
              className="event-modal__button event-modal__button--primary"
              onClick={onSave}
              disabled={saving || deleting}
            >
              {saving ? (
                <>
                  <div className="spinner spinner--small"></div>
                  Saving...
                </>
              ) : (
                mode === 'create' ? 'Create Event' : 'Save Changes'
              )}
            </button>
          </>
        )}
        
        {mode === 'edit' && event && onDelete && (
          <button
            type="button"
            className="event-modal__button event-modal__button--danger"
            onClick={handleShowDeleteConfirm}
            disabled={saving || deleting}
          >
            {deleting ? (
              <>
                <div className="spinner spinner--small"></div>
                Deleting...
              </>
            ) : (
              'Delete Event'
            )}
          </button>
        )}
      </div>
      
      {showDeleteConfirm && (
        <div className="event-modal__delete-confirm">
          <div className="event-modal__delete-confirm-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="event-modal__delete-confirm-actions">
              <button
                type="button"
                className="event-modal__button event-modal__button--secondary"
                onClick={handleHideDeleteConfirm}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="event-modal__button event-modal__button--danger"
                onClick={onConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

EventModalFooter.displayName = 'EventModalFooter';

export default EventModalFooter; 