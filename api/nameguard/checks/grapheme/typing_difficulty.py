from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import CheckStatus, Check, GenericCheckResult, GraphemeCheckResult


STATUS = CheckStatus.WARN

G_MESSAGE_PASS = 'This grapheme is broadly accessible to type'
L_MESSAGE_PASS = 'This label is broadly accessible to type'
N_MESSAGE_PASS = 'This name is broadly accessible to type'

G_MESSAGE_FAIL = 'This grapheme may be difficult to type on some devices'
L_MESSAGE_FAIL = 'This label contains characters that may be difficult to type on some devices'
N_MESSAGE_FAIL = 'This name contains characters that may be difficult to type on some devices'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.type in (
        'simple_letter',
        'simple_number',
        'hyphen',
        'dollarsign',
        'underscore',
    )
    return GraphemeCheckResult(
        check=Check.TYPING_DIFFICULTY,
        status=CheckStatus.PASS if passed else STATUS,
        _grapheme_message=G_MESSAGE_PASS if passed else G_MESSAGE_FAIL,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )
