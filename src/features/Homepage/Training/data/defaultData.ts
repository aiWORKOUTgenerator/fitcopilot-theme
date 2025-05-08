import React from 'react';
import { ProgramType } from '../types';

/**
 * Default data for training programs
 */
export const DEFAULT_PROGRAMS: ProgramType[] = [
    {
        title: "Strength Building",
        description: "Focus on compound movements and progressive overload for maximum strength gains.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width = "24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="program-icon" > <path d="M6 18a6 6 0 0 1-6-6V7c0-1.66 1.34-3 3-3h0c1.66 0 3 1.34 3 3h0c0-1.66 1.34-3 3-3h0c1.66 0 3 1.34 3 3h0c0-1.66 1.34-3 3-3h0c1.66 0 3 1.34 3 3v5a6 6 0 0 1-6 6h-6Z"> </path><path d="M6 10h12"></path > </svg>,
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
        icon: <svg xmlns="http://www.w3.org/2000/svg" width = "24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="program-icon" > <rect width="20" height = "14" x="2" y="5" rx="2" > </rect><line x1="2" x2="22" y1="10" y2="10"></line > </svg>,
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
        icon: <svg xmlns="http://www.w3.org/2000/svg" width = "24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="program-icon" > <path d="M12 22a8 8 0 0 0 0-16"> </path><path d="M12 6a8 8 0 0 0 0 16"></path > <path d="M12 2v4"> </path><path d="M12 18v4"></path > <path d="m4.93 4.93 2.83 2.83"> </path><path d="m16.24 16.24 2.83 2.83"></path > <path d="M2 12h4"> </path><path d="M18 12h4"></path > <path d="m4.93 19.07 2.83-2.83"> </path><path d="m16.24 7.76 2.83-2.83"></path > </svg>,
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
        icon: <svg xmlns="http://www.w3.org/2000/svg" width = "24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="program-icon" > <line x1="8" x2 = "12" y1="18" y2="2" > </line><line x1="12" x2="16" y1="2" y2="18"></line > <line x1="2" x2 = "22" y1="18" y2="18" > </line><line x1="2" x2="22" y1="22" y2="22"></line > </svg>,
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