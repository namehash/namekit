from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional
import label_inspector.models as inspector_models
from nameguard.models import NameGuardReport


class LabelStatus(str, Enum):
    normalized = 'normalized'
    unnormalized = 'unnormalized'
    unknown = 'unknown'


class NLPLabelAnalysis(BaseModel):
    """
    Represents the result of an additional NLP analysis on a label.
    """

    inspection: inspector_models.InspectorResult = Field(description='The result of the label inspection')
    status: LabelStatus = Field(description='The normalization status of the label')
    probability: float = Field(description='The probability of the label')
    log_probability: float = Field(description='The natural logarithm of the probability')
    word_count: int = Field(description='The number of words in the label')
    top_tokenization: Optional[list[str]] = Field(description='The most likely tokenization of the label')
    tokenizations: list[dict] = Field(description='All possible tokenizations of the label')


class NameRankReport(BaseModel):
    purity_score: float = Field(
        title='Purity score of the input',
        description='For single labels, returns the score directly. For 2-label names (e.g., "nick.eth"), returns the score for the first label ("nick"). For 3 or more labels, returns 0. If the label is not inspected, this field will be 0.',
        ge=0.0,
        le=1.0,
    )

    interesting_score: float = Field(
        title='Interesting score of the input',
        description='For single labels, returns the score directly. For 2-label names (e.g., "nick.eth"), returns the score for the first label ("nick"). For 3 or more labels, returns 0. If the label is not inspected, this field will be 0.',
        ge=0.0,
        le=1.0,
    )
    analysis: Optional[NLPLabelAnalysis] = Field(
        description='The result of the NLP analysis on the label. If the label is not inspected, this field will be `None`.'
    )


class NameRankRequest(inspector_models.InspectorSingleRequest):
    pass


class NameRankResponse(BaseModel):
    """
    Represents the combined response from NameRank and NameGuard analyses.
    """

    namerank: NameRankReport = Field(description='The NameRank analysis report on the first label of the input name')
    nameguard: NameGuardReport = Field(description='The NameGuard analysis report')
