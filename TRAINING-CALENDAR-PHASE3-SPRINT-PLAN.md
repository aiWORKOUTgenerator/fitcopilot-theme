# Training Calendar Phase 3 Sprint Plan
**Advanced Features Implementation (Week 5-6)**

## 📊 Current Implementation State Review

### ✅ **Phase 2 Achievements (Complete)**
- **Component Architecture**: 4 production-ready React components (TrainingCalendar, CalendarControls, EventModal, BookingForm)
- **TypeScript Foundation**: 6.5KB of comprehensive type definitions with 382 lines
- **FullCalendar Integration**: All 4 plugins (daygrid, timegrid, interaction, list) successfully integrated
- **SCSS Styling**: 11KB of modern styling with 545 lines following design system patterns
- **Backend Architecture**: Complete 6-module PHP structure following Personal Training patterns
- **Database Schema**: Recurring events and drag & drop foundation already established
- **Build Integration**: Zero critical webpack errors, successful compilation

### 🔍 **Identified Phase 3 Opportunities**
Based on code analysis, the following advanced features are **architected but not implemented**:

1. **Recurring Events**: Database schema includes `recurring_rule json` and `parent_event_id` fields
2. **Drag & Drop**: FullCalendar interaction plugin loaded but `editable={false}` and `droppable={false}`
3. **Real-time Updates**: AJAX endpoints established but no live data refresh
4. **Advanced Booking Workflows**: Multi-step booking forms and payment integration ready
5. **Mobile Touch Interactions**: Responsive design in place but advanced touch gestures missing

---

## 🎯 Phase 3 Sprint Objectives

### **Sprint Goal**
Transform the Training Calendar from a display-focused component into a fully interactive, enterprise-level scheduling system with advanced booking capabilities, real-time updates, and mobile-optimized user experience.

### **Success Metrics**
- **Recurring Events**: 100% support for weekly/monthly patterns with 50+ event instances
- **Drag & Drop**: Admin event management with <200ms response time
- **Real-time Updates**: Live data refresh every 30 seconds with optimistic UI
- **Mobile UX**: Touch gestures working on iOS/Android with haptic feedback
- **Advanced Booking**: Multi-step workflow with 90% completion rate

---

## 📅 **Week 5: Advanced Calendar Features**

### **Day 1-2: Recurring Events System**

**🔄 Task 5.1: Recurring Events Backend**
- **File**: `inc/admin/training-calendar/class-training-calendar-data.php`
- **Implementation**:
  ```php
  // Add recurring event creation methods
  public function create_recurring_event($base_event, $recurrence_pattern) {
      // Generate recurring instances based on pattern
      // Support: daily, weekly, monthly, custom intervals
      // Handle exceptions and overrides
  }
  
  public function update_recurring_series($event_id, $update_type = 'this', $data) {
      // 'this' = single instance
      // 'future' = this and future instances  
      // 'all' = entire series
  }
  ```

**🎨 Task 5.2: Recurring Events Frontend**
- **File**: `src/features/Homepage/TrainingCalendar/components/RecurringEventModal/`
- **New Component**: Advanced recurring event configuration interface
- **Features**:
  - Visual pattern selector (daily/weekly/monthly)
  - End date or occurrence count options
  - Exception date handling
  - Series editing capabilities

**📋 Task 5.3: Recurring Events Types**
- **File**: `src/features/Homepage/TrainingCalendar/types.ts`
- **Enhancement**:
  ```typescript
  export interface RecurringEventPattern {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // Every X days/weeks/months
    daysOfWeek?: number[]; // For weekly patterns
    endDate?: string;
    occurrences?: number;
    exceptions?: string[]; // Excluded dates
  }
  
  export interface RecurringEventSeries {
    seriesId: string;
    baseEvent: CalendarEvent;
    pattern: RecurringEventPattern;
    instances: CalendarEvent[];
  }
  ```

### **Day 3-4: Drag & Drop Event Management**

**🖱️ Task 5.4: Drag & Drop Backend**
- **File**: `inc/admin/training-calendar/class-training-calendar-ajax.php`
- **Implementation**:
  ```php
  public function handle_event_drop() {
      // Validate new time slot availability
      // Check trainer conflicts
      // Update event timing
      // Send real-time notifications
  }
  
  public function handle_event_resize() {
      // Validate duration changes
      // Update end time
      // Recalculate pricing if needed
  }
  ```

**⚛️ Task 5.5: Drag & Drop Frontend Enhancement**
- **File**: `src/features/Homepage/TrainingCalendar/TrainingCalendar.tsx`
- **Modifications**:
  ```typescript
  // Enable FullCalendar drag & drop
  editable={true}
  droppable={true}
  eventResizableFromStart={true}
  eventDurationEditable={true}
  
  // Add event handlers
  eventDrop={handleEventDrop}
  eventResize={handleEventResize}
  ```

**🔐 Task 5.6: Admin Permission System**
- **Implementation**: Role-based drag & drop permissions
- **Features**: 
  - Trainers can only edit their own events
  - Admins have full edit capabilities
  - Client bookings are protected from editing

### **Day 5: Real-time Updates & Live Data**

**⚡ Task 5.7: Real-time Data Provider**
- **File**: `src/features/Homepage/TrainingCalendar/hooks/useRealTimeCalendar.ts`
- **New Hook**:
  ```typescript
  export const useRealTimeCalendar = () => {
    // WebSocket or polling-based live updates
    // Optimistic UI updates
    // Conflict resolution
    // Connection status management
  };
  ```

**🔄 Task 5.8: Live Event Synchronization**
- **Backend**: WordPress heartbeat API integration
- **Frontend**: Event change detection and live refresh
- **Features**:
  - New bookings appear instantly
  - Event modifications sync across users
  - Connection status indicator

---

## 📱 **Week 6: Mobile & Advanced Booking**

### **Day 1-2: Mobile Touch Interactions**

**📱 Task 6.1: Mobile Gesture System**
- **File**: `src/features/Homepage/TrainingCalendar/hooks/useMobileGestures.ts`
- **Implementation**:
  ```typescript
  export const useMobileGestures = () => {
    // Swipe navigation between calendar views
    // Long press for event details
    // Pinch to zoom for time grid
    // Pull to refresh for data updates
  };
  ```

**🎨 Task 6.2: Mobile-Optimized Event Modal**
- **File**: `src/features/Homepage/TrainingCalendar/components/EventModal/EventModal.scss`
- **Enhancements**:
  - Full-screen modal on mobile
  - Bottom sheet slide-up animation
  - Large touch targets (44px minimum)
  - Haptic feedback integration

**📐 Task 6.3: Responsive Calendar Layout**
- **Mobile Views**: 
  - Compact day view as default
  - Horizontal swipe between days
  - Simplified list view for small screens
- **Tablet Views**:
  - Split-view calendar + event details
  - Drag & drop with touch feedback

### **Day 3-4: Advanced Booking Workflows**

**🛒 Task 6.4: Multi-step Booking Form**
- **File**: `src/features/Homepage/TrainingCalendar/components/BookingFlow/`
- **New Components**:
  ```
  BookingFlow/
  ├── BookingWizard.tsx          # Multi-step wizard container
  ├── StepEventDetails.tsx       # Event confirmation
  ├── StepPersonalInfo.tsx       # User information
  ├── StepPreferences.tsx        # Session preferences
  ├── StepPayment.tsx           # Payment processing
  └── StepConfirmation.tsx      # Booking confirmation
  ```

**💳 Task 6.5: Payment Integration Foundation**
- **Backend**: Payment provider hooks (Stripe/PayPal ready)
- **Frontend**: Payment form components
- **Features**:
  - Secure payment processing
  - Booking confirmation emails
  - Calendar sync after payment

**📧 Task 6.6: Automated Notification System**
- **Email Templates**: Booking confirmations, reminders, cancellations
- **SMS Integration**: Optional text message notifications
- **Calendar Invites**: .ics file generation for user calendars

### **Day 5: Integration & Testing**

**🔗 Task 6.7: Personal Training Deep Integration**
- **Trainer Profile Sync**: Real-time availability from Personal Training data
- **Client History**: Previous session data in booking flow
- **Preference Learning**: AI-powered session recommendations

**🧪 Task 6.8: Comprehensive Testing Suite**
- **Unit Tests**: All new components and hooks
- **Integration Tests**: Full booking workflow end-to-end
- **Mobile Testing**: Touch interaction validation
- **Performance Tests**: Real-time update load testing

---

## 🛠️ Technical Implementation Details

### **Database Enhancements**

**Recurring Events Table Extension**:
```sql
ALTER TABLE fitcopilot_calendar_events 
ADD COLUMN recurring_pattern JSON,
ADD COLUMN series_id VARCHAR(36),
ADD COLUMN instance_date DATE,
ADD INDEX idx_series_id (series_id),
ADD INDEX idx_instance_date (instance_date);
```

**Real-time Updates Table**:
```sql
CREATE TABLE fitcopilot_calendar_updates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT UNSIGNED,
    update_type ENUM('created', 'updated', 'deleted', 'booked'),
    update_data JSON,
    user_id BIGINT UNSIGNED,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_event_id (event_id)
);
```

### **New TypeScript Interfaces**

```typescript
// Advanced event management
export interface DragDropEvent {
  eventId: string;
  newStart: string;
  newEnd: string;
  oldStart: string;
  oldEnd: string;
  trainerId?: string;
}

export interface RealTimeUpdate {
  type: 'event_created' | 'event_updated' | 'event_booked' | 'event_cancelled';
  eventId: string;
  data: Partial<CalendarEvent>;
  timestamp: string;
  userId: string;
}

// Mobile gesture types
export interface GestureEvent {
  type: 'swipe' | 'longpress' | 'pinch' | 'tap';
  direction?: 'left' | 'right' | 'up' | 'down';
  target: HTMLElement;
  coordinates: { x: number; y: number };
}

// Advanced booking workflow
export interface BookingWizardState {
  currentStep: number;
  totalSteps: number;
  eventData: CalendarEvent;
  userInfo: BookingFormData;
  preferences: SessionPreferences;
  paymentInfo: PaymentData;
  isComplete: boolean;
}
```

### **Performance Optimizations**

1. **Event Virtualization**: Render only visible events for large datasets
2. **Lazy Loading**: Load event details on demand
3. **Caching Strategy**: Browser storage for frequently accessed data
4. **Bundle Splitting**: Separate chunks for advanced features
5. **Image Optimization**: WebP trainer photos with fallbacks

### **Security Enhancements**

1. **CSRF Protection**: Enhanced nonce validation for drag & drop operations
2. **Permission Validation**: Server-side verification for all event modifications
3. **Rate Limiting**: Prevent abuse of real-time update endpoints
4. **Data Sanitization**: Comprehensive input validation for recurring patterns
5. **Audit Logging**: Track all calendar modifications for compliance

---

## 📋 Implementation Checklist

### **Week 5 Deliverables**
- [ ] Recurring events creation and management system
- [ ] Drag & drop event editing with conflict detection
- [ ] Real-time data synchronization with optimistic UI
- [ ] Enhanced database schema with performance indexes
- [ ] Comprehensive TypeScript type definitions

### **Week 6 Deliverables**
- [ ] Mobile-optimized touch gesture system
- [ ] Multi-step booking workflow with payment integration
- [ ] Automated notification and reminder system
- [ ] Deep integration with Personal Training feature
- [ ] Full test suite with 90%+ coverage

### **Phase 3 Success Criteria**
- [ ] ✅ Recurring events working for 100+ instances
- [ ] ✅ Drag & drop operations under 200ms response time
- [ ] ✅ Real-time updates with 99.9% reliability
- [ ] ✅ Mobile touch interactions on iOS/Android
- [ ] ✅ Advanced booking completion rate >90%
- [ ] ✅ Zero critical security vulnerabilities
- [ ] ✅ Performance maintained under 2s load time

---

## 🔄 Integration with Existing Features

### **Personal Training Sync**
- Trainer availability automatically populates calendar
- Client booking history influences session recommendations
- Real-time capacity management across features

### **Training Features Connection**
- Workshop and seminar scheduling through calendar
- Feature-specific booking workflows
- Cross-promotion of related training programs

### **WordPress Admin Consistency**
- Calendar management follows Personal Training admin patterns
- Consistent security and validation approaches
- Unified styling and user experience

---

## 🚀 Post-Phase 3 Foundation

Phase 3 will establish the foundation for Phase 4 optimizations:

1. **AI-Powered Scheduling**: Smart conflict resolution and recommendations
2. **Advanced Analytics**: Booking patterns and trainer performance metrics
3. **Multi-location Support**: Gym location management and scheduling
4. **API Integration**: Third-party calendar sync (Google, Outlook, Apple)
5. **Enterprise Features**: Bulk operations and administrative reporting

Phase 3 transforms the Training Calendar into a **comprehensive scheduling platform** that serves as the central hub for all FitCopilot training activities, setting the stage for enterprise-level fitness management capabilities. 