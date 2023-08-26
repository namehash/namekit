from label_inspector.models import InspectorResult
from nameguard.models import Rating, CheckName, GenericCheckResult


# TODO: rating/severity
RATING = Rating.YELLOW
SEVERITY = 4
MESSAGE_PASS = 'Label is Punycode compatible'
MESSAGE_FAIL = 'Label is not Punycode compatible'
MESSAGE_SKIP = 'Label is not normalized'


def check_label(label: InspectorResult) -> GenericCheckResult:
    if label.status != 'normalized':
        return GenericCheckResult(
            name=CheckName.PUNYCODE,
            rating=Rating.UNKNOWN,
            severity=0,
            message=MESSAGE_SKIP,
        )
    else:
        passed = label.punycode_compatibility == 'COMPATIBLE'
        return GenericCheckResult(
            name=CheckName.PUNYCODE,
            rating=Rating.GREEN if passed else RATING,
            severity=0 if passed else SEVERITY,
            message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        )
