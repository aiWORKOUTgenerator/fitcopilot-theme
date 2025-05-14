/**
 * Button Component Tests
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import logger from '../../../../utils/logger';
import Button from '../Button';
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
} from '../types';

// Mock the logger
jest.mock('../../../../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
}));

describe('Button Component', () => {
    // Helper function to generate test props
    const createButtonProps = (props: Partial<ButtonProps> = {}): ButtonProps => ({
        children: 'Button Text',
        ...props
    });

    it('renders as a button by default', () => {
        render(<Button>Click Me</Button>);

        const button = screen.getByText('Click Me');
        expect(button.tagName).toBe('BUTTON');
        expect(button).toHaveClass('btn');
    });

    it('renders with default primary variant', () => {
        render(<Button>Primary Button</Button>);

        const button = screen.getByText('Primary Button');
        expect(button).toHaveClass('btn-primary');
    });

    it('renders as a button when onClick is provided', () => {
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

    it('renders as a link when href is provided', () => {
        render(
            <Button
                variant="link"
                href="https://example.com"
                data-testid="test-link"
            >
                Visit Site
            </Button>
        );

        const link = screen.getByTestId('test-link');
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('adds noopener noreferrer rel attribute for blank target links', () => {
        render(
            <Button
                variant="link"
                href="https://example.com"
                target="_blank"
                data-testid="test-link"
            >
                External Link
            </Button>
        );

        const link = screen.getByTestId('test-link');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('respects custom rel attribute even with blank target', () => {
        render(
            <Button
                variant="link"
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                data-testid="test-link"
            >
                External Link
            </Button>
        );

        const link = screen.getByTestId('test-link');
        expect(link).toHaveAttribute('rel', 'noreferrer');
    });

    it('applies the correct variant class', () => {
        render(
            <Button
                variant="secondary"
                data-testid="test-button"
            >
                Secondary Button
            </Button>
        );

        const button = screen.getByTestId('test-button');
        expect(button).toHaveClass('btn-secondary');
    });

    it('applies custom className', () => {
        render(
            <Button
                className="custom-class"
                data-testid="test-button"
            >
                Custom Button
            </Button>
        );

        const button = screen.getByTestId('test-button');
        expect(button).toHaveClass('custom-class');
        // Also verify it still has the default classes
        expect(button).toHaveClass('btn', 'btn-primary');
    });

    it('disables the button when disabled prop is true', () => {
        render(
            <Button
                disabled={true}
                data-testid="test-button"
            >
                Disabled Button
            </Button>
        );

        const button = screen.getByTestId('test-button');
        expect(button).toBeDisabled();
    });

    it('handles undefined props', () => {
        // Test the component function directly with undefined props
        const warnSpy = jest.spyOn(logger, 'warn');

        // @ts-ignore - Intentionally passing undefined to test handling
        const result = Button(undefined);

        expect(result).toBeNull();
        expect(warnSpy).toHaveBeenCalledWith('Button component received undefined props');

        warnSpy.mockRestore();
    });
});

// Type Guard Tests
describe('Button Type Guards', () => {
    describe('isPrimaryButton', () => {
        it('returns true for primary button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isPrimaryButton(props)).toBe(true);
        });

        it('returns false for non-primary button props', () => {
            const props: ButtonProps = {
                variant: 'secondary',
                children: 'Button Text'
            };

            expect(isPrimaryButton(props)).toBe(false);
        });
    });

    describe('isSecondaryButton', () => {
        it('returns true for secondary button props', () => {
            const props: ButtonProps = {
                variant: 'secondary',
                children: 'Button Text'
            };

            expect(isSecondaryButton(props)).toBe(true);
        });

        it('returns false for non-secondary button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isSecondaryButton(props)).toBe(false);
        });
    });

    describe('isTextButton', () => {
        it('returns true for text button props', () => {
            const props: ButtonProps = {
                variant: 'text',
                children: 'Button Text'
            };

            expect(isTextButton(props)).toBe(true);
        });

        it('returns false for non-text button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isTextButton(props)).toBe(false);
        });
    });

    describe('isLinkButton', () => {
        it('returns true for link button props', () => {
            const props: ButtonProps = {
                variant: 'link',
                children: 'Link Text',
                href: 'https://example.com'
            };

            expect(isLinkButton(props)).toBe(true);
        });

        it('returns false for non-link button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isLinkButton(props)).toBe(false);
        });
    });

    describe('isIconButton', () => {
        const mockIcon = () => <svg data-testid="mock-icon" />;

        it('returns true for icon button props', () => {
            const props: ButtonProps = {
                variant: 'icon',
                icon: mockIcon,
                children: 'Icon Button'
            };

            expect(isIconButton(props)).toBe(true);
        });

        it('returns false for non-icon button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isIconButton(props)).toBe(false);
        });
    });

    describe('isToggleButton', () => {
        it('returns true for toggle button props', () => {
            const props: ButtonProps = {
                variant: 'toggle',
                isActive: true,
                children: 'Toggle Button'
            };

            expect(isToggleButton(props)).toBe(true);
        });

        it('returns false for non-toggle button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isToggleButton(props)).toBe(false);
        });
    });

    describe('isFloatingActionButton', () => {
        const mockIcon = () => <svg data-testid="mock-icon" />;

        it('returns true for floating action button props', () => {
            const props: ButtonProps = {
                variant: 'floating',
                icon: mockIcon,
                children: 'FAB'
            };

            expect(isFloatingActionButton(props)).toBe(true);
        });

        it('returns false for non-floating button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isFloatingActionButton(props)).toBe(false);
        });
    });

    describe('isWorkoutButton', () => {
        it('returns true for workout button props', () => {
            const props: ButtonProps = {
                variant: 'workout',
                level: 'beginner',
                children: 'Workout Button'
            };

            expect(isWorkoutButton(props)).toBe(true);
        });

        it('returns false for non-workout button props', () => {
            const props: ButtonProps = {
                variant: 'primary',
                children: 'Button Text'
            };

            expect(isWorkoutButton(props)).toBe(false);
        });
    });
}); 