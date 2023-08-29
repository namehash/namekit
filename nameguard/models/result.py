from pydantic import BaseModel
from enum import Enum

from nameguard.models.checks import GenericCheckResult, Rating


class NameStatus(str, Enum):
    NORMALIZED = 'normalized'
    UNNORMALIZED = 'unnormalized'
    UNKNOWN = 'unknown'


class NameGuardSummary(BaseModel):
    rating: Rating
    risk_count: int


class GraphemeGuardResult(BaseModel):
    grapheme: str
    summary: NameGuardSummary
    checks: list[GenericCheckResult]


class LabelGuardResult(BaseModel):
    label: str
    status: NameStatus
    summary: NameGuardSummary
    checks: list[GenericCheckResult]
    graphemes: list[GraphemeGuardResult]


class NameGuardQuickResult(BaseModel):
    name: str
    namehash: str
    status: NameStatus
    summary: NameGuardSummary


class NameGuardResult(NameGuardQuickResult):
    checks: list[GenericCheckResult]
    labels: list[LabelGuardResult]


class NameGuardBulkResult(BaseModel):
    results: list[NameGuardQuickResult]
