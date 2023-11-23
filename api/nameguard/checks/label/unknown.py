from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult, LabelCheckResult


STATUS = CheckStatus.ALERT

L_MESSAGE_PASS =  'This label is known'
N_MESSAGE_PASS =  'This name is known'

L_MESSAGE_FAIL =  'This label is unknown'
N_MESSAGE_FAIL =  'This name contains unknown labels'


def check_label(label: Optional[InspectorResult]) -> GenericCheckResult:
    passed = label is not None
    return LabelCheckResult(
        check=Check.UNKNOWN_LABEL,
        status=CheckStatus.PASS if passed else STATUS,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )
