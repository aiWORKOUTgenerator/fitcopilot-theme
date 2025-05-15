import type { Meta, StoryObj } from '@storybook/react';
import GlobalBackground from '../../../components/shared/GlobalBackground';
import { Testimonials } from './Testimonials';

/**
 * Testimonials component documentation
 */
const meta: Meta<typeof Testimonials> = {
  title: 'Features/Homepage/Testimonials',
  component: Testimonials,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
        <div className="relative min-h-screen">
            <GlobalBackground variant="default" />
            <Story />
        </div>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'gym', 'sports', 'wellness', 'modern', 'classic', 'minimalist'],
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

// Sample testimonials data
const sampleTestimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Marathon Runner',
    quote: 'This AI workout generator transformed my training routine. I\'ve seen more progress in 3 months than in my previous year of self-guided workouts.',
    rating: 5
  },
  {
    id: 2,
    name: 'Mike Reynolds',
    role: 'Busy Professional',
    quote: 'With my hectic schedule, I never had time to plan effective workouts. Now I get personalized routines that fit perfectly into my day.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Chen',
    role: 'Fitness Enthusiast',
    quote: 'The variety keeps me engaged and motivated. I\'ve discovered exercises I never would have tried on my own, and my results speak for themselves.',
    rating: 4
  }
];

export const GymTheme: Story = {
  args: {
    testimonials: sampleTestimonials,
    variant: 'gym',
  },
  decorators: [
    (Story) => (
        <div className="relative min-h-screen">
            <GlobalBackground variant="gym" />
            <Story />
        </div>
    ),
  ],
};

export const SportsTheme: Story = {
  args: {
    testimonials: sampleTestimonials,
    variant: 'sports',
  },
  decorators: [
    (Story) => (
        <div className="relative min-h-screen">
            <GlobalBackground variant="sports" />
            <Story />
        </div>
    ),
  ],
};

export const WellnessTheme: Story = {
  args: {
    testimonials: sampleTestimonials,
    variant: 'wellness',
  },
  decorators: [
    (Story) => (
        <div className="relative min-h-screen">
            <GlobalBackground variant="wellness" />
            <Story />
        </div>
    ),
  ],
};
