from enum import Enum
from fastapi import FastAPI, Path, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import nameguard.context
from nameguard.nameguard import NameGuard
from nameguard.utils import validate_namehash, namehash_from_labelhash, validate_token_id, validate_ethereum_address
from nameguard.models import (
    NameGuardReport,
    BulkNameGuardBulkReport,
    SecurePrimaryNameResult,
    NetworkName,
    GraphemeGuardReport,
    FakeEthNameCheckResult
)
from nameguard.logging import logger
from nameguard.exceptions import (
    InvalidNameHash,
    ENSSubgraphUnavailable,
    NamehashMismatchError,
    NamehashNotFoundInSubgraph,
    InvalidEthereumAddress,
    ProviderUnavailable, 
    InvalidTokenID,
    NotAGrapheme,
)


class ApiVersion(str, Enum):
    V1_BETA = 'v1-beta'


app = FastAPI(title='NameGuard Service', version=ApiVersion.V1_BETA.value)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ng = NameGuard()


# -- inspect-name --


class InspectNameRequest(BaseModel):
    name: str = Field(
        description='Name to inspect.',
        examples=['iamalice.eth'],
    )
    network_name: NetworkName


@app.get(
    '/{api_version}/inspect-name/{network_name}/{name:path}',
    tags=['name'],
    summary='Inspect Name GET'
)
@app.get('/{api_version}/inspect-name/{network_name}', include_in_schema=False)
async def inspect_name_get(
        api_version: ApiVersion,
        network_name: NetworkName,
        request: Request,
        name: str = Path(default_factory=lambda: '',
                         description='**Name should be url-encoded (except when using the Swagger UI).**',
                         examples=['iam%2Falice%3F.eth']),
) -> NameGuardReport:
    logger.debug(f'[GET inspect-name] input name: \'{name}\' raw path: \'{request.scope["raw_path"]} query string: '
                 f'\'{request.scope["query_string"]}\'')
    nameguard.context.endpoint_name.set('inspect-name')
    return await ng.inspect_name(network_name, name)


@app.post(
    '/{api_version}/inspect-name',
    tags=['name'],
    summary='Inspect Name'
)
async def inspect_name_post(api_version: ApiVersion, request: InspectNameRequest) -> NameGuardReport:
    nameguard.context.endpoint_name.set('inspect-name')
    return await ng.inspect_name(request.network_name, request.name)


# -- bulk-inspect-name --


class BulkInspectNamesRequest(BaseModel):
    names: list[str] = Field(max_length=250)
    network_name: NetworkName


@app.post(
    '/{api_version}/bulk-inspect-names',
    tags=['name'],
    summary='Inspect Multiple Names'
)
async def bulk_inspect_names(api_version: ApiVersion, request: BulkInspectNamesRequest) -> BulkNameGuardBulkReport:
    nameguard.context.endpoint_name.set('bulk-inspect-name')
    return await ng.bulk_inspect_names(request.network_name, request.names)


# -- inspect-namehash --


class InspectNamehashRequest(BaseModel):
    namehash: str = Field(description='Namehash should be a decimal or a hex (prefixed with 0x) string.',
                          examples=['0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'])
    network_name: NetworkName


@app.get(
    '/{api_version}/inspect-namehash/{network_name}/{namehash}',
    tags=['namehash'],
    summary='Inspect Namehash GET',
    responses={
        **InvalidNameHash.get_responses_spec(),
        **ENSSubgraphUnavailable.get_responses_spec(),
        **NamehashMismatchError.get_responses_spec(),
        **NamehashNotFoundInSubgraph.get_responses_spec(),
    },
)
async def inspect_namehash_get(
        api_version: ApiVersion,
        network_name: NetworkName,
        namehash: str = Path(examples=['0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'],
                             description='Namehash should be a decimal or a hex (prefixed with 0x) string.')
) -> NameGuardReport:
    nameguard.context.endpoint_name.set('inspect-namehash')
    return await ng.inspect_namehash(network_name=network_name, 
        namehash=validate_namehash(namehash=namehash),
    )


@app.post(
    '/{api_version}/inspect-namehash',
    tags=['namehash'],
    summary='Inspect Namehash',
    responses={
        **InvalidNameHash.get_responses_spec(),
        **ENSSubgraphUnavailable.get_responses_spec(),
        **NamehashMismatchError.get_responses_spec(),
        **NamehashNotFoundInSubgraph.get_responses_spec(),
    },
)
async def inspect_namehash_post(api_version: ApiVersion, request: InspectNamehashRequest) -> NameGuardReport:
    nameguard.context.endpoint_name.set('inspect-namehash')
    return await ng.inspect_namehash(network_name=request.network_name,
        namehash=validate_namehash(namehash=request.namehash),
    )


# -- inspect-labelhash --


class InspectLabelhashRequest(BaseModel):
    labelhash: str = Field(description='Labelhash should be a decimal or a hex (prefixed with 0x) string.',
                           examples=['0xaf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc'])
    network_name: NetworkName
    parent_name: str = Field('eth')


@app.get(
    '/{api_version}/inspect-labelhash/{network_name}/{labelhash}/{parent_name:path}',
    tags=['labelhash'],
    summary='Inspect Labelhash GET',
    responses={
        **InvalidNameHash.get_responses_spec(),
        **ENSSubgraphUnavailable.get_responses_spec(),
        **NamehashMismatchError.get_responses_spec(),
        **NamehashNotFoundInSubgraph.get_responses_spec(),
    },
)
@app.get('/{api_version}/inspect-labelhash/{network_name}/{labelhash}', include_in_schema=False)
async def inspect_labelhash_get(
        api_version: ApiVersion,
        network_name: NetworkName,
        labelhash: str = Path(examples=['0xaf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc'],
                              description='Labelhash should be a decimal or a hex (prefixed with 0x) string.'),
        parent_name: str = Path(default_factory=lambda: '', examples=['eth'])
) -> NameGuardReport:
    nameguard.context.endpoint_name.set('inspect-labelhash')
    valid_labelhash = validate_namehash(namehash=labelhash)
    namehash = namehash_from_labelhash(valid_labelhash, parent_name=parent_name)
    return await ng.inspect_namehash(network_name=network_name, namehash=namehash)


@app.post(
    '/{api_version}/inspect-labelhash',
    tags=['labelhash'],
    summary='Inspect Labelhash',
    responses={
        **InvalidNameHash.get_responses_spec(),
        **ENSSubgraphUnavailable.get_responses_spec(),
        **NamehashMismatchError.get_responses_spec(),
        **NamehashNotFoundInSubgraph.get_responses_spec(),
    },
)
async def inspect_labelhash_post(api_version: ApiVersion, request: InspectLabelhashRequest) -> NameGuardReport:
    nameguard.context.endpoint_name.set('inspect-labelhash')
    valid_labelhash = validate_namehash(namehash=request.labelhash)
    namehash = namehash_from_labelhash(valid_labelhash, parent_name=request.parent_name)
    return await ng.inspect_namehash(network_name=request.network_name, namehash=namehash)


# -- secure-primary-name --


@app.get(
    '/{api_version}/secure-primary-name/{network_name}/{address}',
    tags=['secure_primary_name'],
    summary='Reverse lookup of Ethereum address to primary name',
    responses={
        **InvalidEthereumAddress.get_responses_spec(),
        **ProviderUnavailable.get_responses_spec(),
    },
)
async def secure_primary_name_get(api_version: ApiVersion, address: str, network_name: NetworkName) -> SecurePrimaryNameResult:
    nameguard.context.endpoint_name.set('primary-name')
    address = validate_ethereum_address(address)
    return await ng.secure_primary_name(address, network_name)


# -- fake-ens-name-check --


@app.get(
    '/{api_version}/fake-eth-name-check/{network_name}/{contract_address}/{token_id}',
    tags=['fake-eth-name-check'],
    summary='Fake .eth ENS name check GET',
    responses={
        **InvalidTokenID.get_responses_spec(),
        **ProviderUnavailable.get_responses_spec(),
    },
)
async def fake_eth_name_check_get(
        api_version: ApiVersion,
        network_name: NetworkName,
        contract_address: str = Path(examples=['0x495f947276749ce646f68ac8c248420045cb7b5e'],
                              description='Contract address for the NFT contract (ERC721 and ERC1155 supported).'),
        token_id: str = Path(examples=['61995921128521442959106650131462633744885269624153038309795231243542768648193'], 
                             description='The ID of the token (in hex or decimal format).')
) -> FakeEthNameCheckResult:
    nameguard.context.endpoint_name.set('fake-ens-name-check')
    contract_address = validate_ethereum_address(contract_address)
    token_id = validate_token_id(token_id)
    return await ng.fake_eth_name_check(network_name=network_name, contract_address=contract_address, token_id=token_id)


# -- inspect-grapheme --


@app.get(
    '/{api_version}/inspect-grapheme/{grapheme}',
    tags=['grapheme'],
    summary='Inspect Grapheme GET',
    responses={
        **NotAGrapheme.get_responses_spec(),
    },
)
async def inspect_grapheme_get(
        api_version: ApiVersion,
        grapheme: str = Path(description='Grapheme to inspect. Should be url-encoded (except when using the Swagger UI).',
                             examples=['ń', '%F0%9F%98%B5'])
) -> GraphemeGuardReport:
    nameguard.context.endpoint_name.set('inspect-grapheme')
    return ng.inspect_grapheme(grapheme)


if __name__ == '__main__':
    import asyncio
    asyncio.run(ng.inspect_name('mainnet', 'nick.eth'))
