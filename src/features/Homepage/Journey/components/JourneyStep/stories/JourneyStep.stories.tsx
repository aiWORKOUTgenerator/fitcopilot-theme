import type { Meta, StoryObj } from '@storybook/react';
import { BookOpen, Dumbbell, Medal, Target } from 'lucide-react';
import React, { useState } from 'react';
import { DetailedFeature, JourneyStepProps, JourneyStep as JourneyStepType } from '../../../types';
import { JourneyStep } from '../../../components';
import { JourneyFeatureCard } from '../../../components';

const meta: Meta<typeof JourneyStep> = {
  title: 'Features/Homepage/Journey/components/JourneyStep',
  component: JourneyStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component that displays a single step in the fitness journey process, with expandable details.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    step: {
      control: 'object',
      description: 'The journey step data'
    },
    index: {
      control: 'number',
      description: 'Zero-based index of the step in the journey sequence'
    },
    isExpanded: {
      control: 'boolean',
      description: 'Whether the step is expanded to show detailed features'
    },
    onToggle: {
      action: 'toggled',
      description: 'Function to call when the step is clicked'
    },
    isLast: {
      control: 'boolean',
      description: 'Whether this is the last step in the journey'
    },
    variant: {
      control: 'select',
      options: ['default', 'gym', 'sports', 'wellness', 'modern'],
      description: 'Visual theme variant'
    }
  }
};

export default meta;
type Story = StoryObj<typeof JourneyStep>;

// Mock data for the stories
const detailedFeatures: DetailedFeature[] = [
  {
    title: 'Personalized Assessment',
    description: 'Complete a comprehensive fitness assessment to determine your starting point',
    icon: <Target className="text-lime-400" size={24} />
  },
  {
    title: 'Goal Setting',
    description: 'Work with a coach to set realistic and achievable fitness goals',
    icon: <Medal className="text-lime-400" size={24} />
  },
  {
    title: 'Program Design',
    description: 'Receive a custom workout program tailored to your specific needs',
    icon: <Dumbbell className="text-lime-400" size={24} />
  }
];

const mockStep: JourneyStepType = {
  id: 1,
  title: 'Initial Assessment',
  description: 'Start with a comprehensive assessment to determine your fitness level and goals',
  number: 1,
  icon: <BookOpen className="text-white" size={24} />,
  accentColor: 'var(--color-lime-400)',
  ctaText: 'Schedule Assessment',
  detailedFeatures
};

// Wrapper to manage expanded state
interface JourneyStepWrapperProps extends Partial<JourneyStepProps> {
  isExpanded?: boolean;
}

const JourneyStepWrapper: React.FC<JourneyStepWrapperProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded || false);
  
  return (
    <JourneyStep 
      step={props.step || mockStep}
      index={props.index || 0}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      isLast={props.isLast || false}
      variant={props.variant || 'default'}
    />
  );
};

export const Default: Story = {
  render: () => (
    <JourneyStepWrapper
      step={mockStep}
      index={0}
      isLast={false}
      variant="default"
    />
  )
};

export const Expanded: Story = {
  render: () => (
    <JourneyStepWrapper
      step={mockStep}
      index={0}
      isExpanded={true}
      isLast={false}
      variant="default"
    />
  )
};

export const LastStep: Story = {
  render: () => (
    <JourneyStepWrapper
      step={{
        ...mockStep,
        title: 'Ongoing Support',
        description: 'Continue your fitness journey with ongoing coaching and support',
        number: 4
      }}
      index={3}
      isLast={true}
      variant="default"
    />
  )
};

export const GymVariant: Story = {
  render: () => (
    <JourneyStepWrapper
      step={mockStep}
      index={0}
      isLast={false}
      variant="gym"
    />
  )
};

export const SportsVariant: Story = {
  render: () => (
    <JourneyStepWrapper
      step={{
        ...mockStep,
        title: 'Sports Performance',
        description: 'Enhance your athletic performance with specialized training',
        number: 2
      }}
      index={1}
      isLast={false}
      variant="sports"
    />
  )
};

export const WellnessVariant: Story = {
  render: () => (
    <JourneyStepWrapper
      step={{
        ...mockStep,
        title: 'Wellness Assessment',
        description: 'Evaluate your overall wellness and create a holistic plan',
        number: 3
      }}
      index={2}
      isLast={false}
      variant="wellness"
    />
  )
};

export const StepSequence: Story = {
  render: () => (
    <div className="space-y-8">
      <JourneyStepWrapper
        step={{
          ...mockStep,
          title: 'Initial Assessment',
          description: 'Start with a comprehensive assessment',
          number: 1
        }}
        index={0}
        isLast={false}
        variant="default"
      />
      <JourneyStepWrapper
        step={{
          ...mockStep,
          title: 'Program Design',
          description: 'Create your personalized fitness program',
          number: 2
        }}
        index={1}
        isLast={false}
        variant="default"
      />
      <JourneyStepWrapper
        step={{
          ...mockStep,
          title: 'Training Implementation',
          description: 'Start your training with expert guidance',
          number: 3
        }}
        index={2}
        isLast={false}
        variant="default"
      />
      <JourneyStepWrapper
        step={{
          ...mockStep,
          title: 'Progress Tracking',
          description: 'Track your progress and adjust as needed',
          number: 4
        }}
        index={3}
        isLast={true}
        variant="default"
      />
    </div>
  )
};

export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3>Default Theme</h3>
        <JourneyStepWrapper
          step={mockStep}
          index={0}
          isLast={false}
          variant="default"
        />
      </div>
      
      <div data-theme="gym">
        <h3>Gym Theme</h3>
        <JourneyStepWrapper
          step={mockStep}
          index={0}
          isLast={false}
          variant="gym"
        />
      </div>
      
      <div data-theme="sports">
        <h3>Sports Theme</h3>
        <JourneyStepWrapper
          step={mockStep}
          index={0}
          isLast={false}
          variant="sports"
        />
      </div>
      
      <div data-theme="wellness">
        <h3>Wellness Theme</h3>
        <JourneyStepWrapper
          step={mockStep}
          index={0}
          isLast={false}
          variant="wellness"
        />
      </div>
    </div>
  )
};

export const ExactJourneyMatch: Story = {
  render: () => (
    <div className="space-y-8">
      <JourneyStepWrapper
        step={{
          ...mockStep,
          title: 'Initial Assessment',
          description: 'Start with a comprehensive assessment',
          number: 1
        }}
        index={0}
        isExpanded={true}
        isLast={false}
        variant="default"
      />
    </div>
  )
}; 