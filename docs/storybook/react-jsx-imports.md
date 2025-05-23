# React Import Requirements in Storybook

## Understanding "React is not defined" Errors

When writing Storybook stories with JSX, you may encounter a `ReferenceError: React is not defined` error even when you're not explicitly using the React variable in your code. This happens because JSX is ultimately transformed into `React.createElement()` calls during compilation.

## Always Import React When Using JSX

To avoid this error, **always include a React import in any file that contains JSX syntax**, even if you don't directly reference the React variable:

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from '../MyComponent';

// ... rest of your story
```

## When Is This Necessary?

This import is particularly necessary in:

1. Any story file that uses the `render: () => (...)` pattern
2. Files with JSX syntax like `<div>`, `<MyComponent>`, etc.
3. Templates or decorators that return JSX elements

## Automated Fixes

The FitCopilot project includes several tools to help prevent these errors:

1. **Pre-Storybook Script**: The `npm run storybook` command automatically fixes missing React imports before starting Storybook.

2. **Manual Fix**: You can run `npm run fix:react-imports` to scan and add missing React imports to all story files.

3. **Story Generator**: The `generate-story.js` script automatically adds the React import to all new story files.

4. **Code Linting**: Our ESLint rules are configured to warn about missing React imports in JSX files.

## Recommended Best Practices

- Always place the React import as the first import in files that use JSX
- Use the `import React from 'react';` syntax instead of named imports for this specific import
- When copying story patterns from existing files, make sure to include the React import
- If creating a story with the ThemeVariants pattern or other render functions, double-check that React is imported

## Further Reading

- [React Documentation on JSX](https://reactjs.org/docs/introducing-jsx.html)
- [Storybook React Documentation](https://storybook.js.org/docs/react/get-started/why-storybook)
- [Babel JSX Transform](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) 