from enum import Enum
from fastapi import FastAPI, Path
from pydantic import BaseModel, Field

from nameguard.nameguard import NameGuard, validate_namehash, namehash_from_labelhash
from nameguard.models import NameGuardResult, NameGuardBulkResult
from nameguard.nameguard import logger


class ApiVersion(str, Enum):
    V1_beta = 'v1-beta'


class NetworkName(str, Enum):
    MAINNET = 'mainnet'


app = FastAPI(title='NameGuard Service', version=ApiVersion.V1_beta.value)
nameguard = NameGuard()


# -- inspect-name --


class InspectNameRequest(BaseModel):
    name: str = Field(examples=['iamalice.eth'], title='name to inspect')


@app.get(
    '/{api_version}/inspect-name/{name:path}',
    tags=['name'],
    summary='Inspect Name GET'  # todo: "Inspect URL-Encoded Name" or this one is ok?
)
async def inspect_name_get(
        api_version: ApiVersion,
        name: str = Path(..., description='**Name should be url-encoded (if through docs is should not).**',
                         example='iam%2Falice%3F.eth')
) -> NameGuardResult:
    logger.debug(f'[GET inspect-name] input name: \'{name}\'')
    return nameguard.inspect_name(name)


@app.post(
    '/{api_version}/inspect-name',
    tags=['name'],
    summary='Inspect Name'
)
async def inspect_name_post(api_version: ApiVersion, request: InspectNameRequest) -> NameGuardResult:
    return nameguard.inspect_name(request.name)


# -- bulk-inspect-name --


class BulkInspectNameRequest(BaseModel):
    names: list[str] = Field(max_items=250)


@app.post(
    '/{api_version}/bulk-inspect-names',
    tags=['name'],
    summary='Inspect Multiple Names'
)
async def bulk_inspect_names(api_version: ApiVersion, request: BulkInspectNameRequest) -> NameGuardBulkResult:
    return nameguard.bulk_inspect_names(request.names)


# -- inspect-namehash --


class InspectNamehashRequest(BaseModel):
    namehash: str = Field(title='namehash (decimal or hex representation)',
                          examples=['0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'])
    network_name: NetworkName


@app.post(
    '/{api_version}/inspect-namehash',
    tags=['namehash'],
    summary='Inspect Namehash'
)
async def inspect_namehash_post(api_version: ApiVersion, request: InspectNamehashRequest) -> NameGuardResult:
    return await nameguard.inspect_namehash(
        namehash=validate_namehash(namehash=request.namehash),
        network=request.network_name,
    )


@app.get(
    '/{api_version}/inspect-namehash/{network_name}/{namehash}',
    tags=['namehash'],
    summary='Inspect Namehash GET'
)
async def inspect_namehash_get(
        api_version: ApiVersion,
        network_name: NetworkName,
        namehash: str = Path(..., example='0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835',
                             description='**Namehash should be a decimal or a hex (prefixed with 0x) integer.**')
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
    parent_name: str = Field('eth', title='parent name')


@app.post(
    '/{api_version}/inspect-labelhash',
    tags=['labelhash'],
    summary='Inspect Labelhash'
)
async def inspect_labelhash_post(api_version: ApiVersion, request: InspectLabelhashRequest) -> NameGuardResult:
    valid_labelhash = validate_namehash(namehash=request.labelhash)
    namehash = namehash_from_labelhash(valid_labelhash, parent_name=request.parent_name)
    return await nameguard.inspect_namehash(
        namehash=namehash,
        network=request.network_name,
    )


@app.get(
    '/{api_version}/inspect-labelhash/{network_name}/{labelhash}/{parent_name}',
    tags=['labelhash'],
    summary='Inspect Labelhash GET'
)
async def inspect_labelhash_get(
        api_version: ApiVersion,
        network_name: NetworkName,
        labelhash: str = Path(..., example='0xaf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc',
                              description='**Labelhash should be a decimal or a hex (prefixed with 0x) integer.**'),
        parent_name: str = Path(..., example='eth')
) -> NameGuardResult:
    valid_labelhash = validate_namehash(namehash=labelhash)
    namehash = namehash_from_labelhash(valid_labelhash, parent_name=parent_name)
    return await nameguard.inspect_namehash(
        namehash=namehash,
        network=network_name,
    )
