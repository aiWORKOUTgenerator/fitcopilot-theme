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
 * SportsJourney component - A sports-focused variant of the Journey component
 */
export const SportsJourney: React.FC<JourneyProps> = ({ journey = [] }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Sports variant uses a vibrant sport-focused color scheme
  const sportsAccentColors = {
    1: "from-red-400 to-orange-500",
    2: "from-orange-400 to-amber-500",
    3: "from-yellow-400 to-lime-500",
    4: "from-lime-400 to-green-500"
  };

  // Define detailed journey steps with sports styling
  const journeySteps = journey.length > 0 ? journey.map(step => ({
    id: step.id,
    title: step.title,
    description: step.description,
    number: step.number,
    // Default values for the new properties if not provided from props
    icon: getIconForStep(step.number),
    delay: step.number * 100,
    accentColor: sportsAccentColors[step.number as keyof typeof sportsAccentColors] || "from-red-400 to-orange-500",
    ctaText: getCTATextForStep(step.number),
    detailedFeatures: getDetailedFeaturesForStep(step.number)
  })) : [
    {
      id: 1,
      title: "Set Performance Goals",
      description: "Define your athletic targets - strength, speed, endurance, or sport-specific skills.",
      icon: <Target size={40} className="text-gray-900" />,
      delay: 100,
      accentColor: "from-red-400 to-orange-500",
      ctaText: "Set Your Goals",
      detailedFeatures: [
        {
          title: "Strength & Power",
          description: "Build explosive strength for better athletic performance with specialized training.",
          icon: <Dumbbell size={24} className="text-red-200" />
        },
        {
          title: "Speed & Agility",
          description: "Develop quickness and change-of-direction skills essential for sports performance.",
          icon: <Flame size={24} className="text-red-200" />
        },
        {
          title: "Endurance Building",
          description: "Improve cardiovascular capacity for sustained performance throughout competition.",
          icon: <Zap size={24} className="text-red-200" />
        },
        {
          title: "Sport-Specific Skills",
          description: "Enhance the specific athletic abilities required for your chosen sport.",
          icon: <Activity size={24} className="text-red-200" />
        }
      ]
    },
    {
      id: 2,
      title: "Configure Training Parameters",
      description: "Specify your current fitness level, available equipment, and training schedule.",
      icon: <Settings size={40} className="text-gray-900" />,
      delay: 200,
      accentColor: "from-orange-400 to-amber-500",
      ctaText: "Customize",
      detailedFeatures: [
        {
          title: "Equipment Availability",
          description: "From gym access to minimal home equipment - we adapt your training program accordingly.",
          icon: <Dumbbell size={24} className="text-orange-200" />
        },
        {
          title: "Schedule Integration",
          description: "Fit training around your sport practice schedule to maximize recovery and adaptation.",
          icon: <Clock size={24} className="text-orange-200" />
        },
        {
          title: "Athletic Level",
          description: "Training matched to your current athletic development stage for optimal progression.",
          icon: <Layers size={24} className="text-orange-200" />
        },
        {
          title: "Season Planning",
          description: "Periodized training based on your competition schedule and season phases.",
          icon: <Calendar size={24} className="text-orange-200" />
        }
      ]
    },
    {
      id: 3,
      title: "Receive Your Athletic Program",
      description: "Our sports-focused AI generates a tailored training program for your athletic development.",
      icon: <Package size={40} className="text-gray-900" />,
      delay: 300,
      accentColor: "from-yellow-400 to-lime-500",
      ctaText: "View Program",
      detailedFeatures: [
        {
          title: "Sports Science Algorithms",
          description: "Advanced training algorithms based on cutting-edge sports performance research.",
          icon: <Cpu size={24} className="text-yellow-600" />
        },
        {
          title: "Evidence-Based Methods",
          description: "Training protocols validated by sports science research and elite coaching practices.",
          icon: <Microscope size={24} className="text-yellow-600" />
        },
        {
          title: "Progressive Overload",
          description: "Systematic progression to continuously challenge your athletic capacities.",
          icon: <TrendingUp size={24} className="text-yellow-600" />
        },
        {
          title: "Technique Guidance",
          description: "Detailed movement instructions to maximize effectiveness and prevent injury.",
          icon: <FileText size={24} className="text-yellow-600" />
        }
      ]
    },
    {
      id: 4,
      title: "Monitor Athletic Progress",
      description: "Track performance metrics, athletic improvements, and progress toward sport-specific goals.",
      icon: <BarChart2 size={40} className="text-gray-900" />,
      delay: 400,
      accentColor: "from-lime-400 to-green-500",
      ctaText: "Track Performance",
      detailedFeatures: [
        {
          title: "Performance Analytics",
          description: "Visualize improvements in key performance indicators relevant to your sport.",
          icon: <PieChart size={24} className="text-lime-700" />
        },
        {
          title: "Competition Readiness",
          description: "Track your progress toward peak performance for important competitions.",
          icon: <Trophy size={24} className="text-lime-700" />
        },
        {
          title: "Physical Testing",
          description: "Regular assessment of strength, speed, and sport-specific performance metrics.",
          icon: <Activity size={24} className="text-lime-700" />
        },
        {
          title: "Performance Insights",
          description: "AI-generated observations about your athletic development and improvement areas.",
          icon: <Lightbulb size={24} className="text-lime-700" />
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
    return sportsAccentColors[stepNumber as keyof typeof sportsAccentColors] || "from-red-400 to-orange-500";
  }

  function getCTATextForStep(stepNumber: number) {
    switch (stepNumber) {
    case 1: return "Set Goals";
    case 2: return "Customize";
    case 3: return "View Program";
    case 4: return "Track Performance";
    default: return "Learn More";
    }
  }

  function getDetailedFeaturesForStep(stepNumber: number) {
    // Different feature content with sports-specific terminology and focus
    switch (stepNumber) {
    case 1:
      return [
        {
          title: "Strength & Power",
          description: "Build explosive strength for better athletic performance with specialized training.",
          icon: <Dumbbell size={24} className="text-red-200" />
        },
        {
          title: "Speed & Agility",
          description: "Develop quickness and change-of-direction skills essential for sports performance.",
          icon: <Flame size={24} className="text-red-200" />
        },
        {
          title: "Endurance Building",
          description: "Improve cardiovascular capacity for sustained performance throughout competition.",
          icon: <Zap size={24} className="text-red-200" />
        },
        {
          title: "Sport-Specific Skills",
          description: "Enhance the specific athletic abilities required for your chosen sport.",
          icon: <Activity size={24} className="text-red-200" />
        }
      ];
    case 2:
      return [
        {
          title: "Equipment Availability",
          description: "From gym access to minimal home equipment - we adapt your training program accordingly.",
          icon: <Dumbbell size={24} className="text-orange-200" />
        },
        {
          title: "Schedule Integration",
          description: "Fit training around your sport practice schedule to maximize recovery and adaptation.",
          icon: <Clock size={24} className="text-orange-200" />
        },
        {
          title: "Athletic Level",
          description: "Training matched to your current athletic development stage for optimal progression.",
          icon: <Layers size={24} className="text-orange-200" />
        },
        {
          title: "Season Planning",
          description: "Periodized training based on your competition schedule and season phases.",
          icon: <Calendar size={24} className="text-orange-200" />
        }
      ];
    case 3:
      return [
        {
          title: "Sports Science Algorithms",
          description: "Advanced training algorithms based on cutting-edge sports performance research.",
          icon: <Cpu size={24} className="text-yellow-600" />
        },
        {
          title: "Evidence-Based Methods",
          description: "Training protocols validated by sports science research and elite coaching practices.",
          icon: <Microscope size={24} className="text-yellow-600" />
        },
        {
          title: "Progressive Overload",
          description: "Systematic progression to continuously challenge your athletic capacities.",
          icon: <TrendingUp size={24} className="text-yellow-600" />
        },
        {
          title: "Technique Guidance",
          description: "Detailed movement instructions to maximize effectiveness and prevent injury.",
          icon: <FileText size={24} className="text-yellow-600" />
        }
      ];
    case 4:
      return [
        {
          title: "Performance Analytics",
          description: "Visualize improvements in key performance indicators relevant to your sport.",
          icon: <PieChart size={24} className="text-lime-700" />
        },
        {
          title: "Competition Readiness",
          description: "Track your progress toward peak performance for important competitions.",
          icon: <Trophy size={24} className="text-lime-700" />
        },
        {
          title: "Physical Testing",
          description: "Regular assessment of strength, speed, and sport-specific performance metrics.",
          icon: <Activity size={24} className="text-lime-700" />
        },
        {
          title: "Performance Insights",
          description: "AI-generated observations about your athletic development and improvement areas.",
          icon: <Lightbulb size={24} className="text-lime-700" />
        }
      ];
    default:
      return [];
    }
  }

  return (
    <section className={`journey-section ${SPACING.PADDING.SECTION} bg-[#071d14]`} id="how-it-works">
      <div className={SPACING.LAYOUT.SECTION_CONTAINER}>
        <SectionHeader
          title={<>The <span className="text-[#84cc16]">Athlete's</span> Journey</>}
          description="Follow these steps to build your personalized sports performance program using our AI training technology."
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
          text="Build Your Athletic Program"
          href="https://builder.fitcopilot.ai"
        />
      </div>
    </section>
  );
};

export default SportsJourney; 