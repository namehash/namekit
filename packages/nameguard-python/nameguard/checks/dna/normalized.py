from typing import Optional
from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme, InspectorResult as Label
from nameguard.grapheme_normalization import grapheme_is_normalized
from nameguard.models import (
    CheckStatus,
    Check,
    GraphemeCheckResult,
    LabelCheckResult,
    NameCheckResult,
    UNINSPECTED_SKIP_MESSAGE,
)

STATUS = CheckStatus.ALERT

# title:  Normalized
TITLE_PASS = 'Normalization'
TITLE_FAIL = 'Normalization'
TITLE_SKIP = 'Normalization'

MESSAGE_PASS = 'Valid for use with ENS'

MESSAGE_FAIL = 'Invalid for use with ENS'

L_MESSAGE_SKIP = 'This label is unknown'
N_MESSAGE_SKIP = 'This name contains unknown labels'


def check_grapheme(grapheme: Grapheme) -> GraphemeCheckResult:
    passed = grapheme_is_normalized(grapheme.value)
    return GraphemeCheckResult(
        check=Check.NORMALIZED,
        status=CheckStatus.PASS if passed else STATUS,
        _grapheme_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _label_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _name_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _title=TITLE_PASS if passed else TITLE_FAIL,
    )


def check_label(label: Optional[Label]) -> LabelCheckResult:
    if label is None:
        # unknown label
        return LabelCheckResult(
            check=Check.NORMALIZED,
            status=CheckStatus.SKIP,
            _label_message=L_MESSAGE_SKIP,
            _name_message=N_MESSAGE_SKIP,
            _title=TITLE_SKIP,
        )
    passed = label.status == 'normalized' and len(label.label) > 0
    return LabelCheckResult(
        check=Check.NORMALIZED,
        status=CheckStatus.PASS if passed else STATUS,
        _label_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _name_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _title=TITLE_PASS if passed else TITLE_FAIL,
    )


def check_name(name: list[Optional[Label]]) -> NameCheckResult:
    if any(label is None for label in name):
        # unknown label in name
        return NameCheckResult(
            check=Check.NORMALIZED,
            status=CheckStatus.SKIP,
            _name_message=N_MESSAGE_SKIP,
            _title=TITLE_SKIP,
        )
    passed = all(label.status == 'normalized' and len(label.label) > 0 for label in name)
    return NameCheckResult(
        check=Check.NORMALIZED,
        status=CheckStatus.PASS if passed else STATUS,
        _name_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _title=TITLE_PASS if passed else TITLE_FAIL,
    )


UNINSPECTED_SKIP_CHECK_RESULT = GraphemeCheckResult(
    check=Check.NORMALIZED,
    status=CheckStatus.SKIP,
    _grapheme_message=UNINSPECTED_SKIP_MESSAGE,
    _label_message=UNINSPECTED_SKIP_MESSAGE,
    _name_message=UNINSPECTED_SKIP_MESSAGE,
    _title=TITLE_SKIP,
)
