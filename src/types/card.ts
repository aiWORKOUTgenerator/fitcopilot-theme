/**
 * Card component type definitions
 * 
 * This file provides centralized type definitions for all card-related components
 * using a discriminated union pattern for strong typing.
 */

import React from 'react';

/**
 * Base card props shared across all card variants
 */
export interface BaseCardProps {
    /** Optional ID attribute */
    id?: string;
    /** Additional CSS class name */
    className?: string;
    /** Custom inline styles */
    style?: React.CSSProperties;
    /** Whether the card is in loading state */
    isLoading?: boolean;
    /** Error message to display */
    error?: string;
    /** Data test ID for testing */
    'data-testid'?: string;
    /** Card content */
    children?: React.ReactNode;
    /** Theme variant */
    theme?: 'default' | 'gym' | 'sports' | 'wellness';
    /** Card size */
    size?: 'sm' | 'md' | 'lg';
    /** Card layout orientation */
    layout?: 'vertical' | 'horizontal';
    /** Optional click handler */
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /** Whether the card has a border */
    bordered?: boolean;
    /** Card elevation level */
    elevation?: 'none' | 'low' | 'medium' | 'high';
}

/**
 * Content card type for general content display
 */
export interface ContentCardProps extends BaseCardProps {
    /** Variant discriminator */
    variant: 'content';
    /** Card title */
    title: string;
    /** Optional description */
    description?: string;
    /** Optional media element */
    media?: React.ReactNode;
    /** Footer content */
    footer?: React.ReactNode;
}

/**
 * Profile card for user information
 */
export interface ProfileCardProps extends BaseCardProps {
    /** Variant discriminator */
    variant: 'profile';
    /** User's name */
    name: string;
    /** Optional avatar URL */
    avatarUrl?: string;
    /** Optional user bio */
    bio?: string;
    /** Optional media element */
    media?: React.ReactNode;
    /** Optional user role or title */
    role?: string;
    /** Optional contact information */
    contact?: {
        email?: string;
        phone?: string;
        social?: {
            platform: string;
            url: string;
        }[];
    };
}

/**
 * Workout card for displaying workout information
 */
export interface WorkoutCardProps extends BaseCardProps {
    /** Variant discriminator */
    variant: 'workout';
    /** Name of the workout */
    workoutName: string;
    /** Difficulty level */
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    /** Duration in minutes */
    duration?: number;
    /** Whether the workout is bookmarked */
    isBookmarked?: boolean;
    /** Callback when bookmark status changes */
    onBookmark?: (id: string, isBookmarked: boolean) => void;
    /** Optional media element */
    media?: React.ReactNode;
    /** Calories burned estimate */
    calories?: number;
    /** Equipment needed */
    equipment?: string[];
    /** Primary workout focus areas */
    targets?: string[];
}

/**
 * Program card for workout program information
 */
export interface ProgramCardProps extends BaseCardProps {
    /** Variant discriminator */
    variant: 'program';
    /** Program name */
    programName: string;
    /** Program difficulty level */
    level?: string;
    /** Short program summary */
    summary?: string;
    /** Optional media element */
    media?: React.ReactNode;
    /** Number of workouts in program */
    workoutCount?: number;
    /** Total program duration in days/weeks */
    duration?: string;
    /** Program completion percentage */
    completionPercentage?: number;
}

/**
 * Pricing card for subscription/membership options
 */
export interface PricingCardProps extends BaseCardProps {
    /** Variant discriminator */
    variant: 'pricing';
    /** Plan name */
    planName: string;
    /** Price amount */
    price: number | string;
    /** Billing period */
    period?: string;
    /** List of features/benefits */
    features: string[];
    /** CTA button text */
    ctaText: string;
    /** CTA button link */
    ctaHref?: string;
    /** Whether this is the most popular plan */
    popular?: boolean;
    /** CTA button click handler */
    onCtaClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Discount percentage or amount */
    discount?: string | number;
}

/**
 * Discriminated union type of all card variants
 */
export type CardProps =
    | ContentCardProps
    | ProfileCardProps
    | WorkoutCardProps
    | ProgramCardProps
    | PricingCardProps; 