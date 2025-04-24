import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
    // Basic rendering test
    test('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    // Variant tests
    test('renders with primary variant by default', () => {
        render(<Button>Primary Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('button--primary');
    });

    test('renders with secondary variant', () => {
        render(<Button variant="secondary">Secondary Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('button--secondary');
    });

    test('renders with tertiary variant', () => {
        render(<Button variant="tertiary">Tertiary Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('button--tertiary');
    });

    test('renders with ghost variant', () => {
        render(<Button variant="ghost">Ghost Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('button--ghost');
    });

    // Size tests
    test('renders with medium size by default', () => {
        render(<Button>Medium Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('button--medium');
    });

    test('renders with small size', () => {
        render(<Button size="small">Small Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('button--small');
    });

    test('renders with large size', () => {
        render(<Button size="large">Large Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('button--large');
    });

    // Full width test
    test('applies fullWidth class when fullWidth prop is true', () => {
        render(<Button fullWidth>Full Width Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('button--fullwidth');
    });

    // Loading state test
    test('shows loading spinner and disables button when isLoading is true', () => {
        render(<Button isLoading>Loading Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('button--loading');
        expect(button).toBeDisabled();
        expect(button.querySelector('.button__spinner')).toBeInTheDocument();
    });

    // Disabled state test
    test('disables button when disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    // Additional class name test
    test('applies additional className from props', () => {
        render(<Button className="custom-class">Custom Class Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    // Icon tests
    test('renders with left icon', () => {
        const leftIcon = <span data-testid="left-icon">🔍</span>;
        render(<Button leftIcon={leftIcon}>Button with Left Icon</Button>);

        expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        expect(screen.getByTestId('left-icon').parentElement).toHaveClass('button__icon--left');
    });

    test('renders with right icon', () => {
        const rightIcon = <span data-testid="right-icon">→</span>;
        render(<Button rightIcon={rightIcon}>Button with Right Icon</Button>);

        expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        expect(screen.getByTestId('right-icon').parentElement).toHaveClass('button__icon--right');
    });

    // Event handler tests
    test('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Clickable Button</Button>);

        fireEvent.click(screen.getByText('Clickable Button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick} disabled>Disabled Button</Button>);

        fireEvent.click(screen.getByText('Disabled Button'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    test('does not call onClick when loading', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick} isLoading>Loading Button</Button>);

        fireEvent.click(screen.getByText('Loading Button'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    // Accessibility tests
    test('passes through HTML attributes to button element', () => {
        render(
            <Button
                aria-label="Accessible Button"
                data-testid="custom-button"
                type="submit"
            >
                Accessible Button
            </Button>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Accessible Button');
        expect(button).toHaveAttribute('data-testid', 'custom-button');
        expect(button).toHaveAttribute('type', 'submit');
    });
}); 