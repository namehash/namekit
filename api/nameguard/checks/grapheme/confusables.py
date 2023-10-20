from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import CheckStatus, Check, GenericCheckResult, GraphemeCheckResult


STATUS = CheckStatus.WARN

G_MESSAGE_PASS = 'This grapheme is not confusable'
L_MESSAGE_PASS = 'This label does not contain confusable graphemes'
N_MESSAGE_PASS = 'This name does not contain confusable graphemes'

G_MESSAGE_FAIL = 'This grapheme is confusable'
L_MESSAGE_FAIL = 'This label contains confusable graphemes'
N_MESSAGE_FAIL = 'This name contains confusable graphemes'

G_MESSAGE_SKIP = 'It has not been checked if this grapheme is confusable'
L_MESSAGE_SKIP = 'It has not been checked if this label contains confusable graphemes'
N_MESSAGE_SKIP = 'It has not been checked if this name contains confusable graphemes'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    if not isinstance(grapheme, Grapheme):
        return GraphemeCheckResult(
            check=Check.CONFUSABLES,
            status=CheckStatus.SKIP,
            _grapheme_message=G_MESSAGE_SKIP,
            _label_message=L_MESSAGE_SKIP,
            _name_message=N_MESSAGE_SKIP,
        )
    passed = len(grapheme.confusables_other) == 0
    return GraphemeCheckResult(
        check=Check.CONFUSABLES,
        status=CheckStatus.PASS if passed else STATUS,
        _grapheme_message=G_MESSAGE_PASS if passed else G_MESSAGE_FAIL,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )
