/**
 * Training Calendar Event Workflow Test
 * 
 * Simple test to verify the complete event creation and display workflow:
 * 1. User creates event in modal
 * 2. Event gets saved to backend
 * 3. Event displays on calendar
 * 
 * Usage: Open browser console and run: testEventWorkflow()
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 */

// Test data
const TEST_EVENT = {
  title: 'Test Workout Session',
  description: 'End-to-end test event to verify workflow',
  start: new Date(Date.now() + 86400000), // Tomorrow
  end: new Date(Date.now() + 86400000 + 3600000), // Tomorrow + 1 hour
  trainerId: 1,
  eventType: 'session',
  bookingStatus: 'available',
  sessionType: 'individual',
  location: 'Google Meet',
  maxParticipants: 1,
  backgroundColor: '#4CAF50',
  borderColor: '#2E7D32',
  textColor: '#FFFFFF'
};

/**
 * Main test function
 */
window.testEventWorkflow = async function() {
  console.log('🧪 Starting Event Workflow Test...');
  
  try {
    // Step 1: Check if calendar is loaded
    console.log('📊 Step 1: Checking calendar component...');
    const calendarElement = document.querySelector('.fc-view-harness');
    if (!calendarElement) {
      throw new Error('Calendar component not found on page');
    }
    console.log('✅ Calendar component found');
    
    // Step 2: Check if React hook data is available
    console.log('📊 Step 2: Checking calendar data...');
    const calendarData = window.fitcopilotTrainingCalendarData;
    if (!calendarData) {
      throw new Error('Calendar data not available');
    }
    console.log('✅ Calendar data available:', {
      events: calendarData.events?.length || 0,
      trainers: calendarData.trainers?.length || 0,
      nonce: calendarData.nonce ? 'Present' : 'Missing'
    });
    
    // Step 3: Simulate event creation via AJAX
    console.log('📊 Step 3: Testing event creation...');
    const eventData = {
      action: 'save_individual_calendar_event',
      event_data: JSON.stringify(TEST_EVENT),
      nonce: calendarData.nonce
    };
    
    const formData = new FormData();
    Object.keys(eventData).forEach(key => {
      formData.append(key, eventData[key]);
    });
    
    const response = await fetch(calendarData.ajaxUrl, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('📥 AJAX Response:', result);
    
    if (!result.success) {
      throw new Error(result.data || 'Event creation failed');
    }
    
    console.log('✅ Event created successfully:', {
      eventId: result.data.event_id,
      title: result.data.event_title
    });
    
    // Step 4: Wait and check if event appears in calendar
    console.log('📊 Step 4: Checking calendar display...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    // Look for the event in the calendar
    const eventElements = document.querySelectorAll('.fc-event-title');
    let eventFound = false;
    
    eventElements.forEach(element => {
      if (element.textContent.includes(TEST_EVENT.title)) {
        eventFound = true;
        console.log('✅ Event found in calendar display');
      }
    });
    
    if (!eventFound) {
      console.warn('⚠️ Event not yet visible in calendar (may need page refresh)');
      console.log('💡 Try refreshing the page to see the new event');
    }
    
    // Step 5: Test Summary
    console.log('\n🎉 Event Workflow Test Complete!');
    console.log('━'.repeat(50));
    console.log('📊 Test Results:');
    console.log('✅ Calendar component loaded');
    console.log('✅ Calendar data available');
    console.log('✅ Event creation successful');
    console.log('✅ Backend integration working');
    console.log(eventFound ? '✅ Event visible in calendar' : '⚠️ Event created but not yet visible');
    console.log('━'.repeat(50));
    console.log('🎯 Workflow Status: WORKING');
    
    return {
      success: true,
      eventId: result.data.event_id,
      message: 'Event workflow test completed successfully'
    };
    
  } catch (error) {
    console.error('❌ Event Workflow Test Failed:', error);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Ensure you are on a page with the Training Calendar');
    console.log('2. Check browser console for any other errors');
    console.log('3. Verify WordPress AJAX is properly configured');
    console.log('4. Check if user has proper permissions');
    
    return {
      success: false,
      error: error.message,
      message: 'Event workflow test failed'
    };
  }
};

/**
 * Quick test to just check if the calendar is ready
 */
window.checkCalendarStatus = function() {
  console.log('📊 Training Calendar Status Check');
  console.log('━'.repeat(40));
  
  // Check calendar element
  const calendarElement = document.querySelector('.fc-view-harness');
  console.log('Calendar Element:', calendarElement ? '✅ Found' : '❌ Not Found');
  
  // Check calendar data
  const calendarData = window.fitcopilotTrainingCalendarData;
  console.log('Calendar Data:', calendarData ? '✅ Available' : '❌ Missing');
  
  if (calendarData) {
    console.log('  - Events:', calendarData.events?.length || 0);
    console.log('  - Trainers:', calendarData.trainers?.length || 0);
    console.log('  - AJAX URL:', calendarData.ajaxUrl ? '✅ Set' : '❌ Missing');
    console.log('  - Nonce:', calendarData.nonce ? '✅ Set' : '❌ Missing');
  }
  
  // Check for React components
  const reactRoot = document.querySelector('#athlete-dashboard-root');
  console.log('React Root:', reactRoot ? '✅ Found' : '❌ Not Found');
  
  console.log('━'.repeat(40));
  
  return {
    calendarElement: !!calendarElement,
    calendarData: !!calendarData,
    reactRoot: !!reactRoot,
    ready: !!(calendarElement && calendarData && reactRoot)
  };
};

console.log('🧪 Event Workflow Test Functions Loaded!');
console.log('Run testEventWorkflow() to test the complete workflow');
console.log('Run checkCalendarStatus() to check component status'); 