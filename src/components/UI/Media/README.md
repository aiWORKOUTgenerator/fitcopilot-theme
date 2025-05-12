# Media Components

A comprehensive suite of media components for FitCopilot with strong type safety using discriminated unions and a consistent API.

## Components

### MediaPlayer

The unified media player component that renders either a `VideoPlayer` or an `AudioPlayer` based on the `_variant` prop.

```tsx
import { MediaPlayer } from '../components/UI/Media';

// Video variant
<MediaPlayer
  _variant="video"
  sources={[{ src: "/path/to/video.mp4", type: "video/mp4" }]}
  aspectRatio="16:9"
  controls={true}
/>

// Audio variant
<MediaPlayer
  _variant="audio"
  sources={[{ src: "/path/to/audio.mp3", type: "audio/mpeg" }]}
  showWaveform={true}
  title="Workout Mix"
  artist="FitCopilot"
/>
```

### VideoPlayer

A specialized video player component with custom controls, loading states, and error handling.

```tsx
import { VideoPlayer } from '../components/UI/Media';

<VideoPlayer
  _variant="video"
  sources={[
    { src: "/path/to/video.mp4", type: "video/mp4" },
    { src: "/path/to/video.webm", type: "video/webm" }
  ]}
  poster="/path/to/poster.jpg"
  aspectRatio="16:9"
/>
```

### AudioPlayer

A specialized audio player component with visualization, artwork support, and custom controls.

```tsx
import { AudioPlayer } from '../components/UI/Media';

<AudioPlayer
  _variant="audio"
  sources={[{ src: "/path/to/audio.mp3", type: "audio/mpeg" }]}
  showWaveform={true}
  showArtwork={true}
  artworkSrc="/path/to/artwork.jpg"
  title="Workout Mix"
  artist="FitCopilot"
/>
```

## Hooks

### useMediaPlayer

A custom React hook for advanced control of media elements.

```tsx
import { useMediaPlayer } from '../hooks';
import { VideoPlayer } from '../components/UI/Media';

const MyComponent = () => {
  const { state, controls } = useMediaPlayer({
    initialPlaybackRate: 1,
    initialVolume: 0.8,
    autoPlay: false
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      controls.initMediaElement(videoRef.current);
    }
  }, [controls]);
  
  return (
    <div>
      <VideoPlayer
        _variant="video"
        sources={[{ src: "/path/to/video.mp4", type: "video/mp4" }]}
        ref={videoRef}
        controls={false}
      />
      
      <button onClick={() => controls.togglePlay()}>
        {state.isPlaying ? 'Pause' : 'Play'}
      </button>
      
      <button onClick={() => controls.toggleMute()}>
        {state.isMuted ? 'Unmute' : 'Mute'}
      </button>
      
      <div>Current time: {Math.floor(state.currentTime)}s</div>
    </div>
  );
};
```

## Type System

The Media components use a discriminated union pattern for type safety:

```typescript
// Discriminated union for MediaPlayer props
export type MediaPlayerProps =
  | (VideoPlayerProps & { _variant: 'video' })
  | (AudioPlayerProps & { _variant: 'audio' });
```

This allows TypeScript to properly narrow down the component props based on the `_variant` field.

## Examples

See the `MediaExample` component for comprehensive usage examples:

```tsx
import { MediaExample } from '../components/UI/Media';

<MediaExample />
```

## Backward Compatibility

The system supports legacy code through automatic prop conversion:

```tsx
// Legacy style still works
<VideoPlayer
  src="/path/to/video.mp4"
  fallbackSrc="/path/to/fallback.webm"
  poster="/path/to/poster.jpg"
/>

// Converted internally to new style
<VideoPlayer
  _variant="video"
  sources={[
    { src: "/path/to/video.mp4", isDefault: true },
    { src: "/path/to/fallback.webm" }
  ]}
  poster="/path/to/poster.jpg"
/>
``` 