from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult


STATUS = CheckStatus.WARN
MESSAGE_PASS = 'Label is NameWrapper compatible'
MESSAGE_FAIL = 'Label is not NameWrapper compatible'
MESSAGE_SKIP = 'Label is unknown'

WRAPPED_MAX_BYTES = 255


def check_label(label: Optional[InspectorResult]) -> GenericCheckResult:
    if label is None:
        return GenericCheckResult(
            check=Check.NAMEWRAPPER_COMPATIBLE,
            status=CheckStatus.SKIP,
            message=MESSAGE_SKIP,
        )
    wrapped = label.label.encode('utf-8')
    passed = len(wrapped) <= WRAPPED_MAX_BYTES
    return GenericCheckResult(
        check=Check.NAMEWRAPPER_COMPATIBLE,
        status=CheckStatus.PASS if passed else STATUS,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
