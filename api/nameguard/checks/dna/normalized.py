from typing import Optional
from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme, InspectorResult as Label
from nameguard.grapheme_normalization import grapheme_is_normalized
from nameguard.models import CheckStatus, Check, GraphemeCheckResult, LabelCheckResult, NameCheckResult


STATUS = CheckStatus.ALERT

G_MESSAGE_PASS = 'This grapheme is normalized according to ENSIP-15'
L_MESSAGE_PASS = 'This label is normalized according to ENSIP-15'
N_MESSAGE_PASS = 'This name is normalized according to ENSIP-15'

G_MESSAGE_FAIL = 'This grapheme is not normalized according to ENSIP-15'
L_MESSAGE_FAIL = 'This label is not normalized according to ENSIP-15'
N_MESSAGE_FAIL = 'This name is not normalized according to ENSIP-15'

L_MESSAGE_SKIP = 'This label is unknown'
N_MESSAGE_SKIP = 'This name contains unknown labels'


def check_grapheme(grapheme: Grapheme) -> GraphemeCheckResult:
    passed = grapheme_is_normalized(grapheme.value)
    return GraphemeCheckResult(
        check=Check.NORMALIZED,
        status=CheckStatus.PASS if passed else STATUS,
        _grapheme_message=G_MESSAGE_PASS if passed else G_MESSAGE_FAIL,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )


def check_label(label: Optional[Label]) -> LabelCheckResult:
    if label is None:
        # unknown label
        return LabelCheckResult(
            check=Check.NORMALIZED,
            status=CheckStatus.SKIP,
            _label_message=L_MESSAGE_SKIP,
            _name_message=N_MESSAGE_SKIP,
        )
    passed = label.status == 'normalized' and len(label.label) > 0
    return LabelCheckResult(
        check=Check.NORMALIZED,
        status=CheckStatus.PASS if passed else STATUS,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )


def check_name(name: list[Optional[Label]]) -> NameCheckResult:
    if any(label is None for label in name):
        # unknown label in name
        return NameCheckResult(
            check=Check.NORMALIZED,
            status=CheckStatus.SKIP,
            _name_message=N_MESSAGE_SKIP,
        )
    passed = all(label.status == 'normalized' and len(label.label) > 0 for label in name)
    return NameCheckResult(
        check=Check.NORMALIZED,
        status=CheckStatus.PASS if passed else STATUS,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )
