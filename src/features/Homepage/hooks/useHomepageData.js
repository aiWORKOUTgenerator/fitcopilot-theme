import { useEffect, useState } from 'react';
import { useWordPress } from '../../../hooks/useWordPress';
/**
 * Custom hook to fetch and organize all data needed for the Homepage
 * Centralizes data fetching and processing for the entire Homepage feature
 */
export const useHomepageData = () => {
    const [homepageData, setHomepageData] = useState({
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
        var _a, _b, _c;
        if (wpData) {
            // Transform and organize the data for the Homepage
            setHomepageData({
                siteLinks: {
                    registration: ((_a = wpData.siteLinks) === null || _a === void 0 ? void 0 : _a.registration) || 'https://builder.fitcopilot.ai/register',
                    login: ((_b = wpData.siteLinks) === null || _b === void 0 ? void 0 : _b.login) || 'https://builder.fitcopilot.ai/login',
                },
                assets: {
                    logo: ((_c = wpData.assets) === null || _c === void 0 ? void 0 : _c.logo) || '',
                },
                // Use empty arrays as fallbacks for missing data from WordPress
                features: wpData.features || [],
                journey: wpData.journey || [],
                testimonials: wpData.testimonials || [],
                pricing: wpData.pricing || [],
                footerLinks: wpData.footerLinks || [],
            });
        }
    }, [wpData]);
    return homepageData;
};
