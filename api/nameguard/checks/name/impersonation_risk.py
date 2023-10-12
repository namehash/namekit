from typing import Optional
from nameguard.models import CheckStatus, Check, GenericCheckResult
from nameguard.context import endpoint_name
from label_inspector.models import InspectorResult


STATUS = CheckStatus.WARN
MESSAGE_PASS = 'Name shows no signs of impersonation'
MESSAGE_FAIL = 'Name might be an impersonation of `{}`'
MESSAGE_SKIP_UNK = 'Name contains unknown labels and cannot be checked for impersonation risk'
MESSAGE_SKIP_CANON = 'Name contains labels with unknown canonical forms and cannot be checked for impersonation risk'
MESSAGE_FAIL_OTHER = 'Name may receive potential impersonation warnings'


def check_name(labels: list[Optional[InspectorResult]]) -> GenericCheckResult:
    if None in labels:
        return GenericCheckResult(
            check=Check.IMPERSONATION_RISK,
            status=CheckStatus.SKIP,
            message=MESSAGE_SKIP_UNK,
        )
    canonicals = [label.normalized_canonical_label for label in labels]
    if None in canonicals:
        return GenericCheckResult(
            check=Check.IMPERSONATION_RISK,
            status=CheckStatus.SKIP,
            message=MESSAGE_SKIP_CANON,
        )
    name = '.'.join(label.label for label in labels)
    canonical = '.'.join(canonicals)
    passed = name == canonical

    if passed:
        message = MESSAGE_PASS
    else:
        if endpoint_name.get() == 'primary-name':
            message = MESSAGE_FAIL.format('.'.join(label.beautiful_canonical_label for label in labels))
        else:
            message = MESSAGE_FAIL_OTHER
    
    return GenericCheckResult(
        check=Check.IMPERSONATION_RISK,
        status=CheckStatus.PASS if passed else STATUS,
        message=message,
    )
