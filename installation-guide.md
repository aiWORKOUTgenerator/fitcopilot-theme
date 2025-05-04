# Testing Environment Setup

To run the automated tests for the FitCopilot Registration feature, you'll need to install some additional dependencies.

## Required Packages

```bash
# Install Jest and related packages
npm install --save-dev jest ts-jest @types/jest jest-environment-jsdom

# Install testing-library packages
npm install --save-dev @testing-library/react @testing-library/react-hooks @testing-library/user-event

# Install identity-obj-proxy for CSS mocks
npm install --save-dev identity-obj-proxy
```

## Configuration

1. The Jest configuration is already set up in `jest.config.js` at the root of the project.
2. The test scripts have been added to `package.json`.

## Running Tests

After installing the dependencies, you can run the tests:

```bash
# Run all tests
npm test

# Run only Registration tests
npm run test:registration
```

## Troubleshooting

If you encounter any issues with the tests:

1. Make sure you have installed all dependencies
2. Check that Node.js is version 16 or later
3. Verify that your project's typescript configuration is compatible with ts-jest
4. If you get DOM-related errors, ensure jest-environment-jsdom is properly installed

## CI/CD Integration

These tests can be integrated into your CI/CD pipeline using the following steps:

1. Add a test step to your CI configuration
2. Run `npm run test` as part of the pipeline
3. Optionally, set up coverage reporting and thresholds
4. Configure test results to be published as artifacts 