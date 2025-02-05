import math
from typing import Optional

from label_inspector.inspector import Inspector
from label_inspector.config import initialize_inspector_config

from nameai.models import (
    NLPLabelAnalysis,
    LabelStatus,
)
from nameai.all_tokenizer import AllTokenizer
from nameai.ngrams import Ngrams
from nameai.person_names import PersonNameTokenizer


def init_inspector():
    with initialize_inspector_config('prod_config') as config:
        return Inspector(config)


def count_words(tokenizeds) -> int:
    count = [len(tokenized['tokens']) for tokenized in tokenizeds if '' not in tokenized['tokens']]
    if not count:
        return 0
    else:
        return min(count)


def logsumexp(log_xs: list[float]) -> float:
    log_x_max = max(log_xs)
    internal_sum = sum([math.exp(log_x - log_x_max) for log_x in log_xs])
    return log_x_max + math.log(internal_sum)


def uniq_gaps(tokenized):
    result = []
    before_empty = False
    for token in tokenized:
        if token != '':
            result.append(token)
            before_empty = False
        else:
            if not before_empty:
                before_empty = True
                result.append('')
    return result


class NLPInspector:
    def __init__(self, config):
        self.inspector = init_inspector()
        self.tokenizer = AllTokenizer(config)
        self.person_names_tokenizer = PersonNameTokenizer(config)
        self.ngrams = Ngrams(config)

    def nlp_analyse_label(self, label: str) -> NLPLabelAnalysis:
        base_analysis = self.inspector.analyse_label(label)

        status = {
            'normalized': LabelStatus.normalized,
            'unnormalized': LabelStatus.unnormalized,
        }[base_analysis.status]

        tokenizations, partial_tokenization = self.tokenize(label, 1000)
        word_count = count_words(tokenizations)
        top_tokenization = (
            self.top_tokenization(tokenizations)
            if self.should_return_top_tokenization(
                tokenizations, partial_tokenization, word_count, status == LabelStatus.normalized
            )
            else None
        )

        if word_count == 0:
            logprob = -1e9
            prob = 0
        else:
            log_ps = [tokenization['log_probability'] for tokenization in tokenizations]
            logprob = logsumexp(log_ps)
            prob = min(math.exp(logprob), 1.0)

        nlp_analysis = NLPLabelAnalysis(
            inspection=base_analysis,
            status=status,
            probability=prob,
            log_probability=logprob,
            word_count=word_count,
            top_tokenization=top_tokenization,
            tokenizations=tokenizations,
        )
        return nlp_analysis

    def base_analyse_label(self, label: str):
        return self.inspector.analyse_label(label, simple_confusables=True)

    def tokenize(self, label: str, tokenizations_limit: int) -> tuple[list[dict], bool]:
        # get tokenizations from both sources
        all_tokenizer_iterator = self.tokenizer.tokenize(label)
        person_names_iterator = self.person_names_tokenizer.tokenize_with_scores(label)

        tokenizeds = []
        partial_tokenization = False
        try:
            used = set()
            i = 0

            # first add person name tokenizations with their original scores
            for tokenized, log_prob in person_names_iterator:
                if tokenized not in used:
                    if i == tokenizations_limit:
                        partial_tokenization = True
                        break
                    used.add(tokenized)
                    i += 1
                    tokenizeds.append({'tokens': tokenized, 'log_probability': log_prob, 'source': 'person_names'})

            # then add regular tokenizations
            for tokenized in all_tokenizer_iterator:
                if tokenized not in used:
                    if i == tokenizations_limit:
                        partial_tokenization = True
                        break
                    used.add(tokenized)
                    i += 1
                    # for non-person-name tokenizations, use ngrams probability
                    tokenizeds.append(
                        {
                            'tokens': tokenized,
                            'log_probability': self.ngrams.sequence_log_probability(tokenized),
                            'source': 'ngrams',
                        }
                    )

        except RecursionError:
            partial_tokenization = True

        for tokenized in tokenizeds:
            tokenized['tokens'] = tuple(uniq_gaps(tokenized['tokens']))
            tokenized['probability'] = math.exp(tokenized['log_probability'])

        # print probabilities by source
        ngrams_probs = [t['probability'] for t in tokenizeds if t['source'] == 'ngrams']
        person_probs = [t['probability'] for t in tokenizeds if t['source'] == 'person_names']
        print('\nProbabilities by source for input label: ', label)
        if ngrams_probs:
            print(
                f'ngrams: min={min(ngrams_probs):.2e}, max={max(ngrams_probs):.2e}, '
                f'avg={sum(ngrams_probs)/len(ngrams_probs):.2e}'
            )
        if person_probs:
            print(
                f'person_names: min={min(person_probs):.2e}, max={max(person_probs):.2e}, '
                f'avg={sum(person_probs)/len(person_probs):.2e}'
            )

        # sort so highest probability with the same tokenization is first
        tokenizeds = sorted(tokenizeds, key=lambda tokenized: tokenized['probability'], reverse=True)
        # remove duplicates after empty duplicates removal
        # used = set()
        # tokenizeds = [x for x in tokenizeds if x['tokens'] not in used and (used.add(x['tokens']) or True)]

        # print top 5 tokenizations by probability
        print('\nTop 5 tokenizations by probability:')
        for t in tokenizeds[:5]:
            print(f"{t['tokens']} (prob: {t['probability']:.2e}, source: {t['source']})")
        print('\n')

        return tokenizeds, partial_tokenization

    def should_return_top_tokenization(self, tokenizations, partial_tokenization, word_count, is_normalized) -> bool:
        if not is_normalized:
            return False
        if tokenizations is None or len(tokenizations) == 0:
            return False
        if partial_tokenization:
            return False
        if word_count in (None, 0):
            return False
        return True

    def top_tokenization(self, tokenizations) -> Optional[list[str]]:
        # top_toks is a list of tokenizations with the same token count
        top_toks = []
        for tok in tokenizations:
            if any(t == '' for t in tok['tokens']):
                # ignore tokenizations with gaps
                continue

            if len(top_toks) == 0:
                # first tokenization found
                top_toks.append(tok)
                continue

            if len(tok['tokens']) <= len(top_toks[0]['tokens']):
                if len(tok['tokens']) < len(top_toks[0]['tokens']):
                    # found new top tokenization, clear top_toks
                    top_toks = []
                # else: it's a tie, add to top_toks
                top_toks.append(tok)

        if len(top_toks) == 0:
            # no valid tokenization found
            return None

        # choose the one with the highest probability
        # (it's already sorted by prob)
        top_tok = top_toks[0]

        return [t for t in top_tok['tokens']]
