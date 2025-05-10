#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script processes images in the src/assets directory and creates optimized
 * versions with multiple formats (webp, avif) and sizes for responsive loading.
 * 
 * Usage:
 *   node scripts/optimize-images.js
 * 
 * Options:
 *   --watch   Watch for file changes
 *   --clean   Remove all generated files first
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const childProcess = require('child_process');
const glob = promisify(require('glob'));

// Check if sharp is installed
try {
    require.resolve('sharp');
} catch (e) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: The "sharp" package is required for image optimization.');
    console.log('Please install it using: npm install --save-dev sharp');
    process.exit(1);
}

// Dynamically import sharp to avoid issues if not installed
const sharp = require('sharp');

// Configuration
const config = {
    sourceDir: 'src/assets/images',
    outputDir: 'public/images',
    sizes: [320, 640, 960, 1280, 1920],
    formats: ['webp', 'avif'],
    quality: {
        jpeg: 80,
        webp: 75,
        avif: 65,
    },
    lqipSize: 20, // Size of LQIP preview in pixels
    includeOriginal: true,
    concurrency: 4,
};

// Helper to ensure directory exists
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Helper for generating file size in human-readable format
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get original image dimensions
async function getImageDimensions(filePath) {
    try {
        const metadata = await sharp(filePath).metadata();
        return {
            width: metadata.width,
            height: metadata.height,
        };
    } catch (error) {
        console.error(`Error getting dimensions for ${filePath}:`, error);
        return { width: 0, height: 0 };
    }
}

// Generate a low quality image placeholder (LQIP)
async function generateLQIP(filePath, targetPath) {
    try {
        // Create a tiny version of the image
        await sharp(filePath)
            .resize(config.lqipSize)
            .blur(5)
            .toFile(targetPath);

        // Read it back and convert to base64
        const data = fs.readFileSync(targetPath);
        const base64 = Buffer.from(data).toString('base64');

        // Get the mime type from the original file extension
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

        // Create data URI
        const dataURI = `data:${mimeType};base64,${base64}`;

        // Remove the temporary file
        fs.unlinkSync(targetPath);

        return dataURI;
    } catch (error) {
        console.error(`Error generating LQIP for ${filePath}:`, error);
        return '';
    }
}

// Process a single image file
async function processImage(filePath) {
    const startTime = Date.now();
    const fileName = path.basename(filePath, path.extname(filePath));
    const outputBase = path.join(config.outputDir, fileName);
    const originalOutputPath = `${outputBase}${path.extname(filePath)}`;

    // Ensure output directory exists
    ensureDir(path.dirname(outputBase));

    console.log(`\nProcessing: ${filePath}`);

    // Get original file size for comparison
    const originalSize = fs.statSync(filePath).size;
    const { width: originalWidth, height: originalHeight } = await getImageDimensions(filePath);

    // Generate LQIP
    const lqipPath = `${outputBase}-lqip${path.extname(filePath)}`;
    const lqipDataURI = await generateLQIP(filePath, lqipPath);

    // Copy original
    let totalSaved = 0;
    const results = [];

    if (config.includeOriginal) {
        fs.copyFileSync(filePath, originalOutputPath);
        results.push({
            file: path.basename(originalOutputPath),
            size: formatBytes(originalSize),
            width: originalWidth,
            height: originalHeight,
            saved: '0%',
        });
    }

    // Generate responsive sizes and formats
    const tasks = [];

    for (const size of config.sizes) {
        if (size > originalWidth) continue; // Skip sizes larger than original

        // Resize original format
        const resizedPath = `${outputBase}-${size}${path.extname(filePath)}`;
        tasks.push(
            sharp(filePath)
                .resize(size)
                .jpeg({ quality: config.quality.jpeg })
                .png({ quality: config.quality.jpeg })
                .toFile(resizedPath)
                .then(info => {
                    const savedBytes = originalSize - info.size;
                    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);
                    totalSaved += savedBytes;

                    results.push({
                        file: path.basename(resizedPath),
                        size: formatBytes(info.size),
                        width: info.width,
                        height: info.height,
                        saved: `${savedPercent}%`,
                    });
                })
        );

        // Generate each alternative format
        for (const format of config.formats) {
            const formatPath = `${outputBase}-${size}.${format}`;
            tasks.push(
                sharp(filePath)
                    .resize(size)
                [format]({ quality: config.quality[format] })
                    .toFile(formatPath)
                    .then(info => {
                        const savedBytes = originalSize - info.size;
                        const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);
                        totalSaved += savedBytes;

                        results.push({
                            file: path.basename(formatPath),
                            size: formatBytes(info.size),
                            width: info.width,
                            height: info.height,
                            saved: `${savedPercent}%`,
                        });
                    })
            );
        }
    }

    // Wait for all tasks to complete
    await Promise.all(tasks);

    // Sort results by width for better display
    results.sort((a, b) => a.width - b.width);

    // Generate manifest file
    const manifest = {
        original: path.basename(filePath),
        lqip: lqipDataURI,
        width: originalWidth,
        height: originalHeight,
        variants: results.map(r => ({
            file: r.file,
            width: r.width,
            height: r.height,
            format: path.extname(r.file).substring(1),
        })),
    };

    // Write manifest file
    fs.writeFileSync(
        `${outputBase}.json`,
        JSON.stringify(manifest, null, 2)
    );

    // Display results
    console.log(`\n✅ Generated ${results.length} variants for ${fileName}`);
    console.log(`   Original: ${formatBytes(originalSize)} (${originalWidth}x${originalHeight})`);
    console.log(`   Total space saved: ${formatBytes(totalSaved)}`);
    console.log(`   Took ${((Date.now() - startTime) / 1000).toFixed(2)}s`);

    // Return manifest for further processing
    return manifest;
}

// Process all images
async function processAllImages() {
    try {
        // Ensure output directory exists
        ensureDir(config.outputDir);

        // Get list of images to process
        const imageFiles = await glob(`${config.sourceDir}/**/*.{jpg,jpeg,png}`);

        if (imageFiles.length === 0) {
            console.log('No image files found to process.');
            return;
        }

        console.log(`Found ${imageFiles.length} images to process.`);

        // Process images
        const startTime = Date.now();
        const manifests = {};

        // Process in batches to avoid memory issues
        const batchSize = config.concurrency;
        for (let i = 0; i < imageFiles.length; i += batchSize) {
            const batch = imageFiles.slice(i, i + batchSize);
            const results = await Promise.all(batch.map(processImage));

            // Add to manifests
            results.forEach((manifest, idx) => {
                if (manifest) {
                    const fileName = path.basename(batch[idx], path.extname(batch[idx]));
                    manifests[fileName] = manifest;
                }
            });

            console.log(`\nProcessed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(imageFiles.length / batchSize)}`);
        }

        // Write global manifest
        fs.writeFileSync(
            path.join(config.outputDir, 'manifest.json'),
            JSON.stringify(manifests, null, 2)
        );

        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`\n🎉 All images processed in ${totalTime}s`);
        console.log(`   Global manifest saved to ${path.join(config.outputDir, 'manifest.json')}`);

    } catch (error) {
        console.error('Error processing images:', error);
    }
}

// Clean output directory
function cleanOutputDir() {
    if (fs.existsSync(config.outputDir)) {
        console.log(`Cleaning output directory: ${config.outputDir}`);
        fs.rmSync(config.outputDir, { recursive: true, force: true });
    }
    ensureDir(config.outputDir);
}

// Parse command line arguments
const args = process.argv.slice(2);
const shouldWatch = args.includes('--watch');
const shouldClean = args.includes('--clean');

// Main execution
async function main() {
    if (shouldClean) {
        cleanOutputDir();
    }

    await processAllImages();

    if (shouldWatch) {
        console.log('\n👀 Watching for changes...');

        fs.watch(config.sourceDir, { recursive: true }, (eventType, filename) => {
            if (!filename || !filename.match(/\.(jpg|jpeg|png)$/i)) return;

            console.log(`\nDetected ${eventType} event for ${filename}`);
            const filePath = path.join(config.sourceDir, filename);

            if (fs.existsSync(filePath)) {
                processImage(filePath).catch(err => {
                    console.error(`Error processing ${filename}:`, err);
                });
            }
        });
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1); 