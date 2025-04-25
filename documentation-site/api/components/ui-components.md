---
sidebar_position: 2
title: UI Components
description: API reference for UI components in the FitCopilot theme
keywords: [components, ui, api, reference, button]
tags: [components, ui, api]
---

# UI Components API Reference

This page provides detailed API documentation for the UI components in the FitCopilot theme. UI components are reusable, presentational elements without business logic.

## Button

A versatile button component with multiple variants and sizes.

### Import

```tsx
import { Button } from 'src/components/UI/Button';
```

### Usage

```tsx
<Button 
  variant="primary" 
  size="medium"
  onClick={() => console.log('Button clicked')}
>
  Click Me
</Button>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'ghost'` | `'primary'` | Visual style of the button |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the button |
| `onClick` | `() => void` | `undefined` | Click handler function |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `fullWidth` | `boolean` | `false` | Whether the button should take up full width |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `children` | `React.ReactNode` | `undefined` | Button content |

### Examples

#### Primary Button

```tsx
<Button variant="primary">Primary Button</Button>
```

#### Secondary Button

```tsx
<Button variant="secondary">Secondary Button</Button>
```

#### Disabled Button

```tsx
<Button disabled>Disabled Button</Button>
```

#### Full Width Button

```tsx
<Button fullWidth>Full Width Button</Button>
```

## Card

A container component for displaying content in a card format.

### Import

```tsx
import { Card } from 'src/components/UI/Card';
```

### Usage

```tsx
<Card 
  title="Card Title"
  footer={<Button>Action</Button>}
>
  <p>Card content goes here</p>
</Card>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string \| React.ReactNode` | `undefined` | Card title |
| `subtitle` | `string \| React.ReactNode` | `undefined` | Card subtitle |
| `children` | `React.ReactNode` | `undefined` | Card content |
| `footer` | `React.ReactNode` | `undefined` | Card footer content |
| `className` | `string` | `''` | Additional CSS class |
| `bordered` | `boolean` | `true` | Whether the card has a border |
| `elevated` | `boolean` | `false` | Whether the card has a shadow |

### Examples

#### Basic Card

```tsx
<Card title="Basic Card">
  <p>This is a basic card with just a title and content.</p>
</Card>
```

#### Card with Footer

```tsx
<Card 
  title="Card with Footer"
  footer={<Button>Click Me</Button>}
>
  <p>This card has a footer with a button.</p>
</Card>
```

#### Elevated Card

```tsx
<Card 
  title="Elevated Card"
  elevated
>
  <p>This card has an elevation shadow.</p>
</Card>
```

## Icon

A component for displaying icons from the icon library.

### Import

```tsx
import { Icon } from 'src/components/UI/Icon';
```

### Usage

```tsx
<Icon name="arrow-right" size="medium" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | (required) | Icon name from the icon library |
| `size` | `'small' \| 'medium' \| 'large' \| number` | `'medium'` | Size of the icon |
| `color` | `string` | `'currentColor'` | Icon color |
| `className` | `string` | `''` | Additional CSS class |

### Available Icons

The following icons are available in the icon library:

- `arrow-right`
- `arrow-left`
- `close`
- `check`
- `plus`
- `minus`
- `user`
- `heart`
- `star`
- `calendar`
- `clock`

### Examples

#### Basic Icon

```tsx
<Icon name="check" />
```

#### Colored Icon

```tsx
<Icon name="heart" color="var(--color-primary)" />
```

#### Custom Size Icon

```tsx
<Icon name="star" size={32} />
```

## Spinner

A loading spinner component.

### Import

```tsx
import { Spinner } from 'src/components/UI/Spinner';
```

### Usage

```tsx
<Spinner size="medium" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the spinner |
| `color` | `string` | `'currentColor'` | Spinner color |
| `className` | `string` | `''` | Additional CSS class |

### Examples

#### Default Spinner

```tsx
<Spinner />
```

#### Small Spinner

```tsx
<Spinner size="small" />
```

#### Custom Color Spinner

```tsx
<Spinner color="var(--color-primary)" />
```

## Related Documentation

:::tip Related Documentation
- [Component Model](../../docs/architecture/component-model.md)
- [Storybook UI Components](/components)
- [Feature Components](./feature-components.md)
::: 