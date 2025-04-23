import React, { useState } from 'react';
import './Pricing.scss';
import { PricingProps } from './types';
import { PricingCard } from './components/PricingCard';

/**
 * Pricing component - Displays the subscription options
 */
export const Pricing: React.FC<PricingProps> = ({ pricing = [] }) => {
  const [isYearly, setIsYearly] = useState(true);
  
  // Default pricing plans if none provided from props
  const defaultPlans = pricing.length > 0 ? pricing : [
    {
      id: 1,
      name: 'Free',
      description: 'Perfect for getting started with AI workouts',
      price: isYearly ? '0' : '0',
      period: 'forever',
      features: [
        { id: 1, text: '5 AI workouts per month', included: true },
        { id: 2, text: 'Basic exercise library', included: true },
        { id: 3, text: 'Progress tracking', included: true },
        { id: 4, text: 'Advanced analytics', included: false },
        { id: 5, text: 'Custom workout templates', included: false },
        { id: 6, text: 'Personal coach assistance', included: false }
      ],
      ctaText: 'Get Started',
      ctaLink: 'https://builder.fitcopilot.ai/register'
    },
    {
      id: 2,
      name: 'Pro',
      description: 'Advanced features for dedicated fitness enthusiasts',
      price: isYearly ? '79' : '9.99',
      period: isYearly ? 'year' : 'month',
      features: [
        { id: 1, text: 'Unlimited AI workouts', included: true },
        { id: 2, text: 'Full exercise library', included: true },
        { id: 3, text: 'Progress tracking', included: true },
        { id: 4, text: 'Advanced analytics', included: true },
        { id: 5, text: 'Custom workout templates', included: true },
        { id: 6, text: 'Personal coach assistance', included: false }
      ],
      ctaText: 'Upgrade Now',
      ctaLink: 'https://builder.fitcopilot.ai/register?plan=pro',
      popular: true
    },
    {
      id: 3,
      name: 'Elite',
      description: 'The ultimate fitness experience with personal coaching',
      price: isYearly ? '199' : '19.99',
      period: isYearly ? 'year' : 'month',
      features: [
        { id: 1, text: 'Unlimited AI workouts', included: true },
        { id: 2, text: 'Full exercise library', included: true },
        { id: 3, text: 'Progress tracking', included: true },
        { id: 4, text: 'Advanced analytics', included: true },
        { id: 5, text: 'Custom workout templates', included: true },
        { id: 6, text: 'Personal coach assistance', included: true }
      ],
      ctaText: 'Get Elite Access',
      ctaLink: 'https://builder.fitcopilot.ai/register?plan=elite'
    }
  ];

  return (
    <section className="pricing-section py-24 bg-[#0B1121]" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Simple <span className="text-[#CCFF00]">Pricing</span>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {defaultPlans.map(plan => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              ctaText={plan.ctaText}
              ctaLink={plan.ctaLink}
              popular={plan.popular}
            />
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-gray-400">
            Need a custom solution for your team or gym? <a href="#contact" className="text-[#CCFF00] hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 