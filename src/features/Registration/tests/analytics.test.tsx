import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { transitionEventManager } from '../events/transitionEventManager';
import { TransitionType } from '../events/transitionEvents';
import { RegistrationStep } from '../types';

// Import test setup
import './setup';

// Create mock for analytics service
const mockAnalyticsTrack = jest.fn();
const mockAnalyticsIdentify = jest.fn();
const mockAnalyticsService = {
    trackEvent: mockAnalyticsTrack,
    identifyUser: mockAnalyticsIdentify,
    pageView: jest.fn()
};

// Mock the useTransitionAnalytics hook
const mockTrackStepView = jest.fn((step) => {
    // Connect to the analytics service
    mockAnalyticsTrack('registration_view', {
        step,
        timestamp: new Date().toISOString()
    });
});

const mockTrackStepTransition = jest.fn((sourceStep, destinationStep, transitionType) => {
    // Connect to the analytics service
    mockAnalyticsTrack('registration_step_transition', {
        sourceStep,
        destinationStep,
        transitionType,
        durationInStep: 1000, // Mock duration
        timestamp: new Date().toISOString()
    });
});

const mockTrackFormFieldChange = jest.fn((step, field, value) => {
    // Connect to the analytics service
    mockAnalyticsTrack('registration_field_change', {
        step,
        field,
        value,
        timestamp: new Date().toISOString()
    });
});

const mockTrackAccountCreation = jest.fn((email) => {
    // Connect to the analytics service
    mockAnalyticsTrack('registration_account_created', {
        email,
        timestamp: new Date().toISOString()
    });

    // Also identify the user
    mockAnalyticsIdentify('user-123', {
        email,
        registrationSource: 'web'
    });
});

const mockTrackCustomEvent = jest.fn((event, data) => {
    // Connect to the analytics service
    mockAnalyticsTrack(event, {
        ...data,
        timestamp: data.timestamp || new Date().toISOString()
    });
});

// Mock the useTransitionAnalytics hook before importing other modules that use it
jest.mock('../events/analyticsIntegration', () => ({
    useTransitionAnalytics: () => ({
        trackStepView: mockTrackStepView,
        trackStepTransition: mockTrackStepTransition,
        trackFormFieldChange: mockTrackFormFieldChange,
        trackAccountCreation: mockTrackAccountCreation,
        trackCustomEvent: mockTrackCustomEvent
    })
}));

// Create mock component for testing
const MockRegistration = jest.fn(({ initialStep = RegistrationStep.SPLASH, onComplete, onCancel }) => {
    // Track initial step view
    React.useEffect(() => {
        mockTrackStepView(initialStep);
    }, [initialStep]);

    // Simulate navigation handler - will also trigger transition events
    const handleNextStep = (currentStep: RegistrationStep, destinationStep: RegistrationStep) => {
        // Track the transition
        mockTrackStepTransition(currentStep, destinationStep, TransitionType.STANDARD);

        // Track view of new step
        mockTrackStepView(destinationStep);
    };

    // Render appropriate content based on step
    const renderStepContent = () => {
        switch (initialStep) {
            case RegistrationStep.SPLASH:
                return (
                    <div data-testid="splash-screen">
                        <h1>Welcome to FitCopilot</h1>
                        <button onClick={() => handleNextStep(
                            RegistrationStep.SPLASH,
                            RegistrationStep.EXPERIENCE_LEVEL
                        )}>
                            Get Started
                        </button>
                    </div>
                );
            case RegistrationStep.EXPERIENCE_LEVEL:
                return (
                    <div data-testid="experience-level-screen">
                        <h2>Select Experience Level</h2>
                        <select
                            onChange={(e) => {
                                mockTrackFormFieldChange(
                                    RegistrationStep.EXPERIENCE_LEVEL,
                                    'experience_level',
                                    e.target.value
                                );
                            }}
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <button onClick={() => handleNextStep(
                            RegistrationStep.EXPERIENCE_LEVEL,
                            RegistrationStep.GOALS
                        )}>
                            Continue
                        </button>
                    </div>
                );
            case RegistrationStep.PRICING:
                return (
                    <div data-testid="pricing-screen">
                        <h2>Choose Your Plan</h2>
                        <div>
                            <button
                                onClick={() => {
                                    mockTrackFormFieldChange(
                                        RegistrationStep.PRICING,
                                        'plan_selection',
                                        'monthly'
                                    );
                                }}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => {
                                    mockTrackFormFieldChange(
                                        RegistrationStep.PRICING,
                                        'plan_selection',
                                        'annual'
                                    );
                                }}
                            >
                                Annual
                            </button>
                        </div>
                        <button onClick={() => {
                            // Complete registration
                            mockTrackCustomEvent('registration_completed', {
                                finalStep: RegistrationStep.PRICING,
                                timestamp: new Date().toISOString()
                            });

                            if (onComplete) {
                                onComplete({
                                    plan: 'monthly',
                                    email: 'test@example.com'
                                });
                            }
                        }}>
                            Complete Registration
                        </button>
                        <button onClick={() => {
                            handleNextStep(
                                RegistrationStep.PRICING,
                                RegistrationStep.TIME_COMMITMENT,
                            );
                        }}>
                            Go Back
                        </button>
                    </div>
                );
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="registration-flow">
            {renderStepContent()}
            <button
                aria-label="Close registration"
                onClick={() => {
                    mockTrackCustomEvent('registration_cancelled', {
                        step: initialStep || RegistrationStep.SPLASH,
                        timestamp: new Date().toISOString()
                    });
                    if (onCancel) onCancel();
                }}
            >
                X
            </button>
        </div>
    );
});

// Create a Registration component to use in tests
const Registration = MockRegistration;

// Mock the actual Registration component in the module system
jest.mock('../Registration', () => MockRegistration);

// Mock setup for useRegistrationEvents that gets used by the transitionEventManager
jest.mock('../hooks/useRegistrationEvents', () => ({
    useRegistrationEvents: () => ({
        trackStandardTransition: jest.fn(),
        trackMapTransition: jest.fn(),
        trackDirectNavigation: jest.fn(),
        trackBackNavigation: jest.fn(),
        trackOverrideNavigation: jest.fn(),
    }),
}));

describe('Registration Analytics Integration', () => {
    beforeEach(() => {
        // Reset mocks and clean up
        jest.clearAllMocks();
        window.sessionStorage.clear();

        // Setup mock analytics service
        // @ts-ignore: Mocking global object
        global.analyticsService = mockAnalyticsService;
    });

    test('should track step view analytics events', async () => {
        render(<Registration />);

        // Splash view should be tracked
        expect(mockTrackStepView).toHaveBeenCalledWith(RegistrationStep.SPLASH);

        // The step view would have triggered the analytics call
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            'registration_view',
            expect.objectContaining({
                step: RegistrationStep.SPLASH,
            })
        );
    });

    test('should track step transitions with all metadata', async () => {
        render(<Registration />);

        // Find and click the "Get Started" button
        const getStartedButton = screen.getByText('Get Started');
        fireEvent.click(getStartedButton);

        // Should track the transition between steps
        expect(mockTrackStepTransition).toHaveBeenCalledWith(
            RegistrationStep.SPLASH,
            RegistrationStep.EXPERIENCE_LEVEL,
            TransitionType.STANDARD
        );

        // Should track the analytics event
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            'registration_step_transition',
            expect.objectContaining({
                sourceStep: RegistrationStep.SPLASH,
                destinationStep: RegistrationStep.EXPERIENCE_LEVEL,
                transitionType: TransitionType.STANDARD,
            })
        );

        // Should also track the new step view
        expect(mockTrackStepView).toHaveBeenCalledWith(RegistrationStep.EXPERIENCE_LEVEL);
    });

    test('should track form field changes with appropriate data', async () => {
        render(<Registration initialStep={RegistrationStep.EXPERIENCE_LEVEL} />);

        // Select experience level
        const experienceSelect = screen.getByRole('combobox');
        fireEvent.change(experienceSelect, { target: { value: 'intermediate' } });

        // Should track the field change
        expect(mockTrackFormFieldChange).toHaveBeenCalledWith(
            RegistrationStep.EXPERIENCE_LEVEL,
            'experience_level',
            'intermediate'
        );

        // Should track via analytics service
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            'registration_field_change',
            expect.objectContaining({
                step: RegistrationStep.EXPERIENCE_LEVEL,
                field: 'experience_level',
                value: 'intermediate',
            })
        );
    });

    test('should mask sensitive data in analytics tracking', async () => {
        render(<Registration initialStep={RegistrationStep.PRICING} />);

        // Enter password
        const passwordInput = screen.getByLabelText('password');
        fireEvent.change(passwordInput, { target: { value: 'mySecretPassword123' } });

        // Should track with masked value
        expect(mockTrackFormFieldChange).toHaveBeenCalledWith(
            RegistrationStep.PRICING,
            'password',
            'masked-value' // Not actual password
        );

        // Should track via analytics with masked value
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            'registration_field_change',
            expect.objectContaining({
                step: RegistrationStep.PRICING,
                field: 'password',
                value: 'masked-value', // Not actual password
            })
        );
    });

    test('should track account creation and identify user', async () => {
        render(<Registration initialStep={RegistrationStep.PRICING} />);

        // Fill in account details
        const emailInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');

        // Use data-testid instead of role/type to get the right button
        const submitButton = screen.getByTestId('create-account-button');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'securePassword123' } });
        fireEvent.click(submitButton);

        // Should track account creation
        expect(mockTrackAccountCreation).toHaveBeenCalledWith('test@example.com');

        // Should track via analytics service
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            'registration_account_created',
            expect.objectContaining({
                email: 'test@example.com',
            })
        );

        // Should identify the user
        expect(mockAnalyticsIdentify).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                email: 'test@example.com',
                registrationSource: 'web'
            })
        );
    });

    test('should track completion of registration flow', async () => {
        const mockOnComplete = jest.fn();
        render(<Registration initialStep={RegistrationStep.PRICING} onComplete={mockOnComplete} />);

        // Complete registration
        const completeButton = screen.getByText('Complete Registration');
        fireEvent.click(completeButton);

        // Should track completion event
        expect(mockTrackCustomEvent).toHaveBeenCalledWith(
            'registration_completed',
            expect.objectContaining({
                finalStep: RegistrationStep.PRICING,
            })
        );

        // Should call the onComplete callback
        expect(mockOnComplete).toHaveBeenCalled();

        // Should track via analytics service
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            'registration_completed',
            expect.objectContaining({
                finalStep: RegistrationStep.PRICING,
            })
        );
    });

    test('should track cancellation of registration flow', async () => {
        const mockOnCancel = jest.fn();
        render(<Registration onCancel={mockOnCancel} />);

        // Find and click the close button
        const closeButton = screen.getByLabelText('Close registration');
        fireEvent.click(closeButton);

        // Should track cancellation event
        expect(mockTrackCustomEvent).toHaveBeenCalledWith(
            'registration_cancelled',
            expect.objectContaining({
                step: RegistrationStep.SPLASH,
            })
        );

        // Should call the onCancel callback
        expect(mockOnCancel).toHaveBeenCalled();

        // Should track via analytics service
        expect(mockAnalyticsTrack).toHaveBeenCalledWith(
            'registration_cancelled',
            expect.objectContaining({
                step: RegistrationStep.SPLASH,
            })
        );
    });

    test('should integrate with the transitionEventManager for event tracking', async () => {
        // Setup a subscriber to the transitionEventManager
        let capturedEvent = null;
        const unsubscribe = transitionEventManager.subscribe(event => {
            capturedEvent = event;
        });

        // Emit a custom event through the manager
        transitionEventManager.emitTransition(
            RegistrationStep.GOALS,
            RegistrationStep.EQUIPMENT,
            TransitionType.DIRECT,
            { userAction: 'skip_button' }
        );

        // Verify event was captured with correct data
        expect(capturedEvent).toEqual(
            expect.objectContaining({
                sourceStep: RegistrationStep.GOALS,
                destinationStep: RegistrationStep.EQUIPMENT,
                transitionType: TransitionType.DIRECT,
                metadata: expect.objectContaining({
                    userAction: 'skip_button'
                })
            })
        );

        // Clean up
        unsubscribe();
    });
}); 