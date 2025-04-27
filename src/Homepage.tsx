import React from 'react';
import './styles/homepage.scss';

// Import feature component from feature-first structure
import HomepageComponent from './features/Homepage';

/**
 * Main Homepage component wrapper
 * This is ONLY a component, with no initialization logic
 * All initialization happens in index.tsx
 */
const Homepage: React.FC = () => {
  return <HomepageComponent />;
};

export default Homepage; 