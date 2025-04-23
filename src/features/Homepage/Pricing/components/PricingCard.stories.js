import { PricingCard } from './PricingCard';
/**
 * PricingCard component documentation
 */
const meta = {
    title: 'features/Homepage/Pricing/components/PricingCard',
    component: PricingCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
        },
        docs: {
            description: {
                component: 'A pricing card component that displays a pricing plan with features, price, and call-to-action button. Can be marked as popular for special styling.',
            },
        },
    },
    argTypes: {
        name: {
            control: 'text',
            description: 'Name of the pricing plan',
        },
        description: {
            control: 'text',
            description: 'Description of the pricing plan',
        },
        price: {
            control: 'text',
            description: 'Price of the plan (use "0" for free plans)',
        },
        period: {
            control: 'text',
            description: 'Billing period (e.g., "month", "year", "forever")',
        },
        features: {
            control: 'object',
            description: 'Array of plan features with included status',
        },
        ctaText: {
            control: 'text',
            description: 'Text for the call-to-action button',
        },
        ctaLink: {
            control: 'text',
            description: 'URL for the call-to-action button',
        },
        popular: {
            control: 'boolean',
            description: 'Whether this is the popular/featured plan',
        },
    },
};
export default meta;
/**
 * Free plan pricing card
 */
export const FreePlan = {
    args: {
        name: 'Starter',
        description: 'Perfect for trying out our AI workout generator',
        price: '0',
        period: 'forever',
        features: [
            { id: 1, text: '3 AI-generated workouts per week', included: true },
            { id: 2, text: 'Basic exercise library', included: true },
            { id: 3, text: 'Progress tracking', included: true },
            { id: 4, text: 'Custom workout plans', included: false },
            { id: 5, text: 'Priority support', included: false },
            { id: 6, text: 'Advanced analytics', included: false }
        ],
        ctaText: 'Get Started',
        ctaLink: '#start',
        popular: false
    },
    parameters: {
        docs: {
            description: {
                story: 'Free plan pricing card with basic features.',
            },
        },
    },
};
/**
 * Popular pro plan pricing card
 */
export const ProPlan = {
    args: {
        name: 'Pro',
        description: 'For serious fitness enthusiasts who want the best results',
        price: '19',
        period: 'month',
        features: [
            { id: 1, text: 'Unlimited AI-generated workouts', included: true },
            { id: 2, text: 'Full exercise library', included: true },
            { id: 3, text: 'Advanced progress tracking', included: true },
            { id: 4, text: 'Custom workout plans', included: true },
            { id: 5, text: 'Priority support', included: true },
            { id: 6, text: 'Advanced analytics', included: true }
        ],
        ctaText: 'Start Free Trial',
        ctaLink: '#trial',
        popular: true
    },
    parameters: {
        docs: {
            description: {
                story: 'Popular pro plan pricing card with all features included.',
            },
        },
    },
};
/**
 * Annual plan pricing card
 */
export const AnnualPlan = {
    args: {
        name: 'Annual',
        description: 'Save 20% with our annual plan',
        price: '15',
        period: 'month',
        features: [
            { id: 1, text: 'Unlimited AI-generated workouts', included: true },
            { id: 2, text: 'Full exercise library', included: true },
            { id: 3, text: 'Advanced progress tracking', included: true },
            { id: 4, text: 'Custom workout plans', included: true },
            { id: 5, text: 'Priority support', included: true },
            { id: 6, text: 'Advanced analytics', included: true },
            { id: 7, text: '20% savings', included: true }
        ],
        ctaText: 'Choose Annual',
        ctaLink: '#annual',
        popular: false
    },
    parameters: {
        docs: {
            description: {
                story: 'Annual plan pricing card with savings highlighted.',
            },
        },
    },
};
