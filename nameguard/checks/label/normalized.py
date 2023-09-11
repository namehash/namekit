from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult


STATUS = CheckStatus.ALERT
MESSAGE_PASS = 'Label is normalized according to ENSIP-15'
MESSAGE_FAIL = 'Label is not normalized according to ENSIP-15'


def check_label(label: InspectorResult) -> GenericCheckResult:
    passed = label.status == 'normalized'
    return GenericCheckResult(
        check=Check.NORMALIZED,
        status=CheckStatus.PASS if passed else STATUS,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
