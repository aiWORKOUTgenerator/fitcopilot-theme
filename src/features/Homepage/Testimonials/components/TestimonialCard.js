import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Star } from 'lucide-react';
import './TestimonialCard.scss';
/**
 * Renders an individual testimonial card
 */
export const TestimonialCard = ({ name, role, quote, avatar, rating = 5 }) => {
    // Generate rating stars
    const renderStars = () => {
        return Array.from({ length: 5 }).map((_, index) => (_jsx(Star, { size: 16, className: `${index < rating ? 'text-[#CCFF00] fill-[#CCFF00]' : 'text-gray-600'}` }, index)));
    };
    return (_jsxs("div", { className: "testimonial-card bg-[#0B1121] p-8 rounded-2xl border border-gray-800", children: [_jsx("div", { className: "flex mb-6", children: renderStars() }), _jsx("blockquote", { className: "mb-6", children: _jsxs("p", { className: "text-gray-300 text-lg leading-relaxed italic", children: ["\"", quote, "\""] }) }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "testimonial-card__avatar", children: avatar ? (_jsx("img", { src: avatar, alt: name, className: "w-12 h-12 rounded-full" })) : (_jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#64D2B9] flex items-center justify-center text-[#0B1121] font-bold text-lg", children: name.charAt(0) })) }), _jsxs("div", { className: "ml-4", children: [_jsx("h4", { className: "font-semibold text-white", children: name }), _jsx("p", { className: "text-gray-400 text-sm", children: role })] })] })] }));
};
