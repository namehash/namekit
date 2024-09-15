from typing import Optional
from label_inspector.models import InspectorResult as Label
from nameguard.models import CheckStatus, Check, LabelCheckResult, NameCheckResult, UNINSPECTED_SKIP_MESSAGE
from label_inspector.common.punycode import puny_analysis, PunycodeCompatibility

STATUS = CheckStatus.WARN

TITLE_PASS = 'DNS Compatibility'
TITLE_FAIL = 'DNS Compatibility'
TITLE_SKIP = 'DNS Compatibility'

L_MESSAGE_PASS = 'Compatible for use with DNS'
N_MESSAGE_PASS = 'Compatible for use with DNS'

L_MESSAGE_FAIL = 'Incompatible for use with DNS'
N_MESSAGE_FAIL = 'Incompatible for use with DNS'

L_MESSAGE_SKIP = 'This label is unknown'
N_MESSAGE_SKIP = 'This name contains unknown labels'


def check_label(label: Optional[Label]) -> LabelCheckResult:
    if label is None:
        return LabelCheckResult(
            check=Check.PUNYCODE_COMPATIBLE_LABEL,
            status=CheckStatus.SKIP,
            _label_message=L_MESSAGE_SKIP,
            _name_message=N_MESSAGE_SKIP,
            _title=TITLE_SKIP,
        )
    passed = label.punycode_compatibility == 'COMPATIBLE'
    return LabelCheckResult(
        check=Check.PUNYCODE_COMPATIBLE_LABEL,
        status=CheckStatus.PASS if passed else STATUS,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
        _title=TITLE_PASS if passed else TITLE_FAIL,
    )


def check_name(labels: list[Optional[Label]]) -> NameCheckResult:
    if any(label is None for label in labels):
        return NameCheckResult(
            check=Check.PUNYCODE_COMPATIBLE_NAME,
            status=CheckStatus.SKIP,
            _name_message=N_MESSAGE_SKIP,
            _title=TITLE_SKIP,
        )
    labels_passed = all([label.punycode_compatibility == 'COMPATIBLE' for label in labels])
    passed = labels_passed and (
        puny_analysis('.'.join(label.label for label in labels)).compatibility == PunycodeCompatibility.COMPATIBLE
    )
    return NameCheckResult(
        check=Check.PUNYCODE_COMPATIBLE_NAME,
        status=CheckStatus.PASS if passed else STATUS,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
        _title=TITLE_PASS if passed else TITLE_FAIL,
    )


UNINSPECTED_SKIP_CHECK_RESULT = NameCheckResult(
    check=Check.PUNYCODE_COMPATIBLE_NAME,
    status=CheckStatus.SKIP,
    _label_message=UNINSPECTED_SKIP_MESSAGE,
    _name_message=UNINSPECTED_SKIP_MESSAGE,
    _title=TITLE_SKIP,
)
