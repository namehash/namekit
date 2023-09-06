from pydantic import BaseModel
from enum import Enum


class Rating(str, Enum):
    SKIP = 'SKIP'
    INFO = 'INFO'
    PASS = 'PASS'
    WARN = 'WARN'
    ALERT = 'ALERT'
    

    @property
    def order(self):
        return {
            Rating.SKIP: 0,
            Rating.INFO: 1,
            Rating.PASS: 2,
            Rating.WARN: 3,
            Rating.ALERT: 4,
        }[self]

    def __hash__(self) -> int:
        return hash(self.value)

    # Implementing all ops speeds up comparisons

    def __lt__(self, other):
        return self.order < other.order

    def __gt__(self, other):
        return self.order > other.order

    def __eq__(self, other):
        return self.order == other.order

    def __le__(self, other):
        return self.order <= other.order

    def __ge__(self, other):
        return self.order >= other.order

    def __ne__(self, other):
        return self.order != other.order


class Check(str, Enum):
    # Grapheme
    CONFUSABLES = 'CONFUSABLES'
    INVISIBLE = 'INVISIBLE'
    TYPING_DIFFICULTY = 'TYPING_DIFFICULTY'

    # Label
    FONT_SUPPORT = 'FONT_SUPPORT'
    MIXED_SCRIPTS = 'MIXED_SCRIPTS'
    NAMEWRAPPER_COMPATIBLE = 'NAMEWRAPPER_COMPATIBLE'
    NORMALIZED = 'NORMALIZED'
    PUNYCODE_COMPATIBLE_LABEL = 'PUNYCODE_COMPATIBLE_LABEL'

    # Name
    PUNYCODE_COMPATIBLE_NAME = 'PUNYCODE_COMPATIBLE_NAME'


SEVERITY_ORDER_DESC = [
    # highest severity first
    Check.NORMALIZED,
    Check.INVISIBLE,
    Check.CONFUSABLES,
    Check.TYPING_DIFFICULTY,
    # all other checks get severity 0
]

SEVERITY = {check: len(SEVERITY_ORDER_DESC) - i for i, check in enumerate(SEVERITY_ORDER_DESC)}


def get_check_severity(check: Check) -> int:
    return SEVERITY.get(check, 0)


class GenericCheckResult(BaseModel):
    check: Check
    rating: Rating
    message: str

    def __repr__(self):
        return f'{self.check}({self.rating.name})'

    @property
    def order(self):
        """
        Checks are first sorted by rating, then by severity.
        Higher risk ratings always come first (ALERT > WARN > PASS > INFO > SKIP).
        Within the same rating, checks are sorted by severity.
        """
        return (self.rating.order, get_check_severity(self.check))

    # Implementing all ops speeds up comparisons

    def __lt__(self, other):
        return self.order < other.order

    def __gt__(self, other):
        return self.order > other.order

    def __eq__(self, other):
        return self.order == other.order

    def __le__(self, other):
        return self.order <= other.order

    def __ge__(self, other):
        return self.order >= other.order

    def __ne__(self, other):
        return self.order != other.order
