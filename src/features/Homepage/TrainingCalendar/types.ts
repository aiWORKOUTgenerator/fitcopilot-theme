import { GlobalVariantKey } from '../types/shared';

/**
 * Training Calendar component props
 */
export interface TrainingCalendarProps {
    /**
     * Visual variant for the calendar section
     * @default 'default'
     */
    variant?: GlobalVariantKey;
    
    /**
     * Optional initial view for the calendar
     * @default 'dayGridMonth'
     */
    initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
    
    /**
     * Whether to show trainer filter controls
     * @default true
     */
    showTrainerFilter?: boolean;
    
    /**
     * Whether to show event type filter controls
     * @default true
     */
    showEventTypeFilter?: boolean;
}

/**
 * Calendar event interface matching backend structure
 */
export interface CalendarEvent {
    /**
     * Unique event identifier
     */
    id: string;
    
    /**
     * Event title
     */
    title: string;
    
    /**
     * Start date/time (ISO format)
     */
    start: string;
    
    /**
     * End date/time (ISO format)
     */
    end: string;
    
    /**
     * Event type
     */
    eventType: 'individual_session' | 'group_class' | 'workshop' | 'assessment' | 'consultation';
    
    /**
     * Trainer associated with this event
     */
    trainer?: {
        id: string;
        name: string;
        image?: string;
    };
    
    /**
     * Event description
     */
    description?: string;
    
    /**
     * Event location
     */
    location?: string;
    
    /**
     * Current booking status
     */
    status: 'available' | 'booked' | 'cancelled' | 'completed';
    
    /**
     * Maximum capacity for group events
     */
    capacity?: number;
    
    /**
     * Current booking count
     */
    booked?: number;
    
    /**
     * Pricing information
     */
    pricing?: {
        amount: number;
        currency: string;
    };
    
    /**
     * Event styling
     */
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    
    /**
     * Whether user can book this event
     */
    bookable?: boolean;
    
    /**
     * Special event flags
     */
    featured?: boolean;
    recurring?: boolean;
    
    /**
     * Recurring event metadata
     */
    seriesId?: string;
    parentEventId?: number;
    recurringRule?: RecurringEventPattern;
}

// ===== PHASE 3 ADVANCED FEATURES: RECURRING EVENTS =====

/**
 * Recurring event pattern configuration
 */
export interface RecurringEventPattern {
    /**
     * Frequency of recurrence
     */
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    
    /**
     * Interval between occurrences (e.g., every 2 weeks)
     */
    interval: number;
    
    /**
     * Days of week for weekly patterns (0=Sunday, 6=Saturday)
     */
    daysOfWeek?: number[];
    
    /**
     * End date for the series
     */
    endDate?: string;
    
    /**
     * Maximum number of occurrences
     */
    occurrences?: number;
    
    /**
     * Exception dates (dates to skip)
     */
    exceptions?: string[];
}

/**
 * Recurring event series information
 */
export interface RecurringEventSeries {
    /**
     * Unique series identifier
     */
    seriesId: string;
    
    /**
     * Base event that defines the series
     */
    baseEvent: CalendarEvent;
    
    /**
     * Recurrence pattern
     */
    pattern: RecurringEventPattern;
    
    /**
     * All event instances in the series
     */
    instances: CalendarEvent[];
    
    /**
     * Series statistics
     */
    stats: {
        totalInstances: number;
        completedInstances: number;
        upcomingInstances: number;
    };
}

/**
 * Recurring event update types
 */
export type RecurringUpdateType = 'this' | 'future' | 'all';

/**
 * Recurring event delete types
 */
export type RecurringDeleteType = 'this' | 'future' | 'all';

// ===== PHASE 3 ADVANCED FEATURES: DRAG & DROP =====

/**
 * Drag and drop event data
 */
export interface DragDropEvent {
    /**
     * Event being moved
     */
    eventId: string;
    
    /**
     * New start date/time
     */
    newStart: string;
    
    /**
     * New end date/time
     */
    newEnd: string;
    
    /**
     * Original start date/time
     */
    oldStart: string;
    
    /**
     * Original end date/time
     */
    oldEnd: string;
    
    /**
     * Trainer ID (if event is being moved to different trainer)
     */
    trainerId?: string;
    
    /**
     * Event type (if changed during move)
     */
    eventType?: string;
}

/**
 * Event resize data
 */
export interface EventResizeData {
    /**
     * Event being resized
     */
    eventId: string;
    
    /**
     * New start date/time
     */
    newStart: string;
    
    /**
     * New end date/time
     */
    newEnd: string;
    
    /**
     * Original start date/time
     */
    oldStart: string;
    
    /**
     * Original end date/time
     */
    oldEnd: string;
    
    /**
     * New duration in minutes
     */
    newDuration: number;
    
    /**
     * Original duration in minutes
     */
    oldDuration: number;
}

// ===== PHASE 3 ADVANCED FEATURES: REAL-TIME UPDATES =====

/**
 * Real-time update event types
 */
export type RealTimeUpdateType = 'event_created' | 'event_updated' | 'event_booked' | 'event_cancelled' | 'event_deleted';

/**
 * Real-time update data
 */
export interface RealTimeUpdate {
    /**
     * Type of update
     */
    type: RealTimeUpdateType;
    
    /**
     * Event ID being updated
     */
    eventId: string;
    
    /**
     * Updated event data (partial)
     */
    data: Partial<CalendarEvent>;
    
    /**
     * Timestamp of the update
     */
    timestamp: string;
    
    /**
     * User who made the update
     */
    userId: string;
    
    /**
     * Update source (admin, frontend, api)
     */
    source: 'admin' | 'frontend' | 'api';
    
    /**
     * Series ID for recurring events
     */
    seriesId?: string;
}

/**
 * Real-time connection status
 */
export interface ConnectionStatus {
    /**
     * Whether real-time updates are connected
     */
    isConnected: boolean;
    
    /**
     * Last successful update timestamp
     */
    lastUpdate: string;
    
    /**
     * Connection method (websocket, polling, etc.)
     */
    method: 'websocket' | 'polling' | 'sse';
    
    /**
     * Number of missed updates
     */
    missedUpdates: number;
    
    /**
     * Reconnection attempts
     */
    reconnectAttempts: number;
}

/**
 * Calendar settings from WordPress backend
 */
export interface TrainingCalendarSettings {
    /**
     * Section title
     */
    section_title: string;
    
    /**
     * Section subtitle/description
     */
    section_subtitle: string;
    
    /**
     * Default calendar view
     */
    default_view: 'month' | 'week' | 'day' | 'list';
    
    /**
     * First day of week (0 = Sunday, 1 = Monday)
     */
    first_day_of_week: number;
    
    /**
     * Booking rules
     */
    booking_advance_days: number;
    booking_notice_hours: number;
    
    /**
     * Display settings
     */
    show_trainer_filter: boolean;
    show_event_type_filter: boolean;
    show_availability_count: boolean;
    
    /**
     * Integration settings
     */
    personal_training_integration: boolean;
    training_features_integration: boolean;
    
    /**
     * Notification settings
     */
    email_notifications: boolean;
    
    /**
     * Event type configurations
     */
    event_types: {
        [key: string]: {
            enabled: boolean;
            color: string;
            label: string;
        };
    };
}

/**
 * Calendar statistics from WordPress backend
 */
export interface CalendarStatistics {
    /**
     * Total number of events
     */
    total_events: number;
    
    /**
     * Number of confirmed bookings
     */
    confirmed_bookings: number;
    
    /**
     * Number of available slots
     */
    available_slots: number;
    
    /**
     * Last update timestamp
     */
    last_updated: string;
    
    /**
     * Trainer statistics
     */
    trainer_stats: {
        [trainerId: string]: {
            name: string;
            event_count: number;
            booking_rate: number;
        };
    };
}

/**
 * Integrated trainer data (from Personal Training)
 */
export interface IntegratedTrainer {
    /**
     * Trainer ID
     */
    id: string;
    
    /**
     * Trainer name
     */
    name: string;
    
    /**
     * Profile image
     */
    image?: string;
    
    /**
     * Specialty
     */
    specialty: string;
    
    /**
     * Whether trainer is available for booking
     */
    available: boolean;
    
    /**
     * Trainer's calendar availability
     */
    availability?: {
        [day: string]: {
            start: string;
            end: string;
            bufferMinutes: number;
        }[];
    };
}

/**
 * WordPress training calendar data structure
 */
export interface WordPressTrainingCalendarData {
    /**
     * Calendar settings
     */
    settings: TrainingCalendarSettings;
    
    /**
     * Calendar events
     */
    events: CalendarEvent[];
    
    /**
     * Integrated trainers
     */
    trainers: IntegratedTrainer[];
    
    /**
     * Calendar statistics
     */
    statistics: CalendarStatistics;
    
    /**
     * AJAX endpoints
     */
    endpoints: {
        load_events: string;
        book_event: string;
        cancel_booking: string;
        get_availability: string;
    };
    
    /**
     * Integration status
     */
    integration: {
        personal_training: boolean;
        training_features: boolean;
    };
}

/**
 * Calendar filter state
 */
export interface CalendarFilters {
    /**
     * Selected trainers (empty = all)
     */
    trainers: string[];
    
    /**
     * Selected event types (empty = all)
     */
    eventTypes: string[];
    
    /**
     * Show only available events
     */
    availableOnly: boolean;
    
    /**
     * Date range filter
     */
    dateRange?: {
        start: string;
        end: string;
    };
}

/**
 * Booking form data
 */
export interface BookingFormData {
    /**
     * Event ID to book
     */
    eventId: string;
    
    /**
     * User contact information
     */
    name: string;
    email: string;
    phone?: string;
    
    /**
     * Special requests or notes
     */
    notes?: string;
    
    /**
     * Agreement to terms
     */
    agreedToTerms: boolean;
}

// ===== PHASE 3 BOOKING INTERFACES =====

/**
 * Comprehensive booking data interface for Phase 3
 */
export interface BookingData {
    eventId: number;
    bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    bookingDate: string;
    clientInfo?: {
        name: string;
        email: string;
        phone: string;
    };
    emergencyContact?: {
        name: string;
        phone: string;
    };
    medicalConditions?: string;
    fitnessGoals?: string;
    paymentStatus?: 'unpaid' | 'paid' | 'refunded' | 'partial';
    paymentTransactionId?: string;
    confirmedDate?: string;
}

/**
 * Payment data interface for Phase 3
 */
export interface PaymentData {
    method: 'card' | 'paypal' | 'stripe' | 'cash';
    amount: number;
    currency: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    billingAddress?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
}

/**
 * Event modal state
 */
export interface EventModalState {
    /**
     * Whether modal is open
     */
    isOpen: boolean;
    
    /**
     * Selected event
     */
    event: CalendarEvent | null;
    
    /**
     * Current modal mode
     */
    mode: 'view' | 'book' | 'edit';
}

// Declare global window interface for WordPress data
declare global {
    interface Window {
        fitcopilotTrainingCalendarData?: WordPressTrainingCalendarData;
    }
} 