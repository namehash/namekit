import collections
import copy
import json
import math
from typing import Optional
from omegaconf import DictConfig

from nameai.data import get_resource_path


class PersonNames:
    """
    For each interpretation (tokenization) calculates probability of a person existence with given name per country.
    It is weighted by number of Internet users.
    We want also tokenizer - should it be the highest prob or sum of probs for given interpretation.
    """

    def __init__(self, config: DictConfig):
        pn_config = config.tokenization.person_names
        self.firstnames = json.load(open(get_resource_path(pn_config.first_names_path)))
        self.lastnames = json.load(open(get_resource_path(pn_config.last_names_path)))
        other = json.load(open(get_resource_path(pn_config.other_path)))
        self.countries: dict[str, int] = other['all']
        self.firstname_initials: dict[str, dict[str, int]] = other['firstname_initials']
        self.lastname_initials: dict[str, dict[str, int]] = other['lastname_initials']
        self.country_stats = json.load(open(get_resource_path(pn_config.country_stats_path)))
        self.all_internet_users: int = sum(x[0] for x in self.country_stats.values())
        self.all_population: int = sum(x[1] for x in self.country_stats.values())
        self.country_bonus = pn_config.country_bonus
        self.allow_cross_country = False

    def print_missing_countries(self):
        for country, stats in sorted(self.country_stats.items(), key=lambda x: x[1][0], reverse=True):
            if country not in self.countries:
                print('X', country, stats)
            else:
                print(country, stats)

    def get_population(self, country: str) -> Optional[int]:
        try:
            return self.country_stats[country][1]
        except Exception:
            return None

    def get_internet_users(self, country: str) -> Optional[int]:
        try:
            return self.country_stats[country][0]
        except Exception:
            return None

    def get_internet_users_weight(self, country: str) -> Optional[float]:
        try:
            return self.country_stats[country][0] / self.all_internet_users
        except Exception:
            return None

    def single_name(self, name: str, name_stats: dict[str, dict[str, int]]) -> dict:
        name_prob = {
            country: sum(gender_counts.values()) / self.countries[country] * self.get_internet_users_weight(country)
            for country, gender_counts in name_stats.items()
        }

        genders = {}
        for country, gender_counts in name_stats.items():
            m = gender_counts.get('M', 1)
            f = gender_counts.get('F', 1)
            genders[country] = {'M': m / (m + f), 'F': f / (m + f)}

        interpretation = {}
        interpretation['names'] = [name_stats]
        interpretation['prob'] = name_prob
        interpretation['tokenization'] = (name,)
        interpretation['genders'] = genders
        return interpretation

    def name_with_initial(
        self,
        name: str,
        initial: str,
        name_stats: dict[str, dict[str, int]],
        initial_firstname: bool,
        initial_first: bool,
    ) -> dict:
        name_prob = {
            country: sum(gender_counts.values())
            / self.countries[country]
            * (
                self.firstname_initials[country].get(initial, 1)
                if initial_firstname
                else self.lastname_initials[country].get(initial, 1)
            )
            / self.countries[country]
            * self.get_internet_users_weight(country)
            for country, gender_counts in name_stats.items()
        }

        genders = {}
        for country, gender_counts in name_stats.items():
            m = gender_counts.get('M', 1)
            f = gender_counts.get('F', 1)
            genders[country] = {'M': m / (m + f), 'F': f / (m + f)}

        interpretation = {}
        if initial_first:
            interpretation['tokenization'] = (initial, name)
        else:
            interpretation['tokenization'] = (name, initial)

        interpretation['names'] = [name_stats]
        interpretation['prob'] = name_prob
        interpretation['genders'] = genders
        return interpretation

    def two_names(
        self, name1: str, name2: str, name1_stats: dict[str, dict[str, int]], name2_stats: dict[str, dict[str, int]]
    ) -> dict:
        name1_prob = {
            country: sum(gender_counts.values()) / self.countries[country]
            for country, gender_counts in name1_stats.items()
        }
        name2_prob = {
            country: sum(gender_counts.values()) / self.countries[country]
            for country, gender_counts in name2_stats.items()
        }
        interpretation = {}
        interpretation['names'] = [name1_stats, name2_stats]
        interpretation['tokenization'] = (name1, name2)

        probs = collections.defaultdict(list)
        probs2 = {}
        genders = {}
        for name_prob in [name1_prob, name2_prob]:
            for country, prob in name_prob.items():
                probs[country].append(prob)
        for country, probs in probs.items():
            if len(probs) == 1:
                if not self.allow_cross_country:
                    continue
                probs.append(1 / self.countries[country])
            probs2[country] = math.prod(probs)
            probs2[country] *= self.get_internet_users_weight(country)

            m = name1_stats.get(country, {}).get('M', 1) * name2_stats.get(country, {}).get('M', 1)
            f = name1_stats.get(country, {}).get('F', 1) * name2_stats.get(country, {}).get('F', 1)
            genders[country] = {'M': m / (m + f), 'F': f / (m + f)}
        interpretation['prob'] = probs2
        interpretation['genders'] = genders

        return interpretation

    def anal(self, input_name: str) -> list[dict]:
        interpretations = []
        # only one name
        name_stats = copy.copy(self.firstnames.get(input_name, None))
        if name_stats:
            interpretation = self.single_name(input_name, name_stats)
            interpretation['type'] = 'first'
            interpretations.append(interpretation)

        name_stats = copy.copy(self.lastnames.get(input_name, None))
        if name_stats:
            interpretation = self.single_name(input_name, name_stats)
            interpretation['type'] = 'last'
            interpretations.append(interpretation)

        # one name with initial
        for name, initial, initial_first in [
            (input_name[1:], input_name[:1], True),
            (input_name[:-1], input_name[-1:], False),
        ]:
            if not initial or not name:
                continue
            name_stats = copy.copy(self.firstnames.get(name, None))
            if name_stats:
                interpretation = self.name_with_initial(
                    name, initial, name_stats, initial_firstname=False, initial_first=initial_first
                )
                interpretation['type'] = 'first with initial'
                interpretations.append(interpretation)

            name_stats = copy.copy(self.lastnames.get(name, None))
            if name_stats:
                interpretation = self.name_with_initial(
                    name, initial, name_stats, initial_firstname=True, initial_first=initial_first
                )
                interpretation['type'] = 'last with initial'
                interpretations.append(interpretation)

        # two names
        for i in range(1, len(input_name)):
            name1 = input_name[:i]
            name2 = input_name[i:]
            name1_result = copy.copy(self.firstnames.get(name1, None))
            name2_result = copy.copy(self.lastnames.get(name2, None))
            if name1_result and name2_result:
                interpretation = self.two_names(name1, name2, name1_result, name2_result)
                interpretation['type'] = 'first last'
                interpretations.append(interpretation)

            name1_result = copy.copy(self.lastnames.get(name1, None))
            name2_result = copy.copy(self.firstnames.get(name2, None))
            if name1_result and name2_result:
                interpretation = self.two_names(name1, name2, name1_result, name2_result)
                interpretation['type'] = 'last first'
                interpretations.append(interpretation)

        return interpretations

    def tokenize(
        self, input_name: str, user_country: str = None, topn: int = 1
    ) -> list[tuple[float, str, tuple[str, ...], list[str], dict[str, float]]]:
        """Return best country interpretation."""
        all_interpretations = self.score(input_name, user_country)
        return all_interpretations[:topn]

    def score(
        self, input_name: str, user_country: str | None = None
    ) -> list[tuple[float, str, tuple[str, ...], list[str], dict[str, float]]]:
        """Return best interpretation."""
        interpretations = self.anal(input_name)

        all_interpretations = []
        for r in interpretations:
            if user_country in r['prob']:
                r['prob'][user_country] = r['prob'][user_country] * self.country_bonus

            for country, prob in r['prob'].items():
                all_interpretations.append(
                    (prob, country, r['tokenization'], r['type'], r['genders'].get(country, None))
                )

        return sorted(all_interpretations, reverse=True)

    def verbose(self, input_name):
        results = self.anal(input_name)

        for r in results:
            score = math.prod([sum(result['gender'].values()) for result in r['names']])
            print([result['name'] for result in r['names']], [result['type'] for result in r['names']])
            print(score, score ** (1 / len(r)), r['names'])

            for result in r['names']:
                best_probs = sorted(result['prob'].items(), key=lambda x: x[1], reverse=True)[:5]
                print(result['name'])
                print(best_probs)

            countries = collections.defaultdict(lambda: 1)
            genders = collections.defaultdict(lambda: 1)
            probs = collections.defaultdict(lambda: 1)
            for result in r['names']:
                for country, count in result['country'].items():
                    countries[country] *= count
                for gender, count in result['gender'].items():
                    genders[gender] *= count
                for country, count in result['prob'].items():
                    probs[country] *= count

            country = sorted(countries.items(), key=lambda x: x[1], reverse=True)[:1]
            print('Country', country)
            gender = sorted(genders.items(), key=lambda x: x[1], reverse=True)[:1]
            print('Gender', gender)
            probs = sorted(probs.items(), key=lambda x: x[1], reverse=True)[:1]
            print('Prob', probs)
            probs2 = sorted(r['prob'].items(), key=lambda x: x[1], reverse=True)[:3]
            print('Prob2', probs2)
            print()


class PersonNameTokenizer:
    def __init__(self, config: DictConfig):
        super().__init__()
        self.pn = PersonNames(config)

    # @lru_cache(maxsize=1000)
    def _get_scores(self, label: str) -> list[tuple[float, str, tuple[str, ...], str, dict[str, float]]]:
        """Get or compute scores for a label"""
        return self.pn.score(label)

    def tokenize_with_scores(self, label: str):
        """
        Tokenize a label into possible person name interpretations with their scores
        returns an iterator of (tokenization, log_probability) pairs
        """
        seen = set()
        for prob, country, tokenization, type_, genders in self._get_scores(label):
            if tokenization not in seen and all(len(t) > 1 for t in tokenization):  # skip single letter tokens
                seen.add(tokenization)
                yield tokenization, math.log(prob) if prob > 0 else -float('inf')
