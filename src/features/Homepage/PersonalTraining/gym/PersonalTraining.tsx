import {
    ArrowRight,
    Award,
    Calendar,
    Dumbbell,
    Heart,
    Medal,
    Play,
    RefreshCw,
    User,
    Users,
    X
} from 'lucide-react';
import React, { MouseEvent, useState } from 'react';
import '../PersonalTraining.scss';
import { PersonalTrainingProps, Trainer } from '../types';

/**
 * Gym variant of the Personal Training component
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
            specialty: "Hypertrophy Coach",
            specialtyIcon: <Dumbbell size={14} />,
            bio: "With a background in competitive bodybuilding, Alex specializes in muscle development, physique enhancement, and body recomposition strategies.",
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
            specialty: "Wellness Coach",
            specialtyIcon: <Heart size={14} />,
            bio: "Morgan combines nutritional coaching with personalized training to help clients transform their bodies and improve overall health markers.",
            years: 6,
            clients: 152,
            featured: false
        },
        {
            id: "trainer-3",
            name: "Jordan Smith",
            image: "/assets/trainers/trainer3.jpg",
            specialty: "Performance Coach",
            specialtyIcon: <Award size={14} />,
            bio: "Former D1 athlete with expertise in strength development, power output, and athletic performance for both competitive and recreational athletes.",
            years: 10,
            clients: 215,
            featured: false
        },
        {
            id: "trainer-4",
            name: "Taylor West",
            image: "/assets/trainers/trainer4.jpg",
            specialty: "Mobility Specialist",
            specialtyIcon: <Medal size={14} />,
            bio: "Specializing in mobility training, injury prevention, and corrective exercise. Perfect for those looking to improve movement quality and reduce pain.",
            years: 4,
            clients: 89,
            featured: false
        }
    ];

    return (
        <section className="py-20 bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-white opacity-70"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-purple-500">
                            Expert Personal Trainers
                        </span>
                    </h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        Our certified personal trainers bring years of experience and specialized knowledge to help you achieve your fitness goals faster and more effectively.
                    </p>
                </div>

                {/* Trainers grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {trainers.map((trainer, index) => (
                        <div
                            key={trainer.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 h-full flex flex-col"
                        >
                            {/* Trainer image */}
                            <div className="relative h-64 bg-gradient-to-br from-violet-400 to-purple-500">
                                {trainer.image && !trainer.image.includes('assets/trainers') ? (
                                    <img
                                        src={trainer.image}
                                        alt={trainer.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User size={64} className="text-white opacity-70" />
                                    </div>
                                )}

                                {/* Specialty badge */}
                                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-violet-700 flex items-center shadow-md">
                                    {/* Safely render the icon */}
                                    <span className="mr-1">{trainer.specialtyIcon}</span>
                                    {trainer.specialty}
                                </div>
                            </div>

                            <div className="p-6 flex-grow flex flex-col">
                                {/* Name and rating */}
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{trainer.name}</h3>
                                </div>

                                {/* Bio */}
                                <p className="text-gray-600 mb-4 flex-grow">{trainer.bio}</p>

                                {/* Stats */}
                                <div className="mb-4">
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <Calendar size={14} className="mr-2" />
                                        <span>{trainer.years} years experience</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Users size={14} className="mr-2" />
                                        <span>{trainer.clients}+ clients trained</span>
                                    </div>
                                </div>

                                {/* CTA button */}
                                <button className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center mt-auto">
                                    Book Session
                                    <ArrowRight size={16} className="ml-2" />
                                </button>
                            </div>

                            {/* Video card for featured trainer */}
                            {trainer.featured && trainer.videoCard && (
                                <div className="p-6 pt-0">
                                    <div
                                        className={`flip-card ${flippedCards[trainer.id] ? 'flipped' : ''}`}
                                        onClick={() => flipCard(trainer.id)}
                                    >
                                        {/* Front of Card */}
                                        <div className="flip-card-front bg-gray-50 flex items-center justify-center flex-col rounded-lg">
                                            <Play size={64} className="text-violet-500 mb-4" />
                                            <h4 className="text-lg font-medium text-gray-900">{trainer.videoCard.title}</h4>
                                            <p className="text-sm text-gray-500 flex items-center mt-2">
                                                Click to watch
                                                <Play size={16} className="ml-1 text-violet-500" />
                                            </p>
                                        </div>

                                        {/* Back of Card */}
                                        <div className="flip-card-back bg-gray-50 rounded-lg">
                                            <div className="flex-grow flex items-center justify-center p-4">
                                                {flippedCards[trainer.id] && trainer.videoCard.videoUrl && (
                                                    <iframe
                                                        src={trainer.videoCard.videoUrl}
                                                        title={trainer.videoCard.title}
                                                        frameBorder="0"
                                                        className="w-full h-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                )}
                                            </div>
                                            <div className="bg-gray-100 p-3 flex justify-between">
                                                <button
                                                    className="p-2 rounded-full bg-violet-100 text-violet-600"
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        e.stopPropagation();
                                                        flipCard(trainer.id);
                                                    }}
                                                >
                                                    <RefreshCw size={20} />
                                                </button>
                                                <button
                                                    className="p-2 rounded-full bg-violet-100 text-violet-600"
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        e.stopPropagation();
                                                        flipCard(trainer.id);
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
                    ))}
                </div>

                {/* CTA section */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-500 rounded-2xl p-8 md:p-12 shadow-xl">
                    <div className="md:flex items-center justify-between">
                        <div className="mb-6 md:mb-0 md:mr-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Start Your Fitness Journey Today
                            </h3>
                            <p className="text-violet-100 text-lg max-w-2xl">
                                Book a free fitness assessment with one of our expert trainers and get a personalized plan to reach your goals.
                            </p>
                        </div>
                        <button className="whitespace-nowrap bg-white text-violet-700 py-4 px-8 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center">
                            Schedule Free Assessment
                            <ArrowRight size={18} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PersonalTraining; 