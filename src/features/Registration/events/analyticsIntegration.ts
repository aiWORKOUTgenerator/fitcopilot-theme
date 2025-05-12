import { useEffect } from 'react';
import logger from '../../../utils/logger';
import { transitionEventManager } from './transitionEventManager';
import { StepTransitionEvent } from './transitionEvents';

/**
 * Interface for analytics service integration
 */
interface AnalyticsService {
    trackEvent(eventName: string, properties: Record<string, unknown>): void;
}

/**
 * Mock analytics service implementation
 * This would be replaced with actual service implementations (Google Analytics, Mixpanel, etc.)
 */
const analyticsService: AnalyticsService = {
    trackEvent: (eventName, properties) => {
        // In a real implementation, this would send to Google Analytics, Mixpanel, etc.
        if (process.env.NODE_ENV !== 'production') {
            logger.debug(`[Analytics] ${eventName}`, properties);
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
            analyticsService.trackEvent('registration_step_change', {
                from_step: event.sourceStep,
                to_step: event.destinationStep,
                transition_type: event.transitionType,
                timestamp: new Date(event.timestamp).toISOString(),
                duration_ms: Date.now() - event.timestamp,
                ...event.metadata
            });
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Expose direct access to analytics service for custom events
    const trackCustomEvent = (eventName: string, properties: Record<string, unknown>) => {
        analyticsService.trackEvent(eventName, properties);
    };

    return { trackCustomEvent };
}; 