import pytest
from fastapi.testclient import TestClient
from urllib.parse import quote
from pprint import pprint

from nameguard.nameguard import labelhash_from_label


@pytest.fixture(scope="module")
def test_client():
    from nameguard.web_api import app
    client = TestClient(app)
    return client


@pytest.fixture(scope="module")
def api_version():
    from nameguard.web_api import ApiVersion
    return ApiVersion.V1_BETA.value


# -- inspect-name --

def test_inspect_name_get(test_client, api_version):
    name = 'byczong.eth'
    response = test_client.get(f'/{api_version}/inspect-name/{name}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == name
    assert res_json['namehash'] == '0xf8c2c01d386a4807b3ceb131e4975ff37b44824ac9307121b18223f3d77d0c2e'
    assert res_json['normalization'] == 'normalized'
    assert res_json['summary'] == {'highest_risk': None, 'rating': 'PASS', 'risk_count': 0}
    assert res_json['checks']
    assert res_json['labels']


@pytest.mark.parametrize(
    "encoded_input_name, decoded_name, do_quote",
    [
        ('iam%2Falice%3F.eth', 'iam/alice?.eth', True),
        pytest.param('iam/alice?.eth', 'iam/alice?.eth', False, marks=pytest.mark.xfail(reason="not urlencoded")),
        ('%C5%BC%C3%B3%20%C5%82%C4%87', 'żó łć', True),
        ('%3F%3F%2F%3F%2F%3F%3F', '??/?/??', True),
        ('%2511%25.%3F.eth', '%11%.?.eth', True),
    ]
)
def test_inspect_name_get_special_characters(test_client, api_version, encoded_input_name: str, decoded_name: str, do_quote: bool):
    if do_quote:
        encoded_input_name = quote(
            encoded_input_name.encode('utf-8'))  # because TestClient is doing additional unquote before sending request
    response = test_client.get(f'/{api_version}/inspect-name/{encoded_input_name}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == decoded_name


def test_inspect_name_post(test_client, api_version):
    name = 'vitalik.eth'
    response = test_client.post(f'/{api_version}/inspect-name', json={'name': name})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == name
    assert res_json['namehash'] == '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'
    assert res_json['normalization'] == 'normalized'
    assert res_json['summary'] == {'highest_risk': None, 'rating': 'PASS', 'risk_count': 0}
    assert res_json['checks']  # todo: thorough tests for global checks
    assert res_json['labels']  # todo: thorough tests for label- and grapheme-level checks


# -- bulk-inspect-name --

def test_bulk_inspect_name_post(test_client, api_version):
    names = ['vitalik.eth', 'byczong.mydomain.eth']
    response = test_client.post(f'/{api_version}/bulk-inspect-names', json={'names': names})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert all([all([key in r for key in ('name', 'namehash', 'normalization', 'summary')])
                for r in res_json['results']])

    # more than 250 names
    response = test_client.post(f'/{api_version}/bulk-inspect-names', json={'names': names * 126})
    assert response.status_code == 422


# -- inspect-namehash --

# todo: test different errors and status codes

@pytest.mark.parametrize(
    "namehash, expected_status_code, expected_name",
    [
        ('0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
        ('107841754600925073349285697024366035838042340511934381588201623605284409137205', 200, 'vitalik.eth'),
    ]
)
def test_inspect_namehash_get(test_client, api_version, namehash: str, expected_status_code: int, expected_name: str):
    network_name = 'mainnet'
    response = test_client.get(f'/{api_version}/inspect-namehash/{network_name}/{namehash}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['namehash'] == '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'
    assert res_json['name'] == expected_name


@pytest.mark.parametrize(
    "namehash, expected_status_code, expected_name",
    [
        ('0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
        ('107841754600925073349285697024366035838042340511934381588201623605284409137205', 200, 'vitalik.eth'),
    ]
)
def test_inspect_namehash_post(test_client, api_version, namehash: str, expected_status_code: int, expected_name: str):
    network_name = 'mainnet'
    response = test_client.post(f'/{api_version}/inspect-namehash',
                                json={'namehash': namehash, 'network_name': network_name})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['namehash'] == '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'
    assert res_json['name'] == expected_name


# -- inspect-labelhash --

# todo: test different errors and status codes

def test_inspect_labelhash_get(test_client, api_version):
    labelhash = labelhash_from_label('vitalik')
    network_name = 'mainnet'
    response = test_client.get(f'/{api_version}/inspect-labelhash/{network_name}/{labelhash}/eth')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == 'vitalik.eth'


def test_inspect_labelhash_post(test_client, api_version):
    labelhash = labelhash_from_label('vitalik')
    network_name = 'mainnet'
    response = test_client.post(f'/{api_version}/inspect-labelhash',
                                json={'labelhash': labelhash, 'network_name': network_name, 'parent_name': 'eth'})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == 'vitalik.eth'
