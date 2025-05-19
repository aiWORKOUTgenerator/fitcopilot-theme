import React, { useEffect, useRef } from 'react';
import { PerformanceWithMemory, PropChange, PropChanges } from '../types/debug';
import logger from './logger';
import { hasPropChanged, isDebugModeEnabled } from './typeGuards/debugTypeGuards';

declare global {
    interface Window {
        DEBUG_MODE?: boolean;
        DEBUG_PROPS?: boolean;
        DEBUG_PERFORMANCE?: boolean;
        DEBUG_MEMORY?: boolean;
        DEBUG_RENDER?: boolean;
        DEBUG_EVENTS?: boolean;
        DEBUG_STATE?: boolean;
        DEBUG_EFFECTS?: boolean;
        DEBUG_CONTEXT?: boolean;
        DEBUG_ROUTING?: boolean;
        DEBUG_API?: boolean;
        DEBUG_STORAGE?: boolean;
        DEBUG_CACHE?: boolean;
        DEBUG_NETWORK?: boolean;
        DEBUG_SECURITY?: boolean;
        DEBUG_AUTH?: boolean;
        DEBUG_ERRORS?: boolean;
        DEBUG_WARNINGS?: boolean;
        DEBUG_INFO?: boolean;
        DEBUG_VERBOSE?: boolean;
        DEBUG_TRACE?: boolean;
        DEBUG_PROFILE?: boolean;
        DEBUG_TIMING?: boolean;
        DEBUG_METRICS?: boolean;
        DEBUG_ANALYTICS?: boolean;
        DEBUG_LOGGING?: boolean;
        DEBUG_CONSOLE?: boolean;
        DEBUG_DEVTOOLS?: boolean;
        DEBUG_REACT?: boolean;
        DEBUG_REDUX?: boolean;
        DEBUG_MOBX?: boolean;
        DEBUG_GRAPHQL?: boolean;
        DEBUG_REST?: boolean;
        DEBUG_WEBSOCKET?: boolean;
        DEBUG_SOCKET?: boolean;
        DEBUG_POLLING?: boolean;
        DEBUG_REALTIME?: boolean;
        DEBUG_SYNC?: boolean;
        DEBUG_ASYNC?: boolean;
        DEBUG_PROMISE?: boolean;
        DEBUG_OBSERVABLE?: boolean;
        DEBUG_STREAM?: boolean;
        DEBUG_PIPE?: boolean;
        DEBUG_TRANSFORM?: boolean;
        DEBUG_FILTER?: boolean;
        DEBUG_MAP?: boolean;
        DEBUG_REDUCE?: boolean;
        DEBUG_SCAN?: boolean;
        DEBUG_MERGE?: boolean;
        DEBUG_CONCAT?: boolean;
        DEBUG_COMBINE?: boolean;
        DEBUG_ZIP?: boolean;
        DEBUG_FORK?: boolean;
        DEBUG_JOIN?: boolean;
        DEBUG_SPLIT?: boolean;
        DEBUG_PARTITION?: boolean;
        DEBUG_GROUP?: boolean;
        DEBUG_WINDOW?: boolean;
        DEBUG_BUFFER?: boolean;
        DEBUG_THROTTLE?: boolean;
        DEBUG_DEBOUNCE?: boolean;
        DEBUG_DISTINCT?: boolean;
        DEBUG_DISTINCT_UNTIL_CHANGED?: boolean;
        DEBUG_DISTINCT_UNTIL_KEY_CHANGED?: boolean;
        DEBUG_ELEMENT_AT?: boolean;
        DEBUG_FIRST?: boolean;
        DEBUG_LAST?: boolean;
        DEBUG_TAKE?: boolean;
        DEBUG_TAKE_UNTIL?: boolean;
        DEBUG_TAKE_WHILE?: boolean;
        DEBUG_SKIP?: boolean;
        DEBUG_SKIP_UNTIL?: boolean;
        DEBUG_SKIP_WHILE?: boolean;
        DEBUG_COUNT?: boolean;
        DEBUG_MAX?: boolean;
        DEBUG_MIN?: boolean;
        DEBUG_SUM?: boolean;
        DEBUG_AVERAGE?: boolean;
        fitcopilotDebugTools?: {
            logRender: (componentName: string, renderTime: number) => void;
            getComponentStats: () => {
                total: number;
                rendered: number;
                times: Record<string, number>;
            };
        };
    }
}

/**
 * Function to check if debug mode is active
 */
export const isDebugMode = (): boolean => {
  return isDebugModeEnabled();
};

/**
 * Log a message to the debug console
 * 
 * @param message The message to log
 * @param type The type of message (log, warn, error)
 */
export const debugLog = (message: string, type: 'log' | 'warn' | 'error' = 'log'): void => {
  if (!isDebugMode()) return;

  // Define styles for console output in browser - currently unused but kept for future use
  const _styles = {
    log: 'background: #1f2937; color: #a3e635; padding: 2px 4px;',
    warn: 'background: #fbbf24; color: #1f2937; padding: 2px 4px;',
    error: 'background: #ef4444; color: white; padding: 2px 4px;'
  };

  // Use the logger utility based on the type
  if (type === 'log') {
    logger.debug(`FitCopilot Debug: ${message}`);
  } else if (type === 'warn') {
    logger.warn(`FitCopilot Debug: ${message}`);
  } else if (type === 'error') {
    logger.error(`FitCopilot Debug: ${message}`);
  }
};

/**
 * Measure component render time
 * 
 * @param componentName The name of the component to measure
 */
export const useRenderTime = (componentName: string): void => {
  const startTime = useRef<number>(performance.now());

  useEffect(() => {
    if (!isDebugMode()) return;

    const endTime = performance.now();
    const renderTime = Math.round(endTime - startTime.current);

    if (window.fitcopilotDebugTools?.logRender) {
      window.fitcopilotDebugTools.logRender(componentName, renderTime);
    } else {
      debugLog(`${componentName} rendered in ${renderTime}ms`, 'log');
    }

    return () => {
      debugLog(`${componentName} unmounted`, 'log');
    };
  }, [componentName]);
};

/**
 * Component wrapper for adding debugging functionality to a component
 */
export const withDebug = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
): React.FC<P> => {
  const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent';

  const ComponentWithDebug: React.FC<P> = (props) => {
    useRenderTime(name);

    if (!isDebugMode()) {
      return <WrappedComponent {...props} />;
    }

    return (
      <>
        <div className="react-debug-component" data-component={name} id={`react-debug-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
          <span className="react-debug-component-name">{name}</span>
          <span className="react-debug-render-time"></span>
        </div>
        <WrappedComponent {...props} />
      </>
    );
  };

  ComponentWithDebug.displayName = `Debug(${name})`;

  return ComponentWithDebug;
};

/**
 * React hook for debugging prop changes in a component
 * 
 * @param props The props object to monitor
 * @param componentName The name of the component
 */
export const useDebugProps = <P extends object>(props: P, componentName: string): void => {
  const prevProps = useRef<P | null>(null);

  useEffect(() => {
    if (!isDebugMode()) return;

    if (prevProps.current) {
      const changes: PropChanges = {};
      let hasChanges = false;

      Object.keys(props).forEach((key) => {
        const propKey = key as keyof P;
        if (hasPropChanged(prevProps.current![propKey])) {
          const propChange: PropChange<P> = {
            propName: propKey,
            prevValue: prevProps.current![propKey],
            newValue: props[propKey],
            isSignificant: true
          };
          changes[key] = propChange as PropChange<unknown>;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        debugLog(`${componentName} props changed:`, 'log');
        logger.group('Prop Changes', () => {
          logger.debug('Changed props:', changes);
        });
      }
    }

    prevProps.current = { ...props };
  }, [props, componentName]);
};

/**
 * Performance monitor component
 */
export const PerformanceMonitor: React.FC = () => {
  const frameRef = useRef<number>(0);
  const fpsRef = useRef<number[]>([]);
  const memoryRef = useRef<HTMLDivElement>(null);
  const fpsCounterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDebugMode()) return;

    let lastTime = performance.now();
    let frames = 0;

    const loop = () => {
      const now = performance.now();
      frames++;

      if (now >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        fpsRef.current.push(fps);

        if (fpsRef.current.length > 60) {
          fpsRef.current.shift();
        }

        const avgFps = Math.round(fpsRef.current.reduce((sum, val) => sum + val, 0) / fpsRef.current.length);

        if (fpsCounterRef.current) {
          fpsCounterRef.current.textContent = `${avgFps} FPS`;

          if (avgFps < 30) {
            fpsCounterRef.current.style.color = '#ef4444';
          } else if (avgFps < 50) {
            fpsCounterRef.current.style.color = '#fbbf24';
          } else {
            fpsCounterRef.current.style.color = '#a3e635';
          }
        }

        frames = 0;
        lastTime = now;
      }

      // Update memory usage if available using our type guard
      const performanceWithMemory = performance as PerformanceWithMemory;
      if (memoryRef.current && performanceWithMemory.memory) {
        const memory = performanceWithMemory.memory;
        const usedMemory = memory.usedJSHeapSize ? Math.round(memory.usedJSHeapSize / (1024 * 1024)) : 0;
        const totalMemory = memory.jsHeapSizeLimit ? Math.round(memory.jsHeapSizeLimit / (1024 * 1024)) : 0;
        memoryRef.current.textContent = `Memory: ${usedMemory}MB / ${totalMemory}MB`;
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  if (!isDebugMode()) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        right: '0',
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '5px 10px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}
    >
      <div ref={fpsCounterRef}>-- FPS</div>
      <div ref={memoryRef}>Memory: --MB / --MB</div>
    </div>
  );
};

export default {
  isDebugMode,
  debugLog,
  useRenderTime,
  withDebug,
  useDebugProps,
  PerformanceMonitor
}; 