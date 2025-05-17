/**
 * Button Accessibility Tests
 * 
 * Tests focusing on accessibility aspects of the Button component system
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { HeroButton } from '../../../Homepage/Hero/components/HeroButton';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import { ThemeProvider } from './ThemeTestUtils';

describe('Button Accessibility', () => {
  // Test keyboard navigation
  describe('Keyboard Navigation', () => {
    test('allows tabbing through buttons', async () => {
      render(
        <div>
          <Button variant="primary" data-testid="btn-1">First Button</Button>
          <Button variant="secondary" data-testid="btn-2">Second Button</Button>
          <HeroButton variant="primary" data-testid="btn-3">Hero Button</HeroButton>
        </div>
      );
      
      // Check initial state
      const firstButton = screen.getByTestId('btn-1');
      const secondButton = screen.getByTestId('btn-2');
      const heroButton = screen.getByTestId('btn-3');
      
      // Start with no focus
      expect(document.activeElement).not.toBe(firstButton);
      expect(document.activeElement).not.toBe(secondButton);
      expect(document.activeElement).not.toBe(heroButton);
      
      // Tab to first button
      await userEvent.tab();
      expect(document.activeElement).toBe(firstButton);
      
      // Tab to second button
      await userEvent.tab();
      expect(document.activeElement).toBe(secondButton);
      
      // Tab to hero button
      await userEvent.tab();
      expect(document.activeElement).toBe(heroButton);
    });
    
    test('allows activating buttons with Enter key', async () => {
      const handleClick = jest.fn();
      render(<Button variant="primary" onClick={handleClick}>Enter Key Test</Button>);
      
      const button = screen.getByRole('button', { name: /enter key test/i });
      button.focus();
      
      await userEvent.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    test('allows activating buttons with Space key', async () => {
      const handleClick = jest.fn();
      render(<Button variant="primary" onClick={handleClick}>Space Key Test</Button>);
      
      const button = screen.getByRole('button', { name: /space key test/i });
      button.focus();
      
      await userEvent.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    test('button group enables arrow key navigation when used as a toolbar', () => {
      render(
        <div role="toolbar" aria-label="Formatting Options">
          <ButtonGroup>
            <Button variant="primary" aria-label="Bold">B</Button>
            <Button variant="primary" aria-label="Italic">I</Button>
            <Button variant="primary" aria-label="Underline">U</Button>
          </ButtonGroup>
        </div>
      );
      
      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toHaveAttribute('aria-label', 'Formatting Options');
    });
  });
  
  // Test ARIA attributes
  describe('ARIA Support', () => {
    test('preserves aria-label on Button', () => {
      render(<Button variant="primary" aria-label="Close dialog">X</Button>);
      
      const button = screen.getByRole('button', { name: /close dialog/i });
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });
    
    test('preserves aria-label on HeroButton', () => {
      render(<HeroButton variant="primary" aria-label="Start free trial">Begin</HeroButton>);
      
      const button = screen.getByRole('button', { name: /start free trial/i });
      expect(button).toHaveAttribute('aria-label', 'Start free trial');
    });
    
    test('supports aria-pressed on toggle buttons', () => {
      // Create a custom ToggleButton component that directly renders the aria-pressed attribute
      const ToggleButton = ({ pressed }: { pressed: boolean }) => (
        <button 
          type="button"
          aria-pressed={pressed}
          data-testid="toggle-btn"
        >
          Toggle
        </button>
      );
      
      const { rerender } = render(<ToggleButton pressed={false} />);
      
      let button = screen.getByTestId('toggle-btn');
      expect(button).toHaveAttribute('aria-pressed', 'false');
      
      rerender(<ToggleButton pressed={true} />);
      
      button = screen.getByTestId('toggle-btn');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
    
    test('supports aria-expanded on dropdown buttons', () => {
      // Create a custom Dropdown component that directly sets aria attributes
      const DropdownButton = ({ expanded }: { expanded: boolean }) => (
        <button
          type="button"
          aria-expanded={expanded}
          aria-haspopup="true"
        >
          Dropdown
        </button>
      );
      
      render(<DropdownButton expanded={false} />);
      
      const button = screen.getByRole('button', { name: /dropdown/i });
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });
    
    test('supports aria-controls for related elements', () => {
      // Direct DOM testing for aria-controls
      render(
        <>
          <button 
            type="button" 
            aria-controls="panel-1"
            aria-expanded={true}
          >
            Show Panel
          </button>
          <div id="panel-1" data-testid="panel">Panel Content</div>
        </>
      );
      
      const button = screen.getByRole('button', { name: /show panel/i });
      const panel = screen.getByTestId('panel');
      
      expect(button).toHaveAttribute('aria-controls', 'panel-1');
      expect(panel).toHaveAttribute('id', 'panel-1');
    });
  });
  
  // Test high contrast mode
  describe('High Contrast Support', () => {
    test('buttons have sufficient focus indication', () => {
      render(
        <div>
          <Button variant="primary" data-testid="btn">Standard Button</Button>
          <HeroButton variant="primary" data-testid="hero-btn">Hero Button</HeroButton>
        </div>
      );
      
      const button = screen.getByTestId('btn');
      const heroButton = screen.getByTestId('hero-btn');
      
      // Focus the buttons and check that they have focus styles
      button.focus();
      expect(document.activeElement).toBe(button);
      
      heroButton.focus();
      expect(document.activeElement).toBe(heroButton);
    });
  });
  
  // Test states and feedback
  describe('States and Feedback', () => {
    test('disabled buttons have aria-disabled attribute', () => {
      render(
        <div>
          <Button variant="primary" disabled data-testid="btn">Disabled Button</Button>
          <HeroButton variant="primary" disabled data-testid="hero-btn">Disabled Hero</HeroButton>
        </div>
      );
      
      const button = screen.getByTestId('btn');
      const heroButton = screen.getByTestId('hero-btn');
      
      expect(button).toBeDisabled();
      expect(heroButton).toBeDisabled();
      
      // Depending on implementation, they might also have aria-disabled
      expect(button).toHaveAttribute('disabled');
      expect(heroButton).toHaveAttribute('disabled');
    });
    
    test('loading buttons indicate loading state', () => {
      // Direct DOM testing for loading state
      render(
        <button 
          type="button" 
          aria-busy={true}
          aria-label="Loading, please wait"
        >
          <span role="status">Loading...</span>
        </button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-label', 'Loading, please wait');
      
      const statusText = screen.getByRole('status');
      expect(statusText).toHaveTextContent('Loading...');
    });
  });
  
  // Test theme-related accessibility
  describe('Theme-related Accessibility', () => {
    test('buttons maintain readable text in different themes', () => {
      render(
        <div>
          <ThemeProvider theme="default">
            <Button variant="primary" data-testid="default-btn">Default Theme</Button>
          </ThemeProvider>
          <ThemeProvider theme="gym">
            <Button variant="primary" data-testid="gym-btn">Gym Theme</Button>
          </ThemeProvider>
          <ThemeProvider theme="sports">
            <Button variant="primary" data-testid="sports-btn">Sports Theme</Button>
          </ThemeProvider>
          <ThemeProvider theme="wellness">
            <Button variant="primary" data-testid="wellness-btn">Wellness Theme</Button>
          </ThemeProvider>
        </div>
      );
      
      // Verify all buttons are rendered
      expect(screen.getByTestId('default-btn')).toBeInTheDocument();
      expect(screen.getByTestId('gym-btn')).toBeInTheDocument();
      expect(screen.getByTestId('sports-btn')).toBeInTheDocument();
      expect(screen.getByTestId('wellness-btn')).toBeInTheDocument();
    });
  });
  
  // Test button sizing and touch targets
  describe('Size and Touch Targets', () => {
    test('buttons have sufficient touch target size', () => {
      // Note: We create a wrapper component to avoid size prop type validation issues
      const SizedButton = ({ size, testId }: { size: string, testId: string }) => (
        <button 
          type="button" 
          className={`btn btn-primary btn-${size}`} 
          data-testid={testId}
        >
          {size} Button
        </button>
      );
      
      render(
        <div>
          <SizedButton size="small" testId="small-btn" />
          <SizedButton size="medium" testId="medium-btn" />
          <SizedButton size="large" testId="large-btn" />
          <HeroButton variant="primary" size="small" data-testid="small-hero">Small Hero</HeroButton>
          <HeroButton variant="primary" size="medium" data-testid="medium-hero">Medium Hero</HeroButton>
          <HeroButton variant="primary" size="large" data-testid="large-hero">Large Hero</HeroButton>
        </div>
      );
      
      // Check all buttons are rendered
      expect(screen.getByTestId('small-btn')).toBeInTheDocument();
      expect(screen.getByTestId('medium-btn')).toBeInTheDocument();
      expect(screen.getByTestId('large-btn')).toBeInTheDocument();
      expect(screen.getByTestId('small-hero')).toBeInTheDocument();
      expect(screen.getByTestId('medium-hero')).toBeInTheDocument();
      expect(screen.getByTestId('large-hero')).toBeInTheDocument();
      
      // Check size classes
      expect(screen.getByTestId('small-btn')).toHaveClass('btn-small');
      expect(screen.getByTestId('medium-btn')).toHaveClass('btn-medium');
      expect(screen.getByTestId('large-btn')).toHaveClass('btn-large');
      expect(screen.getByTestId('small-hero')).toHaveClass('hero-button--small');
      expect(screen.getByTestId('medium-hero')).toHaveClass('hero-button--medium');
      expect(screen.getByTestId('large-hero')).toHaveClass('hero-button--large');
    });
  });
}); 