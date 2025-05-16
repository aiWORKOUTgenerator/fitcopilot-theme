/**
 * TextField Component Tests
 */

import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../../test/test-utils';
import { createTextFieldProps } from '../__fixtures__/formFieldFixtures';
import TextField from '../fields/TextField';

describe('TextField Component', () => {
  it('renders with required props', () => {
    const props = createTextFieldProps({
      label: 'Name',
      value: 'John Doe'
    });

    renderWithProviders(<TextField {...props} />);

    const input = screen.getByRole('textbox', { name: /name/i });
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

    renderWithProviders(<TextField {...props} />);

    const input = screen.getByRole('textbox', { name: /email/i });
    expect(input).toHaveClass('form-input', 'form-input--email', 'custom-class');
  });

  it('handles onChange events', async () => {
    const handleChange = jest.fn();
    const props = createTextFieldProps({
      label: 'Username',
      value: '',
      onChange: handleChange
    });

    const { user } = renderWithProviders(<TextField {...props} />);

    const input = screen.getByRole('textbox', { name: /username/i });
    await user.type(input, 'newuser');

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders error message when provided', () => {
    const props = createTextFieldProps({
      label: 'Password',
      value: 'pass',
      error: 'Password must be at least 8 characters'
    });

    renderWithProviders(<TextField {...props} />);

    const errorMessage = screen.getByText('Password must be at least 8 characters');
    expect(errorMessage).toBeInTheDocument();

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/Password must be at least 8 characters/i);
  });

  it('renders with helper text when provided', () => {
    const props = createTextFieldProps({
      label: 'Username',
      value: '',
      helperText: 'Choose a unique username'
    });

    renderWithProviders(<TextField {...props} />);

    const helperText = screen.getByText('Choose a unique username');
    expect(helperText).toBeInTheDocument();

    const input = screen.getByRole('textbox', { name: /username/i });
    expect(input).toHaveAccessibleDescription(/Choose a unique username/i);
  });

  it('disables the input when disabled prop is true', async () => {
    const handleChange = jest.fn();
    const props = createTextFieldProps({
      label: 'Username',
      value: 'johndoe',
      disabled: true,
      onChange: handleChange
    });

    const { user } = renderWithProviders(<TextField {...props} />);

    const input = screen.getByRole('textbox', { name: /username/i });
    expect(input).toBeDisabled();
    expect(input).toHaveClass('form-input--disabled');

    // Verify that typing in a disabled input doesn't trigger onChange
    await user.type(input, 'test');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('adds required attribute and styling when required prop is true', () => {
    const props = createTextFieldProps({
      label: 'Email',
      value: '',
      required: true
    });

    renderWithProviders(<TextField {...props} />);

    const input = screen.getByRole('textbox', { name: /email/i });
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

    renderWithProviders(<TextField {...props} />);

    // Password inputs don't have a textbox role
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('handles keyboard navigation correctly', async () => {
    const handleFocus = jest.fn();
    const handleKeyPress = jest.fn();
    const props = createTextFieldProps({
      label: 'Search',
      value: '',
      onFocus: handleFocus,
      onKeyPress: handleKeyPress
    });

    const { user } = renderWithProviders(<TextField {...props} />);

    // Tab to focus the input
    await user.tab();

    const input = screen.getByRole('textbox', { name: /search/i });
    expect(input).toHaveFocus();
    expect(handleFocus).toHaveBeenCalled();

    // Test keypress event
    await user.keyboard('{Enter}');
    expect(handleKeyPress).toHaveBeenCalled();
  });
}); 