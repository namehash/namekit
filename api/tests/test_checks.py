import pytest

from nameguard import checks
from nameguard.nameguard import NameGuard
from nameguard.models import Rating, Check, CheckStatus


@pytest.fixture(scope='module')
def nameguard():
    return NameGuard()


def analyse_grapheme(nameguard: NameGuard, grapheme: str):
    return nameguard.analyse_label(grapheme).graphemes[0]


def test_ordering():
    assert CheckStatus.INFO < CheckStatus.PASS < CheckStatus.SKIP < CheckStatus.WARN < CheckStatus.ALERT
    assert CheckStatus.WARN > CheckStatus.INFO
    assert CheckStatus.SKIP == CheckStatus.SKIP
    assert CheckStatus.ALERT != CheckStatus.WARN
    assert CheckStatus.INFO <= CheckStatus.PASS
    assert CheckStatus.WARN >= CheckStatus.WARN


# -- GRAPHEME CHECKS --

@pytest.mark.parametrize(
    "grapheme, rating, message",
    [
        ('a', Rating.PASS, 'This grapheme is not confusable'),
        ('ą', Rating.WARN, 'This grapheme is confusable'),
        ('ဩ', Rating.WARN, 'This grapheme is confusable'),
        ('¤', Rating.PASS, 'This grapheme is not confusable'),
        ('Ɇ', Rating.PASS, 'It has not been checked if this grapheme is confusable'),
    ]
)
def test_grapheme_confusable(nameguard: NameGuard, grapheme, rating, message):
    g = analyse_grapheme(nameguard, grapheme)
    r = checks.grapheme.confusables.check_grapheme(g)
    assert r.check == Check.CONFUSABLES
    assert r.rating == rating
    assert r.message == message


def test_grapheme_font_support(nameguard: NameGuard):
    g = analyse_grapheme(nameguard, 'a')
    r = checks.grapheme.font_support.check_grapheme(g)
    assert r.check == Check.FONT_SUPPORT
    assert r.rating == Rating.PASS
    assert r.message == 'This grapheme is supported by common fonts'

    g = analyse_grapheme(nameguard, '👊🏿')
    r = checks.grapheme.font_support.check_grapheme(g)
    assert r.check == Check.FONT_SUPPORT
    assert r.rating == Rating.WARN
    assert r.message == 'This grapheme is not supported by common fonts'


def test_grapheme_invisible(nameguard: NameGuard):
    # TODO: possible to test?
    pass


def test_grapheme_typing_difficulty(nameguard: NameGuard):
    g = analyse_grapheme(nameguard, 'a')
    r = checks.grapheme.typing_difficulty.check_grapheme(g)
    assert r.check == Check.TYPING_DIFFICULTY
    assert r.rating == Rating.PASS
    assert r.message == 'This grapheme is broadly accessible to type'

    g = analyse_grapheme(nameguard, 'ą')
    r = checks.grapheme.typing_difficulty.check_grapheme(g)
    assert r.check == Check.TYPING_DIFFICULTY
    assert r.rating == Rating.WARN
    assert r.message == 'This grapheme may be difficult to type on some devices'


# -- LABEL CHECKS --


def test_label_mixed_scripts(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.check == Check.MIXED_SCRIPTS
    assert r.rating == Rating.PASS
    assert r.message == 'This label is in a single script'

    l = nameguard.analyse_label('')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.check == Check.MIXED_SCRIPTS
    assert r.rating == Rating.PASS
    assert r.message == 'This label is in a single script'

    l = nameguard.analyse_label('あa')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.check == Check.MIXED_SCRIPTS
    assert r.rating == Rating.WARN
    assert r.message == 'This label contains multiple scripts'

    l = nameguard.analyse_label('あ_a')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.check == Check.MIXED_SCRIPTS
    assert r.status == CheckStatus.WARN
    assert r.message == 'This label contains multiple scripts'


def test_label_namewrapper(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.label.namewrapper.check_label(l)
    assert r.check == Check.NAMEWRAPPER_COMPATIBLE
    assert r.rating == Rating.PASS
    assert r.message == 'This label is NameWrapper compatible'

    l = nameguard.analyse_label('あ' * 200)
    r = checks.label.namewrapper.check_label(l)
    assert r.check == Check.NAMEWRAPPER_COMPATIBLE
    assert r.rating == Rating.WARN
    assert r.message == 'This label is not NameWrapper compatible'


def test_label_normalized(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.dna.normalized.check_label(l)
    assert r.check == Check.NORMALIZED
    assert r.rating == Rating.PASS
    assert r.message == 'This label is normalized according to ENSIP-15'

    l = nameguard.analyse_label('a_a')
    r = checks.dna.normalized.check_label(l)
    assert r.check == Check.NORMALIZED
    assert r.rating == Rating.ALERT
    assert r.message == 'This label is not normalized according to ENSIP-15'


def test_label_punycode(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.label.punycode.check_label(l)
    assert r.check == Check.PUNYCODE_COMPATIBLE_LABEL
    assert r.rating == Rating.PASS
    assert r.message == 'This label is Punycode compatible'

    l = nameguard.analyse_label('あ' * 200)
    r = checks.label.punycode.check_label(l)
    assert r.check == Check.PUNYCODE_COMPATIBLE_LABEL
    assert r.rating == Rating.WARN
    assert r.message == 'This label is not Punycode compatible'

    l = nameguard.analyse_label('あ_a')
    r = checks.label.punycode.check_label(l)
    assert r.check == Check.PUNYCODE_COMPATIBLE_LABEL
    assert r.status == CheckStatus.WARN
    assert r.message == 'This label is not Punycode compatible'


# -- NAME CHECKS --


def test_name_punycode_name(nameguard: NameGuard):
    n = 'nick.eth'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.punycode_name.check_name(ls)
    assert r.check == Check.PUNYCODE_COMPATIBLE_NAME
    assert r.rating == Rating.PASS
    assert r.message == 'This name is Punycode compatible'

    n = 'あ.' * 60 + 'eth'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.punycode_name.check_name(ls)
    assert r.check == Check.PUNYCODE_COMPATIBLE_NAME
    assert r.rating == Rating.WARN
    assert r.message == 'This name is not Punycode compatible'

    n = 'あ.' * 60 + 'a_a'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.punycode_name.check_name(ls)
    assert r.check == Check.PUNYCODE_COMPATIBLE_NAME
    assert r.status == CheckStatus.WARN
    assert r.message == 'This name is not Punycode compatible'

@pytest.mark.parametrize(
    "name, rating, message",
    [
        ("", Rating.PASS, 'This name is decentralized'),
        ("eth", Rating.PASS, 'This name is decentralized'),
        ("abc.eth", Rating.PASS, 'This name is decentralized'),
        ("123.abc.eth", Rating.WARN, 'This name may not be decentralized'),
        ("com", Rating.WARN, 'This name is not decentralized'),
        ("abc.com", Rating.WARN, 'This name is not decentralized'),
        ("limo", Rating.WARN, 'This name may not be decentralized'),
        ("eth.limo", Rating.WARN, 'This name may not be decentralized'),
    ]
)
def test_decentralized(nameguard: NameGuard, name, rating, message):
    ls = [nameguard.analyse_label(l) for l in name.split('.')]
    r = checks.name.decentralized_name.check_name(ls)
    assert r.check == Check.DECENTRALIZED_NAME
    assert r.rating == rating
    assert r.message == message
