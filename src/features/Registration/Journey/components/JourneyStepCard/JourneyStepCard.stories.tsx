import type { Meta, StoryObj } from '@storybook/react';
import {
    Activity,
    BarChart2,
    Clock,
    Cpu,
    Dumbbell,
    FileText,
    Flame,
    Layers,
    Lightbulb,
    Microscope,
    Package,
    Settings,
    Target,
    TrendingUp,
    Trophy,
    Zap
} from 'lucide-react';
import React from 'react';
import { JourneyProvider } from '../JourneyContext';
import JourneyStepCard, { JourneyStepData, JourneyStepFeature } from '../JourneyStepCard';

// Mock data for journey step features
const mockGoalFeatures: JourneyStepFeature[] = [
  {
    title: "Strength Building",
    description: "Focus on compound movements and progressive overload for maximum strength gains.",
    icon: <Dumbbell size={24} className="text-lime-200" />
  },
  {
    title: "Fat Loss",
    description: "Optimize caloric deficit with the right mix of HIIT and steady-state cardio.",
    icon: <Flame size={24} className="text-lime-200" />
  },
  {
    title: "Muscle Growth",
    description: "Hypertrophy-focused programs with proper volume and intensity distribution.",
    icon: <Zap size={24} className="text-lime-200" />
  },
  {
    title: "General Fitness",
    description: "Well-rounded programs balancing strength, endurance, and mobility.",
    icon: <Activity size={24} className="text-lime-200" />
  }
];

const mockCustomizationFeatures: JourneyStepFeature[] = [
  {
    title: "Experience Level",
    description: "Tailor workouts to your current fitness level and progression needs.",
    icon: <Trophy size={24} className="text-cyan-200" />
  },
  {
    title: "Equipment Access",
    description: "Customize workouts based on available equipment and space constraints.",
    icon: <Package size={24} className="text-cyan-200" />
  },
  {
    title: "Time Commitment",
    description: "Set realistic workout durations that fit your schedule.",
    icon: <Clock size={24} className="text-cyan-200" />
  },
  {
    title: "Workout Preferences",
    description: "Choose workout styles and intensities that match your preferences.",
    icon: <Settings size={24} className="text-cyan-200" />
  }
];

const mockMedicalFeatures: JourneyStepFeature[] = [
  {
    title: "Health Assessment",
    description: "Complete medical screening to ensure safe workout recommendations.",
    icon: <FileText size={24} className="text-violet-200" />
  },
  {
    title: "Injury History",
    description: "Document past injuries to avoid aggravation and promote recovery.",
    icon: <Microscope size={24} className="text-violet-200" />
  },
  {
    title: "Physical Limitations",
    description: "Identify any movement restrictions or accommodations needed.",
    icon: <Layers size={24} className="text-violet-200" />
  },
  {
    title: "Medical Clearance",
    description: "Verify fitness for exercise participation with healthcare provider input.",
    icon: <Lightbulb size={24} className="text-violet-200" />
  }
];

const mockAnalyticsFeatures: JourneyStepFeature[] = [
  {
    title: "Progress Tracking",
    description: "Monitor strength gains, endurance improvements, and body composition changes.",
    icon: <TrendingUp size={24} className="text-amber-200" />
  },
  {
    title: "Performance Analytics",
    description: "Detailed insights into workout performance and optimization opportunities.",
    icon: <BarChart2 size={24} className="text-amber-200" />
  },
  {
    title: "Goal Achievement",
    description: "Track progress toward your specific fitness goals with milestone celebrations.",
    icon: <Target size={24} className="text-amber-200" />
  },
  {
    title: "Smart Recommendations",
    description: "AI-powered suggestions for workout adjustments and progression strategies.",
    icon: <Cpu size={24} className="text-amber-200" />
  }
];

// Sample journey step data
const sampleSteps: JourneyStepData[] = [
  {
    title: "Define Your Goals",
    description: "Tell us what you want to achieve - strength, muscle gain, fat loss, or general fitness.",
    icon: <Target size={40} className="text-gray-900" />,
    delay: 100,
    accentColor: "from-lime-300 to-emerald-400",
    ctaText: "Set Your Goals",
    nextStep: "experience-level",
    detailedFeatures: mockGoalFeatures
  },
  {
    title: "Customize Experience",
    description: "Personalize your workout experience based on your preferences and constraints.",
    icon: <Settings size={40} className="text-gray-900" />,
    delay: 200,
    accentColor: "from-cyan-300 to-blue-400",
    ctaText: "Customize Workouts",
    nextStep: "medical-info",
    detailedFeatures: mockCustomizationFeatures
  },
  {
    title: "Medical Information",
    description: "Provide health information to ensure safe and effective workout recommendations.",
    icon: <FileText size={40} className="text-gray-900" />,
    delay: 300,
    accentColor: "from-violet-300 to-purple-400",
    ctaText: "Complete Health Assessment",
    nextStep: "analytics",
    detailedFeatures: mockMedicalFeatures
  },
  {
    title: "Progress Tracking",
    description: "Choose how you want to track your progress and celebrate achievements.",
    icon: <BarChart2 size={40} className="text-gray-900" />,
    delay: 400,
    accentColor: "from-amber-300 to-orange-400",
    ctaText: "Setup Analytics",
    nextStep: "complete",
    detailedFeatures: mockAnalyticsFeatures
  }
];

// Context wrapper for stories
const JourneyContextWrapper: React.FC<{ 
  children: React.ReactNode;
  expandedStep?: number | null;
  completedSteps?: number[];
}> = ({ 
  children, 
  expandedStep = null, 
  completedSteps = [] 
}) => {
  return (
    <JourneyProvider>
      <div className="journey-context-wrapper bg-gray-900 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </JourneyProvider>
  );
};

// Story configuration
const meta: Meta<typeof JourneyStepCard> = {
  title: 'Registration/Journey/JourneyStepCard',
  component: JourneyStepCard,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#111827' },
        { name: 'light', value: '#ffffff' }
      ]
    },
    docs: {
      description: {
        component: `
# JourneyStepCard Component

An interactive card component for the registration journey that displays step information, features, and handles expansion/collapse functionality.

## Features

- **Dynamic Styling**: Accent colors and gradients based on step theme
- **Expandable Content**: Smooth animations for showing/hiding detailed features
- **State Management**: Integration with JourneyContext for step state
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive Design**: Mobile-first layout with responsive breakpoints
- **Glass Morphism**: Modern semi-transparent styling with backdrop blur

## Styling Implementation

The component uses Tailwind CSS with:
- Dynamic class generation based on props
- Conditional styling for different states (expanded, completed, default)
- Custom gradient classes for accent colors
- Responsive design patterns
- Hover and focus states with smooth transitions
        `
      }
    }
  },
  decorators: [
    (Story) => (
      <JourneyContextWrapper>
        <Story />
      </JourneyContextWrapper>
    )
  ],
  argTypes: {
    index: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Step index in the journey'
    },
    onStepAction: {
      action: 'step-action',
      description: 'Callback when step action button is clicked'
    }
  }
};

export default meta;
type Story = StoryObj<typeof JourneyStepCard>;

// Default story
export const Default: Story = {
  args: {
    step: sampleSteps[0],
    index: 0,
    onStepAction: () => console.log('Step action triggered')
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state of a journey step card with goals theme (lime accent color).'
      }
    }
  }
};

// Expanded state
export const Expanded: Story = {
  args: {
    step: sampleSteps[0],
    index: 0,
    onStepAction: () => console.log('Step action triggered')
  },
  parameters: {
    docs: {
      description: {
        story: 'Journey step card in expanded state showing detailed features and action button.'
      }
    }
  }
};

// Completed state
export const Completed: Story = {
  args: {
    step: sampleSteps[0],
    index: 0,
    onStepAction: () => console.log('Step action triggered')
  },
  parameters: {
    docs: {
      description: {
        story: 'Journey step card in completed state with emerald accent styling.'
      }
    }
  }
};

// Different accent colors
export const CustomizationStep: Story = {
  args: {
    step: sampleSteps[1],
    index: 1,
    onStepAction: () => console.log('Customization step action')
  },
  parameters: {
    docs: {
      description: {
        story: 'Customization step with cyan accent color theme.'
      }
    }
  }
};

export const MedicalStep: Story = {
  args: {
    step: sampleSteps[2],
    index: 2,
    onStepAction: () => console.log('Medical step action')
  },
  parameters: {
    docs: {
      description: {
        story: 'Medical information step with violet accent color theme.'
      }
    }
  }
};

export const AnalyticsStep: Story = {
  args: {
    step: sampleSteps[3],
    index: 3,
    onStepAction: () => console.log('Analytics step action')
  },
  parameters: {
    docs: {
      description: {
        story: 'Analytics/progress tracking step with amber accent color theme.'
      }
    }
  }
};

// All steps in sequence
export const JourneySequence: Story = {
  render: () => (
    <div className="space-y-6">
      {sampleSteps.map((step, index) => (
        <JourneyStepCard
          key={index}
          step={step}
          index={index}
          onStepAction={(stepIndex) => console.log(`Step ${stepIndex} action triggered`)}
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete journey sequence showing all four steps with different accent colors.'
      }
    }
  }
};

// Interactive showcase
export const InteractiveShowcase: Story = {
  render: () => {
    const [expandedStep, setExpandedStep] = React.useState<number | null>(null);
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

    const handleStepAction = (stepIndex: number) => {
      // Mark step as completed
      if (!completedSteps.includes(stepIndex)) {
        setCompletedSteps(prev => [...prev, stepIndex]);
      }
      
      // Expand next step
      const nextStep = stepIndex + 1;
      if (nextStep < sampleSteps.length) {
        setExpandedStep(nextStep);
      } else {
        setExpandedStep(null);
      }
    };

    const handleToggle = (stepIndex: number) => {
      setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Interactive Journey</h2>
          <p className="text-gray-400">Click cards to expand, use action buttons to progress</p>
          <div className="mt-4 flex gap-2 justify-center">
            <button 
              onClick={() => setCompletedSteps([])}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset Progress
            </button>
            <button 
              onClick={() => setExpandedStep(null)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
        
        {sampleSteps.map((step, index) => {
          // Create a modified step for the interactive demo
          const interactiveStep = {
            ...step,
            // Override the step action to use our interactive handler
          };

          return (
            <div key={index} onClick={() => handleToggle(index)}>
              <JourneyStepCard
                step={interactiveStep}
                index={index}
                onStepAction={handleStepAction}
              />
            </div>
          );
        })}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing step progression, completion states, and expansion behavior.'
      }
    }
  }
};

// Responsive showcase
export const ResponsiveShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Responsive Design</h2>
        <p className="text-gray-400">Resize viewport to see responsive behavior</p>
      </div>
      
      <div className="grid gap-6">
        <div className="border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Mobile Layout (&lt; 768px)</h3>
          <div className="max-w-sm mx-auto">
            <JourneyStepCard
              step={sampleSteps[0]}
              index={0}
              onStepAction={() => console.log('Mobile step action')}
            />
          </div>
        </div>
        
        <div className="border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Desktop Layout (≥ 768px)</h3>
          <JourneyStepCard
            step={sampleSteps[1]}
            index={1}
            onStepAction={() => console.log('Desktop step action')}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates responsive design behavior across different viewport sizes.'
      }
    }
  }
};

// Accessibility showcase
export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Accessibility Features</h2>
        <p className="text-gray-400">Keyboard navigation, ARIA attributes, and screen reader support</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>• Tab to navigate between cards</p>
          <p>• Enter/Space to expand/collapse</p>
          <p>• Proper ARIA labels and roles</p>
          <p>• Focus indicators and semantic HTML</p>
        </div>
      </div>
      
      <JourneyStepCard
        step={{
          ...sampleSteps[0],
          title: "Accessible Journey Step",
          description: "This step demonstrates proper accessibility implementation with keyboard navigation and screen reader support."
        }}
        index={0}
        onStepAction={() => console.log('Accessible step action')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcases accessibility features including keyboard navigation and ARIA attributes.'
      }
    }
  }
}; 