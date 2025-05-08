import { ProgramType } from '../types';

/**
 * Default data for training programs (without React components)
 */
export const DEFAULT_PROGRAMS: Omit<ProgramType, 'icon'>[] = [
    {
        title: "Strength Building",
        description: "Focus on compound movements and progressive overload for maximum strength gains.",
        benefits: [
            "Scientifically proven strength progression",
            "Focus on fundamental movement patterns",
            "Optimal progressive overload protocols",
            "Strategic deload periods for recovery"
        ],
        programType: "strength"
    },
    {
        title: "Fat Loss",
        description: "Combination of HIIT, metabolic conditioning, and strategic nutrition for effective fat loss.",
        benefits: [
            "Metabolic conditioning protocols",
            "Nutritional guidance and meal templates",
            "Progressive cardiovascular training",
            "Body composition tracking tools"
        ],
        programType: "fatLoss"
    },
    {
        title: "General Fitness",
        description: "Well-rounded approach to improve all aspects of fitness with balanced programming.",
        benefits: [
            "Balanced strength and endurance training",
            "Functional movement patterns",
            "Flexibility and mobility work",
            "Adaptable to all fitness levels"
        ],
        programType: "fitness"
    },
    {
        title: "Athletic Performance",
        description: "Advanced training methodologies to enhance speed, power, and sports-specific performance.",
        benefits: [
            "Sport-specific movement optimization",
            "Explosive power development",
            "Speed and agility training protocols",
            "Recovery and performance tracking"
        ],
        programType: "athletic"
    }
];

/**
 * Default section title
 */
export const DEFAULT_SECTION_TITLE = "Specialized Programs";

/**
 * Default section description
 */
export const DEFAULT_SECTION_DESCRIPTION = "Our comprehensive training programs are designed to target specific fitness goals with proven methodologies and personalized approaches."; 