/**
 * Image Optimization Script
 * 
 * This script generates:
 * 1. Responsive image sets at multiple resolutions
 * 2. Modern image formats (WebP and AVIF)
 * 3. Low-Quality Image Placeholders (LQIP)
 * 
 * Usage:
 * - npm run optimize:images - Process all images
 * - npm run optimize:images -- --watch - Watch for new images
 * - npm run optimize:images -- --clean - Remove generated images
 * - npm run optimize:images -- --src=path/to/image.jpg - Process specific image or directory
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');
const chalk = require('chalk');

// Configuration
const config = {
    // Source image directories to process
    sourceDirs: [
        'src/assets/images',
        'assets/images',
        'public/wp-content/themes/fitcopilot/assets/images'
    ],

    // Output directories (will mirror source structure)
    outputDirs: {
        responsive: 'dist/images/responsive',
        webp: 'dist/images/webp',
        avif: 'dist/images/avif',
        lqip: 'dist/images/lqip',
    },

    // Responsive image sizes to generate (widths in pixels)
    sizes: [320, 640, 768, 1024, 1366, 1920],

    // LQIP settings
    lqip: {
        width: 20, // Very small for placeholder
        quality: 20
    },

    // File types to process
    fileTypes: ['.jpg', '.jpeg', '.png', '.webp'],
};

// Helper function for filesystem operations
const fs_helper = {
    ensureDir: (dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    },

    cleanDir: (dir) => {
        if (fs.existsSync(dir)) {
            fs.rmdirSync(dir, { recursive: true });
        }
    }
};

// Process command line arguments
const args = process.argv.slice(2);
const isWatchMode = args.includes('--watch');
const isCleanMode = args.includes('--clean');
const sourcePath = args.find(arg => arg.startsWith('--src='))?.split('=')[1];

// Clean generated images if requested
if (isCleanMode) {
    console.log(chalk.yellow('🧹 Cleaning generated images...'));
    Object.values(config.outputDirs).forEach(dir => {
        fs_helper.cleanDir(dir);
        console.log(`  Cleaned ${dir}`);
    });
    console.log(chalk.green('✅ Cleanup complete'));
    process.exit(0);
}

// Helper to get all image files
const getImageFiles = () => {
    // If a specific source path is provided
    if (sourcePath) {
        // Check if it's a directory or file
        if (fs.existsSync(sourcePath)) {
            const stats = fs.statSync(sourcePath);
            if (stats.isDirectory()) {
                return glob.sync(`${sourcePath}/**/*+(${config.fileTypes.join('|')})`, { nocase: true });
            } else if (stats.isFile() && config.fileTypes.includes(path.extname(sourcePath).toLowerCase())) {
                return [sourcePath];
            }
        }
        console.log(chalk.yellow(`Warning: Source path ${sourcePath} is not a valid image file or directory`));
        return [];
    }

    // Otherwise get all images from configured directories
    let allFiles = [];
    config.sourceDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            const files = glob.sync(`${dir}/**/*+(${config.fileTypes.join('|')})`, { nocase: true });
            allFiles = [...allFiles, ...files];
        }
    });
    return allFiles;
};

// Create responsive versions of an image
const createResponsiveImages = async (imagePath) => {
    try {
        const filename = path.basename(imagePath);
        const fileExt = path.extname(imagePath).toLowerCase();
        const baseName = path.basename(filename, fileExt);
        const relativePath = path.dirname(imagePath).replace(/^(src\/|assets\/|public\/wp-content\/themes\/fitcopilot\/)/, '');

        // Create output directories
        const responsiveDir = path.join(config.outputDirs.responsive, relativePath);
        const webpDir = path.join(config.outputDirs.webp, relativePath);
        const avifDir = path.join(config.outputDirs.avif, relativePath);
        const lqipDir = path.join(config.outputDirs.lqip, relativePath);

        fs_helper.ensureDir(responsiveDir);
        fs_helper.ensureDir(webpDir);
        fs_helper.ensureDir(avifDir);
        fs_helper.ensureDir(lqipDir);

        // Load image with sharp
        const image = sharp(imagePath);
        const metadata = await image.metadata();

        // Skip SVG files
        if (metadata.format === 'svg') {
            console.log(chalk.blue(`Skipping SVG: ${imagePath}`));
            return;
        }

        // Process responsive sizes
        const createSizesPromises = config.sizes
            .filter(size => size <= metadata.width) // Only create sizes smaller than original
            .map(size => {
                const resizedImage = image.clone().resize(size);

                // Original format at this size
                const outputOriginal = path.join(responsiveDir, `${baseName}-${size}${fileExt}`);

                // WebP version
                const outputWebP = path.join(webpDir, `${baseName}-${size}.webp`);

                // AVIF version
                const outputAVIF = path.join(avifDir, `${baseName}-${size}.avif`);

                return Promise.all([
                    resizedImage.toFile(outputOriginal),
                    resizedImage.webp({ quality: 80 }).toFile(outputWebP),
                    resizedImage.avif({ quality: 65 }).toFile(outputAVIF)
                ]);
            });

        // Create LQIP (Low Quality Image Placeholder)
        const lqipPath = path.join(lqipDir, `${baseName}.jpg`);
        const createLQIP = image
            .clone()
            .resize(config.lqip.width)
            .jpeg({ quality: config.lqip.quality })
            .toFile(lqipPath);

        // Wait for all operations to complete
        await Promise.all([...createSizesPromises, createLQIP]);

        console.log(chalk.green(`✅ Processed: ${imagePath}`));

        // Generate the HTML markup for this image (helpful output)
        generateImageMarkup(imagePath, baseName, fileExt, metadata.width, relativePath);

        return true;
    } catch (error) {
        console.error(chalk.red(`❌ Error processing ${imagePath}:`), error);
        return false;
    }
};

// Generate example responsive image markup
const generateImageMarkup = (imagePath, baseName, fileExt, originalWidth, relativePath) => {
    // Only show for a few images to avoid console spam
    if (Math.random() > 0.1) return;

    const sizes = config.sizes.filter(size => size <= originalWidth);

    // Example srcset
    let srcsetWebP = sizes.map(size =>
        `/wp-content/themes/fitcopilot/dist/images/webp/${relativePath}/${baseName}-${size}.webp ${size}w`
    ).join(', ');

    let srcsetOriginal = sizes.map(size =>
        `/wp-content/themes/fitcopilot/dist/images/responsive/${relativePath}/${baseName}-${size}${fileExt} ${size}w`
    ).join(', ');

    console.log(chalk.blue('\nResponsive Image Markup Example:'));
    console.log(`<picture>
  <source 
    srcset="${srcsetWebP}" 
    sizes="(max-width: 768px) 100vw, 50vw"
    type="image/webp" 
  />
  <img
    src="/wp-content/themes/fitcopilot/dist/images/responsive/${relativePath}/${baseName}-640${fileExt}"
    srcset="${srcsetOriginal}"
    sizes="(max-width: 768px) 100vw, 50vw"
    width="${originalWidth}"
    height="auto"
    alt="Description of image"
    loading="lazy"
  />
</picture>
  
<!-- With LQIP (blur-up technique) -->
<style>
  .blur-load {
    background-size: cover;
    background-position: center;
    position: relative;
  }
  .blur-load img {
    opacity: 0;
    transition: opacity 250ms ease-in-out;
  }
  .blur-load.loaded img {
    opacity: 1;
  }
</style>

<div 
  class="blur-load"
  style="background-image: url('/wp-content/themes/fitcopilot/dist/images/lqip/${relativePath}/${baseName}.jpg')">
  <picture>
    <!-- Same picture element as above -->
  </picture>
</div>

<script>
// Add this to your main JS
const blurImgs = document.querySelectorAll('.blur-load');
blurImgs.forEach(div => {
  const img = div.querySelector('img');
  function loaded() {
    div.classList.add('loaded');
  }
  if (img.complete) {
    loaded();
  } else {
    img.addEventListener('load', loaded);
  }
});
</script>`);
};

// Process all images
const processAllImages = async () => {
    const images = getImageFiles();

    if (images.length === 0) {
        console.log(chalk.yellow('No images found to process'));
        return;
    }

    console.log(chalk.blue(`🖼️ Processing ${images.length} images...`));

    // Ensure output directories exist
    Object.values(config.outputDirs).forEach(dir => {
        fs_helper.ensureDir(dir);
    });

    // Process images with concurrency limit
    const concurrencyLimit = 4;
    const results = [];

    for (let i = 0; i < images.length; i += concurrencyLimit) {
        const batch = images.slice(i, i + concurrencyLimit);
        const batchResults = await Promise.all(batch.map(img => createResponsiveImages(img)));
        results.push(...batchResults);

        // Simple progress indicator
        console.log(chalk.blue(`Progress: ${i + batch.length}/${images.length} images (${Math.round((i + batch.length) / images.length * 100)}%)`));
    }

    const successCount = results.filter(Boolean).length;
    console.log(chalk.green(`\n✅ Done! Successfully processed ${successCount} of ${images.length} images`));

    if (successCount < images.length) {
        console.log(chalk.yellow(`⚠️ Failed to process ${images.length - successCount} images`));
    }
};

// Watch mode function
const startWatchMode = () => {
    console.log(chalk.blue('👀 Watching for image changes...'));

    // Process all images immediately
    processAllImages();

    // Set up watchers for each source directory
    config.sourceDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            fs.watch(dir, { recursive: true }, async (eventType, filename) => {
                if (!filename) return;

                // Only process supported file types
                const ext = path.extname(filename).toLowerCase();
                if (!config.fileTypes.includes(ext)) return;

                const fullPath = path.join(dir, filename);

                // Need a slight delay as file might still be copying
                setTimeout(async () => {
                    if (fs.existsSync(fullPath)) {
                        console.log(chalk.blue(`🔄 File changed: ${fullPath}`));
                        await createResponsiveImages(fullPath);
                    }
                }, 500);
            });
            console.log(chalk.blue(`  Watching ${dir}`));
        }
    });
};

// Main execution
if (isWatchMode) {
    startWatchMode();
} else {
    processAllImages().then(() => {
        process.exit(0);
    }).catch(err => {
        console.error(chalk.red('Error processing images:'), err);
        process.exit(1);
    });
} 