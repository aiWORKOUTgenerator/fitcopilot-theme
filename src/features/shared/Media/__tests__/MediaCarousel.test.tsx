import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import MediaCarousel from '../MediaCarousel';
import { MediaCarouselProps } from '../types';

describe('MediaCarousel component', () => {
  const items = [
    { type: 'image' as const, src: 'img1.png', alt: 'Image 1' },
    { type: 'video' as const, src: 'video1.mp4', alt: 'Video 1' },
    { type: 'image' as const, src: 'img2.png', alt: 'Image 2' },
  ];

  // Helper function for setup to reduce boilerplate
  const setup = (props = {}) => {
    const defaultProps: MediaCarouselProps = {
      variant: 'carousel',
      items,
    };

    const mergedProps = { ...defaultProps, ...props };
    const user = userEvent.setup();
    return {
      user,
      ...render(<MediaCarousel {...mergedProps} />)
    };
  };

  it('renders with required props', () => {
    setup();

    // Verify the carousel structure
    const carouselContainer = screen.getByRole('region');
    expect(carouselContainer).toHaveClass('media-carousel');
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();
  });

  it('navigates to next item when next button is clicked', async () => {
    const { user } = setup();

    // Click next button
    await user.click(screen.getByLabelText('Next item'));

    // Should show video (videos don't have alt text in the DOM, so check for the element)
    const video = screen.getByRole('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', 'video1.mp4');
  });

  it('navigates to previous item when previous button is clicked', async () => {
    const { user } = setup({ initialIndex: 1 });

    // Start with video
    const initialVideo = screen.getByRole('video');
    expect(initialVideo).toBeInTheDocument();

    // Click previous button
    await user.click(screen.getByLabelText('Previous item'));

    // Should show the first image
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();
  });

  it('calls onItemChange when item changes', async () => {
    const onItemChange = jest.fn();
    const { user } = setup({ onItemChange });

    // Click next button
    await user.click(screen.getByLabelText('Next item'));

    // Should call onItemChange with index 1
    expect(onItemChange).toHaveBeenCalledWith(1);
  });

  it('respects initialIndex prop', () => {
    setup({ initialIndex: 1 });

    // Should start with video (index 1)
    const video = screen.getByRole('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', 'video1.mp4');
  });

  it('loops through items when reaching the end', async () => {
    const { user } = setup();

    // Navigate to the last item
    await user.click(screen.getByLabelText('Next item'));
    await user.click(screen.getByLabelText('Next item'));

    // Verify we're on the last image
    expect(screen.getByAltText('Image 2')).toBeInTheDocument();

    // Click next again, should loop to first image
    await user.click(screen.getByLabelText('Next item'));

    // Should show first image
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();
  });

  it('loops backward when at the beginning', async () => {
    const { user } = setup();

    // Verify we're at the first image
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();

    // Click previous, should loop to the last image
    await user.click(screen.getByLabelText('Previous item'));

    // Should show the last image
    expect(screen.getByAltText('Image 2')).toBeInTheDocument();
  });

  it('shows the correct indicator', () => {
    setup();

    const indicator = screen.getByText('1 / 3');
    expect(indicator).toBeInTheDocument();
  });

  it('updates the indicator when navigating', async () => {
    const { user } = setup();

    // Initially shows 1 / 3
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    // Click next
    await user.click(screen.getByLabelText('Next item'));

    // Should show 2 / 3
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const { user } = setup();

    // Focus the carousel
    const carousel = screen.getByRole('region');
    carousel.focus();

    // Press right arrow to navigate to next item
    await user.keyboard('{ArrowRight}');
    await waitFor(() => {
      const video = screen.getByRole('video');
      expect(video).toBeInTheDocument();
    });

    // Press right arrow again to go to third item
    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(screen.getByAltText('Image 2')).toBeInTheDocument());

    // Press left arrow to go back to second item
    await user.keyboard('{ArrowLeft}');
    await waitFor(() => {
      const video = screen.getByRole('video');
      expect(video).toBeInTheDocument();
    });
  });

  it('renders different media types correctly', async () => {
    const { user } = setup();

    // First item is an image
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();

    // Navigate to video and verify rendering
    const nextButton = screen.getByLabelText('Next item');
    await user.click(nextButton);

    const video = screen.getByRole('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('controls');
  });
}); 