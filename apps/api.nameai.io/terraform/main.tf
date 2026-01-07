provider "aws" {
  region = var.aws_region
}

module "lambda_api" {
  source = "./modules/lambda_api"

  env             = var.env
  image_uri       = var.image_uri
  domain_name     = var.domain_name
  certificate_arn = var.certificate_arn
  hosted_zone_id  = var.hosted_zone_id
  aws_region      = var.aws_region

  # Lambda environment variables
  ENSNODE_URL_MAINNET      = var.ENSNODE_URL_MAINNET
  ENSNODE_URL_SEPOLIA      = var.ENSNODE_URL_SEPOLIA
  ALCHEMY_URI_MAINNET       = var.ALCHEMY_URI_MAINNET
  ALCHEMY_URI_SEPOLIA       = var.ALCHEMY_URI_SEPOLIA
  ENS_SUBGRAPH_URL_MAINNET  = var.ENS_SUBGRAPH_URL_MAINNET
  ENS_SUBGRAPH_URL_SEPOLIA  = var.ENS_SUBGRAPH_URL_SEPOLIA
}