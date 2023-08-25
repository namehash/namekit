from pydantic import BaseModel
from enum import Enum


class Rating(Enum):
    UNKNOWN = 0
    GREEN = 1
    YELLOW = 2
    RED = 3


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
