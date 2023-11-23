from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import CheckStatus, Check, GenericCheckResult, GraphemeCheckResult


STATUS = CheckStatus.WARN

MESSAGE_PASS = 'Probably supported by common fonts'

MESSAGE_FAIL = 'May not be supported by common fonts'

MESSAGE_SKIP = 'Unknown if supported by common fonts'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.font_support_all_os
    if passed is None:
        return GraphemeCheckResult(
            check=Check.FONT_SUPPORT,
            status=CheckStatus.SKIP,
            _grapheme_message=MESSAGE_SKIP,
            _label_message=MESSAGE_SKIP,
            _name_message=MESSAGE_SKIP,
        )
    else:
        return GraphemeCheckResult(
            check=Check.FONT_SUPPORT,
            status=CheckStatus.PASS if passed else STATUS,
            _grapheme_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
            _label_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
            _name_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        )
