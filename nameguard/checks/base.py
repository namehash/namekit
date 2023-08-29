from typing import Optional
from nameguard.models import Rating, CheckName, GenericCheckResult


class CheckBase:
    NAME: CheckName
    RATING: Rating
    SEVERITY: int
    MESSAGE_PASS: str
    MESSAGE_FAIL: str
    MESSAGE_SKIP: str

    @classmethod
    def compute(cls, *args, **kwargs) -> GenericCheckResult:
        passed = cls.check(*args, **kwargs)
        if passed is None:
            return GenericCheckResult(
                name=cls.NAME,
                rating=Rating.UNKNOWN,
                severity=0,
                message=cls.MESSAGE_PASS,
            )
        return GenericCheckResult(
            name=cls.NAME,
            rating=Rating.GREEN if passed else cls.RATING,
            severity=0 if passed else cls.SEVERITY,
            message=cls.MESSAGE_PASS if passed else cls.MESSAGE_FAIL,
        )

    @classmethod
    def check(cls, *args, **kwargs) -> Optional[bool]:
        raise NotImplementedError
