/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import logger from '../logger';

/**
 * Generic type for React change events
 */
export type ChangeEvent<T extends HTMLElement> = React.ChangeEvent<T>;

/**
 * Generic type for React mouse events
 */
export type MouseEvent<T extends HTMLElement> = React.MouseEvent<T>;

/**
 * Generic type for React form events
 */
export type FormEvent<T extends HTMLElement> = React.FormEvent<T>;

/**
 * Generic type for React focus events
 */
export type FocusEvent<T extends HTMLElement> = React.FocusEvent<T>;

/**
 * Generic type for React keyboard events
 */
export type KeyboardEvent<T extends HTMLElement> = React.KeyboardEvent<T>;

/**
 * Type for event handlers that return void
 */
export type EventHandler<E extends React.SyntheticEvent<Element, Event>> = (event: E) => void;

/**
 * Type for event handlers that return a value
 */
export type EventHandlerWithReturn<E extends React.SyntheticEvent<Element, Event>, R> = (event: E) => R;

/**
 * Creates a logged event handler that logs the event before calling the original handler
 * 
 * @param handler - Original event handler
 * @param context - Additional context information to log
 * @returns New handler that logs and then calls the original
 */
export function createLoggedHandler<E extends React.SyntheticEvent<Element, Event>>(
  handler: EventHandler<E>,
  eventName: string,
  context: Record<string, unknown> = {}
): EventHandler<E> {
  return (event: E) => {
    const logContext: Record<string, unknown> = {
      ...context,
      eventType: event.type,
      component: context.component || 'unknown',
    };

    // Add target information when available
    if ('target' in event && event.target) {
      const target = event.target as unknown;
      if (target && typeof target === 'object') {
        if ('id' in target && typeof target.id === 'string') {
          logContext.targetId = target.id;
        }

        if ('name' in target && typeof target.name === 'string') {
          logContext.targetName = target.name;
        }

        if ('value' in target && typeof target.value !== 'function' && typeof target.value !== 'object') {
          logContext.targetValue = target.value;
        }
      }
    }

    logger.info(`Event: ${eventName}`, logContext);
    handler(event);
  };
}

/**
 * Creates a change event handler with proper typing
 * 
 * @param handler - Handler function for change events
 * @param context - Additional context for logging
 * @returns Properly typed change event handler
 */
export function createChangeHandler<T extends HTMLElement>(
  handler: EventHandler<ChangeEvent<T>>,
  context: Record<string, unknown> = {}
): EventHandler<ChangeEvent<T>> {
  return createLoggedHandler(handler, 'onChange', context);
}

/**
 * Creates a click event handler with proper typing
 * 
 * @param handler - Handler function for click events
 * @param context - Additional context for logging
 * @returns Properly typed click event handler
 */
export function createClickHandler<T extends HTMLElement>(
  handler: EventHandler<MouseEvent<T>>,
  context: Record<string, unknown> = {}
): EventHandler<MouseEvent<T>> {
  return createLoggedHandler(handler, 'onClick', context);
}

/**
 * Creates a form submit event handler with proper typing
 * 
 * @param handler - Handler function for submit events
 * @param context - Additional context for logging
 * @returns Properly typed submit event handler
 */
export function createSubmitHandler<T extends HTMLElement>(
  handler: EventHandler<FormEvent<T>>,
  context: Record<string, unknown> = {}
): EventHandler<FormEvent<T>> {
  return createLoggedHandler(handler, 'onSubmit', context);
}

/**
 * Creates a focus event handler with proper typing
 * 
 * @param handler - Handler function for focus events
 * @param context - Additional context for logging
 * @returns Properly typed focus event handler
 */
export function createFocusHandler<T extends HTMLElement>(
  handler: EventHandler<FocusEvent<T>>,
  context: Record<string, unknown> = {}
): EventHandler<FocusEvent<T>> {
  return createLoggedHandler(handler, 'onFocus', context);
}

/**
 * Creates a blur event handler with proper typing
 * 
 * @param handler - Handler function for blur events
 * @param context - Additional context for logging
 * @returns Properly typed blur event handler
 */
export function createBlurHandler<T extends HTMLElement>(
  handler: EventHandler<FocusEvent<T>>,
  context: Record<string, unknown> = {}
): EventHandler<FocusEvent<T>> {
  return createLoggedHandler(handler, 'onBlur', context);
}

/**
 * Creates a key down event handler with proper typing
 * 
 * @param handler - Handler function for keydown events
 * @param context - Additional context for logging
 * @returns Properly typed keydown event handler
 */
export function createKeyDownHandler<T extends HTMLElement>(
  handler: EventHandler<KeyboardEvent<T>>,
  context: Record<string, unknown> = {}
): EventHandler<KeyboardEvent<T>> {
  return createLoggedHandler(handler, 'onKeyDown', context);
}

/**
 * Prevents default behavior on an event
 * 
 * @param event - Event to prevent default on
 */
export function preventDefault<E extends React.SyntheticEvent>(event: E): void {
  event.preventDefault();
}

/**
 * Stops propagation of an event
 * 
 * @param event - Event to stop propagation on
 */
export function stopPropagation<E extends React.SyntheticEvent>(event: E): void {
  event.stopPropagation();
}

/**
 * Prevents default and stops propagation of an event
 * 
 * @param event - Event to handle
 */
export function preventAll<E extends React.SyntheticEvent>(event: E): void {
  preventDefault(event);
  stopPropagation(event);
}

/**
 * Type-safe event handler composer that chains multiple handlers
 * 
 * @param handlers - Array of handlers to chain
 * @returns Combined handler that calls all handlers in sequence
 */
export function composeHandlers<E extends React.SyntheticEvent>(
  ...handlers: Array<EventHandler<E> | undefined | null>
): EventHandler<E> {
  return (event: E) => {
    for (const handler of handlers) {
      if (typeof handler === 'function') {
        handler(event);
      }
    }
  };
} 