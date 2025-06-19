/**
 * Debug Nonce and AJAX Test Script
 * 
 * Copy and paste this into browser console to test Training Calendar nonce and AJAX functionality
 * 
 * @package FitCopilot
 * @since 1.0.0
 */

console.log('🔍 FitCopilot Training Calendar Debug Test');
console.log('==========================================');

// ===== 1. CHECK NONCE AVAILABILITY =====
console.log('\n1. 📋 Checking Nonce Availability');
console.log('----------------------------------');

const calendarData = window.fitcopilotTrainingCalendarData;
const wpApiSettings = window.wpApiSettings;
const ajaxSettings = window.fitcopilotTrainingCalendarAjax;

console.log('fitcopilotTrainingCalendarData:', calendarData);
console.log('- Has nonce:', !!calendarData?.nonce);
console.log('- Nonce value:', calendarData?.nonce || 'NOT SET');
console.log('- API ajaxNonce:', calendarData?.api?.ajaxNonce || 'NOT SET');
console.log('- API restNonce:', calendarData?.api?.restNonce || 'NOT SET');

console.log('\nwpApiSettings:', wpApiSettings);
console.log('- Has nonce:', !!wpApiSettings?.nonce);
console.log('- Nonce value:', wpApiSettings?.nonce || 'NOT SET');

console.log('\nfitcopilotTrainingCalendarAjax:', ajaxSettings);
console.log('- Has nonce:', !!ajaxSettings?.nonce);
console.log('- Nonce value:', ajaxSettings?.nonce || 'NOT SET');

// ===== 2. NONCE VALIDATION =====
console.log('\n2. ✅ Nonce Validation');
console.log('---------------------');

const availableNonces = [];
if (calendarData?.nonce) availableNonces.push({ source: 'calendarData.nonce', value: calendarData.nonce });
if (calendarData?.api?.ajaxNonce) availableNonces.push({ source: 'calendarData.api.ajaxNonce', value: calendarData.api.ajaxNonce });
if (wpApiSettings?.nonce) availableNonces.push({ source: 'wpApiSettings.nonce', value: wpApiSettings.nonce });
if (ajaxSettings?.nonce) availableNonces.push({ source: 'ajaxSettings.nonce', value: ajaxSettings.nonce });

console.log('Available nonces:', availableNonces);

if (availableNonces.length === 0) {
    console.error('❌ NO NONCES FOUND! This is the root cause of your "Security check failed" error.');
    console.log('💡 Fix: Check that the Training Calendar Provider is localizing script data correctly.');
} else {
    console.log('✅ Found', availableNonces.length, 'nonce(s)');
}

// ===== 3. TEST AJAX CALL =====
console.log('\n3. 🧪 Testing AJAX Call');
console.log('------------------------');

if (availableNonces.length > 0) {
    const testNonce = availableNonces[0].value;
    console.log('Using nonce from:', availableNonces[0].source);
    console.log('Nonce value:', testNonce);
    
    const testEventData = {
        title: 'Debug Test Event',
        description: 'Test event created from browser console debug',
        start_datetime: new Date(Date.now() + 24*60*60*1000).toISOString(),
        end_datetime: new Date(Date.now() + 25*60*60*1000).toISOString(),
        event_type: 'assessment',
        booking_status: 'pending',
        session_type: 'individual',
        location: 'google_meet',
        max_participants: 1
    };
    
    console.log('Test event data:', testEventData);
    
    const formData = new FormData();
    formData.append('action', 'save_individual_calendar_event');
    formData.append('nonce', testNonce);
    formData.append('event_data', JSON.stringify(testEventData));
    
    console.log('📤 Sending AJAX request...');
    
    fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => {
        console.log('📥 Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('📋 AJAX Response:', data);
        
        if (data.success) {
            console.log('✅ SUCCESS! AJAX call worked');
            console.log('🎉 Event created:', data.data);
            console.log('💡 The nonce fix resolved the security issue!');
        } else {
            console.error('❌ AJAX call failed:', data.data?.message || 'Unknown error');
            console.log('🔍 This indicates there may be other issues beyond nonce');
        }
    })
    .catch(error => {
        console.error('❌ Network/Parse Error:', error);
        console.log('🔍 This could indicate server issues or malformed response');
    });
    
} else {
    console.log('⏭️ Skipping AJAX test - no nonces available');
}

// ===== 4. USER REGISTRATION CHECK =====
console.log('\n4. 👥 User Registration Status');
console.log('------------------------------');

const userRegistrationEndpoints = [
    '/wp-json/fitcopilot/v1/users/check-email',
    '/wp-json/fitcopilot/v1/users/register',
    '/wp-json/fitcopilot/v1/users/send-welcome-email',
    '/wp-json/fitcopilot/v1/users/profile'
];

console.log('Checking user registration endpoints...');

userRegistrationEndpoints.forEach(endpoint => {
    fetch(endpoint)
        .then(response => {
            const status = response.status === 404 ? '❌ Not Found' : 
                          response.status === 401 ? '🔐 Protected' :
                          response.status === 200 ? '✅ Available' : 
                          `⚠️ Status ${response.status}`;
            console.log(`${endpoint}: ${status}`);
        })
        .catch(error => {
            console.log(`${endpoint}: ❌ Error - ${error.message}`);
        });
});

// ===== 5. RECOMMENDATIONS =====
console.log('\n5. 💡 Debug Recommendations');
console.log('----------------------------');

if (availableNonces.length === 0) {
    console.log('🔧 CRITICAL: Fix nonce localization in Training Calendar Provider');
    console.log('📝 Action: Add nonce field to fitcopilotTrainingCalendarData');
}

if (calendarData?.nonce && calendarData.nonce.length > 0) {
    console.log('✅ Nonce fix appears to be working');
    console.log('📝 Next: Implement user registration system');
} else {
    console.log('⚠️ Nonce still missing - check provider class');
}

console.log('\n🏁 Debug test completed');
console.log('Check the AJAX response above to see if the nonce fix worked!'); 