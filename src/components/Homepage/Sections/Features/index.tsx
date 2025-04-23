import React from 'react';
import Section from '../../Layout/Section';

const Features: React.FC = () => {
  return (
    <Section id="features" background="light" paddingY="lg">
      <div className="text-center mb-16" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Powerful <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">Features</span>
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Placeholder text for the features section. This will be replaced with actual content.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div 
            key={item}
            data-aos="fade-up" 
            data-aos-delay={item * 100}
            className="bg-gray-900 p-6 rounded-lg border border-gray-700"
          >
            <div className="w-12 h-12 bg-lime-300/20 rounded-full flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-lime-300 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold mb-2">Feature {item}</h3>
            <p className="text-gray-400">
              Placeholder for feature description. This will be replaced with actual content.
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Features; 