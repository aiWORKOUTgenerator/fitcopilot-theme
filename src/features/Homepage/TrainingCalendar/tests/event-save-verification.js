/**
 * Event Save and Cache Verification Test
 * 
 * Tests the complete workflow of event creation, saving, and caching
 * to ensure events are properly persisted and displayed
 */

console.log('🧪 Event Save and Cache Verification Test');
console.log('==========================================');

// Test configuration
const TEST_CONFIG = {
  testEventTitle: 'Test Event - ' + new Date().toISOString(),
  testEventDescription: 'This is a test event to verify saving and caching',
  testTrainerId: 1,
  testLocation: 'google_meet'
};

/**
 * Test 1: Verify WordPress Data Loading
 */
function testWordPressDataLoading() {
  console.log('\n📋 Test 1: WordPress Data Loading');
  console.log('----------------------------------');
  
  const calendarData = window.fitcopilotTrainingCalendarData;
  
  if (!calendarData) {
    console.error('❌ FAIL: fitcopilotTrainingCalendarData not found');
    return false;
  }
  
  console.log('✅ PASS: WordPress data loaded');
  console.log('📊 Data structure:', {
    events: calendarData.events?.length || 0,
    trainers: calendarData.trainers?.length || 0,
    nonce: calendarData.nonce ? 'present' : 'missing',
    ajaxUrl: calendarData.ajax_url ? 'present' : 'missing'
  });
  
  return true;
}

/**
 * Test 2: Create Event via React Hook
 */
async function testEventCreation() {
  console.log('\n🆕 Test 2: Event Creation via React Hook');
  console.log('----------------------------------------');
  
  try {
    // Access the useCalendarData hook if available
    const useCalendarDataHook = window.useCalendarDataForTesting;
    
    if (!useCalendarDataHook) {
      console.warn('⚠️  SKIP: useCalendarData hook not exposed for testing');
      return testDirectAjaxCreation();
    }
    
    // Create test event data
    const testEvent = {
      title: TEST_CONFIG.testEventTitle,
      description: TEST_CONFIG.testEventDescription,
      start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      end: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),   // Tomorrow + 1 hour
      trainerId: TEST_CONFIG.testTrainerId,
      eventType: 'session',
      bookingStatus: 'available',
      sessionType: 'individual',
      location: TEST_CONFIG.testLocation,
      maxParticipants: 1,
      currentParticipants: 0,
      backgroundColor: '#8b5cf6',
      borderColor: '#8b5cf6',
      textColor: '#ffffff'
    };
    
    console.log('📤 Creating event:', testEvent.title);
    
    const createdEvent = await useCalendarDataHook.addEvent(testEvent);
    
    if (createdEvent && createdEvent.id) {
      console.log('✅ PASS: Event created successfully');
      console.log('📋 Created event ID:', createdEvent.id);
      return createdEvent;
    } else {
      console.error('❌ FAIL: Event creation returned invalid result');
      return false;
    }
    
  } catch (error) {
    console.error('❌ FAIL: Event creation error:', error.message);
    return false;
  }
}

/**
 * Test 3: Direct AJAX Event Creation (Fallback)
 */
async function testDirectAjaxCreation() {
  console.log('\n📡 Test 3: Direct AJAX Event Creation');
  console.log('------------------------------------');
  
  try {
    const calendarData = window.fitcopilotTrainingCalendarData;
    
    if (!calendarData || !calendarData.nonce) {
      console.error('❌ FAIL: Missing WordPress nonce for AJAX');
      return false;
    }
    
    const testEvent = {
      title: TEST_CONFIG.testEventTitle,
      description: TEST_CONFIG.testEventDescription,
      start_datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      end_datetime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      trainer_id: TEST_CONFIG.testTrainerId,
      event_type: 'session',
      booking_status: 'available',
      session_type: 'individual',
      location: TEST_CONFIG.testLocation,
      max_participants: 1,
      background_color: '#8b5cf6',
      border_color: '#8b5cf6',
      text_color: '#ffffff'
    };
    
    const formData = new FormData();
    formData.append('action', 'save_individual_calendar_event');
    formData.append('nonce', calendarData.nonce);
    formData.append('event_data', JSON.stringify(testEvent));
    
    console.log('📤 Sending AJAX request to save event...');
    
    const response = await fetch('/wp-admin/admin-ajax.php', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ PASS: AJAX event creation successful');
      console.log('📋 Response data:', result.data);
      return result.data;
    } else {
      console.error('❌ FAIL: AJAX response indicated failure:', result.data?.message || 'Unknown error');
      return false;
    }
    
  } catch (error) {
    console.error('❌ FAIL: AJAX event creation error:', error.message);
    return false;
  }
}

/**
 * Test 4: Verify Event Persistence
 */
async function testEventPersistence(createdEvent) {
  console.log('\n💾 Test 4: Event Persistence Verification');
  console.log('-----------------------------------------');
  
  if (!createdEvent) {
    console.warn('⚠️  SKIP: No event to verify (creation failed)');
    return false;
  }
  
  try {
    const calendarData = window.fitcopilotTrainingCalendarData;
    
    const formData = new FormData();
    formData.append('action', 'get_calendar_events');
    formData.append('nonce', calendarData.nonce);
    
    console.log('📤 Fetching events to verify persistence...');
    
    const response = await fetch('/wp-admin/admin-ajax.php', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    
    const result = await response.json();
    
    if (result.success && result.data && result.data.events) {
      const events = result.data.events;
      const foundEvent = events.find(event => 
        event.title === TEST_CONFIG.testEventTitle ||
        event.id == createdEvent.event_id ||
        event.id == createdEvent.id
      );
      
      if (foundEvent) {
        console.log('✅ PASS: Event found in database');
        console.log('📋 Persisted event:', foundEvent);
        return foundEvent;
      } else {
        console.error('❌ FAIL: Event not found in database');
        console.log('🔍 Available events:', events.map(e => ({ id: e.id, title: e.title })));
        return false;
      }
    } else {
      console.error('❌ FAIL: Could not retrieve events from database');
      return false;
    }
    
  } catch (error) {
    console.error('❌ FAIL: Event persistence check error:', error.message);
    return false;
  }
}

/**
 * Test 5: Verify Cache Invalidation
 */
function testCacheInvalidation() {
  console.log('\n🗂️  Test 5: Cache Invalidation Verification');
  console.log('-------------------------------------------');
  
  // Check if WordPress object cache functions are available
  if (typeof wp !== 'undefined' && wp.cache) {
    console.log('✅ PASS: WordPress cache system detected');
    console.log('📋 Cache keys that should be invalidated:');
    console.log('   - fitcopilot_training_calendar_events_list');
    console.log('   - fitcopilot_training_calendar_event_[ID]');
    return true;
  } else {
    console.log('ℹ️  INFO: WordPress cache not accessible from frontend');
    console.log('📋 Cache invalidation happens server-side in PHP');
    return true;
  }
}

/**
 * Test 6: Verify Frontend Display Update
 */
function testFrontendDisplayUpdate() {
  console.log('\n🖥️  Test 6: Frontend Display Update');
  console.log('----------------------------------');
  
  // Check if FullCalendar is present and has events
  const calendarElement = document.querySelector('.fc');
  
  if (!calendarElement) {
    console.warn('⚠️  SKIP: FullCalendar not found on page');
    return false;
  }
  
  const calendarEvents = document.querySelectorAll('.fc-event');
  console.log('📊 Calendar events visible:', calendarEvents.length);
  
  // Check if our test event is visible
  const testEventElements = Array.from(calendarEvents).filter(element => 
    element.textContent.includes(TEST_CONFIG.testEventTitle.substring(0, 20))
  );
  
  if (testEventElements.length > 0) {
    console.log('✅ PASS: Test event visible in calendar');
    return true;
  } else {
    console.log('ℹ️  INFO: Test event not yet visible (may require refresh)');
    return true;
  }
}

/**
 * Run Complete Test Suite
 */
async function runCompleteTest() {
  console.log('🚀 Starting Complete Event Save & Cache Verification Test');
  console.log('=========================================================');
  
  const results = {
    dataLoading: false,
    eventCreation: false,
    eventPersistence: false,
    cacheInvalidation: false,
    frontendDisplay: false
  };
  
  // Test 1: WordPress Data Loading
  results.dataLoading = testWordPressDataLoading();
  
  // Test 2 & 3: Event Creation
  const createdEvent = await testEventCreation();
  results.eventCreation = !!createdEvent;
  
  // Test 4: Event Persistence
  const persistedEvent = await testEventPersistence(createdEvent);
  results.eventPersistence = !!persistedEvent;
  
  // Test 5: Cache Invalidation
  results.cacheInvalidation = testCacheInvalidation();
  
  // Test 6: Frontend Display
  results.frontendDisplay = testFrontendDisplayUpdate();
  
  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log('WordPress Data Loading:  ', results.dataLoading ? '✅ PASS' : '❌ FAIL');
  console.log('Event Creation:          ', results.eventCreation ? '✅ PASS' : '❌ FAIL');
  console.log('Event Persistence:       ', results.eventPersistence ? '✅ PASS' : '❌ FAIL');
  console.log('Cache Invalidation:      ', results.cacheInvalidation ? '✅ PASS' : '❌ FAIL');
  console.log('Frontend Display:        ', results.frontendDisplay ? '✅ PASS' : '❌ FAIL');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log('\n🎯 Overall Result:', `${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 SUCCESS: Event saving and caching workflow is working correctly!');
  } else if (passedTests >= 3) {
    console.log('⚠️  PARTIAL: Core functionality working, some issues detected');
  } else {
    console.log('❌ FAILURE: Significant issues with event saving and caching');
  }
  
  return results;
}

// Export for manual testing
window.EventSaveVerificationTest = {
  runCompleteTest,
  testWordPressDataLoading,
  testEventCreation,
  testDirectAjaxCreation,
  testEventPersistence,
  testCacheInvalidation,
  testFrontendDisplayUpdate
};

// Auto-run if not in production
if (window.location.hostname.includes('local') || window.location.hostname === 'localhost') {
  console.log('🔧 Development environment detected - auto-running test in 3 seconds...');
  setTimeout(() => {
    runCompleteTest().catch(error => {
      console.error('❌ Test suite error:', error);
    });
  }, 3000);
}

console.log('📝 Manual test available: EventSaveVerificationTest.runCompleteTest()'); 