from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult


STATUS = CheckStatus.ALERT
MESSAGE_PASS = 'Label is not unknown'
MESSAGE_FAIL = 'Label is unknown'


def check_label(label: Optional[InspectorResult]) -> GenericCheckResult:
    passed = label is not None
    return GenericCheckResult(
        check=Check.UNKNOWN_LABEL,
        status=CheckStatus.PASS if passed else STATUS,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
