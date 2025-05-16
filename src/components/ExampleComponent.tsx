import React, { useEffect, useState } from 'react';
import debug from '../utils/debug';

// Define component props interface
interface ExampleComponentProps {
    title?: string;
    showTimer?: boolean;
}

/**
 * Example component demonstrating debugging capabilities
 */
const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title = 'Example Component',
  showTimer = true
}) => {
  // Use the render time debug hook
  debug.useRenderTime('ExampleComponent');

  // Use the props debug hook
  debug.useDebugProps({ title, showTimer }, 'ExampleComponent');

  // Component state
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate async data loading
  useEffect(() => {
    if (debug.isDebugMode()) {
      debug.debugLog('ExampleComponent mounted with props: ' + JSON.stringify({ title, showTimer }));
    }

    const loadTimer = setTimeout(() => {
      setIsLoading(false);

      if (debug.isDebugMode()) {
        debug.debugLog('ExampleComponent finished loading');
      }
    }, 1500);

    return () => {
      clearTimeout(loadTimer);

      if (debug.isDebugMode()) {
        debug.debugLog('ExampleComponent cleanup');
      }
    };
  }, [title, showTimer]);

  // Increment counter
  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);

    if (debug.isDebugMode()) {
      debug.debugLog(`Count incremented to ${count + 1}`);
    }
  };

  // Reset counter
  const handleReset = () => {
    setCount(0);

    if (debug.isDebugMode()) {
      debug.debugLog('Count reset to 0');
    }
  };

  // Render a loading state
  if (isLoading) {
    return (
      <div className="example-component is-loading">
        <div className="loading-indicator">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="example-component">
      <h2>{title}</h2>

      <div className="example-content">
        <p>This is an example component that demonstrates debugging tools.</p>

        <div className="counter-section">
          <p>Count: <strong>{count}</strong></p>

          <div className="button-group">
            <button
              className="button button--primary"
              onClick={handleIncrement}
            >
              Increment
            </button>

            <button
              className="button button--secondary"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        {showTimer && (
          <Timer />
        )}
      </div>
    </div>
  );
};

/**
 * Simple timer subcomponent
 */
const Timer: React.FC = () => {
  // Use the render time debug hook
  debug.useRenderTime('Timer');

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer">
      <p>Timer: <strong>{seconds} seconds</strong></p>
    </div>
  );
};

// Export the component with debug wrapper
export default debug.withDebug(ExampleComponent); 