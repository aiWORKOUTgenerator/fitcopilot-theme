import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from '../../../../../../context/ThemeContext';
import { ThemeOption } from '../../../../../../utils/theming';
import { GlobalVariantProvider } from '../../../../context/GlobalVariantContext';
import { DEFAULT_PROGRAMS } from '../../../data/defaultProgramsData';
import BenefitsList from '../BenefitsList';
import { BenefitsListProps } from '../types';

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
            textTransform: 'capitalize' 
          }}>
            {theme} Theme
          </h3>
          <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
            <ThemeProvider initialTheme={theme}>
              <div style={{ 
                padding: '20px', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px',
                backgroundColor: '#fff',
                maxWidth: '400px'
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

// Wrapper to provide necessary context for all stories
const StoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GlobalVariantProvider initialVariant="default" enableWpIntegration={false}>
    {children}
  </GlobalVariantProvider>
);

// Sample benefits data from different programs
const strengthBenefits = DEFAULT_PROGRAMS[0].benefits; // Strength Building
const fatLossBenefits = DEFAULT_PROGRAMS[1].benefits; // Fat Loss
const fitnessBenefits = DEFAULT_PROGRAMS[2].benefits; // General Fitness
const athleticBenefits = DEFAULT_PROGRAMS[3].benefits; // Athletic Performance

// Custom benefits for testing scenarios
const shortBenefits = [
  "Quick results",
  "Easy to follow"
];

const longBenefits = [
  "Comprehensive scientifically-backed methodology that combines cutting-edge research with proven training principles",
  "Personalized nutrition guidance with detailed macro calculations and meal planning templates",
  "Advanced biomechanical movement analysis to optimize technique and prevent injury",
  "Progressive overload protocols with built-in periodization for continuous adaptation",
  "Real-time performance tracking with detailed analytics and progress visualization",
  "24/7 expert support with certified trainers and nutritionists available for consultation",
  "Community access to exclusive workout videos, educational content, and peer support networks"
];

const wellnessBenefits = [
  "Mindful movement practices",
  "Stress reduction techniques",
  "Better sleep quality",
  "Improved mental clarity",
  "Enhanced emotional well-being"
];

const animationBenefits = [
  "Smooth entrance animations",
  "Progressive loading effects",
  "Interactive hover states",
  "Accessible motion controls"
];

const meta: Meta<typeof BenefitsList> = {
  title: 'Features/Homepage/Training/Components/BenefitsList',
  component: BenefitsList,
  decorators: [
    (Story) => (
      <StoryWrapper>
        <div style={{ maxWidth: '500px', padding: '20px' }}>
          <Story />
        </div>
      </StoryWrapper>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The BenefitsList component displays program benefits in a clean, accessible list format.
This component features:

- **Icon Support**: CheckCircle icons for visual enhancement (except sports variant)
- **Theme Variants**: Supports all 7 visual variants and 5 theme options  
- **Sports Variant**: Uses disc bullet points instead of icons for athletic styling
- **Accessibility**: Full ARIA support with proper labeling and semantic markup
- **Responsive Design**: Optimized typography and spacing for all device sizes
- **Performance**: Memoized for optimal rendering with large benefit lists

The component automatically adapts its styling based on the variant prop and includes
proper semantic markup for screen readers and keyboard navigation.

**Note**: This component requires GlobalVariantProvider context for theme integration.
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    benefits: {
      control: 'object',
      description: 'Array of benefit strings to display in the list',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: 'strengthBenefits' }
      }
    },
    variant: {
      control: 'select',
      options: ['default', 'classic', 'modern', 'minimalist', 'boutique', 'wellness', 'sports'],
      description: 'Visual theme variant for the BenefitsList component',
      table: {
        type: { summary: 'VariantKey' },
        defaultValue: { summary: 'default' }
      }
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the component',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' }
      }
    },
    ariaLabelledBy: {
      control: 'text',
      description: 'ID of the element that labels this list (for aria-labelledby)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    id: {
      control: 'text',
      description: 'ID for the benefits list element',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof BenefitsList>;

// Default story with standard configuration
export const Default: Story = {
  args: {
    benefits: strengthBenefits,
    variant: 'default',
    ariaLabelledBy: 'program-title',
    id: 'benefits-list-default'
  }
};

// All variant demonstrations
export const ClassicVariant: Story = {
  args: {
    ...Default.args,
    benefits: fatLossBenefits,
    variant: 'classic'
  }
};

export const ModernVariant: Story = {
  args: {
    ...Default.args,
    benefits: fitnessBenefits,
    variant: 'modern'
  }
};

export const MinimalistVariant: Story = {
  args: {
    ...Default.args,
    benefits: athleticBenefits,
    variant: 'minimalist'
  }
};

export const BoutiqueVariant: Story = {
  args: {
    ...Default.args,
    benefits: wellnessBenefits,
    variant: 'boutique'
  }
};

export const WellnessVariant: Story = {
  args: {
    ...Default.args,
    benefits: wellnessBenefits,
    variant: 'wellness'
  }
};

export const SportsVariant: Story = {
  args: {
    ...Default.args,
    benefits: athleticBenefits,
    variant: 'sports'
  },
  parameters: {
    docs: {
      description: {
        story: 'The Sports variant uses disc bullet points instead of CheckCircle icons for a cleaner athletic aesthetic.'
      }
    }
  }
};

// Benefits length variations
export const ShortList: Story = {
  args: {
    ...Default.args,
    benefits: shortBenefits,
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of BenefitsList with a minimal number of benefits (2 items).'
      }
    }
  }
};

export const LongList: Story = {
  args: {
    ...Default.args,
    benefits: longBenefits,
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing BenefitsList with extensive content including very long benefit descriptions.'
      }
    }
  }
};

// Theme showcase story
export const ThemeShowcase: Story = {
  render: (_args: BenefitsListProps) => ComponentWithThemes(BenefitsList, _args),
  args: {
    benefits: strengthBenefits,
    variant: 'default',
    ariaLabelledBy: 'theme-showcase-title',
    id: 'theme-showcase-benefits'
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'This story demonstrates how the BenefitsList component appears across all available themes. Each theme applies its own color palette and typography while maintaining functionality.'
      }
    }
  }
};

// Comprehensive variant comparison
export const AllVariantsComparison: Story = {
  render: () => {
    const variants = ['default', 'classic', 'modern', 'minimalist', 'boutique', 'wellness', 'sports'] as const;
    const benefitSets = [strengthBenefits, fatLossBenefits, fitnessBenefits, athleticBenefits, wellnessBenefits, strengthBenefits, athleticBenefits];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>
            BenefitsList Variant Showcase
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Compare all 7 variants side by side to see styling differences
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {variants.map((variant, index) => (
            <div key={variant} style={{ 
              border: '2px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  margin: 0,
                  color: '#333'
                }}>
                  {variant} Variant
                </h3>
                <span style={{
                  fontSize: '11px',
                  color: '#666',
                  fontFamily: 'monospace',
                  backgroundColor: '#fff',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  border: '1px solid #ddd'
                }}>
                  {variant}
                </span>
              </div>
              <div style={{ 
                backgroundColor: '#fff',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #e5e5e5'
              }}>
                <BenefitsList
                  benefits={benefitSets[index]}
                  variant={variant}
                  ariaLabelledBy={`variant-title-${index}`}
                  id={`variant-benefits-${index}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `This comprehensive comparison shows all 7 BenefitsList variants side by side:
        
        - **Default**: CheckCircle icons with standard spacing
        - **Classic**: Traditional fitness aesthetic with enhanced icons
        - **Modern**: Clean, data-driven design with precise typography
        - **Minimalist**: Simplified layout with reduced visual elements
        - **Boutique**: Premium styling with enhanced visual hierarchy
        - **Wellness**: Holistic design with calming colors and spacing
        - **Sports**: Athletic styling with disc bullet points (no icons)
        
        Notice how the sports variant uses disc bullet points instead of CheckCircle icons for a cleaner athletic aesthetic.`
      }
    }
  }
};

// Program type specific demonstrations
export const AllProgramTypes: Story = {
  render: () => {
    const programTypes = [
      { benefits: strengthBenefits, label: 'Strength Building', type: 'strength' },
      { benefits: fatLossBenefits, label: 'Fat Loss', type: 'fatLoss' },
      { benefits: fitnessBenefits, label: 'General Fitness', type: 'fitness' },
      { benefits: athleticBenefits, label: 'Athletic Performance', type: 'athletic' }
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {programTypes.map(({ benefits, label, type }, index) => (
          <div key={type} style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px', 
            padding: '16px',
            backgroundColor: '#fafafa'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              marginBottom: '12px',
              color: '#333',
              textAlign: 'center'
            }}>
              {label}
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#666',
              textAlign: 'center',
              marginBottom: '12px',
              fontFamily: 'monospace'
            }}>
              programType: {type}
            </p>
            <div style={{ 
              backgroundColor: '#fff',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #e5e5e5'
            }}>
              <BenefitsList
                benefits={benefits}
                variant="default"
                ariaLabelledBy={`program-title-${index}`}
                id={`program-benefits-${index}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'This story demonstrates BenefitsList with content from all 4 program types, showing how different benefit content works with the component.'
      }
    }
  }
};

// Accessibility showcase
export const AccessibilityShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
          Accessibility Features Demo
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Demonstrating ARIA support, semantic markup, and screen reader compatibility
        </p>
      </div>
      
      <div style={{ 
        border: '2px solid #2563eb', 
        borderRadius: '8px', 
        padding: '20px',
        backgroundColor: '#f8faff' 
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          🎯 ARIA Labeling & Semantic Markup
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Proper ARIA attributes and semantic list structure for screen readers.
        </p>
        <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '4px' }}>
          <h4 id="strength-program-title" style={{ marginBottom: '8px', fontSize: '14px' }}>
            Strength Building Benefits
          </h4>
          <BenefitsList
            benefits={strengthBenefits}
            variant="default"
            ariaLabelledBy="strength-program-title"
            id="strength-benefits-list"
          />
        </div>
      </div>
      
      <div style={{ 
        border: '2px solid #dc2626', 
        borderRadius: '8px', 
        padding: '20px',
        backgroundColor: '#fef2f2' 
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          🎨 High Contrast Testing
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Testing icon visibility and text contrast for accessibility compliance.
        </p>
        <div style={{ filter: 'contrast(150%) brightness(90%)', backgroundColor: '#fff', padding: '16px', borderRadius: '4px' }}>
          <BenefitsList
            benefits={fatLossBenefits}
            variant="default"
            ariaLabelledBy="high-contrast-title"
            id="high-contrast-benefits"
          />
        </div>
      </div>
      
      <div style={{ 
        border: '2px solid #059669', 
        borderRadius: '8px', 
        padding: '20px',
        backgroundColor: '#ecfdf5' 
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          🔍 Sports Variant (No Icons)
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Sports variant uses standard list bullets, ensuring accessibility without icon dependency.
        </p>
        <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '4px' }}>
          <BenefitsList
            benefits={athleticBenefits}
            variant="sports"
            ariaLabelledBy="sports-variant-title"
            id="sports-variant-benefits"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'list-structure', enabled: true },
          { id: 'aria-labels', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        story: `This story demonstrates the BenefitsList component's accessibility features:
        
        **ARIA Support:**
        - Proper aria-labelledby connections to heading elements
        - Semantic list structure (ul/li) for screen readers
        - Descriptive IDs for programmatic access
        
        **Visual Accessibility:**
        - High contrast icon visibility
        - Color contrast compliance for text
        - Sports variant as fallback without icon dependency
        
        **Screen Reader Support:**
        - Semantic list markup announces item count
        - Icons marked with aria-hidden="true" to avoid noise
        - Proper text hierarchy and reading flow
        
        Use the A11y addon panel to run automated accessibility tests.`
      }
    }
  }
};

// Responsive design demonstration
export const ResponsiveView: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
          Responsive Design Demo
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Testing BenefitsList at different screen sizes and text lengths
        </p>
      </div>
      
      {/* Mobile simulation */}
      <div style={{ 
        border: '2px solid #f59e0b', 
        borderRadius: '8px', 
        padding: '20px',
        backgroundColor: '#fffbeb',
        maxWidth: '320px',
        margin: '0 auto'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          📱 Mobile View (320px)
        </h3>
        <BenefitsList
          benefits={shortBenefits}
          variant="default"
          ariaLabelledBy="mobile-title"
          id="mobile-benefits"
        />
      </div>
      
      {/* Tablet simulation */}
      <div style={{ 
        border: '2px solid #10b981', 
        borderRadius: '8px', 
        padding: '20px',
        backgroundColor: '#ecfdf5',
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          📱 Tablet View (480px)
        </h3>
        <BenefitsList
          benefits={strengthBenefits}
          variant="modern"
          ariaLabelledBy="tablet-title"
          id="tablet-benefits"
        />
      </div>
      
      {/* Desktop simulation with long content */}
      <div style={{ 
        border: '2px solid #8b5cf6', 
        borderRadius: '8px', 
        padding: '20px',
        backgroundColor: '#f5f3ff',
        maxWidth: '640px',
        margin: '0 auto'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          🖥️ Desktop View (640px+) - Long Content
        </h3>
        <BenefitsList
          benefits={longBenefits.slice(0, 4)} // First 4 long benefits
          variant="boutique"
          ariaLabelledBy="desktop-title"
          id="desktop-benefits"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'This story demonstrates how the BenefitsList component adapts to different screen sizes and content lengths. Typography and spacing adjust appropriately for optimal readability.'
      }
    }
  }
};

// Edge cases and performance testing
export const EdgeCasesAndPerformance: Story = {
  render: () => {
    // Single benefit edge case
    const singleBenefit = ["Single benefit item"];
    
    // Empty benefits (edge case - should be handled gracefully)
    const emptyBenefits: string[] = [];
    
    // Benefits with special characters and formatting
    const specialCharBenefits = [
      "Benefits with émojis 🎯 and spëcial characters",
      "Numbers: 24/7 support & 100% guarantee",
      "URLs: Visit https://example.com for more info",
      "Code: Use `WORKOUT2024` for 20% off",
      "Mixed: HTML <tags> & CSS {styles} are escaped"
    ];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
            Edge Cases & Performance Testing
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Testing component behavior with unusual content and performance scenarios
          </p>
        </div>
        
        {/* Single benefit test */}
        <div style={{ 
          border: '2px solid #f59e0b', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fffbeb',
          maxWidth: '400px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            🔹 Single Benefit Test
          </h3>
          <BenefitsList
            benefits={singleBenefit}
            variant="default"
            ariaLabelledBy="single-benefit-title"
            id="single-benefit-list"
          />
        </div>
        
        {/* Empty benefits test */}
        <div style={{ 
          border: '2px solid #ef4444', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fef2f2',
          maxWidth: '400px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            ❌ Empty Benefits Test
          </h3>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Should render empty list gracefully:
          </p>
          <BenefitsList
            benefits={emptyBenefits}
            variant="default"
            ariaLabelledBy="empty-benefits-title"
            id="empty-benefits-list"
          />
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px', fontStyle: 'italic' }}>
            (Empty list rendered above)
          </p>
        </div>
        
        {/* Special characters test */}
        <div style={{ 
          border: '2px solid #8b5cf6', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#f5f3ff',
          maxWidth: '500px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            🎭 Special Characters & Formatting
          </h3>
          <BenefitsList
            benefits={specialCharBenefits}
            variant="default"
            ariaLabelledBy="special-chars-title"
            id="special-chars-list"
          />
        </div>
        
        {/* Performance test with multiple variants */}
        <div style={{ 
          border: '2px solid #10b981', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#ecfdf5'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            ⚡ Performance Test - Multiple Lists
          </h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
            Testing rendering performance with multiple BenefitsList instances.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {(['default', 'classic', 'modern', 'minimalist', 'boutique', 'wellness'] as const).map((variant, i) => (
              <div key={variant} style={{ 
                backgroundColor: '#fff',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #e5e5e5'
              }}>
                <h4 style={{ fontSize: '12px', marginBottom: '8px', textTransform: 'capitalize' }}>
                  {variant} Variant
                </h4>
                <BenefitsList
                  benefits={[strengthBenefits, fatLossBenefits, fitnessBenefits][i % 3]}
                  variant={variant}
                  ariaLabelledBy={`perf-title-${i}`}
                  id={`perf-list-${i}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `This story tests edge cases and performance scenarios:
        
        **Edge Case Testing:**
        - Single benefit item
        - Empty benefits array (graceful handling)
        - Special characters, emojis, and formatting
        - HTML/code content escaping
        
        **Performance Testing:**
        - Multiple BenefitsList instances (6 lists)
        - Different variants simultaneously
        - Various content lengths and complexities
        
        **Content Handling:**
        - Unicode characters and emojis
        - URLs and special formatting
        - Mixed content types
        
        Monitor browser DevTools for performance metrics during rendering.`
      }
    }
  }
};

// Mobile responsive example
export const MobileView: Story = {
  args: {
    ...Default.args,
    benefits: fitnessBenefits,
    variant: 'wellness'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'This story demonstrates the BenefitsList component optimized for mobile devices with appropriate typography and spacing adjustments.'
      }
    }
  }
};

// Tablet responsive example
export const TabletView: Story = {
  args: {
    ...Default.args,
    benefits: athleticBenefits,
    variant: 'sports'
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'This story shows the BenefitsList component on tablet-sized screens, demonstrating the sports variant with disc bullet points.'
      }
    }
  }
};

// Animation testing story
export const WithAnimations: Story = {
  args: {
    ...Default.args,
    benefits: animationBenefits,
    variant: 'modern'
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing BenefitsList with animation-related content to demonstrate component behavior with motion-related benefits.'
      }
    }
  }
};

// ===============================
// Epic 4: CTA Integration Stories
// ===============================

// Enhanced BenefitsList with Secondary TrainingCTA Integration
export const WithSecondaryTrainingCTA: Story = {
  render: (_args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#1f2937', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Enhanced BenefitsList with Secondary TrainingCTA
        </h4>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px', maxWidth: '500px' }}>
          This demonstrates the new optional CTA integration feature. The secondary TrainingCTA 
          appears at the bottom of the benefits list for enhanced conversion opportunities.
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: '#1f2937', 
        padding: '30px', 
        borderRadius: '12px',
        maxWidth: '450px',
        width: '100%'
      }}>
        <h3 style={{ 
          color: '#f9fafb', 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Strength Training Benefits
        </h3>
        
        <BenefitsList
          benefits={strengthBenefits}
          variant="default"
          includeCTA={true}
          onCTAClick={action('CTA clicked from BenefitsList')}
          ariaLabelledBy="strength-title"
          id="strength-benefits-with-cta"
        />
      </div>
    </div>
  ),
  args: {
    benefits: strengthBenefits,
    variant: 'default',
    includeCTA: true,
    onCTAClick: action('CTA clicked')
  },
  parameters: {
    docs: {
      description: {
        story: 'BenefitsList enhanced with secondary TrainingCTA integration. This creates a powerful conversion flow by placing a call-to-action directly after presenting the benefits.'
      }
    }
  }
};

// CTA Integration Across All Variants
export const CTAIntegrationAllVariants: Story = {
  render: (_args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', padding: '20px' }}>
      {['default', 'classic', 'modern', 'minimalist', 'boutique', 'wellness', 'sports'].map((variant) => (
        <div key={variant} style={{ 
          backgroundColor: '#1f2937',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #374151'
        }}>
          <h4 style={{ 
            color: '#f9fafb', 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '16px',
            textAlign: 'center',
            textTransform: 'capitalize'
          }}>
            {variant} Variant with CTA
          </h4>
          
          <BenefitsList
            benefits={fitnessBenefits.slice(0, 4)} // Show 4 benefits for consistency
            variant={variant as any}
            includeCTA={true}
            onCTAClick={action(`${variant} CTA clicked`)}
            ariaLabelledBy={`${variant}-title`}
            id={`${variant}-benefits-cta`}
            className="story-benefits-list"
          />
        </div>
      ))}
    </div>
  ),
  args: {
    benefits: fitnessBenefits,
    variant: 'default',
    includeCTA: true,
    onCTAClick: action('CTA clicked')
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary TrainingCTA integration across all 7 variants. Each variant maintains its unique styling while seamlessly integrating the compact CTA button.'
      }
    }
  }
};

// Realistic Benefits List Context Integration
export const RealisticIntegrationContext: Story = {
  render: (_args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Program Showcase */}
      <div style={{ 
        backgroundColor: '#1f2937', 
        padding: '40px', 
        borderRadius: '16px',
        position: 'relative'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
          borderRadius: 'inherit',
          pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ 
              color: '#fbbf24', 
              fontSize: '14px', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Featured Program
            </span>
            <h2 style={{ 
              color: '#f9fafb', 
              fontSize: '28px', 
              fontWeight: '700', 
              margin: '8px 0 16px 0'
            }}>
              AI-Powered Strength Training
            </h2>
            <p style={{ 
              color: '#d1d5db', 
              fontSize: '16px', 
              lineHeight: '1.6',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Build strength systematically with our AI-driven progressive overload system that adapts to your performance and recovery patterns.
            </p>
          </div>
          
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <BenefitsList
              benefits={[
                "Scientifically-proven progressive overload protocols",
                "Real-time form analysis and correction",
                "Personalized recovery recommendations",
                "Advanced performance tracking and analytics",
                "Injury prevention through movement screening"
              ]}
              variant="strength"
              includeCTA={true}
              onCTAClick={action('Strength program CTA clicked')}
              ariaLabelledBy="strength-program-title"
              id="strength-program-benefits"
            />
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '24px', 
          borderRadius: '12px'
        }}>
          <h3 style={{ 
            color: '#67e8f9', 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Fat Loss Program
          </h3>
          <BenefitsList
            benefits={fatLossBenefits.slice(0, 4)}
            variant="fatLoss"
            includeCTA={true}
            onCTAClick={action('Fat loss CTA clicked')}
            ariaLabelledBy="fat-loss-title"
            id="fat-loss-benefits"
          />
        </div>
        
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '24px', 
          borderRadius: '12px'
        }}>
          <h3 style={{ 
            color: '#c4b5fd', 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Fitness Program
          </h3>
          <BenefitsList
            benefits={fitnessBenefits.slice(0, 4)}
            variant="fitness"
            includeCTA={true}
            onCTAClick={action('Fitness CTA clicked')}
            ariaLabelledBy="fitness-title"
            id="fitness-benefits"
          />
        </div>
      </div>
    </div>
  ),
  args: {
    benefits: strengthBenefits,
    variant: 'strength',
    includeCTA: true,
    onCTAClick: action('CTA clicked')
  },
  parameters: {
    docs: {
      description: {
        story: 'Realistic integration context showing how the enhanced BenefitsList with secondary TrainingCTA creates powerful conversion flows in actual program showcase scenarios.'
      }
    }
  }
};

// Mobile Responsive CTA Integration
export const MobileCTAIntegration: Story = {
  render: (_args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h4 style={{ color: '#1f2937', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          Mobile-Optimized CTA Integration
        </h4>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Compact design with touch-friendly targets and proper spacing
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: '#1f2937', 
        padding: '20px', 
        borderRadius: '12px',
        maxWidth: '320px', // Mobile width
        margin: '0 auto'
      }}>
        <h3 style={{ 
          color: '#f9fafb', 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Mobile Fitness Benefits
        </h3>
        
        <BenefitsList
          benefits={[
            "Quick 15-minute workouts",
            "No equipment required",
            "Progress tracking on-the-go",
            "Offline workout access"
          ]}
          variant="fitness"
          includeCTA={true}
          onCTAClick={action('Mobile CTA clicked')}
          ariaLabelledBy="mobile-fitness-title"
          id="mobile-fitness-benefits"
        />
      </div>
    </div>
  ),
  args: {
    benefits: ["Quick 15-minute workouts", "No equipment required", "Progress tracking on-the-go", "Offline workout access"],
    variant: 'fitness',
    includeCTA: true,
    onCTAClick: action('Mobile CTA clicked')
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized BenefitsList with secondary TrainingCTA integration. The CTA maintains proper touch targets (44px minimum) while preserving the compact design.'
      }
    }
  }
};

// Performance Testing with CTA Integration
export const PerformanceCTAIntegration: Story = {
  render: (_args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ 
          backgroundColor: '#1f2937',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <h4 style={{ 
            color: '#f9fafb', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            Program {i + 1} Benefits
          </h4>
          
          <BenefitsList
            benefits={[strengthBenefits, fatLossBenefits, fitnessBenefits][i % 3].slice(0, 3)}
            variant={['default', 'modern', 'wellness'][i % 3] as any}
            includeCTA={true}
            onCTAClick={action(`Program ${i + 1} CTA clicked`)}
            ariaLabelledBy={`program-${i}-title`}
            id={`program-${i}-benefits`}
          />
        </div>
      ))}
    </div>
  ),
  args: {
    benefits: strengthBenefits,
    variant: 'default',
    includeCTA: true,
    onCTAClick: action('CTA clicked')
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance testing with multiple BenefitsList instances that include secondary TrainingCTA integration. Tests rendering efficiency and interaction responsiveness.'
      }
    }
  }
};

// Without CTA for comparison
export const WithoutCTAComparison: Story = {
  render: (_args) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#1f2937', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          Traditional BenefitsList
        </h4>
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '24px', 
          borderRadius: '12px'
        }}>
          <BenefitsList
            benefits={fitnessBenefits.slice(0, 4)}
            variant="default"
            includeCTA={false} // No CTA
            ariaLabelledBy="traditional-title"
            id="traditional-benefits"
          />
        </div>
        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '12px' }}>
          No integrated CTA - relies on external placement
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ color: '#1f2937', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          Enhanced with Secondary CTA
        </h4>
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '24px', 
          borderRadius: '12px'
        }}>
          <BenefitsList
            benefits={fitnessBenefits.slice(0, 4)}
            variant="default"
            includeCTA={true} // With CTA
            onCTAClick={action('Enhanced CTA clicked')}
            ariaLabelledBy="enhanced-title"
            id="enhanced-benefits"
          />
        </div>
        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '12px' }}>
          Integrated secondary CTA for immediate action
        </p>
      </div>
    </div>
  ),
  args: {
    benefits: fitnessBenefits,
    variant: 'default',
    includeCTA: true,
    onCTAClick: action('CTA clicked')
  },
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison showing traditional BenefitsList vs enhanced version with secondary TrainingCTA integration. The enhanced version provides better conversion opportunities.'
      }
    }
  }
}; 