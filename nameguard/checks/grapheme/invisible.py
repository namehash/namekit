from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import Rating, Check, GenericCheckResult


RATING = Rating.ALERT
SEVERITY = 2
MESSAGE_PASS = 'This grapheme is visible'
MESSAGE_FAIL = 'This grapheme is invisible'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.type != 'invisible'
    return GenericCheckResult(
        check=Check.INVISIBLE,
        rating=Rating.PASS if passed else RATING,
        severity=0 if passed else SEVERITY,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
