from label_inspector.models import InspectorResult
from nameguard.models import Rating, CheckName, GenericCheckResult


# TODO: rating/severity
RATING = Rating.YELLOW
SEVERITY = 1
MESSAGE_PASS = 'All graphemes are supported by common fonts'
MESSAGE_FAIL = 'Some graphemes are not supported by common fonts'
MESSAGE_SKIP = 'Label is not normalized'


def check_label(label: InspectorResult) -> GenericCheckResult:
    if label.status != 'normalized':
        return GenericCheckResult(
            name=CheckName.FONT_SUPPORT,
            rating=Rating.UNKNOWN,
            severity=0,
            message=MESSAGE_SKIP,
        )
    else:
        passed = label.font_support_all_os
        return GenericCheckResult(
            name=CheckName.FONT_SUPPORT,
            rating=Rating.GREEN if passed else RATING,
            severity=0 if passed else SEVERITY,
            message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        )
