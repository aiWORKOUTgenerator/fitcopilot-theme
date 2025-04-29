import React from 'react';
import './styles/homepage.scss';

// Import feature component from feature-first structure
import ExampleComponent from './components/ExampleComponent';
import HomepageComponent from './features/Homepage';
import debug from './utils/debug';

/**
 * Main Homepage component wrapper
 * This is ONLY a component, with no initialization logic
 * All initialization happens in index.tsx
 */
const Homepage: React.FC = () => {
  // Use debug hook to measure render time
  debug.useRenderTime('Homepage');

  return (
    <>
      <HomepageComponent />

      {/* Only show example component in debug mode */}
      {debug.isDebugMode() && (
        <div className="debug-container" style={{ padding: '20px', margin: '20px', border: '1px dashed #a3e635' }}>
          <h1>Debug Components</h1>
          <ExampleComponent title="Debug Example" />
          <debug.PerformanceMonitor />
        </div>
      )}
    </>
  );
};

// Export with debug wrapper in production, but keep the component name clean
export default debug.withDebug(Homepage, 'Homepage'); 