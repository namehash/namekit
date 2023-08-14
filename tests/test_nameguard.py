import pytest

from nameguard.checks import (
    CheckRating,
    CheckConfusables,
    CheckTypingDifficulty,
    CheckENSNormalized,
)


@pytest.fixture(scope="module")
def nameguard():
    from nameguard.nameguard import NameGuard
    return NameGuard()


def test_basic_green(nameguard):
    verdict, check_results = nameguard.check_name('nick.eth')
    assert verdict is CheckRating.GREEN
    assert all(check.rating is CheckRating.GREEN
               for check in check_results)


def test_basic_yellow(nameguard):
    verdict, check_results = nameguard.check_name('nićk.eth')
    assert verdict is CheckRating.YELLOW
    for check in check_results:
        if isinstance(check, CheckConfusables) or isinstance(check, CheckTypingDifficulty):
            assert check.rating is CheckRating.YELLOW
        else:
            assert check.rating is CheckRating.GREEN


def test_basic_red(nameguard):
    verdict, check_results = nameguard.check_name('ni_ck.eth')
    assert verdict is CheckRating.RED
    for check in check_results:
        if isinstance(check, CheckENSNormalized):
            assert check.rating is CheckRating.RED
        else:
            assert check.rating is CheckRating.GREEN
