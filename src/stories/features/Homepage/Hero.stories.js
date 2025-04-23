var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';
import { Hero } from '../../../features/Homepage/Hero';
/**
 * The Hero component is the main banner section at the top of the homepage.
 * It displays the main value proposition, call-to-action buttons, and visual elements
 * to attract users to the FitCopilot application.
 */
const meta = {
    title: 'Features/Homepage/Hero',
    component: Hero,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'The main hero section for the FitCopilot homepage, featuring the primary call-to-action and value proposition.',
            },
        },
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/example/fitcopilot?node-id=1234-5678',
        },
        a11y: {
            config: {
                rules: [
                    { id: 'color-contrast', enabled: true },
                    { id: 'heading-order', enabled: true },
                ],
            },
        },
    },
    argTypes: {
        registrationLink: {
            description: 'URL for the registration button',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'https://builder.fitcopilot.ai/register' },
            },
        },
        loginLink: {
            description: 'URL for the login button',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'https://builder.fitcopilot.ai/login' },
            },
        },
        logoUrl: {
            description: 'URL for the logo image',
            control: 'text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '/assets/images/logo.png' },
            },
        },
    },
};
export default meta;
/**
 * The default state of the Hero component with all required props
 */
export const Default = {
    args: {
        registrationLink: 'https://builder.fitcopilot.ai/register',
        loginLink: 'https://builder.fitcopilot.ai/login',
        logoUrl: '/assets/images/logo.png',
    },
    parameters: {
        docs: {
            description: {
                story: 'The default state of the Hero component showing all required elements.',
            },
        },
    },
};
/**
 * Mobile responsive view of the Hero component
 */
export const Mobile = {
    args: Object.assign({}, Default.args),
    parameters: {
        viewport: {
            defaultViewport: 'mobile',
        },
        docs: {
            description: {
                story: 'The Hero component displayed on mobile devices with responsive layout adjustments.',
            },
        },
    },
};
/**
 * Demonstrates the component with a focus state on the primary CTA button
 */
export const FocusedCTA = {
    args: Object.assign({}, Default.args),
    play: (_a) => __awaiter(void 0, [_a], void 0, function* ({ canvasElement }) {
        const canvas = within(canvasElement);
        // Find the main CTA button
        const ctaButton = canvas.getByRole('link', { name: /get started/i });
        // Focus the button
        yield userEvent.tab();
        // Check that the button receives focus
        yield expect(ctaButton).toHaveFocus();
    }),
    parameters: {
        docs: {
            description: {
                story: 'This story demonstrates keyboard navigation to the primary CTA button, showing the focus state for accessibility.',
            },
        },
    },
};
export const CustomLinks = {
    args: {
        registrationLink: '/custom-register',
        loginLink: '/custom-login',
        logoUrl: 'https://placehold.co/200x40/CCFF00/000000?text=FitCopilot',
    },
};
export const WithoutLogo = {
    args: {
        registrationLink: 'https://builder.fitcopilot.ai/register',
        loginLink: 'https://builder.fitcopilot.ai/login',
        logoUrl: undefined,
    },
};
