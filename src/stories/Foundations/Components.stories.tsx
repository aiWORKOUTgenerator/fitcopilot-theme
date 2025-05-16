import type { Meta, StoryObj } from '@storybook/react';
import { FontSample, SpacingTable, ThemeGrid } from './Components';

const meta: Meta = {
  title: 'Foundations/Components',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Utility components used in the design system documentation to display typography, spacing, and layout examples.',
      },
    },
  },
};

export default meta;

/**
 * Typography Examples
 */
export const Typography: StoryObj = {
  render: () => (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.5rem' }}>Typography Examples</h2>
      <FontSample family="Inter" size="3rem" weight="800" sample="Display" />
      <FontSample family="Inter" size="2.25rem" weight="700" sample="Heading 1" />
      <FontSample family="Inter" size="1.75rem" weight="700" sample="Heading 2" />
      <FontSample family="Inter" size="1.5rem" weight="600" sample="Heading 3" />
      <FontSample family="Inter" size="1.25rem" weight="600" sample="Heading 4" />
      <FontSample family="Inter" size="1rem" weight="400" sample="Body text" />
      <FontSample family="Inter" size="0.875rem" weight="400" sample="Small text" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays typography examples using the FontSample component with various font sizes and weights.',
      },
    },
  },
};

/**
 * Spacing Examples
 */
export const Spacing: StoryObj = {
  render: () => (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.5rem' }}>Spacing System</h2>
      <SpacingTable />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual representation of the spacing system using the SpacingTable component.',
      },
    },
  },
};

/**
 * Grid Layout Examples
 */
export const GridLayout: StoryObj = {
  render: () => (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.5rem' }}>Grid Layouts</h2>

      <h3 style={{ marginBottom: '1rem', fontWeight: '600', fontSize: '1.25rem' }}>Two-Column Grid</h3>
      <ThemeGrid columns={2}>
        <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', textAlign: 'center' }}>Column 1</div>
        <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', textAlign: 'center' }}>Column 2</div>
      </ThemeGrid>

      <h3 style={{ marginBottom: '1rem', fontWeight: '600', fontSize: '1.25rem' }}>Three-Column Grid</h3>
      <ThemeGrid columns={3}>
        <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', textAlign: 'center' }}>Column 1</div>
        <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', textAlign: 'center' }}>Column 2</div>
        <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', textAlign: 'center' }}>Column 3</div>
      </ThemeGrid>

      <h3 style={{ marginBottom: '1rem', fontWeight: '600', fontSize: '1.25rem' }}>Four-Column Grid</h3>
      <ThemeGrid columns={4}>
        <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', textAlign: 'center' }}>Column 1</div>
        <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', textAlign: 'center' }}>Column 2</div>
        <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', textAlign: 'center' }}>Column 3</div>
        <div style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', textAlign: 'center' }}>Column 4</div>
      </ThemeGrid>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of grid layouts using the ThemeGrid component with different column configurations.',
      },
    },
  },
}; 