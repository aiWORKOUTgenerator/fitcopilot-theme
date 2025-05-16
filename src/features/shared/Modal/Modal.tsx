/**
 * Modal Component
 * 
 * An accessible modal dialog component with focus trapping and keyboard navigation
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './modal.scss';
import { ModalProps } from './types';

/**
 * Modal component that renders a dialog with focus trapping and accessibility features
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  size = 'medium',
  closeOnEsc = true,
  closeOnBackdropClick = true,
  showCloseButton = true,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  initialFocusRef,
  returnFocusRef,
  'data-testid': dataTestId,
}) => {
  // Keep track of previously focused element to return focus when modal closes
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Generate IDs for accessibility if not provided
  const titleId = ariaLabelledBy || 'modal-title';
  const descriptionId = ariaDescribedBy;

  // Set up focus management when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus the specified element or the close button
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      } else if (modalRef.current) {
        modalRef.current.focus();
      }
    } else if (previousActiveElement.current) {
      // Return focus to the element that was focused before the modal opened
      if (returnFocusRef?.current) {
        returnFocusRef.current.focus();
      } else {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, initialFocusRef, returnFocusRef]);

  // Handle keyboard events (Escape to close)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (closeOnEsc && e.key === 'Escape' && onClose) {
      onClose();
    }

    // Trap focus within the modal
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        // Shift+Tab => backwards navigation
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        }
        // Tab => forwards navigation
        else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  // Only render the modal if it's open
  if (!isOpen) return null;

  // Create modal classes
  const modalClasses = [
    'modal',
    `modal--${size}`,
    className
  ].filter(Boolean).join(' ');

  // Portal to render the modal at the body level to avoid stacking context issues
  return createPortal(
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      data-testid={dataTestId ? `${dataTestId}-backdrop` : 'modal-backdrop'}
    >
      <div
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={descriptionId}
        ref={modalRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        data-testid={dataTestId}
      >
        <div className="modal-header">
          {title && (
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
          )}

          {showCloseButton && (
            <button
              className="modal-close-button"
              onClick={onClose}
              aria-label="Close modal"
              ref={closeButtonRef}
              data-testid={dataTestId ? `${dataTestId}-close-button` : 'modal-close-button'}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal; 