import collections
from typing import Tuple, Iterable
import ahocorasick

from nameai.data import get_resource_path
from nameai.static_property import static_property


class Gap(str):
    def __new__(cls, gap_length):
        obj = str.__new__(cls, '')
        obj.gap_length = gap_length
        return obj


class DFS:
    def __init__(self, automaton, label, skip_non_words=False, with_gaps=False):
        self.automaton = automaton
        self.label = label
        self.skip_non_words = skip_non_words
        self.with_gaps = with_gaps  # change non dictionary words into empty string

        # create graph
        self.g_out = collections.defaultdict(list)
        self.g_in = collections.defaultdict(list)
        for end_index, value in self.automaton.iter(label):
            start_index = end_index - len(value) + 1
            end_index += 1
            self.g_out[start_index].append(end_index)
            self.g_in[end_index].append(start_index)
        self.g_out[len(label)] = []
        self.result = []

    def all_paths(self):
        try:
            for r in self.dfs(0, []):
                t = []
                for start, end, in_dictionary in r:
                    if not in_dictionary and self.with_gaps:
                        t.append(Gap(end - start))
                    else:
                        t.append(self.label[start:end])
                yield tuple(t)
        except RecursionError as e:
            raise e

    def dfs(self, index, result, gap_before=False):
        if index == len(self.label):
            yield result
            return

        found_next_token = False
        if index in self.g_out:
            for end in sorted(self.g_out[index], reverse=True):
                found_next_token = True
                yield from self.dfs(end, result + [(index, end, True)])

        if not self.skip_non_words and not gap_before:
            for potential_index in self.g_out.keys():
                if potential_index <= index:
                    continue
                if index == 0 and potential_index == len(self.label):
                    continue
                if found_next_token and potential_index == len(self.label):
                    continue
                if potential_index not in self.g_in:
                    found_next_token = True
                    yield from self.dfs(potential_index, result + [(index, potential_index, False)], gap_before=True)


class AllTokenizer:
    """Return all tokenizations. It is a generator."""

    def __init__(self, config):
        self.config = config
        self.skip_non_words = config.tokenization.skip_non_words
        self.with_gaps = config.tokenization.with_gaps

    @static_property
    def automaton(self):
        automaton = ahocorasick.Automaton()

        should_be_tokenized = set()
        with open(get_resource_path(self.config.tokenization.should_be_tokenized), encoding='utf-8') as f:
            for line in f:
                word = line.strip().lower()
                should_be_tokenized.add(word)

        with open(get_resource_path(self.config.tokenization.domain_specific_dictionary), encoding='utf-8') as f:
            for line in f:
                word = line.strip().lower()
                if word in should_be_tokenized:
                    continue
                automaton.add_word(word, word)

        with open(get_resource_path(self.config.tokenization.custom_dictionary), encoding='utf-8') as f:
            for line in f:
                word = line.strip().lower()
                if word in should_be_tokenized:
                    continue
                automaton.add_word(word, word)

        with open(get_resource_path(self.config.tokenization.dictionary), encoding='utf-8') as f:
            for line in f:
                word = line.strip().lower()
                if len(word) <= 3:
                    continue
                if word in should_be_tokenized:
                    continue
                automaton.add_word(word, word)

        automaton.make_automaton()
        return automaton

    def tokenize(self, label: str) -> Iterable[Tuple[str, ...]]:
        dfs = DFS(self.automaton, label, self.skip_non_words, self.with_gaps)
        tokenizations = dfs.all_paths()
        return tokenizations
