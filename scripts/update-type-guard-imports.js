#!/usr/bin/env node

/**
 * Type Guard Import Updater
 * 
 * This script automatically updates import statements for type guards
 * that were moved from component type files to centralized utility files.
 * 
 * Usage:
 *   node scripts/update-type-guard-imports.js [--dry-run] [--path=src/features/shared/Media/__tests__] [--config=custom-config.json]
 * 
 * Options:
 *   --dry-run     Preview changes without writing files
 *   --path        Specify a subdirectory to process (default: src)
 *   --config      Specify a custom configuration file (default: built-in mappings)
 *   --verbose     Show more detailed logs about processing
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const pathArg = args.find(arg => arg.startsWith('--path='));
const configArg = args.find(arg => arg.startsWith('--config='));

const rootDir = pathArg ? pathArg.split('=')[1] : 'src';
const configPath = configArg ? configArg.split('=')[1] : null;

// Load custom configuration if specified
let importMappings = {};
let discriminatorFixes = [];
let importPatterns = [];

// Load from custom config file if specified
if (configPath && fs.existsSync(configPath)) {
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        importMappings = config.importMappings || {};
        discriminatorFixes = config.discriminatorFixes || [];
        importPatterns = config.importPatterns || [];
        console.log(`Loaded configuration from ${configPath}`);
    } catch (error) {
        console.error(`Error loading config from ${configPath}:`, error);
        process.exit(1);
    }
} else {
    // Default built-in mappings
    importMappings = {
        // Media type guards
        "import { isImageMedia } from '../types'": "import { isImageMedia } from '../../../utils/typeGuards/mediaTypeGuards'",
        "import { isVideoMedia } from '../types'": "import { isVideoMedia } from '../../../utils/typeGuards/mediaTypeGuards'",
        "import { isAudioMedia } from '../types'": "import { isAudioMedia } from '../../../utils/typeGuards/mediaTypeGuards'",
        "import { isYouTubeMedia } from '../types'": "import { isYouTubeMedia } from '../../../utils/typeGuards/mediaTypeGuards'",
        "import { isImageGallery } from '../types'": "import { isImageGallery } from '../../../utils/typeGuards/mediaTypeGuards'",
        "import { isMediaCarousel } from '../types'": "import { isMediaCarousel } from '../../../utils/typeGuards/mediaTypeGuards'",

        // Multiple imports
        "import { MediaProps, isImageMedia, isVideoMedia, isAudioMedia, isYouTubeMedia, isImageGallery, isMediaCarousel } from '../types'":
            "import { MediaProps } from '../types';\nimport { isImageMedia, isVideoMedia, isAudioMedia, isYouTubeMedia, isImageGallery, isMediaCarousel } from '../../../utils/typeGuards/mediaTypeGuards'",

        // Button type guards
        "import { isLinkButton } from './types'": "import { isLinkButton } from '../../../utils/typeGuards/buttonTypeGuards'",
        "import { isActionButton } from './types'": "import { isActionButton } from '../../../utils/typeGuards/buttonTypeGuards'",
        "import { isPrimaryButton } from './types'": "import { isPrimaryButton } from '../../../utils/typeGuards/buttonTypeGuards'",
        "import { isSecondaryButton } from './types'": "import { isSecondaryButton } from '../../../utils/typeGuards/buttonTypeGuards'",
        "import { isTextButton } from './types'": "import { isTextButton } from '../../../utils/typeGuards/buttonTypeGuards'",
        "import { isIconButton } from './types'": "import { isIconButton } from '../../../utils/typeGuards/buttonTypeGuards'",
        "import { isToggleButton } from './types'": "import { isToggleButton } from '../../../utils/typeGuards/buttonTypeGuards'",
        "import { isFloatingActionButton } from './types'": "import { isFloatingActionButton } from '../../../utils/typeGuards/buttonTypeGuards'",
        "import { isWorkoutButton } from './types'": "import { isWorkoutButton } from '../../../utils/typeGuards/buttonTypeGuards'",

        // Card type guards
        "import { isContentCard } from '../types'": "import { isContentCard } from '../../../utils/typeGuards/cardTypeGuards'",
        "import { isProfileCard } from '../types'": "import { isProfileCard } from '../../../utils/typeGuards/cardTypeGuards'",
        "import { isWorkoutCard } from '../types'": "import { isWorkoutCard } from '../../../utils/typeGuards/cardTypeGuards'",
        "import { isProgramCard } from '../types'": "import { isProgramCard } from '../../../utils/typeGuards/cardTypeGuards'",
        "import { isPricingCard } from '../types'": "import { isPricingCard } from '../../../utils/typeGuards/cardTypeGuards'",

        // Multiple button imports
        "import { ButtonProps, isLinkButton, isActionButton, isPrimaryButton, isSecondaryButton, isTextButton, isIconButton, isToggleButton, isFloatingActionButton, isWorkoutButton } from './types'":
            "import { ButtonProps } from './types';\nimport { isLinkButton, isActionButton, isPrimaryButton, isSecondaryButton, isTextButton, isIconButton, isToggleButton, isFloatingActionButton, isWorkoutButton } from '../../../utils/typeGuards/buttonTypeGuards'",
    };

    // Define regex patterns for multiline imports
    importPatterns = [
        {
            // Media type guards multiline import from '../types'
            pattern: /import\s*{(?:\s*\r?\n)(?:\s*MediaProps,?\r?\n)(?:\s*is\w+,?\r?\n)*(?:\s*is\w+\r?\n)(?:\s*)}(?:\s*)\sfrom\s*['"]\.\.\/types['"]/g,
            replacement: `import { MediaProps } from '../types';\nimport { 
    isAudioMedia,
    isImageGallery,
    isImageMedia,
    isMediaCarousel,
    isVideoMedia,
    isYouTubeMedia
} from '../../../utils/typeGuards/mediaTypeGuards'`
        },
        {
            // Button type guards multiline import from './types'
            pattern: /import\s*{(?:\s*\r?\n)(?:\s*ButtonProps,?\r?\n)(?:\s*is\w+,?\r?\n)*(?:\s*is\w+\r?\n)(?:\s*)}(?:\s*)\sfrom\s*['"]\.\/types['"]/g,
            replacement: `import { ButtonProps } from './types';\nimport { 
    isLinkButton,
    isActionButton,
    isPrimaryButton,
    isSecondaryButton,
    isTextButton,
    isIconButton,
    isToggleButton,
    isFloatingActionButton,
    isWorkoutButton
} from '../../../utils/typeGuards/buttonTypeGuards'`
        },
        {
            // Button type guards multiline import from './'
            pattern: /import\s*{(?:\s*\r?\n)(?:\s*ButtonProps,?\r?\n)(?:\s*is\w+,?\r?\n)*(?:\s*is\w+\r?\n)(?:\s*)}(?:\s*)\sfrom\s*['"]\.\/['"]/g,
            replacement: `import { ButtonProps } from './';\nimport { 
    isFloatingActionButton,
    isIconButton,
    isLinkButton,
    isPrimaryButton,
    isSecondaryButton,
    isTextButton,
    isToggleButton,
    isWorkoutButton
} from '../../../utils/typeGuards/buttonTypeGuards'`
        }
    ];

    // Define discriminator property fixes
    discriminatorFixes = [
        {
            pattern: /const props: MediaProps = \{\s*variant: ['"]([a-zA-Z]+)['"]/g,
            replacement: (match, variant) => `const props: MediaProps = {\n  type: '${variant}'`, // Replace variant with type
            files: [/mediaTypeGuards\.test\.tsx?$/]
        }
    ];
}

/**
 * Helper function to calculate the relative path to typeGuards directory
 * based on the current file's location
 */
function calculateRelativePath(filePath) {
    // Get the depth of the file from the src directory
    const srcIndex = filePath.indexOf('src');
    if (srcIndex === -1) return '../../../utils/typeGuards';

    const pathFromSrc = filePath.substring(srcIndex + 4); // +4 to skip 'src/'
    const depth = pathFromSrc.split(path.sep).filter(Boolean).length;

    // Generate the appropriate number of '../' segments
    return '../'.repeat(depth) + 'utils/typeGuards';
}

/**
 * Helper to check if file matches any pattern
 */
function matchesPattern(file, patterns) {
    return patterns.some(pattern => pattern.test(file));
}

/**
 * Generate customized import mappings based on the file path
 */
function getCustomizedMappings(filePath) {
    const relativePath = calculateRelativePath(filePath);

    // Create a copy of importMappings with adjusted relative paths
    const customMappings = {};

    for (const [oldImport, newImport] of Object.entries(importMappings)) {
        // Replace all occurrences of '../../../utils/typeGuards' with the calculated relative path
        customMappings[oldImport] = newImport.replace(/['"][.\/]+\/utils\/typeGuards/g, `'${relativePath}`);
    }

    return customMappings;
}

/**
 * Handle mixed imports - separate type definitions from type guards
 */
function handleMixedImports(content, typeGuardsPath) {
    // Regular expression to find import statements that mix types and type guards
    const mixedImportRegex = /import\s*{([^}]+)}\s*from\s*['"]([^'"]+)['"]/g;

    let result = content;
    let match;

    while ((match = mixedImportRegex.exec(content)) !== null) {
        const importItems = match[1].split(',').map(item => item.trim());
        const importPath = match[2];

        // Skip if it's already a typeGuards import
        if (importPath.includes('typeGuards')) continue;

        // Separate type guards (is*) from regular types
        const typeGuards = importItems.filter(item => /^is[A-Z]/.test(item));
        const regularTypes = importItems.filter(item => !/^is[A-Z]/.test(item));

        // If we have both types and type guards, split them
        if (typeGuards.length > 0 && regularTypes.length > 0) {
            // Determine which type guards go to which utility file
            const mediaGuards = typeGuards.filter(g => /Media|Gallery|Carousel/.test(g));
            const buttonGuards = typeGuards.filter(g => /Button/.test(g));
            const cardGuards = typeGuards.filter(g => /Card/.test(g));

            // Create new import statements
            let replacement = `import { ${regularTypes.join(', ')} } from '${importPath}';\n`;

            if (mediaGuards.length > 0) {
                replacement += `import { ${mediaGuards.join(', ')} } from '${typeGuardsPath}/mediaTypeGuards';\n`;
            }

            if (buttonGuards.length > 0) {
                replacement += `import { ${buttonGuards.join(', ')} } from '${typeGuardsPath}/buttonTypeGuards';\n`;
            }

            if (cardGuards.length > 0) {
                replacement += `import { ${cardGuards.join(', ')} } from '${typeGuardsPath}/cardTypeGuards';\n`;
            }

            // Replace the original import
            result = result.replace(match[0], replacement.trim());
        }
    }

    return result;
}

/**
 * Process a single file
 */
function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        let modified = false;

        // Calculate the relative path to typeGuards
        const typeGuardsPath = calculateRelativePath(filePath);

        // Get customized mappings for this file
        const customMappings = getCustomizedMappings(filePath);

        // Apply regex-based replacement for multiline imports
        for (const { pattern, replacement } of importPatterns) {
            const modifiedReplacement = replacement.replace(/['"][.\/]+\/utils\/typeGuards/g, `'${typeGuardsPath}`);
            if (pattern.test(newContent)) {
                newContent = newContent.replace(pattern, modifiedReplacement);
                modified = true;
                if (verbose) console.log(`[${filePath}] Replaced multiline import pattern`);
            }
        }

        // Apply import mappings for single-line imports
        for (const [oldImport, newImport] of Object.entries(customMappings)) {
            if (newContent.includes(oldImport)) {
                newContent = newContent.replace(oldImport, newImport);
                modified = true;
                if (verbose) console.log(`[${filePath}] Replace: ${oldImport} -> ${newImport}`);
            }
        }

        // Handle mixed imports
        const afterMixedImports = handleMixedImports(newContent, typeGuardsPath);
        if (afterMixedImports !== newContent) {
            newContent = afterMixedImports;
            modified = true;
            if (verbose) console.log(`[${filePath}] Processed mixed imports`);
        }

        // Apply discriminator fixes if file matches patterns
        for (const { pattern, replacement, files } of discriminatorFixes) {
            if (matchesPattern(filePath, files)) {
                const fixedContent = newContent.replace(pattern, replacement);
                if (fixedContent !== newContent) {
                    newContent = fixedContent;
                    modified = true;
                    if (verbose) console.log(`[${filePath}] Fixed discriminator property`);
                }
            }
        }

        // Write changes if file was modified
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
            // Skip node_modules and .git
            if (entry.name !== 'node_modules' && entry.name !== '.git') {
                processDirectory(entryPath);
            }
        } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
            // Process TypeScript and JavaScript files
            processFile(entryPath);
        }
    }
}

/**
 * Create sample configuration file
 */
function createSampleConfig() {
    const sampleConfig = {
        importMappings: importMappings,
        importPatterns: importPatterns.map(({ pattern, replacement }) => ({
            pattern: pattern.toString(),
            replacement
        })),
        discriminatorFixes: discriminatorFixes
    };

    fs.writeFileSync('type-guard-import-config.sample.json', JSON.stringify(sampleConfig, null, 2));
    console.log('Created sample configuration file: type-guard-import-config.sample.json');
}

/**
 * Main function
 */
function main() {
    console.log(`Starting type guard import updates${dryRun ? ' (dry run)' : ''}`);
    console.log(`Processing directory: ${rootDir}`);

    try {
        // Create sample config if requested
        if (args.includes('--create-sample-config')) {
            createSampleConfig();
            return;
        }

        processDirectory(rootDir);
        console.log('Finished processing files');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Execute the script
main(); 