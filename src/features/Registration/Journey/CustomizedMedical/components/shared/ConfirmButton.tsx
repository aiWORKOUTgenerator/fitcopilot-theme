import { AlertCircle, ChevronRight } from 'lucide-react';
import React from 'react';
import './ConfirmButton.scss';

interface ConfirmButtonProps {
    isValid: boolean;
    onConfirm: () => void;
    validationMessage?: string;
    buttonText?: string;
}

/**
 * Reusable confirm button with validation state feedback
 */
const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  isValid,
  onConfirm,
  validationMessage = 'Please complete all required fields',
  buttonText = 'Confirm Selection'
}) => {
  return (
    <div className="confirm-button-container">
      {!isValid && (
        <div className="validation-message">
          <AlertCircle size={16} className="validation-icon" />
          <span>{validationMessage}</span>
        </div>
      )}
      <button
        className={`confirm-button ${isValid ? 'valid' : 'invalid'}`}
        onClick={onConfirm}
        disabled={!isValid}
        aria-disabled={!isValid}
      >
        <span>{buttonText}</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default ConfirmButton; 