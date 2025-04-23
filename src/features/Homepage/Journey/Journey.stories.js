import { jsx as _jsx } from "react/jsx-runtime";
import { BarChart2, Package, Settings, Target } from 'lucide-react';
import { Journey } from './Journey';
/**
 * Journey component documentation
 */
const meta = {
    title: 'features/Homepage/Journey',
    component: Journey,
    parameters: {
        layout: 'fullscreen',
        backgrounds: {
            default: 'dark'
        },
        docs: {
            description: {
                component: 'The Journey component displays the user journey/process flow with expandable step cards that reveal detailed features. Each step includes an icon, title, description, and can be expanded to show detailed features and a call-to-action.'
            }
        }
    }
};
export default meta;
// Define custom journey steps for use in stories
const customJourneySteps = [
    {
        id: 1,
        number: 1,
        title: 'Create Your Profile',
        description: 'Answer a few questions about your fitness level, goals, and available equipment.',
        icon: _jsx(Target, { size: 40, className: "text-gray-900" }),
        delay: 100,
        accentColor: "from-lime-300 to-emerald-400",
        ctaText: "Create Profile",
        detailedFeatures: [
            {
                title: "Experience Level",
                description: "Beginner, intermediate, or advanced - we adjust the workouts accordingly.",
                icon: _jsx(Settings, { size: 24, className: "text-lime-200" })
            },
            {
                title: "Fitness Goals",
                description: "Strength, muscle growth, weight loss, or overall fitness.",
                icon: _jsx(Target, { size: 24, className: "text-lime-200" })
            }
        ]
    },
    {
        id: 2,
        number: 2,
        title: 'Generate Your Workout',
        description: 'Our AI creates a personalized workout plan tailored to your specific needs and preferences.',
        icon: _jsx(Package, { size: 40, className: "text-gray-900" }),
        delay: 200,
        accentColor: "from-violet-300 to-purple-400",
        ctaText: "Generate Workout",
        detailedFeatures: [
            {
                title: "AI-Powered",
                description: "Advanced algorithms design your optimal workout routine.",
                icon: _jsx(Settings, { size: 24, className: "text-violet-200" })
            },
            {
                title: "Personalized",
                description: "Every detail is customized to your specific goals and constraints.",
                icon: _jsx(Package, { size: 24, className: "text-violet-200" })
            }
        ]
    },
    {
        id: 3,
        number: 3,
        title: 'Track Progress',
        description: 'Monitor your improvements over time and adjust your plan as you achieve your goals.',
        icon: _jsx(BarChart2, { size: 40, className: "text-gray-900" }),
        delay: 300,
        accentColor: "from-amber-300 to-orange-400",
        ctaText: "View Dashboard",
        detailedFeatures: [
            {
                title: "Performance Tracking",
                description: "Record your workouts and see your progress visually.",
                icon: _jsx(BarChart2, { size: 24, className: "text-amber-200" })
            },
            {
                title: "Goal Adjustments",
                description: "Change your goals as you progress and get new workouts.",
                icon: _jsx(Settings, { size: 24, className: "text-amber-200" })
            }
        ]
    }
];
/**
 * Default state of the Journey component
 */
export const Default = {
    parameters: {
        docs: {
            description: {
                story: 'Default Journey section with four expandable steps and detailed features. Each step can be clicked to expand and show more details.'
            }
        }
    }
};
/**
 * Variant example for the Journey component
 */
export const CustomJourney = {
    args: {
        journey: customJourneySteps
    },
    parameters: {
        docs: {
            description: {
                story: 'Journey section with custom steps, showcasing how the component can be configured with different content.'
            }
        }
    }
};
