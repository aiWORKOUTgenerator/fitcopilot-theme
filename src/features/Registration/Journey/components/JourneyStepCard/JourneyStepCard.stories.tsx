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

// Import the Storybook-specific component and its dependencies
import { SophisticatedJourneyWrapper } from '../../../../../../.storybook/decorators/JourneyWrapper';
import { JourneyProvider } from '../JourneyContext';
import { JourneyStepData, JourneyStepFeature } from '../JourneyStepCard';
import StorybookJourneyStepCard from './StorybookJourneyStepCard';

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
    description: "Complete health questionnaire for safe workout recommendations.",
    icon: <FileText size={24} className="text-violet-200" />
  },
  {
    title: "Injury Prevention",
    description: "Identify potential risk factors and modify exercises accordingly.",
    icon: <Lightbulb size={24} className="text-violet-200" />
  },
  {
    title: "Medical Clearance",
    description: "Ensure you're cleared for physical activity based on health status.",
    icon: <Microscope size={24} className="text-violet-200" />
  },
  {
    title: "Adaptive Programming",
    description: "Modify workouts based on physical limitations or conditions.",
    icon: <Layers size={24} className="text-violet-200" />
  }
];

const mockAnalyticsFeatures: JourneyStepFeature[] = [
  {
    title: "Progress Tracking",
    description: "Monitor your fitness journey with comprehensive progress metrics.",
    icon: <TrendingUp size={24} className="text-amber-200" />
  },
  {
    title: "Performance Analytics",
    description: "Analyze workout performance and identify areas for improvement.",
    icon: <BarChart2 size={24} className="text-amber-200" />
  },
  {
    title: "Goal Achievement",
    description: "Track progress toward your specific fitness goals and milestones.",
    icon: <Target size={24} className="text-amber-200" />
  },
  {
    title: "AI Insights",
    description: "Receive personalized insights and recommendations from our AI.",
    icon: <Cpu size={24} className="text-amber-200" />
  }
];

// Sample journey step data using the real component's interface
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

// Wrapper component that provides JourneyContext
const JourneyStepCardWrapper: React.FC<{
  step: JourneyStepData;
  index: number;
  onStepAction?: (index: number) => void;
  initialData?: any;
}> = ({ step, index, onStepAction = () => {}, initialData = {} }) => {
  return (
    <JourneyProvider initialData={initialData}>
      <StorybookJourneyStepCard
        step={step}
        index={index}
        onStepAction={onStepAction}
      />
    </JourneyProvider>
  );
};

// Story configuration with advanced controls
const meta: Meta<typeof StorybookJourneyStepCard> = {
  title: 'Registration/Journey/JourneyStepCard',
  component: StorybookJourneyStepCard,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#111827' },
        { name: 'light', value: '#ffffff' },
        { name: 'gradient', value: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }
      ]
    },
    docs: {
      description: {
        component: `
# JourneyStepCard Component

The real JourneyStepCard component used in the FitCopilot registration journey. This component provides an interactive card interface for each step of the user onboarding process.

## Key Features

- **Real Component**: Uses the actual production component logic with mock dependencies for Storybook
- **Context Integration**: Properly integrated with JourneyContext for state management
- **Dynamic Content**: Renders different content based on step index (Goals, Customization, Medical, Analytics)
- **Sophisticated Styling**: Glass morphism, glow effects, and smooth animations
- **Accessibility**: Full ARIA support and keyboard navigation
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Component Architecture

The component uses:
- **JourneyContext** for state management (expanded steps, completion status)
- **Mock Components** for form content (GoalSelector, CustomizeExperience, etc.)
- **Dynamic Content Rendering** based on step index
- **Custom CSS Classes** for glow effects and animations

## Styling System

Uses Tailwind CSS with custom classes:
- \`lime-glow\`, \`cyan-glow\`, \`violet-glow\`, \`amber-glow\` - Accent-colored hover effects
- \`animate-fade-in-up\`, \`animate-fade-slide-up\` - Entrance animations
- \`step-connector\` - Visual connection between journey steps
- \`journey-step-card\` - Main card container styling

## State Management

The component manages:
- **Expansion State**: Which step is currently expanded
- **Completion Status**: Which steps have been completed
- **Validation State**: Whether the current step's form is valid
- **Registration Data**: User input data across all steps

## Content Rendering

Different content is rendered based on step index:
- **Step 0**: MockGoalSelector component
- **Step 1**: MockCustomizeExperience component  
- **Step 2**: MockCustomizedMedical component
- **Step 3**: MockAnalyticsSelector component
- **Default**: Feature grid with detailed features

## Interactive Controls

Use the controls below to:
- **Change Step Type**: Switch between different journey steps
- **Modify Content**: Update titles, descriptions, and features
- **Test Accent Colors**: Try different color schemes
- **Simulate States**: Test expanded, completed, and validation states
        `
      }
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
        wide: {
          name: 'Wide Screen',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <SophisticatedJourneyWrapper withParticles={true}>
        <Story />
      </SophisticatedJourneyWrapper>
    )
  ],
  argTypes: {
    step: {
      control: 'object',
      description: 'Journey step data object containing title, description, icon, and features',
      table: {
        type: { summary: 'JourneyStepData' },
        defaultValue: { summary: 'sampleSteps[0]' },
      },
    },
    index: {
      control: { 
        type: 'range', 
        min: 0, 
        max: 3, 
        step: 1 
      },
      description: 'Step index in the journey sequence (0-3)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    onStepAction: {
      action: 'step-action',
      description: 'Callback function triggered when step action button is clicked',
      table: {
        type: { summary: '(index: number) => void' },
      },
    },
  },
  args: {
    step: sampleSteps[0],
    index: 0,
  },
};

export default meta;
type Story = StoryObj<typeof StorybookJourneyStepCard>;

// Default story using the real component
export const Default: Story = {
  render: (args) => (
    <JourneyStepCardWrapper
      step={args.step || sampleSteps[0]}
      index={args.index || 0}
      onStepAction={args.onStepAction}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default state of the JourneyStepCard showing the Goals step with real component integration. Use the controls to modify the step properties and see how the component responds.'
      }
    }
  }
};

// Playground story with full controls
export const Playground: Story = {
  render: (args) => (
    <JourneyStepCardWrapper
      step={args.step}
      index={args.index}
      onStepAction={args.onStepAction}
    />
  ),
  args: {
    step: {
      title: "Custom Step Title",
      description: "Customize this description to see how the component adapts to different content lengths and styles.",
      icon: <Target size={40} className="text-gray-900" />,
      delay: 100,
      accentColor: "from-lime-300 to-emerald-400",
      ctaText: "Custom Action",
      nextStep: "next-step",
      detailedFeatures: [
        {
          title: "Custom Feature 1",
          description: "This is a customizable feature description.",
          icon: <Dumbbell size={24} className="text-lime-200" />
        },
        {
          title: "Custom Feature 2", 
          description: "Another feature that you can modify.",
          icon: <Flame size={24} className="text-lime-200" />
        }
      ]
    },
    index: 0,
  },
  argTypes: {
    step: {
      control: 'object',
      description: 'Fully customizable step object - modify any property to see changes',
    },
    index: {
      control: { type: 'range', min: 0, max: 10, step: 1 },
      description: 'Step index - affects animations and step number display',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground for testing different step configurations. Modify the step object in the controls to see how the component handles various content types, lengths, and structures.'
      }
    }
  }
};

// Different journey steps with enhanced controls
export const GoalsStep: Story = {
  render: () => (
    <JourneyStepCardWrapper
      step={sampleSteps[0]}
      index={0}
      onStepAction={(index) => console.log(`Goals step action: ${index}`)}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Goals definition step with lime accent color and strength/fitness features. This step uses the MockGoalSelector component for interactive goal selection.'
      }
    }
  }
};

export const CustomizationStep: Story = {
  render: () => (
    <JourneyStepCardWrapper
      step={sampleSteps[1]}
      index={1}
      onStepAction={(index) => console.log(`Customization step action: ${index}`)}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Experience customization step with cyan accent color and personalization features. Uses MockCustomizeExperience for form-based customization.'
      }
    }
  }
};

export const MedicalStep: Story = {
  render: () => (
    <JourneyStepCardWrapper
      step={sampleSteps[2]}
      index={2}
      onStepAction={(index) => console.log(`Medical step action: ${index}`)}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Medical information step with violet accent color and health assessment features. Integrates MockCustomizedMedical for health questionnaires.'
      }
    }
  }
};

export const AnalyticsStep: Story = {
  render: () => (
    <JourneyStepCardWrapper
      step={sampleSteps[3]}
      index={3}
      onStepAction={(index) => console.log(`Analytics step action: ${index}`)}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress tracking step with amber accent color and analytics features. Uses MockAnalyticsSelector for tracking preferences.'
      }
    }
  }
};

// Complete journey sequence with state management
export const CompleteJourneySequence: Story = {
  render: () => {
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

    const handleStepAction = (stepIndex: number) => {
      if (!completedSteps.includes(stepIndex)) {
        setCompletedSteps(prev => [...prev, stepIndex]);
      }
      console.log(`Step ${stepIndex} completed`);
    };

    return (
      <JourneyProvider initialData={{}}>
        <div className="space-y-6">
          {sampleSteps.map((step, index) => (
            <StorybookJourneyStepCard
              key={index}
              step={step}
              index={index}
              onStepAction={handleStepAction}
            />
          ))}
        </div>
      </JourneyProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete journey sequence showing all steps with shared context and state management. Demonstrates how steps work together in the full registration flow.'
      }
    }
  }
};

// Interactive demo with advanced state management
export const InteractiveDemo: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

    const handleStepAction = (stepIndex: number) => {
      // Mark step as completed
      if (!completedSteps.includes(stepIndex)) {
        setCompletedSteps(prev => [...prev, stepIndex]);
      }
      
      // Move to next step
      if (stepIndex < sampleSteps.length - 1) {
        setCurrentStep(stepIndex + 1);
      }
      
      console.log(`Step ${stepIndex} completed, moving to step ${stepIndex + 1}`);
    };

    const resetDemo = () => {
      setCurrentStep(0);
      setCompletedSteps([]);
    };

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Journey Demo</h2>
          <p className="text-gray-400 mb-6">
            Experience the real component with full state management and interactions
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={resetDemo}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset Journey
            </button>
            <div className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg">
              Current Step: {currentStep + 1} / {sampleSteps.length}
            </div>
            <div className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg">
              Completed: {completedSteps.length} / {sampleSteps.length}
            </div>
          </div>
        </div>
        
        <JourneyProvider initialData={{}}>
          <div className="space-y-6">
            {sampleSteps.map((step, index) => (
              <StorybookJourneyStepCard
                key={index}
                step={step}
                index={index}
                onStepAction={handleStepAction}
              />
            ))}
          </div>
        </JourneyProvider>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showcasing the real component with full state management, step progression, and completion tracking. Includes reset functionality and progress indicators.'
      }
    }
  }
};

// Expanded state demo with form interactions
export const ExpandedStateDemo: Story = {
  render: () => {
    return (
      <JourneyProvider initialData={{}}>
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Expanded State Demo</h2>
            <p className="text-gray-400 mb-6">
              Click on any step to see the expanded content and form components
            </p>
          </div>
          
          <div className="space-y-6">
            {sampleSteps.map((step, index) => (
              <StorybookJourneyStepCard
                key={index}
                step={step}
                index={index}
                onStepAction={(stepIndex: number) => console.log(`Step ${stepIndex} action triggered`)}
              />
            ))}
          </div>
        </div>
      </JourneyProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo showing the expanded state functionality with real form components for each step. Each step renders different mock components based on its purpose (goals, customization, medical, analytics).'
      }
    }
  }
};

// Responsive design showcase
export const ResponsiveShowcase: Story = {
  render: () => (
    <JourneyStepCardWrapper
      step={sampleSteps[0]}
      index={0}
      onStepAction={(index) => console.log(`Responsive test: ${index}`)}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Responsive design showcase. Use the viewport controls in the toolbar to test how the component adapts to different screen sizes. The component uses mobile-first responsive design with Tailwind CSS breakpoints.'
      }
    }
  }
};

// Accessibility testing story
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Accessibility Features</h2>
        <p className="text-gray-400 mb-6">
          Test keyboard navigation, screen reader support, and ARIA attributes
        </p>
        <div className="text-sm text-gray-500 space-y-2">
          <p>• Use Tab/Shift+Tab to navigate between steps</p>
          <p>• Press Enter or Space to expand/collapse steps</p>
          <p>• All interactive elements have proper ARIA labels</p>
          <p>• Screen readers announce state changes</p>
        </div>
      </div>
      
      <JourneyProvider initialData={{}}>
        <div className="space-y-6">
          {sampleSteps.map((step, index) => (
            <StorybookJourneyStepCard
              key={index}
              step={step}
              index={index}
              onStepAction={(stepIndex: number) => console.log(`Accessibility test: Step ${stepIndex}`)}
            />
          ))}
        </div>
      </JourneyProvider>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility demonstration showing keyboard navigation, ARIA attributes, and screen reader support. The component follows WCAG 2.1 AA guidelines for accessibility.'
      }
    }
  }
}; 