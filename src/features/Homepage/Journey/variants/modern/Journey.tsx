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
import { JourneyCTA, JourneyStep, SectionHeader } from '../../components';
import SPACING from '../../constants';
import '../../Journey.scss';
import { JourneyProps } from '../../types';

/**
 * ModernJourney component - A variant of the Journey component with a modern design aesthetic
 */
export const ModernJourney: React.FC<JourneyProps> = ({ journey = [] }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Modern variant uses a custom color scheme and styling
  const modernAccentColors = {
    1: "from-blue-300 to-indigo-400",
    2: "from-indigo-300 to-purple-400",
    3: "from-purple-300 to-pink-400",
    4: "from-pink-300 to-rose-400"
  };

  // Define detailed journey steps with modern styling
  const journeySteps = journey.length > 0 ? journey.map(step => ({
    id: step.id,
    title: step.title,
    description: step.description,
    number: step.number,
    // Default values for the new properties if not provided from props
    icon: getIconForStep(step.number),
    delay: step.number * 100,
    accentColor: modernAccentColors[step.number as keyof typeof modernAccentColors] || "from-blue-300 to-indigo-400",
    ctaText: getCTATextForStep(step.number),
    detailedFeatures: getDetailedFeaturesForStep(step.number)
  })) : [
    {
      id: 1,
      title: "Define Your Goals",
      description: "Tell us what you want to achieve - strength, muscle gain, fat loss, or general fitness.",
      icon: <Target size={40} className="text-gray-900" />,
      delay: 100,
      accentColor: "from-blue-300 to-indigo-400",
      ctaText: "Set Your Goals",
      detailedFeatures: [
        {
          title: "Strength Building",
          description: "Focus on compound movements and progressive overload for maximum strength gains.",
          icon: <Dumbbell size={24} className="text-blue-200" />
        },
        {
          title: "Fat Loss",
          description: "Optimize caloric deficit with the right mix of HIIT and steady-state cardio.",
          icon: <Flame size={24} className="text-blue-200" />
        },
        {
          title: "Muscle Growth",
          description: "Hypertrophy-focused programs with proper volume and intensity distribution.",
          icon: <Zap size={24} className="text-blue-200" />
        },
        {
          title: "General Fitness",
          description: "Well-rounded programs balancing strength, endurance, and mobility.",
          icon: <Activity size={24} className="text-blue-200" />
        }
      ]
    },
    {
      id: 2,
      title: "Customize Your Experience",
      description: "Specify your experience level, available equipment, and time constraints.",
      icon: <Settings size={40} className="text-gray-900" />,
      delay: 200,
      accentColor: "from-indigo-300 to-purple-400",
      ctaText: "Personalize",
      detailedFeatures: [
        {
          title: "Equipment Selection",
          description: "From minimal home setups to full gym access - we adapt to what you have.",
          icon: <Dumbbell size={24} className="text-indigo-200" />
        },
        {
          title: "Time Management",
          description: "Short on time? Our AI optimizes workouts from 15 minutes to 90+ minutes.",
          icon: <Clock size={24} className="text-indigo-200" />
        },
        {
          title: "Experience Level",
          description: "Whether you're a beginner or advanced, we scale appropriately for your level.",
          icon: <Layers size={24} className="text-indigo-200" />
        },
        {
          title: "Training Frequency",
          description: "Flexible scheduling from 2-6 days per week based on your availability.",
          icon: <Calendar size={24} className="text-indigo-200" />
        }
      ]
    },
    {
      id: 3,
      title: "Receive Your Personalized Plan",
      description: "Our AI generates a tailored workout program specific to your needs and capabilities.",
      icon: <Package size={40} className="text-gray-900" />,
      delay: 300,
      accentColor: "from-purple-300 to-pink-400",
      ctaText: "See Sample Plan",
      detailedFeatures: [
        {
          title: "AI-Powered Design",
          description: "Advanced algorithms create the optimal exercise selection and progression.",
          icon: <Cpu size={24} className="text-purple-200" />
        },
        {
          title: "Scientific Approach",
          description: "Evidence-based programming following proven training principles.",
          icon: <Microscope size={24} className="text-purple-200" />
        },
        {
          title: "Adaptive Progression",
          description: "Your plan evolves as you progress, ensuring continued results.",
          icon: <TrendingUp size={24} className="text-purple-200" />
        },
        {
          title: "Detailed Instructions",
          description: "Clear guidance on execution, tempo, and form for each exercise.",
          icon: <FileText size={24} className="text-purple-200" />
        }
      ]
    },
    {
      id: 4,
      title: "Track Your Progress",
      description: "Log your workouts, track your metrics, and watch your progress over time.",
      icon: <BarChart2 size={40} className="text-gray-900" />,
      delay: 400,
      accentColor: "from-pink-300 to-rose-400",
      ctaText: "View Analytics",
      detailedFeatures: [
        {
          title: "Visual Analytics",
          description: "Interactive charts showing your strength progression and volume over time.",
          icon: <PieChart size={24} className="text-pink-200" />
        },
        {
          title: "Achievement System",
          description: "Unlock badges and achievements as you hit milestones in your fitness journey.",
          icon: <Trophy size={24} className="text-pink-200" />
        },
        {
          title: "Body Composition",
          description: "Track weight, measurements, and body composition changes visually.",
          icon: <Activity size={24} className="text-pink-200" />
        },
        {
          title: "Smart Insights",
          description: "AI-powered observations about your performance patterns and suggestions.",
          icon: <Lightbulb size={24} className="text-pink-200" />
        }
      ]
    }
  ];

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

  function _getAccentColorForStep(stepNumber: number) {
    return modernAccentColors[stepNumber as keyof typeof modernAccentColors] || "from-blue-300 to-indigo-400";
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

  function getDetailedFeaturesForStep(stepNumber: number) {
    // Use the same features as the default but with different icon colors based on the modern theme
    const iconColorClass = stepNumber === 1 ? "text-blue-200" :
      stepNumber === 2 ? "text-indigo-200" :
        stepNumber === 3 ? "text-purple-200" :
          "text-pink-200";

    const baseFeatures = {
      1: [
        {
          title: "Strength Building",
          description: "Focus on compound movements and progressive overload for maximum strength gains.",
          icon: <Dumbbell size={24} className={iconColorClass} />
        },
        {
          title: "Fat Loss",
          description: "Optimize caloric deficit with the right mix of HIIT and steady-state cardio.",
          icon: <Flame size={24} className={iconColorClass} />
        },
        {
          title: "Muscle Growth",
          description: "Hypertrophy-focused programs with proper volume and intensity distribution.",
          icon: <Zap size={24} className={iconColorClass} />
        },
        {
          title: "General Fitness",
          description: "Well-rounded programs balancing strength, endurance, and mobility.",
          icon: <Activity size={24} className={iconColorClass} />
        }
      ],
      2: [
        {
          title: "Equipment Selection",
          description: "From minimal home setups to full gym access - we adapt to what you have.",
          icon: <Dumbbell size={24} className={iconColorClass} />
        },
        {
          title: "Time Management",
          description: "Short on time? Our AI optimizes workouts from 15 minutes to 90+ minutes.",
          icon: <Clock size={24} className={iconColorClass} />
        },
        {
          title: "Experience Level",
          description: "Whether you're a beginner or advanced, we scale appropriately for your level.",
          icon: <Layers size={24} className={iconColorClass} />
        },
        {
          title: "Training Frequency",
          description: "Flexible scheduling from 2-6 days per week based on your availability.",
          icon: <Calendar size={24} className={iconColorClass} />
        }
      ],
      3: [
        {
          title: "AI-Powered Design",
          description: "Advanced algorithms create the optimal exercise selection and progression.",
          icon: <Cpu size={24} className={iconColorClass} />
        },
        {
          title: "Scientific Approach",
          description: "Evidence-based programming following proven training principles.",
          icon: <Microscope size={24} className={iconColorClass} />
        },
        {
          title: "Adaptive Progression",
          description: "Your plan evolves as you progress, ensuring continued results.",
          icon: <TrendingUp size={24} className={iconColorClass} />
        },
        {
          title: "Detailed Instructions",
          description: "Clear guidance on execution, tempo, and form for each exercise.",
          icon: <FileText size={24} className={iconColorClass} />
        }
      ],
      4: [
        {
          title: "Visual Analytics",
          description: "Interactive charts showing your strength progression and volume over time.",
          icon: <PieChart size={24} className={iconColorClass} />
        },
        {
          title: "Achievement System",
          description: "Unlock badges and achievements as you hit milestones in your fitness journey.",
          icon: <Trophy size={24} className={iconColorClass} />
        },
        {
          title: "Body Composition",
          description: "Track weight, measurements, and body composition changes visually.",
          icon: <Activity size={24} className={iconColorClass} />
        },
        {
          title: "Smart Insights",
          description: "AI-powered observations about your performance patterns and suggestions.",
          icon: <Lightbulb size={24} className={iconColorClass} />
        }
      ]
    };

    return baseFeatures[stepNumber as keyof typeof baseFeatures] || [];
  }

  return (
    <section className={`journey-section ${SPACING.PADDING.SECTION} bg-[#0C1428]`} id="how-it-works">
      <div className={SPACING.LAYOUT.SECTION_CONTAINER}>
        <SectionHeader
          title={<>How We <span className="text-[#8B5CF6]">Design</span> Your Fitness</>}
          description="Our AI-powered system creates personalized workout programs tailored to your specific goals and needs."
        />

        <div className="space-y-6 mt-12">
          {journeySteps.map((step, index) => (
            <JourneyStep
              key={step.id}
              step={step}
              index={index}
              isExpanded={expandedStep === index}
              onToggle={() => toggleStep(index)}
              isLast={index === journeySteps.length - 1}
            />
          ))}
        </div>

        <JourneyCTA
          text="Start Your Fitness Journey"
          href="https://builder.fitcopilot.ai"
        />
      </div>
    </section>
  );
};

export default ModernJourney; 