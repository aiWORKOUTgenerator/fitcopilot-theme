# 🚀 **Trainer × Event Type Assignment Matrix - 3-Day Sprint Plan**

## **Sprint Overview**
**Objective**: Fix critical data integration issues and implement proper Assignment Matrix functionality  
**Duration**: 3 days  
**Status**: Ready to begin Day 2  

---

## **📅 Day 2: Critical Data Integration & Matrix Layout Fixes**
**Duration**: 6-8 hours  
**Focus**: Fix core data source and visual layout issues  

### **Morning Session (3-4 hours): Data Integration Fix**

#### **Task 2.1: Fix Training Calendar Provider Data Source** (90 minutes)
**Files to Edit**: `inc/admin/training-calendar/class-training-calendar-provider.php`

**Changes Required**:
```php
// CURRENT (Line 95)
$trainers = $this->get_sample_trainers();

// FIX TO
$trainers = $this->get_real_trainers_from_personal_training();

// ADD NEW METHOD
private function get_real_trainers_from_personal_training() {
    // Check if Personal Training Manager is available
    if (class_exists('FitCopilot_Personal_Training_Manager')) {
        $pt_manager = new FitCopilot_Personal_Training_Manager();
        $trainers = $pt_manager->get_trainers();
        
        // Transform Personal Training data to Training Calendar format
        return $this->transform_pt_trainers_to_calendar_format($trainers);
    }
    
    // Fallback to sample data only if Personal Training not available
    return $this->get_sample_trainers();
}
```

#### **Task 2.2: Fix Training Calendar Data Integration** (90 minutes)
**Files to Edit**: `inc/admin/training-calendar/class-training-calendar-data.php`

**Changes Required**:
```php
// CURRENT (Line 1058)
return $this->get_sample_trainers();

// FIX TO
public function get_integrated_trainers() {
    $personal_training_data = get_option('fitcopilot_personal_training_data', array());
    
    if (!empty($personal_training_data['trainers'])) {
        return $this->transform_personal_training_data($personal_training_data['trainers']);
    }
    
    // Only fallback to samples if no Personal Training data exists
    return $this->get_sample_trainers();
}
```

### **Afternoon Session (3-4 hours): Matrix Layout & CSS Fixes**

#### **Task 2.3: Redesign Assignment Matrix CSS** (120 minutes)
**Files to Edit**: `assets/admin/css/training-calendar/training-calendar-admin.css`

**Current Layout Issue**: 
- Matrix renders as flexbox with linear cells
- No proper table structure
- Poor visual hierarchy

**New Table-Based Layout**:
```css
.assignment-matrix-container {
    overflow-x: auto;
    margin: 20px 0;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.assignment-matrix-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

.assignment-matrix-table th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 10px;
    text-align: center;
    font-weight: 600;
    border: 1px solid #5a67d8;
}

.assignment-matrix-table th:first-child {
    text-align: left;
    min-width: 150px;
}

.assignment-matrix-table td {
    padding: 12px 10px;
    text-align: center;
    border: 1px solid #e2e8f0;
    vertical-align: middle;
}

.assignment-matrix-table td.trainer-name {
    text-align: left;
    font-weight: 500;
    background: #f8fafc;
    min-width: 150px;
}

.assignment-checkbox {
    transform: scale(1.2);
    margin: 0;
}

.matrix-cell.assigned {
    background-color: #dcfdf7;
    border-color: #10b981;
}

.matrix-cell.assigned .assignment-checkbox {
    accent-color: #10b981;
}

/* Rate display under checkbox */
.assignment-rate {
    font-size: 11px;
    color: #6b7280;
    margin-top: 4px;
    display: block;
}
```

#### **Task 2.4: Update Matrix HTML Structure** (60 minutes)
**Files to Edit**: `assets/admin/js/training-calendar/modules/assignment-manager.js`

**Replace** `renderAssignmentMatrix()` method:
```javascript
renderAssignmentMatrix: function() {
    const $matrix = $('#assignment-matrix');
    const eventTypes = Object.keys(this.config.eventTypes);
    
    let tableHtml = '<div class="assignment-matrix-container">';
    tableHtml += '<table class="assignment-matrix-table">';
    
    // Table header
    tableHtml += '<thead><tr>';
    tableHtml += '<th>Trainer</th>';
    eventTypes.forEach(eventType => {
        const config = this.config.eventTypes[eventType];
        tableHtml += `<th title="${config.description}">
            <div class="event-type-header">
                <span class="event-icon">${config.icon}</span>
                <span class="event-title">${config.title}</span>
            </div>
        </th>`;
    });
    tableHtml += '</tr></thead>';
    
    // Table body - trainer rows
    tableHtml += '<tbody>';
    this.state.trainers.forEach(trainer => {
        tableHtml += '<tr>';
        tableHtml += `<td class="trainer-name" title="${trainer.specialty || ''}">${trainer.name}</td>`;
        
        eventTypes.forEach(eventType => {
            const isAssigned = this.isTrainerAssigned(trainer.id, eventType);
            const assignmentData = this.getAssignmentData(trainer.id, eventType);
            
            tableHtml += `<td class="matrix-cell assignment ${isAssigned ? 'assigned' : ''}" 
                               data-trainer-id="${trainer.id}" 
                               data-event-type="${eventType}">
                <label class="assignment-label">
                    <input type="checkbox" class="assignment-checkbox" 
                           ${isAssigned ? 'checked' : ''} 
                           data-trainer-id="${trainer.id}" 
                           data-event-type="${eventType}">
                    ${isAssigned && assignmentData?.hourly_rate ? 
                        `<span class="assignment-rate">$${assignmentData.hourly_rate}/hr</span>` : ''}
                </label>
            </td>`;
        });
        tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table></div>';
    
    $matrix.html(tableHtml);
},
```

---

## **📅 Day 3: Enhanced Functionality & Polish**
**Duration**: 6-8 hours  
**Focus**: Advanced features, real-time sync, and user experience  

### **Morning Session (3-4 hours): Real-Time Integration**

#### **Task 3.1: Personal Training Sync Integration** (120 minutes)
**Objective**: When trainers are added/removed in Personal Training admin, Assignment Matrix updates automatically

**Files to Edit**: 
- `inc/admin/training-calendar/class-trainer-assignment-manager.php`
- `assets/admin/js/training-calendar/modules/assignment-manager.js`

**Features**:
1. WordPress hooks to detect Personal Training trainer changes
2. Cache invalidation when trainer data changes
3. Automatic matrix refresh on tab activation

#### **Task 3.2: Enhanced Assignment Configuration** (90 minutes)
**Objective**: Detailed configuration for each trainer-event type assignment

**Features**:
1. Hourly rate setting per assignment
2. Specialization notes
3. Maximum sessions per day
4. Active/inactive status toggle

### **Afternoon Session (3-4 hours): Polish & Testing**

#### **Task 3.3: Assignment Statistics Dashboard** (120 minutes)
**Objective**: Comprehensive statistics and reporting

**Features**:
1. Total assignments per trainer
2. Event type coverage metrics
3. Hourly rate analytics
4. Coverage gaps identification

#### **Task 3.4: Bulk Assignment Operations** (60 minutes)
**Objective**: Quick assignment management tools

**Features**:
1. Bulk assign trainer to multiple event types
2. Bulk remove assignments
3. Copy assignments from one trainer to another

#### **Task 3.5: Final Testing & Validation** (60 minutes)
**Objective**: Comprehensive system testing

**Test Cases**:
1. Add trainer in Personal Training → verify appears in matrix
2. Remove trainer in Personal Training → verify removed from matrix  
3. Assign/unassign via checkboxes → verify saves to database
4. Configure assignment details → verify data persistence
5. View statistics → verify accuracy

---

## **🎯 Success Criteria**

### **Day 2 Success Metrics**
- ✅ Matrix displays **real trainers** from Personal Training system
- ✅ Table layout properly structured and visually appealing
- ✅ Assignment save/remove functionality working with real data
- ✅ No more hardcoded Justin Fassio, Sarah Johnson, Mike Chen

### **Day 3 Success Metrics**  
- ✅ Real-time sync between Personal Training and Training Calendar
- ✅ Full assignment configuration options working
- ✅ Statistics dashboard showing accurate data
- ✅ Bulk assignment operations functional

### **Final System Goals**
- ✅ **100% Personal Training Integration**: No hardcoded data
- ✅ **Professional UI**: Proper table layout matching design standards
- ✅ **Full Functionality**: All CRUD operations working with real data
- ✅ **Real-Time Sync**: Changes in Personal Training reflect immediately
- ✅ **Advanced Features**: Statistics, bulk operations, detailed configuration

---

## **🛠️ Technical Notes**

### **Data Transformation Requirements**
Personal Training trainer data structure differs from Training Calendar expectations. Need transformation layer:

```php
// Personal Training Structure
$pt_trainer = [
    'name' => 'John Doe',
    'specialty' => 'Strength Training',
    'active' => true,
    'featured' => false
];

// Training Calendar Expected Structure  
$tc_trainer = [
    'id' => 1,
    'name' => 'John Doe', 
    'specialty' => 'Strength Training',
    'active' => true,
    'featured' => false,
    'email' => '',
    'bio' => ''
];
```

### **Performance Considerations**
- Cache trainer data for 10 minutes to reduce database calls
- Use WordPress transients for assignment data caching
- Implement incremental updates instead of full matrix refresh

### **Error Handling**
- Graceful fallback to sample data if Personal Training unavailable
- User-friendly error messages for assignment save failures
- Loading states during AJAX operations

---

**Sprint Start**: Ready to begin Day 2 immediately  
**Expected Completion**: Fully functional Assignment Matrix with real Personal Training integration 