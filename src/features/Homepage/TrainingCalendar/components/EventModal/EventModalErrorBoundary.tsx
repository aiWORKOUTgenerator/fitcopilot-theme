/**
 * Event Modal Error Boundary
 * 
 * Production-grade error boundary component that provides graceful error handling
 * and recovery mechanisms for the EventModal component
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Error boundary state interface
 */
interface EventModalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  errorId: string;
  isRecovering: boolean;
}

/**
 * Error boundary props interface
 */
interface EventModalErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  enableRecovery?: boolean;
}

/**
 * Event Modal Error Boundary Component
 * 
 * Provides comprehensive error handling with:
 * - Automatic retry mechanism
 * - Error reporting
 * - Graceful degradation
 * - Recovery mechanisms
 */
class EventModalErrorBoundary extends Component<EventModalErrorBoundaryProps, EventModalErrorBoundaryState> {
  private retryTimeout: NodeJS.Timeout | null = null;
  
  constructor(props: EventModalErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorId: '',
      isRecovering: false
    };
  }
  
  /**
   * Static method to update state when an error occurs
   */
  static getDerivedStateFromError(error: Error): Partial<EventModalErrorBoundaryState> {
    const errorId = `event-modal-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }
  
  /**
   * Lifecycle method called when an error occurs
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, maxRetries = 3 } = this.props;
    
    this.setState({
      error,
      errorInfo
    });
    
    // Log error for debugging
    logger.error('EventModal Error Boundary caught an error:', error);
    logger.error('Error Info:', errorInfo);
    
    // Report error to external handler if provided
    if (onError) {
      try {
        onError(error, errorInfo);
      } catch (reportingError) {
        logger.error('Error reporting failed:', reportingError);
      }
    }
    
    // Attempt automatic recovery if enabled and within retry limit
    if (this.props.enableRecovery && this.state.retryCount < maxRetries) {
      this.attemptRecovery();
    }
  }
  
  /**
   * Attempt automatic recovery from error
   */
  private attemptRecovery = () => {
    this.setState({ isRecovering: true });
    
    this.retryTimeout = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
        isRecovering: false
      }));
      
      if (process.env.NODE_ENV === 'development') {
        logger.info(`EventModal: Recovery attempt ${this.state.retryCount + 1}`);
      }
    }, 2000);
  };
  
  /**
   * Manual retry handler
   */
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRecovering: false
    });
  };
  
  /**
   * Reset error boundary state
   */
  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorId: '',
      isRecovering: false
    });
  };
  
  /**
   * Cleanup on unmount
   */
  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }
  
  /**
   * Render error UI or children
   */
  render() {
    const { hasError, error, errorInfo, retryCount, isRecovering } = this.state;
    const { fallback, maxRetries = 3, enableRecovery = true } = this.props;
    
    if (hasError && error) {
      // Show custom fallback if provided
      if (fallback) {
        return fallback;
      }
      
      // Show recovery UI if recovering
      if (isRecovering) {
        return (
          <div className="event-modal__backdrop">
            <div className="event-modal__container">
              <div className="event-modal__header">
                <h2 className="event-modal__title">Recovering...</h2>
              </div>
              <div className="event-modal__content">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                  <p>Attempting to recover from error...</p>
                  <p style={{ fontSize: '0.9em', color: '#666' }}>
                    Retry {retryCount + 1} of {maxRetries}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      // Show error UI
      return (
        <div className="event-modal__backdrop">
          <div className="event-modal__container">
            <div className="event-modal__header">
              <h2 className="event-modal__title">
                {retryCount >= maxRetries ? 'Error' : 'Temporary Error'}
              </h2>
            </div>
            <div className="event-modal__content">
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '1.1em', marginBottom: '0.5rem' }}>
                    {retryCount >= maxRetries 
                      ? 'Sorry, the event modal encountered an error.' 
                      : 'The event modal encountered a temporary error.'}
                  </p>
                  
                  {process.env.NODE_ENV === 'development' && (
                    <details style={{ marginTop: '1rem', textAlign: 'left' }}>
                      <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        Error Details (Development)
                      </summary>
                      <pre style={{ 
                        background: '#f5f5f5', 
                        padding: '1rem', 
                        borderRadius: '4px',
                        overflow: 'auto',
                        fontSize: '0.8em',
                        marginTop: '0.5rem'
                      }}>
                        {error.name}: {error.message}
                        {'\n'}
                        {error.stack}
                        {errorInfo && '\n\nComponent Stack:'}
                        {errorInfo?.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  {enableRecovery && retryCount < maxRetries && (
                    <button
                      type="button"
                      className="event-modal__button event-modal__button--primary"
                      onClick={this.handleRetry}
                    >
                      Try Again
                    </button>
                  )}
                  
                  <button
                    type="button"
                    className="event-modal__button event-modal__button--secondary"
                    onClick={this.handleReset}
                  >
                    {retryCount >= maxRetries ? 'Reset' : 'Cancel'}
                  </button>
                </div>
                
                {retryCount > 0 && (
                  <p style={{ 
                    fontSize: '0.9em', 
                    color: '#666', 
                    marginTop: '1rem' 
                  }}>
                    Retry attempts: {retryCount}/{maxRetries}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default EventModalErrorBoundary; 