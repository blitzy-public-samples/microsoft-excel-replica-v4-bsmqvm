# Output values for the Azure Terraform module

output "resource_group_name" {
  value       = azurerm_resource_group.excel_rg.name
  description = "The name of the Azure Resource Group"
}

output "app_service_plan_id" {
  value       = azurerm_app_service_plan.excel_asp.id
  description = "The ID of the App Service Plan"
}

output "app_service_name" {
  value       = azurerm_app_service.excel_as.name
  description = "The name of the App Service"
}

output "sql_server_name" {
  value       = azurerm_sql_server.excel_sql.name
  description = "The name of the Azure SQL Server"
}

output "sql_database_name" {
  value       = azurerm_sql_database.excel_db.name
  description = "The name of the Azure SQL Database"
}