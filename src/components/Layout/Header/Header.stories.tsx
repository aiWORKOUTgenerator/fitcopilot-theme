import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

const meta: Meta<typeof Header> = {
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
type Story = StoryObj<typeof Header>;

export const Default: Story = {
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

export const Minimal: Story = {
  args: {
    logo: '/logo.png',
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ],
  },
};

export const WithLogin: Story = {
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