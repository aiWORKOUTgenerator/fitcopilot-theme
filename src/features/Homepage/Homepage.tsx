import React, { useEffect, useRef, useState } from 'react';
import './styles/homepage.scss';

// Import custom hooks
import { useHomepageAnimation, useHomepageData } from './hooks';

// Import feature components
import Registration from '../Registration/Registration';
import { RegistrationData } from '../Registration/types';
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

// Import shared components
import { GlobalBackground } from '../../components/shared';

export interface HomepageProps {
  demoMode?: boolean;
}

/**
 * Main Homepage component
 */
const Homepage: React.FC<HomepageProps> = ({ demoMode = false }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  // Registration workflow state
  const [showRegistration, setShowRegistration] = useState<boolean>(false);
  const registrationRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const data = useHomepageData();

  // Track variants for demo mode
  const [variants, setVariants] = useState<Record<string, VariantKey>>({
    hero: 'default',
    features: 'default',
    journey: 'default',
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

  // Registration workflow handlers
  const handleRegistrationStart = () => {
    setShowRegistration(true);

    // Ensure smooth scrolling is available
    document.body.classList.add('registration-active');

    // Scroll to the registration section after a short delay to allow for DOM updates
    setTimeout(() => {
      if (registrationRef.current) {
        registrationRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Set focus to the registration container for accessibility
        registrationRef.current.focus();
      }
    }, 100);
  };

  const handleRegistrationComplete = (registrationData: RegistrationData) => {
    // Store registration data (can be used for future API calls)
    console.log('Registration completed with data:', registrationData);

    // Hide registration component
    setShowRegistration(false);

    // Remove active class from body
    document.body.classList.remove('registration-active');

    // Redirect to builder or another page if needed
    window.location.href = '/build-workout';
  };

  const handleRegistrationCancel = () => {
    setShowRegistration(false);
    document.body.classList.remove('registration-active');

    // Scroll back to top of page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
      label: 'Hero',
      variantKey: 'hero',
      variants: ['default', 'gym', 'sports', 'wellness'] as VariantKey[]
    },
    {
      id: 'features',
      label: 'Features',
      variantKey: 'features',
      variants: ['default', 'gym', 'sports', 'wellness'] as VariantKey[]
    },
    {
      id: 'journey',
      label: 'Journey',
      variantKey: 'journey',
      variants: ['default', 'gym', 'sports', 'wellness'] as VariantKey[]
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

  // Determine the active theme for the entire page
  // In a real app, this might come from user preferences or context
  const activeTheme = variants.hero;

  return (
    <main
      className={`homepage-container text-white transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${showRegistration ? 'with-registration' : ''}`}
    >
      {/* Global theme-aware background */}
      <GlobalBackground variant={activeTheme} pattern="grid" />

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

      {/* Hero Section - Using dynamic variant */}
      <section id="hero" ref={heroRef} className={showRegistration ? 'dimmed' : ''}>
        <Hero
          registrationLink={data.siteLinks.registration}
          loginLink={data.siteLinks.login}
          logoUrl={data.assets.logo}
          onRegistrationStart={handleRegistrationStart}
          variant={variants.hero}
        />
      </section>

      {/* Registration Section - inserted after Hero */}
      {showRegistration && (
        <div
          ref={registrationRef}
          id="registration"
          className="registration-section"
          tabIndex={-1}
        >
          <Registration
            className="registration-component"
            onComplete={handleRegistrationComplete}
            onCancel={handleRegistrationCancel}
          />
        </div>
      )}

      {/* Features Section */}
      <div id="features" className={showRegistration ? 'dimmed' : ''}>
        <Features
          variant={variants.features}
        />
      </div>

      {/* Journey Section */}
      <div id="journey" className={showRegistration ? 'dimmed' : ''}>
        <Journey journey={data.journey} />
      </div>

      {/* Training Programs Section */}
      <div id="training" className={showRegistration ? 'dimmed' : ''}>
        <Training variant={variants.training} />
      </div>

      {/* Training Features Section */}
      <div id="trainingFeatures" className={showRegistration ? 'dimmed' : ''}>
        <TrainingFeatures variant={variants.trainingFeatures} />
      </div>

      {/* Personal Training Section */}
      <div id="personalTraining" className={showRegistration ? 'dimmed' : ''}>
        <PersonalTraining variant={variants.personalTraining} />
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className={showRegistration ? 'dimmed' : ''}>
        <Testimonials />
      </div>

      {/* Pricing Section */}
      <div id="pricing" className={showRegistration ? 'dimmed' : ''}>
        <Pricing />
      </div>

      {/* Footer */}
      <div id="footer" className={showRegistration ? 'dimmed' : ''}>
        <Footer
          logoUrl={data.assets.logo}
          socialLinks={data.socialLinks}
          legalLinks={data.legalLinks}
          mainLinks={data.mainLinks}
        />
      </div>
    </main>
  );
};

export default Homepage; 