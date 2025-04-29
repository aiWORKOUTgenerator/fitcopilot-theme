<?php
/**
 * Template Name: Theme Testing
 * Description: Template for testing theme components
 */

get_header();
?>

<div class="testing-container" style="padding: 20px; max-width: 1200px; margin: 0 auto;">
  <h1 style="margin-bottom: 20px; font-size: 24px; font-weight: bold;">Theme Component Testing</h1>
  
  <div class="theme-controls" style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px;">
    <h2 style="margin-bottom: 10px; font-size: 18px;">Theme Controls</h2>
    
    <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 15px;">
      <button id="switch-variant" style="padding: 8px 15px; background: #4a5568; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Switch Variant
      </button>
      <span id="current-variant" style="font-family: monospace; padding: 5px 10px; background: #edf2f7; border-radius: 3px;">
        Current: default
      </span>
    </div>
    
    <div style="display: flex; gap: 15px; align-items: center;">
      <button id="force-refresh" style="padding: 8px 15px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Force Refresh
      </button>
      <button id="debug-state" style="padding: 8px 15px; background: #2b6cb0; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Show Debug Info
      </button>
    </div>
  </div>
  
  <div id="debug-output" style="display: none; margin: 20px 0; padding: 15px; background: #2d3748; color: #e2e8f0; border-radius: 5px; font-family: monospace; white-space: pre-wrap; max-height: 300px; overflow: auto;">
    Waiting for debug info...
  </div>
  
  <div style="margin: 30px 0;">
    <h2 style="margin-bottom: 15px; font-size: 20px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">React App Mount Point</h2>
    <div id="athlete-dashboard-root" style="display: block; width: 100%; min-height: 500px; border: 1px dashed #e2e8f0; position: relative;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
        <p>React app will mount here...</p>
      </div>
    </div>
  </div>
  
  <div style="margin: 30px 0;">
    <h2 style="margin-bottom: 15px; font-size: 20px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">Component Status</h2>
    <div id="component-status" style="font-family: monospace; background: #f7fafc; padding: 15px; border-radius: 5px;">
      Loading component information...
    </div>
  </div>
</div>

<script>
// Wait for DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const switchVariantBtn = document.getElementById('switch-variant');
  const currentVariantEl = document.getElementById('current-variant');
  const forceRefreshBtn = document.getElementById('force-refresh');
  const debugStateBtn = document.getElementById('debug-state');
  const debugOutputEl = document.getElementById('debug-output');
  const componentStatusEl = document.getElementById('component-status');
  
  // Switch theme variant
  switchVariantBtn.addEventListener('click', function() {
    const body = document.body;
    const currentVariant = body.getAttribute('data-theme') || 'default';
    const newVariant = currentVariant === 'default' ? 'gym' : 'default';
    
    body.setAttribute('data-theme', newVariant);
    currentVariantEl.textContent = 'Current: ' + newVariant;
    
    // Update status
    updateStatus('Switched to variant: ' + newVariant);
    console.log('Switched to variant:', newVariant);
  });
  
  // Force page refresh
  forceRefreshBtn.addEventListener('click', function() {
    window.location.reload();
  });
  
  // Toggle debug info
  debugStateBtn.addEventListener('click', function() {
    const isVisible = debugOutputEl.style.display !== 'none';
    debugOutputEl.style.display = isVisible ? 'none' : 'block';
    debugStateBtn.textContent = isVisible ? 'Show Debug Info' : 'Hide Debug Info';
    
    if (!isVisible) {
      // Populate debug info
      const debugInfo = {
        browser: navigator.userAgent,
        viewport: window.innerWidth + 'x' + window.innerHeight,
        timestamp: new Date().toISOString(),
        reactMounted: !!document.querySelector('[data-react-mounted="true"]'),
        bodyClasses: document.body.className,
        bodyAttributes: {
          'data-theme': document.body.getAttribute('data-theme')
        },
        scripts: Array.from(document.querySelectorAll('script')).map(s => s.src).filter(Boolean)
      };
      
      debugOutputEl.textContent = JSON.stringify(debugInfo, null, 2);
    }
  });
  
  // Update component status
  function updateStatus(message) {
    if (!componentStatusEl) return;
    
    const timestamp = new Date().toLocaleTimeString();
    componentStatusEl.innerHTML += `<div>[${timestamp}] ${message}</div>`;
    
    // Keep only the last 10 messages
    const messages = componentStatusEl.querySelectorAll('div');
    if (messages.length > 10) {
      for (let i = 0; i < messages.length - 10; i++) {
        messages[i].remove();
      }
    }
  }
  
  // Initial status update
  updateStatus('Page loaded');
  
  // Monitor React mounting
  const checkReactInterval = setInterval(function() {
    const mounted = document.querySelector('[data-react-mounted="true"]');
    if (mounted) {
      updateStatus('React successfully mounted! 🎉');
      clearInterval(checkReactInterval);
    }
  }, 1000);
  
  // Update current variant display
  const bodyTheme = document.body.getAttribute('data-theme') || 'default';
  currentVariantEl.textContent = 'Current: ' + bodyTheme;
});
</script>

<?php get_footer(); ?> 