/**
 * Training Calendar TypeScript Interfaces
 * 
 * Comprehensive type definitions for the Training Calendar system
 * including events, trainers, bookings, and WordPress integration
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { EventApi } from '@fullcalendar/core';

// ===== CORE CALENDAR TYPES =====

/**
 * Calendar Event Interface
 * Core event structure for training calendar
 */
export interface CalendarEvent {
  id: string | number;
  title: string;
  description?: string;
  start: string | Date;
  end: string | Date;
  trainerId?: number;
  eventType: EventType;
  bookingStatus: BookingStatus;
  sessionType: SessionType;
  location?: string;
  maxParticipants: number;
  currentParticipants: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  recurring?: RecurringPattern;
  recurringRule?: string;
  parentEventId?: number;
  seriesId?: string;
  clientInfo?: ClientInfo;
  price?: number;
  currency?: string;
  zoomLink?: string;
  specialInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
  created?: string | Date;
  updated?: string | Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Event Type Enumeration
 */
export type EventType = 
  | 'session'
  | 'availability'
  | 'blocked'
  | 'group_class'
  | 'workshop'
  | 'assessment';

/**
 * Booking Status Enumeration
 */
export type BookingStatus = 
  | 'available'
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

/**
 * Session Type Enumeration
 */
export type SessionType = 
  | 'individual'
  | 'group'
  | 'assessment'
  | 'consultation';

// ===== TRAINER INTERFACES =====

/**
 * Trainer Data Interface
 * Integrates with Personal Training data
 */
export interface TrainerData {
  id: number;
  name: string;
  email?: string;
  specialty: string;
  bio?: string;
  imageUrl?: string;
  avatar?: string;
  yearsExperience: number;
  clientsCount: number;
  featured: boolean;
  active: boolean;
  isActive?: boolean;
  coachType: CoachType;
  availability: TrainerAvailability[] | Record<string, any>;
  calendarConfig?: TrainerCalendarConfig;
  contactInfo?: ContactInfo;
  certifications?: string[];
  specialties?: string[];
  hourlyRate?: number;
  videoUrl?: string;
  videoPoster?: string;
  order?: number;
  color?: string;
  metadata?: Record<string, any>;
}

/**
 * Coach Type Enumeration
 */
export type CoachType = 
  | 'personal'
  | 'group'
  | 'specialized'
  | 'virtual'
  | 'hybrid';

/**
 * Trainer Availability Interface
 */
export interface TrainerAvailability {
  id?: number;
  trainerId: number;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  isActive: boolean;
  effectiveDate?: string;
  expiryDate?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  sessionDuration: number; // minutes
  bufferTime: number;      // minutes between sessions
  maxSessionsPerDay: number;
  location?: string;
  availabilityType: AvailabilityType;
  hourlyRate?: number;
  notes?: string;
}

/**
 * Availability Type Enumeration
 */
export type AvailabilityType = 
  | 'in_person'
  | 'virtual'
  | 'both';

/**
 * Trainer Calendar Configuration
 */
export interface TrainerCalendarConfig {
  color: string;
  borderColor: string;
  textColor: string;
  eventDisplay?: 'auto' | 'block' | 'list-item' | 'background' | 'inverse-background' | 'none';
  classNames?: string[];
}

// ===== BOOKING INTERFACES =====

/**
 * Booking Data Interface
 */
export interface BookingData {
  id?: number;
  eventId: number;
  clientInfo: ClientInfo;
  bookingNotes?: string;
  emergencyContact?: EmergencyContact;
  medicalConditions?: string;
  fitnessGoals?: string;
  bookingStatus: BookingStatus;
  paymentInfo?: PaymentInfo;
  bookingDate: string;
  confirmedDate?: string;
  cancelledDate?: string;
  cancellationReason?: string;
  completedDate?: string;
  feedback?: BookingFeedback;
  reminderSent?: boolean;
  followUpRequired?: boolean;
}

/**
 * Client Information Interface
 */
export interface ClientInfo {
  name: string;
  email: string;
  phone?: string;
  userId?: number;
  preferences?: ClientPreferences;
}

/**
 * Emergency Contact Interface
 */
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
}

/**
 * Payment Information Interface
 */
export interface PaymentInfo {
  status: PaymentStatus;
  amount: number;
  currency: string;
  method?: string;
  transactionId?: string;
  refundAmount?: number;
  refundDate?: string;
}

/**
 * Payment Status Enumeration
 */
export type PaymentStatus = 
  | 'unpaid'
  | 'paid'
  | 'refunded'
  | 'partial';

/**
 * Booking Feedback Interface
 */
export interface BookingFeedback {
  rating: number; // 1-5
  comments?: string;
  trainerRating?: number;
  facilityRating?: number;
  wouldRecommend?: boolean;
}

/**
 * Client Preferences Interface
 */
export interface ClientPreferences {
  preferredTime?: string;
  preferredTrainer?: number;
  sessionType?: SessionType;
  location?: string;
  specialRequests?: string;
  communicationMethod?: 'email' | 'phone' | 'sms';
}

// ===== RECURRING EVENTS =====

/**
 * Recurring Pattern Interface
 */
export interface RecurringPattern {
  frequency: RecurrenceFrequency;
  interval: number;
  daysOfWeek?: number[];
  endDate?: string;
  occurrences?: number;
  exceptions?: string[];
  monthlyPattern?: MonthlyPattern;
  yearlyPattern?: YearlyPattern;
}

/**
 * Recurrence Frequency Enumeration
 */
export type RecurrenceFrequency = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';

/**
 * Monthly Pattern Interface
 */
export interface MonthlyPattern {
  type: 'date' | 'weekday';
  dateOfMonth?: number;
  weekOfMonth?: number;
  dayOfWeek?: number;
}

/**
 * Yearly Pattern Interface
 */
export interface YearlyPattern {
  month: number;
  dateOfMonth?: number;
  weekOfMonth?: number;
  dayOfWeek?: number;
}

// ===== CALENDAR SETTINGS =====

/**
 * Calendar Settings Interface
 */
export interface CalendarSettings {
  defaultView: CalendarView;
  firstDay: number;
  timeFormat: string;
  dateFormat: string;
  slotDuration: string;
  businessHours: BusinessHours;
  weekendEnabled: boolean;
  emailNotifications: boolean;
  calendarColors: CalendarColors;
  bookingSettings: BookingSettings;
  performanceSettings?: PerformanceSettings;
  accessibilitySettings?: AccessibilitySettings;
}

/**
 * Calendar View Type
 */
export type CalendarView = 
  | 'dayGridMonth'
  | 'timeGridWeek'
  | 'timeGridDay'
  | 'listWeek'
  | 'listMonth';

/**
 * Business Hours Interface
 */
export interface BusinessHours {
  start: string;
  end: string;
  daysOfWeek?: number[];
}

/**
 * Calendar Colors Configuration
 */
export interface CalendarColors {
  session: string;
  availability: string;
  blocked: string;
  group_class: string;
  workshop: string;
  assessment: string;
}

/**
 * Booking Settings Interface
 */
export interface BookingSettings {
  advanceDays: number;
  noticeHours: number;
  autoConfirm: boolean;
  requirePayment?: boolean;
  allowCancellation?: boolean;
  cancellationHours?: number;
  maxBookingsPerClient?: number;
  waitlistEnabled?: boolean;
}

/**
 * Performance Settings Interface
 */
export interface PerformanceSettings {
  enableCaching: boolean;
  cacheDuration: number;
  lazyLoadEvents: boolean;
  virtualScrolling: boolean;
  prefetchTrainerData: boolean;
  maxEventsPerRequest: number;
}

/**
 * Accessibility Settings Interface
 */
export interface AccessibilitySettings {
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  focusIndicators: boolean;
}

// ===== WORDPRESS INTEGRATION =====

/**
 * WordPress Calendar Data Interface
 * Matches the PHP provider output structure
 */
export interface WordPressCalendarData {
  settings: CalendarSettings;
  statistics: CalendarStatistics;
  events: CalendarEvent[];
  trainers: TrainerData[];
  integration: IntegrationStatus;
  endpoints: APIEndpoints;
}

/**
 * Calendar Statistics Interface
 */
export interface CalendarStatistics {
  totalEvents: number;
  confirmedEvents: number;
  lastUpdated: string | number;
  upcomingEvents?: number;
  completedEvents?: number;
  cancelledEvents?: number;
}

/**
 * Integration Status Interface
 */
export interface IntegrationStatus {
  personalTraining: FeatureIntegration;
  trainingFeatures: FeatureIntegration;
  status: 'active' | 'inactive' | 'error';
  version: string;
}

/**
 * Feature Integration Interface
 */
export interface FeatureIntegration {
  enabled: boolean;
  dataSource: string;
  trainersCount?: number;
  featuresCount?: number;
}

/**
 * API Endpoints Interface
 */
export interface APIEndpoints {
  getEvents: string;
  saveEvent: string;
  deleteEvent: string;
  getTrainers?: string;
  saveBooking?: string;
  getAvailability?: string;
}

/**
 * Contact Information Interface
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  socialMedia?: SocialMediaLinks;
}

/**
 * Social Media Links Interface
 */
export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

// ===== COMPONENT PROPS INTERFACES =====

/**
 * Calendar View Component Props
 */
export interface CalendarViewProps {
  events: CalendarEvent[];
  trainers: TrainerData[];
  settings: CalendarSettings;
  loading?: LoadingState | boolean;
  currentView?: CalendarView;
  currentDate?: Date;
  onEventClick?: (event: EventApi) => void;
  onDateSelect?: (selectInfo: any) => void;
  onEventDrop?: (dropInfo: any) => void;
  onEventResize?: (resizeInfo: any) => void;
  onViewChange?: (view: CalendarView) => void;
  onDateChange?: (date: Date) => void;
  className?: string;
}

/**
 * Event Modal Component Props
 */
export interface EventModalProps {
  event?: CalendarEvent;
  isOpen: boolean;
  mode: 'view' | 'edit' | 'create';
  trainers: TrainerData[];
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string | number) => void;
  className?: string;
}

/**
 * Calendar Controls Component Props
 */
export interface CalendarControlsProps {
  currentView: CalendarView;
  currentDate: Date;
  trainers: TrainerData[];
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  onDateChange: (date: Date) => void;
  onFilterChange: (filters: EventFilters) => void;
  className?: string;
}

/**
 * Event Filters Interface
 */
export interface EventFilters {
  trainerId?: number;
  eventType?: EventType;
  bookingStatus?: BookingStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Booking Form Component Props
 */
export interface BookingFormProps {
  event: CalendarEvent;
  trainer: TrainerData;
  onSubmit: (bookingData: BookingData) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

/**
 * Trainer Availability Component Props
 */
export interface TrainerAvailabilityProps {
  trainer: TrainerData;
  availability: TrainerAvailability[];
  onAvailabilityChange: (availability: TrainerAvailability[]) => void;
  editable?: boolean;
  className?: string;
}

/**
 * Skeleton Loader Component Props
 */
export interface SkeletonLoaderProps {
  type?: 'calendar' | 'event-list' | 'event-card' | 'trainer-card';
  count?: number;
  className?: string;
}

/**
 * Error Boundary Component Props
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: any) => void;
  className?: string;
}

/**
 * Error Fallback Component Props
 */
export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  className?: string;
}

// ===== UTILITY TYPES =====

/**
 * API Response Interface
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp?: string;
}

/**
 * Calendar API Response Interface
 * Specific response format for calendar data
 */
export interface CalendarApiResponse {
  success: boolean;
  data: {
    events?: CalendarEvent[];
    trainers?: TrainerData[];
    event?: CalendarEvent;
    trainer?: TrainerData;
    total?: number;
    has_more?: boolean;
  };
  message?: string;
  errors?: string[];
}

/**
 * Loading State Type
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Calendar Action Types
 */
export type CalendarAction = 
  | 'create_event'
  | 'update_event'
  | 'delete_event'
  | 'move_event'
  | 'resize_event'
  | 'book_event'
  | 'cancel_booking'
  | 'confirm_booking';

/**
 * Form Validation Error Interface
 */
export interface FormValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Calendar Theme Interface
 */
export interface CalendarTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
  fonts: {
    family: string;
    sizes: {
      small: string;
      medium: string;
      large: string;
    };
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

// ===== UTILITY TYPE GUARDS =====

/**
 * Type guard for CalendarEvent
 */
export const isCalendarEvent = (obj: any): obj is CalendarEvent => {
  return obj && 
    typeof obj.id !== 'undefined' && 
    typeof obj.title === 'string' &&
    typeof obj.start !== 'undefined' &&
    typeof obj.end !== 'undefined';
};

/**
 * Type guard for TrainerData
 */
export const isTrainerData = (obj: any): obj is TrainerData => {
  return obj && 
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.specialty === 'string';
};

/**
 * Type guard for BookingData
 */
export const isBookingData = (obj: any): obj is BookingData => {
  return obj && 
    typeof obj.eventId === 'number' &&
    obj.clientInfo &&
    typeof obj.clientInfo.name === 'string' &&
    typeof obj.clientInfo.email === 'string';
}; 