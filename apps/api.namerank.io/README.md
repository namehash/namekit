# NameRank

## API
The API extends the NameGuard API and is fully compatible with it.

NameRank-specific endpoints are under the [rank.namekit.io/namerank](https://www.rank.namekit.io/namerank) path prefix.

API documentation is available at [rank.namekit.io/namerank/docs](https://rank.namekit.io/namerank/docs) and [rank.namekit.io/docs](https://rank.namekit.io/docs) for NameGuard.

Lambda is publicly accessible under given domain [rank.namekit.io](https://rank.namekit.io)

# AWS deploy
## Requirements
- Poetry - Python package management
- Docker - building image for lambda

## Setup Requirements for Using `deploy_lambda.sh`

Before you can use the `deploy_lambda.sh` script to deploy your AWS Lambda function, you need to ensure that several prerequisites are met. This section outlines the necessary steps and configurations required for a successful deployment.

### 1. AWS Account Setup
You must have an active AWS account. If you do not have one, you can create it at [AWS Free Tier](https://aws.amazon.com/free/).

### 2. AWS IAM Permissions
Ensure that the AWS user or role executing the script has the necessary permissions to interact with AWS Lambda, ECR (Elastic Container Registry), and Route 53. The following permissions are typically required:

- `lambda:*` - for managing Lambda functions.
- `ecr:*` - for managing ECR repositories and images.
- `route53:*` - for managing Route 53 hosted zones and records.
- `s3:*` - for managing S3 buckets.

For detailed guidance on creating IAM policies, refer to the [AWS IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html).

### 3. AWS Certificate Manager (ACM)
You need to create an AWS certificate in AWS Certificate Manager (ACM) for your Lambda function. This certificate is used for HTTPS communication. Follow these steps:

- Go to the [AWS Certificate Manager](https://console.aws.amazon.com/acm/home).
- Request a public certificate for your domain.
- Validate the certificate as per the instructions provided by AWS.

For more information, refer to the guide on [Requesting a Public Certificate in AWS Certificate Manager](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html).

### 4. Amazon Route 53 Setup
You must have a hosted zone created in Amazon Route 53 to manage your domain's DNS settings. Follow these steps:

- Go to the [Route 53 console](https://console.aws.amazon.com/route53/home).
- Create a hosted zone for your domain.

For guidance, refer to the documentation on [Creating a Hosted Zone in Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingHostedZone.html).

### 5. Relationship Between AWS Certificate and Hosted Zone
After creating the certificate and hosted zone, you need to validate the certificate and ensure that the domain name associated with the certificate is correctly configured in the hosted zone. Follow the guides on:

- [Validating an ACM Certificate](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate.html).
- [Using Route 53 to Route Traffic to Your Resources](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-resources.html).

### 6. Docker and AWS CLI Installation
Ensure that Docker and the AWS CLI are installed and configured on your machine. Follow these steps:

- **Install Docker**: Follow the instructions on [Get Docker](https://docs.docker.com/get-docker/).
- **Install AWS CLI**: Follow the instructions on [Installing the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

### 7. Environment Variables
You need to set up the following environment variables before running the script:

- `PROVIDER_URI_MAINNET`
- `PROVIDER_URI_SEPOLIA`
- `ALCHEMY_URI_MAINNET`
- `ALCHEMY_URI_SEPOLIA`
- `ENS_SUBGRAPH_URL_MAINNET`
- `ENS_SUBGRAPH_URL_SEPOLIA`

These variables should be populated with the appropriate values for your application.

### 8. GitHub Secrets Configuration
If you are using GitHub Actions for deployment, you need to configure the following secrets in your GitHub repository:

- `AWS_ROLE` - The IAM role to assume for AWS actions.
- `AWS_REGION` - The AWS region where your resources are located.
- `PROVIDER_URI_MAINNET`, `PROVIDER_URI_SEPOLIA`, `ALCHEMY_URI_MAINNET`, `ALCHEMY_URI_SEPOLIA`, `ENS_SUBGRAPH_URL_MAINNET`, `ENS_SUBGRAPH_URL_SEPOLIA` - The respective URIs for your application.
- `CERTIFICATE_NAME` - The name of the ACM certificate.
- `HOSTED_ZONE_NAME` - The name of your Route 53 hosted zone.
- `PROD_DOMAIN_NAME` - The production domain name.
- `STAGING_DOMAIN_NAME` - The staging domain name.
- `SLACK_WEBHOOK_URL` - The webhook URL for Slack notifications.

You can add these secrets in your GitHub repository settings under the "Secrets" section.

## Dockerfile
1. Uses an ARM64 Python 3.11 base image optimized for AWS Lambda
2. Installs necessary dependencies
3. Copies the project files into the image
4. Sets the entry point for the Lambda function


# Getting Started
This section is describing how to setup running NameRank instance on local environment

## Environment variables
NameRank requires certain env variables propagated for it's NameGuard subcomponent.
Those variables are defined and described in [.env.example](./.env.example) file which is a point of reference.
Script responsible for running local NameRank instance is expecting those variables to be poulated in .env file before execution.

## Requirements
python3 with pip installed on local env

## Scripts
Running [start-local.sh](./start-local.sh) script will result in creating running NameRank instance on local environment.
This instance can be reached under [localhost:8000](localhost:8000) 