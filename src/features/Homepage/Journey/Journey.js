import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Activity, ArrowRight, BarChart2, Calendar, ChevronRight, Clock, Cpu, Dumbbell, FileText, Flame, Layers, Lightbulb, Microscope, Package, PieChart, Settings, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import { useState } from 'react';
import './Journey.scss';
/**
 * Journey component - Shows the user journey/process flow with expandable steps
 */
export const Journey = ({ journey = [] }) => {
    const [expandedStep, setExpandedStep] = useState(null);
    // Define detailed journey steps
    const journeySteps = journey.length > 0 ? journey.map(step => ({
        id: step.id,
        title: step.title,
        description: step.description,
        number: step.number,
        // Default values for the new properties if not provided from props
        icon: getIconForStep(step.number),
        delay: step.number * 100,
        accentColor: getAccentColorForStep(step.number),
        ctaText: getCTATextForStep(step.number),
        detailedFeatures: getDetailedFeaturesForStep(step.number)
    })) : [
        {
            id: 1,
            title: "Define Your Goals",
            description: "Tell us what you want to achieve - strength, muscle gain, fat loss, or general fitness.",
            icon: _jsx(Target, { size: 40, className: "text-gray-900" }),
            delay: 100,
            accentColor: "from-lime-300 to-emerald-400",
            ctaText: "Set Your Goals",
            detailedFeatures: [
                {
                    title: "Strength Building",
                    description: "Focus on compound movements and progressive overload for maximum strength gains.",
                    icon: _jsx(Dumbbell, { size: 24, className: "text-lime-200" })
                },
                {
                    title: "Fat Loss",
                    description: "Optimize caloric deficit with the right mix of HIIT and steady-state cardio.",
                    icon: _jsx(Flame, { size: 24, className: "text-lime-200" })
                },
                {
                    title: "Muscle Growth",
                    description: "Hypertrophy-focused programs with proper volume and intensity distribution.",
                    icon: _jsx(Zap, { size: 24, className: "text-lime-200" })
                },
                {
                    title: "General Fitness",
                    description: "Well-rounded programs balancing strength, endurance, and mobility.",
                    icon: _jsx(Activity, { size: 24, className: "text-lime-200" })
                }
            ]
        },
        {
            id: 2,
            title: "Customize Your Experience",
            description: "Specify your experience level, available equipment, and time constraints.",
            icon: _jsx(Settings, { size: 40, className: "text-gray-900" }),
            delay: 200,
            accentColor: "from-cyan-300 to-blue-400",
            ctaText: "Personalize",
            detailedFeatures: [
                {
                    title: "Equipment Selection",
                    description: "From minimal home setups to full gym access - we adapt to what you have.",
                    icon: _jsx(Dumbbell, { size: 24, className: "text-cyan-200" })
                },
                {
                    title: "Time Management",
                    description: "Short on time? Our AI optimizes workouts from 15 minutes to 90+ minutes.",
                    icon: _jsx(Clock, { size: 24, className: "text-cyan-200" })
                },
                {
                    title: "Experience Level",
                    description: "Whether you're a beginner or advanced, we scale appropriately for your level.",
                    icon: _jsx(Layers, { size: 24, className: "text-cyan-200" })
                },
                {
                    title: "Training Frequency",
                    description: "Flexible scheduling from 2-6 days per week based on your availability.",
                    icon: _jsx(Calendar, { size: 24, className: "text-cyan-200" })
                }
            ]
        },
        {
            id: 3,
            title: "Receive Your Personalized Plan",
            description: "Our AI generates a tailored workout program specific to your needs and capabilities.",
            icon: _jsx(Package, { size: 40, className: "text-gray-900" }),
            delay: 300,
            accentColor: "from-violet-300 to-purple-400",
            ctaText: "See Sample Plan",
            detailedFeatures: [
                {
                    title: "AI-Powered Design",
                    description: "Advanced algorithms create the optimal exercise selection and progression.",
                    icon: _jsx(Cpu, { size: 24, className: "text-violet-200" })
                },
                {
                    title: "Scientific Approach",
                    description: "Evidence-based programming following proven training principles.",
                    icon: _jsx(Microscope, { size: 24, className: "text-violet-200" })
                },
                {
                    title: "Adaptive Progression",
                    description: "Your plan evolves as you progress, ensuring continued results.",
                    icon: _jsx(TrendingUp, { size: 24, className: "text-violet-200" })
                },
                {
                    title: "Detailed Instructions",
                    description: "Clear guidance on execution, tempo, and form for each exercise.",
                    icon: _jsx(FileText, { size: 24, className: "text-violet-200" })
                }
            ]
        },
        {
            id: 4,
            title: "Track Your Progress",
            description: "Log your workouts, track your metrics, and watch your progress over time.",
            icon: _jsx(BarChart2, { size: 40, className: "text-gray-900" }),
            delay: 400,
            accentColor: "from-amber-300 to-orange-400",
            ctaText: "View Analytics",
            detailedFeatures: [
                {
                    title: "Visual Analytics",
                    description: "Interactive charts showing your strength progression and volume over time.",
                    icon: _jsx(PieChart, { size: 24, className: "text-amber-200" })
                },
                {
                    title: "Achievement System",
                    description: "Unlock badges and achievements as you hit milestones in your fitness journey.",
                    icon: _jsx(Trophy, { size: 24, className: "text-amber-200" })
                },
                {
                    title: "Body Composition",
                    description: "Track weight, measurements, and body composition changes visually.",
                    icon: _jsx(Activity, { size: 24, className: "text-amber-200" })
                },
                {
                    title: "Smart Insights",
                    description: "AI-powered observations about your performance patterns and suggestions.",
                    icon: _jsx(Lightbulb, { size: 24, className: "text-amber-200" })
                }
            ]
        }
    ];
    const toggleStep = (index) => {
        if (expandedStep === index) {
            setExpandedStep(null);
        }
        else {
            setExpandedStep(index);
        }
    };
    // Helper functions to provide defaults
    function getIconForStep(stepNumber) {
        switch (stepNumber) {
            case 1: return _jsx(Target, { size: 40, className: "text-gray-900" });
            case 2: return _jsx(Settings, { size: 40, className: "text-gray-900" });
            case 3: return _jsx(Package, { size: 40, className: "text-gray-900" });
            case 4: return _jsx(BarChart2, { size: 40, className: "text-gray-900" });
            default: return _jsx(Target, { size: 40, className: "text-gray-900" });
        }
    }
    function getAccentColorForStep(stepNumber) {
        switch (stepNumber) {
            case 1: return "from-lime-300 to-emerald-400";
            case 2: return "from-cyan-300 to-blue-400";
            case 3: return "from-violet-300 to-purple-400";
            case 4: return "from-amber-300 to-orange-400";
            default: return "from-lime-300 to-emerald-400";
        }
    }
    function getCTATextForStep(stepNumber) {
        switch (stepNumber) {
            case 1: return "Set Your Goals";
            case 2: return "Personalize";
            case 3: return "See Sample Plan";
            case 4: return "View Analytics";
            default: return "Learn More";
        }
    }
    function getDetailedFeaturesForStep(stepNumber) {
        switch (stepNumber) {
            case 1:
                return [
                    {
                        title: "Strength Building",
                        description: "Focus on compound movements and progressive overload for maximum strength gains.",
                        icon: _jsx(Dumbbell, { size: 24, className: "text-lime-200" })
                    },
                    {
                        title: "Fat Loss",
                        description: "Optimize caloric deficit with the right mix of HIIT and steady-state cardio.",
                        icon: _jsx(Flame, { size: 24, className: "text-lime-200" })
                    },
                    {
                        title: "Muscle Growth",
                        description: "Hypertrophy-focused programs with proper volume and intensity distribution.",
                        icon: _jsx(Zap, { size: 24, className: "text-lime-200" })
                    },
                    {
                        title: "General Fitness",
                        description: "Well-rounded programs balancing strength, endurance, and mobility.",
                        icon: _jsx(Activity, { size: 24, className: "text-lime-200" })
                    }
                ];
            case 2:
                return [
                    {
                        title: "Equipment Selection",
                        description: "From minimal home setups to full gym access - we adapt to what you have.",
                        icon: _jsx(Dumbbell, { size: 24, className: "text-cyan-200" })
                    },
                    {
                        title: "Time Management",
                        description: "Short on time? Our AI optimizes workouts from 15 minutes to 90+ minutes.",
                        icon: _jsx(Clock, { size: 24, className: "text-cyan-200" })
                    },
                    {
                        title: "Experience Level",
                        description: "Whether you're a beginner or advanced, we scale appropriately for your level.",
                        icon: _jsx(Layers, { size: 24, className: "text-cyan-200" })
                    },
                    {
                        title: "Training Frequency",
                        description: "Flexible scheduling from 2-6 days per week based on your availability.",
                        icon: _jsx(Calendar, { size: 24, className: "text-cyan-200" })
                    }
                ];
            case 3:
                return [
                    {
                        title: "AI-Powered Design",
                        description: "Advanced algorithms create the optimal exercise selection and progression.",
                        icon: _jsx(Cpu, { size: 24, className: "text-violet-200" })
                    },
                    {
                        title: "Scientific Approach",
                        description: "Evidence-based programming following proven training principles.",
                        icon: _jsx(Microscope, { size: 24, className: "text-violet-200" })
                    },
                    {
                        title: "Adaptive Progression",
                        description: "Your plan evolves as you progress, ensuring continued results.",
                        icon: _jsx(TrendingUp, { size: 24, className: "text-violet-200" })
                    },
                    {
                        title: "Detailed Instructions",
                        description: "Clear guidance on execution, tempo, and form for each exercise.",
                        icon: _jsx(FileText, { size: 24, className: "text-violet-200" })
                    }
                ];
            case 4:
                return [
                    {
                        title: "Visual Analytics",
                        description: "Interactive charts showing your strength progression and volume over time.",
                        icon: _jsx(PieChart, { size: 24, className: "text-amber-200" })
                    },
                    {
                        title: "Achievement System",
                        description: "Unlock badges and achievements as you hit milestones in your fitness journey.",
                        icon: _jsx(Trophy, { size: 24, className: "text-amber-200" })
                    },
                    {
                        title: "Body Composition",
                        description: "Track weight, measurements, and body composition changes visually.",
                        icon: _jsx(Activity, { size: 24, className: "text-amber-200" })
                    },
                    {
                        title: "Smart Insights",
                        description: "AI-powered observations about your performance patterns and suggestions.",
                        icon: _jsx(Lightbulb, { size: 24, className: "text-amber-200" })
                    }
                ];
            default:
                return [];
        }
    }
    return (_jsx("section", { className: "journey-section py-24 bg-[#0B1121]", id: "how-it-works", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-16", "data-aos": "fade-up", children: [_jsxs("h2", { className: "text-4xl font-bold mb-4 text-white", children: ["How It ", _jsx("span", { className: "text-[#CCFF00]", children: "Works" })] }), _jsx("p", { className: "text-gray-400 max-w-2xl mx-auto", children: "Follow these simple steps to get started with your personalized workout program, powered by our advanced AI technology." })] }), _jsx("div", { className: "space-y-8", children: journeySteps.map((step, index) => (_jsxs("div", { className: "relative journey-step transition-all duration-500 ease-in-out", "data-aos": "fade-up", "data-aos-delay": step.delay, children: [_jsxs("div", { className: `relative p-6 md:p-8 rounded-2xl bg-gray-800/70 backdrop-blur-lg border ${expandedStep === index ? 'border-[#CCFF00]/50 shadow-lg shadow-[#CCFF00]/10' : 'border-gray-700'} transition-all duration-300 cursor-pointer group ${step.accentColor.includes('lime') ? 'lime-glow' :
                                    step.accentColor.includes('cyan') ? 'cyan-glow' :
                                        step.accentColor.includes('violet') ? 'violet-glow' :
                                            step.accentColor.includes('amber') ? 'amber-glow' : ''}`, onClick: () => toggleStep(index), role: "button", tabIndex: 0, "aria-expanded": expandedStep === index, "aria-controls": `step-content-${index}`, onKeyDown: (e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggleStep(index);
                                    }
                                }, children: [_jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center gap-6", children: [_jsxs("div", { className: "relative", children: [_jsxs("div", { className: `w-16 h-16 rounded-xl bg-gradient-to-br ${step.accentColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`, children: [step.icon, _jsx("div", { className: `absolute inset-0 rounded-xl bg-gradient-to-br ${step.accentColor} opacity-15 blur-[1px] group-hover:opacity-25 transition-opacity`, "aria-hidden": "true" })] }), _jsx("div", { className: "absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-r from-lime-300 to-emerald-400 text-gray-900", children: index + 1 })] }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-[#CCFF00] transition-colors flex items-center", children: step.title }), _jsx("p", { className: "text-gray-400 group-hover:text-gray-300 transition-colors md:pr-12", children: step.description })] }), _jsx("div", { className: `p-2 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/10 transition-all duration-300 ${expandedStep === index ? 'rotate-90' : ''}`, "aria-hidden": "true", children: _jsx(ChevronRight, { size: 20, className: "text-[#CCFF00]" }) })] }), index < journeySteps.length - 1 && (_jsx("div", { className: "hidden md:block step-connector", "aria-hidden": "true" }))] }), _jsxs("div", { id: `step-content-${index}`, className: `mt-2 rounded-2xl bg-gray-800/40 border border-gray-700 overflow-hidden transition-all duration-500 ease-in-out ${expandedStep === index ? 'max-h-[600px] opacity-100 p-6' : 'max-h-0 opacity-0 p-0 border-0'}`, "aria-hidden": expandedStep !== index, children: [_jsx("div", { className: `grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ${expandedStep === index ? 'animate-fade-slide-up' : ''}`, children: step.detailedFeatures.map((feature, featureIndex) => (_jsxs("div", { className: "flex items-start gap-4 p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-colors group/feature", children: [_jsx("div", { className: "bg-gray-800 p-2 rounded-lg group-hover/feature:scale-110 transition-transform", "aria-hidden": "true", children: feature.icon }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-white mb-1", children: feature.title }), _jsx("p", { className: "text-sm text-gray-400 group-hover/feature:text-gray-300 transition-colors small", children: feature.description })] })] }, featureIndex))) }), _jsx("div", { className: `text-center ${expandedStep === index ? 'animate-fade-in' : ''}`, children: _jsxs("a", { href: step.title === "Receive Your Personalized Plan"
                                                ? "http://builder.fitcopilot.ai"
                                                : "https://aigymengine.com/workout-generator-registration", className: "inline-flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-md hover:shadow-lg hover:-translate-y-1 button primary", "aria-label": `${step.ctaText} for ${step.title}`, children: [step.ctaText, _jsx(ArrowRight, { size: 16, className: "ml-2", "aria-hidden": "true" })] }) })] })] }, step.id))) }), _jsx("div", { className: "text-center mt-16", "data-aos": "fade-up", "data-aos-delay": "500", children: _jsxs("a", { href: "https://builder.fitcopilot.ai", className: "inline-flex items-center px-8 py-4 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-lg shadow-lime-300/30 hover:shadow-xl hover:shadow-lime-300/40 hover:-translate-y-1 button primary", children: ["Start Your Journey", _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 ml-2", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z", clipRule: "evenodd" }) })] }) })] }) }));
};
export default Journey;
