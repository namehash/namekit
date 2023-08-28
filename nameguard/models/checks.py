from pydantic import BaseModel
from enum import Enum


class Rating(str, Enum):
    UNKNOWN = 'UNKNOWN'
    GREEN = 'GREEN'
    YELLOW = 'YELLOW'
    RED = 'RED'

    @property
    def order(self):
        return {
            Rating.UNKNOWN: 0,
            Rating.GREEN: 1,
            Rating.YELLOW: 2,
            Rating.RED: 3,
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


class CheckName(str, Enum):
    # Grapheme
    CONFUSABLES = 'CONFUSABLES'
    INVISIBLE = 'INVISIBLE'
    TYPING_DIFFICULTY = 'TYPING_DIFFICULTY'

    # Label
    FONT_SUPPORT = 'FONT_SUPPORT'
    MIXED_SCRIPTS = 'MIXED_SCRIPTS'
    NAMEWRAPPER = 'NAMEWRAPPER'
    NORMALIZED = 'NORMALIZED'
    PUNYCODE = 'PUNYCODE'

    # Name
    PUNYCODE_NAME = 'PUNYCODE_NAME'


class GenericCheckResult(BaseModel):
    name: CheckName
    rating: Rating
    severity: int
    message: str

    def __repr__(self):
        return f'{self.name}({self.rating.name})'

    @property
    def order(self):
        return (self.rating.order, self.severity)

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
