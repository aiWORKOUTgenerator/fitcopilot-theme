/**
 * Checkbox Component Tests
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { createCheckboxFieldProps } from '../__fixtures__/formFieldFixtures';
import Checkbox from '../fields/Checkbox';

describe('Checkbox Component', () => {
  it('renders with required props', () => {
    const props = createCheckboxFieldProps({
      label: 'Accept terms',
      checked: false
    });

    render(<Checkbox {...props} />);

    const checkbox = screen.getByLabelText('Accept terms');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders checked state correctly', () => {
    const props = createCheckboxFieldProps({
      label: 'Subscribe to newsletter',
      checked: true
    });

    render(<Checkbox {...props} />);

    const checkbox = screen.getByLabelText('Subscribe to newsletter');
    expect(checkbox).toBeChecked();
  });

  it('handles onChange events', () => {
    const handleChange = jest.fn();
    const props = createCheckboxFieldProps({
      label: 'Remember me',
      checked: false,
      onChange: handleChange
    });

    render(<Checkbox {...props} />);

    const checkbox = screen.getByLabelText('Remember me');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders label on the right by default', () => {
    const props = createCheckboxFieldProps({
      label: 'Opt-in',
      checked: false
    });

    render(<Checkbox {...props} />);

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Opt-in');

    // Check if label is positioned after the checkbox in the DOM
    expect(checkbox.nextSibling).toBe(label);
  });

  it('renders label on the left when labelPosition is "left"', () => {
    const props = createCheckboxFieldProps({
      label: 'Opt-in',
      checked: false,
      labelPosition: 'left'
    });

    render(<Checkbox {...props} />);

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Opt-in');

    // Check if label is positioned before the checkbox in the DOM
    expect(label.nextSibling).toBe(checkbox);
  });

  it('applies appropriate CSS classes', () => {
    const props = createCheckboxFieldProps({
      label: 'Terms',
      checked: false,
      className: 'custom-class'
    });

    render(<Checkbox {...props} />);

    const checkbox = screen.getByLabelText('Terms');
    expect(checkbox).toHaveClass('form-checkbox', 'custom-class');
  });

  it('renders error message when provided', () => {
    const props = createCheckboxFieldProps({
      label: 'Accept terms',
      checked: false,
      error: 'You must accept the terms to continue'
    });

    render(<Checkbox {...props} />);

    const errorMessage = screen.getByText('You must accept the terms to continue');
    expect(errorMessage).toBeInTheDocument();

    const checkbox = screen.getByLabelText('Accept terms');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables the checkbox when disabled prop is true', () => {
    const props = createCheckboxFieldProps({
      label: 'Accept terms',
      checked: false,
      disabled: true
    });

    render(<Checkbox {...props} />);

    const checkbox = screen.getByLabelText('Accept terms');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('form-checkbox--disabled');
  });

  it('adds required attribute when required prop is true', () => {
    const props = createCheckboxFieldProps({
      label: 'Accept terms',
      checked: false,
      required: true
    });

    render(<Checkbox {...props} />);

    const checkbox = screen.getByLabelText('Accept terms');
    expect(checkbox).toHaveAttribute('required');

    const label = screen.getByText('Accept terms');
    expect(label).toHaveClass('form-field__label--required');
  });
}); 