from typing import Optional
from nameguard.models.checks import GenericCheckResult, Rating, CheckName


def compute_result(name: CheckName,
                   passed: Optional[bool],
                   rating: Rating,
                   severity: int,
                   message_pass: str,
                   message_fail: str,
                   message_skip: str
) -> GenericCheckResult:
    skipped = passed is None
    passed = passed or False
    return GenericCheckResult(
        name=name,
        rating=Rating.GREEN if passed else Rating.UNKNOWN if skipped else rating,
        severity=0 if passed or skipped else severity,
        message=message_pass if passed else message_skip if skipped else message_fail,
    )
