/**
 * Type guards for button components
 * 
 * This file contains type guard implementations for safely working with
 * button component variants. These guards help with type narrowing to ensure
 * type safety when handling different button variants.
 */

import {
    ActionButtonProps,
    ButtonProps,
    IconButtonProps,
    LinkButtonProps
} from '../../types/button';

/**
 * Type guard to check if props are for an action button
 * 
 * @param props The button props to check
 * @returns Type predicate indicating if props are for an action button
 */
export function isActionButton(props: ButtonProps): props is ActionButtonProps {
    return 'onClick' in props && typeof props.onClick === 'function';
}

/**
 * Type guard to check if props are for a link button
 * 
 * @param props The button props to check
 * @returns Type predicate indicating if props are for a link button
 */
export function isLinkButton(props: ButtonProps): props is LinkButtonProps {
    return 'href' in props && typeof props.href === 'string';
}

/**
 * Type guard to check if props are for an icon button
 * 
 * @param props The button props to check
 * @returns Type predicate indicating if props are for an icon button
 */
export function isIconButton(props: ButtonProps): props is IconButtonProps {
    return 'icon' in props && !!props.icon;
}

/**
 * Type guard to check if a button is disabled
 * 
 * @param props The button props to check
 * @returns Whether the button is disabled
 */
export function isDisabled(props: ButtonProps): boolean {
    return 'disabled' in props && !!props.disabled;
}

/**
 * Type guard to check if a button is loading
 * 
 * @param props The button props to check
 * @returns Whether the button is in loading state
 */
export function isLoading(props: ButtonProps): boolean {
    return 'isLoading' in props && !!props.isLoading;
}

export default {
    isActionButton,
    isLinkButton,
    isIconButton,
    isDisabled,
    isLoading
}; 