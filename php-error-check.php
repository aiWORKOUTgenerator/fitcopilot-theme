<?php
/**
 * PHP Error Check
 * 
 * This file is a diagnostics tool to check for PHP errors in theme functions.
 * Access this file directly in the browser to see the output.
 */

// Load WordPress environment
require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/wp-load.php';

// Header output for clarity
echo '<h1>FitCopilot Theme PHP Error Check</h1>';

// Test 1: Check if body_attributes filter is registered
echo '<h2>Test 1: body_attributes filter</h2>';
echo '<pre>';
$attributes = apply_filters('body_attributes', []);
echo "Result of apply_filters('body_attributes', []):\n";
var_dump($attributes);
echo '</pre>';

// Test 2: Check fitcopilot_body_attributes function
echo '<h2>Test 2: fitcopilot_body_attributes function</h2>';
echo '<pre>';
if (function_exists('fitcopilot_body_attributes')) {
    $test_result = fitcopilot_body_attributes([]);
    echo "Result of fitcopilot_body_attributes([]):\n";
    var_dump($test_result);
} else {
    echo "Function fitcopilot_body_attributes does not exist\n";
}
echo '</pre>';

// Test 3: Check body_class filter
echo '<h2>Test 3: body_class filter</h2>';
echo '<pre>';
$classes = apply_filters('body_class', []);
echo "Result of apply_filters('body_class', []):\n";
var_dump($classes);
echo '</pre>';

// Test 4: Check fitcopilot_add_body_data_theme function
echo '<h2>Test 4: fitcopilot_add_body_data_theme function</h2>';
echo '<pre>';
if (function_exists('fitcopilot_add_body_data_theme')) {
    $test_result = fitcopilot_add_body_data_theme([]);
    echo "Result of fitcopilot_add_body_data_theme([]):\n";
    var_dump($test_result);
} else {
    echo "Function fitcopilot_add_body_data_theme does not exist\n";
}
echo '</pre>';

// Test 5: Check fitcopilot_output_body_attributes function
echo '<h2>Test 5: fitcopilot_output_body_attributes function</h2>';
echo '<pre>';
if (function_exists('fitcopilot_output_body_attributes')) {
    echo "Result of fitcopilot_output_body_attributes():\n";
    ob_start();
    fitcopilot_output_body_attributes();
    $output = ob_get_clean();
    echo "Output: " . htmlspecialchars($output) . "\n";
} else {
    echo "Function fitcopilot_output_body_attributes does not exist\n";
}
echo '</pre>'; 