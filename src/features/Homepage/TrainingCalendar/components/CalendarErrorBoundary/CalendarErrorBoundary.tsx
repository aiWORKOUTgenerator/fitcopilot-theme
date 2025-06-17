import { AlertCircle, ArrowLeft, MessageSquare, RefreshCw } from 'lucide-react';
import React, { Component, ReactNode } from 'react';
import './CalendarErrorBoundary.scss';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
  retryCount: number;
  timestamp: Date;
}

interface CalendarErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  enableErrorReporting?: boolean;
  variant?: 'default' | 'minimal' | 'detailed';
}

interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  calendarState?: any;
}

/**
 * Advanced Calendar Error Boundary with comprehensive error handling and reporting
 */
export class CalendarErrorBoundary extends Component<CalendarErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: CalendarErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      timestamp: new Date()
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `cal_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
      timestamp: new Date()
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState(prevState => ({
      errorInfo,
      errorId: prevState.errorId || `cal_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error if enabled
    if (this.props.enableErrorReporting !== false) {
      this.reportError(error, errorInfo);
    }

    // Log detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Calendar Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  private reportError = async (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      const errorReport: ErrorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack || undefined,
        componentStack: errorInfo.componentStack || undefined,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.getSessionId(),
        calendarState: this.getCalendarState()
      };

      // In production, this would send to your error reporting service
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to analytics/error reporting service
        // await fetch('/api/error-reporting', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorReport)
        // });
      }

      // Store locally for debugging
      localStorage.setItem(`calendar_error_${this.state.errorId}`, JSON.stringify(errorReport));
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('calendar_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('calendar_session_id', sessionId);
    }
    return sessionId;
  };

  private getCalendarState = (): any => {
    try {
      // Capture relevant calendar state for debugging
      return {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        // Add any relevant calendar state here
        wpData: typeof window !== 'undefined' ? (window as any).fitcopilotTrainingCalendarData : null
      };
    } catch {
      return null;
    }
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
        timestamp: new Date()
      }));

      // Add a small delay to prevent immediate re-error
      this.retryTimeoutId = setTimeout(() => {
        // Force re-render
        this.forceUpdate();
      }, 100);
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  private copyErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: this.state.timestamp.toISOString()
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        // Show success feedback
        const button = document.querySelector('.copy-error-button') as HTMLButtonElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Failed to copy error details:', err);
      });
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    const { children, fallback, maxRetries = 3, variant = 'default' } = this.props;
    const { hasError, error, retryCount, timestamp } = this.state;

    if (hasError && error) {
      // Return custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Render error UI based on variant
      const canRetry = retryCount < maxRetries;
      const isCalendarSpecificError = error.stack?.includes('FullCalendar') || 
                                     error.message.includes('calendar') ||
                                     error.message.includes('event');

      return (
        <div className={`calendar-error-boundary calendar-error-boundary--${variant}`}>
          <div className="error-container">
            <div className="error-header">
              <div className="error-icon">
                <AlertCircle size={48} />
              </div>
              <h2 className="error-title">
                {isCalendarSpecificError ? 'Calendar Error' : 'Something went wrong'}
              </h2>
              <p className="error-subtitle">
                {isCalendarSpecificError 
                  ? 'We encountered an issue loading the training calendar.'
                  : 'An unexpected error occurred while loading this page.'
                }
              </p>
            </div>

            <div className="error-content">
              {variant === 'detailed' && (
                <div className="error-details">
                  <h3>Error Details</h3>
                  <div className="error-info">
                    <div className="error-field">
                      <label>Error ID:</label>
                      <code>{this.state.errorId}</code>
                    </div>
                    <div className="error-field">
                      <label>Time:</label>
                      <span>{timestamp.toLocaleString()}</span>
                    </div>
                    <div className="error-field">
                      <label>Message:</label>
                      <code>{error.message}</code>
                    </div>
                    {retryCount > 0 && (
                      <div className="error-field">
                        <label>Retry Attempts:</label>
                        <span>{retryCount} of {maxRetries}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="error-actions">
                {canRetry && (
                  <button 
                    className="error-button error-button--primary"
                    onClick={this.handleRetry}
                  >
                    <RefreshCw size={16} />
                    Try Again
                  </button>
                )}
                
                <button 
                  className="error-button error-button--secondary"
                  onClick={this.handleRefresh}
                >
                  <RefreshCw size={16} />
                  Refresh Page
                </button>
                
                <button 
                  className="error-button error-button--tertiary"
                  onClick={this.handleGoBack}
                >
                  <ArrowLeft size={16} />
                  Go Back
                </button>
              </div>

              {variant === 'detailed' && (
                <div className="error-support">
                  <button 
                    className="copy-error-button"
                    onClick={this.copyErrorDetails}
                  >
                    Copy Error Details
                  </button>
                  <p className="error-support-text">
                    If this problem persists, please contact support with the error ID: 
                    <strong> {this.state.errorId}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Help Information */}
            <div className="error-help">
              <details className="error-troubleshooting">
                <summary>
                  <MessageSquare size={16} />
                  Troubleshooting Tips
                </summary>
                <div className="troubleshooting-content">
                  <ul>
                    <li>Check your internet connection</li>
                    <li>Clear your browser cache and cookies</li>
                    <li>Try disabling browser extensions</li>
                    <li>Update your browser to the latest version</li>
                    {isCalendarSpecificError && (
                      <li>Try switching to a different calendar view</li>
                    )}
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default CalendarErrorBoundary; 