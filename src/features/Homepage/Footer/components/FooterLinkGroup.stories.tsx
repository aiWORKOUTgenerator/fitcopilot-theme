import type { Meta, StoryObj } from '@storybook/react';
import { FooterLinkGroup } from './FooterLinkGroup';

/**
 * FooterLinkGroup component documentation
 */
const meta: Meta<typeof FooterLinkGroup> = {
  title: 'features/Homepage/Footer/components/FooterLinkGroup',
  component: FooterLinkGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'A component that displays a group of links in the footer, with a title and a list of clickable links.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the link group',
    },
    links: {
      control: 'object',
      description: 'Array of link objects with id, title, and url properties',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FooterLinkGroup>;

/**
 * Product links group
 */
export const ProductLinks: Story = {
  args: {
    title: 'Product',
    links: [
      { id: 101, title: 'Features', url: '#features' },
      { id: 102, title: 'How It Works', url: '#how-it-works' },
      { id: 103, title: 'Pricing', url: '#pricing' },
      { id: 104, title: 'FAQs', url: '#faqs' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'A footer link group displaying product-related navigation links.',
      },
    },
  },
};

/**
 * Resources link group
 */
export const ResourcesLinks: Story = {
  args: {
    title: 'Resources',
    links: [
      { id: 201, title: 'Blog', url: '/blog' },
      { id: 202, title: 'Documentation', url: '/docs' },
      { id: 203, title: 'Guides', url: '/guides' },
      { id: 204, title: 'Support', url: '/support' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'A footer link group displaying resource-related navigation links.',
      },
    },
  },
};

/**
 * Company information links
 */
export const CompanyLinks: Story = {
  args: {
    title: 'Company',
    links: [
      { id: 301, title: 'About Us', url: '/about' },
      { id: 302, title: 'Careers', url: '/careers' },
      { id: 303, title: 'Privacy Policy', url: '/privacy' },
      { id: 304, title: 'Terms of Service', url: '/terms' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'A footer link group displaying company-related navigation links.',
      },
    },
  },
};
