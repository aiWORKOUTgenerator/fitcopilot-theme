/**
 * Media component that renders different media types based on variant
 */

import React from 'react';
import {
    isAudioMedia,
    isImageGallery,
    isImageMedia,
    isMediaCarousel,
    isVideoMedia,
    isYouTubeMedia
} from '../../../utils/typeGuards/featureMediaTypeGuards';
import AudioPlayer from './AudioPlayer';
import ImageGallery from './ImageGallery';
import ImageMedia from './ImageMedia';
import MediaCarousel from './MediaCarousel';
import { MediaProps } from './types';
import VideoPlayer from './VideoPlayer';
import YouTubePlayer from './YouTubePlayer';

/**
 * Media component that renders different media types based on variant prop
 */
export const Media: React.FC<MediaProps> = (props) => {
    if (isVideoMedia(props)) return <VideoPlayer {...props} />;
    if (isAudioMedia(props)) return <AudioPlayer {...props} />;
    if (isImageMedia(props)) return <ImageMedia {...props} />;
    if (isYouTubeMedia(props)) return <YouTubePlayer {...props} />;
    if (isImageGallery(props)) return <ImageGallery {...props} />;
    if (isMediaCarousel(props)) return <MediaCarousel {...props} />;
    return null;
};

export default Media; 