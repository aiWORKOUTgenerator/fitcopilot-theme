// Import React hooks
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Check, Star, ChevronDown, ChevronUp, Crown, Sparkles, Clock, Shield, Users } from 'lucide-react';
import './Pricing.css';

interface PlanFeature {
  text: string;
  isHighlighted?: boolean;
  tooltip?: string;
}

interface Plan {
  name: string;
  price: string;
  betaPrice?: string;
  description: string;
  features: PlanFeature[];
  isPopular: boolean;
  accentColors: string;
  titleTextColors: string;
  priceTextColors: string;
  accentTextColor: string;
  icon: React.ReactNode;
  badge?: string;
  ctaText: string;
  ctaLink?: string;
}

const PricingPreview = () => {
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
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // If user prefers reduced motion, just show beta price without animation
      setAnimationState('betaPrice');
      return;
    }
    
    // Start animation sequence
    const startAnimation = () => {
      // Show regular price
      setAnimationState('normal');
      
      // After delay, start explosion
      const explodeTimer = window.setTimeout(() => {
        setAnimationState('exploding');
      }, 2000);
      
      // After explosion, prepare for fade transition
      const prepTransitionTimer = window.setTimeout(() => {
        setAnimationState('transitioning');
      }, 3000);
      
      // After short transition, show beta price
      const betaPriceTimer = window.setTimeout(() => {
        setAnimationState('betaPrice');
      }, 3500);
      
      // Reset to beginning after showing beta price for a while
      const resetTimer = window.setTimeout(() => {
        startAnimation(); // Restart the sequence
      }, 8500);
      
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
    
    // Can also add analytics tracking or other actions
    console.log('Pro plan selected');
  };

  const toggleFeatures = (planName: string) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [planName]: !prev[planName]
    }));
  };

  // Function to generate explosion particles - OPTIMIZED with fewer particles
  const renderExplosionParticles = () => {
    const particles = [];
    // Reduce particle count from 20 to 10 for better performance
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
      // Create dynamic particle styles with optimized values
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80; // Reduced max distance
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      // Reduced size variation for better performance
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

  const plans: Plan[] = [
    {
      name: 'Basic',
      price: '$9.99',
      description: 'Perfect for beginners starting their fitness journey',
      icon: null,
      accentColors: 'from-blue-300 to-cyan-400',
      titleTextColors: 'from-lime-300 to-emerald-400',
      priceTextColors: 'from-lime-300 to-emerald-400',
      accentTextColor: 'blue-300',
      badge: 'Starter',
      ctaText: 'Get Started',
      features: [
        { text: 'AI-generated workouts', isHighlighted: true },
        { text: 'Basic workout tracking' },
        { text: 'Limited equipment options' },
        { text: 'Email support' },
        { text: '1 saved workout plan' },
        { text: 'Weekly progress reports' }
      ],
      isPopular: false
    },
    {
      name: 'Pro',
      price: '$19.99',
      betaPrice: '$10',
      description: 'Our most popular plan for serious fitness enthusiasts',
      icon: null,
      accentColors: 'from-lime-300 to-emerald-400',
      titleTextColors: 'from-purple-300 to-indigo-400',
      priceTextColors: 'from-purple-300 to-indigo-400',
      accentTextColor: 'lime-300',
      badge: 'Most Popular',
      ctaText: 'Try Pro Plan',
      features: [
        { text: 'Everything in Basic', isHighlighted: true },
        { text: 'Advanced workout tracking', isHighlighted: true },
        { text: 'Full equipment customization' },
        { text: 'Progress analytics dashboard' },
        { text: 'Multiple Output Formats' },
        { text: 'Priority support' },
        { text: 'Unlimited saved workout plans' },
        { text: 'Earlybird beta feature access' },
        { text: 'Provide direct feedback to our development team', tooltip: 'Help shape the future of AI Workout Generator' }
      ],
      isPopular: true
    },
    {
      name: 'Elite',
      price: '$99.99',
      description: 'Maximize Your Potential with Expert Coaches & AI Mastery',
      icon: null,
      accentColors: 'from-purple-300 to-indigo-400',
      titleTextColors: 'from-lime-300 to-emerald-400',
      priceTextColors: 'from-lime-300 to-emerald-400',
      accentTextColor: 'purple-300',
      badge: 'Premium',
      ctaText: 'Go Elite',
      ctaLink: 'https://buy.stripe.com/aEU28d0OB04091u3cs',
      features: [
        { text: 'Everything in Pro', isHighlighted: true },
        { text: 'Live coaching sessions', isHighlighted: true },
        { text: 'Advanced AI programming' },
        { text: 'Personalized nutrition guidance' },
        { text: 'Advanced analytics and reports' },
        { text: 'Video form checks & feedback' },
        { text: 'Dedicated trainer support' },
        { text: 'Customized workout plan design' },
        { text: 'Direct email: trainers@aiworkoutgenerator.com' }
      ],
      isPopular: false
    }
  ];

  // Remove the useLayoutEffect hook that was causing errors
  useLayoutEffect(() => {
    // No dynamic style insertion needed - animations are now in CSS file
    if (process.env.NODE_ENV === 'development') {
      console.log('Component mounted - animations are loaded from CSS file');
    }
  }, []);

  return (
    <section className="w-full py-24 px-4 bg-gray-900 relative overflow-hidden">
      {/* Background Grid Pattern - Removed (using global grid) */}
      
      {/* Floating particles in background - OPTIMIZED */}
      <div className="price-particles pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
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
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10 text-sharp">
        <div className="text-center mb-12 md:mb-16 pricing-header" data-aos="fade-up">
          <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">Pricing Options</span>
          <h2 id="pricing-heading" className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-white">
            <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text text-gradient" data-text="Exclusive Pricing">
              Exclusive Pricing
            </span> for Beta Users
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto lead">
            Get early access to our AI-powered fitness platform and help shape its future with your valuable feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-y-16 gap-x-4 md:gap-x-8" data-aos="fade-up" data-aos-delay="200" role="list">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`pricing-card relative rounded-2xl backdrop-blur-lg border transition-all duration-500 flex flex-col h-full overflow-visible ${
                plan.name === 'Basic' 
                  ? 'bg-gray-800/80 border-blue-300/40 shadow-optimized-blue transform md:-translate-y-4 md:scale-105 z-10'
                : plan.name === 'Pro'
                  ? 'bg-gray-800/80 border-lime-300/40 shadow-optimized-lime transform md:-translate-y-4 md:scale-105 z-10 cursor-pointer'
                : plan.name === 'Elite'
                  ? 'bg-gray-800/80 border-purple-300/40 shadow-optimized-purple transform md:-translate-y-4 md:scale-105 z-10 cursor-pointer'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
              data-aos="fade-up" 
              data-aos-delay={index * 100 + 300}
              role="listitem"
              aria-label={`${plan.name} plan`}
              onMouseEnter={() => handleCardMouseEnter(plan.name)}
              onMouseLeave={() => handleCardMouseLeave(plan.name)}
            >
              {/* Popular plan badge - keep this but remove redundant border */}
              {plan.isPopular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-lime-300 to-emerald-400 rounded-t-xl px-4 py-1 flex items-center justify-center shadow-md">
                  <Star className="w-4 h-4 text-gray-900 mr-1" />
                  <span className="text-xs font-bold text-gray-900">Most Popular</span>
                </div>
              )}
              
              {/* Pro Plan Tooltip */}
              {plan.name === 'Pro' && (
                <div 
                  className={`plan-tooltip ${
                    showBetaTooltip ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                  }`}
                  role="tooltip"
                  id="pro-tooltip"
                  aria-hidden={!showBetaTooltip}
                >
                  <div className="flex items-start mb-2">
                    <Shield className="w-5 h-5 text-lime-300 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h5 className="font-medium text-lime-300 text-sm">Beta Release Offer</h5>
                      <p className="text-xs text-gray-300 small">
                        Provide feedback directly to our development team and help shape the future of AI Workout Generator.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Elite Plan Tooltip */}
              {plan.name === 'Elite' && (
                <div 
                  className={`plan-tooltip ${
                    showEliteTooltip ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                  }`}
                  role="tooltip"
                  id="elite-tooltip"
                  aria-hidden={!showEliteTooltip}
                >
                  <div className="flex items-start mb-2">
                    <Users className="w-5 h-5 text-purple-300 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h5 className="font-medium text-purple-300 text-sm">Certified Trainers</h5>
                      <p className="text-xs text-gray-300 small">
                        Work with real certified trainers who will optimize your plan using both their fitness expertise and AI tools.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Header with gradient background */}
              <div className={`pricing-header p-6 border-b border-gray-700`}>
                {/* Plan badge */}
                {plan.badge && (
                  <div 
                    className={`plan-badge px-3 py-1 rounded-full text-xs mb-4 ${
                      plan.isPopular 
                        ? 'bg-gray-700/50 text-lime-300 border border-lime-300/30 popular-badge' 
                        : plan.name === 'Elite' 
                          ? 'bg-gray-700/50 text-purple-300 border border-purple-300/30 elite-badge'
                          : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
                    }`}
                    aria-label={`${plan.badge} plan`}
                  >
                    {plan.isPopular && <Star className="w-3 h-3 mr-1 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400" aria-hidden="true" />}
                    {plan.name === 'Elite' && <Crown className="w-3 h-3 mr-1 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400" aria-hidden="true" />}
                    {plan.badge}
                  </div>
                )}
                
                {/* Plan name and icon */}
                <div className="flex items-center mb-4">
                  <h3 className={`plan-name plan-name-gradient bg-gradient-to-r ${
                    plan.name === 'Basic' ? plan.titleTextColors : 
                    plan.name === 'Elite' ? plan.titleTextColors : 
                    plan.name === 'Pro' ? 'from-purple-300 to-indigo-400' : 
                    plan.accentColors
                  }`} data-text={plan.name}>{plan.name}</h3>
                </div>
                
                {/* Plan price */}
                <div className="mb-4">
                  {plan.isPopular ? (
                    // Animated price for Pro plan
                    <div className="min-h-16 flex items-end" aria-live="polite">
                      {animationState === 'normal' && (
                        <div className="flex items-end">
                          <span className={`price price-gradient bg-gradient-to-r from-purple-300 to-indigo-400`} data-text={plan.price}>
                            {plan.price}
                          </span>
                          <span className="text-white ml-2 mb-1 font-medium">/ month</span>
                        </div>
                      )}
                      
                      {animationState === 'exploding' && (
                        <div className="relative flex items-end">
                          <span className="price price-gradient bg-gradient-to-r from-purple-300 to-indigo-400 price-shake price-flash" data-text={plan.price}>
                            {plan.price}
                          </span>
                          <span className="text-white ml-2 mb-1 font-medium">/ month</span>
                          <div className="absolute inset-0 flex items-center justify-start overflow-visible" aria-hidden="true">
                            {renderExplosionParticles()}
                          </div>
                        </div>
                      )}
                      
                      {animationState === 'transitioning' && (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-xl text-white line-through mr-2 price-fade-out" aria-label="Regular price:">{plan.price}</span>
                          </div>
                          <div className="h-10"></div> {/* Placeholder space for the beta price to appear */}
                        </div>
                      )}
                      
                      {animationState === 'betaPrice' && (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-xl text-white line-through mr-2" aria-label="Regular price:">{plan.price}</span>
                            <span className="beta-badge bg-gray-700/50 text-lime-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-lime-300/30 price-fade-in">Beta Offer</span>
                          </div>
                          <div className="flex items-end">
                            <span className={`price price-gradient bg-gradient-to-r from-purple-300 to-indigo-400 price-zoom-in`} data-text={plan.betaPrice} aria-label="Special beta price:">
                              {plan.betaPrice}
                            </span>
                            <span className="text-white ml-2 mb-1 font-medium price-fade-in">/ month</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular price for other plans
                    <div className="flex items-end">
                      <span className={`price price-gradient bg-gradient-to-r ${
                        plan.name === 'Basic' ? plan.priceTextColors : 
                        plan.name === 'Elite' ? plan.priceTextColors : 
                        plan.accentColors
                      }`} data-text={plan.price}>
                        {plan.price}
                      </span>
                      <span className="text-white ml-2 mb-1 font-medium">/ month</span>
                    </div>
                  )}
                </div>
                
                {/* Plan description */}
                <p className="text-gray-100 mb-1">{plan.description}</p>
                
                {/* Hover hint for Pro and Elite plans */}
                {(plan.name === 'Pro' || plan.name === 'Elite') && (
                  <p className="text-xs text-gray-400 mt-2 italic flex items-center">
                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse"></span>
                    <span className="sr-only">Tip:</span>
                    Hover for more details
                  </p>
                )}
              </div>
              
              {/* Plan features */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-white">Features</h4>
                  <button 
                    className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/50"
                    onClick={() => toggleFeatures(plan.name)}
                    aria-label={expandedFeatures[plan.name] ? "Show fewer features" : "Show all features"}
                    aria-expanded={expandedFeatures[plan.name]}
                    type="button"
                  >
                    {expandedFeatures[plan.name] ? 
                      <ChevronUp size={20} aria-hidden="true" /> : 
                      <ChevronDown size={20} aria-hidden="true" />
                    }
                  </button>
                </div>
                
                <ul className="space-y-3 mb-6 flex-grow" role="list" aria-label="Plan features">
                  {plan.features.slice(0, expandedFeatures[plan.name] ? plan.features.length : Math.min(5, plan.features.length)).map((feature, i) => (
                    <li 
                      key={i} 
                      className={`flex items-start transition-all duration-300 ${
                        i >= 5 ? 'animate-fade-in' : ''
                      }`}
                    >
                      <Check className={`feature-icon w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400`} 
                      aria-hidden="true" 
                      />
                      <span className={`${feature.isHighlighted ? 'text-white font-medium feature-text highlighted' : 'text-gray-400 feature-text'} group relative`}>
                        {feature.text}
                        
                        {feature.tooltip && (
                          <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-800 rounded-md shadow-optimized text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                            role="tooltip"
                          >
                            {feature.tooltip}
                            <div className="absolute top-full left-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                          </div>
                        )}
                      </span>
                    </li>
                  ))}
                  
                  {!expandedFeatures[plan.name] && plan.features.length > 5 && (
                    <li className="text-xs text-gray-500 pl-8 italic small">
                      + {plan.features.length - 5} more features
                    </li>
                  )}
                </ul>
              
                {/* CTA button - updated for better touch targets */}
                <div className="pt-4 mt-auto">
                  <button 
                    className={`w-full flex items-center justify-center rounded-lg px-4 py-3 font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 ${
                      plan.name === 'Basic' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md hover:shadow-blue-500/20 active:from-blue-600 active:to-indigo-700 focus-visible:ring-blue-400' 
                      : plan.name === 'Pro'
                        ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 hover:shadow-md hover:shadow-lime-500/20 active:from-lime-500 active:to-emerald-600 focus-visible:ring-lime-400' 
                      : plan.name === 'Elite'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-md hover:shadow-purple-500/20 active:from-purple-600 active:to-indigo-700 focus-visible:ring-purple-400' 
                        : 'bg-gray-700 text-white hover:bg-gray-600 focus-visible:ring-gray-400'
                    }`}
                    onClick={plan.isPopular ? handleProClick : undefined}
                    type="button"
                    aria-label={`${plan.ctaText} for ${plan.name} plan`}
                  >
                    {plan.isPopular ? (
                      <>
                        <span>Get Started</span>
                        <Sparkles className="w-4 h-4 ml-2" aria-hidden="true" />
                      </>
                    ) : (
                      <span>Get Started</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="500">
          <div className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-800/70 border border-gray-700">
            <Clock className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400 mr-3" aria-hidden="true" />
            <span className="text-gray-300">Limited time <span className="text-white font-medium">beta pricing</span> available during our launch phase.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview; 