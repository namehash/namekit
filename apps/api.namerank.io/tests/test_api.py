import pytest
from fastapi.testclient import TestClient
from pprint import pprint

from mocked_static_property import mock_static_property
from nameguard.utils import MAX_INSPECTED_NAME_CHARACTERS


# if mangum is not installed, do not run the api tests
try:
    import mangum  # noqa: F401
except ImportError:
    pytest.skip('mangum is not installed, skipping api tests', allow_module_level=True)


@pytest.fixture(scope='module')
def test_client():
    with mock_static_property():
        from namerank.root_api import app

        client = TestClient(app)
        return client


def test_included_namerank(test_client):
    response = test_client.get('/namerank/inspect-label/a')
    assert response.status_code == 200


def test_included_nameguard(test_client):
    response = test_client.get('/inspect-grapheme/a')
    assert response.status_code == 200


def test_empty_label(test_client):
    response = test_client.get('/namerank/inspect-label')
    assert response.status_code == 200
    assert response.json()['namerank']['analysis']['inspection']['label'] == ''


def test_inspect_name_post_long(test_client):
    name = '≡ƒÿ║' * 50  # equal to MAX_INSPECTED_NAME_CHARACTERS
    assert len(name) == MAX_INSPECTED_NAME_CHARACTERS

    response = test_client.post('/namerank/inspect-name', json={'name': name, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['nameguard']['highest_risk']['check'] == 'normalized'
    assert res_json['nameguard']['inspected']
    assert res_json['namerank']['analysis']['status'] == 'unnormalized'
    pprint(res_json)


def test_inspect_name_post_too_long(test_client):
    name = '≡ƒÿ║' * 51  # more than MAX_INSPECTED_NAME_CHARACTERS
    assert len(name) > MAX_INSPECTED_NAME_CHARACTERS

    response = test_client.post('/namerank/inspect-name', json={'name': name, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['nameguard']['highest_risk']['check'] == 'uninspected'
    assert res_json['nameguard']['normalization'] == 'unnormalized'
    assert not res_json['nameguard']['inspected']
    assert res_json['namerank']['analysis'] is None
    pprint(res_json)


def test_inspect_name_post_too_long_normalized(test_client):
    name = 'abcd' * 51  # more than MAX_INSPECTED_NAME_CHARACTERS
    assert len(name) > MAX_INSPECTED_NAME_CHARACTERS

    response = test_client.post('/namerank/inspect-name', json={'name': name, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['nameguard']['highest_risk']['check'] == 'uninspected'
    assert res_json['nameguard']['normalization'] == 'normalized'
    assert res_json['namerank']['analysis'] is None
    pprint(res_json)
