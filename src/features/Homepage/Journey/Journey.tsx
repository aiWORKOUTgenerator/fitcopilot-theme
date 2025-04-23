import React from 'react';
import './Journey.scss';
import { JourneyProps } from './types';
import { JourneyStep } from './components/JourneyStep';

/**
 * Journey component - Shows the user journey/process flow
 */
export const Journey: React.FC<JourneyProps> = ({ journey = [] }) => {
  // Default journey steps if none provided from props
  const defaultJourney = journey.length > 0 ? journey : [
    {
      id: 1,
      number: 1,
      title: 'Create Your Profile',
      description: 'Answer a few questions about your fitness level, goals, and available equipment.'
    },
    {
      id: 2,
      number: 2,
      title: 'Generate Your Workout',
      description: 'Our AI creates a personalized workout plan tailored to your specific needs and preferences.'
    },
    {
      id: 3,
      number: 3,
      title: 'Start Training',
      description: 'Follow your custom plan with detailed instructions, videos, and progress tracking.'
    },
    {
      id: 4,
      number: 4,
      title: 'Track Your Progress',
      description: 'Monitor your improvements over time and adjust your plan as you achieve your goals.'
    }
  ];

  return (
    <section className="journey-section py-24 bg-[#0B1121]" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">
            How It <span className="text-[#CCFF00]">Works</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get started in minutes with our simple four-step process
          </p>
        </div>
        
        <div className="journey-steps relative">
          {/* Journey path line */}
          <div className="journey-path hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {defaultJourney.map(step => (
              <JourneyStep
                key={step.id}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="https://builder.fitcopilot.ai" 
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-[#0B1121] bg-[#CCFF00] hover:bg-[#D8FF33] transition-all duration-300"
          >
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  );
};

export default Journey; 