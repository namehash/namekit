from typing import List
from contextlib import contextmanager
import pytest
from pytest import mark
from hydra import initialize_config_module, compose

from mocked_static_property import mock_static_property


@contextmanager
def init_tokenizer(overrides):
    with mock_static_property():
        from namerank.all_tokenizer import AllTokenizer

        with initialize_config_module(version_base=None, config_module='namerank.config'):
            config = compose(config_name='prod_config', overrides=overrides)
            tokenizer = AllTokenizer(config)
            yield tokenizer


@mark.parametrize(
    'overrides',
    [
        (['tokenization.skip_non_words=false', 'tokenization.with_gaps=false']),
    ],
)
def test_all_tokenizer_skip_one_letter_words(overrides: List[str]):
    with init_tokenizer(overrides) as tokenizer:
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
    with init_tokenizer(overrides) as tokenizer:
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
    with init_tokenizer(overrides) as tokenizer:
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
    with init_tokenizer(overrides) as tokenizer:
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
    with init_tokenizer(overrides) as tokenizer:
        next(tokenizer.tokenize('miinibaashkiminasiganibiitoosijiganibadagwiingweshiganibakwezhigan'))


@mark.parametrize(
    'overrides',
    [
        (['tokenization.skip_non_words=false', 'tokenization.with_gaps=true']),
    ],
)
def test_all_tokenizer_skip_one_letter_words_and_non_words_no_ias_with_gaps23(overrides: List[str]):
    with init_tokenizer(overrides) as tokenizer:
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
    with init_tokenizer([]) as tokenizer:
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
    with init_tokenizer(overrides) as tokenizer:
        tokenized = tokenizer.tokenize('i' * 4 * 950)
        next(tokenized)
        with pytest.raises(RecursionError):
            for _ in tokenized:
                pass


def test_all_tokenizer_custom_dict():
    with init_tokenizer([]) as tokenizer:
        tokenized_labels = list(tokenizer.tokenize('nfttop'))
        assert (
            'nft',
            'top',
        ) in tokenized_labels

        tokenized_labels = list(tokenizer.tokenize('new'))
        assert ('new',) in tokenized_labels

        tokenized_labels = list(tokenizer.tokenize('york'))
        assert ('york',) in tokenized_labels

    with init_tokenizer(['tokenization.custom_dictionary=tests/empty.txt']) as tokenizer:
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
    with init_tokenizer([]) as tokenizer:
        from namerank.data import get_resource_path

        for multiword in open(get_resource_path('should_be_tokenized.txt')):
            multiword = multiword.strip()
            tokenized_labels = list(tokenizer.tokenize(multiword))
            assert all([len(tokenized_label) > 1 for tokenized_label in tokenized_labels])
