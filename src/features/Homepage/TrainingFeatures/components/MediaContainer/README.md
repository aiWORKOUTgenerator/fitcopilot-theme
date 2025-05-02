# MediaContainer Component

A versatile media container component that provides a consistent interface for both images and videos in the TrainingFeatures section, with standardized styling, accessibility features, and responsive behavior.

## Purpose

The MediaContainer provides a unified approach to displaying different types of media while maintaining:
- Consistent aspect ratios
- Standardized loading and error states
- Proper focus management for accessibility
- Responsive design patterns
- Integration with the design system's color tokens

## Features

- 🖼️ Unified container for both images and videos
- 📐 Consistent aspect ratio handling
- ⏳ Standardized loading states
- ❌ Error handling with visual feedback
- 🔍 Support for text overlay content
- ♿ Accessibility-focused design
- 🎨 Integration with the design system's color variables

## Usage

```tsx
import MediaContainer from '../../components/MediaContainer';

// Basic image usage
const ImageExample = () => {
  return (
    <MediaContainer 
      src="/path/to/image.jpg" 
      type="image" 
      alt="Description of image" 
    />
  );
};

// Basic video usage
const VideoExample = () => {
  return (
    <MediaContainer 
      src="/path/to/video.mp4" 
      type="video" 
      alt="Description of video"
      poster="/path/to/poster.jpg"
    />
  );
};

// With overlay content
const OverlayExample = () => {
  return (
    <MediaContainer src="/path/to/image.jpg" alt="Background image">
      <div className="text-center">
        <h3 className="text-xl font-bold">Overlay Title</h3>
        <p>This text appears on top of the media with proper contrast</p>
      </div>
    </MediaContainer>
  );
};
```

## Integration with TrainingFeatures

The MediaContainer is designed to work with the feature cards in TrainingFeatures:

```tsx
// In your feature data
const trainingFeatures = [
  {
    // ... other properties
    media: {
      type: 'image',
      src: '/path/to/image.jpg',
      alt: 'Description of image'
    }
  },
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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | *Required* | Media source URL |
| `type` | `'image' \| 'video'` | `'image'` | Type of media |
| `aspectRatio` | `string` | `'16/9'` | CSS aspect ratio |
| `fallbackColor` | `string` | `'var(--color-gray-800)'` | Color shown during loading/error |
| `alt` | `string` | `''` | Alt text or aria-label |
| `poster` | `string` | `undefined` | Poster image for video |
| `fallbackSrc` | `string \| VideoSource[]` | `undefined` | Fallback sources for video |
| `controls` | `boolean` | `true` | Whether to show video controls |
| `loop` | `boolean` | `true` | Whether video should loop |
| `muted` | `boolean` | `true` | Whether video should be muted |
| `autoPlay` | `boolean` | `false` | Whether to auto-play video |
| `className` | `string` | `''` | Additional CSS classes |
| `children` | `React.ReactNode` | `undefined` | Overlay content |

## Design System Integration

The component uses CSS variables to integrate with the design system:

```scss
.media-container {
    --media-overlay-bg: rgba(0, 0, 0, 0.5);
    --media-overlay-bg-hover: rgba(0, 0, 0, 0.3);
    --media-text-color: var(--color-white, #ffffff);
    --media-loading-bg: rgba(0, 0, 0, 0.2);
    --media-error-bg: rgba(220, 38, 38, 0.1);
    // ...
}
```

## Accessibility Features

- Proper focus management with visible focus states
- Descriptive alt text for images
- ARIA labels for videos
- Support for prefers-reduced-motion
- Proper color contrast for overlay text

## Best Practices

1. **Images**:
   - Always provide alt text
   - Optimize images for web
   - Use responsive image techniques for large images

2. **Videos**:
   - Always include a poster image
   - Provide multiple source formats
   - Use muted attribute for autoplay compatibility
   - Keep videos short and compressed appropriately

3. **Overlay Content**:
   - Ensure text has sufficient contrast over media
   - Keep overlay content minimal and focused 