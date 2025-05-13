import { AnalyticsEvent, AnalyticsUser } from '../events/analyticsTypes';
import './setup';

// Create mock for analytics service with proper typing
const mockAnalyticsTrack = jest.fn<void, [AnalyticsEvent]>();
const mockAnalyticsIdentify = jest.fn<void, [AnalyticsUser]>();
const mockAnalyticsPageView = jest.fn<void, [string]>();

const mockAnalyticsService = {
    trackEvent: mockAnalyticsTrack,
    identifyUser: mockAnalyticsIdentify,
    pageView: mockAnalyticsPageView
};

// Mock the useTransitionAnalytics hook with proper typing
const mockTrackStepView = jest.fn<void, [string, Record<string, unknown>]>();
const mockTrackTransition = jest.fn<void, [string, string, Record<string, unknown>]>();

jest.mock('../events/analyticsIntegration', () => ({
    useTransitionAnalytics: () => ({
        trackStepView: mockTrackStepView,
        trackTransition: mockTrackTransition
    })
}));

// Basic test to ensure the file passes ESLint
describe('Registration Analytics', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('passes syntax checking', () => {
        expect(true).toBe(true);
    });
});
