import { render, screen } from '@testing-library/react';
import React from 'react';
import Card from '../Card';

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
            />
        );

        expect(screen.getByRole('heading')).toHaveTextContent('Test Content');
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByTestId('card')).toHaveAttribute('data-theme', 'gym');
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
            />
        );

        expect(screen.getByRole('heading')).toHaveTextContent('Test User');
        expect(screen.getByText('Test Bio')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', 'test-avatar.jpg');
        expect(screen.getByTestId('card')).toHaveAttribute('data-theme', 'sports');
    });

    test('WorkoutCard renders with all props', () => {
        const onBookmark = jest.fn();
        render(
            <Card
                variant="workout"
                workoutName="Test Workout"
                difficulty="Advanced"
                duration={45}
                isBookmarked={true}
                onBookmark={onBookmark}
                theme="wellness"
                size="sm"
            />
        );

        expect(screen.getByRole('heading')).toHaveTextContent('Test Workout');
        expect(screen.getByText('Advanced')).toBeInTheDocument();
        expect(screen.getByText('45 min')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Unbookmark');
        expect(screen.getByTestId('card')).toHaveAttribute('data-theme', 'wellness');
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
            />
        );

        expect(screen.getByRole('heading')).toHaveTextContent('Test Program');
        expect(screen.getByText('Intermediate')).toBeInTheDocument();
        expect(screen.getByText('Test Summary')).toBeInTheDocument();
        expect(screen.getByTestId('card')).toHaveAttribute('data-theme', 'default');
    });

    test('Card handles loading state', () => {
        render(
            <Card
                variant="content"
                title="Loading Content"
                isLoading={true}
            />
        );

        expect(screen.getByTestId('card')).toHaveAttribute('data-loading', 'true');
    });

    test('Card handles error state', () => {
        render(
            <Card
                variant="content"
                title="Error Content"
                error="Test Error"
            />
        );

        expect(screen.getByText('Test Error')).toBeInTheDocument();
    });

    test('Card applies custom className', () => {
        render(
            <Card
                variant="content"
                title="Custom Class"
                className="custom-class"
            />
        );

        expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });

    test('Card applies custom style', () => {
        const customStyle = { backgroundColor: 'red' };
        render(
            <Card
                variant="content"
                title="Custom Style"
                style={customStyle}
            />
        );

        expect(screen.getByTestId('card')).toHaveStyle(customStyle);
    });
}); 