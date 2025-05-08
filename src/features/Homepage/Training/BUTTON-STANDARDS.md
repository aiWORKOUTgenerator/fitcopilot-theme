# Button Standards for Training Component

This document outlines the standard implementation of the Button component within the Training feature.

## Standard Button Interface

The Button component supports the following standard props:

```typescript
interface ButtonProps {
  // Visual variants
  variant: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'gradient' | 'violet-indigo';
  
  // Size options
  size: 'small' | 'medium' | 'large';
  
  // Icon options
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Layout options
  fullWidth?: boolean;
  
  // State options
  isLoading?: boolean;
  disabled?: boolean;
  
  // Theme context for specific styling
  themeContext?: 'default' | 'gym' | 'hero' | string;
  
  // Event handlers
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  // Additional props
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}
```

## Standard Implementation Examples

### Primary CTA Button

```tsx
<Button
  variant="primary"
  size="large"
  rightIcon={<ArrowRight size={20} />}
  onClick={() => window.location.href = 'https://builder.fitcopilot.ai/programs'}
>
  Find Your Perfect Program
</Button>
```

### Secondary Action Button

```tsx
<Button
  variant="secondary"
  size="medium"
  rightIcon={<ArrowRight size={16} />}
  onClick={() => window.location.href = `https://builder.fitcopilot.ai/programs/${programName}`}
>
  Explore Program
</Button>
```

### Text/Tertiary Button

```tsx
<Button
  variant="tertiary"
  size="small"
  onClick={handleClose}
>
  Cancel
</Button>
```

## Theming Considerations

- The Button component automatically applies the appropriate theme styling based on the active theme
- Use the `themeContext` prop only when you need to override the global theme
- For Training component, use the default theme context

## Accessibility Best Practices

- Always provide a clear, descriptive label
- Use appropriate ARIA attributes when needed
- Ensure focus states are visible
- Maintain proper contrast ratios

## Implementation Rules

1. Always use the imported Button component from `src/components/UI/Button`
2. Never create custom button elements with raw HTML
3. Use consistent prop patterns across all variants
4. Follow the size guidelines:
   - `large`: Primary CTA buttons
   - `medium`: Secondary actions
   - `small`: Tertiary/minor actions
5. Use appropriate icon sizes based on button size:
   - Large buttons: 20-24px icons
   - Medium buttons: 16-18px icons
   - Small buttons: 12-14px icons
6. Consistently use the `onClick` handler for all interactive buttons
7. Maintain consistent className patterns when adding additional styling
8. Use theme-appropriate button variants (primary, secondary, tertiary)
9. For icons, use the standard Lucide React components with proper sizing

## Component Standardization (Phase 3)

As part of the Phase 3 standardization effort, the Button implementation has been unified across all Training component variants:

### Standardization Changes

1. **Icon Implementation**: Standardized icon sizing across all buttons
   - Large buttons: 20px icons 
   - Medium buttons: 16px icons
   - Small buttons: 14px icons

2. **Variant Consistency**: Ensured all variants follow the same pattern:
   - Primary variant for main CTAs
   - Secondary variant for program-specific actions
   - Tertiary variant for toggle controls

3. **Event Handling**: Standardized navigation pattern:
   ```typescript
   onClick={() => window.location.href = 'https://builder.fitcopilot.ai/programs'}
   ```

4. **Styling Approach**: Reduced direct Tailwind classes in favor of using the Button component's built-in styling system via props

### Validation Checklist

- ✅ All buttons use the imported Button component
- ✅ No custom HTML button elements are used
- ✅ Icon sizing follows standard guidelines
- ✅ Button variants are used consistently
- ✅ Event handling follows standard patterns
- ✅ Accessibility best practices are followed 