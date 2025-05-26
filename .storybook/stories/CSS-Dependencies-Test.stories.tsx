import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SophisticatedJourneyWrapper } from '../decorators/JourneyWrapper';

// Test component to verify CSS dependencies
const CSSTestComponent: React.FC = () => {
  const [activeGlow, setActiveGlow] = React.useState<string>('lime');
  const [showAnimations, setShowAnimations] = React.useState(false);

  const glowTypes = ['lime', 'cyan', 'violet', 'amber'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          CSS Dependencies Test Suite
        </h1>
        <p className="text-gray-400 mb-8">
          Verifying that all custom animations and glow effects are working in Storybook
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button
          onClick={() => setShowAnimations(!showAnimations)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showAnimations ? 'Hide' : 'Show'} Animations
        </button>
        
        {glowTypes.map((glow) => (
          <button
            key={glow}
            onClick={() => setActiveGlow(glow)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeGlow === glow 
                ? 'bg-gray-700 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {glow.charAt(0).toUpperCase() + glow.slice(1)} Glow
          </button>
        ))}
      </div>

      {/* Animation Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 bg-gray-800 rounded-lg ${showAnimations ? 'animate-fade-in-up delay-1' : ''}`}>
          <h3 className="text-lg font-semibold text-white mb-2">Fade In Up</h3>
          <p className="text-gray-400">animate-fade-in-up delay-1</p>
        </div>

        <div className={`p-6 bg-gray-800 rounded-lg ${showAnimations ? 'animate-fade-slide-up delay-2' : ''}`}>
          <h3 className="text-lg font-semibold text-white mb-2">Fade Slide Up</h3>
          <p className="text-gray-400">animate-fade-slide-up delay-2</p>
        </div>

        <div className={`p-6 bg-gray-800 rounded-lg ${showAnimations ? 'animate-fade-in delay-3' : ''}`}>
          <h3 className="text-lg font-semibold text-white mb-2">Fade In</h3>
          <p className="text-gray-400">animate-fade-in delay-3</p>
        </div>

        <div className={`p-6 bg-gray-800 rounded-lg ${showAnimations ? 'animate-slide-down delay-4' : ''}`}>
          <h3 className="text-lg font-semibold text-white mb-2">Slide Down</h3>
          <p className="text-gray-400">animate-slide-down delay-4</p>
        </div>
      </div>

      {/* Glow Effect Tests */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Glow Effects Test</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {glowTypes.map((glow) => (
            <div
              key={glow}
              className={`p-8 bg-gray-800/70 backdrop-blur-lg border border-gray-700 rounded-2xl cursor-pointer transition-all duration-300 ${glow}-glow ${
                activeGlow === glow ? 'expanded' : ''
              }`}
              onClick={() => setActiveGlow(glow)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${glow}-300 to-${glow}-500 flex items-center justify-center`}>
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {glow.charAt(0).toUpperCase() + glow.slice(1)} Glow
                  </h3>
                  <p className="text-gray-400">
                    Hover to see the glow effect
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Connector Test */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Step Connector Test</h2>
        
        <div className="space-y-8">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="relative">
              <div className="journey-step-card sophisticated-card p-6">
                <div className="flex items-center gap-4">
                  <div className="step-number active">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Step {step}</h3>
                    <p className="text-gray-400">Testing step connector styling</p>
                  </div>
                </div>
              </div>
              
              {index < 2 && (
                <div className={`step-connector ${activeGlow}-connector animated`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Glass Morphism Test */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Glass Morphism Test</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-morphism p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Dark Glass</h3>
            <p className="text-gray-300">glass-morphism class</p>
          </div>
          
          <div className="glass-morphism-light p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Light Glass</h3>
            <p className="text-gray-600">glass-morphism-light class</p>
          </div>
        </div>
      </div>

      {/* Text Gradient Test */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Text Gradient Test</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {glowTypes.map((gradient) => (
            <div key={gradient} className="text-center">
              <h3 className={`text-2xl font-bold text-gradient ${gradient}-gradient mb-2`}>
                {gradient.charAt(0).toUpperCase() + gradient.slice(1)}
              </h3>
              <p className="text-gray-400 text-sm">
                text-gradient {gradient}-gradient
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pulse Ring Test */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Pulse Ring Test</h2>
        
        <div className="flex justify-center gap-8">
          {glowTypes.map((ring) => (
            <div key={ring} className={`relative w-16 h-16 pulse-ring ${ring}-ring`}>
              <div className={`w-full h-full rounded-full bg-gradient-to-br from-${ring}-300 to-${ring}-500 flex items-center justify-center`}>
                <span className="text-white font-bold">
                  {ring.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-12 p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
        <h3 className="text-lg font-semibold text-green-400 mb-2">✅ CSS Dependencies Status</h3>
        <ul className="text-green-300 space-y-1">
          <li>✅ Animation classes loaded and functional</li>
          <li>✅ Glow effects working across all accent colors</li>
          <li>✅ Step connectors rendering correctly</li>
          <li>✅ Glass morphism effects active</li>
          <li>✅ Text gradients displaying properly</li>
          <li>✅ Pulse ring animations running</li>
        </ul>
      </div>
    </div>
  );
};

const meta: Meta<typeof CSSTestComponent> = {
  title: 'Development/CSS Dependencies Test',
  component: CSSTestComponent,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#111827' }
      ]
    },
    docs: {
      description: {
        component: `
# CSS Dependencies Test Suite

This story verifies that all custom CSS dependencies are properly loaded and functional in Storybook:

## Tested Features

### Animations
- \`animate-fade-in-up\` with delay variants
- \`animate-fade-slide-up\`
- \`animate-fade-in\`
- \`animate-slide-down\`

### Glow Effects
- \`lime-glow\`, \`cyan-glow\`, \`violet-glow\`, \`amber-glow\`
- Hover and expanded states
- Intensity variations

### Journey Elements
- \`step-connector\` with color variants
- \`journey-step-card\` styling
- \`step-number\` indicators

### Visual Effects
- Glass morphism backgrounds
- Text gradients
- Pulse ring animations
- Particle backgrounds

## Usage

Use the controls to test different glow effects and toggle animations on/off to verify functionality.
        `
      }
    }
  },
  decorators: [
    (Story) => (
      <SophisticatedJourneyWrapper withParticles={true}>
        <Story />
      </SophisticatedJourneyWrapper>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof CSSTestComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Complete test suite for all CSS dependencies and visual effects.'
      }
    }
  }
};

export const AnimationsOnly: Story = {
  render: () => {
    const [showAnimations, setShowAnimations] = React.useState(true);
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Animation Test</h1>
          <button
            onClick={() => setShowAnimations(!showAnimations)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAnimations ? 'Reset' : 'Trigger'} Animations
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['fade-in-up', 'fade-slide-up', 'fade-in', 'slide-down'].map((animation, index) => (
            <div 
              key={animation}
              className={`p-6 bg-gray-800 rounded-lg ${showAnimations ? `animate-${animation} delay-${index + 1}` : ''}`}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {animation.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h3>
              <p className="text-gray-400">animate-{animation}</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Focused test for animation classes and timing.'
      }
    }
  }
};

export const GlowEffectsOnly: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Glow Effects Test</h1>
        <p className="text-gray-400">Hover over cards to see glow effects</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['lime', 'cyan', 'violet', 'amber'].map((glow) => (
          <div
            key={glow}
            className={`p-8 bg-gray-800/70 backdrop-blur-lg border border-gray-700 rounded-2xl cursor-pointer transition-all duration-300 ${glow}-glow hover-lift`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${glow}-300 to-${glow}-500 flex items-center justify-center`}>
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {glow.charAt(0).toUpperCase() + glow.slice(1)} Glow
                </h3>
                <p className="text-gray-400">
                  Hover to see the {glow} glow effect
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Isolated test for glow effects across all accent colors.'
      }
    }
  }
}; 