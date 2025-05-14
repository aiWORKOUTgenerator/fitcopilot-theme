import { render } from '@testing-library/react';
import React from 'react';
import { Media } from '../Media';
import { ImageMediaProps } from '../types';

describe('Image variant of Media component', () => {
    // Helper function for setup to reduce boilerplate
    const setup = (props = {}) => {
        const defaultProps: ImageMediaProps = {
            variant: 'image',
            src: 'test-image.jpg',
            alt: 'Test image'
        };

        const mergedProps = { ...defaultProps, ...props };
        return render(<Media {...mergedProps} />);
    };

    it('renders an img element with required props', () => {
        const { getByAltText } = setup();

        const img = getByAltText('Test image');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'test-image.jpg');
        expect(img).toHaveClass('image-media__element');
    });

    it('applies className to the container element', () => {
        const { getByAltText, container } = setup({
            className: 'custom-class'
        });

        const containerDiv = getByAltText('Test image').closest('div');
        expect(containerDiv).toHaveClass('image-media', 'custom-class');
    });

    it('sets width and height attributes on the img element', () => {
        const { getByAltText } = setup({
            width: 640,
            height: 480
        });

        const img = getByAltText('Test image');
        expect(img).toHaveAttribute('width', '640');
        expect(img).toHaveAttribute('height', '480');
    });

    it('supports responsive image attributes (srcSet and sizes)', () => {
        const { getByAltText } = setup({
            srcSet: 'test-small.jpg 480w, test-medium.jpg 800w, test-large.jpg 1200w',
            sizes: '(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px'
        });

        const img = getByAltText('Test image');
        expect(img).toHaveAttribute('srcset', 'test-small.jpg 480w, test-medium.jpg 800w, test-large.jpg 1200w');
        expect(img).toHaveAttribute('sizes', '(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px');
    });

    it('adds loading="lazy" attribute when lazyLoad prop is true', () => {
        const { getByAltText } = setup({
            lazyLoad: true
        });

        const img = getByAltText('Test image');
        expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('supports circular image display with circle prop', () => {
        const { getByAltText } = setup({
            circle: true
        });

        const containerDiv = getByAltText('Test image').closest('div');
        expect(containerDiv).toHaveClass('image-media--circle');
    });

    it('renders caption when provided', () => {
        const { getByText } = setup({
            caption: 'This is a test caption'
        });

        const caption = getByText('This is a test caption');
        expect(caption).toBeInTheDocument();
        expect(caption).toHaveClass('image-media__caption');
    });

    it('passes aria attributes for accessibility', () => {
        const { getByAltText } = setup({
            'aria-label': 'Accessible image description'
        });

        const img = getByAltText('Test image');
        expect(img).toHaveAttribute('aria-label', 'Accessible image description');
    });
}); 