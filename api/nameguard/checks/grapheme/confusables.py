from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import CheckStatus, Check, GenericCheckResult


STATUS = CheckStatus.WARN
MESSAGE_PASS = 'This grapheme is not confusable'
MESSAGE_FAIL = 'This grapheme is confusable'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = len(grapheme.confusables_other) == 0
    return GenericCheckResult(
        check=Check.CONFUSABLES,
        status=CheckStatus.PASS if passed else STATUS,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
