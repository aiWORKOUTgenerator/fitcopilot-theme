import { Activity, Dumbbell, Flame, Zap } from 'lucide-react';
import React from 'react';
import { WorkoutGoal } from '../../../types';
import { GoalOption } from './types';

// Storage key for goal selector data
export const STORAGE_KEY = 'fitcopilot_goal_selector';

// Maximum allowed goals to select
export const MAX_GOALS = 2;

// Min allowed goals to select
export const MIN_GOALS = 1;

/**
 * Available goal options
 */
export const GOAL_OPTIONS: GoalOption[] = [
    {
        id: 'strength-building',
        value: WorkoutGoal.STRENGTH,
        title: 'Strength Building',
        description: 'Focus on compound movements and progressive overload for maximum strength gains.',
        icon: <Dumbbell size={24} className="text-lime-200" />
    },
    {
        id: 'fat-loss',
        value: WorkoutGoal.WEIGHT_LOSS,
        title: 'Fat Loss',
        description: 'Optimize caloric deficit with the right mix of HIIT and steady-state cardio.',
        icon: <Flame size={24} className="text-lime-200" />
    },
    {
        id: 'muscle-growth',
        value: WorkoutGoal.MUSCLE_GAIN,
        title: 'Muscle Growth',
        description: 'Hypertrophy-focused programs with proper volume and intensity distribution.',
        icon: <Zap size={24} className="text-lime-200" />
    },
    {
        id: 'general-fitness',
        value: WorkoutGoal.OVERALL_FITNESS,
        title: 'General Fitness',
        description: 'Well-rounded programs balancing strength, endurance, and mobility.',
        icon: <Activity size={24} className="text-lime-200" />
    }
];
