from typing import TYPE_CHECKING
import pytest

if TYPE_CHECKING:
    from namerank.namerank import NameRank

from mocked_static_property import mock_static_property


@pytest.fixture(scope='module')
def namerank():
    with mock_static_property():
        from namerank.namerank import NameRank

        return NameRank()


def test_normalized(namerank: 'NameRank'):
    result = namerank.inspect_label('nick')
    assert abs(result.namerank.purity_score - 0.9976234705882353) < 0.0001, result.namerank.purity_score
    assert abs(result.namerank.interesting_score - 0.9354685918689098) < 0.0001, result.namerank.interesting_score
    assert result.namerank.analysis.status == 'normalized'
    assert (
        abs(result.namerank.analysis.probability - 0.0000317942695746393) < 0.0001
    ), result.namerank.analysis.probability
    assert (
        abs(result.namerank.analysis.log_probability - -10.356224486471852) < 0.0001
    ), result.namerank.analysis.log_probability
    assert result.namerank.analysis.word_count == 1
    assert result.nameguard.rating.name == 'WARN'


def test_name(namerank: 'NameRank'):
    result = namerank.inspect_name('')
    assert result.namerank.analysis.inspection.label == ''
    assert result.namerank.purity_score == 0
    assert result.namerank.interesting_score == 0
    assert result.namerank.analysis.status == 'normalized'

    result = namerank.inspect_name('nick')
    assert result.namerank.analysis.inspection.label == 'nick'
    assert abs(result.namerank.purity_score - 0.9976234705882353) < 0.0001, result.namerank.purity_score
    assert abs(result.namerank.interesting_score - 0.9354685918689098) < 0.0001, result.namerank.interesting_score
    assert result.namerank.analysis.status == 'normalized'

    result = namerank.inspect_name('nick.eth')
    assert result.namerank.analysis.inspection.label == 'nick'
    assert abs(result.namerank.purity_score - 0.9976234705882353) < 0.0001, result.namerank.purity_score
    assert abs(result.namerank.interesting_score - 0.9354685918689098) < 0.0001, result.namerank.interesting_score
    assert result.namerank.analysis.status == 'normalized'

    result = namerank.inspect_name('nick.eth.eth')
    assert result.namerank.analysis.inspection.label == 'nick'
    assert result.namerank.purity_score == 0
    assert result.namerank.interesting_score == 0
    assert result.namerank.analysis.status == 'normalized'


def test_top_tokenization(namerank: 'NameRank'):
    def top_tok(label):
        return namerank.inspect_label(label).namerank.analysis.top_tokenization

    assert top_tok('Unnormalized') is None

    # word count 0
    assert top_tok('sdfbgfdbgjkdfjgdfhjfgdjfgdsjh') is None

    assert top_tok('ilikeyourcat') == ['i', 'like', 'your', 'cat']
    assert top_tok('maybe') == ['maybe']
    assert top_tok('expertsexchange') == ['experts', 'exchange']
    # higher prob than [i, teach]
    assert top_tok('iteach') == ['it', 'each']
