from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import Rating, CheckName, GenericCheckResult
from nameguard.checks.base import CheckBase


class CheckFontSupport(CheckBase):
    NAME = CheckName.FONT_SUPPORT
    # TODO: rating/severity
    RATING = Rating.YELLOW
    SEVERITY = 1
    MESSAGE_PASS = 'All graphemes are supported by common fonts'
    MESSAGE_FAIL = 'Some graphemes are not supported by common fonts'
    MESSAGE_SKIP = 'Label is not normalized'

    def check(label: InspectorResult) -> Optional[bool]:
        if label.status != 'normalized':
            None
        else:
            passed = label.font_support_all_os
