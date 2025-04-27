import {
    ArrowRight,
    Award,
    Calendar,
    Dumbbell,
    Heart,
    Medal,
    Star,
    User
} from 'lucide-react';
import React from 'react';
import '../PersonalTraining.scss';

/**
 * Gym variant of the Personal Training component
 */
const PersonalTraining: React.FC = () => {
    // Trainer data with gym-specific focus
    const trainers = [
        {
            name: "Alex Rivera",
            image: "/assets/trainers/trainer1.jpg", // Replace with actual image path
            specialty: "Hypertrophy Coach",
            specialtyIcon: <span className="icon-xs"><Dumbbell /></span>,
            certifications: ["NASM-CPT", "ISSA Specialist in Sports Nutrition"],
            bio: "With a background in competitive bodybuilding, Alex specializes in muscle development, physique enhancement, and body recomposition strategies.",
            rating: 4.9,
            reviews: 48,
            availability: "Mon-Fri"
        },
        {
            name: "Morgan Chen",
            image: "/assets/trainers/trainer2.jpg", // Replace with actual image path
            specialty: "Wellness Coach",
            specialtyIcon: <span className="icon-xs"><Heart /></span>,
            certifications: ["ACE-CPT", "Precision Nutrition Level 2"],
            bio: "Morgan combines nutritional coaching with personalized training to help clients transform their bodies and improve overall health markers.",
            rating: 4.8,
            reviews: 52,
            availability: "Tue-Sat"
        },
        {
            name: "Jordan Smith",
            image: "/assets/trainers/trainer3.jpg", // Replace with actual image path
            specialty: "Performance Coach",
            specialtyIcon: <span className="icon-xs"><Award /></span>,
            certifications: ["CSCS", "USAW Level 1"],
            bio: "Former D1 athlete with expertise in strength development, power output, and athletic performance for both competitive and recreational athletes.",
            rating: 5.0,
            reviews: 37,
            availability: "Mon-Wed, Fri"
        },
        {
            name: "Taylor West",
            image: "/assets/trainers/trainer4.jpg", // Replace with actual image path
            specialty: "Mobility Specialist",
            specialtyIcon: <span className="icon-xs"><Medal /></span>,
            certifications: ["ACSM-CPT", "FMS Level 2"],
            bio: "Specializing in mobility training, injury prevention, and corrective exercise. Perfect for those looking to improve movement quality and reduce pain.",
            rating: 4.7,
            reviews: 41,
            availability: "Wed-Sun"
        }
    ];

    return (
        <section className="personal-training-section gym-variant">
            {/* Background decoration */}
            <div className="gym-bg-decoration"></div>

            <div className="container">
                {/* Section header */}
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="highlight">
                            Expert Personal Trainers
                        </span>
                    </h2>
                    <p className="section-description">
                        Our certified personal trainers bring years of experience and specialized knowledge to help you achieve your fitness goals faster and more effectively.
                    </p>
                </div>

                {/* Trainers grid */}
                <div className="trainers-container gym-grid">
                    {trainers.map((trainer, index) => (
                        <div
                            key={index}
                            className="trainer-card"
                        >
                            {/* Trainer image */}
                            <div className="trainer-image">
                                {trainer.image && !trainer.image.includes('assets/trainers') ? (
                                    <img
                                        src={trainer.image}
                                        alt={trainer.name}
                                        className="trainer-photo"
                                    />
                                ) : (
                                    <div className="image-placeholder">
                                        <span className="icon-xl"><User /></span>
                                    </div>
                                )}

                                {/* Specialty badge */}
                                <div className="specialty gym">
                                    <span className="icon">{trainer.specialtyIcon}</span>
                                    {trainer.specialty}
                                </div>
                            </div>

                            <div className="trainer-content">
                                {/* Name and rating */}
                                <div className="trainer-header">
                                    <h3 className="trainer-name">{trainer.name}</h3>
                                    <div className="trainer-rating">
                                        <span className="star-icon"><span className="icon-sm"><Star /></span></span>
                                        <span className="rating-value">{trainer.rating}</span>
                                        <span className="review-count">({trainer.reviews})</span>
                                    </div>
                                </div>

                                {/* Bio */}
                                <p className="trainer-bio">{trainer.bio}</p>

                                {/* Certifications */}
                                <div className="cert-container">
                                    <p className="cert-title">Certifications:</p>
                                    <div className="cert-badges">
                                        {trainer.certifications.map((cert, i) => (
                                            <span key={i} className="cert-badge">
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="availability">
                                    <span className="calendar-icon"><span className="icon-xs"><Calendar /></span></span>
                                    <span>Available: {trainer.availability}</span>
                                </div>

                                {/* CTA button */}
                                <button className="book-button">
                                    Book Session
                                    <span className="icon"><span className="icon-sm"><ArrowRight /></span></span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA section */}
                <div className="booking-box">
                    <div className="booking-content">
                        <h3 className="booking-title">
                            Start Your Fitness Journey Today
                        </h3>
                        <p className="booking-text">
                            Book a free fitness assessment with one of our expert trainers and get a personalized plan to reach your goals.
                        </p>
                    </div>
                    <button className="booking-button">
                        Schedule Free Assessment
                        <span className="icon"><span className="icon-md"><ArrowRight /></span></span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PersonalTraining; 