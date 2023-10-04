from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult


STATUS = CheckStatus.WARN
MESSAGE_PASS = 'Label is in a single script'
MESSAGE_FAIL = 'Label contains multiple scripts'
MESSAGE_SKIP = 'Label is unknown'


def check_label(label: Optional[InspectorResult]) -> GenericCheckResult:
    if label is None:
        return GenericCheckResult(
            check=Check.MIXED_SCRIPTS,
            status=CheckStatus.SKIP,
            message=MESSAGE_SKIP,
        )
    passed = label.all_script is not None
    return GenericCheckResult(
        check=Check.MIXED_SCRIPTS,
        status=CheckStatus.PASS if passed else STATUS,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
