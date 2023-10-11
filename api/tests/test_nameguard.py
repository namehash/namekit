import pytest
from web3 import Web3

from nameguard.models import Rating, Check, CheckStatus, Normalization
from nameguard.nameguard import NameGuard
from nameguard.exceptions import NamehashNotFoundInSubgraph, NotAGrapheme


@pytest.fixture(scope='module')
def nameguard():
    return NameGuard()


def test_basic_green(nameguard: NameGuard):
    result = nameguard.inspect_name('nick.eth')
    assert result.rating is Rating.PASS
    assert all(check.rating is Rating.PASS
               for check in result.checks)


def test_basic_yellow(nameguard: NameGuard):
    result = nameguard.inspect_name('nićk.eth')
    assert result.rating is Rating.WARN
    for check in result.checks:
        if check.check in (Check.CONFUSABLES, Check.TYPING_DIFFICULTY, Check.IMPERSONATION_RISK):
            assert check.rating is Rating.WARN
        else:
            assert check.rating is Rating.PASS


def test_basic_red(nameguard: NameGuard):
    result = nameguard.inspect_name('ni_ck.eth')
    assert result.rating is Rating.ALERT
    for check in result.checks:
        if check.check is Check.NORMALIZED:
            assert check.rating is Rating.ALERT
        elif check.check in (Check.PUNYCODE_COMPATIBLE_LABEL, Check.PUNYCODE_COMPATIBLE_NAME):
            assert check.status is CheckStatus.WARN
        else:
            assert check.rating is Rating.PASS, check


def test_bulk(nameguard: NameGuard):
    result = nameguard.bulk_inspect_names(['nick.eth', 'nićk.eth', 'ni_ck.eth'])
    assert len(result.results) == 3
    assert result.results[0].rating is Rating.PASS
    assert result.results[1].rating is Rating.WARN
    assert result.results[2].rating is Rating.ALERT


def test_highest_risk(nameguard: NameGuard):
    result = nameguard.inspect_name('nić_k.eth')
    assert result.highest_risk.check is Check.NORMALIZED
    assert result.highest_risk.rating is Rating.ALERT


def test_check_skip(nameguard: NameGuard):
    sup = 'a'
    unsup = chr(2045)
    unk = '\u0378'

    result = nameguard.inspect_name(sup)
    c = [c for c in result.checks if c.check is Check.FONT_SUPPORT][0]
    assert c.rating is Rating.PASS
    assert c.status is CheckStatus.PASS

    result = nameguard.inspect_name(unsup)
    c = [c for c in result.checks if c.check is Check.FONT_SUPPORT][0]
    assert c.rating is Rating.WARN
    assert c.status is CheckStatus.WARN

    result = nameguard.inspect_name(unk)
    c = [c for c in result.checks if c.check is Check.FONT_SUPPORT][0]
    assert c.rating is Rating.PASS
    assert c.status is CheckStatus.SKIP


@pytest.mark.asyncio
@pytest.mark.parametrize('name,n,l0,l1', [
    ('nick.eth', Normalization.NORMALIZED, Normalization.NORMALIZED, Normalization.NORMALIZED),
    ('[zzz].eth', Normalization.UNNORMALIZED, Normalization.UNNORMALIZED, Normalization.NORMALIZED),

    ('[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth', Normalization.NORMALIZED, Normalization.NORMALIZED, Normalization.NORMALIZED),  # nick.eth
    ('[5D5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth', Normalization.UNNORMALIZED, Normalization.UNNORMALIZED, Normalization.NORMALIZED),  # nick.eth  uppercase hex
    ('[291aa4f6b79b45c2da078242837f39c773527f1bdb269cc37f1aba8f72e308a8].eth', Normalization.UNNORMALIZED, Normalization.UNNORMALIZED, Normalization.NORMALIZED),  # [zzz].eth

    ('[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth', Normalization.UNKNOWN, Normalization.UNKNOWN, Normalization.NORMALIZED),  # unkown label
    # [f3e579667f05ae575146e5f418b0e8c0de3527a84c92e839c722a97901cd4b67].loopring.eth is unknown for Graph, but it is jkestel.loopring.eth
    ('[f3e579667f05ae575146e5f418b0e8c0de3527a84c92e839c722a97901cd4b67].loopring.eth', Normalization.UNKNOWN, Normalization.UNKNOWN, Normalization.NORMALIZED),  # jkestel.loopring.eth
    ('jkestel.[ab5e71b02a15ad804e7f48ba6b9ce9444eefb3797e3e347e98af3ee29adfbbf0].eth', Normalization.NORMALIZED, Normalization.NORMALIZED, Normalization.NORMALIZED),  # jkestel.loopring.eth
])
async def test_normalization_status(nameguard: NameGuard, name, n, l0, l1):
    network_name='mainnet'
    r = await nameguard.inspect_name_with_labelhash_lookup(network_name, name)
    assert r.normalization is n
    assert r.labels[0].normalization is l0
    assert r.labels[1].normalization is l1


def test_hashes(nameguard: NameGuard):
    r = nameguard.inspect_name('nick.eth')
    assert r.name == 'nick.eth'
    assert r.namehash == '0x05a67c0ee82964c4f7394cdd47fee7f4d9503a23c09c38341779ea012afe6e00'
    assert r.labels[0].label == 'nick'
    assert r.labels[0].labelhash == '0x5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f'
    assert r.labels[1].label == 'eth'
    assert r.labels[1].labelhash == '0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0'

    r = nameguard.inspect_name('[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth')
    assert r.name == '[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth'
    assert r.namehash == '0x05a67c0ee82964c4f7394cdd47fee7f4d9503a23c09c38341779ea012afe6e00'
    assert r.labels[0].label == '[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f]'
    assert r.labels[0].labelhash == '0x5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f'
    assert r.labels[1].label == 'eth'
    assert r.labels[1].labelhash == '0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0'

def test_hashes_uppercase(nameguard: NameGuard):
    # this should be treated not as labelhash but normal string
    r = nameguard.inspect_name('[5D5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth')
    assert r.name == '[5D5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth'
    assert r.namehash != '0x05a67c0ee82964c4f7394cdd47fee7f4d9503a23c09c38341779ea012afe6e00'
    assert r.labels[0].label == '[5D5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f]'
    assert r.labels[0].labelhash != '0x5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f'
    assert r.labels[1].label == 'eth'
    assert r.labels[1].labelhash == '0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0'

def test_unknown_label(nameguard: NameGuard):
    r = nameguard.inspect_name('[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth')
    assert r.labels[0].label == '[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f]'
    assert r.rating is Rating.ALERT
    assert r.highest_risk.check is Check.UNKNOWN_LABEL


@pytest.mark.asyncio
async def test_namehash_non_null_name(nameguard: NameGuard):
    network_name = 'mainnet'
    r = await nameguard.inspect_namehash(network_name, '0xe0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da')
    assert r.name == '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth'

    with pytest.raises(NamehashNotFoundInSubgraph):
        await nameguard.inspect_namehash(network_name, '0xe0fe380f4d877f643e88ceabbed4e5ee0efb66f079aabba23e8902336f7948da')


def test_inspect_grapheme_multi(nameguard: NameGuard):
    with pytest.raises(NotAGrapheme):
        nameguard.inspect_grapheme('ab')


def test_canonicals(nameguard: NameGuard):
    r = nameguard.inspect_name('ńićk.ęth')
    assert r.canonical_name == 'nick.eth'
    assert r.labels[0].canonical_label == 'nick'
    assert r.labels[1].canonical_label == 'eth'

    r = nameguard.inspect_grapheme('ń')
    assert r.canonical_grapheme == 'n'

    r = nameguard.inspect_name('nĲk.eth')
    assert r.canonical_name is None
    assert r.labels[0].canonical_label is None

    r = nameguard.inspect_grapheme('Ĳ')
    assert r.canonical_grapheme is None

    r = nameguard.inspect_name('ńićk.[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth')
    assert r.canonical_name == 'nick.[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth'
    assert r.labels[0].canonical_label == 'nick'
    assert r.labels[1].canonical_label == '[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f]'


def test_grapheme_description(nameguard: NameGuard):
    r = nameguard.inspect_name('nick.eth')
    assert r.labels[0].graphemes[0].grapheme_description == 'A-Z letter'

    r = nameguard.inspect_grapheme('😉')
    assert r.grapheme_description == 'Emoji'


def test_impersonation_risk(nameguard: NameGuard):
    r = nameguard.inspect_name('nick.eth')
    for check in r.checks:
        if check.check is Check.IMPERSONATION_RISK:
            assert check.rating is Rating.PASS
            break
    else:
        assert False, 'IMPERSONATION_RISK check not found'

    r = nameguard.inspect_name('nićk.eth')
    for check in r.checks:
        if check.check is Check.IMPERSONATION_RISK:
            assert check.rating is Rating.WARN
            assert check.message == 'Name might be an impersonation of `nick.eth`'
            break
    else:
        assert False, 'IMPERSONATION_RISK check not found'

    r = nameguard.inspect_name('nick.[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth')
    for check in r.checks:
        if check.check is Check.IMPERSONATION_RISK:
            assert check.rating is Rating.PASS
            assert check.status is CheckStatus.SKIP
            break
    else:
        assert False, 'IMPERSONATION_RISK check not found'


def test_invalid_unicode(nameguard: NameGuard):
    with pytest.raises(UnicodeEncodeError):
        nameguard.inspect_name('\uD801\uDC37')

    with pytest.raises(UnicodeEncodeError):
        Web3.keccak(text='\uD801\uDC37')
