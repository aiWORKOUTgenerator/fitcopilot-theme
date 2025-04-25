# API Reference

This document provides a comprehensive reference for all component props, hooks, and WordPress integration points in the FitCopilot theme.

## Table of Contents

1. [Components](#components)
   - [Feature Components](#feature-components)
   - [UI Components](#ui-components)
   - [Layout Components](#layout-components)
2. [Hooks](#hooks)
   - [Data Hooks](#data-hooks)
   - [UI Hooks](#ui-hooks)
   - [WordPress Hooks](#wordpress-hooks)
3. [WordPress Integration](#wordpress-integration)
   - [Data Contracts](#data-contracts)
   - [REST API Endpoints](#rest-api-endpoints)
   - [Theme Customizer](#theme-customizer)

## Components

### Feature Components

#### `<Hero />`

A full-width hero section for the homepage.

```tsx
import { Hero } from 'src/features/Homepage/Hero';

<Hero 
  variant="default" 
  registrationLink="/register"
  loginLink="/login"
  logoUrl="/path/to/logo.png"
/>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'gym'` | `'default'` | Visual variant of the hero |
| `registrationLink` | `string` | `undefined` | URL for the registration button |
| `loginLink` | `string` | `undefined` | URL for the login link |
| `logoUrl` | `string` | `undefined` | URL for the logo image |

#### `<Features />`

Displays feature cards showcasing key application capabilities.

```tsx
import { Features } from 'src/features/Homepage/Features';

<Features 
  features={[
    { title: 'Feature 1', description: 'Description 1', icon: 'icon-1' },
    { title: 'Feature 2', description: 'Description 2', icon: 'icon-2' }
  ]}
/>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `features` | `FeatureItem[]` | `[]` | Array of feature items to display |
| `variant` | `'default' \| 'gym'` | `'default'` | Visual variant of the features section |

**Types**

```tsx
interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}
```

#### `<Pricing />`

Displays pricing options for the service.

```tsx
import { Pricing } from 'src/features/Homepage/Pricing';

<Pricing 
  plans={[
    { 
      name: 'Basic', 
      price: '$9.99', 
      features: ['Feature 1', 'Feature 2'], 
      cta: 'Sign Up',
      ctaLink: '/sign-up' 
    }
  ]}
/>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `plans` | `PricingPlan[]` | `[]` | Array of pricing plans to display |
| `variant` | `'default' \| 'gym'` | `'default'` | Visual variant of the pricing section |

**Types**

```tsx
interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  cta: string;
  ctaLink: string;
  isPopular?: boolean;
}
```

### UI Components

#### `<Button />`

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from 'src/components/UI/Button';

<Button 
  variant="primary" 
  size="medium"
  onClick={() => console.log('Button clicked')}
>
  Click Me
</Button>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'ghost'` | `'primary'` | Visual style of the button |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the button |
| `onClick` | `() => void` | `undefined` | Click handler function |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `fullWidth` | `boolean` | `false` | Whether the button should take up full width |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `children` | `React.ReactNode` | `undefined` | Button content |

### Layout Components

#### `<Section />`

A container component for consistent section layout.

```tsx
import { Section } from 'src/components/Layout/Section';

<Section 
  title="Section Title"
  subtitle="Section subtitle text"
  background="light"
>
  <div>Section content goes here</div>
</Section>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Section title |
| `subtitle` | `string` | `undefined` | Section subtitle |
| `background` | `'light' \| 'dark' \| 'primary' \| 'secondary'` | `'light'` | Background style |
| `children` | `React.ReactNode` | `undefined` | Section content |
| `className` | `string` | `''` | Additional CSS class |
| `id` | `string` | `undefined` | Section ID for anchor links |

## Hooks

### Data Hooks

#### `useHomepageData`

Hook for fetching homepage data from WordPress.

```tsx
import { useHomepageData } from 'src/features/Homepage/hooks';

function MyComponent() {
  const { data, loading, error } = useHomepageData();
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return <div>{data.title}</div>;
}
```

**Returns**

| Property | Type | Description |
|----------|------|-------------|
| `data` | `HomepageData` | Homepage data from WordPress |
| `loading` | `boolean` | Whether data is currently loading |
| `error` | `Error \| null` | Error object if request failed, null otherwise |

**Types**

```tsx
interface HomepageData {
  title: string;
  heroContent: {
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
  };
  featuresContent: FeatureItem[];
  // Other sections...
}
```

### UI Hooks

#### `useAnimation`

Hook for handling animations with IntersectionObserver.

```tsx
import { useAnimation } from 'src/hooks/useAnimation';

function MyComponent() {
  const { ref, inView } = useAnimation({ threshold: 0.5 });
  
  return (
    <div ref={ref} className={inView ? 'animated' : ''}>
      Content that animates when in view
    </div>
  );
}
```

**Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options` | `IntersectionObserverInit & { once?: boolean }` | `{ threshold: 0.1, once: true }` | Intersection observer options |

**Returns**

| Property | Type | Description |
|----------|------|-------------|
| `ref` | `React.RefObject<HTMLElement>` | Ref to attach to the target element |
| `inView` | `boolean` | Whether the element is in view |

### WordPress Hooks

#### `useWordPress`

Hook for accessing WordPress data and functionality.

```tsx
import { useWordPress } from 'src/hooks/useWordPress';

function MyComponent() {
  const { data, fetchPosts } = useWordPress();
  
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  return (
    <div>
      {data.posts.map(post => (
        <article key={post.id}>{post.title.rendered}</article>
      ))}
    </div>
  );
}
```

**Returns**

| Property | Type | Description |
|----------|------|-------------|
| `data` | `WordPressData` | WordPress data including posts, pages, etc. |
| `fetchPosts` | `() => Promise<void>` | Function to fetch posts |
| `fetchPages` | `() => Promise<void>` | Function to fetch pages |
| `loading` | `boolean` | Whether data is currently loading |
| `error` | `Error \| null` | Error object if request failed, null otherwise |

**Types**

```tsx
interface WordPressData {
  posts: WPPost[];
  pages: WPPage[];
  // Other WordPress data...
}

interface WPPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  // Other post data...
}
```

## WordPress Integration

### Data Contracts

Data is passed from WordPress to React through the `fitcopilotData` global variable, which is defined in `inc/react-enqueue.php`.

#### Global WordPress Data Structure

```typescript
interface WindowWithFitCopilot extends Window {
  fitcopilotData: {
    restUrl: string;
    nonce: string;
    themeUrl: string;
    themeVariants: {
      hero: 'default' | 'gym';
      features: 'default' | 'gym';
      // Other variant settings...
    };
    user: {
      isLoggedIn: boolean;
      id: number | null;
      displayName: string | null;
      // Other user data...
    };
    // Other theme data...
  };
}
```

### REST API Endpoints

The theme interacts with the WordPress REST API using the following endpoints:

#### Core WordPress Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/wp/v2/posts` | GET | Fetch all posts |
| `/wp/v2/pages` | GET | Fetch all pages |
| `/wp/v2/media` | GET | Fetch media items |

#### Custom Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/fitcopilot/v1/homepage` | GET | Fetch homepage data |
| `/fitcopilot/v1/variants` | GET | Fetch theme variant settings |

#### Authentication

All API requests should include the WordPress nonce for authentication:

```typescript
const headers = {
  'X-WP-Nonce': window.fitcopilotData.nonce,
  'Content-Type': 'application/json'
};

fetch(`${window.fitcopilotData.restUrl}fitcopilot/v1/homepage`, { headers })
  .then(response => response.json())
  .then(data => console.log(data));
```

### Theme Customizer

The theme provides customizer options for selecting variants and other settings. These options are defined in `includes/theme-variants.php`.

#### Variant Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `fitcopilot_hero_variant` | `string` | `'default'` | Hero section variant |
| `fitcopilot_features_variant` | `string` | `'default'` | Features section variant |
| `fitcopilot_pricing_variant` | `string` | `'default'` | Pricing section variant |
| `fitcopilot_testimonials_variant` | `string` | `'default'` | Testimonials section variant |

#### Accessing Settings in PHP

```php
$hero_variant = get_theme_mod('fitcopilot_hero_variant', 'default');
```

#### Exposing Settings to JavaScript

Settings are passed to JavaScript through the `fitcopilotData` object:

```php
$variants = [
  'hero' => get_theme_mod('fitcopilot_hero_variant', 'default'),
  'features' => get_theme_mod('fitcopilot_features_variant', 'default'),
  // Other variants...
];

wp_localize_script('fitcopilot-app', 'fitcopilotData', [
  // Other data...
  'themeVariants' => $variants,
]);
``` 