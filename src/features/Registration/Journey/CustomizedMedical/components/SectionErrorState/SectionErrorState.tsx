import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';
import { SectionErrorStateProps } from '../../types';
import './SectionErrorState.scss';

/**
 * Component to display consistent error state in sections
 * with retry functionality
 */
const SectionErrorState: React.FC<SectionErrorStateProps> = ({
  message,
  onRetry
}) => {
  return (
    <div className="section-error-state" role="alert">
      <div className="error-icon">
        <AlertCircle size={24} />
      </div>
      <div className="error-content">
        <h4 className="error-title">Error Saving Information</h4>
        <p className="error-message">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="retry-button"
        aria-label="Retry saving"
      >
        <RefreshCw size={16} />
        <span>Retry</span>
      </button>
    </div>
  );
};

export default SectionErrorState; 