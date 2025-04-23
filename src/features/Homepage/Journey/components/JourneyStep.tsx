import React from 'react';
import './JourneyStep.scss';

interface JourneyStepProps {
  number: number;
  title: string;
  description: string;
}

/**
 * Renders an individual journey step
 */
export const JourneyStep: React.FC<JourneyStepProps> = ({ 
  number, 
  title, 
  description 
}) => {
  return (
    <div className="journey-step relative z-10">
      <div className="flex flex-col items-center">
        <div className="journey-step__number mb-6">
          <span>{number}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-white text-center">{title}</h3>
        
        <p className="text-gray-400 text-center">
          {description}
        </p>
      </div>
    </div>
  );
}; 