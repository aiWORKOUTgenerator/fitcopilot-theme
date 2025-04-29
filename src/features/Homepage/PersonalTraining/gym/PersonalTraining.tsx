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
            specialtyIcon: <Dumbbell />,
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
            specialtyIcon: <Heart />,
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
            specialtyIcon: <Award />,
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
            specialtyIcon: <Medal />,
            certifications: ["ACSM-CPT", "FMS Level 2"],
            bio: "Specializing in mobility training, injury prevention, and corrective exercise. Perfect for those looking to improve movement quality and reduce pain.",
            rating: 4.7,
            reviews: 41,
            availability: "Wed-Sun"
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
                            key={index}
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
                                    {React.cloneElement(trainer.specialtyIcon, { size: 14, className: "mr-1" })}
                                    {trainer.specialty}
                                </div>
                            </div>

                            <div className="p-6 flex-grow flex flex-col">
                                {/* Name and rating */}
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{trainer.name}</h3>
                                    <div className="flex items-center text-sm">
                                        <Star size={16} className="text-amber-400 mr-1" />
                                        <span className="font-medium">{trainer.rating}</span>
                                        <span className="text-gray-500 ml-1">({trainer.reviews})</span>
                                    </div>
                                </div>

                                {/* Bio */}
                                <p className="text-gray-600 mb-4 flex-grow">{trainer.bio}</p>

                                {/* Certifications */}
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Certifications:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {trainer.certifications.map((cert, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <Calendar size={14} className="mr-1" />
                                    <span>Available: {trainer.availability}</span>
                                </div>

                                {/* CTA button */}
                                <button className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center mt-auto">
                                    Book Session
                                    <ArrowRight size={16} className="ml-2" />
                                </button>
                            </div>
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