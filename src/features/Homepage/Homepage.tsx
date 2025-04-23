import React, { useEffect, useState } from 'react';
import '../../styles/homepage.scss';

// Import custom hooks
import { useAnimation } from '../../hooks/useAnimation';
import { useHomepageData } from './hooks/useHomepageData';

// Import feature components
import { Features } from './Features';
import { Footer } from './Footer';
import { Hero, getHeroVariant } from './Hero';
import { Journey } from './Journey';
import { Pricing } from './Pricing';
import { Testimonials } from './Testimonials';

/**
 * Main Homepage component
 */
const Homepage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const data = useHomepageData();

  // Get the hero variant from WordPress settings
  const heroVariant = getHeroVariant();

  // Initialize animations
  useAnimation();

  useEffect(() => {
    // Mark as loaded after initial render
    setIsLoaded(true);
  }, []);

  return (
    <main
      className={`homepage-container bg-black text-white transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Global Grid Pattern */}
      <div className="global-grid-overlay bg-grid-pattern" aria-hidden="true"></div>

      {/* Hero Section - Using dynamic variant */}
      <Hero
        variant={heroVariant}
        registrationLink={data.siteLinks.registration}
        loginLink={data.siteLinks.login}
        logoUrl={data.assets.logo}
      />

      {/* Features Section */}
      <Features />

      {/* Journey Section */}
      <Journey journey={data.journey} />

      {/* Testimonials Section */}
      <Testimonials testimonials={data.testimonials} />

      {/* Pricing Section */}
      <Pricing pricing={data.pricing} />

      {/* Footer Section */}
      <Footer links={data.footerLinks} />
    </main>
  );
};

export default Homepage; 