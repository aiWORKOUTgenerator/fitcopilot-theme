---
sidebar_position: 2
title: Installation
description: Step-by-step guide to installing the FitCopilot theme for local development
keywords: [installation, setup, local development, wordpress]
tags: [installation, setup]
---

# Installation Guide

This guide will walk you through the process of installing the FitCopilot theme for local development.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **Git**
- **Local WordPress development environment** (We recommend [Local](https://localwp.com/))
- **Composer** (for PHP dependencies)

## Step 1: Set Up a Local WordPress Environment

We recommend using Local by Flywheel for WordPress development:

1. **Install Local**: Download from [localwp.com](https://localwp.com)
2. **Create a new site**:
   - Site name: FitCopilot
   - Environment: Development
   - WordPress: Latest version
   - PHP: 7.4 or higher
   - Web server: Nginx (preferred) or Apache
   - MySQL: Latest version

3. **Configure site**:
   - Enable SSL for local development
   - Set up a custom domain (e.g., `fitcopilot.local`)

## Step 2: Install the Theme

There are two methods to install the theme for local development:

### Method 1: Direct Clone (Preferred)

1. Navigate to your WordPress themes directory:
   ```bash
   cd /path/to/local/sites/fitcopilot/app/public/wp-content/themes
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/fitcopilot/fitcopilot-theme.git
   cd fitcopilot-theme
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Method 2: Symbolic Link

1. Clone the repository to your preferred location:
   ```bash
   git clone https://github.com/fitcopilot/fitcopilot-theme.git
   cd fitcopilot-theme
   npm install
   ```

2. Create a symbolic link to the WordPress themes directory:
   ```bash
   # macOS/Linux
   ln -s /absolute/path/to/fitcopilot-theme /path/to/wordpress/wp-content/themes/fitcopilot
   
   # Windows (Command Prompt as Administrator)
   mklink /D "C:\path\to\wordpress\wp-content\themes\fitcopilot" "C:\absolute\path\to\fitcopilot-theme"
   ```

## Step 3: Activate the Theme

1. Open your WordPress admin dashboard
2. Navigate to Appearance > Themes
3. Find the FitCopilot theme and click "Activate"

## Step 4: Start Development Server

Start the development server with hot reloading:

```bash
npm run dev
```

This will:
- Compile the React application
- Watch for file changes
- Automatically rebuild when changes are detected

Visit your local WordPress site to see the theme in action.

## Troubleshooting

If you encounter any issues during installation:

- Check that all prerequisites are installed correctly
- Verify that WordPress is running properly
- Ensure that the theme directory has proper permissions
- Check the console for any error messages

## Next Steps

Now that you have successfully installed the FitCopilot theme, proceed to:

- [Quick Start Guide](./quick-start.md) - Learn the basics of working with the theme
- [Development Workflow](../development/workflow.md) - Understand the development process

## Related Resources

:::tip Related Documentation
- [Local Development Setup](../development/local-setup.md)
- [WordPress Integration](../wordpress/overview.md)
::: 