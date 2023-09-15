from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult


STATUS = CheckStatus.WARN
MESSAGE_PASS = 'Label is Punycode compatible'
MESSAGE_FAIL = 'Label is not Punycode compatible'
MESSAGE_SKIP = 'Label is unknown'


def check_label(label: Optional[InspectorResult]) -> GenericCheckResult:
    if label is None:
        return GenericCheckResult(
            check=Check.PUNYCODE_COMPATIBLE_LABEL,
            status=CheckStatus.SKIP,
            message=MESSAGE_SKIP,
        )
    passed = label.punycode_compatibility == 'COMPATIBLE'
    return GenericCheckResult(
        check=Check.PUNYCODE_COMPATIBLE_LABEL,
        status=CheckStatus.PASS if passed else STATUS,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
