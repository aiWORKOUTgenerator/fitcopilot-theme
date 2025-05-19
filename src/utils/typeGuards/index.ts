/**
 * Type Guards
 * 
 * This file exports all type guards used in the application for easy importing.
 * 
 * Import example:
 * ```
 * import { isNonNullable, isObject } from '@/utils/typeGuards';
 * ```
 */

export * from './commonTypeGuards';
export * from './domTypeGuards';

// Button type guards
export {
    isActionButton, isDisabled as isButtonDisabled,
    isLoading as isButtonLoading, isIconButton, isLinkButton
} from './buttonTypeGuards';

// Card type guards
export * from './cardTypeGuards';

// Media type guards
export {
    hasSource, isAvatarMedia, isIconMedia, isImageMedia,
    isVideoMedia
} from './mediaTypeGuards';

// Media API type guards
export {
    browserSupportsPictureInPicture, documentHasMsFullscreen, documentHasWebkitFullscreen, getAudioContextConstructor, getFullscreenSupport,
    getPictureInPictureSupport, hasMsFullscreenMethods, hasWebkitFullscreenMethods, isAudioElement,
    isMediaElement, isVideoElement, supportsMediaMethod, supportsMsFullscreen, supportsPictureInPicture, supportsStandardFullscreen, supportsWebAudio, supportsWebkitFullscreen
} from './mediaApiGuards';

// Feature media type guards
export {
    isImageMedia as isFeatureImageMedia,
    isVideoMedia as isFeatureVideoMedia
} from './featureMediaTypeGuards';

