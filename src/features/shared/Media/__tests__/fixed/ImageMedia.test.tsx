import { render } from '@testing-library/react';
import React from 'react';
import ImageMedia from '../../ImageMedia';

describe('ImageMedia', () => {
  it('renders with required props', () => {
    const { container, getByAltText } = render(
      <ImageMedia
        variant="image"
        src="image.jpg"
        alt="Test image"
      />
    );

    const img = getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('image-media__element');
  });

  it('applies className and custom dimensions', () => {
    const { getByAltText } = render(
      <ImageMedia
        variant="image"
        src="image.jpg"
        alt="Test image"
        className="test-class"
        width={640}
        height={480}
      />
    );

    const img = getByAltText('Test image');
    expect(img).toHaveClass('image-media__element', 'test-class');
    expect(img).toHaveAttribute('width', '640');
    expect(img).toHaveAttribute('height', '480');
  });

  it('handles loading attribute', () => {
    const { getByAltText } = render(
      <ImageMedia
        variant="image"
        src="image.jpg"
        alt="Test image"
        lazyLoad={true}
      />
    );

    const img = getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('renders with srcSet and sizes', () => {
    const { getByAltText } = render(
      <ImageMedia
        variant="image"
        src="image.jpg"
        alt="Test image"
        srcSet="image-sm.jpg 480w, image-md.jpg 800w, image-lg.jpg 1200w"
        sizes="(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px"
      />
    );

    const img = getByAltText('Test image');
    expect(img).toHaveAttribute('srcset', 'image-sm.jpg 480w, image-md.jpg 800w, image-lg.jpg 1200w');
    expect(img).toHaveAttribute('sizes', '(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px');
  });

  it('renders with circular style when circle prop is true', () => {
    const { container, getByAltText } = render(
      <ImageMedia
        variant="image"
        src="image.jpg"
        alt="Test image"
        circle={true}
      />
    );

    const imgContainer = container.querySelector('.image-media--circle');
    expect(imgContainer).toBeInTheDocument();

    const img = getByAltText('Test image');
    expect(img).toBeInTheDocument();
  });

  it('renders caption when provided', () => {
    const { getByText } = render(
      <ImageMedia
        variant="image"
        src="image.jpg"
        alt="Test image"
        caption="This is a test caption"
      />
    );

    const caption = getByText('This is a test caption');
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveClass('image-media__caption');
  });

  it('handles loading events', () => {
    const onLoad = jest.fn();

    const { getByAltText } = render(
      <ImageMedia
        variant="image"
        src="image.jpg"
        alt="Test image"
        onLoad={onLoad}
      />
    );

    const img = getByAltText('Test image');

    // Simulate load event
    img.dispatchEvent(new Event('load'));

    expect(onLoad).toHaveBeenCalled();
  });

  it('handles error events', () => {
    const onError = jest.fn();

    const { getByAltText } = render(
      <ImageMedia
        variant="image"
        src="broken-image.jpg"
        alt="Test image"
        onError={onError}
      />
    );

    const img = getByAltText('Test image');

    // Simulate error event
    img.dispatchEvent(new Event('error'));

    expect(onError).toHaveBeenCalled();
  });
}); 