import { Quote } from 'lucide-react';
import React from 'react';
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
  avatar
}) => {
  return (
    <div className="testimonial-card bg-gray-800/70 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 transition-all duration-300 group">
      {/* Quote icon */}
      <Quote size={32} className="testimonial-quote mb-3 text-[#CCFF00]" />

      {/* Quote */}
      <p className="text-gray-300 italic mb-6">"{quote}"</p>

      {/* Author */}
      <div className="flex items-center">
        <div className="mr-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full testimonial-image" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#64D2B9] flex items-center justify-center text-[#0B1121] font-bold text-lg testimonial-image">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-white group-hover:text-[#CCFF00] transition-colors">{name}</h4>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
}; 