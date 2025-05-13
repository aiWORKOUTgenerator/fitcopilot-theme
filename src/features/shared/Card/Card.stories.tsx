import { Meta, Story } from '@storybook/react';
import React from 'react';
import Media from '../Media/Media';
import Card from './Card';

export default {
    title: 'Components/Card',
    component: Card,
    argTypes: {
        theme: {
            control: 'select',
            options: ['default', 'gym', 'sports', 'wellness']
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg']
        },
        layout: {
            control: 'select',
            options: ['vertical', 'horizontal']
        }
    }
} as Meta;

// Base stories
export const Content: Story = (args) => (
    <Card
        variant="content"
        title="Content Card"
        description="This is a content card example"
        {...args}
    />
);

export const Profile: Story = (args) => (
    <Card
        variant="profile"
        name="John Doe"
        bio="Fitness enthusiast"
        avatarUrl="https://example.com/avatar.jpg"
        {...args}
    />
);

export const Workout: Story = (args) => (
    <Card
        variant="workout"
        workoutName="Morning Workout"
        difficulty="intermediate"
        duration={30}
        isBookmarked={false}
        onBookmark={(id, isBookmarked) => { /* Log bookmark actions */ }}
        {...args}
    />
);

export const Program: Story = (args) => (
    <Card
        variant="program"
        programName="Fitness Program"
        level="Advanced"
        summary="12-week fitness program"
        {...args}
    />
);

// Theme variants
export const ContentGym: Story = (args) => (
    <Card
        variant="content"
        title="Gym Theme"
        description="This is a card with the gym theme"
        theme="gym"
        {...args}
    />
);

export const ContentSports: Story = (args) => (
    <Card
        variant="content"
        title="Sports Theme"
        description="This is a card with the sports theme"
        theme="sports"
        {...args}
    />
);

export const ContentWellness: Story = (args) => (
    <Card
        variant="content"
        title="Wellness Theme"
        description="This is a card with the wellness theme"
        theme="wellness"
        {...args}
    />
);

// Size variants
export const ContentSmall: Story = (args) => (
    <Card
        variant="content"
        title="Small Card"
        description="This is a small card"
        size="sm"
        {...args}
    />
);

export const ContentLarge: Story = (args) => (
    <Card
        variant="content"
        title="Large Card"
        description="This is a large card"
        size="lg"
        {...args}
    />
);

// Layout variant
export const ContentHorizontal: Story = (args) => (
    <Card
        variant="content"
        title="Horizontal Layout"
        description="This is a card with horizontal layout"
        layout="horizontal"
        {...args}
    />
);

// Loading state
export const ContentLoading: Story = (args) => (
    <Card
        variant="content"
        title="Loading Content"
        description="This card is in a loading state"
        isLoading={true}
        {...args}
    />
);

// Error state
export const ContentError: Story = (args) => (
    <Card
        variant="content"
        title="Error Content"
        description="This card has an error"
        error="Something went wrong"
        {...args}
    />
);

// Media examples
export const ContentWithImage: Story = (args) => (
    <Card
        variant="content"
        title="Image Card"
        description="This card contains an image"
        media={
            <Media
                variant="image"
                src="https://example.com/image.jpg"
                alt="Example Image"
            />
        }
        {...args}
    />
);

export const ContentWithVideo: Story = (args) => (
    <Card
        variant="content"
        title="Video Card"
        description="This card contains a video"
        media={
            <Media
                variant="video"
                src="https://example.com/video.mp4"
                poster="https://example.com/poster.jpg"
                controls
            />
        }
        {...args}
    />
);

export const ContentWithGallery: Story = (args) => (
    <Card
        variant="content"
        title="Gallery Card"
        description="This card contains an image gallery"
        media={
            <Media
                variant="imageGallery"
                images={[
                    { src: 'https://example.com/image1.jpg', alt: 'Image 1' },
                    { src: 'https://example.com/image2.jpg', alt: 'Image 2' }
                ]}
            />
        }
        {...args}
    />
); 