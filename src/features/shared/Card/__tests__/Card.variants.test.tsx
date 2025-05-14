import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
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
        render(
            <Card
                variant="content"
                title="Test Content"
                description="Test Description"
                theme="gym"
                size="lg"
                layout="vertical"
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        const heading = screen.getByRole('heading', { name: 'Test Content' });
        const description = screen.getByText('Test Description');

        expect(heading).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(card).toHaveAttribute('data-theme', 'gym');

        // Check proper BEM class usage
        assertCardClasses(card, 'content', ['theme-gym', 'card--size-lg', 'card--layout-vertical']);
    });

    test('ProfileCard renders with all props', () => {
        render(
            <Card
                variant="profile"
                name="Test User"
                bio="Test Bio"
                avatarUrl="test-avatar.jpg"
                theme="sports"
                size="md"
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        const heading = screen.getByRole('heading', { name: 'Test User' });
        const bio = screen.getByText('Test Bio');
        const avatar = screen.getByRole('img');

        expect(heading).toBeInTheDocument();
        expect(bio).toBeInTheDocument();
        expect(avatar).toHaveAttribute('src', 'test-avatar.jpg');
        expect(avatar).toHaveAttribute('alt', 'Test User');
        expect(card).toHaveAttribute('data-theme', 'sports');

        // Check proper BEM class usage
        assertCardClasses(card, 'profile', ['theme-sports', 'card--size-md']);
    });

    test('WorkoutCard renders with all props', () => {
        const onBookmark = jest.fn();
        render(
            <Card
                variant="workout"
                workoutName="Test Workout"
                difficulty="advanced"
                duration={45}
                isBookmarked={true}
                onBookmark={onBookmark}
                theme="wellness"
                size="sm"
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        const heading = screen.getByRole('heading', { name: 'Test Workout' });
        const difficulty = screen.getByText('advanced');
        const duration = screen.getByText('45 min');
        const bookmarkButton = screen.getByRole('button', { name: /unbookmark/i });

        expect(heading).toBeInTheDocument();
        expect(difficulty).toBeInTheDocument();
        expect(duration).toBeInTheDocument();
        expect(bookmarkButton).toBeInTheDocument();
        expect(card).toHaveAttribute('data-theme', 'wellness');

        // Test interaction using fireEvent instead of userEvent for more direct firing
        fireEvent.click(bookmarkButton);
        expect(onBookmark).toHaveBeenCalledWith(expect.any(String), false);

        // Check proper BEM class usage
        assertCardClasses(card, 'workout', ['theme-wellness', 'card--size-sm']);
    });

    test('ProgramCard renders with all props', () => {
        render(
            <Card
                variant="program"
                programName="Test Program"
                level="Intermediate"
                summary="Test Summary"
                theme="default"
                layout="horizontal"
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        const heading = screen.getByRole('heading', { name: 'Test Program' });
        const level = screen.getByText('Intermediate');
        const summary = screen.getByText('Test Summary');

        expect(heading).toBeInTheDocument();
        expect(level).toBeInTheDocument();
        expect(summary).toBeInTheDocument();
        expect(card).toHaveAttribute('data-theme', 'default');

        // Check proper BEM class usage
        assertCardClasses(card, 'program', ['theme-default', 'card--layout-horizontal']);
    });

    test('PricingCard renders with all props', () => {
        const handleCtaClick = jest.fn();
        render(
            <Card
                variant="pricing"
                planName="Premium Plan"
                price="$19.99"
                period="month"
                features={['Feature 1', 'Feature 2', 'Feature 3']}
                ctaText="Subscribe Now"
                popular={true}
                onCtaClick={handleCtaClick}
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        const heading = screen.getByRole('heading', { name: 'Premium Plan' });
        const price = screen.getByText('$19.99');
        const period = screen.getByText(/month/);
        const popular = screen.getByText(/most popular/i);
        const features = screen.getAllByRole('listitem');
        const ctaButton = screen.getByRole('button', { name: 'Subscribe Now' });

        expect(heading).toBeInTheDocument();
        expect(price).toBeInTheDocument();
        expect(period).toBeInTheDocument();
        expect(popular).toBeInTheDocument();
        expect(features).toHaveLength(3);
        expect(ctaButton).toBeInTheDocument();

        // Test interaction using fireEvent instead of userEvent
        fireEvent.click(ctaButton);
        expect(handleCtaClick).toHaveBeenCalledTimes(1);

        // Check proper BEM class usage
        assertCardClasses(card, 'pricing');
    });

    test('Card handles loading state', () => {
        render(
            <Card
                variant="content"
                title="Loading Content"
                isLoading={true}
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        expect(card).toHaveAttribute('data-loading', 'true');
        expect(card).toHaveClass('is-loading');
    });

    test('Card applies custom className and style', () => {
        const customStyle = { backgroundColor: 'red' };
        render(
            <Card
                variant="content"
                title="Custom Styling"
                className="custom-class"
                style={customStyle}
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        expect(card).toHaveClass('custom-class');
        expect(card).toHaveStyle('background-color: red');
    });

    test('Card with onClick becomes interactive', () => {
        const handleClick = jest.fn();
        render(
            <Card
                variant="content"
                title="Interactive Card"
                onClick={handleClick}
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');

        // Use fireEvent instead of userEvent for more direct event firing
        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
}); 