/**
 * Critical Issues JavaScript Debug Script
 * 
 * Run this in the browser console to diagnose:
 * 1. REST API 403 Forbidden errors with malformed nonce
 * 2. React TypeError: Cannot read properties of undefined (reading 'start')
 * 
 * Usage: Paste this entire script into browser console and run
 */

(function() {
    'use strict';
    
    console.log('🔧 Starting Critical Issues Debug Analysis...');
    console.log('Timestamp:', new Date().toISOString());
    
    // ===== ISSUE 1: REST API NONCE ANALYSIS =====
    
    console.group('🔐 Issue 1: REST API 403 Forbidden Analysis');
    
    // Test 1: Check wpApiSettings availability
    console.log('Test 1: wpApiSettings availability');
    if (typeof wpApiSettings === 'undefined') {
        console.error('❌ CRITICAL: wpApiSettings is undefined');
        console.error('   This is the ROOT CAUSE of 403 errors!');
        console.error('   wpApiSettings should be defined by wp_localize_script in functions.php');
        
        // Try to find alternative nonce sources
        console.log('   Checking for alternative nonce sources...');
        
        // Check if it's attached to other global objects
        const possibleSources = [
            'window.fitcopilotTrainingCalendarData',
            'window.athleteDashboardData',
            'window.ajaxurl',
            'window.wp'
        ];
        
        possibleSources.forEach(source => {
            try {
                const obj = eval(source);
                if (obj && obj.nonce) {
                    console.log(`   Found nonce in ${source}:`, obj.nonce.substr(0, 10) + '...');
                } else if (obj) {
                    console.log(`   ${source} exists but no nonce found:`, Object.keys(obj));
                }
            } catch (e) {
                console.log(`   ${source} not available`);
            }
        });
        
    } else {
        console.log('✅ wpApiSettings found');
        console.log('   Root:', wpApiSettings.root);
        console.log('   Nonce:', wpApiSettings.nonce ? wpApiSettings.nonce.substr(0, 10) + '...' : '❌ MISSING');
        console.log('   API URL:', wpApiSettings.api_url);
        console.log('   REST URL:', wpApiSettings.rest_url);
        
        if (!wpApiSettings.nonce) {
            console.error('❌ CRITICAL: wpApiSettings.nonce is missing!');
        }
    }
    
    // Test 2: Check for malformed nonce in network requests
    console.log('Test 2: Network requests analysis');
    
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [url, options] = args;
        
        if (url.includes('/wp-json/fitcopilot/')) {
            console.log('🌐 API Request detected:', url);
            
            if (options && options.headers) {
                const nonce = options.headers['X-WP-Nonce'] || options.headers['x-wp-nonce'];
                if (nonce) {
                    console.log('   Nonce header:', nonce.substr(0, 10) + '...');
                    if (nonce.endsWith(':1') || nonce.endsWith(':')) {
                        console.error('   ❌ MALFORMED NONCE DETECTED:', nonce);
                    }
                } else {
                    console.error('   ❌ NO NONCE HEADER FOUND');
                }
            } else {
                console.error('   ❌ NO HEADERS FOUND');
            }
        }
        
        return originalFetch.apply(this, args);
    };
    
    console.groupEnd();
    
    // ===== ISSUE 2: REACT RUNTIME ERROR ANALYSIS =====
    
    console.group('⚛️ Issue 2: React Runtime Error Analysis');
    
    // Test 1: React availability
    console.log('Test 1: React environment');
    if (typeof React === 'undefined') {
        console.error('❌ React not available');
    } else {
        console.log('✅ React version:', React.version);
    }
    
    if (typeof ReactDOM === 'undefined') {
        console.error('❌ ReactDOM not available');
    } else {
        console.log('✅ ReactDOM available');
    }
    
    // Test 2: Find React components and their state
    console.log('Test 2: React component analysis');
    
    // Look for React elements
    const reactElements = document.querySelectorAll('[data-reactroot], [data-react-component]');
    console.log(`Found ${reactElements.length} React elements in DOM`);
    
    // Test 3: Error monitoring setup
    console.log('Test 3: Error monitoring');
    
    // Set up error capturing
    const originalError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        
        // Check for the specific "Cannot read properties of undefined (reading 'start')" error
        if (message.includes("Cannot read properties of undefined") && message.includes("'start'")) {
            console.group('🚨 CRITICAL ERROR DETECTED');
            console.error('Error:', message);
            console.error('This is likely in EventModal.tsx time slot rendering');
            console.error('Stack trace:', new Error().stack);
            
            // Try to find the problematic component
            try {
                const calendarElements = document.querySelectorAll('[data-component*="calendar"], [class*="calendar"], [class*="event-modal"]');
                console.log('Calendar-related elements found:', calendarElements.length);
                
                calendarElements.forEach((el, index) => {
                    console.log(`Element ${index}:`, el.className, el.dataset);
                });
                
            } catch (e) {
                console.error('Error analyzing calendar elements:', e);
            }
            
            console.groupEnd();
        }
        
        return originalError.apply(this, args);
    };
    
    console.groupEnd();
    
    // ===== ISSUE 3: API TESTING =====
    
    console.group('🧪 Issue 3: Live API Testing');
    
    async function testAPIEndpoint() {
        console.log('Testing trainer availability endpoint...');
        
        if (typeof wpApiSettings === 'undefined') {
            console.error('❌ Cannot test - wpApiSettings missing');
            return;
        }
        
        if (!wpApiSettings.nonce) {
            console.error('❌ Cannot test - nonce missing');
            return;
        }
        
        const testUrl = `${wpApiSettings.rest_url}trainer-availability?eventType=Free%20Consultation%20(20%20Min)&duration=20`;
        
        try {
            console.log('Making request to:', testUrl);
            
            const response = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'X-WP-Nonce': wpApiSettings.nonce,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                
                if (response.status === 403) {
                    console.error('🚨 403 Forbidden - Check nonce and endpoint permissions');
                }
            } else {
                const data = await response.json();
                console.log('✅ API call successful:', data);
            }
            
        } catch (error) {
            console.error('❌ API call failed:', error);
        }
    }
    
    // Run API test after a short delay
    setTimeout(testAPIEndpoint, 1000);
    
    console.groupEnd();
    
    // ===== ISSUE 4: REACT STATE INSPECTION =====
    
    console.group('🔍 Issue 4: React State Inspection');
    
    function inspectReactComponents() {
        console.log('Searching for React components with time slot data...');
        
        // Try to find components with React Fiber
        function findReactFiber(element) {
            for (let key in element) {
                if (key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$')) {
                    return element[key];
                }
            }
            return null;
        }
        
        // Look for event modal or calendar components
        const candidates = document.querySelectorAll('.event-modal, .training-calendar, [class*="EventModal"], [class*="Calendar"]');
        
        console.log(`Found ${candidates.length} potential React components`);
        
        candidates.forEach((element, index) => {
            console.log(`Component ${index}:`, element.className);
            
            const fiber = findReactFiber(element);
            if (fiber) {
                console.log(`  React Fiber found`);
                
                // Try to access props and state
                try {
                    if (fiber.memoizedProps) {
                        console.log(`  Props keys:`, Object.keys(fiber.memoizedProps));
                        
                        // Look for time slot related props
                        const timeSlotProps = Object.keys(fiber.memoizedProps).filter(key => 
                            key.toLowerCase().includes('slot') || 
                            key.toLowerCase().includes('time') ||
                            key.toLowerCase().includes('schedule')
                        );
                        
                        if (timeSlotProps.length > 0) {
                            console.log(`  Time slot related props:`, timeSlotProps);
                            timeSlotProps.forEach(prop => {
                                const value = fiber.memoizedProps[prop];
                                console.log(`    ${prop}:`, value);
                                
                                // Check if this is the problematic time slot
                                if (value && typeof value === 'object') {
                                    if (value.start === undefined && value.startTime === undefined) {
                                        console.error(`    🚨 FOUND PROBLEMATIC TIME SLOT: ${prop} missing 'start' property`);
                                        console.error(`    Available properties:`, Object.keys(value));
                                    }
                                }
                            });
                        }
                    }
                    
                    if (fiber.memoizedState) {
                        console.log(`  State available`);
                    }
                } catch (e) {
                    console.error(`  Error inspecting fiber:`, e);
                }
            }
        });
    }
    
    // Run component inspection
    setTimeout(inspectReactComponents, 2000);
    
    console.groupEnd();
    
    // ===== SUMMARY AND RECOMMENDATIONS =====
    
    setTimeout(() => {
        console.group('📋 Summary and Recommendations');
        
        console.log('Based on the analysis, here are the likely issues and fixes:');
        
        console.log('\n🔐 Issue 1: REST API 403 Forbidden');
        if (typeof wpApiSettings === 'undefined') {
            console.error('  ROOT CAUSE: wpApiSettings not defined');
            console.log('  FIX: Ensure wp_localize_script is called in functions.php');
            console.log('  CODE: wp_localize_script("fitcopilot-homepage", "wpApiSettings", [...])');
        } else if (!wpApiSettings.nonce) {
            console.error('  ROOT CAUSE: wpApiSettings.nonce is missing');
            console.log('  FIX: Add nonce to wp_localize_script data');
            console.log('  CODE: "nonce" => wp_create_nonce("wp_rest")');
        }
        
        console.log('\n⚛️ Issue 2: React Runtime Error');
        console.error('  ROOT CAUSE: Time slot object missing "start" property');
        console.log('  FIX: Add defensive programming in EventModal.tsx');
        console.log('  CODE: if (selectedTimeSlot?.startTime && typeof selectedTimeSlot.startTime.toLocaleString === "function")');
        
        console.log('\n🛠️ Next Steps:');
        console.log('  1. Check functions.php for wp_localize_script configuration');
        console.log('  2. Add null checking in EventModal.tsx time slot rendering');
        console.log('  3. Verify REST API endpoint registration');
        console.log('  4. Test with browser network tab to see actual request headers');
        
        console.groupEnd();
        
    }, 3000);
    
    console.log('🔧 Debug analysis started. Results will appear above as they complete.');
    
})();

// Export for use in console
window.debugCriticalIssues = function() {
    location.reload();
}; 