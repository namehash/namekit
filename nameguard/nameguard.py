from label_inspector.inspector import Inspector
from label_inspector.config import initialize_inspector_config

from nameguard import checks
from nameguard.models import (
    NameGuardResult,
    Rating,
    GenericCheckResult,
    NameGuardSummary,
    NameMetadata,
    NameStatus,
    CheckName,
)


LABEL_CHECKS = [
    checks.confusables,
    checks.invisible,
    checks.mixed_scripts,
    checks.normalized,
    checks.typing_difficulty,
]


def init_inspector():
    with initialize_inspector_config('prod_config') as config:
        return Inspector(config)


def compute_namehash(name: str) -> str:
    return 'TODO'


def agg_nameguard_rating(check_results: list[GenericCheckResult]) -> Rating:
    return max((check_result.rating for check_result in check_results), key=lambda rating: rating.value)


def count_risks(check_results: list[GenericCheckResult]) -> int:
    return sum(1 for check_result in check_results if check_result.rating.value > Rating.GREEN.value)


def agg_per_label_check_results(per_label_check_results: list[list[GenericCheckResult]]) -> list[GenericCheckResult]:
    return [
        max(check_results, key=lambda check_result: check_result.rating.value)
        for check_results in zip(*per_label_check_results)
    ]


class NameGuard:
    def __init__(self):
        self.inspector = init_inspector()

    def inspect_name(self, name: str) -> NameGuardResult:
        labels = name.split('.')
        labels_analysis = [self.inspector.analyse_label(label) for label in labels]

        per_label_check_results = [
            [check.check_label(label_analysis) for check in LABEL_CHECKS]
            for label_analysis in labels_analysis
        ]

        check_results = agg_per_label_check_results(per_label_check_results)

        name_normalized = all(x['status'] == 'normalized' for x in labels_analysis)

        return NameGuardResult(
            metadata=NameMetadata(
                name=name,
                namehash=compute_namehash(name),
                status=NameStatus.NORMALIZED if name_normalized else NameStatus.UNNORMALIZED,
            ),
            summary=NameGuardSummary(
                rating=agg_nameguard_rating(check_results),
                risk_count=count_risks(check_results),
            ),
            check_results=check_results,
        )
