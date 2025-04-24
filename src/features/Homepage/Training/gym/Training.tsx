import { ChevronDown, DumbbellIcon, Scale, Trophy, Zap } from 'lucide-react';
import React, { useState } from 'react';

const Training: React.FC = () => {
    const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

    const programTypes = [
        {
            title: 'Hypertrophy Training',
            description: 'Build lean muscle mass with optimized training protocols',
            icon: <DumbbellIcon className="w-10 h-10 text-violet-400" />,
            benefits: [
                'Progressive overload methodology',
                'Scientific volume management',
                'Specialized muscle group targeting',
                'Recovery optimization'
            ],
            accentColor: 'bg-violet-500'
        },
        {
            title: 'Strength & Power',
            description: 'Develop functional strength for improved performance',
            icon: <Zap className="w-10 h-10 text-violet-400" />,
            benefits: [
                'Compound movement focus',
                'Neural efficiency training',
                'Periodized programming',
                'Progressive intensity scaling'
            ],
            accentColor: 'bg-violet-600'
        },
        {
            title: 'Body Recomposition',
            description: 'Transform your physique through strategic training and nutrition',
            icon: <Scale className="w-10 h-10 text-violet-400" />,
            benefits: [
                'Fat loss while preserving muscle',
                'Metabolic conditioning',
                'Sustainable approach to body change',
                'Balanced macro programming'
            ],
            accentColor: 'bg-violet-700'
        },
        {
            title: 'Sports Performance',
            description: 'Enhance athletic capabilities for your chosen sport',
            icon: <Trophy className="w-10 h-10 text-violet-400" />,
            benefits: [
                'Sport-specific movement patterns',
                'Power and agility development',
                'Injury prevention protocols',
                'Peak performance timing'
            ],
            accentColor: 'bg-violet-800'
        }
    ];

    const toggleProgramDetails = (index: number) => {
        setSelectedProgram(selectedProgram === index ? null : index);
    };

    return (
        <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-gray-50 opacity-70"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-purple-500">
                            Personalized Training Programs
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Our gym offers specialized training methodologies designed to meet your individual goals, whether you're looking to build muscle, increase strength, or improve overall fitness.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {programTypes.map((program, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 h-full flex flex-col"
                        >
                            <div className={`h-2 ${program.accentColor} w-full`}></div>
                            <div className="p-6 flex-grow">
                                <div className="mb-4">{program.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                                <p className="text-gray-600 mb-4">{program.description}</p>

                                <button
                                    onClick={() => toggleProgramDetails(index)}
                                    className="flex items-center text-violet-600 font-medium"
                                >
                                    <span>Key Benefits</span>
                                    <ChevronDown
                                        className={`ml-1 w-5 h-5 transition-transform duration-300 ${selectedProgram === index ? 'transform rotate-180' : ''}`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 mt-2 ${selectedProgram === index ? 'max-h-60' : 'max-h-0'}`}
                                >
                                    <ul className="pl-5 space-y-2">
                                        {program.benefits.map((benefit, i) => (
                                            <li key={i} className="text-gray-600 list-disc">{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        Get Your Custom Program
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Training; 