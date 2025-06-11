# 🔧 **Personal Training Individual Save - Troubleshooting Guide**

**Purpose**: Step-by-step guide to troubleshoot and test the individual save functionality  
**Updated**: December 2024  
**Status**: DEBUGGING ACTIVE  

---

## 🎯 **Quick Troubleshooting Checklist**

### **Step 1: Enable WordPress Debug Mode**
Add to `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### **Step 2: Check Admin Page Loading**
1. Navigate to **WordPress Admin** → **FitCopilot** → **Trainers**
2. Verify the page loads without errors
3. Check for "🔧 Debug Test Save" button (only visible in debug mode)

### **Step 3: Browser Console Test**
1. Open **Developer Tools** (F12)
2. Go to **Console** tab
3. Click "🔧 Debug Test Save" button
4. Look for console messages starting with `🔧 Running debug test save...`

### **Step 4: Check Individual Save Buttons**
1. Scroll to any trainer card
2. Verify "💾 Save This Trainer" button is visible
3. Make a small change to trainer name
4. Click "💾 Save This Trainer"
5. Watch for status messages

---

## 🔍 **Detailed Debugging Steps**

### **Test 1: AJAX Endpoint Verification**

**Check if AJAX handlers are registered:**
```javascript
// Run in browser console
console.log('AJAX URL:', fitcopilotPersonalTrainingAjax.ajax_url);
console.log('Nonce:', fitcopilotPersonalTrainingAjax.nonce);
console.log('Save action should be: save_individual_trainer');
```

**Expected Output:**
```
AJAX URL: /wp-admin/admin-ajax.php
Nonce: [10-character string]
Save action should be: save_individual_trainer
```

### **Test 2: Form Data Collection**

**Test data collection manually:**
```javascript
// Run in browser console on admin page
var testIndex = 0;
var trainerRow = $('.trainer-row').eq(testIndex);
var trainerData = {};

trainerRow.find('input, textarea, select').each(function() {
    var input = $(this);
    var name = input.attr('name');
    
    if (name && name.includes('[' + testIndex + ']')) {
        var matches = name.match(/\[([^\]]+)\]$/);
        if (matches && matches[1]) {
            var fieldName = matches[1];
            if (input.attr('type') === 'checkbox') {
                trainerData[fieldName] = input.is(':checked') ? '1' : '';
            } else {
                trainerData[fieldName] = input.val() || '';
            }
        }
    }
});

console.log('Collected trainer data:', trainerData);
```

**Expected Output:**
```javascript
{
    "id": "1",
    "name": "Justin Fassio", 
    "specialty": "Strength & Conditioning",
    "bio": "Specialized in transforming...",
    "active": "1",
    // ... more fields
}
```

### **Test 3: Manual AJAX Call**

**Test AJAX directly:**
```javascript
// Run in browser console
$.ajax({
    url: fitcopilotPersonalTrainingAjax.ajax_url,
    type: 'POST',
    data: {
        action: 'save_individual_trainer',
        nonce: fitcopilotPersonalTrainingAjax.nonce,
        trainer_data: {
            id: 999,
            name: 'Manual Test Trainer',
            specialty: 'Manual Testing',
            active: '1'
        },
        trainer_index: 999
    },
    success: function(response) {
        console.log('✅ Manual AJAX Success:', response);
    },
    error: function(xhr, status, error) {
        console.error('❌ Manual AJAX Error:', error);
    }
});
```

### **Test 4: Check WordPress Debug Log**

**Location**: `/wp-content/debug.log`

**Look for entries like:**
```
FitCopilot Individual Save - Raw POST Data: {...}
FitCopilot Individual Save - Parsed Data: {...}
FitCopilot Individual Save - Success Response: {...}
```

**If no log entries appear**: AJAX calls aren't reaching the PHP handler

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: Button Click Not Working**
**Symptoms**: Clicking save button does nothing
**Debug**: Check console for JavaScript errors
**Solution**: 
```javascript
// Test if event handler is attached
console.log('Save buttons found:', $('.save-individual-trainer').length);
$('.save-individual-trainer').first().trigger('click');
```

### **Issue 2: AJAX Request Not Sent**
**Symptoms**: No network requests in browser dev tools
**Debug**: Check if `fitcopilotPersonalTrainingAjax` object exists
**Solution**:
```javascript
// Check if localized script data exists
if (typeof fitcopilotPersonalTrainingAjax === 'undefined') {
    console.error('❌ AJAX object not found - script not localized');
} else {
    console.log('✅ AJAX object found:', fitcopilotPersonalTrainingAjax);
}
```

### **Issue 3: 403 Forbidden Error**
**Symptoms**: AJAX returns 403 error
**Debug**: Check user permissions and nonce
**Solution**:
```php
// Add to wp-config.php temporarily
define('SCRIPT_DEBUG', true);

// Or check user capabilities
if (!current_user_can('manage_options')) {
    echo 'User lacks manage_options capability';
}
```

### **Issue 4: 500 Server Error**
**Symptoms**: AJAX returns 500 error
**Debug**: Check WordPress debug log for PHP errors
**Solution**:
```bash
# Check error logs
tail -f /wp-content/debug.log

# Or check server error logs
tail -f /var/log/apache2/error.log
```

### **Issue 5: Data Not Saving**
**Symptoms**: AJAX succeeds but data doesn't persist
**Debug**: Check database directly
**Solution**:
```sql
-- Check WordPress options table
SELECT * FROM wp_options WHERE option_name = 'fitcopilot_personal_training_data';
```

---

## ✅ **Success Indicators**

### **Working Individual Save Should Show:**

1. **Console Messages:**
```
🚀 Starting individual save for trainer: {index: 0, id: 1}
📝 Field collected: name = Justin Fassio
📝 Field collected: specialty = Strength & Conditioning
📦 Complete trainer data to save: {name: "Justin Fassio", ...}
🌐 AJAX data being sent: {action: "save_individual_trainer", ...}
✅ Personal Training AJAX Response: {success: true, ...}
✅ Trainer saved successfully: {name: "Justin Fassio", ...}
```

2. **Visual Feedback:**
- Button text changes: "💾 Save This Trainer" → "Saving..." → "💾 Save This Trainer"
- Status message appears: "✅ Saved! (Trainer Name)"
- Green flash animation on trainer card
- Orange "unsaved changes" indicator disappears

3. **Database Update:**
- `wp_options` table updated with new trainer data
- `fitcopilot_personal_training_last_updated` timestamp updated

---

## 🔧 **Emergency Fixes**

### **Quick Fix 1: Reset Individual Save Functionality**
```php
// Add to functions.php temporarily
add_action('admin_init', function() {
    if (isset($_GET['reset_trainer_saves'])) {
        delete_option('fitcopilot_personal_training_data');
        delete_option('fitcopilot_personal_training_last_updated');
        wp_redirect(admin_url('admin.php?page=fitcopilot-personal-training'));
        exit;
    }
});

// Visit: /wp-admin/?reset_trainer_saves=1
```

### **Quick Fix 2: Manual AJAX Test Endpoint**
```php
// Add to functions.php temporarily
add_action('wp_ajax_test_save_debug', function() {
    wp_die(json_encode(array(
        'success' => true,
        'message' => 'AJAX endpoint working',
        'user_can_manage' => current_user_can('manage_options'),
        'nonce_valid' => wp_verify_nonce($_POST['nonce'], 'fitcopilot_save_individual_trainer'),
        'post_data' => $_POST
    )));
});

// Test with:
// action: test_save_debug
```

---

## 📞 **Getting Help**

### **Information to Provide:**
1. **Browser Console Output** (copy all messages)
2. **WordPress Debug Log** (last 50 lines)
3. **Network Tab** (show AJAX request/response)
4. **WordPress Version** and **Active Plugins**
5. **User Role** and **Capabilities**

### **Test Environment:**
- **WordPress Version**: [VERSION]
- **Theme**: FitCopilot
- **PHP Version**: [VERSION]
- **User Role**: Administrator
- **Debug Mode**: Enabled

**This guide should help identify and resolve any issues with the individual save functionality. Follow the steps in order and document your findings.** 🚀 