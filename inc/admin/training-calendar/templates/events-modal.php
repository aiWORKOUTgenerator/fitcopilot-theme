<div id="all-events-modal" class="training-calendar-modal" style="display: none;">
    <div class="modal-overlay"></div>
    <div class="modal-content large-modal">
        <div class="modal-header">
            <h3>📋 All Training Events</h3>
            <button type="button" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="events-filter" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
                <div class="filter-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div class="filter-group">
                        <label for="filter-trainer" style="display: block; margin-bottom: 5px; font-weight: 500;">Trainer:</label>
                        <select id="filter-trainer" style="width: 100%; padding: 6px;">
                            <option value="">All Trainers</option>
                            <option value="1">Justin Fassio</option>
                            <option value="2">Sarah Johnson</option>
                            <option value="3">Mike Chen</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="filter-status" style="display: block; margin-bottom: 5px; font-weight: 500;">Status:</label>
                        <select id="filter-status" style="width: 100%; padding: 6px;">
                            <option value="">All Statuses</option>
                            <option value="available">Available</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="filter-type" style="display: block; margin-bottom: 5px; font-weight: 500;">Type:</label>
                        <select id="filter-type" style="width: 100%; padding: 6px;">
                            <option value="">All Types</option>
                            <option value="session">Personal Session</option>
                            <option value="group_class">Group Class</option>
                            <option value="assessment">Assessment</option>
                            <option value="workshop">Workshop</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div id="events-list-container" class="events-container">
                <div class="events-loading" style="text-align: center; padding: 40px;">
                    <div class="spinner is-active" style="float: none; margin: 0 auto;"></div>
                    <p>Loading events...</p>
                </div>
            </div>
            
            <div class="events-summary" style="margin-top: 20px; padding: 15px; background: #f0f6ff; border-radius: 6px;">
                <div id="events-count-display" style="display: flex; justify-content: space-between; align-items: center;">
                    <span><strong>Total Events:</strong> <span id="total-events-count">0</span></span>
                    <span><strong>Showing:</strong> <span id="filtered-events-count">0</span></span>
                </div>
            </div>
        </div>
        <div class="modal-footer" style="padding: 20px; border-top: 1px solid #ddd; background: #f8f9fa; border-radius: 0 0 8px 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <button type="button" class="button button-secondary modal-close" style="padding: 8px 16px; font-size: 14px; font-weight: 500;">
                    Close
                </button>
                <button type="button" class="button button-primary" id="create-new-event-from-modal" style="padding: 8px 16px; font-size: 14px; font-weight: 500;">
                    <span class="dashicons dashicons-plus-alt" style="margin-top: 2px;"></span> Create New Event
                </button>
            </div>
        </div>
    </div>
</div> 