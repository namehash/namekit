from contextlib import contextmanager
from hydra import initialize_config_module, compose

from mocked_static_property import mock_static_property


@contextmanager
def init_ngrams(overrides=None):
    with mock_static_property():
        from nameai.ngrams import Ngrams

        with initialize_config_module(version_base=None, config_module='nameai.config'):
            config = compose(config_name='prod_config', overrides=overrides)
            ngrams = Ngrams(config)
            yield ngrams


@contextmanager
def init_ngrams_tokenizer(overrides=None):
    with mock_static_property():
        from nameai.ngrams import Ngrams
        from nameai.all_tokenizer import AllTokenizer

        with initialize_config_module(version_base=None, config_module='nameai.config'):
            config = compose(config_name='prod_config', overrides=overrides)
            ngrams = Ngrams(config)
            tokenizer = AllTokenizer(config)
            yield ngrams, tokenizer


def test_ngrams():
    with init_ngrams() as ngrams:
        assert ngrams.unigram_count('the') > ngrams.unigram_count('cat')
        assert ngrams.word_probability('the') > ngrams.word_probability('cat')
        assert ngrams.word_probability('the') > ngrams.word_probability('sdfghsldhgsldk')
        assert ngrams.word_probability('sdfghsldhgsldk') > 0

        assert ngrams.sequence_probability(['the', 'cat']) > ngrams.sequence_probability(['sdfghsldhgsldk'])
        assert ngrams.sequence_probability(['the', 'cat']) > ngrams.sequence_probability(['white', 'cat'])
        assert ngrams.sequence_probability(['cat']) > ngrams.sequence_probability(['c', 'a', 't'])
        assert ngrams.sequence_probability(['the', 'cat']) > ngrams.sequence_probability(['cat', 'the'])
        assert ngrams.sequence_probability(['i', 'have', 'been', 'here', 'before']) > ngrams.sequence_probability(
            ['here', 'been', 'have', 'i', 'before']
        )  # master Yoda style :)

        assert ngrams.sequence_probability(['Ł', 'cat', 'Ł']) > ngrams.sequence_probability(['Łc', 'a', 'tŁ'])

        assert ngrams.sequence_probability(['repeatable']) > ngrams.sequence_probability(['repeat', 'able'])
        assert ngrams.sequence_probability(['bothering']) > ngrams.sequence_probability(['bo', 'the', 'ring'])

        assert ngrams.sequence_probability(['nft']) > ngrams.sequence_probability(['n', 'f', 't'])
        assert ngrams.sequence_probability(['nft']) > ngrams.sequence_probability(['sdfghsldhgsldk'])
        assert ngrams.sequence_probability(['rakuten']) > ngrams.sequence_probability(['sdfghsldhgsldk'])


def test_domain_specific():
    with init_ngrams(
        [
            'ngrams.unigrams=tests/unigram_freq.csv',
            'ngrams.bigrams=tests/bigram_freq.csv',
            'ngrams.custom_dictionary=tests/custom_dictionary.txt',
            'ngrams.domain_specific_dictionary=tests/domain_specific_dictionary.txt',
            'ngrams.custom_token_frequency=1000',
        ]
    ) as ngrams:
        assert ngrams.unigram_count('avada') > 1000
        assert ngrams.unigram_count('lumos') == 1000
        assert ngrams.unigram_count('reparo') == 1000
        assert ngrams.unigram_count('allohomora') < 1000

        assert ngrams.word_probability('avada') > ngrams.word_probability('lumos')
        assert ngrams.word_probability('lumos') > ngrams.word_probability('allohomora')
        assert ngrams.word_probability('expelliarmus') > ngrams.word_probability('allohomora')

        assert ngrams.sequence_probability(['avada', 'kedavra']) > ngrams.sequence_probability(['lumos', 'reparo'])


def test_domain_specific_prod():
    with init_ngrams() as ngrams:
        # FIXME is it intended to be this way?
        assert ngrams.sequence_probability(['greenriver']) > ngrams.sequence_probability(['green', 'river'])
        assert ngrams.sequence_probability(['americanairlines']) > ngrams.sequence_probability(['american', 'airlines'])
        assert ngrams.sequence_probability(['usarmy']) > ngrams.sequence_probability(['us', 'army'])

        assert ngrams.sequence_probability(['xchange']) > ngrams.sequence_probability(['x', 'change'])
        assert ngrams.sequence_probability(['bball']) > ngrams.sequence_probability(['b', 'ball'])

        # testing if the occurence of a bigram, present in a bigram file,
        # behaves consistently regardless of the number of occurences
        assert ngrams.sequence_probability(['usarmy', 'usarmy']) > ngrams.sequence_probability(
            ['us', 'army', 'us', 'army']
        )
        assert ngrams.sequence_probability(['counterstrike']) > ngrams.sequence_probability(['counter', 'strike'])
        assert ngrams.sequence_probability(['counterstrike', 'counterstrike']) > ngrams.sequence_probability(
            ['counter', 'strike', 'counter', 'strike']
        )
        assert ngrams.sequence_probability(
            ['counterstrike', 'counterstrike', 'counterstrike']
        ) > ngrams.sequence_probability(['counter', 'strike', 'counter', 'strike', 'counter', 'strike'])

        assert ngrams.sequence_probability(['livecam']) > ngrams.sequence_probability(['live', 'cam'])

        assert ngrams.sequence_probability(['rocknroll']) > ngrams.sequence_probability(['rock', 'n', 'roll'])

        # FIXME does not work for this, san francisco bigram has too big frequency
        # assert ngrams.sequence_probability(['sanfrancisco']) \
        #        > ngrams.sequence_probability(['san', 'francisco'])


def test_gap_prob():
    with init_ngrams_tokenizer() as (ngrams, tokenizer):
        toks = tokenizer.tokenize('ŁcatŁ')
        tok1 = None
        tok2 = None
        for t in toks:
            if t == ('', 'a', ''):
                tok1 = t
            elif t == ('', 'cat', ''):
                tok2 = t
            if None not in (tok1, tok2):
                break
        assert ngrams.sequence_probability(tok1) < ngrams.sequence_probability(tok2)


def test_all_tokenizer_quality():
    with init_ngrams_tokenizer([]) as (ngrams, tokenizer):
        from nameai.data import get_resource_path
        import json

        # Load tokenization quality test cases
        with open(get_resource_path('tests/tokenization_quality.json')) as f:
            quality_tests = json.load(f)

        for input_text, expected_tokens in quality_tests.items():
            tokenized_labels = list(tokenizer.tokenize(input_text))
            expected_tuple = tuple(expected_tokens)
            if expected_tuple != tokenized_labels[0]:
                print(input_text)
                print(tokenized_labels[0])
                print(expected_tuple)
                print(ngrams.sequence_probability(tokenized_labels[0]))
                print(ngrams.sequence_probability(expected_tuple))
                print()
