import pytest
from web3 import Web3

from nameguard.context import endpoint_name
from nameguard.models import Rating, Check, CheckStatus, Normalization, GenericCheckResult, GraphemeNormalization
from nameguard.nameguard import NameGuard
from nameguard.exceptions import NamehashNotFoundInSubgraph, NotAGrapheme
from nameguard.endpoints import Endpoints


@pytest.fixture(scope='module')
def nameguard():
    return NameGuard()


@pytest.mark.asyncio
async def test_basic_green(nameguard: NameGuard):
    result = await nameguard.inspect_name('mainnet', 'nick.eth')
    assert result.rating is Rating.PASS
    assert all(check.rating is Rating.PASS
               for check in result.checks)


@pytest.mark.asyncio
async def test_basic_yellow(nameguard: NameGuard):
    result = await nameguard.inspect_name('mainnet', 'nićk.eth')
    assert result.rating is Rating.WARN
    for check in result.checks:
        if check.check in (Check.CONFUSABLES, Check.TYPING_DIFFICULTY, Check.IMPERSONATION_RISK):
            assert check.rating is Rating.WARN
        else:
            assert check.rating is Rating.PASS


@pytest.mark.asyncio
async def test_basic_red(nameguard: NameGuard):
    result = await nameguard.inspect_name('mainnet', 'ni_ck.eth')
    assert result.rating is Rating.ALERT
    for check in result.checks:
        if check.check is Check.NORMALIZED:
            assert check.rating is Rating.ALERT
        elif check.check in (Check.PUNYCODE_COMPATIBLE_LABEL, Check.PUNYCODE_COMPATIBLE_NAME):
            assert check.status is CheckStatus.WARN
        else:
            assert check.rating is Rating.PASS, check


@pytest.mark.asyncio
async def test_bulk(nameguard: NameGuard):
    result = await nameguard.bulk_inspect_names('mainnet', ['nick.eth', 'nićk.eth', 'ni_ck.eth'])
    assert len(result.results) == 3
    assert result.results[0].rating is Rating.PASS
    assert result.results[1].rating is Rating.WARN
    assert result.results[2].rating is Rating.ALERT


@pytest.mark.asyncio
async def test_highest_risk(nameguard: NameGuard):
    result = await nameguard.inspect_name('mainnet', 'nić_k.eth')
    assert result.highest_risk.check is Check.NORMALIZED
    assert result.highest_risk.rating is Rating.ALERT


@pytest.mark.asyncio
async def test_check_skip(nameguard: NameGuard):
    sup = 'a'
    unsup = chr(2045)
    unk = '\u0378'

    result = await nameguard.inspect_name('mainnet', sup)
    c = [c for c in result.checks if c.check is Check.FONT_SUPPORT][0]
    assert c.rating is Rating.PASS
    assert c.status is CheckStatus.PASS

    result = await nameguard.inspect_name('mainnet', unsup)
    c = [c for c in result.checks if c.check is Check.FONT_SUPPORT][0]
    assert c.rating is Rating.WARN
    assert c.status is CheckStatus.WARN

    result = await nameguard.inspect_name('mainnet', unk)
    c = [c for c in result.checks if c.check is Check.FONT_SUPPORT][0]
    assert c.rating is Rating.PASS
    assert c.status is CheckStatus.SKIP


@pytest.mark.asyncio
async def test_check_skip_confusable(nameguard: NameGuard):
    result = await nameguard.inspect_name('mainnet', 'Ɇa')
    c = [c for c in result.checks if c.check is Check.CONFUSABLES][0]
    assert c.rating is Rating.PASS
    assert c.status is CheckStatus.SKIP
    assert c.message == 'It has not been checked if this name contains confusable graphemes'

@pytest.mark.asyncio
async def test_check_skip_font_support(nameguard: NameGuard):
    result = await nameguard.inspect_name('mainnet', '🏃🏻‍➡a')
    c = [c for c in result.checks if c.check is Check.FONT_SUPPORT][0]
    assert c.rating is Rating.PASS
    assert c.status is CheckStatus.SKIP
    assert c.message == 'It is unknown if this name is supported by common fonts'
    
@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.asyncio
@pytest.mark.parametrize('name,n,l0,l1', [
    ('nick.eth', Normalization.NORMALIZED, Normalization.NORMALIZED, Normalization.NORMALIZED),
    ('[zzz].eth', Normalization.UNNORMALIZED, Normalization.UNNORMALIZED, Normalization.NORMALIZED),

    ('[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth', Normalization.NORMALIZED,
     Normalization.NORMALIZED, Normalization.NORMALIZED),  # nick.eth
    ('[5D5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth', Normalization.UNNORMALIZED,
     Normalization.UNNORMALIZED, Normalization.NORMALIZED),  # nick.eth  uppercase hex
    ('[291aa4f6b79b45c2da078242837f39c773527f1bdb269cc37f1aba8f72e308a8].eth', Normalization.UNNORMALIZED,
     Normalization.UNNORMALIZED, Normalization.NORMALIZED),  # [zzz].eth

    ('[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth', Normalization.UNKNOWN,
     Normalization.UNKNOWN, Normalization.NORMALIZED),  # unkown label
    # [f3e579667f05ae575146e5f418b0e8c0de3527a84c92e839c722a97901cd4b67].loopring.eth is unknown for Graph, but it is jkestel.loopring.eth
    ('[f3e579667f05ae575146e5f418b0e8c0de3527a84c92e839c722a97901cd4b67].loopring.eth', Normalization.NORMALIZED,
     Normalization.NORMALIZED, Normalization.NORMALIZED),  # jkestel.loopring.eth
    ('jkestel.[ab5e71b02a15ad804e7f48ba6b9ce9444eefb3797e3e347e98af3ee29adfbbf0].eth', Normalization.NORMALIZED,
     Normalization.NORMALIZED, Normalization.NORMALIZED),  # jkestel.loopring.eth
])
async def test_normalization_status(nameguard: NameGuard, name, n, l0, l1):
    network_name = 'mainnet'
    r = await nameguard.inspect_name_with_labelhash_lookup(network_name, name)
    assert r.normalization is n
    assert r.labels[0].normalization is l0
    assert r.labels[1].normalization is l1


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.asyncio
async def test_hashes(nameguard: NameGuard):
    r = await nameguard.inspect_name('mainnet', 'nick.eth')
    assert r.name == 'nick.eth'
    assert r.namehash == '0x05a67c0ee82964c4f7394cdd47fee7f4d9503a23c09c38341779ea012afe6e00'
    assert r.labels[0].label == 'nick'
    assert r.labels[0].labelhash == '0x5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f'
    assert r.labels[1].label == 'eth'
    assert r.labels[1].labelhash == '0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0'

    r = await nameguard.inspect_name('mainnet',
                                     '[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth')
    assert r.name == 'nick.eth'
    assert r.namehash == '0x05a67c0ee82964c4f7394cdd47fee7f4d9503a23c09c38341779ea012afe6e00'
    assert r.labels[0].label == 'nick'
    assert r.labels[0].labelhash == '0x5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f'
    assert r.labels[1].label == 'eth'
    assert r.labels[1].labelhash == '0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0'


@pytest.mark.asyncio
async def test_hashes_uppercase(nameguard: NameGuard):
    # this should be treated not as labelhash but normal string
    r = await nameguard.inspect_name('mainnet',
                                     '[5D5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth')
    assert r.name == '[5D5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f].eth'
    assert r.namehash != '0x05a67c0ee82964c4f7394cdd47fee7f4d9503a23c09c38341779ea012afe6e00'
    assert r.labels[0].label == '[5D5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f]'
    assert r.labels[0].labelhash != '0x5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f'
    assert r.labels[1].label == 'eth'
    assert r.labels[1].labelhash == '0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0'


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.asyncio
async def test_unknown_label(nameguard: NameGuard):
    r = await nameguard.inspect_name('mainnet',
                                     '[56d7ba27aed5cd36fc16684baeb86f73d6d0c60b6501487725bcfc9056378075].eth')
    assert r.labels[0].label == '[56d7ba27aed5cd36fc16684baeb86f73d6d0c60b6501487725bcfc9056378075]'
    assert r.rating is Rating.ALERT
    assert r.highest_risk.check is Check.UNKNOWN_LABEL
    assert r.canonical_name == '[56d7ba27aed5cd36fc16684baeb86f73d6d0c60b6501487725bcfc9056378075].eth'


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.asyncio
async def test_namehash_non_null_name(nameguard: NameGuard):
    network_name = 'mainnet'
    r = await nameguard.inspect_namehash(network_name,
                                         '0xe0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da')
    assert r.name == '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth'

    with pytest.raises(NamehashNotFoundInSubgraph):
        await nameguard.inspect_namehash(network_name,
                                         '0xe0fe380f4d877f643e88ceabbed4e5ee0efb66f079aabba23e8902336f7948da')


def test_inspect_grapheme_multi(nameguard: NameGuard):
    with pytest.raises(NotAGrapheme):
        nameguard.inspect_grapheme('ab')

@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.asyncio
async def test_canonicals(nameguard: NameGuard):
    r = await nameguard.inspect_name('mainnet', 'ńićk.ęth')
    assert r.canonical_name == 'nick.eth'
    assert r.labels[0].canonical_label == 'nick'
    assert r.labels[1].canonical_label == 'eth'

    r = nameguard.inspect_grapheme('ń')
    assert r.canonical_grapheme == 'n'

    r = await nameguard.inspect_name('mainnet', 'nĲk.eth')
    assert r.canonical_name is None
    assert r.labels[0].canonical_label is None

    r = nameguard.inspect_grapheme('Ĳ')
    assert r.canonical_grapheme is None

    r = await nameguard.inspect_name('mainnet',
                                     'ńićk.[56d7ba27aed5cd36fc16684baeb86f73d6d0c60b6501487725bcfc9056378075].eth')
    assert r.canonical_name == 'nick.[56d7ba27aed5cd36fc16684baeb86f73d6d0c60b6501487725bcfc9056378075].eth'
    assert r.labels[0].canonical_label == 'nick'
    assert r.labels[1].canonical_label == '[56d7ba27aed5cd36fc16684baeb86f73d6d0c60b6501487725bcfc9056378075]'

@pytest.mark.asyncio
@pytest.mark.parametrize('name,canonical', [
    ('Blockchain.eth', None), # canonical is Blockchain and is unnormalized
    ('ΐάΰό', None), # ιαυο is unnormalized
    ('n’diaye', 'n’diaye'),
])
async def test_canonicals2(nameguard: NameGuard, name, canonical):
    r = await nameguard.inspect_name('mainnet', name)
    assert r.canonical_name == canonical



@pytest.mark.asyncio
async def test_grapheme_description(nameguard: NameGuard):
    r = await nameguard.inspect_name('mainnet', 'nick.eth')
    assert r.labels[0].graphemes[0].grapheme_description == 'A-Z letter'

    r = nameguard.inspect_grapheme('😉')
    assert r.grapheme_description == 'Emoji'

@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.asyncio
async def test_impersonation_risk(nameguard: NameGuard):
    r = await nameguard.inspect_name('mainnet', 'nick.eth')
    for check in r.checks:
        if check.check is Check.IMPERSONATION_RISK:
            assert check.rating is Rating.PASS
            break
    else:
        assert False, 'IMPERSONATION_RISK check not found'

    endpoint_name.set(Endpoints.SECURE_PRIMARY_NAME)
    r = await nameguard.inspect_name('mainnet', 'nićk.eth')
    for check in r.checks:
        if check.check is Check.IMPERSONATION_RISK:
            assert check.rating is Rating.WARN
            assert check.message == 'Name might be an impersonation of `nick.eth`'
            break
    else:
        assert False, 'IMPERSONATION_RISK check not found'

    endpoint_name.set(None)
    r = await nameguard.inspect_name('mainnet', 'nićk.eth')
    for check in r.checks:
        if check.check is Check.IMPERSONATION_RISK:
            assert check.rating is Rating.WARN
            assert check.message == 'Name may receive potential impersonation warnings'
            break
    else:
        assert False, 'IMPERSONATION_RISK check not found'

    r = await nameguard.inspect_name('mainnet',
                                     'nick.[d941683d8cbb29d555b64e348d39171ee55ae8234118165add0175a8d4636c13].eth')
    for check in r.checks:
        if check.check is Check.IMPERSONATION_RISK:
            assert check.rating is Rating.PASS
            assert check.status is CheckStatus.SKIP
            break
    else:
        assert False, 'IMPERSONATION_RISK check not found'


@pytest.mark.asyncio
async def test_invalid_unicode(nameguard: NameGuard):
    with pytest.raises(UnicodeEncodeError):
        await nameguard.inspect_name('mainnet', '\uD801\uDC37')

    with pytest.raises(UnicodeEncodeError):
        Web3.keccak(text='\uD801\uDC37')


def test_grapheme_codepoints(nameguard: NameGuard):
    r = nameguard.inspect_grapheme('😉')
    assert r.codepoints == ['U+1F609']

    r = nameguard.inspect_grapheme('a\u0328')
    assert r.codepoints == ['U+0061', 'U+0328']


@pytest.mark.asyncio
async def test_contextual_messages(nameguard: NameGuard):
    r = await nameguard.inspect_name('mainnet', 'ą')

    for check in r.checks:
        if check.check is Check.CONFUSABLES:
            assert check.message == 'This name contains confusable graphemes'
            break
    else:
        assert False, 'CONFUSABLES check not found'

    for check in r.labels[0].checks:
        if check.check is Check.CONFUSABLES:
            assert check.message == 'This label contains confusable graphemes'
            break
    else:
        assert False, 'CONFUSABLES check not found'

    r = nameguard.inspect_grapheme('ą')

    for check in r.checks:
        if check.check is Check.CONFUSABLES:
            assert check.message == 'This grapheme is confusable'
            break
    else:
        assert False, 'CONFUSABLES check not found'


@pytest.mark.asyncio
async def test_empty_labels(nameguard: NameGuard):
    r = await nameguard.inspect_name('mainnet', 'a.')

    assert r.rating is Rating.ALERT
    assert r.highest_risk.check is Check.NORMALIZED
    assert r.normalization is Normalization.UNNORMALIZED

    assert r.labels[0].rating is Rating.PASS
    assert r.labels[0].highest_risk is None
    assert r.labels[0].normalization is Normalization.NORMALIZED

    assert r.labels[1].rating is Rating.ALERT
    assert r.labels[1].highest_risk.check is Check.NORMALIZED
    assert r.labels[1].normalization is Normalization.UNNORMALIZED

    r = await nameguard.inspect_name('mainnet', 'a..a')

    assert r.rating is Rating.ALERT
    assert r.highest_risk.check is Check.NORMALIZED
    assert r.normalization is Normalization.UNNORMALIZED

    assert r.labels[0].rating is Rating.PASS
    assert r.labels[0].highest_risk is None
    assert r.labels[0].normalization is Normalization.NORMALIZED

    assert r.labels[1].rating is Rating.ALERT
    assert r.labels[1].highest_risk.check is Check.NORMALIZED
    assert r.labels[1].normalization is Normalization.UNNORMALIZED

    assert r.labels[2].rating is Rating.PASS
    assert r.labels[2].highest_risk is None
    assert r.labels[2].normalization is Normalization.NORMALIZED


@pytest.mark.asyncio
async def test_all_normalization(nameguard: NameGuard):
    r = await nameguard.inspect_name('mainnet', 'a.a’a.e†h')

    assert r.highest_risk.check is Check.NORMALIZED
    assert r.normalization is Normalization.UNNORMALIZED

    assert r.labels[0].highest_risk is None
    assert r.labels[0].normalization is Normalization.NORMALIZED

    assert r.labels[1].highest_risk.check is Check.CONFUSABLES
    assert r.labels[1].normalization is Normalization.NORMALIZED

    assert r.labels[2].highest_risk.check is Check.NORMALIZED
    assert r.labels[2].normalization is Normalization.UNNORMALIZED

    assert r.labels[1].graphemes[0].highest_risk is None
    assert r.labels[1].graphemes[0].normalization is GraphemeNormalization.NORMALIZED

    assert r.labels[1].graphemes[1].highest_risk.check is Check.CONFUSABLES
    assert r.labels[1].graphemes[1].normalization is GraphemeNormalization.NORMALIZED

    assert r.labels[2].graphemes[0].highest_risk is None
    assert r.labels[2].graphemes[0].normalization is GraphemeNormalization.NORMALIZED

    assert r.labels[2].graphemes[1].highest_risk.check is Check.NORMALIZED
    assert r.labels[2].graphemes[1].normalization is GraphemeNormalization.UNNORMALIZED

    r = nameguard.inspect_grapheme('a')
    assert r.highest_risk is None
    assert r.normalization is GraphemeNormalization.NORMALIZED

    r = nameguard.inspect_grapheme('†')
    assert r.highest_risk.check is Check.NORMALIZED
    assert r.normalization is GraphemeNormalization.UNNORMALIZED

    r = nameguard.inspect_grapheme('_')
    assert r.highest_risk is None
    assert r.normalization is GraphemeNormalization.NORMALIZED

    r = nameguard.inspect_grapheme('’')
    assert r.highest_risk.check is Check.CONFUSABLES
    assert r.normalization is GraphemeNormalization.NORMALIZED

    
def test_generic_check_result_operators():
    assert GenericCheckResult(check=Check.NORMALIZED, status=CheckStatus.INFO, _name_message='') == \
           GenericCheckResult(check=Check.NORMALIZED, status=CheckStatus.INFO, _name_message='')
    assert GenericCheckResult(check=Check.CONFUSABLES, status=CheckStatus.WARN, _name_message='') != \
           GenericCheckResult(check=Check.FONT_SUPPORT, status=CheckStatus.WARN, _name_message='')
    assert GenericCheckResult(check=Check.NORMALIZED, status=CheckStatus.INFO, _name_message='') < \
           GenericCheckResult(check=Check.FONT_SUPPORT, status=CheckStatus.PASS, _name_message='')
    assert GenericCheckResult(check=Check.NORMALIZED, status=CheckStatus.WARN, _name_message='') <= \
           GenericCheckResult(check=Check.FONT_SUPPORT, status=CheckStatus.ALERT, _name_message='')
    assert GenericCheckResult(check=Check.NORMALIZED, status=CheckStatus.PASS, _name_message='') > \
           GenericCheckResult(check=Check.CONFUSABLES, status=CheckStatus.PASS, _name_message='')
    assert GenericCheckResult(check=Check.NORMALIZED, status=CheckStatus.ALERT, _name_message='') >= \
           GenericCheckResult(check=Check.FONT_SUPPORT, status=CheckStatus.ALERT, _name_message='')


def test_generic_check_result_repr():
    assert repr(GenericCheckResult(check=Check.NORMALIZED, status=CheckStatus.PASS, _name_message='')) == \
           'normalized(pass)'

@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.asyncio
async def test_dynamic_check_order(nameguard: NameGuard):
    r = await nameguard.inspect_name('mainnet', 'Ō')
    assert r.checks[0].check == Check.NORMALIZED
    assert r.checks[0].status == CheckStatus.ALERT
    assert r.checks[1].check == Check.TYPING_DIFFICULTY
    assert r.checks[1].status == CheckStatus.WARN

    # normalized is ALERT but impersonation risk is WARN
    r = await nameguard.secure_primary_name('0xc9f598bc5bb554b6a15a96d19954b041c9fdbf14', 'mainnet')
    assert r.nameguard_result.checks[0].check == Check.NORMALIZED
    assert r.nameguard_result.checks[0].status == CheckStatus.ALERT
    assert r.nameguard_result.checks[1].check == Check.TYPING_DIFFICULTY
    assert r.nameguard_result.checks[1].status == CheckStatus.WARN

    r = await nameguard.secure_primary_name('0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 'mainnet')
    assert r.nameguard_result.checks[0].check == Check.INVISIBLE
    assert r.nameguard_result.checks[0].status == CheckStatus.PASS
    assert r.nameguard_result.checks[1].check == Check.NORMALIZED
    assert r.nameguard_result.checks[1].status == CheckStatus.PASS

    endpoint_name.set(Endpoints.SECURE_PRIMARY_NAME)
    
    r = await nameguard.secure_primary_name('0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 'mainnet')
    assert r.nameguard_result.checks[0].check == Check.IMPERSONATION_RISK
    assert r.nameguard_result.checks[0].status == CheckStatus.PASS
    assert r.nameguard_result.checks[1].check == Check.INVISIBLE
    assert r.nameguard_result.checks[1].status == CheckStatus.PASS

    endpoint_name.set(None)

@pytest.mark.asyncio
async def test_stress_ens_cure(nameguard: NameGuard):
    # with omit_cure=False takes 1 minute
    result = await nameguard.inspect_name('mainnet', '⎛⎝⎞⎠'*1000)
    assert result.rating is Rating.ALERT