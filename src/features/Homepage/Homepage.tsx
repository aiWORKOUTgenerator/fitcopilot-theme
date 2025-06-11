import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import logger from '../../utils/logger';
import './styles/homepage.scss';

// Import custom hooks
import { useHomepageAnimation, useHomepageData } from './hooks';

// Import the GlobalVariantProvider to fix context error
import { GlobalVariantProvider } from './context/GlobalVariantContext';

// Import registration which needs to be loaded immediately
import Registration from '../Registration/Registration';
import { RegistrationData } from '../Registration/types';

// Import utility functions for variants
import { getPersonalTrainingVariant } from './PersonalTraining';
import { PersonalTrainingVariant } from './PersonalTraining/utils/themeUtils';
import { getTrainingVariant } from './Training';
import { getTrainingFeaturesVariant } from './TrainingFeatures';

// Import type definitions for variants
import { VariantKey as FeaturesVariantKey } from './Features/types';
import { HeroVariantKey } from './Hero/types';
import { JourneyStep as JourneyStepType } from './Journey/types';

// Lazy load feature components
const Features = lazy(() => import(/* webpackChunkName: "feature-homepage-features" */ './Features').then(module => ({ default: module.Features })));
const Footer = lazy(() => import(/* webpackChunkName: "feature-homepage-footer" */ './Footer').then(module => ({ default: module.Footer })));
const Hero = lazy(() => import(/* webpackChunkName: "feature-homepage-hero" */ './Hero'));
const Journey = lazy(() => import(/* webpackChunkName: "feature-homepage-journey" */ './Journey').then(module => ({ default: module.Journey })));
const PersonalTraining = lazy(() => import(/* webpackChunkName: "feature-homepage-personal-training" */ './PersonalTraining'));
const Pricing = lazy(() => import(/* webpackChunkName: "feature-homepage-pricing" */ './Pricing').then(module => ({ default: module.Pricing })));
const Testimonials = lazy(() => import(/* webpackChunkName: "feature-homepage-testimonials" */ './Testimonials').then(module => ({ default: module.Testimonials })));
const Training = lazy(() => import(/* webpackChunkName: "feature-homepage-training" */ './Training'));
const TrainingFeatures = lazy(() => import(/* webpackChunkName: "feature-homepage-training-features" */ './TrainingFeatures'));

// Import feature-specific components
import { DemoNav } from './components';

// Import shared components
import { GlobalBackground } from '../../components/shared';

// Type for the theme variant from GlobalBackground
type ThemeVariant = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';

// Generic loading skeleton component
const LoadingSkeleton = ({ height = '300px', type = 'default' }) => (
  <div 
    className={`lazy-loading-skeleton ${type}-skeleton`} 
    style={{ height }}
    aria-label="Loading content..."
  >
    <div className="loading-animation"></div>
  </div>
);

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
  const [variants, setVariants] = useState({
    hero: 'default' as HeroVariantKey,
    features: 'default' as FeaturesVariantKey,
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
    logger.debug('========= VARIANT DEBUG INFO =========');
    logger.debug('Demo mode status:', demoMode);
    logger.debug('All current variants:', variants);
    logger.debug('====================================');

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
    logger.info('Registration completed with data:', registrationData);

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
  const handleVariantChange = (sectionKey: string, variant: string) => {
    logger.debug(`Changing ${sectionKey} variant to ${variant}`);
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
      variants: ['default', 'gym', 'sports', 'wellness']
    },
    {
      id: 'features',
      label: 'Features',
      variantKey: 'features',
      variants: ['default', 'gym', 'sports', 'wellness']
    },
    {
      id: 'journey',
      label: 'Journey',
      variantKey: 'journey',
      variants: ['default', 'gym', 'sports', 'wellness']
    },
    {
      id: 'training',
      label: 'Training Programs',
      variantKey: 'training',
      variants: ['default', 'boutique', 'classic', 'minimalist', 'modern', 'sports', 'wellness']
    },
    {
      id: 'trainingFeatures',
      label: 'Training Features',
      variantKey: 'trainingFeatures',
      variants: ['default', 'boutique', 'classic', 'minimalist', 'modern', 'sports', 'wellness']
    },
    {
      id: 'personalTraining',
      label: 'Personal Training',
      variantKey: 'personalTraining',
      variants: ['default']
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
  const activeTheme = variants.hero as ThemeVariant;

  // Transform WordPress Journey data to match the expected Journey component data
  const transformedJourneyData = data.journey?.map((step, index) => ({
    ...step,
    id: parseInt(step.id) || index + 1,
    number: step.stepNumber || index + 1
  })) as JourneyStepType[];

  return (
    <GlobalVariantProvider initialVariant="default" enableWpIntegration={true}>
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
          <Suspense fallback={<LoadingSkeleton height="100vh" type="hero" />}>
            <Hero
              registrationLink={data.siteLinks.registration}
              loginLink={data.siteLinks.login}
              logoUrl={data.assets.logo}
              onRegistrationStart={handleRegistrationStart}
              variant={variants.hero}
            />
          </Suspense>
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
          <Suspense fallback={<LoadingSkeleton height="600px" type="features" />}>
            <Features
              variant={variants.features}
            />
          </Suspense>
        </div>

        {/* Journey Section */}
        <div id="journey" className={showRegistration ? 'dimmed' : ''}>
          <Suspense fallback={<LoadingSkeleton height="500px" type="journey" />}>
            <Journey journey={transformedJourneyData} />
          </Suspense>
        </div>

        {/* Training Section */}
        <div id="training-programs" className={showRegistration ? 'dimmed' : ''}>
          <Suspense fallback={<LoadingSkeleton height="700px" type="training" />}>
            <Training
              variant={variants.training}
            />
          </Suspense>
        </div>

        {/* Training Features Section */}
        <div id="training-features" className={showRegistration ? 'dimmed' : ''}>
          <Suspense fallback={<LoadingSkeleton height="600px" type="training-features" />}>
            <TrainingFeatures
              variant={variants.trainingFeatures as any}
            />
          </Suspense>
        </div>

        {/* Personal Training Section */}
        <div id="personal-training" className={showRegistration ? 'dimmed' : ''}>
          <Suspense fallback={<LoadingSkeleton height="500px" type="personal-training" />}>
            <PersonalTraining
              variant={variants.personalTraining as PersonalTrainingVariant}
            />
          </Suspense>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className={showRegistration ? 'dimmed' : ''}>
          <Suspense fallback={<LoadingSkeleton height="400px" type="testimonials" />}>
            <Testimonials />
          </Suspense>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className={showRegistration ? 'dimmed' : ''}>
          <Suspense fallback={<LoadingSkeleton height="700px" type="pricing" />}>
            <Pricing />
          </Suspense>
        </div>

        {/* Footer Section */}
        <div id="footer">
          <Suspense fallback={<LoadingSkeleton height="300px" type="footer" />}>
            <Footer />
          </Suspense>
        </div>
      </main>
    </GlobalVariantProvider>
  );
};

export default Homepage; 