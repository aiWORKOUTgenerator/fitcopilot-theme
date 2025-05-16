import { useCallback } from 'react';
import { transitionEventManager } from '../events/transitionEventManager';
import { TransitionEventListener, TransitionType } from '../events/transitionEvents';
import { RegistrationStep } from '../types';

/**
 * Hook for working with registration transition events
 * Provides methods to track different types of step transitions
 */
export const useRegistrationEvents = () => {
  // Subscribe to transition events
  const subscribeToTransitions = useCallback(
    (listener: TransitionEventListener) => {
      return transitionEventManager.subscribe(listener);
    },
    []
  );

  // Track standard transition (next in sequence)
  const trackStandardTransition = useCallback(
    (sourceStep: RegistrationStep, destinationStep: RegistrationStep, metadata?: Record<string, unknown>) => {
      transitionEventManager.emitTransition(
        sourceStep,
        destinationStep,
        TransitionType.STANDARD,
        metadata
      );
    },
    []
  );

  // Track map-based transition (using transition map)
  const trackMapTransition = useCallback(
    (sourceStep: RegistrationStep, destinationStep: RegistrationStep, metadata?: Record<string, unknown>) => {
      transitionEventManager.emitTransition(
        sourceStep,
        destinationStep,
        TransitionType.MAP_BASED,
        metadata
      );
    },
    []
  );

  // Track direct navigation (goToStep)
  const trackDirectNavigation = useCallback(
    (sourceStep: RegistrationStep, destinationStep: RegistrationStep, metadata?: Record<string, unknown>) => {
      transitionEventManager.emitTransition(
        sourceStep,
        destinationStep,
        TransitionType.DIRECT,
        metadata
      );
    },
    []
  );

  // Track back navigation
  const trackBackNavigation = useCallback(
    (sourceStep: RegistrationStep, destinationStep: RegistrationStep, metadata?: Record<string, unknown>) => {
      transitionEventManager.emitTransition(
        sourceStep,
        destinationStep,
        TransitionType.BACK,
        metadata
      );
    },
    []
  );

  // Track override navigation
  const trackOverrideNavigation = useCallback(
    (sourceStep: RegistrationStep, destinationStep: RegistrationStep, metadata?: Record<string, unknown>) => {
      transitionEventManager.emitTransition(
        sourceStep,
        destinationStep,
        TransitionType.OVERRIDE,
        metadata
      );
    },
    []
  );

  return {
    subscribeToTransitions,
    trackStandardTransition,
    trackMapTransition,
    trackDirectNavigation,
    trackBackNavigation,
    trackOverrideNavigation
  };
}; 