import React from 'react';
import logger from '../../../../utils/logger';

/**
 * Type for theme variants supported by buttons
 */
export type VariantKey = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';

/**
 * Size options for buttons
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Base properties common to all button variants
 */
export interface BaseButtonProps {
    /**
     * Visual variant of the button
     */
    variant?: VariantKey;

    /**
     * Size of the button
     */
    size?: ButtonSize;

    /**
     * Disables the button and prevents interactions
     */
    disabled?: boolean;

    /**
     * Additional CSS classes to apply
     */
    className?: string;

    /**
     * Button content
     */
    children: React.ReactNode;

    /**
     * Accessibility attributes
     */
    'aria-label'?: string;

    /**
     * Data attributes for testing
     */
    'data-testid'?: string;
}

/**
 * Event handler type for button clicks
 */
export type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

/**
 * Properties for buttons that perform actions (standard buttons)
 */
export interface ActionButtonProps extends BaseButtonProps {
    /**
     * Click handler for the button
     */
    onClick: ButtonClickHandler;

    /**
     * HTML button type attribute
     */
    type?: 'button' | 'submit' | 'reset';

    /**
     * Discriminator property to help TypeScript distinguish this variant
     * @internal
     */
    href?: never;
}

/**
 * Properties for buttons that navigate to URLs (link buttons)
 */
export interface LinkButtonProps extends BaseButtonProps {
    /**
     * URL the button should navigate to
     */
    href: string;

    /**
     * Target window for the link
     */
    target?: '_blank' | '_self' | '_parent' | '_top';

    /**
     * Relationship attribute for links
     */
    rel?: string;

    /**
     * Discriminator property to help TypeScript distinguish this variant
     * @internal
     */
    onClick?: never;

    /**
     * Discriminator property to help TypeScript distinguish this variant
     * @internal
     */
    type?: never;
}

/**
 * Union type of all possible button props
 */
export type ButtonProps = ActionButtonProps | LinkButtonProps;

/**
 * Type guard to check if button props represent a link button
 * 
 * @param props - Button properties to check
 * @returns True if the props are for a link button
 */
export const isLinkButton = (props: ButtonProps): props is LinkButtonProps => {
  return 'href' in props && typeof props.href === 'string';
};

/**
 * Type guard to check if button props represent an action button
 * 
 * @param props - Button properties to check
 * @returns True if the props are for an action button
 */
export const isActionButton = (props: ButtonProps): props is ActionButtonProps => {
  return 'onClick' in props && typeof props.onClick === 'function';
};

/**
 * Creates a logged button click handler that logs the event before calling the original handler
 * 
 * @param handler - Original click handler
 * @param context - Additional context to log
 * @returns New handler that logs and then calls the original
 */
export const createLoggedClickHandler = (
  handler: ButtonClickHandler,
  context: Record<string, unknown>
): ButtonClickHandler => {
  return (event: React.MouseEvent<HTMLButtonElement>) => {
    logger.info('Button clicked', context);
    handler(event);
  };
}; 