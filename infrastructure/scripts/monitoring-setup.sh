#!/bin/bash

# Microsoft Excel Cloud-Based Components Monitoring Setup Script
# This script sets up and configures the monitoring infrastructure for Microsoft Excel's cloud-based components and services.

# Set environment variables
ENVIRONMENT=${1:-production}
AZURE_RESOURCE_GROUP="rg-excel-${ENVIRONMENT}"
AWS_REGION=${2:-us-west-2}

# Function to set up Azure Monitor
setup_azure_monitoring() {
    echo "Setting up Azure Monitor..."
    
    # Create an Azure Log Analytics workspace
    workspace_name="log-excel-${ENVIRONMENT}"
    az monitor log-analytics workspace create \
        --resource-group $AZURE_RESOURCE_GROUP \
        --workspace-name $workspace_name \
        --location eastus

    # Enable Azure Monitor for VMs
    az monitor vm-insights enable \
        --resource-group $AZURE_RESOURCE_GROUP \
        --workspace $workspace_name

    # Set up Application Insights for web apps
    webapp_name="webapp-excel-${ENVIRONMENT}"
    az monitor app-insights component create \
        --app $webapp_name \
        --location eastus \
        --kind web \
        --resource-group $AZURE_RESOURCE_GROUP \
        --application-type web

    # Create alert rules
    az monitor metrics alert create \
        --name "High CPU Usage Alert" \
        --resource-group $AZURE_RESOURCE_GROUP \
        --scopes "/subscriptions/${AZURE_SUBSCRIPTION_ID}/resourceGroups/${AZURE_RESOURCE_GROUP}" \
        --condition "avg Percentage CPU > 80" \
        --window-size 5m \
        --evaluation-frequency 1m \
        --action "/subscriptions/${AZURE_SUBSCRIPTION_ID}/resourceGroups/${AZURE_RESOURCE_GROUP}/providers/Microsoft.Insights/actionGroups/emailActionGroup"

    echo "Azure Monitor setup completed."
}

# Function to set up AWS CloudWatch
setup_aws_monitoring() {
    echo "Setting up AWS CloudWatch..."

    # Create a CloudWatch alarm for CPU utilization
    aws cloudwatch put-metric-alarm \
        --alarm-name "High CPU Usage Alarm" \
        --alarm-description "Alarm when CPU exceeds 80% for 5 minutes" \
        --metric-name CPUUtilization \
        --namespace AWS/EC2 \
        --statistic Average \
        --period 300 \
        --threshold 80 \
        --comparison-operator GreaterThanThreshold \
        --dimensions Name=InstanceId,Value=i-12345678 \
        --evaluation-periods 1 \
        --alarm-actions arn:aws:sns:${AWS_REGION}:${AWS_ACCOUNT_ID}:ExcelAlerts \
        --region $AWS_REGION

    # Enable detailed monitoring for EC2 instances
    aws ec2 monitor-instances --instance-ids i-12345678 --region $AWS_REGION

    # Create a CloudWatch dashboard
    aws cloudwatch put-dashboard \
        --dashboard-name "ExcelServicesDashboard" \
        --dashboard-body file://cloudwatch-dashboard.json \
        --region $AWS_REGION

    echo "AWS CloudWatch setup completed."
}

# Function to set up Prometheus
setup_prometheus() {
    echo "Setting up Prometheus..."

    # Apply Kubernetes configuration for Prometheus
    kubectl apply -f prometheus-config.yaml

    # Set up Prometheus Operator
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    helm install prometheus prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --create-namespace \
        --set grafana.enabled=false

    echo "Prometheus setup completed."
}

# Function to set up Grafana
setup_grafana() {
    echo "Setting up Grafana..."

    # Apply Kubernetes deployment for Grafana
    kubectl apply -f grafana-deployment.yaml

    # Set up Grafana using Helm
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo update
    helm install grafana grafana/grafana \
        --namespace monitoring \
        --set persistence.enabled=true \
        --set persistence.size=10Gi \
        --set service.type=LoadBalancer

    # Configure Grafana datasources
    kubectl apply -f grafana-datasources.yaml

    echo "Grafana setup completed."
}

# Main function to orchestrate the setup
main() {
    echo "Starting monitoring setup for Microsoft Excel cloud-based components..."

    # Set up Azure monitoring
    setup_azure_monitoring

    # Set up AWS CloudWatch
    setup_aws_monitoring

    # Set up Prometheus
    setup_prometheus

    # Set up Grafana
    setup_grafana

    echo "Monitoring setup completed successfully."
}

# Execute the main function
main

# Error handling
if [ $? -ne 0 ]; then
    echo "An error occurred during the monitoring setup. Please check the logs and try again."
    exit 1
fi

exit 0