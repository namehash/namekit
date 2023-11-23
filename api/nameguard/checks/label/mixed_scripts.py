from typing import Optional
from label_inspector.models import InspectorResult
from nameguard.models import CheckStatus, Check, GenericCheckResult, LabelCheckResult


# TODO: Should check if the *name* contains mixed scripts, not all labels


STATUS = CheckStatus.WARN

L_MESSAGE_PASS =  'Written in a single script'
N_MESSAGE_PASS =  'No labels in this name contain mixed scripts'

L_MESSAGE_FAIL =  'Written in multiple scripts'
N_MESSAGE_FAIL =  'This name contains labels that have mixed scripts'

L_MESSAGE_SKIP =  'This label is unknown'
N_MESSAGE_SKIP =  'This name contains unknown labels'


def check_label(label: Optional[InspectorResult]) -> GenericCheckResult:
    if label is None:
        return LabelCheckResult(
            check=Check.MIXED_SCRIPTS,
            status=CheckStatus.SKIP,
            _label_message=L_MESSAGE_SKIP,
            _name_message=N_MESSAGE_SKIP,
        )
    passed = label.all_script is not None or label.label == ''
    return LabelCheckResult(
        check=Check.MIXED_SCRIPTS,
        status=CheckStatus.PASS if passed else STATUS,
        _label_message=L_MESSAGE_PASS if passed else L_MESSAGE_FAIL,
        _name_message=N_MESSAGE_PASS if passed else N_MESSAGE_FAIL,
    )
