from nameguard.models import Rating, CheckName, GenericCheckResult
from nameguard.checks.base import compute_result


RATING = Rating.YELLOW
SEVERITY = 5
MESSAGE_PASS = 'Name does not contain confusable characters'
MESSAGE_FAIL = 'Name contains characters that may be confusable'
MESSAGE_SKIP = 'Check skipped because the label is not normalized'


def check_label(label_analysis: dict) -> GenericCheckResult:
    if label_analysis['status'] != 'normalized':
        passed = None
    else:
        passed = label_analysis['confusable_count'] == 0
    return compute_result(
        name=CheckName.CONFUSABLES,
        passed=passed,
        rating=RATING,
        severity=SEVERITY,
        message_pass=MESSAGE_PASS,
        message_fail=MESSAGE_FAIL,
        message_skip=MESSAGE_SKIP,
    )
