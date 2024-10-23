import pytest
from hexbytes import HexBytes

from nameguard.utils import (
    int_to_hexstr,
    namehash_from_name,
    validate_namehash,
    namehash_from_labelhash,
    labelhash_from_label,
    hexbytes_to_int,
)
from nameguard.exceptions import InvalidNameHash


def test_int_to_hexstr():
    hexstr = int_to_hexstr(123456789)
    assert len(hexstr) == 66
    assert hexstr.startswith('0x')
    assert hexbytes_to_int(HexBytes(hexstr)) == 123456789

    with pytest.raises(ValueError):
        _ = int_to_hexstr(123456789**99)


@pytest.mark.parametrize(
    'name, namehash',
    [
        ('vitalik.eth', '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'),
        ('byczong.eth', '0xf8c2c01d386a4807b3ceb131e4975ff37b44824ac9307121b18223f3d77d0c2e'),
        ('taoli.eth', '0x0000044a32f0964f4bf8fb4d017e230ad33595c0e149b6b2d0c34b733dcf906a'),  # leading zero
        ('nIcK.eTh', '0xfcbdde3892e62a9ce1495d580fb7d43a8a7b493189aaa9ea72e9a755b355099a'),  # normalizable
        ('&　󠁡�‍.eth', '0xade50cc78bd67478314cecd9b3623250de7b3d1d962e8df15b063fe365249c4b'),  # disallowed
        ('', '0x0000000000000000000000000000000000000000000000000000000000000000'),
        ('xyz.hello.eth', '0x1149ec4b348794d13c21794ae392aaa814d22b974f33c45bee75e529e2463923'),
        (
            '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
            '0xe0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da',
        ),
        (
            '[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth',
            '0x5f57b185ab56ca42b5506f96694c767ebcc8c6e2854a79636b565e4ebe700fb0',
        ),
        (
            'xyz.[1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8].eth',
            '0x1149ec4b348794d13c21794ae392aaa814d22b974f33c45bee75e529e2463923',
        ),  # xyz.hello.eth
    ],
)
def test_namehash_from_name(name, namehash):
    assert namehash_from_name(name) == namehash


def test_namehash_from_labelhash():
    assert namehash_from_name('byczong.eth') == namehash_from_labelhash(
        labelhash_hexstr=labelhash_from_label('byczong'), parent_name='eth'
    )
    assert namehash_from_name('iam.byczong.eth') == namehash_from_labelhash(
        labelhash_hexstr=labelhash_from_label('iam'), parent_name='byczong.eth'
    )
    assert namehash_from_name('byczong') == namehash_from_labelhash(
        labelhash_hexstr=labelhash_from_label('byczong'), parent_name=''
    )


def test_validate_namehash():
    nh = '0xf8c2c01d386a4807b3ceb131e4975ff37b44824ac9307121b18223f3d77d0c2e'
    nh_int = 112517680702295317964235270576596002882395863411652297708683208617071958887470
    assert nh == validate_namehash(nh)
    assert nh == validate_namehash(str(nh_int))

    with pytest.raises(InvalidNameHash):  # neither int nor hex-string
        _ = validate_namehash('r@nd0m5tr1n9')

    with pytest.raises(InvalidNameHash):  # converted to base-16 should have at most 64 digits
        _ = validate_namehash(str(nh_int**9))

    with pytest.raises(InvalidNameHash):  # invalid hex-string
        _ = validate_namehash('0xg8c2c01d386a4807b3ceb131e4975ff37b44824ac9307121b18223f3d77d0c2e')

    with pytest.raises(InvalidNameHash):  # too short hex-string
        _ = validate_namehash('0xb18223f3d77d0c2e')


def test_mangum_lambda():
    try:
        import mangum  # noqa: F401
    except ImportError:
        pass
    else:
        import importlib

        importlib.import_module('nameguard.lambda')  # for full coverage
