---
sidebar_position: 3
title: Quick Start Guide
description: A quick start guide to help you begin development with the FitCopilot theme
keywords: [quick start, guide, development, examples]
tags: [quick start, guide]
---

# Quick Start Guide

This guide will help you get up and running quickly with the FitCopilot theme. It covers the basics of development workflow, creating new components, and working with the theme's architecture.

## Development Workflow Overview

The FitCopilot theme uses a feature-first approach to organize code, with a focus on component reusability and type safety. 

1. **Start the Development Server**

Once you've completed the [installation](./installation.md), start the development server:

```bash
npm run dev
```

This will compile the React application and watch for changes, automatically rebuilding when files are modified.

## Creating Your First Component

Let's create a simple UI component to get familiar with the development process:

1. **Create the Component Directory Structure**

```bash
mkdir -p src/components/UI/InfoCard
cd src/components/UI/InfoCard
```

2. **Create the Component Files**

Create the following files:

```bash
touch index.ts
touch InfoCard.tsx
touch InfoCard.scss
```

3. **Implement the Component**

In `InfoCard.tsx`, add the following code:

```tsx
import React from 'react';
import './InfoCard.scss';

export interface InfoCardProps {
  title: string;
  content: string;
  icon?: string;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  content, 
  icon,
  className = '' 
}) => {
  return (
    <div className={`info-card ${className}`}>
      {icon && <div className="info-card__icon">{icon}</div>}
      <div className="info-card__content">
        <h3 className="info-card__title">{title}</h3>
        <p className="info-card__text">{content}</p>
      </div>
    </div>
  );
};

export default InfoCard;
```

4. **Add Styling**

In `InfoCard.scss`, add the following styles:

```scss
.info-card {
  display: flex;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: var(--color-background-light);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &__icon {
    margin-right: 1rem;
    font-size: 1.5rem;
    color: var(--color-primary);
  }
  
  &__content {
    flex: 1;
  }
  
  &__title {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    color: var(--color-text);
  }
  
  &__text {
    margin: 0;
    color: var(--color-text-muted);
  }
}
```

5. **Export the Component**

In `index.ts`, add:

```ts
import InfoCard from './InfoCard';
export { InfoCard };
export type { InfoCardProps } from './InfoCard';
export default InfoCard;
```

## Using Your Component

Now you can use your component in a feature:

```tsx
import { InfoCard } from '../../components/UI/InfoCard';

export const FeatureSection: React.FC = () => {
  return (
    <section className="feature-section">
      <h2>Key Features</h2>
      <div className="feature-section__grid">
        <InfoCard 
          title="Feature 1" 
          content="Description of feature 1" 
          icon="🏋️‍♂️" 
        />
        <InfoCard 
          title="Feature 2" 
          content="Description of feature 2" 
          icon="🏃‍♂️" 
        />
      </div>
    </section>
  );
};
```

## Adding a New Feature

To add a new feature section to the homepage:

1. **Create the Feature Directory Structure**

```bash
mkdir -p src/features/Homepage/NewSection
cd src/features/Homepage/NewSection
```

2. **Create the Required Files**

```bash
touch index.ts
touch NewSection.tsx
touch NewSection.scss
touch types.ts
```

3. **Implement the Feature**

Follow the patterns described in the [Feature Architecture Guide](../architecture/feature-first-approach.md).

## Running Storybook

Storybook is a great way to develop and test your components in isolation:

```bash
npm run storybook
```

Visit `http://localhost:6006` to view the Storybook interface.

## Next Steps

- [Development Workflow](../development/workflow.md) - Learn more about the development process
- [Feature Architecture](../architecture/feature-first-approach.md) - Understand the feature-first approach
- [Component API Reference](../../api/components/) - Explore the available components

## Related Resources

:::tip Related Documentation
- [Creating a Storybook Story](../development/storybook.md)
- [TypeScript Best Practices](../development/typescript.md)
- [Theme Variant System](../architecture/variant-system.md)
::: 