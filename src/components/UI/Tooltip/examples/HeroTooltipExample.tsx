import { Clock, Dumbbell, Heart, Shield, Zap } from 'lucide-react';
import React from 'react';
import { Tooltip, TooltipThemeProvider } from '../../Tooltip';

/**
 * Example component showcasing the Hero tooltip theme variants
 */
const HeroTooltipExample: React.FC = () => {
    return (
        <TooltipThemeProvider theme="hero">
            <div className="hero-theme-demo p-8 space-y-8 bg-gray-900 text-white rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Hero Section Tooltip Examples</h2>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-700">
                        <h3 className="text-xl font-semibold mb-6 text-center">
                            <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text">
                                Hero Theme Tooltips
                            </span>
                        </h3>

                        <div className="flex flex-wrap justify-center gap-6 mb-8">
                            {/* Primary CTA button with tooltip */}
                            <Tooltip
                                content={
                                    <p className="text-xs text-gray-300">
                                        Generate a personalized workout plan in seconds with our AI technology.
                                    </p>
                                }
                                title="Quick Workout Builder"
                                icon={<Zap className="w-4 h-4" />}
                                position="top"
                            >
                                <button className="px-4 py-2 bg-gradient-to-r from-lime-300 to-emerald-400 text-gray-900 rounded-lg font-medium flex items-center">
                                    <Zap className="w-5 h-5 mr-2" />
                                    Get a Free Workout
                                </button>
                            </Tooltip>

                            {/* Secondary CTA button with tooltip */}
                            <Tooltip
                                content={
                                    <p className="text-xs text-gray-300">
                                        Save workouts, track progress, and access premium features with your free account.
                                    </p>
                                }
                                title="Member Benefits"
                                icon={<Shield className="w-4 h-4" />}
                                position="top"
                            >
                                <button className="px-4 py-2 bg-gray-800 text-white border border-gray-700 hover:border-lime-300 rounded-lg font-medium flex items-center">
                                    <Shield className="w-5 h-5 mr-2 text-lime-300" />
                                    Create Account
                                </button>
                            </Tooltip>
                        </div>

                        {/* Feature Pills with Tooltips */}
                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            <Tooltip
                                content="Custom workouts designed for your specific goals and fitness level"
                                position="bottom"
                            >
                                <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700/50 flex items-center cursor-help">
                                    <Dumbbell size={14} className="text-lime-300 mr-2" />
                                    <span>Personalized Workouts</span>
                                </div>
                            </Tooltip>

                            <Tooltip
                                content="Workouts continuously adapt based on your feedback and progress"
                                position="bottom"
                            >
                                <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700/50 flex items-center cursor-help">
                                    <Heart size={14} className="text-lime-300 mr-2" />
                                    <span>AI-Optimized Routines</span>
                                </div>
                            </Tooltip>

                            <Tooltip
                                content="Track your progress with detailed metrics and performance analytics"
                                position="bottom"
                            >
                                <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700/50 flex items-center cursor-help">
                                    <Clock size={14} className="text-lime-300 mr-2" />
                                    <span>Progress Tracking</span>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-gray-800 p-6 rounded-lg">
                    <h3 className="font-medium mb-4">Implementation Notes</h3>
                    <div className="text-sm text-gray-300 space-y-2">
                        <p>The Hero section tooltips use:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Semi-transparent backgrounds with backdrop blur</li>
                            <li>Consistent lime/emerald accent colors</li>
                            <li>Subtle border and shadow effects</li>
                            <li>The TooltipThemeProvider context for section-wide styling</li>
                        </ul>
                    </div>

                    <div className="mt-4 p-3 bg-gray-700/50 rounded border border-gray-600 text-sm">
                        <p className="font-mono text-xs text-gray-300">
                            {`<TooltipThemeProvider theme="hero">`}<br />
                            {`  <section className="hero-section">`}<br />
                            {`    <Tooltip content="..." title="..." icon={<Icon />}>`}<br />
                            {`      <Button>Get Started</Button>`}<br />
                            {`    </Tooltip>`}<br />
                            {`  </section>`}<br />
                            {`</TooltipThemeProvider>`}
                        </p>
                    </div>
                </div>
            </div>
        </TooltipThemeProvider>
    );
};

export default HeroTooltipExample; 