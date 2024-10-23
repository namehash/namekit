import hashlib
import json
import os

import pytest

import nameguard
from nameguard.exceptions import ENSSubgraphUnavailable, ProviderUnavailable


use_monkeypatch = int(os.environ.get('MONKEYPATCH', 1))

TESTS_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data')


def pytest_configure(config):
    pytest.use_monkeypatch = use_monkeypatch
    pytest.TESTS_DATA_PATH = TESTS_DATA_PATH


@pytest.fixture(autouse=True)
def set_monkeypatch(monkeypatch):
    if use_monkeypatch:
        original_get_nft_metadata = nameguard.nameguard.get_nft_metadata

        async def mock_get_nft_metadata(contract_address: str, token_id: str) -> dict:
            mapping = {
                (
                    '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
                    '0x68562fc74af4dcfac633a803c2f57c2b826827b47f797b6ab4e468dc8607b5d5',
                ): ProviderUnavailable,
            }
            if (contract_address, token_id) in mapping:
                raise mapping[(contract_address, token_id)]()
            try:
                return json.load(open(f'{TESTS_DATA_PATH}/get_nft_metadata__{contract_address}__{token_id}.json'))
            except FileNotFoundError:
                result = await original_get_nft_metadata(contract_address, token_id)
                json.dump(
                    result,
                    open(f'{TESTS_DATA_PATH}/NEW-get_nft_metadata__{contract_address}__{token_id}.json', 'w'),
                    indent=2,
                    ensure_ascii=False,
                )
                raise

        monkeypatch.setattr('nameguard.nameguard.get_nft_metadata', mock_get_nft_metadata)

        original_name = nameguard.nameguard.OurENS.name

        def mock_name(self, address):
            try:
                return json.load(open(f'{TESTS_DATA_PATH}/name__{address}.json'))
            except FileNotFoundError:
                result = original_name(self, address)
                json.dump(
                    result, open(f'{TESTS_DATA_PATH}/NEW-name__{address}.json', 'w'), indent=2, ensure_ascii=False
                )
                raise

        # monkeypatch.setattr('nameguard.our_ens.OurENS.name', mock_name)
        monkeypatch.setattr('nameguard.nameguard.OurENS.name', mock_name)

        original_call_subgraph = nameguard.subgraph.call_subgraph

        async def mock_call_subgraph(network_name, query: str, variables: dict):
            h = hashlib.md5(json.dumps((network_name, query, variables), sort_keys=True).encode('utf-8')).hexdigest()
            mapping = {
                '03f38ca29d9e5918930330d74af977d3': ENSSubgraphUnavailable,
                '89b5412830d9c784a5555c4f38dadc25': ENSSubgraphUnavailable,
                '2245dd6f330a63011229e9d6a8078453': ENSSubgraphUnavailable,
            }
            if h in mapping:
                raise mapping[h]()
            try:
                return json.load(open(f'{TESTS_DATA_PATH}/call_subgraph__{h}.json'))
            except FileNotFoundError:
                result = await original_call_subgraph(network_name, query, variables)
                h = hashlib.md5(
                    json.dumps((network_name, query, variables), sort_keys=True).encode('utf-8')
                ).hexdigest()
                json.dump(
                    result, open(f'{TESTS_DATA_PATH}/NEW-call_subgraph__{h}.json', 'w'), indent=2, ensure_ascii=False
                )
                raise

        monkeypatch.setattr('nameguard.subgraph.call_subgraph', mock_call_subgraph)
