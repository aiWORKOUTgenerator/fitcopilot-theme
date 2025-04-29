import {
    ArrowRight,
    Award,
    Dumbbell,
    Heart,
    Play,
    RefreshCw,
    Users,
    X
} from 'lucide-react';
import React, { MouseEvent, useState } from 'react';
import '../PersonalTraining.scss';

/**
 * Default Personal Training component for the homepage
 */
const PersonalTraining: React.FC = () => {
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
    const trainers = [
        {
            id: "trainer-1",
            name: "Alex Rivera",
            image: "/assets/trainers/trainer1.jpg", // Replace with actual image path
            specialty: "Strength & Conditioning",
            specialtyIcon: <span className="icon-xs"><Dumbbell /></span>,
            bio: "Specialized in transforming physiques through science-based training protocols. Alex has helped over 200 clients achieve their fitness goals.",
            years: 8,
            clients: 178,
            featured: true,
            videoCard: {
                title: "High-Intensity Workout Demo",
                image: "/assets/trainers/workout-demo.jpg", // Replace with actual image path
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1", // Replace with actual video URL
            }
        },
        {
            id: "trainer-2",
            name: "Morgan Chen",
            image: "/assets/trainers/trainer2.jpg", // Replace with actual image path
            specialty: "Nutrition & Weight Loss",
            specialtyIcon: <span className="icon-xs"><Heart /></span>,
            bio: "Certified nutritionist and weight management specialist. Morgan creates personalized diet plans that complement your training regimen.",
            years: 6,
            clients: 152,
            featured: false
        },
        {
            id: "trainer-3",
            name: "Jordan Smith",
            image: "/assets/trainers/trainer3.jpg", // Replace with actual image path
            specialty: "Athletic Performance",
            specialtyIcon: <span className="icon-xs"><Award /></span>,
            bio: "Former professional athlete who now trains competitors at all levels. Specializes in sport-specific training and performance enhancement.",
            years: 10,
            clients: 215,
            featured: false
        }
    ];

    return (
        <section className="personal-training-section">
            {/* Header */}
            <div className="section-header">
                <span className="section-tag">Expert Coaching</span>
                <h2 className="section-title">
                    Personal <span className="highlight bg-gradient-to-r from-violet-400 to-blue-500 text-transparent bg-clip-text">Trainers</span>
                </h2>
                <p className="section-description">
                    Work directly with our certified fitness professionals who will create custom training programs tailored to your specific goals and needs.
                </p>
            </div>

            {/* Trainers Grid */}
            <div className="trainers-container">
                {trainers.map((trainer) => (
                    <div
                        key={trainer.id}
                        className={`trainer-card ${trainer.featured ? 'md:col-span-2 md:row-span-2' : ''}`}
                    >
                        {/* Trainer Image */}
                        <div
                            className="trainer-image"
                            style={trainer.image && !trainer.image.includes('assets/trainers') ? { backgroundImage: `url(${trainer.image})` } : {}}
                        >
                            {(!trainer.image || trainer.image.includes('assets/trainers')) && (
                                <div className="trainer-placeholder bg-gradient-to-br from-violet-600 to-blue-700 flex items-center justify-center">
                                    <div className="icon">
                                        <span className="icon-xl"><Play /></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Trainer Specialty Tag */}
                        <div className="specialty bg-opacity-15 bg-violet-600">
                            <span className="icon">{trainer.specialtyIcon}</span>
                            {trainer.specialty}
                        </div>

                        {/* Trainer Info */}
                        <h3 className="trainer-name">{trainer.name}</h3>
                        <p className="trainer-bio">{trainer.bio}</p>

                        {/* Trainer Stats */}
                        <div className="trainer-stats">
                            <div className="stat">
                                <span className="value">{trainer.years}</span>
                                <span className="label">Years Exp</span>
                            </div>
                            <div className="stat">
                                <span className="value">{trainer.clients}</span>
                                <span className="label">Clients</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className="book-button">
                            Schedule Session
                            <span className="icon icon-md"><ArrowRight /></span>
                        </button>

                        {/* Flip Card for Featured Trainer */}
                        {trainer.featured && trainer.videoCard && (
                            <div className="flip-card-container">
                                <div
                                    className={`flip-card ${flippedCards[trainer.id] ? 'flipped' : ''}`}
                                    onClick={() => flipCard(trainer.id)}
                                >
                                    <div className="flip-card-inner">
                                        {/* Front of Card (Image) */}
                                        <div className="flip-card-front">
                                            {trainer.videoCard.image && !trainer.videoCard.image.includes('assets') ? (
                                                <img
                                                    src={trainer.videoCard.image}
                                                    alt={trainer.videoCard.title}
                                                />
                                            ) : (
                                                <div className="trainer-placeholder bg-gradient-to-br from-violet-600 to-blue-700">
                                                    <div className="icon">
                                                        <span className="icon-xl"><Play /></span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Overlay with Title */}
                                            <div className="overlay">
                                                <div className="flip-title">{trainer.videoCard.title}</div>
                                                <div className="flip-hint">
                                                    Click to watch video
                                                    <span className="icon"><span className="icon-sm"><Play /></span></span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Back of Card (Video Player) */}
                                        <div className="flip-card-back">
                                            <div className="video-content">
                                                {flippedCards[trainer.id] && (
                                                    <iframe
                                                        src={trainer.videoCard.videoUrl}
                                                        title={trainer.videoCard.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                )}
                                            </div>
                                            <div className="video-controls">
                                                <button
                                                    className="control-button"
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        e.stopPropagation();
                                                        flipCard(trainer.id);
                                                    }}
                                                >
                                                    <span className="icon-md"><RefreshCw /></span>
                                                </button>
                                                <button
                                                    className="control-button close-button"
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        e.stopPropagation();
                                                        flipCard(trainer.id);
                                                    }}
                                                >
                                                    <span className="icon-md"><X /></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Consultation CTA */}
            <div className="booking-box">
                <div className="max-w-xl">
                    <h3 className="booking-title">Ready for Personalized Training?</h3>
                    <p className="booking-text">
                        Schedule a free consultation with one of our expert trainers. We'll discuss your goals, fitness level, and create a plan tailored just for you.
                    </p>
                    <button className="booking-button">
                        Book Free Consultation
                        <span className="icon"><span className="icon-md"><ArrowRight /></span></span>
                    </button>
                </div>

                {/* Decorative Element */}
                <div className="absolute right-0 bottom-0 opacity-20 hidden md:block" aria-hidden="true">
                    <span style={{ width: '180px', height: '180px', display: 'block' }}><Users /></span>
                </div>
            </div>
        </section>
    );
};

export default PersonalTraining; 