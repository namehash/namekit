# NameHash NameGuard

The NameHash team is proud to present NameGuard, a tool for identifying and preventing malicious use of ENS names.

* Offers multiple levels of protection
  * Confusable grapheme detection
  * International accessibility checks
  * Rendering checks for different fonts
  * ENSIP-15 verification with detailed explanations and auto-suggestions
  * Punycode and DNS hostname compatibility checks
* Provides a unified rating system for entire names, as well as detailed explanations for each check
* Supports many use cases
  * Standalone Python library (PyPI link)
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

### Using the AWS Lambda handler

NameGuard includes a handler for [Amazon AWS Lambda](https://aws.amazon.com/lambda/). It is available in the `nameguard.lambda` module. You can use it to create a Lambda function that will respond to HTTP requests. It uses the [mangum](https://mangum.io) library.

TODO
