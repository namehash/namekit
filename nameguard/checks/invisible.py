from nameguard.models import Rating, CheckName, GenericCheckResult
from nameguard.checks.base import compute_result


RATING = Rating.RED
SEVERITY = 2
MESSAGE_PASS = 'Name has no invisible characters'
MESSAGE_FAIL = 'Name contains invisible characters'
MESSAGE_SKIP = 'Check skipped because the label is not normalized'


def check_label(label_analysis: dict) -> GenericCheckResult:
    if label_analysis['status'] != 'normalized':
        passed = None
    else:
        passed = all(
            grapheme['type'] != 'invisible'
            for grapheme in label_analysis['graphemes'])
    return compute_result(
        name=CheckName.INVISIBLE,
        passed=passed,
        rating=RATING,
        severity=SEVERITY,
        message_pass=MESSAGE_PASS,
        message_fail=MESSAGE_FAIL,
        message_skip=MESSAGE_SKIP,
    )
