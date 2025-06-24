import {
    Award,
    Dumbbell,
    Heart,
    User,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import MediaContainer from './components/MediaContainer';
import { PersonalTrainingCTA } from './components/PersonalTrainingCTA';
import {
    AthleteDashboardData,
    DataSource,
    PersonalTrainingSettings,
    Trainer,
    WordPressTrainer
} from './interfaces';
import './PersonalTraining.scss';
import { PersonalTrainingProps } from './types';
import { getCoachSpecialtyClass } from './utils/themeUtils';

// Helper function to get specialty icon
const getSpecialtyIcon = (specialty: string) => {
  if (specialty.toLowerCase().includes('strength') || specialty.toLowerCase().includes('conditioning')) {
    return <Dumbbell size={14} />;
  }
  if (specialty.toLowerCase().includes('nutrition') || specialty.toLowerCase().includes('weight')) {
    return <Heart size={14} />;
  }
  if (specialty.toLowerCase().includes('performance') || specialty.toLowerCase().includes('athletic')) {
    return <Award size={14} />;
  }
  if (specialty.toLowerCase().includes('group') || specialty.toLowerCase().includes('class')) {
    return <Users size={14} />;
  }
  return <User size={14} />;
};

const PersonalTraining: React.FC<PersonalTrainingProps> = ({ trainers: propTrainers, variant = 'default' }) => {
  const [trainerData, setTrainerData] = useState<Trainer[]>([]);
  const [settings, setSettings] = useState<PersonalTrainingSettings>({
    section_title: "Personal Training",
    section_subtitle: "Work with our certified trainers to achieve your fitness goals with personalized workout plans and expert guidance.",
    show_featured_trainer: true,
    show_group_instructor: true,
    max_display_count: -1,
    cta_enabled: false,
    cta_title: '',
    cta_subtitle: '',
    cta_button_text: '',
    cta_button_url: '',
    cta_background_color: '',
    cta_text_color: '',
    cta_icon_type: 'lucide',
    cta_lucide_icon: 'Users',
    cta_logo_url: ''
  });
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error'>('loading');
  const [dataSource, setDataSource] = useState<DataSource>('none');

  // Load WordPress data on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.fitcopilotPersonalTrainingData) {
        const wpData = window.fitcopilotPersonalTrainingData;
        
        if (wpData.trainers && wpData.trainers.length > 0) {
          console.log('✅ Processing trainers data:', wpData.trainers);
          
          const formattedTrainers = wpData.trainers.map((trainer: WordPressTrainer) => ({
            id: trainer.id.toString(),
            name: trainer.name,
            image: trainer.image_url || "/assets/trainers/trainer-placeholder.jpg",
            specialty: trainer.specialty,
            specialtyIcon: getSpecialtyIcon(trainer.specialty),
            bio: trainer.bio,
            years: trainer.years_experience,
            clients: trainer.clients_count,
            featured: trainer.featured,
            videoCard: trainer.video_url ? {
              title: trainer.video_title || "Training Demo",
              image: trainer.video_poster || "/assets/trainers/workout-demo.jpg",
              videoUrl: trainer.video_url
            } : undefined
          }));
          
          console.log('✅ Formatted trainers for frontend:', formattedTrainers);
          
          setTrainerData(formattedTrainers);
          setSettings(wpData.settings || settings);
          setDataSource('wordpress');
          setLoadingState('success');
        } else {
          setLoadingState('error');
        }
      } else {
        setLoadingState('error');
      }
    } catch (error) {
      console.error('Error loading trainer data:', error);
      setLoadingState('error');
    }
  }, []);

  // Get video details from WordPress data or use fallbacks
  const getVideoDetails = () => {
    // Get video details from WordPress data with fallbacks
    let wpVideoUrl, wpVideoTitle, wpVideoImage;
    if (
      window.athleteDashboardData &&
      window.athleteDashboardData.wpData &&
      'videoData' in window.athleteDashboardData.wpData
    ) {
      const wpData = window.athleteDashboardData.wpData as AthleteDashboardData['wpData'];
      const personalTrainingVideo = wpData.videoData?.personalTraining;
      if (personalTrainingVideo && 'url' in personalTrainingVideo) {
        const video = personalTrainingVideo as { url: string; title: string; image: string };
        wpVideoUrl = video.url;
        wpVideoTitle = video.title;
        wpVideoImage = video.image;
      }
    }

    // Get video details from registration data (secondary source)
    let athleteVideoUrl, athleteVideoTitle, athleteVideoImage;
    if (
      window.athleteDashboardData &&
      window.athleteDashboardData.wpData &&
      'videoData' in window.athleteDashboardData.wpData
    ) {
      const wpData = window.athleteDashboardData.wpData as AthleteDashboardData['wpData'];
      const featuredTrainer = wpData.videoData?.personalTraining?.featuredTrainer;
      if (featuredTrainer) {
        athleteVideoUrl = featuredTrainer.url;
        athleteVideoTitle = featuredTrainer.title;
        athleteVideoImage = featuredTrainer.image;
      }
    }

    // Return the best available values, with fallbacks
    return {
      url: wpVideoUrl || athleteVideoUrl || "https://www.youtube.com/embed/L27wfHkk2O8",
      title: wpVideoTitle || athleteVideoTitle || "High-Intensity Workout Demo",
      image: wpVideoImage || athleteVideoImage || "/assets/trainers/workout-demo.jpg"
    };
  };

  // Filter trainers by settings
  const activeTrainers = trainerData.filter(trainer => {
    // Show all trainers, not just featured ones
    if (settings.max_display_count && settings.max_display_count > 0 && trainerData.length > settings.max_display_count) {
      return trainerData.indexOf(trainer) < settings.max_display_count;
    }
    return true;
  });

  // Render CTA icon based on admin settings
  const renderCTAIcon = () => {
    const iconType = settings.cta_icon_type || 'lucide';
    const iconName = settings.cta_lucide_icon || 'Users';
    const logoUrl = settings.cta_logo_url;

    if (iconType === 'none') {
      return null;
    }

    if (iconType === 'logo' && logoUrl) {
      return (
        <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-violet-500/20">
          <img 
            src={logoUrl} 
            alt="CTA Logo" 
            className="w-8 h-8 object-contain"
            loading="lazy"
          />
        </div>
      );
    }

    // Default to Lucide icon
    const getLucideIcon = (name: string) => {
      // Common fitness and CTA icons - map to SVG paths
      const iconPaths: { [key: string]: string } = {
        'Users': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
        'User': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
        'UserCheck': 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M10.5 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11l2 2 4-4',
        'Zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
        'Target': 'M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10zM8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
        'Trophy': 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M6 18H5.5a2.5 2.5 0 0 1 0-5H6M18 18h1.5a2.5 2.5 0 0 0 0-5H18M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M6 18H5.5a2.5 2.5 0 0 1 0-5H6M18 18h1.5a2.5 2.5 0 0 0 0-5H18M8 21l4-7 4 7M8 3l4 7 4-7',
        'Star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        'Heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
        'Activity': 'M22 12h-4l-3 9L9 3l-3 9H2',
        'Award': 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12M22 9l-9-7-9 7 2.25 14.5L12 19l5.75 4.5L22 9z',
        'CheckCircle': 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
        'Play': 'M8 5v14l11-7z',
        'ArrowRight': 'M5 12h14M12 5l7 7-7 7',
        'ChevronRight': 'M9 18l6-6-6-6',
        'Calendar': 'M3 9h18M7 3v4M17 3v4M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
        'Clock': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2',
        'MessageCircle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
        'Phone': 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
        'Mail': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
        'MapPin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
        'Dumbbell': 'M6.5 6.5h.01M17.5 6.5h.01M6.5 17.5h.01M17.5 17.5h.01M3 12h3M18 12h3M8 8v8M16 8v8',
        'Flame': 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
        'Rocket': 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M15 9v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
        'Sparkles': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0L9.937 15.5z'
      };

      return iconPaths[name] || iconPaths['Users']; // Fallback to Users icon
    };

    return (
      <div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getLucideIcon(iconName)} />
        </svg>
      </div>
    );
  };

  // SIMPLE LOGIC: Show trainers if we have them, loading if we don't
  if (trainerData.length === 0) {
    return (
      <div className="text-center text-white py-20">
        <p>Loading trainers...</p>
      </div>
    );
  }

  // Show error state only for actual errors
  if (loadingState === 'error') {
    return (
      <div className="text-center text-white py-20">
        <p>Unable to load trainer information. Please try again later.</p>
      </div>
    );
  }

  // Main component render - TRAINERS WILL SHOW
  return (
    <section className="personal-training-section w-full py-20 px-4 bg-gray-900" data-source={dataSource}>
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-violet-300 mb-2 block">
            Expert Coaching
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {settings.section_title?.split(' ')[0] || 'Personal'}{' '}
            <span className="bg-gradient-to-r from-violet-300 to-indigo-400 text-transparent bg-clip-text">
              {settings.section_title?.split(' ').slice(1).join(' ') || 'Trainers'}
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {settings.section_subtitle}
          </p>
        </div>

        {/* Trainers grid */}
        <div className="trainers-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {activeTrainers.map((trainer) => (
            <div
              key={trainer.id}
              className={`trainer-card bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transition-all duration-300 hover:transform hover:scale-105 hover:border-violet-400/50 ${
                trainer.featured ? 'lg:col-span-2 featured-trainer' : ''
              }`}
            >
              {/* Trainer image */}
              <div className="text-center mb-4">
                {trainer.image && !trainer.image.includes('assets/trainers') ? (
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-gray-600"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-lg font-bold">
                      {trainer.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Specialty tag */}
              <div className="text-center mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCoachSpecialtyClass(trainer.specialty)}`}>
                  {trainer.specialtyIcon}
                </span>
              </div>

              {/* Trainer name */}
              <h3 className="text-xl font-bold text-white text-center mb-3">
                {trainer.name}
              </h3>

              {/* Bio */}
              <p className="text-gray-300 text-sm text-center mb-4 line-clamp-3">
                {trainer.bio}
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {trainer.years}
                  </div>
                  <div className="text-xs text-gray-400">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {trainer.clients}+
                  </div>
                  <div className="text-xs text-gray-400">Clients</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center mb-4">
                <PersonalTrainingCTA 
                  text="Get Started" 
                  variant={variant}
                />
              </div>

              {/* Featured trainer video */}
              {trainer.videoCard && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3 text-center">
                    {trainer.videoCard.title}
                  </h4>
                  <MediaContainer
                    src={trainer.videoCard.videoUrl || ''}
                    type="video"
                    poster={trainer.videoCard.image || undefined}
                    muted={false}
                    autoPlay={false}
                    controls={true}
                    loop={false}
                    alt={`${trainer.name} training video`}
                    className="rounded-lg overflow-hidden"
                    aspectRatio="16/9"
                    theme="default"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Team CTA section - Admin Controlled Content */}
        {settings.cta_enabled && (
          <div className="text-center max-w-4xl mx-auto mt-16">
            <div 
              className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-2xl p-8 border border-violet-400/20"
              style={{
                backgroundColor: settings.cta_background_color ? `${settings.cta_background_color}20` : undefined,
                color: settings.cta_text_color || '#ffffff'
              }}
            >
              <div className="flex justify-center mb-6">
                {renderCTAIcon()}
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {settings.cta_title || 'Ready to Start Your Fitness Journey?'}
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                {settings.cta_subtitle || 'Our expert trainers are here to guide you every step of the way. Whether you\'re just starting out or looking to reach new heights, we\'ll create a personalized plan that fits your goals and lifestyle.'}
              </p>
              <PersonalTrainingCTA 
                text={settings.cta_button_text || 'Book Your Free Consultation'}
                href={settings.cta_button_url || '#contact'}
                variant={variant}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PersonalTraining; 