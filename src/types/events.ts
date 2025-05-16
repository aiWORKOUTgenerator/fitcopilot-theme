/**
 * Common event handler type definitions for consistent typing across components
 * 
 * This file provides centralized definitions for all event handlers to eliminate
 * 'any' type usage and provide consistent naming patterns.
 */

import React from 'react';

// ========================================================================
// GENERIC EVENT HANDLER TYPES
// ========================================================================

/**
 * Base event handler type for synthetic events
 */
export type CommonEventHandler<T extends Element, E extends React.SyntheticEvent<T>> =
    (event: E) => void;

/**
 * Generic callback types
 */
export type VoidCallback = () => void;
export type DataCallback<T> = (data: T) => void;
export type ErrorCallback = (error: Error) => void;
export type StatusCallback = (success: boolean, message?: string) => void;

// ========================================================================
// MOUSE EVENT HANDLER TYPES
// ========================================================================

/**
 * Mouse event handlers
 */
export type MouseEventHandler<T extends Element = Element> =
    CommonEventHandler<T, React.MouseEvent<T>>;

export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type ButtonClickHandler = MouseEventHandler<HTMLButtonElement>;

export type LinkClickEvent = React.MouseEvent<HTMLAnchorElement>;
export type LinkClickHandler = MouseEventHandler<HTMLAnchorElement>;

export type ElementClickEvent = React.MouseEvent<HTMLElement, MouseEvent>;
export type ElementClickHandler = (event: ElementClickEvent) => void;

// ========================================================================
// FORM EVENT HANDLER TYPES
// ========================================================================

/**
 * Form event handlers
 */
export type FormEventHandler<T extends Element = Element> =
    CommonEventHandler<T, React.FormEvent<T>>;

export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;
export type FormSubmitHandler = FormEventHandler<HTMLFormElement>;

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type InputChangeHandler = FormEventHandler<HTMLInputElement>;

export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type SelectChangeHandler = FormEventHandler<HTMLSelectElement>;

export type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type TextAreaChangeHandler = (event: TextAreaChangeEvent) => void;

// ========================================================================
// MEDIA EVENT HANDLER TYPES
// ========================================================================

/**
 * Media event handlers
 */
export type MediaEventHandler<T extends HTMLMediaElement = HTMLMediaElement> =
    CommonEventHandler<T, React.SyntheticEvent<T>>;

export type VideoLoadHandler = MediaEventHandler<HTMLVideoElement>;
export type AudioLoadHandler = MediaEventHandler<HTMLAudioElement>;

export type MediaLoadHandler = (event: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>) => void;
export type MediaErrorHandler = (event: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>) => void;

// ========================================================================
// KEYBOARD EVENT HANDLER TYPES
// ========================================================================

/**
 * Keyboard event handlers
 */
export type KeyboardEventHandler<T extends Element = Element> =
    CommonEventHandler<T, React.KeyboardEvent<T>>;

export type KeyboardEvent = React.KeyboardEvent<HTMLElement>;
export type KeyboardHandler = (event: KeyboardEvent) => void;

export type InputKeyPressHandler = KeyboardEventHandler<HTMLInputElement>;
export type ButtonKeyPressHandler = KeyboardEventHandler<HTMLButtonElement>;

// ========================================================================
// FOCUS EVENT HANDLER TYPES
// ========================================================================

/**
 * Focus event handler types
 */
export type FocusEvent = React.FocusEvent<HTMLElement>;
export type FocusHandler = (event: FocusEvent) => void;
export type FocusEventHandler<T = Element> = React.FocusEventHandler<T>;

export type BlurEvent = React.FocusEvent<HTMLElement>;
export type BlurEventHandler = (event: BlurEvent) => void;

// ========================================================================
// TOUCH EVENT HANDLER TYPES
// ========================================================================

/**
 * Touch event handler type
 */
export type TouchEventHandler<T = Element> = React.TouchEventHandler<T>;

// ========================================================================
// DRAG EVENT HANDLER TYPES
// ========================================================================

/**
 * Drag event handler types
 */
export type DragEvent = React.DragEvent<HTMLElement>;
export type DragHandler = (event: DragEvent) => void;

// ========================================================================
// COMPONENT EVENT HANDLER TYPES
// ========================================================================

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

// ========================================================================
// REF CALLBACK TYPES
// ========================================================================

/**
 * Ref callback types
 */
export type ButtonRefCallback = React.RefCallback<HTMLButtonElement>;
export type InputRefCallback = React.RefCallback<HTMLInputElement>;
export type FormRefCallback = React.RefCallback<HTMLFormElement>;

// ========================================================================
// COMPONENT-SPECIFIC EVENT HANDLER TYPES
// ========================================================================

/**
 * Card event handler types
 */
export type CardClickHandler = (event: React.MouseEvent<HTMLDivElement>) => void;
export type CardButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

/**
 * Event handler for components with custom events
 */
export type CustomEventHandler<T = Record<string, unknown>> = (data: T) => void;

/**
 * Centralized event type definitions for the application
 * 
 * This file contains type definitions for DOM events used throughout the application,
 * including tests. It provides consistent, type-safe event handling.
 */

// ========================================================================
// DOM ELEMENT EVENTS
// ========================================================================

export type ButtonElement = HTMLButtonElement | HTMLAnchorElement;
export type InputElement = HTMLInputElement | HTMLTextAreaElement;
export type SelectElement = HTMLSelectElement;
export type FormElement = HTMLFormElement;

// ========================================================================
// KEYBOARD EVENTS
// ========================================================================

export type InputKeyboardEvent = React.KeyboardEvent<InputElement>;
export type InputKeyboardEventHandler = (event: InputKeyboardEvent) => void;

// ========================================================================
// FOCUS EVENTS
// ========================================================================

export type InputFocusEvent = React.FocusEvent<InputElement>;
export type InputFocusHandler = (event: InputFocusEvent) => void;

// ========================================================================
// TESTING EVENT MAP
// ========================================================================

/**
 * Maps event names to their corresponding event types for testing
 * This is used to provide type-safety for fireEvent functions
 */
export interface TestEventMap {
    click: ButtonClickEvent;
    change: InputChangeEvent | SelectChangeEvent;
    submit: FormSubmitEvent;
    keyDown: KeyboardEvent;
    keyUp: KeyboardEvent;
    keyPress: KeyboardEvent;
    focus: FocusEvent;
    blur: FocusEvent;
    mouseEnter: ElementClickEvent;
    mouseLeave: ElementClickEvent;
    mouseOver: ElementClickEvent;
    mouseOut: ElementClickEvent;
} 