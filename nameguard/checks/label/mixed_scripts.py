from label_inspector.models import InspectorResult
from nameguard.models import Rating, Check, GenericCheckResult


RATING = Rating.WARN
MESSAGE_PASS = 'Label is in a single script'
MESSAGE_FAIL = 'Label contains multiple scripts'
MESSAGE_SKIP = 'Label is not normalized'


def check_label(label: InspectorResult) -> GenericCheckResult:
    if label.status != 'normalized':
        return GenericCheckResult(
            check=Check.MIXED_SCRIPTS,
            rating=Rating.SKIP,
            message=MESSAGE_SKIP,
        )
    else:
        passed = label.all_script is not None
        return GenericCheckResult(
            check=Check.MIXED_SCRIPTS,
            rating=Rating.PASS if passed else RATING,
            message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        )
