# Main Terraform configuration file for Microsoft Excel's cloud infrastructure

# Configure the required providers
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  # Configure the backend to store Terraform state in Azure Blob Storage
  backend "azurerm" {
    resource_group_name  = "excel-terraform-state-rg"
    storage_account_name = "excelterraformstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}

# Configure the Azure provider
provider "azurerm" {
  features {}
}

# Configure the AWS provider
provider "aws" {
  region = var.aws_region
}

# Configure the random provider
provider "random" {}

# Generate a random string for resource naming
resource "random_string" "resource_code" {
  length  = 5
  special = false
  upper   = false
}

# Create an Azure Resource Group
resource "azurerm_resource_group" "excel_rg" {
  name     = "excel-resources-${random_string.resource_code.result}"
  location = var.azure_location
}

# Create an AWS VPC
resource "aws_vpc" "excel_vpc" {
  cidr_block = var.aws_vpc_cidr

  tags = {
    Name = "excel-vpc-${random_string.resource_code.result}"
  }
}

# Call the Azure module to set up Azure-specific resources
module "azure" {
  source      = "./modules/azure"
  environment = var.environment
  rg_name     = azurerm_resource_group.excel_rg.name
  location    = azurerm_resource_group.excel_rg.location
}

# Call the AWS module to set up AWS-specific resources
module "aws" {
  source      = "./modules/aws"
  environment = var.environment
  vpc_id      = aws_vpc.excel_vpc.id
}

# Output important information
output "azure_resource_group_name" {
  value = azurerm_resource_group.excel_rg.name
}

output "aws_vpc_id" {
  value = aws_vpc.excel_vpc.id
}

output "azure_module_outputs" {
  value = module.azure
}

output "aws_module_outputs" {
  value = module.aws
}