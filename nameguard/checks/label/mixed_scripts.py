from label_inspector.models import InspectorResult
from nameguard.models import Rating, CheckName, GenericCheckResult


RATING = Rating.YELLOW
SEVERITY = 7
MESSAGE_PASS = 'Name is in a single script'
MESSAGE_FAIL = 'Name contains multiple scripts'
MESSAGE_SKIP = 'The label is not normalized'


def check_label(label: InspectorResult) -> GenericCheckResult:
    if label.status != 'normalized':
        return GenericCheckResult(
            name=CheckName.MIXED_SCRIPTS,
            rating=Rating.UNKNOWN,
            severity=0,
            message=MESSAGE_SKIP,
        )
    else:
        passed = label.all_script is not None
        return GenericCheckResult(
            name=CheckName.MIXED_SCRIPTS,
            rating=Rating.GREEN if passed else RATING,
            severity=0 if passed else SEVERITY,
            message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        )
