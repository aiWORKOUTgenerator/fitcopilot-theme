/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Award,
    Dumbbell,
    Heart,
    User,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import logger from '../../../utils/logger';
import MediaContainer from './components/MediaContainer';
import PersonalTrainingCTA from './components/PersonalTrainingCTA';
import './PersonalTraining.scss';
import { PersonalTrainingProps, Trainer, WordPressVideoData } from './types';
import { getCoachSpecialtyClass } from './utils/themeUtils';



/**
 * Default Personal Training component for the homepage
 */
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
  // State to store WordPress data
  const [trainerData, setTrainerData] = useState<Trainer[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'wordpress' | 'none'>('none');
  const [wordpressVideoData, setWordpressVideoData] = useState<WordPressVideoData | null>(null);

  // Load WordPress data on mount
  useEffect(() => {
    const loadData = () => {
      try {
        // Check for WordPress Personal Training data
        if (typeof window !== 'undefined' && (window as any).fitcopilotPersonalTrainingData) {
          const wpData = (window as any).fitcopilotPersonalTrainingData;
          
          console.log('📊 PersonalTraining WordPress Data:', {
            hasData: !!wpData,
            trainerCount: wpData.trainers?.length || 0,
            settingsKeys: Object.keys(wpData.settings || {}),
            meta: wpData.meta
          });
          
          if (wpData.trainers && wpData.trainers.length > 0) {
            // ✅ WordPress data available
            const formattedTrainers = wpData.trainers.map((trainer: any) => ({
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
            
            setTrainerData(formattedTrainers);
            setSettings(wpData.settings || {});
            setDataSource('wordpress');
            
            console.log(`✅ Loaded ${wpData.trainers.length} active trainers from WordPress`);
            console.log('🔄 Formatted trainer data:', formattedTrainers);
            
            // Log admin state consistency
            if (wpData.meta) {
              console.log(`📈 Data Stats: ${wpData.meta.active_count}/${wpData.meta.total_count} trainers active`);
              console.log(`⏰ Last updated: ${new Date(wpData.meta.last_updated * 1000).toLocaleString()}`);
            }
          } else {
            // ⚠️ WordPress data empty
            console.warn('⚠️ WordPress trainer data empty');
            setTrainerData([]);
            setDataSource('none');
          }
        } else {
          // ⚠️ WordPress data not available
          console.warn('⚠️ WordPress data not found');
          setTrainerData([]);
          setDataSource('none');
        }

        // Still check for video data as before
        if (window.fitcopilotVideoData) {
          setWordpressVideoData(window.fitcopilotVideoData);
          logger.debug('WordPress video data loaded from fitcopilotVideoData:', window.fitcopilotVideoData);
        }
      } catch (error) {
        // 🚨 Error loading data
        console.error('🚨 Error loading PersonalTraining data:', error);
        setTrainerData([]);
        setDataSource('none');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Safe debug logging (only when data changes, not on every render)
  useEffect(() => {
    if (trainerData.length > 0) {
      const featuredCount = trainerData.filter(t => t.featured).length;
      const regularCount = trainerData.filter(t => !t.featured).length;
      
      console.log('🔍 Safe Trainer Debug:', {
        total: trainerData.length,
        featured: featuredCount,
        regular: regularCount,
        allTrainerNames: trainerData.map(t => `${t.name} (featured: ${t.featured}, type: ${typeof t.featured})`)
      });

      // Detailed featured field analysis
      console.log('🔬 Featured Field Analysis:');
      trainerData.forEach(trainer => {
        const featuredValue = trainer.featured as any;
        const isFeatured = featuredValue === true || featuredValue === 'true' || featuredValue === 1 || featuredValue === '1';
        console.log(`  ${trainer.name}: featured=${JSON.stringify(featuredValue)} (${typeof featuredValue}) → ${isFeatured ? 'FEATURED' : 'regular'}`);
      });
      
      // CRITICAL DEBUG: Show actual filtering results
      const featuredTrainer = trainerData.find(trainer => {
        const featured = trainer.featured;
        return !!featured;
      });
      
      const regularTrainers = trainerData.filter(trainer => {
        const featured = trainer.featured;
        return !featured;
      });
      
      console.log('🎯 FILTERING RESULTS:');
      console.log('Featured trainer found:', featuredTrainer ? featuredTrainer.name : 'NONE');
      console.log('Regular trainers:', regularTrainers.map(t => t.name));
      console.log('Expected to render:', (featuredTrainer ? 1 : 0) + regularTrainers.length, 'trainers total');
    }
  }, [trainerData]);

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

  // Loading state
  if (isLoading) {
    return (
      <section className="personal-training-section w-full py-20 px-4 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="loading-spinner">Loading trainers...</div>
          </div>
        </div>
      </section>
    );
  }

  // Use WordPress data - no fallback complexity
  const activeTrainers: Trainer[] = trainerData;

  // If no WordPress data is available, show a clear error state
  if (!activeTrainers || activeTrainers.length === 0) {
    return (
      <section className="personal-training-section w-full py-20 px-4 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Personal Trainers</h2>
            <div className="text-yellow-400 bg-yellow-900/20 border border-yellow-400/20 rounded-lg p-4 max-w-md mx-auto">
              <p className="font-medium">⚠️ No trainer data available</p>
              <p className="text-sm mt-2">Please check the WordPress Personal Training Manager configuration.</p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs mt-2 opacity-75">
                  Data source: {dataSource} | 
                  WordPress data available: {typeof window !== 'undefined' && !!(window as any).fitcopilotPersonalTrainingData ? 'Yes' : 'No'}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // FIXED: Handle multiple featured trainers properly
  const featuredTrainers = activeTrainers.filter(trainer => {
    // Convert to boolean using WordPress/PHP semantics
    const featured = trainer.featured;
    return !!featured; // Simple truthy check like PHP !empty()
  });
  
  const regularTrainers = activeTrainers.filter(trainer => {
    // Convert to boolean using WordPress/PHP semantics 
    const featured = trainer.featured;
    return !featured; // Simple falsy check
  });
  
  // For backwards compatibility: use first featured trainer for the main featured section
  const featuredTrainer = featuredTrainers.length > 0 ? featuredTrainers[0] : null;

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
    if (specialty.toLowerCase().includes('group') || specialty.toLowerCase().includes('class')) {
      return 'performance'; // Group classes get performance styling (energetic amber gradient)
    }
    return 'strength'; // Default
  };

  return (
    <section className="personal-training-section w-full py-20 px-4 bg-gray-900" data-source={dataSource}>
      <div className="container mx-auto px-4">
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info text-center mb-4">
            <small className="text-gray-500">
              Data Source: {dataSource} | Trainers: {activeTrainers.length}
            </small>
          </div>
        )}
        
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

        {/* Trainers Grid - Using Legacy SCSS Layout */}
        <div className="trainers-container" data-trainer-count={activeTrainers.length}>
          {/* All Active Trainers (Featured + Regular) */}
          {activeTrainers.map((trainer) => (
            <div
              key={trainer.id}
              className={`trainer-card ${trainer.featured ? 'featured' : 'regular'}`}
              data-trainer-id={trainer.id}
              data-trainer-name={trainer.name}
            >
              {/* Trainer Image */}
              <div className="trainer-image">
                {trainer.image && !trainer.image.includes('assets/trainers') ? (
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={trainer.featured ? 48 : 40} className="text-white opacity-70" />
                )}
              </div>

              {/* Trainer Specialty Tag */}
              <div className={`trainer-specialty ${getCoachSpecialtyClass(trainer.specialty)}`}>
                {trainer.specialtyIcon}
                <span className="ml-1">{trainer.specialty}</span>
              </div>

              {/* Trainer Info */}
              <h3 className="trainer-name">{trainer.name}</h3>
              <p className="trainer-bio">{trainer.bio}</p>

              {/* Trainer Stats */}
              <div className="trainer-stats">
                <div className="stat-item">
                  <span className="stat-value">{trainer.years}</span>
                  <span className="stat-label">Years Exp</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{trainer.clients}</span>
                  <span className="stat-label">Clients</span>
                </div>
              </div>

              {/* Action Button - Using PersonalTrainingCTA */}
              <PersonalTrainingCTA
                text="Schedule Session"
                coachType={getCoachType(trainer.specialty)}
                buttonSize={trainer.featured ? "large" : "medium"}
                variant={variant}
                data-context={trainer.featured ? "featured-trainer" : "trainer"}
              />

              {/* Video display for featured trainers only */}
              {trainer.featured && trainer.videoCard && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-white mb-3">{trainer.videoCard.title}</h4>
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
                    theme="gym"
                    useWordPressData={true}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Team CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-8">
            <Users size={48} className="text-violet-400" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold team-cta-heading text-white">
            Our Complete <span className="bg-gradient-to-r from-violet-300 to-indigo-400 text-transparent bg-clip-text">Trainer Team</span>
          </h3>
          <p className="text-gray-400 team-cta-description">
            Browse our full roster of certified fitness professionals. Each trainer has their own specialty, from strength training and nutrition coaching to mobility work and sport-specific performance.
          </p>
          
          {/* Team CTA Button - Using PersonalTrainingCTA */}
          <PersonalTrainingCTA
            text="Meet Our Team"
            buttonVariant="secondary"
            variant="gym"
            buttonSize="large"
            coachType="strength"
            data-context="team-cta"
          />
        </div>
      </div>
    </section>
  );
};

export default PersonalTraining; 