/* eslint-disable */
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Button, { DefaultButton, GymButton } from '../index';

// Mock the lazy loaded components
jest.mock('react', () => {
    const originalReact = jest.requireActual('react');
    return {
        ...originalReact,
        lazy: (factory) => {
            const Component = factory();
            Component.then = (resolve) => resolve(Component);
            return Component;
        },
    };
});

describe('Button Component Suite', () => {
    describe('Main Button Component', () => {
        test('renders the DefaultButton for default theme', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByText('Click me')).toBeInTheDocument();
            expect(screen.getByRole('button')).toHaveClass('button--primary');
        });

        test('renders the GymButton for gym theme', () => {
            render(<Button themeContext="gym">Click me</Button>);
            expect(screen.getByText('Click me')).toBeInTheDocument();
        });
    });

    describe('DefaultButton Component', () => {
        // Basic rendering test
        test('renders children correctly', () => {
            render(<DefaultButton>Click me</DefaultButton>);
            expect(screen.getByText('Click me')).toBeInTheDocument();
        });

        // Variant tests
        test('renders with primary variant by default', () => {
            render(<DefaultButton>Primary Button</DefaultButton>);
            expect(screen.getByRole('button')).toHaveClass('button--primary');
        });

        test('renders with secondary variant', () => {
            render(<DefaultButton variant="secondary">Secondary Button</DefaultButton>);
            expect(screen.getByRole('button')).toHaveClass('button--secondary');
        });

        test('renders with tertiary variant', () => {
            render(<DefaultButton variant="tertiary">Tertiary Button</DefaultButton>);
            expect(screen.getByRole('button')).toHaveClass('button--tertiary');
        });

        test('renders with ghost variant', () => {
            render(<DefaultButton variant="ghost">Ghost Button</DefaultButton>);
            expect(screen.getByRole('button')).toHaveClass('button--ghost');
        });

        test('renders with gradient variant', () => {
            render(<DefaultButton variant="gradient">Gradient Button</DefaultButton>);
            expect(screen.getByRole('button')).toHaveClass('button--gradient');
        });

        // Size tests
        test('renders with medium size by default', () => {
            render(<DefaultButton>Medium Button</DefaultButton>);
            expect(screen.getByRole('button')).toHaveClass('button--medium');
        });

        test('renders with small size', () => {
            render(<DefaultButton size="small">Small Button</DefaultButton>);
            expect(screen.getByRole('button')).toHaveClass('button--small');
        });

        test('renders with large size', () => {
            render(<DefaultButton size="large">Large Button</DefaultButton>);
            expect(screen.getByRole('button')).toHaveClass('button--large');
        });

        // Full width test
        test('applies fullWidth class when fullWidth prop is true', () => {
            render(<DefaultButton fullWidth>Full Width Button</DefaultButton>);
            expect(screen.getByRole('button')).toHaveClass('button--fullwidth');
        });

        // Loading state test
        test('shows loading spinner and disables button when isLoading is true', () => {
            render(<DefaultButton isLoading>Loading Button</DefaultButton>);

            const button = screen.getByRole('button');
            expect(button).toHaveClass('button--loading');
            expect(button).toBeDisabled();
            expect(button.querySelector('.button__spinner')).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-busy', 'true');
        });

        // Disabled state test
        test('disables button when disabled prop is true', () => {
            render(<DefaultButton disabled>Disabled Button</DefaultButton>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        // Additional class name test
        test('applies additional className from props', () => {
            render(<DefaultButton className="custom-class">Custom Class Button</DefaultButton>);
            expect(screen.getByRole('button')).toHaveClass('custom-class');
        });

        // Icon tests
        test('renders with left icon', () => {
            const leftIcon = <span data-testid="left-icon">🔍</span>;
            render(<DefaultButton leftIcon={leftIcon}>Button with Left Icon</DefaultButton>);

            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
            expect(screen.getByTestId('left-icon').parentElement).toHaveClass('button__icon--left');
            expect(screen.getByTestId('left-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
        });

        test('renders with right icon', () => {
            const rightIcon = <span data-testid="right-icon">→</span>;
            render(<DefaultButton rightIcon={rightIcon}>Button with Right Icon</DefaultButton>);

            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
            expect(screen.getByTestId('right-icon').parentElement).toHaveClass('button__icon--right');
            expect(screen.getByTestId('right-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
        });

        // Event handler tests
        test('calls onClick handler when clicked', () => {
            const handleClick = jest.fn();
            render(<DefaultButton onClick={handleClick}>Clickable Button</DefaultButton>);

            fireEvent.click(screen.getByText('Clickable Button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        test('does not call onClick when disabled', () => {
            const handleClick = jest.fn();
            render(<DefaultButton onClick={handleClick} disabled>Disabled Button</DefaultButton>);

            fireEvent.click(screen.getByText('Disabled Button'));
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('GymButton Component', () => {
        test('renders with primary variant by default', () => {
            render(<GymButton>Primary Button</GymButton>);
            expect(screen.getByRole('button')).toHaveClass('button--primary');
        });

        test('renders with gradient variant', () => {
            render(<GymButton variant="gradient">Gradient Button</GymButton>);
            expect(screen.getByRole('button')).toHaveClass('button--gradient');
        });

        test('renders with right icon', () => {
            const rightIcon = <span data-testid="right-icon">→</span>;
            render(<GymButton rightIcon={rightIcon}>Button with Right Icon</GymButton>);

            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
            expect(screen.getByTestId('right-icon').parentElement).toHaveClass('button__icon--right');
            expect(screen.getByTestId('right-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
        });
    });
}); 