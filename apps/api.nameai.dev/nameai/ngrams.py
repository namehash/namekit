import csv
import math
from typing import Optional
from nameai.data import get_resource_path
from nameai.static_property import static_property


ALPHA = 0.4


def ln(x: float, default: int = -1000) -> float:
    try:
        return math.log(x)
    except ValueError:
        return default


def explode_gaps(words: list[str]) -> list[str]:
    result = []
    for word in words:
        if hasattr(word, 'gap_length'):
            result.extend([''] * word.gap_length)
        else:
            result.append(word)
    return result


class Ngrams:
    """Word probability of unigrams and bigrams."""

    def __init__(self, config):
        self.config = config

    def _load_string_and_count(self, path: str) -> tuple[dict[str, int], int]:
        data: dict[str, int] = {}
        with open(path, newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)
            all_count = 0
            for row in reader:
                word, count = row
                count = int(count)
                all_count += count
                data[word] = count
        return data, all_count

    @static_property
    def _unigrams_and_count(self) -> tuple[dict[str, int], int]:
        data, all_count = self._load_string_and_count(get_resource_path(self.config.ngrams.unigrams))
        with open(get_resource_path(self.config.ngrams.custom_dictionary), encoding='utf-8') as f:
            for line in f:
                word = line.strip().lower()
                if word not in data:
                    data[word] = self.config.ngrams.custom_token_frequency

        with open(get_resource_path(self.config.ngrams.domain_specific_dictionary), encoding='utf-8') as f:
            for line in f:
                word = line.strip().lower()
                data[word] = max(
                    data.get(word, self.config.ngrams.custom_token_frequency), self.config.ngrams.custom_token_frequency
                )

        return data, all_count

    @static_property
    def _bigrams_and_count(self) -> tuple[dict[str, int], int]:
        return self._load_string_and_count(get_resource_path(self.config.ngrams.bigrams))

    @property
    def unigrams(self) -> dict[str, int]:
        return self._unigrams_and_count[0]

    @property
    def bigrams(self) -> dict[str, int]:
        return self._bigrams_and_count[0]

    @property
    def all_unigrams_count(self) -> int:
        return self._unigrams_and_count[1]

    @property
    def all_bigrams_count(self) -> int:
        return self._bigrams_and_count[1]

    def unigram_count(self, word: str) -> int:
        return self.unigrams.get(word, self.oov_count(word))

    def bigram_count(self, word: str) -> Optional[int]:
        return self.bigrams.get(word, None)

    def oov_count(self, word: str) -> int:
        return (1 / 100) ** (len(word))

    def word_probability(self, word: str) -> float:
        return self.unigram_count(word) / self.all_unigrams_count

    def bigram_probability(self, word1: str, word2: str) -> float:
        bigram = f'{word1} {word2}'
        bigram_count = self.bigram_count(bigram)
        if bigram_count is not None:
            return bigram_count / self.unigram_count(word1)
        return ALPHA * self.word_probability(word2)

    def sequence_log_probability(self, words: list[str]) -> float:
        if len(words) == 0:
            return -1e9
        words = explode_gaps(words)
        probs = [ln(self.word_probability(words[0]))] + [
            ln(self.bigram_probability(word1, word2)) for word1, word2 in zip(words, words[1:])
        ]
        return sum(probs)

    def sequence_probability(self, words: list[str]) -> float:
        return math.exp(self.sequence_log_probability(words))
