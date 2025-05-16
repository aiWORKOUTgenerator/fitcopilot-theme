import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import logger from '../../../../utils/logger';
import { simulateMediaEvent } from '../../../../utils/test/mediaEventUtils';
import VideoPlayer from '../VideoPlayer';

// Mock the logger to prevent console errors during tests
jest.mock('../../../../utils/logger', () => ({
  error: jest.fn(),
}));

describe('VideoPlayer', () => {
  // Mock the HTMLVideoElement play and pause methods
  let originalPlay;
  let originalPause;

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
    jest.clearAllMocks();
  });

  it('renders with required props', () => {
    const { container } = render(
      <VideoPlayer variant="video" src="https://example.com/video.mp4" poster="https://example.com/poster.jpg" />
    );

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', 'https://example.com/video.mp4');
    expect(video).toHaveAttribute('poster', 'https://example.com/poster.jpg');
  });

  it('shows loading state initially and removes it after video loads', async () => {
    const { container } = render(
      <VideoPlayer variant="video" src="https://example.com/video.mp4" />
    );

    // Should show loading indicator initially
    const loadingIndicator = container.querySelector('.video-player__loading');
    expect(loadingIndicator).toBeInTheDocument();

    // Simulate video loading completed
    const video = container.querySelector('video');
    simulateMediaEvent(video, 'loadeddata');

    // Loading indicator should be removed
    await waitFor(() => {
      expect(container.querySelector('.video-player__loading')).not.toBeInTheDocument();
    });
  });

  it('handles play/pause interactions correctly', async () => {
    const onPlay = jest.fn();
    const onPause = jest.fn();
    const user = userEvent.setup();

    const { container } = render(
      <VideoPlayer
        variant="video"
        src="https://example.com/video.mp4"
        controls={true}
        onPlay={onPlay}
        onPause={onPause}
      />
    );

    // Simulate video loading
    const video = container.querySelector('video');
    simulateMediaEvent(video, 'loadeddata');

    // Find play button
    const playButton = container.querySelector('.video-player__play-button');
    await user.click(playButton);

    // Verify play was called
    expect(video.play).toHaveBeenCalledTimes(1);

    // Simulate playing state
    simulateMediaEvent(video, 'play');

    // Verify callback was called
    await waitFor(() => {
      expect(onPlay).toHaveBeenCalledTimes(1);
    });

    // Now the component should be in "playing" state
    // Simulate paused state for component to update UI
    simulateMediaEvent(video, 'playing');

    // Find pause button by aria-label
    const pauseButton = screen.getByLabelText('Pause');
    await user.click(pauseButton);

    // Verify pause was called
    expect(video.pause).toHaveBeenCalledTimes(1);

    // Simulate paused state
    simulateMediaEvent(video, 'pause');

    // Verify callback was called
    await waitFor(() => {
      expect(onPause).toHaveBeenCalledTimes(1);
    });
  });

  it('auto plays when autoPlay is true', () => {
    const { container } = render(
      <VideoPlayer
        variant="video"
        src="https://example.com/video.mp4"
        autoPlay={true}
      />
    );

    const video = container.querySelector('video');
    expect(video.play).toHaveBeenCalledTimes(1);
  });

  it('handles error states properly', async () => {
    const onError = jest.fn();
    const { container } = render(
      <VideoPlayer
        variant="video"
        src="https://example.com/video.mp4"
        onError={onError}
      />
    );

    // Simulate error
    const video = container.querySelector('video');

    // Create a fake error object
    const fakeError = { code: 2 }; // 2 = MEDIA_ERR_NETWORK
    Object.defineProperty(video, 'error', { value: fakeError });

    // Trigger error event
    simulateMediaEvent(video, 'error');

    // Verify error UI is shown
    await waitFor(() => {
      expect(container.querySelector('.video-player__error')).toBeInTheDocument();
      expect(onError).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });
}); 