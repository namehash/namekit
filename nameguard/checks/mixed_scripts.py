from nameguard.models import Rating, CheckName, GenericCheckResult
from nameguard.checks.base import compute_result


RATING = Rating.YELLOW
SEVERITY = 7
MESSAGE_PASS = 'Name is in a single script'
MESSAGE_FAIL = 'Name contains multiple scripts'
MESSAGE_SKIP = 'Check skipped because the label is not normalized'


def check_label(label_analysis: dict) -> GenericCheckResult:
    if label_analysis['status'] != 'normalized':
        passed = None
    else:
        passed = label_analysis['all_script'] is not None
    return compute_result(
        name=CheckName.MIXED_SCRIPTS,
        passed=passed,
        rating=RATING,
        severity=SEVERITY,
        message_pass=MESSAGE_PASS,
        message_fail=MESSAGE_FAIL,
        message_skip=MESSAGE_SKIP,
    )
