# Azure Infrastructure Module for Microsoft Excel Project

# Provider configuration
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Variables
variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
}

variable "location" {
  description = "Azure region for resource deployment"
  type        = string
}

variable "app_service_plan_name" {
  description = "Name of the App Service Plan"
  type        = string
}

variable "app_service_name" {
  description = "Name of the App Service"
  type        = string
}

# Resource Group
resource "azurerm_resource_group" "excel_rg" {
  name     = var.resource_group_name
  location = var.location
}

# App Service Plan
resource "azurerm_app_service_plan" "excel_plan" {
  name                = var.app_service_plan_name
  location            = azurerm_resource_group.excel_rg.location
  resource_group_name = azurerm_resource_group.excel_rg.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Standard"
    size = "S1"
  }
}

# App Service
resource "azurerm_app_service" "excel_app" {
  name                = var.app_service_name
  location            = azurerm_resource_group.excel_rg.location
  resource_group_name = azurerm_resource_group.excel_rg.name
  app_service_plan_id = azurerm_app_service_plan.excel_plan.id

  site_config {
    linux_fx_version = "NODE|14-lts"
    always_on        = true
  }

  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "14.15.1"
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
  }
}

# Azure SQL Database
resource "azurerm_sql_server" "excel_sql_server" {
  name                         = "excel-sql-server"
  resource_group_name          = azurerm_resource_group.excel_rg.name
  location                     = azurerm_resource_group.excel_rg.location
  version                      = "12.0"
  administrator_login          = "sqladmin"
  administrator_login_password = "P@ssw0rd1234!" # Note: In a real-world scenario, use a more secure way to manage passwords
}

resource "azurerm_sql_database" "excel_db" {
  name                = "excel-db"
  resource_group_name = azurerm_resource_group.excel_rg.name
  location            = azurerm_resource_group.excel_rg.location
  server_name         = azurerm_sql_server.excel_sql_server.name
  edition             = "Standard"
  collation           = "SQL_Latin1_General_CP1_CI_AS"
  max_size_gb         = 250
  create_mode         = "Default"
}

# Azure Blob Storage
resource "azurerm_storage_account" "excel_storage" {
  name                     = "excelstorage"
  resource_group_name      = azurerm_resource_group.excel_rg.name
  location                 = azurerm_resource_group.excel_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "excel_container" {
  name                  = "excelfiles"
  storage_account_name  = azurerm_storage_account.excel_storage.name
  container_access_type = "private"
}

# Azure Redis Cache
resource "azurerm_redis_cache" "excel_redis" {
  name                = "excel-redis"
  location            = azurerm_resource_group.excel_rg.location
  resource_group_name = azurerm_resource_group.excel_rg.name
  capacity            = 1
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"
}

# Azure Key Vault
resource "azurerm_key_vault" "excel_keyvault" {
  name                        = "excel-keyvault"
  location                    = azurerm_resource_group.excel_rg.location
  resource_group_name         = azurerm_resource_group.excel_rg.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false

  sku_name = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Get",
    ]

    secret_permissions = [
      "Get",
    ]

    storage_permissions = [
      "Get",
    ]
  }
}

# Azure Application Insights
resource "azurerm_application_insights" "excel_insights" {
  name                = "excel-insights"
  location            = azurerm_resource_group.excel_rg.location
  resource_group_name = azurerm_resource_group.excel_rg.name
  application_type    = "web"
}

# Data source for current Azure configuration
data "azurerm_client_config" "current" {}

# Outputs
output "app_service_url" {
  value = azurerm_app_service.excel_app.default_site_hostname
}

output "sql_server_fqdn" {
  value = azurerm_sql_server.excel_sql_server.fully_qualified_domain_name
}

output "storage_account_name" {
  value = azurerm_storage_account.excel_storage.name
}

output "redis_cache_hostname" {
  value = azurerm_redis_cache.excel_redis.hostname
}

output "key_vault_uri" {
  value = azurerm_key_vault.excel_keyvault.vault_uri
}

output "application_insights_instrumentation_key" {
  value = azurerm_application_insights.excel_insights.instrumentation_key
}