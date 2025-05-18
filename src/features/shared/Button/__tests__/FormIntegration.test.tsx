/**
 * Form Integration Tests for Button Components
 * 
 * Tests buttons within form contexts, focusing on loading/error states
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { useState } from 'react';
import { HeroButton } from '../../../../__mocks__/features/Homepage/Hero/components/HeroButton';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import { mockThemeStyles } from './ThemeTestUtils';

// Ensure HeroButton is mocked
jest.mock('../../../../features/Homepage/Hero/components/HeroButton', () => {
  return require('../../../../__mocks__/features/Homepage/Hero/components/HeroButton');
});

describe('Button Form Integration', () => {
  beforeEach(() => {
    // Setup theme styles for each test
    mockThemeStyles('default');
  });
  
  // Test standard button in form with loading state
  test('standard button handles submit with loading state', async () => {
    // Create test component with loading state
    const TestForm = () => {
      const [isLoading, setIsLoading] = useState(false);
      
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsLoading(false);
      };
      
      return (
        <form onSubmit={handleSubmit} data-testid="test-form">
          <Button 
            type="submit" 
            variant="primary"
            disabled={isLoading}
            data-testid="submit-btn"
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
        </form>
      );
    };
    
    render(<TestForm />);
    
    // Get form and button
    const form = screen.getByTestId('test-form');
    const button = screen.getByTestId('submit-btn');
    
    // Verify initial state
    expect(button).toHaveTextContent('Submit');
    expect(button).not.toBeDisabled();
    
    // Submit the form
    fireEvent.submit(form);
    
    // Verify the button shows loading state
    await waitFor(() => {
      expect(button).toHaveTextContent('Loading...');
      expect(button).toBeDisabled();
    });
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(button).toHaveTextContent('Submit');
      expect(button).not.toBeDisabled();
    }, { timeout: 200 });
  });
  
  // Test HeroButton in form with error handling
  test('hero button handles form errors correctly', async () => {
    // Create test component with error state
    const TestFormWithError = () => {
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
          // Simulate API call that fails
          await new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API Error')), 100)
          );
        } catch (err) {
          setError('Form submission failed');
        } finally {
          setIsLoading(false);
        }
      };
      
      return (
        <form onSubmit={handleSubmit} data-testid="error-form">
          <HeroButton 
            type="submit" 
            variant="primary"
            disabled={isLoading}
            data-testid="hero-submit-btn"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </HeroButton>
          
          {error && (
            <div data-testid="error-message" className="error">
              {error}
            </div>
          )}
        </form>
      );
    };
    
    render(<TestFormWithError />);
    
    // Get form and button
    const form = screen.getByTestId('error-form');
    const button = screen.getByTestId('hero-submit-btn');
    
    // Verify initial state - no error message
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    
    // Submit the form
    fireEvent.submit(form);
    
    // Verify the loading state
    await waitFor(() => {
      expect(button).toHaveTextContent('Submitting...');
    });
    
    // Verify error appears
    await waitFor(() => {
      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Form submission failed');
    }, { timeout: 200 });
  });
  
  // Test mixed button types in a form
  test('form with mixed button types behaves correctly', async () => {
    // Create component with multiple button types
    const TestFormWithMixedButtons = () => {
      const [formAction, setFormAction] = useState<string | null>(null);
      
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormAction('submit');
      };
      
      const handleCancel = () => {
        setFormAction('cancel');
      };
      
      return (
        <form onSubmit={handleSubmit} data-testid="mixed-form">
          <div data-testid="action-result">{formAction}</div>
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleCancel}
            data-testid="cancel-btn"
          >
            Cancel
          </Button>
          <HeroButton 
            type="submit" 
            variant="primary"
            data-testid="hero-submit-btn"
          >
            Submit
          </HeroButton>
        </form>
      );
    };
    
    render(<TestFormWithMixedButtons />);
    
    // Get buttons and action display
    const cancelBtn = screen.getByTestId('cancel-btn');
    const submitBtn = screen.getByTestId('hero-submit-btn');
    const actionResult = screen.getByTestId('action-result');
    
    // Verify initial state
    expect(actionResult).toHaveTextContent('');
    
    // Click the cancel button
    fireEvent.click(cancelBtn);
    expect(actionResult).toHaveTextContent('cancel');
    
    // Submit the form
    const form = screen.getByTestId('mixed-form');
    fireEvent.submit(form);
    expect(actionResult).toHaveTextContent('submit');
  });
  
  // Test ButtonGroup with mixed button types in a form
  test('ButtonGroup with mixed button types in form with loading state', async () => {
    // Create a component with form state
    const TestFormWithButtonGroup = () => {
      const [isSubmitting, setIsSubmitting] = useState(false);
      
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setIsSubmitting(false);
      };
      
      const handleCancel = () => {
        // Cancel handler
      };
      
      return (
        <form onSubmit={handleSubmit} data-testid="form-with-button-group">
          <ButtonGroup 
            direction="horizontal"
            spacing="medium"
            alignment="end"
            responsiveStacking
            data-testid="form-button-group"
          >
            <Button 
              type="button" 
              variant="secondary"
              onClick={handleCancel}
              data-testid="cancel-btn"
            >
              Cancel
            </Button>
            <HeroButton 
              type="submit" 
              variant="primary"
              disabled={isSubmitting}
              data-testid="hero-submit-btn"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </HeroButton>
          </ButtonGroup>
        </form>
      );
    };
    
    // Render the test component
    render(<TestFormWithButtonGroup />);
    
    // Get form and button group
    const form = screen.getByTestId('form-with-button-group');
    const buttonGroup = screen.getByTestId('form-button-group');
    
    // Verify button group has responsive class
    expect(buttonGroup).toHaveClass('button-group--responsive');
    
    // Get buttons
    const cancelBtn = screen.getByTestId('cancel-btn');
    const submitBtn = screen.getByTestId('hero-submit-btn');
    
    // Verify both buttons rendered correctly
    expect(cancelBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    
    // Verify submit button has correct initial text
    expect(submitBtn).toHaveTextContent('Submit');
    
    // Submit the form
    fireEvent.submit(form);
    
    // Verify the button shows loading state
    await waitFor(() => {
      expect(submitBtn).toHaveTextContent('Submitting...');
    });
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(submitBtn).toHaveTextContent('Submit');
    }, { timeout: 200 });
  });
}); 