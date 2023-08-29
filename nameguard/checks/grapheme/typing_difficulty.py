from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import Rating, Check, GenericCheckResult


RATING = Rating.WARN
SEVERITY = 6
MESSAGE_PASS = 'Name is broadly accessible to type'
MESSAGE_FAIL = 'Name contains characters that may be difficult to type on some devices'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.type in (
        'simple_letter',
        'simple_number',
        'hyphen',
        'dollarsign',
        'underscore',
    )
    return GenericCheckResult(
        check=Check.TYPING_DIFFICULTY,
        rating=Rating.PASS if passed else RATING,
        severity=0 if passed else SEVERITY,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
