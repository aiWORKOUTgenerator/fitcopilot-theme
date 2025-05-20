# Storybook Story Standardization PR

## Description
This PR implements the standardization of Storybook story files to use the component-adjacent `stories/` pattern.

## Components Affected
<!-- List the components whose stories were migrated -->
- [ ] 

## Migration Details
<!-- Provide details about the migration -->
- [ ] Moved stories from old location to component-adjacent `stories/` directory
- [ ] Updated imports in story files
- [ ] Verified stories still render correctly in Storybook
- [ ] Added missing stories for components (if applicable)

## Checklist
- [ ] Stories follow the component-adjacent pattern (`Component/stories/Component.stories.tsx`)
- [ ] Story imports have been updated to reflect new locations
- [ ] Story files include proper documentation (component description, argTypes, etc.)
- [ ] Storybook builds and runs without errors
- [ ] All stories render correctly in Storybook UI
- [ ] Component variants are properly represented in stories

## Screenshots
<!-- Add screenshots of the stories in Storybook if relevant -->

## Related Issues
<!-- Link to any related issues -->
Implements part of #ISSUE_NUMBER

## Testing Instructions
1. Run `npm run storybook`
2. Verify that the migrated stories appear under their appropriate sections
3. Check that all stories render without errors
4. Verify that theme variants work correctly where applicable 