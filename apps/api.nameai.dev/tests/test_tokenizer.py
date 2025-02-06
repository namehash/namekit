from typing import List
from contextlib import contextmanager
import pytest
from pytest import mark
from hydra import initialize_config_module, compose
import math

from mocked_static_property import mock_static_property


@contextmanager
def init_all_tokenizer(overrides):
    with mock_static_property():
        from nameai.all_tokenizer import AllTokenizer

        with initialize_config_module(version_base=None, config_module='nameai.config'):
            config = compose(config_name='prod_config', overrides=overrides)
            tokenizer = AllTokenizer(config)
            yield tokenizer


@contextmanager
def init_person_name_tokenizer(overrides):
    from nameai.person_names import PersonNameTokenizer

    with initialize_config_module(version_base=None, config_module='nameai.config'):
        config = compose(config_name='prod_config', overrides=overrides)
        tokenizer = PersonNameTokenizer(config)
        yield tokenizer


@mark.parametrize(
    'overrides',
    [
        (['tokenization.skip_non_words=false', 'tokenization.with_gaps=false']),
    ],
)
def test_all_tokenizer_skip_one_letter_words(overrides: List[str]):
    with init_all_tokenizer(overrides) as tokenizer:
        tokenized_labels = list(tokenizer.tokenize('yorknewŁyork123'))

        assert (
            'york',
            'new',
            'Ł',
            'york',
            '123',
        ) in tokenized_labels
        assert (
            'y',
            'o',
            'r',
            'k',
            'new',
            'Ł',
            'york',
            '123',
        ) not in tokenized_labels
        assert ('yorknewŁyork123',) not in tokenized_labels


@mark.parametrize(
    'overrides',
    [
        (['tokenization.skip_non_words=true']),
    ],
)
def test_all_tokenizer_skip_non_words(overrides: List[str]):
    with init_all_tokenizer(overrides) as tokenizer:
        tokenized_labels = list(tokenizer.tokenize('yorknewŁyork123'))  # 0 tokenizations
        assert list(tokenized_labels) == []

        tokenized_labels = list(tokenizer.tokenize('laptop'))
        assert len(tokenized_labels) == 2
        assert ('laptop',) in tokenized_labels
        assert (
            'lap',
            'top',
        ) in tokenized_labels


@mark.parametrize(
    'overrides',
    [
        (['tokenization.skip_non_words=true']),
    ],
)
def test_all_tokenizer_skip_one_letter_words_and_non_words_no_ias(overrides: List[str]):
    with init_all_tokenizer(overrides) as tokenizer:
        tokenized_labels = list(tokenizer.tokenize('laptop'))
        assert ('laptop',) in tokenized_labels
        assert (
            'lap',
            'top',
        ) in tokenized_labels
        assert len(tokenized_labels) == 2

        tokenized_labels = list(tokenizer.tokenize('ilaptop'))
        assert (
            'i',
            'laptop',
        ) in tokenized_labels
        assert (
            'i',
            'lap',
            'top',
        ) in tokenized_labels
        assert len(tokenized_labels) == 2


@mark.parametrize(
    'overrides',
    [
        (['tokenization.skip_non_words=false', 'tokenization.with_gaps=true']),
    ],
)
def test_all_tokenizer_skip_one_letter_words_and_non_words_no_ias_with_gaps(overrides: List[str]):
    with init_all_tokenizer(overrides) as tokenizer:
        tokenized_labels = list(tokenizer.tokenize('lapŁtop'))

        assert (
            'lap',
            '',
            'top',
        ) in tokenized_labels
        assert (
            '',
            'top',
        ) in tokenized_labels


@pytest.mark.execution_timeout(10)
@mark.parametrize(
    'overrides',
    [
        (['tokenization.skip_non_words=false', 'tokenization.with_gaps=true']),
    ],
)
def test_all_tokenizer_time(overrides):
    with init_all_tokenizer(overrides) as tokenizer:
        next(tokenizer.tokenize('miinibaashkiminasiganibiitoosijiganibadagwiingweshiganibakwezhigan'))


@mark.parametrize(
    'overrides',
    [
        (['tokenization.skip_non_words=false', 'tokenization.with_gaps=true']),
    ],
)
def test_all_tokenizer_skip_one_letter_words_and_non_words_no_ias_with_gaps23(overrides: List[str]):
    with init_all_tokenizer(overrides) as tokenizer:
        tokenized_labels = list(tokenizer.tokenize('laptop😀ą'))
        print(tokenized_labels)
        assert ('laptop', '') in tokenized_labels
        assert ('lap', 'top', '') in tokenized_labels
        assert (
            'lap',
            '',
        ) not in tokenized_labels


@pytest.mark.execution_timeout(10)
def test_all_tokenizer_reccurence():
    with init_all_tokenizer([]) as tokenizer:
        next(tokenizer.tokenize('test' * 900))

        with pytest.raises(RecursionError):
            next(tokenizer.tokenize('test' * 1000))


@pytest.mark.execution_timeout(10)
@mark.parametrize(
    'overrides',
    [
        (['tokenization.skip_non_words=false', 'tokenization.with_gaps=true']),
    ],
)
def test_all_tokenizer_reccurence2(overrides):
    with init_all_tokenizer(overrides) as tokenizer:
        tokenized = tokenizer.tokenize('i' * 4 * 950)
        next(tokenized)
        with pytest.raises(RecursionError):
            for _ in tokenized:
                pass


def test_all_tokenizer_custom_dict():
    with init_all_tokenizer([]) as tokenizer:
        tokenized_labels = list(tokenizer.tokenize('nfttop'))
        assert (
            'nft',
            'top',
        ) in tokenized_labels

        tokenized_labels = list(tokenizer.tokenize('new'))
        assert ('new',) in tokenized_labels

        tokenized_labels = list(tokenizer.tokenize('york'))
        assert ('york',) in tokenized_labels

    with init_all_tokenizer(['tokenization.custom_dictionary=tests/empty.txt']) as tokenizer:
        tokenized_labels = list(tokenizer.tokenize('nfttop'))
        assert (
            'nft',
            'top',
        ) not in tokenized_labels

        tokenized_labels = list(tokenizer.tokenize('new'))
        assert ('new',) not in tokenized_labels

        tokenized_labels = list(tokenizer.tokenize('york'))
        assert ('york',) in tokenized_labels


def test_all_tokenizer_quality():
    with init_all_tokenizer([]) as tokenizer:
        from nameai.data import get_resource_path

        for multiword in open(get_resource_path('should_be_tokenized.txt')):
            multiword = multiword.strip()
            tokenized_labels = list(tokenizer.tokenize(multiword))
            assert all([len(tokenized_label) > 1 for tokenized_label in tokenized_labels])


def test_all_tokenizer_quality2():
    with init_all_tokenizer([]) as tokenizer:
        from nameai.data import get_resource_path
        import json

        # Load tokenization quality test cases
        with open(get_resource_path('tests/tokenization_quality.json')) as f:
            quality_tests = json.load(f)

        failures = []
        for input_text, expected_tokens in quality_tests.items():
            tokenized_labels = list(tokenizer.tokenize(input_text))
            expected_tuple = tuple(expected_tokens)
            if expected_tuple not in tokenized_labels:
                failures.append(f"\nInput: '{input_text}'\nExpected: {expected_tokens}\nGot: {tokenized_labels}")

        if failures:
            print('\n=== Tokenization Quality Test Failures ===')
            for failure in failures:
                print(failure)
            print(f'\nTotal failures: {len(failures)} out of {len(quality_tests)} test cases')
            assert False, 'Some tokenization quality tests failed. See above for details.'


def test_person_name_tokenizer_simple_names():
    """Test that simple person names are correctly tokenized"""
    with init_person_name_tokenizer([]) as tokenizer:
        from nameai.data import get_resource_path
        import json

        with open(get_resource_path('tests/person_names_quality.json')) as f:
            quality_tests = json.load(f)

        failures = []
        for input_label, expected_tokens in quality_tests['simple_names'].items():
            tokenized_labels = list(tokenizer.tokenize_with_scores(input_label))
            expected_tuple = tuple(expected_tokens)
            found = False
            for tokens, score in tokenized_labels:
                if tokens == expected_tuple:
                    found = True
                    assert score > -float('inf'), f'Expected valid score for {input_label}'
                    break
            if not found:
                failures.append(f'Failed to find expected tokenization for {input_label}')

        if failures:
            assert False, '\n'.join(failures)


def test_person_name_tokenizer_ambiguous_names():
    """Test that ambiguous names are correctly handled"""
    with init_person_name_tokenizer([]) as tokenizer:
        from nameai.data import get_resource_path
        import json

        with open(get_resource_path('tests/person_names_quality.json')) as f:
            quality_tests = json.load(f)

        failures = []
        for input_label, interpretations in quality_tests['ambiguous_names'].items():
            tokenized_labels = list(tokenizer.tokenize_with_scores(input_label))
            if interpretations['person_name']:
                person_name_tuple = tuple(interpretations['person_name'])
                found = False
                for tokens, score in tokenized_labels:
                    if tokens == person_name_tuple:
                        found = True
                        assert score > -float('inf'), f'Expected valid score for {input_label}'
                        break
                if not found:
                    failures.append(f'Failed to find person name tokenization for {input_label}')

        if failures:
            assert False, '\n'.join(failures)


def test_person_name_tokenizer_non_names():
    """Test that non-names have very low scores"""
    with init_person_name_tokenizer([]) as tokenizer:
        from nameai.data import get_resource_path
        import json

        with open(get_resource_path('tests/person_names_quality.json')) as f:
            quality_tests = json.load(f)

        failures = []
        for input_label in quality_tests['non_names'].keys():
            tokenized_labels = list(tokenizer.tokenize_with_scores(input_label))
            for tokens, score in tokenized_labels:
                if score >= -10:
                    failures.append(f'Expected low score for non-name {input_label}, got {score}')

        if failures:
            assert False, '\n'.join(failures)


def test_person_name_tokenizer_probability_ranges():
    """Test that probabilities are in reasonable ranges for different types of inputs"""
    with init_person_name_tokenizer([]) as tokenizer:
        # test clear person names
        tokenizations = list(tokenizer.tokenize_with_scores('giancarloesposito'))
        assert any(
            score > math.log(1e-8) for _, score in tokenizations
        ), 'Clear person name should have high probability'

        tokenizations = list(tokenizer.tokenize_with_scores('piotrwiśniewski'))
        assert any(
            score > math.log(1e-8) for _, score in tokenizations
        ), 'Clear person name should have high probability'

        # test ambiguous cases
        tokenizations = list(tokenizer.tokenize_with_scores('dragonfernandez'))
        assert any(
            math.log(1e-12) < score < math.log(1e-5) for _, score in tokenizations
        ), 'Ambiguous case should have medium probability'

        tokenizations = list(tokenizer.tokenize_with_scores('wolfsmith'))
        assert any(
            math.log(1e-12) < score < math.log(1e-5) for _, score in tokenizations
        ), 'Ambiguous case should have medium probability'
