from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import CheckStatus, Check, GenericCheckResult, GraphemeCheckResult


STATUS = CheckStatus.WARN

# title: Font Support
TITLE_PASS = "Font Support"
TITLE_FAIL = "Font Support"
TITLE_SKIP = "Font Support"

MESSAGE_PASS = "Commonly supported"

MESSAGE_FAIL = "Less common support"

MESSAGE_SKIP = "Unknown font support"


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.font_support_all_os
    if passed is None:
        return GraphemeCheckResult(
            check=Check.FONT_SUPPORT,
            status=CheckStatus.SKIP,
            _grapheme_message=MESSAGE_SKIP,
            _label_message=MESSAGE_SKIP,
            _name_message=MESSAGE_SKIP,
            _title=TITLE_SKIP,
        )
    else:
        return GraphemeCheckResult(
            check=Check.FONT_SUPPORT,
            status=CheckStatus.PASS if passed else STATUS,
            _grapheme_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
            _label_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
            _name_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
            _title=TITLE_PASS if passed else TITLE_FAIL,
        )
