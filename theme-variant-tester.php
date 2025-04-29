<?php
/**
 * Template Name: Theme Variant Tester
 * 
 * A simple page for testing different theme variants with live switching capability.
 */

get_header();
?>

<div class="theme-tester-container" style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">
    <h1 style="text-align: center; margin-bottom: 30px;">Theme Variant Tester</h1>
    
    <div class="variant-selector" style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
        <h2>Select Theme Variant</h2>
        <div class="variant-buttons" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
            <?php
            $variants = fitcopilot_get_theme_variants();
            $current_variant = get_theme_mod('fitcopilot_theme_variant', 'default');
            
            foreach ($variants as $variant_key => $variant_name) {
                $is_active = ($variant_key === $current_variant);
                ?>
                <button 
                    class="variant-button <?php echo $is_active ? 'active' : ''; ?>"
                    data-variant="<?php echo esc_attr($variant_key); ?>"
                    style="padding: 8px 16px; border: 1px solid #ddd; background: <?php echo $is_active ? '#a3e635' : '#fff'; ?>; 
                           color: <?php echo $is_active ? '#111827' : '#333'; ?>; border-radius: 4px; cursor: pointer;"
                >
                    <?php echo esc_html($variant_name); ?>
                    <?php if ($is_active) echo ' (Active)'; ?>
                </button>
                <?php
            }
            ?>
        </div>
    </div>
    
    <div class="test-components">
        <h2>Component Preview</h2>
        
        <!-- Button Components -->
        <div class="component-section" style="margin: 30px 0; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
            <h3>Buttons</h3>
            <div style="display: flex; gap: 15px; margin-top: 15px;">
                <button class="button button--primary">Primary Button</button>
                <button class="button button--secondary">Secondary Button</button>
                <button class="button" disabled>Disabled Button</button>
            </div>
        </div>
        
        <!-- Color Palette -->
        <div class="component-section" style="margin: 30px 0; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
            <h3>Color Palette</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
                <div style="text-align: center;">
                    <div style="width: 100px; height: 100px; background: var(--color-primary); border-radius: 5px;"></div>
                    <p>Primary</p>
                </div>
                <div style="text-align: center;">
                    <div style="width: 100px; height: 100px; background: var(--color-primary-dark); border-radius: 5px;"></div>
                    <p>Primary Dark</p>
                </div>
                <div style="text-align: center;">
                    <div style="width: 100px; height: 100px; background: var(--color-secondary); border-radius: 5px;"></div>
                    <p>Secondary</p>
                </div>
                <div style="text-align: center;">
                    <div style="width: 100px; height: 100px; background: var(--color-secondary-dark); border-radius: 5px;"></div>
                    <p>Secondary Dark</p>
                </div>
                <div style="text-align: center;">
                    <div style="width: 100px; height: 100px; background: var(--color-background); border-radius: 5px;"></div>
                    <p>Background</p>
                </div>
                <div style="text-align: center;">
                    <div style="width: 100px; height: 100px; background: var(--color-background-light); border-radius: 5px;"></div>
                    <p>Background Light</p>
                </div>
            </div>
        </div>
        
        <!-- Gradients -->
        <div class="component-section" style="margin: 30px 0; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
            <h3>Gradients</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
                <div style="text-align: center;">
                    <div style="width: 200px; height: 100px; background: var(--gradient-primary); border-radius: 5px;"></div>
                    <p>Primary Gradient</p>
                </div>
                <div style="text-align: center;">
                    <div style="width: 200px; height: 100px; background: var(--gradient-button); border-radius: 5px;"></div>
                    <p>Button Gradient</p>
                </div>
            </div>
        </div>
        
        <!-- Typography -->
        <div class="component-section" style="margin: 30px 0; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
            <h3>Typography</h3>
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>Regular paragraph text. The quick brown fox jumps over the lazy dog.</p>
            <p><strong>Bold text</strong> and <em>italic text</em> examples.</p>
            <a href="#">Link styling</a>
        </div>
        
        <!-- Custom Property Values -->
        <div class="component-section" style="margin: 30px 0; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
            <h3>CSS Variable Values</h3>
            <div id="css-variables-display" style="font-family: monospace; margin-top: 15px;">
                Loading CSS variables...
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Handle variant switching
        const variantButtons = document.querySelectorAll('.variant-button');
        
        variantButtons.forEach(button => {
            button.addEventListener('click', function() {
                const variant = this.getAttribute('data-variant');
                
                // Update body data attribute
                document.body.setAttribute('data-theme', variant);
                
                // Visual feedback in button UI
                variantButtons.forEach(btn => {
                    btn.style.background = '#fff';
                    btn.style.color = '#333';
                    btn.classList.remove('active');
                });
                
                this.style.background = '#a3e635';
                this.style.color = '#111827';
                this.classList.add('active');
                
                // Display CSS variable values for the selected variant
                displayCSSVariables();
            });
        });
        
        // Display CSS variable values
        function displayCSSVariables() {
            const cssVarsDisplay = document.getElementById('css-variables-display');
            const computedStyle = getComputedStyle(document.documentElement);
            
            const cssVars = [
                '--color-primary',
                '--color-primary-dark',
                '--color-secondary',
                '--color-secondary-dark',
                '--color-text-primary',
                '--color-text-secondary',
                '--color-background',
                '--color-background-light',
                '--color-border',
                '--gradient-primary',
                '--gradient-button',
                '--shadow-primary',
                '--transition-fast',
                '--transition-medium',
                '--transition-slow'
            ];
            
            let html = '';
            
            cssVars.forEach(variable => {
                const value = computedStyle.getPropertyValue(variable).trim();
                html += `<div style="margin-bottom: 8px;"><strong>${variable}:</strong> <span style="color: #0066cc;">${value}</span></div>`;
            });
            
            cssVarsDisplay.innerHTML = html;
        }
        
        // Initial display of CSS variables
        displayCSSVariables();
    });
</script>

<?php
get_footer();
?> 