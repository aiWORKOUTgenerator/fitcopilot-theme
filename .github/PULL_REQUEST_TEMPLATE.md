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