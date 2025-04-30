# Personal Training Component

The Personal Training component showcases trainers in different theme contexts: default, gym, and mobile. It demonstrates the usage of shared UI components in different section-specific styles.

## Button Usage

This component uses the shared Button component with the following patterns:

### Primary Action Buttons

```tsx
<Button
    variant="gradient"
    rightIcon={<ArrowRight size={18} />}
    fullWidth={true}
    themeContext="default" // or "gym" depending on context
>
    Schedule Session
</Button>
```

### Control Buttons (Video Player)

```tsx
<Button
    variant="ghost"
    size="small"
    themeContext="default"
    className="control-button"
    onClick={(e) => {
        e.stopPropagation();
        // Action handler
    }}
>
    <Icon />
</Button>
```

### CTA Buttons

```tsx
<Button
    variant="gradient"
    rightIcon={<ArrowRight size={20} />}
    fullWidth={true}
    themeContext="default"
>
    Book Consultation
</Button>
```

## CSS Architecture

The component uses a CSS containment model where section-specific styles are scoped to the `.personal-training-section` class. Button styling is handled by the Button component itself, with only layout/positioning styles defined in this component's SCSS.

Proper CSS specificity is maintained through:

1. Base button styling from Button component
2. Section-specific overrides via context/theming
3. Explicit class-based overrides only where necessary

## Theme Contexts

This component demonstrates how to use the Button component's theming system by setting the appropriate `themeContext` prop:

- Default theme: `themeContext="default"`
- Gym theme: `themeContext="gym"`

The Button component handles the appropriate styling based on the theme context. 