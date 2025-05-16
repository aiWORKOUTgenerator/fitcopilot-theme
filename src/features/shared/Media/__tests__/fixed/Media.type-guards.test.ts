import { createMediaProps } from '../../../../../utils/test/fixtures';
import {
  isAudioMedia,
  isImageGallery,
  isImageMedia,
  isMediaCarousel,
  isVideoMedia,
  isYouTubeMedia
} from '../../../../../utils/typeGuards/featureMediaTypeGuards';
import { MediaProps } from '../../types';

describe('Media Type Guards', () => {
  test('isImageMedia correctly identifies image media', () => {
    const props = createMediaProps('image', {
      src: 'test.jpg',
      alt: 'Test Image'
    });

    expect(isImageMedia(props)).toBe(true);
    expect(isVideoMedia(props)).toBe(false);
  });

  test('isVideoMedia correctly identifies video media', () => {
    const props = createMediaProps('video', {
      src: 'test.mp4',
      controls: true
    });

    expect(isVideoMedia(props)).toBe(true);
    expect(isImageMedia(props)).toBe(false);
  });

  test('isAudioMedia correctly identifies audio media', () => {
    const props = createMediaProps('audio', {
      src: 'test.mp3',
      controls: true
    });

    expect(isAudioMedia(props)).toBe(true);
    expect(isVideoMedia(props)).toBe(false);
  });

  test('isYouTubeMedia correctly identifies YouTube media', () => {
    const props = createMediaProps('youtube', {
      videoId: 'test123',
      width: 640,
      height: 360
    });

    expect(isYouTubeMedia(props)).toBe(true);
    expect(isVideoMedia(props)).toBe(false);
  });

  test('isImageGallery correctly identifies image gallery', () => {
    const props = createMediaProps('imageGallery', {
      images: [
        { src: 'test1.jpg', alt: 'Test 1' },
        { src: 'test2.jpg', alt: 'Test 2' }
      ]
    });

    expect(isImageGallery(props)).toBe(true);
    expect(isImageMedia(props)).toBe(false);
  });

  test('isMediaCarousel correctly identifies media carousel', () => {
    const props = createMediaProps('carousel', {
      items: [
        { type: 'image', src: 'test1.jpg', alt: 'Test 1' },
        { type: 'video', src: 'test2.mp4', alt: 'Test 2' }
      ]
    });

    expect(isMediaCarousel(props)).toBe(true);
    expect(isImageGallery(props)).toBe(false);
  });

  test('Type guards handle invalid variants', () => {
    const invalidProps = {
      variant: 'invalid',
      type: 'invalid',
      src: 'test.jpg'
    } as MediaProps;

    expect(isImageMedia(invalidProps)).toBe(false);
    expect(isVideoMedia(invalidProps)).toBe(false);
    expect(isAudioMedia(invalidProps)).toBe(false);
    expect(isYouTubeMedia(invalidProps)).toBe(false);
    expect(isImageGallery(invalidProps)).toBe(false);
    expect(isMediaCarousel(invalidProps)).toBe(false);
  });
}); 