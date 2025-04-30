import { ReactElement } from 'react';

export interface PersonalTrainingProps {
    trainers?: Trainer[];
    variant?: VariantKey;
}

export interface Trainer {
    id: string;
    name: string;
    specialty: string;
    specialtyIcon: ReactElement;
    imageSrc: string;
    bio: string;
    clients: number;
    experience: number;
    youtubeId?: string;
}

// Export VariantKey for consistency with other components
export type VariantKey = 'default' | 'gym' | 'mobile'; 