# VideoPlayer Component

A reusable video player component with custom controls, multiple source support, loading states, and error handling that integrates with the FitCopilot design system.

## File Structure

```
src/features/Homepage/Features/components/
├── VideoPlayer.tsx        # Component implementation
└── VideoPlayer.scss       # Component-specific styles
```

## Dependencies

- React (with hooks)
- Lucide React icons (`Pause`, `Play`, `AlertCircle`)
- Design system tokens (via SCSS imports)

## Features

- 🎬 Multiple video source support with fallbacks
- ⏯️ Custom play/pause controls with elegant overlay
- 📊 Progress bar with time display
- ⏳ Loading state with spinner
- ❌ Error handling with user feedback
- 🖌️ Design system integration
- ♿ Accessibility support
- 📱 Responsive design
- 🔄 Reduced motion support

## Usage

```tsx
import VideoPlayer from 'src/features/Homepage/Features/components/VideoPlayer';
import { VideoSource } from 'src/features/Homepage/Features/components/VideoPlayer';

// Basic usage
const MyComponent = () => {
  return (
    <VideoPlayer 
      src="/path/to/video.mp4"
    />
  );
};

// Advanced usage with fallbacks and options
const AdvancedUsage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Multiple fallback sources
  const fallbackSources: VideoSource[] = [
    {
      src: '/alternate/path/video.mp4',
      type: 'video/mp4'
    },
    {
      src: '/alternate/path/video.webm',
      type: 'video/webm'
    }
  ];
  
  return (
    <VideoPlayer 
      ref={videoRef}
      src="/path/to/video.mp4"
      fallbackSrc={fallbackSources}
      poster="/path/to/poster.jpg"
      controls={true}
      loop={true}
      muted={true}
      autoPlay={false}
      ariaLabel="Training demonstration video"
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | *Required* | Primary video source URL |
| `fallbackSrc` | `string \| VideoSource[]` | `undefined` | Fallback source(s) if primary fails |
| `poster` | `string` | `undefined` | Image to display before video plays |
| `controls` | `boolean` | `true` | Whether to show video controls |
| `loop` | `boolean` | `true` | Whether video should loop |
| `muted` | `boolean` | `true` | Whether video should be muted |
| `autoPlay` | `boolean` | `false` | Whether to auto-play on load |
| `className` | `string` | `''` | Additional CSS classes |
| `ariaLabel` | `string` | `'Video content'` | Accessibility label |

## Events & Refs

The component accepts a `ref` that provides direct access to the underlying `<video>` element, allowing you to programmatically control playback:

```tsx
const videoRef = useRef<HTMLVideoElement>(null);

// Later in your code
const playVideo = () => {
  if (videoRef.current) {
    videoRef.current.play().catch(console.error);
  }
};

const pauseVideo = () => {
  if (videoRef.current) {
    videoRef.current.pause();
  }
};

// Pass the ref to the component
<VideoPlayer 
  ref={videoRef} 
  src="/path/to/video.mp4" 
/>
```

## Integration with Feature Cards

The VideoPlayer works seamlessly with the FeatureCard flip card system. To use it as a demo component:

```tsx
const features = [
  {
    icon: <HeartHandshake size={32} className="text-white feature-icon" />,
    title: "Expert Advice & Form Tips",
    description: "Access professional guidance with video demonstrations and personalized form feedback.",
    gradient: "from-violet-400 to-purple-600",
    demoComponent: (
      <VideoPlayer 
        ref={videoRef} 
        src={primaryVideoSrc}
        fallbackSrc={fallbackSources} 
        poster="/wp-content/uploads/2023/featured-images/fitness-video-poster.jpg"
        ariaLabel="Fitness expert demonstrating proper form techniques"
      />
    )
  }
];
```

## Styling & Customization

The component uses a dedicated SCSS file that imports design system tokens. To modify the appearance:

1. **Theme Integration**: The component automatically uses your theme's accent colors via design tokens
2. **Dimensions**: Adjust the container size via standard layout techniques; the video maintains aspect ratio
3. **Control Colors**: Modify via CSS variables in your theme
4. **Custom Overlay**: Extend the `.video-overlay` class in your SCSS

## Handling Different Video Formats

For maximum browser compatibility, provide multiple video formats:

```tsx
const fallbackSources = [
  {
    src: '/path/to/video.mp4',
    type: 'video/mp4'
  },
  {
    src: '/path/to/video.webm',
    type: 'video/webm'
  },
  {
    src: '/path/to/video.ogv',
    type: 'video/ogg'
  }
];

<VideoPlayer 
  src="/path/to/main-video.mp4"
  fallbackSrc={fallbackSources}
/>
```

## Best Practices

1. **Video Size**: Optimize videos for web (compress, scale appropriately)
2. **Poster Images**: Always provide a poster image for better user experience
3. **Accessibility**: Include descriptive `ariaLabel` props
4. **Mobile Support**: Test on various screen sizes
5. **Autoplay**: Use with caution as browsers may block it
6. **Fallbacks**: Always provide multiple sources for different browsers

## Troubleshooting

Common issues and solutions:

- **Video not playing**: Check source paths and ensure formats are supported
- **No controls visible**: Ensure `controls` prop is `true`
- **Progress bar cut off**: Check container has enough bottom padding/margin
- **Mobile playback issues**: Ensure `playsInline` attribute is preserved (enabled by default)
- **Autoplay not working**: Modern browsers require videos to be muted for autoplay
- **Styling inconsistencies**: Ensure design system is properly imported

## Code Example: Auto-play on Hover

To create a card that automatically plays a video when hovered:

```tsx
const FeatureSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleCardHover = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.error("Video autoplay failed:", e);
      });
    }
  };
  
  const handleCardLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };
  
  return (
    <div 
      className="feature-card"
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
    >
      <h3>Video Feature</h3>
      <VideoPlayer 
        ref={videoRef}
        src="/path/to/video.mp4"
        controls={true}
        autoPlay={false}
        muted={true}
      />
    </div>
  );
};
```

## Extending the Component

To add new features to the video player:

1. Modify the `VideoPlayerProps` interface in `VideoPlayer.tsx`
2. Add styling in `VideoPlayer.scss`
3. Update the component implementation

Example for adding a fullscreen toggle:

```tsx
// In VideoPlayerProps interface
fullscreenButton?: boolean;

// In the component JSX
{controls && fullscreenButton && (
  <button 
    className="fullscreen-button"
    onClick={handleFullscreenToggle}
    aria-label="Toggle fullscreen"
  >
    <Maximize size={20} />
  </button>
)}
```

## Performance Considerations

- Use properly compressed videos
- Consider lazy loading for videos not in the initial viewport
- Avoid autoplay when possible to reduce initial page load impact
- Use the `poster` attribute to show an image until the video loads 