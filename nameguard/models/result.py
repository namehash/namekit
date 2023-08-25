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


class NameGuardResult(BaseModel):
    metadata: NameMetadata
    summary: NameGuardSummary
    check_results: list[GenericCheckResult]
