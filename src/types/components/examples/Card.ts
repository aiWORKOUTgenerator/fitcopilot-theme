/**
 * Card Component Types
 * 
 * Type definitions for the Card component demonstrating the discriminated union pattern
 * with the 'variant' discriminator for styling variations.
 */

import {
    BaseComponentProps,
    WithChildrenProps
} from '../commonProps';
import { ExtendedCSSProperties } from '../cssTypes';

// ===== Base Card Props =====

/**
 * Base properties for all Card variants
 */
export interface BaseCardProps extends BaseComponentProps, WithChildrenProps {
    /** Card title */
    title?: string;

    /** Card subtitle */
    subtitle?: string;

    /** Whether to show a shadow */
    elevated?: boolean;

    /** Custom padding override */
    padding?: string;

    /** Border radius override */
    borderRadius?: string;

    /** Whether the card is clickable */
    clickable?: boolean;

    /** Click handler for clickable cards */
    onClick?: () => void;
}

// ===== Card Variants =====

/**
 * Content Card Props - Used for displaying content in a boxed container
 */
export interface ContentCardProps extends BaseCardProps {
    /** Card variant discriminator */
    variant: 'content';

    /** Content card footer */
    footer?: React.ReactNode;

    /** Whether to show a divider between content and footer */
    footerDivider?: boolean;
}

/**
 * Media Card Props - Used for displaying content with a media element
 */
export interface MediaCardProps extends BaseCardProps {
    /** Card variant discriminator */
    variant: 'media';

    /** URL of the media to display */
    mediaUrl: string;

    /** Media type */
    mediaType: 'image' | 'video';

    /** Alt text for the media */
    mediaAlt?: string;

    /** Media aspect ratio */
    aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4';

    /** Media position */
    mediaPosition?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Profile Card Props - Used for displaying user profile information
 */
export interface ProfileCardProps extends BaseCardProps {
    /** Card variant discriminator */
    variant: 'profile';

    /** User avatar URL */
    avatarUrl: string;

    /** User name (overrides title) */
    name: string;

    /** User role or position (overrides subtitle) */
    role?: string;

    /** User information items */
    infoItems?: Array<{
        icon: React.ReactNode;
        text: string;
    }>;
}

/**
 * Stats Card Props - Used for displaying numeric statistics
 */
export interface StatsCardProps extends BaseCardProps {
    /** Card variant discriminator */
    variant: 'stats';

    /** Main statistic value */
    value: string | number;

    /** Value label */
    label: string;

    /** Change indicator value */
    change?: number;

    /** Icon to display with the stat */
    icon?: React.ReactNode;

    /** Chart data */
    chartData?: Array<number>;
}

// ===== Combined Card Type =====

/**
 * Combined Card type using discriminated union pattern with 'variant' as discriminator
 */
export type CardProps =
    | ContentCardProps
    | MediaCardProps
    | ProfileCardProps
    | StatsCardProps;

// ===== Custom Card Style Props =====

/**
 * Extended CSS properties specific to cards
 */
export interface CardCSSProperties extends ExtendedCSSProperties {
    '--card-header-bg'?: string;
    '--card-border-color'?: string;
    '--card-shadow'?: string;
    '--card-accent-color'?: string;
}

// ===== Type Guards =====

/**
 * Type guard for Content card variant
 */
export function isContentCard(props: CardProps): props is ContentCardProps {
    return props.variant === 'content';
}

/**
 * Type guard for Media card variant
 */
export function isMediaCard(props: CardProps): props is MediaCardProps {
    return props.variant === 'media';
}

/**
 * Type guard for Profile card variant
 */
export function isProfileCard(props: CardProps): props is ProfileCardProps {
    return props.variant === 'profile';
}

/**
 * Type guard for Stats card variant
 */
export function isStatsCard(props: CardProps): props is StatsCardProps {
    return props.variant === 'stats';
} 