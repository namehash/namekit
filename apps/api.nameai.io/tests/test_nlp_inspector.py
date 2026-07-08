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


def test_inspector_sort_score_precision(nlp_inspector: 'NLPInspector'):
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


def test_inspector_sort_score(nlp_inspector: 'NLPInspector'):
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


def test_inspector_simple_names(nlp_inspector: 'NLPInspector'):
    """Test that simple person names are correctly identified"""
    from nameai.data import get_resource_path
    import json

    with open(get_resource_path('tests/person_names_quality.json')) as f:
        quality_tests = json.load(f)

    failures = []
    for input_text, expected_tokens in quality_tests['simple_names'].items():
        tokenizations, _ = nlp_inspector.tokenize(input_text, 1000)
        expected_tokens = tuple(expected_tokens)
        if tokenizations[0]['tokens'] != expected_tokens or tokenizations[0]['source'] != 'person_names':
            failures.append(
                f"\nInput: '{input_text}'\nExpected: {expected_tokens} (person_names)\n"
                f"Got: {tokenizations[0]['tokens']} ({tokenizations[0]['source']})"
            )

    if failures:
        print('\n=== Simple Names Test Failures ===')
        for failure in failures:
            print(failure)
        print(f'\nTotal failures: {len(failures)} out of {len(quality_tests["simple_names"])} test cases')
        assert False, 'Some simple name tests failed. See above for details.'


def test_inspector_ambiguous_names(nlp_inspector: 'NLPInspector'):
    """Test that ambiguous names are handled correctly"""
    from nameai.data import get_resource_path
    import json

    with open(get_resource_path('tests/person_names_quality.json')) as f:
        quality_tests = json.load(f)

    failures = []
    for input_text, interpretation2expected_tokens in quality_tests['ambiguous_names'].items():
        tokenizations, _ = nlp_inspector.tokenize(input_text, 1000)
        if interpretation2expected_tokens['person_name'] is not None:
            expected_tokens = tuple(interpretation2expected_tokens['person_name'])
            if tokenizations[0]['tokens'] != expected_tokens or tokenizations[0]['source'] != 'person_names':
                failures.append(
                    f"\nInput: '{input_text}'\nExpected: {expected_tokens} (person_names)\n"
                    f"Got: {tokenizations[0]['tokens']} ({tokenizations[0]['source']})"
                )
        else:
            if tokenizations[0]['source'] != 'ngrams':
                failures.append(
                    f"\nInput: '{input_text}'\nExpected ngrams source\n" f"Got: {tokenizations[0]['source']}"
                )
            expected_words = tuple(interpretation2expected_tokens['words'])
            found_words = False
            for tokenization in tokenizations:
                if tokenization['tokens'] == expected_words:
                    found_words = True
                    break
            if not found_words:
                failures.append(
                    f"\nInput: '{input_text}'\nExpected words tokenization: {expected_words}\n"
                    f"Got tokenizations: {[t['tokens'] for t in tokenizations[:5]]}"
                )

    if failures:
        print('\n=== Ambiguous Names Test Failures ===')
        for failure in failures:
            print(failure)
        print(f'\nTotal failures: {len(failures)} out of {len(quality_tests["ambiguous_names"])} test cases')
        assert False, 'Some ambiguous name tests failed. See above for details.'


def test_inspector_non_names(nlp_inspector: 'NLPInspector'):
    """Test that non-names are correctly identified"""
    from nameai.data import get_resource_path
    import json

    with open(get_resource_path('tests/person_names_quality.json')) as f:
        quality_tests = json.load(f)

    failures = []
    for input_text, expected_tokens in quality_tests['non_names'].items():
        tokenizations, _ = nlp_inspector.tokenize(input_text, 1000)
        expected_tuple = tuple(expected_tokens)
        if tokenizations[0]['tokens'] != expected_tuple or tokenizations[0]['source'] != 'ngrams':
            failures.append(
                f"\nInput: '{input_text}'\nExpected: {expected_tokens} (ngrams)\n"
                f"Got: {tokenizations[0]['tokens']} ({tokenizations[0]['source']})"
            )

    if failures:
        print('\n=== Non-Names Test Failures ===')
        for failure in failures:
            print(failure)
        print(f'\nTotal failures: {len(failures)} out of {len(quality_tests["non_names"])} test cases')
        assert False, 'Some non-name tests failed. See above for details.'


def test_inspector_tokenization_quality(nlp_inspector: 'NLPInspector'):
    """Test combined tokenizer quality using the same test cases as AllTokenizer"""
    from nameai.data import get_resource_path
    import json

    # Load tokenization quality test cases
    with open(get_resource_path('tests/tokenization_quality.json')) as f:
        quality_tests = json.load(f)

    failures = []
    for input_text, expected_tokens in quality_tests.items():
        tokenizations, _ = nlp_inspector.tokenize(input_text, 1000)
        expected_tuple = tuple(expected_tokens)
        found = False
        for tokenization in tokenizations:
            if tokenization['tokens'] == expected_tuple:
                found = True
                break
        if not found:
            failures.append(
                f"\nInput: '{input_text}'\nExpected: {expected_tokens}\n"
                f"Got: {[t['tokens'] for t in tokenizations[:5]]}"
            )

    if failures:
        print('\n=== Combined Tokenization Quality Test Failures ===')
        for failure in failures:
            print(failure)
        print(f'\nTotal failures: {len(failures)} out of {len(quality_tests)} test cases')
        assert False, 'Some combined tokenization quality tests failed. See above for details.'
