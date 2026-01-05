#!/bin/bash

# ------------------------------------------------------------------------------
# deploy_lambda.sh
#
# This script automates the deployment of an AWS Lambda function using a Docker
# container image. It builds the Docker image, tags it, pushes it to Amazon ECR
# (Elastic Container Registry), and updates the specified Lambda function with
# the new image.
#
# Prerequisites:
#   Before executing this script, ensure that the following prerequisites are met:
#
#   1. **AWS Certificate**:
#      - You must have an AWS certificate created in AWS Certificate Manager (ACM)
#        to use with your Lambda function.
#      - **Guide to Create an AWS Certificate**: 
#        [Request a Public Certificate in AWS Certificate Manager](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html).
#
#   2. **AWS Hosted Zone**:
#      - You must have a hosted zone created in Amazon Route 53 to manage your
#        domain's DNS settings.
#      - **Guide to Create a Hosted Zone in Route 53**: 
#        [Creating a Hosted Zone in Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingHostedZone.html).
#
#   3. **Relationship Between AWS Certificate and Hosted Zone**:
#      - After creating the certificate and hosted zone, you need to validate the
#        certificate and ensure that the domain name associated with the certificate
#        is correctly configured in the hosted zone.
#      - **Guide to Validate Your Certificate**: 
#        [Validating an ACM Certificate](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate.html).
#      - **Guide to Update DNS Records**: 
#        [Using Route 53 to Route Traffic to Your Resources](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-resources.html).
#
#   4. **AWS IAM Permissions**:
#      - Ensure that the AWS user or role executing the script has the necessary
#        permissions to interact with AWS Lambda, ECR, and Route 53.
#      - **Guide to IAM Policies**: 
#        [Creating IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html).
#
#   5. **Docker and AWS CLI**:
#      - Ensure that Docker and the AWS CLI are installed and configured on your
#        machine.
#      - **Guide to Install Docker**: 
#        [Get Docker](https://docs.docker.com/get-docker/).
#      - **Guide to Install AWS CLI**: 
#        [Installing the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
#
# Usage:
#   ./deploy_lambda.sh <stage> <region> <domain_name> <certificate_name> <hosted_zone_name>
#
# Example:
#   ./deploy_lambda.sh staging us-east-1 api.example.com "*.example.com" example.com.
#
# This script performs the following steps:
# 1. Validates input parameters.
# 2. Checks for the presence of required tools (Docker, AWS CLI).
# 3. Builds the Docker image from the specified context.
# 4. Tags the Docker image for ECR.
# 5. Pushes the Docker image to the specified ECR repository.
# 6. Retrieves the full image URI from ECR.
# 7. Updates the specified AWS Lambda function with the new image.


# Get input variables from command line arguments
if [ $# -ne 5 ]; then
    echo "Usage: $0 <stage> <region> <domain_name> <certificate_name> <hosted_zone_name>"
    echo "Example: $0 staging us-east-1 rank-stage.namekit.io \"*.namekit.io\" namekit.io."
    exit 1
fi

STAGE="$1"
REGION="$2" 
DOMAIN_NAME="$3"
CERTIFICATE_NAME="$4"
HOSTED_ZONE_NAME="$5"

APPLICATION_NAME="nameai-${STAGE}"
S3_BUCKET_NAME="${APPLICATION_NAME}-terraform"
ECR_NAME="${APPLICATION_NAME}-ecr"

# Check if all variables are set
for var in STAGE APPLICATION_NAME REGION S3_BUCKET_NAME ECR_NAME DOMAIN_NAME CERTIFICATE_NAME HOSTED_ZONE_NAME; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set"
        exit 1
    fi
done

# Validate Lambda environment variables
echo "Validating Lambda environment variables..."
LAMBDA_ENV_VARS=(
    "ALCHEMY_URI_MAINNET"
    "ALCHEMY_URI_SEPOLIA"
    "ENS_SUBGRAPH_URL_MAINNET"
    "ENS_SUBGRAPH_URL_SEPOLIA"
)

# Check if Lambda environment variables are set
for var in "${LAMBDA_ENV_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Lambda environment variable $var is not set"
        exit 1
    fi
done

# Function to check if an S3 bucket exists
s3_bucket_exists() {
    aws s3api head-bucket --bucket "$S3_BUCKET_NAME" --region "$REGION" 2>/dev/null
    return $?
}

# Function to check if ECR repository exists
ecr_repo_exists() {
    aws ecr describe-repositories --repository-names "${ECR_NAME}" --region "$REGION" --query 'repositories[0].repositoryName' --output text 2>/dev/null
    return $?
}

# Get certificate ARN
CERTIFICATE_ARN=$(aws acm list-certificates --query "CertificateSummaryList[?DomainName=='${CERTIFICATE_NAME}'].CertificateArn" --output text)
if [ -z "$CERTIFICATE_ARN" ]; then
    echo "Error: Certificate not found for domain ${CERTIFICATE_NAME}"
    exit 1
fi

# Get zone ID
HOSTED_ZONE_ID=`aws route53 list-hosted-zones --query "HostedZones[?Name=='${HOSTED_ZONE_NAME}'].Id" --output text | cut -d'/' -f3`
if [ -z "$HOSTED_ZONE_ID" ]; then
    echo "Error: Hosted zone not found for domain ${HOSTED_ZONE_NAME}"
    exit 1
fi

# Create S3 bucket if it doesn't exist
if s3_bucket_exists; then
    echo "Bucket $S3_BUCKET_NAME already exists."
else
    echo "Creating S3 bucket $S3_BUCKET_NAME..."
    if [ "$REGION" = "us-east-1" ]; then
        # Special case for us-east-1: don't specify LocationConstraint
        aws s3api create-bucket --bucket "$S3_BUCKET_NAME"
    else
        # All other regions need LocationConstraint
        aws s3api create-bucket --bucket "$S3_BUCKET_NAME" \
            --region "$REGION" \
            --create-bucket-configuration LocationConstraint="$REGION"
    fi
    aws s3api put-bucket-versioning \
        --bucket "$S3_BUCKET_NAME" \
        --versioning-configuration Status=Enabled
    echo "S3 bucket $S3_BUCKET_NAME created successfully."
fi

# Create ECR repository if it doesn't exist
if ecr_repo_exists; then
    echo "ECR repository ${ECR_NAME} already exists."
else
    echo "Creating ECR repository ${ECR_NAME}..."
    aws ecr create-repository --repository-name "${ECR_NAME}" --region "${REGION}"
    echo "ECR repository ${ECR_NAME} created successfully."
fi

# Get ECR repository URL
ECR_URL=$(aws ecr describe-repositories --repository-names "${ECR_NAME}" --query 'repositories[0].repositoryUri' --output text)
echo "ECR repository URL: ${ECR_URL}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "Error: Docker daemon is not running"
    exit 1
fi

# Check if user has permission to use Docker
if ! docker ps &> /dev/null; then
    echo "Error: Current user doesn't have permission to use Docker"
    echo "Try running 'sudo usermod -aG docker $USER' and then log out and back in"
    exit 1
fi

# Verify we can pull from ECR (tests AWS credentials and connectivity)
if ! aws ecr get-login-password --region "${REGION}" 2>/dev/null | docker login --username AWS --password-stdin "${ECR_URL}" &> /dev/null; then
    echo "Error: Failed to authenticate with ECR"
    echo "Please check your AWS credentials and permissions"
    exit 1
fi

# Add validation for Docker build context
if [ ! -f "../Dockerfile" ]; then
    echo "Error: Dockerfile not found in parent directory"
    exit 1
fi

echo "Building Docker image..."
if ! docker build ../ -t nameai; then
    echo "Error: Docker build failed"
    exit 1
fi

echo "Tagging Docker image..."
if ! docker tag nameai:latest ${ECR_URL}:latest; then
    echo "Error: Failed to tag Docker image"
    exit 1
fi

echo "Pushing Docker image to ECR..."
if ! docker push ${ECR_URL}:latest; then
    echo "Error: Failed to push Docker image to ECR"
    exit 1
fi

IMAGE_URI=`docker inspect --format='{{index .RepoDigests 0}}' ${ECR_URL}:latest`
echo "Using Image URI: ${IMAGE_URI}"

# Export individual environment variables for Terraform
export TF_VAR_ALCHEMY_URI_MAINNET="${ALCHEMY_URI_MAINNET}"
export TF_VAR_ALCHEMY_URI_SEPOLIA="${ALCHEMY_URI_SEPOLIA}"
export TF_VAR_ENS_SUBGRAPH_URL_MAINNET="${ENS_SUBGRAPH_URL_MAINNET}"
export TF_VAR_ENS_SUBGRAPH_URL_SEPOLIA="${ENS_SUBGRAPH_URL_SEPOLIA}"

# Initialize Terraform
echo "Initializing Terraform..."
terraform init \
    -backend=true \
    -backend-config="bucket=${S3_BUCKET_NAME}" \
    -backend-config="key=${STAGE}/terraform.tfstate" \
    -backend-config="region=${REGION}" \
    -backend-config="encrypt=true" \

# Terraform apply
terraform apply -auto-approve \
    -var="env=${STAGE}" \
    -var="image_uri=${IMAGE_URI}" \
    -var="domain_name=${DOMAIN_NAME}" \
    -var="certificate_arn=${CERTIFICATE_ARN}" \
    -var="hosted_zone_id=${HOSTED_ZONE_ID}" \
    -var="aws_region=${REGION}" \