from enum import Enum


class Endpoints(str, Enum):
    INSPECT_NAME = 'inspect-name'
    INSPECT_NAMEHASH = 'inspect-namehash'
    INSPECT_LABELHASH = 'inspect-labelhash'
    INSPECT_GRAPHEME = 'inspect-grapheme'
    BULK_INSPECT_NAMES = 'bulk-inspect-names'
    SECURE_PRIMARY_NAME = 'secure-primary-name'
    FAKE_ETH_NAME_CHECK = 'fake-eth-name-check'
