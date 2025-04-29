/**
 * FitCopilot React Debug Tool
 * 
 * This script provides debugging functionality for React components.
 */

(function () {
    // Check if we're in debug mode
    if (!window.fitcopilotDebug || !window.fitcopilotDebug.isDebugMode) {
        return;
    }

    console.log('%c FitCopilot React Debug Tools Activated ', 'background: #a3e635; color: #111827; font-weight: bold; padding: 3px 5px;');

    const debug = {
        init: function () {
            // Wait for DOM to be ready
            document.addEventListener('DOMContentLoaded', () => {
                this.checkMountPoint();
                this.fetchManifest();
                this.setupMutationObserver();
                this.addToggleButton();
            });

            // Add global debug methods
            window.fitcopilotDebugTools = {
                logRender: this.logComponentRender.bind(this),
                getComponentStats: this.getComponentStats.bind(this)
            };
        },

        checkMountPoint: function () {
            const mountPointId = window.fitcopilotDebug.mountPointId || 'athlete-dashboard-root';
            const mountPoint = document.getElementById(mountPointId);
            const statusEl = document.getElementById('mount-point-status');

            if (statusEl) {
                if (mountPoint) {
                    statusEl.textContent = 'Found';
                    statusEl.style.color = '#a3e635';
                } else {
                    statusEl.textContent = 'Missing';
                    statusEl.style.color = '#ef4444';
                    console.error(`%c React mount point #${mountPointId} not found! `, 'background: #ef4444; color: white;');
                }
            }
        },

        fetchManifest: function () {
            const manifestPath = window.fitcopilotDebug.manifestPath;
            const assetListEl = document.getElementById('asset-list');

            if (!manifestPath || !assetListEl) return;

            fetch(manifestPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load manifest.json');
                    }
                    return response.json();
                })
                .then(manifest => {
                    assetListEl.innerHTML = '';

                    // Display manifest entries
                    Object.entries(manifest).forEach(([key, value]) => {
                        const listItem = document.createElement('li');

                        // Check if the file exists
                        fetch(`${window.fitcopilotDebug.themePath}/dist/${value}`)
                            .then(response => {
                                const exists = response.ok;

                                listItem.innerHTML = `
                                    <span style="color: ${exists ? '#a3e635' : '#ef4444'}">
                                        ${key}: ${value} ${exists ? '✓' : '✗'}
                                    </span>
                                `;
                            })
                            .catch(() => {
                                listItem.innerHTML = `
                                    <span style="color: #ef4444">
                                        ${key}: ${value} ✗
                                    </span>
                                `;
                            });

                        assetListEl.appendChild(listItem);
                    });
                })
                .catch(err => {
                    console.error('Error loading manifest:', err);
                    assetListEl.innerHTML = `<li style="color: #ef4444">Error loading manifest: ${err.message}</li>`;
                });
        },

        setupMutationObserver: function () {
            // Watch for React component mounts
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check for React debug components
                        const debugComponents = document.querySelectorAll('.react-debug-component');
                        if (debugComponents.length > 0) {
                            this.updateComponentList();
                        }
                    }
                });
            });

            // Start observing
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        updateComponentList: function () {
            const componentTimingEl = document.getElementById('component-timing');
            if (!componentTimingEl) return;

            const components = document.querySelectorAll('.react-debug-component');
            if (components.length === 0) {
                componentTimingEl.innerHTML = '<p>No components detected yet.</p>';
                return;
            }

            // Clear previous content
            componentTimingEl.innerHTML = '';

            // Create component table
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';

            // Create table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th style="text-align: left; padding: 3px;">Component</th>
                    <th style="text-align: left; padding: 3px;">Render Time</th>
                </tr>
            `;
            table.appendChild(thead);

            // Create table body
            const tbody = document.createElement('tbody');

            // Add component rows
            components.forEach(component => {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.style.padding = '3px';
                nameCell.textContent = component.getAttribute('data-component');

                const timeCell = document.createElement('td');
                timeCell.style.padding = '3px';

                const timeSpan = component.querySelector('.react-debug-render-time');
                timeCell.textContent = timeSpan ? timeSpan.textContent : 'Not rendered';

                row.appendChild(nameCell);
                row.appendChild(timeCell);
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            componentTimingEl.appendChild(table);
        },

        logComponentRender: function (componentName, renderTime) {
            const componentId = 'react-debug-' + componentName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const componentEl = document.getElementById(componentId);

            if (componentEl) {
                const timeSpan = componentEl.querySelector('.react-debug-render-time');
                if (timeSpan) {
                    timeSpan.textContent = renderTime + 'ms';
                }

                // Update the table
                this.updateComponentList();
            }

            console.log(`%c Component ${componentName} rendered in ${renderTime}ms `, 'background: #a3e635; color: #111827; padding: 2px 4px;');
        },

        getComponentStats: function () {
            const components = document.querySelectorAll('.react-debug-component');
            const stats = {
                total: components.length,
                rendered: 0,
                times: {}
            };

            components.forEach(component => {
                const name = component.getAttribute('data-component');
                const timeEl = component.querySelector('.react-debug-render-time');

                if (timeEl && timeEl.textContent) {
                    stats.rendered++;
                    stats.times[name] = parseFloat(timeEl.textContent);
                }
            });

            return stats;
        },

        addToggleButton: function () {
            const button = document.createElement('button');
            button.textContent = 'Toggle Debug Panel';
            button.style.position = 'fixed';
            button.style.bottom = '10px';
            button.style.right = '10px';
            button.style.zIndex = '9998';
            button.style.background = '#a3e635';
            button.style.color = '#111827';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.padding = '5px 10px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '12px';

            button.addEventListener('click', () => {
                const panel = document.getElementById('react-debug-panel');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                }
            });

            document.body.appendChild(button);
        }
    };

    // Initialize debug tools
    debug.init();
})(); 