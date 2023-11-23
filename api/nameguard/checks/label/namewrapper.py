from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult, LabelCheckResult


STATUS = CheckStatus.WARN

L_MESSAGE_PASS =  'This label is NameWrapper compatible'
N_MESSAGE_PASS =  'This name is NameWrapper compatible'

L_MESSAGE_FAIL =  'This label is not NameWrapper compatible'
N_MESSAGE_FAIL =  'This name is not NameWrapper compatible'

L_MESSAGE_SKIP =  'This label is unknown'
N_MESSAGE_SKIP =  'This name contains unknown labels'

WRAPPED_MAX_BYTES = 255


def check_label(label: Optional[InspectorResult]) -> GenericCheckResult:
    if label is None:
        return LabelCheckResult(
            check=Check.NAMEWRAPPER_COMPATIBLE,
            status=CheckStatus.SKIP,
            _label_message=L_MESSAGE_SKIP,
            _name_message=N_MESSAGE_SKIP,
        )
    try:
        wrapped = label.label.encode('utf-8')
        passed = len(wrapped) <= WRAPPED_MAX_BYTES
    except UnicodeEncodeError:
        passed = False
    return LabelCheckResult(
        check=Check.NAMEWRAPPER_COMPATIBLE,
        status=CheckStatus.PASS if passed else STATUS,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )
