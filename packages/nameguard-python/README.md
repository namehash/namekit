# NameGuard Python

![Tests](https://github.com/namehash/namekit/actions/workflows/nameguard-python-unit-tests.yml/badge.svg?branch=main)
![Coverage](https://raw.githubusercontent.com/namehash/namekit/refs/heads/main/packages/nameguard-python/coverage_badge.svg)

The NameHash team is proud to present NameGuard, a tool for identifying and preventing malicious use of ENS names.

- Offers multiple levels of protection
  - Impersonated name detection
  - Confusable grapheme detection
  - International accessibility checks
  - Rendering checks for different fonts
  - ENSIP-15 verification with detailed explanations and auto-suggestions (provided by [ens-normalize-python](https://github.com/namehash/ens-normalize-python))
  - Punycode and DNS hostname compatibility checks
  - and more!
- Provides a unified rating system for entire names, as well as detailed explanations for each check
  - :green_circle: Pass: no issues found
  - :yellow_circle: Warn: potential issues found
  - :red_circle: Fail: serious issues found
- Supports many use cases
  - Standalone Python library ([PyPI](https://pypi.org/project/nameguard/))
  - ASGI web server
  - [Amazon AWS Lambda](https://aws.amazon.com/lambda/) handler

⚠️ **This package and API is BETA. Things will change based on community feedback.**

## Getting Started

This package contains the core logic for NameGuard, a python library and web API server.

### [Try the official web app](https://nameguard.io)

### Using the public API

NameGuard is hosted at <https://api.nameguard.io>

You can make a basic request to the API like this:

```bash
curl https://api.nameguard.io/inspect-name/mainnet/nick.eth
```

The API documentation is available at <https://api.nameguard.io/redoc> or <https://api.nameguard.io/docs>.

### Using the TypeScript SDK

Quickstart:

```bash
npm install @namehash/nameguard
```

```ts
import { nameguard } from "@namehash/nameguard";
await nameguard.inspectName("nick.eth");
```

See the [SDK README](./packages/nameguard-sdk/README.md) for more details.

### Using the Python library

NameGuard is available as a Python library on [PyPI](https://pypi.org/project/nameguard/). You can install it with `pip`:

```bash
pip install nameguard
```

```python
from nameguard import NameGuard
ng = NameGuard()
await ng.inspect_name(network_name='mainnet', name='nick.eth')
```

See the [NameGuard Python README](./apps/api.nameguard.io/README.md) for more details.

### Environment Variables

NameGuard uses the ENSNode API for primary name lookups in `secure-primary-name`. The ENSNode API only returns normalized primary names, so unnormalized primary names are treated as having no primary name.

For `fake-eth-name-check`, NameGuard uses Alchemy endpoints. Alchemy endpoints have to be set by environment variables, e.g.:

```bash
export ALCHEMY_URI_MAINNET=https://eth-mainnet.g.alchemy.com/v2/[YOUR_ALCHEMY_API_KEY]
export ALCHEMY_URI_SEPOLIA=https://eth-sepolia.g.alchemy.com/v2/[YOUR_ALCHEMY_API_KEY]
export ENS_SUBGRAPH_URL_MAINNET="https://gateway-arbitrum.network.thegraph.com/api/[YOUR_SUBGRAPH_API_KEY]/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH"
export ENS_SUBGRAPH_URL_SEPOLIA="https://gateway-arbitrum.network.thegraph.com/api/[YOUR_SUBGRAPH_API_KEY]/subgraphs/id/DmMXLtMZnGbQXASJ7p1jfzLUbBYnYUD9zNBTxpkjHYXV"
```

#### Starting the webserver

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
curl -d '{"name":"nick.eth", "network_name": "mainnet"}' -H "Content-Type: application/json" -X POST http://localhost:8000/inspect-name
# {
#   "rating": "pass",
#   "risk_count": 0,
#   "highest_risk": null,
#   "name": "nick.eth",
#   "namehash": "0x05a67c0ee82964c4f7394cdd47fee7f4d9503a23c09c38341779ea012afe6e00",
#   "normalization": "normalized",
#   "checks": [...],
#   "labels": [...],
#   "canonical_name": "nick.eth",
#   "title": "Looks Good",
#   "subtitle": "All security checks passed!",
#   "beautiful_name": "nick.eth"
# }
```

## Development

### Running tests

Before running nameguard tests, make sure you have installed the
required dependencies (along with dev dependencies).
They are installed by default using poetry:

```bash
poetry install
```

To run nameguard tests locally, just run pytest from the root directory:

```bash
pytest ./packages/nameguard-python/tests/
```

NameGuard also provides an option to run API tests (`packages/nameguard-python/tests/test_api.py`)
against a remote host (e.g. Lambda) where a NameGuard instance is running.
To enable this, you will need to set an environment variable
`LAMBDA_ROOT_URL` to specify the remote host URL.

This can be done like this:

```bash
LAMBDA_ROOT_URL=https://api.nameguard.io poetry run pytest packages/nameguard-python/tests/test_api.py
```

### Using the AWS Lambda handler

NameGuard includes a handler for [Amazon AWS Lambda](https://aws.amazon.com/lambda/). It is available in the `nameguard.lambda` module. You can use it to create a Lambda function that will respond to HTTP requests. It uses the [mangum](https://mangum.io) library.

Check out the included [Dockerfile](./Dockerfile) for an example of how to build a Lambda container image.

See the [AWS Lambda deployment scripts](./apps/api.nameguard.io/) for more details.

### Disable monkeypatch tests

By default, the tests are using mock responses from external APIs. If you want to run tests using real requests to external APIs then set `MONKEYPATCH=0`.

```bash
MONKEYPATCH=0 poetry run pytest
```

## NameGuard Specification

### Checks

1. **Impersonation**: Detects names that could be trying to impersonate a different name by using similar characters. Example: [`vitalìk.eth`](https://nameguard.io/inspect/vitalìk.eth)

2. **Confusables**: Detects characters that can be confused with other characters. Example: [`vitalìk.eth`](https://nameguard.io/inspect/vitalìk.eth)

3. **Font Support**: Checks if the characters in the name are supported by commonly used fonts. Example: [`🛈.eth`](https://nameguard.io/inspect/🛈.eth)

4. **Invisibles**: Detects invisible characters. Example: [`888‍‍.eth`](https://nameguard.io/inspect/888‍‍.eth)

5. **Typing Difficulty**: Detects names that are difficult to type on some keyboards. Example: [`żółć.eth`](https://nameguard.io/inspect/żółć.eth)

6. **Mixed Scripts**: Detects names that contain characters from multiple scripts or alphabets. Example: [`あア.eth`](https://www.nameguard.io/inspect/あア.eth)

7. **Name Wrapper**: Checks if the name is supported by the new ENS Name Wrapper. Example: [`abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd.eth`](https://nameguard.io/inspect/abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd.eth)

8. **ENSIP-15**: Checks if the name is normalized according to ENSIP-15. Example: [`bitсoin.eth`](https://nameguard.io/inspect/bitсoin.eth)

9. **Punycode**: Checks if the name is compatible with Punycode encoding. Example: [`ab--abc.eth`](https://www.nameguard.io/inspect/ab--abc.eth)

10. **Unknown Labels**: Checks if the name contains unknown labels. Example: [`[5bc926fc40cc7c49e0df6dddf26e4dc7b9d6d32f4a55d4f0670320dbf414afd2].byongdok.eth`](https://nameguard.io/inspect/[5bc926fc40cc7c49e0df6dddf26e4dc7b9d6d32f4a55d4f0670320dbf414afd2].byongdok.eth)

11. **Decentralized Name**: Checks if the name is decentralized (unruggable). Example: [`example.com`](https://www.nameguard.io/inspect/example.com)

12. **NameWrapper fuses**: Checks that the NameWrapper configuration of a name is safe.

13. **Uninspected Name**: Checks if the name is exceptionally long and would not be inspected by NameGuard for performance reasons.

## License

Licensed under the MIT License, Copyright © 2023-present [NameHash Labs](https://namehashlabs.org).

See [LICENSE](./LICENSE) for more information.
