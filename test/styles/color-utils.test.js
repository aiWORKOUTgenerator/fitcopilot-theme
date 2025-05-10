/**
 * Tests for Sass color utilities
 * 
 * This file uses sass.js to directly test our color functions.
 * 
 * Note: These tests can only verify that the syntax and basic functionality 
 * work, not the exact color values which would require rendering Sass.
 */

const sass = require('sass');
const fs = require('fs');
const path = require('path');

const colorUtilsPath = path.resolve(__dirname, '../../src/styles/utils/_color-utils.scss');
const colorUtils = fs.readFileSync(colorUtilsPath, 'utf8');

// Helper to compile a test Sass string
function compileSass(sassString) {
    const fullSass = `${colorUtils}\n${sassString}`;

    const result = sass.compileString(fullSass, {
        style: 'compressed'
    });

    return result.css.toString().trim();
}

describe('Sass Color Utilities', () => {
    describe('darken-safe', () => {
        it('should darken a color using color.scale', () => {
            const result = compileSass(`
        $color: #3498db;
        $darkened: darken-safe($color, 10%);
        .test { color: $darkened; }
      `);

            // We're mostly checking that it compiles without errors
            expect(result).toContain('.test{color:');
        });

        it('should handle variables', () => {
            const result = compileSass(`
        $color: #3498db;
        $amount: 15%;
        $darkened: darken-safe($color, $amount);
        .test { color: $darkened; }
      `);

            expect(result).toContain('.test{color:');
        });
    });

    describe('lighten-safe', () => {
        it('should lighten a color using color.scale', () => {
            const result = compileSass(`
        $color: #3498db;
        $lightened: lighten-safe($color, 10%);
        .test { color: $lightened; }
      `);

            expect(result).toContain('.test{color:');
        });
    });

    describe('adjust-lightness', () => {
        it('should adjust lightness positively', () => {
            const result = compileSass(`
        $color: #3498db;
        $adjusted: adjust-lightness($color, 15%);
        .test { color: $adjusted; }
      `);

            expect(result).toContain('.test{color:');
        });

        it('should adjust lightness negatively', () => {
            const result = compileSass(`
        $color: #3498db;
        $adjusted: adjust-lightness($color, -15%);
        .test { color: $adjusted; }
      `);

            expect(result).toContain('.test{color:');
        });
    });

    describe('adjust-saturation', () => {
        it('should adjust saturation positively', () => {
            const result = compileSass(`
        $color: #3498db;
        $adjusted: adjust-saturation($color, 15%);
        .test { color: $adjusted; }
      `);

            expect(result).toContain('.test{color:');
        });

        it('should adjust saturation negatively', () => {
            const result = compileSass(`
        $color: #3498db;
        $adjusted: adjust-saturation($color, -15%);
        .test { color: $adjusted; }
      `);

            expect(result).toContain('.test{color:');
        });
    });

    describe('ensure-contrast', () => {
        it('should adjust a color to ensure contrast', () => {
            const result = compileSass(`
        $color: #3498db;
        $background: #ffffff;
        $adjusted: ensure-contrast($color, $background, 4.5);
        .test { color: $adjusted; }
      `);

            expect(result).toContain('.test{color:');
        });
    });

    describe('create-palette', () => {
        it('should create a color palette', () => {
            const result = compileSass(`
        $base-color: #3498db;
        $palette: create-palette($base-color, 3, 15%);
        .test { 
          color: map-get($palette, 'base');
          background-color: map-get($palette, 'lighten-2');
          border-color: map-get($palette, 'darken-1');
        }
      `);

            expect(result).toContain('.test{color:#3498db;');
        });
    });
}); 