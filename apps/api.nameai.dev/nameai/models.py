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
    probability: float = Field(
        description='The probability that this label represents a meaningful word or phrase in natural language, based on statistical language models. Higher values indicate the label is more likely to be meaningful text rather than random characters.',
        ge=0.0,
        le=1.0,
    )
    log_probability: float = Field(
        description='The natural logarithm of the probability score. Log probabilities are often more useful for comparing labels since they convert multiplicative relationships to additive ones and better handle very small probabilities.',
        le=0.0,
    )
    word_count: int = Field(
        description='The minimum number of words across all valid tokenizations of the label that contain no gaps. '
        'Will be 0 if no valid tokenization without gaps is found. For example, labels containing only '
        'numbers or special characters may have a word_count of 0.'
        'Note: this is not the number of words in the top_tokenization, but the minimum number of words across all valid tokenizations without gaps.',
        ge=0,
    )
    top_tokenization: Optional[list[str]] = Field(
        description="The recommended tokenization of the label into words. We give priority to tokenizations that don't have gaps and have fewer words, even if they are less probable. Will be None if: "
        'no valid tokenization is found, or the label is not normalized, or the tokenization process was interrupted by recursion limit, or word_count is 0. '
        'When present, this contains the tokens from the tokenization with the fewest words (and highest probability among ties) that has no gaps.'
    )
    tokenizations: list[dict] = Field(
        description='Up to 1000 possible tokenizations of the label, ordered by probability from highest to lowest. Each dict '
        'contains the tokenization and its probability score. Will be an empty list if no valid '
        'tokenizations are found. For very long or complex labels, not all possible tokenizations may be included.'
    )


class NameAIReport(BaseModel):
    purity_score: float = Field(
        title='Purity score of the input',
        description='Score indicating the purity/cleanliness of the name. For single labels, returns the score directly. For 2-label names (e.g., "nick.eth"), returns the score for the first label ("nick"). For 3 or more labels, returns 0. If the label is not inspected, this field will be 0. The score ranges from 0.0 to 1.0 inclusive, where 0.0 indicates lowest purity and 1.0 indicates highest purity.',
        ge=0.0,
        le=1.0,
    )
    sort_score: float = Field(
        title='Sort score of the input',
        description='Score indicating how interesting/memorable the name is. For single labels, returns the score directly. For 2-label names (e.g., "nick.eth"), returns the score for the first label ("nick"). For 3 or more labels, returns 0. If the label is not inspected, this field will be 0. The score ranges from 0.0 to 1.0 inclusive, where 0.0 indicates least interesting and 1.0 indicates most interesting.',
        ge=0.0,
        le=1.0,
    )
    analysis: Optional[NLPLabelAnalysis] = Field(
        description='The result of the NLP analysis on the label. If the label is not inspected, this field will be `None`.'
    )


class NameAIRequest(inspector_models.InspectorSingleRequest):
    pass


class NameAIResponse(BaseModel):
    """
    Represents the combined response from NameAI and NameGuard analyses.
    """

    nameai: NameAIReport = Field(description='The NameAI analysis report on the first label of the input name')
    nameguard: NameGuardReport = Field(description='The NameGuard analysis report')
