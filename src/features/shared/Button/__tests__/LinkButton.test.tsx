/**
 * LinkButton Component Tests
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import LinkButton from '../LinkButton';

describe('LinkButton Component', () => {
  it('renders a link with href attribute', () => {
    render(
      <LinkButton 
        variant="link" 
        href="https://example.com" 
        data-testid="test-link"
      >
        Visit Site
      </LinkButton>
    );

    const link = screen.getByTestId('test-link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('link-button');
  });

  it('adds target attribute when openInNewTab is true', () => {
    render(
      <LinkButton
        variant="link"
        href="https://example.com"
        openInNewTab={true}
        data-testid="test-link"
      >
        External Link
      </LinkButton>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('respects custom rel attribute', () => {
    render(
      <LinkButton
        variant="link"
        href="https://example.com"
        rel="nofollow"
        data-testid="test-link"
      >
        No Follow Link
      </LinkButton>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('rel', 'nofollow');
  });

  it('applies custom className', () => {
    render(
      <LinkButton
        variant="link"
        href="https://example.com"
        className="custom-link"
        data-testid="test-link"
      >
        Custom Link
      </LinkButton>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveClass('custom-link');
    // Also check default classes
    expect(link).toHaveClass('link-button');
  });

  it('renders children correctly', () => {
    render(
      <LinkButton 
        variant="link" 
        href="https://example.com"
      >
        <span data-testid="child-element">Link Content</span>
      </LinkButton>
    );

    const childElement = screen.getByTestId('child-element');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Link Content');
  });

  it('applies role attribute correctly', () => {
    render(
      <LinkButton
        variant="link"
        href="https://example.com"
        data-testid="test-link"
      >
        Link as Button
      </LinkButton>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('role', 'button');
  });

  it('preserves additional attributes', () => {
    render(
      <LinkButton
        variant="link"
        href="https://example.com"
        data-testid="test-link"
        aria-label="Visit example site"
      >
        Link With Attributes
      </LinkButton>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('aria-label', 'Visit example site');
  });
}); 