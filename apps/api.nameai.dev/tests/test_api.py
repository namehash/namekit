import pytest
from fastapi.testclient import TestClient
import time

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
        from nameai.root_api import app

        client = TestClient(app)
        return client


def test_included_nameai(test_client):
    response = test_client.get('/inspect-label/a')
    assert response.status_code == 200


def test_included_nameguard(test_client):
    response = test_client.get('/nameguard/inspect-grapheme/a')
    assert response.status_code == 200


def test_empty_label(test_client):
    response = test_client.get('/inspect-label')
    assert response.status_code == 200
    assert response.json()['nameai']['analysis']['inspection']['label'] == ''


def test_inspect_name_post_long(test_client):
    name = '≡ƒÿ║' * 50  # equal to MAX_INSPECTED_NAME_CHARACTERS
    assert len(name) == MAX_INSPECTED_NAME_CHARACTERS

    response = test_client.post('/inspect-name', json={'name': name, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['nameguard']['highest_risk']['check'] == 'normalized'
    assert res_json['nameguard']['inspected']
    assert res_json['nameai']['analysis']['status'] == 'unnormalized'


def test_inspect_name_post_too_long(test_client):
    name = '≡ƒÿ║' * 51  # more than MAX_INSPECTED_NAME_CHARACTERS
    assert len(name) > MAX_INSPECTED_NAME_CHARACTERS

    response = test_client.post('/inspect-name', json={'name': name, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['nameguard']['highest_risk']['check'] == 'uninspected'
    assert res_json['nameguard']['normalization'] == 'unnormalized'
    assert not res_json['nameguard']['inspected']
    assert res_json['nameai']['analysis'] is None


def test_inspect_name_post_too_long_normalized(test_client):
    name = 'abcd' * 51  # more than MAX_INSPECTED_NAME_CHARACTERS
    assert len(name) > MAX_INSPECTED_NAME_CHARACTERS

    response = test_client.post('/inspect-name', json={'name': name, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['nameguard']['highest_risk']['check'] == 'uninspected'
    assert res_json['nameguard']['normalization'] == 'normalized'
    assert res_json['nameai']['analysis'] is None


# performance test constants
RESPONSE_TIME_LIMIT = 0.3  # 300ms


def measure_response_time(test_client, method, endpoint, data=None):
    start_time = time.perf_counter()
    if method == 'GET':
        response = test_client.get(endpoint)
    else:  # POST
        response = test_client.post(endpoint, json=data)
    end_time = time.perf_counter()
    assert response.status_code == 200
    return end_time - start_time


@pytest.mark.parametrize(
    'label',
    [
        'catnip',
        'expertsexchange',
        'ab' * (MAX_INSPECTED_NAME_CHARACTERS // 2 - 1),
    ],
)
def test_inspect_label_get_performance(test_client, label):
    response_time = measure_response_time(test_client, 'GET', f'/inspect-label/{label}')
    print('\nGET performance:')
    print(f'  Label: {label}')
    print(f'  Response time: {response_time:.3f}s')
    print(f'  Limit: {RESPONSE_TIME_LIMIT:.3f}s')
    assert (
        response_time < RESPONSE_TIME_LIMIT
    ), f'GET /inspect-label/{label} took {response_time:.3f}s, expected < {RESPONSE_TIME_LIMIT}s'


@pytest.mark.parametrize(
    'label',
    [
        'catnip',
        'expertsexchange',
        'ab' * (MAX_INSPECTED_NAME_CHARACTERS // 2 - 1),
    ],
)
def test_inspect_label_post_performance(test_client, label):
    response_time = measure_response_time(test_client, 'POST', '/inspect-label', {'label': label})
    print('\nPOST performance:')
    print(f'  Label: {label}')
    print(f'  Response time: {response_time:.3f}s')
    print(f'  Limit: {RESPONSE_TIME_LIMIT:.3f}s')
    assert (
        response_time < RESPONSE_TIME_LIMIT
    ), f'POST /inspect-label with {label} took {response_time:.3f}s, expected < {RESPONSE_TIME_LIMIT}s'
