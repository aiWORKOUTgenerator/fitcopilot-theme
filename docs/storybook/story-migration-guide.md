# Story Migration Guide

This guide explains how to use the `migrate-stories.js` script to standardize your Storybook story files to follow our component-adjacent pattern.

## What the Migration Script Does

The `migrate-stories.js` script does the following:

1. Scans your codebase for story files (`*.stories.tsx` or `*.stories.js`)
2. Identifies stories that don't follow our standard pattern
3. Moves them to the correct location (`ComponentName/stories/ComponentName.stories.tsx`)
4. Updates import paths to match the new location
5. Optionally applies our standard template structure
6. Intelligently preserves existing stories and prop types
7. Adds theme support only when needed

## Prerequisites

Before running the migration script, ensure:

1. You have committed your current changes (the script will modify files)
2. You are in the project root directory
3. You have Node.js installed

## Usage

### Basic Usage

To migrate all story files that need standardization:

```bash
node scripts/migrate-stories.js
```

### Targeting Specific Components

To migrate only stories for a specific component:

```bash
node scripts/migrate-stories.js Button
```

### Test Mode (Recommended First Step)

To analyze a story without actually migrating it (useful for diagnosing issues):

```bash
node scripts/migrate-stories.js Button --test --verbose
```

This will show detailed analysis of the story file including:
- Component name detection
- Theme support detection
- Import path analysis
- Prop types extraction
- Story content analysis

### Dry Run

To see what would be migrated without making any changes:

```bash
node scripts/migrate-stories.js --dry-run
```

This is useful for previewing the migration before applying changes.

### Applying the Template

To apply our standard template structure to the migrated stories:

```bash
node scripts/migrate-stories.js --apply-template
```

This will:
- Standardize the story structure
- Add a proper meta configuration
- Include a ThemeShowcase story if theme support is detected
- Preserve existing stories and their content
- Extract and maintain prop types
- Fix import paths

### Advanced Options

For more detailed logging during migration:

```bash
node scripts/migrate-stories.js --verbose
```

To test a specific component migration with detailed logging:

```bash
node scripts/migrate-stories.js Button --test --verbose
```

For both applying the template and running in verbose mode:

```bash
node scripts/migrate-stories.js --apply-template --verbose
```

### Complete Options

```bash
Storybook Migration Script

Usage:
  node scripts/migrate-stories.js [options] [file-pattern]

Options:
  --dry-run          Show what would be migrated without making changes
  --apply-template   Apply the standard template to migrated stories
  --test             Test mode: Analyze stories without moving files
  --verbose          Show detailed debug information
  --help, -h         Show this help text

Examples:
  # Migrate all story files
  node scripts/migrate-stories.js

  # Migrate only Button stories
  node scripts/migrate-stories.js Button

  # Preview changes without applying them
  node scripts/migrate-stories.js --dry-run

  # Test migration for a specific component
  node scripts/migrate-stories.js Button --test --verbose

  # Apply template to all migrated stories
  node scripts/migrate-stories.js --apply-template
```

## Standard Story Location Pattern

Our standard pattern for story file locations is:

```
src/features/<FeatureName>/<ComponentName>/
├── stories/                 # Stories directory
│   └── <ComponentName>.stories.tsx
├── <ComponentName>.tsx      # Main component implementation
└── index.ts                 # Component exports
```

The migration script will move your stories to match this pattern.

## What the Script Preserves

The migration script is designed to keep the following:

1. **Existing Stories**: All story variants are preserved
2. **Props and Args**: ArgTypes and story props are maintained
3. **Component Metadata**: Title, description, and other configurations
4. **Theme Support**: ThemeShowcase stories are preserved or added only if needed

## After Migration

After running the migration script:

1. Verify all imports in the migrated stories work correctly
2. Run Storybook to check that all stories render properly
3. Fix any remaining issues manually
4. Commit your changes

## Recommended Migration Process

For the most reliable migration, follow this process:

1. **Analyze First**: Run with `--test --verbose` on a few components to understand what will change
2. **Dry Run**: Use `--dry-run` to see which files will be affected
3. **Migrate in Batches**: Migrate components by feature area, one at a time
4. **Verify in Storybook**: After each batch, verify in Storybook before continuing
5. **Apply Templates Last**: Only use `--apply-template` after basic migration is verified

## Troubleshooting

### Import Path Problems

If you encounter import path issues after migration:

1. Run the script with `--test --verbose` to analyze the component's imports
2. Check relative paths in the migrated story
3. Verify import paths match the component location
4. Make sure you're using curly braces for named imports

### Theme Support Issues

If theme switching doesn't work properly:

1. Verify your component actually uses theme variables
2. Check that `ComponentWithThemes` is properly imported in the story
3. Add a manual `ThemeShowcase` story if the automatic one doesn't work

### Missing Stories After Migration

If stories don't appear in Storybook after migration:

1. Check Story exports in the file
2. Verify the meta configuration includes the correct component
3. Make sure the title follows your project's hierarchy
4. Run `npm run storybook:clear-cache` to clear Storybook's cache

### Manual Migration

If the script fails for a specific component, you can manually migrate:

1. Create a `stories` directory in the component's directory
2. Copy the template from `docs/templates/ComponentStory.template.tsx`
3. Update imports and component references
4. Copy any existing stories to the new file
5. Update import paths 