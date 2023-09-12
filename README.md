# NameHash NameGuard

The NameHash team is proud to present NameGuard, a tool for identifying and preventing malicious use of ENS names.

* Offers multiple levels of protection
  * Confusable grapheme detection
  * International accessibility checks
  * Rendering checks for different fonts
  * ENSIP-15 verification with detailed explanations and auto-suggestions
  * Punycode and DNS hostname compatibility checks
  * and more!
* Provides a unified rating system for entire names, as well as detailed explanations for each check
  * :green_circle: Pass: no issues found
  * :yellow_circle: Warn: potential issues found
  * :red_circle: Fail: serious issues found
* Supports many use cases
  * Standalone Python library (TODO PyPI link)
  * ASGI web server
  * [Amazon AWS Lambda](https://aws.amazon.com/lambda/) handler

## Getting Started

### Installing the library

NameGuard is available as a Python library on [PyPI]. You can install it with `pip`:

```bash
pip install TODO
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
curl http://localhost:8000/v1-beta/inspect-name/nick.eth
# {
#   "name":"nick.eth",
#   "namehash":"...",
#   "normalization":"normalized",
#   "summary":{
#     "rating":"PASS",
#     "risk_count":0,
#     "highest_risk":null
#   },
#   ...
# }
```

### Using the AWS Lambda handler

NameGuard includes a handler for [Amazon AWS Lambda](https://aws.amazon.com/lambda/). It is available in the `nameguard.lambda` module. You can use it to create a Lambda function that will respond to HTTP requests. It uses the [mangum](https://mangum.io) library.

Check out the included [Dockerfile](./Dockerfile) for an example of how to build a Lambda container image.
