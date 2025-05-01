import React, { useEffect, useState } from 'react';
import './styles/homepage.scss';

// Import custom hooks
import { useHomepageAnimation, useHomepageData } from './hooks';

// Import feature components
import { Features } from './Features';
import { Footer } from './Footer';
import Hero from './Hero';
import { Journey } from './Journey';
import { getPersonalTrainingVariant, PersonalTraining } from './PersonalTraining';
import { Pricing } from './Pricing';
import { Testimonials } from './Testimonials';
import Training, { getTrainingVariant } from './Training';
import TrainingFeatures, { getTrainingFeaturesVariant } from './TrainingFeatures';

// Import feature-specific components
import { DemoNav } from './components';
import { VariantKey } from './Hero/types';

export interface HomepageProps {
  demoMode?: boolean;
}

/**
 * Main Homepage component
 */
const Homepage: React.FC<HomepageProps> = ({ demoMode = false }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const data = useHomepageData();

  // Track variants for demo mode
  const [variants, setVariants] = useState<Record<string, VariantKey>>({
    features: 'default',
    training: getTrainingVariant(),
    personalTraining: getPersonalTrainingVariant(),
    trainingFeatures: getTrainingFeaturesVariant(),
  });

  // Initialize animations
  useHomepageAnimation();

  useEffect(() => {
    // Mark as loaded after initial render
    setIsLoaded(true);

    // Enhanced logging for debugging variants
    console.log('========= VARIANT DEBUG INFO =========');
    console.log('Demo mode status:', demoMode);
    console.log('All current variants:', variants);
    console.log('====================================');

    // Add a class to the body for demo mode
    if (demoMode) {
      document.body.classList.add('demo-mode');
    } else {
      document.body.classList.remove('demo-mode');
    }

    return () => {
      document.body.classList.remove('demo-mode');
    };
  }, [demoMode, variants]);

  // Handle variant change in demo mode
  const handleVariantChange = (sectionKey: string, variant: VariantKey) => {
    console.log(`Changing ${sectionKey} variant to ${variant}`);
    setVariants(prev => ({
      ...prev,
      [sectionKey]: variant
    }));
  };

  // Define sections for demo navigation
  const demoSections = [
    {
      id: 'hero',
      label: 'Hero'
    },
    {
      id: 'features',
      label: 'Features',
      variantKey: 'features',
      variants: ['default'] as VariantKey[]
    },
    {
      id: 'journey',
      label: 'Journey'
    },
    {
      id: 'training',
      label: 'Training Programs',
      variantKey: 'training',
      variants: ['default', 'boutique', 'classic', 'minimalist', 'modern', 'sports', 'wellness'] as VariantKey[]
    },
    {
      id: 'trainingFeatures',
      label: 'Training Features',
      variantKey: 'trainingFeatures',
      variants: ['default', 'boutique', 'classic', 'minimalist', 'modern', 'sports', 'wellness'] as VariantKey[]
    },
    {
      id: 'personalTraining',
      label: 'Personal Training',
      variantKey: 'personalTraining',
      variants: ['default'] as VariantKey[]
    },
    {
      id: 'testimonials',
      label: 'Testimonials'
    },
    {
      id: 'pricing',
      label: 'Pricing'
    },
    {
      id: 'footer',
      label: 'Footer'
    }
  ];

  return (
    <main
      className={`homepage-container bg-black text-white transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Demo Mode Navigation - only shown in demo mode */}
      {demoMode && (
        <>
          <DemoNav
            sections={demoSections}
            currentVariants={variants}
            onVariantChange={handleVariantChange}
          />
          {/* Debug indicator */}
          <div className="demo-mode-indicator">
            Demo Mode Active: {String(demoMode)}
          </div>
        </>
      )}

      {/* Global Grid Pattern */}
      <div className="global-grid-overlay bg-grid-pattern" aria-hidden="true"></div>

      {/* Hero Section - Using dynamic variant */}
      <section id="hero">
        <Hero
          registrationLink={data.siteLinks.registration}
          loginLink={data.siteLinks.login}
          logoUrl={data.assets.logo}
        />
      </section>

      {/* Features Section */}
      <section id="features">
        <Features
          variant={variants.features}
        />
      </section>

      {/* Journey Section */}
      <section id="journey">
        <Journey journey={data.journey} />
      </section>

      {/* Training Programs Section */}
      <section id="training">
        <Training variant={variants.training} />
      </section>

      {/* Training Features Section */}
      <section id="trainingFeatures">
        <TrainingFeatures variant={variants.trainingFeatures} />
      </section>

      {/* Personal Training Section */}
      <section id="personalTraining">
        <PersonalTraining variant={variants.personalTraining} />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials">
        <Testimonials testimonials={data.testimonials} />
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <Pricing pricing={data.pricing} />
      </section>

      {/* Footer Section */}
      <section id="footer">
        <Footer links={data.footerLinks} />
      </section>
    </main>
  );
};

export default Homepage; 