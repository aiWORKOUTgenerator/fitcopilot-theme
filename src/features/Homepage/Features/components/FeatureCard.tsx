import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  demoComponent: React.ReactNode;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  darkMode?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  gradient,
  demoComponent,
  isActive,
  onMouseEnter,
  onMouseLeave,
  darkMode = false,
}) => {
  return (
    <div
      className={`h-[400px] md:h-[450px] rounded-2xl relative overflow-hidden group shadow-xl transition-all duration-300 ${isActive ? 'scale-[1.02]' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 ${gradient} transition-opacity duration-300 ${isActive ? 'opacity-60' : 'opacity-100'}`}></div>

      {/* Demo view (shown when active) */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'} z-10`}
        aria-hidden={!isActive}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <div className="h-[70%] p-4">
          {demoComponent}
        </div>

        {/* Feature info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className={`font-bold text-xl mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {description}
          </p>
        </div>
      </div>

      {/* Default view (shown when inactive) */}
      <div
        className={`absolute inset-0 p-6 flex flex-col items-center justify-center text-center transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'} z-0`}
        aria-hidden={isActive}
      >
        <div className="mb-6">
          {icon}
        </div>
        <h3 className={`font-bold text-xl mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard; 