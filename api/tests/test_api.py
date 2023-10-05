import pytest
from fastapi.testclient import TestClient
from urllib.parse import quote
from pprint import pprint
import re
import httpx

from nameguard.models import FakeENSCheckStatus
from nameguard.utils import labelhash_from_label


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
    network_name = 'mainnet'
    response = test_client.get(f'/{api_version}/inspect-name/{network_name}/{name}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == name
    assert res_json['namehash'] == '0xf8c2c01d386a4807b3ceb131e4975ff37b44824ac9307121b18223f3d77d0c2e'
    assert res_json['normalization'] == 'normalized'
    assert res_json['highest_risk'] == None
    assert res_json['rating'] == 'pass'
    assert res_json['risk_count'] == 0
    assert res_json['checks']
    assert res_json['labels']
    assert all([label['labelhash'] for label in res_json['labels']])


CORRECT_CHECKS_ORDER = ['alert', 'warn', 'pass', 'info', 'skip']


def check_order_of_list(l: list[str]):
    for i in range(len(l) - 1):
        assert CORRECT_CHECKS_ORDER.index(l[i]) <= CORRECT_CHECKS_ORDER.index(
            l[i + 1]), f"Order of checks is not correct: {l[i + 1]} should be before {l[i]}"


def test_inspect_name_get_unnormalized(test_client, api_version):
    name = 'bycz ong.eth'
    network_name = 'mainnet'
    response = test_client.get(f'/{api_version}/inspect-name/{network_name}/{name}')
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
    "encoded_input_name, decoded_name, do_quote",
    [
        ('iam%2Falice%3F.eth', 'iam/alice?.eth', True),
        pytest.param('iam/alice?.eth', 'iam/alice?.eth', False, marks=pytest.mark.xfail(reason="not urlencoded")),
        ('%C5%BC%C3%B3%20%C5%82%C4%87', 'żó łć', True),
        ('%3F%3F%2F%3F%2F%3F%3F', '??/?/??', True),
        ('%2511%25.%3F.eth', '%11%.?.eth', True),
    ]
)
def test_inspect_name_get_special_characters(test_client, api_version, encoded_input_name: str, decoded_name: str,
                                             do_quote: bool):
    if do_quote:
        encoded_input_name = quote(
            encoded_input_name.encode('utf-8'))  # because TestClient is doing additional unquote before sending request
    network_name = 'mainnet'
    response = test_client.get(f'/{api_version}/inspect-name/{network_name}/{encoded_input_name}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == decoded_name


def test_inspect_name_get_empty(test_client, api_version):
    network_name = 'mainnet'
    response = test_client.get(f'/{api_version}/inspect-name/{network_name}')
    assert response.status_code == 200
    res_json = response.json()
    assert res_json['name'] == ''
    assert res_json['namehash'] == '0x0000000000000000000000000000000000000000000000000000000000000000'
    assert res_json['normalization'] == 'normalized'

    response = test_client.get(f'/{api_version}/inspect-name')
    # method not allowed because this is the POST endpoint path
    assert response.status_code == 405


def test_inspect_name_post_latin_all_pass(test_client, api_version):
    name = 'vitalik.eth'
    response = test_client.post(f'/{api_version}/inspect-name', json={'name': name, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == name
    assert res_json['namehash'] == '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'
    assert res_json['normalization'] == 'normalized'
    assert res_json['highest_risk'] == None
    assert res_json['rating'] == 'pass'
    assert res_json['risk_count'] == 0
    assert res_json['checks']
    assert len(res_json['labels']) == 2

    for check in res_json['checks']:
        assert 'check' in check and 'message' in check
        assert check['status'] == 'pass'

    # labels keys
    assert (set(label_res.keys()) == {'label', 'labelhash', 'normalization', 'highest_risk', 'rating', 'risk_count', 'checks', 'graphemes'}
            for label_res in res_json['labels'])

    # grapheme keys
    assert all(
        set(grapheme_res.keys()) == {'grapheme', 'grapheme_name', 'grapheme_type', 'grapheme_script',
                                     'grapheme_link', 'highest_risk', 'rating', 'risk_count', 'grapheme_description'}
        for label_res in res_json['labels'] for grapheme_res in label_res['graphemes']
    )

    for i, label in enumerate(('vitalik', 'eth')):
        assert res_json['labels'][i]['label'] == label
        assert res_json['labels'][i]['labelhash'] == labelhash_from_label(label)
        assert res_json['labels'][i]['normalization'] == 'normalized'
        for check in res_json['labels'][i]['checks']:
            assert 'check' in check and 'message' in check
            assert check['status'] == 'pass'

    for grapheme_res, expected_grapheme in zip(res_json['labels'][0]['graphemes'], list('vitalik')):
        assert grapheme_res['grapheme'] == expected_grapheme
        assert grapheme_res['grapheme_script'] == 'Latin'
        assert grapheme_res['highest_risk'] == None
        assert grapheme_res['rating'] == 'pass'
        assert grapheme_res['risk_count'] == 0



# -- bulk-inspect-name --

def test_bulk_inspect_name_post(test_client, api_version):
    names = ['vitalik.eth', 'byczong.mydomain.eth']
    response = test_client.post(f'/{api_version}/bulk-inspect-names', json={'names': names, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    # only these keys should be returned
    assert all(
        [set(r.keys()) == {'name', 'namehash', 'normalization', 'highest_risk', 'rating', 'risk_count'} for r in res_json['results']]
    )

    # more than 250 names
    response = test_client.post(f'/{api_version}/bulk-inspect-names', json={'names': names * 126})
    assert response.status_code == 422

def test_bulk_inspect_name_post_stress(test_client, api_version):
    names = [f'[{labelhash_from_label(str(i))[2:]}].eth' for i in range(250)]
    print(names)
    response = test_client.post(f'/{api_version}/bulk-inspect-names', json={'names': names, 'network_name': 'mainnet'})
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    

# -- inspect-namehash --

@pytest.mark.parametrize(
    "network_name, namehash, expected_status_code, expected_name",
    [
        ('mainnet', '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
        ('mainnet', '0xEe6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),  # uppercase hex
        ('mainnet', '0XEe6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),  # uppercase hex
        ('mainnet', '107841754600925073349285697024366035838042340511934381588201623605284409137205', 200, 'vitalik.eth'),
        ('mainnet', '0xe0fe380f4d877f643e88ceabbed4e5ee0efb66f079aabba23e8902336f7948da', 404, None),
        ('goerli', '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
        ('sepolia', '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
    ]
)
def test_inspect_namehash_get(test_client, api_version, network_name: str, namehash: str, expected_status_code: int, expected_name: str):
    response = test_client.get(f'/{api_version}/inspect-namehash/{network_name}/{namehash}')
    assert response.status_code == expected_status_code
    if expected_status_code != 200:
        return

    res_json = response.json()
    pprint(res_json)

    assert res_json['namehash'] == '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'
    assert res_json['name'] == expected_name


@pytest.mark.parametrize(
    "namehash, normalization, expected_name",
    [
        ('0xe0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da', 'unknown',
         '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth'),
        ('0XE0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da', 'unknown',
         '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth'), # uppercase hex
        ('0x0462571d34d206146958c44e473730b1b2630321072c7fbb92deeea946416dab', 'unknown',
         '[5bc926fc40cc7c49e0df6dddf26e4dc7b9d6d32f4a55d4f0670320dbf414afd2].byongdok.eth'),
        ('0x5f57b185ab56ca42b5506f96694c767ebcc8c6e2854a79636b565e4ebe700fb0', 'unknown',
         '[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth'),
        ('0xb2636b6e3b1abdd3fbec454d4f4b1a904e7b15e3609cb208bcfc5a5487293308', 'unknown',
         '[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth'),
        ('0x00f52438ae09d2f909ee2efc19ba8af75058e74ca4507aa091bd8282aa490e77', 'unknown',
         '🥛.[2e8eaa68c7e128861299162323c29c29672f5c094aceaf22d9c0935e4bbd3f85].[a64d2b5a93eda272d27734cc2fb8d1c468562e279f1e97e759eea1a5a410f8e3].👽.enspunks.eth'),
        ('0x1bc53f6413409d078ec18a29b17f981eafab341598a4e970ac9efab7d29258af', 'unnormalized', '[zzz].eth'),
        ('0X1Bc53f6413409d078ec18a29b17f981eafab341598a4e970ac9efab7d29258af', 'unnormalized', '[zzz].eth'),  # uppercase hex
    ]
)
def test_inspect_namehash_get_unknown_status(test_client, api_version, namehash: str, normalization: str,
                                             expected_name: str):
    network_name = 'mainnet'
    response = test_client.get(f'/{api_version}/inspect-namehash/{network_name}/{namehash}')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['normalization'] == normalization
    assert res_json['namehash'] == namehash.lower()
    assert res_json['name'] == expected_name


@pytest.mark.parametrize(
    "namehash, expected_name",
    [
        ('0xe0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da',
         '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth'),
        ('0XE0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da',
         '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth'),  # uppercase hex
        ('0x0462571d34d206146958c44e473730b1b2630321072c7fbb92deeea946416dab',
         '[5bc926fc40cc7c49e0df6dddf26e4dc7b9d6d32f4a55d4f0670320dbf414afd2].byongdok.eth'),
        ('0x5f57b185ab56ca42b5506f96694c767ebcc8c6e2854a79636b565e4ebe700fb0',
         '[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth'),
        ('0xb2636b6e3b1abdd3fbec454d4f4b1a904e7b15e3609cb208bcfc5a5487293308',
         '[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth'),
        ('0x00f52438ae09d2f909ee2efc19ba8af75058e74ca4507aa091bd8282aa490e77',
         '[7710d5ebf94bcebcf1996bb7a3f5e24a6d24435b314b3cec815da03640c2940c].[2e8eaa68c7e128861299162323c29c29672f5c094aceaf22d9c0935e4bbd3f85].[a64d2b5a93eda272d27734cc2fb8d1c468562e279f1e97e759eea1a5a410f8e3].[462a1d6391f7ea5916874504f3b5fc8cd43626f6bbabc8a22fe4312dc1585362].enspunks.eth'),
    ]
)
def test_inspect_namehash_get_unknown(test_client, api_version, namehash: str, expected_name: str):
    network_name = 'mainnet'
    response = test_client.get(f'/{api_version}/inspect-namehash/{network_name}/{namehash}')
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


@pytest.mark.parametrize(
    "namehash, expected_status_code, expected_name",
    [
        ('0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),
        ('0XEe6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835', 200, 'vitalik.eth'),  # uppercase hex
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


@pytest.mark.parametrize(
    "namehash, expected_reason",
    [
        ('0x123',
         "Hex number must be 64 digits long and prefixed with '0x'."),
        ('0xgggg4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835',
         "Hex number must be 64 digits long and prefixed with '0x'."),
        ('1652fred1253',
         "Must be a valid, decimal integer or a hex number with 64 digits, prefixed with '0x'."),
        ('115792089237316195423570985008687907853269984665640564039457584007913129639936',
         "The decimal integer converted to base-16 should have at most 64 digits."),
    ]
)
def test_inspect_namehash_invalid_namehash(test_client, api_version, namehash, expected_reason):
    network_name = 'mainnet'
    response = test_client.post(f'/{api_version}/inspect-namehash',
                                json={'namehash': namehash, 'network_name': network_name})
    assert response.status_code == 422
    res_json = response.json()
    assert res_json['detail'].startswith('Provided namehash is not valid')
    assert res_json['detail'].endswith(expected_reason)


def test_inspect_namehash_mismatch_error(test_client, api_version):
    network_name = 'mainnet'
    # todo: how to find registered namehash with null bytes inside? (other than the 0s below)
    namehash = '0x0000000000000000000000000000000000000000000000000000000000000000'
    response = test_client.post(f'/{api_version}/inspect-namehash',
                                json={'namehash': namehash, 'network_name': network_name})
    assert response.status_code == 500
    res_json = response.json()
    assert res_json['detail'].startswith(
        "Namehash calculated on the name returned from ENS Subgraph does not equal the input namehash.")


# -- inspect-labelhash --

def test_inspect_labelhash_get(test_client, api_version):
    labelhash = labelhash_from_label('vitalik')
    network_name = 'mainnet'
    response = test_client.get(f'/{api_version}/inspect-labelhash/{network_name}/{labelhash}/eth')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    assert res_json['name'] == 'vitalik.eth'


@pytest.mark.parametrize(
    "labelhash, parent, expected_status_code, expected_name",
    [
        ('0xaf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc', None, 200, 'vitalik.eth'),
        ('0XAf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc', None, 200, 'vitalik.eth'),  # uppercase hex
        ('79233663829379634837589865448569342784712482819484549289560981379859480642508', 'eth', 200, 'vitalik.eth'),
        ('0xaf498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770', None, 200,
         '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth'),
        ('0x97bf1a722288db8edaf0f6687b4431ac96feb13d3b55a7b11e9c6bc33f938bef', None, 404, None),  # 08745yortgh04y-53jpfdhudpdfhgw5th42yhgerotihg4w95hy8
        ('0xaf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc', 'nonexistentparent', 404, None),
        ('0x12345', None, 422, None),
        ('0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb', None, 200, 'a.eth'),
    ]
)
def test_inspect_labelhash_post(test_client, api_version, labelhash, parent, expected_status_code, expected_name):
    network_name = 'mainnet'
    json_req = {'labelhash': labelhash, 'network_name': network_name}
    if parent:
        json_req['parent_name'] = parent

    response = test_client.post(f'/{api_version}/inspect-labelhash', json=json_req)
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

def test_inspect_labelhash_get_unexpected_response_body(monkeypatch, test_client, api_version):
    labelhash = labelhash_from_label('vitalik')
    network_name = 'mainnet'

    async def return_mock_response(*args, **kwargs):
        return httpx.Response(200, content=b'{"response": "response"}')

    monkeypatch.setattr(httpx.AsyncClient, 'post', return_mock_response)

    response = test_client.get(f'/{api_version}/inspect-labelhash/{network_name}/{labelhash}/eth')
    assert response.status_code == 503


def test_inspect_labelhash_get_unexpected_status_code(monkeypatch, test_client, api_version):
    labelhash = labelhash_from_label('vitalik')
    network_name = 'mainnet'

    async def return_mock_response(*args, **kwargs):
        return httpx.Response(123)

    monkeypatch.setattr(httpx.AsyncClient, 'post', return_mock_response)

    response = test_client.get(f'/{api_version}/inspect-labelhash/{network_name}/{labelhash}/eth')
    assert response.status_code == 503


def test_inspect_labelhash_get_http_error(monkeypatch, test_client, api_version):
    labelhash = labelhash_from_label('vitalik')
    network_name = 'mainnet'

    async def return_mock_response(*args, **kwargs):
        raise httpx.HTTPError('error')

    monkeypatch.setattr(httpx.AsyncClient, 'post', return_mock_response)

    response = test_client.get(f'/{api_version}/inspect-labelhash/{network_name}/{labelhash}/eth')
    assert response.status_code == 503


def test_inspect_grapheme(test_client, api_version):
    response = test_client.get(f'/{api_version}/inspect-grapheme/ś')
    assert response.status_code == 200
    res_json = response.json()
    pprint(res_json)

    check_order_of_list([check['status'] for check in res_json['checks']])

    for check in res_json['checks']:
        assert 'check' in check and 'message' in check
        assert check['status'] in ('pass', 'warn')



def test_inspect_grapheme_multi(test_client, api_version):
    response = test_client.get(f'/{api_version}/inspect-grapheme/aś')
    assert response.status_code == 422


def test_primary_name_get(test_client, api_version):
    address='0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    response = test_client.get(f'/{api_version}/primary-name/mainnet/{address}')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['primary_name_status'] == 'normalized'
    assert res_json['primary_name'] == 'vitalik.eth'
    assert res_json['display_name'] == 'vitalik.eth'


def test_primary_name_get_uppercase(test_client, api_version):
    address='0XD8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    response = test_client.get(f'/{api_version}/primary-name/mainnet/{address}')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['primary_name_status'] == 'normalized'
    assert res_json['primary_name'] == 'vitalik.eth'
    assert res_json['display_name'] == 'vitalik.eth'


def test_primary_name_get_offchain(test_client, api_version):
    address='0xFD9eE68000Dc92aa6c67F8f6EB5d9d1a24086fAd'
    response = test_client.get(f'/{api_version}/primary-name/mainnet/{address}')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['primary_name_status'] == 'normalized'
    assert res_json['primary_name'] == 'exampleprimary.cb.id'
    assert res_json['display_name'] == 'exampleprimary.cb.id'


def test_primary_name_get_unknown(test_client, api_version):
    address='0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96046'
    response = test_client.get(f'/{api_version}/primary-name/mainnet/{address}')
    assert response.status_code == 200
    res_json = response.json()
    print(res_json)
    assert res_json['primary_name_status'] == 'no_primary_name_found'
    assert res_json['primary_name'] == None
    assert res_json['display_name'] == 'Unnamed d8da'

    #TODO add example with address resolved to unnoramlized (test existence of nameguard results) name and test other networks


@pytest.mark.parametrize(
    "contract_address, token_id, fake",
    [
        ('0x495f947276749ce646f68ac8c248420045cb7b5e', '61995921128521442959106650131462633744885269624153038309795231243542768648193', FakeENSCheckStatus.IMPERSONATED_ENS_NAME),  # fake nick.eth
        ('0x2cc8342d7c8bff5a213eb2cde39de9a59b3461a7', '45104', FakeENSCheckStatus.IMPERSONATED_ENS_NAME),
        ('0x495f947276749ce646f68ac8c248420045cb7b5e', '115299889408293060529275095010636973531920388509401805939660647627196198813697', FakeENSCheckStatus.IMPERSONATED_ENS_NAME),
        pytest.param('0x495f947276749ce646f68ac8c248420045cb7b5e', '87268313074833894749413679830860625010141738974859681274795075557252109697025', FakeENSCheckStatus.IMPERSONATED_ENS_NAME, marks=pytest.mark.xfail(reason='wrong collection name returned by Alchemy?')),  # based on collection name
        ('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', '3972', FakeENSCheckStatus.NON_IMPERSONATED_ENS_NAME),
        ('0xbd3531da5cf5857e7cfaa92426877b022e612cf8', '2028', FakeENSCheckStatus.NON_IMPERSONATED_ENS_NAME),
        ('0xbd3531da5cf5857e7cfaa92426877b022e612cf9', '2028', FakeENSCheckStatus.UNKNOWN_NFT),  # NOT_A_CONTRACT
        ('0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85', '47192814855232171824620094590612668126513223473283784600320596656451859494352', FakeENSCheckStatus.AUTHENTIC_ENS_NAME),  # brantly.eth
        ('0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85', '0X43Fcd34d8589090581e1d2bdcf5dc17feb05b2006401fb1c3fdded335a465b51', FakeENSCheckStatus.AUTHENTIC_ENS_NAME),  # brantly.eth uppercase hex
        ('0X57F1887a8bf19b14fc0df6fd9b2acc9af147ea85', '47192814855232171824620094590612668126513223473283784600320596656451859494352', FakeENSCheckStatus.AUTHENTIC_ENS_NAME),  # brantly.eth uppercase hex
        ('0xfe4f558a0fee0657bfa044792f5545f5a8f4ecb1', '1', FakeENSCheckStatus.IMPERSONATED_ENS_NAME),  # https://rarible.com/token/0xfe4f558a0fee0657bfa044792f5545f5a8f4ecb1:1
        ('0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401', '34762977820481521209114130776556072772965907316729597364642457029530388725237', FakeENSCheckStatus.AUTHENTIC_ENS_NAME),  # NameWrapper https://rarible.com/token/0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401:34762977820481521209114130776556072772965907316729597364642457029530388725237
        pytest.param('0x495f947276749Ce646f68AC8c248420045cb7b5e', '7432975079437310392139769917906933533429658990679450758216769878461532602369', FakeENSCheckStatus.IMPERSONATED_ENS_NAME, marks=pytest.mark.xfail(reason='why not works? it is on x2y2 but delisted on opensea')),  # https://x2y2.io/eth/0x495f947276749Ce646f68AC8c248420045cb7b5e/7432975079437310392139769917906933533429658990679450758216769878461532602369
        ('0x47dD5F6335FfEcBE77E982d8a449263d1e501301', '79', FakeENSCheckStatus.IMPERSONATED_ENS_NAME),  # https://x2y2.io/eth/0x47dD5F6335FfEcBE77E982d8a449263d1e501301/79
        ('0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7', '8107', FakeENSCheckStatus.IMPERSONATED_ENS_NAME),  # https://x2y2.io/eth/0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7/8107
        ('0xd8B287885cAb9E377de8F61f000Ff9B3F50e2F4d', '4', FakeENSCheckStatus.POTENTIALLY_IMPERSONATED_ENS_NAME),  # https://foundation.app/@rogerhaus/vitalik/4
        ('0xd8B287885cAb9E377de8F61f000Ff9B3F50e2F4d', '0x4', FakeENSCheckStatus.POTENTIALLY_IMPERSONATED_ENS_NAME),  # token id as hex
        # matic chain is not supported now
        # ('0x2953399124f0cbb46d2cbacd8a89cf0599974963', '1075136997460547214433646341011567219464027878285908866916833491623281164289', FakeENSCheckStatus.IMPERSONATED_ENS_NAME),
        # ('0x2953399124f0cbb46d2cbacd8a89cf0599974963', '3741242716829664262552727484824431817099747563526660400091605301110364962817', FakeENSCheckStatus.IMPERSONATED_ENS_NAME),
        # ('0xcc6c63044bfe4e991f3a13b35b6ee924b54cd304', '440', FakeENSCheckStatus.NON_IMPERSONATED_ENS_NAME),
    ]
)
def test_fake_ens_name_check(test_client, api_version, contract_address, token_id, fake):
    network_name = 'mainnet'

    response = test_client.get(f'/{api_version}/fake-ens-name-check/{network_name}/{contract_address}/{token_id}')
    assert response.status_code == 200
    assert response.json() == fake

