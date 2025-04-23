import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Footer.scss';
import { FooterLinkGroup } from './components/FooterLinkGroup';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';
/**
 * Footer component - Displays the site footer
 */
export const Footer = ({ links = [] }) => {
    // Default footer links if none provided from props
    const defaultLinks = links.length > 0 ? links : [
        {
            id: 1,
            title: 'Product',
            links: [
                { id: 101, title: 'Features', url: '#features' },
                { id: 102, title: 'How It Works', url: '#how-it-works' },
                { id: 103, title: 'Pricing', url: '#pricing' },
                { id: 104, title: 'FAQs', url: '#faqs' }
            ]
        },
        {
            id: 2,
            title: 'Resources',
            links: [
                { id: 201, title: 'Blog', url: '/blog' },
                { id: 202, title: 'Documentation', url: '/docs' },
                { id: 203, title: 'Guides', url: '/guides' },
                { id: 204, title: 'Support', url: '/support' }
            ]
        },
        {
            id: 3,
            title: 'Company',
            links: [
                { id: 301, title: 'About Us', url: '/about' },
                { id: 302, title: 'Careers', url: '/careers' },
                { id: 303, title: 'Privacy Policy', url: '/privacy' },
                { id: 304, title: 'Terms of Service', url: '/terms' }
            ]
        }
    ];
    return (_jsx("footer", { className: "footer-section py-16 bg-[#0F172A]", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-12", children: [_jsxs("div", { className: "md:col-span-3", children: [_jsxs("div", { className: "mb-6 flex flex-col items-start", children: [_jsx("span", { className: "text-gray-400 text-lg tracking-wider", children: "ai" }), _jsx("span", { className: "text-white text-2xl font-bold tracking-wide", children: "WORKOUT" }), _jsx("span", { className: "bg-[#CCFF00] text-[#0B1121] text-sm px-4 py-0.5 rounded-full font-medium tracking-wider", children: "GENERATOR" })] }), _jsx("p", { className: "text-gray-400 mb-6", children: "Transforming fitness journeys with AI-powered workout plans tailored to your unique goals." }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("a", { href: "#", className: "text-gray-400 hover:text-[#CCFF00] transition-colors duration-300", children: _jsx(Facebook, { size: 20 }) }), _jsx("a", { href: "#", className: "text-gray-400 hover:text-[#CCFF00] transition-colors duration-300", children: _jsx(Twitter, { size: 20 }) }), _jsx("a", { href: "#", className: "text-gray-400 hover:text-[#CCFF00] transition-colors duration-300", children: _jsx(Instagram, { size: 20 }) }), _jsx("a", { href: "#", className: "text-gray-400 hover:text-[#CCFF00] transition-colors duration-300", children: _jsx(Github, { size: 20 }) })] })] }), _jsx("div", { className: "md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8", children: defaultLinks.map(group => (_jsx(FooterLinkGroup, { title: group.title, links: group.links }, group.id))) }), _jsxs("div", { className: "md:col-span-3", children: [_jsx("h4", { className: "text-white text-lg font-semibold mb-4", children: "Stay Updated" }), _jsx("p", { className: "text-gray-400 mb-4", children: "Subscribe to our newsletter for the latest updates and fitness tips." }), _jsxs("form", { className: "flex flex-col sm:flex-row gap-2", children: [_jsx("input", { type: "email", placeholder: "Enter your email", className: "bg-[#151F38] text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-[#CCFF00]" }), _jsx("button", { type: "submit", className: "bg-[#CCFF00] text-[#0B1121] rounded-lg px-4 py-2 font-medium hover:bg-[#D8FF33] transition-colors duration-300", children: "Subscribe" })] })] })] }), _jsx("div", { className: "border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm", children: _jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " AI Workout Generator. All rights reserved."] }) })] }) }));
};
export default Footer;
