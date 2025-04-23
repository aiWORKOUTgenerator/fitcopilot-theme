import React from 'react';
import { Check, X } from 'lucide-react';
import './PricingCard.scss';
import { PlanFeature } from '../types';

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period: string;
  features: PlanFeature[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
}

/**
 * Renders an individual pricing card
 */
export const PricingCard: React.FC<PricingCardProps> = ({ 
  name, 
  description, 
  price, 
  period, 
  features,
  ctaText,
  ctaLink,
  popular = false
}) => {
  return (
    <div className={`pricing-card relative h-full flex flex-col bg-[#151F38] rounded-2xl border ${popular ? 'border-[#CCFF00]' : 'border-gray-800'} overflow-hidden`}>
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-[#CCFF00] text-[#0B1121] text-xs px-4 py-1 font-medium transform rotate-45 translate-x-7 translate-y-4">
            Popular
          </div>
        </div>
      )}
      
      <div className="p-8 flex-grow">
        {/* Plan name */}
        <h3 className="text-2xl font-bold mb-2 text-white">{name}</h3>
        
        {/* Description */}
        <p className="text-gray-400 mb-6">{description}</p>
        
        {/* Price */}
        <div className="mb-8">
          <div className="flex items-end">
            <span className="text-white text-4xl font-bold">
              {price === '0' ? 'Free' : <>${price}</>}
            </span>
            {period !== 'forever' && (
              <span className="text-gray-400 ml-2 pb-1">/{period}</span>
            )}
          </div>
        </div>
        
        {/* Features */}
        <ul className="space-y-4 mb-8">
          {features.map(feature => (
            <li key={feature.id} className="flex items-start">
              {feature.included ? (
                <Check className="shrink-0 h-5 w-5 text-[#CCFF00] mr-3 mt-0.5" />
              ) : (
                <X className="shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              )}
              <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* CTA Button */}
      <div className="px-8 pb-8">
        <a 
          href={ctaLink}
          className={`block text-center py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            popular 
              ? 'bg-[#CCFF00] text-[#0B1121] hover:bg-[#D8FF33]' 
              : 'bg-[#0B1121] text-white border border-gray-700 hover:border-[#CCFF00]'
          }`}
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
}; 