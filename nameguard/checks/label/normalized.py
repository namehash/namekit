from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult


STATUS = CheckStatus.ALERT
MESSAGE_PASS = 'Label is normalized according to ENSIP-15'
MESSAGE_FAIL = 'Label is not normalized according to ENSIP-15'
MESSAGE_SKIP = 'Label is unknown'


def check_label(label: Optional[InspectorResult]) -> GenericCheckResult:
    if label is None:
        return GenericCheckResult(
            check=Check.NORMALIZED,
            status=CheckStatus.SKIP,
            message=MESSAGE_SKIP,
        )
    passed = label.status == 'normalized'
    return GenericCheckResult(
        check=Check.NORMALIZED,
        status=CheckStatus.PASS if passed else STATUS,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
