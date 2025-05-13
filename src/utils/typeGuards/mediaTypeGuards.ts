/**
 * Type guards for media components
 * 
 * This file contains type guard implementations for safely working with
 * media component types. These guards help with type narrowing to ensure
 * type safety when handling different media types.
 */

import {
    AvatarMediaProps,
    IconMediaProps,
    ImageMediaProps,
    MediaProps,
    VideoMediaProps
} from '../../types/media';

/**
 * Type guard to check if props are for an image media component
 * 
 * @param props The media props to check
 * @returns Type predicate indicating if props are for an image media component
 */
export function isImageMedia(props: MediaProps): props is ImageMediaProps {
    return props.type === 'image';
}

/**
 * Type guard to check if props are for a video media component
 * 
 * @param props The media props to check
 * @returns Type predicate indicating if props are for a video media component
 */
export function isVideoMedia(props: MediaProps): props is VideoMediaProps {
    return props.type === 'video';
}

/**
 * Type guard to check if props are for an icon media component
 * 
 * @param props The media props to check
 * @returns Type predicate indicating if props are for an icon media component
 */
export function isIconMedia(props: MediaProps): props is IconMediaProps {
    return props.type === 'icon';
}

/**
 * Type guard to check if props are for an avatar media component
 * 
 * @param props The media props to check
 * @returns Type predicate indicating if props are for an avatar media component
 */
export function isAvatarMedia(props: MediaProps): props is AvatarMediaProps {
    return props.type === 'avatar';
}

/**
 * Type guard to check if media has a source
 * 
 * @param props The media props to check
 * @returns Whether the media has a source
 */
export function hasSource(props: MediaProps): boolean {
    return 'src' in props && !!props.src;
}

export default {
    isImageMedia,
    isVideoMedia,
    isIconMedia,
    isAvatarMedia,
    hasSource
}; 