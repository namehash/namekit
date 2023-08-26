from nameguard.models import Rating


def test_ordering():
    assert Rating.UNKNOWN == Rating.UNKNOWN
    assert Rating.UNKNOWN < Rating.GREEN
    assert Rating.UNKNOWN < Rating.YELLOW
    assert Rating.UNKNOWN < Rating.RED

    assert Rating.GREEN > Rating.UNKNOWN
    assert Rating.GREEN == Rating.GREEN
    assert Rating.GREEN < Rating.YELLOW
    assert Rating.GREEN < Rating.RED

    assert Rating.YELLOW > Rating.UNKNOWN
    assert Rating.YELLOW > Rating.GREEN
    assert Rating.YELLOW == Rating.YELLOW
    assert Rating.YELLOW < Rating.RED

    assert Rating.RED > Rating.UNKNOWN
    assert Rating.RED > Rating.GREEN
    assert Rating.RED > Rating.YELLOW
    assert Rating.RED == Rating.RED

    assert Rating.UNKNOWN < Rating.GREEN < Rating.YELLOW < Rating.RED

    assert max([Rating.UNKNOWN, Rating.GREEN, Rating.YELLOW]) == Rating.YELLOW
