import React from 'react';
import { JourneyCTA } from '../components';

/**
 * Example usage of JourneyCTA with different gradient options
 * 
 * This demonstrates how to use the redesigned JourneyCTA component
 * following design system best practices.
 */
const ButtonExample: React.FC = () => {
  return (
    <div className="p-8 space-y-12 bg-slate-900">
      <div>
        <h2 className="text-white text-2xl mb-6">JourneyCTA Component Examples</h2>
        <p className="text-gray-300 mb-8">The following examples demonstrate how to use the JourneyCTA component with different theme variants and gradient colors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Default variant */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <h3 className="text-white mb-4">Default Theme</h3>
          <JourneyCTA
            text="Start Your Journey"
            variant="default"
            dataAos="fade-up"
          />
        </div>

        {/* Gym variant */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <h3 className="text-white mb-4">Gym Theme</h3>
          <JourneyCTA
            text="Join the Gym"
            variant="gym"
            dataAos="fade-up"
            dataAosDelay="100"
          />
        </div>

        {/* Sports variant */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <h3 className="text-white mb-4">Sports Theme</h3>
          <JourneyCTA
            text="Train Like an Athlete"
            variant="sports"
            dataAos="fade-up"
            dataAosDelay="200"
          />
        </div>

        {/* Wellness variant */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <h3 className="text-white mb-4">Wellness Theme</h3>
          <JourneyCTA
            text="Begin Your Wellness Journey"
            variant="wellness"
            dataAos="fade-up"
            dataAosDelay="300"
          />
        </div>

        {/* Modern variant */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <h3 className="text-white mb-4">Modern Theme</h3>
          <JourneyCTA
            text="Experience Modern Fitness"
            variant="modern"
            dataAos="fade-up"
            dataAosDelay="400"
          />
        </div>

        {/* Explicit green gradient */}
        <div className="p-6 bg-gray-800 rounded-lg">
          <h3 className="text-white mb-4">Green Gradient</h3>
          <JourneyCTA
            text="Go Green Fitness"
            variant="default"
            gradientColor="green"
            dataAos="fade-up"
            dataAosDelay="500"
          />
        </div>
      </div>

      <div className="p-6 bg-gray-800 rounded-lg">
        <h3 className="text-white mb-4">Customization Example</h3>
        <p className="text-gray-300 mb-6">The JourneyCTA component can be further customized with different button sizes and hiding the icon:</p>

        <div className="space-y-8">
          <JourneyCTA
            text="Small Button"
            variant="default"
            buttonSize="small"
            gradientColor="green"
            dataAos="fade-up"
          />

          <JourneyCTA
            text="Medium Button"
            variant="gym"
            buttonSize="medium"
            showIcon={false}
            dataAos="fade-up"
            dataAosDelay="100"
          />

          <JourneyCTA
            text="Large Button with Extra Padding"
            variant="sports"
            buttonSize="large"
            gradientColor="amber"
            dataAos="fade-up"
            dataAosDelay="200"
          />
        </div>
      </div>
    </div>
  );
};

export default ButtonExample; 