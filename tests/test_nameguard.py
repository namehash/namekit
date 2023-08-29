import pytest

from nameguard.models import Rating, CheckName
from nameguard.nameguard import NameGuard


@pytest.fixture(scope='module')
def nameguard():
    return NameGuard()


def test_basic_green(nameguard: NameGuard):
    result = nameguard.inspect_name('nick.eth')
    assert result.summary.rating is Rating.GREEN
    assert all(check.rating is Rating.GREEN
               for check in result.checks)


def test_basic_yellow(nameguard: NameGuard):
    result = nameguard.inspect_name('nićk.eth')
    assert result.summary.rating is Rating.YELLOW
    for check in result.checks:
        if check.name in (CheckName.CONFUSABLES, CheckName.TYPING_DIFFICULTY):
            assert check.rating is Rating.YELLOW
        else:
            assert check.rating is Rating.GREEN


def test_basic_red(nameguard: NameGuard):
    result = nameguard.inspect_name('ni_ck.eth')
    assert result.summary.rating is Rating.RED
    for check in result.checks:
        if check.name is CheckName.NORMALIZED:
            assert check.rating is Rating.RED
        elif check.name is CheckName.PUNYCODE_NAME:
            # skipped because of normalization
            assert check.rating is Rating.UNKNOWN
        else:
            assert check.rating is Rating.GREEN, check


def test_bulk(nameguard: NameGuard):
    result = nameguard.bulk_inspect_names(['nick.eth', 'nićk.eth', 'ni_ck.eth'])
    assert len(result.results) == 3
    assert result.results[0].summary.rating is Rating.GREEN
    assert result.results[1].summary.rating is Rating.YELLOW
    assert result.results[2].summary.rating is Rating.RED
