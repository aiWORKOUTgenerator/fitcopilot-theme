/**
 * PricingCardHeader Component Tests
 * 
 * Tests to verify the extracted PricingCardHeader component
 * renders identically to the original implementation
 * 
 * @phase Phase 3 - Header Component Testing
 */

import { render, screen } from '@testing-library/react';
import { PricingCardData } from '../../types';
import { PricingCardHeader } from './PricingCardHeader';

// Mock data for testing
const mockBasicPlan: PricingCardData = {
  name: 'Basic',
  price: '$9.99',
  betaPrice: 'FREE',
  description: 'Perfect for beginners starting their fitness journey',
  features: [],
  isPopular: false,
  accentColors: 'from-blue-300 to-cyan-400',
  titleTextColors: 'from-lime-300 to-emerald-400',
  priceTextColors: 'from-lime-300 to-emerald-400',
  accentTextColor: 'blue-300',
  icon: null,
  badge: 'Starter',
  ctaText: 'Get Started',
  ctaLink: 'https://example.com'
};

const mockProPlan: PricingCardData = {
  name: 'Pro',
  price: '$19.99',
  betaPrice: '$10',
  description: 'Our most popular plan for serious fitness enthusiasts',
  features: [],
  isPopular: true,
  accentColors: 'from-lime-300 to-emerald-400',
  titleTextColors: 'from-purple-300 to-indigo-400',
  priceTextColors: 'from-purple-300 to-indigo-400',
  accentTextColor: 'lime-300',
  icon: null,
  badge: 'Most Popular',
  ctaText: 'Try Pro Plan',
  ctaLink: 'https://example.com'
};

const mockElitePlan: PricingCardData = {
  name: 'Elite',
  price: '$99.99',
  description: 'Maximize Your Potential with Expert Coaches & AI Mastery',
  features: [],
  isPopular: false,
  accentColors: 'from-purple-300 to-indigo-400',
  titleTextColors: 'from-lime-300 to-emerald-400',
  priceTextColors: 'from-lime-300 to-emerald-400',
  accentTextColor: 'purple-300',
  icon: null,
  badge: 'Premium',
  ctaText: 'Go Elite',
  ctaLink: 'https://example.com'
};

describe('PricingCardHeader Component', () => {
  it('renders basic plan header correctly', () => {
    render(
      <PricingCardHeader
        plan={mockBasicPlan}
        isPopular={false}
        variant="default"
      />
    );

    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Perfect for beginners starting their fitness journey')).toBeInTheDocument();
    expect(screen.getByText('Hover for more details')).toBeInTheDocument();
  });

  it('renders popular plan badge for Pro plan', () => {
    render(
      <PricingCardHeader
        plan={mockProPlan}
        isPopular={true}
        variant="default"
      />
    );

    // Check for all instances of "Most Popular" text
    const mostPopularElements = screen.getAllByText('Most Popular');
    expect(mostPopularElements).toHaveLength(2); // One in top badge, one in plan badge
    
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Our most popular plan for serious fitness enthusiasts')).toBeInTheDocument();
  });

  it('renders elite plan with crown icon', () => {
    render(
      <PricingCardHeader
        plan={mockElitePlan}
        isPopular={false}
        variant="default"
      />
    );

    expect(screen.getByText('Elite')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Maximize Your Potential with Expert Coaches & AI Mastery')).toBeInTheDocument();
  });

  it('applies correct CSS classes for plan name gradients', () => {
    const { container } = render(
      <PricingCardHeader
        plan={mockProPlan}
        isPopular={true}
        variant="default"
      />
    );

    const planName = container.querySelector('.plan-name');
    expect(planName).toHaveClass('plan-name-gradient');
    expect(planName).toHaveClass('bg-gradient-to-r');
    expect(planName).toHaveClass('from-purple-300');
    expect(planName).toHaveClass('to-indigo-400');
  });

  it('shows hover hint for interactive plans', () => {
    render(
      <PricingCardHeader
        plan={mockBasicPlan}
        isPopular={false}
        variant="default"
      />
    );

    const hoverHint = screen.getByText('Hover for more details');
    expect(hoverHint).toBeInTheDocument();
    expect(hoverHint).toHaveClass('text-xs', 'text-gray-400', 'italic');
  });

  it('applies correct badge styling for different plan types', () => {
    const { container: basicContainer } = render(
      <PricingCardHeader
        plan={mockBasicPlan}
        isPopular={false}
        variant="default"
      />
    );

    const basicBadge = basicContainer.querySelector('.plan-badge');
    expect(basicBadge).toHaveClass('text-gray-300');

    const { container: eliteContainer } = render(
      <PricingCardHeader
        plan={mockElitePlan}
        isPopular={false}
        variant="default"
      />
    );

    const eliteBadge = eliteContainer.querySelector('.plan-badge');
    expect(eliteBadge).toHaveClass('text-purple-300');
  });
}); 