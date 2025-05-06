import React from 'react';
import SPACING from '../constants';
import { JourneyCTAProps } from '../types';

const JourneyCTA: React.FC<JourneyCTAProps> = ({
    text = "Start Your Journey",
    href = "https://builder.fitcopilot.ai"
}) => {
    return (
        <div className={`text-center ${SPACING.MARGIN.CTA_SECTION}`} data-aos="fade-up" data-aos-delay="500">
            <a
                href={href}
                className={`inline-flex items-center ${SPACING.PADDING.CTA_BUTTON} rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-lg shadow-lime-300/30 hover:shadow-xl hover:shadow-lime-300/40 hover:-translate-y-1 button primary`}
            >
                {text}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </a>
        </div>
    );
};

export default JourneyCTA; 