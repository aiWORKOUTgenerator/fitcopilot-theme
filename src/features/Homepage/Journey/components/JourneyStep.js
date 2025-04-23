import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './JourneyStep.scss';
/**
 * Renders an individual journey step
 */
export const JourneyStep = ({ number, title, description }) => {
    return (_jsx("div", { className: "journey-step relative z-10", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "journey-step__number mb-6", children: _jsx("span", { children: number }) }), _jsx("h3", { className: "text-xl font-semibold mb-3 text-white text-center", children: title }), _jsx("p", { className: "text-gray-400 text-center", children: description })] }) }));
};
