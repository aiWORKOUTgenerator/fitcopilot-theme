import { cleanup, screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../../test/test-utils';
import { MediaProps } from '../../Media/types';
import Card from '../Card';

// Mock the Media component
jest.mock('../../Media/Media', () => ({
  __esModule: true,
  default: jest.fn((props) => {
    // Helper function to stop propagation for all button clicks
    const stopPropagation = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    // Return appropriate mock DOM based on variant
    if (props.variant === 'video') {
      return (
        <div data-testid="mock-media-video" className="media media--video" aria-label="Video content" onClick={stopPropagation}>
          <video
            src={props.src}
            poster={props.poster}
            controls={props.controls}
            data-media-type="video"
            aria-label={props.alt || 'Video'}
          />
          {props.caption && <figcaption>{props.caption}</figcaption>}
        </div>
      );
    }

    if (props.variant === 'image') {
      return (
        <div data-testid="mock-media-image" className="media media--image" onClick={stopPropagation}>
          <img
            src={props.src}
            alt={props.alt || 'Image'}
            data-media-type="image"
          />
          {props.caption && <figcaption>{props.caption}</figcaption>}
        </div>
      );
    }

    if (props.variant === 'imageGallery') {
      return (
        <div data-testid="mock-media-gallery" className="media media--gallery" aria-label="Image gallery" onClick={stopPropagation}>
          <div className="gallery-container">
            {props.images.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt || `Gallery image ${index + 1}`}
                className={index === 0 ? 'active' : ''}
              />
            ))}
          </div>
          <div className="gallery-controls">
            <button
              aria-label="Previous image"
              onClick={stopPropagation}
            >
              Previous
            </button>
            <button
              aria-label="Next image"
              onClick={stopPropagation}
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    if (props.variant === 'carousel') {
      return (
        <div data-testid="mock-media-carousel" className="media media--carousel" aria-label="Media carousel" onClick={stopPropagation}>
          <div className="carousel-container">
            {props.items.map((item, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                {item.type === 'image' && <img src={item.src} alt={item.alt || `Carousel item ${index + 1}`} />}
                {item.type === 'video' && <video src={item.src} aria-label={item.alt || `Video ${index + 1}`} />}
              </div>
            ))}
          </div>
          <div className="gallery-controls">
            <button
              aria-label="Previous item"
              onClick={stopPropagation}
            >
              Previous
            </button>
            <button
              aria-label="Next item"
              onClick={stopPropagation}
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    return <div data-testid="mock-media-unknown" aria-label="Unsupported media type" onClick={stopPropagation}>Unsupported media type</div>;
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
      controls: true,
      alt: 'Test video'
    };

    renderWithProviders(
      <Card
        variant="content"
        title="Test Content"
        description="Test Description"
        media={<Media {...videoProps} />}
      />
    );

    // Using role-based and text-based selectors
    const heading = screen.getByRole('heading', { name: /test content/i });
    const description = screen.getByText(/test description/i);
    const card = heading.closest('.card');
    const mediaContainer = screen.getByLabelText(/video content/i);

    expect(heading).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(mediaContainer).toBeInTheDocument();
    expect(card).toHaveClass('card');
    expect(card).toHaveClass('card--content');
  });

  test('ProfileCard renders with image media', () => {
    const imageProps: MediaProps = {
      variant: 'image',
      src: 'test-image.jpg',
      alt: 'Test Image'
    };

    renderWithProviders(
      <Card
        variant="profile"
        name="Test User"
        bio="Test Bio"
        media={<Media {...imageProps} />}
      />
    );

    // Using role-based and text-based selectors
    const heading = screen.getByRole('heading', { name: /test user/i });
    const bio = screen.getByText(/test bio/i);
    const card = heading.closest('.card');
    const image = screen.getByAltText(/test image/i);

    expect(heading).toBeInTheDocument();
    expect(bio).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
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

    renderWithProviders(
      <Card
        variant="workout"
        workoutName="Test Workout"
        difficulty="intermediate"
        duration={30}
        media={<Media {...galleryProps} />}
      />
    );

    // Using role-based and text-based selectors
    const heading = screen.getByRole('heading', { name: /test workout/i });
    const difficulty = screen.getByText(/intermediate/i);
    const duration = screen.getByText(/30 min/i);
    const card = heading.closest('.card');
    const gallery = screen.getByLabelText(/image gallery/i);
    const galleryImages = screen.getAllByRole('img');
    const navigationButtons = screen.getAllByRole('button', { name: /(previous|next) image/i });

    expect(heading).toBeInTheDocument();
    expect(difficulty).toBeInTheDocument();
    expect(duration).toBeInTheDocument();
    expect(gallery).toBeInTheDocument();
    expect(galleryImages).toHaveLength(2);
    expect(galleryImages[0]).toHaveAttribute('src', 'workout1.jpg');
    expect(galleryImages[1]).toHaveAttribute('src', 'workout2.jpg');
    expect(navigationButtons).toHaveLength(2);
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

    renderWithProviders(
      <Card
        variant="program"
        programName="Test Program"
        level="advanced"
        summary="Test Summary"
        media={<Media {...carouselProps} />}
      />
    );

    // Using role-based and text-based selectors
    const heading = screen.getByRole('heading', { name: /test program/i });
    const level = screen.getByText(/advanced/i);
    const summary = screen.getByText(/test summary/i);
    const card = heading.closest('.card');
    const carousel = screen.getByLabelText(/media carousel/i);
    const navigationButtons = screen.getAllByRole('button', { name: /(previous|next) item/i });

    expect(heading).toBeInTheDocument();
    expect(level).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
    expect(carousel).toBeInTheDocument();
    expect(navigationButtons).toHaveLength(2);
    expect(card).toHaveClass('card');
    expect(card).toHaveClass('card--program');
  });

  test('Card handles loading state with media', () => {
    const imageProps: MediaProps = {
      variant: 'image',
      src: 'test-image.jpg',
      alt: 'Test Image'
    };

    renderWithProviders(
      <Card
        variant="content"
        title="Loading Content"
        isLoading={true}
        media={<Media {...imageProps} />}
      />
    );

    // Using role-based selector
    const heading = screen.getByRole('heading', { name: /loading content/i });
    const card = heading.closest('.card');

    expect(card).toHaveAttribute('data-loading', 'true');
    expect(card).toHaveClass('is-loading');
  });

  test('Card with media handles onClick', async () => {
    const handleClick = jest.fn();
    const imageProps: MediaProps = {
      variant: 'image',
      src: 'test-image.jpg',
      alt: 'Test Image'
    };

    const { user } = renderWithProviders(
      <Card
        variant="content"
        title="Interactive Card"
        onClick={handleClick}
        media={<Media {...imageProps} />}
      />
    );

    // Using role-based selector
    const heading = screen.getByRole('heading', { name: /interactive card/i });
    const card = heading.closest('.card');

    // Using userEvent instead of fireEvent
    await user.click(card as HTMLElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('Media component interaction stops event propagation', async () => {
    const cardClick = jest.fn();
    const galleryProps: MediaProps = {
      variant: 'imageGallery',
      images: [
        { src: 'gallery1.jpg', alt: 'Gallery 1' },
        { src: 'gallery2.jpg', alt: 'Gallery 2' }
      ]
    };

    const { user } = renderWithProviders(
      <Card
        variant="content"
        title="Card with Gallery"
        onClick={cardClick}
        media={<Media {...galleryProps} />}
      />
    );

    // Using role-based selectors
    const nextButton = screen.getByRole('button', { name: /next image/i });

    // Click the next button
    await user.click(nextButton);

    // Card click should not be triggered because the event should be stopped
    expect(cardClick).not.toHaveBeenCalled();
  });
}); 