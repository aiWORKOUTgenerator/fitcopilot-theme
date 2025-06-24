/**
 * Event Modal Component
 * 
 * Clean wrapper component for the modular EventModal architecture
 * Maintains 100% backward compatibility while using Phase 2 extracted components
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React from 'react';
import { EventModalProps } from '../../interfaces';
import { EventModalContainer } from './components/EventModalContainer/EventModalContainer';
import './EventModal.scss';

/**
 * EventModal Component
 * 
 * Main entry point - maintains backward compatibility
 * while using new modular architecture
 * 
 * Reduced from 1591 lines to ~80 lines (94% reduction)
 * All business logic moved to extracted components and hooks
 */
const EventModal: React.FC<EventModalProps> = React.memo(({
  isOpen,
  event,
  mode,
  trainers = [],
  loading = false,
  selectedDate,
  onClose,
  onSave,
  onDelete,
  onModeChange,
  className = ''
}) => {
  // ===== EARLY RETURN =====
  
  if (!isOpen) {
    return null;
  }

  // ===== RENDER =====

  return (
    <div 
      className={`event-modal__backdrop ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div className="event-modal__overlay" onClick={onClose} />
      
      <EventModalContainer
        isOpen={isOpen}
        mode={mode}
        event={event}
        selectedDate={selectedDate}
        onClose={onClose}
        onSave={onSave}
        onDelete={onDelete}
        onModeChange={onModeChange}
        trainers={trainers}
        loading={loading}
        className="event-modal__container-wrapper"
      />
    </div>
  );
});

EventModal.displayName = 'EventModal';

export default EventModal;
export { EventModal };
