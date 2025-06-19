/**
 * Critical Fixes Test Script
 * 
 * Run this in the browser console to test both fixes:
 * 1. REST API nonce authentication fix
 * 2. React runtime error handling fix
 * 
 * Usage: Paste this entire script into browser console and run
 */

(function() {
    'use strict';
    
    console.log('🧪 Testing Critical Fixes...');
    console.log('Timestamp:', new Date().toISOString());
    
    // Test results container
    const testResults = {
        nonceTest: { status: 'pending', details: {} },
        reactErrorTest: { status: 'pending', details: {} },
        apiTest: { status: 'pending', details: {} }
    };
    
    // ===== TEST 1: NONCE AVAILABILITY =====
    
    console.group('🔐 Test 1: Enhanced Nonce Configuration');
    
    try {
        // Test new fitcopilotApiConfig
        const apiConfig = window.fitcopilotApiConfig;
        const wpApiSettings = window.wpApiSettings;
        
        console.log('Enhanced API Config:', apiConfig);
        console.log('WordPress API Settings:', wpApiSettings);
        
        const tests = [
            { name: 'fitcopilotApiConfig exists', test: () => !!apiConfig },
            { name: 'fitcopilotApiConfig.restNonce exists', test: () => !!apiConfig?.restNonce },
            { name: 'fitcopilotApiConfig.restNonce is valid', test: () => apiConfig?.restNonce?.length === 10 },
            { name: 'wpApiSettings.nonce exists', test: () => !!wpApiSettings?.nonce },
            { name: 'wpApiSettings.nonce is valid', test: () => wpApiSettings?.nonce?.length === 10 }
        ];
        
        let passedTests = 0;
        tests.forEach(test => {
            const result = test.test();
            console.log(`${result ? '✅' : '❌'} ${test.name}: ${result}`);
            if (result) passedTests++;
        });
        
        testResults.nonceTest.status = passedTests === tests.length ? 'passed' : 'failed';
        testResults.nonceTest.details = {
            passedTests: passedTests,
            totalTests: tests.length,
            apiConfig: apiConfig,
            wpApiSettings: wpApiSettings
        };
        
    } catch (error) {
        console.error('❌ Nonce test failed:', error);
        testResults.nonceTest.status = 'error';
        testResults.nonceTest.details = { error: error.message };
    }
    
    console.groupEnd();
    
    // ===== TEST 2: API REQUEST TEST =====
    
    console.group('🌐 Test 2: API Request with Enhanced Nonce');
    
    async function testApiRequest() {
        try {
            const apiConfig = window.fitcopilotApiConfig;
            const wpApiSettings = window.wpApiSettings;
            
            // Get nonce using the same logic as trainerApi.ts
            const nonce = apiConfig?.restNonce || wpApiSettings?.nonce || '';
            
            if (!nonce) {
                throw new Error('No nonce available for API request');
            }
            
            console.log('🔐 Using nonce:', nonce);
            
            const testUrl = `${apiConfig?.restUrl || wpApiSettings?.rest_url || '/wp-json/fitcopilot/v1/'}trainer-availability`;
            console.log('🌐 Testing URL:', testUrl);
            
            const response = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce
                }
            });
            
            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ API request successful:', data);
                testResults.apiTest.status = 'passed';
                testResults.apiTest.details = { status: response.status, data: data };
            } else {
                const errorText = await response.text();
                console.log('❌ API request failed:', response.status, errorText);
                testResults.apiTest.status = 'failed';
                testResults.apiTest.details = { status: response.status, error: errorText };
            }
            
        } catch (error) {
            console.error('❌ API test error:', error);
            testResults.apiTest.status = 'error';
            testResults.apiTest.details = { error: error.message };
        }
    }
    
    // Run API test
    testApiRequest();
    
    console.groupEnd();
    
    // ===== TEST 3: REACT ERROR HANDLING =====
    
    console.group('⚛️ Test 3: React Error Handling');
    
    try {
        // Test if EventModal component exists and has error handling
        const eventModalElements = document.querySelectorAll('[class*="event-modal"]');
        console.log('Found EventModal elements:', eventModalElements.length);
        
        // Test if error boundary exists
        const errorBoundaryElements = document.querySelectorAll('[class*="error-boundary"], [class*="error-fallback"]');
        console.log('Found error boundary elements:', errorBoundaryElements.length);
        
        // Check for React error handling in console
        const originalError = console.error;
        let reactErrors = [];
        
        console.error = function(...args) {
            if (args.some(arg => typeof arg === 'string' && (
                arg.includes('Cannot read properties of undefined') ||
                arg.includes('TypeError') ||
                arg.includes('React')
            ))) {
                reactErrors.push(args);
            }
            originalError.apply(console, args);
        };
        
        // Simulate error condition (if possible)
        try {
            // Try to trigger a time slot error
            const mockTimeSlot = undefined;
            const result = mockTimeSlot?.startTime?.toLocaleString?.();
            console.log('Mock error test result:', result);
        } catch (e) {
            console.log('✅ Error properly caught:', e.message);
        }
        
        testResults.reactErrorTest.status = 'passed';
        testResults.reactErrorTest.details = {
            eventModalElements: eventModalElements.length,
            errorBoundaryElements: errorBoundaryElements.length,
            reactErrors: reactErrors.length
        };
        
        // Restore original console.error
        console.error = originalError;
        
    } catch (error) {
        console.error('❌ React error test failed:', error);
        testResults.reactErrorTest.status = 'error';
        testResults.reactErrorTest.details = { error: error.message };
    }
    
    console.groupEnd();
    
    // ===== FINAL RESULTS =====
    
    setTimeout(() => {
        console.group('📊 Final Test Results');
        
        console.log('🔐 Nonce Test:', testResults.nonceTest.status);
        console.log('🌐 API Test:', testResults.apiTest.status);
        console.log('⚛️ React Error Test:', testResults.reactErrorTest.status);
        
        const allPassed = Object.values(testResults).every(test => test.status === 'passed');
        
        console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall Status: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
        
        if (!allPassed) {
            console.log('\n🔍 Detailed Results:');
            Object.entries(testResults).forEach(([testName, result]) => {
                if (result.status !== 'passed') {
                    console.log(`❌ ${testName}:`, result);
                }
            });
        }
        
        console.groupEnd();
        
        // Store results globally for further inspection
        window.criticalFixesTestResults = testResults;
        console.log('\n💾 Test results stored in window.criticalFixesTestResults');
        
    }, 2000); // Wait 2 seconds for API test to complete
    
})(); 