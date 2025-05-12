/**
 * Common event handler type definitions for consistent typing across components
 */

import React from 'react';

/**
 * Base event handler type for synthetic events
 */
export type CommonEventHandler<T extends Element, E extends React.SyntheticEvent<T>> =
    (event: E) => void;

/**
 * Mouse event handlers
 */
export type MouseEventHandler<T extends Element = Element> =
    CommonEventHandler<T, React.MouseEvent<T>>;

export type ButtonClickHandler = MouseEventHandler<HTMLButtonElement>;
export type LinkClickHandler = MouseEventHandler<HTMLAnchorElement>;

/**
 * Form event handlers
 */
export type FormEventHandler<T extends Element = Element> =
    CommonEventHandler<T, React.FormEvent<T>>;

export type InputChangeHandler = FormEventHandler<HTMLInputElement>;
export type SelectChangeHandler = FormEventHandler<HTMLSelectElement>;
export type FormSubmitHandler = FormEventHandler<HTMLFormElement>;

/**
 * Media event handlers
 */
export type MediaEventHandler<T extends HTMLMediaElement = HTMLMediaElement> =
    CommonEventHandler<T, React.SyntheticEvent<T>>;

export type VideoLoadHandler = MediaEventHandler<HTMLVideoElement>;
export type AudioLoadHandler = MediaEventHandler<HTMLAudioElement>;

/**
 * Keyboard event handlers
 */
export type KeyboardEventHandler<T extends Element = Element> =
    CommonEventHandler<T, React.KeyboardEvent<T>>;

export type InputKeyPressHandler = KeyboardEventHandler<HTMLInputElement>;
export type ButtonKeyPressHandler = KeyboardEventHandler<HTMLButtonElement>;

/**
 * Input event handler types
 */
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type TextAreaChangeHandler = (event: TextAreaChangeEvent) => void;

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
export type KeyboardHandler = (event: KeyboardEvent) => void;

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