import React, { useEffect, useState } from 'react';
import '../../styles/homepage.scss';

// Import custom hooks
import { useAnimation } from '../../hooks/useAnimation';
import { useHomepageData } from './hooks/useHomepageData';

// Import feature components
import { Features } from './Features';
import { Footer } from './Footer';
import { getHeroVariant, Hero, VariantKey } from './Hero';
import { Journey } from './Journey';
import { Pricing } from './Pricing';
import { Testimonials } from './Testimonials';

// Import demo components
import DemoNav from '../../components/DemoNav';

interface HomepageProps {
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
    hero: getHeroVariant(),
    features: 'default',
  });

  // Initialize animations
  useAnimation();

  useEffect(() => {
    // Mark as loaded after initial render
    setIsLoaded(true);

    // Log demo mode status for debugging
    console.log('Demo mode status:', demoMode);
    console.log('Current variants:', variants);

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
      label: 'Hero',
      variantKey: 'hero',
      variants: ['default', 'gym'] as VariantKey[]
    },
    {
      id: 'features',
      label: 'Features',
      variantKey: 'features',
      variants: ['default', 'gym'] as VariantKey[]
    },
    {
      id: 'journey',
      label: 'Journey'
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
          variant={variants.hero}
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