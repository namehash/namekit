from enum import Enum
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator

from nameguard.nameguard import NameGuard
from nameguard.models import NameGuardResult, NameGuardBulkResult

from utils import int_to_hexstr, namehash_to_normal_name_lookup


class ApiVersion(str, Enum):
    V1 = 'v1'


app = FastAPI()
nameguard = NameGuard()


# -- inspect-name --


class InspectNameRequest(BaseModel):
    name: str


@app.post('/{api_version}/inspect-name')
async def inspect_name(api_version: ApiVersion, request: InspectNameRequest) -> NameGuardResult:
    if api_version != ApiVersion.V1:
        raise Exception(f'API version {api_version} not supported')
    return nameguard.inspect_name(request.name)


@app.get('/{api_version}/inspect-name/{name}')
async def inspect_name_get(api_version: ApiVersion, name: str) -> NameGuardResult:
    return await inspect_name(api_version, InspectNameRequest(name=name))


@app.get('/{api_version}/inspect-name')
async def inspect_name_get(api_version: ApiVersion) -> NameGuardResult:
    return await inspect_name(api_version, InspectNameRequest(name=''))


# -- bulk-inspect-name --


class BulkInspectNameRequest(BaseModel):
    names: list[str]


@app.post('/{api_version}/bulk-inspect-name')
async def bulk_inspect_name(api_version: ApiVersion, request: BulkInspectNameRequest) -> NameGuardBulkResult:
    if api_version != ApiVersion.V1:
        raise Exception(f'API version {api_version} not supported')
    return nameguard.bulk_inspect_name(request.names)


# -- inspect-namehash --

class InspectNamehashRequest(BaseModel):
    namehash: str
    network_name: Literal['mainnet']

    @field_validator('namehash')
    @classmethod
    def valid_namehash_hex_or_int(cls, value: str) -> str:
        if value.startswith('0x'):
            if len(value) != 66 or not all(c in '0123456789abcdefABCDEF' for c in value[2:]):
                raise ValueError("Must be a hex number with 64 digits, prefixed with 0x.")
            return value
        else:
            try:
                int_value = int(value)
            except ValueError as ex:
                raise ValueError(
                    "Must be a valid, decimal integer or a hex number with 64 digits, prefixed with 0x.") from ex
            try:
                hex_value = int_to_hexstr(int_value)
            except ValueError as ex:
                raise ValueError(
                    "The decimal integer represented as a hex number should have at most 64 digits.") from ex
            return hex_value


@app.post('/{api_version}/inspect-namehash')
async def inspect_name(api_version: ApiVersion, request: InspectNamehashRequest) -> NameGuardResult:
    if api_version != ApiVersion.V1:
        raise Exception(f'API version {api_version} not supported')

    network_name = request.network_name

    name = request.namehash  # todo: implement (the same as below, just POST)
    return nameguard.inspect_name(name)


@app.get('/{api_version}/inspect-namehash/{network_name}/{namehash}')
async def inspect_namehash_get(api_version: ApiVersion, network_name: str, namehash: str) -> NameGuardResult:
    try:
        valid_namehash = InspectNamehashRequest(namehash=namehash, network_name=network_name).namehash
    except ValueError as v:
        raise HTTPException(status_code=422, detail=str(v))

    try:
        name = await namehash_to_normal_name_lookup(valid_namehash, network=network_name)
    except ValueError:
        pass
        # todo: For now, an unknown label should trigger a red NameGuard check result.
        #  It also means that no grapheme level analysis for such a label will be possible.
        #  This also means the “normalization” in the result should be “Unknown”.
        name = valid_namehash

    return await inspect_name(api_version, InspectNameRequest(name=name))

# namehash
#   Required
#   String
#   Must be a valid namehash.
#   May be provided in either decimal or hex format.
#   Interpreted as hex format if it begins with “0x”, else interpreted as decimal format.
#   If interpreted in decimal format:
#       The value must be a (possibly quite large) unsigned integer.
#       Converting the value from an unsigned integer to a hex value must be successful.
#       The resulting hex value must be padded with prefixing ‘0’ characters as needed to be exactly 64 hex digits long.
#       If the resulting hex value is too large to fit within 64 hex digits then it is an error.
#   If interpreted in hex format:
#       Must be a value in the format: 0x[a-fA-F0-9]{64}


# Please consider error cases that include:
#   Unsupported API Version
#   Unsupported Network Name
#   Invalid NameHash
#   NameHash Mismatch Error (see details below)
