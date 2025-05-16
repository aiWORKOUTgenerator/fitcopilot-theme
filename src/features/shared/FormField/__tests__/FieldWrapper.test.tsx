/**
 * FieldWrapper component tests
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import FieldWrapper from '../fields/FieldWrapper';

describe('FieldWrapper', () => {
  it('renders with minimal props', () => {
    render(
      <FieldWrapper id="test-id" name="test">
        <input id="test-id" />
      </FieldWrapper>
    );
    
    const wrapper = screen.getByTestId('field-test');
    expect(wrapper).toBeInTheDocument();
  });
  
  it('renders with label', () => {
    render(
      <FieldWrapper id="test-id" name="test" label="Test Label">
        <input id="test-id" />
      </FieldWrapper>
    );
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'test-id');
  });
  
  it('shows required indicator when required is true', () => {
    render(
      <FieldWrapper id="test-id" name="test" label="Test Label" required>
        <input id="test-id" />
      </FieldWrapper>
    );
    
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('form-field__required');
  });
  
  it('shows error message when error is provided', () => {
    const errorMessage = 'This field has an error';
    render(
      <FieldWrapper id="test-id" name="test" error={errorMessage}>
        <input id="test-id" />
      </FieldWrapper>
    );
    
    const error = screen.getByText(errorMessage);
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute('role', 'alert');
    expect(error).toHaveAttribute('id', 'test-id-error');
  });
  
  it('shows helper text when helperText is provided and no error', () => {
    const helperText = 'This is helper text';
    render(
      <FieldWrapper id="test-id" name="test" helperText={helperText}>
        <input id="test-id" />
      </FieldWrapper>
    );
    
    const helper = screen.getByText(helperText);
    expect(helper).toBeInTheDocument();
    expect(helper).toHaveAttribute('id', 'test-id-help');
  });
  
  it('prioritizes error message over helper text', () => {
    const errorMessage = 'This field has an error';
    const helperText = 'This is helper text';
    render(
      <FieldWrapper 
        id="test-id" 
        name="test" 
        error={errorMessage} 
        helperText={helperText}
      >
        <input id="test-id" />
      </FieldWrapper>
    );
    
    const error = screen.getByText(errorMessage);
    expect(error).toBeInTheDocument();
    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
  });
  
  it('applies loading state', () => {
    render(
      <FieldWrapper id="test-id" name="test" isLoading>
        <input id="test-id" />
      </FieldWrapper>
    );
    
    const wrapper = screen.getByTestId('field-test');
    expect(wrapper).toHaveClass('form-field--loading');
    expect(screen.getByTestId('field-test').querySelector('.form-field__loading')).toBeInTheDocument();
  });
  
  it('applies additional className', () => {
    render(
      <FieldWrapper id="test-id" name="test" className="custom-class">
        <input id="test-id" />
      </FieldWrapper>
    );
    
    const wrapper = screen.getByTestId('field-test');
    expect(wrapper).toHaveClass('custom-class');
  });
  
  it('adds aria attributes to child input', () => {
    const errorMessage = 'This field has an error';
    render(
      <FieldWrapper id="test-id" name="test" error={errorMessage}>
        <input id="test-id" data-testid="test-input" />
      </FieldWrapper>
    );
    
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-id-error');
  });
}); 