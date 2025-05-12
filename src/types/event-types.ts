/**
 * Common event types to eliminate 'any' type usage
 * Created as part of ESLint error remediation
 */
import React from 'react';

/**
 * Button event types
 */
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
export type ButtonClickHandler = (event: ButtonClickEvent) => void;

/**
 * Input event types
 */
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type InputChangeHandler = (event: InputChangeEvent) => void;

export type TextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type TextareaChangeHandler = (event: TextareaChangeEvent) => void;

export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type SelectChangeHandler = (event: SelectChangeEvent) => void;

/**
 * Form event types
 */
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;
export type FormSubmitHandler = (event: FormSubmitEvent) => void;

/**
 * Generic DOM event types
 */
export type KeyboardEvent = React.KeyboardEvent<HTMLElement>;
export type KeyboardEventHandler = (event: KeyboardEvent) => void;

export type FocusEvent = React.FocusEvent<HTMLElement>;
export type FocusEventHandler = (event: FocusEvent) => void;

export type BlurEvent = React.FocusEvent<HTMLElement>;
export type BlurEventHandler = (event: BlurEvent) => void;

/**
 * API response types to replace 'any'
 */
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    error?: {
        message: string;
        code: string | number;
    };
    meta?: Record<string, unknown>;
}

/**
 * Generic data fetch state types
 */
export interface DataFetchState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
}

/**
 * Use this type instead of any for complex objects or when type is not yet defined
 */
export type UnknownObject = Record<string, unknown>;

/**
 * WordPress specific response types
 */
export interface WordPressApiResponse<T> {
    data: T;
    status: number;
    headers?: Headers;
}

/**
 * Event handler for components with custom events
 */
export type CustomEventHandler<T = UnknownObject> = (data: T) => void;

/**
 * Utility type for conditionally requiring properties
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>> & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]; 