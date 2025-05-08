import { Check, ChevronDown, ChevronUp, Clock, Crown, Shield, Sparkles, Star, Users } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipThemeProvider } from '../../../components/UI/Tooltip';
import './Pricing.scss';
import { PricingProps } from './types';

/**
 * Pricing component - Displays the subscription options with animation and interactive elements
 */
export const Pricing: React.FC<PricingProps> = ({ pricing = [] }) => {
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

  // Default pricing plans if none provided from props
  const defaultPlans = pricing.length > 0 ? pricing : [
    {
      id: 1,
      name: 'Basic',
      description: 'Perfect for getting started with AI workouts',
      price: isYearly ? '0' : '0',
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
      ctaLink: 'https://builder.fitcopilot.ai/register',
      accentColors: 'from-blue-300 to-cyan-400',
      titleTextColors: 'from-lime-300 to-emerald-400',
      priceTextColors: 'from-lime-300 to-emerald-400',
      accentTextColor: 'blue-300',
      badge: 'Starter'
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
      ctaLink: 'https://builder.fitcopilot.ai/register?plan=pro',
      popular: true,
      accentColors: 'from-lime-300 to-emerald-400',
      titleTextColors: 'from-purple-300 to-indigo-400',
      priceTextColors: 'from-purple-300 to-indigo-400',
      accentTextColor: 'lime-300',
      badge: 'Most Popular'
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
      ctaLink: 'https://builder.fitcopilot.ai/register?plan=elite',
      accentColors: 'from-purple-300 to-indigo-400',
      titleTextColors: 'from-lime-300 to-emerald-400',
      priceTextColors: 'from-lime-300 to-emerald-400',
      accentTextColor: 'purple-300',
      badge: 'Premium'
    }
  ];

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

  return (
    <TooltipThemeProvider theme="pricing">
      <section className="pricing-section py-24" id="pricing">
        <div className="container mx-auto px-4 relative">
          {/* Floating particles in background */}
          <div className="price-particles pointer-events-none">
            {renderBackgroundParticles()}
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Simple <span className="text-accent">Pricing</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your fitness journey
            </p>

            {/* Billing toggle */}
            <div className="mt-8 flex items-center justify-center">
              <span className={`mr-4 ${!isYearly ? 'text-white font-semibold' : 'text-gray-400'}`}>
                Monthly
              </span>

              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-surface transition-colors duration-200 ease-in-out focus:outline-none"
                role="switch"
                aria-checked={isYearly}
              >
                <span
                  className={`pointer-events-none block h-6 w-6 transform rounded-full bg-accent shadow-lg ring-0 transition duration-200 ease-in-out ${isYearly ? 'translate-x-7' : 'translate-x-0'}`}
                />
              </button>

              <span className={`ml-4 flex items-center ${isYearly ? 'text-white font-semibold' : 'text-gray-400'}`}>
                Yearly
                <span className="ml-2 text-xs bg-accent text-inverse px-2 py-0.5 rounded-full font-medium">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {defaultPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`pricing-card relative rounded-2xl bg-surface border ${plan.name === 'Basic'
                  ? 'border-blue-300/40 shadow-optimized-blue'
                  : plan.name === 'Pro'
                    ? 'border-lime-300/40 shadow-optimized-lime cursor-pointer'
                    : plan.name === 'Elite'
                      ? 'border-purple-300/40 shadow-optimized-purple'
                      : 'border-gray-700'
                  }`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onMouseEnter={() => handleCardMouseEnter(plan.name)}
                onMouseLeave={() => handleCardMouseLeave(plan.name)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-lime-300 to-emerald-400 rounded-t-xl px-4 py-1 flex items-center justify-center shadow-md">
                    <Star className="w-4 h-4 text-gray-900 mr-1" />
                    <span className="text-xs font-bold text-gray-900">Most Popular</span>
                  </div>
                )}

                {/* Pro Plan Tooltip */}
                {plan.name === 'Pro' && (
                  <Tooltip
                    isVisible={showBetaTooltip}
                    content="Provide feedback directly to our development team and help shape the future of FitCopilot."
                    position="top"
                    title="Beta Release Offer"
                    titleColor="text-lime-300"
                    icon={<Shield className="w-5 h-5 text-lime-300" aria-hidden="true" />}
                    planType="pro"
                    id="pro-tooltip"
                    showOnHover={false}
                  >
                    <div></div> {/* Empty div as child since we're controlling visibility externally */}
                  </Tooltip>
                )}

                {/* Elite Plan Tooltip */}
                {plan.name === 'Elite' && (
                  <Tooltip
                    isVisible={showEliteTooltip}
                    content="Work with real certified trainers who will optimize your plan using both their fitness expertise and AI tools."
                    position="top"
                    title="Certified Trainers"
                    titleColor="text-purple-300"
                    icon={<Users className="w-5 h-5 text-purple-300" aria-hidden="true" />}
                    planType="elite"
                    id="elite-tooltip"
                    showOnHover={false}
                  >
                    <div></div> {/* Empty div as child since we're controlling visibility externally */}
                  </Tooltip>
                )}

                <div className="p-6 border-b border-gray-700">
                  {/* Plan badge */}
                  {plan.badge && (
                    <div
                      className={`plan-badge px-3 py-1 rounded-full text-xs mb-4 ${plan.popular
                        ? 'bg-gray-700/50 text-lime-300 border border-lime-300/30 popular-badge'
                        : plan.name === 'Elite'
                          ? 'bg-gray-700/50 text-purple-300 border border-purple-300/30 elite-badge'
                          : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
                        }`}
                      aria-label={`${plan.badge} plan`}
                    >
                      {plan.popular && <Star className="w-3 h-3 mr-1 text-lime-300" aria-hidden="true" />}
                      {plan.name === 'Elite' && <Crown className="w-3 h-3 mr-1 text-purple-300" aria-hidden="true" />}
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan name and icon */}
                  <div className="flex items-center mb-4">
                    <h3 className={`plan-name-gradient bg-gradient-to-r ${plan.titleTextColors || 'from-white to-white'
                      }`}>{plan.name}</h3>
                  </div>

                  {/* Plan price */}
                  <div className="mb-4">
                    {plan.popular ? (
                      // Animated price for Pro plan
                      <div className="min-h-16 flex items-end" aria-live="polite">
                        {animationState === 'normal' && (
                          <div className="flex items-end">
                            <span className={`price price-gradient bg-gradient-to-r ${plan.priceTextColors || 'from-white to-white'}`}>
                              ${plan.price}
                            </span>
                            <span className="text-white ml-2 mb-1 font-medium">/{plan.period}</span>
                          </div>
                        )}

                        {animationState === 'exploding' && (
                          <div className="relative flex items-end">
                            <span className={`price price-gradient bg-gradient-to-r ${plan.priceTextColors || 'from-white to-white'} price-shake price-flash`}>
                              ${plan.price}
                            </span>
                            <span className="text-white ml-2 mb-1 font-medium">/{plan.period}</span>
                            <div className="absolute inset-0 flex items-center justify-start overflow-visible" aria-hidden="true">
                              {renderExplosionParticles()}
                            </div>
                          </div>
                        )}

                        {animationState === 'transitioning' && (
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <span className="text-xl text-white line-through mr-2 price-fade-out" aria-label="Regular price:">${plan.price}</span>
                            </div>
                            <div className="h-10"></div> {/* Placeholder space for the beta price to appear */}
                          </div>
                        )}

                        {animationState === 'betaPrice' && (
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <span className="text-xl text-white line-through mr-2" aria-label="Regular price:">${plan.price}</span>
                              <span className="beta-badge bg-gray-700/50 text-lime-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-lime-300/30 price-fade-in">Beta Offer</span>
                            </div>
                            <div className="flex items-end">
                              <span className={`price price-gradient bg-gradient-to-r ${plan.priceTextColors || 'from-white to-white'} price-zoom-in`} aria-label="Special beta price:">
                                ${plan.betaPrice}
                              </span>
                              <span className="text-white ml-2 mb-1 font-medium price-fade-in">/{plan.period}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular price for other plans
                      <div className="flex items-end">
                        <span className={`price price-gradient bg-gradient-to-r ${plan.priceTextColors || 'from-white to-white'}`}>
                          {plan.price === '0' ? 'Free' : `$${plan.price}`}
                        </span>
                        {plan.period !== 'forever' && (
                          <span className="text-white ml-2 mb-1 font-medium">/{plan.period}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Plan description */}
                  <p className="text-gray-400 mb-1">{plan.description}</p>

                  {/* Hover hint for Pro and Elite plans */}
                  {(plan.name === 'Pro' || plan.name === 'Elite') && (
                    <p className="text-xs text-gray-400 mt-2 italic flex items-center">
                      <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse"></span>
                      Hover for more details
                    </p>
                  )}
                </div>

                {/* Plan features */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold text-white">Features</h4>
                    {plan.features.length > 5 && (
                      <button
                        className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                        onClick={() => toggleFeatures(plan.name)}
                        aria-label={expandedFeatures[plan.name] ? "Show fewer features" : "Show all features"}
                        aria-expanded={expandedFeatures[plan.name]}
                      >
                        {expandedFeatures[plan.name] ?
                          <ChevronUp size={20} aria-hidden="true" /> :
                          <ChevronDown size={20} aria-hidden="true" />
                        }
                      </button>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features.slice(0, expandedFeatures[plan.name] ? plan.features.length : Math.min(5, plan.features.length)).map((feature, i) => (
                      <li
                        key={feature.id}
                        className={`flex items-start transition-all duration-300 ${i >= 5 ? 'animate-fade-in' : ''
                          }`}
                      >
                        {feature.included ? (
                          <Check
                            className={`feature-icon w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${plan.name === 'Basic' ? 'text-blue-300' :
                              plan.name === 'Pro' ? 'text-lime-300' :
                                plan.name === 'Elite' ? 'text-purple-300' :
                                  'text-[#CCFF00]'
                              }`}
                            aria-hidden="true"
                          />
                        ) : (
                          <div className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        )}

                        {feature.tooltip ? (
                          <Tooltip
                            content={feature.tooltip}
                            position="top"
                            width="200px"
                            planType={plan.name === 'Basic' ? 'basic' :
                              plan.name === 'Pro' ? 'pro' :
                                plan.name === 'Elite' ? 'elite' : undefined}
                          >
                            <span className={`${feature.isHighlighted
                              ? 'text-white font-medium feature-text highlighted'
                              : feature.included
                                ? 'text-gray-300 feature-text'
                                : 'text-gray-500 feature-text'
                              }`}
                            >
                              {feature.text}
                            </span>
                          </Tooltip>
                        ) : (
                          <span className={`${feature.isHighlighted
                            ? 'text-white font-medium feature-text highlighted'
                            : feature.included
                              ? 'text-gray-300 feature-text'
                              : 'text-gray-500 feature-text'
                            }`}
                          >
                            {feature.text}
                          </span>
                        )}
                      </li>
                    ))}

                    {!expandedFeatures[plan.name] && plan.features.length > 5 && (
                      <li className="text-xs text-gray-500 pl-8 italic">
                        + {plan.features.length - 5} more features
                      </li>
                    )}
                  </ul>

                  {/* CTA button */}
                  <div className="pt-4 mt-auto">
                    <a
                      href={plan.ctaLink}
                      onClick={plan.popular ? handleProClick : undefined}
                      className={`block text-center py-3 px-6 rounded-lg font-medium transition-all duration-300 ${plan.popular
                        ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 hover:shadow-md hover:shadow-lime-500/20'
                        : plan.name === 'Basic'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md hover:shadow-blue-500/20'
                          : plan.name === 'Elite'
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-md hover:shadow-purple-500/20'
                            : 'bg-[#0B1121] text-white border border-gray-700 hover:border-[#CCFF00]'
                        }`}
                    >
                      {plan.popular ? (
                        <>
                          <span>{plan.ctaText}</span>
                          <Sparkles className="w-4 h-4 ml-2 inline-block" aria-hidden="true" />
                        </>
                      ) : (
                        <span>{plan.ctaText}</span>
                      )}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center cta-area mt-16">
            <div className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-800/70 border border-gray-700">
              <Clock className="w-5 h-5 text-accent mr-3" aria-hidden="true" />
              <span className="text-gray-300">Limited time <span className="text-white font-medium">beta pricing</span> available during our launch phase.</span>
            </div>
          </div>

          <div className="text-center cta-area mt-8">
            <p className="text-gray-400">
              Need a custom solution for your team or gym? <a href="#contact" className="text-accent hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      </section>
    </TooltipThemeProvider>
  );
};

export default Pricing; 