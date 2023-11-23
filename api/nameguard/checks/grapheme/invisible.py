from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import CheckStatus, Check, GenericCheckResult, GraphemeCheckResult


STATUS = CheckStatus.ALERT

G_MESSAGE_PASS = 'Visible'
L_MESSAGE_PASS = 'Does not contain invisible graphemes'
N_MESSAGE_PASS = 'Does not contain invisible graphemes'

G_MESSAGE_FAIL = 'Invisible'
L_MESSAGE_FAIL = 'Contains invisible graphemes'
N_MESSAGE_FAIL = 'Contains invisible graphemes'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.type != 'invisible'
    return GraphemeCheckResult(
        check=Check.INVISIBLE,
        status=CheckStatus.PASS if passed else STATUS,
        _grapheme_message=G_MESSAGE_PASS if passed else G_MESSAGE_FAIL,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )
