# Token Compliance Boilerplate

This branch serves as a boilerplate for achieving 100% token compliance across our codebase. It includes fully tokenized Hero components and documentation to help you tokenize other components.

## Getting Started

1. **Create your component branch**

   ```bash
   git checkout token-compliance/boilerplate
   git checkout -b token-compliance/your-component-name
   ```

2. **Check current compliance**

   ```bash
   npm run token-report:component src/path/to/your/component
   ```

3. **Follow the tokenization process outlined in the documentation**

   ```bash
   # Open the guide
   open docs/token-compliance-guide.md
   ```

## Available Scripts

- `npm run token-report` - Run compliance check on the entire codebase
- `npm run token-report:component src/path/to/component` - Check specific component
- `npm run token-report:generate` - Generate a Markdown report of current compliance
- `npm run token-report:hero` - Check Hero component (should be 100%)

## Documentation

- [Token Compliance Guide](docs/token-compliance-guide.md) - Step-by-step process for tokenizing components
- [Token Compliance Tasks](docs/token-compliance-tasks.md) - List of tasks and assignments
- [Reports](docs/reports/) - Generated compliance reports

## Reference Components

The following components have been fully tokenized and can be used as reference:

- `src/features/Homepage/Hero/Hero.scss` - 100% compliant
- `src/features/Homepage/Hero/components/HeroButton.scss` - 100% compliant

These components demonstrate proper token usage patterns for:
- Layout and positioning
- Colors and opacity
- Dimensions and spacing
- Transitions and animations
- Special values (auto, none, transparent, etc.)

## Token Definitions

All design tokens are defined in:
- `src/styles/design-system/_component-tokens.scss`

## Pull Request Process

1. Ensure 100% token compliance for your component
2. Fill out the token compliance checklist in the PR description
3. Include before/after compliance scores
4. Request review from the design systems team

## Need Help?

Refer to the Hero component implementation and the [Token Compliance Guide](docs/token-compliance-guide.md). If you're still stuck, reach out in the #design-system Slack channel.

## Definition of Done

A component is considered fully tokenized when:
1. The token compliance script shows 100% compliance
2. Visual regression tests pass
3. Code review has been completed
4. The PR has been merged into develop 