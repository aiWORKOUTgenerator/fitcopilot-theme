import { ProgramType } from '../../types';

/**
 * Props interface for the ProgramCard component
 */
export interface ProgramCardProps {
    /**
     * Program data to display
     */
    program: ProgramType;

    /**
     * Whether the program card is currently active/expanded
     */
    isActive?: boolean;

    /**
     * Handler for toggling the program card expanded state
     */
    onToggle?: () => void;

    /**
     * Handler for the Learn More action
     */
    onLearnMore?: (programTitle: string) => void;

    /**
     * Visual variant of the card
     * @default 'default'
     */
    variant?: 'default' | 'sports' | 'boutique' | 'classic' | 'minimalist' | 'modern' | 'wellness';

    /**
     * Additional CSS class names
     */
    className?: string;
} 