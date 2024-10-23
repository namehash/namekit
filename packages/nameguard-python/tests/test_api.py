import pytest
from fastapi.testclient import TestClient
from urllib.parse import quote
from pprint import pprint
import re
import httpx
import os
from dotenv import load_dotenv

from nameguard.models import FakeEthNameCheckStatus
from nameguard.utils import labelhash_from_label, MAX_INSPECTED_NAME_CHARACTERS, MAX_NUMBER_OF_NAMES_IN_BULK

load_dotenv()  # run lambda api tests if LAMBDA_ROOT_URL is set
running_lambda_tests = bool(os.environ.get('LAMBDA_ROOT_URL'))


@pytest.fixture(scope='module')
def test_client():
    if running_lambda_tests:
        lambda_root_url = os.environ.get('LAMBDA_ROOT_URL')
        print(f'\n\nRunning lambda tests; root url: {lambda_root_url}')
        client = httpx.Client(base_url=lambda_root_url)
        return client

    from nameguard.web_api import app

    client = TestClient(app)
    return client


# -- inspect-name --


def test_inspect_name_get(test_client):
    name = 'byczong.eth'
    network_name = 'mainnet'
    response = test_client.get(f'/inspect-name/{network_name}/{name}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == name
    assert res_json['namehash'] == '0xf8c2c01d386a4807b3ceb131e4975ff37b44824ac9307121b18223f3d77d0c2e'
    assert res_json['normalization'] == 'normalized'
    assert res_json['highest_risk'] is None
    assert res_json['rating'] == 'pass'
    assert res_json['risk_count'] == 0
    assert res_json['checks']
    assert res_json['labels']
    assert all([label['labelhash'] for label in res_json['labels']])


CORRECT_CHECKS_ORDER = ['alert', 'warn', 'skip', 'pass', 'info']


def check_order_of_list(l: list[str]):
    for i in range(len(l) - 1):
        assert CORRECT_CHECKS_ORDER.index(l[i]) <= CORRECT_CHECKS_ORDER.index(
            l[i + 1]
        ), f'Order of checks is not correct: {l[i + 1]} should be before {l[i]}'


def test_inspect_name_get_unnormalized(test_client):
    name = 'bycz ong.eth'
    network_name = 'mainnet'
    response = test_client.get(f'/inspect-name/{network_name}/{name}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == name
    assert res_json['namehash'] == '0x3f97a45d7aa341b55b749b276f699278634ce4e5afa3e0753a8fe5be5d1355c2'
    assert res_json['normalization'] == 'unnormalized'
    assert res_json['rating'] == 'alert'
    assert res_json['risk_count'] > 0
    assert res_json['checks']
    assert res_json['labels']
    assert all([label['labelhash'] for label in res_json['labels']])  # labelhash for unnormalized
    assert all([label['graphemes'] for label in res_json['labels']])  # graphemes for unnormalized

    check_order_of_list([check['status'] for check in res_json['checks']])
    for label in res_json['labels']:
        check_order_of_list([check['status'] for check in label['checks']])


@pytest.mark.parametrize(
    'encoded_input_name, decoded_name, do_quote',
    [
        ('iam%2Falice%3F.eth', 'iam/alice?.eth', True),
        pytest.param('iam/alice?.eth', 'iam/alice?.eth', False, marks=pytest.mark.xfail(reason='not urlencoded')),
        ('%C5%BC%C3%B3%20%C5%82%C4%87', 'żó łć', True),
        ('%3F%3F%2F%3F%2F%3F%3F', '??/?/??', True),
        ('%2511%25.%3F.eth', '%11%.?.eth', True),
    ],
)
def test_inspect_name_get_special_characters(test_client, encoded_input_name: str, decoded_name: str, do_quote: bool):
    if do_quote:
        encoded_input_name = quote(
            encoded_input_name.encode('utf-8')
        )  # because TestClient is doing additional unquote before sending request
    network_name = 'mainnet'
    response = test_client.get(f'/inspect-name/{network_name}/{encoded_input_name}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == decoded_name


def test_inspect_name_get_empty(test_client):
    network_name = 'mainnet'
    response = test_client.get(f'/inspect-name/{network_name}')
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['name'] == ''
    assert res_json['namehash'] == '0x0000000000000000000000000000000000000000000000000000000000000000'
    assert res_json['normalization'] == 'normalized'
    assert res_json['rating'] == 'pass'

    response = test_client.get('/inspect-name')
    # method not allowed because this is the POST endpoint path
    assert response.status_code == 405


def test_inspect_name_post_latin_all_pass(test_client):
    name = 'vitalik.eth'
    response = test_client.post('/inspect-name', json={'name': name, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == name
    assert res_json['namehash'] == '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'
    assert res_json['normalization'] == 'normalized'
    assert res_json['highest_risk'] is None
    assert res_json['rating'] == 'pass'
    assert res_json['risk_count'] == 0
    assert res_json['subtitle'] == 'All security checks passed!'
    assert res_json['title'] == 'Looks Good'
    assert res_json['checks']
    assert len(res_json['labels']) == 2

    for check in res_json['checks']:
        assert 'check' in check and 'message' in check
        assert check['status'] in ('pass', 'info')  # TODO remove info when fuses check implemented
        assert check['check_name'][0].isupper() and '_' not in check['check_name']

    # labels keys
    assert (
        set(label_res.keys())
        == {'label', 'labelhash', 'normalization', 'highest_risk', 'rating', 'risk_count', 'checks', 'graphemes'}
        for label_res in res_json['labels']
    )

    # grapheme keys
    assert all(
        set(grapheme_res.keys())
        == {
            'normalization',
            'grapheme',
            'grapheme_name',
            'grapheme_type',
            'grapheme_script',
            'highest_risk',
            'rating',
            'risk_count',
            'grapheme_description',
            'unicode_version',
            'subtitle',
            'title',
        }
        for label_res in res_json['labels']
        for grapheme_res in label_res['graphemes']
    )

    for i, label in enumerate(('vitalik', 'eth')):
        assert res_json['labels'][i]['label'] == label
        assert res_json['labels'][i]['beautiful_label'] == label
        assert res_json['labels'][i]['canonical_label'] == label
        assert res_json['labels'][i]['labelhash'] == labelhash_from_label(label)
        assert res_json['labels'][i]['normalization'] == 'normalized'
        assert res_json['labels'][i]['rating'] == 'pass'
        assert res_json['labels'][i]['risk_count'] == 0
        assert res_json['labels'][i]['highest_risk'] is None
        assert res_json['labels'][i]['title'] == 'Looks Good'
        assert res_json['labels'][i]['subtitle'] == 'All security checks passed!'
        for check in res_json['labels'][i]['checks']:
            assert 'check' in check and 'message' in check
            assert check['status'] == 'pass'
            assert check['check_name'][0].isupper() and '_' not in check['check_name']
        print(res_json['labels'][i])

    for grapheme_res, expected_grapheme in zip(res_json['labels'][0]['graphemes'], list('vitalik')):
        assert grapheme_res['grapheme'] == expected_grapheme
        assert grapheme_res['grapheme_script'] == 'Latin'
        assert grapheme_res['highest_risk'] is None
        assert grapheme_res['rating'] == 'pass'
        assert grapheme_res['risk_count'] == 0
        assert grapheme_res['grapheme_type'] == 'simple_letter'
        assert grapheme_res['grapheme_description'] == 'A-Z letter'
        assert grapheme_res['title'] == 'Looks Good'
        assert grapheme_res['subtitle'] == 'All security checks passed!'


# -- bulk-inspect-names --


def test_bulk_inspect_name_post(test_client):
    names = ['vitalik.eth', 'byczong.mydomain.eth']
    response = test_client.post('/bulk-inspect-names', json={'names': names, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    # only these keys should be returned
    assert all(
        [
            set(r.keys())
            == {
                'name',
                'namehash',
                'normalization',
                'highest_risk',
                'rating',
                'risk_count',
                'beautiful_name',
                'subtitle',
                'title',
                'inspected',
            }
            for r in res_json['results']
        ]
    )

    # more than MAX_NUMBER_OF_NAMES_IN_BULK names
    names_to_inspect = names * 126
    assert len(names_to_inspect) > MAX_NUMBER_OF_NAMES_IN_BULK
    response = test_client.post('/bulk-inspect-names', json={'names': names_to_inspect})
    assert response.status_code == 422


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_bulk_inspect_name_post_stress(test_client):
    names = [f'[{labelhash_from_label(str(i))[2:]}].eth' for i in range(MAX_NUMBER_OF_NAMES_IN_BULK)]
    print(names)
    response = test_client.post('/bulk-inspect-names', json={'names': names, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)


# -- inspect-namehash --
@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.parametrize(
    'network_name, namehash, expected_status_code, expected_name',
    [
        ('mainnet', '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
        ('mainnet', '0xEe6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
        # uppercase hex
        ('mainnet', '0XEe6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
        # uppercase hex
        (
            'mainnet',
            '107841754600925073349285697024366035838042340511934381588201623605284409137205',
            200,
            'vitalik.eth',
        ),
        ('mainnet', '0xe0fe380f4d877f643e88ceabbed4e5ee0efb66f079aabba23e8902336f7948da', 404, None),
        ('sepolia', '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
    ],
)
def test_inspect_namehash_get(
    test_client, network_name: str, namehash: str, expected_status_code: int, expected_name: str
):
    response = test_client.get(f'/inspect-namehash/{network_name}/{namehash}')
    assert response.status_code == expected_status_code
    if expected_status_code != 200:
        return

    res_json = response.json()
    pprint(res_json)

    assert res_json['namehash'] == '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'
    assert res_json['name'] == expected_name


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.parametrize(
    'namehash, normalization, expected_name',
    [
        (
            '0xe0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da',
            'unknown',
            '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
        ),
        (
            '0XE0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da',
            'unknown',
            '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
        ),  # uppercase hex
        (
            '0x0462571d34d206146958c44e473730b1b2630321072c7fbb92deeea946416dab',
            'unknown',
            '[5bc926fc40cc7c49e0df6dddf26e4dc7b9d6d32f4a55d4f0670320dbf414afd2].byongdok.eth',
        ),
        (
            '0x5f57b185ab56ca42b5506f96694c767ebcc8c6e2854a79636b565e4ebe700fb0',
            'unknown',
            '[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth',
        ),
        (
            '0xb2636b6e3b1abdd3fbec454d4f4b1a904e7b15e3609cb208bcfc5a5487293308',
            'unknown',
            '[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth',
        ),
        (
            '0x00f52438ae09d2f909ee2efc19ba8af75058e74ca4507aa091bd8282aa490e77',
            'unknown',
            '🥛.[2e8eaa68c7e128861299162323c29c29672f5c094aceaf22d9c0935e4bbd3f85].🛸.👽.enspunks.eth',
        ),
        pytest.param(
            '0x1bc53f6413409d078ec18a29b17f981eafab341598a4e970ac9efab7d29258af',
            'unnormalized',
            '[zzz].eth',
            marks=pytest.mark.xfail(not pytest.use_monkeypatch, reason='Subgraph stopped resolving this namehash'),
        ),
        pytest.param(
            '0X1Bc53f6413409d078ec18a29b17f981eafab341598a4e970ac9efab7d29258af',
            'unnormalized',
            '[zzz].eth',
            marks=pytest.mark.xfail(not pytest.use_monkeypatch, reason='Subgraph stopped resolving this namehash'),
        ),
        # uppercase hex
    ],
)
def test_inspect_namehash_get_unknown_status(test_client, namehash: str, normalization: str, expected_name: str):
    network_name = 'mainnet'
    response = test_client.get(f'/inspect-namehash/{network_name}/{namehash}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['normalization'] == normalization
    assert res_json['namehash'] == namehash.lower()
    assert res_json['name'] == expected_name


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_inspect_namehash_get_root(test_client):
    namehash = '0x0000000000000000000000000000000000000000000000000000000000000000'
    network_name = 'mainnet'
    response = test_client.get(f'/inspect-namehash/{network_name}/{namehash}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['normalization'] == 'normalized'
    assert res_json['namehash'] == namehash.lower()
    assert res_json['name'] == ''


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.parametrize(
    'namehash, expected_name',
    [
        (
            '0xe0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da',
            '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
        ),
        (
            '0XE0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da',
            '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
        ),  # uppercase hex
        (
            '0x0462571d34d206146958c44e473730b1b2630321072c7fbb92deeea946416dab',
            '[5bc926fc40cc7c49e0df6dddf26e4dc7b9d6d32f4a55d4f0670320dbf414afd2].byongdok.eth',
        ),
        (
            '0x5f57b185ab56ca42b5506f96694c767ebcc8c6e2854a79636b565e4ebe700fb0',
            '[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth',
        ),
        (
            '0xb2636b6e3b1abdd3fbec454d4f4b1a904e7b15e3609cb208bcfc5a5487293308',
            '[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth',
        ),
        (
            '0x00f52438ae09d2f909ee2efc19ba8af75058e74ca4507aa091bd8282aa490e77',
            '[7710d5ebf94bcebcf1996bb7a3f5e24a6d24435b314b3cec815da03640c2940c].[2e8eaa68c7e128861299162323c29c29672f5c094aceaf22d9c0935e4bbd3f85].[a64d2b5a93eda272d27734cc2fb8d1c468562e279f1e97e759eea1a5a410f8e3].[462a1d6391f7ea5916874504f3b5fc8cd43626f6bbabc8a22fe4312dc1585362].enspunks.eth',
        ),
    ],
)
def test_inspect_namehash_get_unknown(test_client, namehash: str, expected_name: str):
    network_name = 'mainnet'
    response = test_client.get(f'/inspect-namehash/{network_name}/{namehash}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['normalization'] == 'unknown'
    assert res_json['namehash']

    # labelhashes are available for every input (also unknown)
    # label value for unknown labels is a labelhash
    for label in res_json['labels']:
        if label['normalization'] == 'unknown':
            assert re.match(r'^\[[0-9a-f]{64}\]$', label['label'])
        assert re.match('^0x[0-9a-f]{64}$', label['labelhash'])


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.parametrize(
    'namehash, expected_status_code, expected_name',
    [
        ('0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
        ('0XEe6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),  # uppercase hex
        ('107841754600925073349285697024366035838042340511934381588201623605284409137205', 200, 'vitalik.eth'),
    ],
)
def test_inspect_namehash_post(test_client, namehash: str, expected_status_code: int, expected_name: str):
    network_name = 'mainnet'
    response = test_client.post('/inspect-namehash', json={'namehash': namehash, 'network_name': network_name})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['namehash'] == '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'
    assert res_json['name'] == expected_name


@pytest.mark.parametrize(
    'namehash, expected_reason',
    [
        ('0x123', "Hex number must be 64 digits long and prefixed with '0x'."),
        (
            '0xgggg4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835',
            "Hex number must be 64 digits long and prefixed with '0x'.",
        ),
        ('1652fred1253', "Must be a valid, decimal integer or a hex number with 64 digits, prefixed with '0x'."),
        (
            '115792089237316195423570985008687907853269984665640564039457584007913129639936',
            'The decimal integer converted to base-16 should have at most 64 digits.',
        ),
    ],
)
def test_inspect_namehash_invalid_namehash(test_client, namehash, expected_reason):
    network_name = 'mainnet'
    response = test_client.post('/inspect-namehash', json={'namehash': namehash, 'network_name': network_name})
    assert response.status_code == 422
    res_json = response.json()
    assert res_json['detail'].startswith('Provided namehash is not valid')
    assert res_json['detail'].endswith(expected_reason)


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.xfail(not pytest.use_monkeypatch, reason='Subgraph stopped resolving this namehash')
def test_inspect_namehash_mismatch_error(test_client):
    network_name = 'mainnet'
    # todo: how to find registered namehash with null bytes inside?
    namehash = '0xdffa165b6d6cfb2fa47e0d50e429380c60e7be170ba21301c22628b66653a951'  # the name looks like unknown
    response = test_client.post('/inspect-namehash', json={'namehash': namehash, 'network_name': network_name})
    assert response.status_code == 500
    res_json = response.json()
    assert res_json['detail'].startswith(
        'Namehash calculated on the name returned from ENS Subgraph does not equal the input namehash.'
    )


# -- inspect-labelhash --
@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_inspect_labelhash_get(test_client):
    labelhash = labelhash_from_label('vitalik')
    network_name = 'mainnet'
    response = test_client.get(f'/inspect-labelhash/{network_name}/{labelhash}/eth')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == 'vitalik.eth'


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_inspect_labelhash_get_empty(test_client):
    labelhash = labelhash_from_label('dcjq92834vhh8teru5903wu9hawtpyhuoidfj09q2yh987euitvhgs')
    response = test_client.get(f'/inspect-labelhash/mainnet/{labelhash}')  # empty parent = ''
    assert response.status_code == 404
    assert response.json()['detail'] == 'Provided namehash could not be found in ENS Subgraph.'

    response = test_client.get('/inspect-labelhash/mainnet')
    assert response.status_code == 404

    response = test_client.get('/inspect-labelhash')
    # method not allowed because this is the POST endpoint path
    assert response.status_code == 405


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.parametrize(
    'labelhash, parent, expected_status_code, expected_name',
    [
        ('0xaf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc', None, 200, 'vitalik.eth'),
        ('0XAf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc', None, 200, 'vitalik.eth'),
        # uppercase hex
        ('79233663829379634837589865448569342784712482819484549289560981379859480642508', 'eth', 200, 'vitalik.eth'),
        (
            '0xaf498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770',
            None,
            200,
            '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
        ),
        ('0x97bf1a722288db8edaf0f6687b4431ac96feb13d3b55a7b11e9c6bc33f938bef', None, 404, None),
        # 08745yortgh04y-53jpfdhudpdfhgw5th42yhgerotihg4w95hy8
        ('0xaf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc', 'nonexistentparent', 404, None),
        ('0x12345', None, 422, None),
        ('0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb', None, 200, 'a.eth'),
    ],
)
def test_inspect_labelhash_post(test_client, labelhash, parent, expected_status_code, expected_name):
    network_name = 'mainnet'
    json_req = {'labelhash': labelhash, 'network_name': network_name}
    if parent:
        json_req['parent_name'] = parent

    response = test_client.post('/inspect-labelhash', json=json_req)
    assert response.status_code == expected_status_code
    res_json = response.json()
    pprint(res_json)

    if expected_status_code != 200:
        return

    assert res_json['name'] == expected_name

    for label in res_json['labels']:
        if label['normalization'] == 'unknown':
            assert re.match(r'^\[[0-9a-f]{64}\]$', label['label'])
            assert label['graphemes'] is None
        assert re.match(r'^0x[0-9a-f]{64}$', label['labelhash'])


@pytest.mark.skipif(running_lambda_tests, reason='cannot monkeypatch if testing lambda')
def test_inspect_labelhash_get_unexpected_response_body(monkeypatch, test_client):
    labelhash = labelhash_from_label('vitalik1')
    network_name = 'mainnet'

    async def return_mock_response(*args, **kwargs):
        return httpx.Response(200, content=b'{"response": "response"}')

    monkeypatch.setattr(httpx.AsyncClient, 'post', return_mock_response)

    response = test_client.get(f'/inspect-labelhash/{network_name}/{labelhash}/eth')
    assert response.status_code == 503


@pytest.mark.skipif(running_lambda_tests, reason='cannot monkeypatch if testing lambda')
def test_inspect_labelhash_get_unexpected_status_code(monkeypatch, test_client):
    labelhash = labelhash_from_label('vitalik2')
    network_name = 'mainnet'

    async def return_mock_response(*args, **kwargs):
        return httpx.Response(123)

    monkeypatch.setattr(httpx.AsyncClient, 'post', return_mock_response)

    response = test_client.get(f'/inspect-labelhash/{network_name}/{labelhash}/eth')
    assert response.status_code == 503


@pytest.mark.skipif(running_lambda_tests, reason='cannot monkeypatch if testing lambda')
def test_inspect_labelhash_get_http_error(monkeypatch, test_client):
    labelhash = labelhash_from_label('vitalik3')
    network_name = 'mainnet'

    async def return_mock_response(*args, **kwargs):
        raise httpx.HTTPError('error')

    monkeypatch.setattr(httpx.AsyncClient, 'post', return_mock_response)

    response = test_client.get(f'/inspect-labelhash/{network_name}/{labelhash}/eth')
    assert response.status_code == 503


def test_inspect_grapheme(test_client):
    response = test_client.get('/inspect-grapheme/ś')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    check_order_of_list([check['status'] for check in res_json['checks']])

    for check in res_json['checks']:
        assert 'check' in check and 'message' in check
        assert check['status'] in ('pass', 'warn')
        assert check['check_name'][0].isupper() and '_' not in check['check_name']

    assert res_json['canonical_grapheme'] in [confusable['grapheme'] for confusable in res_json['confusables']]
    assert res_json['confusables'][0]['is_canonical']
    assert not res_json['confusables'][1]['is_canonical']


def test_inspect_grapheme_multi(test_client):
    response = test_client.get('/inspect-grapheme/aś')
    assert response.status_code == 422


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.parametrize(
    'address, impersonation_status, primary_name_status, primary_name, display_name, canonical_name, impersonation_risk, name',
    [
        (
            '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
            'unlikely',
            'normalized',
            'vitalik.eth',
            'vitalik.eth',
            'vitalik.eth',
            False,
            'vitalik.eth',
        ),
        (
            '0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776',
            'potential',
            'normalized',
            'vitalìk.eth',
            'vitalìk.eth',
            'vitalik.eth',
            True,
            'vitalìk.eth',
        ),
        (
            '0x8B7863d67e1083EE1becbDD277cbBFf1c1CCB631',
            'unlikely',
            'normalized',
            '٧٣٧.eth',
            '٧٣٧.eth',
            '٧٣٧.eth',
            False,
            '٧٣٧.eth',
        ),
        (
            '0xFD9eE68000Dc92aa6c67F8f6EB5d9d1a24086fAd',
            'unlikely',
            'normalized',
            'exampleprimary.cb.id',
            'exampleprimary.cb.id',
            'exampleprimary.cb.id',
            False,
            'exampleprimary.cb.id',
        ),
        (
            '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96046',
            None,
            'no_primary_name',
            None,
            'Unnamed d8da',
            None,
            False,
            None,
        ),
        (
            '0xfA9A134f997b3d48e122d043E12d04E909b11073',
            None,
            'unnormalized',
            None,
            'Unnamed fa9a',
            None,
            False,
            '888‍‍.eth',
        ),
        (
            '0x76fd9b1B2d8F2cd9Ba06c925506627883F97B97C',
            None,
            'unnormalized',
            None,
            'Unnamed 76fd',
            None,
            False,
            '‍‍❤‍‍.eth',
        ),
        (
            '0xf537a27F31d7A014c5b8008a0069c61f827fA7A1',
            None,
            'unnormalized',
            None,
            'Unnamed f537',
            None,
            False,
            '٠٠۱.eth',
        ),  # normalizable
        (
            '0x0ebDfD75d33c05025074fd7845848D44966AB367',
            None,
            'unnormalized',
            None,
            'Unnamed 0ebd',
            None,
            False,
            '۸۸۷۵۴۲.eth',
        ),  # normalizable
        (
            '0xaf738F6C83d7D2C46723b727Ce794F9c79Cc47E6',
            None,
            'unnormalized',
            None,
            'Unnamed af73',
            None,
            False,
            '୨୨୨୨୨.eth',
        ),  # canonical can be '99999.eth'
        (
            '0xb281405429C3bc91e52707a21754cDaCeCbB035E',
            None,
            'unnormalized',
            None,
            'Unnamed b281',
            None,
            False,
            '┣▇▇▇═─.eth',
        ),
        (
            '0x0d756ee0e8C250f88f5e0eDd7C723dc3A0BF75cF',
            None,
            'unnormalized',
            None,
            'Unnamed 0d75',
            None,
            False,
            'сбер.eth',
        ),  # canonical can be 'c6ep.eth'
        (
            '0x7Da3CdE891a76416ec9D1c3354B8EfE550Bd4e20',
            None,
            'unnormalized',
            None,
            'Unnamed 7da3',
            'vitalik.eth',
            True,
            'vitȧlik.eth',
        ),
        (
            '0xC9f598BC5BB554B6A15A96D19954B041C9FDbF14',
            None,
            'unnormalized',
            None,
            'Unnamed c9f5',
            'vitalik.eth',
            True,
            'vıtalik.eth',
        ),
        (
            '0x7c7160A23b32402ad24ED5a617b8a83f434642d4',
            'unlikely',
            'normalized',
            'vincξnt.eth',
            'vincΞnt.eth',
            'vincξnt.eth',
            False,
            'vincξnt.eth',
        ),
        (
            '0x744Ec0A91D420c257aE3eE471B79B1A6a0312E36',
            None,
            'unnormalized',
            None,
            'Unnamed 744e',
            None,
            False,
            'hello<world>!.eth',
        ),  # attempt code injection
        # unknown primary name is impossible
    ],
)
def test_primary_name(
    test_client,
    address,
    impersonation_status,
    primary_name_status,
    primary_name,
    display_name,
    canonical_name,
    impersonation_risk,
    name,
):
    response = test_client.get(f'/secure-primary-name/mainnet/{address}?return_nameguard_report=true')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['impersonation_status'] == impersonation_status
    assert res_json['primary_name_status'] == primary_name_status
    assert res_json['primary_name'] == primary_name
    assert res_json['display_name'] == display_name
    if primary_name_status != 'no_primary_name':
        assert res_json['nameguard_report']['name'] == name
        assert res_json['nameguard_report']['canonical_name'] == canonical_name
        assert (
            any(
                check['check'] == 'impersonation_risk' and check['status'] == 'warn'
                for check in res_json['nameguard_report']['checks']
            )
            == impersonation_risk
        )


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_primary_name_get(test_client):
    address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    response = test_client.get(f'/secure-primary-name/mainnet/{address}')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['impersonation_status'] == 'unlikely'
    assert res_json['primary_name_status'] == 'normalized'
    assert res_json['primary_name'] == 'vitalik.eth'
    assert res_json['display_name'] == 'vitalik.eth'
    assert res_json['nameguard_report'] is None


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_primary_name_get_no_report(test_client):
    address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    response = test_client.get(f'/secure-primary-name/mainnet/{address}?return_nameguard_report=false')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['impersonation_status'] == 'unlikely'
    assert res_json['primary_name_status'] == 'normalized'
    assert res_json['primary_name'] == 'vitalik.eth'
    assert res_json['display_name'] == 'vitalik.eth'
    assert res_json['nameguard_report'] is None


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_primary_name_get_report(test_client):
    address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    response = test_client.get(f'/secure-primary-name/mainnet/{address}?return_nameguard_report=true')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['impersonation_status'] == 'unlikely'
    assert res_json['primary_name_status'] == 'normalized'
    assert res_json['primary_name'] == 'vitalik.eth'
    assert res_json['display_name'] == 'vitalik.eth'
    assert res_json['nameguard_report'] is not None


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_primary_name_get_uppercase(test_client):
    address = '0XD8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    response = test_client.get(f'/secure-primary-name/mainnet/{address}')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['impersonation_status'] == 'unlikely'
    assert res_json['primary_name_status'] == 'normalized'
    assert res_json['primary_name'] == 'vitalik.eth'
    assert res_json['display_name'] == 'vitalik.eth'


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_primary_name_get_offchain(test_client):
    address = '0xFD9eE68000Dc92aa6c67F8f6EB5d9d1a24086fAd'
    response = test_client.get(f'/secure-primary-name/mainnet/{address}')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['impersonation_status'] == 'unlikely'
    assert res_json['primary_name_status'] == 'normalized'
    assert res_json['primary_name'] == 'exampleprimary.cb.id'
    assert res_json['display_name'] == 'exampleprimary.cb.id'


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_primary_name_get_no_primary_name(test_client):
    address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96046'
    response = test_client.get(f'/secure-primary-name/mainnet/{address}')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['impersonation_status'] is None
    assert res_json['primary_name_status'] == 'no_primary_name'
    assert res_json['primary_name'] is None
    assert res_json['display_name'] == 'Unnamed d8da'


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_primary_name_get_unnormalized(test_client):
    address = '0xfA9A134f997b3d48e122d043E12d04E909b11073'  # 888‍‍.eth
    response = test_client.get(f'/secure-primary-name/mainnet/{address}')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['impersonation_status'] is None
    assert res_json['primary_name_status'] == 'unnormalized'
    assert res_json['primary_name'] is None
    assert res_json['display_name'] == 'Unnamed fa9a'


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_primary_name_get_uninspected(test_client):
    address = '0xf4A4D9C75dA65d507cfcd5ff0aCB73D40D3A3bCB'
    response = test_client.get(f'/secure-primary-name/mainnet/{address}')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['impersonation_status'] is None
    assert res_json['primary_name_status'] == 'uninspected'
    assert res_json['primary_name'] is None
    assert res_json['display_name'] == 'Unnamed f4a4'


def test_primary_name_get_invalid_address(test_client):
    address = '0xfA9A134f997b3d48e122d043E12d04E909b1107g'
    response = test_client.get(f'/secure-primary-name/mainnet/{address}')
    assert response.status_code == 422


def test_primary_name_get_empty(test_client):
    response = test_client.get('/secure-primary-name/mainnet')
    assert response.status_code == 404

    response = test_client.get('/secure-primary-name')
    assert response.status_code == 404


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
def test_primary_name_get_emoji(test_client):
    address = '0x63A93f5843aD57d756097ef102A2886F05c7a29c'
    response = test_client.get(f'/secure-primary-name/mainnet/{address}?return_nameguard_report=true')
    assert response.status_code == 200
    res_json = response.json()

    assert res_json['impersonation_status'] == 'potential'
    assert res_json['primary_name_status'] == 'normalized'
    assert res_json['primary_name'] == '👩🏿\u200d🦱.eth'
    assert res_json['display_name'] == '👩🏿\u200d🦱.eth'
    assert (
        res_json['nameguard_report']['highest_risk']['message']
        == 'Emojis used in this name may be visually confused with other similar emojis'
    )


def test_invalid_unicode(test_client):
    with pytest.raises(UnicodeEncodeError):
        # throws inside httpx
        test_client.get('/inspect-grapheme/\uD801\uDC37')


@pytest.mark.parametrize(
    'contract_address, token_id, title, fields, fake, faking_fields',
    [
        (
            '0x495f947276749ce646f68ac8c248420045cb7b5e',
            '61995921128521442959106650131462633744885269624153038309795231243542768648193',
            'nick.eth',
            {
                'contractMetadata.name': 'OpenSea Shared Storefront',
                'contractMetadata.openSea.collectionName': 'OS Shared ' 'Storefront ' 'Collection',
                'metadata.name': 'nick.eth',
                'title': 'nick.eth',
            },
            FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
            {'metadata.name': 'nick.eth', 'title': 'nick.eth'},
        ),
        # fake nick.eth
        (
            '0x2cc8342d7c8bff5a213eb2cde39de9a59b3461a7',
            '45104',
            '  111.eth',
            {
                'contractMetadata.name': 'ETHRegistrarLinageeWrapper',
                'contractMetadata.openSea.collectionName': 'Linagee ' 'Name ' 'Registrar ' '(LNR)',
                'metadata.name': '  111.eth',
                'title': '  111.eth',
            },
            FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
            {'metadata.name': '  111.eth', 'title': '  111.eth'},
        ),
        (
            '0x495f947276749ce646f68ac8c248420045cb7b5e',
            '115299889408293060529275095010636973531920388509401805939660647627196198813697',
            'Bob.eth',
            {
                'contractMetadata.name': 'OpenSea Shared Storefront',
                'contractMetadata.openSea.collectionName': 'OS Shared ' 'Storefront ' 'Collection',
                'metadata.name': 'Bob.eth',
                'title': 'Bob.eth',
            },
            FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
            {'metadata.name': 'Bob.eth', 'title': 'Bob.eth'},
        ),
        # pytest.param('0x495f947276749ce646f68ac8c248420045cb7b5e',
        #              '87268313074833894749413679830860625010141738974859681274795075557252109697025',
        #              '',
        #              {},
        #              FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
        #              marks=pytest.mark.xfail(reason='wrong collection name returned by Alchemy?')),
        # based on collection name
        (
            '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
            '3972',
            '',
            {
                'contractMetadata.name': 'BoredApeYachtClub',
                'contractMetadata.openSea.collectionName': 'Bored Ape ' 'Yacht ' 'Club',
                'title': '',
            },
            FakeEthNameCheckStatus.NON_IMPERSONATED_ETH_NAME,
            None,
        ),
        (
            '0xbd3531da5cf5857e7cfaa92426877b022e612cf8',
            '2028',
            'Pudgy Penguin #2028',
            {
                'contractMetadata.name': 'PudgyPenguins',
                'contractMetadata.openSea.collectionName': 'Pudgy ' 'Penguins',
                'metadata.name': 'Pudgy Penguin #2028',
                'title': 'Pudgy Penguin #2028',
            },
            FakeEthNameCheckStatus.NON_IMPERSONATED_ETH_NAME,
            None,
        ),
        # ('0xbd3531da5cf5857e7cfaa92426877b022e612cf9',
        #  '2028',
        #  FakeEthNameCheckStatus.UNKNOWN_NFT),  # NOT_A_CONTRACT
        (
            '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
            '47192814855232171824620094590612668126513223473283784600320596656451859494352',
            'brantly.eth',
            {
                'contractMetadata.openSea.collectionName': 'ENS: ' 'Ethereum ' 'Name ' 'Service',
                'metadata.name': 'brantly.eth',
                'title': 'brantly.eth',
            },
            FakeEthNameCheckStatus.AUTHENTIC_ETH_NAME,
            None,
        ),  # brantly.eth
        (
            '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
            '0X68562Fc74af4dcfac633a803c2f57c2b826827b47f797b6ab4e468dc8607b5d0',
            'brantly.eth',
            {
                'contractMetadata.openSea.collectionName': 'ENS: ' 'Ethereum ' 'Name ' 'Service',
                'metadata.name': 'brantly.eth',
                'title': 'brantly.eth',
            },
            FakeEthNameCheckStatus.AUTHENTIC_ETH_NAME,
            None,
        ),  # brantly.eth uppercase hex
        (
            '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
            '0x68562fc74af4dcfac633a803c2f57c2b826827b47f797b6ab4e468dc8607b5d0',
            'brantly.eth',
            {
                'contractMetadata.openSea.collectionName': 'ENS: ' 'Ethereum ' 'Name ' 'Service',
                'metadata.name': 'brantly.eth',
                'title': 'brantly.eth',
            },
            FakeEthNameCheckStatus.AUTHENTIC_ETH_NAME,
            None,
        ),  # brantly.eth
        (
            '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
            '0xaf498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770',
            '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
            {
                'contractMetadata.openSea.collectionName': 'ENS: ' 'Ethereum ' 'Name ' 'Service',
                'metadata.name': '[0xaf49...2770].eth',
                'title': '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
            },
            FakeEthNameCheckStatus.UNKNOWN_ETH_NAME,
            None,
        ),
        # unknown but registered #TODO 'title': '[0xaf49...2770].eth'
        (
            '0X57F1887a8bf19b14fc0df6fd9b2acc9af147ea85',
            '47192814855232171824620094590612668126513223473283784600320596656451859494352',
            'brantly.eth',
            {
                'contractMetadata.openSea.collectionName': 'ENS: ' 'Ethereum ' 'Name ' 'Service',
                'metadata.name': 'brantly.eth',
                'title': 'brantly.eth',
            },
            FakeEthNameCheckStatus.AUTHENTIC_ETH_NAME,
            None,
        ),  # brantly.eth uppercase hex
        # ('0X57F1887a8bf19b14fc0df6fd9b2acc9af147ea85',
        #  '0x37bf77d30d63cbf9ddad6b3c161522c53dcdcd8177b6177c83835c5ea69a7f8f',
        #  FakeEthNameCheckStatus.UNKNOWN_NFT),
        # random ENS name
        (
            '0xfe4f558a0fee0657bfa044792f5545f5a8f4ecb1',
            '1',
            'ENS EMOJI PUNK - NICK.ETH',
            {
                'contractMetadata.name': 'ENS????',
                'contractMetadata.openSea.collectionName': 'ENS - ' 'wMZyJHiap2',
                'metadata.name': 'ENS EMOJI PUNK - NICK.ETH',
                'title': 'ENS EMOJI PUNK - NICK.ETH',
            },
            FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
            {'metadata.name': 'ENS EMOJI PUNK - NICK.ETH', 'title': 'ENS EMOJI PUNK - NICK.ETH'},
        ),
        # https://rarible.com/token/0xfe4f558a0fee0657bfa044792f5545f5a8f4ecb1:1
        (
            '0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401',
            '34762977820481521209114130776556072772965907316729597364642457029530388725237',
            'dot.this.averageman.eth',
            {
                'contractMetadata.name': 'NameWrapper',
                'contractMetadata.openSea.collectionName': 'ENS: ' 'Ethereum ' 'Name ' 'Service',
                'metadata.name': 'dot.this.averageman.eth',
                'title': 'dot.this.averageman.eth',
            },
            FakeEthNameCheckStatus.AUTHENTIC_ETH_NAME,
            None,
        ),
        # NameWrapper https://rarible.com/token/0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401:34762977820481521209114130776556072772965907316729597364642457029530388725237
        # pytest.param('0x495f947276749ce646f68ac8c248420045cb7b5e',
        #              '12254154752654038808579574986506730093213650301129873673484321000757900869633',
        #              FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
        #              marks=pytest.mark.xfail(reason='also delisted on opensea')),
        # https://rarible.com/token/0x495f947276749ce646f68ac8c248420045cb7b5e:12254154752654038808579574986506730093213650301129873673484321000757900869633
        (
            '0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401',
            '0x37bf77d30d63cbf9ddad6b3c161522c53dcdcd8177b6177c83835c5ea69a7f8f',
            'asd.eth',
            {'title': 'asd.eth'},
            FakeEthNameCheckStatus.AUTHENTIC_ETH_NAME,
            None,
        ),
        # NameWrapper random ENS name not matching token_id
        # pytest.param('0x495f947276749Ce646f68AC8c248420045cb7b5e',
        #              '7432975079437310392139769917906933533429658990679450758216769878461532602369',
        #              FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
        #              marks=pytest.mark.xfail(reason='why not works? it is on x2y2 but delisted on opensea')),
        # https://x2y2.io/eth/0x495f947276749Ce646f68AC8c248420045cb7b5e/7432975079437310392139769917906933533429658990679450758216769878461532602369
        (
            '0x47dD5F6335FfEcBE77E982d8a449263d1e501301',
            '79',
            'vitalik.eth',
            {
                'contractMetadata.name': 'Hashrunes',
                'contractMetadata.openSea.collectionName': 'Hashrunes',
                'metadata.name': 'vitalik.eth',
                'title': 'vitalik.eth',
            },
            FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
            {'metadata.name': 'vitalik.eth', 'title': 'vitalik.eth'},
        ),
        # https://x2y2.io/eth/0x47dD5F6335FfEcBE77E982d8a449263d1e501301/79
        (
            '0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7',
            '8107',
            'vitalik.eth',
            {
                'contractMetadata.name': 'ETHRegistrarLinageeWrapper',
                'contractMetadata.openSea.collectionName': 'Linagee ' 'Name ' 'Registrar ' '(LNR)',
                'metadata.name': 'vitalik.eth',
                'title': 'vitalik.eth',
            },
            FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
            {'metadata.name': 'vitalik.eth', 'title': 'vitalik.eth'},
        ),
        # https://x2y2.io/eth/0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7/8107
        (
            '0xd8B287885cAb9E377de8F61f000Ff9B3F50e2F4d',
            '4',
            'Vitalik #4',
            {
                'contractMetadata.name': 'Vitalik.eth',
                'contractMetadata.openSea.collectionName': 'Vitalik.eth V4',
                'metadata.name': 'Vitalik #4',
                'title': 'Vitalik #4',
            },
            FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
            {'contractMetadata.name': 'Vitalik.eth', 'contractMetadata.openSea.collectionName': 'Vitalik.eth V4'},
        ),
        # https://foundation.app/@rogerhaus/vitalik/4
        (
            '0xd8B287885cAb9E377de8F61f000Ff9B3F50e2F4d',
            '0x4',
            'Vitalik #4',
            {
                'contractMetadata.name': 'Vitalik.eth',
                'contractMetadata.openSea.collectionName': 'Vitalik.eth V4',
                'metadata.name': 'Vitalik #4',
                'title': 'Vitalik #4',
            },
            FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
            {'contractMetadata.name': 'Vitalik.eth', 'contractMetadata.openSea.collectionName': 'Vitalik.eth V4'},
        ),
        # token id as hex
        (
            '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            '1',
            '',
            {},
            FakeEthNameCheckStatus.NON_IMPERSONATED_ETH_NAME,
            None,
        ),
        # NO_SUPPORTED_NFT_STANDARD
        (
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            '1',
            '',
            {},
            FakeEthNameCheckStatus.NON_IMPERSONATED_ETH_NAME,
            None,
        ),
        # NO_SUPPORTED_NFT_STANDARD
        (
            '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
            '1',
            '',
            {},
            FakeEthNameCheckStatus.NON_IMPERSONATED_ETH_NAME,
            None,
        ),
        (
            '0x495f947276749ce646f68ac8c248420045cb7b5e',
            '61995921128521442959106650131462633744885269624153038309795231243542768648193',
            'nick.eth',
            {
                'contractMetadata.name': 'OpenSea Shared Storefront',
                'contractMetadata.openSea.collectionName': 'OS Shared ' 'Storefront ' 'Collection',
                'metadata.name': 'ABC',
                'title': 'ABC',
            },
            FakeEthNameCheckStatus.NON_IMPERSONATED_ETH_NAME,
            None,
        ),  # doubled title
        # NO_SUPPORTED_NFT_STANDARD
        (
            '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
            '1',
            '',
            {'title': 'asd nick.eth asd'},
            FakeEthNameCheckStatus.POTENTIALLY_IMPERSONATED_ETH_NAME,
            {'title': 'asd nick.eth asd'},
        ),
        (
            '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
            '1',
            '',
            {'title': ''},
            FakeEthNameCheckStatus.AUTHENTIC_ETH_NAME,
            None,
        ),
        # matic chain is not supported now
        # ('0x2953399124f0cbb46d2cbacd8a89cf0599974963', '1075136997460547214433646341011567219464027878285908866916833491623281164289', FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME),
        # ('0x2953399124f0cbb46d2cbacd8a89cf0599974963', '3741242716829664262552727484824431817099747563526660400091605301110364962817', FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME),
        # ('0xcc6c63044bfe4e991f3a13b35b6ee924b54cd304', '440', FakeEthNameCheckStatus.NON_IMPERSONATED_ETH_NAME),
    ],
)
def test_fake_eth_name_check_fields(
    test_client, contract_address, token_id, title, fields, fake, faking_fields, monkeypatch
):
    network_name = 'mainnet'

    json_req = {
        'network_name': network_name,
        'contract_address': contract_address,
        'token_id': token_id,
        'title': title,
        'fields': fields,
    }
    response = test_client.post('/fake-eth-name-check', json=json_req)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['status'] == fake
    if res_json['status'] in (
        FakeEthNameCheckStatus.INVALID_ETH_NAME,
        FakeEthNameCheckStatus.AUTHENTIC_ETH_NAME,
        FakeEthNameCheckStatus.UNKNOWN_ETH_NAME,
    ):
        assert res_json['nameguard_report'] is not None
    else:
        assert res_json['nameguard_report'] is None

    # if res_json['status'] != FakeEthNameCheckStatus.UNKNOWN_NFT:
    #     assert res_json['investigated_fields']

    assert res_json['investigated_fields'] == faking_fields
    pprint(res_json)


@pytest.mark.parametrize(
    'contract_address, token_id, title, fields',
    [
        ('0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85', '1', '', {'collection': 'asd nick.eth asd'}),
    ],
)
def test_fake_eth_name_check_fields_missing_title(test_client, contract_address, token_id, title, fields, monkeypatch):
    network_name = 'mainnet'

    json_req = {
        'network_name': network_name,
        'contract_address': contract_address,
        'token_id': token_id,
        'title': title,
        'fields': fields,
    }
    response = test_client.post('/fake-eth-name-check', json=json_req)
    assert response.status_code == 422


def test_inspect_name_post_long(test_client):
    name = '≡ƒÿ║' * 50  # equal to MAX_INSPECTED_NAME_CHARACTERS
    assert len(name) == MAX_INSPECTED_NAME_CHARACTERS

    response = test_client.post('/inspect-name', json={'name': name, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['highest_risk']['check'] == 'normalized'
    assert res_json['inspected']
    pprint(res_json)


def test_bulk_inspect_name_post_long(test_client):
    name = '≡ƒÿ║' * 50  # equal to MAX_INSPECTED_NAME_CHARACTERS
    assert len(name) == MAX_INSPECTED_NAME_CHARACTERS

    names = [name] * MAX_NUMBER_OF_NAMES_IN_BULK
    response = test_client.post('/bulk-inspect-names', json={'names': names, 'network_name': 'mainnet'}, timeout=60)
    assert response.status_code == 200
    res_json = response.json()
    for x in res_json['results']:
        assert x['highest_risk']['check'] == 'normalized'
        assert x['inspected']


def test_bulk_inspect_name_post_too_long(test_client):
    name = '≡ƒÿ║' * 51  # more than MAX_INSPECTED_NAME_CHARACTERS
    assert len(name) > MAX_INSPECTED_NAME_CHARACTERS

    names = [name] * MAX_NUMBER_OF_NAMES_IN_BULK
    response = test_client.post('/bulk-inspect-names', json={'names': names, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()

    for x in res_json['results']:
        assert x['highest_risk']['check'] == 'uninspected'
        assert x['normalization'] == 'unnormalized'
        assert not x['inspected']


def test_bulk_inspect_name_post_too_long_normalized(test_client):
    name = 'abcd' * 51  # more than MAX_INSPECTED_NAME_CHARACTERS
    assert len(name) > MAX_INSPECTED_NAME_CHARACTERS

    names = [name] * MAX_NUMBER_OF_NAMES_IN_BULK
    response = test_client.post('/bulk-inspect-names', json={'names': names, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()

    for x in res_json['results']:
        assert x['highest_risk']['check'] == 'uninspected'
        assert x['normalization'] == 'normalized'
