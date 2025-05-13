/* eslint-disable @typescript-eslint/no-explicit-any */
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
      // Cast to any to avoid TypeScript errors
      const wpObj = window.athleteDashboardData.wpData as any;

      return {
        siteLinks: wpObj.siteLinks || {
          registration: 'https://aigymengine.com/workout-generator-registration',
          login: 'https://aigymengine.com/react-login',
        },
        assets: wpObj.assets || {
          logo: 'http://fitcopilot-theme.local/wp-content/uploads/2025/05/AI-Workout-Generater-TransparentBG-400x516-1.png'
        },
        themeVariants: wpObj.themeVariants || {},
        demoMode: wpObj.demoMode || false,
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
        logo: 'http://fitcopilot-theme.local/wp-content/uploads/2025/05/AI-Workout-Generater-TransparentBG-400x516-1.png'
      },
      themeVariants: {},
      demoMode: false,
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
        // Cast to any to avoid TypeScript errors
        const wpObj = window.athleteDashboardData.wpData as any;

        setWpData({
          siteLinks: wpObj.siteLinks || wpData.siteLinks,
          assets: wpObj.assets || wpData.assets,
          themeVariants: wpObj.themeVariants || wpData.themeVariants,
          demoMode: wpObj.demoMode || wpData.demoMode,
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