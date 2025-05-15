# VideoPlayer Component

The VideoPlayer component provides a rich, customizable video playback experience for the Hero section of the FitCopilot theme.

## Features

- Multiple video source support with fallbacks
- Custom play/pause controls with elegant overlay
- Progress bar with time display
- Loading state indicator
- Error handling with user feedback
- Design system integration
- Accessibility support
- Responsive design
- Reduced motion support

## Usage

### Basic Usage

```tsx
import { VideoPlayer } from './components';

<VideoPlayer 
  src="/path/to/video.mp4" 
/>
```

### Advanced Usage

```tsx
import { VideoPlayer } from './components';

<VideoPlayer 
  src="/path/to/video.mp4"
  fallbackSrc={[
    { src: "/path/to/video.webm", type: "video/webm" }
  ]}
  poster="/path/to/poster.jpg"
  controls={true}
  muted={true}
  autoPlay={false}
  loop={true}
  ariaLabel="Workout demonstration video"
  className="custom-video-class"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | (required) | Primary video source URL |
| `fallbackSrc` | `string \| VideoSource[]` | `undefined` | Optional fallback sources if primary source fails to load |
| `poster` | `string` | `undefined` | Poster image to display before video plays |
| `controls` | `boolean` | `true` | Whether to show controls overlay |
| `loop` | `boolean` | `true` | Whether video should loop when it reaches the end |
| `muted` | `boolean` | `true` | Whether video should be muted |
| `autoPlay` | `boolean` | `false` | Whether to play automatically when component mounts |
| `className` | `string` | `''` | Optional CSS class name to apply to container |
| `ariaLabel` | `string` | `'Video content'` | Accessibility label for the video |

## Integration with Hero

The VideoPlayer component is designed to be seamlessly integrated into the Hero component:

```tsx
// In Hero.tsx
import { VideoPlayer } from './components';

const Hero: React.FC<HeroProps> = ({
  // ... other props
  videoSrc,
  videoFallbackSrc,
  videoPoster,
  videoControls = true,
  videoAutoPlay = true,
}) => {
  // ... component logic

  return (
    <section>
      {/* ... other elements */}
      
      {videoSrc && (
        <div className="mt-10 max-w-3xl mx-auto">
          <VideoPlayer 
            src={videoSrc}
            fallbackSrc={videoFallbackSrc}
            poster={videoPoster}
            controls={videoControls}
            autoPlay={videoAutoPlay}
            muted={true}
            loop={true}
            ariaLabel="Demonstration of AI Workout Generator features"
            className="hero-video"
          />
        </div>
      )}
    </section>
  );
};
```

## Styling

The VideoPlayer component comes with comprehensive styling in `VideoPlayer.scss`. Additional custom styles specific to the Hero section integration are included in `Hero.scss`.

## Accessibility Considerations

- Provides proper ARIA labels
- Supports keyboard navigation
- Respects user preferences for reduced motion
- Includes visual and text-based error states
- Uses semantic HTML structure

## Browser Compatibility

Tested and supported in all modern browsers (Chrome, Firefox, Safari, Edge). 