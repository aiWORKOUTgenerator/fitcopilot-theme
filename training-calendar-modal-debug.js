/**
 * Training Calendar Modal Debug Script - VANILLA JS VERSION
 * Copy and paste this entire script into the browser console on Training Calendar admin page
 */

(function() {
    'use strict';
    
    console.log('🔧 TRAINING CALENDAR MODAL DEBUG SCRIPT (VANILLA JS)');
    console.log('======================================================');
    
    // Check jQuery availability
    const jQueryAvailable = typeof window.$ !== 'undefined' && typeof window.$.fn !== 'undefined';
    console.log(`jQuery Available: ${jQueryAvailable ? '✅' : '❌'}`);
    
    // Helper function to check element visibility
    const isVisible = (element) => {
        if (!element) return false;
        return element.offsetParent !== null && 
               getComputedStyle(element).display !== 'none' && 
               getComputedStyle(element).visibility !== 'hidden';
    };
    
    console.log('\n1️⃣ BUTTON ANALYSIS:');
    console.log('===================');
    
    // Find the manage trainers button
    const manageButton = document.querySelector('.manage-trainers-btn');
    console.log('Button found:', !!manageButton);
    
    if (manageButton) {
        console.log('✅ BUTTON DETAILS:');
        console.log('  - Text:', manageButton.textContent || manageButton.innerText);
        console.log('  - Classes:', manageButton.className);
        console.log('  - Visible:', isVisible(manageButton));
        console.log('  - Tag:', manageButton.tagName);
        console.log('  - Type:', manageButton.type);
        console.log('  - ID:', manageButton.id);
        
        // Check data attributes
        const dataAttrs = {};
        Array.from(manageButton.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
                dataAttrs[attr.name] = attr.value;
            }
        });
        console.log('  - Data attributes:', dataAttrs);
        
        // Check onclick attribute
        if (manageButton.onclick) {
            console.log('  - Onclick handler:', manageButton.onclick.toString());
        }
        
    } else {
        console.log('❌ MANAGE TRAINERS BUTTON NOT FOUND!');
        console.log('Searching for alternative buttons...');
        
        // Try alternative selectors
        const alternatives = [
            'button[class*="manage"]',
            'button[onclick*="trainers"]',
            '.button-primary[onclick*="trainers"]',
            'input[value*="Manage"]',
            'a[href*="trainers"]',
            'button:contains("Manage")', // Won't work in vanilla JS but good to know
            '[onclick*="TrainerAvailability"]'
        ];
        
        alternatives.forEach(selector => {
            try {
                const alt = document.querySelector(selector);
                if (alt) {
                    console.log(`  ✅ Found alternative (${selector}):`, alt.textContent || alt.value || alt.innerText);
                }
            } catch (e) {
                // Invalid selector, skip
            }
        });
        
        // Look for any button with "trainer" in text
        const allButtons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
        console.log(`Checking ${allButtons.length} buttons for "trainer" text...`);
        allButtons.forEach((btn, i) => {
            const text = (btn.textContent || btn.value || '').toLowerCase();
            if (text.includes('trainer') || text.includes('manage')) {
                console.log(`  Button ${i}: "${text}" - classes: ${btn.className}`);
            }
        });
    }
    
    console.log('\n2️⃣ MODAL ANALYSIS:');
    console.log('==================');
    
    // Find the modal
    const modal = document.querySelector('#trainer-availability-modal');
    console.log('Modal found:', !!modal);
    
    if (modal) {
        const styles = getComputedStyle(modal);
        
        console.log('✅ MODAL DETAILS:');
        console.log('  - Visible:', isVisible(modal));
        console.log('  - Display:', styles.display);
        console.log('  - Position:', styles.position);
        console.log('  - Z-index:', styles.zIndex);
        console.log('  - Classes:', modal.className);
        console.log('  - Width:', styles.width);
        console.log('  - Height:', styles.height);
        console.log('  - Top:', styles.top);
        console.log('  - Left:', styles.left);
        
        // Check modal content
        const modalBody = modal.querySelector('.modal-body') || modal.querySelector('.modal-content');
        if (modalBody) {
            console.log('  - Has content:', modalBody.children.length > 0);
            console.log('  - Content children:', modalBody.children.length);
        }
        
        // Check for close buttons
        const closeButtons = modal.querySelectorAll('.close, .modal-close, [data-dismiss="modal"]');
        console.log('  - Close buttons found:', closeButtons.length);
        
    } else {
        console.log('❌ TRAINER AVAILABILITY MODAL NOT FOUND!');
        
        // Look for any modals
        const allModals = document.querySelectorAll('[id*="modal"], .modal, [class*="modal"]');
        console.log(`Found ${allModals.length} potential modals on page:`);
        
        Array.from(allModals).forEach((modal, i) => {
            console.log(`  Modal ${i + 1}:`, {
                id: modal.id,
                classes: modal.className,
                visible: isVisible(modal),
                display: getComputedStyle(modal).display
            });
        });
    }
    
    console.log('\n3️⃣ SCRIPT & LIBRARY ANALYSIS:');
    console.log('==============================');
    
    // Check for competing modal scripts
    const scripts = document.querySelectorAll('script[src]');
    const modalScripts = Array.from(scripts).filter(script => 
        script.src.includes('modal') || 
        script.src.includes('bootstrap') || 
        script.src.includes('trainer') ||
        script.src.includes('admin')
    );
    
    console.log(`Found ${modalScripts.length} potentially relevant scripts:`);
    modalScripts.forEach((script, i) => {
        console.log(`  Script ${i + 1}:`, script.src);
    });
    
    // Check global variables
    const globals = ['TrainerAvailability', 'bootstrap', 'SimpleEventsModal', 'jQuery', '$', 'tb_show'];
    console.log('\nGlobal variables check:');
    globals.forEach(global => {
        const exists = typeof window[global] !== 'undefined';
        console.log(`  ${global}: ${exists ? '✅' : '❌'}`);
        if (exists && global === 'TrainerAvailability') {
            console.log(`    TrainerAvailability methods:`, Object.keys(window[global]));
        }
    });
    
    console.log('\n4️⃣ EVENT HANDLER TEST:');
    console.log('=======================');
    
    if (manageButton) {
        console.log('Testing button click simulation...');
        
        // Count existing event listeners (crude method)
        const clonedButton = manageButton.cloneNode(true);
        console.log('  - Button has event listeners:', clonedButton.onclick !== manageButton.onclick);
        
        // Add test event listener
        let clickCount = 0;
        const testHandler = function(e) {
            clickCount++;
            console.log(`🎯 TEST CLICK ${clickCount}:`, {
                target: e.target.tagName,
                type: e.type,
                bubbles: e.bubbles,
                defaultPrevented: e.defaultPrevented
            });
        };
        
        manageButton.addEventListener('click', testHandler);
        
        // Simulate click
        console.log('Simulating click in 1 second...');
        setTimeout(() => {
            manageButton.click();
            
            // Check modal state after click
            setTimeout(() => {
                if (modal) {
                    console.log('Modal state after click:', {
                        visible: isVisible(modal),
                        display: getComputedStyle(modal).display
                    });
                }
                
                // Remove test handler
                manageButton.removeEventListener('click', testHandler);
            }, 100);
        }, 1000);
        
    } else {
        console.log('❌ Cannot test - button not found');
    }
    
    console.log('\n5️⃣ BODY & PAGE STATE:');
    console.log('======================');
    
    const body = document.body;
    const bodyStyles = getComputedStyle(body);
    
    console.log('Body analysis:');
    console.log('  - Classes:', body.className);
    console.log('  - Has modal-open:', body.classList.contains('modal-open'));
    console.log('  - Overflow:', bodyStyles.overflow);
    console.log('  - Overflow-X:', bodyStyles.overflowX);
    console.log('  - Overflow-Y:', bodyStyles.overflowY);
    console.log('  - Position:', bodyStyles.position);
    
    // Check for backdrop elements
    const backdrops = document.querySelectorAll('.modal-backdrop, .backdrop, [class*="backdrop"]');
    console.log(`Modal backdrops found: ${backdrops.length}`);
    backdrops.forEach((backdrop, i) => {
        console.log(`  Backdrop ${i + 1}:`, {
            classes: backdrop.className,
            visible: isVisible(backdrop),
            zIndex: getComputedStyle(backdrop).zIndex
        });
    });
    
    console.log('\n6️⃣ IMMEDIATE DIAGNOSTIC RESULTS:');
    console.log('=================================');
    
    // Summarize findings
    const findings = [];
    
    if (!manageButton) {
        findings.push('❌ CRITICAL: Manage trainers button not found');
    }
    
    if (!modal) {
        findings.push('❌ CRITICAL: Trainer availability modal not found');
    }
    
    if (body.classList.contains('modal-open')) {
        findings.push('⚠️  WARNING: Body has modal-open class (scroll locked)');
    }
    
    if (bodyStyles.overflow === 'hidden') {
        findings.push('⚠️  WARNING: Body overflow is hidden');
    }
    
    if (!jQueryAvailable) {
        findings.push('⚠️  INFO: jQuery not available (may cause script failures)');
    }
    
    if (findings.length === 0) {
        findings.push('✅ No obvious issues detected');
    }
    
    console.log('Key findings:');
    findings.forEach(finding => console.log(`  ${finding}`));
    
    console.log('\n7️⃣ QUICK FIXES:');
    console.log('================');
    console.log('Copy and run these commands individually:');
    
    console.log('\n// Fix scroll lock:');
    console.log('document.body.classList.remove("modal-open");');
    console.log('document.body.style.overflow = "";');
    
    if (modal) {
        console.log('\n// Force show modal:');
        console.log('document.getElementById("trainer-availability-modal").style.display = "block";');
        console.log('document.getElementById("trainer-availability-modal").style.zIndex = "9999";');
    }
    
    if (jQueryAvailable) {
        console.log('\n// jQuery-based fixes:');
        console.log('$("body").removeClass("modal-open").css("overflow", "");');
        if (modal) {
            console.log('$("#trainer-availability-modal").show();');
        }
    }
    
    console.log('\n// Remove all modal backdrops:');
    console.log('document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());');
    
    console.log('\n8️⃣ ADVANCED DIAGNOSTICS:');
    console.log('=========================');
    
    // Page URL check
    console.log('Current page:', window.location.href);
    console.log('Is admin page:', window.location.href.includes('/wp-admin/'));
    console.log('Is training calendar page:', window.location.href.includes('training-calendar'));
    
    // WordPress-specific checks
    if (typeof window.wp !== 'undefined') {
        console.log('WordPress JS API available:', !!window.wp);
    }
    
    // Check for admin notices that might interfere
    const adminNotices = document.querySelectorAll('.notice, .error, .updated');
    console.log(`Admin notices on page: ${adminNotices.length}`);
    
    console.log('\n🏁 DEBUG COMPLETE!');
    console.log('==================');
    console.log('If issues persist, check the browser console for JavaScript errors');
    console.log('and verify you are on the correct Training Calendar admin page.');
    
})(); 