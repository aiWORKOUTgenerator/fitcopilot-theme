/**
 * Type guards for card components
 * 
 * This file contains type guard implementations for safely working with
 * card component variants. These guards help with type narrowing to ensure
 * type safety when handling different card variants.
 */

import {
  CardProps,
  ContentCardProps,
  PricingCardProps,
  ProfileCardProps,
  ProgramCardProps,
  WorkoutCardProps
} from '../../types/card';

/**
 * Type guard to check if props are for a content card
 * 
 * @param props The card props to check
 * @returns Type predicate indicating if props are for a content card
 */
export function isContentCard(props: CardProps): props is ContentCardProps {
  return props.variant === 'content';
}

/**
 * Type guard to check if props are for a profile card
 * 
 * @param props The card props to check
 * @returns Type predicate indicating if props are for a profile card
 */
export function isProfileCard(props: CardProps): props is ProfileCardProps {
  return props.variant === 'profile';
}

/**
 * Type guard to check if props are for a workout card
 * 
 * @param props The card props to check
 * @returns Type predicate indicating if props are for a workout card
 */
export function isWorkoutCard(props: CardProps): props is WorkoutCardProps {
  return props.variant === 'workout';
}

/**
 * Type guard to check if props are for a program card
 * 
 * @param props The card props to check
 * @returns Type predicate indicating if props are for a program card
 */
export function isProgramCard(props: CardProps): props is ProgramCardProps {
  return props.variant === 'program';
}

/**
 * Type guard to check if props are for a pricing card
 * 
 * @param props The card props to check
 * @returns Type predicate indicating if props are for a pricing card
 */
export function isPricingCard(props: CardProps): props is PricingCardProps {
  return props.variant === 'pricing';
}

/**
 * Type guard to check if a card has a media element
 * 
 * @param props The card props to check
 * @returns Whether the card has a media element
 */
export function hasMedia(props: CardProps): boolean {
  return 'media' in props && !!props.media;
}

/**
 * Type guard to check if a card has an error
 * 
 * @param props The card props to check
 * @returns Whether the card has an error
 */
export function hasError(props: CardProps): boolean {
  return 'error' in props && !!props.error;
}

/**
 * Type guard to check if a card is in loading state
 * 
 * @param props The card props to check
 * @returns Whether the card is in loading state
 */
export function isLoading(props: CardProps): boolean {
  return 'isLoading' in props && !!props.isLoading;
}

/**
 * Type guard to check if a card is interactive (has onClick handler)
 * 
 * @param props The card props to check
 * @returns Whether the card is interactive
 */
export function isInteractive(props: CardProps): boolean {
  return 'onClick' in props && typeof props.onClick === 'function';
}

export default {
  isContentCard,
  isProfileCard,
  isWorkoutCard,
  isProgramCard,
  isPricingCard,
  hasMedia,
  hasError,
  isLoading,
  isInteractive
}; 