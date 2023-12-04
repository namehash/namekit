from typing import Optional
from nameguard.models import CheckStatus, Check, GenericCheckResult, NameCheckResult
from label_inspector.models import InspectorResult

# title: NameWrapper Fuses
TITLE_INFO = 'NameWrapper Fuses'

MESSAGE_INFO = 'NameWrapper fuse checks will be added soon'


def check_name(labels: list[Optional[InspectorResult]]) -> GenericCheckResult:
    return NameCheckResult(
        check=Check.NAMEWRAPPER_FUSES,
        status=CheckStatus.INFO,
        _name_message=MESSAGE_INFO,
        _title=TITLE_INFO,
    )
