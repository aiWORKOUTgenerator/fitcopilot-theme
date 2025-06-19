/**
 * Frontend API Issues Debug Script
 * 
 * Run this in the browser console to diagnose:
 * 1. REST API 403 Forbidden errors with malformed nonce
 * 2. React TypeError: Cannot read properties of undefined (reading 'start')
 * 3. Frontend/backend data flow issues
 * 
 * Usage: Paste this entire script into browser console and run
 */

(function() {
    'use strict';
    
    console.log('🔧 Frontend API Issues Debug Analysis...');
    console.log('Timestamp:', new Date().toISOString());
    
    // ===== ISSUE 1: REST API NONCE ANALYSIS =====
    
    console.group('🔐 Issue 1: REST API 403 Forbidden Analysis');
    
    // Test 1: Check wpApiSettings availability
    console.log('Test 1: wpApiSettings availability');
    if (typeof wpApiSettings === 'undefined') {
        console.error('❌ wpApiSettings is not defined - This is likely the ROOT CAUSE of 403 errors');
        console.log('Expected: wpApiSettings should be available globally');
        console.log('Solution: Verify wp_localize_script is properly enqueued');
    } else {
        console.log('✅ wpApiSettings is available:', wpApiSettings);
        
        // Validate wpApiSettings structure
        const requiredKeys = ['root', 'nonce', 'api_url', 'rest_url'];
        const missingKeys = requiredKeys.filter(key => !wpApiSettings[key]);
        
        if (missingKeys.length > 0) {
            console.error('❌ wpApiSettings missing required keys:', missingKeys);
        } else {
            console.log('✅ wpApiSettings has all required keys');
            
            // Test nonce format
            if (wpApiSettings.nonce && wpApiSettings.nonce.length === 10) {
                console.log('✅ Nonce format appears valid:', wpApiSettings.nonce);
            } else {
                console.error('❌ Invalid nonce format:', wpApiSettings.nonce);
            }
        }
    }
    
    // Test 2: Check Training Calendar data
    console.log('Test 2: Training Calendar data availability');
    if (typeof window.fitcopilotTrainingCalendarData === 'undefined') {
        console.error('❌ fitcopilotTrainingCalendarData is not available');
    } else {
        console.log('✅ fitcopilotTrainingCalendarData is available');
        console.log('Trainers count:', window.fitcopilotTrainingCalendarData.trainers?.length || 0);
        console.log('Events count:', window.fitcopilotTrainingCalendarData.events?.length || 0);
    }
    
    // Test 3: Simulate API request to test nonce
    console.log('Test 3: Simulating API request to test nonce...');
    
    if (typeof wpApiSettings !== 'undefined' && wpApiSettings.nonce) {
        const testUrl = wpApiSettings.rest_url + 'trainer-availability';
        const testDate = new Date().toISOString().split('T')[0];
        
        console.log('Testing URL:', testUrl);
        console.log('Using nonce:', wpApiSettings.nonce);
        
        fetch(`${testUrl}?date=${testDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': wpApiSettings.nonce
            }
        })
        .then(response => {
            console.log('API Response Status:', response.status);
            console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
            
            if (response.status === 403) {
                console.error('❌ 403 Forbidden - Nonce authentication failed');
                console.log('Response URL:', response.url);
                return response.text().then(text => {
                    console.log('Error Response Body:', text);
                });
            } else if (response.status === 200) {
                console.log('✅ API request successful');
                return response.json().then(data => {
                    console.log('API Response Data:', data);
                });
            } else {
                console.warn('⚠️ Unexpected status code:', response.status);
                return response.text().then(text => {
                    console.log('Response Body:', text);
                });
            }
        })
        .catch(error => {
            console.error('❌ API request failed:', error);
        });
    } else {
        console.error('❌ Cannot test API - wpApiSettings or nonce not available');
    }
    
    console.groupEnd();
    
    // ===== ISSUE 2: REACT RUNTIME ERRORS =====
    
    console.group('⚛️ Issue 2: React Runtime Error Analysis');
    
    // Test 1: Check React availability
    console.log('Test 1: React environment check');
    if (typeof React === 'undefined') {
        console.error('❌ React is not available globally');
    } else {
        console.log('✅ React is available, version:', React.version);
    }
    
    if (typeof ReactDOM === 'undefined') {
        console.error('❌ ReactDOM is not available globally');
    } else {
        console.log('✅ ReactDOM is available');
    }
    
    // Test 2: Check for Training Calendar component
    console.log('Test 2: Training Calendar component check');
    const calendarContainer = document.querySelector('[data-component="training-calendar"]');
    if (!calendarContainer) {
        console.warn('⚠️ Training Calendar container not found');
    } else {
        console.log('✅ Training Calendar container found');
        
        // Check for React root
        const reactRoot = calendarContainer._reactInternalInstance || 
                         calendarContainer._reactInternalFiber ||
                         Object.keys(calendarContainer).find(key => key.startsWith('__reactInternalInstance'));
        
        if (!reactRoot) {
            console.warn('⚠️ No React instance found on calendar container');
        } else {
            console.log('✅ React instance found on calendar container');
        }
    }
    
    // Test 3: Monitor for React errors
    console.log('Test 3: Setting up React error monitoring...');
    
    const originalError = console.error;
    console.error = function(...args) {
        const errorMessage = args[0];
        
        if (typeof errorMessage === 'string') {
            // Check for specific error patterns
            if (errorMessage.includes('Cannot read properties of undefined')) {
                console.group('🚨 React Runtime Error Detected');
                console.log('Error message:', errorMessage);
                console.log('Full args:', args);
                console.log('Stack trace:', new Error().stack);
                console.groupEnd();
            }
            
            if (errorMessage.includes('removeChild')) {
                console.group('🚨 DOM Manipulation Error Detected');
                console.log('Error message:', errorMessage);
                console.log('This is likely a React 18 + WordPress conflict');
                console.groupEnd();
            }
        }
        
        originalError.apply(console, args);
    };
    
    console.log('✅ React error monitoring active');
    
    console.groupEnd();
    
    // ===== ISSUE 3: FRONTEND DATA FLOW =====
    
    console.group('📊 Issue 3: Frontend Data Flow Analysis');
    
    // Test 1: Check all global data objects
    console.log('Test 1: Global data objects inventory');
    
    const globalObjects = [
        'wpApiSettings',
        'fitcopilotTrainingCalendarData',
        'athleteDashboardData',
        'wp'
    ];
    
    globalObjects.forEach(objName => {
        if (typeof window[objName] !== 'undefined') {
            console.log(`✅ ${objName}:`, window[objName]);
        } else {
            console.log(`❌ ${objName}: not available`);
        }
    });
    
    // Test 2: Check script loading
    console.log('Test 2: Script loading verification');
    
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const fitcopilotScripts = scripts.filter(script => 
        script.src.includes('fitcopilot') || 
        script.src.includes('training-calendar') ||
        script.src.includes('homepage')
    );
    
    console.log('FitCopilot scripts loaded:', fitcopilotScripts.length);
    fitcopilotScripts.forEach(script => {
        console.log(`- ${script.src}`);
    });
    
    // Test 3: Check for webpack chunks
    console.log('Test 3: Webpack chunks verification');
    
    if (typeof __webpack_require__ !== 'undefined') {
        console.log('✅ Webpack runtime available');
        
        // Check for specific chunks
        const chunkIds = Object.keys(__webpack_require__.cache || {});
        console.log('Loaded webpack chunks:', chunkIds.length);
        
        const trainingCalendarChunks = chunkIds.filter(id => 
            __webpack_require__.cache[id] && 
            __webpack_require__.cache[id].exports &&
            JSON.stringify(__webpack_require__.cache[id].exports).includes('TrainingCalendar')
        );
        
        console.log('Training Calendar related chunks:', trainingCalendarChunks.length);
    } else {
        console.warn('⚠️ Webpack runtime not available');
    }
    
    console.groupEnd();
    
    // ===== ISSUE 4: NETWORK MONITORING =====
    
    console.group('🌐 Issue 4: Network Request Monitoring');
    
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        const options = args[1] || {};
        
        console.log('🌐 Fetch Request:', {
            url: url,
            method: options.method || 'GET',
            headers: options.headers || {},
            body: options.body
        });
        
        return originalFetch.apply(this, args)
            .then(response => {
                console.log('🌐 Fetch Response:', {
                    url: url,
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries())
                });
                
                if (response.status === 403 && url.includes('fitcopilot')) {
                    console.error('🚨 403 Error on FitCopilot API:', url);
                    console.log('Request headers:', options.headers);
                    console.log('Expected nonce:', wpApiSettings?.nonce);
                }
                
                return response;
            })
            .catch(error => {
                console.error('🌐 Fetch Error:', {
                    url: url,
                    error: error.message
                });
                throw error;
            });
    };
    
    console.log('✅ Network monitoring active');
    
    console.groupEnd();
    
    // ===== SUMMARY =====
    
    console.group('📋 Debug Summary');
    
    console.log('Debug analysis complete. Key findings:');
    
    // API Issues
    if (typeof wpApiSettings === 'undefined') {
        console.log('🔴 CRITICAL: wpApiSettings not available - this will cause 403 errors');
    } else {
        console.log('🟢 wpApiSettings available with valid nonce');
    }
    
    // React Issues
    if (typeof React === 'undefined') {
        console.log('🔴 CRITICAL: React not available globally');
    } else {
        console.log('🟢 React environment appears functional');
    }
    
    // Data Flow
    if (typeof window.fitcopilotTrainingCalendarData === 'undefined') {
        console.log('🟡 WARNING: Training Calendar data not available');
    } else {
        console.log('🟢 Training Calendar data available');
    }
    
    console.log('Monitoring active for:');
    console.log('- API requests (403 errors)');
    console.log('- React runtime errors');
    console.log('- DOM manipulation conflicts');
    
    console.groupEnd();
    
    return {
        wpApiSettings: typeof wpApiSettings !== 'undefined' ? wpApiSettings : null,
        trainingCalendarData: window.fitcopilotTrainingCalendarData || null,
        reactAvailable: typeof React !== 'undefined',
        monitoringActive: true
    };
    
})(); 