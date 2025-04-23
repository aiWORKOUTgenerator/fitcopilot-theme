import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Logo component for the Hero section
 */
export const HeroLogo = ({ logoUrl }) => {
    return (_jsx("div", { className: "mb-12 flex flex-col items-center justify-center", children: logoUrl ? (_jsx("img", { src: logoUrl, alt: "AI Workout Generator", className: "h-10" })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-gray-400 text-lg tracking-wider", children: "ai" }), _jsx("span", { className: "text-white text-2xl font-bold tracking-wide", children: "WORKOUT" }), _jsx("span", { className: "bg-[#CCFF00] text-[#0B1121] text-sm px-4 py-0.5 rounded-full font-medium tracking-wider", children: "GENERATOR" })] })) }));
};
