import { Check, Crown, Shield, Star } from 'lucide-react';
import React, { useState } from 'react';
import { Tooltip, TooltipThemeProvider } from '../../Tooltip';

/**
 * Example component showcasing the Pricing tooltip theme variants
 */
const PricingTooltipExample: React.FC = () => {
    const [showProTooltip, setShowProTooltip] = useState(false);
    const [showEliteTooltip, setShowEliteTooltip] = useState(false);

    return (
        <TooltipThemeProvider theme="pricing">
            <div className="pricing-theme-demo p-8 space-y-8 bg-[#0B1121] text-white rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Pricing Section Tooltip Examples</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Basic Plan Card */}
                    <div className="pricing-card relative rounded-2xl bg-[#151F38] border border-blue-300/40 shadow-lg p-6">
                        <div className="plan-badge px-3 py-1 rounded-full text-xs mb-4 bg-gray-700/50 text-gray-300 border border-gray-600/30 inline-block">
                            Basic
                        </div>

                        <h3 className="text-2xl font-bold mb-2 text-white">Basic</h3>

                        <div className="mb-6">
                            <div className="flex items-end">
                                <span className="text-3xl font-bold">Free</span>
                            </div>
                            <p className="text-gray-400 mt-2">Perfect for getting started</p>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {/* Feature with tooltip */}
                            <li className="flex items-start">
                                <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-blue-300" />
                                <Tooltip
                                    content="Create up to 5 AI-generated workouts every month"
                                    position="top"
                                    planType="basic"
                                >
                                    <span className="text-gray-300 cursor-help border-b border-dotted border-gray-600">
                                        5 AI workouts per month
                                    </span>
                                </Tooltip>
                            </li>

                            <li className="flex items-start">
                                <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-blue-300" />
                                <span className="text-gray-300">Basic exercise library</span>
                            </li>

                            <li className="flex items-start">
                                <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-blue-300" />
                                <span className="text-gray-300">Progress tracking</span>
                            </li>
                        </ul>

                        <a
                            href="#"
                            className="block text-center py-3 px-6 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        >
                            Get Started
                        </a>
                    </div>

                    {/* Pro Plan Card */}
                    <div
                        className="pricing-card relative rounded-2xl bg-[#151F38] border border-lime-300/40 shadow-lg p-6 cursor-pointer"
                        onMouseEnter={() => setShowProTooltip(true)}
                        onMouseLeave={() => setShowProTooltip(false)}
                    >
                        {/* Pro Badge */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-lime-300 to-emerald-400 rounded-t-xl px-4 py-1 flex items-center justify-center shadow-md">
                            <Star className="w-4 h-4 text-gray-900 mr-1" />
                            <span className="text-xs font-bold text-gray-900">Most Popular</span>
                        </div>

                        {/* Pro Plan Tooltip */}
                        <Tooltip
                            isVisible={showProTooltip}
                            content="Provide feedback directly to our development team and help shape the future of FitCopilot."
                            position="top"
                            title="Beta Release Offer"
                            titleColor="text-lime-300"
                            icon={<Shield className="w-5 h-5 text-lime-300" />}
                            planType="pro"
                            id="pro-tooltip"
                            showOnHover={false}
                        >
                            <div></div> {/* Empty div as child since we're controlling visibility externally */}
                        </Tooltip>

                        <div className="plan-badge px-3 py-1 rounded-full text-xs mb-4 bg-gray-700/50 text-lime-300 border border-lime-300/30 popular-badge inline-block">
                            <Star className="w-3 h-3 mr-1 text-lime-300 inline" />
                            Pro
                        </div>

                        <h3 className="text-2xl font-bold mb-2 text-lime-300">Pro</h3>

                        <div className="mb-6">
                            <div className="flex items-end">
                                <span className="text-3xl font-bold">$9.99</span>
                                <span className="text-white ml-2 mb-1">/month</span>
                            </div>
                            <p className="text-gray-400 mt-2">Advanced features for enthusiasts</p>
                        </div>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start">
                                <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-lime-300" />
                                <span className="text-white font-medium">Unlimited AI workouts</span>
                            </li>

                            <li className="flex items-start">
                                <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-lime-300" />
                                <Tooltip
                                    content="Get access to new features before they are released to the public"
                                    position="top"
                                    planType="pro"
                                >
                                    <span className="text-gray-300 cursor-help border-b border-dotted border-gray-600">
                                        Earlybird beta features
                                    </span>
                                </Tooltip>
                            </li>

                            <li className="flex items-start">
                                <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-lime-300" />
                                <span className="text-gray-300">Advanced analytics</span>
                            </li>
                        </ul>

                        <a
                            href="#"
                            className="block text-center py-3 px-6 rounded-lg font-medium bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900"
                        >
                            Upgrade Now
                        </a>
                    </div>

                    {/* Elite Plan Card */}
                    <div
                        className="pricing-card relative rounded-2xl bg-[#151F38] border border-purple-300/40 shadow-lg p-6 cursor-pointer"
                        onMouseEnter={() => setShowEliteTooltip(true)}
                        onMouseLeave={() => setShowEliteTooltip(false)}
                    >
                        {/* Elite Plan Tooltip */}
                        <Tooltip
                            isVisible={showEliteTooltip}
                            content="Work with real certified trainers who will optimize your plan using both their fitness expertise and AI tools."
                            position="top"
                            title="Certified Trainers"
                            titleColor="text-purple-300"
                            icon={<Crown className="w-5 h-5 text-purple-300" />}
                            planType="elite"
                            id="elite-tooltip"
                            showOnHover={false}
                        >
                            <div></div> {/* Empty div as child since we're controlling visibility externally */}
                        </Tooltip>

                        <div className="plan-badge px-3 py-1 rounded-full text-xs mb-4 bg-gray-700/50 text-purple-300 border border-purple-300/30 elite-badge inline-block">
                            <Crown className="w-3 h-3 mr-1 text-purple-300 inline" />
                            Elite
                        </div>

                        <h3 className="text-2xl font-bold mb-2 text-purple-300">Elite</h3>

                        <div className="mb-6">
                            <div className="flex items-end">
                                <span className="text-3xl font-bold">$19.99</span>
                                <span className="text-white ml-2 mb-1">/month</span>
                            </div>
                            <p className="text-gray-400 mt-2">The ultimate fitness experience</p>
                        </div>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start">
                                <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-purple-300" />
                                <span className="text-white font-medium">Everything in Pro</span>
                            </li>

                            <li className="flex items-start">
                                <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-purple-300" />
                                <Tooltip
                                    content="Get direct access to certified fitness trainers via email"
                                    position="top"
                                    planType="elite"
                                >
                                    <span className="text-gray-300 cursor-help border-b border-dotted border-gray-600">
                                        Direct trainer support
                                    </span>
                                </Tooltip>
                            </li>

                            <li className="flex items-start">
                                <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-purple-300" />
                                <span className="text-gray-300">Personalized nutrition guidance</span>
                            </li>
                        </ul>

                        <a
                            href="#"
                            className="block text-center py-3 px-6 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                        >
                            Get Elite Access
                        </a>
                    </div>
                </div>

                <div className="mt-8 bg-[#151F38] p-6 rounded-lg">
                    <h3 className="font-medium mb-4">Implementation Notes</h3>
                    <div className="text-sm text-gray-300 space-y-2">
                        <p>The Pricing section tooltips feature:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Plan-specific styling (basic, pro, elite)</li>
                            <li>Controlled visibility for card hover effects</li>
                            <li>Consistent branding with accent colors</li>
                            <li>The `planType` prop for consistent styling</li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="p-3 bg-gray-700/50 rounded border border-blue-300/20 text-xs">
                            <div className="font-medium text-blue-300 mb-2">Basic Plan</div>
                            <p className="font-mono text-gray-300">
                                {`<Tooltip`}<br />
                                {`  content="..."`}<br />
                                {`  planType="basic"`}<br />
                                {`>...</Tooltip>`}
                            </p>
                        </div>

                        <div className="p-3 bg-gray-700/50 rounded border border-lime-300/20 text-xs">
                            <div className="font-medium text-lime-300 mb-2">Pro Plan</div>
                            <p className="font-mono text-gray-300">
                                {`<Tooltip`}<br />
                                {`  content="..."`}<br />
                                {`  planType="pro"`}<br />
                                {`>...</Tooltip>`}
                            </p>
                        </div>

                        <div className="p-3 bg-gray-700/50 rounded border border-purple-300/20 text-xs">
                            <div className="font-medium text-purple-300 mb-2">Elite Plan</div>
                            <p className="font-mono text-gray-300">
                                {`<Tooltip`}<br />
                                {`  content="..."`}<br />
                                {`  planType="elite"`}<br />
                                {`>...</Tooltip>`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </TooltipThemeProvider>
    );
};

export default PricingTooltipExample; 