import React, { Suspense, lazy } from 'react';
import './styles/homepage.scss';
import './styles/lazy-loading.scss';

// Import debug utilities
import debug from './utils/debug';

// Import lazy loading utility
import lazyLoad from './utils/lazyLoad';

// Lazy load components
const LazyHomepage = lazyLoad(() => import('./features/Homepage'), {
  fallback: <div className="lazy-loading-skeleton hero-skeleton" />,
  prefetch: true,  // Prefetch high-priority component
});

// Lazy load Registration with standard React.lazy (more lightweight than our custom lazyLoad)
const LazyRegistration = lazy(() => import('./features/Registration/Registration'));

// Lazy load debug components conditionally
const LazyExampleComponent = lazyLoad(() => import('./components/ExampleComponent'));

// Add a Loading component for better user experience
const LoadingFallback = () => (
  <div className="lazy-loading-skeleton registration-skeleton">
    <div className="registration-skeleton-header"></div>
    <div className="registration-skeleton-content">
      <div className="registration-skeleton-form"></div>
    </div>
  </div>
);

/**
 * Main Homepage component wrapper
 * This is ONLY a component, with no initialization logic
 * All initialization happens in index.tsx
 */
const Homepage: React.FC = () => {
  console.log('🏠 Homepage component rendering...');
  
  // Use debug hook to measure render time
  debug.useRenderTime('Homepage');

  // Determine if in debug mode
  const isDebug = debug.isDebugMode();
  
  console.log('🔧 Homepage debug mode:', isDebug);

  // Check if registration page is requested (based on URL hash or query param)
  const showRegistration = window.location.hash.includes('#registration') ||
    new URLSearchParams(window.location.search).has('registration');

  // Add prefetching hint for Registration
  React.useEffect(() => {
    // Add prefetch link for registration
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/wp-content/themes/fitcopilot/dist/chunks/feature-registration.js';
    link.as = 'script';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Render appropriate content based on route
  if (showRegistration) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LazyRegistration
          initialStep={'personal-info' as any}
          onComplete={() => window.location.href = '/dashboard'}
          onCancel={() => window.location.href = '/'}
        />
      </Suspense>
    );
  }

  return (
    <>
      {/* Main content with suspense boundary */}
      <Suspense fallback={<div className="lazy-loading-skeleton hero-skeleton" />}>
        <LazyHomepage />
      </Suspense>

      {/* Only show example component in debug mode */}
      {isDebug && (
        <div className="debug-container" style={{ padding: '20px', margin: '20px', border: '1px dashed #a3e635' }}>
          <h1>Debug Components</h1>
          <Suspense fallback={<div className="lazy-loading-skeleton" style={{ height: '200px' }} />}>
            <LazyExampleComponent title="Debug Example" />
          </Suspense>
          <debug.PerformanceMonitor />
        </div>
      )}
    </>
  );
};

// Export with debug wrapper in production, but keep the component name clean
export default debug.withDebug(Homepage, 'Homepage'); 