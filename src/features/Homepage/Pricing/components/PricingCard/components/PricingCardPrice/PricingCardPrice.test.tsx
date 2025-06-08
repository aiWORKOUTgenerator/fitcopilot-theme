/**
 * PricingCardPrice Component Tests
 * 
 * Tests to verify the extracted PricingCardPrice component
 * renders identically to the original implementation
 * 
 * @phase Phase 2 - Test Price Component Isolation
 */

import { render, screen } from '@testing-library/react';
import { PricingCardData } from '../../types';
import { PricingCardPrice } from './PricingCardPrice';

// Mock data for testing
const mockPlan: PricingCardData = {
  name: 'Pro',
  price: '$19.99',
  betaPrice: '$10',
  description: 'Test plan description',
  features: [],
  isPopular: true,
  accentColors: 'from-lime-300 to-emerald-400',
  titleTextColors: 'from-purple-300 to-indigo-400',
  priceTextColors: 'from-purple-300 to-indigo-400',
  accentTextColor: 'lime-300',
  icon: null,
  badge: 'Most Popular',
  ctaText: 'Get Started',
  ctaLink: 'https://example.com'
};

const mockRenderParticles = () => <div data-testid="particles">Particles</div>;

describe('PricingCardPrice Component', () => {
  it('renders normal state for Pro plan correctly', () => {
    render(
      <PricingCardPrice
        plan={mockPlan}
        animationState="normal"
        isHovered={false}
        renderExplosionParticles={mockRenderParticles}
        planType="pro"
      />
    );

    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('/ month')).toBeInTheDocument();
  });

  it('renders exploding state with particles', () => {
    render(
      <PricingCardPrice
        plan={mockPlan}
        animationState="exploding"
        isHovered={false}
        renderExplosionParticles={mockRenderParticles}
        planType="pro"
      />
    );

    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByTestId('particles')).toBeInTheDocument();
  });

  it('renders beta price state correctly', () => {
    render(
      <PricingCardPrice
        plan={mockPlan}
        animationState="betaPrice"
        isHovered={false}
        renderExplosionParticles={mockRenderParticles}
        planType="pro"
      />
    );

    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('Beta Offer')).toBeInTheDocument();
  });

  it('renders basic plan with correct styling', () => {
    const basicPlan = { ...mockPlan, name: 'Basic', price: '$9.99', betaPrice: 'FREE' };
    
    render(
      <PricingCardPrice
        plan={basicPlan}
        animationState="betaPrice"
        isHovered={false}
        renderExplosionParticles={mockRenderParticles}
        planType="basic"
      />
    );

    expect(screen.getByText('FREE')).toBeInTheDocument();
    expect(screen.getByText('Beta Special')).toBeInTheDocument();
    expect(screen.getByText('access')).toBeInTheDocument();
  });

  it('renders elite plan static price correctly', () => {
    const elitePlan = { ...mockPlan, name: 'Elite', price: '$99.99' };
    
    render(
      <PricingCardPrice
        plan={elitePlan}
        animationState="normal"
        isHovered={false}
        renderExplosionParticles={mockRenderParticles}
        planType="elite"
      />
    );

    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('/ month')).toBeInTheDocument();
  });

  it('applies correct CSS classes for animation states', () => {
    const { container } = render(
      <PricingCardPrice
        plan={mockPlan}
        animationState="exploding"
        isHovered={false}
        renderExplosionParticles={mockRenderParticles}
        planType="pro"
      />
    );

    const priceElement = container.querySelector('.price');
    expect(priceElement).toHaveClass('price-shake');
    expect(priceElement).toHaveClass('price-flash');
  });
}); 