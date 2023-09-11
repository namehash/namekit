from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult


STATUS = CheckStatus.WARN
MESSAGE_PASS = 'Label is in a single script'
MESSAGE_FAIL = 'Label contains multiple scripts'


def check_label(label: InspectorResult) -> GenericCheckResult:
    passed = label.all_script is not None
    return GenericCheckResult(
        check=Check.MIXED_SCRIPTS,
        status=CheckStatus.PASS if passed else STATUS,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
