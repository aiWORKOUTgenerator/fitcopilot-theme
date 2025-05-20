# Storybook Story Inventory

This document provides an inventory of all Storybook story files in the FitCopilot theme. It serves as a reference for the standardization process.

## Current Story Files

### Component-Based Stories

| Component | Path | Status |
|-----------|------|--------|
| Button | `src/features/shared/Button/stories/Button.stories.tsx` | ✅ Migrated |
| Card | `src/features/shared/Card/stories/Card.stories.tsx` | ✅ Created |
| FormField | `src/features/shared/FormField/stories/FormField.stories.tsx` | ✅ Created |
| Modal | `src/features/shared/Modal/stories/Modal.stories.tsx` | ✅ Created |
| Tooltip | `src/features/shared/Tooltip/stories/` | ✅ Already in format |

### Feature Stories

| Component | Path | Status |
|-----------|------|--------|
| HeroButton | `src/features/Homepage/Hero/components/HeroButton/stories/HeroButton.stories.tsx` | ✅ Created |
| JourneyButton | `src/features/Homepage/Journey/components/JourneyButton/stories/JourneyButton.stories.tsx` | ✅ Created |
| JourneyStep | `src/features/Homepage/Journey/components/JourneyStep/stories/JourneyStep.stories.tsx` | ✅ Migrated |

## Legacy Stories

Legacy example stories from the initial setup have been removed.

## Migration Status

| Status | Count |
|--------|-------|
| ✅ Successfully migrated/created | 8 |
| ✅ Legacy stories removed | 4 |
| ⏳ Pending migration | 0 |

## Completed Actions

1. ✅ Run the migration script to move stories to their target locations
2. ✅ Create stories for components that don't have them
3. ✅ Remove legacy example stories
4. ✅ Update `.storybook/main.js` to remove legacy patterns

All steps of the Storybook standardization plan have been completed successfully. All story files now follow the component-adjacent pattern and are properly organized according to the project's feature-first architecture. 