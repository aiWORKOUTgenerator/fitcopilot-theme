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
import MediaCarousel from './MediaCarousel';
import { MediaProps } from './types';
import VideoPlayer from './VideoPlayer';

/**
 * Media component that renders different media types based on variant prop
 */
export const Media: React.FC<MediaProps> = (props) => {
    if (isVideoMedia(props)) return <VideoPlayer {...props} />;
    if (isAudioMedia(props)) return <AudioPlayer {...props} />;
    if (isImageMedia(props)) return <img {...props} />;
    if (isYouTubeMedia(props)) return <iframe src={`https://www.youtube.com/embed/${props.videoId}`} width={props.width} height={props.height} allowFullScreen />;
    if (isImageGallery(props)) return <ImageGallery {...props} />;
    if (isMediaCarousel(props)) return <MediaCarousel {...props} />;
    return null;
};

export default Media; 