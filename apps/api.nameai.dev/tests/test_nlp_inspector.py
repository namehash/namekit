import pytest
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from nameai.nlp_inspector import NLPInspector

from mocked_static_property import mock_static_property


@pytest.fixture(scope='module')
def nlp_inspector():
    with mock_static_property():
        from nameai.nlp_inspector import NLPInspector
        from nameai.config import load_nameai_config

        return NLPInspector(load_nameai_config('prod_config'))


# this is xfail in original inspector
@pytest.mark.parametrize(
    'input,output',
    [
        pytest.param('superduper', ['super', 'duper'], marks=pytest.mark.xfail),
        pytest.param('ucberkeley', ['uc', 'berkeley'], marks=pytest.mark.xfail),
        ('moshpit', ['mosh', 'pit']),
        pytest.param('coffeebean', ['coffee', 'bean'], marks=pytest.mark.xfail),
    ],
)
def test_inspector_tokenize(nlp_inspector: 'NLPInspector', input, output):
    tokenized_labels, _ = nlp_inspector.tokenize(input, 1000)
    assert tokenized_labels[0]['tokens'] == tuple(output)


def test_inspector_interesting_score_precision(nlp_inspector: 'NLPInspector'):
    lab1 = 'mrscopcake'
    lab2 = 'likemrscopcake'
    resp1 = nlp_inspector.nlp_analyse_label(lab1)
    resp2 = nlp_inspector.nlp_analyse_label(lab2)

    assert resp1.probability > resp2.probability


def test_inspector_prob_when_word_count_null_0(nlp_inspector: 'NLPInspector'):
    resp = nlp_inspector.nlp_analyse_label('sdfbgfdbgjkdfjgdfhjfgdjfgdsjh')
    assert resp.word_count == 0
    assert resp.probability == 0
    assert resp.log_probability < -100000


def test_inspector_interesting_score(nlp_inspector: 'NLPInspector'):
    lab1 = 'ilikeyourcat'
    lab2 = 'catlikeiyour'
    resp1 = nlp_inspector.nlp_analyse_label(lab1)
    resp2 = nlp_inspector.nlp_analyse_label(lab2)
    assert resp1.word_count == resp2.word_count == 4
    assert resp1.probability > resp2.probability


def test_inspector_prob_gaps(nlp_inspector: 'NLPInspector'):
    tokenizations, _ = nlp_inspector.tokenize('łcatł', 100)

    assert tokenizations[0]['tokens'] == ('', 'cat', '')
    assert any([('', 'a', '') == tokenization['tokens'] for tokenization in tokenizations[1:]])


def test_inspector_score_long(nlp_inspector: 'NLPInspector'):
    inspector = nlp_inspector
    inspector.nlp_analyse_label('laptoplaptoplaptoplaptoplaptop')


@pytest.mark.xfail(reason='not implemented yet')
def test_inspector_unknown_label(nlp_inspector: 'NLPInspector'):
    result = nlp_inspector.nlp_analyse_label('[003fda97309fd6aa9d7753dcffa37da8bb964d0fb99eba99d0770e76fc5bac91]')
    assert result.status.name == 'unknown'


def test_inspector_combine(nlp_inspector: 'NLPInspector'):
    tokenizations, _ = nlp_inspector.tokenize('laptop😀ą', 100)

    assert ['laptop', ''] == [token for token in tokenizations[0]['tokens']]
    assert ['lap', 'top', ''] == [token for token in tokenizations[1]['tokens']]


def test_inspector_prob(nlp_inspector: 'NLPInspector'):
    tokenizations, _ = nlp_inspector.tokenize('😀lap😀', 100)

    assert ['', 'lap', ''] == [token for token in tokenizations[0]['tokens']]
    assert ['', 'la', ''] == [token for token in tokenizations[1]['tokens']]


def test_inspector_word_count(nlp_inspector: 'NLPInspector'):
    result = nlp_inspector.nlp_analyse_label('laptop')
    assert result.word_count == 1

    result = nlp_inspector.nlp_analyse_label('lapśtop')
    assert result.word_count == 0

    result = nlp_inspector.nlp_analyse_label('toplap')
    assert result.word_count == 2
