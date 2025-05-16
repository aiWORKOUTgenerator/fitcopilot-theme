/**
 * Button Component Tests
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  ButtonProps,
  isFloatingActionButton,
  isIconButton,
  isLinkButton,
  isPrimaryButton,
  isSecondaryButton,
  isTextButton,
  isToggleButton,
  isWorkoutButton
} from './';
import { Button } from './Button';
import { isActionButton } from './types';

// Mock the logger
jest.mock('../../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('Button component', () => {
  // Test rendering as button
  test('renders as a button when onClick is provided', async () => {
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick}>
        Click Me
      </Button>
    );

    // Using role-based selector instead of data-testid
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();

    // Using userEvent instead of fireEvent
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test rendering as a link
  test('renders as a link when href is provided', () => {
    render(
      <Button href="https://example.com">
        Visit Site
      </Button>
    );

    // Using role-based selector instead of data-testid
    const link = screen.getByRole('link', { name: /visit site/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  // Test variant classes
  test('applies the correct variant class', () => {
    render(
      <Button
        onClick={jest.fn()}
        variant="secondary"
      >
        Secondary Button
      </Button>
    );

    // Using role-based selector instead of data-testid
    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toHaveClass('btn-secondary');
  });

  // Test size classes
  test('applies the correct size class', () => {
    render(
      <Button
        onClick={jest.fn()}
        size="large"
      >
        Large Button
      </Button>
    );

    // Using role-based selector instead of data-testid
    const button = screen.getByRole('button', { name: /large button/i });
    expect(button).toHaveClass('btn-large');
  });

  // Test disabled state
  test('disables the button when disabled prop is true', () => {
    render(
      <Button
        onClick={jest.fn()}
        disabled={true}
      >
        Disabled Button
      </Button>
    );

    // Using role-based selector instead of data-testid
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    // Additional accessibility check
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  // Test adding custom classes
  test('adds custom className', () => {
    render(
      <Button
        onClick={jest.fn()}
        className="custom-class"
      >
        Custom Button
      </Button>
    );

    // Using role-based selector instead of data-testid
    const button = screen.getByRole('button', { name: /custom button/i });
    expect(button).toHaveClass('custom-class');
  });

  // Test keyboard interaction for accessibility
  test('responds to keyboard interaction', async () => {
    const handleClick = jest.fn();
    render(
      <Button
        onClick={handleClick}
      >
        Keyboard Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /keyboard button/i });

    // Focus the button
    button.focus();
    expect(button).toHaveFocus();

    // Press Enter key
    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Press Space key
    await userEvent.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  // Test type guards
  describe('Type guards', () => {
    test('isLinkButton correctly identifies link buttons', () => {
      const linkProps: ButtonProps = {
        href: 'https://example.com',
        children: 'Link'
      };

      const actionProps: ButtonProps = {
        onClick: jest.fn(),
        children: 'Button'
      };

      expect(isLinkButton(linkProps)).toBe(true);
      expect(isLinkButton(actionProps)).toBe(false);
    });

    test('isActionButton correctly identifies action buttons', () => {
      const linkProps: ButtonProps = {
        href: 'https://example.com',
        children: 'Link'
      };

      const actionProps: ButtonProps = {
        onClick: jest.fn(),
        children: 'Button'
      };

      expect(isActionButton(actionProps)).toBe(true);
      expect(isActionButton(linkProps)).toBe(false);
    });
  });
});

describe('Button Type Guards', () => {
  describe('isPrimaryButton', () => {
    it('should return true for primary button props', () => {
      const props: ButtonProps = {
        variant: 'primary',
        children: 'Button Text',
        size: 'medium'
      };

      expect(isPrimaryButton(props)).toBe(true);
    });

    it('should return false for non-primary button props', () => {
      const props: ButtonProps = {
        variant: 'secondary',
        children: 'Button Text'
      };

      expect(isPrimaryButton(props)).toBe(false);
    });
  });

  describe('isSecondaryButton', () => {
    it('should return true for secondary button props', () => {
      const props: ButtonProps = {
        variant: 'secondary',
        children: 'Button Text',
        outline: true
      };

      expect(isSecondaryButton(props)).toBe(true);
    });

    it('should return false for non-secondary button props', () => {
      const props: ButtonProps = {
        variant: 'primary',
        children: 'Button Text'
      };

      expect(isSecondaryButton(props)).toBe(false);
    });
  });

  describe('isTextButton', () => {
    it('should return true for text button props', () => {
      const props: ButtonProps = {
        variant: 'text',
        children: 'Button Text',
        underline: true
      };

      expect(isTextButton(props)).toBe(true);
    });

    it('should return false for non-text button props', () => {
      const props: ButtonProps = {
        variant: 'primary',
        children: 'Button Text'
      };

      expect(isTextButton(props)).toBe(false);
    });
  });

  describe('isIconButton', () => {
    it('should return true for icon button props', () => {
      const props: ButtonProps = {
        variant: 'icon',
        children: 'Button Text',
        icon: <span data-testid="icon" />
      };

      expect(isIconButton(props)).toBe(true);
    });

    it('should return false for non-icon button props', () => {
      const props: ButtonProps = {
        variant: 'primary',
        children: 'Button Text'
      };

      expect(isIconButton(props)).toBe(false);
    });
  });

  describe('isToggleButton', () => {
    it('should return true for toggle button props', () => {
      const props: ButtonProps = {
        variant: 'toggle',
        children: 'Button Text',
        isActive: true
      };

      expect(isToggleButton(props)).toBe(true);
    });

    it('should return false for non-toggle button props', () => {
      const props: ButtonProps = {
        variant: 'primary',
        children: 'Button Text'
      };

      expect(isToggleButton(props)).toBe(false);
    });
  });

  describe('isFloatingActionButton', () => {
    it('should return true for floating action button props', () => {
      const props: ButtonProps = {
        variant: 'floating',
        children: 'Button Text',
        icon: <span data-testid="icon" />
      };

      expect(isFloatingActionButton(props)).toBe(true);
    });

    it('should return false for non-floating button props', () => {
      const props: ButtonProps = {
        variant: 'primary',
        children: 'Button Text'
      };

      expect(isFloatingActionButton(props)).toBe(false);
    });
  });

  describe('isWorkoutButton', () => {
    it('should return true for workout button props', () => {
      const props: ButtonProps = {
        variant: 'workout',
        children: 'Button Text',
        exerciseId: '123'
      };

      expect(isWorkoutButton(props)).toBe(true);
    });

    it('should return false for non-workout button props', () => {
      const props: ButtonProps = {
        variant: 'primary',
        children: 'Button Text'
      };

      expect(isWorkoutButton(props)).toBe(false);
    });
  });
}); 