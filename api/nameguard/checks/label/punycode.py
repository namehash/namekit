from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult, LabelCheckResult


STATUS = CheckStatus.WARN

#title: DNS Compatible Label
TITLE_PASS = 'DNS Compatible Label'
TITLE_FAIL = 'DNS Incompatible Label'
TITLE_SKIP = 'Unknown DNS Label Compatibility'

L_MESSAGE_PASS = 'Compatible for use with DNS'
N_MESSAGE_PASS = 'Compatible for use with DNS'

L_MESSAGE_FAIL = 'Incompatible for use with DNS'
N_MESSAGE_FAIL = 'Incompatible for use with DNS'

L_MESSAGE_SKIP = 'This label is unknown'
N_MESSAGE_SKIP = 'This name contains unknown labels'


def check_label(label: Optional[InspectorResult]) -> GenericCheckResult:
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
