import React, { Suspense } from 'react';
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

// Lazy load debug components conditionally
const LazyExampleComponent = lazyLoad(() => import('./components/ExampleComponent'));

/**
 * Main Homepage component wrapper
 * This is ONLY a component, with no initialization logic
 * All initialization happens in index.tsx
 */
const Homepage: React.FC = () => {
  // Use debug hook to measure render time
  debug.useRenderTime('Homepage');

  // Determine if in debug mode
  const isDebug = debug.isDebugMode();

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