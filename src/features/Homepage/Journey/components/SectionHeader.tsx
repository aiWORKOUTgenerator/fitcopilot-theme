import React from 'react';
import SPACING from '../constants';
import { SectionHeaderProps } from '../types';

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title = <>How It <span className="text-[#CCFF00]">Works</span></>,
    description = "Follow these simple steps to get started with your personalized workout program, powered by our advanced AI technology."
}) => {
    return (
        <div className={`text-center ${SPACING.MARGIN.SECTION_HEADER}`} data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-4 text-white">
                {title}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
                {description}
            </p>
        </div>
    );
};

export default SectionHeader; 