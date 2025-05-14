#!/usr/bin/env node

/**
 * Media Component Test Fixer
 * 
 * This script updates Media component tests to account for:
 * 1. DOM structure changes
 * 2. BEM class naming convention changes
 * 3. Type guard import path changes
 * 4. Discriminator property changes (variant -> type)
 * 
 * Usage:
 *   node scripts/component-fixers/media-component-fixer.js [--dry-run] [--path=src/features/shared/Media/__tests__]
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const pathArg = args.find(arg => arg.startsWith('--path='));
const rootDir = pathArg ? pathArg.split('=')[1] : 'src/features/shared/Media/__tests__';

// Common DOM structure changes for media components
const domStructureFixes = [
  // Fix audio selectors
  {
    pattern: /getByRole\(['"](audio)['"]\)/g,
    replacement: 'container.querySelector("audio")'
  },
  // Fix video selectors
  {
    pattern: /getByRole\(['"](video)['"]\)/g,
    replacement: 'container.querySelector("video")'
  },
  // Fix image selectors
  {
    pattern: /getByRole\(['"](img)['"]\)/g,
    replacement: 'container.querySelector("img")'
  },
  // Fix missing container in render
  {
    pattern: /const\s*{\s*([^}]+)\s*}\s*=\s*render\(/g,
    replacement: 'const { $1, container } = render('
  },
  // Wrap events in act()
  {
    pattern: /(\w+)\.dispatchEvent\(([^)]+)\);?\s*(?!act)/g,
    replacement: 'act(() => {\n  $1.dispatchEvent($2);\n});'
  }
];

// BEM class name conventions
const bemClassFixes = [
  // Audio classes
  {
    pattern: /['"]media-audio['"]/g,
    replacement: '"audio-player__element"'
  },
  // Video classes
  {
    pattern: /['"]media-video['"]/g,
    replacement: '"video-player__element"'
  },
  // Image classes
  {
    pattern: /['"]media-image['"]/g,
    replacement: '"image-media__element"'
  },
  // YouTube classes
  {
    pattern: /['"]media-youtube['"]/g,
    replacement: '"youtube-player__container"'
  },
  // Gallery classes
  {
    pattern: /['"]media-gallery['"]/g,
    replacement: '"image-gallery__container"'
  },
  // Carousel classes
  {
    pattern: /['"]media-carousel['"]/g, 
    replacement: '"media-carousel__container"'
  }
];

// Discriminator property fixes (for component test props)
const discriminatorFixes = [
  // Add type property when only variant exists (for core type usage)
  {
    pattern: /(const\s+\w+\s*:\s*MediaProps\s*=\s*{\s*)(variant:\s*['"](\w+)['"](,?))/g,
    replacement: '$1variant: "$3"$4\n  type: "$3",'
  }
];

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let modified = false;

    // Apply DOM structure fixes
    for (const { pattern, replacement } of domStructureFixes) {
      if (pattern.test(newContent)) {
        newContent = newContent.replace(pattern, replacement);
        modified = true;
        if (verbose) console.log(`[${filePath}] Updated DOM structure selectors`);
      }
    }

    // Apply BEM class naming convention fixes
    for (const { pattern, replacement } of bemClassFixes) {
      if (pattern.test(newContent)) {
        newContent = newContent.replace(pattern, replacement);
        modified = true;
        if (verbose) console.log(`[${filePath}] Updated to BEM class naming`);
      }
    }

    // Apply discriminator property fixes
    for (const { pattern, replacement } of discriminatorFixes) {
      if (pattern.test(newContent)) {
        newContent = newContent.replace(pattern, replacement);
        modified = true;
        if (verbose) console.log(`[${filePath}] Fixed discriminator properties`);
      }
    }

    // Fix missing react import for act()
    if (newContent.includes('act(() =>') && !newContent.includes('import { act }')) {
      if (newContent.includes('import React')) {
        newContent = newContent.replace(
          /import React([^;]*);/,
          'import React, { act }$1;'
        );
      } else if (newContent.includes('import {') && newContent.includes('} from \'react\'')) {
        newContent = newContent.replace(
          /import {([^}]*)} from ['"]react['"]/,
          'import { act,$1} from \'react\''
        );
      } else {
        newContent = 'import { act } from \'react\';\n' + newContent;
      }
      modified = true;
      if (verbose) console.log(`[${filePath}] Added missing act import`);
    }

    // Write changes if the file was modified
    if (modified) {
      if (dryRun) {
        console.log(`[DRY RUN] Would update: ${filePath}`);
      } else {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

/**
 * Recursively traverse directories
 */
function processDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      processDirectory(entryPath);
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      // Process TypeScript and JavaScript test files
      processFile(entryPath);
    }
  }
}

/**
 * Main function
 */
function main() {
  console.log(`Starting Media component test fixes${dryRun ? ' (dry run)' : ''}`);
  console.log(`Processing directory: ${rootDir}`);

  try {
    // Create the directory if it doesn't exist
    const dirPath = path.dirname(rootDir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (fs.existsSync(rootDir)) {
      if (fs.lstatSync(rootDir).isDirectory()) {
        processDirectory(rootDir);
      } else {
        processFile(rootDir);
      }
    } else {
      console.error(`Error: ${rootDir} does not exist`);
      process.exit(1);
    }

    console.log('Finished processing files');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Execute the script
main(); 