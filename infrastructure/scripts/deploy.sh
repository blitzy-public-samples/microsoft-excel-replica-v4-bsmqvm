#!/bin/bash

# Microsoft Excel Deployment Script
# This script automates the deployment process of the Microsoft Excel application across various environments.

set -e

# Global variables
ENVIRONMENT=${ENVIRONMENT:-"production"}
VERSION=${VERSION:-"latest"}

# Function to check prerequisites
check_prerequisites() {
    echo "Checking prerequisites..."
    
    # Check for required tools
    command -v az >/dev/null 2>&1 || { echo >&2 "Azure CLI is required but not installed. Aborting."; exit 1; }
    command -v kubectl >/dev/null 2>&1 || { echo >&2 "kubectl is required but not installed. Aborting."; exit 1; }
    command -v docker >/dev/null 2>&1 || { echo >&2 "Docker is required but not installed. Aborting."; exit 1; }
    
    # Verify environment variables
    [[ -z "$AZURE_SUBSCRIPTION_ID" ]] && { echo >&2 "AZURE_SUBSCRIPTION_ID is not set. Aborting."; exit 1; }
    [[ -z "$AZURE_RESOURCE_GROUP" ]] && { echo >&2 "AZURE_RESOURCE_GROUP is not set. Aborting."; exit 1; }
    
    echo "All prerequisites met."
}

# Function to deploy infrastructure
deploy_infrastructure() {
    echo "Deploying infrastructure using Terraform..."
    
    cd ../terraform
    
    terraform init
    terraform plan -out=tfplan -var="environment=${ENVIRONMENT}"
    terraform apply tfplan
    
    cd ../scripts
    
    echo "Infrastructure deployment completed."
}

# Function to build and push containers
build_and_push_containers() {
    echo "Building and pushing Docker containers..."
    
    # Assuming we have a container registry, replace with actual registry URL
    REGISTRY_URL="excelregistry.azurecr.io"
    
    docker build -t ${REGISTRY_URL}/excel-api:${VERSION} -f ../docker/Dockerfile.api ../../src/backend-api
    docker build -t ${REGISTRY_URL}/excel-web:${VERSION} -f ../docker/Dockerfile.web ../../src/frontend-web
    
    docker push ${REGISTRY_URL}/excel-api:${VERSION}
    docker push ${REGISTRY_URL}/excel-web:${VERSION}
    
    echo "Container build and push completed."
}

# Function to deploy to Kubernetes
deploy_to_kubernetes() {
    echo "Deploying to Kubernetes..."
    
    kubectl apply -f ../kubernetes/deployment.yaml
    kubectl apply -f ../kubernetes/service.yaml
    kubectl apply -f ../kubernetes/ingress.yaml
    
    echo "Waiting for pods to be ready..."
    kubectl wait --for=condition=ready pod -l app=excel-app --timeout=300s
    
    echo "Kubernetes deployment completed."
}

# Function to run post-deployment tests
run_post_deployment_tests() {
    echo "Running post-deployment tests..."
    
    # Add your post-deployment test commands here
    # For example:
    # npm run test:e2e
    
    echo "Post-deployment tests completed."
}

# Main function
main() {
    echo "Starting deployment process for Microsoft Excel (${ENVIRONMENT} environment, version ${VERSION})..."
    
    check_prerequisites
    deploy_infrastructure
    build_and_push_containers
    deploy_to_kubernetes
    run_post_deployment_tests
    
    echo "Deployment process completed successfully."
}

# Execute main function
main

# Error handling
if [ $? -ne 0 ]; then
    echo "Deployment failed. Rolling back..."
    ./rollback.sh
    exit 1
fi