from pydantic import BaseModel, Field
from enum import Enum


class CheckStatus(str, Enum):
    '''
    The status of a conducted check.

    * `SKIP`: This check was skipped because it was not applicable.
    * `INFO`: This check is informational only.
    * `PASS`: This check passed.
    * `WARN`: This check failed, this is a minor issue.
    * `ALERT`: This check failed, this is a major issue.
    '''

    SKIP = 'SKIP'
    INFO = 'INFO'
    PASS = 'PASS'
    WARN = 'WARN'
    ALERT = 'ALERT'


    @property
    def order(self):
        return {
            CheckStatus.SKIP: 0,
            CheckStatus.INFO: 1,
            CheckStatus.PASS: 2,
            CheckStatus.WARN: 3,
            CheckStatus.ALERT: 4,
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


class Rating(str, Enum):
    '''
    The rating of a name/label/grapheme based on multiple conducted checks.

    * `PASS`: All checks passed.
    * `WARN`: At least one check failed with a `WARN` status but no check failed with an `ALERT` status.
    * `ALERT`: At least one check failed with an `ALERT` status.
    '''

    PASS = 'PASS'
    WARN = 'WARN'
    ALERT = 'ALERT'
    

    @property
    def order(self):
        return {
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
    '''
    The type of a check.

    * `CONFUSABLES`: A grapheme is visually confusable.
    * `INVISIBLE`: A grapheme is invisible.
    * `TYPING_DIFFICULTY`: A grapheme is difficult to type.
    * `FONT_SUPPORT`: A grapheme is not supported by common fonts.

    * `MIXED_SCRIPTS`: A label contains multiple scripts.
    * `NAMEWRAPPER_COMPATIBLE`: TODO
    * `NORMALIZED`: A label is ENSIP-15 normalized.
    * `PUNYCODE_COMPATIBLE_LABEL`: A label is compatible with Punycode.
    * `UNKNOWN_LABEL`: A label is unknown.

    * `PUNYCODE_COMPATIBLE_NAME`: A name is compatible with Punycode.
    '''

    # Grapheme
    CONFUSABLES = 'CONFUSABLES'
    INVISIBLE = 'INVISIBLE'
    TYPING_DIFFICULTY = 'TYPING_DIFFICULTY'
    FONT_SUPPORT = 'FONT_SUPPORT'

    # Label
    MIXED_SCRIPTS = 'MIXED_SCRIPTS'
    NAMEWRAPPER_COMPATIBLE = 'NAMEWRAPPER_COMPATIBLE'
    NORMALIZED = 'NORMALIZED'
    PUNYCODE_COMPATIBLE_LABEL = 'PUNYCODE_COMPATIBLE_LABEL'
    UNKNOWN_LABEL = 'UNKNOWN_LABEL'

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
    '''
    The result of a conducted check.
    '''

    check: Check
    status: CheckStatus
    message: str = Field(description='A message describing the result of the check.')

    @property
    def rating(self):
        return {
            CheckStatus.SKIP: Rating.PASS,
            CheckStatus.INFO: Rating.PASS,
            CheckStatus.PASS: Rating.PASS,
            CheckStatus.WARN: Rating.WARN,
            CheckStatus.ALERT: Rating.ALERT,
        }[self.status]

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
