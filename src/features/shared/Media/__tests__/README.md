# Media Component Testing Guide

## Overview

This document outlines the best practices for testing media components (Video, Audio, YouTube, etc.) in our React application. Media components present unique testing challenges due to:

1. Asynchronous loading and playback behavior
2. Complex browser APIs that need mocking
3. Multiple state transitions during media lifecycle
4. External dependencies (e.g., YouTube API)

## Testing Utilities

We've created reusable testing utilities in `src/utils/test/mediaEventUtils.ts` to facilitate consistent and reliable media testing:

### HTML5 Media Elements (Video/Audio)

```typescript
// Create a mock video element
const videoEl = createMockMediaElement();

// Simulate media events
simulateMediaEvent(videoEl, 'play');
simulateMediaEvent(videoEl, 'pause');
simulateMediaEvent(videoEl, 'timeupdate');

// Simulate complete loading sequence
simulateMediaLoading(videoEl);

// Simulate media errors
simulateMediaError(videoEl, MediaError.MEDIA_ERR_NETWORK);
```

### YouTube Player

```typescript
// Create mock player in your test setup
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

### 1. Document/Element Mocking

For HTML5 video/audio elements, intercept the document.createElement call:

```typescript
beforeAll(() => {
  const originalCreateElement = document.createElement.bind(document);
  
  jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
    if (tagName === 'video') {
      return createMockMediaElement() as any;
    }
    return originalCreateElement(tagName);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
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
  const videoEl = document.querySelector('video');
  simulateMediaLoading(videoEl);
  
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
  const videoEl = document.querySelector('video');
  expect(videoEl.play).toHaveBeenCalled();
  
  // Simulate video playing
  videoEl.paused = false;
  simulateMediaEvent(videoEl, 'play');
  
  // Expect the UI to update showing pause button
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });
});
```

### 4. Testing Error States

Media components should handle various error scenarios gracefully:

```typescript
it('handles network errors properly', async () => {
  render(<VideoPlayer src="video.mp4" />);
  
  const videoEl = document.querySelector('video');
  simulateMediaError(videoEl, MediaError.MEDIA_ERR_NETWORK);
  
  await waitFor(() => {
    expect(screen.getByText(/error playing video/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
```

### 5. Testing External APIs (YouTube)

For YouTube and other external APIs, create global mocks:

```typescript
// Mock global YT object
beforeAll(() => {
  global.YT = {
    Player: jest.fn().mockImplementation(() => mockYTPlayer),
    PlayerState: { /* ... */ }
  };
});

// Simulate API loading
const triggerYouTubeApiLoad = () => {
  if (window.onYouTubeIframeAPIReady) {
    window.onYouTubeIframeAPIReady();
  }
};
```

## Common Testing Patterns

### Wait for Async Operations

Always use waitFor for asynchronous state updates:

```typescript
// After triggering an event
await waitFor(() => {
  expect(condition).toBeTruthy();
});
```

### Test User Interactions

Use `userEvent` instead of `fireEvent` for more realistic interactions:

```typescript
const user = userEvent.setup();
await user.click(playButton);
```

### Verify Props/Callbacks

Ensure that callbacks are invoked with correct parameters:

```typescript
const onTimeUpdate = jest.fn();
render(<VideoPlayer onTimeUpdate={onTimeUpdate} />);

// Update time and trigger event
videoEl.currentTime = 30;
simulateMediaEvent(videoEl, 'timeupdate');

await waitFor(() => {
  expect(onTimeUpdate).toHaveBeenCalledWith(30);
});
```

## Troubleshooting Common Issues

1. **Event Simulation Problems**: Ensure events are properly dispatched on the media element.

2. **Timing Issues**: Use jest.useFakeTimers() for predictable timing or increase waitFor timeout.

3. **Missing State Updates**: Check if the component actually reacts to the simulated events.

4. **YouTube API Issues**: Verify global mocks are correctly set up and event callbacks are triggered.

5. **Media Element Mocks**: Ensure all required properties exist on the mock media element. 