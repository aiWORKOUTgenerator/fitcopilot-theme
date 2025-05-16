import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../../test/test-utils';
import Card from '../Card';

// Test utility for verifying BEM class names
const assertCardClasses = (element: HTMLElement, variant: string, expectedClasses: string[] = []) => {
  expect(element).toHaveClass(`card`);
  expect(element).toHaveClass(`card--${variant}`);

  // Check for additional classes
  expectedClasses.forEach(className => {
    expect(element).toHaveClass(className);
  });
};

describe('Card Variants', () => {
  test('ContentCard renders with all props', () => {
    renderWithProviders(
      <Card
        variant="content"
        title="Test Content"
        description="Test Description"
        theme="gym"
        size="lg"
        layout="vertical"
      />
    );

    // Using role-based and text-based selectors instead of data-testid
    const heading = screen.getByRole('heading', { name: /test content/i });
    const description = screen.getByText(/test description/i);
    const card = heading.closest('.card');

    expect(heading).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(card).toHaveAttribute('data-theme', 'gym');

    // Check proper BEM class usage
    assertCardClasses(card as HTMLElement, 'content', ['theme-gym', 'card--size-lg', 'card--layout-vertical']);
  });

  test('ProfileCard renders with all props', () => {
    renderWithProviders(
      <Card
        variant="profile"
        name="Test User"
        bio="Test Bio"
        avatarUrl="test-avatar.jpg"
        theme="sports"
        size="md"
      />
    );

    // Using role-based and text-based selectors
    const heading = screen.getByRole('heading', { name: /test user/i });
    const bio = screen.getByText(/test bio/i);
    const avatar = screen.getByRole('img', { name: /test user/i });
    const card = heading.closest('.card');

    expect(heading).toBeInTheDocument();
    expect(bio).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'test-avatar.jpg');
    expect(avatar).toHaveAttribute('alt', 'Test User');
    expect(card).toHaveAttribute('data-theme', 'sports');

    // Check proper BEM class usage
    assertCardClasses(card as HTMLElement, 'profile', ['theme-sports', 'card--size-md']);
  });

  test('WorkoutCard renders with all props', async () => {
    const onBookmark = jest.fn();
    const { user } = renderWithProviders(
      <Card
        variant="workout"
        workoutName="Test Workout"
        difficulty="advanced"
        duration={45}
        isBookmarked={true}
        onBookmark={onBookmark}
        theme="wellness"
        size="sm"
      />
    );

    // Using role-based and text-based selectors
    const heading = screen.getByRole('heading', { name: /test workout/i });
    const difficulty = screen.getByText(/advanced/i);
    const duration = screen.getByText(/45 min/i);
    const bookmarkButton = screen.getByRole('button', { name: /unbookmark/i });
    const card = heading.closest('.card');

    expect(heading).toBeInTheDocument();
    expect(difficulty).toBeInTheDocument();
    expect(duration).toBeInTheDocument();
    expect(bookmarkButton).toBeInTheDocument();
    expect(card).toHaveAttribute('data-theme', 'wellness');

    // Using userEvent instead of fireEvent
    await user.click(bookmarkButton);
    expect(onBookmark).toHaveBeenCalledWith(expect.any(String), false);

    // Check proper BEM class usage
    assertCardClasses(card as HTMLElement, 'workout', ['theme-wellness', 'card--size-sm']);
  });

  test('ProgramCard renders with all props', () => {
    renderWithProviders(
      <Card
        variant="program"
        programName="Test Program"
        level="Intermediate"
        summary="Test Summary"
        theme="default"
        layout="horizontal"
      />
    );

    // Using role-based and text-based selectors
    const heading = screen.getByRole('heading', { name: /test program/i });
    const level = screen.getByText(/intermediate/i);
    const summary = screen.getByText(/test summary/i);
    const card = heading.closest('.card');

    expect(heading).toBeInTheDocument();
    expect(level).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
    expect(card).toHaveAttribute('data-theme', 'default');

    // Check proper BEM class usage
    assertCardClasses(card as HTMLElement, 'program', ['theme-default', 'card--layout-horizontal']);
  });

  test('PricingCard renders with all props', async () => {
    const handleCtaClick = jest.fn();
    const { user } = renderWithProviders(
      <Card
        variant="pricing"
        planName="Premium Plan"
        price="$19.99"
        period="month"
        features={['Feature 1', 'Feature 2', 'Feature 3']}
        ctaText="Subscribe Now"
        popular={true}
        onCtaClick={handleCtaClick}
      />
    );

    // Using role-based and text-based selectors
    const heading = screen.getByRole('heading', { name: /premium plan/i });
    const price = screen.getByText('$19.99');
    const period = screen.getByText(/month/);
    const popular = screen.getByText(/most popular/i);
    const features = screen.getAllByRole('listitem');
    const ctaButton = screen.getByRole('button', { name: /subscribe now/i });
    const card = heading.closest('.card');

    expect(heading).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(period).toBeInTheDocument();
    expect(popular).toBeInTheDocument();
    expect(features).toHaveLength(3);
    expect(ctaButton).toBeInTheDocument();

    // Using userEvent instead of fireEvent
    await user.click(ctaButton);
    expect(handleCtaClick).toHaveBeenCalledTimes(1);

    // Check proper BEM class usage
    assertCardClasses(card as HTMLElement, 'pricing');
  });

  test('Card handles loading state', () => {
    renderWithProviders(
      <Card
        variant="content"
        title="Loading Content"
        isLoading={true}
      />
    );

    // Using role-based selector
    const heading = screen.getByRole('heading', { name: /loading content/i });
    const card = heading.closest('.card');

    expect(card).toHaveAttribute('data-loading', 'true');
    expect(card).toHaveClass('is-loading');
  });

  test('Card applies custom className and style', () => {
    const customStyle = { backgroundColor: 'red' };
    renderWithProviders(
      <Card
        variant="content"
        title="Custom Styling"
        className="custom-class"
        style={customStyle}
      />
    );

    // Using role-based selector
    const heading = screen.getByRole('heading', { name: /custom styling/i });
    const card = heading.closest('.card');

    expect(card).toHaveClass('custom-class');
    expect(card).toHaveStyle('background-color: red');
  });

  test('Card with onClick becomes interactive', async () => {
    const handleClick = jest.fn();
    const { user } = renderWithProviders(
      <Card
        variant="content"
        title="Interactive Card"
        onClick={handleClick}
      />
    );

    // Using role-based selector
    const card = screen.getByRole('button', { name: /interactive card/i });

    // Using userEvent instead of fireEvent
    await user.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test for keyboard accessibility
  test('Card handles keyboard interaction', async () => {
    const handleClick = jest.fn();
    const { user } = renderWithProviders(
      <Card
        variant="content"
        title="Keyboard Card"
        onClick={handleClick}
      />
    );

    // Tab to focus the interactive element
    await user.tab();

    // Verify the card is focused
    const card = screen.getByRole('button', { name: /keyboard card/i });
    expect(card).toHaveFocus();

    // Press Enter key
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 