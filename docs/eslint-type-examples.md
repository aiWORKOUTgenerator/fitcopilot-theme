# ESLint Type Safety Implementation Examples

This document provides examples of how to use the new type safety patterns implemented to resolve ESLint warnings in the FitCopilot codebase.

## Event Handler Types

The new event handler types provide type-safe alternatives to `any` for event handling:

```tsx
import { ButtonClickHandler, InputChangeHandler, FormSubmitHandler } from '../types/events';

// Button click handler
const handleButtonClick: ButtonClickHandler = (event) => {
  // event is properly typed as React.MouseEvent<HTMLButtonElement>
  console.log(event.currentTarget.id);
};

// Input change handler
const handleInputChange: InputChangeHandler = (event) => {
  // event is properly typed as React.FormEvent<HTMLInputElement>
  console.log(event.currentTarget.value);
};

// Form submit handler
const handleFormSubmit: FormSubmitHandler = (event) => {
  // event is properly typed as React.FormEvent<HTMLFormElement>
  event.preventDefault();
  // Submit form data
};
```

## Button Component Pattern

The Button component now uses a discriminated union pattern for strong typing:

```tsx
import { Button } from '../features/shared/Button';

// Primary button
<Button 
  variant="primary"
  size="md"
  isLoading={false}
  onClick={handleButtonClick}
>
  Submit
</Button>

// Secondary button
<Button 
  variant="secondary"
  outline={true}
  onClick={handleButtonClick}
>
  Cancel
</Button>

// Text button
<Button 
  variant="text"
  underline={true}
  onClick={handleButtonClick}
>
  Learn More
</Button>

// Icon button
<Button 
  variant="icon"
  icon={<Icon name="plus" />}
  aria-label="Add item"
  onClick={handleButtonClick}
/>
```

## Media Component Pattern

The Media component uses a similar discriminated union pattern:

```tsx
import { Media } from '../features/shared/Media';

// Image
<Media 
  variant="image"
  src="/images/workout.jpg"
  alt="Person doing workout"
  width={640}
  height={480}
  lazyLoad={true}
/>

// Video
<Media 
  variant="video"
  src="/videos/exercise-demo.mp4"
  poster="/images/video-poster.jpg"
  controls={true}
  muted={true}
  alt="Exercise demonstration"
/>

// Audio
<Media 
  variant="audio"
  src="/audio/workout-instructions.mp3"
  controls={true}
/>

// YouTube
<Media 
  variant="youtube"
  videoId="dQw4w9WgXcQ"
  width={640}
  height={480}
  autoPlay={false}
  showRelated={false}
/>
```

## API Service Pattern

The API service types provide consistent typing for API responses:

```tsx
import { ApiResponse, PaginatedResponse, WordPressPost } from '../api/types';

// Fetch a single post
async function fetchPost(id: number): Promise<ApiResponse<WordPressPost>> {
  // Implementation
}

// Fetch a paginated list of posts
async function fetchPosts(page: number): Promise<PaginatedResponse<WordPressPost>> {
  // Implementation
}

// Usage example
const post = await fetchPost(123);
console.log(post.data.title.rendered);

const posts = await fetchPosts(1);
console.log(`Showing ${posts.data.items.length} of ${posts.data.meta.totalItems} posts`);
```

## Logger Integration

The logger now integrates with our type system for consistent event logging:

```tsx
import { createLoggedEventHandler } from '../utils/logger';
import { ButtonClickHandler } from '../types/events';

// Original event handler
const handleClick: ButtonClickHandler = (event) => {
  // Handle click
};

// Wrapped handler with logging
const loggedHandleClick = createLoggedEventHandler(
  'ExampleComponent',
  'click',
  handleClick
);

// Usage in component
<button onClick={loggedHandleClick}>Click me</button>
```

## Implementation in Components

When implementing components, follow this pattern:

1. Define interfaces for component props
2. Use discriminated union types for variant-based components
3. Implement type guards for each variant
4. Use proper event handler types
5. Use the logger for events

This approach ensures type safety throughout the application and eliminates ESLint warnings related to the use of `any` types. 