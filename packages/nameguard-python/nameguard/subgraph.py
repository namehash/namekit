# import hashlib
# import json
from typing import Optional
import os
from dotenv import load_dotenv


import httpx

from nameguard.logging import logger
from nameguard.exceptions import ENSSubgraphUnavailable, NamehashNotFoundInSubgraph, NamehashMismatchError
from nameguard.models import NetworkName
from nameguard.utils import namehash_from_name, label_is_labelhash, MAX_INSPECTED_NAME_UNKNOWN_LABELS

load_dotenv()

# The label limit for using the multi-label lookup query.
# Longer names will be resolved by querying the namehash of the full name.
MAX_MULTI_LABEL_LOOKUP = 256

ENS_SUBGRAPH_URL = {
    NetworkName.MAINNET: os.environ.get('ENS_SUBGRAPH_URL_MAINNET'),
    NetworkName.SEPOLIA: os.environ.get('ENS_SUBGRAPH_URL_SEPOLIA'),
}


RESOLVE_NAMEHASH_QUERY = """
query resolveNamehash($nameHash: String) {
  domain(id: $nameHash) {
    name
  }
}
"""

headers = {'Content-Type': 'application/json'}


async def call_subgraph(network_name: NetworkName, query: str, variables: dict) -> dict:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                ENS_SUBGRAPH_URL[network_name] + '?source=ens-nameguard',
                json={'query': query, 'variables': variables},
                headers=headers,
            )

        if response.status_code == 200:
            response_json = response.json()
            logger.debug(f'Subgraph query:\n{query} {variables}')
            logger.debug(f'Subgraph response json:\n{response_json}')
        else:
            raise ENSSubgraphUnavailable(
                f'Received unexpected status code from ENS Subgraph {response.status_code}: {response.text}'
            )
    except Exception as ex:
        logger.exception('Communication error with subgraph occurred')
        if not str(ex):
            raise ENSSubgraphUnavailable('Communication error with subgraph occurred.')
        raise ENSSubgraphUnavailable(f'Communication error with subgraph occurred: {ex}')

    if 'data' not in response_json:
        logger.error(f'Unexpected response body: {response_json}')
        raise ENSSubgraphUnavailable(f'Unexpected response body: {response_json}')
    else:
        return response_json['data']


async def namehash_to_name_lookup(network_name: NetworkName, namehash_hexstr: str) -> str:
    logger.debug(f'Trying namehash lookup for: {namehash_hexstr}')
    namehash_hexstr = namehash_hexstr.lower()

    variables = {'nameHash': namehash_hexstr}

    data = await call_subgraph(network_name, RESOLVE_NAMEHASH_QUERY, variables)

    if 'domain' not in data:
        logger.error(f'Unexpected response data: {data}')
        raise ENSSubgraphUnavailable(f'Unexpected response data: {data}')
    elif data['domain'] is None:
        raise NamehashNotFoundInSubgraph()
    elif 'name' in data['domain']:
        if data['domain']['name'] is None:
            logger.error(f'Name by namehash is None: {data} {variables}')
            name = ''
        else:
            name = str(data['domain']['name'])
        calculated_namehash = namehash_from_name(name)
        if calculated_namehash != namehash_hexstr:
            logger.error(
                f'NamehashMismatchError occurred:\ninput: {namehash_hexstr}\tcalculated: {calculated_namehash}'
            )
            raise NamehashMismatchError()
        return name
    else:
        logger.error(f'Unexpected response data: {data}')
        raise ENSSubgraphUnavailable(f'Unexpected response data: {data}')


def build_multi_label_query(labels: list[str]) -> tuple[str, dict]:
    """
    Builds a query that resolves all labelhashes in a name.

    ```
    query resolveLabelhashes($l0: String, $l1: String) {
        l0: domain(id: $l0) {
            labelName
        }
        l1: domain(id: $l1) {
            labelName
        }
    }
    ```
    """
    labelhash_idx = [i for i, label in enumerate(labels) if label_is_labelhash(label)]
    args = ' '.join(f'$l{i}:String' for i in labelhash_idx)
    query = f'query resolveLabelhashes({args}){{'
    variables = {}
    for i in labelhash_idx:
        partial_name = '.'.join(labels[i:])
        partial_namehash = namehash_from_name(partial_name)
        query += f'l{i}:domain(id:$l{i}){{labelName}}'
        variables[f'l{i}'] = partial_namehash
    query += '}'
    return query, variables


async def resolve_all_labelhashes_in_name(network_name: NetworkName, name: str) -> str:
    logger.debug(f'Trying to resolve full name: {name}')

    namehash = namehash_from_name(name)
    labels = name.split('.')

    if len(labels) < MAX_MULTI_LABEL_LOOKUP:
        logger.debug(f'Trying multi-label lookup for: {name}')
        query, variables = build_multi_label_query(labels)
        data = await call_subgraph(network_name, query, variables)
        resolved_labels = []
        for i, label in enumerate(labels):
            if label_is_labelhash(label):
                # domain could be unknown or just the label could be unknown
                if data[f'l{i}'] is not None:
                    label = data[f'l{i}']['labelName'] or label
            resolved_labels.append(label)
        resolved_name = '.'.join(resolved_labels)
        resolved_namehash = namehash_from_name(resolved_name)
        if resolved_namehash != namehash:
            logger.error(f'NamehashMismatchError occurred:\ninput: {name}\tcalculated: {resolved_name}')
            raise NamehashMismatchError()
    else:
        logger.debug(f'Trying namehash lookup for: {name}')
        try:
            resolved_name = await namehash_to_name_lookup(network_name, namehash)
        except NamehashNotFoundInSubgraph:
            resolved_name = name

    logger.debug(f'Resolved name: {resolved_name}')

    return resolved_name


def build_multi_label_query_querying_labelhashes(labelhashes: list[str]) -> tuple[str, dict]:
    """
    Builds a query that resolves all labelhashes in a name.
    Labelhash in format 0x1234...1234.
    ```
    query resolveLabelhashes($l0: String, $l1: String) {
        l0: domains(where: {labelhash: $l0, labelName_not: null}, first: 1) {
            labelName
        }
        l1: domains(where: {labelhash: $l1, labelName_not: null}, first: 1) {
            labelName
        }
    }
    ```
    """
    args = ' '.join(f'$l{i}:String' for i in range(len(labelhashes)))
    query = f'query resolveLabelhashes({args}){{'
    variables = {}
    for i, labelhash in enumerate(labelhashes):
        query += f'l{i}:domains(where: {{labelhash: $l{i}, labelName_not: null}}, first: 1){{labelName}}'
        variables[f'l{i}'] = labelhash
    query += '}'
    return query, variables


async def resolve_labelhashes_querying_labelhashes(network_name: NetworkName, labelhashes: list[str]) -> dict[str, str]:
    """
    Resolve labelhashes to label names.
    Labelhash in format [1234...1234].
    """
    if not labelhashes:
        return {}
    labelhashes = [f'0x{labelhash[1:-1]}' for labelhash in labelhashes]
    query, variables = build_multi_label_query_querying_labelhashes(labelhashes)

    data = await call_subgraph(network_name, query, variables)

    result = {}
    for var, labelhash in variables.items():
        labelhash = f'[{labelhash[2:]}]'
        if data[var]:
            result[labelhash] = data[var][0]['labelName']
        else:
            result[labelhash] = labelhash
    return result


async def resolve_all_labelhashes_in_name_querying_labelhashes(network_name: NetworkName, name: str) -> Optional[str]:
    """
    Resolve up to MAX_INSPECTED_NAME_UNKNOWN_LABELS labelhashes in a name. If there is more labelhashes then return None.
    """
    labels = name.split('.')

    labelhash_idx = [i for i, label in enumerate(labels) if label_is_labelhash(label)]

    if not labelhash_idx:
        return name

    if len(labelhash_idx) > MAX_INSPECTED_NAME_UNKNOWN_LABELS:
        return None

    logger.debug(f'Trying to resolve full name: {name}')
    resolved_labelhashes = await resolve_labelhashes_querying_labelhashes(
        network_name, [labels[i] for i in labelhash_idx]
    )

    for i in labelhash_idx:
        labels[i] = resolved_labelhashes[labels[i]]

    resolved_name = '.'.join(labels)

    logger.debug(f'Resolved name: {resolved_name}')

    return resolved_name


async def resolve_all_labelhashes_in_names_querying_labelhashes(
    network_name: NetworkName, names: list[str]
) -> list[str]:
    segmented_names = []
    labelhashes = set()
    labelhashes_list = []
    for name in names:
        labels = name.split('.')
        segmented_names.append(labels)
        for label in labels:
            if label_is_labelhash(label):
                if label not in labelhashes:
                    labelhashes.add(label)
                    labelhashes_list.append(label)

    resolved_labelhashes = await resolve_labelhashes_querying_labelhashes(network_name, labelhashes_list)

    resolved_names = []
    for labels in segmented_names:
        for i, label in enumerate(labels):
            if label_is_labelhash(label):
                labels[i] = resolved_labelhashes[label]
        resolved_names.append('.'.join(labels))
    return resolved_names
