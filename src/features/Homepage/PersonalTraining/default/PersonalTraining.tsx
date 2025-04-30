import {
    ArrowRight,
    Award,
    Dumbbell,
    Heart,
    Play,
    RefreshCw,
    User,
    Users,
    X
} from 'lucide-react';
import React, { MouseEvent, useEffect, useState } from 'react';
import { PersonalTrainingProps, Trainer } from '..';
import '../PersonalTraining.scss';

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

    // Apply CSS variables for theming
    useEffect(() => {
        const root = document.documentElement;

        // Store original values to restore later
        const originalValues = {
            ptAccent: root.style.getPropertyValue('--color-pt-accent'),
            ptAccentLight: root.style.getPropertyValue('--color-pt-accent-light'),
            ptAccentDark: root.style.getPropertyValue('--color-pt-accent-dark'),
            ptGradient: root.style.getPropertyValue('--color-pt-gradient'),
            ptAccentRgb: root.style.getPropertyValue('--color-pt-accent-rgb'),
        };

        // Set new values
        root.style.setProperty('--color-pt-accent', 'var(--color-violet-500, #8b5cf6)');
        root.style.setProperty('--color-pt-accent-light', 'var(--color-violet-300, #c4b5fd)');
        root.style.setProperty('--color-pt-accent-dark', 'var(--color-violet-700, #6d28d9)');
        root.style.setProperty('--color-pt-gradient', 'linear-gradient(to right, var(--color-violet-600, #7c3aed), var(--color-purple-500, #8b5cf6))');
        root.style.setProperty('--color-pt-accent-rgb', 'var(--color-violet-rgb, 139, 92, 246)');

        // Cleanup function to restore original values
        return () => {
            if (originalValues.ptAccent) root.style.setProperty('--color-pt-accent', originalValues.ptAccent);
            if (originalValues.ptAccentLight) root.style.setProperty('--color-pt-accent-light', originalValues.ptAccentLight);
            if (originalValues.ptAccentDark) root.style.setProperty('--color-pt-accent-dark', originalValues.ptAccentDark);
            if (originalValues.ptGradient) root.style.setProperty('--color-pt-gradient', originalValues.ptGradient);
            if (originalValues.ptAccentRgb) root.style.setProperty('--color-pt-accent-rgb', originalValues.ptAccentRgb);
        };
    }, []);

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
                            <button className="mt-auto w-full py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-medium rounded-lg flex items-center justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                Schedule Session
                                <ArrowRight size={18} className="ml-2" />
                            </button>

                            {/* Flip Card for Featured Trainer */}
                            {featuredTrainer.videoCard && (
                                <div className="mt-6">
                                    <div
                                        className={`flip-card ${flippedCards[featuredTrainer.id] ? 'flipped' : ''}`}
                                        onClick={() => flipCard(featuredTrainer.id)}
                                    >
                                        {/* Front of Card */}
                                        <div className="flip-card-front bg-gray-800 flex items-center justify-center flex-col">
                                            {featuredTrainer.videoCard.image && !featuredTrainer.videoCard.image.includes('assets') ? (
                                                <img
                                                    src={featuredTrainer.videoCard.image}
                                                    alt={featuredTrainer.videoCard.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center flex-col">
                                                    <Play size={64} className="text-white opacity-70 mb-4" />
                                                    <h4 className="text-lg font-medium text-white">{featuredTrainer.videoCard.title}</h4>
                                                    <p className="text-sm text-gray-400 flex items-center mt-2">
                                                        Click to watch
                                                        <Play size={16} className="ml-1" />
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Back of Card */}
                                        <div className="flip-card-back bg-gray-800">
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
                            <button className="mt-auto w-full py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-medium rounded-lg flex items-center justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                Schedule Session
                                <ArrowRight size={18} className="ml-2" />
                            </button>
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
                        <button className="booking-button hover:-translate-y-1 hover:shadow-lg">
                            Book Free Consultation
                            <ArrowRight size={20} className="ml-2" />
                        </button>
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