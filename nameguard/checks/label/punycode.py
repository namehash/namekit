from label_inspector.models import InspectorResult
from nameguard.models import Rating, Check, GenericCheckResult


RATING = Rating.WARN
MESSAGE_PASS = 'Label is Punycode compatible'
MESSAGE_FAIL = 'Label is not Punycode compatible'
MESSAGE_SKIP = 'Label is not normalized'


def check_label(label: InspectorResult) -> GenericCheckResult:
    if label.status != 'normalized':
        return GenericCheckResult(
            check=Check.PUNYCODE_COMPATIBLE_LABEL,
            rating=Rating.SKIP,
            message=MESSAGE_SKIP,
        )
    else:
        passed = label.punycode_compatibility == 'COMPATIBLE'
        return GenericCheckResult(
            check=Check.PUNYCODE_COMPATIBLE_LABEL,
            rating=Rating.PASS if passed else RATING,
            message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        )
