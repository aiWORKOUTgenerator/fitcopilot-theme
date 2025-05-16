/**
 * Type-safe event testing utilities
 * 
 * This file provides utilities for simulating user events in tests with proper TypeScript
 * types to eliminate any 'any' types and provide better type safety.
 */

import { fireEvent as rtlFireEvent } from '@testing-library/react';
import { TestEventMap } from '../../types/events';

/**
 * Type-safe fireEvent function that enforces correct event types
 * 
 * @param element The DOM element to fire the event on
 * @param eventName The name of the event to fire
 * @param options Event options with proper typing based on event type
 * @returns The result of the fireEvent call
 */
export function fireEvent<K extends keyof TestEventMap>(
  element: HTMLElement,
  eventName: K,
  options?: Partial<TestEventMap[K]>
): boolean {
  return rtlFireEvent(element, rtlFireEvent[eventName](element, options));
}

/**
 * Create typed event options for form input changes
 * 
 * @param value The new input value
 * @returns Properly typed change event options
 */
export function createChangeOptions(value: string): Partial<TestEventMap['change']> {
  return {
    target: { value }
  } as Partial<TestEventMap['change']>;
}

/**
 * Create typed event options for checkbox changes
 * 
 * @param checked The new checked state
 * @returns Properly typed change event options
 */
export function createCheckboxOptions(checked: boolean): Partial<TestEventMap['change']> {
  return {
    target: { checked }
  } as Partial<TestEventMap['change']>;
}

/**
 * Create typed event options for selection changes
 * 
 * @param value The new selected value
 * @returns Properly typed change event options
 */
export function createSelectOptions(value: string): Partial<TestEventMap['change']> {
  return {
    target: { value }
  } as Partial<TestEventMap['change']>;
}

/**
 * Type-safe event helper for input change
 * 
 * @param element The input element
 * @param value The new input value
 * @returns The result of the fireEvent call
 */
export function changeInput(element: HTMLInputElement | HTMLTextAreaElement, value: string): boolean {
  return fireEvent(element, 'change', createChangeOptions(value));
}

/**
 * Type-safe event helper for checkbox change
 * 
 * @param element The checkbox element
 * @param checked The new checked state
 * @returns The result of the fireEvent call
 */
export function changeCheckbox(element: HTMLInputElement, checked: boolean): boolean {
  return fireEvent(element, 'change', createCheckboxOptions(checked));
}

/**
 * Type-safe event helper for select change
 * 
 * @param element The select element
 * @param value The new selected value
 * @returns The result of the fireEvent call
 */
export function changeSelect(element: HTMLSelectElement, value: string): boolean {
  return fireEvent(element, 'change', createSelectOptions(value));
}

/**
 * Type-safe event helper for button click
 * 
 * @param element The button element
 * @returns The result of the fireEvent call
 */
export function clickButton(element: HTMLButtonElement | HTMLAnchorElement): boolean {
  return fireEvent(element, 'click', {});
}

/**
 * Type-safe event helper for form submission
 * 
 * @param element The form element
 * @returns The result of the fireEvent call
 */
export function submitForm(element: HTMLFormElement): boolean {
  return fireEvent(element, 'submit', {});
} 