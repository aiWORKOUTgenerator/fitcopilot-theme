import type { Meta, StoryObj } from '@storybook/react';
import { Testimonials } from './Testimonials';

/**
 * Testimonials component documentation
 */
const meta: Meta<typeof Testimonials> = {
  title: 'features/Homepage/Testimonials',
  component: Testimonials,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'The Testimonials component displays a carousel of user testimonials with navigation controls. It can use default testimonials or accept custom testimonials via props.',
      },
    },
  },
  argTypes: {
    testimonials: {
      control: 'object',
      description: 'Array of testimonial objects to display. If not provided, default testimonials will be used.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Testimonials>;

/**
 * Default testimonials carousel
 */
export const Default: Story = {
  args: {
    testimonials: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Testimonials section with default testimonials.',
      },
    },
  },
};

/**
 * Custom testimonials
 */
export const CustomTestimonials: Story = {
  args: {
    testimonials: [
      {
        id: 1,
        name: 'James Wilson',
        role: 'Professional Athlete',
        quote: 'The AI-generated workout plans are surprisingly effective. They adapt perfectly to my training cycles and have helped me break through plateaus I\'ve been stuck at for months.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 5
      },
      {
        id: 2,
        name: 'Sophia Rodriguez',
        role: 'Yoga Instructor',
        quote: 'I was looking for new ways to challenge my clients, and this platform has provided endless creative variations that keep my classes fresh and engaging.',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        rating: 5
      },
      {
        id: 3,
        name: 'Tyler Kim',
        role: 'Beginner',
        quote: 'As someone new to fitness, I was intimidated by gym culture. This app gave me the confidence to start with workouts tailored to my level. Six months in and I\'m seeing amazing progress!',
        avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
        rating: 4
      },
      {
        id: 4,
        name: 'Anna Clark',
        role: 'Working Parent',
        quote: 'Finding time to work out with kids and a full-time job seemed impossible. The AI creates efficient 20-minute workouts that fit into my schedule, and I\'m still seeing results.',
        avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
        rating: 5
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Testimonials section with custom testimonials provided via props.',
      },
    },
  },
};
