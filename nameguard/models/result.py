from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum

from nameguard.models.checks import GenericCheckResult, Rating


class Normalization(str, Enum):
    '''
    The ENSIP-15 normalization status of a name or label.

    * `normalized`: The name or label is normalized.
    * `unnormalized`: The name or label is not normalized.
    * `unknown`: The name or label is unknown because it cannot be looked up from its hash.
    '''

    NORMALIZED = 'normalized'
    UNNORMALIZED = 'unnormalized'
    UNKNOWN = 'unknown'


class RiskSummary(BaseModel):
    '''
    The risk summary of a name or label.
    '''

    rating: Rating

    risk_count: int = Field(
        description='The number of checks that have a status of `ALERT` or `WARN`.')

    highest_risk: Optional[GenericCheckResult] = Field(
        description='The check considered to be the highest risk. If no check has a status of `ALERT` or `WARN`, this field is `None`.')


class GraphemeGuardResult(BaseModel):
    '''
    Grapheme analysis result.
    '''

    grapheme: str = Field(
        description='The analyzed grapheme.')

    grapheme_name: str = Field(
        description='The name of the grapheme.')

    grapheme_type: str = Field(
        description='The type of the grapheme. If all characters in the grapheme have the same type, that type is returned. Otherwise, `special` is returned.\n'
            '* `simple_letter` - `[a-z]`\n'
            '* `simple_number` - `[0-9]`\n'
            '* `other_letter` - a letter (single-char grapheme) in any script that is not simple; `LC` class http://www.unicode.org/reports/tr44/#GC_Values_Table \n'
            '* `other_number` - a digit (single-char grapheme) in any script that is not simple; `N` class http://www.unicode.org/reports/tr44/#GC_Values_Table \n'
            '* `hyphen` - a hyphen\n'
            '* `dollarsign` - a dollar sign\n'
            '* `underscore` - an underscore\n'
            '* `emoji` - an emoji or emoji ZWJ sequence\n'
            '* `invisible` - zero width joiner or non-joiner\n'
            '* `special` - for any grapheme that doesn\'t match one of the other classifications or if characters have different types'
    )

    grapheme_script: str = Field(
        description='Script name of the grapheme computed from the script names of its characters.')

    grapheme_link: Optional[str] = Field(
        description="Link to an external page with information about the grapheme.\n"
                    "* `null` for multi-character graphemes")

    summary: RiskSummary


class LabelGuardResult(BaseModel):
    '''
    Label analysis result.
    '''

    label: str = Field(
        description='The analyzed label. If the label is unknown, this field is `[labelhash]`.',
        examples=['nick', '[99b91f5ec34a22cf0fb21c9f43be6c6417d9991e979c1dca532a8e74d1feec23]'],
    )

    labelhash: str = Field(
        description='The labelhash of the label in hex format prefixed with `0x`.',
        examples=['0x99b91f5ec34a22cf0fb21c9f43be6c6417d9991e979c1dca532a8e74d1feec23'],
    )

    normalization: Normalization

    summary: RiskSummary

    checks: list[GenericCheckResult] = Field(
        description='A list of checks that were performed on the label.',
    )

    graphemes: Optional[list[GraphemeGuardResult]] = Field(
        description='A list of graphemes that were analyzed in the label. If the label is unknown, this field is `None`.',
    )


class NameGuardQuickResult(BaseModel):
    '''
    Name analysis result without information about individual checks and labels.
    '''

    name: str = Field(
        description='The analyzed name. Can contain labelhashes when some labels are unknown.',
        examples=['vitalik.eth', '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth'],
    )

    namehash: str = Field(
        description='The namehash of the name in hex format prefixed with `0x`.',
        examples=['0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835'],
    )

    normalization: Normalization

    summary: RiskSummary


class NameGuardResult(NameGuardQuickResult):
    '''
    Full name analysis result with information about individual checks and labels.
    '''

    checks: list[GenericCheckResult] = Field(
        description='A list of checks that were performed on the name.',
    )

    labels: list[LabelGuardResult] = Field(
        description='The analyzed labels of the name.',
    )


class NameGuardBulkResult(BaseModel):
    '''
    Bulk name analysis results.
    '''

    results: list[NameGuardQuickResult]


class GraphemeGuardDetailedResult(GraphemeGuardResult):
    checks: list[GenericCheckResult] = Field(
        description='A list of checks that were performed on the grapheme.')

    confusables: list[GraphemeGuardResult] = Field(
        description='A list graphemes that can be confused with the analyzed grapheme.')

    canonical_confusable: Optional[GraphemeGuardResult] = Field(
        description='A grapheme that is the canonical form of the analyzed grapheme.\n'
                    '* `null` if the canonical form is not known')


class ReverseLookupStatus(str, Enum):
    '''
    The reverse lookup status of Ethereum address.

    * `NORMALIZED`: ENS primary name was found and it is normalized.
    * `NO_PRIMARY_NAME_FOUND`: ENS primary name was not found.
    * `PRIMARY_NAME_FOUND_BUT_UNNORMALIZED`: ENS primary name was found, but it is not normalized.
    '''

    NORMALIZED = 'NORMALIZED'
    NO_PRIMARY_NAME_FOUND = 'NO_PRIMARY_NAME_FOUND'
    PRIMARY_NAME_FOUND_BUT_UNNORMALIZED = 'PRIMARY_NAME_FOUND_BUT_UNNORMALIZED'


class ReverseLookupResult(BaseModel):
    '''
    Reverse lookup result.
    '''
    primary_name_status: ReverseLookupStatus
    
    primary_name: Optional[str] = Field(
        description='Primary ENS name for the Ethereum address.'
                    '* `null` if primary name was not found or is unnormalized ',
    )
    
    display_name: str = Field(
        description='ENS beautified version of the primary name\n'
                    'if primary name was not found or is unnormalized then "Unnamed [first four digits of Ethereum address]", e.g. "Unnamed C2A6"',
    )
    
    nameguard_result: Optional[NameGuardResult]


class FakeENSCheckStatus(str, Enum):
    '''
    * `authentic_ens_name` Authentic ENS Name
    * `impersonated_ens_name` Impersonated ENS Name
    * `potentially_impersonated_ens_name` Potentially Impersonated ENS Name (`.eth` inside of a string)
    * `non_impersonated_ens_name` Non-Impersonated ENS Name (this is the case of an NFT / collection that isn't named in a way like a `.eth` name)
    * `unknown_nft`: Unknown NFT (this is the case where you can't get any info from Alchemy on the NFT / collection)
    '''

    AUTHENTIC_ENS_NAME = 'authentic_ens_name'
    IMPERSONATED_ENS_NAME = 'impersonated_ens_name'
    POTENTIALLY_IMPERSONATED_ENS_NAME = 'potentially_impersonated_ens_name'
    NON_IMPERSONATED_ENS_NAME = 'non_impersonated_ens_name'
    UNKNOWN_NFT = 'unknown_nft'
