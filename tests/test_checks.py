import pytest

from nameguard import checks
from nameguard.nameguard import NameGuard
from nameguard.models import Rating, CheckName


@pytest.fixture(scope='module')
def nameguard():
    return NameGuard()


def analyse_grapheme(nameguard: NameGuard, grapheme: str):
    return nameguard.analyse_label(grapheme).graphemes[0]


# -- GRAPHEME CHECKS --


def test_grapheme_confusable(nameguard: NameGuard):
    g = analyse_grapheme(nameguard, 'a')
    r = checks.grapheme.confusables.check_grapheme(g)
    assert r.name == CheckName.CONFUSABLES
    assert r.rating == Rating.GREEN
    assert r.severity == 0
    assert r.message == 'This grapheme is not confusable'

    g = analyse_grapheme(nameguard, 'ą')
    r = checks.grapheme.confusables.check_grapheme(g)
    assert r.name == CheckName.CONFUSABLES
    assert r.rating == Rating.YELLOW
    assert r.severity > 0
    assert r.message == 'This grapheme is confusable'


def test_grapheme_font_support(nameguard: NameGuard):
    g = analyse_grapheme(nameguard, 'a')
    r = checks.grapheme.font_support.check_grapheme(g)
    assert r.name == CheckName.FONT_SUPPORT
    assert r.rating == Rating.GREEN
    assert r.severity == 0
    assert r.message == 'This grapheme is supported by common fonts'

    g = analyse_grapheme(nameguard, '👊🏿')
    r = checks.grapheme.font_support.check_grapheme(g)
    assert r.name == CheckName.FONT_SUPPORT
    assert r.rating == Rating.YELLOW
    assert r.severity > 0
    assert r.message == 'This grapheme is not supported by common fonts'


def test_grapheme_invisible(nameguard: NameGuard):
    # TODO: possible to test?
    pass


def test_grapheme_typing_difficulty(nameguard: NameGuard):
    g = analyse_grapheme(nameguard, 'a')
    r = checks.grapheme.typing_difficulty.check_grapheme(g)
    assert r.name == CheckName.TYPING_DIFFICULTY
    assert r.rating == Rating.GREEN
    assert r.severity == 0
    assert r.message == 'Name is broadly accessible to type'

    g = analyse_grapheme(nameguard, 'ą')
    r = checks.grapheme.typing_difficulty.check_grapheme(g)
    assert r.name == CheckName.TYPING_DIFFICULTY
    assert r.rating == Rating.YELLOW
    assert r.severity > 0
    assert r.message == 'Name contains characters that may be difficult to type on some devices'


# -- LABEL CHECKS --


def test_label_mixed_scripts(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.name == CheckName.MIXED_SCRIPTS
    assert r.rating == Rating.GREEN
    assert r.severity == 0
    assert r.message == 'Label is in a single script'

    l = nameguard.analyse_label('あa')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.name == CheckName.MIXED_SCRIPTS
    assert r.rating == Rating.YELLOW
    assert r.severity > 0
    assert r.message == 'Label contains multiple scripts'

    l = nameguard.analyse_label('あ_a')
    r = checks.label.mixed_scripts.check_label(l)
    assert r.name == CheckName.MIXED_SCRIPTS
    assert r.rating == Rating.UNKNOWN
    assert r.severity == 0
    assert r.message == 'Label is not normalized'


def test_label_namewrapper(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.label.namewrapper.check_label(l)
    assert r.name == CheckName.NAMEWRAPPER
    assert r.rating == Rating.GREEN
    assert r.severity == 0
    assert r.message == 'Label is NameWrapper compatible'

    l = nameguard.analyse_label('あ' * 200)
    r = checks.label.namewrapper.check_label(l)
    assert r.name == CheckName.NAMEWRAPPER
    assert r.rating == Rating.YELLOW
    assert r.severity > 0
    assert r.message == 'Label is not NameWrapper compatible'


def test_label_normalized(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.label.normalized.check_label(l)
    assert r.name == CheckName.NORMALIZED
    assert r.rating == Rating.GREEN
    assert r.severity == 0
    assert r.message == 'Label is normalized according to ENSIP-15'

    l = nameguard.analyse_label('a_a')
    r = checks.label.normalized.check_label(l)
    assert r.name == CheckName.NORMALIZED
    assert r.rating == Rating.RED
    assert r.severity > 0
    assert r.message == 'Label is not normalized according to ENSIP-15'


def test_label_punycode(nameguard: NameGuard):
    l = nameguard.analyse_label('ab')
    r = checks.label.punycode.check_label(l)
    assert r.name == CheckName.PUNYCODE
    assert r.rating == Rating.GREEN
    assert r.severity == 0
    assert r.message == 'Label is Punycode compatible'

    l = nameguard.analyse_label('あ' * 200)
    r = checks.label.punycode.check_label(l)
    assert r.name == CheckName.PUNYCODE
    assert r.rating == Rating.YELLOW
    assert r.severity > 0
    assert r.message == 'Label is not Punycode compatible'

    l = nameguard.analyse_label('あ_a')
    r = checks.label.punycode.check_label(l)
    assert r.name == CheckName.PUNYCODE
    assert r.rating == Rating.UNKNOWN
    assert r.severity == 0
    assert r.message == 'Label is not normalized'


# -- NAME CHECKS --


def test_name_punycode_name(nameguard: NameGuard):
    n = 'nick.eth'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.punycode_name.check_name(ls)
    assert r.name == CheckName.PUNYCODE_NAME
    assert r.rating == Rating.GREEN
    assert r.severity == 0
    assert r.message == 'Name is Punycode compatible'

    n = 'あ.' * 60 + 'eth'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.punycode_name.check_name(ls)
    assert r.name == CheckName.PUNYCODE_NAME
    assert r.rating == Rating.YELLOW
    assert r.severity > 0
    assert r.message == 'Name is not Punycode compatible'

    n = 'あ.' * 60 + 'a_a'
    ls = [nameguard.analyse_label(l) for l in n.split('.')]
    r = checks.name.punycode_name.check_name(ls)
    assert r.name == CheckName.PUNYCODE_NAME
    assert r.rating == Rating.UNKNOWN
    assert r.severity == 0
    assert r.message == 'Name is not normalized'
