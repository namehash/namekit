from nameguard.models import CheckStatus, Check, GenericCheckResult
from label_inspector.common.punycode import puny_analysis, PunycodeCompatibility
from label_inspector.models import InspectorResult


STATUS = CheckStatus.WARN
MESSAGE_PASS = 'Name is Punycode compatible'
MESSAGE_FAIL = 'Name is not Punycode compatible'


def check_name(labels: list[InspectorResult]) -> GenericCheckResult:
    result = puny_analysis('.'.join(label.label for label in labels))
    passed = result.compatibility == PunycodeCompatibility.COMPATIBLE
    return GenericCheckResult(
        check=Check.PUNYCODE_COMPATIBLE_NAME,
        status=CheckStatus.PASS if passed else STATUS,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
