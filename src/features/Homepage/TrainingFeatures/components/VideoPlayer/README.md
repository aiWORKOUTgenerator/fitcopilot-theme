# VideoPlayer Component for TrainingFeatures

A reusable video player component with custom controls, multiple source support, loading states, and error handling that integrates with the TrainingFeatures design system.

## Features

- 🎬 Multiple video source support with fallbacks
- ⏯️ Custom play/pause controls with elegant overlay
- 📊 Progress bar with time display
- ⏳ Loading state with spinner
- ❌ Error handling with user feedback
- 🖌️ Design system integration with TrainingFeatures styling
- ♿ Accessibility support
- 📱 Responsive design
- 🔄 Reduced motion support

## Usage

```tsx
import VideoPlayer from '../../components/VideoPlayer';
import { VideoSource } from '../../components/VideoPlayer';

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

## Integration with MediaContainer

The VideoPlayer is designed to work seamlessly with the MediaContainer component:

```tsx
<MediaContainer
  src="/path/to/video.mp4"
  type="video"
  aspectRatio="16/9"
  alt="Training video"
  poster="/path/to/poster.jpg"
  fallbackSrc={fallbackSources}
  controls={true}
  muted={true}
  autoPlay={false}
/>
```

## Integration with Feature Cards

The VideoPlayer works with the flip card system in TrainingFeatures:

```tsx
const trainingFeatures = [
  {
    // ... other properties
    media: {
      type: 'video',
      src: '/path/to/video.mp4',
      poster: '/path/to/poster.jpg',
      fallbackSrc: [
        {
          src: '/path/to/video.webm',
          type: 'video/webm'
        }
      ]
    }
  }
];

// In your JSX
<MediaContainer 
  src={feature.media.src}
  type={feature.media.type}
  aspectRatio="16/9"
  alt={feature.media.alt || feature.title}
  poster={feature.media.type === 'video' ? feature.media.poster : undefined}
  fallbackSrc={feature.media.type === 'video' ? feature.media.fallbackSrc : undefined}
  controls={feature.media.type === 'video'}
  muted={true}
  autoPlay={false}
  className="mb-4"
/>
```

## Best Practices

1. **Video Size**: Optimize videos for web (compress, scale appropriately)
2. **Poster Images**: Always provide a poster image for better user experience
3. **Accessibility**: Include descriptive `ariaLabel` props
4. **Mobile Support**: Test on various screen sizes
5. **Autoplay**: Use with caution as browsers may block it
6. **Fallbacks**: Always provide multiple sources for different browsers

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

## Styling

The component is styled to match the TrainingFeatures design system with:

- Lime and emerald gradient for controls
- Responsive aspect ratio containers
- Elegant loading states
- Progress bar and time indicators
- Dark background that matches card styles 