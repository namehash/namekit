from label_inspector.models import InspectorGraphemeWithConfusablesResult as Grapheme
from nameguard.models import CheckStatus, Check, GenericCheckResult, GraphemeCheckResult


STATUS = CheckStatus.WARN

#title: Typing Accessibility
TITLE_PASS = 'Typing Accessibility'
TITLE_FAIL = 'Typing Accessibility'

MESSAGE_PASS = 'Broadly accessible to type'

MESSAGE_FAIL = 'May be difficult to type on some devices'

def check_grapheme(grapheme: Grapheme) -> GenericCheckResult:
    passed = grapheme.type in (
        'simple_letter',
        'simple_number',
        'hyphen',
        'dollarsign',
        'underscore',
    )
    return GraphemeCheckResult(
        check=Check.TYPING_DIFFICULTY,
        status=CheckStatus.PASS if passed else STATUS,
        _grapheme_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _label_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _name_message=MESSAGE_PASS if passed else MESSAGE_FAIL,
        _title=TITLE_PASS if passed else TITLE_FAIL,
    )
