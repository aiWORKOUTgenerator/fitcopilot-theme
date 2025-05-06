import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialCard } from './TestimonialCard';

/**
 * TestimonialCard component documentation
 */
const meta: Meta<typeof TestimonialCard> = {
  title: 'features/Homepage/Testimonials/components/TestimonialCard',
  component: TestimonialCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'Testimonial card component used to display user reviews and feedback in the testimonials section.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Name of the person giving the testimonial',
    },
    role: {
      control: 'text',
      description: 'Role or title of the person giving the testimonial',
    },
    quote: {
      control: 'text',
      description: 'The testimonial text itself',
    },
    avatar: {
      control: 'text',
      description: 'URL to the avatar image of the person. If not provided, an initial-based avatar will be generated.',
    },
    rating: {
      control: { type: 'range', min: 1, max: 5, step: 1 },
      description: 'Rating out of 5 stars',
    },
    variant: {
      control: 'select',
      options: ['default', 'gym', 'sports', 'wellness', 'modern', 'classic', 'minimalist'],
      description: 'Theme variant to use for styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialCard>;

/**
 * Testimonial with avatar image
 */
export const WithAvatar: Story = {
  args: {
    name: 'Sarah Johnson',
    role: 'Fitness Enthusiast',
    quote: 'This app completely transformed my workout routine. The AI recommendations are spot-on and I have seen more progress in 2 months than I did in a year on my own.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'Testimonial card with an avatar image of the person giving the feedback.',
      },
    },
  },
};

/**
 * Testimonial with generated avatar
 */
export const WithGeneratedAvatar: Story = {
  args: {
    name: 'Michael Torres',
    role: 'CrossFit Coach',
    quote: 'As a fitness professional, I was skeptical about AI workout plans. But this platform impressed me with its attention to form, progressive overload principles, and personalization options.',
    avatar: undefined,
    rating: 5,
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'Testimonial card with a generated avatar based on the first initial of the person\'s name.',
      },
    },
  },
};

/**
 * Testimonial with lower rating
 */
export const LowerRating: Story = {
  args: {
    name: 'Alex Chen',
    role: 'Beginner Gym-Goer',
    quote: 'Good app for beginners, but I wish there were more video demonstrations for some of the exercises. Still, it has helped me establish a consistent routine.',
    avatar: undefined,
    rating: 3,
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'Testimonial card with a 3-star rating, showing how the component handles lower ratings.',
      },
    },
  },
};

/**
 * Gym Theme Variant
 */
export const GymVariant: Story = {
  args: {
    name: 'Chris Hemsworth',
    role: 'Fitness Trainer',
    quote: 'The workout plans are intense but effective. Perfect for those looking to build serious strength and muscle mass.',
    avatar: undefined,
    rating: 5,
    variant: 'gym'
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', background: 'var(--color-gray-900)' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Testimonial card with the gym theme variant applied.',
      },
    },
  },
};

/**
 * Sports Theme Variant
 */
export const SportsVariant: Story = {
  args: {
    name: 'Megan Rapinoe',
    role: 'Professional Athlete',
    quote: 'I use this app to supplement my regular training. The sports-specific workouts help me target areas I need to improve for better performance.',
    avatar: undefined,
    rating: 5,
    variant: 'sports'
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', background: 'var(--color-gray-900)' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Testimonial card with the sports theme variant applied.',
      },
    },
  },
};
