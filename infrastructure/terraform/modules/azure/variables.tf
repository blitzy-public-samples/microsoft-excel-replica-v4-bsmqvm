variable "azure_region" {
  type        = string
  description = "The Azure region where resources will be created"
}

# Resource Group
variable "resource_group_name" {
  type        = string
  description = "The name of the Azure Resource Group"
}

# App Service Plan
variable "app_service_plan_tier" {
  type        = string
  description = "The tier of App Service Plan (e.g., Standard, Premium)"
}

variable "app_service_plan_size" {
  type        = string
  description = "The size of the App Service Plan (e.g., S1, P1v2)"
}

# Azure SQL Database
variable "sql_database_edition" {
  type        = string
  description = "The edition of Azure SQL Database (e.g., Basic, Standard, Premium)"
}

# Azure Storage Account
variable "storage_account_tier" {
  type        = string
  description = "The tier of Azure Storage Account (e.g., Standard, Premium)"
}

variable "storage_account_replication_type" {
  type        = string
  description = "The replication type for the Storage Account (e.g., LRS, GRS)"
}

# Azure Key Vault
variable "key_vault_sku" {
  type        = string
  description = "The SKU of the Azure Key Vault (e.g., standard, premium)"
}

# Tags
variable "tags" {
  type        = map(string)
  description = "A mapping of tags to assign to the resources"
}

# Additional variables for Excel-specific resources

variable "excel_web_app_name" {
  type        = string
  description = "The name of the Azure Web App for Excel Online"
}

variable "excel_function_app_name" {
  type        = string
  description = "The name of the Azure Function App for Excel background processing"
}

variable "excel_cosmos_db_account_name" {
  type        = string
  description = "The name of the Azure Cosmos DB account for Excel data storage"
}

variable "excel_signalr_service_name" {
  type        = string
  description = "The name of the Azure SignalR Service for real-time collaboration"
}

variable "excel_cognitive_services_name" {
  type        = string
  description = "The name of the Azure Cognitive Services account for AI-powered features"
}

variable "excel_app_insights_name" {
  type        = string
  description = "The name of the Application Insights resource for monitoring Excel services"
}

variable "excel_cdn_profile_name" {
  type        = string
  description = "The name of the Azure CDN profile for content delivery"
}

variable "excel_redis_cache_name" {
  type        = string
  description = "The name of the Azure Redis Cache for caching and session management"
}

variable "excel_search_service_name" {
  type        = string
  description = "The name of the Azure Cognitive Search service for advanced data search capabilities"
}

variable "excel_event_hub_namespace" {
  type        = string
  description = "The name of the Azure Event Hub namespace for event-driven architecture"
}

# Security and Compliance
variable "enable_advanced_threat_protection" {
  type        = bool
  description = "Enable Advanced Threat Protection for Azure SQL Database"
  default     = true
}

variable "enable_azure_ad_authentication" {
  type        = bool
  description = "Enable Azure AD authentication for Azure resources"
  default     = true
}

variable "enable_private_endpoints" {
  type        = bool
  description = "Enable private endpoints for enhanced network security"
  default     = true
}

# Scalability
variable "enable_autoscale" {
  type        = bool
  description = "Enable autoscaling for App Service Plan"
  default     = true
}

variable "min_capacity" {
  type        = number
  description = "Minimum number of instances for autoscaling"
  default     = 2
}

variable "max_capacity" {
  type        = number
  description = "Maximum number of instances for autoscaling"
  default     = 10
}

# Backup and Disaster Recovery
variable "enable_geo_redundancy" {
  type        = bool
  description = "Enable geo-redundancy for Azure SQL Database and Storage Account"
  default     = true
}

variable "backup_retention_days" {
  type        = number
  description = "Number of days to retain backups"
  default     = 30
}

# Monitoring and Logging
variable "log_analytics_workspace_name" {
  type        = string
  description = "The name of the Log Analytics workspace for centralized logging"
}

variable "enable_diagnostic_settings" {
  type        = bool
  description = "Enable diagnostic settings for Azure resources"
  default     = true
}