/**
 * Button Component Tests
 */

import { fireEvent, render, screen } from '@testing-library/react';
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
    test('renders as a button when onClick is provided', () => {
        const handleClick = jest.fn();

        render(
            <Button onClick={handleClick} data-testid="test-button">
                Click Me
            </Button>
        );

        const button = screen.getByTestId('test-button');
        expect(button.tagName).toBe('BUTTON');

        // Test clicking the button
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Test rendering as a link
    test('renders as a link when href is provided', () => {
        render(
            <Button href="https://example.com" data-testid="test-link">
                Visit Site
            </Button>
        );

        const link = screen.getByTestId('test-link');
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', 'https://example.com');
    });

    // Test variant classes
    test('applies the correct variant class', () => {
        render(
            <Button
                onClick={jest.fn()}
                variant="secondary"
                data-testid="test-button"
            >
                Secondary Button
            </Button>
        );

        const button = screen.getByTestId('test-button');
        expect(button).toHaveClass('btn-secondary');
    });

    // Test size classes
    test('applies the correct size class', () => {
        render(
            <Button
                onClick={jest.fn()}
                size="large"
                data-testid="test-button"
            >
                Large Button
            </Button>
        );

        const button = screen.getByTestId('test-button');
        expect(button).toHaveClass('btn-large');
    });

    // Test disabled state
    test('disables the button when disabled prop is true', () => {
        render(
            <Button
                onClick={jest.fn()}
                disabled={true}
                data-testid="test-button"
            >
                Disabled Button
            </Button>
        );

        const button = screen.getByTestId('test-button');
        expect(button).toBeDisabled();
    });

    // Test adding custom classes
    test('adds custom className', () => {
        render(
            <Button
                onClick={jest.fn()}
                className="custom-class"
                data-testid="test-button"
            >
                Custom Button
            </Button>
        );

        const button = screen.getByTestId('test-button');
        expect(button).toHaveClass('custom-class');
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