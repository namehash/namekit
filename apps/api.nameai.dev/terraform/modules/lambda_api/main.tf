data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

locals {
  common_tags = {
    Environment = var.env
    Project     = "namerank"
    ManagedBy   = "terraform"
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda-${var.env}"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  tags               = local.common_tags
}

data "aws_iam_policy_document" "lambda_logging" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging-${var.env}"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.lambda_logging.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}


resource "aws_lambda_function" "namerank_lambda" {
  function_name = "namerank-lambda-${var.env}"
  role          = aws_iam_role.iam_for_lambda.arn
  memory_size = "1769"
  timeout = 60
  package_type = "Image"
  image_uri = var.image_uri
  architectures = ["arm64"]
  publish     = true

  environment {
    variables = {
      PROVIDER_URI_MAINNET      = var.PROVIDER_URI_MAINNET
      PROVIDER_URI_SEPOLIA      = var.PROVIDER_URI_SEPOLIA
      ALCHEMY_URI_MAINNET       = var.ALCHEMY_URI_MAINNET
      ALCHEMY_URI_SEPOLIA       = var.ALCHEMY_URI_SEPOLIA
      ENS_SUBGRAPH_URL_MAINNET  = var.ENS_SUBGRAPH_URL_MAINNET
      ENS_SUBGRAPH_URL_SEPOLIA  = var.ENS_SUBGRAPH_URL_SEPOLIA
    }
  }

  tags = merge(local.common_tags, {
    Function = "namerank-api"
  })
}

resource "aws_lambda_provisioned_concurrency_config" "concurrency_config" {
  function_name                     = aws_lambda_function.namerank_lambda.function_name
  provisioned_concurrent_executions = 1
  qualifier                         = aws_lambda_function.namerank_lambda.version
}

resource "aws_lambda_function_url" "lambda_url" {
  function_name      = aws_lambda_function.namerank_lambda.function_name
  authorization_type = "NONE"
}

resource "aws_cloudfront_distribution" "api_distribution" {
  enabled             = true
  comment             = "Distribution for namerank API ${var.env}"
  price_class         = "PriceClass_100"
  
  aliases = [var.domain_name]

  origin {
    domain_name = split("/", aws_lambda_function_url.lambda_url.function_url)[2]
    origin_id   = "LambdaFunctionOrigin"
    origin_path = ""
    
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
      origin_read_timeout = 60
      origin_keepalive_timeout = 60
    }
  }

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "LambdaFunctionOrigin"
    viewer_protocol_policy = "redirect-to-https"
    
    forwarded_values {
      query_string = true
      headers      = ["Origin", "Authorization", "x-api-key"]

      cookies {
        forward = "none"
      }
    }

    default_ttl            = 0
    compress              = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = local.common_tags
}

resource "aws_route53_record" "dns_record" {
  name    = var.domain_name
  type    = "A"
  zone_id = var.hosted_zone_id

  alias {
    name                   = aws_cloudfront_distribution.api_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.api_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}