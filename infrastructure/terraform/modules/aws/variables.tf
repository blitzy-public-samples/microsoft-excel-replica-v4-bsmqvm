variable "aws_region" {
  description = "The AWS region where resources will be created"
  type        = string
  default     = "us-west-2"
}

# VPC CIDR
variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# Public Subnet CIDRs
variable "public_subnet_cidrs" {
  description = "List of CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

# Private Subnet CIDRs
variable "private_subnet_cidrs" {
  description = "List of CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

# Availability Zones
variable "availability_zones" {
  description = "List of availability zones in the region"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b"]
}

# EC2 Instance Type
variable "instance_type" {
  description = "EC2 instance type for the application servers"
  type        = string
  default     = "t3.micro"
}

# RDS Instance Class
variable "rds_instance_class" {
  description = "RDS instance class for the database"
  type        = string
  default     = "db.t3.micro"
}

# RDS Engine Version
variable "rds_engine_version" {
  description = "Version of the database engine"
  type        = string
  default     = "13.7"
}

# Environment
variable "environment" {
  description = "Deployment environment (e.g., dev, staging, production)"
  type        = string
  default     = "dev"
}

# Project Name
variable "project_name" {
  description = "Name of the project, used for tagging resources"
  type        = string
  default     = "microsoft-excel"
}

# EC2 Key Pair
variable "key_name" {
  description = "Name of the EC2 key pair to use for SSH access"
  type        = string
}

# Allowed CIDR Blocks
variable "allowed_cidr_blocks" {
  description = "List of CIDR blocks allowed to access the resources"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# ECS Task CPU
variable "ecs_task_cpu" {
  description = "The amount of CPU to allocate for the ECS task"
  type        = number
  default     = 256
}

# ECS Task Memory
variable "ecs_task_memory" {
  description = "The amount of memory to allocate for the ECS task"
  type        = number
  default     = 512
}

# ECS Service Desired Count
variable "ecs_service_desired_count" {
  description = "The desired number of instances of the task definition to place and keep running"
  type        = number
  default     = 2
}

# RDS Database Name
variable "rds_database_name" {
  description = "The name of the database to create when the DB instance is created"
  type        = string
  default     = "exceldb"
}

# RDS Username
variable "rds_username" {
  description = "Username for the master DB user"
  type        = string
  sensitive   = true
}

# RDS Password
variable "rds_password" {
  description = "Password for the master DB user"
  type        = string
  sensitive   = true
}

# ElastiCache Node Type
variable "elasticache_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

# ElastiCache Number of Nodes
variable "elasticache_num_cache_nodes" {
  description = "Number of cache nodes in the ElastiCache cluster"
  type        = number
  default     = 1
}

# S3 Bucket Name
variable "s3_bucket_name" {
  description = "Name of the S3 bucket for storing Excel files"
  type        = string
}

# CloudFront Price Class
variable "cloudfront_price_class" {
  description = "The price class for CloudFront distribution"
  type        = string
  default     = "PriceClass_100"
}

# Route53 Zone ID
variable "route53_zone_id" {
  description = "The Route53 hosted zone ID for the domain"
  type        = string
}

# Domain Name
variable "domain_name" {
  description = "The domain name for the Excel application"
  type        = string
}