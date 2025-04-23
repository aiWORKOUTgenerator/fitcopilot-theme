import { TestimonialCard } from './TestimonialCard';
/**
 * TestimonialCard component documentation
 */
const meta = {
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
    },
};
export default meta;
/**
 * Testimonial with avatar image
 */
export const WithAvatar = {
    args: {
        name: 'Sarah Johnson',
        role: 'Fitness Enthusiast',
        quote: 'This app completely transformed my workout routine. The AI recommendations are spot-on and I have seen more progress in 2 months than I did in a year on my own.',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 5
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
export const WithGeneratedAvatar = {
    args: {
        name: 'Michael Torres',
        role: 'CrossFit Coach',
        quote: 'As a fitness professional, I was skeptical about AI workout plans. But this platform impressed me with its attention to form, progressive overload principles, and personalization options.',
        avatar: undefined,
        rating: 5
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
export const LowerRating = {
    args: {
        name: 'Alex Chen',
        role: 'Beginner Gym-Goer',
        quote: 'Good app for beginners, but I wish there were more video demonstrations for some of the exercises. Still, it has helped me establish a consistent routine.',
        avatar: undefined,
        rating: 3
    },
    parameters: {
        docs: {
            description: {
                story: 'Testimonial card with a 3-star rating, showing how the component handles lower ratings.',
            },
        },
    },
};
