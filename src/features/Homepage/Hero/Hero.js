import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Apple, Bike, Coffee, Dumbbell, Flame, Footprints, Heart, LogIn, Medal, Shield, Timer, UserPlus, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import './Hero.scss';
/**
 * Floating icon component for decorative background elements
 */
const FloatingIcon = ({ children, delay, speed, left, top }) => {
    return (_jsx("div", { className: "floating-icon", style: {
            left: `${left}%`,
            top: `${top}%`,
            animation: `float ${speed}s ease-in-out infinite ${delay}s`
        }, "aria-hidden": "true", children: children }));
};
const Hero = ({ registrationLink = "https://aigymengine.com/workout-generator-registration", loginLink = "https://aigymengine.com/react-login", logoUrl = '/wp-content/themes/athlete-dashboard-gym-engine/assets/images/AI-Workout-Generater-TransparentBG-1-2880x1800.png' }) => {
    // Animation states for tooltips
    const [tooltipStates, setTooltipStates] = useState({
        freeWorkout: {
            show: false,
            isAutoShow: false,
            isHovered: false,
        },
        createAccount: {
            show: false,
            isAutoShow: false,
            isHovered: false,
        }
    });
    // Animation timeline references
    const timeoutsRef = useRef([]);
    // Clear all timeouts on cleanup
    const clearAllTimeouts = () => {
        timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
        timeoutsRef.current = [];
    };
    // Floating icons data
    const floatingIcons = [
        { Icon: Dumbbell, size: 28, left: 5, top: 15, delay: 0, speed: 8 },
        { Icon: Timer, size: 36, left: 15, top: 60, delay: 1.5, speed: 10 },
        { Icon: Medal, size: 32, left: 25, top: 25, delay: 0.8, speed: 12 },
        { Icon: Flame, size: 40, left: 80, top: 20, delay: 2, speed: 9 },
        { Icon: Heart, size: 32, left: 85, top: 65, delay: 1, speed: 11 },
        { Icon: Apple, size: 28, left: 10, top: 80, delay: 2.5, speed: 10 },
        { Icon: Coffee, size: 24, left: 70, top: 10, delay: 0.5, speed: 7 },
        { Icon: Footprints, size: 36, left: 90, top: 40, delay: 1.2, speed: 9 },
        { Icon: Bike, size: 40, left: 30, top: 70, delay: 1.8, speed: 13 }
    ];
    // On mount and unmount
    useEffect(() => {
        // Cleanup all timeouts on unmount
        return () => {
            clearAllTimeouts();
        };
    }, []);
    // Mouse enter handler
    const handleMouseEnter = (button) => {
        setTooltipStates(prev => (Object.assign(Object.assign({}, prev), { [button]: Object.assign(Object.assign({}, prev[button]), { show: true, isHovered: true }) })));
    };
    // Mouse leave handler
    const handleMouseLeave = (button) => {
        setTooltipStates(prev => (Object.assign(Object.assign({}, prev), { [button]: Object.assign(Object.assign({}, prev[button]), { show: false, isHovered: false }) })));
    };
    return (_jsxs("section", { className: "w-full min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden bg-gray-900", "aria-labelledby": "hero-heading", children: [_jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none z-10", "aria-hidden": "true", children: floatingIcons.map((icon, index) => (_jsx(FloatingIcon, { left: icon.left, top: icon.top, delay: icon.delay, speed: icon.speed, children: _jsx(icon.Icon, { size: icon.size }) }, index))) }), _jsxs("div", { className: "max-w-4xl mx-auto relative z-20 text-center", children: [_jsxs("div", { className: "bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-700 mb-6", children: [_jsx("div", { className: "mb-8 flex justify-center", children: _jsx("img", { src: logoUrl, alt: "AI Workout Generator Logo", className: "h-48 md:h-56 w-auto" }) }), _jsxs("h1", { id: "hero-heading", className: "text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white", children: [_jsx("span", { className: "bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text text-gradient", "data-text": "AI-Powered Workouts", children: "AI-Powered Workouts" }), " Tailored Just for You"] }), _jsx("div", { className: "w-24 h-1 bg-gradient-to-r from-lime-300 to-emerald-400 mx-auto mb-6 rounded-full" }), _jsxs("p", { className: "text-gray-300 mb-10 max-w-2xl mx-auto text-base md:text-xl lead", children: ["Achieve your fitness goals with ", _jsx("span", { className: "citron-text", children: "customized plans" }), " designed by AI and expert trainers."] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-6 justify-center mb-6", children: [_jsxs("div", { className: "relative", onMouseEnter: () => handleMouseEnter('freeWorkout'), onMouseLeave: () => handleMouseLeave('freeWorkout'), children: [_jsxs("a", { href: "https://builder.fitcopilot.ai", className: "inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-optimized hover:shadow-optimized-hover hover:-translate-y-1 w-full sm:w-auto button primary hero-button", children: [_jsx(Zap, { className: "mr-2 h-5 w-5" }), "Get a Free Workout"] }), _jsx("div", { className: "tooltip-container", children: _jsxs("div", { className: `tooltip ${tooltipStates.freeWorkout.show ? 'show' : 'hide'}`, children: [_jsxs("div", { className: "tooltip-content", children: [_jsx("div", { className: "tooltip-icon", children: _jsx(Zap, { className: "w-4 h-4 text-lime-300" }) }), _jsxs("div", { className: "tooltip-text", children: [_jsx("h5", { className: "tooltip-title", children: "Quick Workout Builder" }), _jsx("p", { className: "text-xs text-gray-300", children: "Generate a personalized workout plan in seconds with our AI technology - no registration required." })] })] }), _jsx("div", { className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-800" })] }) })] }), _jsxs("div", { className: "relative", onMouseEnter: () => handleMouseEnter('createAccount'), onMouseLeave: () => handleMouseLeave('createAccount'), children: [_jsxs("a", { href: registrationLink, className: "inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all duration-300 bg-gray-800 border-2 border-lime-300/30 text-white hover:bg-lime-300/10 hover:-translate-y-1 w-full sm:w-auto button secondary hero-button", children: [_jsx(UserPlus, { className: "mr-2 h-5 w-5 text-lime-300" }), "Create Your Account"] }), _jsx("div", { className: "tooltip-container", children: _jsxs("div", { className: `tooltip ${tooltipStates.createAccount.show ? 'show' : 'hide'}`, children: [_jsxs("div", { className: "tooltip-content", children: [_jsx("div", { className: "tooltip-icon", children: _jsx(Shield, { className: "w-4 h-4 text-lime-300" }) }), _jsxs("div", { className: "tooltip-text", children: [_jsx("h5", { className: "tooltip-title", children: "Member Benefits" }), _jsx("p", { className: "text-xs text-gray-300", children: "Save workouts, track progress, and access premium features with your free account." })] })] }), _jsx("div", { className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-800" })] }) })] })] }), _jsx("div", { children: _jsxs("a", { href: loginLink, className: "inline-flex items-center text-gray-400 hover:text-lime-300 transition-colors duration-300", children: [_jsx(LogIn, { size: 16, className: "mr-1" }), "Already have an account? Sign in"] }) })] }), _jsxs("div", { className: "flex flex-wrap justify-center gap-3 mt-8", children: [_jsxs("div", { className: "bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700/50 flex items-center", children: [_jsx(Dumbbell, { size: 14, className: "text-lime-300 mr-2" }), _jsx("span", { children: "Personalized Workouts" })] }), _jsxs("div", { className: "bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700/50 flex items-center", children: [_jsx(Flame, { size: 14, className: "text-lime-300 mr-2" }), _jsx("span", { children: "AI-Optimized Routines" })] }), _jsxs("div", { className: "bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700/50 flex items-center", children: [_jsx(Heart, { size: 14, className: "text-lime-300 mr-2" }), _jsx("span", { children: "Expert Guidance" })] })] })] })] }));
};
export default Hero;
