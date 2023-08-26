from typing import Optional
from pydantic import BaseModel
from enum import Enum

from nameguard.models.checks import GenericCheckResult, Rating


class NameStatus(str, Enum):
    NORMALIZED = 'normalized'
    UNNORMALIZED = 'unnormalized'
    UNKNOWN = 'unknown'


class NameMetadata(BaseModel):
    name: str
    namehash: str
    status: NameStatus


class NameGuardSummary(BaseModel):
    rating: Rating
    risk_count: int


class GraphemeGuardResult(BaseModel):
    grapheme: str
    checks: list[GenericCheckResult]


class LabelGuardResult(BaseModel):
    label: str
    checks: list[GenericCheckResult]
    graphemes: list[GraphemeGuardResult]


class NameGuardResult(BaseModel):
    metadata: NameMetadata
    summary: NameGuardSummary
    checks: list[GenericCheckResult]
    labels: Optional[list[LabelGuardResult]]


class NameGuardBulkResult(BaseModel):
    results: list[NameGuardResult]
