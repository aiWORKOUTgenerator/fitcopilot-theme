# Media Component Testing Guide

## Overview

This guide outlines best practices for testing media components (Video, Audio, YouTube, etc.) in our React application. Media components present unique testing challenges due to:

1. Asynchronous loading and playback behavior
2. Complex browser APIs that need mocking
3. Multiple state transitions during media lifecycle
4. External dependencies (e.g., YouTube API)

## Testing Utilities

We've created reusable testing utilities in `src/utils/test/mediaEventUtils.ts` to facilitate consistent and reliable media testing:

### HTML5 Media Elements (Video/Audio)

```typescript
// Import the utilities
import { 
  createMockMediaElement, 
  simulateMediaEvent, 
  simulateMediaLoading,
  simulateMediaError
} from '../../../../utils/test/mediaEventUtils';

// Simulate media events
simulateMediaEvent(videoElement, 'play');
simulateMediaEvent(videoElement, 'pause');
simulateMediaEvent(videoElement, 'timeupdate');

// Simulate complete loading sequence
simulateMediaLoading(videoElement);

// Simulate media errors
simulateMediaError(videoElement, MediaError.MEDIA_ERR_NETWORK);
```

### YouTube Player

```typescript
// Import the utilities
import { createMockYouTubePlayer } from '../../../../utils/test/mediaEventUtils';

// Create mock YouTube API in beforeAll
global.YT = {
  Player: jest.fn().mockImplementation((container, config) => {
    const player = createMockYouTubePlayer();
    // Save event handlers for later triggering
    mockYTEvents = config.events || {};
    return player;
  }),
  PlayerState: {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5
  }
};

// Later in tests, trigger events
mockYTEvents.onReady?.({ target: mockPlayer });
mockYTEvents.onStateChange?.({ data: global.YT.PlayerState.PLAYING });
```

## Testing Strategies

### 1. Mocking Strategy Approaches

We've implemented two effective approaches for mocking media elements:

#### Method 1: Using `document.createElement` Spy

This approach can be useful for complete control but is complex to set up:

```typescript
beforeAll(() => {
  const originalCreateElement = document.createElement.bind(document);
  
  jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
    if (tagName.toLowerCase() === 'video') {
      videoElement = createMockMediaElement();
      return videoElement;
    }
    return originalCreateElement(tagName);
  });
});
```

#### Method 2: HTMLVideoElement.prototype Mock (Recommended)

This approach is simpler and works well for most cases:

```typescript
beforeEach(() => {
  // Save original implementations
  originalPlay = HTMLVideoElement.prototype.play;
  originalPause = HTMLVideoElement.prototype.pause;

  // Create mock implementations
  HTMLVideoElement.prototype.play = jest.fn().mockResolvedValue(undefined);
  HTMLVideoElement.prototype.pause = jest.fn();
});

afterEach(() => {
  // Restore original implementations
  HTMLVideoElement.prototype.play = originalPlay;
  HTMLVideoElement.prototype.pause = originalPause;
});
```

### 2. Testing Loading States

Media components typically have multiple loading states that need testing:

```typescript
it('shows loading state initially and removes it after video loads', async () => {
  render(<VideoPlayer src="video.mp4" />);
  
  // Initial loading state
  expect(document.querySelector('.video-player__loading')).toBeInTheDocument();
  
  // Simulate loading completion
  const video = document.querySelector('video');
  simulateMediaEvent(video, 'loadeddata');
  
  // Loading state should be removed
  await waitFor(() => {
    expect(document.querySelector('.video-player__loading')).not.toBeInTheDocument();
  });
});
```

### 3. Testing Media Controls

Always test media controls using role-based selectors for better accessibility:

```typescript
it('handles play/pause interactions', async () => {
  const user = userEvent.setup();
  render(<VideoPlayer src="video.mp4" />);
  
  // Click play button
  const playButton = screen.getByRole('button', { name: /play/i });
  await user.click(playButton);
  
  // Expect play() to be called on the video element
  const video = document.querySelector('video');
  expect(video.play).toHaveBeenCalled();
  
  // Simulate video playing
  simulateMediaEvent(video, 'play');
  
  // Expect UI to update showing pause button
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });
});
```

### 4. Testing Error States

Media components should handle various error scenarios gracefully:

```typescript
it('handles error states properly', async () => {
  const onError = jest.fn();
  render(<VideoPlayer src="video.mp4" onError={onError} />);
  
  // Simulate error
  const video = document.querySelector('video');
  
  // Create a fake error
  const fakeError = { code: 2 }; // 2 = MEDIA_ERR_NETWORK
  Object.defineProperty(video, 'error', { value: fakeError });
  
  // Trigger error event
  simulateMediaEvent(video, 'error');
  
  // Verify error UI is shown
  await waitFor(() => {
    expect(document.querySelector('.video-player__error')).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
  });
});
```

### 5. Testing External APIs (YouTube)

For YouTube and other external APIs, create global mocks:

```typescript
// Helper to trigger YouTube API loading
const triggerYouTubeApiLoad = () => {
  // Manually trigger the YouTube API ready callback
  if (window.onYouTubeIframeAPIReady) {
    window.onYouTubeIframeAPIReady();
  }
};

it('initializes player correctly', async () => {
  render(<YouTubePlayer videoId="abc123" />);
  
  triggerYouTubeApiLoad();
  
  await waitFor(() => {
    expect(global.YT.Player).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        videoId: 'abc123'
      })
    );
  });
});
```

## Common Testing Patterns

### Wait for Async Operations

Always use `waitFor` for asynchronous state updates:

```typescript
// After triggering an event
await waitFor(() => {
  expect(condition).toBeTruthy();
});
```

### Testing User Interactions

Use `userEvent` instead of `fireEvent` for more realistic interactions:

```typescript
const user = userEvent.setup();
await user.click(button);
```

### Mocking Object Properties

To mock properties on existing objects:

```typescript
// Set video properties
Object.defineProperty(video, 'currentTime', { value: 30, writable: true });
Object.defineProperty(video, 'duration', { value: 100, writable: true });
```

## Troubleshooting Common Issues

1. **Event Simulation Problems**: Ensure events are properly dispatched on the media element using `simulateMediaEvent()`.

2. **Timing Issues**: For asynchronous updates, always use `waitFor()` to wait for state changes.

3. **Missing State Updates**: Check if the component actually reacts to the simulated events.

4. **Setter/Getter Issues**: For properties like `currentTime` that are getters/setters in real elements but direct properties in our mock, use `Object.defineProperty()`.

5. **YT API Issues**: Ensure the mock YouTube API is properly set up and events are triggered at the right times.

## Best Practices

1. Use the provided utility functions for consistent testing
2. Test all media states: loading, playing, paused, ended, error
3. Test accessibility of controls
4. Verify callbacks are called with expected parameters
5. Clean up mocks in afterEach/afterAll to prevent test pollution 