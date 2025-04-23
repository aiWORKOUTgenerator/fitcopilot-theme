import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/homepage.scss';

// Import custom hooks

// Import feature component from feature-first structure
import HomepageFeature from './features/Homepage';

/**
 * Main Homepage component
 */
const Homepage: React.FC = () => {
  return <HomepageFeature />;
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