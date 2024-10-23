# NameGuard Python

![Deploy](https://github.com/namehash/namekit/actions/workflows/nameguard-api-lambda-deploy.yml/badge.svg?branch=main)

## Architecture Summary

This app provides an AWS Lambda wrapper of the NameGuard Python library that is available on [PyPI](https://pypi.org/project/nameguard/).

The NameGuard Python library contains an embedded webserver of its own.

Please see details of how to configure environment variables, or making example requests in the [NameGuard Python library](/packages/nameguard-python/).

## Automated Deployments

The following environment variables should be set for the [automated deployment script](/.github/workflows/nameguard-api-lambda-deploy.yml) (in addition to the environment variables required by nameguard-python).

```bash
AWS_ROLE - AWS Role used by GitHub actions to create the CloudFormation infrastructure for deploying NameGuard as an AWS Lambda and pushing the latest build image to AWS ECR.
SLACK_WEBHOOK_URL - Slack webhook url used by GitHub actions to send notifications of deployment success or failure to the dev team's slack channel.
```

## License

Licensed under the MIT License, Copyright © 2023-present [NameHash Labs](https://namehashlabs.org).

See [LICENSE](./LICENSE) for more information.
