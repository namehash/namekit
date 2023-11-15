from typing import Optional
from nameguard.models import CheckStatus, Check, GenericCheckResult, NameCheckResult
from label_inspector.models import InspectorResult

STATUS = CheckStatus.WARN

MESSAGE_PASS = 'This name is decentralized'
MESSAGE_FAIL = 'This name is not decentralized'
MESSAGE_FAIL_UNKNOWN = 'This name may not be decentralized'

ETH_TLD = 'eth'
DNS_TLD_WHITELIST = {"com", "net", "org", "id", "io"}


def valid_DNS_tld(label: Optional[str]) -> Optional[bool]:
    if label == ETH_TLD:
        return False
    elif label == "":
        return True  # DNS root
    elif label in DNS_TLD_WHITELIST:
        return True
    else:
        return None


def namespace_root(labels: list[Optional[str]]) -> str:
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
        )
    elif ds == 'icann':
        return NameCheckResult(
            check=Check.DECENTRALIZED_NAME,
            status=CheckStatus.WARN,
            _name_message=MESSAGE_FAIL,
        )
    else:
        return NameCheckResult(
            check=Check.DECENTRALIZED_NAME,
            status=CheckStatus.WARN,
            _name_message=MESSAGE_FAIL_UNKNOWN,
        )
