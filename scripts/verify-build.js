const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const DIST_DIR = path.resolve(__dirname, '../dist');
const CHUNKS_DIR = path.resolve(DIST_DIR, 'chunks');

// Expected chunks based on webpack config
const EXPECTED_CHUNKS = {
  root: [
    'critical',
    'homepage',
    'debug',
    'framework',
    'vendors',
    'utils'
  ],
  chunks: [
    'feature-registration',
    'feature-homepage',
    'lucide-icons'
  ]
};

// Expected CSS files
const EXPECTED_CSS = {
  root: [
    'critical',
    'homepage'
  ],
  chunks: [
    'feature-common'
  ]
};

function verifyDirectoryStructure() {
  console.log(chalk.blue('🔍 Verifying directory structure...'));

  if (!fs.existsSync(DIST_DIR)) {
    console.error(chalk.red('❌ dist directory not found'));
    process.exit(1);
  }

  if (!fs.existsSync(CHUNKS_DIR)) {
    console.error(chalk.red('❌ chunks directory not found'));
    process.exit(1);
  }

  console.log(chalk.green('✅ Directory structure verified'));
}

function verifyChunks() {
  console.log(chalk.blue('🔍 Verifying chunks...'));

  const distFiles = fs.readdirSync(DIST_DIR);
  const chunkFiles = fs.readdirSync(CHUNKS_DIR);

  // Verify JS chunks
  const distJsChunks = distFiles.filter(file => file.endsWith('.js'));
  const chunkJsChunks = chunkFiles.filter(file => file.endsWith('.js'));

  // Check root chunks
  const missingRootChunks = EXPECTED_CHUNKS.root.filter(chunk =>
    !distJsChunks.some(file => file.startsWith(chunk + '.'))
  );

  if (missingRootChunks.length > 0) {
    console.error(chalk.red('❌ Missing required JS chunks in dist/:'), missingRootChunks);
    process.exit(1);
  }

  // Check chunks directory
  const missingChunks = EXPECTED_CHUNKS.chunks.filter(chunk =>
    !chunkJsChunks.some(file => file.startsWith(chunk + '.'))
  );

  if (missingChunks.length > 0) {
    console.error(chalk.red('❌ Missing required JS chunks in dist/chunks/:'), missingChunks);
    process.exit(1);
  }

  // Verify CSS chunks
  const distCssChunks = distFiles.filter(file => file.endsWith('.css'));
  const chunkCssChunks = chunkFiles.filter(file => file.endsWith('.css'));

  // Check root CSS
  const missingRootCss = EXPECTED_CSS.root.filter(chunk =>
    !distCssChunks.some(file => file.startsWith(chunk + '.'))
  );

  if (missingRootCss.length > 0) {
    console.error(chalk.red('❌ Missing required CSS chunks in dist/:'), missingRootCss);
    process.exit(1);
  }

  // Check chunks CSS
  const missingChunksCss = EXPECTED_CSS.chunks.filter(chunk =>
    !chunkCssChunks.some(file => file.startsWith(chunk + '.'))
  );

  if (missingChunksCss.length > 0) {
    console.error(chalk.red('❌ Missing required CSS chunks in dist/chunks/:'), missingChunksCss);
    process.exit(1);
  }

  console.log(chalk.green('✅ Chunks verified'));
}

function verifyChunkSizes() {
  console.log(chalk.blue('🔍 Verifying chunk sizes...'));

  const chunkFiles = fs.readdirSync(CHUNKS_DIR);
  const jsChunks = chunkFiles.filter(file => file.endsWith('.js'));

  const chunkSizes = jsChunks.map(file => {
    const stats = fs.statSync(path.join(CHUNKS_DIR, file));
    return {
      name: file,
      size: stats.size
    };
  });

  // Check for unusually large chunks (> 500KB)
  const largeChunks = chunkSizes.filter(chunk => chunk.size > 500 * 1024);
  if (largeChunks.length > 0) {
    console.warn(chalk.yellow('⚠️ Large chunks detected:'));
    largeChunks.forEach(chunk => {
      console.warn(chalk.yellow(`   - ${chunk.name}: ${(chunk.size / 1024).toFixed(2)}KB`));
    });
  }

  console.log(chalk.green('✅ Chunk sizes verified'));
}

function verifyManifest() {
  console.log(chalk.blue('🔍 Verifying manifest.json...'));

  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(chalk.red('❌ manifest.json not found'));
    process.exit(1);
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Create expected entries with extensions
    const requiredEntries = [
      ...EXPECTED_CHUNKS.root.map(entry => `${entry}.js`),
      ...EXPECTED_CHUNKS.chunks.map(entry => `${entry}.js`),
      ...EXPECTED_CSS.root.map(entry => `${entry}.css`),
      ...EXPECTED_CSS.chunks.map(entry => `${entry}.css`)
    ];

    const missingEntries = requiredEntries.filter(entry => !manifest[entry]);
    if (missingEntries.length > 0) {
      console.error(chalk.red('❌ Missing entries in manifest:'), missingEntries);
      process.exit(1);
    }

    // Verify that all manifest entries point to existing files
    for (const [key, value] of Object.entries(manifest)) {
      const filePath = path.join(DIST_DIR, value);
      if (!fs.existsSync(filePath)) {
        console.error(chalk.red(`❌ Manifest entry "${key}" points to non-existent file: ${value}`));
        process.exit(1);
      }
    }

    console.log(chalk.green('✅ Manifest verified'));
  } catch (error) {
    console.error(chalk.red('❌ Error reading manifest:'), error);
    process.exit(1);
  }
}

function verifyBuild() {
  console.log(chalk.blue('\n🚀 Starting build verification...\n'));

  try {
    verifyDirectoryStructure();
    verifyChunks();
    verifyChunkSizes();
    verifyManifest();

    console.log(chalk.green('\n✅ Build verification completed successfully!\n'));
  } catch (error) {
    console.error(chalk.red('\n❌ Build verification failed:'), error);
    process.exit(1);
  }
}

// Run verification
verifyBuild(); 
verifyChunks(); 