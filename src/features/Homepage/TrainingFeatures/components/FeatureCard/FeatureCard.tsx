import { Info, RotateCw } from 'lucide-react';
import React, { useState } from 'react';
import Button from '../../../../../components/UI/Button';
import { MediaContainer } from '../MediaContainer';
import './FeatureCard.scss';
import { FeatureCardProps } from './types';

/**
 * FeatureCard component displays training features with flip animation and media support
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
    feature,
    className = '',
    variant = 'default',
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Toggle flip state
    const toggleFlip = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        setIsFlipped(prev => !prev);
    };

    return (
        <div
            className={`feature-card rounded-xl border border-gray-700 transition-all duration-300 ${className}`}
            data-variant={variant}
            data-gradient={feature.gradient}
        >
            <div className="flex flex-col md:flex-row">
                {/* Feature Info - Left Side */}
                <div className="p-6 md:w-1/2">
                    <div className="flex items-start">
                        <div className={`feature-icon bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                            {feature.icon}
                        </div>
                        <div className="ml-4">
                            <h3 className="feature-title text-white text-lg mb-2 hover:text-lime-300 transition-colors">{feature.title}</h3>
                            <p className="feature-description text-gray-400 hover:text-gray-300 transition-colors">{feature.description}</p>
                        </div>
                    </div>
                    <p className="text-gray-300 mt-4">{feature.flipFront}</p>
                    <Button
                        variant="ghost"
                        size="small"
                        className="mt-4 text-lime-300 hover:text-lime-400"
                        onClick={(e) => toggleFlip(e)}
                    >
                        <Info size={16} className="mr-1" />
                        See more details
                    </Button>
                </div>

                {/* Flip Card - Right Side */}
                <div className="md:w-1/2 h-80 relative perspective-container">
                    <div
                        className={`flip-card ${isFlipped ? 'flipped' : ''}`}
                        onClick={() => toggleFlip()}
                    >
                        {/* Front Side */}
                        <div className="flip-front p-6 rounded-r-xl">
                            {feature.media ? (
                                <>
                                    <MediaContainer
                                        src={feature.media.src}
                                        type={feature.media.type}
                                        aspectRatio="16/9"
                                        alt={feature.media.alt || feature.title}
                                        poster={feature.media.type === 'video' ? feature.media.poster : undefined}
                                        fallbackSrc={feature.media.type === 'video' ? feature.media.fallbackSrc : undefined}
                                        controls={feature.media.type === 'video'}
                                        muted={true}
                                        autoPlay={false}
                                        autoPlayOnScroll={feature.media.type === 'video'}
                                        variant={variant}
                                    />
                                    <p className="text-gray-300 text-sm italic text-center">Click to explore feature details</p>
                                </>
                            ) : (
                                <>
                                    <div className={`w-full h-48 secondary-bg flex items-center justify-center`}>
                                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                            {React.isValidElement(feature.icon)
                                                ? <div className="text-white opacity-80">{feature.icon}</div>
                                                : <div className="text-white opacity-80" style={{ width: 32, height: 32 }}></div>
                                            }
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm italic text-center mt-4">Click to explore feature details</p>
                                </>
                            )}
                        </div>

                        {/* Back Side */}
                        <div className="flip-back p-6 rounded-r-xl">
                            <h4 className={`flip-back-title bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text`}>
                                {feature.flipBack.title}
                            </h4>
                            <ul className="feature-details text-sm text-gray-300 space-y-2">
                                {feature.flipBack.details.map((detail: string, i: number) => (
                                    <li key={i} className="flex items-start">
                                        <span className="detail-bullet text-lime-300 mr-2">•</span>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant="ghost"
                                size="small"
                                className="mt-2 text-xs text-lime-300 hover:text-lime-400"
                                onClick={(e) => toggleFlip(e)}
                            >
                                <RotateCw size={12} className="mr-1" />
                                Flip back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureCard; 