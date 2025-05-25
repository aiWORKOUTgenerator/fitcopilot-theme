import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card } from '../components';
import { CardProps } from '../types';

const meta: Meta<typeof Card> = {
  title: 'Shared/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component used throughout the FitCopilot application to display content in a contained, styled box.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['content', 'profile', 'workout', 'program'],
      description: 'Type of card to display'
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names'
    },
    title: {
      control: 'text',
      description: 'Title for content cards'
    },
    name: {
      control: 'text',
      description: 'Name for profile cards'
    },
    workoutName: {
      control: 'text',
      description: 'Workout name for workout cards'
    },
    programName: {
      control: 'text',
      description: 'Program name for program cards'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Card>;

export const ContentCard: Story = {
  args: {
    variant: 'content',
    title: 'Getting Started with FitCopilot',
    description: 'Learn how to use FitCopilot to achieve your fitness goals',
    className: 'demo-card'
  } as CardProps
};

export const ProfileCard: Story = {
  args: {
    variant: 'profile',
    name: 'Jane Smith',
    bio: 'Fitness enthusiast and certified personal trainer',
    avatarUrl: 'https://via.placeholder.com/150'
  } as CardProps
};

export const WorkoutCard: Story = {
  args: {
    variant: 'workout',
    workoutName: 'Full Body HIIT',
    difficulty: 'intermediate',
    duration: 45,
    isBookmarked: false
  } as CardProps
};

export const ThemeVariants: Story = {
  render: () => React.createElement(
    'div',
    { 
      className: "story-theme-grid", 
      style: { display: 'flex', gap: '20px' } 
    },
    [
      React.createElement(
        'div',
        { 'data-theme': "personal-training", key: "personal-training" },
        React.createElement(Card, {
          variant: "content",
          title: "Personal Training",
          description: "One-on-one coaching tailored to your needs"
        })
      ),
      React.createElement(
        'div',
        { 'data-theme': "group-fitness", key: "group-fitness" },
        React.createElement(Card, {
          variant: "content",
          title: "Group Fitness",
          description: "Join our community workout sessions"
        })
      )
    ]
  )
}; 