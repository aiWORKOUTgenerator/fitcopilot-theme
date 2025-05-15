import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Tooltip from '../Tooltip';

const meta: Meta<typeof Tooltip> = {
    title: 'Components/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
    args: {
        content: 'This is a tooltip',
        children: <button>Hover me</button>,
    },
};

export const WithTitle: Story = {
    args: {
        title: 'Information',
        content: 'This tooltip has a title',
        children: <button>Hover me</button>,
    },
};

export const CustomPosition: Story = {
    args: {
        content: 'This tooltip appears below',
        position: 'bottom',
        children: <button>Hover below</button>,
    },
};

export const WithDelay: Story = {
    args: {
        content: 'This tooltip has a 1 second delay',
        showDelay: 1000,
        hideDelay: 500,
        children: <button>Delayed tooltip</button>,
    },
};
