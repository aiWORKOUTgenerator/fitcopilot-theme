/**
 * Event Types
 * 
 * This file contains centralized type definitions for event handlers used throughout the application.
 * Following the pattern of defining both the event type and handler type for better type safety.
 */

import React from 'react';

// ===== Basic DOM Events =====

/**
 * Basic click event types for different HTML elements
 */
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type DivClickEvent = React.MouseEvent<HTMLDivElement>;
export type LinkClickEvent = React.MouseEvent<HTMLAnchorElement>;
export type SpanClickEvent = React.MouseEvent<HTMLSpanElement>;
export type ImageClickEvent = React.MouseEvent<HTMLImageElement>;

/**
 * Basic click event handler types
 */
export type ButtonClickHandler = (event: ButtonClickEvent) => void;
export type DivClickHandler = (event: DivClickEvent) => void;
export type LinkClickHandler = (event: LinkClickEvent) => void;
export type SpanClickHandler = (event: SpanClickEvent) => void;
export type ImageClickHandler = (event: ImageClickEvent) => void;

// ===== Form Events =====

/**
 * Input element events
 */
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type InputFocusEvent = React.FocusEvent<HTMLInputElement>;
export type InputBlurEvent = React.FocusEvent<HTMLInputElement>;
export type InputKeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

/**
 * Input element event handlers
 */
export type InputChangeHandler = (event: InputChangeEvent) => void;
export type InputFocusHandler = (event: InputFocusEvent) => void;
export type InputBlurHandler = (event: InputBlurEvent) => void;
export type InputKeyboardHandler = (event: InputKeyboardEvent) => void;

/**
 * Textarea element events
 */
export type TextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type TextareaFocusEvent = React.FocusEvent<HTMLTextAreaElement>;
export type TextareaBlurEvent = React.FocusEvent<HTMLTextAreaElement>;

/**
 * Textarea element event handlers
 */
export type TextareaChangeHandler = (event: TextareaChangeEvent) => void;
export type TextareaFocusHandler = (event: TextareaFocusEvent) => void;
export type TextareaBlurHandler = (event: TextareaBlurEvent) => void;

/**
 * Select element events
 */
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type SelectFocusEvent = React.FocusEvent<HTMLSelectElement>;
export type SelectBlurEvent = React.FocusEvent<HTMLSelectElement>;

/**
 * Select element event handlers
 */
export type SelectChangeHandler = (event: SelectChangeEvent) => void;
export type SelectFocusHandler = (event: SelectFocusEvent) => void;
export type SelectBlurHandler = (event: SelectBlurEvent) => void;

/**
 * Form element events
 */
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;
export type FormChangeEvent = React.ChangeEvent<HTMLFormElement>;

/**
 * Form element event handlers
 */
export type FormSubmitHandler = (event: FormSubmitEvent) => void;
export type FormChangeHandler = (event: FormChangeEvent) => void;

// ===== Custom Event Value Handlers =====

/**
 * Handlers that receive the direct value rather than the event
 * Useful for component abstractions that extract the value 
 */
export type ValueChangeHandler<T> = (value: T) => void;
export type StringChangeHandler = ValueChangeHandler<string>;
export type NumberChangeHandler = ValueChangeHandler<number>;
export type BooleanChangeHandler = ValueChangeHandler<boolean>;
export type DateChangeHandler = ValueChangeHandler<Date>;

// ===== Drag and Drop Events =====

/**
 * Drag events
 */
export type DragStartEvent = React.DragEvent<HTMLElement>;
export type DragEndEvent = React.DragEvent<HTMLElement>;
export type DragOverEvent = React.DragEvent<HTMLElement>;
export type DragEnterEvent = React.DragEvent<HTMLElement>;
export type DragLeaveEvent = React.DragEvent<HTMLElement>;
export type DropEvent = React.DragEvent<HTMLElement>;

/**
 * Drag event handlers
 */
export type DragStartHandler = (event: DragStartEvent) => void;
export type DragEndHandler = (event: DragEndEvent) => void;
export type DragOverHandler = (event: DragOverEvent) => void;
export type DragEnterHandler = (event: DragEnterEvent) => void;
export type DragLeaveHandler = (event: DragLeaveEvent) => void;
export type DropHandler = (event: DropEvent) => void;

// ===== Generic Element Events =====

/**
 * Generic element events (use when the specific element type is variable)
 */
export type GenericClickEvent = React.MouseEvent<HTMLElement>;
export type GenericChangeEvent = React.ChangeEvent<HTMLElement>;
export type GenericFocusEvent = React.FocusEvent<HTMLElement>;
export type GenericBlurEvent = React.FocusEvent<HTMLElement>;
export type GenericKeyboardEvent = React.KeyboardEvent<HTMLElement>;

/**
 * Generic element event handlers
 */
export type GenericClickHandler = (event: GenericClickEvent) => void;
export type GenericChangeHandler = (event: GenericChangeEvent) => void;
export type GenericFocusHandler = (event: GenericFocusEvent) => void;
export type GenericBlurHandler = (event: GenericBlurEvent) => void;
export type GenericKeyboardHandler = (event: GenericKeyboardEvent) => void; 