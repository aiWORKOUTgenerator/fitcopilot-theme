/**
 * PricingCardTooltip Component Tests
 * 
 * Comprehensive test suite for PricingCardTooltip component covering:
 * - Tooltip visibility states
 * - Plan-specific content rendering
 * - Icon display for different tooltip types
 * - Accessibility attributes and ARIA support
 * - Custom content support
 * - Conditional rendering logic
 * 
 * @fileoverview Test suite for PricingCardTooltip component
 * @since Phase 4 - CTA & Tooltip Integration
 */

import { render, screen } from '@testing-library/react';
import { PricingCardTooltip } from '../PricingCardTooltip';

describe('PricingCardTooltip Component', () => {
  describe('Beta Tooltip (Pro Plan)', () => {
    it('renders beta tooltip with correct content and icon', () => {
      render(
        <PricingCardTooltip
          planName="Pro"
          visible={true}
          content={null}
          type="beta"
        />
      );

      expect(screen.getByText('Beta Release Offer')).toBeInTheDocument();
      expect(screen.getByText(/Provide feedback directly to our development team/)).toBeInTheDocument();
      
      // Check for Shield icon using SVG selector
      const tooltip = screen.getByRole('tooltip');
      const icon = tooltip.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-lime-300');
    });

    it('has proper accessibility attributes for beta tooltip', () => {
      render(
        <PricingCardTooltip
          planName="Pro"
          visible={true}
          content={null}
          type="beta"
        />
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('id', 'pro-tooltip');
      expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Elite Tooltip', () => {
    it('renders elite tooltip with correct content and icon', () => {
      render(
        <PricingCardTooltip
          planName="Elite"
          visible={true}
          content={null}
          type="elite"
        />
      );

      expect(screen.getByText('Certified Trainers')).toBeInTheDocument();
      expect(screen.getByText(/Work with real certified trainers/)).toBeInTheDocument();
      
      // Check for Users icon using SVG selector
      const tooltip = screen.getByRole('tooltip');
      const icon = tooltip.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-purple-300');
    });

    it('has proper accessibility attributes for elite tooltip', () => {
      render(
        <PricingCardTooltip
          planName="Elite"
          visible={true}
          content={null}
          type="elite"
        />
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('id', 'elite-tooltip');
      expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Basic Tooltip', () => {
    it('does not render content for basic type (no tooltip in original implementation)', () => {
      const { container } = render(
        <PricingCardTooltip
          planName="Basic"
          visible={true}
          content={null}
          type="basic"
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Custom Content', () => {
    it('renders custom content when provided', () => {
      const customContent = <div>Custom tooltip content</div>;
      
      render(
        <PricingCardTooltip
          planName="Custom"
          visible={true}
          content={customContent}
          type="basic"
        />
      );

      expect(screen.getByText('Custom tooltip content')).toBeInTheDocument();
    });

    it('prioritizes type content over custom content for beta type', () => {
      const customContent = <div>Custom content</div>;
      
      render(
        <PricingCardTooltip
          planName="Pro"
          visible={true}
          content={customContent}
          type="beta"
        />
      );

      expect(screen.getByText('Beta Release Offer')).toBeInTheDocument();
      expect(screen.queryByText('Custom content')).not.toBeInTheDocument();
    });
  });

  describe('Visibility States', () => {
    it('applies visible classes when visible is true', () => {
      render(
        <PricingCardTooltip
          planName="Pro"
          visible={true}
          content={null}
          type="beta"
        />
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('opacity-100', 'visible');
      expect(tooltip).not.toHaveClass('opacity-0', 'invisible', 'pointer-events-none');
    });

    it('applies hidden classes when visible is false', () => {
      render(
        <PricingCardTooltip
          planName="Pro"
          visible={false}
          content={null}
          type="beta"
        />
      );

      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveClass('opacity-0', 'invisible', 'pointer-events-none');
      expect(tooltip).not.toHaveClass('opacity-100', 'visible');
    });

    it('sets aria-hidden based on visibility', () => {
      const { rerender } = render(
        <PricingCardTooltip
          planName="Pro"
          visible={true}
          content={null}
          type="beta"
        />
      );

      expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');

      rerender(
        <PricingCardTooltip
          planName="Pro"
          visible={false}
          content={null}
          type="beta"
        />
      );

      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Conditional Rendering', () => {
    it('does not render when visible is false and no content', () => {
      const { container } = render(
        <PricingCardTooltip
          planName="Test"
          visible={false}
          content={null}
          type="basic"
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('does not render when visible is true but no content for basic type', () => {
      const { container } = render(
        <PricingCardTooltip
          planName="Test"
          visible={true}
          content={null}
          type="basic"
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('renders when visible is true and has content', () => {
      render(
        <PricingCardTooltip
          planName="Pro"
          visible={true}
          content={null}
          type="beta"
        />
      );

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  describe('Plan Name Handling', () => {
    it('generates correct tooltip ID from plan name', () => {
      render(
        <PricingCardTooltip
          planName="Custom Plan"
          visible={true}
          content={<div>Test content</div>}
          type="basic"
        />
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('id', 'custom plan-tooltip');
    });

    it('handles lowercase plan names correctly', () => {
      render(
        <PricingCardTooltip
          planName="pro"
          visible={true}
          content={null}
          type="beta"
        />
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('id', 'pro-tooltip');
    });
  });

  describe('Icon Accessibility', () => {
    it('marks icons as aria-hidden', () => {
      render(
        <PricingCardTooltip
          planName="Pro"
          visible={true}
          content={null}
          type="beta"
        />
      );

      const tooltip = screen.getByRole('tooltip');
      const icon = tooltip.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('marks users icon as aria-hidden for elite type', () => {
      render(
        <PricingCardTooltip
          planName="Elite"
          visible={true}
          content={null}
          type="elite"
        />
      );

      const tooltip = screen.getByRole('tooltip');
      const icon = tooltip.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('CSS Classes', () => {
    it('applies plan-tooltip-cta base class', () => {
      render(
        <PricingCardTooltip
          planName="Pro"
          visible={true}
          content={null}
          type="beta"
        />
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('plan-tooltip-cta');
    });

    it('applies correct text color classes for beta content', () => {
      render(
        <PricingCardTooltip
          planName="Pro"
          visible={true}
          content={null}
          type="beta"
        />
      );

      const heading = screen.getByText('Beta Release Offer');
      expect(heading).toHaveClass('text-lime-300');
      
      const description = screen.getByText(/Provide feedback directly/);
      expect(description).toHaveClass('text-gray-300');
    });

    it('applies correct text color classes for elite content', () => {
      render(
        <PricingCardTooltip
          planName="Elite"
          visible={true}
          content={null}
          type="elite"
        />
      );

      const heading = screen.getByText('Certified Trainers');
      expect(heading).toHaveClass('text-purple-300');
      
      const description = screen.getByText(/Work with real certified trainers/);
      expect(description).toHaveClass('text-gray-300');
    });
  });
}); 