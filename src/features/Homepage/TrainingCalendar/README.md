# 🗓️ Training Calendar React Component

**Component Type**: Complex Homepage Feature  
**Architecture Pattern**: Personal Training Gold Standard  
**FullCalendar Integration**: React Wrapper with Performance Optimization  
**Cross-Feature Utilization**: Multi-section calendar functionality  

---

## **⚛️ Component Architecture Overview**

The Training Calendar React component provides sophisticated calendar functionality that integrates seamlessly with the Personal Training feature while serving multiple sections across the FitCopilot ecosystem.

### **📁 Component Structure**

```
src/features/Homepage/TrainingCalendar/
├── TrainingCalendar.tsx                    # Main calendar component
├── TrainingCalendar.scss                   # Component styling
├── interfaces.ts                           # TypeScript interfaces
├── types.ts                               # Calendar-specific types
├── index.ts                               # Exports management
├── components/                            # Sub-components
│   ├── CalendarView/                      # FullCalendar wrapper
│   │   ├── CalendarView.tsx
│   │   ├── CalendarView.scss
│   │   └── index.ts
│   ├── EventModal/                        # Event details modal
│   │   ├── EventModal.tsx
│   │   ├── EventModal.scss
│   │   └── index.ts
│   ├── TrainerAvailability/               # Trainer scheduling
│   │   ├── TrainerAvailability.tsx
│   │   ├── TrainerAvailability.scss
│   │   └── index.ts
│   ├── BookingForm/                       # Appointment booking
│   │   ├── BookingForm.tsx
│   │   ├── BookingForm.scss
│   │   └── index.ts
│   └── CalendarControls/                  # Navigation & filters
│       ├── CalendarControls.tsx
│       ├── CalendarControls.scss
│       └── index.ts
├── hooks/                                 # Calendar-specific hooks
│   ├── useCalendarData.ts                 # Data fetching
│   ├── useEventHandlers.ts                # Event management
│   └── useBookingFlow.ts                  # Booking workflow
├── utils/                                 # Calendar utilities
│   ├── dateHelpers.ts                     # Date manipulation
│   ├── eventFormatters.ts                 # Event formatting
│   └── calendarConfig.ts                  # FullCalendar config
├── variants/                              # Theme variants
│   ├── default/
│   ├── minimalist/
│   └── modern/
└── media/                                 # Component assets
    ├── images/
    └── videos/
```

---

## **🔗 Integration with Personal Training**

### **Data Flow Architecture**
```typescript
interface TrainingCalendarData {
  // Personal Training Integration
  trainers: WordPressTrainer[];
  trainerAvailability: TrainerAvailability[];
  
  // Calendar-Specific Data
  events: CalendarEvent[];
  bookings: BookingData[];
  
  // Cross-Feature Integration
  trainingFeatures: Workshop[];
  groupClasses: GroupClass[];
  
  // Configuration
  settings: CalendarSettings;
}
```

### **Trainer Data Synchronization**
```typescript
interface TrainerAvailability {
  trainerId: number;
  trainerName: string;
  specialty: string;
  availableSlots: TimeSlot[];
  bookedSessions: CalendarEvent[];
  recurringAvailability: RecurringRule[];
}
```

---

## **📊 FullCalendar React Integration**

### **Bundle Size Optimization Strategy**
```typescript
// Optimized FullCalendar imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

// Tree-shaken import approach
const calendarPlugins = [
  dayGridPlugin,    // Month view
  timeGridPlugin,   // Week/Day views  
  interactionPlugin, // User interactions
  listPlugin        // Mobile list view
];
```

### **Performance Optimization**
```typescript
// React.memo for performance
export const TrainingCalendar = React.memo<TrainingCalendarProps>(({
  trainers,
  events,
  settings,
  onEventSelect,
  onDateSelect
}) => {
  // Component implementation with optimized re-renders
});

// Debounced event handlers
const debouncedEventSelect = useCallback(
  debounce((eventInfo: EventClickArg) => {
    onEventSelect(eventInfo.event);
  }, 100),
  [onEventSelect]
);
```

---

## **🎨 Component Interfaces**

### **Main Component Props**
```typescript
interface TrainingCalendarProps {
  // Data from WordPress backend
  trainers: WordPressTrainer[];
  events: CalendarEvent[];
  settings: CalendarSettings;
  
  // Event handlers
  onEventSelect: (event: CalendarEvent) => void;
  onDateSelect: (date: Date) => void;
  onTrainerSelect: (trainer: WordPressTrainer) => void;
  onBookingSubmit: (booking: BookingData) => void;
  
  // Display options
  initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  showTrainerFilter?: boolean;
  showEventTypeFilter?: boolean;
  enableBooking?: boolean;
  
  // Styling
  theme?: CalendarTheme;
  className?: string;
}
```

### **Calendar Event Interface**
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  
  // Trainer integration
  trainerId: number;
  trainerName: string;
  trainerSpecialty: string;
  
  // Event classification  
  eventType: 'session' | 'availability' | 'blocked' | 'group_class' | 'workshop';
  
  // Booking information
  bookingStatus: 'available' | 'pending' | 'confirmed' | 'cancelled' | 'completed';
  clientInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  
  // Styling
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  
  // Recurring events
  recurringRule?: RecurringRule;
  
  // Additional metadata
  description?: string;
  location?: string;
  maxParticipants?: number;
  currentParticipants?: number;
}
```

### **Booking Workflow Interface**
```typescript
interface BookingData {
  eventId: string;
  trainerId: number;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
  preferredDateTime: Date;
  sessionType: 'individual' | 'group' | 'assessment';
  duration: number; // minutes
  specialRequests?: string;
}
```

---

## **🔧 Custom Hooks**

### **useCalendarData Hook**
```typescript
export const useCalendarData = (trainerId?: number) => {
  const [calendarData, setCalendarData] = useState<TrainingCalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data fetching logic with Personal Training integration
  // Real-time updates and synchronization
  // Error handling and retry logic
  
  return { calendarData, loading, error, refetch };
};
```

### **useEventHandlers Hook**
```typescript
export const useEventHandlers = (onEventUpdate: (event: CalendarEvent) => void) => {
  const handleEventClick = useCallback((eventInfo: EventClickArg) => {
    // Event selection logic
  }, []);
  
  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    // Date selection for new events
  }, []);
  
  const handleEventDrop = useCallback((dropInfo: EventDropArg) => {
    // Drag and drop event rescheduling
  }, []);
  
  return { handleEventClick, handleDateSelect, handleEventDrop };
};
```

### **useBookingFlow Hook**
```typescript
export const useBookingFlow = () => {
  const [bookingModal, setBookingModal] = useState<BookingModalState>({
    isOpen: false,
    selectedEvent: null,
    step: 'details'
  });
  
  // Booking workflow management
  // Form validation and submission
  // Success/error handling
  
  return { bookingModal, openBooking, closeBooking, submitBooking };
};
```

---

## **🎨 Styling Architecture**

### **SCSS Structure**
```scss
// TrainingCalendar.scss
.training-calendar {
  // Base calendar container styles
  
  &__header {
    // Calendar controls and navigation
  }
  
  &__main {
    // FullCalendar wrapper
    
    .fc {
      // FullCalendar customizations
      // Theme integration
      // Responsive adjustments
    }
  }
  
  &__sidebar {
    // Trainer filters and controls
  }
  
  &__modal {
    // Event and booking modals
  }
  
  // Responsive breakpoints
  @media (max-width: 768px) {
    // Mobile optimizations
  }
}
```

### **Theme Variants**
```scss
// variants/default/TrainingCalendar.scss
.training-calendar {
  &--default {
    // Default theme styling
  }
}

// variants/minimalist/TrainingCalendar.scss  
.training-calendar {
  &--minimalist {
    // Minimalist theme styling
  }
}

// variants/modern/TrainingCalendar.scss
.training-calendar {
  &--modern {
    // Modern theme styling
  }
}
```

---

## **📱 Responsive Design Strategy**

### **Breakpoint Approach**
- **Desktop (1200px+)**: Full calendar with sidebar filters
- **Tablet (768px-1199px)**: Compact calendar with collapsible sidebar
- **Mobile (< 768px)**: List view with touch-optimized interactions

### **Mobile-First Optimizations**
```typescript
const useMobileOptimizations = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return {
    isMobile,
    calendarHeight: isMobile ? 'auto' : '600px',
    initialView: isMobile ? 'listWeek' : 'dayGridMonth',
    headerToolbar: isMobile ? mobileToolbar : desktopToolbar
  };
};
```

---

## **🚀 Performance Optimization**

### **Code Splitting**
```typescript
// Lazy loading for calendar component
const TrainingCalendar = lazy(() => import('./TrainingCalendar'));

// Usage with Suspense
<Suspense fallback={<CalendarSkeleton />}>
  <TrainingCalendar {...props} />
</Suspense>
```

### **Virtual Scrolling for Large Datasets**
```typescript
const useVirtualizedEvents = (events: CalendarEvent[]) => {
  const [visibleEvents, setVisibleEvents] = useState<CalendarEvent[]>([]);
  
  // Implement virtualization logic for 1000+ events
  // Only render events in current view range
  
  return visibleEvents;
};
```

---

## **🧪 Testing Strategy**

### **Component Testing**
```typescript
// TrainingCalendar.test.tsx
describe('TrainingCalendar Component', () => {
  test('renders calendar with trainer data', () => {
    render(<TrainingCalendar trainers={mockTrainers} events={mockEvents} />);
    // Test calendar rendering
  });
  
  test('handles event selection', () => {
    const onEventSelect = jest.fn();
    render(<TrainingCalendar onEventSelect={onEventSelect} />);
    // Test event interaction
  });
  
  test('integrates with booking workflow', () => {
    // Test booking form integration
  });
});
```

### **Integration Testing**
```typescript
// Integration with Personal Training data
describe('Personal Training Integration', () => {
  test('syncs trainer availability', () => {
    // Test data synchronization
  });
  
  test('updates calendar when trainer data changes', () => {
    // Test real-time updates
  });
});
```

---

## **📦 Export Structure**

```typescript
// index.ts
export { TrainingCalendar } from './TrainingCalendar';
export type { 
  TrainingCalendarProps,
  CalendarEvent,
  BookingData,
  CalendarSettings
} from './interfaces';
export { 
  useCalendarData,
  useEventHandlers,
  useBookingFlow
} from './hooks';
export {
  formatEventForCalendar,
  validateBookingData,
  getAvailableSlots
} from './utils';
```

---

## **🎯 Integration Checklist**

### **Personal Training Integration**
- ✅ Trainer data synchronization
- ✅ Availability management
- ✅ Session booking workflow
- ✅ Real-time updates

### **Cross-Feature Integration**
- ✅ Training Features workshop scheduling
- ✅ Group class management
- ✅ Journey milestone tracking
- ✅ Assessment booking

### **Performance & UX**
- ✅ Bundle size optimization
- ✅ Mobile responsiveness  
- ✅ Touch interactions
- ✅ Accessibility compliance

---

*Built following FitCopilot React component excellence standards and Homepage feature architectural patterns.* 