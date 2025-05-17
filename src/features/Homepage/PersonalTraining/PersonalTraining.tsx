/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowRight,
  Award,
  Dumbbell,
  Heart,
  User,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '../../../context/ThemeContext';
import logger from '../../../utils/logger';
import MediaContainer from './components/MediaContainer';
import PersonalTrainingButton from './components/PersonalTrainingButton';
import './PersonalTraining.scss';
import { PersonalTrainingProps, Trainer, WordPressVideoData } from './types';
import { getCoachSpecialtyClass, mapCoachTypeToTheme } from './utils/themeUtils';

/**
 * Default Personal Training component for the homepage
 */
const PersonalTraining: React.FC<PersonalTrainingProps> = ({ trainers: propTrainers, variant = 'default' }) => {
  // State to store WordPress video data
  const [wordpressVideoData, setWordpressVideoData] = useState<WordPressVideoData | null>(null);

  // Load WordPress video data on mount
  useEffect(() => {
    // Check both potential data sources
    if (window.fitcopilotVideoData) {
      setWordpressVideoData(window.fitcopilotVideoData);
      logger.debug('WordPress video data loaded from fitcopilotVideoData:', window.fitcopilotVideoData);
    }
    else {
      logger.debug('No WordPress video data found');
      logger.debug('Debug - window.athleteDashboardData:', window.athleteDashboardData);
      if (window.athleteDashboardData?.wpData) {
        logger.debug('Debug - window.athleteDashboardData.wpData:', window.athleteDashboardData.wpData);
      }
    }
  }, []);

  // Get video details from WordPress data or use fallbacks
  const getVideoDetails = () => {
    // Try to get from wordpress data
    const wpVideoUrl = wordpressVideoData?.personalTraining?.featuredTrainer?.url;
    const wpVideoTitle = wordpressVideoData?.personalTraining?.featuredTrainer?.title;
    const wpVideoImage = wordpressVideoData?.personalTraining?.featuredTrainer?.image;

    // Type guard for athleteDashboardData.wpData.videoData
    let athleteVideoUrl, athleteVideoTitle, athleteVideoImage;
    if (
      window.athleteDashboardData &&
            window.athleteDashboardData.wpData &&
            'videoData' in window.athleteDashboardData.wpData &&
            (window.athleteDashboardData.wpData as any).videoData.personalTraining?.featuredTrainer
    ) {
      const videoData = (window.athleteDashboardData.wpData as any).videoData;
      athleteVideoUrl = videoData.personalTraining.featuredTrainer.url;
      athleteVideoTitle = videoData.personalTraining.featuredTrainer.title;
      athleteVideoImage = videoData.personalTraining.featuredTrainer.image;
    }

    // Return the best available values, with fallbacks
    return {
      url: wpVideoUrl || athleteVideoUrl || "https://www.youtube.com/embed/L27wfHkk2O8",
      title: wpVideoTitle || athleteVideoTitle || "High-Intensity Workout Demo",
      image: wpVideoImage || athleteVideoImage || "/assets/trainers/workout-demo.jpg"
    };
  };

  // Default trainer data if none provided
  const trainers: Trainer[] = propTrainers || [
    {
      id: "trainer-1",
      name: "Justin Fassio",
      image: "/assets/trainers/trainer1.jpg",
      specialty: "Strength & Conditioning",
      specialtyIcon: <Dumbbell size={14} />,
      bio: "Specialized in transforming physiques through science-based training protocols. Alex has helped over 200 clients achieve their fitness goals.",
      years: 8,
      clients: 178,
      featured: true,
      videoCard: {
        title: getVideoDetails().title,
        image: getVideoDetails().image,
        videoUrl: getVideoDetails().url
      }
    },
    {
      id: "trainer-2",
      name: "Morgan Chen",
      image: "/assets/trainers/trainer2.jpg",
      specialty: "Nutrition & Weight Loss",
      specialtyIcon: <Heart size={14} />,
      bio: "Certified nutritionist and weight management specialist. Morgan creates personalized diet plans that complement your training regimen.",
      years: 6,
      clients: 152,
      featured: false
    },
    {
      id: "trainer-3",
      name: "Jordan Smith",
      image: "/assets/trainers/trainer3.jpg",
      specialty: "Athletic Performance",
      specialtyIcon: <Award size={14} />,
      bio: "Former professional athlete who now trains competitors at all levels. Specializes in sport-specific training and performance enhancement.",
      years: 10,
      clients: 215,
      featured: false
    }
  ];

  // Find featured trainer
  const featuredTrainer = trainers.find(trainer => trainer.featured);
  const regularTrainers = trainers.filter(trainer => !trainer.featured);

  // Get coach type from specialty for button styling
  const getCoachType = (specialty: string): 'strength' | 'nutrition' | 'performance' | 'recovery' => {
    if (specialty.toLowerCase().includes('strength') || specialty.toLowerCase().includes('conditioning')) {
      return 'strength';
    }
    if (specialty.toLowerCase().includes('nutrition') || specialty.toLowerCase().includes('weight')) {
      return 'nutrition';
    }
    if (specialty.toLowerCase().includes('performance') || specialty.toLowerCase().includes('athletic')) {
      return 'performance';
    }
    return 'strength'; // Default
  };

  return (
    <section className="personal-training-section w-full py-20 px-4 bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-violet-300 mb-2 block">Expert Coaching</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Personal <span className="bg-gradient-to-r from-violet-300 to-indigo-400 text-transparent bg-clip-text">Trainers</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Work directly with our certified fitness professionals who will create custom training programs tailored to your specific goals and needs.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {/* Featured Trainer */}
          {featuredTrainer && (
            <div
              key={featuredTrainer.id}
              className="trainer-card col-span-1 md:col-span-2 row-span-1"
            >
              {/* Trainer Image */}
              <div className="trainer-image">
                {featuredTrainer.image && !featuredTrainer.image.includes('assets/trainers') ? (
                  <img
                    src={featuredTrainer.image}
                    alt={featuredTrainer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-white opacity-70" />
                )}
              </div>

              {/* Trainer Specialty Tag */}
              <div className={`trainer-specialty ${getCoachSpecialtyClass(featuredTrainer.specialty)}`}>
                {featuredTrainer.specialtyIcon}
                <span className="ml-1">{featuredTrainer.specialty}</span>
              </div>

              {/* Trainer Info */}
              <h3 className="text-xl font-bold mb-2 text-white">{featuredTrainer.name}</h3>
              <p className="text-gray-400 mb-4">{featuredTrainer.bio}</p>

              {/* Trainer Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <span className="text-2xl font-bold text-violet-400 block mb-1">{featuredTrainer.years}</span>
                  <span className="text-sm text-gray-500">Years Exp</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-violet-400 block mb-1">{featuredTrainer.clients}</span>
                  <span className="text-sm text-gray-500">Clients</span>
                </div>
              </div>

              {/* Action Button with ThemeProvider */}
              <ThemeProvider initialTheme={mapCoachTypeToTheme(getCoachType(featuredTrainer.specialty))}>
                <PersonalTrainingButton
                  variant="primary"
                  size="large"
                  coachType={getCoachType(featuredTrainer.specialty)}
                  rightIcon={<ArrowRight size={18} className="ml-2" />}
                >
                  Schedule Session
                </PersonalTrainingButton>
              </ThemeProvider>

              {/* Video display - direct instead of flip card */}
              {featuredTrainer.videoCard && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-white mb-3">{featuredTrainer.videoCard.title}</h4>
                  <MediaContainer
                    src={featuredTrainer.videoCard.videoUrl || ''}
                    type="video"
                    poster={featuredTrainer.videoCard.image || undefined}
                    muted={false}
                    autoPlay={false}
                    controls={true}
                    loop={false}
                    alt={`${featuredTrainer.name} training video`}
                    className="rounded-lg overflow-hidden"
                    theme="gym"
                    useWordPressData={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* Regular Trainers */}
          {regularTrainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card col-span-1">
              {/* Trainer Image */}
              <div className="trainer-image">
                {trainer.image && !trainer.image.includes('assets/trainers') ? (
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-white opacity-70" />
                )}
              </div>

              {/* Trainer Specialty Tag */}
              <div className={`trainer-specialty ${getCoachSpecialtyClass(trainer.specialty)}`}>
                {trainer.specialtyIcon}
                <span className="ml-1">{trainer.specialty}</span>
              </div>

              {/* Trainer Info */}
              <h3 className="text-xl font-bold mb-2 text-white">{trainer.name}</h3>
              <p className="text-gray-400 mb-4">{trainer.bio}</p>

              {/* Trainer Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <span className="text-2xl font-bold text-violet-400 block mb-1">{trainer.years}</span>
                  <span className="text-sm text-gray-500">Years Exp</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-violet-400 block mb-1">{trainer.clients}</span>
                  <span className="text-sm text-gray-500">Clients</span>
                </div>
              </div>

              {/* Action Button with ThemeProvider */}
              <ThemeProvider initialTheme={mapCoachTypeToTheme(getCoachType(trainer.specialty))}>
                <PersonalTrainingButton
                  variant="primary"
                  size="medium"
                  coachType={getCoachType(trainer.specialty)}
                  rightIcon={<ArrowRight size={16} className="ml-2" />}
                >
                  Schedule Session
                </PersonalTrainingButton>
              </ThemeProvider>
            </div>
          ))}
        </div>

        {/* Team CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-8">
            <Users size={48} className="text-violet-400" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Our Complete <span className="bg-gradient-to-r from-violet-300 to-indigo-400 text-transparent bg-clip-text">Trainer Team</span>
          </h3>
          <p className="text-gray-400 mb-8">
            Browse our full roster of certified fitness professionals. Each trainer has their own specialty, from strength training and nutrition coaching to mobility work and sport-specific performance.
          </p>
          
          {/* Team CTA Button with ThemeProvider */}
          <ThemeProvider initialTheme="gym">
            <PersonalTrainingButton
              variant="secondary"
              size="large"
              rightIcon={<ArrowRight size={18} className="ml-2" />}
            >
              Meet Our Team
            </PersonalTrainingButton>
          </ThemeProvider>
        </div>
      </div>
    </section>
  );
};

export default PersonalTraining; 