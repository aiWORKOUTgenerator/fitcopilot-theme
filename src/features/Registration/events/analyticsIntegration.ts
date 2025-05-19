import { useEffect } from 'react';
import { debug } from '../../../utils/logger';
import { AnalyticsEvent, AnalyticsUser, StepViewEvent, StepViewParams, TransitionEvent } from './analyticsTypes';
import { transitionEventManager } from './transitionEventManager';
import { StepTransitionEvent } from './transitionEvents';

/**
 * Interface for analytics service integration
 */
interface AnalyticsService {
    trackEvent(event: AnalyticsEvent): void;
    identifyUser(user: AnalyticsUser): void;
    pageView(path: string): void;
}

/**
 * Mock analytics service implementation
 * This would be replaced with actual service implementations (Google Analytics, Mixpanel, etc.)
 */
const analyticsService: AnalyticsService = {
  trackEvent: (event) => {
    // In a real implementation, this would send to Google Analytics, Mixpanel, etc.
    if (process.env.NODE_ENV !== 'production') {
      debug(`[Analytics] ${event.type}`, event.properties);
    }
  },
  identifyUser: (user) => {
    if (process.env.NODE_ENV !== 'production') {
      debug('[Analytics] Identify User', user);
    }
  },
  pageView: (path) => {
    if (process.env.NODE_ENV !== 'production') {
      debug('[Analytics] Page View', { path });
    }
  }
};

/**
 * Hook to connect registration step transitions to analytics
 * Automatically tracks all step transitions with the analytics service
 */
export const useTransitionAnalytics = () => {
  useEffect(() => {
    // Subscribe to all transition events
    const unsubscribe = transitionEventManager.subscribe((event: StepTransitionEvent) => {
      // Map our event to analytics format
      const transitionEvent: TransitionEvent = {
        type: 'transition',
        properties: {
          fromStep: event.sourceStep,
          toStep: event.destinationStep,
          transitionType: event.transitionType as 'next' | 'back' | 'skip'
        },
        timestamp: new Date(event.timestamp).toISOString()
      };

      analyticsService.trackEvent(transitionEvent);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Expose direct access to analytics service for custom events
  const trackCustomEvent = (event: AnalyticsEvent) => {
    analyticsService.trackEvent(event);
  };

  const trackStepView = (stepId: string, params: StepViewParams) => {
    const stepViewEvent: StepViewEvent = {
      type: 'step_view',
      properties: {
        stepId,
        stepName: params.stepName,
        stepNumber: params.stepNumber,
        totalSteps: params.totalSteps
      },
      timestamp: new Date().toISOString()
    };

    analyticsService.trackEvent(stepViewEvent);
  };

  return {
    trackCustomEvent,
    trackStepView
  };
}; 