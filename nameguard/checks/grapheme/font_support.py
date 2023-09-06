from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import Rating, Check, GenericCheckResult


RATING = Rating.WARN
MESSAGE_PASS = 'This grapheme is supported by common fonts'
MESSAGE_FAIL = 'This grapheme is not supported by common fonts'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.font_support_all_os
    return GenericCheckResult(
        check=Check.FONT_SUPPORT,
        rating=Rating.PASS if passed else RATING,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
