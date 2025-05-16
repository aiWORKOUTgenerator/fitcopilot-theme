/**
 * Type guards for feature-specific Media components
 * 
 * This file contains type guard implementations for safely working with
 * the Media component in the features directory. These guards help with type narrowing to ensure
 * type safety when handling different media variants.
 * 
 * Note: These differ from the core media type guards as they use 'variant' instead of 'type'
 * as the discriminator property.
 */

import {
  AudioMediaProps,
  ImageGalleryProps,
  ImageMediaProps,
  MediaCarouselProps,
  MediaProps,
  VideoMediaProps,
  YouTubeMediaProps
} from '../../features/shared/Media/types';

/**
 * Type guard to check if props are for an image media component
 * 
 * @param props The media props to check
 * @returns Type predicate indicating if props are for an image media component
 */
export function isImageMedia(props: MediaProps): props is ImageMediaProps {
  return props.variant === 'image';
}

/**
 * Type guard to check if props are for a video media component
 * 
 * @param props The media props to check
 * @returns Type predicate indicating if props are for a video media component
 */
export function isVideoMedia(props: MediaProps): props is VideoMediaProps {
  return props.variant === 'video';
}

/**
 * Type guard to check if props are for an audio media component
 * 
 * @param props The media props to check
 * @returns Type predicate indicating if props are for an audio media component
 */
export function isAudioMedia(props: MediaProps): props is AudioMediaProps {
  return props.variant === 'audio';
}

/**
 * Type guard to check if props are for a YouTube media component
 * 
 * @param props The media props to check
 * @returns Type predicate indicating if props are for a YouTube media component
 */
export function isYouTubeMedia(props: MediaProps): props is YouTubeMediaProps {
  return props.variant === 'youtube';
}

/**
 * Type guard to check if props are for an image gallery component
 * 
 * @param props The media props to check
 * @returns Type predicate indicating if props are for an image gallery component
 */
export function isImageGallery(props: MediaProps): props is ImageGalleryProps {
  return props.variant === 'imageGallery';
}

/**
 * Type guard to check if props are for a media carousel component
 * 
 * @param props The media props to check
 * @returns Type predicate indicating if props are for a media carousel component
 */
export function isMediaCarousel(props: MediaProps): props is MediaCarouselProps {
  return props.variant === 'carousel';
}

export default {
  isImageMedia,
  isVideoMedia,
  isAudioMedia,
  isYouTubeMedia,
  isImageGallery,
  isMediaCarousel
}; 