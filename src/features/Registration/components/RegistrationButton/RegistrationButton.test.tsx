/* eslint-disable */
import { fireEvent, render, screen } from '@testing-library/react';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import RegistrationButton from './RegistrationButton';

describe('RegistrationButton', () => {
    it('renders correctly with default props', () => {
        render(<RegistrationButton variant="primary">Click me</RegistrationButton>);

        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('btn');
        expect(button).toHaveClass('btn-primary');
        expect(button).toHaveClass('registration-button');
        expect(button).not.toBeDisabled();
    });

    it('shows loading state when isLoading is true', () => {
        render(<RegistrationButton variant="primary" isLoading>Click me</RegistrationButton>);

        expect(screen.getByText(/processing/i)).toBeInTheDocument();
        expect(screen.queryByText(/click me/i)).not.toBeInTheDocument();
    });

    it('applies variant and size classes correctly', () => {
        render(
            <RegistrationButton variant="secondary" size="sm">
                Button Text
            </RegistrationButton>
        );

        const button = screen.getByRole('button', { name: /button text/i });
        expect(button).toHaveClass('btn');
        expect(button).toHaveClass('btn-secondary');
        expect(button).toHaveClass('btn-sm');
        expect(button).toHaveClass('registration-button');
    });

    it('renders with icons correctly', () => {
        render(
            <RegistrationButton
                variant="primary"
                rightIcon={<ArrowRight data-testid="right-icon" />}
                leftIcon={<ArrowRight data-testid="left-icon" />}
            >
                Icon Button
            </RegistrationButton>
        );

        expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<RegistrationButton variant="primary" onClick={handleClick}>Click me</RegistrationButton>);

        fireEvent.click(screen.getByRole('button', { name: /click me/i }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<RegistrationButton variant="primary" disabled>Disabled Button</RegistrationButton>);

        expect(screen.getByRole('button', { name: /disabled button/i })).toBeDisabled();
    });
    
    it('renders link variant correctly', () => {
        render(
            <RegistrationButton
                variant="link"
                href="/register"
                openInNewTab={true}
            >
                Register Now
            </RegistrationButton>
        );
        
        const link = screen.getByRole('link', { name: /register now/i });
        expect(link).toHaveClass('registration-button');
        expect(link).toHaveAttribute('href', '/register');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
}); 