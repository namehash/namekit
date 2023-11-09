import hashlib
import json
import os

import pytest

from nameguard.exceptions import ENSSubgraphUnavailable

use_monkeypatch = int(os.environ.get('MONKEYPATCH', 1))

TESTS_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data')

async def mock_get_nft_metadata(contract_address: str, token_id: str) -> dict:
    return json.load(open(f'{TESTS_DATA_PATH}/get_nft_metadata__{contract_address}__{token_id}.json'))


def mock_name(self, address):
    return json.load(open(f'{TESTS_DATA_PATH}/name__{address}.json'))

async def mock_call_subgraph(network_name, query: str, variables: dict):
    h = hashlib.md5(json.dumps((network_name, query, variables), sort_keys=True).encode('utf-8')).hexdigest()
    mapping= {
        '03f38ca29d9e5918930330d74af977d3': ENSSubgraphUnavailable,
        '89b5412830d9c784a5555c4f38dadc25': ENSSubgraphUnavailable,
        '2245dd6f330a63011229e9d6a8078453': ENSSubgraphUnavailable,
    }
    if h in mapping:
        raise mapping[h]()
    return json.load(open(f'{TESTS_DATA_PATH}/call_subgraph__{h}.json'))
@pytest.fixture(autouse=True)
def set_monkeypatch(monkeypatch):
    if use_monkeypatch:
        monkeypatch.setattr("nameguard.nameguard.get_nft_metadata", mock_get_nft_metadata)

        monkeypatch.setattr('nameguard.our_ens.OurENS.name', mock_name)
        monkeypatch.setattr('nameguard.nameguard.OurENS.name', mock_name)
        
        monkeypatch.setattr('nameguard.subgraph.call_subgraph', mock_call_subgraph)
