import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import AudioPlayer from './AudioPlayer';
import ImageGallery from './ImageGallery';
import Media from './Media';
import MediaCarousel from './MediaCarousel';
import VideoPlayer from './VideoPlayer';

const meta: Meta = {
  title: 'Shared/Media',
  component: Media,
};
export default meta;

type Story = StoryObj;

export const Audio: Story = {
  render: () => <AudioPlayer variant="audio" src="audio.mp3" />,
};

export const Video: Story = {
  render: () => <VideoPlayer variant="video" src="video.mp4" poster="poster.png" />,
};

export const Gallery: Story = {
  render: () => (
    <ImageGallery
      variant="imageGallery"
      images={[
        { src: 'img1.png', alt: 'Image 1' },
        { src: 'img2.png', alt: 'Image 2' },
        { src: 'img3.png', alt: 'Image 3' },
      ]}
    />
  ),
};

export const Carousel: Story = {
  render: () => (
    <MediaCarousel
      variant="carousel"
      items={[
        { type: 'image', src: 'img1.png', alt: 'Image 1' },
        { type: 'video', src: 'video1.mp4', alt: 'Video 1' },
        { type: 'image', src: 'img2.png', alt: 'Image 2' },
      ]}
    />
  ),
};

export const DiscriminatedUnion: Story = {
  render: () => (
    <>
      <Media variant="audio" src="audio.mp3" />
      <Media variant="video" src="video.mp4" poster="poster.png" />
      <Media
        variant="imageGallery"
        images={[
          { src: 'img1.png', alt: 'Image 1' },
          { src: 'img2.png', alt: 'Image 2' },
        ]}
      />
      <Media
        variant="carousel"
        items={[
          { type: 'image', src: 'img1.png', alt: 'Image 1' },
          { type: 'video', src: 'video1.mp4', alt: 'Video 1' },
        ]}
      />
    </>
  ),
}; 