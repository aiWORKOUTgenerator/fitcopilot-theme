#!/usr/bin/env node

/**
 * Storybook Migration Script
 * 
 * This script:
 * 1. Detects story files that don't follow the component-adjacent pattern
 * 2. Moves them to the standard location (ComponentName/stories/ComponentName.stories.tsx)
 * 3. Updates import paths to match the new location
 * 4. Applies the standard template structure if requested
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const applyTemplate = args.includes('--apply-template');
const dryRun = args.includes('--dry-run');
const testMode = args.includes('--test');
const verbose = args.includes('--verbose');
const specificFile = args.find(arg => !arg.startsWith('--'));

// Config
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const TEMPLATE_PATH = path.join(PROJECT_ROOT, 'docs/templates/ComponentStory.template.tsx');

// Set up logging based on verbosity
const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = verbose ? logLevels.DEBUG : logLevels.INFO;

function log(message, level = logLevels.INFO) {
  if (level <= currentLogLevel) {
    const prefix = level === logLevels.ERROR ? '❌ ERROR: ' :
                  level === logLevels.WARN ? '⚠️ WARNING: ' :
                  level === logLevels.INFO ? '📝 ' :
                  level === logLevels.DEBUG ? '🔍 DEBUG: ' : '';
    console.log(prefix + message);
  }
}

// Detect stories that need migration
function detectStoriesToMigrate() {
  console.log('Scanning for story files that need migration...');
  
  // Get all story files
  let storyFiles = [];
  
  try {
    const gitLsOutput = execSync('git ls-files "*.stories.tsx" "*.stories.js"', { encoding: 'utf8' });
    storyFiles = gitLsOutput.split('\n').filter(Boolean);
  } catch (error) {
    // Fallback to manual search if git command fails
    console.log('Git command failed, falling back to manual file search...');
    
    function findStoryFiles(dir) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          findStoryFiles(filePath);
        } else if (file.name.endsWith('.stories.tsx') || file.name.endsWith('.stories.js')) {
          storyFiles.push(filePath.replace(PROJECT_ROOT + '/', ''));
        }
      }
    }
    
    findStoryFiles(SRC_DIR);
  }
  
  console.log(`Found ${storyFiles.length} story files in total.`);
  
  // Filter stories that need migration
  const needsMigration = storyFiles.filter(file => {
    if (specificFile && !file.includes(specificFile)) {
      return false;
    }
    
    // Skip files that are already in a /stories/ directory with correct name pattern
    const dirName = path.dirname(file);
    const fileName = path.basename(file);
    const componentName = fileName.replace(/\.stories\.(tsx|js)$/, '');
    
    const isInStoriesDir = dirName.endsWith('/stories');
    const hasCorrectComponentDir = path.basename(path.dirname(dirName)) === componentName;
    
    // If the file is already in the correct location, skip it
    if (isInStoriesDir && hasCorrectComponentDir) {
      return false;
    }
    
    return true;
  });
  
  console.log(`Found ${needsMigration.length} story files that need migration.`);
  return needsMigration;
}

/**
 * Determines the target path for a story file
 */
function getTargetPath(sourcePath) {
  const fileName = path.basename(sourcePath);
  const componentName = fileName.replace(/\.stories\.(tsx|js)$/, '');
  const sourceDir = path.dirname(sourcePath);
  
  // Try to find the actual component file to determine the correct location
  const possibleComponentFiles = [
    path.join(sourceDir, `${componentName}.tsx`),
    path.join(sourceDir, `${componentName}.jsx`),
    path.join(sourceDir, `${componentName}.js`),
    path.join(path.dirname(sourceDir), `${componentName}.tsx`),
    path.join(path.dirname(sourceDir), `${componentName}.jsx`),
    path.join(path.dirname(sourceDir), `${componentName}.js`),
  ];
  
  let componentPath = null;
  for (const file of possibleComponentFiles) {
    if (fs.existsSync(file)) {
      componentPath = file;
      break;
    }
  }
  
  if (componentPath) {
    // Use component location to determine the correct target
    const componentDir = path.dirname(componentPath);
    return path.join(componentDir, 'stories', fileName);
  }
  
  // Fallback: if we can't find the component, make an educated guess
  if (sourceDir.includes('__stories__')) {
    // Convert __stories__/Component.stories.tsx to Component/stories/Component.stories.tsx
    return path.join(path.dirname(sourceDir), componentName, 'stories', fileName);
  } else {
    // Convert Dir/Component.stories.tsx to Dir/Component/stories/Component.stories.tsx
    return path.join(sourceDir, componentName, 'stories', fileName);
  }
}

/**
 * Creates directories recursively if they don't exist
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    if (!dryRun) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Analyzes a file's imports and updates them based on the new location
 */
function updateImportPaths(fileContent, sourcePath, targetPath) {
  const sourceDir = path.dirname(sourcePath);
  const targetDir = path.dirname(targetPath);
  
  // Calculate the relative path difference
  const relativeDepthChange = path.relative(targetDir, sourceDir).split('/').length;
  const needsMoreDots = targetDir.split('/').length > sourceDir.split('/').length;
  
  let updatedContent = fileContent;
  
  // Update relative imports
  const importRegex = /import\s+(?:(?:{[^}]*})|(?:[^{}\s]+))\s+from\s+['"]([^'"]+)['"]/g;
  let importMatch;
  
  const processedImports = new Set();
  
  while ((importMatch = importRegex.exec(fileContent)) !== null) {
    const importPath = importMatch[1];
    
    // Skip absolute imports and already processed ones
    if (!importPath.startsWith('.') || processedImports.has(importPath)) {
      continue;
    }
    
    processedImports.add(importPath);
    
    // Calculate new import path
    let newImportPath;
    
    if (needsMoreDots) {
      // Need to add more ../
      if (importPath.startsWith('../')) {
        newImportPath = '../'.repeat(relativeDepthChange) + importPath;
      } else if (importPath.startsWith('./')) {
        newImportPath = '../'.repeat(relativeDepthChange) + importPath.substring(2);
      } else {
        newImportPath = '../'.repeat(relativeDepthChange) + importPath;
      }
    } else {
      // Need to remove ../
      const importParts = importPath.split('/');
      const dotDotCount = importParts.filter(p => p === '..').length;
      
      if (dotDotCount > relativeDepthChange) {
        newImportPath = '../'.repeat(dotDotCount - relativeDepthChange) + 
                        importParts.slice(dotDotCount).join('/');
      } else if (dotDotCount === relativeDepthChange) {
        newImportPath = './' + importParts.slice(dotDotCount).join('/');
      } else {
        // This is a complex case - might need manual adjustment
        newImportPath = importPath;
      }
    }
    
    // Only replace the exact import path to avoid messing up similar imports
    updatedContent = updatedContent.replace(
      new RegExp(`from\\s+['"]${importPath.replace(/\./g, '\\.')}['"]`, 'g'),
      `from '${newImportPath}'`
    );
  }
  
  return updatedContent;
}

/**
 * Determines the file extension of the source path
 */
function getFileExtension(sourcePath) {
  return path.extname(sourcePath);
}

/**
 * Detects if a file uses ThemeProvider or ComponentWithThemes
 */
function detectThemeProvider(fileContent) {
  return fileContent.includes('ThemeProvider') || 
         fileContent.includes('ComponentWithThemes');
}

/**
 * Tries to detect the import path for a component
 */
function detectComponentImportPath(fileContent, componentName) {
  const importRegex = new RegExp(`import[\\s\\n]+(?:{[^}]*}|[^{\\s]+)[\\s\\n]+from[\\s\\n]+['"]([^'"]*${componentName})['"']`, 'g');
  const match = importRegex.exec(fileContent);
  return match ? match[1] : null;
}

/**
 * Extracts and updates prop types from a story file
 */
function extractAndUpdatePropTypes(fileContent, componentName) {
  const propTypesRegex = new RegExp(`(interface|type)\\s+(${componentName}Props|${componentName}Story)\\s*\\{([^}]*)\\}`, 'g');
  const match = propTypesRegex.exec(fileContent);
  
  if (match) {
    return match[0];
  }
  
  return `interface ${componentName}Props {}`;
}

/**
 * Applies the standard template to a story file
 */
function applyTemplate(fileContent, componentName) {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`Template file not found: ${TEMPLATE_PATH}`);
    return fileContent;
  }
  
  // Read the template
  const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  
  // Extract important parts from the original file
  const titleMatch = fileContent.match(/title:\s*['"]([^'"]+)['"]/);
  const title = titleMatch ? titleMatch[1] : `Components/${componentName}`;
  
  const descriptionMatch = fileContent.match(/component:\s*['"]([^'"]+)['"]/);
  const description = descriptionMatch ? descriptionMatch[1] : `${componentName} component`;
  
  const argTypesMatch = fileContent.match(/argTypes:\s*({[^}]+})/);
  const argTypes = argTypesMatch ? argTypesMatch[1] : '{}';
  
  const storiesSection = fileContent.match(/export const [^}]+}/g) || [];
  
  // Detect if theme support is needed
  const needsThemeSupport = detectThemeProvider(fileContent);
  
  // Try to detect the component import path
  const detectedImportPath = detectComponentImportPath(fileContent, componentName);
  const importPath = detectedImportPath ? detectedImportPath : `../${componentName}`;
  
  // Extract prop types
  const propTypes = extractAndUpdatePropTypes(fileContent, componentName);
  
  // Create new content based on template
  let newContent = templateContent
    .replace(/\/\/ import.*Component.*from.*components.*;/, `import { ${componentName} } from '${importPath}';`)
    .replace(/\/\/ interface ComponentProps \{\}/, propTypes)
    .replace(/\/\*\s*const meta[\s\S]*?Component[\s\S]*?\*\//, 
            `const meta: Meta<typeof ${componentName}> = {
  title: '${title}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${description}'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: ${argTypes}
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;`);
  
  // Check if there's a Default story
  const hasDefaultStory = storiesSection.some(s => s.includes('export const Default'));
  
  if (!hasDefaultStory) {
    newContent = newContent.replace(/\/\*\s*export const Default[\s\S]*?\*\//, 
              `export const Default: Story = {
  args: {
    // Default props
  }
};`);
  } else {
    // Find and include the Default story from the original file
    const defaultStory = storiesSection.find(s => s.includes('export const Default'));
    newContent = newContent.replace(/\/\*\s*export const Default[\s\S]*?\*\//, defaultStory);
  }
  
  // Check if we need theme support and if there's a ThemeShowcase story
  if (needsThemeSupport) {
    const hasThemeShowcase = storiesSection.some(s => s.includes('export const ThemeShowcase'));
    
    if (!hasThemeShowcase) {
      // Add a ThemeShowcase story
      newContent = newContent.replace(/\/\*\s*export const ThemeShowcase[\s\S]*?\*\//, 
                `export const ThemeShowcase: Story = {
  render: (args) => ComponentWithThemes(${componentName}, args),
  args: {
    // Component props
  }
};`);
    } else {
      // Find and include the ThemeShowcase story from the original file
      const themeShowcase = storiesSection.find(s => s.includes('export const ThemeShowcase'));
      newContent = newContent.replace(/\/\*\s*export const ThemeShowcase[\s\S]*?\*\//, themeShowcase);
    }
  }
  
  // Look for additional stories in the original content
  const additionalStories = storiesSection.filter(story => 
    !story.includes('export const Default') && 
    !story.includes('export const ThemeShowcase')
  );
  
  // If there are additional stories, add them after the template stories
  if (additionalStories.length > 0) {
    newContent += '\n\n// Additional stories from original file\n';
    newContent += additionalStories.join('\n\n');
  }
  
  return newContent;
}

/**
 * Migrates a story file from source to target
 */
function migrateStoryFile(sourcePath) {
  const targetPath = getTargetPath(sourcePath);
  
  console.log(`\nMigrating: ${sourcePath} -> ${targetPath}`);
  
  if (dryRun) {
    console.log('[DRY RUN] - No changes will be made');
    return true;
  }
  
  try {
    // Read the source file
    const fileContent = fs.readFileSync(sourcePath, 'utf8');
    
    // Create target directory if it doesn't exist
    const targetDir = path.dirname(targetPath);
    ensureDirectoryExists(targetDir);
    
    // Process content
    let processedContent;
    
    if (applyTemplate) {
      // Apply the standard template
      const componentName = path.basename(sourcePath).replace(/\.stories\.(tsx|js)$/, '');
      processedContent = applyTemplate(fileContent, componentName);
    } else {
      // Just update the import paths
      processedContent = updateImportPaths(fileContent, sourcePath, targetPath);
    }
    
    // Write the file
    fs.writeFileSync(targetPath, processedContent, 'utf8');
    console.log(`Migrated: ${targetPath}`);
    
    // Check if source and target are different
    if (sourcePath !== targetPath) {
      fs.unlinkSync(sourcePath);
      console.log(`Deleted original file: ${sourcePath}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error migrating ${sourcePath}:`, error);
    return false;
  }
}

/**
 * Tests a component story migration without moving files
 */
function testStoryMigration(sourcePath) {
  log(`\n🧪 TESTING MIGRATION FOR: ${sourcePath}`, logLevels.INFO);
  
  try {
    // Read the source file
    const fileContent = fs.readFileSync(sourcePath, 'utf8');
    const targetPath = getTargetPath(sourcePath);
    
    log(`Target path would be: ${targetPath}`, logLevels.INFO);
    
    // Process content
    const componentName = path.basename(sourcePath).replace(/\.stories\.(tsx|js)$/, '');
    log(`Component name: ${componentName}`, logLevels.DEBUG);
    
    // Detect if theme support is needed
    const needsThemeSupport = detectThemeProvider(fileContent);
    log(`Needs theme support: ${needsThemeSupport}`, logLevels.DEBUG);
    
    // Try to detect the component import path
    const detectedImportPath = detectComponentImportPath(fileContent, componentName);
    log(`Detected import path: ${detectedImportPath || 'None'}`, logLevels.DEBUG);
    
    // Extract prop types
    const propTypes = extractAndUpdatePropTypes(fileContent, componentName);
    log(`Extracted prop types: ${propTypes}`, logLevels.DEBUG);
    
    // Get story sections
    const storiesSection = fileContent.match(/export const [^}]+}/g) || [];
    log(`Found ${storiesSection.length} story exports`, logLevels.DEBUG);
    
    if (storiesSection.length > 0) {
      log(`Story examples:`, logLevels.DEBUG);
      storiesSection.slice(0, 2).forEach((story, index) => {
        log(`  Story ${index + 1}: ${story.substring(0, 100)}...`, logLevels.DEBUG);
      });
    }
    
    // Analyze imports
    const importRegex = /import\s+(?:(?:{[^}]*})|(?:[^{}\s]+))\s+from\s+['"]([^'"]+)['"]/g;
    const imports = [];
    let importMatch;
    
    while ((importMatch = importRegex.exec(fileContent)) !== null) {
      imports.push(importMatch[0]);
    }
    
    log(`Found ${imports.length} imports`, logLevels.DEBUG);
    if (imports.length > 0) {
      log(`Import examples:`, logLevels.DEBUG);
      imports.slice(0, 3).forEach((imp, index) => {
        log(`  Import ${index + 1}: ${imp}`, logLevels.DEBUG);
      });
    }
    
    log(`\nMigration test completed for ${sourcePath}`, logLevels.INFO);
    log(`The file appears to be ${needsThemeSupport ? 'using' : 'not using'} theme support.`, logLevels.INFO);
    log(`Run the migration with --apply-template to standardize the file.`, logLevels.INFO);
    
    return true;
  } catch (error) {
    log(`Error testing migration for ${sourcePath}: ${error}`, logLevels.ERROR);
    return false;
  }
}

/**
 * Main function to run the migration
 */
function runMigration() {
  log('Starting Storybook stories migration...', logLevels.INFO);
  log(`Mode: ${dryRun ? 'DRY RUN' : (testMode ? 'TEST' : 'LIVE')}`, logLevels.INFO);
  log(`Apply template: ${applyTemplate ? 'YES' : 'NO'}`, logLevels.INFO);
  log(`Verbose logging: ${verbose ? 'YES' : 'NO'}`, logLevels.DEBUG);
  
  const storiesToMigrate = detectStoriesToMigrate();
  
  if (storiesToMigrate.length === 0) {
    log('No stories need migration. All good!', logLevels.INFO);
    return;
  }
  
  let successCount = 0;
  let failCount = 0;
  
  storiesToMigrate.forEach(sourcePath => {
    try {
      let success;
      
      if (testMode) {
        success = testStoryMigration(sourcePath);
      } else {
        success = migrateStoryFile(sourcePath);
      }
      
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      log(`Error processing ${sourcePath}: ${error}`, logLevels.ERROR);
      failCount++;
    }
  });
  
  log('\nMigration Summary:', logLevels.INFO);
  log(`- Successfully ${testMode ? 'tested' : 'migrated'}: ${successCount} files`, logLevels.INFO);
  log(`- Failed to ${testMode ? 'test' : 'migrate'}: ${failCount} files`, logLevels.INFO);
  
  if (failCount === 0) {
    log(`\nAll ${testMode ? 'tests' : 'migrations'} completed successfully!`, logLevels.INFO);
  } else {
    log(`\nSome ${testMode ? 'tests' : 'migrations'} failed. Check the logs above for details.`, logLevels.INFO);
  }
  
  log('\nUsage Instructions:', logLevels.INFO);
  log('1. Check the migrated files to ensure imports are correct', logLevels.INFO);
  log('2. Update any remaining story files manually if needed', logLevels.INFO);
  log('3. Run Storybook to verify all stories work correctly', logLevels.INFO);
}

// Display help text if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Storybook Migration Script

Usage:
  node scripts/migrate-stories.js [options] [file-pattern]

Options:
  --dry-run          Show what would be migrated without making changes
  --apply-template   Apply the standard template to migrated stories
  --test             Test mode: Analyze stories without moving files
  --verbose          Show detailed debug information
  --help, -h         Show this help text

Examples:
  # Migrate all story files
  node scripts/migrate-stories.js

  # Migrate only Button stories
  node scripts/migrate-stories.js Button

  # Preview changes without applying them
  node scripts/migrate-stories.js --dry-run

  # Test migration for a specific component
  node scripts/migrate-stories.js Button --test --verbose

  # Apply template to all migrated stories
  node scripts/migrate-stories.js --apply-template
  `);
  process.exit(0);
}

// Run the migration
runMigration(); 