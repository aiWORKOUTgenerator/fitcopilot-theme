/**
 * Common event handler type definitions
 * Used to replace 'any' type usage throughout the codebase
 */

import React from 'react';

/**
 * Button event handler types
 */
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
export type ButtonClickHandler = React.MouseEventHandler<HTMLButtonElement>;

/**
 * Input event handler types
 */
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type InputChangeHandler = React.ChangeEventHandler<HTMLInputElement>;

export type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type TextAreaChangeHandler = (event: TextAreaChangeEvent) => void;

export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type SelectChangeHandler = React.ChangeEventHandler<HTMLSelectElement>;

/**
 * Form event handler types
 */
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;
export type FormSubmitHandler = React.FormEventHandler<HTMLFormElement>;

/**
 * Focus event handler types
 */
export type FocusEvent = React.FocusEvent<HTMLElement>;
export type FocusHandler = (event: FocusEvent) => void;
export type FocusEventHandler<T = Element> = React.FocusEventHandler<T>;

/**
 * General element event handler types
 */
export type ElementClickEvent = React.MouseEvent<HTMLElement, MouseEvent>;
export type ElementClickHandler = (event: ElementClickEvent) => void;

/**
 * Keyboard event handler types
 */
export type KeyboardEvent = React.KeyboardEvent<HTMLElement>;
export type KeyboardHandler = (event: KeyboardEvent) => void;
export type KeyboardEventHandler<T = Element> = React.KeyboardEventHandler<T>;

/**
 * Drag event handler types
 */
export type DragEvent = React.DragEvent<HTMLElement>;
export type DragHandler = (event: DragEvent) => void;

/**
 * General component event handlers with generic parameter
 */
export type ComponentChangeHandler<T = string> = (value: T) => void;
export type ComponentActionHandler = () => void;

/**
 * Generic event with typed payload
 */
export interface ComponentEvent<T = unknown> {
    type: string;
    payload: T;
}

/**
 * Type-safe event emitter pattern
 */
export type EventListener<T = unknown> = (event: ComponentEvent<T>) => void;
export type EventEmitter<T = unknown> = (event: ComponentEvent<T>) => void;

/**
 * Generic callback types
 */
export type VoidCallback = () => void;
export type DataCallback<T> = (data: T) => void;
export type ErrorCallback = (error: Error) => void;
export type StatusCallback = (success: boolean, message?: string) => void;

/**
 * Common component event props
 */
export interface ComponentEventProps {
    onClick?: ElementClickHandler;
    onFocus?: FocusHandler;
    onBlur?: FocusHandler;
    onKeyDown?: KeyboardHandler;
    onKeyUp?: KeyboardHandler;
    onChange?: ComponentChangeHandler;
    onSubmit?: FormSubmitHandler;
}

/**
 * Touch event handler type
 */
export type TouchEventHandler<T = Element> = React.TouchEventHandler<T>;

/**
 * Ref callback for button elements
 */
export type ButtonRefCallback = React.RefCallback<HTMLButtonElement>;

/**
 * Ref callback for input elements
 */
export type InputRefCallback = React.RefCallback<HTMLInputElement>;

/**
 * Ref callback for form elements
 */
export type FormRefCallback = React.RefCallback<HTMLFormElement>; 