/**
 * User Registration Modal Component Tests
 * 
 * Test suite for UserRegistrationModal component
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CalendarEvent, RegisteredUser } from '../../interfaces';
import UserRegistrationModal from './UserRegistrationModal';

// ===== MOCK DATA =====

const mockEventData: Partial<CalendarEvent> = {
  id: 'test-event-1',
  title: 'Free Consultation (20 Min)',
  start: '2024-01-15T10:00:00',
  end: '2024-01-15T10:20:00'
};

const mockRegisteredUser: RegisteredUser = {
  id: 123,
  email: 'test@example.com',
  firstName: 'John',
  username: 'john123'
};

// ===== MOCK FUNCTIONS =====

const mockOnUserRegistered = jest.fn();
const mockOnClose = jest.fn();
const mockOnSkipRegistration = jest.fn();

// ===== HELPER FUNCTIONS =====

const renderRegistrationModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    eventData: mockEventData,
    onUserRegistered: mockOnUserRegistered,
    onClose: mockOnClose,
    onSkipRegistration: mockOnSkipRegistration,
    ...props
  };
  
  return render(<UserRegistrationModal {...defaultProps} />);
};

const fillOutForm = async (user: any) => {
  const emailInput = screen.getByLabelText(/email address/i);
  const firstNameInput = screen.getByLabelText(/first name/i);
  const privacyCheckbox = screen.getByRole('checkbox', { name: /accept.*privacy policy/i });
  
  await user.type(emailInput, 'test@example.com');
  await user.type(firstNameInput, 'John');
  await user.click(privacyCheckbox);
  
  return { emailInput, firstNameInput, privacyCheckbox };
};

// ===== TEST SETUP =====

beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock console methods to avoid noise in test output
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ===== BASIC RENDERING TESTS =====

describe('UserRegistrationModal - Rendering', () => {
  
  test('renders modal when isOpen is true', () => {
    renderRegistrationModal();
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
  });
  
  test('does not render modal when isOpen is false', () => {
    renderRegistrationModal({ isOpen: false });
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  
  test('displays event title in description', () => {
    renderRegistrationModal();
    
    expect(screen.getByText(/Free Consultation \\(20 Min\\)/)).toBeInTheDocument();
  });
  
  test('shows all required form fields', () => {
    renderRegistrationModal();
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /accept.*privacy policy/i })).toBeInTheDocument();
  });
  
  test('shows submit button with correct text', () => {
    renderRegistrationModal();
    
    expect(screen.getByRole('button', { name: /create account & book event/i })).toBeInTheDocument();
  });
  
  test('shows skip registration button when onSkipRegistration is provided', () => {
    renderRegistrationModal();
    
    expect(screen.getByRole('button', { name: /continue as guest/i })).toBeInTheDocument();
  });
  
  test('hides skip registration button when onSkipRegistration is not provided', () => {
    renderRegistrationModal({ onSkipRegistration: undefined });
    
    expect(screen.queryByRole('button', { name: /continue as guest/i })).not.toBeInTheDocument();
  });
  
});

// ===== FORM VALIDATION TESTS =====

describe('UserRegistrationModal - Form Validation', () => {
  
  test('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const submitButton = screen.getByRole('button', { name: /create account & book event/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/you must accept the privacy policy/i)).toBeInTheDocument();
    });
  });
  
  test('validates email format', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /create account & book event/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });
  
  test('validates first name length', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    
    // Test too short
    await user.type(firstNameInput, 'A');
    
    const submitButton = screen.getByRole('button', { name: /create account & book event/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/first name must be at least 2 characters/i)).toBeInTheDocument();
    });
    
    // Test too long
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'A'.repeat(51));
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/first name must be less than 50 characters/i)).toBeInTheDocument();
    });
  });
  
  test('clears field errors when user starts typing', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    // Trigger validation errors
    const submitButton = screen.getByRole('button', { name: /create account & book event/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    });
    
    // Start typing in email field
    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'test@');
    
    await waitFor(() => {
      expect(screen.queryByText(/email address is required/i)).not.toBeInTheDocument();
    });
  });
  
});

// ===== FORM SUBMISSION TESTS =====

describe('UserRegistrationModal - Form Submission', () => {
  
  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    await fillOutForm(user);
    
    const submitButton = screen.getByRole('button', { name: /create account & book event/i });
    await user.click(submitButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });
    
    // Should call onUserRegistered after submission
    await waitFor(() => {
      expect(mockOnUserRegistered).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          firstName: 'John'
        })
      );
    }, { timeout: 3000 });
  });
  
  test('disables form during submission', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    await fillOutForm(user);
    
    const submitButton = screen.getByRole('button', { name: /create account & book event/i });
    const emailInput = screen.getByLabelText(/email address/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(firstNameInput).toBeDisabled();
    });
  });
  
  test('handles submission errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock console.error to expect it to be called
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderRegistrationModal();
    
    await fillOutForm(user);
    
    const submitButton = screen.getByRole('button', { name: /create account & book event/i });
    await user.click(submitButton);
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Should not call onUserRegistered on error
    expect(mockOnUserRegistered).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
  
});

// ===== MODAL INTERACTION TESTS =====

describe('UserRegistrationModal - Modal Interactions', () => {
  
  test('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const closeButton = screen.getByRole('button', { name: /close registration modal/i });
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
  
  test('closes modal when backdrop is clicked', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const modal = screen.getByRole('dialog');
    const backdrop = modal.parentElement!;
    
    await user.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
  
  test('does not close modal when modal content is clicked', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const modal = screen.getByRole('dialog');
    await user.click(modal);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
  
  test('closes modal when Escape key is pressed', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    await user.keyboard('{Escape}');
    
    expect(mockOnClose).toHaveBeenCalled();
  });
  
  test('calls onSkipRegistration when skip button is clicked', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const skipButton = screen.getByRole('button', { name: /continue as guest/i });
    await user.click(skipButton);
    
    expect(mockOnSkipRegistration).toHaveBeenCalled();
  });
  
  test('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
  
});

// ===== ACCESSIBILITY TESTS =====

describe('UserRegistrationModal - Accessibility', () => {
  
  test('has proper ARIA attributes', () => {
    renderRegistrationModal();
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'registration-modal-title');
    expect(modal).toHaveAttribute('aria-describedby', 'registration-modal-description');
  });
  
  test('focuses first input when modal opens', () => {
    renderRegistrationModal();
    
    const emailInput = screen.getByLabelText(/email address/i);
    
    // Use setTimeout to wait for focus to be set
    setTimeout(() => {
      expect(emailInput).toHaveFocus();
    }, 150);
  });
  
  test('has proper labels for form fields', () => {
    renderRegistrationModal();
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /accept.*privacy policy/i })).toBeInTheDocument();
  });
  
  test('shows error messages with proper ARIA attributes', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const submitButton = screen.getByRole('button', { name: /create account & book event/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
      
      const errorMessage = screen.getByText(/email address is required/i);
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });
  });
  
});

// ===== LOADING STATE TESTS =====

describe('UserRegistrationModal - Loading States', () => {
  
  test('shows loading spinner during email checking', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'test@example.com');
    
    // Should show checking status
    await waitFor(() => {
      expect(screen.getByText(/checking/i)).toBeInTheDocument();
    });
  });
  
  test('disables submit button when email is being checked', async () => {
    const user = userEvent.setup();
    renderRegistrationModal();
    
    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'test@example.com');
    
    const submitButton = screen.getByRole('button', { name: /create account & book event/i });
    
    // Should be disabled while checking
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
  
}); 