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
import React, { useEffect } from 'react';
import logger from '../../../utils/logger';
import { useHomepageAnimation } from '../hooks';
import './_tokens.scss';
import { JourneyCTA, JourneyStep, SectionHeader } from './components';
import { useReducedMotion } from './hooks/useReducedMotion';
import './journey-animations.scss';
import './journey-utility-classes.scss';
import './Journey.scss';
import {
    JourneyProps,
    JourneyStep as JourneyStepType
} from './types';
import { useJourneyStore } from './utils/journeyState';
import { getIconColorClass, getStepGradientClass } from './utils/tokenUtils';



/**
 * Journey component - Shows the user journey/process flow with expandable steps
 */
const Journey: React.FC<JourneyProps> = ({
  journey = [],
  variant: _variant = 'default'
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { expandedStep, setExpandedStep } = useJourneyStore();
  
  // Use the centralized animation system
  const { isReady, refresh, stats } = useHomepageAnimation({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
  });

  // Refresh animations when component mounts and when animation system is ready
  useEffect(() => {
    if (isReady) {
      logger.debug('🎬 Journey: Animation system ready, refreshing...');
      refresh();
      
      if (stats) {
        logger.debug('📊 Journey animation stats:', stats);
      }
    }
  }, [isReady, refresh, stats]);

  // Define detailed journey steps if not provided
  const journeySteps = journey.length > 0 ? journey : [
    {
      id: 1,
      number: 1,
      title: "Define Your Goals",
      description: "Tell us what you want to achieve - strength, muscle gain, fat loss, or general fitness.",
      icon: <Target size={40} className="text-gray-900" />,
      delay: 100,
      accentColor: getStepGradientClass(1),
      ctaText: "Set Your Goals",
      detailedFeatures: [
        {
          title: "Strength Building",
          description: "Focus on compound movements and progressive overload for maximum strength gains.",
          icon: <Dumbbell size={24} className={getIconColorClass(1)} />
        },
        {
          title: "Fat Loss",
          description: "Optimize caloric deficit with the right mix of HIIT and steady-state cardio.",
          icon: <Flame size={24} className={getIconColorClass(1)} />
        },
        {
          title: "Muscle Growth",
          description: "Hypertrophy-focused programs with proper volume and intensity distribution.",
          icon: <Zap size={24} className={getIconColorClass(1)} />
        },
        {
          title: "General Fitness",
          description: "Well-rounded programs balancing strength, endurance, and mobility.",
          icon: <Activity size={24} className={getIconColorClass(1)} />
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
      accentColor: getStepGradientClass(2),
      ctaText: "Personalize",
      detailedFeatures: [
        {
          title: "Equipment Selection",
          description: "From minimal home setups to full gym access - we adapt to what you have.",
          icon: <Dumbbell size={24} className={getIconColorClass(2)} />
        },
        {
          title: "Time Management",
          description: "Short on time? Our AI optimizes workouts from 15 minutes to 90+ minutes.",
          icon: <Clock size={24} className={getIconColorClass(2)} />
        },
        {
          title: "Experience Level",
          description: "Whether you're a beginner or advanced, we scale appropriately for your level.",
          icon: <Layers size={24} className={getIconColorClass(2)} />
        },
        {
          title: "Training Frequency",
          description: "Flexible scheduling from 2-6 days per week based on your availability.",
          icon: <Calendar size={24} className={getIconColorClass(2)} />
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
      accentColor: getStepGradientClass(3),
      ctaText: "See Sample Plan",
      detailedFeatures: [
        {
          title: "AI-Powered Design",
          description: "Advanced algorithms create the optimal exercise selection and progression.",
          icon: <Cpu size={24} className={getIconColorClass(3)} />
        },
        {
          title: "Scientific Approach",
          description: "Evidence-based programming following proven training principles.",
          icon: <Microscope size={24} className={getIconColorClass(3)} />
        },
        {
          title: "Adaptive Progression",
          description: "Your plan evolves as you progress, ensuring continued results.",
          icon: <TrendingUp size={24} className={getIconColorClass(3)} />
        },
        {
          title: "Detailed Instructions",
          description: "Clear guidance on execution, tempo, and form for each exercise.",
          icon: <FileText size={24} className={getIconColorClass(3)} />
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
      accentColor: getStepGradientClass(4),
      ctaText: "View Analytics",
      detailedFeatures: [
        {
          title: "Visual Analytics",
          description: "Interactive charts showing your strength progression and volume over time.",
          icon: <PieChart size={24} className={getIconColorClass(4)} />
        },
        {
          title: "Achievement System",
          description: "Unlock badges and achievements as you hit milestones in your fitness journey.",
          icon: <Trophy size={24} className={getIconColorClass(4)} />
        },
        {
          title: "Body Composition",
          description: "Track weight, measurements, and body composition changes visually.",
          icon: <Activity size={24} className={getIconColorClass(4)} />
        },
        {
          title: "Smart Insights",
          description: "AI-powered observations about your performance patterns and suggestions.",
          icon: <Lightbulb size={24} className={getIconColorClass(4)} />
        }
      ]
    }
  ];

  // Get the timeline color class based on the first step's color
  const getTimelineColorClass = (steps: typeof journeySteps): string => {
    if (!steps || steps.length === 0) return 'timeline-lime';

    const firstStepColor = steps[0]?.accentColor;
    if (!firstStepColor) return 'timeline-lime';

    try {
      if (firstStepColor?.includes('cyan')) return 'timeline-cyan';
      if (firstStepColor?.includes('violet')) return 'timeline-violet';
      if (firstStepColor?.includes('amber')) return 'timeline-amber';
    } catch (_e) {
      // If includes method fails, return default
      return 'timeline-lime';
    }

    return 'timeline-lime';
  };

  const timelineColorClass = getTimelineColorClass(journeySteps);

  const handleStepClick = (index: number) => {
    if (expandedStep === index) {
      setExpandedStep(null);
    } else {
      setExpandedStep(index);

      // Scroll to the expanded step with a slight delay for animation
      if (!prefersReducedMotion) {
        setTimeout(() => {
          const stepElement = document.querySelector(`#journey-step-${index}`);
          if (stepElement) {
            stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  };

  // Create variant-specific props for the Section component
  const _sectionProps = {
    id: "how-it-works",
    className: "journey-section",
    backgroundColor: "secondary" as const,
    backgroundVariant: "grid" as const,
    spacing: "lg" as const,
    seamless: true,
    variant: _variant
  };

  return (
    <section
      className="w-full py-16 md:pt-8 md:pb-24 px-4 bg-journey-bg relative overflow-hidden"
      data-theme={_variant !== 'default' ? _variant : undefined}
    >
      {/* Create a visual connector from Features to Journey */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background-primary to-transparent z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <SectionHeader
          title={<>Your Fitness <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">Journey</span></>}
          description="Four simple steps to transform your fitness routine with AI-powered workouts"
          variant={_variant}
        />

        {/* Journey Steps */}
        <div
          className="journey-steps mt-16 px-4 md:px-8"
          data-aos={prefersReducedMotion ? undefined : 'fade-up'}
          data-aos-delay={prefersReducedMotion ? undefined : '100'}
        >
          <div className={`journey-timeline ${timelineColorClass} space-y-16`}>
            {journeySteps.map((step: JourneyStepType, index: number) => (
              <div
                key={step.id}
                className="journey-step-container"
                id={`journey-step-${index}`}
              >
                <JourneyStep
                  step={step}
                  index={index}
                  isExpanded={expandedStep === index}
                  onToggle={() => handleStepClick(index)}
                  isLast={index === journeySteps.length - 1}
                  variant={_variant}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div
          className="text-center mt-16"
          data-aos={prefersReducedMotion ? undefined : 'fade-up'}
          data-aos-delay={prefersReducedMotion ? undefined : '500'}
        >
          <JourneyCTA
            text="Start Your Journey Now"
            href="https://aigymengine.com/workout-generator-registration"
            buttonVariant="gradient"
            gradientColor="lime"
            buttonSize="large"
            showIcon={true}
            variant={_variant}
          />
        </div>
      </div>
    </section>
  );
};

export default Journey; 