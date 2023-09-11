from nameguard.models import Rating


def test_ordering():

    assert Rating.PASS == Rating.PASS
    assert Rating.PASS < Rating.WARN
    assert Rating.PASS < Rating.ALERT

    assert Rating.WARN > Rating.PASS
    assert Rating.WARN == Rating.WARN
    assert Rating.WARN < Rating.ALERT

    assert Rating.ALERT > Rating.PASS
    assert Rating.ALERT > Rating.WARN
    assert Rating.ALERT == Rating.ALERT

    assert Rating.PASS < Rating.WARN < Rating.ALERT

    assert max([Rating.PASS, Rating.WARN]) == Rating.WARN
