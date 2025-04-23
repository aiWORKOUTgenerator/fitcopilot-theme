import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/features/Homepage/Features/Features.tsx
import { Activity, Apple, BarChart3, Bike, CheckCircle, Coffee, Dumbbell, Flame, Footprints, Heart, HeartHandshake, Medal, Pause, Play, Timer } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import './Features.css';
import FeatureCard from './components/FeatureCard';
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
/**
 * Sample workout component for the Customized Workouts feature
 */
export const SampleWorkout = () => {
    return (_jsxs("div", { className: "text-white h-full w-full flex flex-col overflow-hidden", children: [_jsxs("ul", { className: "space-y-2 text-xs flex-1 overflow-y-auto pr-2", children: [_jsxs("li", { className: "flex items-start", children: [_jsx(CheckCircle, { size: 12, className: "text-lime-300 mr-2 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Goblet Squats" }), _jsx("p", { className: "text-gray-300 text-[10px]", children: "3 \u00D7 12 reps" })] })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(CheckCircle, { size: 12, className: "text-lime-300 mr-2 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Push-ups" }), _jsx("p", { className: "text-gray-300 text-[10px]", children: "3 \u00D7 15 reps" })] })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(CheckCircle, { size: 12, className: "text-lime-300 mr-2 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Walking Lunges" }), _jsx("p", { className: "text-gray-300 text-[10px]", children: "3 \u00D7 10 reps each" })] })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(CheckCircle, { size: 12, className: "text-lime-300 mr-2 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Kettlebell Swings" }), _jsx("p", { className: "text-gray-300 text-[10px]", children: "3 \u00D7 15 reps" })] })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(CheckCircle, { size: 12, className: "text-lime-300 mr-2 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Plank" }), _jsx("p", { className: "text-gray-300 text-[10px]", children: "3 \u00D7 45 seconds" })] })] })] }), _jsx("div", { className: "mt-2 pt-1 border-t border-white/10 text-[8px] text-gray-400/70", children: _jsx("p", { className: "italic text-[7px]", children: "* AI-optimized for your full fitness profile" }) })] }));
};
/**
 * Progress chart component for the Real-Time Tracking feature
 */
export const ProgressChart = () => {
    return (_jsxs("div", { className: "text-white h-full w-full flex flex-col", children: [_jsx("h4", { className: "text-cyan-300 text-sm font-bold mb-3", children: "Weekly Progress" }), _jsxs("div", { className: "flex-1 relative", children: [_jsxs("div", { className: "absolute inset-0", children: [[...Array(5)].map((_, i) => (_jsx("div", { className: "absolute w-full h-px bg-gray-700/30", style: { top: `${20 * i}%` } }, i))), [...Array(7)].map((_, i) => (_jsx("div", { className: "absolute h-full w-px bg-gray-700/30", style: { left: `${100 / 6 * i}%` } }, i)))] }), _jsxs("svg", { className: "absolute inset-0 w-full h-full overflow-visible", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "line-gradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#84cc16" }), _jsx("stop", { offset: "100%", stopColor: "#22d3ee" })] }) }), _jsx("path", { d: "M0,80 C40,70 60,40 80,30 S120,50 140,40 S180,10 200,20", fill: "none", stroke: "url(#line-gradient)", strokeWidth: "3", strokeLinecap: "round", className: "chart-line animate-draw-line drop-shadow-[0_0_3px_rgba(132,204,22,0.5)]" }), _jsx(Heart, { size: 16, className: "text-rose-500 fill-rose-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.5)] opacity-0 animate-heartbeat animate-heart-pulse animate-fade-in", style: {
                                    transform: 'translate(196px, 16px)',
                                    transformOrigin: 'center',
                                    animationDelay: '2.4s, 2.4s, 2.4s'
                                } })] }), [
                        { x: 0, y: 80 },
                        { x: 40, y: 70 },
                        { x: 80, y: 30 },
                        { x: 120, y: 50 },
                        { x: 160, y: 60 },
                        { x: 200, y: 20 }
                    ].map((point, i) => (_jsx("div", { className: "absolute h-2 w-2 bg-gradient-to-br from-lime-400 to-cyan-400 rounded-full opacity-0 scale-0 animate-point-fade", style: {
                            left: `${point.x}px`,
                            top: `${point.y}px`,
                            animationDelay: `${i * 0.4 + 0.5}s`
                        } }, i)))] }), _jsxs("div", { className: "flex justify-between mt-2 text-[10px] text-gray-400", children: [_jsx("span", { children: "Mon" }), _jsx("span", { children: "Tue" }), _jsx("span", { children: "Wed" }), _jsx("span", { children: "Thu" }), _jsx("span", { children: "Fri" }), _jsx("span", { children: "Sat" }), _jsx("span", { children: "Sun" })] }), _jsx("div", { className: "mt-4 flex items-center justify-center", children: _jsx("div", { className: "px-3 py-1 bg-lime-500/20 rounded-full text-lime-400 text-xs font-semibold", children: "+12% this week" }) })] }));
};
/**
 * Video player component for the Expert Advice feature
 */
export const VideoPlayer = forwardRef((_, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    // Update play state when video state changes
    useEffect(() => {
        const videoElement = ref;
        if (!videoElement.current)
            return;
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        videoElement.current.addEventListener('play', handlePlay);
        videoElement.current.addEventListener('pause', handlePause);
        return () => {
            if (videoElement.current) {
                videoElement.current.removeEventListener('play', handlePlay);
                videoElement.current.removeEventListener('pause', handlePause);
            }
        };
    }, [ref]);
    return (_jsxs("div", { className: "relative h-full w-full flex flex-col", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("video", { ref: ref, src: "/wp-content/themes/athlete-dashboard-gym-engine/assets/videos/Mission-Bay-Footage.mp4", className: "h-full w-full object-cover rounded-md", muted: true, loop: true, playsInline: true }), _jsx("div", { className: `absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`, children: _jsx("button", { className: "h-12 w-12 rounded-full bg-violet-500/80 flex items-center justify-center hover:bg-violet-600/80 transition-colors", onClick: () => {
                                const videoElement = ref;
                                if (videoElement.current) {
                                    if (isPlaying) {
                                        videoElement.current.pause();
                                    }
                                    else {
                                        videoElement.current.play().catch(console.error);
                                    }
                                }
                            }, children: isPlaying ? (_jsx(Pause, { size: 24, className: "text-white" })) : (_jsx(Play, { size: 24, className: "text-white ml-1" })) }) })] }), _jsxs("div", { className: "mt-3", children: [_jsx("div", { className: "video-progress", children: _jsx("div", { className: `video-progress-bar ${isPlaying ? 'animate-progress' : ''}`, style: {
                                width: isPlaying ? 'auto' : '0%'
                            } }) }), _jsxs("div", { className: "flex justify-between mt-2 text-xs text-gray-400", children: [_jsx("span", { children: isPlaying ? "2:34" : "0:00" }), _jsx("span", { children: "5:00" })] })] })] }));
});
// Add display name for forwarded ref component
VideoPlayer.displayName = 'VideoPlayer';
/**
 * Features section component
 */
export const Features = () => {
    // Only tracking currentDemoIndex since hoveredIndex isn't being used
    const [activeFeatureIndex, setActiveFeatureIndex] = useState(null);
    const videoRef = useRef(null);
    const features = [
        {
            icon: _jsx(BarChart3, { size: 48, className: "text-lime-300 group-hover:scale-110 transition-transform duration-300" }),
            title: "Customized Workouts",
            description: "Dynamic plans personalized to your fitness goals and equipment.",
            gradient: "from-lime-300/20 to-emerald-500/20",
            demoComponent: _jsx(SampleWorkout, {})
        },
        {
            icon: _jsx(Activity, { size: 48, className: "text-lime-300 group-hover:scale-110 transition-transform duration-300" }),
            title: "Real-Time Tracking",
            description: "Instantly monitor and visualize your progress and achievements.",
            gradient: "from-lime-300/20 to-cyan-500/20",
            demoComponent: _jsx(ProgressChart, {})
        },
        {
            icon: _jsx(HeartHandshake, { size: 48, className: "text-lime-300 group-hover:scale-110 transition-transform duration-300" }),
            title: "Expert Advice",
            description: "Receive guidance and tips from professional fitness experts.",
            gradient: "from-lime-300/20 to-purple-500/20",
            demoComponent: _jsx(VideoPlayer, {})
        }
    ];
    const floatingIcons = [
        { Icon: Dumbbell, size: 24, left: 5, top: 15, delay: 0, speed: 8 },
        { Icon: Timer, size: 32, left: 15, top: 60, delay: 1.5, speed: 10 },
        { Icon: Medal, size: 28, left: 25, top: 25, delay: 0.8, speed: 12 },
        { Icon: Flame, size: 36, left: 80, top: 20, delay: 2, speed: 9 },
        { Icon: Heart, size: 28, left: 85, top: 65, delay: 1, speed: 11 },
        { Icon: Apple, size: 24, left: 10, top: 80, delay: 2.5, speed: 10 },
        { Icon: Coffee, size: 20, left: 70, top: 10, delay: 0.5, speed: 7 },
        { Icon: Footprints, size: 32, left: 90, top: 40, delay: 1.2, speed: 9 },
        { Icon: Bike, size: 36, left: 30, top: 70, delay: 1.8, speed: 13 }
    ];
    // Handle hover over features
    const handleFeatureHover = (index) => {
        setActiveFeatureIndex(index);
        // Auto-play video when hovering Expert Advice
        if (index === 2 && videoRef.current) {
            videoRef.current.play().catch(e => {
                console.error("Video autoplay failed:", e);
            });
        }
    };
    // Handle mouse leave
    const handleMouseLeave = () => {
        setActiveFeatureIndex(null);
        // Pause video when no longer hovering
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };
    return (_jsxs("section", { className: "features-section w-full py-16 md:pt-8 md:pb-24 px-4 bg-gray-900 overflow-hidden relative", "aria-labelledby": "features-heading", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-900 to-transparent z-0" }), _jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", "aria-hidden": "true", children: floatingIcons.map((icon, index) => (_jsx(FloatingIcon, { left: icon.left, top: icon.top, delay: icon.delay, speed: icon.speed, children: _jsx(icon.Icon, { size: icon.size }) }, index))) }), _jsxs("div", { className: "max-w-6xl mx-auto text-center relative z-10", children: [_jsxs("div", { className: "inline-block mb-16", children: [_jsx("span", { className: "text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block", children: "Fitness Evolution" }), _jsxs("h2", { id: "features-heading", className: "text-4xl md:text-5xl font-bold text-white", children: ["Innovative Features ", _jsx("br", {}), _jsx("span", { className: "bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text text-gradient", "data-text": "Tailored for You", children: "Tailored for You" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: features.map((feature, index) => (_jsx(FeatureCard, { icon: feature.icon, title: feature.title, description: feature.description, gradient: feature.gradient, demoComponent: index === 2 ? _jsx(VideoPlayer, { ref: videoRef }) : feature.demoComponent, isActive: activeFeatureIndex === index, onMouseEnter: () => handleFeatureHover(index), onMouseLeave: handleMouseLeave }, index))) }), _jsx("div", { className: "mt-16", children: _jsx("a", { href: "https://aigymengine.com/workout-generator-registration", className: "inline-flex items-center justify-center bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg shadow-lime-300/30 transition-all duration-300 hover:shadow-xl hover:shadow-lime-300/40 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-gray-900 button primary", "aria-label": "Start your fitness journey", children: "Start Your Fitness Journey" }) })] })] }));
};
export default Features;
