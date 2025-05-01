import React from 'react';

/**
 * ButtonProps Interface
 * 
 * Defines the properties for the Button component
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button size variant */
    size?: 'small' | 'medium' | 'large';
    /** Button color variant */
    variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'gradient' | 'violet-indigo';
    /** Sets width to 100% when true */
    fullWidth?: boolean;
    /** Shows loading spinner and disables button when true */
    isLoading?: boolean;
    /** Icon to display before button text */
    leftIcon?: React.ReactNode;
    /** Icon to display after button text */
    rightIcon?: React.ReactNode;
    /** Theme context for specific styling (default or gym) */
    themeContext?: 'default' | 'gym' | string;
    /** Button content */
    children: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Button click handler */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Button type */
    type?: 'button' | 'submit' | 'reset';
    /** Additional HTML attributes */
    [key: string]: any;
} 