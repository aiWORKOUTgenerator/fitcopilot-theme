/**
 * EventModal Component Tests
 * 
 * Test suite for the Training Calendar EventModal component
 * Verifies modal functionality, basic rendering, and user interactions
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarEvent, EventModalProps, TrainerData } from '../../interfaces';
import EventModal from './EventModal';

// Mock the hooks and utilities
jest.mock('../../hooks/useTrainerAvailability', () => ({
  useTrainerAvailability: () => ({
    schedulingResult: null,
    loading: false,
    error: null,
    selectedSlot: null,
    findAvailableSlots: jest.fn(),
    clearResults: jest.fn(),
    retryLastSearch: jest.fn(),
    selectSlot: jest.fn(),
    clearSelectedSlot: jest.fn()
  })
}));

jest.mock('../../utils/dateTimeUtils', () => ({
  parseFromDateTimeLocal: jest.fn((dateStr) => new Date(dateStr)),
  formatDateTime: jest.fn((date) => new Date(date).toISOString()),
  formatDuration: jest.fn(() => '60 minutes')
}));

// Mock UserRegistrationModal
jest.mock('../UserRegistrationModal/UserRegistrationModal', () => {
  return function MockUserRegistrationModal({ isOpen, onClose }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="user-registration-modal">
        <button onClick={onClose}>Close Registration</button>
      </div>
    );
  };
});

// Test data
const mockTrainers: TrainerData[] = [
  {
    id: 1,
    name: 'Justin Fassio',
    email: 'justin@fitcopilot.com',
    specialty: 'Personal Training',
    yearsExperience: 5,
    clientsCount: 50,
    featured: true,
    active: true,
    coachType: 'personal',
    availability: []
  }
];

const mockEvent: CalendarEvent = {
  id: '1',
  title: 'Personal Training Session',
  description: 'One-on-one personal training session',
  start: '2024-01-15T10:00:00',
  end: '2024-01-15T11:00:00',
  trainerId: 1,
  eventType: 'session',
  bookingStatus: 'confirmed',
  sessionType: 'individual',
  location: 'Google Meet',
  duration: 60,
  maxParticipants: 1,
  currentParticipants: 1
};

describe('EventModal', () => {
  const defaultProps: EventModalProps = {
    isOpen: true,
    mode: 'view',
    trainers: mockTrainers,
    loading: false,
    selectedDate: new Date('2024-01-15T10:00:00'),
    onClose: jest.fn(),
    onSave: jest.fn(),
    onDelete: jest.fn(),
    onModeChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<EventModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Event Details')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<EventModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('displays loading state when loading prop is true', () => {
      render(<EventModal {...defaultProps} loading={true} />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('has proper modal attributes', () => {
      render(<EventModal {...defaultProps} />);
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
      expect(modal).toHaveAttribute('aria-describedby');
    });
  });

  describe('View Mode', () => {
    it('displays event details in view mode', () => {
      render(<EventModal {...defaultProps} event={mockEvent} mode="view" />);
      expect(screen.getByText('Personal Training Session')).toBeInTheDocument();
      expect(screen.getByText('One-on-one personal training session')).toBeInTheDocument();
    });

    it('shows event location when available', () => {
      render(<EventModal {...defaultProps} event={mockEvent} mode="view" />);
      expect(screen.getByText(/Google Meet/)).toBeInTheDocument();
    });

    it('displays booking status', () => {
      render(<EventModal {...defaultProps} event={mockEvent} mode="view" />);
      expect(screen.getByText(/Confirmed Booking/)).toBeInTheDocument();
    });

    it('shows event type badge', () => {
      render(<EventModal {...defaultProps} event={mockEvent} mode="view" />);
      // Look specifically for the event type badge element
      const eventTypeBadge = screen.getByText('Training Session').closest('.event-type-badge');
      expect(eventTypeBadge).toBeInTheDocument();
    });
  });

  describe('Create Mode', () => {
    it('renders form elements in create mode', () => {
      render(<EventModal {...defaultProps} mode="create" />);
      expect(screen.getByText(/Event Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Schedule/i)).toBeInTheDocument();
      expect(screen.getByText(/Session Details/i)).toBeInTheDocument();
    });

    it('shows form sections for event creation', () => {
      render(<EventModal {...defaultProps} mode="create" />);
      const formSections = screen.getAllByText(/Event Details|Schedule|Session Details/);
      expect(formSections.length).toBeGreaterThan(0);
    });
  });

  describe('User Interactions', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      
      render(<EventModal {...defaultProps} onClose={mockOnClose} />);
      
      const closeButton = screen.getByLabelText(/close modal/i);
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles Escape key to close modal', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      
      render(<EventModal {...defaultProps} onClose={mockOnClose} />);
      
      await user.keyboard('{Escape}');
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('prevents background click from propagating', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      
      render(<EventModal {...defaultProps} onClose={mockOnClose} />);
      
      const modalContainer = screen.getByRole('dialog');
      await user.click(modalContainer);
      
      // Should not close when clicking the modal content
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Mode Switching', () => {
    it('renders different content based on mode prop', () => {
      const { rerender } = render(<EventModal {...defaultProps} event={mockEvent} mode="view" />);
      
      // View mode shows event details
      expect(screen.getByText('Personal Training Session')).toBeInTheDocument();
      
      // Switch to create mode
      rerender(<EventModal {...defaultProps} mode="create" />);
      
      // Create mode shows form sections
      expect(screen.getByText(/Event Details/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing event data gracefully', () => {
      render(<EventModal {...defaultProps} event={undefined} mode="view" />);
      
      // Should not crash when event is undefined
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('handles empty trainers array gracefully', () => {
      render(<EventModal {...defaultProps} trainers={[]} />);
      
      // Should not crash when trainers array is empty
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('handles invalid dates gracefully', () => {
      const eventWithInvalidDate = {
        ...mockEvent,
        start: 'invalid-date',
        end: 'invalid-date'
      };
      
      render(<EventModal {...defaultProps} event={eventWithInvalidDate} mode="view" />);
      
      // Should still render the modal without crashing
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('handles required props correctly', () => {
      const requiredProps = {
        isOpen: true,
        mode: 'view' as const,
        onClose: jest.fn(),
        onSave: jest.fn()
      };
      
      render(<EventModal {...requiredProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('uses default values for optional props', () => {
      const minimalProps = {
        isOpen: true,
        mode: 'view' as const,
        onClose: jest.fn(),
        onSave: jest.fn()
      };
      
      render(<EventModal {...minimalProps} />);
      
      // Should render with default values
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('initializes properly on mount', () => {
      render(<EventModal {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Event Details')).toBeInTheDocument();
    });

    it('cleans up properly on unmount', () => {
      const { unmount } = render(<EventModal {...defaultProps} />);
      
      unmount();
      
      // Should not have any lingering modal elements
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
}); 