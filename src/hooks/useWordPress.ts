import { useEffect, useState } from 'react';
import { WordPressData } from '../types/wordpress';

/**
 * Custom hook to access WordPress data
 * @returns WordPress data from window or fallback
 */
export const useWordPress = (): WordPressData => {
  const [wpData, setWpData] = useState<WordPressData>(() => {
    // Try to get data from window object
    if (typeof window !== 'undefined' && window.athleteDashboardData?.wpData) {
      return {
        siteLinks: window.athleteDashboardData.wpData.siteLinks || {
          registration: 'https://aigymengine.com/workout-generator-registration',
          login: 'https://aigymengine.com/react-login',
        },
        assets: window.athleteDashboardData.wpData.assets || {
          logo: '/wp-content/themes/fitcopilot/assets/images/logo.png'
        },
        features: [],
        journey: [],
        testimonials: [],
        pricing: [],
        footerLinks: []
      };
    }

    // Fallback data
    return {
      siteLinks: {
        registration: 'https://aigymengine.com/workout-generator-registration',
        login: 'https://aigymengine.com/react-login',
      },
      assets: {
        logo: '/wp-content/themes/fitcopilot/assets/images/logo.png'
      },
      features: [],
      journey: [],
      testimonials: [],
      pricing: [],
      footerLinks: []
    };
  });

  useEffect(() => {
    // Update data if window.athleteDashboardData changes
    const handleDataChange = () => {
      if (typeof window !== 'undefined' && window.athleteDashboardData?.wpData) {
        setWpData({
          siteLinks: window.athleteDashboardData.wpData.siteLinks || wpData.siteLinks,
          assets: window.athleteDashboardData.wpData.assets || wpData.assets,
          features: [],
          journey: [],
          testimonials: [],
          pricing: [],
          footerLinks: []
        });
      }
    };

    // Listen for custom event if data is loaded asynchronously
    window.addEventListener('athleteDashboardDataLoaded', handleDataChange);

    return () => {
      window.removeEventListener('athleteDashboardDataLoaded', handleDataChange);
    };
  }, [wpData]);

  return wpData;
}; 