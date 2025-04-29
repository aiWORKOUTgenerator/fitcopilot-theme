import type { Meta, StoryObj } from '@storybook/react';
import {
    Award,
    Dumbbell,
    Heart,
    Medal
} from 'lucide-react';
import React from 'react';
import { PersonalTraining } from './index';
import { Trainer } from './types';

const mockTrainers: Trainer[] = [
    {
        id: "trainer-1",
        name: "Alex Rivera",
        image: "https://placehold.co/400x600/111827/CCFF00?text=Alex+R",
        specialty: "Strength & Conditioning",
        specialtyIcon: <Dumbbell size={14} />,
        bio: "Specialized in transforming physiques through science-based training protocols. Alex has helped over 200 clients achieve their fitness goals.",
        years: 8,
        clients: 178,
        featured: true,
        videoCard: {
            title: "High-Intensity Workout Demo",
            image: "https://placehold.co/800x450/111827/CCFF00?text=Workout+Demo",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
        }
    },
    {
        id: "trainer-2",
        name: "Morgan Chen",
        image: "https://placehold.co/400x600/111827/CCFF00?text=Morgan+C",
        specialty: "Nutrition & Weight Loss",
        specialtyIcon: <Heart size={14} />,
        bio: "Certified nutritionist and weight management specialist. Morgan creates personalized diet plans that complement your training regimen.",
        years: 6,
        clients: 152,
        featured: false
    },
    {
        id: "trainer-3",
        name: "Jordan Smith",
        image: "https://placehold.co/400x600/111827/CCFF00?text=Jordan+S",
        specialty: "Athletic Performance",
        specialtyIcon: <Award size={14} />,
        bio: "Former professional athlete who now trains competitors at all levels. Specializes in sport-specific training and performance enhancement.",
        years: 10,
        clients: 215,
        featured: false
    },
    {
        id: "trainer-4",
        name: "Taylor West",
        image: "https://placehold.co/400x600/111827/CCFF00?text=Taylor+W",
        specialty: "Mobility Specialist",
        specialtyIcon: <Medal size={14} />,
        bio: "Specializing in mobility training, injury prevention, and corrective exercise. Perfect for those looking to improve movement quality and reduce pain.",
        years: 4,
        clients: 89,
        featured: false
    }
];

const meta: Meta<typeof PersonalTraining> = {
    title: 'features/Homepage/PersonalTraining',
    component: PersonalTraining,
    parameters: {
        layout: 'fullscreen',
        backgrounds: {
            default: 'dark',
        },
        docs: {
            description: {
                component: 'Personal Training section showcasing trainers with different specialties. Supports default and gym variants.'
            }
        }
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'gym'],
            description: 'The visual style variant of the component',
            table: {
                defaultValue: { summary: 'default' }
            }
        },
        trainers: {
            description: 'Array of trainer data to display'
        }
    }
};

export default meta;
type Story = StoryObj<typeof PersonalTraining>;

// Default variant story
export const Default: Story = {
    args: {
        variant: 'default',
        trainers: mockTrainers
    },
    parameters: {
        backgrounds: {
            default: 'dark',
        },
        docs: {
            description: {
                story: 'Default design with dark background and lime/green accents.'
            }
        }
    }
};

// Gym variant story
export const Gym: Story = {
    args: {
        variant: 'gym',
        trainers: mockTrainers
    },
    parameters: {
        backgrounds: {
            default: 'light',
        },
        docs: {
            description: {
                story: 'Gym design with light background and purple/violet accents.'
            }
        }
    }
};

// Story with no trainers (should use default data)
export const NoTrainers: Story = {
    args: {
        variant: 'default',
    },
    parameters: {
        docs: {
            description: {
                story: 'Component with no trainers provided (should use default mock data).'
            }
        }
    }
}; 