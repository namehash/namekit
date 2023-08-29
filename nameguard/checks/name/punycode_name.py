from nameguard.models import Rating, Check, GenericCheckResult
from label_inspector.common.punycode import puny_analysis, PunycodeCompatibility
from label_inspector.models import InspectorResult


# TODO: rating/severity
RATING = Rating.YELLOW
SEVERITY = 4
MESSAGE_PASS = 'Name is Punycode compatible'
MESSAGE_FAIL = 'Name is not Punycode compatible'
MESSAGE_SKIP = 'Name is not normalized'


def check_name(labels: list[InspectorResult]) -> GenericCheckResult:
    if not all(label.status == 'normalized' for label in labels):
        return GenericCheckResult(
            check=Check.PUNYCODE_COMPATIBLE_NAME,
            rating=Rating.UNKNOWN,
            severity=0,
            message=MESSAGE_SKIP,
        )
    else:
        result = puny_analysis('.'.join(label.label for label in labels))
        passed = result.compatibility == PunycodeCompatibility.COMPATIBLE
        return GenericCheckResult(
            check=Check.PUNYCODE_COMPATIBLE_NAME,
            rating=Rating.GREEN if passed else RATING,
            severity=0 if passed else SEVERITY,
            message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        )
