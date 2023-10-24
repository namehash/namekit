from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import CheckStatus, Check, GenericCheckResult, GraphemeCheckResult


STATUS = CheckStatus.WARN

G_MESSAGE_PASS = 'This grapheme is supported by common fonts'
L_MESSAGE_PASS = 'This label is supported by common fonts'
N_MESSAGE_PASS = 'This name is supported by common fonts'

G_MESSAGE_FAIL = 'This grapheme is not supported by common fonts'
L_MESSAGE_FAIL = 'This label is not supported by common fonts'
N_MESSAGE_FAIL = 'This name is not supported by common fonts'

G_MESSAGE_SKIP = 'It is unknown if this grapheme is supported by common fonts'
L_MESSAGE_SKIP = 'It is unknown if this label is supported by common fonts'
N_MESSAGE_SKIP = 'It is unknown if this name is supported by common fonts'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.font_support_all_os
    if passed is None:
        return GraphemeCheckResult(
            check=Check.FONT_SUPPORT,
            status=CheckStatus.SKIP,
            _grapheme_message=G_MESSAGE_SKIP,
            _label_message=L_MESSAGE_SKIP,
            _name_message=N_MESSAGE_SKIP,
        )
    else:
        return GraphemeCheckResult(
            check=Check.FONT_SUPPORT,
            status=CheckStatus.PASS if passed else STATUS,
            _grapheme_message=G_MESSAGE_PASS if passed else G_MESSAGE_FAIL,
            _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
            _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
        )
