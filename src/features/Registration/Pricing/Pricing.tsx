import { ArrowRight, Check, Shield, Sparkles, Zap } from 'lucide-react';
import React from 'react';
import { useRegistrationData } from '../hooks';
import { RegistrationStepProps } from '../types';
import './Pricing.scss';

/**
 * Pricing page component that displays subscription options in the registration flow
 */
const PricingComponent: React.FC<RegistrationStepProps & { onComplete?: () => void }> = ({
    data,
    updateData,
    onNext,
    onBack,
    onComplete,
    className = '',
}) => {
    // Handle complete registration with free plan
    const handleComplete = () => {
        if (onComplete) {
            // Update registration data to indicate free plan selection
            updateData({
                ...data,
                selectedPlan: 'free',
                subscriptionType: 'free'
            });

            // Trigger completion callback
            onComplete();
        } else if (onNext) {
            // If there's no completion callback, move to next step
            onNext();
        }
    };

    // Handle selection of paid subscription
    const handleSelectPaidPlan = () => {
        // Update registration data to indicate paid plan selection
        updateData({
            ...data,
            selectedPlan: 'pro',
            subscriptionType: 'paid'
        });

        // Move to payment processing or completion
        if (onComplete) {
            onComplete();
        } else if (onNext) {
            onNext();
        }
    };

    return (
        <div className={`pricing-step registration-step ${className}`}>
            {/* Background animation with particles */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0">
                <div className="particles-container">
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                    <div className="particle particle-4"></div>
                    <div className="particle particle-5"></div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto relative z-20 px-4 py-8">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Upgrade to <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">Premium</span>
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-lime-300 to-emerald-400 mx-auto mb-6 rounded-full"></div>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                        Get unlimited workout plans and advanced features for optimal fitness results
                    </p>
                </div>

                {/* Pricing plan card */}
                <div className="max-w-lg mx-auto mb-12 animate-fade-in-up">
                    <div className="pricing-card bg-gray-800/50 border border-gray-700 backdrop-blur-lg rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:border-lime-500/30">
                        <div className="bg-gradient-to-r from-lime-500/20 to-emerald-500/20 text-white p-1 text-center">
                            <span className="text-xs font-semibold uppercase tracking-wider">Limited Time Offer</span>
                        </div>

                        <div className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-white">Premium Plan</h3>
                                <div className="bg-gradient-to-r from-lime-300 to-emerald-400 text-gray-900 text-xs font-bold uppercase px-3 py-1 rounded-full">
                                    Best Value
                                </div>
                            </div>

                            <div className="flex items-end mb-6">
                                <span className="text-4xl font-bold text-white">$6.99</span>
                                <span className="text-gray-400 ml-2 mb-1">/month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300">Unlimited AI workout generation</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300">Advanced progress tracking tools</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300">Personalized nutrition guidance</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300">Export and share your workouts</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300">Early access to new features</span>
                                </li>
                            </ul>

                            <button
                                className="w-full py-4 rounded-full font-bold transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-lg shadow-lime-300/30 hover:shadow-xl hover:shadow-lime-300/40 hover:-translate-y-1 flex items-center justify-center"
                                onClick={handleSelectPaidPlan}
                            >
                                Upgrade Now <ArrowRight className="ml-2 h-5 w-5" />
                            </button>

                            <div className="text-gray-500 text-xs text-center mt-3">
                                Cancel anytime. No hidden fees.
                            </div>
                        </div>
                    </div>
                </div>

                {/* No Thanks CTA */}
                <div className="text-center animate-fade-in-up">
                    <button
                        className="px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white flex items-center justify-center mx-auto"
                        onClick={handleComplete}
                    >
                        No Thank You, Generate Workout
                    </button>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-10 animate-fade-in-up">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Zap className="h-6 w-6 text-lime-300" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">
                            Premium Algorithms
                        </h3>
                        <p className="text-gray-400">
                            Access our most advanced AI models for optimal workout design
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Shield className="h-6 w-6 text-lime-300" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">
                            Priority Support
                        </h3>
                        <p className="text-gray-400">
                            Get help when you need it with dedicated customer service
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Sparkles className="h-6 w-6 text-lime-300" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-2">
                            Early Access
                        </h3>
                        <p className="text-gray-400">
                            Be the first to try new features and improvements
                        </p>
                    </div>
                </div>

                {/* Navigation buttons */}
                <div className="navigation-container mt-12 text-center">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="inline-flex items-center px-6 py-3 mr-4 rounded-full border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-all"
                            aria-label="Go back to previous step"
                        >
                            Back
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Standalone pricing page that can be accessed directly
 */
const Pricing: React.FC = () => {
    // Get registration state and handlers from hooks
    const { data, updateData } = useRegistrationData();

    // Handle completion of the registration flow
    const handleComplete = () => {
        // Redirect to the workout generation or dashboard
        window.location.href = '/dashboard';
    };

    // Navigation handler (not used in standalone but required for component)
    const handleNext = () => { };

    // Navigation handler (not used in standalone but required for component)
    const handleBack = () => {
        // Go back to previous page
        window.history.back();
    };

    return (
        <PricingComponent
            data={data}
            updateData={updateData}
            onNext={handleNext}
            onBack={handleBack}
            onComplete={handleComplete}
        />
    );
};

export default Pricing; 