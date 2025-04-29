import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Homepage'; // Always point at real root
import './styles/homepage.scss'; // Global styles

// Debug React bootstrap process with more detailed logs
console.log('React bootstrap starting...');
console.log('Environment check:', {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production'
});

// Root element ID where the React app will mount
const rootElementId = 'athlete-dashboard-root';
console.log(`Looking for mount point with ID: #${rootElementId}`);

// Get the container element
const container = document.getElementById(rootElementId);

// Handle case where container doesn't exist
if (!container) {
    console.error(`Mount point #${rootElementId} not found in DOM. Creating one...`);

    try {
        // Create a container if it doesn't exist
        const newContainer = document.createElement('div');
        newContainer.id = rootElementId;
        document.body.appendChild(newContainer);
        console.log(`Created #${rootElementId} and appended to body`);

        // Mount app to the newly created container
        const root = createRoot(newContainer);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
        console.log('React app successfully mounted to dynamically created container');
    } catch (error) {
        console.error('Failed to create container and mount app:', error);

        // Fallback error message
        const errorMsg = document.createElement('div');
        errorMsg.innerHTML = `
      <div style="text-align: center; margin: 2rem; font-family: system-ui, sans-serif;">
        <h2>Something went wrong</h2>
        <p>The app couldn't start properly. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
        document.body.appendChild(errorMsg);
    }
} else {
    console.log(`Mount point #${rootElementId} found in DOM, rendering React app...`);

    try {
        // Mount app to the existing container
        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
        console.log('React app successfully mounted to existing container');
    } catch (error) {
        console.error('Failed to mount React app to existing container:', error);

        // Error display
        container.innerHTML = `
      <div style="text-align: center; margin: 2rem; font-family: system-ui, sans-serif;">
        <h2>Something went wrong</h2>
        <p>The app couldn't start properly. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
    }
} 