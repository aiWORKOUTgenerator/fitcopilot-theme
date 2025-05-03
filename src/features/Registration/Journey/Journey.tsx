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
import React, { useCallback, useEffect, useRef } from 'react';
import { RegistrationStep, RegistrationStepProps, WorkoutGoal } from '../types';
import { JourneyProvider, useJourney } from './components/JourneyContext';
import JourneyStepCard, { JourneyStepData } from './components/JourneyStepCard';
import SavingIndicator from './components/SavingIndicator';
import './Journey.scss';

// Main component definition - this wraps the JourneyContent with JourneyProvider
const JourneyComponent: React.FC<RegistrationStepProps & { currentStep: RegistrationStep }> = (props) => {
    return (
        <JourneyProvider initialData={props.data}>
            <JourneyContent {...props} />
            <SavingIndicator />
        </JourneyProvider>
    );
};

// Internal component that consumes the JourneyContext
const JourneyContent: React.FC<RegistrationStepProps & { currentStep: RegistrationStep }> = ({
    data,
    updateData,
    onNext,
    onBack,
    currentStep
}) => {
    const {
        expandedStep,
        updateRegistrationData,
        markStepComplete
    } = useJourney();

    const containerRef = useRef<HTMLDivElement>(null);

    // Define the journey steps
    const journeySteps: JourneyStepData[] = [
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
            title: "Injuries and Medical Clearance",
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

    // Sync data with parent component
    useEffect(() => {
        // Whenever the parent's data changes, we should sync it with our context
        updateRegistrationData(data);
    }, [data, updateRegistrationData]);

    // Handle button click in a step
    const handleStepAction = useCallback((index: number) => {
        // Mark the step as complete
        markStepComplete(index);

        // Update registration data with selected goal if needed
        if (index === 0) {
            // For the first step, set a default workout goal if none is selected
            if (!data.goals || data.goals.length === 0) {
                const updatedData = {
                    ...data,
                    goals: [WorkoutGoal.OVERALL_FITNESS]
                };
                updateData(updatedData);
                updateRegistrationData(updatedData);
            }
        }

        // Proceed to next step in registration flow after a short delay
        setTimeout(() => {
            if (onNext) {
                onNext();
            }
        }, 300);
    }, [data, markStepComplete, onNext, updateData, updateRegistrationData]);

    // Render the journey component
    return (
        <div className="journey-step registration-step" ref={containerRef}>
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
                        <JourneyStepCard
                            key={index}
                            step={step}
                            index={index}
                            onStepAction={handleStepAction}
                        />
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