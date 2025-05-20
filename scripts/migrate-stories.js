#!/usr/bin/env node

/**
 * Storybook Migration Script
 * 
 * This script moves story files from their current locations to follow
 * the component-adjacent stories pattern.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Migration mappings from inventory
const MIGRATIONS = [
  {
    source: 'src/components/Button/Button.stories.tsx',
    target: 'src/features/shared/Button/stories/Button.stories.tsx',
    updateImports: true,
    deleteOriginal: true
  },
  {
    source: 'src/features/shared/Button/__stories__/Button.stories.tsx',
    target: 'src/features/shared/Button/stories/Button.stories.tsx',
    updateImports: true,
    deleteOriginal: true
  },
  {
    source: 'src/features/Homepage/Journey/components/stories/JourneyStep.stories.tsx',
    target: 'src/features/Homepage/Journey/components/JourneyStep/stories/JourneyStep.stories.tsx',
    updateImports: true,
    deleteOriginal: true
  }
  // Add more migrations as needed
];

/**
 * Creates directories recursively if they don't exist
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Updates imports in the file based on its new location
 */
function updateImportPaths(filePath, originalPath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Get the relative path difference and update imports
  const originalDir = path.dirname(originalPath);
  const newDir = path.dirname(filePath);
  
  // Check for potential import updates
  // This is a simplified version - in a real script, you'd need more robust import detection
  if (originalPath.includes('__stories__')) {
    // Update relative parent path imports (e.g., '../components/Button' -> '../../components/Button')
    content = content.replace(
      /from ['"]\.\.\/(.+)['"]/g, 
      (match, p1) => `from '../../${p1}'`
    );
    
    // Update other imports as needed
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated imports in: ${filePath}`);
}

/**
 * Migrates a story file from source to target
 */
function migrateStoryFile(migration) {
  const { source, target, updateImports, deleteOriginal } = migration;
  
  if (!fs.existsSync(source)) {
    console.error(`Source file does not exist: ${source}`);
    return false;
  }
  
  // Create target directory if it doesn't exist
  const targetDir = path.dirname(target);
  ensureDirectoryExists(targetDir);
  
  // Copy the file
  fs.copyFileSync(source, target);
  console.log(`Copied: ${source} -> ${target}`);
  
  // Update imports if needed
  if (updateImports) {
    updateImportPaths(target, source);
  }
  
  // Delete original file if specified
  if (deleteOriginal) {
    fs.unlinkSync(source);
    console.log(`Deleted original file: ${source}`);
  }
  
  return true;
}

/**
 * Main function to run the migration
 */
function runMigration() {
  console.log('Starting Storybook files migration...');
  
  let successCount = 0;
  let failCount = 0;
  
  MIGRATIONS.forEach(migration => {
    try {
      const success = migrateStoryFile(migration);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.error(`Error migrating ${migration.source}:`, error);
      failCount++;
    }
  });
  
  console.log('\nMigration Summary:');
  console.log(`- Successfully migrated: ${successCount} files`);
  console.log(`- Failed to migrate: ${failCount} files`);
  
  if (failCount === 0) {
    console.log('\nAll migrations completed successfully!');
  } else {
    console.log('\nSome migrations failed. Check the logs above for details.');
  }
}

// Run the migration
runMigration(); 