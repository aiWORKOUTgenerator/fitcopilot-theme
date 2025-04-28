/**
 * E2E test script to verify React bootstrap and mounting
 * 
 * This script uses Puppeteer to check if:
 * 1. The React bootstrap log message appears in the console
 * 2. The mount point is populated with content
 * 
 * Prerequisites:
 * - Install Puppeteer: npm install puppeteer --save-dev
 */

const puppeteer = require('puppeteer');

// URL to test (change as needed)
const TEST_URL = process.env.TEST_URL || 'http://localhost:10003';
// How long to wait for mount point to be populated (ms)
const TIMEOUT = 10000;

(async () => {
    console.log(`🧪 Running mount point E2E test on ${TEST_URL}`);

    const browser = await puppeteer.launch({
        headless: "new", // Use new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // For CI environments
    });

    const page = await browser.newPage();

    // Collect console messages
    const logs = [];
    page.on('console', msg => {
        const text = msg.text();
        logs.push(`${msg.type()}: ${text}`);
        // Immediately log important messages for debugging
        if (text.includes('bootstrap') || text.includes('mount')) {
            console.log(`Browser console: ${text}`);
        }
    });

    try {
        // Go to page and wait for network to be idle
        await page.goto(TEST_URL, { waitUntil: 'networkidle2' });
        console.log('✅ Page loaded successfully');

        // Wait for mount point to be populated
        console.log(`🔍 Waiting for #athlete-dashboard-root to be populated...`);
        await page.waitForSelector('#athlete-dashboard-root > *', {
            timeout: TIMEOUT,
            visible: true
        });
        console.log('✅ Mount point has been populated with content');

        // Check for bootstrap message in console logs
        if (!logs.some(l => l.includes('🚀 React bootstrap'))) {
            throw new Error('❌ Bootstrap log message not found in console');
        }
        console.log('✅ Bootstrap log message found in console');

        // Check for successful mount message
        if (!logs.some(l => l.includes('App successfully mounted'))) {
            throw new Error('❌ Successful mount message not found in console');
        }
        console.log('✅ Successful mount confirmation found in console');

        // Take a screenshot for verification
        await page.screenshot({ path: 'e2e-mount-test.png' });
        console.log('📸 Screenshot saved to e2e-mount-test.png');

        console.log('✅ E2E mount test PASSED');
    } catch (error) {
        console.error('❌ E2E mount test FAILED:', error.message);

        // Log all console messages for debugging
        console.log('\nAll browser console logs:');
        logs.forEach(log => console.log(`  ${log}`));

        // Take failure screenshot
        await page.screenshot({ path: 'e2e-mount-test-failed.png' });
        console.log('📸 Failure screenshot saved to e2e-mount-test-failed.png');

        // Exit with error
        process.exit(1);
    } finally {
        await browser.close();
    }
})(); 