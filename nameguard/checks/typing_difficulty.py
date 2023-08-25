from nameguard.models import Rating, CheckName, GenericCheckResult
from nameguard.checks.base import compute_result


RATING = Rating.YELLOW
SEVERITY = 6
MESSAGE_PASS = 'Name is broadly accessible to type'
MESSAGE_FAIL = 'Name contains characters that may be difficult to type on some devices'
MESSAGE_SKIP = 'Check skipped because the label is not normalized'


def check_label(label_analysis: dict) -> GenericCheckResult:    
    if label_analysis['status'] != 'normalized':
        passed = None
    else:
        passed = all(
            grapheme['type'] in (
                'simple_letter',
                'simple_number',
                'hyphen',
                'dollarsign',
                'underscore',
            ) for grapheme in label_analysis['graphemes'])
    return compute_result(
        name=CheckName.TYPING_DIFFICULTY,
        passed=passed,
        rating=RATING,
        severity=SEVERITY,
        message_pass=MESSAGE_PASS,
        message_fail=MESSAGE_FAIL,
        message_skip=MESSAGE_SKIP,
    )
