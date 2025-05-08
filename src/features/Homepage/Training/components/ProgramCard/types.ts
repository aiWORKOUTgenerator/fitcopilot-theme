import { ProgramType, VariantKey } from '../../types';

/**
 * ARIA IDs for accessibility
 */
export interface ProgramAriaIds {
    /**
     * ID for the program card element
     */
    cardId?: string;

    /**
     * ID for the program title element
     */
    titleId?: string;

    /**
     * ID for the expanded content container
     */
    contentId?: string;

    /**
     * ID for the benefits list section
     */
    benefitsId?: string;
}

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
    variant?: VariantKey;

    /**
     * Additional CSS class names
     */
    className?: string;

    /**
     * ARIA IDs for accessibility
     */
    ariaIds?: ProgramAriaIds;
} 