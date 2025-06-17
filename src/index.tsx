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
    
    // Handle specific WordPress + React DOM conflicts
    if (error.message.includes('removeChild') || error.message.includes('Node')) {
      logger.warn('WordPress + React DOM conflict detected. This is usually harmless and the app will continue to work.');
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
    console.log('🔄 AppContainer useEffect triggered');
    try {
      // Log debug information
      console.log('🎨 Theme variant:', document.body.getAttribute('data-theme'));
      console.log('📍 React mount point check:', document.getElementById('athlete-dashboard-root'));
      console.log('🌐 Window globals check:', {
        fitcopilotTestimonialsData: typeof (window as any).fitcopilotTestimonialsData,
        fitcopilotPersonalTrainingData: typeof (window as any).fitcopilotPersonalTrainingData,
        fitcopilotTrainingFeaturesData: typeof (window as any).fitcopilotTrainingFeaturesData,
        fitcopilotTrainingCalendarData: typeof (window as any).fitcopilotTrainingCalendarData
      });
      
      console.log('✅ AppContainer initialization complete');
      setAppInitialized(true);
    } catch (err) {
      console.error('❌ AppContainer initialization failed:', err);
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
      <p>Loading FitCopilot App...</p>
    </div>
  );

  console.log('🎭 AppContainer rendering with initialized state:', appInitialized);

  return (
    <ErrorBoundary>
      <Suspense fallback={loadingFallback}>
        <App />
      </Suspense>
    </ErrorBoundary>
  );
};

// Debug React bootstrap process with more detailed logs
console.log('🚀 React bootstrap starting...');
console.log('📊 Environment check:', {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  nodeEnv: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

// Check if React and ReactDOM are available
console.log('⚛️ React availability check:', {
  React: typeof React,
  createRoot: typeof createRoot,
  ReactVersion: React.version || 'unknown'
});

// Check DOM readiness
console.log('📄 DOM readiness check:', {
  readyState: document.readyState,
  bodyExists: !!document.body,
  headExists: !!document.head,
  scriptsCount: document.scripts.length
});

// Root element ID where the React app will mount
const rootElementId = 'athlete-dashboard-root';
console.log(`🎯 Looking for mount point with ID: #${rootElementId}`);

// Get the container element
const container = document.getElementById(rootElementId);
console.log('📦 Container element check:', {
  containerExists: !!container,
  containerTagName: container?.tagName,
  containerClasses: container?.className,
  containerChildren: container?.children.length,
  containerHTML: container?.innerHTML ? (container.innerHTML.length > 100 ? container.innerHTML.substring(0, 100) + '...' : container.innerHTML) : 'empty'
});

// Handle case where container doesn't exist
if (!container) {
  console.error(`❌ Mount point #${rootElementId} not found in DOM. Creating one...`);
  console.log('🔍 Available elements with IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));

  try {
    // Create a container if it doesn't exist
    const newContainer = document.createElement('div');
    newContainer.id = rootElementId;
    document.body.appendChild(newContainer);
    console.log(`✅ Created #${rootElementId} and appended to body`);

    // Mount app to the newly created container
    console.log('🎯 Attempting to create React root...');
    const root = createRoot(newContainer);
    console.log('🎯 React root created, rendering AppContainer...');
    root.render(<AppContainer />);
    console.log('✅ React app successfully mounted to dynamically created container');

    // Signal successful mount
    notifyMountSuccess(newContainer);
  } catch (error) {
    console.error('❌ Failed to create container and mount app:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Fallback error message
    const errorMsg = document.createElement('div');
    errorMsg.innerHTML = `
      <div style="text-align: center; margin: 2rem; font-family: system-ui, sans-serif;">
        <h2>Something went wrong</h2>
        <p>The app couldn't start properly. Please try refreshing the page.</p>
        <p style="color: #666; font-size: 0.9em;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
    document.body.appendChild(errorMsg);
  }
} else {
  console.log(`✅ Mount point #${rootElementId} found in DOM, rendering React app...`);

  try {
    // Mount app to the existing container
    console.log('🎯 Attempting to create React root on existing container...');
    const root = createRoot(container);
    console.log('🎯 React root created, rendering AppContainer...');
    // Temporarily disable StrictMode to prevent double-mounting issues in WordPress
    root.render(<AppContainer />);
    console.log('✅ React app successfully mounted to existing container');

    // Signal successful mount
    notifyMountSuccess(container);
  } catch (error) {
    console.error('❌ Failed to mount React app to existing container:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Error display
    container.innerHTML = `
      <div style="text-align: center; margin: 2rem; font-family: system-ui, sans-serif;">
        <h2>Something went wrong</h2>
        <p>The app couldn't start properly. Please try refreshing the page.</p>
        <p style="color: #666; font-size: 0.9em;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
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
  console.log('🎉 notifyMountSuccess called');
  
  // Set data attribute on mount element
  mountElement.setAttribute('data-react-mounted', 'true');
  console.log('🚀 React successfully mounted - data attribute set');

  // Signal to WordPress that React mounted successfully (if function exists)
  if (typeof window !== 'undefined' && 'fitcopilotReactMounted' in window) {
    console.log('📞 Calling WordPress fitcopilotReactMounted callback');
    try {
      // @ts-expect-error - Custom global function
      window.fitcopilotReactMounted();
    } catch (err) {
      logger.error('Error calling mount notification function:', err);
    }
  }
} 