import pytest

from nameguard.nameguard import (
    int_to_hexstr, namehash_from_name, validate_namehash, namehash_from_labelhash,
    labelhash_from_label, InvalidNameHash
)


def test_int_to_hexstr():
    hexstr = int_to_hexstr(123456789)
    assert len(hexstr) == 66
    assert hexstr.startswith('0x')

    with pytest.raises(ValueError):
        _ = int_to_hexstr(123456789**99)


@pytest.mark.parametrize(
    "name, namehash",
    [
        ('vitalik.eth', '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'),
        ('byczong.eth', '0xf8c2c01d386a4807b3ceb131e4975ff37b44824ac9307121b18223f3d77d0c2e'),
        ('taoli.eth', '0x0000044a32f0964f4bf8fb4d017e230ad33595c0e149b6b2d0c34b733dcf906a'),  # leading zero
        ('nIcK.eTh', '0xfcbdde3892e62a9ce1495d580fb7d43a8a7b493189aaa9ea72e9a755b355099a'),  # normalizable
        ('&　󠁡�‍.eth', '0xade50cc78bd67478314cecd9b3623250de7b3d1d962e8df15b063fe365249c4b'),  # disallowed
        ('', '0x0000000000000000000000000000000000000000000000000000000000000000'),
    ]
)
def test_namehash_from_name(name, namehash):
    assert namehash_from_name(name) == namehash


def test_namehash_from_labelhash():
    assert namehash_from_name('byczong.eth') == \
           namehash_from_labelhash(labelhash_hexstr=labelhash_from_label('byczong'), parent_name='eth')
    assert namehash_from_name('iam.byczong.eth') == \
           namehash_from_labelhash(labelhash_hexstr=labelhash_from_label('iam'), parent_name='byczong.eth')


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
