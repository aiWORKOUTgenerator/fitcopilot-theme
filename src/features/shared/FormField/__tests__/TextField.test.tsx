/**
 * TextField Component Tests
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { createTextFieldProps } from '../__fixtures__/formFieldFixtures';
import TextField from '../fields/TextField';

describe('TextField Component', () => {
    it('renders with required props', () => {
        const props = createTextFieldProps({
            label: 'Name',
            value: 'John Doe'
        });

        render(<TextField {...props} />);

        const input = screen.getByLabelText('Name');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('John Doe');
        expect(input).toHaveAttribute('type', 'text');
    });

    it('applies correct CSS classes', () => {
        const props = createTextFieldProps({
            label: 'Email',
            value: 'test@example.com',
            type: 'email',
            className: 'custom-class'
        });

        render(<TextField {...props} />);

        const input = screen.getByLabelText('Email');
        expect(input).toHaveClass('form-input', 'form-input--email', 'custom-class');
    });

    it('handles onChange events', () => {
        const handleChange = jest.fn();
        const props = createTextFieldProps({
            label: 'Username',
            value: '',
            onChange: handleChange
        });

        render(<TextField {...props} />);

        const input = screen.getByLabelText('Username');
        fireEvent.change(input, { target: { value: 'newuser' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('renders error message when provided', () => {
        const props = createTextFieldProps({
            label: 'Password',
            value: 'pass',
            error: 'Password must be at least 8 characters'
        });

        render(<TextField {...props} />);

        const errorMessage = screen.getByText('Password must be at least 8 characters');
        expect(errorMessage).toBeInTheDocument();

        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('renders with helper text when provided', () => {
        const props = createTextFieldProps({
            label: 'Username',
            value: '',
            helperText: 'Choose a unique username'
        });

        render(<TextField {...props} />);

        const helperText = screen.getByText('Choose a unique username');
        expect(helperText).toBeInTheDocument();
    });

    it('disables the input when disabled prop is true', () => {
        const props = createTextFieldProps({
            label: 'Username',
            value: 'johndoe',
            disabled: true
        });

        render(<TextField {...props} />);

        const input = screen.getByLabelText('Username');
        expect(input).toBeDisabled();
        expect(input).toHaveClass('form-input--disabled');
    });

    it('adds required attribute and styling when required prop is true', () => {
        const props = createTextFieldProps({
            label: 'Email',
            value: '',
            required: true
        });

        render(<TextField {...props} />);

        const input = screen.getByLabelText('Email');
        expect(input).toHaveAttribute('required');

        const label = screen.getByText('Email');
        expect(label).toHaveClass('form-field__label--required');
    });

    it('handles different input types correctly', () => {
        const props = createTextFieldProps({
            label: 'Password',
            value: 'secret',
            type: 'password'
        });

        render(<TextField {...props} />);

        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('type', 'password');
    });
}); 