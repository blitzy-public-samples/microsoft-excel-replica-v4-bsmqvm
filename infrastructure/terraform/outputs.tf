# This file defines the outputs for the Terraform configuration used to provision
# and manage the cloud infrastructure for Microsoft Excel's online services.

# Azure Resources
output "azure_resource_group_name" {
  description = "The name of the Azure Resource Group created for Excel resources."
  value       = azurerm_resource_group.excel_rg.name
}

output "azure_app_service_url" {
  description = "The URL of the Azure App Service hosting Excel Online."
  value       = module.azure.app_service_url
}

output "excel_storage_account_name" {
  description = "The name of the Azure Storage Account used for Excel file storage."
  value       = module.azure.storage_account_name
}

# AWS Resources
output "aws_vpc_id" {
  description = "The ID of the AWS VPC created for Excel resources."
  value       = aws_vpc.excel_vpc.id
}

output "aws_ecs_cluster_name" {
  description = "The name of the AWS ECS cluster hosting Excel services."
  value       = module.aws.ecs_cluster_name
}

# Sensitive Outputs
output "excel_database_connection_string" {
  description = "The connection string for the Excel database."
  value       = module.azure.database_connection_string
  sensitive   = true
}

# Additional Information
# Some outputs, such as the database connection string, are marked as sensitive
# to ensure they are not displayed in console output or logged. These values can
# still be accessed programmatically or through specific Terraform commands.

# The outputs provide information about resources in both Azure and AWS,
# supporting the cross-platform nature of the Excel infrastructure. This allows
# for easy access to key information regardless of the cloud provider being used.

# These outputs can be used in various operational scenarios, such as:
# - Configuring deployment scripts
# - Setting up monitoring and alerting systems
# - Providing necessary information for application configuration
# - Facilitating troubleshooting and support activities