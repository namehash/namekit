from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import Rating, Check, GenericCheckResult


RATING = Rating.WARN
SEVERITY = 5
MESSAGE_PASS = 'This grapheme is not confusable'
MESSAGE_FAIL = 'This grapheme is confusable'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = len(grapheme.confusables_other) == 0
    return GenericCheckResult(
        check=Check.CONFUSABLES,
        rating=Rating.PASS if passed else RATING,
        severity=0 if passed else SEVERITY,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
