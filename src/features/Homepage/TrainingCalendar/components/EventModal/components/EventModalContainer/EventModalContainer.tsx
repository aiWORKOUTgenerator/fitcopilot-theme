/**
 * Event Modal Container Component
 * 
 * Main orchestrator component that replaces the massive EventModal.tsx
 * Uses extracted hooks and components from Phase 2 for clean composition
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React from 'react';
import { BookingStatus, CalendarEvent, EventType, RegisteredUser, SessionType } from '../../../../interfaces';
import UserRegistrationModal from '../../../UserRegistrationModal/UserRegistrationModal';
import EventModalFooter from '../../EventModalFooter/EventModalFooter';
import { AvailableTimeSlot } from '../../Events/EventType/EventTypeInterfaces';
import { useEventModalIntegration } from '../../hooks';
import { EventModalConfig } from '../../types';
import { EventDetailsView } from '../EventDetailsView/EventDetailsView';
import { EventForm } from '../EventForm/EventForm';
import { EventModalHeader } from '../EventModalHeader/EventModalHeader';
import './EventModalContainer.scss';

export interface EventModalContainerProps {
  isOpen: boolean;
  mode: 'view' | 'edit' | 'create';
  event?: CalendarEvent;
  selectedDate?: Date;
  onClose: () => void;
  onSave: (event: Partial<CalendarEvent>) => Promise<void>;
  onDelete?: (eventId: string | number) => Promise<void>;
  onModeChange?: (mode: 'view' | 'edit' | 'create') => void;
  
  // Additional props from existing EventModal
  trainers?: any[];
  loading?: boolean;
  className?: string;
  config?: Partial<EventModalConfig>;
}

/**
 * EventModalContainer - Orchestrator Component
 * 
 * Reduced from 1591-line EventModal to clean orchestration
 * Uses Phase 2 extracted components and hooks
 */
export const EventModalContainer: React.FC<EventModalContainerProps> = (props) => {
  const {
    isOpen,
    mode,
    event,
    selectedDate,
    onClose,
    onSave,
    onDelete,
    onModeChange,
    loading = false,
    className = '',
    config
  } = props;

  // ===== INTEGRATION HOOK =====
  
  // Use the comprehensive integration hook from Phase 2
  const {
    state,
    handleFormFieldChange,
    validateForm,
    handleSave,
    handleDelete,
    handleClose,
    handleModeChange,
    handleEventTypeChange,
    handleDurationChange,
    setShowTimeSlotSelector,
    setShowUserRegistration,
    handleComponentError,
    resetErrorState,
    updateFormData,
    handleBookSession
  } = useEventModalIntegration({
    event,
    mode,
    isOpen,
    onSave,
    onDelete,
    onClose,
    onModeChange,
    config
  });

  // ===== COMPUTED VALUES =====

  const modalTitle = getModalTitle(mode, state.formData.title);
  const isEditable = mode === 'edit' || mode === 'create';

  // ===== EVENT HANDLERS =====

  const handleTimeSlotSelect = (slot: AvailableTimeSlot) => {
    // Update form data with selected time slot
    updateFormData({
      start: slot.startTime.toISOString(),
      end: slot.endTime.toISOString(),
      trainerId: typeof slot.trainerId === 'string' ? parseInt(slot.trainerId, 10) : slot.trainerId,
      price: slot.price
    });
    
    setShowTimeSlotSelector(false);
  };

  const handleShowTimeSlotSelector = (show: boolean) => {
    setShowTimeSlotSelector(show);
  };

  const handleAutomaticSelectionsChange = (selections: {
    eventType?: string;
    sessionType?: string;
    bookingStatus?: string;
    price?: number;
  }) => {
    // Type-safe updates for CalendarEvent
    const updateData: Partial<CalendarEvent> = {};
    
    if (selections.eventType) {
      updateData.eventType = selections.eventType as EventType;
    }
    if (selections.sessionType) {
      updateData.sessionType = selections.sessionType as SessionType;
    }
    if (selections.bookingStatus) {
      updateData.bookingStatus = selections.bookingStatus as BookingStatus;
    }
    if (selections.price !== undefined) {
      updateData.price = selections.price;
    }
    
    updateFormData(updateData);
  };

  // ===== ERROR BOUNDARY =====

  if (state.componentError) {
    return (
      <div className="event-modal__container event-modal__container--error">
        <div className="event-modal__error">
          <h3>Something went wrong</h3>
          <p>Unable to display event modal. Please try again.</p>
          <button onClick={resetErrorState}>Retry</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  // ===== RENDER =====

  return (
    <div className={`event-modal__container ${className}`}>
      
      {/* Header */}
      <EventModalHeader
        mode={mode}
        title={modalTitle}
        onClose={handleClose}
        onModeChange={onModeChange}
        hasUnsavedChanges={state.formData !== (event || {})}
        isLoading={loading || state.saving || state.deleting}
      />
      
      {/* Content */}
      <div className="event-modal__content">
        {mode === 'view' ? (
          <EventDetailsView
            event={event!}
            isLoading={loading}
            onBookEvent={handleBookSession}
          />
        ) : (
          <EventForm
            formData={state.formData}
            onFormDataChange={updateFormData}
            selectedEventType={state.selectedEventType}
            selectedDuration={state.selectedDuration}
            onEventTypeChange={handleEventTypeChange}
            onDurationChange={handleDurationChange}
            onAutomaticSelectionsChange={handleAutomaticSelectionsChange}
            selectedDate={selectedDate}
            showTimeSlotSelector={state.showTimeSlotSelector}
            selectedTimeSlot={null} // TODO: Add selectedTimeSlot to state
            onTimeSlotSelect={handleTimeSlotSelect}
            onShowTimeSlotSelector={handleShowTimeSlotSelector}
            errors={state.errors}
            onFieldChange={handleFormFieldChange}
            isLoading={loading}
            isSaving={state.saving}
          />
        )}
      </div>

      {/* Footer */}
      <EventModalFooter
        mode={mode}
        loading={loading}
        saving={state.saving}
        deleting={state.deleting}
        event={event}
        isEditable={isEditable}
        showDeleteConfirm={state.showDeleteConfirm}
        onClose={handleClose}
        onSave={handleSave}
        onDelete={onDelete ? handleDelete : undefined}
        onShowDeleteConfirm={(show) => {
          // TODO: Add showDeleteConfirm handler to integration hook
        }}
        onConfirmDelete={handleDelete}
      />
      
      {/* User Registration Modal */}
      <UserRegistrationModal
        isOpen={state.showUserRegistration}
        eventData={event || state.formData}
        onUserRegistered={(user: RegisteredUser) => {
          console.log('User registered:', user);
          // Close registration modal and proceed to edit mode for booking
          setShowUserRegistration(false);
          if (onModeChange) {
            onModeChange('edit');
          }
        }}
        onClose={() => {
          setShowUserRegistration(false);
        }}
      />
    </div>
  );
};

// ===== HELPER FUNCTIONS =====

/**
 * Get modal title based on mode and form data
 */
function getModalTitle(mode: 'view' | 'edit' | 'create', eventTitle?: string): string {
  switch (mode) {
    case 'create':
      return 'Create New Event';
    case 'edit':
      return eventTitle ? `Edit: ${eventTitle}` : 'Edit Event';
    case 'view':
    default:
      return eventTitle || 'Event Details';
  }
}

EventModalContainer.displayName = 'EventModalContainer'; 