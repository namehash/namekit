from label_inspector.inspector import Inspector
from label_inspector.config import initialize_inspector_config

from nameguard import checks
from nameguard.models import (
    NameGuardResult,
    LabelGuardResult,
    GraphemeGuardResult,
    NameGuardBulkResult,
    RiskSummary,
    Normalization,
)
from nameguard.utils import (
    namehash_from_name,
    labelhash_from_label,
    calculate_nameguard_rating,
    count_risks,
    agg_checks,
    get_highest_risk,
)
from nameguard.logging import logger
from nameguard.subgraph import namehash_to_normal_name_lookup


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


class NameGuard:
    def __init__(self):
        self.inspector = init_inspector()

    def inspect_name(self, name: str) -> NameGuardResult:
        logger.debug(f'[inspect_name] name: \'{name}\'')
        labels = name.split('.')
        logger.debug(f'[inspect_name] labels: {labels}')
        labels_analysis = [self.inspector.analyse_label(label) for label in labels]

        # -- check individual entities --

        # checks for each grapheme in each label
        labels_graphemes_checks = [
            [
                [check(grapheme) for check in GRAPHEME_CHECKS]
                for grapheme in label_analysis.graphemes
            ]
            for label_analysis in labels_analysis
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
            namehash=namehash_from_name(name),
            normalization=Normalization.NORMALIZED if name_normalized else Normalization.UNNORMALIZED,
            summary=RiskSummary(
                rating=calculate_nameguard_rating(name_checks),
                risk_count=count_risks(name_checks),
                highest_risk=get_highest_risk(name_checks),
            ),
            checks=name_checks,
            labels=[
                LabelGuardResult(
                    label=label_analysis.label,
                    labelhash=labelhash_from_label(label_analysis.label),
                    normalization=Normalization.NORMALIZED if label_analysis.status == 'normalized' else Normalization.UNNORMALIZED,
                    summary=RiskSummary(
                        rating=calculate_nameguard_rating(label_checks),
                        risk_count=count_risks(label_checks),
                        highest_risk=get_highest_risk(label_checks),
                    ),
                    checks=label_checks,
                    graphemes=[
                        GraphemeGuardResult(
                            grapheme=grapheme.value,
                            grapheme_name=grapheme.name,
                            grapheme_type=grapheme.type,
                            grapheme_script=grapheme.script,
                            grapheme_link=grapheme.link,
                            summary=RiskSummary(
                                rating=calculate_nameguard_rating(grapheme_checks),
                                risk_count=count_risks(grapheme_checks),
                                highest_risk=get_highest_risk(grapheme_checks),
                            ),
                            checks=grapheme_checks,
                        )
                        for grapheme, grapheme_checks in zip(label_analysis.graphemes, label_graphemes_checks)
                    ],
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

    async def inspect_namehash(self, namehash: str, network='mainnet') -> NameGuardResult:
        name = await namehash_to_normal_name_lookup(namehash, network=network)
        if name is None:
            name_checks = [checks.name.unknown_name.check_name(None)]
            return NameGuardResult(
                name=None,
                namehash=namehash,
                normalization=Normalization.UNKNOWN,
                summary=RiskSummary(
                    rating=calculate_nameguard_rating(name_checks),
                    risk_count=count_risks(name_checks),
                    highest_risk=get_highest_risk(name_checks),
                ),
                checks=name_checks,
                labels=None,
            )
        else:
            return self.inspect_name(name)
