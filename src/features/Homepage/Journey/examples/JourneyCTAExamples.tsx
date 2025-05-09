import { ArrowUpRight, Heart } from 'lucide-react';
import React from 'react';
import { JourneyCTA } from '../components';

/**
 * Example usage of the JourneyCTA component in different configurations
 * 
 * This demonstrates how the redesigned component can be easily customized
 * while maintaining design system integration.
 */
const JourneyCTAExamples: React.FC = () => {
    return (
        <div className="space-y-8 p-8 bg-slate-900">
            {/* Default usage */}
            <div>
                <h3 className="text-white mb-4">Default CTA</h3>
                <JourneyCTA
                    text="Start Your Journey"
                    href="https://builder.fitcopilot.ai"
                    variant="default"
                />
            </div>

            {/* Green variant with custom text */}
            <div>
                <h3 className="text-white mb-4">Green Gradient CTA</h3>
                <JourneyCTA
                    text="Get Started with Green"
                    href="/signup"
                    variant="default"
                    gradientColor="green"
                />
            </div>

            {/* Gym variant with custom icon */}
            <div>
                <h3 className="text-white mb-4">Gym Variant CTA</h3>
                <JourneyCTA
                    text="Join Gym Training"
                    href="/gym-signup"
                    variant="gym"
                    icon={<Heart size={20} />}
                />
            </div>

            {/* Sports variant with different size */}
            <div>
                <h3 className="text-white mb-4">Sports Variant CTA (Medium Size)</h3>
                <JourneyCTA
                    text="Start Sports Training"
                    href="/sports"
                    variant="sports"
                    buttonSize="medium"
                />
            </div>

            {/* Wellness variant with no icon */}
            <div>
                <h3 className="text-white mb-4">Wellness Variant CTA (No Icon)</h3>
                <JourneyCTA
                    text="Begin Wellness Journey"
                    href="/wellness"
                    variant="wellness"
                    showIcon={false}
                />
            </div>

            {/* Modern variant with custom icon */}
            <div>
                <h3 className="text-white mb-4">Modern Variant CTA (Custom Icon)</h3>
                <JourneyCTA
                    text="Explore Modern Program"
                    href="/modern"
                    variant="modern"
                    icon={<ArrowUpRight size={20} />}
                />
            </div>

            {/* Custom className example */}
            <div>
                <h3 className="text-white mb-4">With Custom Class</h3>
                <JourneyCTA
                    text="Customize Your Plan"
                    href="/custom"
                    variant="default"
                    className="bg-slate-800 p-4 rounded-lg"
                />
            </div>
        </div>
    );
};

export default JourneyCTAExamples; 