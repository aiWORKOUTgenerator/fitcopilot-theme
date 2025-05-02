import {
    Activity,
    ArrowRight,
    BarChart2,
    Calendar,
    ChevronRight,
    Clock,
    Cpu,
    Dumbbell,
    FileText,
    Flame,
    Layers,
    Lightbulb,
    Microscope,
    Package,
    PieChart,
    Settings,
    Target,
    TrendingUp,
    Trophy,
    Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { RegistrationStep, RegistrationStepProps } from '../types';
import './Journey.scss';

interface JourneyStep {
    title: string;
    description: string;
    icon: React.ReactNode;
    delay: number;
    detailedFeatures: {
        title: string;
        description: string;
        icon: React.ReactNode;
    }[];
    ctaText: string;
    accentColor: string;
    nextStep: RegistrationStep;
}

const JourneyComponent: React.FC<RegistrationStepProps & { currentStep: RegistrationStep }> = ({
    data,
    updateData,
    onNext,
    onBack,
    currentStep
}) => {
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    // Define the journey steps
    const journeySteps: JourneyStep[] = [
        {
            title: "Define Your Goals",
            description: "Tell us what you want to achieve - strength, muscle gain, fat loss, or general fitness.",
            icon: <Target size={40} className="text-gray-900" />,
            delay: 100,
            accentColor: "from-lime-300 to-emerald-400",
            ctaText: "Set Your Goals",
            nextStep: RegistrationStep.EXPERIENCE_LEVEL,
            detailedFeatures: [
                {
                    title: "Strength Building",
                    description: "Focus on compound movements and progressive overload for maximum strength gains.",
                    icon: <Dumbbell size={24} className="text-lime-200" />
                },
                {
                    title: "Fat Loss",
                    description: "Optimize caloric deficit with the right mix of HIIT and steady-state cardio.",
                    icon: <Flame size={24} className="text-lime-200" />
                },
                {
                    title: "Muscle Growth",
                    description: "Hypertrophy-focused programs with proper volume and intensity distribution.",
                    icon: <Zap size={24} className="text-lime-200" />
                },
                {
                    title: "General Fitness",
                    description: "Well-rounded programs balancing strength, endurance, and mobility.",
                    icon: <Activity size={24} className="text-lime-200" />
                }
            ]
        },
        {
            title: "Customize Your Experience",
            description: "Specify your experience level, available equipment, and time constraints.",
            icon: <Settings size={40} className="text-gray-900" />,
            delay: 200,
            accentColor: "from-cyan-300 to-blue-400",
            ctaText: "Personalize",
            nextStep: RegistrationStep.EXPERIENCE_LEVEL,
            detailedFeatures: [
                {
                    title: "Equipment Selection",
                    description: "From minimal home setups to full gym access - we adapt to what you have.",
                    icon: <Dumbbell size={24} className="text-cyan-200" />
                },
                {
                    title: "Time Management",
                    description: "Short on time? Our AI optimizes workouts from 15 minutes to 90+ minutes.",
                    icon: <Clock size={24} className="text-cyan-200" />
                },
                {
                    title: "Experience Level",
                    description: "Whether you're a beginner or advanced, we scale appropriately for your level.",
                    icon: <Layers size={24} className="text-cyan-200" />
                },
                {
                    title: "Training Frequency",
                    description: "Flexible scheduling from 2-6 days per week based on your availability.",
                    icon: <Calendar size={24} className="text-cyan-200" />
                }
            ]
        },
        {
            title: "Receive Your Personalized Plan",
            description: "Our AI generates a tailored workout program specific to your needs and capabilities.",
            icon: <Package size={40} className="text-gray-900" />,
            delay: 300,
            accentColor: "from-violet-300 to-purple-400",
            ctaText: "See Sample Plan",
            nextStep: RegistrationStep.PRICING,
            detailedFeatures: [
                {
                    title: "AI-Powered Design",
                    description: "Advanced algorithms create the optimal exercise selection and progression.",
                    icon: <Cpu size={24} className="text-violet-200" />
                },
                {
                    title: "Scientific Approach",
                    description: "Evidence-based programming following proven training principles.",
                    icon: <Microscope size={24} className="text-violet-200" />
                },
                {
                    title: "Adaptive Progression",
                    description: "Your plan evolves as you progress, ensuring continued results.",
                    icon: <TrendingUp size={24} className="text-violet-200" />
                },
                {
                    title: "Detailed Instructions",
                    description: "Clear guidance on execution, tempo, and form for each exercise.",
                    icon: <FileText size={24} className="text-violet-200" />
                }
            ]
        },
        {
            title: "Track Your Progress",
            description: "Log your workouts, track your metrics, and watch your progress over time.",
            icon: <BarChart2 size={40} className="text-gray-900" />,
            delay: 400,
            accentColor: "from-amber-300 to-orange-400",
            ctaText: "View Analytics",
            nextStep: RegistrationStep.PRICING,
            detailedFeatures: [
                {
                    title: "Visual Analytics",
                    description: "Interactive charts showing your strength progression and volume over time.",
                    icon: <PieChart size={24} className="text-amber-200" />
                },
                {
                    title: "Achievement System",
                    description: "Unlock badges and achievements as you hit milestones in your fitness journey.",
                    icon: <Trophy size={24} className="text-amber-200" />
                },
                {
                    title: "Body Composition",
                    description: "Track weight, measurements, and body composition changes visually.",
                    icon: <Activity size={24} className="text-amber-200" />
                },
                {
                    title: "Smart Insights",
                    description: "AI-powered observations about your performance patterns and suggestions.",
                    icon: <Lightbulb size={24} className="text-amber-200" />
                }
            ]
        }
    ];

    // Toggle expanded step
    const toggleStep = (index: number) => {
        if (expandedStep === index) {
            setExpandedStep(null);
        } else {
            setExpandedStep(index);
        }
    };

    // Handle button click in a step
    const handleStepAction = (index: number) => {
        // Close the current step
        setExpandedStep(null);

        // Update registration data with selected goal if needed
        if (index === 0) {
            updateData({ goal: journeySteps[index].title });
        }

        // Proceed to next step in registration flow
        if (onNext) {
            setTimeout(() => {
                onNext();
            }, 300);
        }
    };

    return (
        <div className="journey-step registration-step">
            {/* Background animation with particles */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0">
                <div className="particles-container">
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                    <div className="particle particle-4"></div>
                    <div className="particle particle-5"></div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto relative z-20 px-4 py-8">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Your AI-Powered <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">Fitness Journey</span>
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-lime-300 to-emerald-400 mx-auto mb-6 rounded-full"></div>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                        Follow these simple steps to get started with your personalized workout program, powered by our advanced AI technology.
                    </p>
                </div>

                <div className="space-y-6">
                    {journeySteps.map((step, index) => (
                        <div
                            key={index}
                            className={`relative journey-step-card transition-all duration-500 ease-in-out animate-fade-in-up delay-${index + 1}`}
                        >
                            {/* Main Step Card */}
                            <div
                                className={`relative p-6 md:p-8 rounded-2xl bg-gray-800/70 backdrop-blur-lg border ${expandedStep === index ? 'border-lime-300/50 shadow-lg shadow-lime-300/10' : 'border-gray-700'
                                    } transition-all duration-300 cursor-pointer group ${step.accentColor.includes('lime') ? 'lime-glow' :
                                        step.accentColor.includes('cyan') ? 'cyan-glow' :
                                            step.accentColor.includes('violet') ? 'violet-glow' :
                                                step.accentColor.includes('amber') ? 'amber-glow' : ''
                                    }`}
                                onClick={() => toggleStep(index)}
                                role="button"
                                tabIndex={0}
                                aria-expanded={expandedStep === index}
                                aria-controls={`step-content-${index}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggleStep(index);
                                    }
                                }}
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    {/* Step Icon & Number */}
                                    <div className="relative">
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.accentColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                                            {step.icon}

                                            {/* Pulsing ring - decorative */}
                                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.accentColor} opacity-15 blur-[1px] group-hover:opacity-25 transition-opacity`} aria-hidden="true"></div>
                                        </div>

                                        {/* Step number */}
                                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-r from-lime-300 to-emerald-400 text-gray-900">
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* Step Information */}
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-lime-300 transition-colors flex items-center">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors md:pr-12">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Expand/Collapse Button */}
                                    <div className={`p-2 rounded-full border border-lime-300/30 bg-lime-300/10 transition-all duration-300 ${expandedStep === index ? 'rotate-90' : ''}`} aria-hidden="true">
                                        <ChevronRight size={20} className="text-lime-300" />
                                    </div>
                                </div>

                                {/* Progress connector */}
                                {index < journeySteps.length - 1 && (
                                    <div className="hidden md:block step-connector" aria-hidden="true"></div>
                                )}
                            </div>

                            {/* Expanded Content */}
                            <div
                                id={`step-content-${index}`}
                                className={`mt-2 rounded-2xl bg-gray-800/40 border border-gray-700 overflow-hidden transition-all duration-500 ease-in-out ${expandedStep === index ? 'max-h-[600px] opacity-100 p-6' : 'max-h-0 opacity-0 p-0 border-0'
                                    }`}
                                aria-hidden={expandedStep !== index}
                            >
                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ${expandedStep === index ? 'animate-fade-slide-up' : ''
                                    }`}>
                                    {step.detailedFeatures.map((feature, featureIndex) => (
                                        <div
                                            key={featureIndex}
                                            className="flex items-start gap-4 p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-colors group/feature"
                                        >
                                            <div className="bg-gray-800 p-2 rounded-lg group-hover/feature:scale-110 transition-transform" aria-hidden="true">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                                                <p className="text-sm text-gray-400 group-hover/feature:text-gray-300 transition-colors">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <div className={`text-center ${expandedStep === index ? 'animate-fade-in' : ''
                                    }`}>
                                    <button
                                        onClick={() => handleStepAction(index)}
                                        className="inline-flex items-center px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-md hover:shadow-lg hover:shadow-lime-300/30 hover:-translate-y-1"
                                        aria-label={`${step.ctaText} for ${step.title}`}
                                    >
                                        {step.ctaText}
                                        <ArrowRight size={16} className="ml-2" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="navigation-container mt-16 animate-fade-in text-center">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="inline-flex items-center px-6 py-3 mr-4 rounded-full border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-all"
                            aria-label="Go back to previous step"
                        >
                            <ChevronRight size={20} className="rotate-180 mr-2" />
                            Back
                        </button>
                    )}
                    <button
                        onClick={onNext}
                        className="inline-flex items-center px-8 py-4 rounded-full font-bold transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-lg shadow-lime-300/30 hover:shadow-xl hover:shadow-lime-300/40 hover:-translate-y-1"
                    >
                        Continue Your Journey
                        <ArrowRight size={20} className="ml-2" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JourneyComponent; 