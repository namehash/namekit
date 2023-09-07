from enum import Enum
from fastapi import FastAPI
from pydantic import BaseModel, Field, ValidationError
from urllib.parse import unquote

from nameguard.nameguard import NameGuard, validate_namehash, namehash_from_labelhash
from nameguard.models import NameGuardResult, NameGuardBulkResult


class ApiVersion(str, Enum):
    V1_beta = 'v1-beta'


class NetworkName(str, Enum):
    MAINNET = 'mainnet'


app = FastAPI(title='NameGuard Service', version=ApiVersion.V1_beta)
nameguard = NameGuard()


# -- inspect-name --


class InspectNameRequest(BaseModel):
    name: str = Field(examples=['iam%2Fal1ce%3F'], title='name (url-encoded if GET request)')


@app.get('/{api_version}/inspect-name/{name:path}')
async def inspect_name_get(api_version: ApiVersion, name: str) -> NameGuardResult:
    print(name)
    try:
        decoded_name = unquote(name, encoding='utf-8', errors='strict')
    except Exception as ex:
        raise ValidationError(f'Decoding error occurred: {ex}')
    print(decoded_name)
    return inspect_name_post(api_version, InspectNameRequest(name=decoded_name))


@app.post('/{api_version}/inspect-name')
async def inspect_name_post(api_version: ApiVersion, request: InspectNameRequest) -> NameGuardResult:
    return nameguard.inspect_name(request.name)


# -- bulk-inspect-name --


class BulkInspectNameRequest(BaseModel):
    names: list[str] = Field(max_items=250)


@app.post('/{api_version}/bulk-inspect-names')
async def bulk_inspect_names(api_version: ApiVersion, request: BulkInspectNameRequest) -> NameGuardBulkResult:
    return nameguard.bulk_inspect_names(request.names)


# -- inspect-namehash --


class InspectNamehashRequest(BaseModel):
    namehash: str = Field(title='namehash (decimal or hex representation)',
                          examples=['0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'])
    network_name: NetworkName


@app.post('/{api_version}/inspect-namehash')
async def inspect_namehash_post(api_version: ApiVersion, request: InspectNamehashRequest) -> NameGuardResult:
    return await nameguard.inspect_namehash(
        namehash=validate_namehash(namehash=request.namehash),
        network=request.network_name,
    )


@app.get('/{api_version}/inspect-namehash/{network_name}/{namehash}')
async def inspect_namehash_get(
        api_version: ApiVersion,
        network_name: NetworkName,
        namehash: str
) -> NameGuardResult:
    return await nameguard.inspect_namehash(
        namehash=validate_namehash(namehash=namehash),
        network=network_name,
    )


# -- inspect-labelhash --

class InspectLabelhashRequest(BaseModel):
    labelhash: str = Field(title='labelhash (decimal or hex representation)',
                           examples=['0xaf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc'])
    network_name: NetworkName
    parent_name: str = Field('eth', title='parent name (must be normalized)')


@app.post('/{api_version}/inspect-labelhash')
async def inspect_labelhash_post(api_version: ApiVersion, request: InspectLabelhashRequest) -> NameGuardResult:
    valid_labelhash = validate_namehash(namehash=request.labelhash)
    namehash = namehash_from_labelhash(valid_labelhash, parent_name=request.parent_name)
    return await nameguard.inspect_namehash(
        namehash=namehash,
        network=request.network_name,
    )


@app.get('/{api_version}/inspect-namehash/{network_name}/{namehash}')
async def inspect_labelhash_get(
        api_version: ApiVersion,
        network_name: NetworkName,
        labelhash: str,
        parent_name='eth'
) -> NameGuardResult:
    valid_labelhash = validate_namehash(namehash=labelhash)
    namehash = namehash_from_labelhash(valid_labelhash, parent_name=parent_name)
    return await nameguard.inspect_namehash(
        namehash=namehash,
        network=network_name,
    )
