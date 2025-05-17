import { ReactNode } from 'react';
import { PersonalTrainingVariant } from './utils/themeUtils';

/**
 * Global WordPress data structure for video content
 */
export interface WordPressVideoData {
    personalTraining?: {
        featuredTrainer?: {
            url: string;
            title: string;
            image: string;
        }
    }
}

/**
 * WordPress dashboard data structure
 */
export interface AthleteDashboardData {
    wpData: {
        videoData?: {
            personalTraining?: {
                featuredTrainer?: {
                    url: string;
                    title: string;
                    image: string;
                }
            }
        }
    }
}

// Declare global window interface to include WordPress data
declare global {
    interface Window {
        fitcopilotVideoData?: WordPressVideoData;
        athleteDashboardData?: AthleteDashboardData;
    }
}

/**
 * Personal Training component props
 */
export interface PersonalTrainingProps {
    /**
     * List of trainers to display in the section
     */
    trainers?: Trainer[];

    /**
     * Visual variant for the section
     * @default 'default'
     */
    variant?: PersonalTrainingVariant;
}

/**
 * Trainer object interface
 */
export interface Trainer {
    /**
     * Unique identifier for the trainer
     */
    id: string;

    /**
     * Trainer's full name
     */
    name: string;

    /**
     * Path to the trainer's profile image
     */
    image: string;

    /**
     * Trainer's specialty area
     */
    specialty: string;

    /**
     * Icon to represent the trainer's specialty
     */
    specialtyIcon: ReactNode;

    /**
     * Short biography of the trainer
     */
    bio: string;

    /**
     * Years of experience
     */
    years: number;

    /**
     * Number of clients trained
     */
    clients: number;

    /**
     * Whether this is the featured trainer
     */
    featured: boolean;

    /**
     * Optional video card info for featured trainers
     */
    videoCard?: {
        /**
         * Title of the video
         */
        title: string;

        /**
         * Preview image for the video
         */
        image: string;

        /**
         * URL to the video
         */
        videoUrl: string;
    };
}

/**
 * Available theme variants for the PersonalTraining component
 * Must match the WordPress theme variant options
 */
export type VariantKey = 'default' | 'modern' | 'classic' | 'minimalist' | 'sports' | 'wellness'; 