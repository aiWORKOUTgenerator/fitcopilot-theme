# Training Calendar Database Schema

**Version 2.0.0** - Event Type Assignment Support

## Overview

This directory contains the database schema implementation for Training Calendar Event Type → Trainer assignments. This represents a clean, modernized approach that replaces the generic "session duration" system with a comprehensive event type assignment framework.

## Key Changes from Version 1.0.0

### 1. Availability Table Updates
- **Added**: `event_type` field (varchar 50) - Links availability to specific event types
- **Added**: `event_type_config` field (JSON) - Stores event type-specific configuration
- **Added**: `max_bookings` field (int) - Maximum bookings per time slot
- **Removed**: `session_duration` field - Replaced by event type configuration

### 2. New Trainer Assignment Table
- **Table**: `wp_training_calendar_trainer_event_assignments`
- **Purpose**: Junction table for trainer ↔ event type relationships
- **Features**: Assignment tracking, certification levels, custom pricing

## Database Structure

### Updated Availability Table
```sql
wp_training_calendar_availability:
├── id (bigint, auto_increment)
├── trainer_id (bigint) 
├── event_type (varchar 50) ← NEW
├── event_type_config (JSON) ← NEW  
├── day_of_week (tinyint)
├── start_time (time)
├── end_time (time)
├── is_active (boolean)
├── effective_date (date)
├── expiry_date (date)
├── break_start_time (time)
├── break_end_time (time)
├── buffer_time (int)
├── max_bookings (int) ← NEW
├── max_sessions_per_day (int)
├── location (varchar)
├── availability_type (enum)
├── hourly_rate (decimal)
├── notes (text)
├── created_at (datetime)
└── updated_at (datetime)

Indexes:
- idx_trainer_event_type (trainer_id, event_type)
- idx_event_type (event_type)
```

### New Trainer Assignment Table
```sql
wp_training_calendar_trainer_event_assignments:
├── id (bigint, auto_increment)
├── trainer_id (bigint)
├── event_type (varchar 50)
├── is_active (boolean)
├── specialization_notes (text)
├── hourly_rate (decimal)
├── max_daily_sessions (int)
├── certification_level (varchar 50)
├── custom_duration_options (JSON)
├── custom_pricing (JSON)
├── availability_preferences (JSON)
├── assigned_by (bigint)
├── assignment_date (datetime)
├── last_modified_by (bigint)
├── created_at (datetime)
└── updated_at (datetime)

Indexes:
- unique_trainer_event (trainer_id, event_type) [UNIQUE]
- idx_trainer_id (trainer_id)
- idx_event_type (event_type)
- idx_active_assignments (trainer_id, event_type, is_active)
```

## Event Types Supported

1. **fitness_assessment** - Free 20-minute assessments
2. **personal_training** - Paid 1-on-1 sessions (20-90 min options)
3. **group_fitness** - Group classes (trainer-scheduled)
4. **group_forum** - Discussion sessions (30 min fixed)

## Implementation Files

### Core Schema Files
- `database-schema.php` - Main schema class with update/create methods
- `README.md` - This documentation file

### Integration Files  
- `../class-training-calendar-schema-manager.php` - WordPress integration layer
- `../test-schema-implementation.php` - Testing utilities

## Usage

### Automatic Integration
The schema manager is automatically initialized with the Training Calendar Manager and will:
- Check for required updates on admin page loads
- Show admin notices when updates are needed
- Provide AJAX interface for manual updates

### Manual Schema Update
```php
// Via function call
$success = fitcopilot_training_calendar_update_schema();

// Via schema class
$schema = new FitCopilot_Training_Calendar_Schema();
$success = $schema->update_schema();
```

### Check Schema Status
```php
$status = fitcopilot_training_calendar_schema_status();
// Returns: current_version, target_version, needs_update, tables_exist, etc.
```

### Fresh Installation
```php
$schema = new FitCopilot_Training_Calendar_Schema();
$success = $schema->create_fresh_schema();
```

## Testing

### WP CLI Testing
```bash
wp fitcopilot test-schema
```

### Admin Interface Testing
Visit: `/wp-admin/admin.php?page=personal-training&run_schema_test=1`

### Manual Testing
```php
require_once 'test-schema-implementation.php';
$results = FitCopilot_Training_Calendar_Schema_Test::run_tests();
```

## Migration Strategy

Since there's no existing data, this implementation uses a **clean approach**:

1. **New Installations**: Creates fresh schema with event type support
2. **Existing Installations**: Updates existing tables to add event type fields
3. **Default Assignments**: Automatically assigns existing trainers to basic event types

## Performance Considerations

### Indexes Added
- `idx_trainer_event_type` - Fast queries for trainer-specific event availability
- `idx_event_type` - Quick event type filtering
- `idx_active_assignments` - Efficient assignment status queries

### Query Optimization
- JSON fields for flexible configuration without additional tables
- Composite indexes for common query patterns
- Proper foreign key relationships for data integrity

## Future Expansion

The schema is designed to support future features:

### Event Type Configuration
- Custom duration options per trainer
- Dynamic pricing rules
- Availability preferences

### Advanced Assignments  
- Temporary assignments with expiry dates
- Certification requirements tracking
- Performance metrics integration

## Rollback Support

For development/testing environments:
```php
$schema = new FitCopilot_Training_Calendar_Schema();
$success = $schema->rollback(); // Returns to version 1.0.0
```

**⚠️ Warning**: Rollback will remove event type assignments and revert to session_duration field.

## Schema Versioning

- **Version 1.0.0**: Basic availability with session_duration
- **Version 2.0.0**: Event type assignments with trainer relationships

Version tracking via WordPress option: `fitcopilot_training_calendar_schema_version` 