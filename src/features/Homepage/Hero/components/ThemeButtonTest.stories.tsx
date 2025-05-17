import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ThemeButtonTest } from './ThemeButtonTest';

/**
 * ThemeButtonTest component documentation
 */
const meta: Meta<typeof ThemeButtonTest> = {
  title: 'features/Homepage/Hero/ThemeTest',
  component: ThemeButtonTest,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Theme testing component that displays buttons with different variants and sizes across theme variants.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeButtonTest>;

/**
 * Default theme
 */
export const Default: Story = {};

/**
 * Gym theme
 */
export const Gym: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Buttons in the Gym theme variant with purple/violet color palette.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div data-theme="gym">
        <Story />
      </div>
    ),
  ],
};

/**
 * Sports theme
 */
export const Sports: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Buttons in the Sports theme variant with blue/cyan color palette.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div data-theme="sports">
        <Story />
      </div>
    ),
  ],
};

/**
 * Wellness theme
 */
export const Wellness: Story = {
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: 'Buttons in the Wellness theme variant with teal/green color palette.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div data-theme="wellness">
        <Story />
      </div>
    ),
  ],
}; 