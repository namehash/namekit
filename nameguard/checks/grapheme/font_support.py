from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import Rating, CheckName, GenericCheckResult


# TODO: rating/severity
RATING = Rating.YELLOW
SEVERITY = 1
MESSAGE_PASS = 'This grapheme is supported by common fonts'
MESSAGE_FAIL = 'This grapheme is not supported by common fonts'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.font_support_all_os
    return GenericCheckResult(
        name=CheckName.FONT_SUPPORT,
        rating=Rating.GREEN if passed else RATING,
        severity=0 if passed else SEVERITY,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
