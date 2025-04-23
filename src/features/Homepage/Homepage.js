import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import '../../styles/homepage.scss';
// Import custom hooks
import { useAnimation } from '../../hooks/useAnimation';
import { useHomepageData } from './hooks/useHomepageData';
// Import feature components
import { Features } from './Features';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Journey } from './Journey';
import { Pricing } from './Pricing';
import { Testimonials } from './Testimonials';
/**
 * Main Homepage component
 */
const Homepage = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const data = useHomepageData();
    // Initialize animations
    useAnimation();
    useEffect(() => {
        // Mark as loaded after initial render
        setIsLoaded(true);
    }, []);
    return (_jsxs("main", { className: `homepage-container bg-black text-white transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`, children: [_jsx("div", { className: "global-grid-overlay bg-grid-pattern", "aria-hidden": "true" }), _jsx(Hero, { registrationLink: data.siteLinks.registration, loginLink: data.siteLinks.login, logoUrl: data.assets.logo }), _jsx(Features, {}), _jsx(Journey, { journey: data.journey }), _jsx(Testimonials, { testimonials: data.testimonials }), _jsx(Pricing, { pricing: data.pricing }), _jsx(Footer, { links: data.footerLinks })] }));
};
export default Homepage;
