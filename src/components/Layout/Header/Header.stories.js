import Header from './Header';
const meta = {
    title: 'Layout/Header',
    component: Header,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        logo: {
            control: 'text',
            description: 'The logo image source',
        },
        navigation: {
            control: 'object',
            description: 'Navigation items array',
        },
    },
};
export default meta;
export const Default = {
    args: {
        logo: '/logo.png',
        navigation: [
            { label: 'Home', href: '/' },
            { label: 'Features', href: '/features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'About', href: '/about' },
        ],
    },
};
export const Minimal = {
    args: {
        logo: '/logo.png',
        navigation: [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
        ],
    },
};
export const WithLogin = {
    args: {
        logo: '/logo.png',
        navigation: [
            { label: 'Home', href: '/' },
            { label: 'Features', href: '/features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'About', href: '/about' },
        ],
        showLogin: true,
    },
};
