import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/homepage.scss'; // Global styles
import debug from './utils/debug';
import logger from './utils/logger';
// Use dynamic import instead of direct import
const App = lazy(() => import('./Homepage')); // Lazily load the main Homepage component

/**
 * Error Boundary component for catching React rendering errors
 */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error?: Error }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (debug.isDebugMode()) {
      logger.error('React Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>The application has encountered an error and cannot continue.</p>
          {debug.isDebugMode() && this.state.error && (
            <div className="error-details">
              <pre>{this.state.error.toString()}</pre>
            </div>
          )}
          <button onClick={this.handleRefresh}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * App container component with error handling
 */
const AppContainer: React.FC = () => {
  const [error, setError] = useState<Error | null>(null);
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    try {
      // Log debug information
      if (debug.isDebugMode()) {
        debug.debugLog('React application initializing');
        logger.debug('Theme variant:', document.body.getAttribute('data-theme'));
        logger.debug('React mount point:', document.getElementById('athlete-dashboard-root'));
      }
      setAppInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error during initialization'));
    }
  }, []);

  if (error) {
    return (
      <div className="app-error">
        <h2>Initialization Error</h2>
        <p>The application failed to initialize.</p>
        {debug.isDebugMode() && (
          <pre>{error.message}</pre>
        )}
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  if (!appInitialized) {
    return <div className="app-loading">Initializing application...</div>;
  }

  // Add loading fallback for the lazy-loaded App component
  const loadingFallback = (
    <div className="lazy-loading-skeleton hero-skeleton" aria-label="Loading application...">
      <div className="loading-animation"></div>
    </div>
  );

  return (
    <ErrorBoundary>
      <React.StrictMode>
        <Suspense fallback={loadingFallback}>
          <App />
        </Suspense>
      </React.StrictMode>
    </ErrorBoundary>
  );
};

// Debug React bootstrap process with more detailed logs
logger.debug('React bootstrap starting...');
logger.debug('Environment check:', {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
});

// Root element ID where the React app will mount
const rootElementId = 'athlete-dashboard-root';
logger.debug(`Looking for mount point with ID: #${rootElementId}`);

// Get the container element
const container = document.getElementById(rootElementId);

// Handle case where container doesn't exist
if (!container) {
  logger.error(`Mount point #${rootElementId} not found in DOM. Creating one...`);

  try {
    // Create a container if it doesn't exist
    const newContainer = document.createElement('div');
    newContainer.id = rootElementId;
    document.body.appendChild(newContainer);
    logger.debug(`Created #${rootElementId} and appended to body`);

    // Mount app to the newly created container
    const root = createRoot(newContainer);
    root.render(<AppContainer />);
    logger.debug('React app successfully mounted to dynamically created container');

    // Signal successful mount
    notifyMountSuccess(newContainer);
  } catch (error) {
    logger.error('Failed to create container and mount app:', error);

    // Fallback error message
    const errorMsg = document.createElement('div');
    errorMsg.innerHTML = `
      <div style="text-align: center; margin: 2rem; font-family: system-ui, sans-serif;">
        <h2>Something went wrong</h2>
        <p>The app couldn't start properly. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
    document.body.appendChild(errorMsg);
  }
} else {
  logger.debug(`Mount point #${rootElementId} found in DOM, rendering React app...`);

  try {
    // Mount app to the existing container
    const root = createRoot(container);
    root.render(<AppContainer />);
    logger.debug('React app successfully mounted to existing container');

    // Signal successful mount
    notifyMountSuccess(container);
  } catch (error) {
    logger.error('Failed to mount React app to existing container:', error);

    // Error display
    container.innerHTML = `
      <div style="text-align: center; margin: 2rem; font-family: system-ui, sans-serif;">
        <h2>Something went wrong</h2>
        <p>The app couldn't start properly. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
}

/**
 * Notify WordPress that React has successfully mounted
 * This allows WordPress to perform additional actions or diagnostics
 */
function notifyMountSuccess(mountElement: HTMLElement) {
  // Set data attribute on mount element
  mountElement.setAttribute('data-react-mounted', 'true');
  logger.debug('🚀 React successfully mounted');

  // Signal to WordPress that React mounted successfully (if function exists)
  if (typeof window !== 'undefined' && 'fitcopilotReactMounted' in window) {
    try {
      // @ts-expect-error - Custom global function
      window.fitcopilotReactMounted();
    } catch (err) {
      logger.error('Error calling mount notification function:', err);
    }
  }
} 