from enum import Enum


class CheckRating(Enum):
    GREEN = 0
    YELLOW = 1
    RED = 2


class NameGuardCheck:
    def __init__(self, labels_analysis: list[dict]):
        self.passed = all(
            self.check_label(label_analysis)
            for label_analysis in labels_analysis)
        self.rating = CheckRating.GREEN if self.passed else self.rating
        self.severity = 0 if self.passed else self.severity
        self.message = self.message_pass if self.passed else self.message_fail

    def __repr__(self):
        return f'{self.__class__.__name__}({self.rating.name})'


class CheckInvisible(NameGuardCheck):
    rating = CheckRating.RED
    severity = 2
    message_pass = 'Name has no invisible characters'
    message_fail = 'Name contains invisible characters'

    @staticmethod
    def check_label(label_analysis: dict) -> bool:
        if label_analysis['status'] == 'normalized':
            return all(
                grapheme['type'] != 'invisible'
                for grapheme in label_analysis['graphemes'])
        else:
            return True


class CheckENSUnsupported(NameGuardCheck):
    rating = CheckRating.RED
    severity = 3
    message_pass = 'Name is supported on ENS.domains'
    message_fail = 'Name contains characters not supported on ENS.domains'

    @staticmethod
    def check_label(label_analysis: dict) -> bool:
        raise NotImplementedError()


class CheckENSNormalized(NameGuardCheck):
    rating = CheckRating.RED
    severity = 4
    message_pass = 'Name is normalized according to ENSIP-15'
    message_fail = 'Name is not normalized according to ENSIP-15'

    @staticmethod
    def check_label(label_analysis: dict) -> bool:
        return label_analysis['status'] == 'normalized'


class CheckConfusables(NameGuardCheck):
    rating = CheckRating.YELLOW
    severity = 5
    message_pass = 'Name does not contain confusable characters'
    message_fail = 'Name contains characters that may be confusable'

    @staticmethod
    def check_label(label_analysis: dict) -> bool:
        if label_analysis['status'] == 'normalized':
            return label_analysis['confusable_count'] == 0
        else:
            return True


class CheckTypingDifficulty(NameGuardCheck):
    rating = CheckRating.YELLOW
    severity = 6
    message_pass = 'Name is broadly accessible to type'
    message_fail = 'Name contains characters that may be difficult to type on some devices'

    @staticmethod
    def check_label(label_analysis: dict) -> bool:
        if label_analysis['status'] == 'normalized':
            return all(
                grapheme['type'] in (
                    'simple_letter',
                    'simple_number',
                    'hyphen',
                    'dollarsign',
                    'underscore',
                ) for grapheme in label_analysis['graphemes'])
        else:
            return True


class CheckMixedScripts(NameGuardCheck):
    rating = CheckRating.YELLOW
    severity = 7
    message_pass = 'Name is in a single script'
    message_fail = 'Name contains multiple scripts'

    @staticmethod
    def check_label(label_analysis: dict) -> bool:
        if label_analysis['status'] == 'normalized':
            return label_analysis['all_script'] is not None
        else:
            return True
