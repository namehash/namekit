from namerank.nlp_inspector import NLPInspector
from namerank.scorer import Scorer
from namerank.config import load_namerank_config
from namerank.models import (
    NameRankResponse,
    NameRankReport,
    NLPLabelAnalysis,
)

from nameguard import NameGuard


class NameRank:
    def __init__(self, config=None):
        if config is None:
            config = load_namerank_config('prod_config')
        self.nlp_inspector = NLPInspector(config)
        self.nameguard = NameGuard()
        self.scorer = Scorer()

    def inspect_label(self, label: str) -> NameRankResponse:
        nameguard_report = self.nameguard.inspect_name_sync(label)

        if nameguard_report.inspected:
            nlp_analysis = self.nlp_inspector.nlp_analyse_label(label)
            purity, interesting = self.scorer.score_label(nlp_analysis)

            namerank_report = NameRankReport(
                purity_score=purity,
                interesting_score=interesting,
                analysis=NLPLabelAnalysis(
                    inspection=nlp_analysis.inspection,
                    status=nlp_analysis.status,
                    probability=nlp_analysis.probability,
                    log_probability=nlp_analysis.log_probability,
                    word_count=nlp_analysis.word_count,
                    top_tokenization=nlp_analysis.top_tokenization,
                    tokenizations=nlp_analysis.tokenizations,
                ),
            )
        else:
            namerank_report = NameRankReport(
                purity_score=0,
                interesting_score=0,
                analysis=None,
            )

        return NameRankResponse(
            namerank=namerank_report,
            nameguard=nameguard_report,
        )

    def inspect_name(self, name: str) -> NameRankResponse:
        labels = [] if len(name) == 0 else name.split('.')

        if len(labels) == 0:
            return self.inspect_label('')

        if len(labels) == 1:
            return self.inspect_label(labels[0])

        if len(labels) == 2:
            return self.inspect_label(labels[0])

        nameguard_report = self.nameguard.inspect_name_sync(labels[0])
        if nameguard_report.inspected:
            nlp_analysis = self.nlp_inspector.nlp_analyse_label(labels[0])
            namerank_report = NameRankReport(
                purity_score=0,
                interesting_score=0,
                analysis=NLPLabelAnalysis(
                    inspection=nlp_analysis.inspection,
                    status=nlp_analysis.status,
                    probability=0,
                    log_probability=-1e9,
                    word_count=nlp_analysis.word_count,
                    top_tokenization=nlp_analysis.top_tokenization,
                    tokenizations=nlp_analysis.tokenizations,
                ),
            )
        else:
            namerank_report = NameRankReport(
                purity_score=0,
                interesting_score=0,
                analysis=None,
            )

        return NameRankResponse(
            namerank=namerank_report,
            nameguard=nameguard_report,
        )
