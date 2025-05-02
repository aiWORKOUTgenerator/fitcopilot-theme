import {
    ArrowRight,
    Award,
    Dumbbell,
    Heart,
    User,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Button from '../../../components/UI/Button';
import MediaContainer from './components/MediaContainer';
import './PersonalTraining.scss';
import { PersonalTrainingProps, Trainer, WordPressVideoData } from './types';

/**
 * Default Personal Training component for the homepage
 */
const PersonalTraining: React.FC<PersonalTrainingProps> = ({ trainers: propTrainers }) => {
    // State to store WordPress video data
    const [wordpressVideoData, setWordpressVideoData] = useState<WordPressVideoData | null>(null);

    // Load WordPress video data on mount
    useEffect(() => {
        // Check both potential data sources
        if (window.fitcopilotVideoData) {
            setWordpressVideoData(window.fitcopilotVideoData);
            console.log('WordPress video data loaded from fitcopilotVideoData:', window.fitcopilotVideoData);
        }
        // If not found in fitcopilotVideoData, try athleteDashboardData
        else if (window.athleteDashboardData?.wpData?.videoData) {
            const athleteVideoData: WordPressVideoData = {
                personalTraining: window.athleteDashboardData.wpData.videoData.personalTraining
            };
            setWordpressVideoData(athleteVideoData);
            console.log('WordPress video data loaded from athleteDashboardData:', athleteVideoData);
        }
        else {
            console.log('No WordPress video data found');
            console.log('Debug - window.athleteDashboardData:', window.athleteDashboardData);
            if (window.athleteDashboardData?.wpData) {
                console.log('Debug - window.athleteDashboardData.wpData:', window.athleteDashboardData.wpData);
            }
        }
    }, []);

    // Get video details from WordPress data or use fallbacks
    const getVideoDetails = () => {
        // Try to get from wordpress data
        const wpVideoUrl = wordpressVideoData?.personalTraining?.featuredTrainer?.url;
        const wpVideoTitle = wordpressVideoData?.personalTraining?.featuredTrainer?.title;
        const wpVideoImage = wordpressVideoData?.personalTraining?.featuredTrainer?.image;

        // Try athleteDashboardData as a backup
        const athleteVideoUrl = window.athleteDashboardData?.wpData?.videoData?.personalTraining?.featuredTrainer?.url;
        const athleteVideoTitle = window.athleteDashboardData?.wpData?.videoData?.personalTraining?.featuredTrainer?.title;
        const athleteVideoImage = window.athleteDashboardData?.wpData?.videoData?.personalTraining?.featuredTrainer?.image;

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
                            <div className="trainer-specialty">
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

                            {/* Action Button */}
                            <Button
                                variant="violet-indigo"
                                rightIcon={<ArrowRight size={18} />}
                                fullWidth={true}
                                className="mt-auto debug-button-default"
                                themeContext="default"
                            >
                                Schedule Session
                            </Button>

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
                        <div
                            key={trainer.id}
                            className="trainer-card hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 hover:border-violet-300/30 transition-all duration-300"
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
                                    <User size={48} className="text-white opacity-70" />
                                )}
                            </div>

                            {/* Trainer Specialty Tag */}
                            <div className="trainer-specialty">
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

                            {/* Action Button */}
                            <Button
                                variant="violet-indigo"
                                rightIcon={<ArrowRight size={18} />}
                                fullWidth={true}
                                className="mt-auto debug-button-default"
                                themeContext="default"
                            >
                                Schedule Session
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Consultation CTA */}
                <div className="booking-box">
                    <div className="max-w-xl relative z-10">
                        <h3 className="text-3xl font-bold mb-4 text-white">Ready for Personalized Training?</h3>
                        <p className="text-white/80 mb-8">
                            Schedule a free consultation with one of our expert trainers. We'll discuss your goals, fitness level, and create a plan tailored just for you.
                        </p>
                        <Button
                            variant="violet-indigo"
                            rightIcon={<ArrowRight size={20} />}
                            fullWidth={true}
                            themeContext="default"
                            className="debug-button-cta"
                        >
                            Book Consultation
                        </Button>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute right-0 bottom-0 opacity-20 hidden md:block" aria-hidden="true">
                        <Users size={180} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PersonalTraining; 