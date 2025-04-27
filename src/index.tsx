import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Homepage'; // Always point at real root
import './styles/homepage.scss'; // Global styles

// Critical diagnostic for troubleshooting
console.log('🚀 React bootstrap running from src/index.tsx');

// The one and only place that should call createRoot
const rootElementId = 'athlete-dashboard-root';
const el = document.getElementById(rootElementId);

// Fail loudly if container is missing
if (!el) {
    throw new Error(
        `❌ Mount point #${rootElementId} not found in DOM—check your template!`
    );
} else {
    // Normal path - container exists
    try {
        createRoot(el).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
        console.log('✅ App successfully mounted to #' + rootElementId);
    } catch (error) {
        console.error('❌ Mount error:', error);

        // Fallback to display error to user
        el.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>Unable to load application</h2>
        <p>Something went wrong with the application. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
    }
} 