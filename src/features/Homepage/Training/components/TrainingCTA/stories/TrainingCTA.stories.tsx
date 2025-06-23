import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ThemeProvider } from '../../../../../../context/ThemeContext';
import { ThemeOption } from '../../../../../../utils/theming';
import { GlobalVariantProvider } from '../../../../context/GlobalVariantContext';
import TrainingCTA from '../TrainingCTA';
import { TrainingVariantKey } from '../types';

// Helper function to create theme showcase
const ComponentWithThemes = (Component: React.ComponentType<any>, args: any) => {
  const themes: ThemeOption[] = ['default', 'gym', 'sports', 'wellness', 'nutrition'];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {themes.map((theme) => (
        <div key={theme} style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            marginBottom: '16px', 
            fontSize: '18px', 
            fontWeight: '600',
            textTransform: 'capitalize',
            color: '#374151'
          }}>
            {theme} Theme
          </h3>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <ThemeProvider initialTheme={theme}>
              <div style={{ 
                padding: '40px 20px', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px',
                backgroundColor: '#111827', // Dark background to show CTAs properly
                maxWidth: '500px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Component {...args} />
              </div>
            </ThemeProvider>
          </GlobalVariantProvider>
        </div>
      ))}
    </div>
  );
};

// Helper function to create variant comparison
const AllVariantsComparisonHelper = (args: any) => {
  const variants: TrainingVariantKey[] = ['default', 'gym', 'sports', 'wellness', 'modern', 'minimalist', 'classic', 'boutique'];
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
      {variants.map((variant) => (
        <div key={variant} style={{ 
          padding: '20px', 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px',
          backgroundColor: '#111827',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <h4 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            textTransform: 'capitalize',
            color: '#9ca3af',
            margin: 0
          }}>
            {variant} Variant
          </h4>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA {...args} variant={variant} />
          </GlobalVariantProvider>
        </div>
      ))}
    </div>
  );
};

// Interactive state management for demonstration
const InteractiveStateDemo = (args: any) => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClicked, setLastClicked] = useState<string>('');

  const handleClick = (type: string) => {
    setClickCount(prev => prev + 1);
    setLastClicked(type);
    action('CTA clicked')(type);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '8px',
        textAlign: 'center',
        color: '#374151'
      }}>
        <p><strong>Click Counter:</strong> {clickCount}</p>
        <p><strong>Last Clicked:</strong> {lastClicked || 'None'}</p>
      </div>
      
      <div style={{ 
        backgroundColor: '#111827', 
        padding: '40px', 
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
          <TrainingCTA 
            {...args} 
            onNavigate={(type) => handleClick(type)}
          />
        </GlobalVariantProvider>
      </div>
    </div>
  );
};

// Wrapper to provide necessary context for all stories
const StoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
    <div style={{ 
      backgroundColor: '#111827', 
      padding: '40px 20px', 
      borderRadius: '8px',
      minHeight: '150px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {children}
    </div>
  </GlobalVariantProvider>
);

const meta: Meta<typeof TrainingCTA> = {
  title: 'Features/Homepage/Training/Components/TrainingCTA',
  component: TrainingCTA,
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The TrainingCTA component provides advanced call-to-action buttons for the Training feature section with dual sizing options and sophisticated visual effects.

## 🎯 **Core Features**

### **Dual Size Variants**
- **Primary Size** (500px max-width): Full-scale variant for homepage hero sections
- **Secondary Size** (280px max-width): Compact variant for benefits lists with enhanced styling

### **Revolutionary Visual Effects**
- **Enhanced Shimmer System**: Dramatically improved shimmer effects with multi-color gradients
- **Program-Specific Colors**: Custom shimmer colors for strength, fatLoss, fitness, and athletic programs  
- **Advanced Animations**: Hardware-accelerated transforms with cubic-bezier easing
- **Sophisticated Backgrounds**: Elliptical gradients with dynamic blur effects

### **Technical Excellence**
- **Universal Button Integration**: Built on the robust UniversalButton system
- **Theme Compatibility**: Full integration with all 5 theme options (default, gym, sports, wellness, nutrition)
- **Variant System**: 12 distinct visual variants including 8 style variants + 4 program types
- **Performance Optimized**: Mobile-specific optimizations and hardware acceleration

### **Accessibility & Responsive Design**
- **WCAG 2.1 AA Compliance**: Full accessibility support with reduced motion preferences
- **Touch Target Optimization**: iOS-compliant 44px minimum touch targets on mobile
- **Cross-Browser Compatibility**: Consistent behavior across modern browsers
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🚀 **Secondary Variant Enhancements**

The secondary variant features **revolutionary improvements** over the primary variant:

### **Enhanced Shimmer Effects**
- **Higher Base Visibility**: 0.5 opacity vs 0 in primary variant
- **Dramatic Hover Effects**: 0.85 peak opacity vs 1.0 in primary  
- **Faster Animations**: 0.4s timing vs 0.7s in primary
- **Extended Movement**: -150% → 150% range with rotation and skew
- **Multi-Color Gradients**: 5-stop gradient progression for premium feel

### **Refined Typography**
- **Tighter Spacing**: 0.5rem vertical padding vs 0.875rem in primary
- **Improved Font Alignment**: Better top/bottom border relationships
- **Smaller Scale**: 0.875rem font-size for refined appearance
- **Enhanced Letter Spacing**: 0.025em for improved readability

### **Sophisticated Visual Design**
- **Narrower Dimensions**: 280px max-width (44% reduction from primary)
- **Compact Padding**: 1.25rem x 1.5rem for benefits list integration
- **Refined Border Radius**: 12px for more elegant appearance
- **Advanced Background Effects**: Elliptical gradients with blur transitions

## 💡 **Usage Guidelines**

### **When to Use Primary Size**
- Homepage hero sections and main CTAs
- Feature section headers and primary actions
- Full-width content areas and landing pages

### **When to Use Secondary Size**
- Benefits lists and feature descriptions
- Sidebar CTAs and complementary actions
- Content sections with limited width constraints

## 🎨 **Program Type Integration**

The component automatically maps training program types to appropriate color schemes:
- **Strength**: Lime green (#bef264) - Power and muscle building
- **Fat Loss**: Cyan blue (#67e8f9) - Transformation and energy  
- **Fitness**: Violet purple (#c4b5fd) - Balance and versatility
- **Athletic**: Amber orange (#fcd34d) - Performance and intensity

**Note**: This component requires GlobalVariantProvider context for proper theme integration and variant functionality.

## 🔧 **Implementation Example**

\`\`\`tsx
// Primary variant for homepage
<TrainingCTA 
  size="primary"
  variant="sports" 
  onNavigate={handleNavigation}
/>

// Secondary variant for benefits list
<TrainingCTA 
  size="secondary"
  variant="strength" 
  onNavigate={handleNavigation}
/>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onNavigate: {
      action: 'navigated',
      description: 'Function called when the CTA button is clicked',
      table: {
        type: { summary: '(title: string) => void' },
        defaultValue: { summary: 'action("navigated")' }
      }
    },
    variant: {
      control: 'select',
      options: ['default', 'gym', 'sports', 'wellness', 'modern', 'minimalist', 'classic', 'boutique', 'strength', 'fatLoss', 'fitness', 'athletic'],
      description: 'Visual theme variant for the TrainingCTA component including program types',
      table: {
        type: { summary: 'TrainingVariantKey' },
        defaultValue: { summary: 'default' }
      }
    },
    size: {
      control: 'radio',
      options: ['primary', 'secondary'],
      description: 'Size variant - primary for homepage display, secondary for benefits list display',
      table: {
        type: { summary: 'TrainingCTASize' },
        defaultValue: { summary: 'primary' }
      }
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the component',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' }
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof TrainingCTA>;

// ===============================
// Primary Stories
// ===============================

// Default story with standard configuration
export const Default: Story = {
  args: {
    onNavigate: action('navigated'),
    variant: 'default',
    size: 'primary',
    className: ''
  }
};

// Theme showcase story - displays all 5 themes
export const ThemeShowcase: Story = {
  render: (args) => ComponentWithThemes(TrainingCTA, args),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the TrainingCTA appears across all theme options (default, gym, sports, wellness, nutrition).'
      }
    }
  }
};

// All variants comparison
export const AllVariantsComparison: Story = {
  render: AllVariantsComparisonHelper,
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all 8 variant styles showing visual differences and design consistency.'
      }
    }
  }
};

// ===============================
// Variant Stories
// ===============================

export const GymVariant: Story = {
  args: {
    ...Default.args,
    variant: 'gym'
  }
};

export const SportsVariant: Story = {
  args: {
    ...Default.args,
    variant: 'sports'
  }
};

export const WellnessVariant: Story = {
  args: {
    ...Default.args,
    variant: 'wellness'
  }
};

export const ModernVariant: Story = {
  args: {
    ...Default.args,
    variant: 'modern'
  }
};

export const MinimalistVariant: Story = {
  args: {
    ...Default.args,
    variant: 'minimalist'
  }
};

export const ClassicVariant: Story = {
  args: {
    ...Default.args,
    variant: 'classic'
  }
};

export const BoutiqueVariant: Story = {
  args: {
    ...Default.args,
    variant: 'boutique'
  }
};

// ===============================
// Training Program Type Stories
// ===============================

export const StrengthProgram: Story = {
  args: {
    ...Default.args,
    variant: 'strength'
  },
  parameters: {
    docs: {
      description: {
        story: 'TrainingCTA with strength program colors - lime green theme for power and energy.'
      }
    }
  }
};

export const FatLossProgram: Story = {
  args: {
    ...Default.args,
    variant: 'fatLoss'
  },
  parameters: {
    docs: {
      description: {
        story: 'TrainingCTA with fat loss program colors - cyan blue theme for freshness and transformation.'
      }
    }
  }
};

export const FitnessProgram: Story = {
  args: {
    ...Default.args,
    variant: 'fitness'
  },
  parameters: {
    docs: {
      description: {
        story: 'TrainingCTA with fitness program colors - violet purple theme for versatility and balance.'
      }
    }
  }
};

export const AthleticProgram: Story = {
  args: {
    ...Default.args,
    variant: 'athletic'
  },
  parameters: {
    docs: {
      description: {
        story: 'TrainingCTA with athletic program colors - amber orange theme for performance and intensity.'
      }
    }
  }
};

// Program type comparison story
export const AllProgramTypes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', padding: '20px' }}>
      {[
        { variant: 'strength', label: 'Strength Program', description: 'Lime green for power' },
        { variant: 'fatLoss', label: 'Fat Loss Program', description: 'Cyan blue for transformation' },
        { variant: 'fitness', label: 'Fitness Program', description: 'Violet purple for balance' },
        { variant: 'athletic', label: 'Athletic Program', description: 'Amber orange for performance' }
      ].map(({ variant, label, description }) => (
        <div key={variant} style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#1f2937',
            margin: 0,
            textAlign: 'center'
          }}>
            {label}
          </h4>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            margin: 0,
            textAlign: 'center'
          }}>
            {description}
          </p>
          <StoryWrapper>
            <TrainingCTA {...args} variant={variant as TrainingVariantKey} />
          </StoryWrapper>
        </div>
      ))}
    </div>
  ),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all training program type color variations showing the distinct visual identity for each program category.'
      }
    }
  }
};

// ===============================
// Interactive States Stories
// ===============================

export const InteractiveDemo: Story = {
  render: InteractiveStateDemo,
  args: {
    ...Default.args,
    variant: 'sports'
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration showing click handling and state management. Click the button to see interaction feedback.'
      }
    }
  }
};

export const HoverEffects: Story = {
  args: {
    ...Default.args,
    variant: 'sports'
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover over the button to see the enhanced glow effects, transform animations, and icon movement.'
      }
    }
  }
};

export const FocusStates: Story = {
  args: {
    ...Default.args,
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'Use Tab key to focus the button and test keyboard navigation accessibility features.'
      }
    }
  }
};

// ===============================
// Responsive Testing Stories
// ===============================

export const MobileView: Story = {
  args: Default.args,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'CTA button optimized for mobile viewing with appropriate sizing and touch targets.'
      }
    }
  }
};

export const TabletView: Story = {
  args: Default.args,
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'CTA button layout for tablet devices with medium-scale design.'
      }
    }
  }
};

export const DesktopView: Story = {
  args: Default.args,
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    },
    docs: {
      description: {
        story: 'Full desktop CTA button with large sizing and optimal glow effects.'
      }
    }
  }
};

// ===============================
// Accessibility Testing Stories
// ===============================

export const AccessibilityExample: Story = {
  args: {
    ...Default.args,
    variant: 'wellness'
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showcasing accessibility features including ARIA labeling, keyboard navigation, and screen reader support.'
      }
    }
  }
};

export const KeyboardNavigation: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <p style={{ color: '#6b7280', textAlign: 'center', margin: 0 }}>
        Use Tab to navigate, Enter/Space to activate, and Escape to blur
      </p>
      <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
        <TrainingCTA {...args} />
      </GlobalVariantProvider>
    </div>
  ),
  args: {
    ...Default.args,
    variant: 'sports'
  },
  parameters: {
    docs: {
      description: {
        story: 'Test keyboard navigation patterns and focus management for accessibility compliance.'
      }
    }
  }
};

// ===============================
// Custom Styling Stories
// ===============================

export const CustomClassName: Story = {
  args: {
    ...Default.args,
    className: 'custom-training-cta-demo',
    variant: 'modern'
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing how to apply custom CSS classes for additional styling customization.'
      }
    }
  }
};

// ===============================
// Performance Testing Stories
// ===============================

export const MultipleInstances: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} style={{ 
          backgroundColor: '#111827', 
          padding: '20px', 
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA 
              {...args} 
              variant={['default', 'sports', 'wellness', 'modern', 'gym', 'classic'][i-1] as any}
              onNavigate={action(`button-${i}-clicked`)}
            />
          </GlobalVariantProvider>
        </div>
      ))}
    </div>
  ),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance testing with multiple TrainingCTA instances showing different variants simultaneously.'
      }
    }
  }
};

// ===============================
// Advanced Integration Stories
// ===============================

export const WithCustomContent: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
      <div style={{ 
        backgroundColor: '#1f2937', 
        padding: '40px', 
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h2 style={{ color: '#f9fafb', fontSize: '2rem', marginBottom: '16px' }}>
          Ready to Transform Your Fitness?
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '1.125rem', marginBottom: '32px' }}>
          Join thousands of members who have already achieved their fitness goals with our comprehensive training programs.
        </p>
        <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
          <TrainingCTA {...args} />
        </GlobalVariantProvider>
      </div>
    </div>
  ),
  args: {
    ...Default.args,
    variant: 'sports'
  },
  parameters: {
    docs: {
      description: {
        story: 'Integration example showing the TrainingCTA in a realistic content context with surrounding elements.'
      }
    }
  }
};

export const AnimationShowcase: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
      <div style={{ 
        color: '#6b7280', 
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h3 style={{ marginBottom: '12px' }}>Animation Features</h3>
        <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <li>Hover transform: translateY(-4px)</li>
          <li>Enhanced glow effects with blur transitions</li>
          <li>Icon slide animation (translateX(5px))</li>
          <li>Box shadow expansion on hover</li>
          <li>Reduced motion support for accessibility</li>
        </ul>
      </div>
      
      <div style={{ 
        backgroundColor: '#111827', 
        padding: '40px', 
        borderRadius: '8px'
      }}>
        <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
          <TrainingCTA {...args} />
        </GlobalVariantProvider>
      </div>
    </div>
  ),
  args: {
    ...Default.args,
    variant: 'sports'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of all animation features including hover effects, transforms, and accessibility considerations.'
      }
    }
  }
};

// ===============================
// Edge Case Stories
// ===============================

export const LongTextHandling: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '14px' }}>
        Note: The button text is fixed as "View All Programs" but this tests container flexibility
      </p>
      <div style={{ 
        backgroundColor: '#111827', 
        padding: '20px', 
        borderRadius: '8px',
        maxWidth: '300px'
      }}>
        <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
          <TrainingCTA {...args} />
        </GlobalVariantProvider>
      </div>
    </div>
  ),
  args: {
    ...Default.args,
    variant: 'modern'
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing button behavior in constrained width containers and text overflow handling.'
      }
    }
  }
};

export const ReducedMotion: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#fef3c7', 
        borderRadius: '8px',
        color: '#92400e',
        textAlign: 'center',
        fontSize: '14px'
      }}>
        ⚠️ Set your OS to "Reduce motion" to see accessibility behavior
      </div>
      <div style={{ 
        backgroundColor: '#111827', 
        padding: '40px', 
        borderRadius: '8px'
      }}>
        <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
          <TrainingCTA {...args} />
        </GlobalVariantProvider>
      </div>
    </div>
  ),
  args: {
    ...Default.args,
    variant: 'sports'
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests reduced motion behavior for users with motion sensitivity. Animations are disabled when prefers-reduced-motion is set.'
      }
    }
  }
};

// ===============================
// Size Variant Stories (NEW - Epic 3)
// ===============================

// Size Comparison Story - shows both primary and secondary side by side
export const SizeComparison: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Primary Size (Homepage Display)
        </h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', maxWidth: '400px' }}>
          Max-width: 500px • Standard padding • Designed for homepage sections
        </p>
        <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
          <div style={{ 
            backgroundColor: '#111827', 
            padding: '40px', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <TrainingCTA {...args} size="primary" />
          </div>
        </GlobalVariantProvider>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Secondary Size (Benefits List Display)
        </h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', maxWidth: '400px' }}>
          Max-width: 280px • Compact padding • Enhanced shimmer • Refined typography
        </p>
        <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
          <div style={{ 
            backgroundColor: '#111827', 
            padding: '40px', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <TrainingCTA {...args} size="secondary" />
          </div>
        </GlobalVariantProvider>
      </div>
    </div>
  ),
  args: { 
    ...Default.args,
    variant: 'sports'
  },
  parameters: {
    docs: {
      description: {
        story: 'Size comparison showing primary variant (500px max-width) for homepage and secondary variant (280px max-width) for benefits list placement. The secondary variant features enhanced shimmer effects and tighter typography spacing.'
      }
    }
  }
};

// Secondary Size Showcase - focus on secondary variant features
export const SecondaryVariant: Story = {
  args: {
    ...Default.args,
    size: 'secondary',
    variant: 'sports'
  },
  parameters: {
    docs: {
      description: {
        story: 'The secondary variant is specifically designed for benefits list integration with narrower dimensions (280px), enhanced shimmer effects, and improved typography spacing.'
      }
    }
  }
};

// Enhanced Shimmer Showcase
export const ShimmerEffectDemo: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
      <div style={{ 
        color: '#f9fafb', 
        textAlign: 'center', 
        maxWidth: '500px',
        backgroundColor: '#1f2937',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h4 style={{ fontSize: '18px', marginBottom: '12px' }}>Enhanced Shimmer Effect</h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
          The secondary variant features a dramatically enhanced shimmer effect:
        </p>
        <ul style={{ 
          color: '#d1d5db', 
          fontSize: '13px', 
          textAlign: 'left', 
          lineHeight: '1.5',
          paddingLeft: '20px'
        }}>
          <li><strong>Base Opacity:</strong> 0.5 (vs 0 in primary)</li>
          <li><strong>Hover Opacity:</strong> 0.85 (vs 1.0 in primary)</li>
          <li><strong>Animation Speed:</strong> 0.4s (vs 0.7s in primary)</li>
          <li><strong>Movement Range:</strong> -150% → 150% with rotation</li>
          <li><strong>Gradient:</strong> 5-stop multi-color progression</li>
        </ul>
        <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '12px' }}>
          <strong>Hover over the button below to see the enhanced shimmer in action!</strong>
        </p>
      </div>
      
      <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
        <div style={{ 
          backgroundColor: '#111827', 
          padding: '40px', 
          borderRadius: '8px'
        }}>
          <TrainingCTA {...args} size="secondary" variant="sports" />
        </div>
      </GlobalVariantProvider>
    </div>
  ),
  args: { ...Default.args },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of the dramatically enhanced shimmer effect in the secondary variant. The effect is much more pronounced with higher opacity values, faster animations, and sophisticated multi-color gradients.'
      }
    }
  }
};

// Benefits List Integration Context
export const BenefitsListContext: Story = {
  render: (args) => (
    <div style={{ 
      backgroundColor: '#1f2937', 
      padding: '40px', 
      borderRadius: '12px',
      maxWidth: '650px',
      margin: '0 auto'
    }}>
      <h3 style={{ 
        color: '#f9fafb', 
        fontSize: '24px', 
        fontWeight: '700', 
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        AI-Powered Training Benefits
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <ul style={{ 
          color: '#d1d5db', 
          lineHeight: '1.8', 
          fontSize: '15px',
          paddingLeft: '20px',
          margin: 0
        }}>
          <li>Personalized workout programs</li>
          <li>Real-time form correction</li>
          <li>Progress tracking & analytics</li>
          <li>Adaptive difficulty scaling</li>
        </ul>
        <ul style={{ 
          color: '#d1d5db', 
          lineHeight: '1.8', 
          fontSize: '15px',
          paddingLeft: '20px',
          margin: 0
        }}>
          <li>Nutrition guidance integration</li>
          <li>Recovery optimization</li>
          <li>Injury prevention insights</li>
          <li>Community challenges</li>
        </ul>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
          <TrainingCTA {...args} size="secondary" />
        </GlobalVariantProvider>
      </div>
    </div>
  ),
  args: { ...Default.args, variant: 'wellness' },
  parameters: {
    docs: {
      description: {
        story: 'Secondary TrainingCTA shown in realistic benefits list context. This demonstrates proper spacing, visual hierarchy, and integration with surrounding content. The narrower design fits perfectly within benefit sections.'
      }
    }
  }
};

// All Program Types with Secondary Size
export const SecondaryProgramTypes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', padding: '20px' }}>
      {[
        { variant: 'strength', label: 'Strength Program', description: 'Lime green shimmer for power and muscle building', color: '#bef264' },
        { variant: 'fatLoss', label: 'Fat Loss Program', description: 'Cyan blue shimmer for transformation and energy', color: '#67e8f9' },
        { variant: 'fitness', label: 'Fitness Program', description: 'Violet purple shimmer for balance and versatility', color: '#c4b5fd' },
        { variant: 'athletic', label: 'Athletic Program', description: 'Amber orange shimmer for performance and intensity', color: '#fcd34d' }
      ].map(({ variant, label, description, color }) => (
        <div key={variant} style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: '#1f2937',
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${color}20`
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: color,
            margin: 0,
            textAlign: 'center'
          }}>
            {label}
          </h4>
          <p style={{ 
            fontSize: '13px', 
            color: '#9ca3af',
            margin: 0,
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            {description}
          </p>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA {...args} variant={variant as TrainingVariantKey} size="secondary" />
          </GlobalVariantProvider>
        </div>
      ))}
    </div>
  ),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: 'All training program types displayed with the secondary size variant. Each program has custom shimmer colors that create distinct visual identities while maintaining the enhanced secondary styling features.'
      }
    }
  }
};

// Side-by-Side Variant Comparison for Secondary Size
export const SecondaryVariantComparison: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
      {['default', 'gym', 'sports', 'wellness', 'modern', 'minimalist', 'classic', 'boutique'].map((variant) => (
        <div key={variant} style={{ 
          padding: '20px', 
          border: '1px solid #374151', 
          borderRadius: '8px',
          backgroundColor: '#111827',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <h4 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            textTransform: 'capitalize',
            color: '#9ca3af',
            margin: 0
          }}>
            {variant} • Secondary
          </h4>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA {...args} variant={variant as TrainingVariantKey} size="secondary" />
          </GlobalVariantProvider>
        </div>
      ))}
    </div>
  ),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: 'All 8 visual variants displayed with secondary sizing. This shows how the enhanced shimmer effects and refined typography work consistently across all theme variations.'
      }
    }
  }
};

// Responsive Secondary Showcase
export const ResponsiveSecondaryDemo: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ textAlign: 'center', color: '#f9fafb' }}>
        <h4 style={{ fontSize: '18px', marginBottom: '12px' }}>Responsive Secondary Variant</h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', maxWidth: '500px', margin: '0 auto' }}>
          The secondary variant adapts across all screen sizes while maintaining enhanced shimmer effects and optimal touch targets.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Mobile (≤480px)', width: '280px', note: 'Touch-optimized with 44px minimum height' },
          { label: 'Tablet (≤768px)', width: '320px', note: 'Balanced design with performance optimization' },
          { label: 'Desktop (≥1024px)', width: '280px', note: 'Enhanced effects with blur transitions' }
        ].map(({ label, width, note }) => (
          <div key={label} style={{ 
            backgroundColor: '#1f2937',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h5 style={{ color: '#f9fafb', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              {label}
            </h5>
            <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '16px', lineHeight: '1.4' }}>
              {note}
            </p>
            <div style={{ 
              backgroundColor: '#111827',
              padding: '20px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
                <div style={{ maxWidth: width }}>
                  <TrainingCTA {...args} size="secondary" variant="sports" />
                </div>
              </GlobalVariantProvider>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  args: { ...Default.args },
  parameters: {
    docs: {
      description: {
        story: 'Responsive behavior demonstration for the secondary variant. Shows how the component adapts across different viewport sizes while maintaining enhanced shimmer effects and accessibility compliance.'
      }
    }
  }
};

// ===============================
// Test Story for Icon Centering Fix
// ===============================

export const IconCenteringTest: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Icon Centering & Compact Padding Verification
        </h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', maxWidth: '500px' }}>
          ✅ The arrow icon should be perfectly centered vertically with the text.<br />
          ✅ The secondary variant should have very tight padding where borders hug the font.
        </p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        width: '100%',
        maxWidth: '800px'
      }}>
        {/* Primary Size Test */}
        <div style={{ textAlign: 'center' }}>
          <h5 style={{ color: '#f9fafb', fontSize: '16px', marginBottom: '12px' }}>Primary Size</h5>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px' }}>
            Standard RegistrationButton padding
          </p>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <div style={{ 
              backgroundColor: '#111827', 
              padding: '30px', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <TrainingCTA {...args} size="primary" variant="default" />
            </div>
          </GlobalVariantProvider>
        </div>
        
        {/* Secondary Size Test */}
        <div style={{ textAlign: 'center' }}>
          <h5 style={{ color: '#f9fafb', fontSize: '16px', marginBottom: '12px' }}>Secondary Size</h5>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px' }}>
            Compact padding (0.25rem) - borders hug font
          </p>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <div style={{ 
              backgroundColor: '#111827', 
              padding: '30px', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <TrainingCTA {...args} size="secondary" variant="sports" />
            </div>
          </GlobalVariantProvider>
        </div>
      </div>
      
      {/* Padding Comparison Demo */}
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <h5 style={{ color: '#f9fafb', fontSize: '16px', marginBottom: '16px', textAlign: 'center' }}>
          Padding Comparison: Primary vs Secondary
        </h5>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          backgroundColor: '#1f2937',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>
              Primary: 1rem (16px) padding
            </p>
            <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
              <TrainingCTA {...args} size="primary" variant="wellness" />
            </GlobalVariantProvider>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>
              Secondary: 0.25rem (4px) padding
            </p>
            <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
              <TrainingCTA {...args} size="secondary" variant="wellness" />
            </GlobalVariantProvider>
          </div>
        </div>
      </div>
      
      {/* Program Type Compact Tests */}
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h5 style={{ color: '#f9fafb', fontSize: '16px', marginBottom: '16px', textAlign: 'center' }}>
          Program Type Compact Design Tests
        </h5>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px'
        }}>
          {['strength', 'fatLoss', 'fitness', 'athletic'].map((programType) => (
            <div key={programType} style={{ textAlign: 'center' }}>
              <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px', textTransform: 'capitalize' }}>
                {programType} - Compact Padding
              </p>
              <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
                <div style={{ 
                  backgroundColor: '#111827', 
                  padding: '20px', 
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <TrainingCTA 
                    {...args} 
                    size="secondary" 
                    variant={programType as TrainingVariantKey} 
                  />
                </div>
              </GlobalVariantProvider>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: `
Test story to verify that:
1. The arrow icon is properly centered vertically with the button text across all variants and sizes
2. The secondary variant has very tight vertical padding (0.25rem) where the borders hug the font
3. The compact design is maintained across all program types while preserving enhanced visual effects

**Design Intent**: The secondary variant should appear much more compact than the primary variant, with minimal vertical space between the text and the button borders.
        `
      }
    }
  }
};

// ===============================
// Epic 4: Integration Testing Stories
// ===============================

// Comprehensive Integration Testing
export const IntegrationTestingSuite: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#f9fafb', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Epic 4: Integration Testing Suite
        </h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', maxWidth: '600px' }}>
          Comprehensive testing to ensure the secondary TrainingCTA integrates seamlessly 
          without breaking existing functionality. All existing TrainingCTA usage should 
          default to primary size and maintain full compatibility.
        </p>
      </div>
      
      {/* Test 1: Default Behavior (Should remain unchanged) */}
      <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px' }}>
        <h5 style={{ color: '#fbbf24', fontSize: '16px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>
          ✅ Test 1: Default Behavior (Primary Size)
        </h5>
        <p style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
          Existing TrainingCTA usage without size prop should default to primary and work exactly as before
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA 
              onNavigate={action('Default TrainingCTA clicked')}
              variant="default"
              // No size prop - should default to primary
            />
          </GlobalVariantProvider>
        </div>
      </div>

      {/* Test 2: Explicit Primary Size */}
      <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px' }}>
        <h5 style={{ color: '#fbbf24', fontSize: '16px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>
          ✅ Test 2: Explicit Primary Size
        </h5>
        <p style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
          Explicitly setting size="primary" should produce identical results to default behavior
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA 
              onNavigate={action('Primary TrainingCTA clicked')}
              variant="sports"
              size="primary" // Explicit primary
            />
          </GlobalVariantProvider>
        </div>
      </div>

      {/* Test 3: Secondary Size Integration */}
      <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px' }}>
        <h5 style={{ color: '#10b981', fontSize: '16px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>
          ✅ Test 3: Secondary Size Integration
        </h5>
        <p style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
          New secondary size should be significantly more compact with enhanced effects
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA 
              onNavigate={action('Secondary TrainingCTA clicked')}
              variant="wellness"
              size="secondary" // New secondary size
            />
          </GlobalVariantProvider>
        </div>
      </div>

      {/* Test 4: Theme Switching Compatibility */}
      <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px' }}>
        <h5 style={{ color: '#8b5cf6', fontSize: '16px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>
          ✅ Test 4: Theme Switching Compatibility
        </h5>
        <p style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
          Both sizes should work across all theme options
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>Primary + Gym Theme</p>
            <GlobalVariantProvider initialVariant="gym" enableWpIntegration={false}>
              <TrainingCTA 
                onNavigate={action('Gym Primary clicked')}
                variant="strength"
                size="primary"
              />
            </GlobalVariantProvider>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>Secondary + Sports Theme</p>
            <GlobalVariantProvider initialVariant="sports" enableWpIntegration={false}>
              <TrainingCTA 
                onNavigate={action('Sports Secondary clicked')}
                variant="athletic"
                size="secondary"
              />
            </GlobalVariantProvider>
          </div>
        </div>
      </div>

      {/* Test 5: All Program Types with Both Sizes */}
      <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px' }}>
        <h5 style={{ color: '#f59e0b', fontSize: '16px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>
          ✅ Test 5: Program Types Compatibility
        </h5>
        <p style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
          All program types should work with both primary and secondary sizes
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {['strength', 'fatLoss', 'fitness', 'athletic'].map((programType) => (
            <div key={programType} style={{ textAlign: 'center' }}>
              <h6 style={{ 
                color: '#f9fafb', 
                fontSize: '14px', 
                fontWeight: '600', 
                marginBottom: '12px',
                textTransform: 'capitalize'
              }}>
                {programType}
              </h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '4px' }}>Primary</p>
                  <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
                    <div style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}>
                      <TrainingCTA 
                        onNavigate={action(`${programType} Primary clicked`)}
                        variant={programType as TrainingVariantKey}
                        size="primary"
                      />
                    </div>
                  </GlobalVariantProvider>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '4px' }}>Secondary</p>
                  <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
                    <TrainingCTA 
                      onNavigate={action(`${programType} Secondary clicked`)}
                      variant={programType as TrainingVariantKey}
                      size="secondary"
                    />
                  </GlobalVariantProvider>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test 6: Responsive Behavior Validation */}
      <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px' }}>
        <h5 style={{ color: '#06b6d4', fontSize: '16px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>
          ✅ Test 6: Responsive Behavior
        </h5>
        <p style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
          Both sizes should adapt properly across different viewport sizes
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Mobile (320px)', maxWidth: '280px' },
            { label: 'Tablet (768px)', maxWidth: '400px' },
            { label: 'Desktop (1024px+)', maxWidth: '500px' }
          ].map(({ label, maxWidth }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>{label}</p>
              <div style={{ maxWidth, margin: '0 auto', border: '1px dashed #374151', padding: '12px', borderRadius: '6px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px' }}>Primary</p>
                  <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
                    <div style={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>
                      <TrainingCTA 
                        onNavigate={action(`${label} Primary clicked`)}
                        variant="default"
                        size="primary"
                      />
                    </div>
                  </GlobalVariantProvider>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px' }}>Secondary</p>
                  <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
                    <div style={{ transform: 'scale(0.9)', transformOrigin: 'center' }}>
                      <TrainingCTA 
                        onNavigate={action(`${label} Secondary clicked`)}
                        variant="sports"
                        size="secondary"
                      />
                    </div>
                  </GlobalVariantProvider>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test 7: Backward Compatibility Check */}
      <div style={{ backgroundColor: '#dc2626', padding: '20px', borderRadius: '12px', border: '2px solid #ef4444' }}>
        <h5 style={{ color: '#fef2f2', fontSize: '16px', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>
          🔍 Critical: Backward Compatibility Verification
        </h5>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ backgroundColor: '#991b1b', padding: '16px', borderRadius: '8px' }}>
            <h6 style={{ color: '#fecaca', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              BEFORE (Simulated)
            </h6>
            <p style={{ color: '#fde68a', fontSize: '12px', marginBottom: '8px' }}>
              Original TrainingCTA behavior
            </p>
            <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
              <TrainingCTA 
                onNavigate={action('Legacy behavior')}
                variant="default"
                // No size prop (legacy usage)
              />
            </GlobalVariantProvider>
          </div>
          <div style={{ backgroundColor: '#166534', padding: '16px', borderRadius: '8px' }}>
            <h6 style={{ color: '#bbf7d0', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              AFTER (Current)
            </h6>
            <p style={{ color: '#fed7aa', fontSize: '12px', marginBottom: '8px' }}>
              Should be identical
            </p>
            <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
              <TrainingCTA 
                onNavigate={action('Current behavior')}
                variant="default"
                size="primary" // Explicit primary (should be identical)
              />
            </GlobalVariantProvider>
          </div>
        </div>
        <p style={{ color: '#fecaca', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
          ⚠️ These should look and behave identically. Any differences indicate breaking changes.
        </p>
      </div>
    </div>
  ),
  args: {
    onNavigate: action('Integration test CTA clicked'),
    variant: 'default',
    size: 'primary'
  },
  parameters: {
    docs: {
      description: {
        story: `
**Epic 4: Integration Testing Suite**

This comprehensive test suite validates:

1. **Backward Compatibility**: Existing TrainingCTA usage continues to work exactly as before
2. **Default Behavior**: Components without size prop default to primary size
3. **Theme Integration**: Both primary and secondary sizes work across all theme variants
4. **Program Type Support**: All program types (strength, fatLoss, fitness, athletic) work with both sizes
5. **Responsive Behavior**: Both sizes adapt properly across viewport sizes
6. **Enhanced Features**: Secondary size provides the intended compact design and enhanced effects

**Critical Success Criteria:**
- No breaking changes to existing functionality
- Primary size maintains original behavior and appearance
- Secondary size provides enhanced compact design
- All variants and themes remain fully compatible
        `
      }
    }
  }
};

// ===============================
// Homepage Implementation Context
// ===============================

// Real Homepage Implementation Context
export const HomepageExpandedContentDemo: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Secondary TrainingCTA in Homepage Expanded Content
        </h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', maxWidth: '500px' }}>
          This shows the secondary TrainingCTA as it appears in the actual homepage program cards expanded content.
          The ProgramsList component now uses this instead of UniversalButton.
        </p>
      </div>
      
      {/* Simulated expanded content container */}
      <div style={{ 
        backgroundColor: 'var(--training-expanded-bg, rgba(31, 41, 55, 0.4))', 
        borderRadius: '1rem',
        border: '1px solid var(--training-card-border, #374151)',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '500px'
      }}>
        <h4 style={{ 
          color: 'var(--training-text, #f9fafb)', 
          fontWeight: '600', 
          marginBottom: '1rem'
        }}>
          Key Benefits
        </h4>
        
        <ul style={{ 
          listStyle: 'none',
          padding: 0,
          margin: '0 0 2rem 0'
        }}>
          {[
            'Personalized AI workout plans',
            'Real-time form correction',
            'Progress tracking & analytics',
            'Adaptive difficulty scaling'
          ].map((benefit, index) => (
            <li key={index} style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
              color: 'var(--training-text, #f9fafb)'
            }}>
              <span style={{ 
                color: '#FB923C',
                marginRight: '0.5rem',
                fontSize: '16px'
              }}>
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>
        
        <div style={{ textAlign: 'center' }}>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA 
              {...args} 
              size="secondary" 
              variant="sports"
              className="training-expanded__cta-button"
            />
          </GlobalVariantProvider>
        </div>
      </div>
    </div>
  ),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of the secondary TrainingCTA as it appears in the actual homepage program cards expanded content. The ProgramsList component has been updated to use this instead of the generic UniversalButton.'
      }
    }
  }
};

// Before vs After Implementation Comparison
export const BeforeAfterImplementation: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#f9fafb', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          BEFORE: UniversalButton
        </h4>
        <div style={{ 
          backgroundColor: 'var(--training-expanded-bg, rgba(31, 41, 55, 0.4))', 
          borderRadius: '1rem',
          border: '1px solid #374151',
          padding: '1.5rem'
        }}>
          <h5 style={{ 
            color: '#f9fafb', 
            fontWeight: '600', 
            marginBottom: '1rem',
            fontSize: '14px'
          }}>
            Key Benefits
          </h5>
          
          <ul style={{ 
            listStyle: 'none',
            padding: 0,
            margin: '0 0 1.5rem 0'
          }}>
            {[
              'Generic button styling',
              'Limited customization',
              'No training-specific effects'
            ].map((benefit, index) => (
              <li key={index} style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.4rem',
                color: '#d1d5db',
                fontSize: '13px'
              }}>
                <span style={{ 
                  color: '#6b7280',
                  marginRight: '0.5rem'
                }}>
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
          
          <div style={{ textAlign: 'center' }}>
            {/* Simulated old UniversalButton */}
            <button style={{
              backgroundColor: 'transparent',
              border: '1px solid #6b7280',
              color: '#9ca3af',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Explore Program →
            </button>
          </div>
        </div>
        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '12px' }}>
          ❌ Generic styling, no training branding
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#f9fafb', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          AFTER: Secondary TrainingCTA
        </h4>
        <div style={{ 
          backgroundColor: 'var(--training-expanded-bg, rgba(31, 41, 55, 0.4))', 
          borderRadius: '1rem',
          border: '1px solid #374151',
          padding: '1.5rem'
        }}>
          <h5 style={{ 
            color: '#f9fafb', 
            fontWeight: '600', 
            marginBottom: '1rem',
            fontSize: '14px'
          }}>
            Key Benefits
          </h5>
          
          <ul style={{ 
            listStyle: 'none',
            padding: 0,
            margin: '0 0 1.5rem 0'
          }}>
            {[
              'Enhanced shimmer effects',
              'Training-specific branding',
              'Responsive design optimized'
            ].map((benefit, index) => (
              <li key={index} style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.4rem',
                color: '#d1d5db',
                fontSize: '13px'
              }}>
                <span style={{ 
                  color: '#FB923C',
                  marginRight: '0.5rem'
                }}>
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
          
          <div style={{ textAlign: 'center' }}>
            <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
              <TrainingCTA 
                {...args} 
                size="secondary" 
                variant="sports"
                className="training-expanded__cta-button"
              />
            </GlobalVariantProvider>
          </div>
        </div>
        <p style={{ color: '#10b981', fontSize: '12px', marginTop: '12px' }}>
          ✅ Enhanced effects, training branding, better UX
        </p>
      </div>
    </div>
  ),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: 'Before and after comparison showing the upgrade from generic UniversalButton to the enhanced secondary TrainingCTA in the homepage program cards expanded content.'
      }
    }
  }
};

// Transparent Secondary Variant Demo
export const TransparentSecondaryDemo: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Transparent Secondary TrainingCTA
        </h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', maxWidth: '500px' }}>
          The secondary variant now features a 100% transparent container, showing only the button 
          without the darker background frame. Perfect for clean integration in program cards.
        </p>
      </div>
      
      {/* Comparison: With vs Without background frame */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%', maxWidth: '700px' }}>
        <div style={{ textAlign: 'center' }}>
          <h5 style={{ color: '#f9fafb', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            Primary (With Background Frame)
          </h5>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <div style={{ 
              backgroundColor: '#1f2937', 
              padding: '20px', 
              borderRadius: '8px'
            }}>
              <TrainingCTA {...args} size="primary" variant="sports" />
            </div>
          </GlobalVariantProvider>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h5 style={{ color: '#f9fafb', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            Secondary (Transparent Container)
          </h5>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <div style={{ 
              backgroundColor: '#1f2937', 
              padding: '20px', 
              borderRadius: '8px'
            }}>
              <TrainingCTA {...args} size="secondary" variant="sports" />
            </div>
          </GlobalVariantProvider>
        </div>
      </div>
      
      {/* Program Card Integration Demo */}
      <div style={{ 
        backgroundColor: 'var(--training-expanded-bg, rgba(31, 41, 55, 0.4))', 
        borderRadius: '1rem',
        border: '1px solid var(--training-card-border, #374151)',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '450px'
      }}>
        <h4 style={{ 
          color: 'var(--training-text, #f9fafb)', 
          fontWeight: '600', 
          marginBottom: '1rem'
        }}>
          Key Benefits
        </h4>
        
        <ul style={{ 
          listStyle: 'none',
          padding: 0,
          margin: '0 0 1.5rem 0'
        }}>
          {[
            'Transparent button integration',
            'No background frame interference',
            'Clean program card aesthetic',
            'Enhanced shimmer effects retained'
          ].map((benefit, index) => (
            <li key={index} style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
              color: 'var(--training-text, #f9fafb)'
            }}>
              <span style={{ 
                color: '#FB923C',
                marginRight: '0.5rem',
                fontSize: '16px'
              }}>
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>
        
        <div style={{ textAlign: 'center' }}>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA 
              {...args} 
              size="secondary" 
              variant="wellness"
              className="training-expanded__cta-button"
            />
          </GlobalVariantProvider>
        </div>
      </div>
    </div>
  ),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: 'The secondary variant now features a 100% transparent container background, removing the darker frame to provide clean integration in program cards while retaining enhanced shimmer effects.'
      }
    }
  }
};

// Improved Section Spacing Demo
export const ImprovedSectionSpacing: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Enhanced Section Spacing
        </h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px' }}>
          Improved visual separation between training program cards and the primary TrainingCTA with 
          increased top margin (6rem on mobile, 7rem on desktop).
        </p>
      </div>
      
      {/* Simulated Training Section Layout */}
      <div style={{ 
        backgroundColor: '#1f2937', 
        padding: '40px 20px', 
        borderRadius: '12px',
        position: 'relative'
      }}>
        {/* Simulated Training Cards */}
        <div style={{ marginBottom: '6rem' }}> {/* New spacing amount */}
          {/* First Card */}
          <div style={{ 
            backgroundColor: 'rgba(31, 41, 55, 0.5)',
            border: '1px solid rgba(55, 65, 81, 0.5)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: 'rgba(251, 191, 36, 0.1)', 
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#FCD34D', fontSize: '24px' }}>💪</span>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#FCD34D', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Strength Building
                </h3>
                <p style={{ color: '#F3F4F6', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Build muscle mass and increase overall strength with progressive overload training.
                </p>
              </div>
            </div>
          </div>
          
          {/* Second Card */}
          <div style={{ 
            backgroundColor: 'rgba(31, 41, 55, 0.5)',
            border: '1px solid rgba(55, 65, 81, 0.5)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: 'rgba(251, 191, 36, 0.1)', 
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#FCD34D', fontSize: '24px' }}>🔥</span>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#FCD34D', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Fat Loss
                </h3>
                <p style={{ color: '#F3F4F6', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Burn calories efficiently while maintaining muscle mass through targeted workouts.
                </p>
              </div>
            </div>
          </div>
          
          {/* Third Card */}
          <div style={{ 
            backgroundColor: 'rgba(31, 41, 55, 0.5)',
            border: '1px solid rgba(251, 191, 36, 0.5)', // Active state
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 10px 25px -5px rgba(251, 191, 36, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: 'rgba(251, 191, 36, 0.1)', 
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#FCD34D', fontSize: '24px' }}>⚡</span>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#FCD34D', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Athletic Performance
                </h3>
                <p style={{ color: '#F3F4F6', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Advanced training methodologies to enhance speed, power, and sports-specific performance.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Primary TrainingCTA with proper spacing */}
        <div className="training-section__cta">
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA {...args} size="primary" variant="sports" />
          </GlobalVariantProvider>
        </div>
      </div>
      
      {/* Spacing Information */}
      <div style={{ 
        backgroundColor: '#0f172a', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #1e293b'
      }}>
        <h5 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          📏 Spacing Details
        </h5>
        <ul style={{ 
          color: '#cbd5e1', 
          fontSize: '13px', 
          lineHeight: '1.6',
          paddingLeft: '20px',
          margin: 0
        }}>
          <li><strong>Mobile:</strong> 6rem (96px) top margin between cards and CTA</li>
          <li><strong>Desktop:</strong> 7rem (112px) top margin between cards and CTA</li>
          <li><strong>Previous:</strong> 4rem/5rem - Too close to cards</li>
          <li><strong>Result:</strong> Better visual hierarchy and breathing room</li>
        </ul>
      </div>
    </div>
  ),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of the improved spacing between training program cards and the primary TrainingCTA. The top margin has been increased from 4rem/5rem to 6rem/7rem to provide better visual separation and hierarchy.'
      }
    }
  }
}; 

// Architecture Documentation Story
export const ArchitecturalPattern: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Correct Architectural Pattern
        </h4>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px' }}>
          The TrainingCTA component requires proper structural wrappers to function correctly within the Training section.
        </p>
      </div>
      
      {/* Correct Implementation */}
      <div style={{ 
        backgroundColor: '#0f172a', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #22c55e'
      }}>
        <h5 style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          ✅ Correct Implementation
        </h5>
        <pre style={{ 
          color: '#cbd5e1', 
          fontSize: '12px', 
          backgroundColor: '#1e293b',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
          overflow: 'auto'
        }}>
          {`<!-- Training.tsx -->
<div className="training-section__cta">
  <TrainingCTA
    onNavigate={handleNavigate}
    variant={variant}
    className="animate-fade-in"
  />
</div>`}
        </pre>
        
        <div className="training-section__cta">
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA {...args} size="primary" variant="sports" />
          </GlobalVariantProvider>
        </div>
      </div>
      
      {/* Incorrect Implementation */}
      <div style={{ 
        backgroundColor: '#0f172a', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #ef4444'
      }}>
        <h5 style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          ❌ Incorrect Implementation (Missing Wrapper)
        </h5>
        <pre style={{ 
          color: '#cbd5e1', 
          fontSize: '12px', 
          backgroundColor: '#1e293b',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
          overflow: 'auto'
        }}>
          {`<!-- Missing training-section__cta wrapper -->
<TrainingCTA
  onNavigate={handleNavigate}
  variant={variant}
  className="animate-fade-in"
/>`}
        </pre>
        
        <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '8px' }}>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <TrainingCTA {...args} size="primary" variant="sports" />
          </GlobalVariantProvider>
        </div>
        <p style={{ color: '#f87171', fontSize: '12px', marginTop: '8px' }}>
          ⚠️ Without the wrapper, CSS spacing rules don't apply properly
        </p>
      </div>
      
      {/* CSS Architecture Explanation */}
      <div style={{ 
        backgroundColor: '#0f172a', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #3b82f6'
      }}>
        <h5 style={{ color: '#60a5fa', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          🏗️ CSS Architecture Pattern
        </h5>
        <ul style={{ 
          color: '#cbd5e1', 
          fontSize: '13px', 
          lineHeight: '1.6',
          paddingLeft: '20px',
          margin: 0
        }}>
          <li><strong>.training-section__cta</strong> - Container with spacing rules (margin-top: 6rem/7rem)</li>
          <li><strong>.training-cta</strong> - Component-specific styling and visual effects</li>
          <li><strong>.training-cta__splash-context</strong> - Inner content wrapper with backgrounds</li>
          <li><strong>.training-cta__button</strong> - Button styling with shimmer effects</li>
        </ul>
        
        <pre style={{ 
          color: '#cbd5e1', 
          fontSize: '11px', 
          backgroundColor: '#1e293b',
          padding: '12px',
          borderRadius: '6px',
          marginTop: '12px',
          overflow: 'auto'
        }}>
          {`// Training.scss
.training-section {
  &__cta {
    margin-top: 6rem;  // Mobile spacing
    text-align: center;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      margin-top: 7rem;  // Desktop spacing
      margin-bottom: 2rem;
    }
  }
}`}
        </pre>
      </div>
    </div>
  ),
  args: {
    ...Default.args
  },
  parameters: {
    docs: {
      description: {
        story: `
**Critical Architectural Pattern**

This story documents the correct structural pattern for integrating TrainingCTA within the Training section. 

**Key Requirements:**
1. **Wrapper Element**: Must be wrapped in \`.training-section__cta\` for proper spacing
2. **CSS Cascade**: Parent container handles layout, component handles visual styling  
3. **Separation of Concerns**: Section-level spacing vs component-level effects

**Common Issues:**
- Missing wrapper div results in no spacing applied
- Duplicate CSS selectors cause cascade conflicts
- Incorrect component hierarchy breaks responsive behavior

This pattern ensures consistent spacing across all Training section implementations.
        `
      }
    }
  }
};