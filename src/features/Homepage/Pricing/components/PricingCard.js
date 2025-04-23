import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, X } from 'lucide-react';
import './PricingCard.scss';
/**
 * Renders an individual pricing card
 */
export const PricingCard = ({ name, description, price, period, features, ctaText, ctaLink, popular = false }) => {
    return (_jsxs("div", { className: `pricing-card relative h-full flex flex-col bg-[#151F38] rounded-2xl border ${popular ? 'border-[#CCFF00]' : 'border-gray-800'} overflow-hidden`, children: [popular && (_jsx("div", { className: "absolute top-0 right-0", children: _jsx("div", { className: "bg-[#CCFF00] text-[#0B1121] text-xs px-4 py-1 font-medium transform rotate-45 translate-x-7 translate-y-4", children: "Popular" }) })), _jsxs("div", { className: "p-8 flex-grow", children: [_jsx("h3", { className: "text-2xl font-bold mb-2 text-white", children: name }), _jsx("p", { className: "text-gray-400 mb-6", children: description }), _jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-end", children: [_jsx("span", { className: "text-white text-4xl font-bold", children: price === '0' ? 'Free' : _jsxs(_Fragment, { children: ["$", price] }) }), period !== 'forever' && (_jsxs("span", { className: "text-gray-400 ml-2 pb-1", children: ["/", period] }))] }) }), _jsx("ul", { className: "space-y-4 mb-8", children: features.map(feature => (_jsxs("li", { className: "flex items-start", children: [feature.included ? (_jsx(Check, { className: "shrink-0 h-5 w-5 text-[#CCFF00] mr-3 mt-0.5" })) : (_jsx(X, { className: "shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" })), _jsx("span", { className: feature.included ? 'text-gray-300' : 'text-gray-500', children: feature.text })] }, feature.id))) })] }), _jsx("div", { className: "px-8 pb-8", children: _jsx("a", { href: ctaLink, className: `block text-center py-3 px-6 rounded-lg font-medium transition-all duration-300 ${popular
                        ? 'bg-[#CCFF00] text-[#0B1121] hover:bg-[#D8FF33]'
                        : 'bg-[#0B1121] text-white border border-gray-700 hover:border-[#CCFF00]'}`, children: ctaText }) })] }));
};
