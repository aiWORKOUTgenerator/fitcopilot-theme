# Pull Request Description

## What does this PR do?
[Briefly describe the purpose and goals of this PR]

## Related Issues
[Link to any related issues, e.g., "Fixes #123"]

## Changes Made
- [Change 1]
- [Change 2]
- [Change 3]

## Screenshots/GIFs (if applicable)
[Add visual representations of your changes if relevant]

## Testing Instructions
[How can reviewers test your changes?]

---

## Token Compliance Checklist
If your PR includes SCSS changes, please complete this checklist:

- [ ] Identified all non-tokenized properties using `node scripts/token-compliance.js src/path/to/Component`
- [ ] Added component-specific tokens to `_component-tokens.scss` using the naming convention:
  - Position/layout: `--pos-{component}-*`, `--z-{component}-*`
  - Sizes: `--size-{component}-*` 
  - Colors: `--color-{component}-*`
  - Animations: `--duration-{component}-*`, `--ease-{component}-*`
  - Typography: `--type-{component}-*`, `--weight-{component}-*`
  - Visual: `--opacity-{component}-*`, `--shadow-{component}-*`
- [ ] Replaced all hardcoded values with appropriate token variables
- [ ] Verified 100% compliance with `node scripts/token-compliance.js src/path/to/Component`
- [ ] Performed visual regression testing in Storybook
- [ ] Updated documentation if new token categories were introduced

### Compliance Score
Current token compliance: ___%
After changes: ___%

---

## Reviewer Checklist
- [ ] Code follows project standards and guidelines
- [ ] Tests pass
- [ ] Documentation is updated (if needed)

## Description

<!-- Please include a summary of the changes and related issue. -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Enhancement
- [ ] Breaking change
- [ ] Documentation update

## Critical Pattern Verification

**React Bootstrap Integrity:**
- [ ] I did NOT change webpack entry point away from `src/index.tsx` 
- [ ] I ensured React bootstrap logs are included in the build
- [ ] I verified the app mounts correctly (checked in browser)

<!-- If you DID change webpack.config.js, please explain why and how you've verified it doesn't break anything -->

**Template Integrity:**
- [ ] I did NOT change `homepage-template.php` or the mount point ID
- [ ] I maintained the single React bootstrap pattern

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots

<!-- If applicable, add screenshots to help explain your changes. -->

## Additional notes

<!-- Add any other context about the PR here. --> 