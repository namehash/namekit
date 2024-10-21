from fastapi import HTTPException
from pydantic import BaseModel, Field


class ExceptionResponse(BaseModel):
    detail: str = Field(
        description='Human-readable description of the error.',
        examples=['This is a human-readable description of the error.'],
    )


class NameGuardException(HTTPException):
    STATUS_CODE = None
    DESCRIPTION = None

    def __init__(self, detail: str = ''):
        super().__init__(self.STATUS_CODE, detail=f'{self.DESCRIPTION} {detail}'.strip())

    @classmethod
    def get_responses_spec(cls):
        return {cls.STATUS_CODE: {'description': cls.DESCRIPTION, 'model': ExceptionResponse}}


class InvalidNameHash(NameGuardException):
    STATUS_CODE = 422
    DESCRIPTION = 'Provided namehash is not valid.'


class InvalidTokenID(NameGuardException):
    STATUS_CODE = 422
    DESCRIPTION = 'Provided token id is not valid.'


class ENSSubgraphUnavailable(NameGuardException):
    STATUS_CODE = 503
    DESCRIPTION = 'Error while making request to ENS Subgraph.'


class NamehashMismatchError(NameGuardException):
    STATUS_CODE = 500
    DESCRIPTION = 'Namehash calculated on the name returned from ENS Subgraph does not equal the input namehash.'


class NamehashNotFoundInSubgraph(NameGuardException):
    STATUS_CODE = 404
    DESCRIPTION = 'Provided namehash could not be found in ENS Subgraph.'


class NotAGrapheme(NameGuardException):
    STATUS_CODE = 422
    DESCRIPTION = 'The provided string is not a single grapheme.'


class InvalidEthereumAddress(NameGuardException):
    STATUS_CODE = 422
    DESCRIPTION = 'Provided Ethereum address is not valid.'


class ProviderUnavailable(NameGuardException):
    STATUS_CODE = 503
    DESCRIPTION = 'Error while making request to provider.'


class MissingTitle(NameGuardException):
    STATUS_CODE = 422
    DESCRIPTION = "A field named 'title' is required within the list of fields"
