import { CheckCircle } from 'lucide-react';
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  demoComponent: React.ReactNode;
  isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  darkMode?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  gradient,
  demoComponent,
  isActive = false,
  onMouseEnter,
  onMouseLeave,
  darkMode = false,
}) => {
  return (
    <div
      className="flip-card h-96"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flip-card-inner w-full h-full">
        {/* Front of card */}
        <div className="flip-card-front absolute w-full h-full group bg-gray-800/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 transition-all duration-500 hover:border-lime-300/50 hover:shadow-lg hover:shadow-lime-300/20 flex flex-col items-center justify-center">
          <div className={`h-24 w-24 rounded-xl mb-6 mx-auto flex items-center justify-center bg-gradient-to-br ${gradient}`}>
            {icon}
          </div>
          <h3 className="text-white text-xl font-bold mb-4 group-hover:text-lime-300 transition-colors">{title}</h3>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>

          {/* Pill badge */}
          <div className="mt-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-lime-300 group-hover:bg-lime-300/20 transition-colors">
              Hover to Preview
            </span>
          </div>
        </div>

        {/* Back of card (demo) */}
        <div className="flip-card-back absolute w-full h-full bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 border border-lime-300/30 shadow-lg shadow-lime-300/10 flex flex-col">
          <h3 className="text-lime-300 text-lg font-bold mb-3 text-center flex items-center justify-center">
            {title} <CheckCircle className="ml-2 animate-pulse" size={20} />
          </h3>
          <div className="flex-1 px-2 relative mb-6">
            {demoComponent}
          </div>
          <div className="text-center mt-auto pt-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lime-500/20 text-lime-300">
              Hover to Flip Back
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard; 