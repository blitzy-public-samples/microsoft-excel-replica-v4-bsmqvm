# General Variables
variable "environment" {
  type        = string
  description = "The deployment environment (e.g., dev, staging, prod)"
}

# Azure Variables
variable "azure_region" {
  type        = string
  description = "The Azure region to deploy resources"
  default     = "eastus"
}

variable "azure_app_service_sku" {
  type        = string
  description = "The SKU for Azure App Service"
  default     = "P1v2"
}

# AWS Variables
variable "aws_region" {
  type        = string
  description = "The AWS region to deploy resources"
  default     = "us-east-1"
}

variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the AWS VPC"
  default     = "10.0.0.0/16"
}

variable "aws_instance_type" {
  type        = string
  description = "The instance type for AWS EC2 instances"
  default     = "t3.medium"
}

# Database Variables
variable "db_username" {
  type        = string
  description = "The username for database access"
  sensitive   = true
}

variable "db_password" {
  type        = string
  description = "The password for database access"
  sensitive   = true
}

# Usage Instructions
# To use these variables, you can either set them in a `terraform.tfvars` file or pass them as command-line arguments when running Terraform commands.
# For sensitive variables like `db_username` and `db_password`, it's recommended to use environment variables or a secure secret management system.

# Example usage in terraform.tfvars:
# environment = "staging"
# azure_region = "westeurope"
# aws_region = "eu-west-1"
# vpc_cidr = "10.1.0.0/16"
# azure_app_service_sku = "P2v2"
# aws_instance_type = "t3.large"