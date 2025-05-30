import React from 'react';
import { FeatureCTA } from '../components';

/**
 * Example usage of the FeatureCTA component
 * This component follows the same pattern as JourneyCTA but defaults to cyan gradient
 */
const FeatureCTAExample: React.FC = () => {
  return (
    <div className="feature-cta-examples" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>FeatureCTA Component Examples</h2>
      
      {/* Default cyan gradient */}
      <div>
        <h3>Default Cyan Gradient</h3>
        <FeatureCTA />
      </div>
      
      {/* Custom text and href */}
      <div>
        <h3>Custom Text and Link</h3>
        <FeatureCTA 
          text="Discover AI Features"
          href="https://example.com/features"
        />
      </div>
      
      {/* Different gradient colors */}
      <div>
        <h3>Different Gradient Colors</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <FeatureCTA text="Cyan" gradientColor="cyan" />
          <FeatureCTA text="Lime" gradientColor="lime" />
          <FeatureCTA text="Violet" gradientColor="violet" />
          <FeatureCTA text="Amber" gradientColor="amber" />
        </div>
      </div>
      
      {/* Different sizes */}
      <div>
        <h3>Different Sizes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <FeatureCTA text="Small" buttonSize="small" />
          <FeatureCTA text="Medium" buttonSize="medium" />
          <FeatureCTA text="Large" buttonSize="large" />
        </div>
      </div>
      
      {/* Without icon */}
      <div>
        <h3>Without Icon</h3>
        <FeatureCTA text="No Icon" showIcon={false} />
      </div>
      
      {/* Different themes */}
      <div>
        <h3>Different Themes</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <FeatureCTA text="Default Theme" variant="default" />
          <FeatureCTA text="Gym Theme" variant="gym" />
          <FeatureCTA text="Sports Theme" variant="sports" />
          <FeatureCTA text="Wellness Theme" variant="wellness" />
        </div>
      </div>
    </div>
  );
};

export default FeatureCTAExample; 