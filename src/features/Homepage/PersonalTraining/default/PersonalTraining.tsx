import {
    ArrowRight,
    Award,
    Dumbbell,
    Heart,
    Play,
    RefreshCw,
    User,
    X
} from 'lucide-react';
import React, { MouseEvent, useState } from 'react';
import '../PersonalTraining.scss';
import { PersonalTrainingProps, Trainer } from '../types';

/**
 * Custom styled button component specific to Personal Training section
 */
const StyledButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    fullWidth?: boolean;
    variant?: 'primary' | 'cta';
}> = ({ children, onClick, className = '', fullWidth = false, variant = 'primary' }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const primaryStyles = {
        background: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
        color: 'white',
    };

    const ctaStyles = {
        background: 'white',
        color: '#7c3aed',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    };

    const hoverStyles = {
        transform: 'translateY(-2px)',
        boxShadow: variant === 'cta'
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            : '0 10px 15px -3px rgba(124, 58, 237, 0.3)'
    };

    const styles = {
        ...(variant === 'cta' ? ctaStyles : primaryStyles),
        ...(isHovered ? hoverStyles : {})
    };

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`${className} ${fullWidth ? 'w-full' : ''}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ...styles
            }}
        >
            {children}
            <ArrowRight size={variant === 'cta' ? 20 : 18} style={{ marginLeft: '0.5rem' }} />
        </button>
    );
};

/**
 * Default Personal Training component for the homepage
 */
const PersonalTraining: React.FC<PersonalTrainingProps> = ({ trainers: propTrainers }) => {
    // Track flipped state for each trainer by ID
    const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

    // Flip card handlers
    const flipCard = (trainerId: string) => {
        setFlippedCards(prev => ({
            ...prev,
            [trainerId]: !prev[trainerId]
        }));
    };

    // Default trainer data if none provided
    const trainers: Trainer[] = propTrainers || [
        {
            id: "trainer-1",
            name: "Alex Rivera",
            image: "/assets/trainers/trainer1.jpg",
            specialty: "Strength & Conditioning",
            specialtyIcon: <Dumbbell size={14} />,
            bio: "Specialized in transforming physiques through science-based training protocols. Alex has helped over 200 clients achieve their fitness goals.",
            years: 8,
            clients: 178,
            featured: true,
            videoCard: {
                title: "High-Intensity Workout Demo",
                image: "/assets/trainers/workout-demo.jpg",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
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
    // Get regular trainers
    const regularTrainers = trainers.filter(trainer => !trainer.featured);

    return (
        <section className="personal-training-section w-full py-20 px-4 bg-black">
            {/* Header */}
            <div className="text-center mb-16">
                <span className="text-xs font-bold tracking-widest uppercase text-violet-300 mb-2 block">Expert Coaching</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    Personal <span className="bg-gradient-to-r from-violet-300 to-indigo-400 text-transparent bg-clip-text">Trainers</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Work directly with our certified fitness professionals who will create custom training programs tailored to your specific goals and needs.
                </p>
            </div>

            {/* Two-Column Layout */}
            <div className="max-w-6xl mx-auto mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Featured Trainer */}
                    {featuredTrainer && (
                        <div className="md:pr-4">
                            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 h-full">
                                {/* Trainer Image */}
                                <div className="aspect-video bg-gray-800 flex items-center justify-center">
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

                                <div className="p-6">
                                    {/* Trainer Specialty Tag */}
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-900/50 text-violet-300 mb-3">
                                        {featuredTrainer.specialtyIcon}
                                        <span className="ml-1">{featuredTrainer.specialty}</span>
                                    </div>

                                    {/* Trainer Info */}
                                    <h3 className="text-xl font-bold mb-2 text-white">{featuredTrainer.name}</h3>
                                    <p className="text-gray-400 mb-4">{featuredTrainer.bio}</p>

                                    {/* Trainer Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="text-center">
                                            <span className="text-2xl font-bold text-violet-300 block mb-1">{featuredTrainer.years}</span>
                                            <span className="text-sm text-gray-500">Years Exp</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-2xl font-bold text-violet-300 block mb-1">{featuredTrainer.clients}</span>
                                            <span className="text-sm text-gray-500">Clients</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <StyledButton fullWidth>
                                        Schedule Session
                                    </StyledButton>

                                    {/* Flip Card for Featured Trainer */}
                                    {featuredTrainer.videoCard && (
                                        <div className="mt-6">
                                            <div
                                                className={`flip-card ${flippedCards[featuredTrainer.id] ? 'flipped' : ''}`}
                                                onClick={() => flipCard(featuredTrainer.id)}
                                            >
                                                {/* Front of Card */}
                                                <div className="flip-card-front bg-gray-800 flex items-center justify-center flex-col rounded-lg aspect-video">
                                                    <Play size={64} className="text-white opacity-70 mb-4" />
                                                    <h4 className="text-lg font-medium text-white">{featuredTrainer.videoCard.title}</h4>
                                                    <p className="text-sm text-gray-400 flex items-center mt-2">
                                                        Click to watch
                                                        <Play size={16} className="ml-1" />
                                                    </p>
                                                </div>

                                                {/* Back of Card */}
                                                <div className="flip-card-back bg-gray-800 rounded-lg">
                                                    <div className="flex-grow flex items-center justify-center p-4">
                                                        {flippedCards[featuredTrainer.id] && featuredTrainer.videoCard.videoUrl && (
                                                            <iframe
                                                                src={featuredTrainer.videoCard.videoUrl}
                                                                title={featuredTrainer.videoCard.title}
                                                                frameBorder="0"
                                                                className="w-full h-full"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            ></iframe>
                                                        )}
                                                    </div>
                                                    <div className="bg-gray-700 p-3 flex justify-between">
                                                        <button
                                                            className="p-2 rounded-full bg-gray-600 text-white"
                                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                                e.stopPropagation();
                                                                flipCard(featuredTrainer.id);
                                                            }}
                                                        >
                                                            <RefreshCw size={20} />
                                                        </button>
                                                        <button
                                                            className="p-2 rounded-full bg-gray-600 text-white"
                                                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                                e.stopPropagation();
                                                                flipCard(featuredTrainer.id);
                                                            }}
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Right Column - Regular Trainers */}
                    <div className="md:pl-4">
                        <div className="space-y-8">
                            {regularTrainers.map((trainer) => (
                                <div
                                    key={trainer.id}
                                    className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800"
                                >
                                    {/* Trainer Image */}
                                    <div className="aspect-video bg-gray-800 flex items-center justify-center">
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

                                    <div className="p-6">
                                        {/* Trainer Specialty Tag */}
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-900/50 text-violet-300 mb-3">
                                            {trainer.specialtyIcon}
                                            <span className="ml-1">{trainer.specialty}</span>
                                        </div>

                                        {/* Trainer Info */}
                                        <h3 className="text-xl font-bold mb-2 text-white">{trainer.name}</h3>
                                        <p className="text-gray-400 mb-4">{trainer.bio}</p>

                                        {/* Trainer Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="text-center">
                                                <span className="text-2xl font-bold text-violet-300 block mb-1">{trainer.years}</span>
                                                <span className="text-sm text-gray-500">Years Exp</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="text-2xl font-bold text-violet-300 block mb-1">{trainer.clients}</span>
                                                <span className="text-sm text-gray-500">Clients</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <StyledButton fullWidth>
                                            Schedule Session
                                        </StyledButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Consultation CTA */}
            <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden bg-violet-600 p-8">
                <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-4 text-white">Ready for Personalized Training?</h3>
                    <p className="text-violet-100 mb-8">
                        Schedule a free consultation with one of our expert trainers. We'll discuss your goals, fitness level, and create a plan tailored just for you.
                    </p>
                    {/* CTA Button */}
                    <StyledButton
                        variant="cta"
                    >
                        Book Free Consultation
                    </StyledButton>
                </div>
            </div>
        </section>
    );
};

export default PersonalTraining; 