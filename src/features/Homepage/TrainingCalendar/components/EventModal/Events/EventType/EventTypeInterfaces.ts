/**
 * Event Type Interfaces - Smart Scheduling System
 * 
 * TypeScript interfaces for event type selection and smart scheduling
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */


/**
 * Event Type Option for dropdown selection
 */
export interface EventTypeOption {
  value: string;
  label: string;
  description: string;
  duration?: number;
  category: 'consultation' | 'training' | 'class' | 'assessment';
  requiresDuration: boolean;
  supportsPricing: boolean;
  /** Automatic field selections for this event type */
  automaticSelections?: {
    eventType?: string;
    sessionType?: string;
    bookingStatus?: string;
    price?: number;
  };
}

/**
 * Smart Scheduling Configuration
 */
export interface SmartSchedulingConfig {
  /** Whether smart scheduling is enabled for this event type */
  enabled: boolean;
  
  /** Minimum advance booking time in hours */
  minAdvanceHours: number;
  
  /** Maximum advance booking time in days */
  maxAdvanceDays: number;
  
  /** Available time slots configuration */
  timeSlots: {
    /** Available days of the week (0 = Sunday, 6 = Saturday) */
    availableDays: number[];
    
    /** Available hours (24-hour format) */
    availableHours: {
      start: number;
      end: number;
    };
    
    /** Slot duration in minutes */
    slotDuration: number;
    
    /** Buffer time between slots in minutes */
    bufferTime: number;
  };
  
  /** Trainer availability requirements */
  trainerRequirements: {
    /** Whether a specific trainer is required */
    required: boolean;
    
    /** Preferred trainer specialties */
    preferredSpecialties: string[];
    
    /** Whether to check trainer availability in real-time */
    checkAvailability: boolean;
  };
}

/**
 * Scheduling Preference from client
 */
export interface SchedulingPreference {
  /** Preferred date (if any) */
  preferredDate?: Date;
  
  /** Preferred time of day */
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
  
  /** Preferred days of the week */
  preferredDays: number[];
  
  /** Timezone */
  timezone: string;
  
  /** Whether client wants earliest available slot */
  wantsEarliestSlot: boolean;
}

/**
 * Available Time Slot
 */
export interface AvailableTimeSlot {
  /** Slot start time */
  startTime: Date;
  
  /** Slot end time */
  endTime: Date;
  
  /** Available trainer for this slot */
  trainerId?: string;
  
  /** Trainer name */
  trainerName?: string;
  
  /** Slot availability status */
  status: 'available' | 'limited' | 'waitlist';
  
  /** Number of spots remaining (for group events) */
  spotsRemaining?: number;
  
  /** Pricing for this specific slot */
  price?: number;
}

/**
 * Scheduling Result
 */
export interface SchedulingResult {
  /** Whether scheduling was successful */
  success: boolean;
  
  /** Available time slots */
  availableSlots: AvailableTimeSlot[];
  
  /** Recommended slot (best match for preferences) */
  recommendedSlot?: AvailableTimeSlot;
  
  /** Error message if scheduling failed */
  error?: string;
  
  /** Additional scheduling information */
  metadata: {
    /** Total slots checked */
    totalSlotsChecked: number;
    
    /** Search criteria used */
    searchCriteria: {
      eventType: string;
      duration: number;
      dateRange: {
        start: Date;
        end: Date;
      };
    };
    
    /** Performance metrics */
    performanceMs: number;
  };
}

/**
 * Event Type Selector Props
 */
export interface EventTypeSelectorProps {
  /** Currently selected event type */
  selectedEventType?: string;
  
  /** Available event type options */
  eventTypeOptions: EventTypeOption[];
  
  /** Whether the selector is disabled */
  disabled?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Error state */
  error?: string;
  
  /** Date selected from calendar for smart scheduling */
  selectedDate?: Date;
  
  /** Change handler */
  onChange: (eventType: string) => void;
  
  /** Duration change handler (for events that require duration) */
  onDurationChange?: (duration: number) => void;
  
  /** Automatic selections change handler (for events with automatic field selection) */
  onAutomaticSelectionsChange?: (selections: { eventType?: string; sessionType?: string; bookingStatus?: string; price?: number }) => void;
  
  /** Smart scheduling trigger */
  onTriggerSmartScheduling?: (preferences: SchedulingPreference) => void;
  
  /** CSS class name */
  className?: string;
}

/**
 * Duration Selector Props
 */
export interface DurationSelectorProps {
  /** Event type that requires duration */
  eventType: string;
  
  /** Currently selected duration */
  selectedDuration?: number;
  
  /** Available duration options */
  durationOptions: { value: number | string; label: string; description?: string }[];
  
  /** Whether the selector is disabled */
  disabled?: boolean;
  
  /** Change handler */
  onChange: (duration: number) => void;
  
  /** CSS class name */
  className?: string;
}

/**
 * Smart Scheduling Widget Props
 */
export interface SmartSchedulingWidgetProps {
  /** Current event configuration */
  eventConfig: {
    type: string;
    duration?: number;
    location?: string;
  };
  
  /** Smart scheduling configuration */
  schedulingConfig: SmartSchedulingConfig;
  
  /** Client preferences */
  preferences?: SchedulingPreference;
  
  /** Available trainers */
  trainers: Array<{
    id: string;
    name: string;
    specialties: string[];
    availability?: any; // Will be defined in scheduling engine
  }>;
  
  /** Scheduling result handler */
  onSchedulingResult: (result: SchedulingResult) => void;
  
  /** Loading state */
  loading?: boolean;
  
  /** CSS class name */
  className?: string;
} 