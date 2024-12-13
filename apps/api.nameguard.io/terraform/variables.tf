variable "env" {
  description = "Environment name"
  type        = string
}

variable "image_uri" {
  description = "URI of the Lambda container image"
  type        = string
}

variable "domain_name" {
  description = "Custom domain name for API Gateway"
  type        = string
}

variable "certificate_arn" {
  description = "ARN of ACM certificate"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

# Lambda environment variables
variable "PROVIDER_URI_MAINNET" {
  description = "Provider URI for Mainnet"
  type        = string
  sensitive   = true
}

variable "PROVIDER_URI_SEPOLIA" {
  description = "Provider URI for Sepolia"
  type        = string
  sensitive   = true
}

variable "ALCHEMY_URI_MAINNET" {
  description = "Alchemy URI for Mainnet"
  type        = string
  sensitive   = true
}

variable "ALCHEMY_URI_SEPOLIA" {
  description = "Alchemy URI for Sepolia"
  type        = string
  sensitive   = true
}

variable "ENS_SUBGRAPH_URL_MAINNET" {
  description = "ENS Subgraph URL for Mainnet"
  type        = string
  sensitive   = true
}

variable "ENS_SUBGRAPH_URL_SEPOLIA" {
  description = "ENS Subgraph URL for Sepolia"
  type        = string
  sensitive   = true
}