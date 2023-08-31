from typing import Optional
from pydantic import BaseModel
from enum import Enum

from nameguard.models.checks import GenericCheckResult, Rating


class Normalization(str, Enum):
    NORMALIZED = 'normalized'
    UNNORMALIZED = 'unnormalized'
    UNKNOWN = 'unknown'


class RiskSummary(BaseModel):
    rating: Rating
    risk_count: int
    highest_risk: Optional[GenericCheckResult]


class GraphemeGuardResult(BaseModel):
    grapheme: str
    grapheme_name: str
    grapheme_type: str
    summary: RiskSummary
    checks: list[GenericCheckResult]


class LabelGuardResult(BaseModel):
    label: str
    labelhash: str
    normalization: Normalization
    summary: RiskSummary
    checks: list[GenericCheckResult]
    graphemes: list[GraphemeGuardResult]


class NameGuardQuickResult(BaseModel):
    name: str
    namehash: str
    normalization: Normalization
    summary: RiskSummary


class NameGuardResult(NameGuardQuickResult):
    checks: list[GenericCheckResult]
    labels: list[LabelGuardResult]


class NameGuardBulkResult(BaseModel):
    results: list[NameGuardQuickResult]
