/**
 * Modal Component Tests
 */

import { screen, waitFor } from '@testing-library/react';
import React, { useRef } from 'react';
import { renderWithProviders } from '../../../../test/test-utils';
import { Modal } from '../Modal';

// Mock createPortal to render the element directly without portals
jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom');
  return {
    ...originalModule,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('Modal Component', () => {
  beforeEach(() => {
    // Reset the document body before each test
    document.body.innerHTML = '';
  });

  it('renders the modal when isOpen is true', () => {
    const handleClose = jest.fn();

    renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Test Modal"
        data-testid="test-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    const modal = screen.getByTestId('test-modal');
    const modalTitle = screen.getByText('Test Modal');
    const modalContent = screen.getByText('Modal content');

    expect(modal).toBeInTheDocument();
    expect(modalTitle).toBeInTheDocument();
    expect(modalContent).toBeInTheDocument();
  });

  it('does not render the modal when isOpen is false', () => {
    const handleClose = jest.fn();

    renderWithProviders(
      <Modal
        isOpen={false}
        onClose={handleClose}
        title="Test Modal"
        data-testid="test-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByTestId('test-modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const handleClose = jest.fn();

    const { user } = renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Test Modal"
        data-testid="test-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the Escape key is pressed', async () => {
    const handleClose = jest.fn();

    const { user } = renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Test Modal"
        data-testid="test-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    // Press the Escape key
    await user.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when pressing Escape if closeOnEsc is false', async () => {
    const handleClose = jest.fn();

    const { user } = renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        closeOnEsc={false}
        title="Test Modal"
        data-testid="test-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    // Press the Escape key
    await user.keyboard('{Escape}');

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const handleClose = jest.fn();

    const { user } = renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Test Modal"
        data-testid="test-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    const backdrop = screen.getByTestId('test-modal-backdrop');
    await user.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking backdrop if closeOnBackdropClick is false', async () => {
    const handleClose = jest.fn();

    const { user } = renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        closeOnBackdropClick={false}
        title="Test Modal"
        data-testid="test-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    const backdrop = screen.getByTestId('test-modal-backdrop');
    await user.click(backdrop);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('does not show close button when showCloseButton is false', () => {
    const handleClose = jest.fn();

    renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        showCloseButton={false}
        title="Test Modal"
        data-testid="test-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByRole('button', { name: /close modal/i })).not.toBeInTheDocument();
  });

  it('applies the correct size class', () => {
    const handleClose = jest.fn();

    renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        size="large"
        title="Large Modal"
        data-testid="test-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    const modal = screen.getByTestId('test-modal');
    expect(modal).toHaveClass('modal--large');
  });

  it('applies custom className when provided', () => {
    const handleClose = jest.fn();

    renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        className="custom-modal"
        title="Custom Modal"
        data-testid="test-modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    const modal = screen.getByTestId('test-modal');
    expect(modal).toHaveClass('custom-modal');
  });

  it('has the correct accessibility attributes', () => {
    const handleClose = jest.fn();

    renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Accessible Modal"
        aria-describedby="modal-description"
        data-testid="test-modal"
      >
        <p id="modal-description">This is a description of the modal</p>
      </Modal>
    );

    const modal = screen.getByTestId('test-modal');

    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(modal).toHaveAttribute('aria-describedby', 'modal-description');

    const title = screen.getByText('Accessible Modal');
    expect(title).toHaveAttribute('id', 'modal-title');
  });

  it('focuses the close button by default when opened', async () => {
    const handleClose = jest.fn();

    renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Focus Test Modal"
      >
        <p>Modal content</p>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });

    // Wait for focus to be applied asynchronously
    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });
  });

  it('focuses the initialFocusRef element when provided', async () => {
    // Need to create a component that uses a ref
    const TestComponent = () => {
      const buttonRef = useRef<HTMLButtonElement>(null);
      const handleClose = jest.fn();

      return (
        <Modal
          isOpen={true}
          onClose={handleClose}
          title="Focus Test Modal"
          initialFocusRef={buttonRef}
        >
          <p>Modal content</p>
          <button ref={buttonRef}>Focus Me</button>
        </Modal>
      );
    };

    renderWithProviders(<TestComponent />);

    const focusButton = screen.getByRole('button', { name: /focus me/i });

    // Wait for focus to be applied asynchronously
    await waitFor(() => {
      expect(focusButton).toHaveFocus();
    });
  });

  it('traps focus within the modal', async () => {
    const handleClose = jest.fn();

    const { user } = renderWithProviders(
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Focus Trap Test"
      >
        <button>First Button</button>
        <input placeholder="Middle Input" />
        <button>Last Button</button>
      </Modal>
    );

    // First, the close button should be focused
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });

    // Tab to the first button
    await user.tab();
    expect(screen.getByRole('button', { name: /first button/i })).toHaveFocus();

    // Tab to the input
    await user.tab();
    expect(screen.getByPlaceholderText('Middle Input')).toHaveFocus();

    // Tab to the last button
    await user.tab();
    expect(screen.getByRole('button', { name: /last button/i })).toHaveFocus();

    // Tab again should loop back to the first focusable element (close button)
    await user.tab();
    expect(closeButton).toHaveFocus();

    // Shift+Tab should go to the last button
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(screen.getByRole('button', { name: /last button/i })).toHaveFocus();
  });
}); 