import React from 'react';
import Button from '../components/UI/Button';

/**
 * Demo component to showcase all button variants
 */
const ButtonVariantsDemo: React.FC = () => {
  return (
    <div className="p-6 bg-gray-800">
      <h2 className="text-2xl text-white mb-6">Button Variants Demo</h2>

      <div className="mb-8">
        <h3 className="text-lg text-white mb-4">Standard Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="gradient">Gradient</Button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg text-white mb-4">Violet-Indigo Gradient (Matches Heading)</h3>
        <div className="mb-4">
          <h4 className="text-2xl mb-2">
            Personal <span className="bg-gradient-to-r from-violet-300 to-indigo-400 text-transparent bg-clip-text">Trainers</span>
          </h4>
          <p className="text-gray-400 mb-4">The button below matches this gradient text</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="violet-indigo">Violet-Indigo</Button>
          <Button variant="violet-indigo" size="small">Small</Button>
          <Button variant="violet-indigo" size="large">Large</Button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg text-white mb-4">Violet-Indigo with Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="violet-indigo"
            leftIcon={<span className="mr-2">←</span>}
          >
            Left Icon
          </Button>
          <Button
            variant="violet-indigo"
            rightIcon={<span className="ml-2">→</span>}
          >
            Right Icon
          </Button>
          <Button
            variant="violet-indigo"
            disabled
          >
            Disabled
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonVariantsDemo; 