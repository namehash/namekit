from typing import TYPE_CHECKING
import pytest

if TYPE_CHECKING:
    from nameai.name_ai import NameAI

from mocked_static_property import mock_static_property


@pytest.fixture(scope='module')
def nameai():
    with mock_static_property():
        from nameai.name_ai import NameAI

        return NameAI()


def test_normalized(nameai: 'NameAI'):
    result = nameai.inspect_label('nick')
    assert abs(result.nameai.purity_score - 0.9976234705882353) < 0.0001, result.nameai.purity_score
    assert abs(result.nameai.interesting_score - 0.9354685918689098) < 0.0001, result.nameai.interesting_score
    assert result.nameai.analysis.status == 'normalized'
    assert abs(result.nameai.analysis.probability - 0.0000317942695746393) < 0.0001, result.nameai.analysis.probability
    assert (
        abs(result.nameai.analysis.log_probability - -10.356224486471852) < 0.0001
    ), result.nameai.analysis.log_probability
    assert result.nameai.analysis.word_count == 1
    assert result.nameguard.rating.name == 'WARN'


def test_name(nameai: 'NameAI'):
    result = nameai.inspect_name('')
    assert result.nameai.analysis.inspection.label == ''
    assert result.nameai.purity_score == 0
    assert result.nameai.interesting_score == 0
    assert result.nameai.analysis.status == 'normalized'

    result = nameai.inspect_name('nick')
    assert result.nameai.analysis.inspection.label == 'nick'
    assert abs(result.nameai.purity_score - 0.9976234705882353) < 0.0001, result.nameai.purity_score
    assert abs(result.nameai.interesting_score - 0.9354685918689098) < 0.0001, result.nameai.interesting_score
    assert result.nameai.analysis.status == 'normalized'

    result = nameai.inspect_name('nick.eth')
    assert result.nameai.analysis.inspection.label == 'nick'
    assert abs(result.nameai.purity_score - 0.9976234705882353) < 0.0001, result.nameai.purity_score
    assert abs(result.nameai.interesting_score - 0.9354685918689098) < 0.0001, result.nameai.interesting_score
    assert result.nameai.analysis.status == 'normalized'

    result = nameai.inspect_name('nick.eth.eth')
    assert result.nameai.analysis.inspection.label == 'nick'
    assert result.nameai.purity_score == 0
    assert result.nameai.interesting_score == 0
    assert result.nameai.analysis.status == 'normalized'


def test_top_tokenization(nameai: 'NameAI'):
    def top_tok(label):
        return nameai.inspect_label(label).nameai.analysis.top_tokenization

    assert top_tok('Unnormalized') is None

    # word count 0
    assert top_tok('sdfbgfdbgjkdfjgdfhjfgdjfgdsjh') is None

    assert top_tok('ilikeyourcat') == ['i', 'like', 'your', 'cat']
    assert top_tok('maybe') == ['maybe']
    assert top_tok('expertsexchange') == ['experts', 'exchange']
    # higher prob than [i, teach]
    assert top_tok('iteach') == ['it', 'each']
