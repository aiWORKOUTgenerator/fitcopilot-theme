/**
 * Media component type definitions
 */


/**
 * Base media props shared across all media types
 */
export interface BaseMediaProps {
    /** CSS class name */
    className?: string;
    /** Media ID attribute */
    id?: string;
    /** Optional caption text */
    caption?: string;
    /** Alt text for accessibility (image and video) */
    alt?: string;
    /** Whether to lazy load the media */
    lazyLoad?: boolean;
    /** Accessibility label */
    'aria-label'?: string;
}

/**
 * Image media specific props
 */
export interface ImageMediaProps extends BaseMediaProps {
    /** Type discriminator */
    variant: 'image';
    /** Image source URL */
    src: string;
    /** Image width */
    width?: number;
    /** Image height */
    height?: number;
    /** Whether image should display as a circle */
    circle?: boolean;
    /** Responsive sizes attribute */
    sizes?: string;
    /** Responsive srcset attribute */
    srcSet?: string;
}

/**
 * Video media specific props
 */
export interface VideoMediaProps extends BaseMediaProps {
    /** Type discriminator */
    variant: 'video';
    /** Video source URL */
    src: string;
    /** Video poster image URL */
    poster?: string;
    /** Whether to autoplay the video */
    autoPlay?: boolean;
    /** Whether to mute the video */
    muted?: boolean;
    /** Whether to loop the video */
    loop?: boolean;
    /** Whether to display video controls */
    controls?: boolean;
    /** Video width */
    width?: number;
    /** Video height */
    height?: number;
    /** Video load event handler */
    onLoad?: () => void;
    ariaLabel?: string;
    aspectRatio?: '16:9' | '4:3' | '1:1' | 'cover' | string;
    allowPictureInPicture?: boolean;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onError?: (error: Event) => void;
    onTimeUpdate?: (currentTime: number) => void;
    onDurationChange?: (duration: number) => void;
}

/**
 * Audio media specific props
 */
export interface AudioMediaProps extends BaseMediaProps {
    /** Type discriminator */
    variant: 'audio';
    /** Audio source URL */
    src: string;
    /** Whether to autoplay the audio */
    autoPlay?: boolean;
    /** Whether to loop the audio */
    loop?: boolean;
    /** Whether to display audio controls */
    controls?: boolean;
    /** Audio load event handler */
    onLoad?: () => void;
    /** Accessibility label */
    ariaLabel?: string;
    /** Whether to show waveform visualization */
    showWaveform?: boolean;
    /** Whether to show artwork */
    showArtwork?: boolean;
    /** URL of the artwork image */
    artworkSrc?: string;
    /** Play event handler */
    onPlay?: () => void;
    /** Pause event handler */
    onPause?: () => void;
    /** End event handler */
    onEnded?: () => void;
    /** Error event handler */
    onError?: (error: Event) => void;
    /** Time update event handler */
    onTimeUpdate?: (currentTime: number) => void;
    /** Duration change event handler */
    onDurationChange?: (duration: number) => void;
    /** Volume change event handler */
    onVolumeChange?: (volume: number) => void;
}

/**
 * YouTube embed specific props
 */
export interface YouTubeMediaProps extends BaseMediaProps {
    /** Type discriminator */
    variant: 'youtube';
    /** YouTube video ID */
    videoId: string;
    /** Video width */
    width?: number;
    /** Video height */
    height?: number;
    /** Whether to autoplay the video */
    autoPlay?: boolean;
    /** Whether to mute the video */
    muted?: boolean;
    /** Whether to show related videos */
    showRelated?: boolean;
}

/**
 * Image gallery media specific props
 */
export interface ImageGalleryProps extends BaseMediaProps {
    variant: 'imageGallery';
    images: { src: string; alt?: string }[];
    initialIndex?: number;
    onImageChange?: (index: number) => void;
}

/**
 * Media carousel specific props
 */
export interface MediaCarouselProps extends BaseMediaProps {
    variant: 'carousel';
    items: Array<{ type: 'image' | 'video'; src: string; alt?: string }>;
    initialIndex?: number;
    onItemChange?: (index: number) => void;
}

/**
 * Discriminated union type for all media variants
 */
export type MediaProps =
    | ImageMediaProps
    | VideoMediaProps
    | AudioMediaProps
    | YouTubeMediaProps
    | ImageGalleryProps
    | MediaCarouselProps;

/**
 * Type guard for image media
 */
export const isImageMedia = (props: MediaProps): props is ImageMediaProps =>
    props.variant === 'image';

/**
 * Type guard for video media
 */
export const isVideoMedia = (props: MediaProps): props is VideoMediaProps =>
    props.variant === 'video';

/**
 * Type guard for audio media
 */
export const isAudioMedia = (props: MediaProps): props is AudioMediaProps =>
    props.variant === 'audio';

/**
 * Type guard for YouTube media
 */
export const isYouTubeMedia = (props: MediaProps): props is YouTubeMediaProps =>
    props.variant === 'youtube';

/**
 * Type guard for image gallery media
 */
export const isImageGallery = (props: MediaProps): props is ImageGalleryProps =>
    props.variant === 'imageGallery';

/**
 * Type guard for media carousel
 */
export const isMediaCarousel = (props: MediaProps): props is MediaCarouselProps =>
    props.variant === 'carousel'; 