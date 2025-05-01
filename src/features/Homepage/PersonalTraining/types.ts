import { ReactNode } from 'react';

export interface Trainer {
    id: string;
    name: string;
    image?: string;
    specialty: string;
    specialtyIcon: ReactNode;
    bio: string;
    years: number;
    clients: number;
    featured?: boolean;
    videoCard?: {
        title: string;
        image?: string;
        videoUrl?: string;
    };
}

/**
 * Available theme variants for the PersonalTraining component
 * Must match the WordPress theme variant options
 */
export type VariantKey = 'default' | 'modern' | 'classic' | 'minimalist' | 'sports' | 'wellness';

/**
 * Props for the PersonalTraining component
 */
export interface PersonalTrainingProps {
    trainers?: Trainer[];
    variant?: VariantKey;
} 