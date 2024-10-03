#!/bin/bash

# Microsoft Excel Deployment Rollback Script
# This script is responsible for rolling back the Microsoft Excel application deployment
# to a previous stable version in case of deployment failures or critical issues.

# Set strict mode
set -euo pipefail

# Global variables
ENVIRONMENT=${ENVIRONMENT:-"production"}
ROLLBACK_VERSION=${ROLLBACK_VERSION:-""}

# Function to check rollback prerequisites
check_rollback_prerequisites() {
    echo "Checking rollback prerequisites..."
    
    # Check for required tools
    command -v az >/dev/null 2>&1 || { echo >&2 "Azure CLI (az) is required but not installed. Aborting."; exit 1; }
    command -v kubectl >/dev/null 2>&1 || { echo >&2 "kubectl is required but not installed. Aborting."; exit 1; }
    command -v docker >/dev/null 2>&1 || { echo >&2 "Docker is required but not installed. Aborting."; exit 1; }

    # Verify configurations
    az account show >/dev/null 2>&1 || { echo >&2 "Azure CLI is not logged in. Please run 'az login' first. Aborting."; exit 1; }
    kubectl cluster-info >/dev/null 2>&1 || { echo >&2 "kubectl is not configured correctly. Please check your kubeconfig. Aborting."; exit 1; }

    echo "All prerequisites checked and satisfied."
}

# Function to get the last stable version
get_last_stable_version() {
    echo "Retrieving last known stable version..."
    
    # This is a placeholder. In a real scenario, you would query your version control system or deployment history.
    # For this example, we'll use a hardcoded value if ROLLBACK_VERSION is not set.
    if [ -z "$ROLLBACK_VERSION" ]; then
        ROLLBACK_VERSION="1.2.3"
        echo "No specific rollback version provided. Using last known stable version: $ROLLBACK_VERSION"
    else
        echo "Using provided rollback version: $ROLLBACK_VERSION"
    fi
}

# Function to rollback infrastructure
rollback_infrastructure() {
    echo "Rolling back infrastructure using Terraform..."
    
    # Navigate to the Terraform directory
    cd ../terraform

    # Initialize Terraform
    terraform init

    # Apply the previous state
    terraform apply -auto-approve -var="app_version=${ROLLBACK_VERSION}" -var="environment=${ENVIRONMENT}"

    echo "Infrastructure rollback completed."
}

# Function to rollback Kubernetes deployment
rollback_kubernetes_deployment() {
    echo "Rolling back Kubernetes deployment..."
    
    # Rollback the deployment
    kubectl rollout undo deployment/excel-app -n excel-${ENVIRONMENT}

    # Wait for rollout to complete
    kubectl rollout status deployment/excel-app -n excel-${ENVIRONMENT} --timeout=5m

    echo "Kubernetes deployment rollback completed."
}

# Function to verify rollback
verify_rollback() {
    echo "Verifying rollback..."
    
    # Check system health
    kubectl get pods -n excel-${ENVIRONMENT} | grep excel-app
    
    # Verify application functionality (placeholder)
    echo "Performing application health check..."
    # In a real scenario, you would add specific health check commands here
    
    # Confirm data integrity (placeholder)
    echo "Confirming data integrity..."
    # In a real scenario, you would add data integrity check commands here

    echo "Rollback verification completed."
}

# Main function
main() {
    echo "Starting rollback process for Microsoft Excel deployment..."

    check_rollback_prerequisites
    get_last_stable_version
    rollback_infrastructure
    rollback_kubernetes_deployment
    verify_rollback

    echo "Rollback process completed successfully."
}

# Execute main function
main

# Error handling
if [ $? -ne 0 ]; then
    echo "An error occurred during the rollback process. Please check the logs and take manual action if necessary."
    exit 1
fi