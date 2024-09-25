from typing import Optional
from nameguard.models import CheckStatus, Check, GenericCheckResult, NameCheckResult, UNINSPECTED_SKIP_MESSAGE
from label_inspector.models import InspectorResult

STATUS = CheckStatus.WARN

# title: Decentralized Name
TITLE_PASS = 'Decentralization'
TITLE_FAIL = 'Decentralization'
TITLE_FAIL_UNKNOWN = 'Decentralization'
TITLE_SKIP = 'Decentralization'

MESSAGE_PASS = 'Ownership is decentralized'
MESSAGE_FAIL = 'Ownership is not decentralized'
MESSAGE_FAIL_UNKNOWN = 'Ownership may not be decentralized'

ETH_TLD = 'eth'
DNS_TLD_WHITELIST = {'com', 'net', 'org', 'id', 'io'}


def valid_DNS_tld(label: Optional[str]) -> Optional[bool]:
    """
    Identifies if a label represents a valid TLD in the DNS namespace.
    :param label: the TLD of a name
    :return: True if the label is known to be valid in the DNS namespace. False if the label is
           known to be invalid in the DNS namespace. None if the status of the label is
           unknown in DNS.
    """
    if label == ETH_TLD:
        return False
    elif label == '':
        return True  # DNS root
    elif label in DNS_TLD_WHITELIST:
        return True
    else:
        return None


def namespace_root(labels: list[Optional[str]]) -> str:
    """
    Identifies the namespace root of a name.
    :param labels: The labels of the name to identify the namespace root of.
    :return: `ens` if the namespace root is known to be ENS.
           `dns` if the namespace root is known to be DNS.
           `unknown` if the namespace root is unknown.
    """
    if not labels:
        return 'ens'
    elif len(labels) == 1 and labels[0] == '':
        return 'ens'
    else:
        tld = labels[-1]
        if tld == ETH_TLD:
            return 'ens'
        elif valid_DNS_tld(tld):
            return 'dns'
        else:
            return 'unknown'


def decentralization_status(labels: list[Optional[str]]):
    """
    Identifies the decentralization status of a name.
    :param labels: The labels of the name to identify the decentralization status of.
    :return: `unruggable` if ownership of the name is guaranteed to be decentralized and therefore unruggable.
            `icann` if ownership of the name falls under the jurisdiction of ICANN and therefore is not decentralized.
            `unknown` if the decentralization status of the name is unknown.
    """
    root = namespace_root(labels)
    if root == 'ens':
        if len(labels) > 2:
            return 'unknown'
        else:
            return 'unruggable'
    elif root == 'dns':
        return 'icann'
    elif root == 'unknown':
        return 'unknown'


def check_name(labels: list[Optional[InspectorResult]]) -> GenericCheckResult:
    ds = decentralization_status([label.label if label is not None else None for label in labels])
    if ds == 'unruggable':
        return NameCheckResult(
            check=Check.DECENTRALIZED_NAME,
            status=CheckStatus.PASS,
            _name_message=MESSAGE_PASS,
            _title=TITLE_PASS,
        )
    elif ds == 'icann':
        return NameCheckResult(
            check=Check.DECENTRALIZED_NAME,
            status=CheckStatus.WARN,
            _name_message=MESSAGE_FAIL,
            _title=TITLE_FAIL,
        )
    else:
        return NameCheckResult(
            check=Check.DECENTRALIZED_NAME,
            status=CheckStatus.WARN,
            _name_message=MESSAGE_FAIL_UNKNOWN,
            _title=TITLE_FAIL_UNKNOWN,
        )


UNINSPECTED_SKIP_CHECK_RESULT = NameCheckResult(
    check=Check.DECENTRALIZED_NAME,
    status=CheckStatus.SKIP,
    _name_message=UNINSPECTED_SKIP_MESSAGE,
    _title=TITLE_SKIP,
)
