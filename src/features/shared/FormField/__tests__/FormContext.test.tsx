/**
 * FormContext Integration Tests
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { FormProvider, useFormContext, useFormField } from '../FormContext';
import { fieldsMatch, required } from '../validators';

// Test form with FormProvider
const TestForm = ({ onSubmit, initialValues }: any) => {
  return (
    <FormProvider 
      onSubmit={onSubmit} 
      initialValues={initialValues}
      validateOnChange={true}
      validateOnBlur={true}
      validateOnSubmit={true}
    >
      <TestFormInner />
    </FormProvider>
  );
};

// Inner form component to access form context
const TestFormInner = () => {
  const { handleSubmit, isSubmitting, errors, values, reset } = useFormContext();
  
  const nameField = useFormField('name', {
    validators: [required('Name is required')],
    defaultValue: ''
  });
  
  const emailField = useFormField('email', {
    validators: [required('Email is required')],
    defaultValue: ''
  });
  
  const passwordField = useFormField('password', {
    validators: [
      required('Password is required')
    ],
    defaultValue: ''
  });
  
  const confirmPasswordField = useFormField('confirmPassword', {
    validators: [
      required('Confirm password is required'),
      fieldsMatch('password', 'Passwords must match')
    ],
    defaultValue: ''
  });
  
  // Add a reset handler function
  const handleReset = () => {
    reset();
  };
  
  return (
    <form onSubmit={handleSubmit} data-testid="test-form">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...nameField}
          data-testid="name-input"
        />
        {nameField.error && (
          <div className="error" data-testid="name-error">{nameField.error}</div>
        )}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...emailField}
          data-testid="email-input"
        />
        {emailField.error && (
          <div className="error" data-testid="email-error">{emailField.error}</div>
        )}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...passwordField}
          data-testid="password-input"
        />
        {passwordField.error && (
          <div className="error" data-testid="password-error">{passwordField.error}</div>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...confirmPasswordField}
          data-testid="confirm-password-input"
        />
        {confirmPasswordField.error && (
          <div className="error" data-testid="confirm-password-error">{confirmPasswordField.error}</div>
        )}
      </div>
      
      <button type="submit" disabled={isSubmitting} data-testid="submit-button">
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      
      <button type="button" onClick={handleReset} data-testid="reset-button">
        Reset Form
      </button>
      
      {Object.keys(errors).length > 0 && (
        <div data-testid="form-errors">
          Please fix the errors above
        </div>
      )}
      
      <div data-testid="form-values">
        {JSON.stringify(values)}
      </div>
    </form>
  );
};

describe('FormContext', () => {
  it('initializes with default values', () => {
    const initialValues = { name: 'John', email: 'john@example.com' };
    render(<TestForm initialValues={initialValues} />);
    
    expect(screen.getByTestId('name-input')).toHaveValue('John');
    expect(screen.getByTestId('email-input')).toHaveValue('john@example.com');
  });
  
  it('updates form values on input change', () => {
    render(<TestForm />);
    
    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'Jane' } });
    
    expect(nameInput).toHaveValue('Jane');
    expect(screen.getByTestId('form-values').textContent).toContain('"name":"Jane"');
  });
  
  it('validates required fields on blur', async () => {
    render(<TestForm />);
    
    const nameInput = screen.getByTestId('name-input');
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);
    
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
    });
  });
  
  it('validates all fields on submit', async () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} />);
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-password-error')).toBeInTheDocument();
    });
    
    expect(onSubmit).not.toHaveBeenCalled();
  });
  
  it('validates cross-field validation', async () => {
    render(<TestForm />);
    
    // Fill out the password fields with different values
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.blur(confirmPasswordInput);
    
    await waitFor(() => {
      expect(screen.getByTestId('confirm-password-error')).toHaveTextContent('Passwords must match');
    });
  });
  
  it('submits the form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} />);
    
    // Fill out all the required fields
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    });
  });
  
  it('resets the form', async () => {
    render(<TestForm />);
    
    // Fill out a field
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    expect(screen.getByTestId('name-input')).toHaveValue('John Doe');
    
    // Click the reset button that's part of the form
    fireEvent.click(screen.getByTestId('reset-button'));
    
    // Verify the form was reset
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('');
    });
  });
}); 