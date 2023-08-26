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
    INVISIBLE = 'INVISIBLE'
    NORMALIZED = 'ENS_NORMALIZED'
    CONFUSABLES = 'CONFUSABLES'
    TYPING_DIFFICULTY = 'TYPING_DIFFICULTY'
    MIXED_SCRIPTS = 'MIXED_SCRIPTS'
    PUNYCODE = 'PUNYCODE'
    NAMEWRAPPER = 'NAMEWRAPPER'
    FONT_SUPPORT = 'FONT_SUPPORT'


class GenericCheckResult(BaseModel):
    name: CheckName
    rating: Rating
    severity: int
    message: str

    def __repr__(self):
        return f'{self.__class__.__name__}({self.rating.name})'

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
