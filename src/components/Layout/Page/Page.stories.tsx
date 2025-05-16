import type { Meta, StoryObj } from '@storybook/react';
import Page from './Page';

const meta: Meta<typeof Page> = {
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
type Story = StoryObj<typeof Page>;

export const Default: Story = {
  args: {
    title: 'Welcome to FitCopilot',
    description: 'Your AI-powered workout companion',
  },
};

export const LongContent: Story = {
  args: {
    title: 'Features',
    description: 'Discover what makes FitCopilot unique',
  },
  render: (args) => (
    <Page title={args.title} description={args.description}>
      <div className="space-y-4">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      </div>
    </Page>
  ),
}; 