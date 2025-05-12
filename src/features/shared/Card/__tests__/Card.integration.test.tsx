import { render, screen } from '@testing-library/react';
import React from 'react';
import Media from '../../Media/Media';
import Card from '../Card';

describe('Card Media Integration', () => {
    test('ContentCard renders with video media', () => {
        const videoProps = {
            variant: 'video' as const,
            src: 'test-video.mp4',
            poster: 'test-poster.jpg',
            controls: true
        };

        render(
            <Card
                variant="content"
                title="Test Content"
                description="Test Description"
                media={<Media {...videoProps} />}
            />
        );

        expect(screen.getByRole('heading')).toHaveTextContent('Test Content');
        expect(screen.getByRole('video')).toBeInTheDocument();
    });

    test('ProfileCard renders with image media', () => {
        const imageProps = {
            variant: 'image' as const,
            src: 'test-image.jpg',
            alt: 'Test Image'
        };

        render(
            <Card
                variant="profile"
                name="Test User"
                bio="Test Bio"
                media={<Media {...imageProps} />}
            />
        );

        expect(screen.getByRole('heading')).toHaveTextContent('Test User');
        expect(screen.getByRole('img')).toHaveAttribute('src', 'test-image.jpg');
    });

    test('WorkoutCard renders with image gallery', () => {
        const galleryProps = {
            variant: 'imageGallery' as const,
            images: [
                { src: 'workout1.jpg', alt: 'Workout 1' },
                { src: 'workout2.jpg', alt: 'Workout 2' }
            ]
        };

        render(
            <Card
                variant="workout"
                workoutName="Test Workout"
                difficulty="Intermediate"
                duration={30}
                media={<Media {...galleryProps} />}
            />
        );

        expect(screen.getByRole('heading')).toHaveTextContent('Test Workout');
        expect(screen.getByText('Intermediate')).toBeInTheDocument();
        expect(screen.getByText('30 min')).toBeInTheDocument();
    });

    test('ProgramCard renders with carousel media', () => {
        const carouselProps = {
            variant: 'carousel' as const,
            items: [
                { type: 'image', src: 'program1.jpg', alt: 'Program 1' },
                { type: 'video', src: 'program2.mp4', alt: 'Program 2' }
            ]
        };

        render(
            <Card
                variant="program"
                programName="Test Program"
                level="Advanced"
                summary="Test Summary"
                media={<Media {...carouselProps} />}
            />
        );

        expect(screen.getByRole('heading')).toHaveTextContent('Test Program');
        expect(screen.getByText('Advanced')).toBeInTheDocument();
        expect(screen.getByText('Test Summary')).toBeInTheDocument();
    });

    test('Card handles loading state with media', () => {
        const imageProps = {
            variant: 'image' as const,
            src: 'test-image.jpg',
            alt: 'Test Image'
        };

        render(
            <Card
                variant="content"
                title="Loading Content"
                isLoading={true}
                media={<Media {...imageProps} />}
            />
        );

        expect(screen.getByTestId('card')).toHaveAttribute('data-loading', 'true');
    });

    test('Card applies theme variants with media', () => {
        const imageProps = {
            variant: 'image' as const,
            src: 'test-image.jpg',
            alt: 'Test Image'
        };

        render(
            <Card
                variant="content"
                title="Themed Content"
                theme="gym"
                media={<Media {...imageProps} />}
            />
        );

        expect(screen.getByTestId('card')).toHaveAttribute('data-theme', 'gym');
    });
}); 