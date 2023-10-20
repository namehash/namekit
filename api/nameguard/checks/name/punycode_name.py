from typing import Optional
from nameguard.models import CheckStatus, Check, GenericCheckResult, NameCheckResult
from label_inspector.common.punycode import puny_analysis, PunycodeCompatibility
from label_inspector.models import InspectorResult


STATUS = CheckStatus.WARN
MESSAGE_PASS = 'Name is Punycode compatible'
MESSAGE_FAIL = 'Name is not Punycode compatible'
MESSAGE_SKIP = 'Name contains unknown labels'


def check_name(labels: list[Optional[InspectorResult]]) -> GenericCheckResult:
    if any(label is None for label in labels):
        return NameCheckResult(
            check=Check.PUNYCODE_COMPATIBLE_NAME,
            status=CheckStatus.SKIP,
            _name_message=MESSAGE_SKIP,
        )
    result = puny_analysis('.'.join(label.label for label in labels))
    passed = result.compatibility == PunycodeCompatibility.COMPATIBLE
    return NameCheckResult(
        check=Check.PUNYCODE_COMPATIBLE_NAME,
        status=CheckStatus.PASS if passed else STATUS,
        _name_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
