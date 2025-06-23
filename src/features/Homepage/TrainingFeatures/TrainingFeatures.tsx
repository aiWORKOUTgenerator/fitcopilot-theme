import {
  Activity,
  Apple,
  ArrowRight,
  Award,
  BarChart,
  Bike,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Coffee,
  Download,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  Medal,
  MessageSquare,
  Play,
  Rocket,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  Video,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { GlobalVariantKey } from '../types/shared';
import FeatureCard from './components/FeatureCard';
import TrainingFeaturesCTA from './components/TrainingFeaturesCTA';
import './TrainingFeatures.scss';
import {
  DataSource,
  DefaultVariantProps,
  LoadingState,
  TrainingFeature,
  TrainingFeaturesSettings,
  WordPressTrainingFeature
} from './types';

/**
 * FloatingIcon component for decorative background
 */
interface FloatingIconProps {
    children: React.ReactNode;
    delay: number;
    speed: number;
    left: number;
    top: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({
  children,
  delay,
  speed,
  left,
  top
}) => {
  return (
    <div
      className="floating-icon"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        animation: `float ${speed}s ease-in-out infinite ${delay}s`
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

/**
 * Map variant to GlobalVariantKey
 */
const mapVariantToGlobal = (variant?: string): GlobalVariantKey => {
  const validVariants: GlobalVariantKey[] = [
    'default', 'gym', 'sports', 'wellness', 'modern', 'classic', 
    'minimalist', 'boutique', 'registration', 'mobile'
  ];
  
  if (validVariants.includes(variant as GlobalVariantKey)) {
    return variant as GlobalVariantKey;
  }
  
  // Map TrainingFeatures-specific variants to GlobalVariantKey
  switch (variant) {
  default: return 'default';
  }
};

/**
 * Icon mapping system for WordPress icon data
 * Maps WordPress icon names to Lucide React components
 */
const getIconComponent = (iconType: string, iconName: string) => {
  const IconMap: Record<string, any> = {
    'Video': Video,
    'Calendar': Calendar,
    'BarChart': BarChart,
    'MessageSquare': MessageSquare,
    'Download': Download,
    'Smartphone': Smartphone,
    'Dumbbell': Dumbbell,
    'Timer': Timer,
    'Medal': Medal,
    'Flame': Flame,
    'Heart': Heart,
    'Apple': Apple,
    'Coffee': Coffee,
    'Footprints': Footprints,
    'Bike': Bike,
    'Star': Star,
    'Activity': Activity,
    'ArrowRight': ArrowRight,
    'Award': Award,
    'CheckCircle': CheckCircle,
    'ChevronRight': ChevronRight,
    'Clock': Clock,
    'Play': Play,
    'Rocket': Rocket,
    'Sparkles': Sparkles,
    'Target': Target,
    'Trophy': Trophy,
    'Zap': Zap,
  };
  
  const IconComponent = IconMap[iconName] || Star;
  return <IconComponent size={24} className="text-gray-900" />;
};

/**
 * Render CTA icon based on WordPress admin settings
 */
const renderCTAIcon = (settings: TrainingFeaturesSettings) => {
  const iconType = settings.ctaIconType || 'lucide';
  const iconName = settings.ctaLucideIcon || 'ArrowRight';
  const logoUrl = settings.ctaLogoUrl;

  if (iconType === 'none') {
    return null;
  }

  if (iconType === 'logo' && logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt="CTA Logo" 
        className="w-7 h-7 object-contain"
        loading="lazy"
      />
    );
  }

  // Default to Lucide icon
  const IconMap: Record<string, any> = {
    'Activity': Activity,
    'ArrowRight': ArrowRight,
    'Award': Award,
    'CheckCircle': CheckCircle,
    'ChevronRight': ChevronRight,
    'Clock': Clock,
    'Dumbbell': Dumbbell,
    'Flame': Flame,
    'Heart': Heart,
    'Play': Play,
    'Rocket': Rocket,
    'Sparkles': Sparkles,
    'Star': Star,
    'Target': Target,
    'Trophy': Trophy,
    'Zap': Zap,
  };

  const IconComponent = IconMap[iconName] || ArrowRight;
  return <IconComponent size={28} className="text-white" />;
};

/**
 * Transform WordPress feature data to React component format
 * Following Personal Training pattern for data transformation
 */
const transformWordPressFeature = (wpFeature: WordPressTrainingFeature): TrainingFeature => {
  return {
    icon: getIconComponent(wpFeature.icon.type, wpFeature.icon.name),
    title: wpFeature.title,
    description: wpFeature.description,
    gradient: wpFeature.gradientClass,
    flipFront: wpFeature.flipCard.frontText,
    media: wpFeature.videoUrl ? {
      type: 'video' as const,
      src: wpFeature.videoUrl,
      poster: wpFeature.videoPoster,
      alt: wpFeature.title,
      fallbackSrc: []
    } : wpFeature.imageUrl ? {
      type: 'image' as const,
      src: wpFeature.imageUrl,
      alt: wpFeature.title
    } : undefined,
    flipBack: {
      title: wpFeature.flipCard.backTitle,
      details: wpFeature.flipCard.backDetails ? wpFeature.flipCard.backDetails.split('|') : []
    },
    cta: wpFeature.cta && wpFeature.cta.text && wpFeature.cta.url ? {
      text: wpFeature.cta.text,
      url: wpFeature.cta.url
    } : undefined
  };
};

/**
 * Default Training Features component for the homepage
 */
const TrainingFeatures: React.FC<DefaultVariantProps> = (props) => {
  const {
    features: customFeatures,
    sectionTitle: propSectionTitle,
    sectionDescription: propSectionDescription,
    sectionTagText = "Premium Experience",
    variant = 'default',
    className = '',
  } = props;

  // ===== WORDPRESS DATA STATE MANAGEMENT =====
  const [featuresData, setFeaturesData] = useState<TrainingFeature[]>([]);
  const [settings, setSettings] = useState<TrainingFeaturesSettings>({
    sectionTitle: "Comprehensive Training Features",
    sectionDescription: "Our training platform includes everything you need to succeed on your fitness journey, from cutting-edge tools to personalized support.",
    gridColumns: 3,
    cardStyle: 'default',
    showDifficulty: false,
    showDuration: false,
    enableAnimations: true,
    // CTA Settings defaults
    ctaEnabled: false,
    ctaTitle: '',
    ctaSubtitle: '',
    ctaButtonText: 'Explore Features',
    ctaButtonUrl: '',
    ctaBackgroundColor: '#8b5cf6', // Violet gradient default
    ctaTextColor: '#ffffff',
    ctaIconType: 'lucide',
    ctaLucideIcon: 'ArrowRight',
    ctaLogoUrl: ''
  });
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [dataSource, setDataSource] = useState<DataSource>('none');

  // ===== WORDPRESS DATA LOADING HOOK =====
  // Following Personal Training pattern exactly
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.fitcopilotTrainingFeaturesData) {
        const wpData = window.fitcopilotTrainingFeaturesData;
        
        logger.info('✅ WordPress Training Features data found:', wpData);
        
        if (wpData.features && wpData.features.length > 0) {
          logger.info('✅ Processing features data:', wpData.features);
          
          const transformedFeatures = wpData.features.map(transformWordPressFeature);
          
          logger.info('✅ Transformed features for frontend:', transformedFeatures);
          
          setFeaturesData(transformedFeatures);
          setSettings(wpData.settings || settings);
          setDataSource('wordpress');
          setLoadingState('success');
        } else {
          logger.warn('⚠️ WordPress data exists but no features found');
          setLoadingState('error');
        }
      } else {
        logger.warn('⚠️ No WordPress Training Features data found, using defaults');
        setLoadingState('error');
      }
    } catch (error) {
      logger.error('❌ Error loading training features data:', error);
      setLoadingState('error');
    }
  }, []);

  // Floating icons data - similar to Features section
  const floatingIcons = [
    { Icon: Dumbbell, size: 24, left: 5, top: 15, delay: 0, speed: 8 },
    { Icon: Timer, size: 32, left: 15, top: 60, delay: 1.5, speed: 10 },
    { Icon: Medal, size: 28, left: 25, top: 25, delay: 0.8, speed: 12 },
    { Icon: Flame, size: 36, left: 80, top: 20, delay: 2, speed: 9 },
    { Icon: Heart, size: 28, left: 85, top: 65, delay: 1, speed: 11 },
    { Icon: Apple, size: 24, left: 10, top: 80, delay: 2.5, speed: 10 },
    { Icon: Coffee, size: 20, left: 70, top: 10, delay: 0.5, speed: 7 },
    { Icon: Footprints, size: 32, left: 90, top: 40, delay: 1.2, speed: 9 },
    { Icon: Bike, size: 36, left: 30, top: 70, delay: 1.8, speed: 13 }
  ];

  // Default training features data (fallback)
  const defaultFeatures: TrainingFeature[] = [
    {
      icon: <Video size={24} className="text-gray-900" />,
      title: "Live Virtual Sessions",
      description: "Real-time coaching and feedback from anywhere in the world.",
      gradient: "from-lime-300 to-emerald-400",
      flipFront: "Get expert coaching from anywhere with our high-quality video platform.",
      media: {
        type: 'video',
        src: '/wp-content/themes/fitcopilot/src/features/Homepage/TrainingFeatures/media/videos/Drone Video 3.mp4',
        poster: '/wp-content/themes/fitcopilot/src/features/Homepage/TrainingFeatures/media/videos/drone-video-poster.jpg',
        alt: 'Aerial drone footage showing fitness activities',
        fallbackSrc: [
          {
            src: '/wp-content/themes/fitcopilot/src/features/Homepage/TrainingFeatures/media/videos/Drone Video 3.webm',
            type: 'video/webm'
          }
        ]
      },
      flipBack: {
        title: "Live Virtual Session",
        details: [
          "HD video with crystal clear audio",
          "Screen sharing for technique analysis",
          "Record sessions for later review",
          "Works on any device"
        ]
      }
    },
    {
      icon: <Calendar size={24} className="text-gray-900" />,
      title: "Flexible Scheduling",
      description: "Book sessions when it works for you with easy rescheduling.",
      gradient: "from-cyan-300 to-blue-400",
      flipFront: "Life gets busy. Our flexible scheduling adapts to your changing needs.",
      media: {
        type: 'image',
        src: '/assets/features/calendar.jpg',
        alt: 'Calendar scheduling interface showing workout appointments'
      },
      flipBack: {
        title: "Smart Calendar",
        details: [
          "24/7 online booking system",
          "Automated reminders and notifications",
          "Easy rescheduling with no fees",
          "Time zone intelligent"
        ]
      }
    },
    {
      icon: <BarChart size={24} className="text-gray-900" />,
      title: "Progress Tracking",
      description: "Detailed metrics and benchmarks to visualize your improvement.",
      gradient: "from-violet-300 to-purple-400",
      flipFront: "Track every aspect of your fitness journey with intuitive visualizations.",
      media: {
        type: 'image',
        src: '/assets/features/progress-tracking.jpg',
        alt: 'Fitness progress dashboard with charts and metrics'
      },
      flipBack: {
        title: "Data Insights",
        details: [
          "Custom progress dashboards",
          "Performance trend analysis",
          "Goal achievement tracking",
          "Body composition metrics"
        ]
      }
    },
    {
      icon: <MessageSquare size={24} className="text-gray-900" />,
      title: "Continuous Support",
      description: "Direct messaging with your trainer between sessions.",
      gradient: "from-amber-300 to-orange-400",
      flipFront: "Questions between sessions? Your trainer is just a message away.",
      media: {
        type: 'image',
        src: '/assets/features/support.jpg',
        alt: 'Trainer and client messaging interface'
      },
      flipBack: {
        title: "Always Connected",
        details: [
          "Encrypted private messaging",
          "Share photos and videos for form checks",
          "Quick response time guarantee",
          "Access to knowledge base"
        ]
      }
    },
    {
      icon: <Download size={24} className="text-gray-900" />,
      title: "Custom Workouts",
      description: "Personalized training plans designed for your specific goals.",
      gradient: "from-lime-300 to-emerald-400",
      flipFront: "Every workout is designed specifically for your body, goals, and equipment.",
      media: {
        type: 'image',
        src: '/assets/features/custom-workout.jpg',
        alt: 'Customized workout plan'
      },
      flipBack: {
        title: "Tailored Programs",
        details: [
          "AI-assisted program design",
          "Adapts to your progress rate",
          "Equipment-flexible options",
          "Recovery-optimized scheduling"
        ]
      }
    },
    {
      icon: <Smartphone size={24} className="text-gray-900" />,
      title: "Mobile Experience",
      description: "Access your training plan and resources on any device.",
      gradient: "from-cyan-300 to-blue-400",
      flipFront: "Your entire fitness plan in your pocket, accessible anywhere and anytime.",
      media: {
        type: 'image',
        src: '/assets/features/mobile.jpg',
        alt: 'Mobile app interface showing workout details'
      },
      flipBack: {
        title: "Mobile-First Design",
        details: [
          "Works offline for gym usage",
          "Exercise video library",
          "Voice-guided workouts",
          "Wearable device integration"
        ]
      }
    }
  ];

  // ===== DATA SELECTION LOGIC =====
  // Priority: customFeatures > WordPress data > default fallback
  const getTrainingFeatures = (): TrainingFeature[] => {
    if (customFeatures && customFeatures.length > 0) {
      return customFeatures;
    }
    
    if (dataSource === 'wordpress' && featuresData.length > 0) {
      return featuresData;
    }
    
    return defaultFeatures;
  };

  const trainingFeatures = getTrainingFeatures();

  // ===== SETTINGS RESOLUTION =====
  // Use prop values if provided, otherwise WordPress settings, otherwise defaults
  const resolvedSectionTitle = propSectionTitle || settings.sectionTitle || "Comprehensive Training Features";
  const resolvedSectionDescription = propSectionDescription || settings.sectionDescription || "Our training platform includes everything you need to succeed on your fitness journey, from cutting-edge tools to personalized support.";

  // ===== LOADING STATE HANDLING =====
  if (loadingState === 'loading') {
    return (
      <section className={`training-features-section w-full py-16 md:pt-8 md:pb-24 px-4 relative overflow-hidden ${className}`}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-lime-300 rounded w-32 mx-auto mb-4"></div>
              <div className="h-12 bg-white/20 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-400 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`training-features-section w-full py-16 md:pt-8 md:pb-24 px-4 relative overflow-hidden ${className}`}
      data-theme={variant}
      data-source={dataSource}
      id="training-features"
    >
      {/* Create a visual connector from previous section */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background-primary to-transparent z-0"></div>

      {/* Floating fitness icons - decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {floatingIcons.map((icon, index) => (
          <FloatingIcon
            key={index}
            left={icon.left}
            top={icon.top}
            delay={icon.delay}
            speed={icon.speed}
          >
            <icon.Icon size={icon.size} />
          </FloatingIcon>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">{sectionTagText}</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">{resolvedSectionTitle}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{resolvedSectionDescription}</p>
        </div>

        {/* Features List */}
        <div className="space-y-8">
          {trainingFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              variant={variant}
            />
          ))}
        </div>

        {/* Footer CTA - Using WordPress settings or TrainingFeaturesCTA component */}
        {settings.ctaEnabled ? (
          <div className="text-center mt-16">
            <div 
              className="bg-gradient-to-r from-violet-500/30 to-purple-600/30 rounded-2xl p-12 md:p-16 border border-violet-400/30"
              style={{
                background: settings.ctaBackgroundColor 
                  ? `linear-gradient(to right, ${settings.ctaBackgroundColor}30, ${settings.ctaBackgroundColor}40)` 
                  : 'linear-gradient(to right, rgb(139 92 246 / 0.3), rgb(147 51 234 / 0.3))',
                color: settings.ctaTextColor || '#ffffff'
              }}
            >
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-violet-400 rounded-full flex items-center justify-center">
                  {renderCTAIcon(settings)}
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-6">
                {settings.ctaTitle || 'Ready to Get Started?'}
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                {settings.ctaSubtitle || 'Discover all the features that will help you achieve your fitness goals.'}
              </p>
              <div className="mt-4">
                <TrainingFeaturesCTA
                  onNavigate={(featureType: string) => {
                    if (settings.ctaButtonUrl) {
                      window.location.href = settings.ctaButtonUrl;
                    } else {
                      logger.info('Navigate to:', featureType);
                    }
                  }}
                  variant={variant}
                  size="large"
                  contextType="explore"
                  customText={settings.ctaButtonText}
                  href={settings.ctaButtonUrl}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-16">
            <TrainingFeaturesCTA
              onNavigate={(featureType: string) => {
                logger.info('Navigate to:', featureType);
                // Add actual navigation logic here
              }}
              variant={variant}
              size="large"
              contextType="explore"
              featureTitle="All Features"
            />
          </div>
        )}

        {/* Debug Information (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-black/20 rounded-lg text-xs text-gray-400">
            <strong>🔧 Debug Info:</strong> Data Source: {dataSource} | 
            Features Count: {trainingFeatures.length} | 
            Loading State: {loadingState} |
            WordPress Data Available: {typeof window !== 'undefined' && !!window.fitcopilotTrainingFeaturesData ? 'Yes' : 'No'}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrainingFeatures; 