#!/bin/bash

# Microsoft Excel Project - Comprehensive Test Runner
# This script runs all tests for the Microsoft Excel project across various components and platforms.

# Set error handling
set -e

# Function to run tests and handle errors
run_test_suite() {
    echo "Running $1 tests..."
    if npm run $2; then
        echo "$1 tests completed successfully."
    else
        echo "Error: $1 tests failed. Please check the test output for details."
        exit 1
    fi
}

# Main function to orchestrate all test suites
main() {
    echo "Starting comprehensive test suite for Microsoft Excel..."

    # Unit Tests
    run_test_suite "unit" "test:unit"

    # Integration Tests
    run_test_suite "integration" "test:integration"

    # End-to-End Tests
    run_test_suite "end-to-end" "test:e2e"

    # Performance Tests
    run_test_suite "performance" "test:performance"

    # Security Tests
    run_test_suite "security" "test:security"

    # Accessibility Tests
    run_test_suite "accessibility" "test:accessibility"

    # Localization Tests
    run_test_suite "localization" "test:localization"

    # API Tests
    run_test_suite "API" "test:api"

    # Add-in Compatibility Tests
    run_test_suite "add-in compatibility" "test:add-ins"

    # Collaboration Tests
    run_test_suite "collaboration" "test:collaboration"

    # Data Access Tests
    run_test_suite "data access" "test:data-access"

    echo "All tests completed successfully."
}

# Run the main function
main

exit 0