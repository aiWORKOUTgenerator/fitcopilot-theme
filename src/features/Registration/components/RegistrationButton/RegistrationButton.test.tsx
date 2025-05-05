import { fireEvent, render, screen } from '@testing-library/react';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import RegistrationButton from './RegistrationButton';

describe('RegistrationButton', () => {
    it('renders correctly with default props', () => {
        render(<RegistrationButton>Click me</RegistrationButton>);

        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('registration-button--primary');
        expect(button).toHaveClass('registration-button--medium');
        expect(button).not.toBeDisabled();
    });

    it('shows loading state when isLoading is true', () => {
        render(<RegistrationButton isLoading>Click me</RegistrationButton>);

        expect(screen.getByText(/processing/i)).toBeInTheDocument();
        expect(screen.queryByText(/click me/i)).not.toBeInTheDocument();
    });

    it('applies variant and size classes correctly', () => {
        render(
            <RegistrationButton variant="secondary" size="small">
                Button Text
            </RegistrationButton>
        );

        const button = screen.getByRole('button', { name: /button text/i });
        expect(button).toHaveClass('registration-button--secondary');
        expect(button).toHaveClass('registration-button--small');
    });

    it('renders with icons correctly', () => {
        render(
            <RegistrationButton
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
        render(<RegistrationButton onClick={handleClick}>Click me</RegistrationButton>);

        fireEvent.click(screen.getByRole('button', { name: /click me/i }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<RegistrationButton disabled>Disabled Button</RegistrationButton>);

        expect(screen.getByRole('button', { name: /disabled button/i })).toBeDisabled();
    });
}); 