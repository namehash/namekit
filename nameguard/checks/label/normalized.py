from label_inspector.models import InspectorResult
from nameguard.models import Rating, Check, GenericCheckResult


RATING = Rating.ALERT
MESSAGE_PASS = 'Label is normalized according to ENSIP-15'
MESSAGE_FAIL = 'Label is not normalized according to ENSIP-15'


def check_label(label: InspectorResult) -> GenericCheckResult:
    passed = label.status == 'normalized'
    return GenericCheckResult(
        check=Check.NORMALIZED,
        rating=Rating.PASS if passed else RATING,
        message=MESSAGE_PASS if passed else MESSAGE_FAIL,
    )
