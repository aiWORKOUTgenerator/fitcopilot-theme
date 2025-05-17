/**
 * Button Component Tests
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import Button from '../components/Button';
import {
  ButtonProps
} from '../types/buttonTypes';

// Mock the logger
jest.mock('../../../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('Button Component', () => {
  // Helper function to generate test props with proper type
  const createButtonProps = <T extends ButtonProps>(props: Partial<T> & { variant: T['variant'] }): T => ({
    children: 'Button Text',
    ...props
  } as T);

  it('renders as a button by default', () => {
    render(<Button variant="primary">Click Me</Button>);

    const button = screen.getByText('Click Me');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveClass('btn');
  });

  // Rest of the test file remains unchanged...
}); 