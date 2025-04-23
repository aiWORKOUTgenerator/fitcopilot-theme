import React from 'react';
import { Star } from 'lucide-react';
import './TestimonialCard.scss';

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  rating?: number;
}

/**
 * Renders an individual testimonial card
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  name, 
  role, 
  quote, 
  avatar,
  rating = 5
}) => {
  // Generate rating stars
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index}
        size={16}
        className={`${index < rating ? 'text-[#CCFF00] fill-[#CCFF00]' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="testimonial-card bg-[#0B1121] p-8 rounded-2xl border border-gray-800">
      {/* Rating */}
      <div className="flex mb-6">
        {renderStars()}
      </div>
      
      {/* Quote */}
      <blockquote className="mb-6">
        <p className="text-gray-300 text-lg leading-relaxed italic">
          "{quote}"
        </p>
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center">
        <div className="testimonial-card__avatar">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#64D2B9] flex items-center justify-center text-[#0B1121] font-bold text-lg">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="ml-4">
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
}; 