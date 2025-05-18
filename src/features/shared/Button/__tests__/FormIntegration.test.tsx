/**
 * Form Integration Tests for Button Components
 * 
 * Tests buttons within form contexts, focusing on loading/error states
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { HeroButton } from '../../../../features/Homepage/Hero/components/HeroButton';
import { FormProvider } from '../../FormField/FormContext';
import Button from '../components/Button';
import { ThemeProvider } from './ThemeTestUtils';

describe('Button Form Integration', () => {
  // Test standard button in form
  test('standard button handles submit with loading state', async () => {
    // Mock the submit handler
    const handleSubmit = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 100);
      });
    });
    
    // Setup a form with button
    render(
      <FormProvider onSubmit={handleSubmit}>
        <form data-testid="test-form">
          <Button 
            type="submit" 
            variant="primary"
            data-testid="submit-btn"
          >
            Submit
          </Button>
        </form>
      </FormProvider>
    );
    
    // Get form and button
    const form = screen.getByTestId('test-form');
    const button = screen.getByTestId('submit-btn');
    
    // Submit the form
    fireEvent.submit(form);
    
    // Verify the button shows loading state (disabled)
    expect(button).toBeDisabled();
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
  
  // Test HeroButton in form with error handling
  test('hero button handles form errors correctly', async () => {
    // Mock the submit handler that returns error
    const handleSubmit = jest.fn().mockImplementation(() => {
      throw new Error('Form submission failed');
    });
    
    const handleError = jest.fn();
    
    // Setup a form with HeroButton
    render(
      <ThemeProvider>
        <FormProvider onSubmit={handleSubmit} onError={handleError}>
          <form data-testid="test-form">
            <HeroButton 
              type="submit" 
              variant="primary"
              data-testid="hero-submit-btn"
            >
              Submit
            </HeroButton>
          </form>
        </FormProvider>
      </ThemeProvider>
    );
    
    // Get form and button
    const form = screen.getByTestId('test-form');
    const button = screen.getByTestId('hero-submit-btn');
    
    // Submit the form
    fireEvent.submit(form);
    
    // Verify error handling
    await waitFor(() => {
      expect(handleError).toHaveBeenCalled();
    });
  });
  
  // Test mixed button types in a form
  test('form with mixed button types behaves correctly', async () => {
    // Mock the submit handler
    const handleSubmit = jest.fn();
    
    // Setup a form with multiple button types
    render(
      <ThemeProvider>
        <FormProvider onSubmit={handleSubmit}>
          <form data-testid="test-form">
            <HeroButton 
              type="submit" 
              variant="primary"
              data-testid="hero-submit-btn"
            >
              Submit
            </HeroButton>
            <Button 
              type="button" 
              variant="secondary"
              data-testid="cancel-btn"
            >
              Cancel
            </Button>
          </form>
        </FormProvider>
      </ThemeProvider>
    );
    
    // Get buttons
    const submitButton = screen.getByTestId('hero-submit-btn');
    const cancelButton = screen.getByTestId('cancel-btn');
    
    // Verify both buttons are rendered
    expect(submitButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    
    // Click the submit button
    fireEvent.click(submitButton);
    
    // Verify form submission occurred
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
}); 