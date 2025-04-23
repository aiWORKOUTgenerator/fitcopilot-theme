# FitCopilot Documentation Site

This directory contains the comprehensive documentation for the FitCopilot theme, built with [Docusaurus](https://docusaurus.io/).

## Structure

The documentation is organized into several sections:

- **Docs**: Main documentation including architecture, setup, and development guidelines
- **Components**: Component documentation with Storybook integration
- **API**: API reference for WordPress endpoints and React interfaces
- **Metrics**: Quality metrics dashboard and performance monitoring

## Development

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x

### Installation

```bash
# Install dependencies
npm install
```

### Local Development

```bash
# Start the development server
npm start
```

This will start a local development server at `http://localhost:3000`.

### Building for Production

```bash
# Build the documentation site
npm run build
```

This will generate static content in the `build` directory that can be served using any static hosting service.

### Serving the Built Website

```bash
# Serve the built website locally
npm run serve
```

## Documentation Generation

The documentation site includes scripts for automatic generation of documentation from source code:

### Component Documentation

To generate component documentation from JSDoc comments:

```bash
# From the root directory
npm run docs:generate
```

### Metrics Dashboard

To generate and update the metrics dashboard:

```bash
# From the root directory
npm run metrics
```

## GitHub Integration

The documentation site is automatically deployed via GitHub Actions when changes are pushed to the main branch.

## Roadmap

See [Documentation Roadmap](./docs/development/documentation-roadmap.md) for planned improvements to the documentation system.

## Contributing

Contributions to the documentation are welcome! Please see the [contribution guide](./docs/development/contribution-guide.md) for more information.
