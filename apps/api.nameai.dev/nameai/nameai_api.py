from fastapi import FastAPI, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from enum import Enum
from nameai.name_ai import NameAI
from nameai.models import NameAIResponse


class ApiVersion(str, Enum):
    V08_BETA = 'v0.8-beta'


app = FastAPI(
    title='NameAI API',
    version=ApiVersion.V08_BETA.value,
    description="""Welcome to NameAI, an extension of NameGuard developed by [NameHash Labs](https://namehashlabs.org) to provide NLP analysis and scoring for Ethereum Name Service (ENS) names.

## Documentation
These documentation pages focus specifically on the NameAI API. For information on the NameGuard Library, SDK, and UI Kit, please refer to the [NameKit GitHub repository](https://github.com/namehash/namekit).

""",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

nrank = NameAI()


# -- inspect-label --


class InspectLabelRequest(BaseModel):
    label: str = Field(
        description='Label to inspect.',
        examples=['vitalìk'],
    )


@app.get(
    '/inspect-label/{label:path}',
    tags=['label'],
    summary='Inspect Label',
)
async def inspect_label_get(
    label: str = Path(
        description='Label to inspect. Should be url-encoded (except when using the Swagger UI).',
        examples=['vitalìk'],
    ),
) -> NameAIResponse:
    """
    ## Inspects a single label with NameRank and NameGuard.

    Returns a `NameRankResponse` including:
    1. A `NameRankReport` with NLP analysis and scoring for the label.
       If the label is not inspected (e.g., due to length issues), the NLP analysis will be undefined.
    2. A `NameGuardReport` with details of all checks performed on the label.

    This endpoint is useful for analyzing individual labels without the context of a full name.
    """
    return nrank.inspect_label(label)


@app.post(
    '/inspect-label',
    tags=['label'],
    summary='Inspect Label',
)
async def inspect_label_post(request: InspectLabelRequest) -> NameAIResponse:
    """
    ## Inspects a single label with NameRank and NameGuard.

    Returns a `NameRankResponse` including:
    1. A `NameRankReport` with NLP analysis and scoring for the label.
       If the label is not inspected (e.g., due to length issues), the NLP analysis will be None.
    2. A `NameGuardReport` with details of all checks performed on the label.

    This endpoint is useful for analyzing individual labels without the context of a full name.
    """
    return nrank.inspect_label(request.label)


@app.get('/inspect-label', include_in_schema=False)
async def inspect_label_empty() -> NameAIResponse:
    return nrank.inspect_label('')


# -- inspect-name --


class InspectNameRequest(BaseModel):
    name: str = Field(
        description='Name to inspect.',
        examples=['vitalìk.eth'],
    )


@app.get(
    '/inspect-name/{name:path}',
    tags=['name'],
    summary='Inspect Name',
)
async def inspect_name_get(
    name: str = Path(
        description='**Name should be url-encoded (except when using the Swagger UI). Name can be empty.**',
        examples=['vitalìk.eth'],
    ),
) -> NameAIResponse:
    """
    ## Inspects a single name with NameRank and NameGuard.

    Returns a `NameRankResponse` including:
    1. A `NameRankReport` with NLP analysis and scoring for the first label of the name.
       If the name is not inspected (e.g., due to length issues), the NLP analysis will be None.
    2. A `NameGuardReport` with details of all checks performed on the name, including:
       - Consolidated checks on labels and graphemes in the name.
       - Details of all labels in the name.
       - A consolidated inspection result of all graphemes in the name.

    For names with multiple labels:
    - If the name has 2 labels (e.g., "nick.eth"), the analysis is performed on the first label ("nick").
    - For 3 or more labels, only the first label is analyzed, but the NameRank scores (purity and sort score) are set to 0.

    This endpoint does not perform automated labelhash resolution.

    If the `name` is uninspected, the `NameGuardReport` component of the `NameRankResponse` will have the `inspected` field equal to `false`.
    """
    return nrank.inspect_name(name)


@app.post(
    '/inspect-name',
    tags=['name'],
    summary='Inspect Name',
)
async def inspect_name_post(request: InspectNameRequest) -> NameAIResponse:
    """
    ## Inspects a single name with NameRank and NameGuard.

    Returns a `NameRankResponse` including:
    1. A `NameRankReport` with NLP analysis and scoring for the first label of the name.
       If the name is not inspected (e.g., due to length issues), the NLP analysis will be None.
    2. A `NameGuardReport` with details of all checks performed on the name, including:
       - Consolidated checks on labels and graphemes in the name.
       - Details of all labels in the name.
       - A consolidated inspection result of all graphemes in the name.

    For names with multiple labels:
    - If the name has 2 labels (e.g., "nick.eth"), the analysis is performed on the first label ("nick").
    - For 3 or more labels, only the first label is analyzed, but the NameRank scores (purity and sort score) are set to 0.

    This endpoint does not perform automated labelhash resolution.

    If the `name` is uninspected, the `NameGuardReport` component of the `NameRankResponse` will have the `inspected` field equal to `false`.
    """
    return nrank.inspect_name(request.name)


@app.get('/inspect-name', include_in_schema=False)
async def inspect_name_empty() -> NameAIResponse:
    return nrank.inspect_name('')
