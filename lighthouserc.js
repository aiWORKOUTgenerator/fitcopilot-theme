// lighthouserc.js
module.exports = {
    ci: {
        collect: {
            // The URL(s) to run against
            url: ["http://localhost:8080"],
            // How to spin up your built app
            startServerCommand: "npx serve -s dist --port=8080",
            // Run each page 3 times for averaged metrics
            numberOfRuns: 3,
            // Optional: increase timeout if your build is large
            settings: {
                maxWaitForLoad: 45000
            }
        },
        assert: {
            // Fail the job if these metrics don't meet thresholds
            assertions: {
                // require high FCP score
                "first-contentful-paint": ["error", { minScore: 0.90 }],
                // warn if LCP slower than 2.5 s
                "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
                // Additional performance metrics
                "interactive": ["warn", { minScore: 0.80 }],
                "speed-index": ["warn", { minScore: 0.80 }],
                "total-blocking-time": ["warn", { maxNumericValue: 300 }]
            }
        },
        upload: {
            // we won't actually push to a server here
            target: "temporary-public-storage"
        }
    }
}; 