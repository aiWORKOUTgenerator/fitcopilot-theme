import {
  Activity,
  BarChart2,
  Calendar,
  Clock,
  Cpu,
  Dumbbell,
  FileText,
  Flame,
  Layers,
  Lightbulb,
  Microscope,
  Package,
  PieChart,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { Section } from '../../../components/shared';
import { JourneyCTA, JourneyStep, SectionHeader } from './components';
import './journey-connector-fix.scss';
import './journey-utility-classes.scss';
import './Journey.scss';
import './text-center-fix.scss';
import {
  JourneyProps,
  VariantKey,
  isVariant
} from './types';

/**
 * Journey component - Shows the user journey/process flow with expandable steps
 */
export const Journey: React.FC<JourneyProps> = (props) => {
  const { journey = [], variant = 'default' } = props;
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Define detailed journey steps
  const journeySteps = journey.length > 0 ? journey.map(step => ({
    id: step.id,
    title: step.title,
    description: step.description,
    number: step.number,
    // Default values for the new properties if not provided from props
    icon: getIconForStep(step.number),
    delay: step.number * 100,
    accentColor: getAccentColorForStep(step.number, variant),
    ctaText: getCTATextForStep(step.number),
    detailedFeatures: getDetailedFeaturesForStep(step.number, variant)
  })) : [
    {
      id: 1,
      number: 1,
      title: "Define Your Goals",
      description: "Tell us what you want to achieve - strength, muscle gain, fat loss, or general fitness.",
      icon: <Target size={40} className="text-gray-900" />,
      delay: 100,
      accentColor: "from-lime-300 to-emerald-400",
      ctaText: "Set Your Goals",
      detailedFeatures: [
        {
          title: "Strength Building",
          description: "Focus on compound movements and progressive overload for maximum strength gains.",
          icon: <Dumbbell size={24} className={getIconColorClass(variant, 'lime')} />
        },
        {
          title: "Fat Loss",
          description: "Optimize caloric deficit with the right mix of HIIT and steady-state cardio.",
          icon: <Flame size={24} className={getIconColorClass(variant, 'lime')} />
        },
        {
          title: "Muscle Growth",
          description: "Hypertrophy-focused programs with proper volume and intensity distribution.",
          icon: <Zap size={24} className={getIconColorClass(variant, 'lime')} />
        },
        {
          title: "General Fitness",
          description: "Well-rounded programs balancing strength, endurance, and mobility.",
          icon: <Activity size={24} className={getIconColorClass(variant, 'lime')} />
        }
      ]
    },
    {
      id: 2,
      number: 2,
      title: "Customize Your Experience",
      description: "Specify your experience level, available equipment, and time constraints.",
      icon: <Settings size={40} className="text-gray-900" />,
      delay: 200,
      accentColor: "from-cyan-300 to-blue-400",
      ctaText: "Personalize",
      detailedFeatures: [
        {
          title: "Equipment Selection",
          description: "From minimal home setups to full gym access - we adapt to what you have.",
          icon: <Dumbbell size={24} className={getIconColorClass(variant, 'cyan')} />
        },
        {
          title: "Time Management",
          description: "Short on time? Our AI optimizes workouts from 15 minutes to 90+ minutes.",
          icon: <Clock size={24} className={getIconColorClass(variant, 'cyan')} />
        },
        {
          title: "Experience Level",
          description: "Whether you're a beginner or advanced, we scale appropriately for your level.",
          icon: <Layers size={24} className={getIconColorClass(variant, 'cyan')} />
        },
        {
          title: "Training Frequency",
          description: "Flexible scheduling from 2-6 days per week based on your availability.",
          icon: <Calendar size={24} className={getIconColorClass(variant, 'cyan')} />
        }
      ]
    },
    {
      id: 3,
      number: 3,
      title: "Receive Your Personalized Plan",
      description: "Our AI generates a tailored workout program specific to your needs and capabilities.",
      icon: <Package size={40} className="text-gray-900" />,
      delay: 300,
      accentColor: "from-violet-300 to-purple-400",
      ctaText: "See Sample Plan",
      detailedFeatures: [
        {
          title: "AI-Powered Design",
          description: "Advanced algorithms create the optimal exercise selection and progression.",
          icon: <Cpu size={24} className={getIconColorClass(variant, 'violet')} />
        },
        {
          title: "Scientific Approach",
          description: "Evidence-based programming following proven training principles.",
          icon: <Microscope size={24} className={getIconColorClass(variant, 'violet')} />
        },
        {
          title: "Adaptive Progression",
          description: "Your plan evolves as you progress, ensuring continued results.",
          icon: <TrendingUp size={24} className={getIconColorClass(variant, 'violet')} />
        },
        {
          title: "Detailed Instructions",
          description: "Clear guidance on execution, tempo, and form for each exercise.",
          icon: <FileText size={24} className={getIconColorClass(variant, 'violet')} />
        }
      ]
    },
    {
      id: 4,
      number: 4,
      title: "Track Your Progress",
      description: "Log your workouts, track your metrics, and watch your progress over time.",
      icon: <BarChart2 size={40} className="text-gray-900" />,
      delay: 400,
      accentColor: "from-amber-300 to-orange-400",
      ctaText: "View Analytics",
      detailedFeatures: [
        {
          title: "Visual Analytics",
          description: "Interactive charts showing your strength progression and volume over time.",
          icon: <PieChart size={24} className={getIconColorClass(variant, 'amber')} />
        },
        {
          title: "Achievement System",
          description: "Unlock badges and achievements as you hit milestones in your fitness journey.",
          icon: <Trophy size={24} className={getIconColorClass(variant, 'amber')} />
        },
        {
          title: "Body Composition",
          description: "Track weight, measurements, and body composition changes visually.",
          icon: <Activity size={24} className={getIconColorClass(variant, 'amber')} />
        },
        {
          title: "Smart Insights",
          description: "AI-powered observations about your performance patterns and suggestions.",
          icon: <Lightbulb size={24} className={getIconColorClass(variant, 'amber')} />
        }
      ]
    }
  ];

  // Get the timeline color class based on the first step's color
  const getTimelineColorClass = (steps: typeof journeySteps): string => {
    if (steps.length === 0) return 'timeline-lime'; // Default

    const firstStepColor = steps[0].accentColor;
    if (firstStepColor?.includes('cyan')) return 'timeline-cyan';
    if (firstStepColor?.includes('violet')) return 'timeline-violet';
    if (firstStepColor?.includes('amber')) return 'timeline-amber';
    return 'timeline-lime'; // Default to lime
  };

  const timelineColorClass = getTimelineColorClass(journeySteps);

  const toggleStep = (index: number) => {
    if (expandedStep === index) {
      setExpandedStep(null);
    } else {
      setExpandedStep(index);
    }
  };

  // Helper functions to provide defaults
  function getIconForStep(stepNumber: number) {
    switch (stepNumber) {
      case 1: return <Target size={40} className="text-gray-900" />;
      case 2: return <Settings size={40} className="text-gray-900" />;
      case 3: return <Package size={40} className="text-gray-900" />;
      case 4: return <BarChart2 size={40} className="text-gray-900" />;
      default: return <Target size={40} className="text-gray-900" />;
    }
  }

  /**
   * Get icon color class based on variant and color family
   */
  function getIconColorClass(variant: VariantKey, colorFamily: 'lime' | 'cyan' | 'violet' | 'amber'): string {
    if (isVariant(variant, 'gym')) {
      return 'text-violet-200';
    } else if (isVariant(variant, 'sports')) {
      return 'text-cyan-200';
    } else if (isVariant(variant, 'wellness')) {
      return 'text-teal-200';
    } else if (isVariant(variant, 'modern')) {
      return 'text-amber-200';
    } else {
      // Default variant with color family
      switch (colorFamily) {
        case 'lime': return 'text-lime-200';
        case 'cyan': return 'text-cyan-200';
        case 'violet': return 'text-violet-200';
        case 'amber': return 'text-amber-200';
        default: return 'text-lime-200';
      }
    }
  }

  /**
   * Get the accent color gradient based on step number and theme variant
   */
  function getAccentColorForStep(stepNumber: number, variant: VariantKey): string {
    // Apply variant-specific styling with type narrowing
    if (isVariant(variant, 'gym')) {
      // Gym variant has more vibrant colors
      switch (stepNumber) {
        case 1: return "from-lime-400 to-emerald-500";
        case 2: return "from-cyan-400 to-blue-500";
        case 3: return "from-violet-400 to-purple-500";
        case 4: return "from-amber-400 to-orange-500";
        default: return "from-lime-400 to-emerald-500";
      }
    } else if (isVariant(variant, 'sports')) {
      // Sports variant has more blue/cyan tones
      switch (stepNumber) {
        case 1: return "from-cyan-300 to-blue-400";
        case 2: return "from-blue-300 to-indigo-400";
        case 3: return "from-indigo-300 to-violet-400";
        case 4: return "from-lime-300 to-emerald-400";
        default: return "from-cyan-300 to-blue-400";
      }
    } else if (isVariant(variant, 'wellness')) {
      // Wellness variant has more purple/violet tones
      switch (stepNumber) {
        case 1: return "from-violet-300 to-purple-400";
        case 2: return "from-pink-300 to-rose-400";
        case 3: return "from-amber-300 to-orange-400";
        case 4: return "from-emerald-300 to-teal-400";
        default: return "from-violet-300 to-purple-400";
      }
    } else if (isVariant(variant, 'modern')) {
      // Modern variant has amber/orange tones
      switch (stepNumber) {
        case 1: return "from-amber-300 to-orange-400";
        case 2: return "from-rose-300 to-pink-400";
        case 3: return "from-violet-300 to-purple-400";
        case 4: return "from-blue-300 to-indigo-400";
        default: return "from-amber-300 to-orange-400";
      }
    } else {
      // Default variant
      switch (stepNumber) {
        case 1: return "from-lime-300 to-emerald-400";
        case 2: return "from-cyan-300 to-blue-400";
        case 3: return "from-violet-300 to-purple-400";
        case 4: return "from-amber-300 to-orange-400";
        default: return "from-lime-300 to-emerald-400";
      }
    }
  }

  function getCTATextForStep(stepNumber: number) {
    switch (stepNumber) {
      case 1: return "Set Your Goals";
      case 2: return "Personalize";
      case 3: return "See Sample Plan";
      case 4: return "View Analytics";
      default: return "Learn More";
    }
  }

  function getDetailedFeaturesForStep(stepNumber: number, variant: VariantKey) {
    // Get the appropriate icon color class for the variant
    const getIconColor = (colorFamily: 'lime' | 'cyan' | 'violet' | 'amber') =>
      getIconColorClass(variant, colorFamily);

    switch (stepNumber) {
      case 1:
        return [
          {
            title: "Strength Building",
            description: "Focus on compound movements and progressive overload for maximum strength gains.",
            icon: <Dumbbell size={24} className={getIconColor('lime')} />
          },
          {
            title: "Fat Loss",
            description: "Optimize caloric deficit with the right mix of HIIT and steady-state cardio.",
            icon: <Flame size={24} className={getIconColor('lime')} />
          },
          {
            title: "Muscle Growth",
            description: "Hypertrophy-focused programs with proper volume and intensity distribution.",
            icon: <Zap size={24} className={getIconColor('lime')} />
          },
          {
            title: "General Fitness",
            description: "Well-rounded programs balancing strength, endurance, and mobility.",
            icon: <Activity size={24} className={getIconColor('lime')} />
          }
        ];
      case 2:
        return [
          {
            title: "Equipment Selection",
            description: "From minimal home setups to full gym access - we adapt to what you have.",
            icon: <Dumbbell size={24} className={getIconColor('cyan')} />
          },
          {
            title: "Time Management",
            description: "Short on time? Our AI optimizes workouts from 15 minutes to 90+ minutes.",
            icon: <Clock size={24} className={getIconColor('cyan')} />
          },
          {
            title: "Experience Level",
            description: "Whether you're a beginner or advanced, we scale appropriately for your level.",
            icon: <Layers size={24} className={getIconColor('cyan')} />
          },
          {
            title: "Training Frequency",
            description: "Flexible scheduling from 2-6 days per week based on your availability.",
            icon: <Calendar size={24} className={getIconColor('cyan')} />
          }
        ];
      case 3:
        return [
          {
            title: "AI-Powered Design",
            description: "Advanced algorithms create the optimal exercise selection and progression.",
            icon: <Cpu size={24} className={getIconColor('violet')} />
          },
          {
            title: "Scientific Approach",
            description: "Evidence-based programming following proven training principles.",
            icon: <Microscope size={24} className={getIconColor('violet')} />
          },
          {
            title: "Adaptive Progression",
            description: "Your plan evolves as you progress, ensuring continued results.",
            icon: <TrendingUp size={24} className={getIconColor('violet')} />
          },
          {
            title: "Detailed Instructions",
            description: "Clear guidance on execution, tempo, and form for each exercise.",
            icon: <FileText size={24} className={getIconColor('violet')} />
          }
        ];
      case 4:
        return [
          {
            title: "Visual Analytics",
            description: "Interactive charts showing your strength progression and volume over time.",
            icon: <PieChart size={24} className={getIconColor('amber')} />
          },
          {
            title: "Achievement System",
            description: "Unlock badges and achievements as you hit milestones in your fitness journey.",
            icon: <Trophy size={24} className={getIconColor('amber')} />
          },
          {
            title: "Body Composition",
            description: "Track weight, measurements, and body composition changes visually.",
            icon: <Activity size={24} className={getIconColor('amber')} />
          },
          {
            title: "Smart Insights",
            description: "AI-powered observations about your performance patterns and suggestions.",
            icon: <Lightbulb size={24} className={getIconColor('amber')} />
          }
        ];
      default:
        return [];
    }
  }

  // Create variant-specific props for the Section component
  const sectionProps = {
    id: "how-it-works",
    className: "journey-section",
    backgroundColor: "secondary" as const,
    backgroundVariant: "grid" as const,
    spacing: "lg" as const,
    seamless: true,
    variant
  };

  return (
    <Section {...sectionProps}>
      <SectionHeader
        title="Your Fitness Journey"
        description="Four simple steps to transform your fitness routine with AI-powered workouts"
        variant={variant}
      />

      <div className="journey-steps mt-16">
        <div className={`journey-timeline ${timelineColorClass}`}>
          {journeySteps.map((step, index) => (
            <div key={step.id} className="journey-step-container">
              <JourneyStep
                step={step}
                index={index}
                isExpanded={expandedStep === index}
                onToggle={() => toggleStep(index)}
                isLast={index === journeySteps.length - 1}
                variant={variant}
              />
            </div>
          ))}
        </div>
      </div>

      <JourneyCTA
        text="Start Your Fitness Journey"
        href="https://builder.fitcopilot.ai"
        variant={variant}
      />
    </Section>
  );
};

export default Journey; 