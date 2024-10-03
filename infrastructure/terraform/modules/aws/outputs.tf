# This file defines the output values for the AWS module in the Terraform configuration
# for the Microsoft Excel project's infrastructure.

output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "List of IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "List of IDs of private subnets"
  value       = aws_subnet.private[*].id
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "rds_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = aws_db_instance.excel_db.endpoint
}

output "elasticache_address" {
  description = "Address of the ElastiCache cluster"
  value       = aws_elasticache_cluster.excel_cache.cache_nodes[0].address
}