from typing import Optional
from pydantic import BaseModel, Field
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
    grapheme_script: str
    grapheme_link: Optional[str]
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
    name: Optional[str] = Field(
        description='The analyzed name. If the name is unknown, this field is `None`.',
        examples=['vitalik.eth'],
    )
    
    namehash: str = Field(
        description='The namehash of the name in hex format.',
        examples=['0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'],
    )

    normalization: Normalization = Field(
        description='The normalization status of the name.',
    )

    summary: RiskSummary = Field(
        description='The risk summary of the name.',
    )


class NameGuardResult(NameGuardQuickResult):
    checks: list[GenericCheckResult] = Field(
        description='A list of checks that were performed on the name.',
    )

    labels: Optional[list[LabelGuardResult]] = Field(
        description='The analyzed labels of the name. If the name is unknown, this field is `None`.',
    )


class NameGuardBulkResult(BaseModel):
    results: list[NameGuardQuickResult]
