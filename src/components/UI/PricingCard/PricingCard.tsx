import { Check, X } from 'lucide-react';
import React from 'react';
import './PricingCard.scss';
import { PricingCardProps } from './types';

/**
 * Reusable pricing card component for displaying pricing information
 * Can be used in both Homepage and Registration flows
 */
export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  description,
  price,
  period,
  features,
  ctaText,
  ctaLink,
  onClick,
  popular = false
}) => {
  // Handle the CTA button click
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className={`pricing-card relative h-full flex flex-col rounded-2xl border ${popular ? 'border-lime-400 popular' : 'border-gray-800'} overflow-hidden`}>
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="popular-badge bg-lime-400 text-dark text-xs px-4 py-1 font-medium transform rotate-45 translate-x-7 translate-y-4">
            Popular
          </div>
        </div>
      )}

      <div className="p-8 flex-grow">
        {/* Plan name */}
        <h3 className="plan-name text-white mb-2">{name}</h3>

        {/* Description */}
        <p className="text-gray-400 mb-6">{description}</p>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-end">
            <span className="price text-white">
              {price === '0' ? 'Free' : <>${price}</>}
            </span>
            {period !== 'forever' && (
              <span className="text-gray-400 ml-2 pb-1">/{period}</span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="pricing-feature-list mb-8">
          {features.map(feature => (
            <li key={feature.id}>
              {feature.renderFeature ? (
                feature.renderFeature()
              ) : (
                <div className="flex items-start">
                  {feature.included ? (
                    <Check className="feature-icon shrink-0 h-5 w-5 text-lime-400 mr-3 mt-0.5" />
                  ) : (
                    <X className="shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  )}
                  <span className={`feature-text ${feature.included ? 'text-gray-300' : 'text-gray-500'} ${feature.isHighlighted ? 'highlighted' : ''}`}>
                    {feature.text}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="px-8 pb-8">
        {ctaLink ? (
          <a
            href={ctaLink}
            onClick={handleClick}
            className={`block text-center py-3 px-6 rounded-lg font-medium ${popular
              ? 'bg-lime-400 text-dark hover:bg-lime-300'
              : 'bg-dark text-white border border-gray-700 hover:border-lime-400'
            }`}
          >
            {ctaText}
          </a>
        ) : (
          <button
            onClick={handleClick}
            className={`w-full text-center py-3 px-6 rounded-lg font-medium ${popular
              ? 'bg-lime-400 text-dark hover:bg-lime-300'
              : 'bg-dark text-white border border-gray-700 hover:border-lime-400'
            }`}
          >
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
}; 