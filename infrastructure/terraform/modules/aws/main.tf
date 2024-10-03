provider "aws" {
  region = var.aws_region
}

# VPC Resource
resource "aws_vpc" "excel_vpc" {
  cidr_block = var.vpc_cidr_block
  enable_dns_hostnames = true
  enable_dns_support = true

  tags = {
    Name = "Excel-VPC"
    Project = "Microsoft Excel"
  }
}

# Subnet Resources
resource "aws_subnet" "excel_public_subnet" {
  count             = 2
  vpc_id            = aws_vpc.excel_vpc.id
  cidr_block        = cidrsubnet(var.vpc_cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "Excel-Public-Subnet-${count.index + 1}"
    Project = "Microsoft Excel"
  }
}

resource "aws_subnet" "excel_private_subnet" {
  count             = 2
  vpc_id            = aws_vpc.excel_vpc.id
  cidr_block        = cidrsubnet(var.vpc_cidr_block, 8, count.index + 2)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "Excel-Private-Subnet-${count.index + 1}"
    Project = "Microsoft Excel"
  }
}

# Security Group Resources
resource "aws_security_group" "excel_web_sg" {
  name        = "excel-web-sg"
  description = "Security group for Excel web servers"
  vpc_id      = aws_vpc.excel_vpc.id

  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Excel-Web-SG"
    Project = "Microsoft Excel"
  }
}

resource "aws_security_group" "excel_db_sg" {
  name        = "excel-db-sg"
  description = "Security group for Excel database servers"
  vpc_id      = aws_vpc.excel_vpc.id

  ingress {
    description     = "Database access from web servers"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.excel_web_sg.id]
  }

  tags = {
    Name = "Excel-DB-SG"
    Project = "Microsoft Excel"
  }
}

# EC2 Instance Resources
resource "aws_instance" "excel_web_server" {
  count                  = 2
  ami                    = var.ec2_ami
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.excel_public_subnet[count.index].id
  vpc_security_group_ids = [aws_security_group.excel_web_sg.id]

  tags = {
    Name = "Excel-Web-Server-${count.index + 1}"
    Project = "Microsoft Excel"
  }
}

# S3 Bucket Resource
resource "aws_s3_bucket" "excel_data_bucket" {
  bucket = var.s3_bucket_name
  acl    = "private"

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = {
    Name = "Excel-Data-Bucket"
    Project = "Microsoft Excel"
  }
}

# RDS Instance Resource
resource "aws_db_instance" "excel_db" {
  identifier           = "excel-db"
  engine               = "postgres"
  engine_version       = "13.7"
  instance_class       = var.db_instance_class
  allocated_storage    = 20
  storage_type         = "gp2"
  name                 = var.db_name
  username             = var.db_username
  password             = var.db_password
  multi_az             = true
  publicly_accessible  = false
  skip_final_snapshot  = true
  vpc_security_group_ids = [aws_security_group.excel_db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.excel_db_subnet_group.name

  tags = {
    Name = "Excel-DB"
    Project = "Microsoft Excel"
  }
}

resource "aws_db_subnet_group" "excel_db_subnet_group" {
  name       = "excel-db-subnet-group"
  subnet_ids = aws_subnet.excel_private_subnet[*].id

  tags = {
    Name = "Excel DB Subnet Group"
    Project = "Microsoft Excel"
  }
}

# Application Load Balancer Resources
resource "aws_lb" "excel_alb" {
  name               = "excel-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.excel_web_sg.id]
  subnets            = aws_subnet.excel_public_subnet[*].id

  tags = {
    Name = "Excel-ALB"
    Project = "Microsoft Excel"
  }
}

resource "aws_lb_target_group" "excel_tg" {
  name     = "excel-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.excel_vpc.id

  health_check {
    path                = "/"
    healthy_threshold   = 2
    unhealthy_threshold = 10
  }
}

resource "aws_lb_listener" "excel_listener" {
  load_balancer_arn = aws_lb.excel_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.ssl_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.excel_tg.arn
  }
}

# CloudWatch Configuration
resource "aws_cloudwatch_log_group" "excel_log_group" {
  name = "/aws/excel/logs"

  tags = {
    Name = "Excel-CloudWatch-Logs"
    Project = "Microsoft Excel"
  }
}

# Route53 Configuration
resource "aws_route53_record" "excel_dns" {
  zone_id = var.route53_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.excel_alb.dns_name
    zone_id                = aws_lb.excel_alb.zone_id
    evaluate_target_health = true
  }
}

# ElastiCache Configuration
resource "aws_elasticache_cluster" "excel_cache" {
  cluster_id           = "excel-cache"
  engine               = "redis"
  node_type            = var.cache_node_type
  num_cache_nodes      = 1
  parameter_group_name = "default.redis6.x"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.excel_cache_subnet_group.name
  security_group_ids   = [aws_security_group.excel_cache_sg.id]

  tags = {
    Name = "Excel-ElastiCache"
    Project = "Microsoft Excel"
  }
}

resource "aws_elasticache_subnet_group" "excel_cache_subnet_group" {
  name       = "excel-cache-subnet-group"
  subnet_ids = aws_subnet.excel_private_subnet[*].id
}

resource "aws_security_group" "excel_cache_sg" {
  name        = "excel-cache-sg"
  description = "Security group for Excel ElastiCache"
  vpc_id      = aws_vpc.excel_vpc.id

  ingress {
    description     = "Redis access from web servers"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.excel_web_sg.id]
  }

  tags = {
    Name = "Excel-Cache-SG"
    Project = "Microsoft Excel"
  }
}

# Cognito Configuration
resource "aws_cognito_user_pool" "excel_user_pool" {
  name = "excel-user-pool"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  tags = {
    Name = "Excel-Cognito-User-Pool"
    Project = "Microsoft Excel"
  }
}

resource "aws_cognito_user_pool_client" "excel_user_pool_client" {
  name                = "excel-user-pool-client"
  user_pool_id        = aws_cognito_user_pool.excel_user_pool.id
  generate_secret     = true
  explicit_auth_flows = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]
}

# Output values
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.excel_vpc.id
}

output "public_subnet_ids" {
  description = "The IDs of the public subnets"
  value       = aws_subnet.excel_public_subnet[*].id
}

output "private_subnet_ids" {
  description = "The IDs of the private subnets"
  value       = aws_subnet.excel_private_subnet[*].id
}

output "web_security_group_id" {
  description = "The ID of the web server security group"
  value       = aws_security_group.excel_web_sg.id
}

output "db_security_group_id" {
  description = "The ID of the database security group"
  value       = aws_security_group.excel_db_sg.id
}

output "s3_bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.excel_data_bucket.id
}

output "rds_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = aws_db_instance.excel_db.endpoint
}

output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = aws_lb.excel_alb.dns_name
}

output "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.excel_user_pool.id
}

output "cognito_user_pool_client_id" {
  description = "The ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.excel_user_pool_client.id
}