from typing import Optional
from pydantic import BaseModel, Field, computed_field
from enum import Enum
from ens_normalize import ens_beautify

from nameguard.context import endpoint_name
from nameguard.models.checks import GenericCheckResult, Rating, Check
from nameguard.utils import detect_grapheme_link_name


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


class ConsolidatedReport(BaseModel):
    '''
    The risk summary of a name, label, or grapheme.
    '''

    rating: Rating

    @computed_field(description='A human-readable title based on the `rating`.')
    @property
    def title(self) -> str:
        if self.rating is Rating.PASS:
            return 'Looks Good'
        elif self.rating is Rating.WARN:
            if (
                self.highest_risk is not None and
                self.highest_risk.check is Check.IMPERSONATION_RISK and
                endpoint_name.get() == 'primary-name'
            ):
                return 'Impersonation Risk'
            else:
                return 'Some Risk'
        else: # self.rating is Rating.ALERT:
            if endpoint_name.get() == 'fake-ens-name-check':
                return 'Fake ENS Name'
            else:
                return 'High Risk'

    @computed_field(description='A human-readable subtitle based on the `rating`.')
    @property
    def subtitle(self) -> str:
        if self.rating is Rating.PASS:
            return 'All security checks passed!'
        elif self.rating is Rating.WARN:
            return 'Review risks before proceeding'
        else: # self.rating is Rating.ALERT:
            return f'Better not to use this {self._string_value}'

    risk_count: int = Field(
        description='The number of checks that have a status of `alert` or `warn`.')

    highest_risk: Optional[GenericCheckResult] = Field(
        description='The check considered to be the highest risk. If no check has a status of `alert` or `warn`, this field is `null`.')

    @property
    def _string_type(self) -> str:
        raise NotImplementedError

    @property
    def _string_value(self) -> str:
        raise NotImplementedError


class ConsolidatedGraphemeGuardReport(ConsolidatedReport):
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

    grapheme_description: str = Field(description="Description of the grapheme type.")

    @property
    def _string_type(self) -> str:
        return 'grapheme'

    @property
    def _string_value(self) -> str:
        return self.grapheme


class LabelGuardReport(ConsolidatedReport):
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

    @computed_field(description='Beautified version of `label`.')
    @property
    def beautiful_label(self) -> Optional[str]:
        return ens_beautify(self.label) if self.normalization is Normalization.NORMALIZED else None

    checks: list[GenericCheckResult] = Field(
        description='A list of checks that were performed on the label.',
    )

    graphemes: Optional[list[ConsolidatedGraphemeGuardReport]] = Field(
        description='A list of graphemes that were analyzed in the label. If the label is unknown, this field is `null`.',
    )

    canonical_label: Optional[str] = Field(
        description='The canonical form of the analyzed label.\n'
                    '* `null` if the canonical form of any grapheme is not known\n'
                    '* `null` if the result would be unnormalized, even if the canonical form of all graphemes is known\n'
                    '* `[labelhash]` if the label is unknown',
    )

    @property
    def _string_type(self) -> str:
        return 'label'

    @property
    def _string_value(self) -> str:
        return self.label


class ConsolidatedNameGuardReport(ConsolidatedReport):
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

    @computed_field(description='Beautified version of `name`.')
    @property
    def beautiful_name(self) -> Optional[str]:
        return ens_beautify(self.name) if self.normalization is Normalization.NORMALIZED else None

    @property
    def _string_type(self) -> str:
        return 'name'

    @property
    def _string_value(self) -> str:
        return self.name


class NameGuardReport(ConsolidatedNameGuardReport):
    '''
    Full name analysis result with information about individual checks and labels.
    '''

    checks: list[GenericCheckResult] = Field(
        description='A list of checks that were performed on the name.',
    )

    labels: list[LabelGuardReport] = Field(
        description='The analyzed labels of the name.',
    )

    canonical_name: Optional[str] = Field(
        description='The canonical form of the analyzed name.\n'
                    '* `null` if the canonical form of any label is not known\n'
                    '* `can contain labelhashes when some labels are unknown`',
    )


class BulkNameGuardBulkReport(BaseModel):
    '''
    Bulk name analysis results.
    '''

    results: list[ConsolidatedNameGuardReport]


class GraphemeGuardReport(ConsolidatedGraphemeGuardReport):
    checks: list[GenericCheckResult] = Field(
        description='A list of checks that were performed on the grapheme.')

    grapheme_link: Optional[str] = Field(
        description="Link to an external page with information about the grapheme.\n"
                    "* `null` for multi-character graphemes")

    @computed_field(description='The name of the webpage that `grapheme_link` links to.\n'
                                '* "No link is available" if `grapheme_link` is `null`')
    @property
    def grapheme_link_name(self) -> str:
        if self.grapheme_link is None:
            return 'No link is available'
        else:
            return detect_grapheme_link_name(self.grapheme_link)

    @computed_field(description='The codepoints of the grapheme in the format `U+XXXX`. '
                                'Some graphemes may have multiple codepoints.')
    @property
    def codepoints(self) -> list[str]:
        return [f'U+{ord(c):04X}' for c in self.grapheme]

    confusables: list[ConsolidatedGraphemeGuardReport] = Field(
        description='A list graphemes that can be confused with the analyzed grapheme. '
                    'The list does not contain the analyzed grapheme. '
                    'A canonical form of the grapheme is the first element of the list, if it is known. '
                    'Otherwise, the first element is a different confusable.')

    canonical_grapheme: Optional[str] = Field(
        description='A grapheme that is the canonical form of the analyzed grapheme.\n'
                    '* `null` if the canonical form is not known\n'
                    '* does not imply that the canonical grapheme/label/name is normalized')


class SecureReverseLookupStatus(str, Enum):
    '''
    The reverse lookup status of an Ethereum address.

    * `normalized`: ENS primary name was found and it is normalized.
    * `no_primary_name`: ENS primary name was not found.
    * `unnormalized`: ENS primary name was found, but it is not normalized.
    '''

    NORMALIZED = 'normalized'
    NO_PRIMARY_NAME = 'no_primary_name'
    UNNORMALIZED = 'unnormalized'

class ImpersonationStatus(str, Enum):
    """
    The predicted impersonation status of an ENS name.
    
    * `unlikely`: The ENS name is unlikely to be impersonating.
    * `potential`: The ENS name is potentially impersonating.
    """
    UNLIKELY = 'unlikely'
    POTENTIAL = 'potential'

class SecureReverseLookupResult(BaseModel):
    '''
    Reverse lookup result.
    '''
    primary_name_status: SecureReverseLookupStatus
    
    impersonation_status: Optional[ImpersonationStatus] = Field(
        description='Impersonation status of the `primary_name`.\n'
                    '* `null` if primary name is unknown or primary name is unnormalized',
    )

    primary_name: Optional[str] = Field(
        description='Primary ENS name for the Ethereum address.\n'
                    '* `null` if `primary_name_status` is any value except `normalized`',
    )

    display_name: str = Field(
        description='ENS beautified version of `primary_name`.\n'
                    '* if `primary_name` is `null` then provides a fallback `display_name` of "Unnamed [first four hex digits of Ethereum address]", e.g. "Unnamed C2A6"',
    )

    nameguard_result: Optional[NameGuardReport] = Field(description='NameGuard report for the `primary_name`.\n'
                                                                    '* `null` if `primary_name_status` is `no_primary_name` (primary name is not found)')


class FakeEthNameCheckStatus(str, Enum):
    '''
    * `authentic_eth_name` The NFT is associated with authentic ".eth" contracts.
    * `impersonated_eth_name` The NFT appears to impersonate a ".eth" name. It doesn't belong to authentic ENS contracts but contains graphemes that visually resemble ".eth" at the end of relevant NFT metadata fields. Consider automated rejection of this NFT from marketplaces.
    * `potentially_impersonated_eth_name` The NFT potentially impersonates a ".eth" name. It doesn't belong to authentic ENS contracts but contains graphemes that visually resemble ".eth" within relevant NFT metadata fields (but not at the end of those fields). Consider manual review of this NFT before publishing to marketplaces.
    * `non_impersonated_eth_name` The NFT doesn't represent itself as a ".eth" name and doesn't belong to authentic ENS contracts. No string that visually resembles ".eth" was found within relevant NFT metadata fields.
    * `unknown_nft`: No information could be found on the requested NFT. This generally indicates that the NFT doesn't exist or hasn't been indexed yet.
    * `invalid_eth_name`: The NFT is associated with authentic ".eth" contracts, but it is unnormalized.
    * `potentially_authentic_eth_name`: The NFT is associated with authentic ".eth" contracts, but its label is unknown.
    * `unknown_eth_name`: The NFT is associated with authentic ".eth" contracts, but its label is unknown or has never been registered.
    '''

    AUTHENTIC_ETH_NAME = 'authentic_eth_name'
    IMPERSONATED_ETH_NAME = 'impersonated_eth_name'
    POTENTIALLY_IMPERSONATED_ETH_NAME = 'potentially_impersonated_eth_name'
    NON_IMPERSONATED_ETH_NAME = 'non_impersonated_eth_name'
    UNKNOWN_NFT = 'unknown_nft'
    INVALID_ETH_NAME = 'invalid_eth_name'
    UNKNOWN_ETH_NAME = 'unknown_eth_name'

class FakeEthNameCheckResult(BaseModel):
    """
    Fake .eth ENS name check result.
    """
    status: FakeEthNameCheckStatus
    
    nameguard_result: Optional[NameGuardReport] = Field(description='NameGuard report for the .eth ENS NFT.\n'
                                                        '* `null` if `status` is any value except `authentic_eth_name`, `invalid_eth_name` and `unknown_eth_name` (the NFT is not associated with authentic ".eth" contracts)')
    
    investigated_fields: Optional[dict[str,str]] = Field(description='Fields with values from Alchemy response which are investigated (e.g. title, collection name, metadata) whether they look like fake .eth ENS name.\n'
                                                                    '* `null` if `status` is `unknown_nft`')