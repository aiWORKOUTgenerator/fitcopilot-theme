import {
    Award,
    Calendar,
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

    // Trainer data
    const trainers: Trainer[] = propTrainers || [
        {
            id: 'trainer1',
            name: 'Alex Rodriguez',
            specialty: 'Strength Training',
            specialtyIcon: <Dumbbell size={16} />,
            imageSrc: 'https://plus.unsplash.com/premium_photo-1661359682704-f17a7e38cbff?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            bio: 'Specialized in muscle building and strength conditioning with 8+ years of experience.',
            clients: 120,
            experience: 8,
            youtubeId: 'dQw4w9WgXcQ'
        },
        {
            id: 'trainer2',
            name: 'Sarah Johnson',
            specialty: 'Cardio & HIIT',
            specialtyIcon: <Heart size={16} />,
            imageSrc: 'https://images.unsplash.com/photo-1658203897339-989718522126?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            bio: 'Expert in high-intensity interval training and cardiovascular fitness programs.',
            clients: 95,
            experience: 6,
            youtubeId: 'dQw4w9WgXcQ'
        },
        {
            id: 'trainer3',
            name: 'Michael Chen',
            specialty: 'Functional Training',
            specialtyIcon: <RefreshCw size={16} />,
            imageSrc: 'https://images.unsplash.com/photo-1652880042886-cdb6cebb9ab5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            bio: 'Focuses on building practical strength for everyday activities, improving mobility and balance.',
            clients: 85,
            experience: 7,
            youtubeId: 'dQw4w9WgXcQ'
        },
        {
            id: 'trainer4',
            name: 'Emily Wilson',
            specialty: 'Nutrition Coaching',
            specialtyIcon: <Award size={16} />,
            imageSrc: 'https://images.unsplash.com/photo-1559595500-c747065f4cd9?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            bio: 'Certified nutrition specialist helping clients transform their health through personalized meal plans.',
            clients: 110,
            experience: 5,
            youtubeId: 'dQw4w9WgXcQ'
        }
    ];

    return (
        <section className="personal-training-section py-16 bg-gray-100" style={{
            // Override the dark theme with light theme variables
            '--color-pt-bg': '#f3f4f6',
            '--color-pt-card-bg': '#ffffff',
            '--color-pt-text': '#111827',
            '--color-pt-text-secondary': '#6b7280',
            '--color-pt-border': '#e5e7eb',
            '--color-pt-grid': 'rgba(0, 0, 0, 0.03)' // Darker grid lines for light theme
        } as React.CSSProperties}>
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
                                {trainer.imageSrc ? (
                                    <img
                                        src={trainer.imageSrc}
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
                                        <span className="value">{trainer.experience}+</span>
                                        <span className="label">Years Experience</span>
                                    </div>
                                </div>
                            </div>

                            {/* Video Card (if applicable) */}
                            {trainer.youtubeId && (
                                <div className="p-4 bg-gray-50 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold mb-2 text-gray-900">Watch Training Sample</h4>

                                    <div className="aspect-video relative rounded overflow-hidden bg-gray-200">
                                        {flippedCards[trainer.id] ? (
                                            <>
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${trainer.youtubeId}?autoplay=1`}
                                                    title={`${trainer.name} training sample`}
                                                    className="w-full h-full absolute inset-0"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                                <div className="absolute bottom-2 right-2 z-10 flex space-x-1">
                                                    <button
                                                        className="p-1 rounded-full bg-black/60 text-white"
                                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                            e.stopPropagation();
                                                            flipCard(trainer.id);
                                                        }}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div
                                                className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                                                onClick={() => flipCard(trainer.id)}
                                            >
                                                <Play size={40} className="text-violet-600 mb-2" />
                                                <span className="text-xs font-medium text-gray-700">Play Video</span>
                                            </div>
                                        )}
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