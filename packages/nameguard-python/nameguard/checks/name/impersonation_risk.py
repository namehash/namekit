from typing import Optional
from nameguard.models import CheckStatus, Check, GenericCheckResult, NameCheckResult, UNINSPECTED_SKIP_MESSAGE
from nameguard.context import endpoint_name
from nameguard.endpoints import Endpoints
from label_inspector.models import InspectorResult


STATUS = CheckStatus.WARN

# title: Canonical Characters
TITLE_PASS = 'Canonicalization'
TITLE_FAIL = 'Canonicalization'
TITLE_SKIP = 'Canonicalization'

MESSAGE_PASS = 'No signs of impersonation'

MESSAGE_FAIL = 'May be an impersonation of `{}`'
MESSAGE_FAIL_EMOJI = 'Emojis used in this name may be visually confused with other similar emojis'
MESSAGE_FAIL_OTHER = 'May receive potential impersonation warnings'

MESSAGE_SKIP_UNK = 'Contains unknown labels and cannot be checked for impersonation risk'
MESSAGE_SKIP_CANON = 'Contains labels with unknown canonical forms and cannot be checked for impersonation risk'


def check_name(labels: list[Optional[InspectorResult]]) -> GenericCheckResult:
    if None in labels:
        return NameCheckResult(
            check=Check.IMPERSONATION_RISK,
            status=CheckStatus.SKIP,
            _name_message=MESSAGE_SKIP_UNK,
            _title=TITLE_SKIP,
        )
    canonicals = [label.normalized_canonical_label for label in labels]
    if None in canonicals:
        return NameCheckResult(
            check=Check.IMPERSONATION_RISK,
            status=CheckStatus.SKIP,
            _name_message=MESSAGE_SKIP_CANON,
            _title=TITLE_SKIP,
        )
    name = '.'.join(label.label for label in labels)
    canonical = '.'.join(canonicals)
    passed = name == canonical

    if passed:
        message = MESSAGE_PASS
    elif endpoint_name.get() == Endpoints.SECURE_PRIMARY_NAME:
        CHANGED_EMOJI = False
        for label in labels:
            for grapheme in label.graphemes:
                if grapheme.type == 'emoji' and grapheme.confusables_canonical != grapheme.value:
                    CHANGED_EMOJI = True
                    break
        if CHANGED_EMOJI:
            message = MESSAGE_FAIL_EMOJI
        else:
            message = MESSAGE_FAIL.format('.'.join(label.beautiful_canonical_label for label in labels))
    else:
        message = MESSAGE_FAIL_OTHER

    return NameCheckResult(
        check=Check.IMPERSONATION_RISK,
        status=CheckStatus.PASS if passed else STATUS,
        _name_message=message,
        _title=TITLE_PASS if passed else TITLE_FAIL,
    )


UNINSPECTED_SKIP_CHECK_RESULT = NameCheckResult(
    check=Check.IMPERSONATION_RISK,
    status=CheckStatus.SKIP,
    _name_message=UNINSPECTED_SKIP_MESSAGE,
    _title=TITLE_SKIP,
)
