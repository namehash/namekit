from typing import Optional, Tuple
import re

from nameai.models import NLPLabelAnalysis


IS_NAMEHASH_REGEX = re.compile(r'^\[[0-9a-f]{64}\]$')


class Scorer:
    def __init__(self):
        # TODO: read from config
        self.long_label = 30

    def score_label(self, label_analysis: NLPLabelAnalysis) -> Tuple[float, float]:
        """
        Calculates the purity_score and sort_score of the label.
        Returns (purity_score, sort_score).
        """
        purity = None
        sort_score = None

        if self.label_is_unknown(label_analysis):
            # first check namehash because it is detected as not normalized
            purity = 1
        elif self.label_length(label_analysis) == 0 or self.label_is_not_normalized(label_analysis):
            purity = 0
        else:
            # these branches will have purity += ShortNameBonus
            if self.label_contains_invisible(label_analysis):
                purity = 2
            elif self.label_too_long(label_analysis):
                purity = 3
            elif self.label_contains_confusable(label_analysis):
                purity = 4
            elif self.label_contains_special(label_analysis):
                purity = 5
            elif self.label_contains_number(label_analysis):
                purity = 6
            elif self.label_contains_letters(label_analysis):
                purity = 7
            elif self.label_contains_emoji_underscore_dollar(label_analysis):
                purity = 8
            elif self.label_contains_hyphen(label_analysis):
                purity = 9
            elif self.label_contains_simple_number(label_analysis):
                purity = 10
            elif self.word_count(label_analysis) is None:
                purity = 11
            elif self.word_count(label_analysis) == 0:
                purity = 12
            # everything above will have purity == sort_score
            elif self.word_count(label_analysis) > 0:
                if not label_analysis.probability:
                    sort_score = 13
                else:
                    sort_score = 13 + min(-1 / label_analysis.log_probability, 1.0)

                if self.word_count(label_analysis) >= 4:
                    purity = 13
                elif self.word_count(label_analysis) == 3:
                    purity = 14
                elif self.word_count(label_analysis) == 2:
                    purity = 15
                elif self.word_count(label_analysis) == 1:
                    purity = 16

            if purity is not None:
                purity += self.short_label_bonus(label_analysis)

        if sort_score is None:
            sort_score = purity

        if purity is None or sort_score is None:
            raise ValueError('error in scorer algorithm')

        return purity / 17, sort_score / 14

    def label_length(self, label_analysis: NLPLabelAnalysis) -> int:
        # not using char_length because it is only available in the normalized response model
        return label_analysis.inspection.grapheme_length or len(label_analysis.inspection.label)

    def label_is_not_normalized(self, label_analysis: NLPLabelAnalysis) -> bool:
        return label_analysis.inspection.status != 'normalized'

    def label_is_unknown(self, label_analysis: NLPLabelAnalysis) -> bool:
        return IS_NAMEHASH_REGEX.match(label_analysis.inspection.label) is not None

    def label_contains_invisible(self, label_analysis: NLPLabelAnalysis) -> bool:
        return 'invisible' in label_analysis.inspection.any_types

    def label_too_long(self, label_analysis: NLPLabelAnalysis) -> bool:
        return self.label_length(label_analysis) > self.long_label

    def label_contains_confusable(self, label_analysis: NLPLabelAnalysis) -> bool:
        return label_analysis.inspection.confusable_count > 0

    def label_contains_special(self, label_analysis: NLPLabelAnalysis) -> bool:
        return 'special' in label_analysis.inspection.any_types

    def label_contains_number(self, label_analysis: NLPLabelAnalysis) -> bool:
        return 'other_number' in label_analysis.inspection.any_types

    def label_contains_letters(self, label_analysis: NLPLabelAnalysis) -> bool:
        return 'other_letter' in label_analysis.inspection.any_types

    def label_contains_emoji_underscore_dollar(self, label_analysis: NLPLabelAnalysis) -> bool:
        return (
            'emoji' in label_analysis.inspection.any_types
            or 'underscore' in label_analysis.inspection.any_types
            or 'dollarsign' in label_analysis.inspection.any_types
        )

    def label_contains_hyphen(self, label_analysis: NLPLabelAnalysis) -> bool:
        return 'hyphen' in label_analysis.inspection.any_types

    def label_contains_simple_number(self, label_analysis: NLPLabelAnalysis) -> bool:
        return 'simple_number' in label_analysis.inspection.any_types

    def word_count(self, label_analysis: NLPLabelAnalysis) -> Optional[int]:
        return label_analysis.word_count

    def short_label_bonus(self, label_analysis: NLPLabelAnalysis) -> float:
        return 1 - (
            min(self.label_length(label_analysis), 99) / 100
            + min(len(label_analysis.inspection.label), 99) / 10000
            + len(set(label_analysis.inspection.any_types)) / 1000000
        )
