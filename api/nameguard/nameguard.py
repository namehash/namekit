import os
import re
from typing import Union

from nameguard.models.checks import UNINSPECTED_CHECK_RESULT
from nameguard.models.result import UninspectedNameGuardReport
from nameguard.our_ens import OurENS
from ens_normalize import is_ens_normalized, ens_cure, DisallowedSequence, ens_process

import requests
from label_inspector.inspector import Inspector
from label_inspector.config import initialize_inspector_config
from label_inspector.models import InspectorConfusableGraphemeResult
from web3 import HTTPProvider
from dotenv import load_dotenv

from nameguard import checks
from nameguard.models import (
    CheckStatus,
    Check,
    NameGuardReport,
    LabelGuardReport,
    ConsolidatedGraphemeGuardReport,
    BulkNameGuardBulkReport,
    Normalization,
    GraphemeNormalization,
    GraphemeGuardReport,
    NetworkName,
    SecurePrimaryNameResult,
    SecurePrimaryNameStatus,
    FakeEthNameCheckStatus,
    FakeEthNameCheckResult,
    ImpersonationStatus,
    ConsolidatedNameGuardReport,
    Rating,
    ConfusableGuardReport,
)
from nameguard.provider import get_nft_metadata
from nameguard.utils import (
    namehash_from_name,
    labelhash_from_label,
    calculate_nameguard_rating,
    count_risks,
    agg_checks,
    get_highest_risk,
    label_is_labelhash,
    compute_canonical_from_list,
    is_labelhash_eth,
    MAX_INSPECTED_NAME_CHARACTERS,
    labelhash_in_name,
)
from nameguard.exceptions import ProviderUnavailable, NotAGrapheme, MissingTitle
from nameguard.logging import logger
from nameguard.subgraph import (
    namehash_to_name_lookup,
    resolve_all_labelhashes_in_name_querying_labelhashes,
    resolve_all_labelhashes_in_names_querying_labelhashes,
)
from nameguard.generic_utils import capitalize_words

DNA_CHECKS = [
    (checks.dna.normalized.check_grapheme, checks.dna.normalized.check_label, checks.dna.normalized.check_name),
    (None, checks.dna.punycode.check_label, checks.dna.punycode.check_name),
]

GRAPHEME_CHECKS = [
    checks.grapheme.confusables.check_grapheme,
    checks.grapheme.font_support.check_grapheme,
    checks.grapheme.invisible.check_grapheme,
    checks.grapheme.typing_difficulty.check_grapheme,
]

LABEL_CHECKS = [
    checks.label.mixed_scripts.check_label,
    checks.label.namewrapper.check_label,
    checks.label.unknown.check_label,
]

NAME_CHECKS = [
    checks.name.impersonation_risk.check_name,
    checks.name.namewrapper_fuses.check_name,
    checks.name.decentralized_name.check_name,
]


def init_inspector():
    with initialize_inspector_config('prod_config') as config:
        if os.getenv('AWS_LAMBDA_INITIALIZATION_TYPE', None) == 'provisioned-concurrency':
            config.inspector.lazy_loading = False
        return Inspector(config)


ens_contract_adresses = {
    '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',  # Base Registrar
    '0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401',  # Name Wrapper
}

ALCHEMY_UNKNOWN_NAME = re.compile('^\[0x[0-9a-f]{4}\.\.\.[0-9a-f]{4}\]\.eth$')


def nested_get(dic, keys):
    for key in keys:
        dic = dic[key]
    return dic


SIMPLE_NAME_REGEX = re.compile(r'^[a-z0-9]{1,63}\.eth$')  # 63 label length limit comes from Punycode


def simple_name(name: str) -> bool:
    return SIMPLE_NAME_REGEX.match(name) is not None


def consolidated_report_from_simple_name(name: str) -> ConsolidatedNameGuardReport:
    return ConsolidatedNameGuardReport(
        name=name,
        namehash=namehash_from_name(name),
        normalization=Normalization.NORMALIZED,
        rating=Rating.PASS,
        risk_count=0,
        highest_risk=None,
        inspected=True,
    )


Uninspected_name_checks = [
    UNINSPECTED_CHECK_RESULT,
    checks.dna.normalized.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.dna.punycode.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.grapheme.confusables.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.grapheme.font_support.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.grapheme.invisible.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.grapheme.typing_difficulty.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.label.mixed_scripts.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.label.namewrapper.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.label.unknown.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.name.decentralized_name.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.name.impersonation_risk.UNINSPECTED_SKIP_CHECK_RESULT,
    checks.name.namewrapper_fuses.UNINSPECTED_SKIP_CHECK_RESULT,
]


def consolidated_report_from_uninspected_name(name: str) -> UninspectedNameGuardReport:
    res = ens_process(name, do_normalize=True, do_beautify=True)
    beautified = res.beautified
    normalized = name == res.normalized

    return UninspectedNameGuardReport(
        name=name,
        namehash=namehash_from_name(name),
        normalization=Normalization.UNKNOWN
        if labelhash_in_name(name)
        else Normalization.NORMALIZED
        if normalized
        else Normalization.UNNORMALIZED,
        rating=Rating.ALERT,
        risk_count=1,
        highest_risk=UNINSPECTED_CHECK_RESULT,
        beautiful_name=beautified,  # TODO computed twice
        checks=Uninspected_name_checks,
        labels=None,
        canonical_name=None,
        inspected=False,
    )


class NameGuard:
    def __init__(self):
        self._inspector = init_inspector()
        load_dotenv()
        # TODO use web sockets and async
        self.ns = {}
        for network_name, env_var in (
            (NetworkName.MAINNET, 'PROVIDER_URI_MAINNET'),
            (NetworkName.SEPOLIA, 'PROVIDER_URI_SEPOLIA'),
        ):
            if os.environ.get(env_var) is None:
                logger.warning(f'Environment variable {env_var} is not set')
            self.ns[network_name] = OurENS(HTTPProvider(os.environ.get(env_var)))

        # optimization
        self.eth_label = self._inspector.analyse_label('eth', simple_confusables=True, omit_cure=True)

    def analyse_label(self, label: str):
        if label == 'eth':
            return self.eth_label
        return self._inspector.analyse_label(label, simple_confusables=True, omit_cure=True)

    async def inspect_name(
        self, network_name: NetworkName, name: str, resolve_labelhashes: bool = True, bulk_mode: bool = False
    ) -> Union[NameGuardReport, ConsolidatedNameGuardReport]:
        """
        Inspect a name. A name is a sequence of labels separated by dots.
        A label can be a labelhash or a string.
        If a labelhash is encountered and `resolve_labelhashes` is `True`, a lookup will be performed.
        Returns UninspectedNameGuardReport if name was exceptionally long and was not inspected for performance reasons.
        """

        logger.debug(f"[inspect_name] name: '{name}'")

        if resolve_labelhashes:
            resolved_name = await resolve_all_labelhashes_in_name_querying_labelhashes(network_name, name)
            if resolved_name is None:
                return consolidated_report_from_uninspected_name(name)
            name = resolved_name
        return self.inspect_name_sync(name, bulk_mode)

    def inspect_name_sync(
        self, name: str, bulk_mode: bool = False
    ) -> Union[NameGuardReport, ConsolidatedNameGuardReport]:
        """
        Inspect a name. A name is a sequence of labels separated by dots.
        A label can be a labelhash or a string.
        If a labelhash is encountered, it will be treated as an unknown label.
        """

        logger.debug(f"[inspect_name] name: '{name}'")

        if len(name) > MAX_INSPECTED_NAME_CHARACTERS:
            return consolidated_report_from_uninspected_name(name)

        if bulk_mode and simple_name(name):
            return consolidated_report_from_simple_name(name)

        labels = [] if len(name) == 0 else name.split('.')
        logger.debug(f'[inspect_name] labels: {labels}')

        # labelhashes have `None` as their analysis
        labels_analysis = [
            self.analyse_label(label)
            # do not analyze labelhashes
            if not label_is_labelhash(label)
            else None
            for label in labels
        ]

        # -- check individual entities --

        # checks for each grapheme in each label
        labels_graphemes_checks = [
            [[check(grapheme) for check in GRAPHEME_CHECKS] for grapheme in label_analysis.graphemes]
            if label_analysis is not None
            else []
            # label has [] graphemes if it's a labelhash
            for label_analysis in labels_analysis
        ]

        # checks for each label
        labels_checks = [
            [check(label_analysis) for check in LABEL_CHECKS]
            # checks have to handle labelhashes
            for label_analysis in labels_analysis
        ]

        # checks for the whole name
        name_checks = [check(labels_analysis) for check in NAME_CHECKS]

        # -- aggregate results --

        # merge grapheme checks into label checks
        for label_i, label_graphemes_checks in enumerate(labels_graphemes_checks):
            for grapheme_checks in label_graphemes_checks:
                labels_checks[label_i].extend([c.raise_context() for c in grapheme_checks])
            labels_checks[label_i] = agg_checks(labels_checks[label_i])

        # merge label checks into name checks
        for label_checks in labels_checks:
            name_checks.extend([c.raise_context() for c in label_checks])
        name_checks = agg_checks(name_checks)

        # -- DNA checks --

        for check_g, check_l, check_n in DNA_CHECKS:
            for label_i, label_analysis in enumerate(labels_analysis):
                if label_analysis is not None:
                    if check_g:
                        for grapheme_i, grapheme in enumerate(label_analysis.graphemes):
                            labels_graphemes_checks[label_i][grapheme_i].append(check_g(grapheme))
                labels_checks[label_i].append(check_l(label_analysis))
            name_checks.append(check_n(labels_analysis))

        # -- generate result --

        return NameGuardReport(
            name=name,
            namehash=namehash_from_name(name),
            normalization=Normalization.UNKNOWN
            if any(label_analysis is None for label_analysis in labels_analysis)
            else Normalization.NORMALIZED
            if all(
                label_analysis.status == 'normalized' and len(label_analysis.label) > 0
                for label_analysis in labels_analysis
            )
            else Normalization.UNNORMALIZED,
            rating=calculate_nameguard_rating(name_checks),
            risk_count=count_risks(name_checks),
            highest_risk=get_highest_risk(name_checks),
            checks=sorted(name_checks, reverse=True),
            canonical_name=compute_canonical_from_list(
                [
                    label_analysis.normalized_canonical_label if label_analysis is not None else labels[i]  # labelhash
                    for i, label_analysis in enumerate(labels_analysis)
                ],
                sep='.',
            ),
            labels=[
                LabelGuardReport(
                    # actual label or [labelhash]
                    label=label,
                    labelhash=labelhash_from_label(label_analysis.label)
                    if label_analysis is not None
                    else '0x' + label[1:-1],
                    normalization=Normalization.UNKNOWN
                    if label_analysis is None
                    else Normalization.NORMALIZED
                    if label_analysis.status == 'normalized' and len(label_analysis.label) > 0
                    else Normalization.UNNORMALIZED,
                    rating=calculate_nameguard_rating(label_checks),
                    risk_count=count_risks(label_checks),
                    highest_risk=get_highest_risk(label_checks),
                    checks=sorted(label_checks, reverse=True),
                    canonical_label=label_analysis.normalized_canonical_label
                    if label_analysis is not None
                    else label,  # labelhash
                    graphemes=[
                        ConsolidatedGraphemeGuardReport(
                            normalization=GraphemeNormalization.NORMALIZED
                            if any(
                                check.status == CheckStatus.PASS and check.check is Check.NORMALIZED
                                for check in grapheme_checks
                            )
                            else GraphemeNormalization.UNNORMALIZED,
                            grapheme=grapheme.value,
                            grapheme_name=capitalize_words(grapheme.name),
                            grapheme_type=grapheme.type,
                            grapheme_script=grapheme.script,
                            grapheme_link=grapheme.link,
                            rating=calculate_nameguard_rating(grapheme_checks),
                            risk_count=count_risks(grapheme_checks),
                            highest_risk=get_highest_risk(grapheme_checks),
                            grapheme_description=grapheme.description,
                            unicode_version=grapheme.unicode_version,
                        )
                        for grapheme, grapheme_checks in zip(label_analysis.graphemes, label_graphemes_checks)
                    ]
                    if label_analysis is not None
                    else None,
                )
                for label, label_analysis, label_checks, label_graphemes_checks in zip(
                    labels,
                    labels_analysis,
                    labels_checks,
                    labels_graphemes_checks,
                )
            ],
            inspected=True,
        )

    async def bulk_inspect_names(self, network_name: NetworkName, names: list[str]) -> BulkNameGuardBulkReport:
        names = await resolve_all_labelhashes_in_names_querying_labelhashes(network_name, names)
        return BulkNameGuardBulkReport(
            results=[
                await self.inspect_name(network_name, name, resolve_labelhashes=False, bulk_mode=True) for name in names
            ],
        )

    async def inspect_namehash(self, network_name: NetworkName, namehash: str) -> NameGuardReport:
        logger.debug(f"[inspect_namehash] namehash: '{namehash}'")
        name = await namehash_to_name_lookup(network_name, namehash)
        return await self.inspect_name(network_name, name)

    async def inspect_name_with_labelhash_lookup(self, network_name: NetworkName, name: str) -> NameGuardReport:
        """
        Inspect a name. A name is a sequence of labels separated by dots.
        A label can be a labelhash or a string.
        If a labelhash is encountered, the entire name will be looked up by its namehash.
        If the namehash is not found, all labelhashes will be treated as unknown labels.
        """

        logger.debug(f"[inspect_name_with_labelhash_lookup] name: '{name}'")

        return await self.inspect_name(network_name, name)

    def inspect_grapheme(self, grapheme: str) -> GraphemeGuardReport:
        """
        Inspect a single grapheme.
        Throws `NotAGrapheme` if the input is not a single grapheme.
        """

        label_analysis = self.analyse_label(grapheme)
        if label_analysis.grapheme_length != 1:
            raise NotAGrapheme(f'The input contains {label_analysis.grapheme_length} graphemes.')

        grapheme_analysis = label_analysis.graphemes[0]
        grapheme_checks = [check(grapheme_analysis) for check in GRAPHEME_CHECKS + [c[0] for c in DNA_CHECKS if c[0]]]

        if grapheme_analysis.confusables_canonical:
            canonical = self._inspect_confusable(grapheme_analysis.confusables_canonical)
            canonical.is_canonical = True
        else:
            canonical = None

        return GraphemeGuardReport(
            normalization=GraphemeNormalization.NORMALIZED
            if any(check.status == CheckStatus.PASS and check.check is Check.NORMALIZED for check in grapheme_checks)
            else GraphemeNormalization.UNNORMALIZED,
            grapheme=grapheme_analysis.value,
            grapheme_name=capitalize_words(grapheme_analysis.name),
            grapheme_type=grapheme_analysis.type,
            grapheme_script=grapheme_analysis.script,
            grapheme_link=grapheme_analysis.link,
            rating=calculate_nameguard_rating(grapheme_checks),
            risk_count=count_risks(grapheme_checks),
            highest_risk=get_highest_risk(grapheme_checks),
            checks=sorted(grapheme_checks, reverse=True),
            confusables=([canonical] if canonical else [])
            + (
                [self._inspect_confusable(c) for c in grapheme_analysis.confusables_other]
                if grapheme_analysis.confusables_other
                else []
            ),
            canonical_grapheme=label_analysis.canonical_label,
            grapheme_description=grapheme_analysis.description,
            unicode_version=grapheme_analysis.unicode_version,
        )

    def _inspect_confusable(self, grapheme: InspectorConfusableGraphemeResult) -> ConfusableGuardReport:
        grapheme_checks = [check(grapheme) for check in GRAPHEME_CHECKS + [c[0] for c in DNA_CHECKS if c[0]]]
        return ConfusableGuardReport(
            normalization=GraphemeNormalization.NORMALIZED
            if any(check.status == CheckStatus.PASS and check.check is Check.NORMALIZED for check in grapheme_checks)
            else GraphemeNormalization.UNNORMALIZED,
            grapheme=grapheme.value,
            grapheme_name=capitalize_words(grapheme.name),
            grapheme_type=grapheme.type,
            grapheme_script=grapheme.script,
            grapheme_link=grapheme.link,
            rating=calculate_nameguard_rating(grapheme_checks),
            risk_count=count_risks(grapheme_checks),
            highest_risk=get_highest_risk(grapheme_checks),
            grapheme_description=grapheme.description,
            unicode_version=grapheme.unicode_version,
            is_canonical=False,
        )

    async def secure_primary_name(self, address: str, network_name: str) -> SecurePrimaryNameResult:
        try:
            domain = self.ns[network_name].name(address)
        except requests.exceptions.ConnectionError as ex:
            raise ProviderUnavailable(f'Communication error with provider occurred: {ex}')
        display_name = f'Unnamed {address[2:6].lower()}'
        primary_name = None
        nameguard_result = None
        if domain is None:
            status = SecurePrimaryNameStatus.NO_PRIMARY_NAME
            impersonation_status = None
        else:
            nameguard_result = await self.inspect_name(network_name, domain)

            if nameguard_result.highest_risk and nameguard_result.highest_risk.check.name == Check.UNINSPECTED.name:
                status = SecurePrimaryNameStatus.UNINSPECTED
                impersonation_status = None
            elif nameguard_result.normalization == Normalization.UNNORMALIZED:
                status = SecurePrimaryNameStatus.UNNORMALIZED
                impersonation_status = None
            else:
                display_name = nameguard_result.beautiful_name
                status = SecurePrimaryNameStatus.NORMALIZED
                primary_name = domain

                impersonation_status = (
                    ImpersonationStatus.UNLIKELY
                    if any(
                        check.check == 'impersonation_risk' and check.status == CheckStatus.PASS
                        for check in nameguard_result.checks
                    )
                    else ImpersonationStatus.POTENTIAL
                )

        return SecurePrimaryNameResult(
            primary_name=primary_name,
            impersonation_status=impersonation_status,
            display_name=display_name,
            primary_name_status=status,
            nameguard_result=nameguard_result,
        )

    async def fake_eth_name_check_fields(
        self, network_name, contract_address, token_id, investigated_fields: dict[str, str]
    ) -> FakeEthNameCheckResult:
        contract_address = contract_address.lower()

        return await self._fake_eth_name_check(network_name, contract_address, investigated_fields)

    async def fake_eth_name_check(self, network_name, contract_address, token_id) -> FakeEthNameCheckResult:
        """
        Check if the token is a fake ENS name (not valid ENS contract address and title and collection name of NFT look like ENS name).
        """
        contract_address = contract_address.lower()

        res_json = await get_nft_metadata(network_name, contract_address, token_id)

        token_type = res_json['id']['tokenMetadata']['tokenType']

        if token_type not in ['ERC721', 'ERC1155'] and contract_address in ens_contract_adresses:
            return FakeEthNameCheckResult(
                status=FakeEthNameCheckStatus.UNKNOWN_NFT, nameguard_result=None, investigated_fields=None
            )
        if token_type == 'NOT_A_CONTRACT':
            return FakeEthNameCheckResult(
                status=FakeEthNameCheckStatus.UNKNOWN_NFT, nameguard_result=None, investigated_fields=None
            )
        elif token_type == 'NO_SUPPORTED_NFT_STANDARD':
            return FakeEthNameCheckResult(
                status=FakeEthNameCheckStatus.UNKNOWN_NFT, nameguard_result=None, investigated_fields=None
            )
        elif token_type not in ['ERC721', 'ERC1155']:  # Alchemy does not support other types
            return FakeEthNameCheckResult(
                status=FakeEthNameCheckStatus.UNKNOWN_NFT, nameguard_result=None, investigated_fields=None
            )

        title = res_json['title']
        investigated_fields = {}
        for keys in [
            ['title'],
            ['metadata', 'name'],
            ['contractMetadata', 'openSea', 'collectionName'],
            ['contractMetadata', 'name'],
        ]:
            try:
                name = nested_get(res_json, keys)
                investigated_fields['.'.join(keys)] = name
            except KeyError:
                pass

        if contract_address in ens_contract_adresses:
            if ALCHEMY_UNKNOWN_NAME.match(title):
                unknown_name = f"[{res_json['id']['tokenId'][2:]}].eth"
                investigated_fields['title'] = unknown_name
            elif title == '':  # the name has never been registered
                investigated_fields['title'] = None

        return await self._fake_eth_name_check(network_name, contract_address, investigated_fields)

    async def _fake_eth_name_check(
        self, network_name, contract_address, fields: dict[str, str]
    ) -> FakeEthNameCheckResult:
        if contract_address in ens_contract_adresses:
            if 'title' not in fields:
                raise MissingTitle()

            title = fields['title']

            if title is None:
                return FakeEthNameCheckResult(
                    status=FakeEthNameCheckStatus.UNKNOWN_NFT, nameguard_result=None, investigated_fields=None
                )
            else:
                if is_labelhash_eth(title):
                    report = await self.inspect_name(network_name, title, resolve_labelhashes=False)
                    return FakeEthNameCheckResult(
                        status=FakeEthNameCheckStatus.UNKNOWN_ETH_NAME,
                        nameguard_result=report,
                        investigated_fields=None,
                    )

                # TODO: check if token_id matches contract_address and title
                report = await self.inspect_name(network_name, title)
                if is_ens_normalized(title):
                    return FakeEthNameCheckResult(
                        status=FakeEthNameCheckStatus.AUTHENTIC_ETH_NAME,
                        nameguard_result=report,
                        investigated_fields=None,
                    )
                else:
                    return FakeEthNameCheckResult(
                        status=FakeEthNameCheckStatus.INVALID_ETH_NAME,
                        nameguard_result=report,
                        investigated_fields=None,
                    )
        else:
            impersonating_fields = {}
            impersonated = False
            potentially_impersonated = False
            for key, name in fields.items():
                try:
                    cured_title = ens_cure(name)  # TODO improve, e.g. remove invisible and then canonicalize
                    inspector_result = self.analyse_label(cured_title)
                    if inspector_result.canonical_label is not None:
                        canonical_name = inspector_result.canonical_label
                    else:
                        canonical_name = cured_title
                except DisallowedSequence:
                    canonical_name = name

                if canonical_name.endswith('.eth'):
                    impersonating_fields[key] = name
                    impersonated = True
                elif '.eth' in canonical_name:
                    impersonating_fields[key] = name
                    potentially_impersonated = True

            if impersonated:
                return FakeEthNameCheckResult(
                    status=FakeEthNameCheckStatus.IMPERSONATED_ETH_NAME,
                    nameguard_result=None,
                    investigated_fields=impersonating_fields,
                )
            elif potentially_impersonated:
                return FakeEthNameCheckResult(
                    status=FakeEthNameCheckStatus.POTENTIALLY_IMPERSONATED_ETH_NAME,
                    nameguard_result=None,
                    investigated_fields=impersonating_fields,
                )
            else:
                return FakeEthNameCheckResult(
                    status=FakeEthNameCheckStatus.NON_IMPERSONATED_ETH_NAME,
                    nameguard_result=None,
                    investigated_fields=None,
                )
