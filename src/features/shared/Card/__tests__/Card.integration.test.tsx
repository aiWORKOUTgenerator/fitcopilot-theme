import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MediaProps } from '../../Media/types';
import Card from '../Card';

// Mock the Media component
jest.mock('../../Media/Media', () => ({
    __esModule: true,
    default: jest.fn((props) => {
        // Return appropriate mock DOM based on variant
        if (props.variant === 'video') {
            return (
                <div data-testid="mock-media-video" className="media media--video">
                    <video
                        src={props.src}
                        poster={props.poster}
                        controls={props.controls}
                        data-media-type="video"
                        data-testid="video-element"
                    />
                    {props.caption && <figcaption>{props.caption}</figcaption>}
                </div>
            );
        }

        if (props.variant === 'image') {
            return (
                <div data-testid="mock-media-image" className="media media--image">
                    <img
                        src={props.src}
                        alt={props.alt}
                        data-media-type="image"
                    />
                    {props.caption && <figcaption>{props.caption}</figcaption>}
                </div>
            );
        }

        if (props.variant === 'imageGallery') {
            return (
                <div data-testid="mock-media-gallery" className="media media--gallery">
                    <div className="gallery-container">
                        {props.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.src}
                                alt={image.alt}
                                className={index === 0 ? 'active' : ''}
                            />
                        ))}
                    </div>
                    <div className="gallery-controls">
                        <button className="gallery-prev">Previous</button>
                        <button className="gallery-next">Next</button>
                    </div>
                </div>
            );
        }

        if (props.variant === 'carousel') {
            return (
                <div data-testid="mock-media-carousel" className="media media--carousel">
                    <div className="carousel-container">
                        {props.items.map((item, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                {item.type === 'image' && <img src={item.src} alt={item.alt} />}
                                {item.type === 'video' && <video src={item.src} />}
                            </div>
                        ))}
                    </div>
                    <div className="carousel-controls">
                        <button className="carousel-prev">Previous</button>
                        <button className="carousel-next">Next</button>
                    </div>
                </div>
            );
        }

        return <div data-testid="mock-media-unknown">Unsupported media type</div>;
    })
}));

// Import the real Media component for type checking only
import Media from '../../Media/Media';

describe('Card Media Integration', () => {
    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    test('ContentCard renders with video media', () => {
        const videoProps: MediaProps = {
            variant: 'video',
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
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        const heading = screen.getByRole('heading', { name: 'Test Content' });
        const description = screen.getByText('Test Description');
        const mediaContainer = screen.getByTestId('mock-media-video');
        const video = screen.getByTestId('video-element');

        expect(heading).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(mediaContainer).toBeInTheDocument();
        expect(video).toHaveAttribute('src', 'test-video.mp4');
        expect(video).toHaveAttribute('poster', 'test-poster.jpg');
        expect(card).toHaveClass('card');
        expect(card).toHaveClass('card--content');
    });

    test('ProfileCard renders with image media', () => {
        const imageProps: MediaProps = {
            variant: 'image',
            src: 'test-image.jpg',
            alt: 'Test Image'
        };

        render(
            <Card
                variant="profile"
                name="Test User"
                bio="Test Bio"
                media={<Media {...imageProps} />}
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        const heading = screen.getByRole('heading', { name: 'Test User' });
        const bio = screen.getByText('Test Bio');
        const mediaContainer = screen.getByTestId('mock-media-image');
        const image = screen.getByRole('img');

        expect(heading).toBeInTheDocument();
        expect(bio).toBeInTheDocument();
        expect(mediaContainer).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'test-image.jpg');
        expect(image).toHaveAttribute('alt', 'Test Image');
        expect(card).toHaveClass('card');
        expect(card).toHaveClass('card--profile');
    });

    test('WorkoutCard renders with image gallery', () => {
        const galleryProps: MediaProps = {
            variant: 'imageGallery',
            images: [
                { src: 'workout1.jpg', alt: 'Workout 1' },
                { src: 'workout2.jpg', alt: 'Workout 2' }
            ]
        };

        render(
            <Card
                variant="workout"
                workoutName="Test Workout"
                difficulty="intermediate"
                duration={30}
                media={<Media {...galleryProps} />}
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        const heading = screen.getByRole('heading', { name: 'Test Workout' });
        const difficulty = screen.getByText('intermediate');
        const duration = screen.getByText('30 min');
        const mediaContainer = screen.getByTestId('mock-media-gallery');
        const galleryImages = screen.getAllByRole('img');

        expect(heading).toBeInTheDocument();
        expect(difficulty).toBeInTheDocument();
        expect(duration).toBeInTheDocument();
        expect(mediaContainer).toBeInTheDocument();
        expect(galleryImages).toHaveLength(2);
        expect(galleryImages[0]).toHaveAttribute('src', 'workout1.jpg');
        expect(galleryImages[1]).toHaveAttribute('src', 'workout2.jpg');
        expect(card).toHaveClass('card');
        expect(card).toHaveClass('card--workout');
    });

    test('ProgramCard renders with carousel media', () => {
        const carouselProps: MediaProps = {
            variant: 'carousel',
            items: [
                { type: 'image', src: 'program1.jpg', alt: 'Program 1' },
                { type: 'video', src: 'program2.mp4', alt: 'Program 2' }
            ]
        };

        render(
            <Card
                variant="program"
                programName="Test Program"
                level="advanced"
                summary="Test Summary"
                media={<Media {...carouselProps} />}
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        const heading = screen.getByRole('heading', { name: 'Test Program' });
        const level = screen.getByText('advanced');
        const summary = screen.getByText('Test Summary');
        const mediaContainer = screen.getByTestId('mock-media-carousel');
        const carouselItems = screen.getAllByRole('img');

        expect(heading).toBeInTheDocument();
        expect(level).toBeInTheDocument();
        expect(summary).toBeInTheDocument();
        expect(mediaContainer).toBeInTheDocument();
        expect(carouselItems).toHaveLength(1); // Only the image item is found by role='img'
        expect(carouselItems[0]).toHaveAttribute('src', 'program1.jpg');
        expect(card).toHaveClass('card');
        expect(card).toHaveClass('card--program');
    });

    test('Card handles loading state with media', () => {
        const imageProps: MediaProps = {
            variant: 'image',
            src: 'test-image.jpg',
            alt: 'Test Image'
        };

        render(
            <Card
                variant="content"
                title="Loading Content"
                isLoading={true}
                media={<Media {...imageProps} />}
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        expect(card).toHaveAttribute('data-loading', 'true');
        expect(card).toHaveClass('is-loading');
    });

    test('Card with media handles click events properly', () => {
        const handleClick = jest.fn();
        const imageProps: MediaProps = {
            variant: 'image',
            src: 'test-image.jpg',
            alt: 'Test Image'
        };

        render(
            <Card
                variant="content"
                title="Interactive Card"
                onClick={handleClick}
                media={<Media {...imageProps} />}
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('Card applies theme variants with media', () => {
        const imageProps: MediaProps = {
            variant: 'image',
            src: 'test-image.jpg',
            alt: 'Test Image'
        };

        render(
            <Card
                variant="content"
                title="Themed Content"
                theme="gym"
                media={<Media {...imageProps} />}
                data-testid="card"
            />
        );

        const card = screen.getByTestId('card');
        expect(card).toHaveAttribute('data-theme', 'gym');
        expect(card).toHaveClass('theme-gym');
    });
}); 