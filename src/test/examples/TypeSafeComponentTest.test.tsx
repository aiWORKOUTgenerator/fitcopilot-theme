/**
 * Example Component Test with Type-Safe Testing Utilities
 * 
 * This file demonstrates how to use the type-safe testing utilities 
 * implemented in Phase 3.2 of the ESLint Warning Remediation Plan.
 */

import React from 'react';
import { changeInput, clickButton, submitForm } from '../utils/events';
import { render } from '../utils/render';

// Mock component for demonstration
interface ButtonProps {
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    variant = 'primary',
    disabled = false
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`button ${variant}`}
        data-testid="test-button"
    >
        {label}
    </button>
);

// Mock form component for demonstration
interface FormProps {
    onSubmit: (data: { name: string; email: string }) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({ name, email });
    };

    return (
        <form onSubmit={handleSubmit} data-testid="test-form">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                data-testid="name-input"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                data-testid="email-input"
            />
            <Button label="Submit" />
        </form>
    );
};

describe('Type-Safe Component Testing Examples', () => {
    describe('Button Component', () => {
        test('renders the button with correct label', () => {
            const { getByTestId } = render(<Button label="Click me" />);
            const button = getByTestId('test-button');
            expect(button).toHaveTextContent('Click me');
        });

        test('calls onClick handler when clicked', () => {
            const handleClick = jest.fn();
            const { getByTestId } = render(<Button label="Click me" onClick={handleClick} />);
            const button = getByTestId('test-button') as HTMLButtonElement;

            // Using type-safe event utility
            clickButton(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        test('can be disabled', () => {
            const { getByTestId } = render(<Button label="Click me" disabled={true} />);
            const button = getByTestId('test-button');
            expect(button).toBeDisabled();
        });

        test('applies the correct variant class', () => {
            const { getByTestId } = render(<Button label="Click me" variant="secondary" />);
            const button = getByTestId('test-button');
            expect(button).toHaveClass('secondary');
        });
    });

    describe('Form Component', () => {
        test('submits the form with input values', () => {
            const handleSubmit = jest.fn();
            const { getByTestId } = render(<Form onSubmit={handleSubmit} />);

            const nameInput = getByTestId('name-input') as HTMLInputElement;
            const emailInput = getByTestId('email-input') as HTMLInputElement;
            const form = getByTestId('test-form') as HTMLFormElement;

            // Using type-safe event utilities
            changeInput(nameInput, 'John Doe');
            changeInput(emailInput, 'john@example.com');
            submitForm(form);

            expect(handleSubmit).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com'
            });
        });
    });

    describe('Advanced Provider Testing', () => {
        test('renders with custom provider values', () => {
            const { getByTestId } = render(
                <Button label="User Profile" />,
                {
                    providerProps: {
                        userContext: {
                            user: {
                                id: 'user-123',
                                name: 'Test User',
                                email: 'test@example.com',
                                role: 'admin'
                            }
                        },
                        workoutContext: {
                            workouts: [
                                {
                                    id: 'workout-1',
                                    name: 'Morning Routine',
                                    exercises: []
                                }
                            ]
                        }
                    }
                }
            );

            const button = getByTestId('test-button');
            expect(button).toHaveTextContent('User Profile');
        });
    });
}); 