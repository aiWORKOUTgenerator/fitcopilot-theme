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

export interface PersonalTrainingProps {
    trainers?: Trainer[];
    variant?: 'default' | 'gym';
}

// Export VariantKey for consistency with other components
export type VariantKey = 'default' | 'gym' | 'mobile'; 