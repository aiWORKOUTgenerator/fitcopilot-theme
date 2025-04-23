import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Page from './Page';
const meta = {
    title: 'Layout/Page',
    component: Page,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'The page title',
        },
        description: {
            control: 'text',
            description: 'The page description',
        },
    },
};
export default meta;
export const Default = {
    args: {
        title: 'Welcome to FitCopilot',
        description: 'Your AI-powered workout companion',
    },
};
export const LongContent = {
    args: {
        title: 'Features',
        description: 'Discover what makes FitCopilot unique',
    },
    render: (args) => (_jsx(Page, { title: args.title, description: args.description, children: _jsxs("div", { className: "space-y-4", children: [_jsx("p", { children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }), _jsx("p", { children: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." }), _jsx("p", { children: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." })] }) })),
};
