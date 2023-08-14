from label_inspector.inspector import Inspector
from label_inspector.config import initialize_inspector_config
from . import checks


CHECKS = [
    checks.CheckInvisible,
    checks.CheckENSNormalized,
    checks.CheckConfusables,
    checks.CheckTypingDifficulty,
    checks.CheckMixedScripts,
]


def init_inspector():
    with initialize_inspector_config('prod_config') as config:
        return Inspector(config)


def agg_check_results(results: list[checks.NameGuardCheck]) -> checks.CheckRating:
    rating = checks.CheckRating.GREEN
    for result in results:
        if result.rating.value > rating.value:
            rating = result.rating
    return rating


class NameGuard:
    def __init__(self):
        self.inspector = init_inspector()

    def check_name(self, name: str):
        labels = name.split('.')
        labels_analysis = [self.inspector.analyse_label(label) for label in labels]
        check_results = [Check(labels_analysis) for Check in CHECKS]
        verdict = agg_check_results(check_results)
        return verdict, check_results
