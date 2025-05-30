import { useCallback, useState } from 'react';
import logger from '../../../../utils/logger';
import { FeatureInteractionHandlers, FeatureInteractionState } from '../types';
import { handleScrollToSplash } from '../utils';

/**
 * Custom hook for managing feature interaction state
 * Handles hover states, active features, and scroll interactions
 * 
 * @returns Object containing interaction state and handlers
 * 
 * @example
 * ```tsx
 * const { state, handlers } = useFeatureInteraction();
 * 
 * <FeatureCard
 *   onMouseEnter={() => handlers.handleFeatureHover(0)}
 *   onMouseLeave={handlers.handleMouseLeave}
 * />
 * ```
 */
export const useFeatureInteraction = () => {
  // Interaction state
  const [state, setState] = useState<FeatureInteractionState>({
    activeFeatureIndex: null,
    isInteracting: false,
    lastInteractionTime: 0
  });

  /**
   * Handles feature hover/focus
   * @param index - Index of the feature being hovered
   */
  const handleFeatureHover = useCallback((index: number) => {
    const now = Date.now();
    
    setState(prevState => ({
      ...prevState,
      activeFeatureIndex: index,
      isInteracting: true,
      lastInteractionTime: now
    }));

    logger.debug(`Feature ${index} hovered at ${now}`);
  }, []);

  /**
   * Handles mouse leave from feature area
   */
  const handleMouseLeave = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      activeFeatureIndex: null,
      isInteracting: false,
      lastInteractionTime: Date.now()
    }));

    logger.debug('Mouse left feature area');
  }, []);

  /**
   * Handles scroll to splash section
   * @param e - Mouse event from button/link click
   * @param targetId - Optional target ID (defaults to 'splash-section')
   */
  const handleScrollToSplashAction = useCallback((
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    targetId?: string
  ) => {
    handleScrollToSplash(e, targetId);
    logger.debug('Scroll to splash triggered');
  }, []);

  /**
   * Resets all interaction states
   */
  const resetInteractions = useCallback(() => {
    setState({
      activeFeatureIndex: null,
      isInteracting: false,
      lastInteractionTime: Date.now()
    });

    logger.debug('Feature interactions reset');
  }, []);

  /**
   * Gets whether a specific feature is active
   * @param index - Feature index to check
   * @returns True if the feature is currently active
   */
  const isFeatureActive = useCallback((index: number): boolean => {
    return state.activeFeatureIndex === index;
  }, [state.activeFeatureIndex]);

  /**
   * Gets the time since last interaction
   * @returns Time in milliseconds since last interaction
   */
  const getTimeSinceLastInteraction = useCallback((): number => {
    return Date.now() - state.lastInteractionTime;
  }, [state.lastInteractionTime]);

  // Create handlers object
  const handlers: FeatureInteractionHandlers = {
    handleFeatureHover,
    handleMouseLeave,
    handleScrollToSplash: handleScrollToSplashAction,
    resetInteractions
  };

  return {
    state,
    handlers,
    // Utility functions
    isFeatureActive,
    getTimeSinceLastInteraction,
    // Direct state access for convenience
    activeFeatureIndex: state.activeFeatureIndex,
    isInteracting: state.isInteracting
  };
}; 