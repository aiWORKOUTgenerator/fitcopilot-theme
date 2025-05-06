import { Quote } from 'lucide-react';
import React from 'react';
import './TestimonialCard.scss';

/**
 * Props for the TestimonialCard component
 */
interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  rating?: number;
  variant?: 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';
  index?: number; // Add index prop to vary colors
}

/**
 * Renders an individual testimonial card
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  quote,
  avatar,
  variant = 'default',
  index = 0
}) => {
  // Generate variant-specific styling
  const getAccentClass = () => {
    switch (variant) {
      case 'gym':
        return 'from-lime-300 to-emerald-400';
      case 'sports':
        return 'from-cyan-300 to-blue-400';
      case 'wellness':
        return 'from-violet-300 to-purple-400';
      case 'modern':
        return 'from-amber-300 to-orange-400';
      default:
        return 'from-accent-400 to-primary-500';
    }
  };

  const getGlowClass = () => {
    switch (variant) {
      case 'gym':
        return 'lime-glow';
      case 'sports':
        return 'cyan-glow';
      case 'wellness':
        return 'violet-glow';
      case 'modern':
        return 'amber-glow';
      default:
        return 'lime-glow';
    }
  };

  // Get icon color based on index
  const getIconColor = () => {
    // Cycle through colors based on index
    const index_mod = index % 4;
    switch (index_mod) {
      case 0:
        return '#a3e635'; // lime-300
      case 1:
        return '#22d3ee'; // cyan-300
      case 2:
        return '#a78bfa'; // violet-300 
      case 3:
        return '#fbbf24'; // amber-300
      default:
        return '#ddff0e'; // citron
    }
  };

  return (
    <div
      className={`testimonial-card bg-gray-800/90 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 transition-all duration-300 group ${getGlowClass()}`}
      data-variant={variant}
      data-index={index}
    >
      {/* Quote icon with direct color styling */}
      <Quote
        size={32}
        className="testimonial-quote mb-3"
        style={{ color: getIconColor(), filter: `drop-shadow(0 0 8px ${getIconColor()}40)` }}
      />

      {/* Quote */}
      <p className="text-white italic mb-6 relative z-10">"{quote}"</p>

      {/* Author */}
      <div className="flex items-center">
        <div className="mr-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full testimonial-image border-2 border-gray-700" />
          ) : (
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAccentClass()} flex items-center justify-center text-gray-900 font-bold text-lg testimonial-image`}>
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-white group-hover:text-accent-500 transition-colors">{name}</h4>
          <p className="text-sm text-gray-300">{role}</p>
        </div>
      </div>
    </div>
  );
}; 