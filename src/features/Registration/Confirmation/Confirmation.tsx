import { Check, ChevronRight, Download, ExternalLink } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useRegistrationData } from '../hooks';
import { RegistrationStepId } from '../types';
import './Confirmation.scss';

/**
 * Confirmation component for the registration flow
 * 
 * This component provides feedback after successful registration
 * and displays next steps for the user.
 */
const Confirmation: React.FC = () => {
    // Get navigation context
    const {
        state,
        dispatch
    } = useNavigation();

    // Check if this step is active
    const isActive = state.currentStep === RegistrationStepId.CONFIRMATION;

    // Get registration data
    const { data, updateData } = useRegistrationData();

    // Mark all steps as completed when component mounts
    useEffect(() => {
        if (isActive) {
            // Mark the Payment step as completed (just in case)
            if (!state.completedSteps.has(RegistrationStepId.PAYMENT)) {
                dispatch({ type: 'COMPLETE_STEP', payload: { stepId: RegistrationStepId.PAYMENT } });
            }

            // Mark the Confirmation step as completed
            dispatch({ type: 'COMPLETE_STEP', payload: { stepId: RegistrationStepId.CONFIRMATION } });

            // Update registration data with completed status
            updateData({
                ...data,
                registrationCompleted: true,
                registrationDate: new Date().toISOString()
            });

            // Track completion event (could connect to analytics)
            console.log('Registration completed:', {
                userId: 'temp-user-id', // This would come from auth system
                selectedPlan: data.selectedPlan,
                experienceLevel: data.experienceLevel,
                timestamp: new Date().toISOString()
            });
        }
    }, [isActive, state.completedSteps, dispatch, data, updateData]);

    // Early return if not active
    if (!isActive) {
        return null;
    }

    // Generate personalized content based on selected plan
    const getPlanSpecificContent = () => {
        const planType = data.paymentDetails?.type || 'paid';
        const planName = data.selectedPlan || 'Pro';

        if (planType === 'free') {
            return {
                title: 'Welcome to FitCopilot Basic!',
                message: 'Your free plan is now active. You have access to 5 AI workouts per month.',
                nextSteps: [
                    'Generate your first AI workout',
                    'Complete your fitness profile',
                    'Explore basic tracking features'
                ]
            };
        } else if (planType === 'premium' || planName === 'Elite') {
            return {
                title: 'Welcome to FitCopilot Elite!',
                message: 'Your premium plan is now active with full access to all features and premium coaching.',
                nextSteps: [
                    'Schedule your welcome call with a coach',
                    'Get your custom workout program created',
                    'Access all premium features and content',
                    'Set up nutrition tracking'
                ]
            };
        } else {
            return {
                title: 'Welcome to FitCopilot Pro!',
                message: 'Your pro plan is now active with unlimited AI workouts and advanced features.',
                nextSteps: [
                    'Create your first custom workout routine',
                    'Explore all the pro analytics features',
                    'Set up your fitness goals and tracking',
                    'Check out the exercise library'
                ]
            };
        }
    };

    const planContent = getPlanSpecificContent();

    // Generate subscription details
    const getSubscriptionDetails = () => {
        const planType = data.paymentDetails?.type || 'paid';

        if (planType === 'free') {
            return {
                planDisplay: 'Basic (Free)',
                billingCycle: 'N/A',
                nextBilling: 'N/A'
            };
        }

        const planName = data.selectedPlan || 'Pro';
        const amount = data.paymentDetails?.amount || '9.99';
        const billingCycle = data.paymentDetails?.plan || 'month';

        // Calculate next billing date
        const nextBillingDate = new Date();
        if (billingCycle === 'year') {
            nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        } else {
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        }

        const formattedDate = nextBillingDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return {
            planDisplay: `${planName} ($${amount}/${billingCycle})`,
            billingCycle: billingCycle === 'year' ? 'Annual' : 'Monthly',
            nextBilling: formattedDate
        };
    };

    const subscriptionDetails = getSubscriptionDetails();

    // Handle going to the dashboard
    const handleGotoDashboard = () => {
        // This would typically navigate to the main app
        window.location.href = '/dashboard';
    };

    // Handle downloading the app
    const handleDownloadApp = () => {
        // This could open a modal with app download links or go to app store
        window.open('https://app-store-link.com', '_blank');
    };

    return (
        <div className="confirmation-container">
            <div className="confirmation-success">
                <div className="success-icon">
                    <Check size={32} />
                </div>
                <h1 className="confirmation-title">
                    {planContent.title}
                </h1>
                <p className="confirmation-message">
                    {planContent.message}
                </p>
            </div>

            <div className="confirmation-details">
                <div className="details-section">
                    <h3>Your Subscription</h3>

                    <div className="details-row">
                        <div className="detail-label">Plan</div>
                        <div className="detail-value">{subscriptionDetails.planDisplay}</div>
                    </div>

                    <div className="details-row">
                        <div className="detail-label">Billing Cycle</div>
                        <div className="detail-value">{subscriptionDetails.billingCycle}</div>
                    </div>

                    <div className="details-row">
                        <div className="detail-label">Next Billing Date</div>
                        <div className="detail-value">{subscriptionDetails.nextBilling}</div>
                    </div>

                    {data.paymentDetails?.cardLast4 && (
                        <div className="details-row">
                            <div className="detail-label">Payment Method</div>
                            <div className="detail-value">
                                {data.paymentDetails.cardType || 'Card'} ending in {data.paymentDetails.cardLast4}
                            </div>
                        </div>
                    )}
                </div>

                <div className="details-section">
                    <h3>Next Steps</h3>
                    <ul className="next-steps-list">
                        {planContent.nextSteps.map((step, index) => (
                            <li key={index} className="next-step-item">
                                <div className="step-number">{index + 1}</div>
                                <div className="step-text">{step}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="email-notification">
                <div className="email-icon">📧</div>
                <p>
                    We've sent a confirmation email to your registered address with your account details and receipt.
                </p>
            </div>

            <div className="confirmation-actions">
                <button
                    className="action-button primary"
                    onClick={handleGotoDashboard}
                >
                    Go to Dashboard
                    <ChevronRight size={18} />
                </button>

                <button
                    className="action-button secondary"
                    onClick={handleDownloadApp}
                >
                    Download Mobile App
                    <Download size={18} />
                </button>

                <a
                    href="/help-center"
                    className="help-link"
                >
                    Need Help? Visit Support Center
                    <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
};

export default Confirmation; 