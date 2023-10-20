from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import CheckStatus, Check, GenericCheckResult, GraphemeCheckResult


STATUS = CheckStatus.ALERT

G_MESSAGE_PASS = 'This grapheme is visible'
L_MESSAGE_PASS = 'This label is fully visible'
N_MESSAGE_PASS = 'This name is fully visible'

G_MESSAGE_FAIL = 'This grapheme is invisible'
L_MESSAGE_FAIL = 'This label contains invisible graphemes'
N_MESSAGE_FAIL = 'This name contains invisible graphemes'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.type != 'invisible'
    return GraphemeCheckResult(
        check=Check.INVISIBLE,
        status=CheckStatus.PASS if passed else STATUS,
        _grapheme_message=G_MESSAGE_PASS if passed else G_MESSAGE_FAIL,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )
