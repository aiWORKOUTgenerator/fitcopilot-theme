import React, { useState, useEffect } from 'react';
import './styles/homepage.scss';
import { createRoot } from 'react-dom/client';

// Import custom hooks
import { useAnimation } from './hooks/useAnimation';
import { useWordPress } from './hooks/useWordPress';

// Import section components
import { Hero, Features, Journey, Testimonials, Pricing, Footer } from './components/Homepage/Sections';

/**
 * Main Homepage component
 */
const Homepage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const data = useWordPress();
  
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
      
      {/* Hero Section */}
      <Hero 
        registrationLink={data.siteLinks.registration}
        loginLink={data.siteLinks.login}
        logoUrl={data.assets.logo}
      />
      
      {/* Features Section */}
      <Features />
      
      {/* Journey Section */}
      <Journey />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Pricing Section */}
      <Pricing />
      
      {/* Footer Section */}
      <Footer />
    </main>
  );
};

/**
 * Initialize the React application
 */
const initializeApp = () => {
  const container = document.getElementById('athlete-dashboard-root');
  
  if (container) {
    try {
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <Homepage />
        </React.StrictMode>
      );
    } catch (error) {
      console.error('Failed to initialize React app:', error);
      
      // Fallback to display error to user
      container.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: sans-serif;">
          <h2>Unable to load homepage</h2>
          <p>Something went wrong with the homepage application. Please try refreshing the page.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  } else {
    // If container doesn't exist, create it
    console.warn('Root element not found, creating it dynamically');
    const bodyElement = document.body;
    if (bodyElement) {
      const newRootElement = document.createElement('div');
      newRootElement.id = 'athlete-dashboard-root';
      bodyElement.appendChild(newRootElement);
      
      // Then mount app to the new element
      try {
        const root = createRoot(newRootElement);
        root.render(
          <React.StrictMode>
            <Homepage />
          </React.StrictMode>
        );
      } catch (error) {
        console.error('Failed to initialize React app on dynamically created element:', error);
      }
    }
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Add TypeScript type declarations
declare global {
  interface Window {
    athleteDashboardData?: any;
    AOS?: any;
  }
} 