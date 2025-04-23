import { useState, useEffect } from 'react';

interface WordPressData {
  siteLinks: {
    registration: string;
    login: string;
    workoutBuilder: string;
  };
  assets: {
    logo: string;
  };
  wpData: {
    restUrl: string;
    nonce: string;
    userId: number;
  };
}

export const useWordPress = () => {
  const [wpData, setWpData] = useState<WordPressData>(() => {
    // Try to get data from window object
    if (typeof window !== 'undefined' && window.athleteDashboardData) {
      return window.athleteDashboardData;
    }
    
    // Fallback data
    return {
      siteLinks: {
        registration: 'https://aigymengine.com/workout-generator-registration',
        login: 'https://aigymengine.com/react-login',
        workoutBuilder: 'https://builder.fitcopilot.ai'
      },
      assets: {
        logo: '/wp-content/themes/fitcopilot/assets/images/logo.png'
      },
      wpData: {
        restUrl: '',
        nonce: '',
        userId: 0
      }
    };
  });

  useEffect(() => {
    // Update data if window.athleteDashboardData changes
    const handleDataChange = () => {
      if (typeof window !== 'undefined' && window.athleteDashboardData) {
        setWpData(window.athleteDashboardData);
      }
    };

    // Listen for custom event if data is loaded asynchronously
    window.addEventListener('athleteDashboardDataLoaded', handleDataChange);

    return () => {
      window.removeEventListener('athleteDashboardDataLoaded', handleDataChange);
    };
  }, []);

  return wpData;
}; 