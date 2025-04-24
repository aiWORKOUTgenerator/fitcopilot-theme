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
import React, { useState } from 'react';
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
            specialtyIcon: <Dumbbell size={14} />,
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
            specialtyIcon: <Heart size={14} />,
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
            specialtyIcon: <Award size={14} />,
            bio: "Former professional athlete who now trains competitors at all levels. Specializes in sport-specific training and performance enhancement.",
            years: 10,
            clients: 215,
            featured: false
        }
    ];

    return (
        <section className="personal-training-section w-full py-20 px-4 bg-gray-900">
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

            {/* Trainers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
                {trainers.map((trainer) => (
                    <div
                        key={trainer.id}
                        className={`trainer-card ${trainer.featured ? 'md:col-span-2 md:row-span-2' : ''}`}
                    >
                        {/* Trainer Image */}
                        <div
                            className={`trainer-image ${!trainer.image || trainer.image.includes('assets/trainers') ? 'img-placeholder' : ''}`}
                            style={trainer.image && !trainer.image.includes('assets/trainers') ? { backgroundImage: `url(${trainer.image})` } : {}}
                        >
                            {(!trainer.image || trainer.image.includes('assets/trainers')) && (
                                <User size={48} className="text-white" />
                            )}
                        </div>

                        {/* Trainer Specialty Tag */}
                        <div className="trainer-specialty">
                            {trainer.specialtyIcon}
                            {trainer.specialty}
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

                        {/* Action Button */}
                        <button className="action-button">
                            Schedule Session
                            <ArrowRight size={18} />
                        </button>

                        {/* Flip Card for Featured Trainer */}
                        {trainer.featured && trainer.videoCard && (
                            <div className="flip-card-container">
                                <div
                                    className={`flip-card ${flippedCards[trainer.id] ? 'flipped' : ''}`}
                                    onClick={() => flipCard(trainer.id)}
                                >
                                    {/* Front of Card (Image) */}
                                    <div className="flip-card-front">
                                        {trainer.videoCard.image && !trainer.videoCard.image.includes('assets') ? (
                                            <img
                                                src={trainer.videoCard.image}
                                                alt={trainer.videoCard.title}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center">
                                                <Play size={64} className="text-white opacity-70" />
                                            </div>
                                        )}

                                        {/* Overlay with Title */}
                                        <div className="overlay">
                                            <div className="flip-card-title">{trainer.videoCard.title}</div>
                                            <div className="flip-card-hint">
                                                Click to watch video
                                                <Play size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back of Card (Video Player) */}
                                    <div className="flip-card-back">
                                        <div className="video-container">
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    flipCard(trainer.id);
                                                }}
                                            >
                                                <RefreshCw size={20} />
                                            </button>
                                            <button
                                                className="control-button close-button"
                                                onClick={(e) => {
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

            {/* Consultation CTA */}
            <div className="booking-box max-w-4xl mx-auto">
                <div className="max-w-xl">
                    <h3 className="booking-title">Ready for Personalized Training?</h3>
                    <p className="booking-text">
                        Schedule a free consultation with one of our expert trainers. We'll discuss your goals, fitness level, and create a plan tailored just for you.
                    </p>
                    <button className="booking-button">
                        Book Free Consultation
                        <ArrowRight size={20} />
                    </button>
                </div>

                {/* Decorative Element */}
                <div className="absolute right-0 bottom-0 opacity-20 hidden md:block" aria-hidden="true">
                    <Users size={180} />
                </div>
            </div>
        </section>
    );
};

export default PersonalTraining; 