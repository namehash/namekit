from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult, LabelCheckResult


STATUS = CheckStatus.ALERT

L_MESSAGE_PASS = 'This label is normalized according to ENSIP-15'
N_MESSAGE_PASS = 'This name is normalized according to ENSIP-15'

L_MESSAGE_FAIL = 'This label is not normalized according to ENSIP-15'
N_MESSAGE_FAIL = 'This name is not normalized according to ENSIP-15'

L_MESSAGE_SKIP = 'This label is unknown'
N_MESSAGE_SKIP = 'This name contains unknown labels'


def check_label(label: Optional[InspectorResult]) -> GenericCheckResult:
    if label is None:
        return LabelCheckResult(
            check=Check.NORMALIZED,
            status=CheckStatus.SKIP,
            _label_message=L_MESSAGE_SKIP,
            _name_message=N_MESSAGE_SKIP,
        )
    passed = label.status == 'normalized' and len(label.label) > 0
    return LabelCheckResult(
        check=Check.NORMALIZED,
        status=CheckStatus.PASS if passed else STATUS,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )
