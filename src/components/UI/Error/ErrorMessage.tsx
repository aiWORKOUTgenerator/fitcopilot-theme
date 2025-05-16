import { AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import React from 'react';
import './ErrorMessage.scss';

export interface ErrorMessageProps {
    /**
     * The error message to display
     */
    message: string;

    /**
     * Detailed information about the error (optional)
     */
    details?: string;

    /**
     * Severity level of the error
     * @default 'error'
     */
    severity?: 'error' | 'warning' | 'info';

    /**
     * Whether to show a custom icon or use the default for the severity
     */
    icon?: React.ReactNode;

    /**
     * Action button to retry or resolve the error
     */
    action?: {
        label: string;
        onClick: () => void;
    };

    /**
     * Additional custom CSS classes
     */
    className?: string;
}

/**
 * Error message component for displaying various types of errors
 * throughout the application with consistent styling.
 * 
 * @example
 * // Basic usage
 * <ErrorMessage message="Unable to load video" />
 * 
 * @example
 * // With details and retry action
 * <ErrorMessage 
 *   message="Network error" 
 *   details="Check your internet connection"
 *   action={{ label: "Retry", onClick: handleRetry }}
 * />
 * 
 * @example
 * // Warning severity with custom icon
 * <ErrorMessage 
 *   message="Low bandwidth detected" 
 *   severity="warning"
 *   icon={<WifiOff size={24} />}
 * />
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  details,
  severity = 'error',
  icon,
  action,
  className = '',
}) => {
  // Determine which icon to use based on severity
  const renderIcon = () => {
    if (icon) return icon;

    switch (severity) {
    case 'warning':
      return <AlertTriangle size={24} className="error-icon" />;
    case 'info':
      return <AlertCircle size={24} className="error-icon" />;
    case 'error':
    default:
      return <XCircle size={24} className="error-icon" />;
    }
  };

  return (
    <div className={`error-message-container ${severity} ${className}`}>
      <div className="error-icon-wrapper">
        {renderIcon()}
      </div>

      <div className="error-content">
        <p className="error-title">{message}</p>
        {details && <p className="error-details">{details}</p>}

        {action && (
          <button
            className="error-action-button"
            onClick={action.onClick}
            type="button"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 