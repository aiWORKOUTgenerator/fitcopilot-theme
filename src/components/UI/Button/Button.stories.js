import Button from './Button';
const meta = {
    title: 'UI/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline'],
            description: 'The visual style of the button',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'The size of the button',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the button is disabled',
        },
    },
};
export default meta;
export const Primary = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};
export const Secondary = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};
export const Outline = {
    args: {
        variant: 'outline',
        children: 'Outline Button',
    },
};
export const Disabled = {
    args: {
        variant: 'primary',
        children: 'Disabled Button',
        disabled: true,
    },
};
export const Small = {
    args: {
        variant: 'primary',
        size: 'sm',
        children: 'Small Button',
    },
};
export const Large = {
    args: {
        variant: 'primary',
        size: 'lg',
        children: 'Large Button',
    },
};
