import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Maximize2,
    Move,
    X
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { CalendarEvent, DragDropEvent, EventResizeData } from '../../types';
import './DragDropManager.scss';

interface DragDropManagerProps {
    /**
     * Event being dragged/resized
     */
    activeEvent: CalendarEvent | null;
    
    /**
     * Drag operation data
     */
    dragData: DragDropEvent | null;
    
    /**
     * Resize operation data
     */
    resizeData: EventResizeData | null;
    
    /**
     * Available trainers for reassignment
     */
    trainers: Array<{ id: string; name: string; availability: string[] }>;
    
    /**
     * Existing events for conflict detection
     */
    existingEvents: CalendarEvent[];
    
    /**
     * Drag start handler
     */
    onDragStart: (event: CalendarEvent) => void;
    
    /**
     * Drag update handler
     */
    onDragUpdate: (dragData: DragDropEvent) => void;
    
    /**
     * Drag complete handler
     */
    onDragComplete: (dragData: DragDropEvent, resolveConflicts: boolean) => Promise<void>;
    
    /**
     * Resize start handler
     */
    onResizeStart: (event: CalendarEvent) => void;
    
    /**
     * Resize update handler
     */
    onResizeUpdate: (resizeData: EventResizeData) => void;
    
    /**
     * Resize complete handler
     */
    onResizeComplete: (resizeData: EventResizeData, resolveConflicts: boolean) => Promise<void>;
    
    /**
     * Cancel operation handler
     */
    onCancel: () => void;
}

interface ConflictEvent {
    event: CalendarEvent;
    type: 'overlap' | 'trainer_unavailable' | 'booking_collision';
    severity: 'warning' | 'error';
    message: string;
}

/**
 * DragDropManager Component
 * 
 * Advanced drag and drop management with conflict detection, trainer reassignment,
 * and real-time validation for the Training Calendar
 */
export const DragDropManager: React.FC<DragDropManagerProps> = ({
    activeEvent,
    dragData,
    resizeData,
    trainers,
    existingEvents,
    onDragStart,
    onDragUpdate,
    onDragComplete,
    onResizeStart,
    onResizeUpdate,
    onResizeComplete,
    onCancel
}) => {
    const [conflicts, setConflicts] = useState<ConflictEvent[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const [showConflictDialog, setShowConflictDialog] = useState(false);
    const [resolveAction, setResolveAction] = useState<'force' | 'adjust' | 'cancel'>('adjust');
    const [selectedTrainer, setSelectedTrainer] = useState<string>('');

    // Check for conflicts when drag/resize data changes
    useEffect(() => {
        if (dragData || resizeData) {
            validateOperation();
        } else {
            setConflicts([]);
            setShowConflictDialog(false);
        }
    }, [dragData, resizeData, existingEvents]);

    // Validate current operation for conflicts
    const validateOperation = useCallback(() => {
        setIsValidating(true);
        
        try {
            const foundConflicts: ConflictEvent[] = [];
            const operationData = dragData || resizeData;
            
            if (!operationData || !activeEvent) {
                setConflicts([]);
                return;
            }

            const newStart = new Date(operationData.newStart);
            const newEnd = new Date(operationData.newEnd);
            const targetTrainerId = dragData?.trainerId || activeEvent.trainer?.id;

            // Check for overlapping events
            existingEvents.forEach(event => {
                if (event.id === operationData.eventId) return; // Skip self
                
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                
                // Check for time overlap
                if (newStart < eventEnd && newEnd > eventStart) {
                    // Same trainer conflict
                    if (event.trainer?.id === targetTrainerId) {
                        foundConflicts.push({
                            event,
                            type: 'overlap',
                            severity: 'error',
                            message: `Overlaps with "${event.title}" at ${formatTimeRange(eventStart, eventEnd)}`
                        });
                    }
                }
            });

            // Check trainer availability
            const targetTrainer = trainers.find(t => t.id === targetTrainerId);
            if (targetTrainer) {
                const dayOfWeek = newStart.getDay();
                const timeSlot = formatTime(newStart);
                
                if (!targetTrainer.availability.includes(`${dayOfWeek}-${timeSlot}`)) {
                    foundConflicts.push({
                        event: activeEvent,
                        type: 'trainer_unavailable',
                        severity: 'warning',
                        message: `${targetTrainer.name} is not available at ${formatTime(newStart)} on ${getDayName(dayOfWeek)}`
                    });
                }
            }

            // Check booking constraints
            if (activeEvent.status === 'booked' && resizeData) {
                const originalDuration = new Date(activeEvent.end).getTime() - new Date(activeEvent.start).getTime();
                const newDuration = newEnd.getTime() - newStart.getTime();
                
                if (Math.abs(newDuration - originalDuration) > 30 * 60 * 1000) { // 30 minutes
                    foundConflicts.push({
                        event: activeEvent,
                        type: 'booking_collision',
                        severity: 'warning',
                        message: `Significant duration change may require client confirmation`
                    });
                }
            }

            setConflicts(foundConflicts);
            
            // Show conflict dialog if there are conflicts
            if (foundConflicts.length > 0) {
                setShowConflictDialog(true);
            }
            
        } finally {
            setIsValidating(false);
        }
    }, [dragData, resizeData, activeEvent, existingEvents, trainers]);

    // Handle operation completion with conflict resolution
    const handleComplete = useCallback(async (forceResolve: boolean = false) => {
        const operationData = dragData || resizeData;
        
        if (!operationData || !activeEvent) {
            onCancel();
            return;
        }

        try {
            const resolveConflicts = forceResolve || resolveAction === 'force';
            
            if (dragData) {
                await onDragComplete(operationData as DragDropEvent, resolveConflicts);
            } else if (resizeData) {
                await onResizeComplete(operationData as EventResizeData, resolveConflicts);
            }
            
            // Clear state
            setConflicts([]);
            setShowConflictDialog(false);
            setResolveAction('adjust');
            
        } catch (error) {
            console.error('Operation failed:', error);
            // Handle error appropriately
        }
    }, [dragData, resizeData, activeEvent, resolveAction, onDragComplete, onResizeComplete, onCancel]);

    // Handle conflict resolution
    const handleResolveConflict = useCallback(async () => {
        switch (resolveAction) {
            case 'force':
                await handleComplete(true);
                break;
            case 'adjust':
                // Auto-adjust timing to avoid conflicts
                await handleAutoAdjust();
                break;
            case 'cancel':
                onCancel();
                setShowConflictDialog(false);
                break;
        }
    }, [resolveAction, handleComplete, onCancel]);

    // Auto-adjust timing to resolve conflicts
    const handleAutoAdjust = useCallback(async () => {
        if (!dragData && !resizeData) return;

        // Find the next available slot
        const operationData = dragData || resizeData;
        const duration = new Date(operationData.newEnd).getTime() - new Date(operationData.newStart).getTime();
        
        let adjustedStart = new Date(operationData.newStart);
        let found = false;
        
        // Try to find a conflict-free slot within the same day
        for (let i = 0; i < 24; i++) { // Try for 24 hours
            const adjustedEnd = new Date(adjustedStart.getTime() + duration);
            
            const hasConflict = existingEvents.some(event => {
                if (event.id === operationData.eventId) return false;
                
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                
                return adjustedStart < eventEnd && adjustedEnd > eventStart;
            });
            
            if (!hasConflict) {
                found = true;
                break;
            }
            
            // Move to next 30-minute slot
            adjustedStart = new Date(adjustedStart.getTime() + 30 * 60 * 1000);
        }
        
        if (found) {
            const adjustedData = {
                ...operationData,
                newStart: adjustedStart.toISOString(),
                newEnd: new Date(adjustedStart.getTime() + duration).toISOString()
            };
            
            if (dragData) {
                onDragUpdate(adjustedData as DragDropEvent);
                await onDragComplete(adjustedData as DragDropEvent, false);
            } else if (resizeData) {
                onResizeUpdate(adjustedData as EventResizeData);
                await onResizeComplete(adjustedData as EventResizeData, false);
            }
        } else {
            // If no slot found, force with warning
            await handleComplete(true);
        }
        
        setShowConflictDialog(false);
    }, [dragData, resizeData, existingEvents, onDragUpdate, onDragComplete, onResizeUpdate, onResizeComplete, handleComplete]);

    // Handle trainer reassignment
    const handleTrainerChange = useCallback((trainerId: string) => {
        setSelectedTrainer(trainerId);
        
        if (dragData) {
            onDragUpdate({
                ...dragData,
                trainerId
            });
        }
    }, [dragData, onDragUpdate]);

    // Utility functions
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const formatTimeRange = (start: Date, end: Date): string => {
        return `${formatTime(start)} - ${formatTime(end)}`;
    };

    const getDayName = (dayIndex: number): string => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    };

    if (!activeEvent || (!dragData && !resizeData)) {
        return null;
    }

    return (
        <>
            {/* Operation Status Bar */}
            <div className="drag-drop-status">
                <div className="status-content">
                    <div className="status-icon">
                        {dragData && <Move size={16} />}
                        {resizeData && <Maximize2 size={16} />}
                    </div>
                    <div className="status-text">
                        <span className="operation-type">
                            {dragData && 'Moving'}
                            {resizeData && 'Resizing'}
                        </span>
                        <span className="event-title">"{activeEvent.title}"</span>
                    </div>
                    {isValidating && (
                        <div className="validation-indicator">
                            <Clock size={14} className="spinning" />
                            Validating...
                        </div>
                    )}
                </div>
                
                <div className="status-actions">
                    <button
                        className="btn btn--success btn--sm"
                        onClick={() => handleComplete()}
                        disabled={isValidating || conflicts.some(c => c.severity === 'error')}
                    >
                        <CheckCircle size={14} />
                        Confirm
                    </button>
                    <button
                        className="btn btn--secondary btn--sm"
                        onClick={onCancel}
                    >
                        <X size={14} />
                        Cancel
                    </button>
                </div>
            </div>

            {/* Trainer Reassignment (for drag operations) */}
            {dragData && trainers.length > 0 && (
                <div className="trainer-reassignment">
                    <label className="form-label">Assign to trainer:</label>
                    <select
                        value={selectedTrainer || dragData.trainerId || ''}
                        onChange={(e) => handleTrainerChange(e.target.value)}
                        className="trainer-select"
                    >
                        {trainers.map(trainer => (
                            <option key={trainer.id} value={trainer.id}>
                                {trainer.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Conflict Resolution Dialog */}
            {showConflictDialog && (
                <div className="conflict-dialog-overlay">
                    <div className="conflict-dialog">
                        <div className="conflict-header">
                            <AlertTriangle size={24} className="warning-icon" />
                            <div>
                                <h3>Scheduling Conflicts Detected</h3>
                                <p>The following issues were found with this operation:</p>
                            </div>
                        </div>

                        <div className="conflicts-list">
                            {conflicts.map((conflict, index) => (
                                <div 
                                    key={index} 
                                    className={`conflict-item ${conflict.severity}`}
                                >
                                    <div className="conflict-type">
                                        {conflict.type === 'overlap' && '⚠️ Time Overlap'}
                                        {conflict.type === 'trainer_unavailable' && '📅 Availability'}
                                        {conflict.type === 'booking_collision' && '🔔 Booking Alert'}
                                    </div>
                                    <div className="conflict-message">
                                        {conflict.message}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="resolution-options">
                            <h4>How would you like to resolve these conflicts?</h4>
                            
                            <label className="resolution-option">
                                <input
                                    type="radio"
                                    name="resolveAction"
                                    value="adjust"
                                    checked={resolveAction === 'adjust'}
                                    onChange={(e) => setResolveAction(e.target.value as any)}
                                />
                                <div className="option-content">
                                    <span className="option-title">Auto-adjust timing</span>
                                    <span className="option-description">
                                        Find the next available time slot automatically
                                    </span>
                                </div>
                            </label>

                            <label className="resolution-option">
                                <input
                                    type="radio"
                                    name="resolveAction"
                                    value="force"
                                    checked={resolveAction === 'force'}
                                    onChange={(e) => setResolveAction(e.target.value as any)}
                                />
                                <div className="option-content">
                                    <span className="option-title">Force save anyway</span>
                                    <span className="option-description">
                                        Save despite conflicts (may require manual resolution)
                                    </span>
                                </div>
                            </label>

                            <label className="resolution-option">
                                <input
                                    type="radio"
                                    name="resolveAction"
                                    value="cancel"
                                    checked={resolveAction === 'cancel'}
                                    onChange={(e) => setResolveAction(e.target.value as any)}
                                />
                                <div className="option-content">
                                    <span className="option-title">Cancel operation</span>
                                    <span className="option-description">
                                        Revert to original timing and cancel changes
                                    </span>
                                </div>
                            </label>
                        </div>

                        <div className="conflict-actions">
                            <button
                                className="btn btn--secondary"
                                onClick={() => setShowConflictDialog(false)}
                            >
                                Back to editing
                            </button>
                            <button
                                className="btn btn--primary"
                                onClick={handleResolveConflict}
                            >
                                {resolveAction === 'force' && 'Force Save'}
                                {resolveAction === 'adjust' && 'Auto-adjust'}
                                {resolveAction === 'cancel' && 'Cancel Operation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}; 