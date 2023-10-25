# NameHash NameGuard

The NameHash team is proud to present NameGuard, a tool for identifying and preventing malicious use of ENS names.

- Offers multiple levels of protection
  - Confusable grapheme detection
  - International accessibility checks
  - Rendering checks for different fonts
  - ENSIP-15 verification with detailed explanations and auto-suggestions
  - Punycode and DNS hostname compatibility checks
- Provides a unified rating system for entire names, as well as detailed explanations for each check
- Supports many use cases
  - Standalone Python library (PyPI link)
  - ASGI web server
  - [Amazon AWS Lambda](https://aws.amazon.com/lambda/) handler

## Getting Started

### Env varaibles

```bash
AWS_ROLE - AWS Role used by GitHub actions to create the CloudFormation infrastructure for deploying NameGuard as an AWS Lambda and pushing the latest build image to AWS ECR.
SLACK_WEBHOOK_URL - Slack webhook url used by GitHub actions to send notifications of deployment success or failure to the dev team's slack channel.
```

### Installing the library

NameGuard is available as a Python library on [PyPI]. You can install it with `pip`:

```bash
pip install TODO
```

### Setting API keys

NameGuard uses the Alchemy API for `primary-name/` and `fake-eth-name-check/` endpoints. Alchemy API URLs have to be set by environment variables.
```bash
PROVIDER_URI_MAINNET=https://eth-mainnet.g.alchemy.com/v2/[YOUR_ALCHEMY_API_KEY]
PROVIDER_URI_GOERLI=https://eth-goerli.g.alchemy.com/v2/[YOUR_ALCHEMY_API_KEY]
PROVIDER_URI_SEPOLIA=https://eth-sepolia.g.alchemy.com/v2/[YOUR_ALCHEMY_API_KEY]
```

### Starting the web server

A FastAPI application is included in the `nameguard.web_api` module. The default installation from PyPI does not include an ASGI server, so you will need to install one separately. For example, to install [uvicorn](https://www.uvicorn.org):

```bash
pip install 'uvicorn[standard]'
```

You can start the web server with:

```bash
uvicorn nameguard.web_api:app
```

Make an example request:

```bash
curl -d '{"name":"nick.eth"}' -H "Content-Type: application/json" -X POST http://localhost:8000
# {
#   "verdict": "GREEN",
#   "check_results": [
#     "CheckInvisible(GREEN)",
#     "CheckENSNormalized(GREEN)",
#     "CheckConfusables(GREEN)",
#     "CheckTypingDifficulty(GREEN)",
#     "CheckMixedScripts(GREEN)"]
# }
```

### Running nameguard tests
Before running nameguard tests, make sure you have installed the 
required dependencies (along with dev dependencies). 
They are installed by default using poetry:

```bash
poetry install
```

To run nameguard tests locally, just run pytest from the root directory:
```bash
pytest ./api/tests/
```

NameGuard also provides an option to run API tests (`api/tests/test_api.py`)
against a remote host (e.g. Lambda) where a NameGuard instance is running.
To enable this, you will need to set an environment variable 
`LAMBDA_ROOT_URL` to specify the remote host URL.

This can be done like this:
```
LAMBDA_ROOT_URL=<remote-url> pytest api/tests/test_api.py
```

### Using the AWS Lambda handler

NameGuard includes a handler for [Amazon AWS Lambda](https://aws.amazon.com/lambda/). It is available in the `nameguard.lambda` module. You can use it to create a Lambda function that will respond to HTTP requests. It uses the [mangum](https://mangum.io) library.

TODO