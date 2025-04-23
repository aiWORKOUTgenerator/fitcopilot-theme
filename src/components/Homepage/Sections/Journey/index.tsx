import React from 'react';
import Section from '../../Layout/Section';

const Journey: React.FC = () => {
  return (
    <Section id="journey" background="dark" paddingY="lg">
      <div className="text-center mb-16" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">Fitness Journey</span>
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Placeholder text for the journey section. This will be replaced with actual content.
        </p>
      </div>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-lime-300/30"></div>
        
        {/* Journey steps */}
        {[1, 2, 3, 4].map((step, index) => (
          <div 
            key={step} 
            className={`flex items-center mb-16 last:mb-0 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
            data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
          >
            <div className="w-1/2 p-4">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold mb-2">Step {step}</h3>
                <p className="text-gray-400">
                  Placeholder for step description. This will be replaced with actual content.
                </p>
              </div>
            </div>
            
            <div className="w-16 h-16 bg-lime-300/20 rounded-full flex-shrink-0 flex items-center justify-center z-10">
              <div className="w-8 h-8 bg-lime-300 rounded-full"></div>
            </div>
            
            <div className="w-1/2 p-4"></div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Journey; 