import pytest

from nameguard import checks
from nameguard.context import endpoint_name
from nameguard.endpoints import Endpoints
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
        ('a', Rating.PASS, 'Unlikely to be confused'),
        ('ą', Rating.WARN, 'May be confusable'),
        ('ဩ', Rating.WARN, 'May be confusable'),
        ('¤', Rating.PASS, 'Unlikely to be confused'),
        ('Ɇ', Rating.PASS, 'Confusable checks were skipped'),
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
    assert r.message == 'Commonly supported'

    g = analyse_grapheme(nameguard, '👊🏿')
    r = checks.grapheme.font_support.check_grapheme(g)
    assert r.check == Check.FONT_SUPPORT
    assert r.rating == Rating.WARN
    assert r.message == 'Less common support'


def test_grapheme_invisible(nameguard: NameGuard):
    # TODO: possible to test?
    pass


def test_grapheme_typing_difficulty(nameguard: NameGuard):
    g = analyse_grapheme(nameguard, 'a')
    r = checks.grapheme.typing_difficulty.check_grapheme(g)
    assert r.check == Check.TYPING_DIFFICULTY
    assert r.rating == Rating.PASS
    assert r.message == 'Broadly accessible to type'

    g = analyse_grapheme(nameguard, 'ą')
    r = checks.grapheme.typing_difficulty.check_grapheme(g)
    assert r.check == Check.TYPING_DIFFICULTY
    assert r.rating == Rating.WARN
    assert r.message == 'May be difficult to type on some devices'


# -- LABEL CHECKS --


def test_label_mixed_scripts(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.check == Check.MIXED_SCRIPTS
    assert r.rating == Rating.PASS
    assert r.message == 'Written in a single script'

    l = nameguard.analyse_label('')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.check == Check.MIXED_SCRIPTS
    assert r.rating == Rating.PASS
    assert r.message == 'Written in a single script'

    l = nameguard.analyse_label('あa')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.check == Check.MIXED_SCRIPTS
    assert r.rating == Rating.WARN
    assert r.message == 'Written in multiple scripts'

    l = nameguard.analyse_label('あ_a')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.check == Check.MIXED_SCRIPTS
    assert r.status == CheckStatus.WARN
    assert r.message == 'Written in multiple scripts'


def test_label_namewrapper(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.label.namewrapper.check_label(l)
    assert r.check == Check.NAMEWRAPPER_COMPATIBLE
    assert r.rating == Rating.PASS
    assert r.message == 'Compatible for use with the ENS NameWrapper'

    l = nameguard.analyse_label('あ' * 200)
    r = checks.label.namewrapper.check_label(l)
    assert r.check == Check.NAMEWRAPPER_COMPATIBLE
    assert r.rating == Rating.WARN
    assert r.message == 'Incompatible with the ENS NameWrapper'


def test_label_normalized(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.dna.normalized.check_label(l)
    assert r.check == Check.NORMALIZED
    assert r.rating == Rating.PASS
    assert r.message == 'Valid for use with ENS'

    l = nameguard.analyse_label('a_a')
    r = checks.dna.normalized.check_label(l)
    assert r.check == Check.NORMALIZED
    assert r.rating == Rating.ALERT
    assert r.message == 'Invalid for use with ENS'


def test_label_punycode(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.label.punycode.check_label(l)
    assert r.check == Check.PUNYCODE_COMPATIBLE_LABEL
    assert r.rating == Rating.PASS
    assert r.message == 'Compatible for use with DNS'
    assert r.check_name == 'DNS Compatibility'

    l = nameguard.analyse_label('あ' * 200)
    r = checks.label.punycode.check_label(l)
    assert r.check == Check.PUNYCODE_COMPATIBLE_LABEL
    assert r.rating == Rating.WARN
    assert r.message == 'Incompatible for use with DNS'

    l = nameguard.analyse_label('あ_a')
    r = checks.label.punycode.check_label(l)
    assert r.check == Check.PUNYCODE_COMPATIBLE_LABEL
    assert r.status == CheckStatus.WARN
    assert r.message == 'Incompatible for use with DNS'


# -- NAME CHECKS --


def test_name_punycode_name(nameguard: NameGuard):
    n = 'nick.eth'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.punycode_name.check_name(ls)
    assert r.check == Check.PUNYCODE_COMPATIBLE_NAME
    assert r.rating == Rating.PASS
    assert r.message == 'Compatible for use with DNS'

    n = 'あ.' * 60 + 'eth'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.punycode_name.check_name(ls)
    assert r.check == Check.PUNYCODE_COMPATIBLE_NAME
    assert r.rating == Rating.WARN
    assert r.message == 'Incompatible for use with DNS'

    n = 'あ.' * 60 + 'a_a'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.punycode_name.check_name(ls)
    assert r.check == Check.PUNYCODE_COMPATIBLE_NAME
    assert r.status == CheckStatus.WARN
    assert r.message == 'Incompatible for use with DNS'


@pytest.mark.parametrize(
    "name, rating, message",
    [
        ("", Rating.PASS, 'Ownership is decentralized'),
        ("eth", Rating.PASS, 'Ownership is decentralized'),
        ("abc.eth", Rating.PASS, 'Ownership is decentralized'),
        ("123.abc.eth", Rating.WARN, 'Ownership may not be decentralized'),
        ("com", Rating.WARN, 'Ownership is not decentralized'),
        ("abc.com", Rating.WARN, 'Ownership is not decentralized'),
        ("limo", Rating.WARN, 'Ownership may not be decentralized'),
        ("eth.limo", Rating.WARN, 'Ownership may not be decentralized'),
        ("[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth", Rating.PASS, 'Ownership is decentralized'),
        ("abc.[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770]", Rating.WARN, 'Ownership may not be decentralized'),
    ]
)
def test_decentralized(nameguard: NameGuard, name, rating, message):
    ls = [nameguard.analyse_label(l) for l in name.split('.')]
    r = checks.name.decentralized_name.check_name(ls)
    assert r.check == Check.DECENTRALIZED_NAME
    assert r.rating == rating
    assert r.message == message

    
def test_name_impersonation(nameguard: NameGuard):
    n = 'niąck.eth'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.impersonation_risk.check_name(ls)
    assert r.check == Check.IMPERSONATION_RISK
    assert r.rating == Rating.WARN
    assert r.message == 'May receive potential impersonation warnings'

    endpoint_name.set(Endpoints.SECURE_PRIMARY_NAME)
    n = 'niąck.eth'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.impersonation_risk.check_name(ls)
    assert r.check == Check.IMPERSONATION_RISK
    assert r.rating == Rating.WARN
    assert r.message == 'May be an impersonation of `niack.eth`'
    
    n = 'a👩🏽‍⚕.eth'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.impersonation_risk.check_name(ls)
    assert r.check == Check.IMPERSONATION_RISK
    assert r.rating == Rating.WARN
    assert r.message == 'Emojis used in this name may be visually confused with other similar emojis'

    endpoint_name.set(None)

