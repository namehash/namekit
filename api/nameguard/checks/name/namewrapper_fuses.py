from typing import Optional
from nameguard.models import CheckStatus, Check, GenericCheckResult, NameCheckResult
from label_inspector.models import InspectorResult


MESSAGE_INFO = 'We are working on checking NameWrapper fuses'


def check_name(labels: list[Optional[InspectorResult]]) -> GenericCheckResult:
    return NameCheckResult(
        check=Check.NAMEWRAPPER_FUSES,
        status=CheckStatus.INFO,
        _name_message=MESSAGE_INFO,
    )
