/**
 * Button Fixtures Tests
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import Button from '../Button';
import {
  createButtonProps,
  createLinkButtonProps,
  createPrimaryButtonProps,
  createSecondaryButtonProps,
  createTextButtonProps,
  createToggleButtonProps
} from '../__fixtures__/buttonFixtures';

// Mock the logger
jest.mock('../../../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('Button Fixtures', () => {
  it('creates primary button props correctly', () => {
    const props = createPrimaryButtonProps();

    expect(props.variant).toBe('primary');
    expect(props.children).toBe('Primary Button');

    // Test with custom props
    const customProps = createPrimaryButtonProps({ className: 'custom-class' });
    expect(customProps.variant).toBe('primary');
    expect(customProps.className).toBe('custom-class');
  });

  it('creates secondary button props correctly', () => {
    const props = createSecondaryButtonProps();

    expect(props.variant).toBe('secondary');
    expect(props.children).toBe('Secondary Button');
  });

  it('creates text button props correctly', () => {
    const props = createTextButtonProps();

    expect(props.variant).toBe('text');
    expect(props.children).toBe('Text Button');
  });

  it('creates link button props correctly', () => {
    const props = createLinkButtonProps();

    expect(props.variant).toBe('link');
    expect(props.href).toBe('https://example.com');
    expect(props.children).toBe('Link Button');
  });

  it('creates toggle button props correctly', () => {
    const props = createToggleButtonProps();

    expect(props.variant).toBe('toggle');
    expect(props.isActive).toBe(false);
    expect(props.children).toBe('Toggle Button');

    // Test with active state
    const activeProps = createToggleButtonProps({ isActive: true });
    expect(activeProps.isActive).toBe(true);
  });

  it('renders button with fixture props', () => {
    const props = createPrimaryButtonProps({ 'data-testid': 'fixture-button' });

    render(<Button {...props} />);

    const button = screen.getByTestId('fixture-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Primary Button');
  });

  it('uses createButtonProps for different variants', () => {
    expect(createButtonProps('primary').variant).toBe('primary');
    expect(createButtonProps('secondary').variant).toBe('secondary');
    expect(createButtonProps('text').variant).toBe('text');
    expect(createButtonProps('link').variant).toBe('link');
    expect(createButtonProps('toggle').variant).toBe('toggle');

    // Default to primary if invalid variant
    expect(createButtonProps('invalid' as any).variant).toBe('primary');
  });
}); 