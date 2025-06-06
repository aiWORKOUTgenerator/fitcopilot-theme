import {
    Activity,
    Award,
    BarChart3,
    Brain,
    Calendar,
    CheckCircle,
    Clock,
    Heart,
    LineChart,
    RefreshCw,
    Share2,
    Shield,
    Smile,
    Star,
    Target,
    TrendingUp,
    Trophy,
    Users,
    Zap
} from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import logger from '../../../utils/logger';
import { UniversalButton } from '../components/UniversalButton';
import { useHomepageAnimation } from '../hooks';
import './_tokens.scss';
import { JourneyStep, SectionHeader } from './components';
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
 * Uses centralized animation system for consistent, performant animations
 */
const Journey: React.FC<JourneyProps> = ({
  journey = [],
  variant: _variant = 'default'
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { expandedStep, setExpandedStep } = useJourneyStore();
  
  // Use the centralized animation system with enhanced smooth settings
  const { isReady } = useHomepageAnimation({
    duration: 900, // Increased from 600ms for smoother, more graceful motion
    easing: 'ease-out-quad', // Smooth organic easing for graceful motion
    once: true,
    offset: 120, // Slightly higher offset for earlier, smoother trigger
    // Journey-specific override for enhanced UX
    disableForReducedMotion: true // Maintain accessibility support
  });

  // Initialize and refresh animations when system is ready
  useEffect(() => {
    if (isReady) {
      logger.debug('🎬 Journey: Animation system ready');
    }
  }, [isReady]);

  // Define detailed journey steps if not provided
  const journeySteps = journey.length > 0 ? journey : [
    {
      id: 1,
      number: 1,
      title: "Tell Us About You",
      description: "Share your fitness goals, experience level, and any limitations or preferences.",
      icon: <Target size={40} className="text-gray-900" />,
      delay: 100,
      accentColor: getStepGradientClass(1),
      ctaText: "Complete Assessment",
      ctaUrl: "#assessment",
      detailedFeatures: [
        {
          title: "Goal Setting",
          description: "Define your fitness objectives clearly",
          icon: <Target size={24} className={getIconColorClass(1)} />
        },
        {
          title: "Experience Level",
          description: "We tailor workouts to your current fitness level",
          icon: <Activity size={24} className={getIconColorClass(1)} />
        },
        {
          title: "Health Considerations",
          description: "Account for injuries or health restrictions",
          icon: <Heart size={24} className={getIconColorClass(1)} />
        },
        {
          title: "Time Availability",
          description: "Workouts that fit your busy schedule",
          icon: <Clock size={24} className={getIconColorClass(1)} />
        }
      ]
    },
    {
      id: 2,
      number: 2,
      title: "AI Creates Your Plan",
      description: "Our advanced AI analyzes your profile and generates a personalized workout plan.",
      icon: <Brain size={40} className="text-gray-900" />,
      delay: 200,
      accentColor: getStepGradientClass(2),
      ctaText: "See AI Plan Creation",
      ctaUrl: "#how-it-works",
      detailedFeatures: [
        {
          title: "Smart Algorithm",
          description: "AI-powered workout generation tailored to you",
          icon: <Zap size={24} className={getIconColorClass(2)} />
        },
        {
          title: "Flexible Scheduling",
          description: "Adapts to your availability and preferences",
          icon: <Calendar size={24} className={getIconColorClass(2)} />
        },
        {
          title: "Progressive Overload",
          description: "Gradually increases intensity for optimal results",
          icon: <TrendingUp size={24} className={getIconColorClass(2)} />
        },
        {
          title: "Injury Prevention",
          description: "Built-in safety measures and form guidance",
          icon: <Shield size={24} className={getIconColorClass(2)} />
        }
      ]
    },
    {
      id: 3,
      number: 3,
      title: "Track Your Progress",
      description: "Monitor your improvements with detailed analytics and adaptive adjustments.",
      icon: <BarChart3 size={40} className="text-gray-900" />,
      delay: 300,
      accentColor: getStepGradientClass(3),
      ctaText: "See Progress Tracking",
      ctaUrl: "#progress-demo",
      detailedFeatures: [
        {
          title: "Performance Metrics",
          description: "Track strength, endurance, and overall progress",
          icon: <LineChart size={24} className={getIconColorClass(3)} />
        },
        {
          title: "Achievement System",
          description: "Celebrate milestones and stay motivated",
          icon: <Award size={24} className={getIconColorClass(3)} />
        },
        {
          title: "Plan Adjustments",
          description: "AI adapts your plan based on your progress",
          icon: <RefreshCw size={24} className={getIconColorClass(3)} />
        },
        {
          title: "Community Support",
          description: "Connect with others on similar fitness journeys",
          icon: <Users size={24} className={getIconColorClass(3)} />
        }
      ]
    },
    {
      id: 4,
      number: 4,
      title: "Achieve Your Goals",
      description: "Whether you're a beginner or advanced, we scale appropriately for your level.",
      icon: <Trophy size={40} className="text-gray-900" />,
      delay: 400,
      accentColor: getStepGradientClass(4),
      ctaText: "Start Goal Achievement",
      ctaUrl: "#get-started",
      detailedFeatures: [
        {
          title: "Goal Achievement",
          description: "Systematic approach to reaching your targets",
          icon: <CheckCircle size={24} className={getIconColorClass(4)} />
        },
        {
          title: "Continuous Improvement",
          description: "Keep challenging yourself with new goals",
          icon: <Star size={24} className={getIconColorClass(4)} />
        },
        {
          title: "Lifestyle Integration",
          description: "Make fitness a sustainable part of your life",
          icon: <Smile size={24} className={getIconColorClass(4)} />
        },
        {
          title: "Share Success",
          description: "Inspire others with your transformation",
          icon: <Share2 size={24} className={getIconColorClass(4)} />
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

  // Enhanced delay timing for organic cascade effect
  const getStepDelay = (index: number): string => {
    // Exponential-like progression for natural cascade feel
    const delays = [0, 180, 420, 720]; // More organic timing than linear 100ms intervals
    return delays[index]?.toString() || '0';
  };

  // Handle step toggle - simplified without complex animation management
  const handleStepToggle = useCallback((index: number) => {
    const newExpanded = expandedStep === index ? null : index;
    setExpandedStep(newExpanded);

    // Smooth scroll to expanded step
    if (newExpanded !== null) {
        setTimeout(() => {
        const stepElement = document.querySelector(`[data-step-index="${index}"]`);
          if (stepElement) {
            stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
      }, 150); // Small delay to allow expansion animation
    }
  }, [expandedStep, setExpandedStep]);

  return (
    <section
      className="w-full py-16 md:pt-8 md:pb-24 px-4 bg-journey-bg relative overflow-hidden"
      data-theme={_variant !== 'default' ? _variant : undefined}
    >
      {/* Create a visual connector from Features to Journey */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background-primary to-transparent z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header - Centralized animation */}
        <div 
          className="animate-on-scroll"
          data-animation="fade-up"
          data-delay="0"
        >
        <SectionHeader
          title={<>Your Fitness <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">Journey</span></>}
          description="Four simple steps to transform your fitness routine with AI-powered workouts"
          variant={_variant}
        />
        </div>

        {/* Journey Steps - Centralized animation container */}
        <div
          className="journey-steps mt-16 px-4 md:px-8 animate-on-scroll"
          data-animation="fade-up"
          data-delay="200"
        >
          <div className={`journey-timeline ${timelineColorClass} space-y-16`}>
            {journeySteps.map((step: JourneyStepType, index: number) => (
              <div
                key={step.id}
                className="journey-step-container animate-on-scroll"
                data-animation="fade-up"
                data-delay={getStepDelay(index)}
                data-step-index={index}
              >
                <JourneyStep
                  step={step}
                  index={index}
                  isExpanded={expandedStep === index}
                  onToggle={() => handleStepToggle(index)}
                  isLast={index === journeySteps.length - 1}
                  variant={_variant}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA - Centralized animation */}
        <div
          className="text-center mt-16 animate-on-scroll"
          data-animation="fade-up"
          data-delay="1000"
        >
          <UniversalButton
            sectionContext="journey"
            buttonVariant="primary"
            gradientColor="lime"
            size="large"
            href="https://aigymengine.com/workout-generator-registration"
            variant={_variant}
            rightIcon={<Zap size={20} />}
          >
            Start Your Journey Now
          </UniversalButton>
        </div>
      </div>
    </section>
  );
};

export default Journey; 