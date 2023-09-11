from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import CheckStatus, Check, GenericCheckResult


STATUS = CheckStatus.WARN
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
        status=CheckStatus.PASS if passed else STATUS,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
