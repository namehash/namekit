import gc
import json
import os
import time

# ruff: noqa: E402
init_time = time.time()

from enum import Enum
from fastapi import FastAPI, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import nameguard.context
from nameguard.nameguard import NameGuard
from nameguard.utils import (
    validate_namehash,
    namehash_from_labelhash,
    validate_token_id,
    validate_ethereum_address,
    MAX_NUMBER_OF_NAMES_IN_BULK,
)
from nameguard.models import (
    NameGuardReport,
    BulkNameGuardBulkReport,
    SecurePrimaryNameResult,
    NetworkName,
    GraphemeGuardReport,
    FakeEthNameCheckResult,
)
from nameguard.endpoints import Endpoints
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
    MissingTitle,
)

logger.debug('NameGuard starting.')


class ApiVersion(str, Enum):
    V08_BETA = 'v0.8-beta'


app = FastAPI(
    title='NameGuard API',
    version=ApiVersion.V08_BETA.value,
    description="""Welcome to NameGuard, a powerful tool developed by [NameHash Labs](https://namehashlabs.org) to identify and prevent malicious use of Ethereum Name Service (ENS) names.

## Important Notes
⚠️ Beta Version: Please be aware that NameGuard is currently in beta. We appreciate your feedback as we work towards a stable v1 release. Expect changes to the API to address community feedback and improve functionality.

## Documentation
These documentation pages focus specifically on the NameGuard API. For information on the NameGuard Library, SDK, and UI Kit, please refer to the [NameKit GitHub repository](https://github.com/namehash/namekit).

## Glossary

* uninspected name - any name that fails any of the following requirements:
  1. The count of unknown labels (distinct or non-distinct) must not exceed `MAX_INSPECTED_NAME_UNKNOWN_LABELS`.
  2. The count of characters in the name (after potential resolving of unknown labels) must not exceed the limit `MAX_INSPECTED_NAME_CHARACTERS`.
If name is uninspected a `NameGuardReport` with `inspected` field equal to `false` is returned. 

""",
    servers=[
        {'url': 'https://api.nameguard.io', 'description': 'Production server'},
        {'url': '/', 'description': 'Default, relative server'},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

init_call = True


class LogEntry:
    def __init__(self):
        self.start_time = time.time()
        self.lambda_type = os.getenv('AWS_LAMBDA_INITIALIZATION_TYPE', None)

    def log(self, data: dict):
        global init_call
        data['processing_time'] = time.time() - self.start_time
        data['init_call'] = init_call
        init_call = False
        data['time_since_init'] = time.time() - init_time
        data['lambda_type'] = self.lambda_type

        logger.debug(f'{json.dumps(data)}')


ng = NameGuard()
logger.debug('NameGuard inited.')

if os.getenv('AWS_LAMBDA_INITIALIZATION_TYPE', None) == 'provisioned-concurrency':
    ng.analyse_label('ni ck.eth')
    logger.debug('NameGuard warmup.')


# -- inspect-name --


class InspectNameRequest(BaseModel):
    name: str = Field(
        description='Name to inspect.',
        examples=['vitalìk.eth'],
    )
    network_name: NetworkName


@app.get(
    '/inspect-name/{network_name}/{name:path}',
    tags=['name'],
    summary='Inspect Name',
    responses={
        **ENSSubgraphUnavailable.get_responses_spec(),
    },
)
async def inspect_name_get(
    network_name: NetworkName,
    name: str = Path(
        description='**Name should be url-encoded (except when using the Swagger UI). Name can be empty.**',
        examples=['vitalìk.eth'],
    ),
) -> NameGuardReport:
    """
    ## Inspects a single name with NameGuard.

    If the `name` is uninspected returns `NameGuardReport` with `inspected` field equal to `false`; else returns a `NameGuardReport` including:
    1. The details of all checks performed on `name` that consolidates all checks performed on labels and graphemes in `name`.
    2. The details of all labels in `name`.
    3. A consolidated inspection result of all graphemes in `name`.

    This endpoint will attempt automated labelhash resolution through the ENS Subgraph,
    using the network specified in `network_name`.
    """

    log_entry = LogEntry()
    nameguard.context.endpoint_name.set(Endpoints.INSPECT_NAME)
    result = await ng.inspect_name(network_name, name)

    log_entry.log(
        {
            'endpoint': Endpoints.INSPECT_NAME,
            'method': 'GET',
            'network_name': network_name,
            'name': name,
        }
    )

    return result


@app.get(
    '/inspect-name/{network_name}',
    include_in_schema=False,
    tags=['name'],
    summary='Inspect Empty Name',
    responses={
        **ENSSubgraphUnavailable.get_responses_spec(),
    },
)
async def inspect_empty_name_get(network_name: NetworkName) -> NameGuardReport:
    return await inspect_name_get(network_name, '')


@app.post(
    '/inspect-name',
    tags=['name'],
    summary='Inspect Name',
    responses={
        **ENSSubgraphUnavailable.get_responses_spec(),
    },
)
async def inspect_name_post(request: InspectNameRequest) -> NameGuardReport:
    """
    ## Inspects a single name with NameGuard.

    If the `name` is uninspected returns `NameGuardReport` with `inspected` field equal to `false`; else returns a `NameGuardReport` including:
    1. The details of all checks performed on `request.name` that consolidates all checks performed on labels and graphemes in `request.name`.
    2. The details of all labels in `request.name`.
    3. A consolidated inspection result of all graphemes in `request.name`.

    This endpoint will attempt automated labelhash resolution through the ENS Subgraph,
    using the network specified in `request.network_name`.
    """

    log_entry = LogEntry()
    nameguard.context.endpoint_name.set(Endpoints.INSPECT_NAME)
    result = await ng.inspect_name(request.network_name, request.name)

    log_entry.log(
        {
            'endpoint': Endpoints.INSPECT_NAME,
            'method': 'POST',
            'network_name': request.network_name,
            'name': request.name,
        }
    )

    return result


# -- bulk-inspect-names --


class BulkInspectNamesRequest(BaseModel):
    names: list[str] = Field(max_length=MAX_NUMBER_OF_NAMES_IN_BULK, examples=[['vitalìk.eth', 'nick.eth']])
    network_name: NetworkName


@app.post(
    '/bulk-inspect-names',
    tags=['name'],
    summary='Inspect Multiple Names',
    responses={
        **ENSSubgraphUnavailable.get_responses_spec(),
    },
)
async def bulk_inspect_names(request: BulkInspectNamesRequest) -> BulkNameGuardBulkReport:
    """
    ## Inspects up to 250 names at a time with NameGuard.

    Provides `NameGuardReport` with `inspected` field equal to `false` if the `name` is uninspected; else returns a `ConsolidatedNameGuardReport` for each name provided in `request.names`, including:
    1. The details of all checks performed on a name that consolidates all checks performed on labels and graphemes in this name.

    Each `ConsolidatedNameGuardReport` returned represents an equivalent set of checks as a `NameGuardReport`. However:
    1. A `NameGuardReport` contains a lot of additional data that isn't always needed / desired when a `ConsolidatedNameGuardReport` will do.
    2. When NameGuard only needs to return a `ConsolidatedNameGuardReport`, some special performance optimizations are possible (and completely safe) that help to accelerate responses in many cases.

    This endpoint will attempt automated labelhash resolution through the ENS Subgraph,
    using the network specified in `request.network_name`.
    """

    log_entry = LogEntry()
    nameguard.context.endpoint_name.set(Endpoints.BULK_INSPECT_NAMES)
    result = await ng.bulk_inspect_names(request.network_name, request.names)

    log_entry.log(
        {
            'endpoint': Endpoints.BULK_INSPECT_NAMES,
            'method': 'POST',
            'network_name': request.network_name,
            'names': request.names,
            'names_count': len(request.names),
        }
    )

    return result


# -- inspect-namehash --


class InspectNamehashRequest(BaseModel):
    namehash: str = Field(
        description='Namehash should be a decimal or a hex (prefixed with 0x) string.',
        examples=['0xd48fd5598e605861cbd8e45419b41b83739bff52eaef0e283181bbe0a43a5b32'],
    )
    network_name: NetworkName


@app.get(
    '/inspect-namehash/{network_name}/{namehash}',
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
    network_name: NetworkName,
    namehash: str = Path(
        examples=['0xd48fd5598e605861cbd8e45419b41b83739bff52eaef0e283181bbe0a43a5b32'],
        description='Namehash should be a decimal or a hex (prefixed with 0x) string.',
    ),
) -> NameGuardReport:
    """
    ## Inspects the name associated with a namehash.

    NameGuard will attempt to resolve the name associated with the `namehash` through the ENS Subgraph,
    using the network specified in `network_name`.

    If this resolution succeeds then NameGuard will return a `NameGuardReport` for the name. If the resolved `name` is uninspected then NameGuard will return `NameGuardReport` with `inspected` field equal to `false`.

    If this resolution fails then NameGuard will return an error.
    """

    logger.debug(
        f"{json.dumps({'endpoint': Endpoints.INSPECT_NAMEHASH, 'method': 'GET', 'network_name': network_name, 'namehash': namehash})}"
    )
    nameguard.context.endpoint_name.set(Endpoints.INSPECT_NAMEHASH)
    return await ng.inspect_namehash(
        network_name=network_name,
        namehash=validate_namehash(namehash=namehash),
    )


@app.post(
    '/inspect-namehash',
    tags=['namehash'],
    summary='Inspect Namehash',
    responses={
        **InvalidNameHash.get_responses_spec(),
        **ENSSubgraphUnavailable.get_responses_spec(),
        **NamehashMismatchError.get_responses_spec(),
        **NamehashNotFoundInSubgraph.get_responses_spec(),
    },
)
async def inspect_namehash_post(request: InspectNamehashRequest) -> NameGuardReport:
    """
    ## Inspects the name associated with a namehash.

    NameGuard will attempt to resolve the name associated with the `request.namehash` through the ENS Subgraph,
    using the network specified in `request.network_name`.

    If this resolution succeeds then NameGuard will return a `NameGuardReport` for the name. If the resolved `name` is uninspected then NameGuard will return `NameGuardReport` with `inspected` field equal to `false`.

    If this resolution fails then NameGuard will return an error.
    """

    logger.debug(
        f"{json.dumps({'endpoint': Endpoints.INSPECT_NAMEHASH, 'method': 'POST', 'network_name': request.network_name, 'namehash': request.namehash})}"
    )
    nameguard.context.endpoint_name.set(Endpoints.INSPECT_NAMEHASH)
    return await ng.inspect_namehash(
        network_name=request.network_name,
        namehash=validate_namehash(namehash=request.namehash),
    )


# -- inspect-labelhash --


class InspectLabelhashRequest(BaseModel):
    labelhash: str = Field(
        description='Labelhash should be a decimal or a hex (prefixed with 0x) string.',
        examples=['0x3276e4878615389906712b876ce1455b8f5d1c5ea3ffcf7a705e0d32fafae9c5'],
    )
    network_name: NetworkName
    parent_name: str = Field('eth')


@app.get(
    '/inspect-labelhash/{network_name}/{labelhash}/{parent_name:path}',
    tags=['labelhash'],
    summary='Inspect Labelhash GET',
    responses={
        **InvalidNameHash.get_responses_spec(),
        **ENSSubgraphUnavailable.get_responses_spec(),
        **NamehashMismatchError.get_responses_spec(),
        **NamehashNotFoundInSubgraph.get_responses_spec(),
    },
)
async def inspect_labelhash_get(
    network_name: NetworkName,
    labelhash: str = Path(
        examples=['0x3276e4878615389906712b876ce1455b8f5d1c5ea3ffcf7a705e0d32fafae9c5'],
        description='Labelhash should be a decimal or a hex (prefixed with 0x) string.',
    ),
    parent_name: str = Path(
        description='Parent name of the labelhash (default empty).',
        examples=['eth'],
    ),
) -> NameGuardReport:
    """
    ## Inspects the name `[{labelhash}].{parent_name}`.

    Parent may be a name with any number of labels. The default parent is "eth".

    This is a convenience endpoint to generate a `NameGuardReport` in cases when you only have:
    1. The labelhash of the "childmost" label of a name.
    2. The complete parent name of the "childmost" label.

    Returns `NameGuardReport` with `inspected` field equal to `false` if the resolved name is uninspected.

    NameGuard always inspects names, rather than labelhashes. So this endpoint will first attempt
    to resolve the "childmost" label associated with the provided labelhash through the ENS Subgraph,
    using the network specified in `network_name`.

    If this label resolution fails the resulting `NameGuardReport` will be equivalent to requesting
    a `NameGuardReport` for the name `[{labelhash}].{parent_name}` which will contain (at least)
    one label with an `unknown` `Normalization`.

    If this label resolution succeeds the resulting `NameGuardReport` will be equivalent to requesting
    a `NameGuardReport` for the name `{label}.{parent_name}`.
    """

    logger.debug(
        f"{json.dumps({'endpoint': Endpoints.INSPECT_LABELHASH, 'method': 'GET', 'network_name': network_name, 'labelhash': labelhash, 'parent_name': parent_name})}"
    )
    nameguard.context.endpoint_name.set(Endpoints.INSPECT_LABELHASH)
    valid_labelhash = validate_namehash(namehash=labelhash)
    namehash = namehash_from_labelhash(valid_labelhash, parent_name=parent_name)
    return await ng.inspect_namehash(network_name=network_name, namehash=namehash)


@app.get(
    '/inspect-labelhash/{network_name}/{labelhash}',
    include_in_schema=False,
    tags=['labelhash'],
    summary='Inspect Labelhash GET',
    responses={
        **InvalidNameHash.get_responses_spec(),
        **ENSSubgraphUnavailable.get_responses_spec(),
        **NamehashMismatchError.get_responses_spec(),
        **NamehashNotFoundInSubgraph.get_responses_spec(),
    },
)
async def inspect_labelhash_get_empty_parent(
    network_name: NetworkName,
    labelhash: str = Path(
        examples=['0x3276e4878615389906712b876ce1455b8f5d1c5ea3ffcf7a705e0d32fafae9c5'],
        description='Labelhash should be a decimal or a hex (prefixed with 0x) string.',
    ),
) -> NameGuardReport:
    return await inspect_labelhash_get(network_name, labelhash, '')


@app.post(
    '/inspect-labelhash',
    tags=['labelhash'],
    summary='Inspect Labelhash',
    responses={
        **InvalidNameHash.get_responses_spec(),
        **ENSSubgraphUnavailable.get_responses_spec(),
        **NamehashMismatchError.get_responses_spec(),
        **NamehashNotFoundInSubgraph.get_responses_spec(),
    },
)
async def inspect_labelhash_post(request: InspectLabelhashRequest) -> NameGuardReport:
    """
    ## Inspects the name `[{request.labelhash}].{request.parent_name}`.

    Parent may be a name with any number of labels. The default parent is "eth".

    This is a convenience endpoint to generate a `NameGuardReport` in cases when you only have:
    1. The labelhash of the "childmost" label of a name.
    2. The complete parent name of the "childmost" label.

    Returns `NameGuardReport` with `inspected` field equal to `false` if the resolved name is uninspected.

    NameGuard always inspects names, rather than labelhashes. So this endpoint will first attempt
    to resolve the "childmost" label associated with the provided labelhash through the ENS Subgraph,
    using the network specified in `request.network_name`.

    If this label resolution fails the resulting `NameGuardReport` will be equivalent to requesting
    a `NameGuardReport` for the name `[{request.labelhash}].{request.parent_name}` which will contain (at least)
    one label with an `unknown` `Normalization`.

    If this label resolution succeeds the resulting `NameGuardReport` will be equivalent to requesting
    a `NameGuardReport` for the name `{label}.{request.parent_name}`.
    """

    logger.debug(
        f"{json.dumps({'endpoint': Endpoints.INSPECT_LABELHASH, 'method': 'POST', 'network_name': request.network_name, 'labelhash': request.labelhash, 'parent_name': request.parent_name})}"
    )
    nameguard.context.endpoint_name.set(Endpoints.INSPECT_LABELHASH)
    valid_labelhash = validate_namehash(namehash=request.labelhash)
    namehash = namehash_from_labelhash(valid_labelhash, parent_name=request.parent_name)
    return await ng.inspect_namehash(network_name=request.network_name, namehash=namehash)


# -- secure-primary-name --


@app.get(
    '/secure-primary-name/{network_name}/{address}',
    tags=['secure_primary_name'],
    summary='Reverse lookup of an Ethereum address to a primary name',
    responses={
        **InvalidEthereumAddress.get_responses_spec(),
        **ProviderUnavailable.get_responses_spec(),
    },
)
async def secure_primary_name_get(address: str, network_name: NetworkName) -> SecurePrimaryNameResult:
    """
    ## Performs a reverse lookup of an Ethereum `address` to a primary name.

    Data sources for the primary name lookup include:
    1. The Ethereum Provider configured in the NameGuard instance.
    2. For ENS names using CCIP-Read: requests to externally defined gateway servers.

    Returns `display_name` to be shown to users and estimates `impersonation_status`.
    """
    logger.debug(
        f"{json.dumps({'endpoint': Endpoints.SECURE_PRIMARY_NAME, 'method': 'GET', 'network_name': network_name, 'address': address})}"
    )
    nameguard.context.endpoint_name.set(Endpoints.SECURE_PRIMARY_NAME)
    address = validate_ethereum_address(address)

    return await ng.secure_primary_name(address, network_name)


# -- fake-ens-name-check --


class FakeETHNameCheckFieldsRequest(BaseModel):
    network_name: NetworkName
    contract_address: str = Path(
        examples=['0x495f947276749ce646f68ac8c248420045cb7b5e'],
        description='Contract address for the NFT contract (ERC721 and ERC1155 supported).',
    )
    token_id: str = Path(
        examples=['61995921128521442959106650131462633744885269624153038309795231243542768648193'],
        description='The ID of the token (in hex or decimal format).',
    )
    fields: dict[str, str] = Field(
        description='Fields with values which will be investigated (e.g. title, collection name, metadata) whether they look like fake .eth ENS name. `title` key is mandatory, for ENS contracts it should be the ENS name.'
    )


@app.post(
    '/fake-eth-name-check',
    tags=['fake-eth-name-check'],
    summary='Fake .eth ENS name check with fields',
    responses={
        **InvalidTokenID.get_responses_spec(),
        **InvalidEthereumAddress.get_responses_spec(),
        **MissingTitle.get_responses_spec(),
    },
)
async def fake_eth_name_check_fields_post(request: FakeETHNameCheckFieldsRequest) -> FakeEthNameCheckResult:
    """
    ## Performs a fake .eth ENS name check based on given NFT metadata.

    This endpoint checks if the metadata of an NFT looks like a fake .eth ENS name.
    """
    logger.debug(
        f"{json.dumps({'endpoint': Endpoints.FAKE_ETH_NAME_CHECK, 'method': 'POST', 'network_name': request.network_name, 'contract_address': request.contract_address, 'token_id': request.token_id})}"
    )
    nameguard.context.endpoint_name.set(Endpoints.FAKE_ETH_NAME_CHECK)
    contract_address = validate_ethereum_address(request.contract_address)
    token_id = validate_token_id(request.token_id)
    return await ng.fake_eth_name_check_fields(
        network_name=request.network_name,
        contract_address=contract_address,
        token_id=token_id,
        investigated_fields=request.fields,
    )


# -- inspect-grapheme --


@app.get(
    '/inspect-grapheme/{grapheme}',
    tags=['grapheme'],
    summary='Inspect Grapheme GET',
    responses={
        **NotAGrapheme.get_responses_spec(),
    },
)
async def inspect_grapheme_get(
    grapheme: str = Path(
        description='Grapheme to inspect. Should be url-encoded (except when using the Swagger UI).',
        examples=['v', 'ń', '%F0%9F%98%B5'],
    ),
) -> GraphemeGuardReport:
    """## Inspects a single grapheme."""
    logger.debug(f"{json.dumps({'endpoint': Endpoints.INSPECT_GRAPHEME, 'method': 'GET', 'grapheme': grapheme})}")
    nameguard.context.endpoint_name.set(Endpoints.INSPECT_GRAPHEME)
    return ng.inspect_grapheme(grapheme)


if __name__ == '__main__':
    import asyncio

    asyncio.run(ng.inspect_name('mainnet', 'ni ck.eth'))


gc.freeze()
