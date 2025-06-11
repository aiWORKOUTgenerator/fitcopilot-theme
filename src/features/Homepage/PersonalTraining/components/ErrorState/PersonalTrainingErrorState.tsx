import { AlertCircle, RefreshCw, Users, Wifi } from 'lucide-react';
import React from 'react';
import { DataSource } from '../../interfaces';
import './PersonalTrainingErrorState.scss';

/**
 * Error type for PersonalTraining component
 */
export type PersonalTrainingErrorType = 'no-data' | 'loading-failed' | 'network-error' | 'invalid-data';

/**
 * Props for PersonalTrainingErrorState component
 */
export interface PersonalTrainingErrorStateProps {
  /** Type of error to display */
  errorType: PersonalTrainingErrorType;
  /** Current data source for debugging */
  dataSource: DataSource;
  /** Whether to show technical details (development only) */
  showTechnicalDetails?: boolean;
  /** Callback for retry action */
  onRetry?: () => void;
  /** Additional context for debugging */
  debugContext?: Record<string, unknown>;
}

/**
 * Configuration for different error types
 */
const ERROR_CONFIGS = {
  'no-data': {
    icon: Users,
    title: 'Trainer Profiles Temporarily Unavailable',
    message: 'Our personal training team information is being updated. Please check back soon or contact us directly to learn about our trainers.',
    actionText: 'Refresh Page',
    severity: 'warning' as const,
    showRetry: true
  },
  'loading-failed': {
    icon: RefreshCw,
    title: 'Unable to Load Trainer Information',
    message: 'We\'re having trouble loading our trainer profiles. This is usually a temporary issue.',
    actionText: 'Try Again',
    severity: 'error' as const,
    showRetry: true
  },
  'network-error': {
    icon: Wifi,
    title: 'Connection Issue',
    message: 'Please check your internet connection and try again. If the problem persists, contact our support team.',
    actionText: 'Retry',
    severity: 'error' as const,
    showRetry: true
  },
  'invalid-data': {
    icon: AlertCircle,
    title: 'Data Format Issue',
    message: 'There\'s an issue with the trainer data format. Our technical team has been notified.',
    actionText: 'Refresh Page',
    severity: 'error' as const,
    showRetry: true
  }
} as const;

/**
 * Technical error details component (development only)
 */
const TechnicalErrorDetails: React.FC<{
  dataSource: DataSource;
  debugContext?: Record<string, unknown>;
  errorType: PersonalTrainingErrorType;
}> = ({ dataSource, debugContext, errorType }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <details className="technical-error-details">
      <summary className="technical-error-summary">
        Technical Details (Development Only)
      </summary>
      <div className="technical-error-content">
        <div className="debug-item">
          <span className="debug-label">Error Type:</span>
          <span className="debug-value">{errorType}</span>
        </div>
        <div className="debug-item">
          <span className="debug-label">Data Source:</span>
          <span className="debug-value">{dataSource}</span>
        </div>
        <div className="debug-item">
          <span className="debug-label">WordPress Data Available:</span>
          <span className="debug-value">
            {typeof window !== 'undefined' && !!window.fitcopilotPersonalTrainingData ? 'Yes' : 'No'}
          </span>
        </div>
        {debugContext && Object.keys(debugContext).length > 0 && (
          <div className="debug-item">
            <span className="debug-label">Debug Context:</span>
            <pre className="debug-context">
              {JSON.stringify(debugContext, null, 2)}
            </pre>
          </div>
        )}
        <div className="debug-item">
          <span className="debug-label">Timestamp:</span>
          <span className="debug-value">{new Date().toISOString()}</span>
        </div>
      </div>
    </details>
  );
};

/**
 * PersonalTraining Error State Component
 * 
 * Provides user-friendly error messages with recovery actions
 * Technical details are hidden from end users and only shown in development
 */
export const PersonalTrainingErrorState: React.FC<PersonalTrainingErrorStateProps> = ({
  errorType,
  dataSource,
  showTechnicalDetails = false,
  onRetry,
  debugContext
}) => {
  const config = ERROR_CONFIGS[errorType];
  const IconComponent = config.icon;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Default retry action is page refresh
      window.location.reload();
    }
  };

  const handleContactSupport = () => {
    // Scroll to footer or open contact form
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="personal-training-section w-full py-20 px-4 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Section header still visible for context */}
          <span className="text-xs font-bold tracking-widest uppercase text-violet-300 mb-2 block">
            Expert Coaching
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Personal <span className="bg-gradient-to-r from-violet-300 to-indigo-400 text-transparent bg-clip-text">Trainers</span>
          </h2>
          
          {/* Error state content */}
          <div className="max-w-md mx-auto mt-8">
            <div className={`personal-training-error-state ${config.severity}`}>
              <div className="error-icon-container">
                <IconComponent 
                  size={48} 
                  className="error-icon"
                  aria-hidden="true"
                />
              </div>
              
              <h3 className="error-title">
                {config.title}
              </h3>
              
              <p className="error-message">
                {config.message}
              </p>
              
              <div className="error-actions">
                {config.showRetry && (
                  <button 
                    onClick={handleRetry}
                    className="error-action-btn primary"
                    aria-label={`${config.actionText} to reload trainer information`}
                  >
                    <RefreshCw size={16} className="action-icon" />
                    {config.actionText}
                  </button>
                )}
                
                <button 
                  onClick={handleContactSupport}
                  className="error-action-btn secondary"
                  aria-label="Contact support for assistance"
                >
                  Contact Support
                </button>
              </div>
              
              {/* Technical details for development */}
              {showTechnicalDetails && (
                <TechnicalErrorDetails
                  dataSource={dataSource}
                  debugContext={debugContext}
                  errorType={errorType}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Helper function to determine error type from context
 */
export const determineErrorType = (
  hasError: boolean,
  dataSource: DataSource,
  trainerCount: number,
  debugContext?: Record<string, unknown>
): PersonalTrainingErrorType => {
  if (hasError) {
    // Check for network-related errors
    if (debugContext?.error && 
        (debugContext.error as Error)?.message?.toLowerCase().includes('network')) {
      return 'network-error';
    }
    
    // Check for data format issues
    if (dataSource === 'none' && debugContext?.hasData) {
      return 'invalid-data';
    }
    
    return 'loading-failed';
  }
  
  if (trainerCount === 0) {
    return 'no-data';
  }
  
  return 'no-data'; // Fallback
};

export default PersonalTrainingErrorState; 