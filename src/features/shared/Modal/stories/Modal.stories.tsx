import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Modal } from '../';
import { ModalSize } from '../types';

const meta: Meta<typeof Modal> = {
  title: 'Shared/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal dialog component for displaying content that requires user attention or interaction.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is visible'
    },
    onClose: {
      action: 'closed',
      description: 'Function called when the modal is closed'
    },
    title: {
      control: 'text',
      description: 'Modal title'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'full'],
      description: 'Size of the modal'
    },
    children: {
      control: 'text',
      description: 'Modal content'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Modal>;

interface ModalExampleProps {
  title: string;
  content: React.ReactNode;
  size?: ModalSize;
}

// We need to use a wrapper component for interactive stories
const ModalExample: React.FC<ModalExampleProps> = ({ title, content, size = 'medium' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={title}
        size={size}
      >
        {content}
      </Modal>
    </>
  );
};

export const Basic: Story = {
  render: () => (
    <ModalExample 
      title="Basic Modal" 
      content={<p>This is a basic modal with simple content.</p>}
      size="medium"
    />
  )
};

export const Large: Story = {
  render: () => (
    <ModalExample 
      title="Large Modal" 
      content={
        <div>
          <p>This is a larger modal with more content.</p>
          <p>It can fit more information and potentially more interactive elements.</p>
          <button>Example Action</button>
        </div>
      }
      size="large"
    />
  )
};

export const WithForm: Story = {
  render: () => (
    <ModalExample 
      title="Form Modal" 
      content={
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="Enter your email" />
          </div>
          <button type="submit">Submit</button>
        </form>
      }
      size="medium"
    />
  )
};

export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div data-theme="personal-training">
        <ModalExample 
          title="Personal Training" 
          content={<p>Modal with Personal Training theme</p>}
          size="medium"
        />
      </div>
      <div data-theme="group-fitness">
        <ModalExample 
          title="Group Fitness" 
          content={<p>Modal with Group Fitness theme</p>}
          size="medium"
        />
      </div>
    </div>
  )
}; 