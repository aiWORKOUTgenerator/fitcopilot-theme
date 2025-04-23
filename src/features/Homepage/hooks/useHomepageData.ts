import { useState, useEffect } from 'react';
import { useWordPress } from '../../../hooks/useWordPress';

interface HomepageData {
  siteLinks: {
    registration: string;
    login: string;
  };
  assets: {
    logo: string;
  };
  features: any[];
  journey: any[];
  testimonials: any[];
  pricing: any[];
  footerLinks: any[];
}

/**
 * Custom hook to fetch and organize all data needed for the Homepage
 * Centralizes data fetching and processing for the entire Homepage feature
 */
export const useHomepageData = (): HomepageData => {
  const [homepageData, setHomepageData] = useState<HomepageData>({
    siteLinks: {
      registration: '',
      login: '',
    },
    assets: {
      logo: '',
    },
    features: [],
    journey: [],
    testimonials: [],
    pricing: [],
    footerLinks: [],
  });

  // Use the general WordPress hook to get raw data
  const wpData = useWordPress();

  useEffect(() => {
    if (wpData) {
      // Transform and organize the data for the Homepage
      setHomepageData({
        siteLinks: {
          registration: wpData.siteLinks?.registration || 'https://builder.fitcopilot.ai/register',
          login: wpData.siteLinks?.login || 'https://builder.fitcopilot.ai/login',
        },
        assets: {
          logo: wpData.assets?.logo || '',
        },
        // Use empty arrays as fallbacks for missing data from WordPress
        features: [],
        journey: [],
        testimonials: [],
        pricing: [],
        footerLinks: [],
      });
    }
  }, [wpData]);

  return homepageData;
}; 