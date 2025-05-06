import { Check, ChevronDown, ChevronUp, Clock, Crown, Shield, Star, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { PricingCard } from '../../../components/UI/PricingCard';
import { useNavigation } from '../context/NavigationContext';
import { useRegistrationData } from '../hooks';
import { RegistrationStepId, RegistrationStepProps } from '../types';
import './Pricing.scss';

/**
 * Pricing component in the registration flow
 * 
 * This component has been fully integrated with the NavigationContext system and displays
 * different pricing plan options to the user:
 * 
 * - Basic: Free tier with limited features
 * - Pro: Premium tier with most features
 * - Elite: Top tier with all features and coaching
 * 
 * The component handles transitions from Journey step and properly validates/completes
 * both the Journey and Pricing steps to ensure correct navigation flow.
 * 
 * When a plan is selected, the data is stored in the registration data object
 * using the standardized structure of the RegistrationData interface.
 */
const PricingComponent: React.FC<RegistrationStepProps & { onComplete?: () => void }> = ({
    data,
    updateData,
    onNext,
    onBack,
    onComplete,
    className = '',
}) => {
    const [isYearly, setIsYearly] = useState(true);
    const [animationState, setAnimationState] = useState<'normal' | 'exploding' | 'transitioning' | 'betaPrice'>('normal');
    const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
    const [showBetaTooltip, setShowBetaTooltip] = useState(false);
    const [showEliteTooltip, setShowEliteTooltip] = useState(false);

    // Animation timeline references
    const timeoutsRef = useRef<number[]>([]);

    // Clear all timeouts on cleanup
    const clearAllTimeouts = () => {
        timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
        timeoutsRef.current = [];
    };

    // Animation loop effect for price change
    useEffect(() => {
        // Start animation sequence
        const startAnimation = () => {
            // Show regular price
            setAnimationState('normal');

            // After delay, start explosion
            const explodeTimer = window.setTimeout(() => {
                setAnimationState('exploding');
            }, 5000);

            // After explosion, prepare for fade transition
            const prepTransitionTimer = window.setTimeout(() => {
                setAnimationState('transitioning');
            }, 6000);

            // After short transition, show beta price
            const betaPriceTimer = window.setTimeout(() => {
                setAnimationState('betaPrice');
            }, 6500);

            // Reset to beginning after showing beta price for a while
            const resetTimer = window.setTimeout(() => {
                startAnimation(); // Restart the sequence
            }, 12000);

            timeoutsRef.current.push(explodeTimer, prepTransitionTimer, betaPriceTimer, resetTimer);

            return () => {
                clearTimeout(explodeTimer);
                clearTimeout(prepTransitionTimer);
                clearTimeout(betaPriceTimer);
                clearTimeout(resetTimer);
            };
        };

        // Start the animation loop
        const cleanup = startAnimation();
        return () => {
            cleanup();
            clearAllTimeouts();
        };
    }, []);

    // Handlers for card hover effects
    const handleCardMouseEnter = (planName: string) => {
        if (planName === 'Pro') {
            setShowBetaTooltip(true);
        } else if (planName === 'Elite') {
            setShowEliteTooltip(true);
        }
    };

    const handleCardMouseLeave = (planName: string) => {
        if (planName === 'Pro') {
            setShowBetaTooltip(false);
        } else if (planName === 'Elite') {
            setShowEliteTooltip(false);
        }
    };

    // Handle Pro Plan click with animation sequence
    const handleProClick = () => {
        if (animationState === 'normal') {
            // Start animation sequence
            setAnimationState('exploding');
            window.setTimeout(() => {
                setAnimationState('transitioning');
                window.setTimeout(() => {
                    setAnimationState('betaPrice');
                }, 500);
            }, 1000);
        } else {
            // Reset to normal if clicked again
            setAnimationState('normal');
        }
    };

    const toggleFeatures = (planName: string) => {
        setExpandedFeatures(prev => ({
            ...prev,
            [planName]: !prev[planName]
        }));
    };

    // Function to generate explosion particles
    const renderExplosionParticles = () => {
        const particles = [];
        const particleCount = 10;

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 80;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const size = Math.random() * 4 + 2;

            particles.push(
                <div
                    key={i}
                    className="price-particle"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: '50%',
                        top: '50%',
                        opacity: 0,
                        transform: 'translate(-50%, -50%)',
                        '--tx': `${x}px`,
                        '--ty': `${y}px`
                    } as React.CSSProperties}
                />
            );
        }

        return particles;
    };

    // Handle selection of free plan
    const handleSelectFreePlan = () => {
        // Update registration data to indicate free plan selection
        updateData({
            ...data,
            selectedPlan: 'free',
            paymentDetails: {
                type: 'free'
            }
        });

        // Proceed with completion or next step
        if (onComplete) {
            onComplete();
        } else if (onNext) {
            onNext();
        }
    };

    // Handle selection of pro plan
    const handleSelectProPlan = () => {
        // Update registration data to indicate pro plan selection
        updateData({
            ...data,
            selectedPlan: 'pro',
            paymentDetails: {
                type: 'paid',
                plan: isYearly ? 'yearly' : 'monthly',
                amount: isYearly ? (animationState === 'betaPrice' ? '59' : '79') : (animationState === 'betaPrice' ? '6.99' : '9.99')
            }
        });

        // Proceed with completion or next step
        if (onComplete) {
            onComplete();
        } else if (onNext) {
            onNext();
        }
    };

    // Handle selection of elite plan
    const handleSelectElitePlan = () => {
        // Update registration data to indicate elite plan selection
        updateData({
            ...data,
            selectedPlan: 'elite',
            paymentDetails: {
                type: 'premium',
                plan: isYearly ? 'yearly' : 'monthly',
                amount: isYearly ? '199' : '19.99'
            }
        });

        // Proceed with completion or next step
        if (onComplete) {
            onComplete();
        } else if (onNext) {
            onNext();
        }
    };

    // Floating particles in background
    const renderBackgroundParticles = () => {
        return Array.from({ length: 12 }).map((_, i) => (
            <div
                key={i}
                className="price-particle"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${Math.random() * 8 + 10}s`
                }}
            />
        ));
    };

    // Define the pricing plans
    const pricingPlans = [
        {
            id: 1,
            name: 'Basic',
            description: 'Perfect for getting started with AI workouts',
            price: '0',
            period: 'forever',
            features: [
                { id: 1, text: '5 AI workouts per month', included: true, isHighlighted: true },
                { id: 2, text: 'Basic exercise library', included: true },
                { id: 3, text: 'Progress tracking', included: true },
                { id: 4, text: 'Advanced analytics', included: false },
                { id: 5, text: 'Custom workout templates', included: false },
                { id: 6, text: 'Personal coach assistance', included: false }
            ],
            ctaText: 'Get Started',
            onClick: handleSelectFreePlan,
            accentColors: 'from-blue-300 to-cyan-400',
            titleTextColors: 'from-lime-300 to-emerald-400',
            priceTextColors: 'from-lime-300 to-emerald-400',
            accentTextColor: 'blue-300',
            badge: 'Starter',
            icon: <Shield className="h-6 w-6 text-blue-300" />
        },
        {
            id: 2,
            name: 'Pro',
            description: 'Advanced features for dedicated fitness enthusiasts',
            price: isYearly ? '79' : '9.99',
            betaPrice: isYearly ? '59' : '6.99',
            period: isYearly ? 'year' : 'month',
            features: [
                { id: 1, text: 'Unlimited AI workouts', included: true, isHighlighted: true },
                { id: 2, text: 'Full exercise library', included: true },
                { id: 3, text: 'Progress tracking', included: true },
                { id: 4, text: 'Advanced analytics', included: true, isHighlighted: true },
                { id: 5, text: 'Custom workout templates', included: true },
                { id: 6, text: 'Multiple format exports', included: true },
                { id: 7, text: 'Priority support', included: true },
                { id: 8, text: 'Earlybird beta features', included: true, tooltip: 'Get access to new features before they are released to the public' },
                { id: 9, text: 'Personal coach assistance', included: false }
            ],
            ctaText: 'Upgrade Now',
            onClick: handleSelectProPlan,
            popular: true,
            accentColors: 'from-lime-300 to-emerald-400',
            titleTextColors: 'from-purple-300 to-indigo-400',
            priceTextColors: 'from-purple-300 to-indigo-400',
            accentTextColor: 'lime-300',
            badge: 'Most Popular',
            icon: <Star className="h-6 w-6 text-lime-300" />
        },
        {
            id: 3,
            name: 'Elite',
            description: 'The ultimate fitness experience with personal coaching',
            price: isYearly ? '199' : '19.99',
            period: isYearly ? 'year' : 'month',
            features: [
                { id: 1, text: 'Everything in Pro', included: true, isHighlighted: true },
                { id: 2, text: 'Live coaching sessions', included: true, isHighlighted: true },
                { id: 3, text: 'Advanced AI programming', included: true },
                { id: 4, text: 'Personalized nutrition guidance', included: true },
                { id: 5, text: 'Video form checks & feedback', included: true },
                { id: 6, text: 'Dedicated trainer support', included: true },
                { id: 7, text: 'Customized workout plan design', included: true },
                { id: 8, text: 'Direct trainer email support', included: true, tooltip: 'Get direct access to certified fitness trainers via email' }
            ],
            ctaText: 'Get Elite Access',
            onClick: handleSelectElitePlan,
            accentColors: 'from-purple-300 to-indigo-400',
            titleTextColors: 'from-lime-300 to-emerald-400',
            priceTextColors: 'from-lime-300 to-emerald-400',
            accentTextColor: 'purple-300',
            badge: 'Premium',
            icon: <Crown className="h-6 w-6 text-purple-300" />
        }
    ];

    return (
        <section className={`pricing-section py-24 bg-[#0B1121] ${className}`}>
            <div className="container mx-auto px-4 relative">
                {/* Floating particles in background */}
                <div className="price-particles pointer-events-none">
                    {renderBackgroundParticles()}
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-white">
                        Choose Your <span className="text-[#CCFF00]">Plan</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Select the plan that works best for your fitness goals. All plans include access to our AI workout generator.
                    </p>

                    {/* Billing toggle */}
                    <div className="mt-8 flex items-center justify-center">
                        <span className={`mr-4 ${!isYearly ? 'text-white font-semibold' : 'text-gray-400'}`}>
                            Monthly
                        </span>

                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#151F38] transition-colors duration-200 ease-in-out focus:outline-none"
                            role="switch"
                            aria-checked={isYearly}
                        >
                            <span
                                className={`pointer-events-none block h-6 w-6 transform rounded-full bg-[#CCFF00] shadow-lg ring-0 transition duration-200 ease-in-out ${isYearly ? 'translate-x-7' : 'translate-x-0'}`}
                            />
                        </button>

                        <span className={`ml-4 flex items-center ${isYearly ? 'text-white font-semibold' : 'text-gray-400'}`}>
                            Yearly
                            <span className="ml-2 text-xs bg-[#CCFF00] text-[#0B1121] px-2 py-0.5 rounded-full font-medium">
                                Save 20%
                            </span>
                        </span>
                    </div>
                </div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Basic Plan */}
                    <div
                        className="pricing-card-wrapper relative"
                        onMouseEnter={() => handleCardMouseEnter('Basic')}
                        onMouseLeave={() => handleCardMouseLeave('Basic')}
                    >
                        <div className="card-icon-wrapper absolute -top-5 left-8 z-10">
                            <div className={`p-3 rounded-full bg-gradient-to-br ${pricingPlans[0].accentColors}`}>
                                <Shield className="h-6 w-6 text-black" />
                            </div>
                        </div>

                        <PricingCard
                            name={pricingPlans[0].name}
                            description={pricingPlans[0].description}
                            price={pricingPlans[0].price}
                            period={pricingPlans[0].period}
                            features={pricingPlans[0].features.map(feature => ({
                                ...feature,
                                renderFeature: () => (
                                    <div className="flex items-start">
                                        <div className="relative mr-3 mt-0.5">
                                            {feature.included ? (
                                                <>
                                                    <div className="bg-gray-800/70 p-1 rounded-lg">
                                                        <Check className="h-3 w-3 text-blue-300" />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-300 rounded-full flex items-center justify-center">
                                                        <Check size={10} className="text-gray-900" />
                                                    </div>
                                                </>
                                            ) : (
                                                <X className="h-5 w-5 text-gray-500" />
                                            )}
                                        </div>
                                        <span className={`${feature.isHighlighted ? 'text-white font-medium' : feature.included ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {feature.text}
                                        </span>
                                    </div>
                                )
                            }))}
                            ctaText={pricingPlans[0].ctaText}
                            onClick={handleSelectFreePlan}
                        />

                        {/* View all features toggle */}
                        <button
                            className="toggle-features mt-4 text-gray-400 flex items-center text-sm hover:text-white"
                            onClick={() => toggleFeatures('Basic')}
                        >
                            {expandedFeatures['Basic'] ? (
                                <>
                                    <span>Hide details</span>
                                    <ChevronUp className="h-4 w-4 ml-1" />
                                </>
                            ) : (
                                <>
                                    <span>View details</span>
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div
                        className="pricing-card-wrapper relative"
                        onMouseEnter={() => handleCardMouseEnter('Pro')}
                        onMouseLeave={() => handleCardMouseLeave('Pro')}
                        onClick={handleProClick}
                    >
                        <div className="card-icon-wrapper absolute -top-5 left-8 z-10">
                            <div className={`p-3 rounded-full bg-gradient-to-br ${pricingPlans[1].accentColors}`}>
                                <Star className="h-6 w-6 text-black" />
                            </div>
                        </div>

                        <div className="relative">
                            {/* Price explosion animation */}
                            {animationState === 'exploding' && (
                                <div className="explosion-container absolute inset-0 pointer-events-none">
                                    {renderExplosionParticles()}
                                </div>
                            )}

                            <PricingCard
                                name={pricingPlans[1].name}
                                description={pricingPlans[1].description}
                                price={animationState === 'betaPrice' ? (isYearly ? '59' : '6.99') : (isYearly ? '79' : '9.99')}
                                period={pricingPlans[1].period}
                                features={pricingPlans[1].features.map(feature => ({
                                    ...feature,
                                    renderFeature: () => (
                                        <div className="flex items-start">
                                            <div className="relative mr-3 mt-0.5">
                                                {feature.included ? (
                                                    <>
                                                        <div className="bg-gray-800/70 p-1 rounded-lg">
                                                            <Check className="h-3 w-3 text-lime-300" />
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-lime-300 rounded-full flex items-center justify-center">
                                                            <Check size={10} className="text-gray-900" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <X className="h-5 w-5 text-gray-500" />
                                                )}
                                            </div>
                                            <span className={`${feature.isHighlighted ? 'text-white font-medium' : feature.included ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    )
                                }))}
                                ctaText={pricingPlans[1].ctaText}
                                onClick={handleSelectProPlan}
                                popular={true}
                            />

                            {/* Beta tooltip */}
                            {showBetaTooltip && animationState === 'betaPrice' && (
                                <div className="beta-tooltip absolute -top-10 left-1/2 transform -translate-x-1/2 bg-lime-400 text-black text-sm px-3 py-1 rounded">
                                    Early bird pricing!
                                </div>
                            )}
                        </div>

                        {/* View all features toggle */}
                        <button
                            className="toggle-features mt-4 text-gray-400 flex items-center text-sm hover:text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFeatures('Pro');
                            }}
                        >
                            {expandedFeatures['Pro'] ? (
                                <>
                                    <span>Hide details</span>
                                    <ChevronUp className="h-4 w-4 ml-1" />
                                </>
                            ) : (
                                <>
                                    <span>View details</span>
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Elite Plan */}
                    <div
                        className="pricing-card-wrapper relative"
                        onMouseEnter={() => handleCardMouseEnter('Elite')}
                        onMouseLeave={() => handleCardMouseLeave('Elite')}
                    >
                        <div className="card-icon-wrapper absolute -top-5 left-8 z-10">
                            <div className={`p-3 rounded-full bg-gradient-to-br ${pricingPlans[2].accentColors}`}>
                                <Crown className="h-6 w-6 text-black" />
                            </div>
                        </div>

                        <PricingCard
                            name={pricingPlans[2].name}
                            description={pricingPlans[2].description}
                            price={pricingPlans[2].price}
                            period={pricingPlans[2].period}
                            features={pricingPlans[2].features.map(feature => ({
                                ...feature,
                                renderFeature: () => (
                                    <div className="flex items-start">
                                        <div className="relative mr-3 mt-0.5">
                                            {feature.included ? (
                                                <>
                                                    <div className="bg-gray-800/70 p-1 rounded-lg">
                                                        <Check className="h-3 w-3 text-purple-300" />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-300 rounded-full flex items-center justify-center">
                                                        <Check size={10} className="text-gray-900" />
                                                    </div>
                                                </>
                                            ) : (
                                                <X className="h-5 w-5 text-gray-500" />
                                            )}
                                        </div>
                                        <span className={`${feature.isHighlighted ? 'text-white font-medium' : feature.included ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {feature.text}
                                        </span>
                                    </div>
                                )
                            }))}
                            ctaText={pricingPlans[2].ctaText}
                            onClick={handleSelectElitePlan}
                        />

                        {/* Elite tooltip */}
                        {showEliteTooltip && (
                            <div className="elite-tooltip absolute -top-10 right-4 bg-purple-300 text-black text-sm px-3 py-1 rounded">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>Live Training</span>
                                </div>
                            </div>
                        )}

                        {/* View all features toggle */}
                        <button
                            className="toggle-features mt-4 text-gray-400 flex items-center text-sm hover:text-white"
                            onClick={() => toggleFeatures('Elite')}
                        >
                            {expandedFeatures['Elite'] ? (
                                <>
                                    <span>Hide details</span>
                                    <ChevronUp className="h-4 w-4 ml-1" />
                                </>
                            ) : (
                                <>
                                    <span>View details</span>
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Money-back guarantee */}
                <div className="text-center mt-12">
                    <p className="text-gray-400 text-sm flex items-center justify-center">
                        <Shield className="h-4 w-4 mr-2 text-lime-400" />
                        30-day money-back guarantee. No questions asked.
                    </p>
                </div>

                {/* Back button */}
                <div className="text-center mt-8">
                    <button
                        onClick={onBack}
                        className="text-gray-400 hover:text-white py-2 px-4 rounded-md"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </section>
    );
};

/**
 * Pricing component that integrates with the NavigationContext
 * 
 * This component wraps the PricingComponent and provides NavigationContext integration:
 * - Handles step transitions (next/previous)
 * - Manages step completion status
 * - Ensures proper Journey step completion when transitioning
 * - Validates the Pricing step to enable forward navigation
 */
const Pricing: React.FC = () => {
    // Get navigation context
    const {
        state,
        nextStep,
        previousStep,
        goToStep,
        dispatch
    } = useNavigation();

    // Check if this step is active
    const isActive = state.currentStep === RegistrationStepId.PRICING;

    // Get registration data
    const { data, updateData } = useRegistrationData();

    // Check if Journey step is completed when component mounts
    useEffect(() => {
        if (isActive) {
            // Ensure Journey step is marked as completed
            const isJourneyCompleted = state.completedSteps.has(RegistrationStepId.JOURNEY);

            // If Journey step is not marked as completed yet, mark it
            if (!isJourneyCompleted) {
                console.log('Marking Journey step as completed from Pricing');
                dispatch({ type: 'COMPLETE_STEP', payload: { stepId: RegistrationStepId.JOURNEY } });
            }
        }
    }, [isActive, state.completedSteps, dispatch]);

    // Handle completion
    const handleComplete = () => {
        // Mark current step as completed
        dispatch({ type: 'COMPLETE_STEP', payload: { stepId: RegistrationStepId.PRICING } });

        // Navigate to the next step
        nextStep();
    };

    // Handle going back
    const handleBack = () => {
        previousStep();
    };

    // Early return if not active
    if (!isActive) {
        return null;
    }

    return (
        <PricingComponent
            data={data}
            updateData={updateData}
            onNext={handleComplete}
            onBack={handleBack}
            className="pricing-step"
        />
    );
};

export default Pricing; 