/**
 * Type guards for button components
 */
import {
  ButtonProps,
  ButtonSize,
  IconButtonProps,
  LinkButtonProps,
  ThemeButtonProps
} from '../types/button';

/**
 * Type guard to check if a button is a primary variant
 * 
 * @param props The button props
 * @returns Whether the button is a primary variant
 */
export function isPrimaryButton(props: ButtonProps): boolean {
  return props.variant === 'primary';
}

/**
 * Type guard to check if a button is a secondary variant
 * 
 * @param props The button props
 * @returns Whether the button is a secondary variant
 */
export function isSecondaryButton(props: ButtonProps): boolean {
  return props.variant === 'secondary';
}

/**
 * Type guard to check if a button is a text variant
 * 
 * @param props The button props
 * @returns Whether the button is a text variant
 */
export function isTextButton(props: ButtonProps): boolean {
  return props.variant === 'text';
}

/**
 * Type guard to check if a button is a danger variant
 * 
 * @param props The button props
 * @returns Whether the button is a danger variant
 */
export function isDangerButton(props: ButtonProps): boolean {
  return props.variant === 'danger';
}

/**
 * Type guard to check if a button is of a specific size
 * 
 * @param props The button props
 * @param size The size to check
 * @returns Whether the button is of the specified size
 */
export function isButtonSize(props: ButtonProps, size: ButtonSize): boolean {
  return props.size === size;
}

/**
 * Type guard to check if props are for an icon button
 * 
 * @param props The button props
 * @returns Whether the props are for an icon button
 */
export function isIconButton(props: ButtonProps): props is IconButtonProps {
  return 'icon' in props && !!props.icon;
}

/**
 * Type guard to check if props are for a link button
 * 
 * @param props The button props
 * @returns Whether the props are for a link button
 */
export function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return 'href' in props && typeof (props as LinkButtonProps).href === 'string';
}

/**
 * Type guard to check if props are for a themed button
 * 
 * @param props The button props
 * @returns Whether the props are for a themed button
 */
export function isThemeButton(props: ButtonProps): props is ThemeButtonProps {
  return 'themeVariant' in props;
}

/**
 * Type guard to check if a button is in loading state
 * 
 * @param props The button props
 * @returns Whether the button is in loading state
 */
export function isLoadingButton(props: ButtonProps): boolean {
  return 'isLoading' in props && !!props.isLoading;
}

/**
 * Type guard to check if a button is disabled
 * 
 * @param props The button props
 * @returns Whether the button is disabled
 */
export function isDisabledButton(props: ButtonProps): boolean {
  return 'disabled' in props && !!props.disabled;
}

/**
 * Toggle button props interface
 */
export interface ToggleButtonProps extends ButtonProps {
    isActive: boolean;
    onToggle?: (isActive: boolean) => void;
}

/**
 * Type guard to check if props are for a toggle button
 * 
 * @param props The button props
 * @returns Whether the props are for a toggle button
 */
export function isToggleButton(props: ButtonProps): props is ToggleButtonProps {
  return 'isActive' in props && typeof (props as ToggleButtonProps).isActive === 'boolean';
}

/**
 * Workout button props interface
 */
export interface WorkoutButtonProps extends ButtonProps {
    level?: 'beginner' | 'intermediate' | 'advanced';
    calories?: number;
    duration?: number;
}

/**
 * Type guard to check if props are for a workout button
 * 
 * @param props The button props
 * @returns Whether the props are for a workout button
 */
export function isWorkoutButton(props: ButtonProps): props is WorkoutButtonProps {
  return 'level' in props || 'calories' in props || 'duration' in props;
}

/**
 * Floating action button props interface
 */
export interface FloatingActionButtonProps extends ButtonProps {
    position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
}

/**
 * Type guard to check if props are for a floating action button
 * 
 * @param props The button props
 * @returns Whether the props are for a floating action button
 */
export function isFloatingActionButton(props: ButtonProps): props is FloatingActionButtonProps {
  return 'position' in props;
}

export default {
  isPrimaryButton,
  isSecondaryButton,
  isTextButton,
  isDangerButton,
  isButtonSize,
  isIconButton,
  isLinkButton,
  isThemeButton,
  isLoadingButton,
  isDisabledButton,
  isToggleButton,
  isWorkoutButton,
  isFloatingActionButton
}; 