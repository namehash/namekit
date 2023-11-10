# NameHash NameGuard

The NameHash team is proud to present NameGuard, a tool for identifying and preventing malicious use of ENS names.

* Offers multiple levels of protection
  * Impersonated name detection
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
  * Standalone Python library ([PyPI](https://pypi.org/project/nameguard/))
  * ASGI web server
  * [Amazon AWS Lambda](https://aws.amazon.com/lambda/) handler

## Getting Started

### [Try the official web app](https://nameguard.io)

### Using the public API

NameGuard is hosted at <https://api.nameguard.io>

You can make a basic request to the API like this:

```bash
curl https://api.nameguard.io/v0.8-beta/inspect-name/mainnet/nick.eth
```

The API documentation is available at <https://api.nameguard.io/redoc> or <https://api.nameguard.io/docs>.

### Using the SDK

Quickstart:

```bash
npm install @namehash/nameguard
```

```ts
import { nameguard } from "@namehash/nameguard";
await nameguard.inspectName("nick.eth");
```

See the [SDK README](./packages/sdk/README.md) for more details.

### Using the Python library

Quickstart:

```bash
pip install nameguard
```

```python
from nameguard import NameGuard
ng = NameGuard()
await ng.inspect_name(network_name='mainnet', name='nick.eth')
```

See the [NameGuard Python README](./api/README.md) for more details.

### Running your own NameGuard instance

See the [NameGuard Python README](./api/README.md) for more details.

## NameGuard Specification

### Checks

1. **Impersonation**: Detects names that could be trying to impersonate a different name by using similar characters.

2. **Confusables**: Detects characters that can be confused with other characters.

3. **Font Support**: Checks if the characters in the name are supported by commonly used fonts.

4. **Invisibles**: Detects invisible characters.

5. **Typing Difficulty**: Detects names that are difficult to type on some keyboards.

6. **Mixed Scripts**: Detects names that contain characters from multiple scripts or alphabets.

7. **Name Wrapper**: Checks if the name is supported by the new ENS Name Wrapper.

8. **ENSIP-15**: Checks if the name is normalized according to ENSIP-15.

9. **Punycode**: Checks if the name is compatible with Punycode encoding.

10. **Unknown Labels**: Checks if the name contains unknown labels (e.g. `[0123abcd...].eth`).
