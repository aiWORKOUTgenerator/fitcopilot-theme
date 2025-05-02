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
    benefits: string[];
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
    benefits,
    isSelected,
    onSelect
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Handle card click (flip and select)
    const handleCardClick = () => {
        if (!isFlipped) {
            setIsFlipped(true);
        } else {
            onSelect(level);
        }
    };

    // Handle mouse enter
    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    // Reset flipped state when selection changes
    useEffect(() => {
        if (!isSelected) {
            setIsFlipped(false);
        }
    }, [isSelected]);

    return (
        <div
            className={`experience-card ${isFlipped ? 'is-flipped' : ''} ${isSelected ? 'is-selected' : ''} ${isHovering ? 'is-hovering' : ''}`}
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="experience-card__inner">
                {/* Card Front */}
                <div className="experience-card__face experience-card__face--front">
                    <div className="experience-card__icon">
                        {icon}
                    </div>
                    <h3 className="experience-card__title">{title}</h3>
                    <p className="experience-card__description">{description}</p>

                    <div className="experience-card__benefits">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="experience-card__benefit">
                                <Check size={14} className="benefit-icon" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="experience-card__action">
                        <span>See Your Workout Plan</span>
                        <ChevronRight size={16} />
                    </div>
                </div>

                {/* Card Back */}
                <div className="experience-card__face experience-card__face--back">
                    <h3 className="experience-card__title">{title}</h3>
                    <div className="experience-card__features-container">
                        <h4 className="experience-card__features-title">Your Personalized Plan Includes:</h4>
                        <ul className="experience-card__features">
                            {features.map((feature, index) => (
                                <li key={index}>
                                    <Check size={16} className="feature-icon" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        className="experience-card__button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(level);
                        }}
                    >
                        Start With This Plan
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
    const levelText = selectedLevel === ExperienceLevel.BEGINNER
        ? 'beginner'
        : selectedLevel === ExperienceLevel.INTERMEDIATE
            ? 'intermediate'
            : 'advanced';

    return (
        <div className="next-steps-container animate-fade-in">
            <div className="next-steps-header">
                <div className="next-steps-header__icon">
                    {selectedLevel === ExperienceLevel.BEGINNER ? (
                        <Hourglass size={32} />
                    ) : selectedLevel === ExperienceLevel.INTERMEDIATE ? (
                        <ThumbsUp size={32} />
                    ) : (
                        <Award size={32} />
                    )}
                </div>
                <h3>Perfect Match!</h3>
                <p>We'll tailor your fitness journey to your {levelText} experience level</p>
            </div>

            <div className="next-steps-content">
                <div className="next-steps-info">
                    <h4>Your personalized plan is almost ready:</h4>
                    <ul>
                        <li>
                            <Zap size={16} className="list-icon" />
                            <span>Select your primary fitness goals</span>
                        </li>
                        <li>
                            <Dumbbell size={16} className="list-icon" />
                            <span>Customize your workout preferences</span>
                        </li>
                        <li>
                            <Timer size={16} className="list-icon" />
                            <span>Get your AI-generated workout plan</span>
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
    const [animateIn, setAnimateIn] = useState(false);

    // Load email from localStorage on mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('registration_email');
        if (storedEmail) {
            setEmail(storedEmail);
        }

        // Trigger animation after component mount
        setTimeout(() => {
            setAnimateIn(true);
        }, 100);
    }, []);

    // Handle level selection
    const handleLevelSelect = (level: ExperienceLevel) => {
        setSelectedLevel(level);

        // Store the selection in localStorage
        localStorage.setItem('registration_experience_level', level);

        // Track conversion event (could be connected to analytics)
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
                event: 'experienceLevelSelected',
                experienceLevel: level
            });
        }
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
            className={`features features--registration ${animateIn ? 'animate-in' : ''}`}
        >
            <div className="container">
                <div className="features__header">
                    <h2 className="features__title">What's Your Fitness Experience Level?</h2>
                    <p className="features__subtitle">Tell us where you are in your fitness journey so we can create your perfect workout plan</p>

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
                            benefits={[
                                "Perfect for beginners",
                                "Focuses on form & safety",
                                "Gradual progression"
                            ]}
                            features={[
                                "Step-by-step exercise tutorials",
                                "Beginner-friendly movements",
                                "Progressive workout intensity",
                                "Form-focused instruction videos",
                                "Extra recovery periods",
                                "Habit-building guidance"
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
                            benefits={[
                                "Break through plateaus",
                                "Varied exercise routines",
                                "Balanced programming"
                            ]}
                            features={[
                                "Progressive overload techniques",
                                "Expanded exercise variety",
                                "Targeted muscle group focus",
                                "Balanced cardio & strength training",
                                "Customizable workout intensity",
                                "Performance tracking tools"
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
                            benefits={[
                                "Elite performance focus",
                                "Advanced programming",
                                "Maximum results"
                            ]}
                            features={[
                                "High-intensity training protocols",
                                "Advanced exercise techniques",
                                "Periodization strategies",
                                "Recovery optimization methods",
                                "Performance-focused programming",
                                "Athletic-level progressions"
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