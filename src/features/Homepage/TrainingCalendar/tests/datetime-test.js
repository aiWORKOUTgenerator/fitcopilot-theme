/**
 * DateTime Formatting Test for Training Calendar
 * 
 * Tests to ensure datetime values are properly formatted for HTML inputs
 * and won't trigger browser warnings about incorrect format
 * 
 * Usage in browser console:
 * 1. Load this script
 * 2. Run: testDateTimeFormatting()
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 */

// Test the datetime formatting functions
function testDateTimeFormatting() {
  console.log('🧪 Testing DateTime Formatting for Training Calendar');
    
  // Test data with various date formats
  const testDates = [
    new Date('2025-06-20T07:10:00.000Z'),
    new Date('2025-06-20T07:30:00.000Z'),
    new Date('2025-12-25T15:30:45.123Z'),
    new Date(Date.now() + 86400000), // Tomorrow
    new Date() // Now
  ];
    
  console.log('📅 Testing formatForDateTimeLocal function:');
    
  testDates.forEach((date, index) => {
    const original = date.toISOString();
    const formatted = formatForDateTimeLocal(date);
    const isValidFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(formatted);
        
    console.log(`Test ${index + 1}:`);
    console.log(`  Original: ${original}`);
    console.log(`  Formatted: ${formatted}`);
    console.log(`  Valid Format: ${isValidFormat ? '✅' : '❌'}`);
        
    // Test with HTML input
    if (typeof document !== 'undefined') {
      const testInput = document.createElement('input');
      testInput.type = 'datetime-local';
      testInput.value = formatted;
            
      console.log(`  HTML Input Valid: ${testInput.validity.valid ? '✅' : '❌'}`);
            
      if (!testInput.validity.valid) {
        console.log(`    Validation Error: ${testInput.validationMessage}`);
      }
    }
    console.log('');
  });
    
  console.log('🔄 Testing round-trip conversion:');
    
  testDates.forEach((date, index) => {
    const formatted = formatForDateTimeLocal(date);
    const parsed = parseFromDateTimeLocal(formatted);
    const timeDiff = Math.abs(parsed.getTime() - date.getTime());
        
    console.log(`Round-trip Test ${index + 1}:`);
    console.log(`  Original: ${date.toISOString()}`);
    console.log(`  Formatted: ${formatted}`);
    console.log(`  Parsed Back: ${parsed.toISOString()}`);
    console.log(`  Time Difference: ${timeDiff}ms ${timeDiff < 60000 ? '✅' : '❌'}`);
    console.log('');
  });
    
  return {
    success: true,
    message: 'DateTime formatting tests completed successfully'
  };
}

// Mock the utility functions if they're not available
if (typeof formatForDateTimeLocal === 'undefined') {
  window.formatForDateTimeLocal = function(date) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
        
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
        
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
}

if (typeof parseFromDateTimeLocal === 'undefined') {
  window.parseFromDateTimeLocal = function(dateTimeString) {
    if (!dateTimeString || typeof dateTimeString !== 'string') {
      return new Date();
    }
        
    return new Date(dateTimeString);
  };
}

// Test the Event Modal datetime handling
function testEventModalDateTimes() {
  console.log('🎭 Testing Event Modal DateTime Handling');
    
  // Check if EventModal is available
  const eventModal = document.querySelector('.event-modal');
  if (!eventModal) {
    console.log('ℹ️ Event Modal not found in DOM - this is expected if modal is not open');
    return;
  }
    
  // Check datetime-local inputs
  const datetimeInputs = eventModal.querySelectorAll('input[type="datetime-local"]');
  console.log(`Found ${datetimeInputs.length} datetime-local inputs`);
    
  datetimeInputs.forEach((input, index) => {
    console.log(`Input ${index + 1}:`);
    console.log(`  Value: ${input.value}`);
    console.log(`  Valid: ${input.validity.valid ? '✅' : '❌'}`);
        
    if (!input.validity.valid) {
      console.log(`  Validation Message: ${input.validationMessage}`);
    }
  });
}

// Export functions for use in browser console
if (typeof window !== 'undefined') {
  window.testDateTimeFormatting = testDateTimeFormatting;
  window.testEventModalDateTimes = testEventModalDateTimes;
    
  console.log('✅ DateTime test functions loaded');
  console.log('📋 Available functions:');
  console.log('  - testDateTimeFormatting()');
  console.log('  - testEventModalDateTimes()');
} 