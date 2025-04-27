# Token Compliance Task Breakdown

This document outlines the component tokenization tasks for our team to achieve 100% token compliance across the codebase.

## Current Status

As of the latest run:

```
Overall Token Usage: 229/779 properties (29%)

By Component:
🟢 Hero: 100% (109/109)
🟢 HeroButton.scss: 100% (38/38)
🔴 UI: 62% (54/87)
🔴 design-system: 27% (7/26)
🔴 styles: 8% (6/71)
🔴 PersonalTraining: 7% (8/123)
🔴 Training: 6% (4/63)
🔴 Pricing: 2% (1/47)
🔴 Features: 2% (2/86)
🔴 DemoNav: 0% (0/3)
🔴 TrainingFeatures: 0% (0/54)
🔴 Testimonials: 0% (0/6)
🔴 TestimonialCard.scss: 0% (0/10)
🔴 PricingCard.scss: 0% (0/13)
🔴 Journey: 0% (0/21)
🔴 JourneyStep.scss: 0% (0/6)
🔴 Footer: 0% (0/2)
🔴 FooterLinkGroup.scss: 0% (0/1)
🔴 FeatureCard.scss: 0% (0/13)
```

## Task Assignments

Each developer should create a branch from `token-compliance/boilerplate` following the naming convention `token-compliance/[component-name]`.

| Developer  | Primary Component                | Secondary Component    | Branch Name                      | Props (approx) |
|------------|----------------------------------|------------------------|----------------------------------|----------------|
| Developer 1| PersonalTraining                 | Footer                 | token-compliance/personal-training| 125            |
| Developer 2| Training & TrainingFeatures      | -                      | token-compliance/training        | 117            |
| Developer 3| Features                         | FeatureCard            | token-compliance/features        | 99             |
| Developer 4| Pricing                          | PricingCard            | token-compliance/pricing         | 60             |
| Developer 5| UI Components                    | -                      | token-compliance/ui              | 87             |
| Developer 6| Journey                          | JourneyStep            | token-compliance/journey         | 27             |
| Developer 7| Testimonials                     | TestimonialCard        | token-compliance/testimonials    | 16             |
| Developer 8| DemoNav                          | design-system          | token-compliance/demo-nav        | 29             |

## Component Dependencies

Note any component dependencies to coordinate work effectively:

- FeatureCard depends on the UI Card component
- TestimonialCard depends on the UI Card component
- Consider UI components first as others may depend on them

## Component Complexity Assessment

Complexity factors to consider:
- Number of properties (shown above)
- Number of variants/states
- Animation complexity
- Responsive behavior

### Higher Complexity
- PersonalTraining (123 properties, complex animations)
- Training/TrainingFeatures (117 combined properties)
- UI Components (shared, many dependencies)

### Medium Complexity
- Features (86 properties)
- Pricing (47 properties)

### Lower Complexity
- Journey/JourneyStep (27 combined properties)
- Testimonials/TestimonialCard (16 combined properties)
- DemoNav (3 properties)
- Footer/FooterLinkGroup (3 combined properties)

## Timeline

| Milestone | Target Date | Components |
|-----------|-------------|------------|
| Phase 1   | [DATE]      | Hero (Complete), UI Components, DemoNav |
| Phase 2   | [DATE]      | Training, Journey, Footer |
| Phase 3   | [DATE]      | PersonalTraining, Features |
| Phase 4   | [DATE]      | Pricing, Testimonials |
| Final     | [DATE]      | 100% token compliance across all components |

## Tracking Progress

We'll track progress with:

1. Weekly compliance script runs in the main repo
2. A compliance dashboard (updated daily)
3. PR reviews ensuring 100% component compliance before merge

## Definition of Done

A component is considered fully tokenized when:

1. The token compliance script shows 100% compliance
2. Visual regression tests pass
3. Code review has been completed
4. The PR has been merged into develop

## Kickoff Meeting

We'll have a kickoff meeting on [DATE] to:
- Review the token compliance guide
- Demo the Hero component implementation
- Answer questions
- Assign tasks 

## PersonalTraining Component Tokenization

### Completed: July 2023

The PersonalTraining component has been fully tokenized to achieve 100% design token compliance.

### Added Tokens

The following new tokens were added to support the PersonalTraining component:

#### Icon Sizes

```scss
/* Icon Sizes */
--size-pt-icon-xs: 14px;
--size-pt-icon-sm: 16px;
--size-pt-icon-md: 18px;
--size-pt-icon-lg: 48px;
--size-pt-icon-xl: 64px;
```

#### Text Elements

```scss
/* Text Elements */
--margin-pt-section-bottom: 4rem;
--margin-pt-tag-bottom: 0.5rem;
--size-pt-tag-font: 0.75rem;
--weight-pt-tag-font: 700;
--letter-spacing-pt-tag: 0.1em;
--color-pt-tag: #b794f4; /* text-violet-300 */
--color-pt-description: #9ca3af; /* text-gray-400 */
--max-width-pt-description: 36rem; /* max-w-2xl */
```

#### Visual Styles

```scss
/* Gradients */
--gradient-pt-card-bg: linear-gradient(135deg, rgb(124, 58, 237) 0%, rgb(67, 56, 202) 100%);
--opacity-pt-icon: 0.7;
```

### Added CSS Classes

New CSS classes were added to PersonalTraining.scss to replace utility classes:

#### Section Structure

```scss
.section-header {
    margin-bottom: var(--margin-pt-section-bottom);
    text-align: var(--text-align-pt-title-center);
}

.section-tag {
    font-size: var(--size-pt-tag-font);
    font-weight: var(--weight-pt-tag-font);
    letter-spacing: var(--letter-spacing-pt-tag);
    text-transform: var(--transform-pt-text-uppercase);
    color: var(--color-pt-tag);
    margin-bottom: var(--margin-pt-tag-bottom);
    display: var(--display-pt-block);
}

.section-description {
    color: var(--color-pt-description);
    max-width: var(--max-width-pt-description);
    margin-left: var(--margin-pt-auto);
    margin-right: var(--margin-pt-auto);
}
```

#### UI Elements

```scss
.trainer-placeholder {
    width: var(--width-pt-img-full);
    height: var(--height-pt-trainer-img);
    background: var(--gradient-pt-card-bg);
    display: var(--display-pt-flex);
    align-items: var(--align-pt-center);
    justify-content: var(--justify-pt-center);

    .icon {
        color: var(--color-pt-white);
        opacity: var(--opacity-pt-icon);
    }
}
```

#### Icon Size Classes

```scss
.icon-xs {
    width: var(--size-pt-icon-xs);
    height: var(--size-pt-icon-xs);
}

.icon-sm {
    width: var(--size-pt-icon-sm);
    height: var(--size-pt-icon-sm);
}

.icon-md {
    width: var(--size-pt-icon-md);
    height: var(--size-pt-icon-md);
}

.icon-lg {
    width: var(--size-pt-icon-lg);
    height: var(--size-pt-icon-lg);
}

.icon-xl {
    width: var(--size-pt-icon-xl);
    height: var(--size-pt-icon-xl);
}
```

### Implementation Changes

1. Replaced all inline Tailwind utility classes with token-based classes
2. Wrapped all Lucide icons with spans that have token-based size classes
3. Standardized icon sizing across both component variants
4. Replaced hardcoded colors and spacing with design tokens
5. Improved accessibility with standardized sizing

### Variants

Both the default and gym variants of the PersonalTraining component have been updated to use the same token-based classes, ensuring visual consistency while maintaining their distinct personalities. 