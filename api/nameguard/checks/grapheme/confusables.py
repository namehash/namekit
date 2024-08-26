from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme

from nameguard.grapheme_normalization import grapheme_is_normalized
from nameguard.models import CheckStatus, Check, GenericCheckResult, GraphemeCheckResult, UNINSPECTED_SKIP_MESSAGE

STATUS = CheckStatus.WARN
# title: Recognizable Characters
TITLE_PASS = 'Character Recognition'
TITLE_FAIL = 'Character Recognition'
TITLE_SKIP = 'Character Recognition'

MESSAGE_PASS = 'Unlikely to be confused'

MESSAGE_FAIL = 'May be confusable'

MESSAGE_SKIP = 'Confusable checks were skipped'


def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    if not isinstance(grapheme, Grapheme) or not grapheme_is_normalized(grapheme.value):
        return GraphemeCheckResult(
            check=Check.CONFUSABLES,
            status=CheckStatus.SKIP,
            _grapheme_message=MESSAGE_SKIP,
            _label_message=MESSAGE_SKIP,
            _name_message=MESSAGE_SKIP,
            _title=TITLE_SKIP,
        )

    passed = len(grapheme.confusables_other) == 0 and (
        grapheme.confusables_canonical is None or grapheme.confusables_canonical == grapheme.value
    )
    return GraphemeCheckResult(
        check=Check.CONFUSABLES,
        status=CheckStatus.PASS if passed else STATUS,
        _grapheme_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _label_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _name_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _title=TITLE_PASS if passed else TITLE_FAIL,
    )


UNINSPECTED_SKIP_CHECK_RESULT = GraphemeCheckResult(
    check=Check.CONFUSABLES,
    status=CheckStatus.SKIP,
    _grapheme_message=UNINSPECTED_SKIP_MESSAGE,
    _label_message=UNINSPECTED_SKIP_MESSAGE,
    _name_message=UNINSPECTED_SKIP_MESSAGE,
    _title=TITLE_SKIP,
)
