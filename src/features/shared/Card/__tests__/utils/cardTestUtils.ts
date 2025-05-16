/**
 * @jest-environment jsdom
 * @jest-ignore
 * This file contains test utilities and is not a test file itself
 */

import { screen } from '@testing-library/react';

/**
 * Utility for testing BEM class names on components
 * @param element The element to test
 * @param block The BEM block name
 * @param modifiers Object of modifiers to check, with boolean values
 */
export const assertBEMClasses = (
  element: HTMLElement,
  block: string,
  modifiers: Record<string, boolean>
) => {
  // Check for base block class
  expect(element).toHaveClass(block);

  // Check for each modifier
  Object.entries(modifiers).forEach(([modifier, shouldHave]) => {
    const modifierClass = `${block}--${modifier}`;

    if (shouldHave) {
      expect(element).toHaveClass(modifierClass);
    } else {
      expect(element).not.toHaveClass(modifierClass);
    }
  });
};

/**
 * Utility to find card elements by role with appropriate error messages
 */
export const cardElements = {
  getCard: () => screen.getByTestId('card'),
  getTitle: (name?: string | RegExp) =>
    screen.getByRole('heading', { name: name }),
  getImage: () => screen.getByRole('img'),
  getVideo: () => screen.getByRole('video'),
  getAudio: () => screen.getByRole('audio'),
  getCTA: (name: string | RegExp) =>
    screen.getByRole('button', { name: name })
};

/**
 * Utility for checking card theme classes
 */
export const assertCardTheme = (card: HTMLElement, theme: string) => {
  expect(card).toHaveAttribute('data-theme', theme);
  expect(card).toHaveClass(`theme-${theme}`);
};

/**
 * Utility for testing card loading state
 */
export const assertCardLoading = (card: HTMLElement, isLoading: boolean) => {
  expect(card).toHaveAttribute('data-loading', isLoading ? 'true' : 'false');
  if (isLoading) {
    expect(card).toHaveClass('is-loading');
  } else {
    expect(card).not.toHaveClass('is-loading');
  }
};

/**
 * Get expected test-ids for media mock components based on variant
 */
export const getMediaTestId = (variant: string): string => {
  switch (variant) {
  case 'video':
    return 'mock-media-video';
  case 'image':
    return 'mock-media-image';
  case 'imageGallery':
    return 'mock-media-gallery';
  case 'carousel':
    return 'mock-media-carousel';
  case 'audio':
    return 'mock-media-audio';
  case 'youtube':
    return 'mock-media-youtube';
  default:
    return 'mock-media-unknown';
  }
}; 