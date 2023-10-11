from pydantic import BaseModel, Field
from enum import Enum


class CheckStatus(str, Enum):
    '''
    The status of a conducted check.

    * `skip`: This check was skipped because it was not applicable.
    * `info`: This check is informational only.
    * `pass`: This check passed.
    * `warn`: This check failed, this is a minor issue.
    * `alert`: This check failed, this is a major issue.
    '''

    SKIP = 'skip'
    INFO = 'info'
    PASS = 'pass'
    WARN = 'warn'
    ALERT = 'alert'


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

    * `pass`: All checks passed.
    * `warn`: At least one check failed with a `WARN` status but no check failed with an `ALERT` status.
    * `alert`: At least one check failed with an `ALERT` status.
    '''

    PASS = 'pass'
    WARN = 'warn'
    ALERT = 'alert'
    

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

    * `confusables`: A grapheme is visually confusable.
    * `invisible`: A grapheme is invisible.
    * `typing_difficulty`: A grapheme is difficult to type.
    * `font_support`: A grapheme is not supported by common fonts.

    * `mixed_scripts`: A label contains multiple scripts.
    * `namewrapper_compatible`: TODO
    * `normalized`: A label is ENSIP-15 normalized.
    * `punycode_compatible_label`: A label is compatible with Punycode.
    * `unknown_label`: A label is unknown.

    * `impersonation_risk`: A name might be used for impersonation.
    * `punycode_compatible_name`: A name is compatible with Punycode.
    '''

    # Grapheme
    CONFUSABLES = 'confusables'
    INVISIBLE = 'invisible'
    TYPING_DIFFICULTY = 'typing_difficulty'
    FONT_SUPPORT = 'font_support'

    # Label
    MIXED_SCRIPTS = 'mixed_scripts'
    NAMEWRAPPER_COMPATIBLE = 'namewrapper_compatible'
    NORMALIZED = 'normalized'
    PUNYCODE_COMPATIBLE_LABEL = 'punycode_compatible_label'
    UNKNOWN_LABEL = 'unknown_label'

    # Name
    IMPERSONATION_RISK = 'impersonation_risk'
    PUNYCODE_COMPATIBLE_NAME = 'punycode_compatible_name'


SEVERITY_ORDER_DESC = [
    # highest severity first
    Check.IMPERSONATION_RISK,
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
        return f'{self.check.value}({self.rating.value})'

    @property
    def order(self):
        """
        Checks are first sorted by status, then by severity.
        Higher risk status always comes first (ALERT > WARN > PASS > INFO > SKIP).
        Within the same status, checks are sorted by severity.
        """
        return (self.status.order, get_check_severity(self.check))

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
