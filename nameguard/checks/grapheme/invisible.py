from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import Rating, CheckName, GenericCheckResult


RATING = Rating.RED
SEVERITY = 2
MESSAGE_PASS = 'This grapheme is visible'
MESSAGE_FAIL = 'This grapheme is invisible'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.type != 'invisible'
    return GenericCheckResult(
        name=CheckName.INVISIBLE,
        rating=Rating.GREEN if passed else RATING,
        severity=0 if passed else SEVERITY,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
