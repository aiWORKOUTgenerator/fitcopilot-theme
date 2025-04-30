import {
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

    // Sample trainer data with placeholder trainers (will be replaced with actual data)
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
        <section className="personal-training-section py-16 px-4">
            <h2 className="section-title text-white mb-8">Meet Our <span className="highlight">Expert Trainers</span></h2>
            <div className="trainers-container">
                {trainers.map(trainer => (
                    <div key={trainer.id} className="trainer-card">
                        {/* If we have a video and the card is flipped, show video, otherwise show image */}
                        {trainer.youtubeId && flippedCards[trainer.id] ? (
                            <div className="trainer-image">
                                <div className="flip-card">
                                    <div className="flip-card-front">
                                        {trainer.imageSrc ? (
                                            <img
                                                src={trainer.imageSrc}
                                                alt={`${trainer.name}, ${trainer.specialty}`}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="image-placeholder">
                                                <User size={50} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flip-card-back">
                                        <iframe
                                            title={`${trainer.name} intro video`}
                                            src={`https://www.youtube.com/embed/${trainer.youtubeId}?autoplay=1`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                                {/* Video controls */}
                                <div className="video-controls absolute bottom-4 right-4 flex space-x-2">
                                    <button
                                        className="control-button"
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            flipCard(trainer.id);
                                        }}
                                    >
                                        <Play size={24} className="text-white" />
                                    </button>
                                    <button
                                        className="control-button close-button"
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            flipCard(trainer.id);
                                        }}
                                    >
                                        <X size={24} className="text-white" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="trainer-image">
                                {trainer.imageSrc ? (
                                    <img
                                        src={trainer.imageSrc}
                                        alt={`${trainer.name}, ${trainer.specialty}`}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="image-placeholder">
                                        <User size={50} />
                                    </div>
                                )}
                                {/* Play button overlay for trainers with videos */}
                                {trainer.youtubeId && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="play-button-overlay" onClick={() => flipCard(trainer.id)}>
                                            <Play size={48} className="text-white opacity-80 hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div>
                            <div className="specialty">
                                <span className="icon">{trainer.specialtyIcon}</span>
                                {trainer.specialty}
                            </div>
                            <h3 className="trainer-name text-xl font-bold mb-2">{trainer.name}</h3>
                            <p className="trainer-bio mb-4">{trainer.bio}</p>
                        </div>
                        <div className="trainer-stats mb-6 grid grid-cols-2 gap-4">
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
                ))}
            </div>

            {/* Consultation CTA */}
            <div className="booking-box max-w-4xl mx-auto">
                <div className="max-w-xl">
                    <h3 className="booking-title">Ready to Start?</h3>
                    <p className="booking-text">
                        Schedule a free consultation with one of our expert trainers. We'll discuss your goals and create a plan just for you.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PersonalTraining; 