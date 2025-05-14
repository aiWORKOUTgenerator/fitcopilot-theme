/**
 * Button Test Fixtures
 * 
 * This file provides helpers to create test fixtures for button components.
 * These fixtures help maintain consistent test data and reduce test boilerplate.
 */

import {
    ButtonProps,
    FloatingActionButtonProps,
    IconButtonProps,
    IconType,
    LinkButtonProps,
    PrimaryButtonProps,
    SecondaryButtonProps,
    TextButtonProps,
    ToggleButtonProps,
    WorkoutButtonProps
} from '../types';

/**
 * Creates props for a primary button with default values
 */
export const createPrimaryButtonProps = (overrides: Partial<PrimaryButtonProps> = {}): PrimaryButtonProps => ({
    variant: 'primary',
    children: 'Primary Button',
    ...overrides
});

/**
 * Creates props for a secondary button with default values
 */
export const createSecondaryButtonProps = (overrides: Partial<SecondaryButtonProps> = {}): SecondaryButtonProps => ({
    variant: 'secondary',
    children: 'Secondary Button',
    ...overrides
});

/**
 * Creates props for a text button with default values
 */
export const createTextButtonProps = (overrides: Partial<TextButtonProps> = {}): TextButtonProps => ({
    variant: 'text',
    children: 'Text Button',
    ...overrides
});

/**
 * Creates props for a link button with default values
 */
export const createLinkButtonProps = (overrides: Partial<LinkButtonProps> = {}): LinkButtonProps => ({
    variant: 'link',
    href: 'https://example.com',
    children: 'Link Button',
    ...overrides
});

/**
 * Creates props for an icon button with default values
 */
export const createIconButtonProps = (overrides: Partial<IconButtonProps> = {}): IconButtonProps => {
    // Create a mock icon component without JSX for simplicity
    const MockIcon: IconType = () => null;

    return {
        variant: 'icon',
        icon: MockIcon,
        children: 'Icon Button',
        ...overrides
    };
};

/**
 * Creates props for a toggle button with default values
 */
export const createToggleButtonProps = (overrides: Partial<ToggleButtonProps> = {}): ToggleButtonProps => ({
    variant: 'toggle',
    isActive: false,
    children: 'Toggle Button',
    ...overrides
});

/**
 * Creates props for a floating action button with default values
 */
export const createFloatingActionButtonProps = (overrides: Partial<FloatingActionButtonProps> = {}): FloatingActionButtonProps => {
    // Create a mock icon component without JSX for simplicity
    const MockIcon: IconType = () => null;

    return {
        variant: 'floating',
        icon: MockIcon,
        children: 'Floating Action Button',
        ...overrides
    };
};

/**
 * Creates props for a workout button with default values
 */
export const createWorkoutButtonProps = (overrides: Partial<WorkoutButtonProps> = {}): WorkoutButtonProps => ({
    variant: 'workout',
    level: 'beginner',
    children: 'Workout Button',
    ...overrides
});

/**
 * Creates general button props with a specified variant
 */
export const createButtonProps = (variant = 'primary', overrides: Partial<ButtonProps> = {}): ButtonProps => {
    switch (variant) {
        case 'primary':
            return createPrimaryButtonProps(overrides);
        case 'secondary':
            return createSecondaryButtonProps(overrides);
        case 'text':
            return createTextButtonProps(overrides);
        case 'icon':
            return createIconButtonProps(overrides);
        case 'toggle':
            return createToggleButtonProps(overrides);
        case 'link':
            return createLinkButtonProps(overrides);
        case 'floating':
            return createFloatingActionButtonProps(overrides);
        case 'workout':
            return createWorkoutButtonProps(overrides);
        default:
            return createPrimaryButtonProps(overrides);
    }
}; 