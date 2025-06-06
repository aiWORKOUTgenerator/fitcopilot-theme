/**
 * FeatureCTA Example Usage
 * 
 * Demonstrates how to use the customized FeatureCTA component
 * with oval shape and cyan gradient.
 */

import React from 'react';
import FeatureCTA from './FeatureCTA';

export const FeatureCTAExamples: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold mb-4">FeatureCTA with Oval Shape & Cyan Gradient</h2>
      
      {/* Default oval with cyan gradient */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Oval Shape (cyan gradient)</h3>
        <FeatureCTA 
          text="Explore Features"
          gradientColor="cyan"
          ovalShape={true}
          buttonSize="medium"
        />
      </div>
      
      {/* Different sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="flex gap-4 items-center">
          <FeatureCTA 
            text="Small"
            gradientColor="cyan"
            ovalShape={true}
            buttonSize="small"
          />
          <FeatureCTA 
            text="Medium"
            gradientColor="cyan"
            ovalShape={true}
            buttonSize="medium"
          />
          <FeatureCTA 
            text="Large"
            gradientColor="cyan"
            ovalShape={true}
            buttonSize="large"
          />
        </div>
      </div>
      
      {/* With and without oval shape comparison */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Oval vs Regular Shape</h3>
        <div className="flex gap-4 items-center">
          <FeatureCTA 
            text="Regular Shape"
            gradientColor="cyan"
            ovalShape={false}
            buttonSize="medium"
          />
          <FeatureCTA 
            text="Oval Shape"
            gradientColor="cyan"
            ovalShape={true}
            buttonSize="medium"
          />
        </div>
      </div>
      
      {/* Different gradient colors with oval shape */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Gradient Colors (Oval)</h3>
        <div className="flex gap-4 items-center flex-wrap">
          <FeatureCTA 
            text="Cyan (Blue)"
            gradientColor="cyan"
            ovalShape={true}
          />
          <FeatureCTA 
            text="Lime (Green)"
            gradientColor="lime"
            ovalShape={true}
          />
          <FeatureCTA 
            text="Violet (Purple)"
            gradientColor="violet"
            ovalShape={true}
          />
          <FeatureCTA 
            text="Amber (Orange)"
            gradientColor="amber"
            ovalShape={true}
          />
        </div>
      </div>
      
      {/* With custom href and icon */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Link & Icon</h3>
        <FeatureCTA 
          text="Start Your Journey"
          gradientColor="cyan"
          ovalShape={true}
          buttonSize="large"
          href="https://example.com/signup"
          showIcon={true}
        />
      </div>
    </div>
  );
};

export default FeatureCTAExamples; 