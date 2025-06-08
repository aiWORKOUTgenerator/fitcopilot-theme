/**
 * PricingCardCTA Component Tests
 * 
 * Comprehensive test suite for PricingCardCTA component covering:
 * - Rendering with different plan types
 * - Hover state changes and text updates
 * - Sparkles icon display logic
 * - Click handling and callbacks
 * - Accessibility attributes
 * - Link vs button rendering
 * 
 * @fileoverview Test suite for PricingCardCTA component
 * @since Phase 4 - CTA & Tooltip Integration
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { PricingCardData, TooltipStates } from '../../../types';
import { PricingCardCTA } from '../PricingCardCTA';

// Mock test data
const mockBasicPlan: PricingCardData = {
  name: 'Basic',
  price: '$9.99',
  betaPrice: 'FREE',
  description: 'Perfect for beginners',
  features: [],
  isPopular: false,
  accentColors: 'from-blue-300 to-cyan-400',
  titleTextColors: 'from-lime-300 to-emerald-400',
  priceTextColors: 'from-lime-300 to-emerald-400',
  accentTextColor: 'blue-300',
  badge: 'Starter',
  ctaText: 'Get Started',
  ctaLink: 'https://example.com/basic',
  icon: null
};

const mockProPlan: PricingCardData = {
  name: 'Pro',
  price: '$19.99',
  betaPrice: '$10',
  description: 'Most popular plan',
  features: [],
  isPopular: true,
  accentColors: 'from-lime-300 to-emerald-400',
  titleTextColors: 'from-purple-300 to-indigo-400',
  priceTextColors: 'from-purple-300 to-indigo-400',
  accentTextColor: 'lime-300',
  badge: 'Most Popular',
  ctaText: 'Try Pro Plan',
  ctaLink: 'https://example.com/pro',
  icon: null
};

const mockElitePlan: PricingCardData = {
  name: 'Elite',
  price: '$99.99',
  description: 'Premium plan',
  features: [],
  isPopular: false,
  accentColors: 'from-purple-300 to-indigo-400',
  titleTextColors: 'from-lime-300 to-emerald-400',
  priceTextColors: 'from-lime-300 to-emerald-400',
  accentTextColor: 'purple-300',
  badge: 'Premium',
  ctaText: 'Go Elite',
  ctaLink: 'https://example.com/elite',
  icon: null
};

const mockTooltipStates: TooltipStates = {
  showBetaTooltip: false,
  showEliteTooltip: false,
  isBasicCardHovered: false,
  isProCardHovered: false
};

const mockOnClick = jest.fn();

beforeEach(() => {
  mockOnClick.mockClear();
});

describe('PricingCardCTA Component', () => {
  describe('Basic Plan CTA', () => {
    it('renders Basic plan CTA with default text', () => {
      render(
        <PricingCardCTA
          plan={mockBasicPlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveClass('from-blue-500', 'to-indigo-600');
    });

    it('changes text when Basic card is hovered', () => {
      const hoveredTooltipStates = { ...mockTooltipStates, isBasicCardHovered: true };
      
      render(
        <PricingCardCTA
          plan={mockBasicPlan}
          isHovered={true}
          tooltipStates={hoveredTooltipStates}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Get FREE Access')).toBeInTheDocument();
    });

    it('shows Sparkles icon when Basic card is hovered', () => {
      const hoveredTooltipStates = { ...mockTooltipStates, isBasicCardHovered: true };
      
      render(
        <PricingCardCTA
          plan={mockBasicPlan}
          isHovered={true}
          tooltipStates={hoveredTooltipStates}
          onClick={mockOnClick}
        />
      );

      // Look for the icon by its SVG characteristics
      const sparklesIcon = screen.getByRole('button').querySelector('svg');
      expect(sparklesIcon).toBeInTheDocument();
      expect(sparklesIcon).toHaveClass('text-blue-300');
    });

    it('renders as link when ctaLink is provided', () => {
      render(
        <PricingCardCTA
          plan={mockBasicPlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      const linkElement = screen.getByRole('button');
      expect(linkElement.tagName).toBe('A');
      expect(linkElement).toHaveAttribute('href', 'https://example.com/basic');
    });
  });

  describe('Pro Plan CTA', () => {
    it('renders Pro plan CTA with default text', () => {
      render(
        <PricingCardCTA
          plan={mockProPlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveClass('from-lime-400', 'to-emerald-500');
    });

    it('changes text when Pro card is hovered', () => {
      const hoveredTooltipStates = { ...mockTooltipStates, isProCardHovered: true };
      
      render(
        <PricingCardCTA
          plan={mockProPlan}
          isHovered={true}
          tooltipStates={hoveredTooltipStates}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Get Beta Price - $10/mo')).toBeInTheDocument();
    });

    it('always shows Sparkles icon for Pro plan', () => {
      render(
        <PricingCardCTA
          plan={mockProPlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      // Look for the icon by its SVG characteristics
      const sparklesIcon = screen.getByRole('button').querySelector('svg');
      expect(sparklesIcon).toBeInTheDocument();
      expect(sparklesIcon).toHaveClass('text-lime-300');
    });
  });

  describe('Elite Plan CTA', () => {
    it('renders Elite plan CTA with correct styling', () => {
      render(
        <PricingCardCTA
          plan={mockElitePlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Go Elite')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveClass('from-purple-500', 'to-indigo-600');
    });

    it('does not show Sparkles icon for Elite plan when not popular', () => {
      render(
        <PricingCardCTA
          plan={mockElitePlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      const sparklesIcon = screen.getByRole('button').querySelector('svg');
      expect(sparklesIcon).not.toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when CTA is clicked', () => {
      render(
        <PricingCardCTA
          plan={mockBasicPlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when link CTA is clicked', () => {
      render(
        <PricingCardCTA
          plan={mockProPlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label', () => {
      render(
        <PricingCardCTA
          plan={mockBasicPlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Select Basic plan - Get Started'
      );
    });

    it('updates ARIA label when hover state changes', () => {
      const hoveredTooltipStates = { ...mockTooltipStates, isBasicCardHovered: true };
      
      render(
        <PricingCardCTA
          plan={mockBasicPlan}
          isHovered={true}
          tooltipStates={hoveredTooltipStates}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Select Basic plan - Get FREE Access'
      );
    });

    it('has proper button type when rendered as button', () => {
      const planWithoutLink = { ...mockBasicPlan, ctaLink: undefined };
      
      render(
        <PricingCardCTA
          plan={planWithoutLink}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('has aria-hidden on Sparkles icons', () => {
      render(
        <PricingCardCTA
          plan={mockProPlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      const sparklesIcon = screen.getByRole('button').querySelector('svg');
      expect(sparklesIcon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Popular Plan Behavior', () => {
    it('shows Sparkles icon for popular plans', () => {
      const popularPlan = { ...mockElitePlan, isPopular: true };
      
      render(
        <PricingCardCTA
          plan={popularPlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      const sparklesIcon = screen.getByRole('button').querySelector('svg');
      expect(sparklesIcon).toBeInTheDocument();
    });

    it('uses "Get Started" text for popular plans', () => {
      const popularPlan = { ...mockElitePlan, isPopular: true };
      
      render(
        <PricingCardCTA
          plan={popularPlan}
          isHovered={false}
          tooltipStates={mockTooltipStates}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });
  });
}); 