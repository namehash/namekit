from nameguard.models import Rating, CheckName, GenericCheckResult
from nameguard.checks.base import compute_result


RATING = Rating.RED
SEVERITY = 4
MESSAGE_PASS = 'Name is normalized according to ENSIP-15'
MESSAGE_FAIL = 'Name is not normalized according to ENSIP-15'


def check_label(label_analysis: dict) -> GenericCheckResult:
    passed = label_analysis['status'] == 'normalized'
    return compute_result(
        name=CheckName.NORMALIZED,
        passed=passed,
        rating=RATING,
        severity=SEVERITY,
        message_pass=MESSAGE_PASS,
        message_fail=MESSAGE_FAIL,
        message_skip=None,
    )
