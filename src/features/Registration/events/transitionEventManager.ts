import { RegistrationStep } from '../types';
import { StepTransitionEvent, TransitionEventListener, TransitionType } from './transitionEvents';
import logger from '../../../utils/logger';

/**
 * Manages registration step transition events and listeners
 */
class TransitionEventManager {
  private listeners: TransitionEventListener[] = [];

  /**
     * Register a listener for transition events
     * @returns Function to unsubscribe the listener
     */
  public subscribe(listener: TransitionEventListener): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
     * Emit a transition event to all registered listeners
     */
  public emitTransition(
    sourceStep: RegistrationStep,
    destinationStep: RegistrationStep,
    transitionType: TransitionType,
    metadata?: Record<string, unknown>
  ): void {
    const event: StepTransitionEvent = {
      sourceStep,
      destinationStep,
      transitionType,
      timestamp: Date.now(),
      metadata
    };

    // Notify all listeners
    this.listeners.forEach(listener => listener(event));

    // Log for debugging
    logger.debug(
      `[Registration Event] ${sourceStep} → ${destinationStep} (${transitionType})`,
      metadata ? metadata : ''
    );
  }
}

// Singleton instance
export const transitionEventManager = new TransitionEventManager(); 