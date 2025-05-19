import { Component, ReactNode } from 'react';
import { JSX } from 'react/jsx-runtime';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error) => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

/**
 * Creates a mock error boundary component for testing
 */
export const createMockErrorBoundary = () => {
  class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = {
        hasError: false,
        error: null
      };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return {
        hasError: true,
        error
      };
    }

    componentDidCatch(error: Error) {
      this.props.onError?.(error);
    }

    render() {
      if (this.state.hasError) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error!);
        }
        return this.props.fallback || <div>Error: {this.state.error?.message}</div>;
      }

      return this.props.children;
    }
  }

  return ErrorBoundary;
};

/**
 * Simulates an error in a component
 */
export const simulateError = (error: Error) => {
  throw error;
};

/**
 * Creates a component that will throw an error
 */
export const createErrorComponent = (error: Error) => {
  return () => {
    throw error;
  };
}; 