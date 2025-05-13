import React from 'react';
import { MediaPlayerProps } from '../../../types/media';
import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

/**
 * MediaPlayer component that renders either a VideoPlayer or AudioPlayer
 * based on the _variant prop.
 * 
 * Uses the discriminated union pattern to provide type safety and proper
 * rendering logic.
 * 
 * @example
 * // Video player
 * <MediaPlayer
 *   _variant="video"
 *   sources={[{src: '/video.mp4', type: 'video/mp4'}]}
 *   aspectRatio="16:9"
 * />
 * 
 * @example
 * // Audio player
 * <MediaPlayer
 *   _variant="audio"
 *   sources={[{src: '/audio.mp3', type: 'audio/mpeg'}]}
 *   showWaveform={true}
 * />
 */
const MediaPlayer: React.FC<MediaPlayerProps> = (props) => {
    // Type narrowing based on the discriminated union
    if (props._variant === 'video') {
        return <VideoPlayer {...props} />;
    }

    if (props._variant === 'audio') {
        return <AudioPlayer {...props} />;
    }

    // TypeScript should prevent this case, but we handle it for safety
    // This should never be reached due to our discriminated union types
    throw new Error(`Unknown media variant: ${props._variant}`);
};

export default MediaPlayer; 