import {
    Award,
    Calendar,
    Dumbbell,
    Heart,
    RefreshCw,
    User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import MediaContainer from '../../components/MediaContainer';
import { PersonalTrainingCTA } from '../../components/PersonalTrainingCTA';
import '../../PersonalTraining.scss';
import { PersonalTrainingProps, Trainer } from '../../types';

// Define the expected shape of the WordPress data
interface WordPressVideoData {
    personalTraining?: {
        featuredTrainer?: {
            url: string;
            title: string;
            image: string;
        }
    }
}

// Access the global WordPress data (declared in window)
declare global {
    interface Window {
        fitcopilotVideoData?: WordPressVideoData;
    }
}

/**
 * Sports variant of the Personal Training component
 */
const PersonalTraining: React.FC<PersonalTrainingProps> = ({ trainers: propTrainers }) => {
  // State to store WordPress video data
  const [wordpressVideoData, setWordpressVideoData] = useState<WordPressVideoData | null>(null);

  // Load WordPress video data on mount
  useEffect(() => {
    if (window.fitcopilotVideoData) {
      setWordpressVideoData(window.fitcopilotVideoData);
    }
  }, []);

  // Trainer data
  const trainers: Trainer[] = propTrainers || [
    {
      id: 'trainer1',
      name: 'Alex Rodriguez',
      specialty: 'Strength Training',
      specialtyIcon: <Dumbbell size={16} />,
      image: 'https://plus.unsplash.com/premium_photo-1661359682704-f17a7e38cbff?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bio: 'Specialized in muscle building and strength conditioning with 8+ years of experience.',
      clients: 120,
      years: 8,
      featured: true,
      videoCard: {
        title: wordpressVideoData?.personalTraining?.featuredTrainer?.title || 'Strength Training Introduction',
        image: wordpressVideoData?.personalTraining?.featuredTrainer?.image || 'https://plus.unsplash.com/premium_photo-1661359682704-f17a7e38cbff?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoUrl: wordpressVideoData?.personalTraining?.featuredTrainer?.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    },
    {
      id: 'trainer2',
      name: 'Sarah Johnson',
      specialty: 'Cardio & HIIT',
      specialtyIcon: <Heart size={16} />,
      image: 'https://images.unsplash.com/photo-1658203897339-989718522126?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bio: 'Expert in high-intensity interval training and cardiovascular fitness programs.',
      clients: 95,
      years: 6,
      featured: false,
      videoCard: {
        title: 'HIIT Workout Demo',
        image: 'https://images.unsplash.com/photo-1658203897339-989718522126?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    },
    {
      id: 'trainer3',
      name: 'Michael Chen',
      specialty: 'Functional Training',
      specialtyIcon: <RefreshCw size={16} />,
      image: 'https://images.unsplash.com/photo-1652880042886-cdb6cebb9ab5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bio: 'Focuses on building practical strength for everyday activities, improving mobility and balance.',
      clients: 85,
      years: 7,
      featured: false,
      videoCard: {
        title: 'Functional Training Basics',
        image: 'https://images.unsplash.com/photo-1652880042886-cdb6cebb9ab5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    },
    {
      id: 'trainer4',
      name: 'Emily Wilson',
      specialty: 'Nutrition Coaching',
      specialtyIcon: <Award size={16} />,
      image: 'https://images.unsplash.com/photo-1559595500-c747065f4cd9?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bio: 'Certified nutrition specialist helping clients transform their health through personalized meal plans.',
      clients: 110,
      years: 5,
      featured: false,
      videoCard: {
        title: 'Nutrition Fundamentals',
        image: 'https://images.unsplash.com/photo-1559595500-c747065f4cd9?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    }
  ];

  return (
    <section className="personal-training-section personal-training-section--sports py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">Our <span className="highlight">Professional Trainers</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our certified trainers are here to help you achieve your fitness goals with personalized programs and expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map(trainer => (
            <div key={trainer.id} className="trainer-card bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Trainer Image */}
              <div className="trainer-image h-64">
                {trainer.image ? (
                  <img
                    src={trainer.image}
                    alt={`${trainer.name}, ${trainer.specialty}`}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className="image-placeholder">
                    <User size={50} />
                  </div>
                )}
              </div>

              {/* Trainer Info */}
              <div className="p-6">
                <div className="specialty mb-2">
                  <span className="icon">{trainer.specialtyIcon}</span>
                  {trainer.specialty}
                </div>
                <h3 className="trainer-name">{trainer.name}</h3>
                <p className="trainer-bio">{trainer.bio}</p>

                {/* Trainer Stats */}
                <div className="trainer-stats my-4">
                  <div className="stat">
                    <span className="value">{trainer.clients}+</span>
                    <span className="label">Happy Clients</span>
                  </div>
                  <div className="stat">
                    <span className="value">{trainer.years}+</span>
                    <span className="label">Years Experience</span>
                  </div>
                </div>
              </div>

              {/* Video Card (if applicable) */}
              {trainer.videoCard?.videoUrl && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <h4 className="text-sm font-semibold mb-2 text-gray-900">{trainer.videoCard.title || "Watch Training Sample"}</h4>

                  <div className="aspect-video relative rounded overflow-hidden bg-gray-200">
                    <MediaContainer
                      src={trainer.videoCard.videoUrl || ''}
                      type="video"
                      poster={trainer.image || undefined}
                      muted={false}
                      autoPlay={false}
                      controls={true}
                      loop={false}
                      alt={`${trainer.name} training video`}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Consultation CTA */}
        <div className="booking-box bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg p-8 mt-16 max-w-4xl mx-auto text-center shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Fitness?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Schedule a free consultation session with one of our expert trainers. We'll create a personalized plan to help you reach your goals.
          </p>
          <PersonalTrainingCTA
            text="Book Your Consultation"
            coachType="performance"
            buttonSize="large"
            variant="sports"
          />
          {/* Date selection hint */}
          <p className="text-sm text-white/70 mt-4 flex items-center justify-center">
            <Calendar size={16} className="mr-2" />
            Next available appointment: Tomorrow at 10:00 AM
          </p>
        </div>
      </div>
    </section>
  );
};

export default PersonalTraining; 