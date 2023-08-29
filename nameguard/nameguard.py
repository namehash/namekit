from label_inspector.inspector import Inspector
from label_inspector.models import InspectorResultNormalized, InspectorResultUnnormalized, InspectorResult
from label_inspector.config import initialize_inspector_config

from nameguard import checks
from nameguard.models import (
    NameGuardResult,
    LabelGuardResult,
    GraphemeGuardResult,
    NameGuardBulkResult,
    Rating,
    GenericCheckResult,
    RiskSummary,
    Normalization,
)


GRAPHEME_CHECKS = [
    checks.grapheme.confusables.check_grapheme,
    checks.grapheme.font_support.check_grapheme,
    checks.grapheme.invisible.check_grapheme,
    checks.grapheme.typing_difficulty.check_grapheme,
]

LABEL_CHECKS = [
    checks.label.normalized.check_label,
    checks.label.mixed_scripts.check_label,
    checks.label.namewrapper.check_label,
    checks.label.punycode.check_label,
]

NAME_CHECKS = [
    checks.name.punycode_name.check_name,
]


def init_inspector():
    with initialize_inspector_config('prod_config') as config:
        return Inspector(config)


def compute_namehash(name: str) -> str:
    return 'TODO'


def compute_labelhash(label: str) -> str:
    return 'TODO'


def calculate_nameguard_rating(checks: list[GenericCheckResult]) -> Rating:
    return max(check.rating for check in checks)


def count_risks(checks: list[GenericCheckResult]) -> int:
    return sum(1 for check in checks if check.rating > Rating.PASS)


def agg_checks(checks: list[GenericCheckResult]) -> list[GenericCheckResult]:
    out = {}
    for check in checks:
        out[check.check] = max(out.get(check.check, check), check)
    return list(out.values())


class NameGuard:
    def __init__(self):
        self.inspector = init_inspector()

    def inspect_name(self, name: str) -> NameGuardResult:
        labels = name.split('.')
        labels_analysis = [self.analyse_label(label) for label in labels]

        # -- check individual entities --

        # checks for each grapheme in each label
        labels_graphemes_checks = [
            [
                [check(grapheme) for check in GRAPHEME_CHECKS]
                for grapheme in label_analysis.graphemes
            ]
            for label_analysis in labels_analysis
            if label_analysis.status == 'normalized'
        ]

        # checks for each label
        labels_checks = [
            [check(label_analysis) for check in LABEL_CHECKS]
            for label_analysis in labels_analysis
        ]

        # checks for the whole name
        name_checks = [check(labels_analysis) for check in NAME_CHECKS]

        # -- aggregate results --

        # merge grapheme checks into label checks
        for label_i, label_graphemes_checks in enumerate(labels_graphemes_checks):
            for grapheme_checks in label_graphemes_checks:
                labels_checks[label_i].extend(grapheme_checks)
            labels_checks[label_i] = agg_checks(labels_checks[label_i])

        # merge label checks into name checks
        for label_checks in labels_checks:
            name_checks.extend(label_checks)
        name_checks = agg_checks(name_checks)

        # -- generate result --

        name_normalized = all(x.status == 'normalized' for x in labels_analysis)

        return NameGuardResult(
            name=name,
            namehash=compute_namehash(name),
            normalization=Normalization.NORMALIZED if name_normalized else Normalization.UNNORMALIZED,
            summary=RiskSummary(
                rating=calculate_nameguard_rating(name_checks),
                risk_count=count_risks(name_checks),
            ),
            checks=name_checks,
            labels=[
                LabelGuardResult(
                    label=label_analysis.label,
                    labelhash=compute_labelhash(label_analysis.label),
                    normalization=Normalization.NORMALIZED if label_analysis.status == 'normalized' else Normalization.UNNORMALIZED,
                    summary=RiskSummary(
                        rating=calculate_nameguard_rating(label_checks),
                        risk_count=count_risks(label_checks),
                    ),
                    checks=label_checks,
                    graphemes=[
                        GraphemeGuardResult(
                            grapheme=grapheme.value,
                            summary=RiskSummary(
                                rating=calculate_nameguard_rating(grapheme_checks),
                                risk_count=count_risks(grapheme_checks),
                            ),
                            checks=grapheme_checks,
                        )
                        for grapheme, grapheme_checks in zip(label_analysis.graphemes, label_graphemes_checks)
                    ] if label_analysis.status == 'normalized' else [],
                )
                for label_analysis, label_checks, label_graphemes_checks in zip(
                    labels_analysis,
                    labels_checks,
                    labels_graphemes_checks,
                )
            ],
        )

    def bulk_inspect_names(self, names: list[str]) -> NameGuardBulkResult:
        return NameGuardBulkResult(
            results=[self.inspect_name(name) for name in names],
        )

    def analyse_label(self, label: str) -> InspectorResult:
        result = self.inspector.analyse_label(label)
        if result['status'] == 'normalized':
            return InspectorResultNormalized(**result)
        else:
            return InspectorResultUnnormalized(**result)
