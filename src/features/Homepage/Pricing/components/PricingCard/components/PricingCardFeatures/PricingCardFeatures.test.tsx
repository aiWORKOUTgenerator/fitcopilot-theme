/**
 * PricingCardFeatures Component Tests
 * 
 * Tests to verify the extracted PricingCardFeatures component
 * renders identically to the original implementation including
 * feature expansion, tooltips, and fade-in animations.
 * 
 * @phase Phase 3 - Features Component Testing
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { PlanFeature } from '../../types';
import { PricingCardFeatures } from './PricingCardFeatures';

// Mock features data for testing
const mockFeatures: PlanFeature[] = [
  { text: 'AI-generated workouts', isHighlighted: true },
  { text: 'Enhanced Fitness Profile' },
  { text: 'Multiple Output Formats' },
  { text: 'Email support' },
  { text: '5 saved workout plans/mo' },
  { text: 'Advanced workout tracking', isHighlighted: true },
  { text: 'Full equipment customization' },
  { text: 'Progress analytics dashboard' },
  { text: 'Unlimited saved workout plans' },
  { text: 'Direct feedback to development team', tooltip: 'Help shape the future of AI Workout Generator' }
];

const mockCallback = jest.fn();

describe('PricingCardFeatures Component', () => {
  beforeEach(() => {
    mockCallback.mockClear();
  });

  it('renders features list correctly when collapsed', () => {
    render(
      <PricingCardFeatures
        features={mockFeatures}
        planName="Pro"
        expanded={false}
        onToggleExpand={mockCallback}
        variant="default"
      />
    );

    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('AI-generated workouts')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Fitness Profile')).toBeInTheDocument();
    expect(screen.getByText('Multiple Output Formats')).toBeInTheDocument();
    expect(screen.getByText('Email support')).toBeInTheDocument();
    expect(screen.getByText('5 saved workout plans/mo')).toBeInTheDocument();
    
    // Should show remaining features count
    expect(screen.getByText('+ 5 more features')).toBeInTheDocument();
    
    // Should not show features beyond the first 5
    expect(screen.queryByText('Advanced workout tracking')).not.toBeInTheDocument();
  });

  it('renders all features when expanded', () => {
    render(
      <PricingCardFeatures
        features={mockFeatures}
        planName="Pro"
        expanded={true}
        onToggleExpand={mockCallback}
        variant="default"
      />
    );

    // Should show all features
    expect(screen.getByText('AI-generated workouts')).toBeInTheDocument();
    expect(screen.getByText('Advanced workout tracking')).toBeInTheDocument();
    expect(screen.getByText('Full equipment customization')).toBeInTheDocument();
    expect(screen.getByText('Progress analytics dashboard')).toBeInTheDocument();
    expect(screen.getByText('Unlimited saved workout plans')).toBeInTheDocument();
    expect(screen.getByText('Direct feedback to development team')).toBeInTheDocument();
    
    // Should not show remaining features count
    expect(screen.queryByText('+ 5 more features')).not.toBeInTheDocument();
  });

  it('calls onToggleExpand when expand button is clicked', () => {
    render(
      <PricingCardFeatures
        features={mockFeatures}
        planName="Pro"
        expanded={false}
        onToggleExpand={mockCallback}
        variant="default"
      />
    );

    const expandButton = screen.getByRole('button', { name: 'Show all features' });
    fireEvent.click(expandButton);
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('shows correct button icon and aria-label based on expansion state', () => {
    const { rerender } = render(
      <PricingCardFeatures
        features={mockFeatures}
        planName="Pro"
        expanded={false}
        onToggleExpand={mockCallback}
        variant="default"
      />
    );

    // When collapsed, should show "Show all features"
    expect(screen.getByRole('button', { name: 'Show all features' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');

    // When expanded, should show "Show fewer features"
    rerender(
      <PricingCardFeatures
        features={mockFeatures}
        planName="Pro"
        expanded={true}
        onToggleExpand={mockCallback}
        variant="default"
      />
    );

    expect(screen.getByRole('button', { name: 'Show fewer features' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies correct styling for highlighted features', () => {
    const { container } = render(
      <PricingCardFeatures
        features={mockFeatures}
        planName="Pro"
        expanded={false}
        onToggleExpand={mockCallback}
        variant="default"
      />
    );

    const featureTexts = container.querySelectorAll('.feature-text');
    
    // First feature is highlighted
    expect(featureTexts[0]).toHaveClass('text-white', 'font-medium', 'highlighted');
    
    // Second feature is not highlighted (but still white text now)
    expect(featureTexts[1]).toHaveClass('text-white');
    expect(featureTexts[1]).not.toHaveClass('highlighted');
  });

  it('renders feature tooltips correctly', () => {
    render(
      <PricingCardFeatures
        features={mockFeatures}
        planName="Pro"
        expanded={true}
        onToggleExpand={mockCallback}
        variant="default"
      />
    );

    // Find the feature with a tooltip
    const featureWithTooltip = screen.getByText('Direct feedback to development team');
    expect(featureWithTooltip).toBeInTheDocument();
    
    // The tooltip should be present but initially invisible
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass('opacity-0', 'invisible');
    expect(tooltip).toHaveTextContent('Help shape the future of AI Workout Generator');
  });

  it('applies fade-in animation class to features beyond index 5', () => {
    const { container } = render(
      <PricingCardFeatures
        features={mockFeatures}
        planName="Pro"
        expanded={true}
        onToggleExpand={mockCallback}
        variant="default"
      />
    );

    const featureItems = container.querySelectorAll('li');
    
    // Features 0-4 should not have animate-fade-in class
    expect(featureItems[0]).not.toHaveClass('animate-fade-in');
    expect(featureItems[4]).not.toHaveClass('animate-fade-in');
    
    // Features 5+ should have animate-fade-in class
    expect(featureItems[5]).toHaveClass('animate-fade-in');
    expect(featureItems[6]).toHaveClass('animate-fade-in');
  });

  it('handles plans with 5 or fewer features correctly', () => {
    const shortFeatureList = mockFeatures.slice(0, 3);
    
    render(
      <PricingCardFeatures
        features={shortFeatureList}
        planName="Basic"
        expanded={false}
        onToggleExpand={mockCallback}
        variant="default"
      />
    );

    // Should not show remaining features count
    expect(screen.queryByText(/more features/)).not.toBeInTheDocument();
    
    // Should show all 3 features
    expect(screen.getByText('AI-generated workouts')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Fitness Profile')).toBeInTheDocument();
    expect(screen.getByText('Multiple Output Formats')).toBeInTheDocument();
  });
}); 