from enum import Enum
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel

from nameguard.nameguard import NameGuard
from nameguard.models import NameGuardResult, NameGuardBulkResult


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
    namehash: str  # todo: add validation
    network_name: Literal['mainnet']


@app.post('/{api_version}/inspect-namehash')
async def inspect_name(api_version: ApiVersion, request: InspectNamehashRequest) -> NameGuardResult:
    if api_version != ApiVersion.V1:
        raise Exception(f'API version {api_version} not supported')

    namehash = request.namehash
    network_name = request.network_name

    name = namehash  # todo: implement (the same as below, just POST)
    return nameguard.inspect_name(name)


@app.get('/{api_version}/inspect-namehash/{network_name}/{namehash}')
async def inspect_namehash_get(api_version: ApiVersion, network_name: str, namehash: str) -> NameGuardResult:
    # todo: if prefixed with 0x - hex format, otherwise - decimal format
    # todo: validate namehash input

    # todo: the graph lookup (using decimal format)

    # todo: error for the NameHash Not Found In Subgraph should be raised (when response == {"data": {"domain": null}})
    # todo: The returned namehash should equal the namehash that we used in our lookup.
    #  If it doesn’t, this should raise the NameHash Mismatch Error.

    def namehash_2_label(s: str, network: str) -> str:
        return s  # TODO

    name = namehash_2_label(namehash, network=network_name)

    return await inspect_name(api_version, InspectNameRequest(name=name))
