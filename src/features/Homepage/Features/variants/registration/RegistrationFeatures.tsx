import { Award, Check, ChevronRight, Dumbbell, Hourglass, ThumbsUp, Timer, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import '../../Features.scss';
import './RegistrationFeatures.scss';

// Experience level enum
enum ExperienceLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

// Experience level card props
interface ExperienceLevelCardProps {
    level: ExperienceLevel;
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    isSelected: boolean;
    onSelect: (level: ExperienceLevel) => void;
}

// Experience level flip card component
const ExperienceLevelCard: React.FC<ExperienceLevelCardProps> = ({
    level,
    title,
    description,
    icon,
    features,
    isSelected,
    onSelect
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Handle card click (flip and select)
    const handleCardClick = () => {
        if (!isFlipped) {
            setIsFlipped(true);
        } else {
            onSelect(level);
        }
    };

    // Reset flipped state when selection changes
    useEffect(() => {
        if (!isSelected) {
            setIsFlipped(false);
        }
    }, [isSelected]);

    return (
        <div
            className={`experience-card ${isFlipped ? 'is-flipped' : ''} ${isSelected ? 'is-selected' : ''}`}
            onClick={handleCardClick}
        >
            <div className="experience-card__inner">
                {/* Card Front */}
                <div className="experience-card__face experience-card__face--front">
                    <div className="experience-card__icon">
                        {icon}
                    </div>
                    <h3 className="experience-card__title">{title}</h3>
                    <p className="experience-card__description">{description}</p>
                    <div className="experience-card__action">
                        <span>Learn More</span>
                        <ChevronRight size={16} />
                    </div>
                </div>

                {/* Card Back */}
                <div className="experience-card__face experience-card__face--back">
                    <h3 className="experience-card__title">{title}</h3>
                    <ul className="experience-card__features">
                        {features.map((feature, index) => (
                            <li key={index}>
                                <Check size={16} className="feature-icon" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="experience-card__button"
                        onClick={() => onSelect(level)}
                    >
                        Select This Level
                    </button>
                </div>
            </div>
        </div>
    );
};

// Next steps component shown after selection
const NextStepsComponent: React.FC<{
    selectedLevel: ExperienceLevel;
    onContinue: () => void;
}> = ({ selectedLevel, onContinue }) => {
    return (
        <div className="next-steps-container animate-fade-in">
            <div className="next-steps-header">
                <h3>Great Choice!</h3>
                <p>Your workouts will be designed for your {selectedLevel === ExperienceLevel.BEGINNER ? 'beginner' : selectedLevel === ExperienceLevel.INTERMEDIATE ? 'intermediate' : 'advanced'} fitness level.</p>
            </div>

            <div className="next-steps-content">
                <div className="next-steps-info">
                    <h4>What to expect next:</h4>
                    <ul>
                        <li>
                            <Zap size={16} className="list-icon" />
                            <span>Select your fitness goals</span>
                        </li>
                        <li>
                            <Dumbbell size={16} className="list-icon" />
                            <span>Customize your workout preferences</span>
                        </li>
                        <li>
                            <Timer size={16} className="list-icon" />
                            <span>Get your personalized AI workout plan</span>
                        </li>
                    </ul>
                </div>

                <button
                    className="next-steps-button"
                    onClick={onContinue}
                >
                    Continue to Fitness Goals
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

/**
 * Registration variant of the Features section with experience level selection
 */
const RegistrationFeatures: React.FC = () => {
    // Get email from local storage (passed from Hero section)
    const [email, setEmail] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null);

    // Load email from localStorage on mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('registration_email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    // Handle level selection
    const handleLevelSelect = (level: ExperienceLevel) => {
        setSelectedLevel(level);

        // Store the selection in localStorage
        localStorage.setItem('registration_experience_level', level);
    };

    // Handle continue to next registration step
    const handleContinue = () => {
        // Scroll to the next section (Goals section)
        const goalsSection = document.getElementById('goals-section');
        if (goalsSection) {
            goalsSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // If goals section doesn't exist yet, we can navigate to a different URL
            // or display the goals selection in this component
            console.log('Navigate to goals selection');
        }
    };

    return (
        <section
            id="features-section"
            className="features features--registration"
        >
            <div className="container">
                <div className="features__header">
                    <h2 className="features__title">Tell Us About Your Experience Level</h2>
                    <p className="features__subtitle">This helps us create a workout program that matches your current fitness abilities</p>

                    {email && (
                        <div className="registration-email-display">
                            <span>Email:</span> {email}
                        </div>
                    )}
                </div>

                {selectedLevel === null ? (
                    <div className="experience-cards-container">
                        {/* Beginner Card */}
                        <ExperienceLevelCard
                            level={ExperienceLevel.BEGINNER}
                            title="New to Exercise"
                            description="Perfect if you're just starting your fitness journey or returning after a long break."
                            icon={<Hourglass size={32} />}
                            features={[
                                "Gradual progression to build strength",
                                "Detailed form instructions",
                                "Beginner-friendly exercises",
                                "Focus on building good habits",
                                "Extra recovery time between workouts"
                            ]}
                            isSelected={selectedLevel === ExperienceLevel.BEGINNER}
                            onSelect={handleLevelSelect}
                        />

                        {/* Intermediate Card */}
                        <ExperienceLevelCard
                            level={ExperienceLevel.INTERMEDIATE}
                            title="Some Experience"
                            description="You've been exercising regularly for a while and are familiar with common workout movements."
                            icon={<ThumbsUp size={32} />}
                            features={[
                                "Progressive overload principles",
                                "More exercise variety",
                                "Targeted muscle group focus",
                                "Balanced cardio and strength",
                                "Customizable workout intensity"
                            ]}
                            isSelected={selectedLevel === ExperienceLevel.INTERMEDIATE}
                            onSelect={handleLevelSelect}
                        />

                        {/* Advanced Card */}
                        <ExperienceLevelCard
                            level={ExperienceLevel.ADVANCED}
                            title="Advanced Athlete"
                            description="You're dedicated to training and looking for challenging workouts to push your limits."
                            icon={<Award size={32} />}
                            features={[
                                "High-intensity training protocols",
                                "Advanced exercise techniques",
                                "Periodization strategies",
                                "Recovery optimization methods",
                                "Performance-focused programming"
                            ]}
                            isSelected={selectedLevel === ExperienceLevel.ADVANCED}
                            onSelect={handleLevelSelect}
                        />
                    </div>
                ) : (
                    <NextStepsComponent
                        selectedLevel={selectedLevel}
                        onContinue={handleContinue}
                    />
                )}
            </div>
        </section>
    );
};

export default RegistrationFeatures; 